/*
 * De achtergrond van een postkaart: een koerslijn in groen en rood, en een
 * skyline van Amerikaanse iconen, van de Golden Gate tot het Vrijheidsbeeld, in
 * de kleur van het format. Zelf getekend uit eenvoudige vormen, dus zonder
 * licentievraag.
 *
 * Alleen op postkaarten toegestaan (docs/STYLE_GUIDE.md, "Post cards for X"):
 * op de site blijven een stijgende grafiek en een vijfde ornament verboden. De
 * kaart moet op X iemand laten stoppen met scrollen; licht gehouden, zodat de
 * data altijd het eerste is wat je leest.
 */

/*
 * Van linksonder naar rechtsboven in 48 stappen, met korte golfjes erin: een
 * koers, geen rechte pijl. Vaste punten en geen toeval, zodat elke kaart
 * dezelfde lijn heeft. Elk stuk is groen als het stijgt en rood als het daalt.
 */
const LINE = [
  [0, 547], [33, 517], [67, 535], [100, 497], [133, 507], [167, 495], [200, 462],
  [233, 473], [267, 440], [300, 448], [333, 420], [367, 403], [400, 415], [433, 447],
  [467, 408], [500, 390], [533, 407], [567, 436], [600, 420], [633, 394], [667, 419],
  [700, 359], [733, 383], [767, 349], [800, 315], [833, 291], [867, 288], [900, 320],
  [933, 286], [967, 294], [1000, 298], [1033, 276], [1067, 274], [1100, 231], [1133, 204],
  [1167, 196], [1200, 223], [1233, 215], [1267, 198], [1300, 205], [1333, 195], [1367, 174],
  [1400, 196], [1433, 197], [1467, 158], [1500, 158], [1533, 151], [1567, 169], [1600, 164],
];

export function Backdrop({ color, up, down }: { color: string; up: string; down: string }) {
  return (
    <div style={{ position: "absolute", top: 115, left: 0, width: 1600, height: 625, display: "flex" }}>
      <svg width="1600" height="625" viewBox="0 0 1600 625" style={{ position: "absolute", top: 0, left: 0 }}>
        {LINE.slice(1).map(([x2, y2], i) => {
          const [x1, y1] = LINE[i];
          // Op het scherm loopt y naar beneden, dus een kleinere y is een stijging.
          return (
            <line
              key={x2}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={y2 <= y1 ? up : down}
              strokeOpacity={0.45}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <svg
        width="1600"
        height="230"
        viewBox="0 0 1600 300"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 0, bottom: 0 }}
        fill={color}
        fillOpacity={0.09}
        stroke={color}
        strokeOpacity={0.09}
      >
        {/* Golden Gate: twee pijlers, het dek en de hangende kabel. */}
        <rect x="132" y="60" width="16" height="240" stroke="none" />
        <rect x="412" y="60" width="16" height="240" stroke="none" />
        <rect x="40" y="196" width="480" height="10" stroke="none" />
        <path d="M40,196 Q100,150 140,62 Q280,308 420,62 Q460,150 520,196" fill="none" strokeWidth="5" />

        {/* Space Needle */}
        <polygon points="586,300 614,300 604,150 596,150" stroke="none" />
        <polygon points="560,120 640,120 624,104 576,104" stroke="none" />
        <rect x="597" y="36" width="6" height="70" stroke="none" />

        {/* Gateway Arch */}
        <path d="M690,300 Q770,-120 850,300" fill="none" strokeWidth="14" />

        {/* Manhattan: Chrysler, Empire State, One World Trade en blokken ertussen. */}
        <rect x="880" y="170" width="60" height="130" stroke="none" />
        <rect x="960" y="130" width="60" height="170" stroke="none" />
        <polygon points="964,130 1016,130 990,40" stroke="none" />
        <rect x="1030" y="200" width="50" height="100" stroke="none" />
        <rect x="1100" y="150" width="80" height="150" stroke="none" />
        <rect x="1115" y="100" width="50" height="50" stroke="none" />
        <rect x="1128" y="60" width="24" height="40" stroke="none" />
        <rect x="1137" y="10" width="6" height="50" stroke="none" />
        <polygon points="1190,300 1260,300 1250,110 1200,110" stroke="none" />
        <rect x="1222" y="40" width="6" height="70" stroke="none" />
        <rect x="1270" y="210" width="60" height="90" stroke="none" />

        {/* Vrijheidsbeeld: sokkel, gewaad, hoofd, geheven arm met fakkel. */}
        <polygon points="1430,300 1530,300 1520,240 1440,240" stroke="none" />
        <rect x="1450" y="200" width="60" height="40" stroke="none" />
        <polygon points="1462,200 1498,200 1488,122 1472,122" stroke="none" />
        <circle cx="1480" cy="110" r="11" stroke="none" />
        <polygon points="1486,126 1494,126 1505,62 1497,60" stroke="none" />
        <polygon points="1494,62 1510,62 1502,40" stroke="none" />
      </svg>
    </div>
  );
}
