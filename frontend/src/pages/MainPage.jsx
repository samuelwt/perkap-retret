import { Link } from 'react-router-dom';

/**
 * Landing menu, per mainPageLayout.png: a title and two stacked boxes.
 * "Tabular View" routes to /tabular (the existing checklist, formerly
 * mounted at "/"). "Location View" is a visual placeholder only for
 * now — no route exists yet, so it isn't wired to anything.
 */
export default function MainPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-[24px] leading-[30px] font-bold text-black mb-9">
        Perlengkapan Barang Barang Retret ALIVE 2026
      </h1>

      <div className="flex flex-col gap-5">
        <Link
          to="/tabular"
          className="relative block aspect-[388/298] border border-black bg-[#E0F7E0]"
        >
          <TabularGridOverlay />
          <span className="absolute left-4 bottom-4 text-[24px] leading-[30px] font-normal text-black">
            Tabular View
          </span>
        </Link>

        <div className="relative aspect-[388/298] border border-black bg-[#F7F9BB] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/3_PGI_mainPage.png)` }}
          />
          <span className="absolute left-4 bottom-4 text-[24px] leading-[30px] font-normal text-black">
            Location View
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Recreated in CSS/SVG rather than a bitmap — TabularView.png's contents
 * were just straight grid lines, so this scales cleanly at any box size
 * instead of shipping a fixed-resolution image.
 */
function TabularGridOverlay() {
  const rows = [1, 2, 3, 4, 5];
  const cols = [60, 70, 80, 90];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {rows.map((y) => (
        <line
          key={`row-${y}`}
          x1="0"
          y1={y * (100 / 6)}
          x2="100"
          y2={y * (100 / 6)}
          stroke="#000"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {cols.map((x) => (
        <line
          key={`col-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="100"
          stroke="#000"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
