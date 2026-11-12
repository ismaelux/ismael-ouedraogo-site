import { useEffect, useRef, useState } from "react";
import { Rich } from "./AnalysisBlocks.jsx";

// Visualisations complémentaires des analyses : courbe, pente, barres empilées, points, nuage et tableau.
// Les SVG sont dessinés à la largeur réelle du conteneur pour que les libellés restent lisibles sur téléphone.

const TONE = { a: "var(--indigo)", b: "var(--teal)", c: "var(--amber)", d: "#8C9CDD", e: "var(--plum)", f: "#9AA3B8" };
const ORDER = ["a", "b", "c", "d", "e"];
const loc = (lang) => (lang === "fr" ? "fr-FR" : lang === "zh" ? "zh-CN" : "en-US");
const num = (v, lang, d) => (typeof v === "number" ? v.toLocaleString(loc(lang), d == null ? {} : { maximumFractionDigits: d }) : v);
const withUnit = (s, unit, lang) => (unit ? ((unit === "%" && lang !== "fr") ? `${s}%` : `${s} ${unit}`) : s);

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    set();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// Graduations lisibles entre min et max.
function ticks(min, max, n = 4) {
  const span = max - min || 1;
  const raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || raw;
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

function Frame({ fig, fmt, children, legend, wrapRef }) {
  return (
    <figure className="chart chart2" ref={wrapRef}>
      {fig.title && <figcaption className="chart-title">{fmt(fig.title)}</figcaption>}
      {legend && legend.length > 0 && (
        <div className="chart-legend">
          {legend.map((l, i) => <span key={i}><i style={{ background: TONE[l.tone] || TONE.a }} />{fmt(l.name)}</span>)}
        </div>
      )}
      {children}
      {fig.note && <p className="chart-note"><Rich text={fig.note} fmt={fmt} /></p>}
    </figure>
  );
}

// Série temporelle : x numériques (années, éventuellement décimales), libellés facultatifs, événements annotés.
export function LineChart({ fig, lang, fmt }) {
  const [ref, W] = useWidth();
  const H = W < 480 ? 250 : 290;
  const series = fig.series.map((s, i) => ({ ...s, tone: s.tone || ORDER[i] }));
  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  const lo = fig.yMin ?? Math.min(0, ...all), hi = Math.max(...all) * 1.08;
  const ys = ticks(lo, hi);
  const yMax = ys[ys.length - 1] < hi ? hi : ys[ys.length - 1];
  const left = 12 + 7.4 * Math.max(...ys.map((v) => String(num(v, lang)).length)), right = 14 + 8.2 * Math.max(...series.map((sr) => String(sr.lastLabel ?? num([...sr.values].reverse().find((v) => v != null), lang)).length)), top = 18, bottom = 34;
  const xs = fig.x, x0 = Math.min(...xs), x1 = Math.max(...xs);
  const X = (v) => left + ((v - x0) / (x1 - x0 || 1)) * (W - left - right);
  const Y = (v) => top + (1 - (v - lo) / (yMax - lo || 1)) * (H - top - bottom);
  const xl = fig.xLabels || xs.map(String);
  const every = W < 480 ? Math.ceil(xs.length / 5) : Math.ceil(xs.length / 9);
  return (
    <Frame fig={fig} fmt={fmt} wrapRef={ref} legend={series.length > 1 ? series : null}>
      <svg className="c2-svg" width={W} height={H} role="img" aria-label={fig.title}>
        {ys.map((v) => <g key={v}><line x1={left} x2={W - right} y1={Y(v)} y2={Y(v)} className="c2-grid" /><text x={left - 6} y={Y(v) + 4} textAnchor="end" className="c2-axis">{num(v, lang)}</text></g>)}
        {fig.unit && <text x={left - 6} y={top - 6} textAnchor="end" className="c2-axis">{fmt(fig.unit)}</text>}
        {(fig.events || []).map((e, i) => (
          <g key={i}>
            <line x1={X(e.x)} x2={X(e.x)} y1={top} y2={H - bottom} className="c2-event" />
            <text x={X(e.x) + 4} y={top + 10 + (i % 2) * 14} className="c2-event-l">{fmt(e.label)}</text>
          </g>
        ))}
        {xs.map((v, i) => (i % every === 0 || i === xs.length - 1) && <text key={i} x={X(v)} y={H - bottom + 18} textAnchor="middle" className="c2-axis">{xl[i]}</text>)}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => (v == null ? null : [X(xs[i]), Y(v)])).filter(Boolean);
          const last = s.values.map((v, i) => [v, i]).filter(([v]) => v != null).pop();
          return (
            <g key={si}>
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={TONE[s.tone]} strokeWidth="2.5" strokeLinejoin="round" />
              {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={xs.length > 12 ? 0 : 3.5} fill={TONE[s.tone]} />)}
              {last && <text x={X(xs[last[1]]) + 6} y={Y(last[0]) + 4} className="c2-val" fill={TONE[s.tone]}>{s.lastLabel ?? num(last[0], lang)}</text>}
              {fig.labelAll && s.values.map((v, i) => (v == null || i === last[1]) ? null : <text key={"l" + i} x={X(xs[i])} y={Y(v) - 9} textAnchor="middle" className="c2-val-s">{num(v, lang)}</text>)}
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

// Graphique de pente : deux dates ou deux situations, une ligne par élément.
// Les libellés sont en HTML (retour à la ligne possible) et alignés sur le point de gauche.
export function SlopeChart({ fig, lang, fmt }) {
  const [ref, W] = useWidth();
  const n = fig.items.length;
  const labW = W < 520 ? Math.round(W * 0.36) : Math.min(fig.labelWidth || 220, Math.round(W * 0.36));
  const cw = lang === "zh" ? 13 : 7;
  const lines = (s) => Math.min(3, Math.ceil((String(s).length * cw) / labW));
  const gap = Math.max(18, ...fig.items.map((d) => lines(d.label) * 16 + 4));
  const vals = fig.items.flatMap((d) => [d.a, d.b]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const narrow = W < 560;
  const head = (t) => { const str = fmt(t); const k = str.indexOf(" ("); return narrow && k > 0 ? [str.slice(0, k), str.slice(k + 1)] : [str]; };
  const hA = head(fig.legend[0]), hB = head(fig.legend[1]), hl = Math.max(hA.length, hB.length);
  const top = 26 + hl * 16, bottom = 16, P = Math.max(150, n * gap * 1.3);
  const xa = labW + 64, xb = W - (W < 480 ? 62 : 84);
  const Y = (v) => top + (1 - (v - lo) / (hi - lo || 1)) * P;
  const show = (d, k) => d[`${k}Label`] ?? withUnit(num(d[k], lang), fig.unit, lang);
  const spread = (arr, g) => { const s = arr.map((y, i) => ({ y, i })).sort((p, q) => p.y - q.y); for (let k = 1; k < s.length; k++) if (s[k].y - s[k - 1].y < g) s[k].y = s[k - 1].y + g; const out = []; s.forEach((p) => (out[p.i] = p.y)); return out; };
  const ya = spread(fig.items.map((d) => Y(d.a)), gap), yb = spread(fig.items.map((d) => Y(d.b)), 17);
  const H = Math.max(top + P, ...ya, ...yb) + bottom + 8;
  return (
    <Frame fig={fig} fmt={fmt} wrapRef={ref}>
      <div className="c2-slope" style={{ height: H }}>
        <svg className="c2-svg" width={W} height={H} role="img" aria-label={fig.title}>
          <text x={xa} y={16} textAnchor="middle" className="c2-head">{hA.map((t, k) => <tspan key={k} x={xa} dy={k ? 16 : 0}>{t}</tspan>)}</text>
          <text x={xb} y={16} textAnchor="middle" className="c2-head">{hB.map((t, k) => <tspan key={k} x={xb} dy={k ? 16 : 0}>{t}</tspan>)}</text>
          <line x1={xa} x2={xa} y1={top - 10} y2={H - bottom} className="c2-grid" />
          <line x1={xb} x2={xb} y1={top - 10} y2={H - bottom} className="c2-grid" />
          {fig.items.map((d, i) => {
            const c = d.hi ? TONE.c : TONE[d.tone || "a"];
            return (
              <g key={i}>
                <line x1={xa} y1={Y(d.a)} x2={xb} y2={Y(d.b)} stroke={c} strokeWidth="2.5" />
                <circle cx={xa} cy={Y(d.a)} r="4" fill={c} /><circle cx={xb} cy={Y(d.b)} r="4" fill={c} />
                <text x={xa - 8} y={ya[i] + 4} textAnchor="end" className="c2-val" fill={c}>{show(d, "a")}</text>
                <text x={xb + 8} y={yb[i] + 4} className="c2-val" fill={c}>{show(d, "b")}</text>
              </g>
            );
          })}
        </svg>
        {fig.items.map((d, i) => <span key={i} className="c2-slope-l" style={{ top: ya[i], width: labW }}>{fmt(d.label)}</span>)}
      </div>
    </Frame>
  );
}

// Barres empilées (en valeur ou ramenées à 100 %), en HTML pour la lisibilité.
export function StackedChart({ fig, lang, fmt }) {
  const tones = fig.tones || ORDER;
  const legend = fig.legend.map((name, i) => ({ name, tone: tones[i] }));
  const max = fig.percent ? 100 : Math.max(...fig.items.map((d) => d.values.reduce((a, b) => a + b, 0)));
  return (
    <Frame fig={fig} fmt={fmt} legend={legend}>
      <div className="chart-rows" role="img" aria-label={fig.title}>
        {fig.items.map((d, i) => {
          const tot = d.values.reduce((a, b) => a + b, 0);
          return (
            <div className="crow" key={i} style={{ "--label-w": `${fig.labelWidth || 170}px` }}>
              <span className="crow-label">{fmt(d.label)}</span>
              <div className="c2-stack">
                {d.values.map((v, k) => {
                  const share = fig.percent ? (v / tot) * 100 : (v / max) * 100;
                  const txt = d.labels?.[k] ?? (fig.percent ? withUnit(num(Math.round((v / tot) * 100), lang), "%", lang) : withUnit(num(v, lang), fig.unit, lang));
                  return <span key={k} className="c2-seg" style={{ width: `${share}%`, background: TONE[tones[k]] }} title={`${fig.legend[k]} : ${txt}`}>{share >= 9 ? txt : ""}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

// Diagramme en points : classement sur une échelle commune, avec repère facultatif.
export function DotChart({ fig, lang, fmt }) {
  const vals = fig.items.map((d) => d.value).concat(fig.ref ? [fig.ref.value] : []);
  const lo = fig.min ?? Math.min(0, ...vals), hi = fig.max ?? Math.max(...vals) * 1.05;
  const pos = (v) => `${((v - lo) / (hi - lo || 1)) * 100}%`;
  const show = (d) => d.valueLabel ?? withUnit(num(d.value, lang), fig.unit, lang);
  return (
    <Frame fig={fig} fmt={fmt}>
      <div className="chart-rows c2-dots" role="img" aria-label={fig.title} style={{ "--label-w": `${fig.labelWidth || 190}px` }}>
        {fig.items.map((d, i) => (
          <div className="crow" key={i}>
            <span className="crow-label">{fmt(d.label)}</span>
            <div className="c2-track">
              {fig.ref && <span className="c2-ref" style={{ left: pos(fig.ref.value) }} />}
              <span className="c2-stem" style={{ width: pos(d.value) }} />
              <span className={`c2-dot${d.hi ? " is-hi" : ""}`} style={{ left: pos(d.value) }} />
              <span className="c2-dot-v" style={{ left: pos(d.value) }}>{show(d)}</span>
            </div>
          </div>
        ))}
      </div>
      {fig.ref && <p className="c2-ref-l"><i />{fmt(fig.ref.label)}</p>}
    </Frame>
  );
}

// Nuage de points : relation entre deux variables, un point par pays.
export function ScatterChart({ fig, lang, fmt }) {
  const [ref, W] = useWidth();
  const H = W < 480 ? 280 : 340;
  const left = 52, right = 20, top = 16, bottom = 46;
  const xsv = fig.items.map((d) => d.x), ysv = fig.items.map((d) => d.y);
  const xt = ticks(fig.xMin ?? Math.min(...xsv), fig.xMax ?? Math.max(...xsv)), yt = ticks(fig.yMin ?? Math.min(...ysv), fig.yMax ?? Math.max(...ysv));
  const [xa, xb] = [Math.min(xt[0], ...xsv), Math.max(xt[xt.length - 1], ...xsv)], [ya, yb] = [Math.min(yt[0], ...ysv), Math.max(yt[yt.length - 1], ...ysv)];
  const X = (v) => left + ((v - xa) / (xb - xa || 1)) * (W - left - right);
  const Y = (v) => top + (1 - (v - ya) / (yb - ya || 1)) * (H - top - bottom);
  return (
    <Frame fig={fig} fmt={fmt} wrapRef={ref}>
      <svg className="c2-svg" width={W} height={H} role="img" aria-label={fig.title}>
        {yt.map((v) => <g key={"y" + v}><line x1={left} x2={W - right} y1={Y(v)} y2={Y(v)} className="c2-grid" /><text x={left - 6} y={Y(v) + 4} textAnchor="end" className="c2-axis">{num(v, lang)}</text></g>)}
        {xt.map((v) => <text key={"x" + v} x={X(v)} y={H - bottom + 18} textAnchor="middle" className="c2-axis">{num(v, lang)}</text>)}
        <text x={W - right} y={H - 6} textAnchor="end" className="c2-axis-t">{fmt(fig.xLabel)}</text>
        <text x={left} y={top - 4} className="c2-axis-t">{fmt(fig.yLabel)}</text>
        {fig.items.map((d, i) => (
          <g key={i}>
            <circle cx={X(d.x)} cy={Y(d.y)} r="5" fill={d.hi ? TONE.c : TONE.a} fillOpacity="0.85" />
            {d.label && <text x={X(d.x) + (d.anchor === "end" ? -8 : 8)} y={Y(d.y) + 4} textAnchor={d.anchor === "end" ? "end" : "start"} className="c2-lab-s">{fmt(d.label)}</text>}
          </g>
        ))}
      </svg>
    </Frame>
  );
}

// Tableau compact, quand plusieurs chiffres précis doivent être comparés.
export function TableFig({ fig, fmt }) {
  return (
    <Frame fig={fig} fmt={fmt}>
      <div className="c2-table-wrap">
        <table className="c2-table">
          <thead><tr>{fig.columns.map((c, i) => <th key={i}>{fmt(c)}</th>)}</tr></thead>
          <tbody>{fig.rows.map((r, i) => <tr key={i} className={fig.hiRow === i ? "is-hi" : ""}>{r.map((c, k) => <td key={k}><Rich text={String(c)} fmt={fmt} /></td>)}</tr>)}</tbody>
        </table>
      </div>
    </Frame>
  );
}

export const FIG2 = { line: LineChart, slope: SlopeChart, stacked: StackedChart, dots: DotChart, scatter: ScatterChart, table: TableFig };
