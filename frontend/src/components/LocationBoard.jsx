import {
  DndContext, useDraggable, useDroppable,
  PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';

/**
 * Your spec point 3: place locations around a screen, and let you drag
 * items between them (or fall back to a dropdown — that fallback is
 * BulkActionBar, used elsewhere; this component is the spatial version).
 *
 * Two sensors are configured on purpose:
 *  - PointerSensor handles mouse/trackpad, with a small `distance`
 *    threshold so a plain click/tap doesn't accidentally start a drag.
 *  - TouchSensor handles phones specifically, with a `delay` — you
 *    have to hold briefly before it starts dragging. Without this,
 *    dragging a chip and scrolling the board would constantly conflict
 *    with each other on a touchscreen; the small delay is what lets
 *    the browser tell "you're trying to scroll" apart from "you're
 *    trying to drag this chip."
 *
 * Coordinates (x, y) for each location come from your Config sheet.
 * They're placeholders until Phase 5, when we'll overlay this on your
 * actual floor-plan screenshot and recalibrate them to match.
 */
export default function LocationBoard({ items, locations, onMoveItem, onRemoveItem }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const activeItems = items.filter((item) => !item.item_removed);

  const maxX = Math.max(...locations.map((l) => Number(l.x) || 0), 300) + 160;
  const maxY = Math.max(...locations.map((l) => Number(l.y) || 0), 300) + 120;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return; // dropped somewhere that isn't a valid target — do nothing

    const itemId = Number(active.id);

    if (over.id === 'trash-zone') {
      onRemoveItem(itemId);
    } else {
      onMoveItem(itemId, over.id);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className="relative bg-slate-100 rounded-xl border border-slate-200 overflow-auto"
        style={{ width: '100%', height: '60vh', minHeight: 300 }}
      >
        <div className="relative" style={{ width: maxX, height: maxY }}>
          {locations.map((loc) => (
            <LocationZone
              key={loc.value}
              location={loc}
              items={activeItems.filter((item) => item.location === loc.value)}
            />
          ))}
        </div>
      </div>

      <TrashZone />
    </DndContext>
  );
}

/** A drop target representing one physical location. */
function LocationZone({ location, items }) {
  const { setNodeRef, isOver } = useDroppable({ id: location.value });

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-36 min-h-24 rounded-lg border-2 p-2 ${
        isOver ? 'border-slate-900 bg-slate-50' : 'border-slate-300 bg-white'
      }`}
      style={{ left: location.x || 0, top: location.y || 0 }}
    >
      <p className="text-xs font-semibold text-slate-500 mb-1 truncate">{location.value}</p>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <ItemChip key={item.item_id} item={item} />
        ))}
      </div>
    </div>
  );
}

/** A single draggable item pill. */
function ItemChip({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(item.item_id),
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`text-xs bg-slate-900 text-white px-2 py-1 rounded-full cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      {item.item_name}
    </div>
  );
}

/**
 * Fixed in the corner (not inside the scrollable board) so it's always
 * reachable no matter how far you've scrolled the board around.
 * Whether a given drag is ALLOWED into the trash is decided by the
 * parent's onRemoveItem → Code.gs's removeItem(), which rejects
 * non-'Beli' items server-side. Visually we don't disable dragging
 * items that can't be trashed — dnd-kit doesn't easily support
 * per-target rules mid-drag — but the drop is a no-op with a message
 * if it's rejected, and nothing is ever silently thrown away.
 */
function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-20 right-4 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg z-30 ${
        isOver ? 'bg-red-600 scale-110' : 'bg-red-500'
      } transition-transform`}
      title="Drag a bought item here to remove it"
    >
      🗑️
    </div>
  );
}
