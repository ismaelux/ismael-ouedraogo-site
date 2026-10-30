// Blocs enrichis des analyses : « En bref », graphiques, encadrés « Repères », scénarios et liens.
// Tous les champs sont facultatifs : les analyses plus anciennes s'affichent comme avant.

export const LBL = {
  fr: { nutshell: "En bref", facts: "Repères", most: "Le plus probable", less: "Moins probable", least: "Peu probable", source: "Source" },
  en: { nutshell: "In a nutshell", facts: "Facts & figures", most: "Most likely", less: "Less likely", least: "Least likely", source: "Source" },
  zh: { nutshell: "要点", facts: "数据速览", most: "最可能", less: "可能性较小", least: "可能性最小", source: "来源" },
};

// Texte avec liens au format [texte](https://…).
export function Rich({ text, fmt = (s) => s }) {
  const out = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(fmt(text.slice(last, m.index)));
    out.push(<a key={k++} href={m[2]} target="_blank" rel="noopener noreferrer">{fmt(m[1])}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(fmt(text.slice(last)));
  return <>{out}</>;
}

export const stripLinks = (s) => String(s || "").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1");

export function Nutshell({ items, lang, fmt }) {
  return (
    <aside className="nutshell" aria-label={LBL[lang].nutshell}>
      <p className="box-label">{LBL[lang].nutshell}</p>
      <ul>{items.map((s, i) => <li key={i}><Rich text={s} fmt={fmt} /></li>)}</ul>
    </aside>
  );
}

export function Factbox({ box, lang, fmt }) {
  return (
    <aside className="factbox">
      <p className="box-label">{LBL[lang].facts}</p>
      {box.title && <h3>{fmt(box.title)}</h3>}
      <ul>{box.items.map((s, i) => <li key={i}><Rich text={s} fmt={fmt} /></li>)}</ul>
    </aside>
  );
}

const fmtNum = (v, lang) => (typeof v === "number" ? v.toLocaleString(lang === "fr" ? "fr-FR" : lang === "zh" ? "zh-CN" : "en-US") : v);

// Graphique en barres horizontales (une ou deux séries), en HTML pour rester lisible sur téléphone.
export function Chart({ fig, lang, fmt }) {
  const pairs = fig.kind === "pairs";
  const items = fig.items;
  const max = Math.max(...items.flatMap((d) => (pairs ? [d.a, d.b] : [d.value])).map((v) => Math.abs(v || 0)), 1);
  const pct = (v) => `calc((100% - 130px) * ${Math.max(0.015, Math.abs(v) / max).toFixed(4)})`;
  const show = (d, key) => d[`${key}Label`] ?? (fmtNum(d[key], lang) + (fig.unit ? ((fig.unit === "%" && lang !== "fr") ? "%" : ` ${fig.unit}`) : ""));
  const Bar = ({ v, cls, label }) => (
    <div className="cbar">
      <span className={`cbar-fill ${cls}`} style={{ width: pct(v) }} />
      <span className="cbar-val">{label}</span>
    </div>
  );
  return (
    <figure className="chart" style={{ "--label-w": `${fig.labelWidth || 190}px` }}>
      {fig.title && <figcaption className="chart-title">{fmt(fig.title)}</figcaption>}
      {pairs && fig.legend && (
        <div className="chart-legend">
          <span><i className="sw-a" />{fmt(fig.legend[0])}</span>
          <span><i className="sw-b" />{fmt(fig.legend[1])}</span>
        </div>
      )}
      <div className="chart-rows" role="img" aria-label={fig.title}>
        {items.map((d, i) => (
          <div className="crow" key={i}>
            <span className="crow-label">{d.label}</span>
            <div className="crow-bars">
              {pairs ? <>
                <Bar v={d.a} cls="bar-a" label={show(d, "a")} />
                <Bar v={d.b} cls="bar-b" label={show(d, "b")} />
              </> : <Bar v={d.value} cls={d.hi ? "bar-hi" : "bar-a"} label={show(d, "value")} />}
            </div>
          </div>
        ))}
      </div>
      {fig.note && <p className="chart-note"><Rich text={fig.note} fmt={fmt} /></p>}
    </figure>
  );
}

export function Scenarios({ items, lang, fmt }) {
  return (
    <div className="scenarios">
      {items.map((s, i) => (
        <div key={i} className={`scenario sc-${s.level}`}>
          <h3><span className="sc-level">{LBL[lang][s.level]}</span>{fmt(s.title)}</h3>
          {(Array.isArray(s.text) ? s.text : [s.text]).map((p, j) => <p key={j}><Rich text={p} fmt={fmt} /></p>)}
        </div>
      ))}
    </div>
  );
}
