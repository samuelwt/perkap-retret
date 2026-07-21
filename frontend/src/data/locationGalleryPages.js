/**
 * Hardcoded per-page config for the Location View gallery.
 *
 * `xPct`/`yPct` are percentages (0-100) of the image's own width/height,
 * measured from the top-left — not pixels — so markers stay correctly
 * placed at any screen size. To move a marker later: just edit its
 * xPct/yPct. To change what a marker shows: edit its `locations` array
 * (values must match `location` field values from the Config sheet,
 * see google-apps-script/SETUP.md).
 *
 * `width`/`height` are the real pixel dimensions of each image file —
 * used to reserve correct aspect-ratio space before the (large) image
 * finishes loading, avoiding layout shift.
 *
 * Exactly two markers below (bawah-2, rumah-1) are assigned two
 * locations each; every other marker holds exactly one. All positions
 * and location assignments are rough placeholders — fix as needed.
 */
export const GALLERY_PAGES = [
  {
    id: 'pgi',
    title: 'Pondok Remaja PGI',
    image: 'assets/3_PGI.png',
    width: 720,
    height: 440,
    markers: [
      { id: 'pgi-1', xPct: 30, yPct: 40, locations: ['Kamar para cogan'] },
      { id: 'pgi-2', xPct: 65, yPct: 55, locations: ['Aula Ibadah'] },
    ],
  },
  {
    id: 'pgi-bawah',
    title: 'Pondok Remaja PGI - Bawah',
    image: 'assets/4_PGI_Bawah.png',
    width: 720,
    height: 440,
    markers: [
      { id: 'bawah-1', xPct: 25, yPct: 30, locations: ['BBQ Place'] },
      {
        id: 'bawah-2',
        xPct: 50,
        yPct: 55,
        locations: ['Follow The Voice - Odri, Sam', 'Just Draw - Pow'],
      },
      { id: 'bawah-3', xPct: 75, yPct: 70, locations: ['Cup War - Jose, DC'] },
    ],
  },
  {
    id: 'gereja',
    title: 'Gereja',
    image: 'assets/1_GKY_PIK.png',
    width: 720,
    height: 440,
    markers: [
      { id: 'gereja-1', xPct: 50, yPct: 50, locations: ['Tissue - Nath, Odri'] },
    ],
  },
  {
    id: 'rumah-sam',
    title: 'Rumah Sam',
    image: 'assets/2_Rumah_Sam.png',
    width: 720,
    height: 440,
    markers: [
      {
        id: 'rumah-1',
        xPct: 35,
        yPct: 45,
        locations: ['Infinity Race - Neysa, Reyner', 'Battleship - Ray, Jose'],
      },
      { id: 'rumah-2', xPct: 65, yPct: 60, locations: ['Water Relay - Rivano, Reyner'] },
    ],
  },
];
