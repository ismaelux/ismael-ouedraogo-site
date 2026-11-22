import { useEffect, useMemo, useRef, useState } from "react";
import { project } from "./MapFigure.jsx";

// Bandeau cartographique en pied de page : le monde à plat, légèrement incliné et en relief,
// avec les appartenances des États aux principaux blocs régionaux et géopolitiques.
// Appartenances vérifiées au 22 novembre 2026 ; celles déjà présentes dans world-map.js (champ m) sont reprises.

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

  const countries = useMemo(() => {
    if (!data) return [];
    return data.countries.filter((c) => c.id !== "010").map((c) => {
      const extra = Object.entries(IDS).filter(([, ids]) => ids.includes(c.id)).map(([k]) => k);
      return { ...c, all: [...c.m, ...extra.filter((k) => !c.m.includes(k))] };
    });
  }, [data]);

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
            {countries.map((c) => {
              const col = colorOf(c);
              return (
                <path key={c.id + c.en} d={c.d} className={`wb-land ${hover && hover.c === c ? "is-hover" : ""}`}
                  style={col ? { fill: col } : undefined} onMouseMove={onMove(c)} onTouchStart={onMove(c)} />
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
