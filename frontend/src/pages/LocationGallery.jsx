import { useState } from 'react';
import { GALLERY_PAGES } from '../data/locationGalleryPages.js';
import { useInventory } from '../hooks/useInventory.js';
import Modal from '../components/Modal.jsx';

/**
 * Location View gallery: full-bleed photo per venue area, with
 * wraparound left/right navigation and tappable markers that open a
 * modal listing live inventory items at that spot.
 */
export default function LocationGallery() {
  const [pageIndex, setPageIndex] = useState(0);
  const [activeMarker, setActiveMarker] = useState(null);
  const { items } = useInventory(15000);
  const page = GALLERY_PAGES[pageIndex];

  function goPrev() {
    setActiveMarker(null);
    setPageIndex((i) => (i - 1 + GALLERY_PAGES.length) % GALLERY_PAGES.length);
  }
  function goNext() {
    setActiveMarker(null);
    setPageIndex((i) => (i + 1) % GALLERY_PAGES.length);
  }

  const modalItems = activeMarker
    ? items.filter((item) => activeMarker.locations.includes(item.location))
    : [];

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden bg-slate-100"
        style={{ aspectRatio: `${page.height} / ${page.width}` }}
      >
        {/* Source images are landscape; rotating 90deg here (rather than
            pre-rotating the asset files) suits a phone's portrait screen.
            The wrapper's aspect-ratio is swapped (h/w) to match, and the
            img keeps its own natural w/h ratio pre-rotation so nothing
            distorts — it's just centered, scaled to height, and turned. */}
        <img
          src={`${import.meta.env.BASE_URL}${page.image}`}
          alt={page.title}
          width={page.width}
          height={page.height}
          style={{ aspectRatio: `${page.width} / ${page.height}` }}
          className="absolute top-1/2 left-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover"
          loading={pageIndex === 0 ? 'eager' : 'lazy'}
        />

        <span className="absolute right-3 top-3 bg-white text-black text-sm font-medium px-3 py-1.5 rounded-xl shadow z-10 rotate-90">
          {page.title}
        </span>

        <button
          onClick={goPrev}
          aria-label="Previous page"
          className="absolute top-2 left-1/2 -translate-x-1/2 rotate-90 text-5xl font-bold text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] z-10 leading-none px-1"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          aria-label="Next page"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-90 text-5xl font-bold text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] z-10 leading-none px-1"
        >
          ›
        </button>

        {page.markers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => setActiveMarker(marker)}
            aria-label={`Show items at ${marker.locations.join(' & ')}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${marker.xPct}%`, top: `${marker.yPct}%`, width: '19.2px', height: '19.2px' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/appleAssistiveTouch.png`}
              alt=""
              className="w-full h-full opacity-80"
            />
          </button>
        ))}
      </div>

      <Modal
        open={!!activeMarker}
        onClose={() => setActiveMarker(null)}
        title={activeMarker?.locations.join(' & ') ?? ''}
      >
        {modalItems.length === 0 ? (
          <p className="text-slate-500 text-center py-6">No items here yet.</p>
        ) : (
          <ol className="space-y-1">
            {modalItems.map((item, idx) => (
              <li key={item.item_id} className="flex gap-3 py-1 border-b border-slate-100 last:border-0">
                <span className="w-5 shrink-0 text-sm text-slate-400 text-center">{idx + 1}</span>
                <span className="min-w-0 flex-1">{item.item_name}</span>
              </li>
            ))}
          </ol>
        )}
      </Modal>
    </div>
  );
}
