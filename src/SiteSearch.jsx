import { useEffect, useMemo, useRef, useState } from "react";

// Recherche dans le contenu du site (analyses, travaux, enseignement, parcours).
// Distincte de la section « Recherche » (travaux de recherche) : icône loupe dans l'en-tête.
export const SEARCH_TXT = {
  fr: { open: "Rechercher sur le site", placeholder: "Mot-clé, nom, phrase…", close: "Fermer", empty: "Aucun résultat pour", hint: "Tapez au moins deux caractères. Raccourci : touche /", analyses: "Analyses", research: "Travaux de recherche", teaching: "Enseignement", about: "Parcours", results: (n) => `${n} résultat${n > 1 ? "s" : ""}` },
  en: { open: "Search the site", placeholder: "Keyword, name, phrase…", close: "Close", empty: "No results for", hint: "Type at least two characters. Shortcut: / key", analyses: "Analyses", research: "Research papers", teaching: "Teaching", about: "Background", results: (n) => `${n} result${n > 1 ? "s" : ""}` },
  zh: { open: "站内搜索", placeholder: "关键词、人名、短语……", close: "关闭", empty: "未找到相关结果：", hint: "请输入至少两个字符。快捷键：/", analyses: "分析", research: "研究成果", teaching: "教学", about: "履历", results: (n) => `${n} 条结果` },
};

export const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'");

const termsOf = (q) => norm(q).split(/\s+/).filter((w) => w.length >= 2 || /[一-鿿]/.test(w));

// Extrait autour de la première occurrence, avec les termes surlignés.
function Snippet({ text, terms }) {
  const n = norm(text);
  let pos = -1;
  for (const w of terms) { const i = n.indexOf(w); if (i >= 0 && (pos < 0 || i < pos)) pos = i; }
  if (pos < 0) return null;
  const start = Math.max(0, pos - 60);
  const end = Math.min(text.length, pos + 140);
  const piece = text.slice(start, end);
  const np = norm(piece);
  const marks = [];
  for (const w of terms) { let i = np.indexOf(w); while (i >= 0) { marks.push([i, i + w.length]); i = np.indexOf(w, i + w.length); } }
  marks.sort((a, b) => a[0] - b[0]);
  const out = []; let cur = 0;
  marks.forEach(([a, b], k) => { if (a < cur) return; out.push(piece.slice(cur, a)); out.push(<mark key={k}>{piece.slice(a, b)}</mark>); cur = b; });
  out.push(piece.slice(cur));
  return <span className="ss-snippet">{start > 0 ? "… " : ""}{out}{end < text.length ? " …" : ""}</span>;
}

export default function SiteSearch({ lang, open, onClose, bulletins, papers, courses, about, timeline, themes, fmtDate, catLabel, onOpenAnalysis, onGo }) {
  const t = SEARCH_TXT[lang] || SEARCH_TXT.fr;
  const [q, setQ] = useState("");
  const input = useRef(null);

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 30); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const terms = useMemo(() => termsOf(q), [q]);

  const groups = useMemo(() => {
    if (!terms.length) return [];
    const has = (s) => terms.every((w) => norm(s).includes(w));
    const hits = (s) => terms.some((w) => norm(s).includes(w));

    const analyses = bulletins.map((b) => {
      const paras = b.content.flatMap((s) => [s.heading || "", ...s.paragraphs]);
      const all = [b.title, b.excerpt, b.category, catLabel(b.category, lang), (b.tags || []).join(" "), ...paras].join(" ");
      if (!has(all)) return null;
      let score = 0;
      if (hits(b.title)) score += 6;
      if (hits((b.tags || []).join(" ") + " " + b.category)) score += 3;
      if (hits(b.excerpt)) score += 2;
      const where = [b.excerpt, ...paras].find((p) => has(p)) || [b.excerpt, ...paras].find((p) => hits(p)) || b.excerpt;
      return { key: "a" + b.id, score, title: b.title, meta: `${fmtDate(b, lang)} · ${catLabel(b.category, lang)}`, text: where, go: () => onOpenAnalysis(b.id, terms) };
    }).filter(Boolean).sort((a, b) => b.score - a.score);

    const research = [
      ...papers.filter((p) => has([p.title, p.desc, p.presentations, p.status, p.year].join(" "))).map((p) => ({ key: "p" + p.title, title: p.title, meta: p.year, text: [p.desc, p.presentations].filter(Boolean).join(" · "), go: () => onGo("research", { drafts: !!p.draft }) })),
      ...themes.filter((th) => has(th)).map((th) => ({ key: "th" + th, title: th, text: th, go: () => onGo("research") })),
    ];
    const teaching = courses.filter((c) => has([c.name, c.level, c.body].join(" "))).map((c) => ({ key: "c" + c.name + c.level, title: c.name, meta: c.level, text: c.body, go: () => onGo("teaching") }));
    const bg = [
      ...about.filter((p) => has(p)).map((p, i) => ({ key: "ab" + i, title: t.about, text: p, go: () => onGo("about") })),
      ...timeline.filter((row) => has(row.filter(Boolean).join(" "))).map((row) => ({ key: "tl" + row.join(), title: `${row[0]} · ${row[1]}`, text: row.slice(1).filter(Boolean).join(" · "), go: () => onGo("about") })),
    ];
    return [[t.analyses, analyses], [t.research, research], [t.teaching, teaching], [t.about, bg]].filter(([, items]) => items.length);
  }, [terms, bulletins, papers, courses, about, timeline, themes, lang]);

  if (!open) return null;
  const total = groups.reduce((n, [, items]) => n + items.length, 0);

  return (
    <div className="ss" role="dialog" aria-modal="true" aria-label={t.open} onClick={onClose}>
      <div className="ss-card" onClick={(e) => e.stopPropagation()}>
        <div className="ss-bar">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.placeholder} aria-label={t.open} enterKeyHint="search" />
          <button className="ss-close" onClick={onClose}>{t.close}</button>
        </div>
        <div className="ss-body">
          {!terms.length && <p className="ss-hint">{t.hint}</p>}
          {terms.length > 0 && total === 0 && <p className="ss-hint">{t.empty} « {q.trim()} »</p>}
          {total > 0 && <p className="ss-count">{t.results(total)}</p>}
          {groups.map(([label, items]) => (
            <section key={label} className="ss-group">
              <h4>{label}</h4>
              <ul>
                {items.map((it) => (
                  <li key={it.key}>
                    <button onClick={() => { onClose(); it.go(); }}>
                      <span className="ss-title">{it.title}</span>
                      {it.meta && <span className="ss-meta">{it.meta}</span>}
                      <Snippet text={it.text} terms={terms} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
