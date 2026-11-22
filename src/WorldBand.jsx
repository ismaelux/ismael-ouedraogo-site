import { useEffect, useMemo, useRef, useState } from "react";
import { project } from "./MapFigure.jsx";

// Bandeau cartographique en pied de page : le monde à plat et en relief, avec les appartenances
// des États aux principaux blocs régionaux et géopolitiques.
// Appartenances vérifiées au 22 novembre 2026 ; celles déjà présentes dans world-map.js (champ m) sont reprises.
// Le fond Natural Earth 110m ne dessine pas 28 États membres de l'ONU trop petits à cette échelle,
// ni le Saint-Siège : ils sont représentés par un point placé sur leur capitale.

const IDS = {
  ecowas: ["204", "132", "384", "270", "288", "324", "624", "430", "566", "686", "694", "768"],
  uemoa: ["204", "854", "384", "624", "466", "562", "686", "768"],
  cemac: ["120", "140", "148", "178", "226", "266"],
  sadc: ["024", "072", "174", "180", "748", "426", "450", "454", "480", "508", "516", "690", "710", "834", "894", "716"],
  eac: ["108", "180", "404", "646", "706", "728", "834", "800"],
  uma: ["012", "434", "478", "504", "788"],
  efta: ["352", "438", "578", "756"],
  asean: ["096", "116", "360", "418", "458", "104", "608", "702", "764", "704", "626"],
  gcc: ["682", "784", "634", "414", "048", "512"],
  usmca: ["840", "124", "484"],
  mercosur: ["032", "076", "600", "858", "068"],
};

// [code ISO numérique, nom fr, nom en, nom zh, longitude, latitude, appartenances hors listes IDS]
const SMALL = [
  ["132", "Cabo Verde", "Cabo Verde", "佛得角", -23.6, 15.5],
  ["678", "Sao Tomé-et-Principe", "São Tomé and Príncipe", "圣多美和普林西比", 6.7, 0.3],
  ["174", "Comores", "Comoros", "科摩罗", 43.3, -11.7],
  ["480", "Maurice", "Mauritius", "毛里求斯", 57.55, -20.25],
  ["690", "Seychelles", "Seychelles", "塞舌尔", 55.45, -4.6],
  ["462", "Maldives", "Maldives", "马尔代夫", 73.5, 3.2],
  ["048", "Bahreïn", "Bahrain", "巴林", 50.55, 26.05],
  ["702", "Singapour", "Singapore", "新加坡", 103.82, 1.35, ["rcep"]],
  ["470", "Malte", "Malta", "马耳他", 14.45, 35.9, ["eu"]],
  ["438", "Liechtenstein", "Liechtenstein", "列支敦士登", 9.55, 47.16],
  ["492", "Monaco", "Monaco", "摩纳哥", 7.42, 43.74],
  ["020", "Andorre", "Andorra", "安道尔", 1.55, 42.55],
  ["674", "Saint-Marin", "San Marino", "圣马力诺", 12.45, 43.94],
  ["336", "Saint-Siège", "Holy See", "教廷", 12.45, 41.9],
  ["028", "Antigua-et-Barbuda", "Antigua and Barbuda", "安提瓜和巴布达", -61.8, 17.08],
  ["659", "Saint-Christophe-et-Niévès", "Saint Kitts and Nevis", "圣基茨和尼维斯", -62.75, 17.33],
  ["212", "Dominique", "Dominica", "多米尼克", -61.36, 15.42],
  ["662", "Sainte-Lucie", "Saint Lucia", "圣卢西亚", -60.97, 13.9],
  ["670", "Saint-Vincent-et-les-Grenadines", "Saint Vincent and the Grenadines", "圣文森特和格林纳丁斯", -61.2, 13.25],
  ["052", "Barbade", "Barbados", "巴巴多斯", -59.55, 13.15],
  ["308", "Grenade", "Grenada", "格林纳达", -61.68, 12.12],
  ["585", "Palaos", "Palau", "帕劳", 134.5, 7.5],
  ["583", "Micronésie", "Micronesia", "密克罗尼西亚联邦", 158.2, 6.9],
  ["584", "Îles Marshall", "Marshall Islands", "马绍尔群岛", 171.2, 7.1],
  ["520", "Nauru", "Nauru", "瑙鲁", 166.93, -0.52],
  ["296", "Kiribati", "Kiribati", "基里巴斯", 173.0, 1.45],
  ["798", "Tuvalu", "Tuvalu", "图瓦卢", 179.2, -8.5],
  ["882", "Samoa", "Samoa", "萨摩亚", -172.1, -13.75],
  ["776", "Tonga", "Tonga", "汤加", -175.2, -21.2],
];

// Territoires sans code ISO dans le fond de carte : rattachés à l'État reconnu par l'ONU,
// sauf le Kosovo, nommé tel quel.
const KOSOVO = { fr: "Kosovo", en: "Kosovo", zh: "科索沃" };
const ATTACH = { "N. Cyprus": "196", Somaliland: "706" };

// Noms des océans, placés en mer [clé, longitude, latitude]
const OCEANS = [["atlantic", -41, 27], ["pacific", -134, 4], ["pacific", 151, 23], ["indian", 79, -21], ["arctic", -150, 75.5], ["southern", 28, -53]];

export const BLOCS = {
  africa: [["ecowas", "#3048B0"], ["uemoa", "#177A72"], ["aes", "#C2410C"], ["cemac", "#8A3D6B"], ["sadc", "#B8730E"], ["eac", "#4F7CC2"], ["uma", "#6B7F3A"]],
  europe: [["eu", "#3048B0"], ["nato", "#177A72"], ["efta", "#8C9CDD"]],
  asia: [["asean", "#B8730E"], ["sco", "#8A3D6B"], ["rcep", "#C25A7C"], ["gcc", "#6B7F3A"], ["makkah", "#1F4E79"]],
  americas: [["usmca", "#3048B0"], ["mercosur", "#177A72"]],
  world: [["g7", "#3048B0"], ["brics", "#B8730E"], ["bricsp", "#E2B76A"]],
};

export default function WorldBand({ t, lang }) {
  const [data, setData] = useState(null);
  const [region, setRegion] = useState("africa");
  const [bloc, setBloc] = useState("ecowas");
  const [hover, setHover] = useState(null);
  const wrap = useRef(null);
  useEffect(() => { import("./world-map.js").then((m) => setData(m.WORLD)); }, []);

  const withBlocs = (c) => {
    const extra = Object.entries(IDS).filter(([, ids]) => ids.includes(c.id)).map(([k]) => k);
    return { ...c, all: [...c.m, ...extra.filter((k) => !c.m.includes(k))] };
  };
  const countries = useMemo(() => {
    if (!data) return [];
    const byId = Object.fromEntries(data.countries.map((c) => [c.id, c]));
    return data.countries.filter((c) => c.id !== "010").map((c) => {
      if (ATTACH[c.en]) { const host = byId[ATTACH[c.en]]; return withBlocs({ ...host, d: c.d }); }
      if (c.en === "Kosovo") return withBlocs({ ...c, ...KOSOVO });
      return withBlocs(c);
    });
  }, [data]);
  const small = useMemo(() => SMALL.map(([id, fr, en, zh, lon, lat, m = []]) => {
    const [x, y] = project(lon, lat);
    return withBlocs({ id, fr, en, zh, m, x, y });
  }), []);

  if (!data) return <div className="wb-band" style={{ minHeight: 320 }} />;
  const top = project(0, 84)[1], bottom = project(0, -58)[1];
  const vb = `0 ${top} ${data.width} ${bottom - top}`;
  const shown = BLOCS[region].filter(([k]) => k === bloc);
  const colorOf = (c) => { const hit = shown.find(([k]) => c.all.includes(k)); return hit ? hit[1] : null; };
  const onMove = (c) => (e) => {
    const box = wrap.current.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    setHover({ c, x: pt.clientX - box.left, y: pt.clientY - box.top, w: box.width, h: box.height });
  };
  const name = (k) => t.blocs[k] || k;

  return (
    <section className="wb-band" aria-label={t.mapBandTitle}>
      <div className="wrap wb-head">
        <div>
          <h2 className="wb-title">{t.mapBandTitle}</h2>
          <p className="wb-hint">{t.mapBandHint}</p>
        </div>
        <div className="wb-controls">
          <div className="wb-regions" role="tablist">
            {Object.keys(BLOCS).map((r) => (
              <button key={r} role="tab" aria-selected={region === r} className={region === r ? "is-on" : ""} onClick={() => { setRegion(r); setBloc(BLOCS[r][0][0]); }}>{t.regions[r]}</button>
            ))}
          </div>
          <div className="wb-blocs">
            {BLOCS[region].map(([k, col]) => (
              <button key={k} aria-pressed={bloc === k} onClick={() => setBloc(k)}><i style={{ background: col }} />{name(k)}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="wb-stage" ref={wrap} onMouseLeave={() => setHover(null)}>
        <svg className="wb-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label={t.mapBandTitle}>
          <defs>
            <linearGradient id="wb-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--wb-sea-top)" />
              <stop offset="1" stopColor="var(--wb-sea-bottom)" />
            </linearGradient>
            <filter id="wb-relief" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="2.2" specularConstant="0.55" specularExponent="18" lightingColor="#ffffff" result="spec">
                <feDistantLight azimuth="235" elevation="38" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
              <feOffset in="SourceAlpha" dx="0.6" dy="1.2" result="off" />
              <feGaussianBlur in="off" stdDeviation="0.9" result="shadow" />
              <feComponentTransfer in="shadow" result="shadowSoft"><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
              <feMerge>
                <feMergeNode in="shadowSoft" />
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="specIn" />
              </feMerge>
            </filter>
          </defs>
          <rect x="0" y={top} width={data.width} height={bottom - top} fill="url(#wb-sea)" />
          <g filter="url(#wb-relief)">
            {countries.map((c, i) => {
              const col = colorOf(c);
              return (
                <path key={i} d={c.d} className={`wb-land ${hover && hover.c.id === c.id && hover.c.en === c.en ? "is-hover" : ""}`}
                  style={col ? { fill: col } : undefined} onMouseMove={onMove(c)} onTouchStart={onMove(c)} />
              );
            })}
          </g>
          <g className="wb-oceans" aria-hidden="true">
            {OCEANS.map(([k, lon, lat], i) => {
              const [x, y] = project(lon, lat);
              return (
                <g key={k + i}>
                  <text className="wb-ocean-full" x={x} y={y} textAnchor="middle">{t.oceans[k]}</text>
                  <text className="wb-ocean-short" x={x} y={y} textAnchor="middle">{t.oceansShort[k]}</text>
                </g>
              );
            })}
          </g>
          <g className="wb-small">
            {small.map((c) => {
              const col = colorOf(c);
              const on = hover && hover.c.id === c.id;
              return (
                <g key={c.id} onMouseMove={onMove(c)} onTouchStart={onMove(c)}>
                  <circle cx={c.x} cy={c.y} r="4.2" className="wb-hit" />
                  <circle cx={c.x} cy={c.y} r={on ? 2.6 : 1.9} className="wb-dot" style={col ? { fill: col } : undefined} />
                </g>
              );
            })}
          </g>
        </svg>
        {hover && (
          <div className={`tip wb-tip ${hover.y < 110 ? "is-below" : ""}`} style={{ left: Math.max(130, Math.min(hover.x, hover.w - 130)), top: hover.y }}>
            <strong>{hover.c[lang] || hover.c.en}</strong>
            <span>{hover.c.all.length ? hover.c.all.filter((k) => t.blocs[k]).map(name).join(" · ") : t.noBloc}</span>
          </div>
        )}
      </div>
      <p className="wrap wb-note">{t.mapBandNote}</p>
    </section>
  );
}
