import { useEffect, useRef, useState } from "react";

// Citations qui ouvrent l'accueil, avec une vignette gravée dessinée pour chacune (pas de portraits).
// Les citations sont vérifiées ; les traductions des textes anglais et grecs sont indiquées comme telles.

const Emblem = ({ kind }) => {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 64 64" className="qc-emblem" aria-hidden="true">
      <defs>
        <pattern id={`hatch-${kind}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
        </pattern>
      </defs>
      <circle cx="32" cy="32" r="30" {...common} strokeWidth="1" opacity="0.5" />
      {kind === "column" && (
        <g {...common}>
          <path d="M18 18h28M20 22h24M22 22v24M28 22v24M36 22v24M42 22v24M19 46h26M16 50h32" />
          <path d="M22 22h20v24H22z" fill={`url(#hatch-${kind})`} stroke="none" />
          <path d="M24 14l8-4 8 4" />
        </g>
      )}
      {kind === "scales" && (
        <g {...common}>
          <path d="M32 12v36M22 50h20M16 20h32" />
          <path d="M16 20l-6 14h12zM48 20l-6 14h12z" />
          <path d="M10 34a6 3 0 0 0 12 0M42 34a6 3 0 0 0 12 0" fill={`url(#hatch-${kind})`} />
          <circle cx="32" cy="12" r="2" />
        </g>
      )}
      {kind === "ship" && (
        <g {...common}>
          <path d="M12 42h40l-6 8H18z" fill={`url(#hatch-${kind})`} />
          <path d="M32 12v30M24 14v28M40 16v26" />
          <path d="M33 14c8 4 8 14 0 18M25 16c6 3 6 12 0 16M41 18c5 3 5 10 0 13" />
          <path d="M10 54c4-2 8 2 12 0s8 2 12 0 8 2 12 0 8 2 8 0" />
        </g>
      )}
      {kind === "coins" && (
        <g {...common}>
          <ellipse cx="32" cy="46" rx="14" ry="4" />
          <path d="M18 46v-6M46 46v-6" />
          <ellipse cx="32" cy="40" rx="14" ry="4" fill={`url(#hatch-${kind})`} />
          <path d="M18 40v-6M46 40v-6" />
          <ellipse cx="32" cy="34" rx="14" ry="4" />
          <path d="M20 28l12-12 12 12M23 28v-2M41 28v-2" />
        </g>
      )}
      {kind === "compass" && (
        <g {...common}>
          <circle cx="32" cy="32" r="16" />
          <path d="M32 12l4 16-4 4-4-4zM32 52l-4-16 4-4 4 4z" fill={`url(#hatch-${kind})`} />
          <path d="M12 32l16-4 4 4-4 4zM52 32l-16 4-4-4 4-4z" />
          <circle cx="32" cy="32" r="2" />
        </g>
      )}
    </svg>
  );
};

export default function QuoteCarousel({ quotes, label }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    if (paused || reduce.current) return undefined;
    const id = setTimeout(() => setI((n) => (n + 1) % quotes.length), 8000);
    return () => clearTimeout(id);
  }, [i, paused, quotes.length]);
  return (
    <div className="qc" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="qc-stage" aria-live="polite">
        {quotes.map((x, k) => (
          <figure className={`qc-item ${k === i ? "is-on" : ""}`} key={k} aria-hidden={k !== i}>
            <Emblem kind={x.emblem} />
            <div>
              <blockquote className="qc-quote">{x.text}</blockquote>
              <figcaption className="qc-cite">
                <span className="qc-who">{x.who}</span>
                <span className="qc-work">{x.work}</span>
                {x.note && <span className="qc-note">{x.note}</span>}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
      <div className="qc-dots" role="tablist" aria-label={label}>
        {quotes.map((x, k) => (
          <button key={k} role="tab" aria-selected={k === i} aria-label={x.who} className={k === i ? "is-on" : ""} onClick={() => { setI(k); setPaused(true); }} />
        ))}
      </div>
    </div>
  );
}
