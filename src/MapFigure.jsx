import { useEffect, useMemo, useRef, useState } from "react";
import { WORLD } from "./world-map.js";
import { Rich } from "./AnalysisBlocks.jsx";

// Cartes thématiques des analyses, dessinées à partir du fond Natural Earth du site.
// fig = { kind: "map", region, title, groups: [{ ids, label, tone }], points: [{ name, lon, lat }],
//         links: [{ from: [lon, lat], to: [lon, lat], tone }], note }

// Projection Natural Earth calée sur le fond de carte du site (960 x 470).
const K = 176.305, TX = 480.089, TY = 270.908;
export function project(lon, lat) {
  const l = (lon * Math.PI) / 180, p = (lat * Math.PI) / 180, p2 = p * p, p4 = p2 * p2;
  const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
  const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
  return [K * x + TX, -K * y + TY];
}

// Cadrages prédéfinis : [ouest, sud, est, nord] en degrés.
const REGIONS = {
  world: [-170, -58, 180, 84],
  africa: [-20, -36, 55, 38],
  westafrica: [-18.5, 3.5, 16.5, 25.5],
  sahel: [-18.5, 8, 24, 25],
  "africa-mideast": [-20, -36, 66, 42],
  "africa-asia": [-20, -36, 148, 56],
  "africa-europe": [-25, -36, 45, 62],
  "atlantic": [-100, -36, 60, 60],
};

const TONES = { a: "var(--indigo)", b: "var(--teal)", c: "var(--amber)", d: "#8C9CDD", e: "var(--plum)", hi: "var(--amber)" };

const LBL = {
  fr: { hint: "Survolez un pays pour afficher son nom." },
  en: { hint: "Hover over a country to see its name." },
  zh: { hint: "将鼠标悬停在国家上可显示名称。" },
};

export default function MapFigure({ fig, lang, fmt }) {
  const wrap = useRef(null);
  const [hover, setHover] = useState(null);
  const [scale, setScale] = useState(1);
  // Sur petit écran, on grossit étiquettes et repères pour qu'ils restent lisibles.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1.5, Math.max(1, 640 / e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [w, s, e, n] = Array.isArray(fig.region) ? fig.region : REGIONS[fig.region || "africa"];
  const box = useMemo(() => {
    const pts = [];
    for (let lo = w; lo <= e; lo += (e - w) / 8) for (const la of [s, (s + n) / 2, n]) pts.push(project(lo, la));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), y0 = Math.min(...ys), x1 = Math.max(...xs), y1 = Math.max(...ys);
    return [x0, y0, x1 - x0, y1 - y0];
  }, [w, s, e, n]);
  const tone = {};
  (fig.groups || []).forEach((g) => g.ids.forEach((id) => { tone[String(id).padStart(3, "0")] = TONES[g.tone || "a"]; }));
  const sw = box[2] / 640; // épaisseur relative des traits
  const tw = sw * scale; // taille relative du texte et des repères
  const onMove = (c) => (ev) => {
    const r = wrap.current.getBoundingClientRect();
    const pt = ev.touches ? ev.touches[0] : ev;
    setHover({ name: c[lang] || c.en, x: pt.clientX - r.left, y: pt.clientY - r.top });
  };
  return (
    <figure className="chart mapfig">
      {fig.title && <figcaption className="chart-title">{fmt(fig.title)}</figcaption>}
      <div className="mapfig-wrap" ref={wrap} onMouseLeave={() => setHover(null)}>
        <svg viewBox={box.join(" ")} role="img" aria-label={fig.title}>
          <defs>
            <marker id="mf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)" />
            </marker>
          </defs>
          {WORLD.countries.map((c, i) => (
            <path key={i} d={c.d} fill={tone[c.id] || "var(--land)"} stroke="var(--land-line)" strokeWidth={0.6 * sw}
              className={tone[c.id] ? "mf-on" : "mf-off"} onMouseMove={onMove(c)} onTouchStart={onMove(c)} />
          ))}
          {(fig.links || []).map((l, i) => {
            const [x1, y1] = project(...l.from), [x2, y2] = project(...l.to);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.18;
            return <path key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={TONES[l.tone || "c"]} strokeWidth={1.8 * sw} strokeDasharray={`${4 * sw} ${3 * sw}`} markerEnd="url(#mf-arrow)" />;
          })}
          {(fig.points || []).map((p, i) => {
            const [x, y] = project(p.lon, p.lat);
            const anchor = p.anchor || "start";
            const dx = anchor === "end" ? -7 * sw : anchor === "middle" ? 0 : 7 * sw;
            return (
              <g key={i} pointerEvents="none">
                <circle cx={x} cy={y} r={3.6 * tw} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.4 * tw} />
                <text x={x + dx * scale} y={y + (p.dy ?? 4) * tw} textAnchor={anchor} fontSize={12 * tw} className="mf-label" strokeWidth={3 * tw}>{p.name}</text>
              </g>
            );
          })}
        </svg>
        {hover && <div className="tip" style={{ left: hover.x, top: hover.y }}><strong>{hover.name}</strong></div>}
      </div>
      {(fig.groups || []).length > 0 && (
        <div className="chart-legend mf-legend">
          {fig.groups.filter((g) => g.label).map((g, i) => <span key={i}><i style={{ background: TONES[g.tone || "a"] }} />{fmt(g.label)}</span>)}
        </div>
      )}
      <p className="chart-note">{LBL[lang]?.hint} {fig.note && <Rich text={fig.note} fmt={fmt} />}</p>
    </figure>
  );
}
