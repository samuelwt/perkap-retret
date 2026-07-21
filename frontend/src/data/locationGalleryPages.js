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
    width: 440,
    height: 720,
    markers: [
      { id: 'pgi-1', xPct: 85, yPct: 62, locations: ['Aula Ibadah', 'Follow The Voice - Odri, Sam'] },
      { id: 'pgi-2', xPct: 89, yPct: 67, locations: ['BBQ Place', 'Cup War - Jose, DC']},
      { id: 'pgi-3', xPct: 80, yPct: 68, locations: ['Kamar para cogan']},
      { id: 'pgi-4', xPct: 50, yPct: 60, locations: ['Just Draw - Pow']},
      { id: 'pgi-5', xPct: 34, yPct: 89, locations: ['Tissue - Nath, Odri']}
    ],
  },
  {
    id: 'pgi-bawah',
    title: 'Pondok Remaja PGI - Bawah',
    image: 'assets/4_PGI_Bawah.png',
    width: 440,
    height: 720,
    markers: [
      { id: 'bawah-1', xPct: 65, yPct: 27, locations: ['Infinity Race - Neysa, Reyner'] },
      {
        id: 'bawah-2',
        xPct: 25,
        yPct: 60,
        locations: ['Battleship - Ray, Jose'],
      },
      { id: 'bawah-3', xPct: 35, yPct: 85, locations: ['Water Relay - Rivano, Reyner'] },
    ],
  },
  {
    id: 'gereja',
    title: 'Gereja',
    image: 'assets/1_GKY_PIK.png',
    width: 440,
    height: 720,
    markers: [
      { id: 'gereja-1', xPct: 65, yPct: 40, locations: ['Gereja'] },
    ],
  },
  {
    id: 'rumah-sam',
    title: 'Rumah Sam',
    image: 'assets/2_Rumah_Sam.png',
    width: 440,
    height: 720,
    markers: [
      {
        id: 'rumah-1',
        xPct: 55,
        yPct: 55,
        locations: ['Rumah Sam'],
      },
    ],
  },
];
