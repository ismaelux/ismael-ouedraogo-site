import { useState, useEffect, useMemo, useRef } from "react";
import { BULLETINS_FR, BULLETINS_EN, CATEGORIES_FR, CATEGORIES_EN } from "./bulletins-data.js";
import { MAP } from "./west-africa-map.js";
import "./styles.css";

const EMAIL = "ismaelouedraogo1004@gmail.com";
const EMAIL_PRO = "ismael.ouedraogo@univ-rennes2.fr";

const MONTHS = {
  fr: { JAN: "janvier", "FÉV": "février", FEV: "février", MAR: "mars", AVR: "avril", MAI: "mai", JUN: "juin", JUI: "juin", JUL: "juillet", "AOÛ": "août", AOU: "août", SEP: "septembre", OCT: "octobre", NOV: "novembre", "DÉC": "décembre", DEC: "décembre" },
  en: { JAN: "January", FEB: "February", MAR: "March", APR: "April", MAY: "May", JUN: "June", JUL: "July", AUG: "August", SEP: "September", OCT: "October", NOV: "November", DEC: "December" },
};
const fmtDate = (b, lang) => {
  const m = MONTHS[lang][b.month] || b.month.toLowerCase();
  return lang === "fr" ? `${Number(b.day)} ${m} ${b.year}` : `${Number(b.day)} ${m} ${b.year}`;
};
const readingTime = (content) => {
  if (!content) return 1;
  const words = content.filter(s => s.heading !== "Sources").reduce((n, s) => n + s.paragraphs.join(" ").split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 230));
};
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

const T = {
  fr: {
    nav: { analyses: "Analyses", research: "Recherche", teaching: "Enseignement", about: "Parcours", contact: "Contact" },
    menu: "Menu", close: "Fermer",
    lead: "Économiste du développement. J'étudie la manière dont la géopolitique oriente le commerce, l'aide et les investissements en Afrique, et la façon dont l'intégration régionale ouest-africaine se recompose.",
    roles: [["ATER en sciences économiques", "Université Rennes 2, 2026-2027"], ["Docteur en sciences économiques", "CERDI, Université Clermont Auvergne"], ["Ancien fellow puis consultant", "Bureau de l'économiste en chef pour l'Afrique, Banque mondiale"]],
    ctaRead: "Lire la dernière analyse", ctaContact: "Me contacter",
    mapTitle: "Afrique de l'Ouest : États membres de la CEDEAO, États de l'AES et principaux corridors portuaires",
    keyEcowas: "CEDEAO (12 États)", keyAes: "AES : Mali, Burkina Faso, Niger", keyCorridor: "Corridors vers les ports",
    mapNote: "Fond de carte Natural Earth. Tracés de corridors schématiques.",
    mapLink: "Voir l'analyse du 27 octobre 2026",
    analysesTitle: "Analyses",
    analysesSub: "Notes d'analyse sur l'économie politique africaine. Chaque note part d'un fait d'actualité, l'éclaire par la théorie économique et indique ses sources.",
    latest: "Dernière analyse", minutes: "min de lecture", read: "Lire l'analyse",
    all: "Toutes", empty: "Aucune analyse dans cette catégorie pour le moment.",
    researchTitle: "Recherche",
    researchSub: "Mes travaux mesurent la distance géopolitique entre États à partir des votes à l'Assemblée générale des Nations unies, puis en estiment les effets sur le commerce bilatéral, l'aide au développement et les investissements directs étrangers chinois.",
    presented: "Présenté à :", showDrafts: "Afficher les travaux en cours", draft: "En cours, non diffusé",
    themesTitle: "Thèmes de recherche",
    teachingTitle: "Enseignement",
    teachingSub: "J'enseigne l'économie depuis 2022, en licence et en master, du cours magistral aux travaux dirigés.",
    nowTitle: "Université Rennes 2", nowWhere: "ATER, UFR Sciences sociales, 2026-2027",
    pastTitle: "Université Clermont Auvergne", pastWhere: "ATER puis chargé d'enseignement, 2022-2026",
    aboutTitle: "Parcours",
    about: [
      "Je suis économiste, spécialiste des relations économiques internationales vues sous l'angle de la géopolitique. Ma thèse, soutenue au CERDI en juin 2025 sous la direction de Marie-Françoise Renard, mesure la distance géopolitique entre États et en estime les effets sur le commerce, l'aide publique au développement et les investissements directs étrangers chinois.",
      "Pendant environ un an et demi, j'ai travaillé au Bureau de l'économiste en chef pour l'Afrique de la Banque mondiale, d'abord comme fellow puis comme consultant. J'ai contribué au rapport « Integrating Africa: From Threads to Hubs », notamment aux volets consacrés aux chaînes de valeur régionales et aux biens publics régionaux, ainsi qu'à des travaux sur la qualité de l'emploi dans les filiales de multinationales.",
      "Je suis aujourd'hui ATER en sciences économiques à l'Université Rennes 2, où j'enseigne notamment l'économie des inégalités et l'économie de la protection sociale.",
    ],
    timeline: [
      ["2026-2027", "ATER en sciences économiques", "Université Rennes 2"],
      ["2025-2026", "Fellow puis consultant", "Banque mondiale, Bureau de l'économiste en chef pour l'Afrique"],
      ["2025", "Doctorat en sciences économiques", "CERDI, Université Clermont Auvergne"],
      ["2022-2026", "Enseignement de l'économie", "Université Clermont Auvergne"],
    ],
    marksTitle: "Distinctions et qualifications",
    marks: ["Prix Jeune Chercheur 2026, Fondation UCA et Ville de Clermont-Ferrand", "Qualification aux fonctions de maître de conférences, CNU section 05 (sciences économiques)", "Communications : CSAE Oxford, INFER, CEID, séminaire Brown Bag Lunch de la Banque mondiale"],
    contactTitle: "Contact",
    contactSub: "Pour une collaboration de recherche, une invitation ou un échange sur un poste.",
    contactPro: "Adresse universitaire", contactBase: "Lieu", contactBaseValue: "Rennes, France",
    back: "Retour au site", copy: "Copier le lien", copied: "Lien copié",
    by: "Par", toc: "Dans cette analyse", sources: "Sources",
    endNote: "Une remarque sur cette analyse ou une question ? Écrivez-moi à",
    langLabel: "Langue",
  },
  en: {
    nav: { analyses: "Analyses", research: "Research", teaching: "Teaching", about: "Background", contact: "Contact" },
    menu: "Menu", close: "Close",
    lead: "Development economist. I study how geopolitics shapes trade, aid and investment in Africa, and how regional integration in West Africa is being reshaped.",
    roles: [["Temporary lecturer and researcher (ATER) in economics", "Université Rennes 2, 2026-2027"], ["PhD in Economics", "CERDI, Université Clermont Auvergne"], ["Former fellow, then consultant", "Office of the Chief Economist for Africa, World Bank"]],
    ctaRead: "Read the latest analysis", ctaContact: "Get in touch",
    mapTitle: "West Africa: ECOWAS member states, AES states and main port corridors",
    keyEcowas: "ECOWAS (12 states)", keyAes: "AES: Mali, Burkina Faso, Niger", keyCorridor: "Corridors to the ports",
    mapNote: "Base map: Natural Earth. Corridor lines are schematic.",
    mapLink: "Read the 27 October 2026 analysis",
    analysesTitle: "Analyses",
    analysesSub: "Analytical notes on African political economy. Each note starts from a current event, examines it through economic theory and lists its sources.",
    latest: "Latest analysis", minutes: "min read", read: "Read the analysis",
    all: "All", empty: "No analysis in this category yet.",
    researchTitle: "Research",
    researchSub: "My work measures geopolitical distance between states using United Nations General Assembly votes, then estimates its effects on bilateral trade, development aid and Chinese foreign direct investment.",
    presented: "Presented at:", showDrafts: "Show work in progress", draft: "In progress, not circulated",
    themesTitle: "Research themes",
    teachingTitle: "Teaching",
    teachingSub: "I have taught economics since 2022, at undergraduate and master's level, from lectures to tutorials.",
    nowTitle: "Université Rennes 2", nowWhere: "ATER, Faculty of Social Sciences, 2026-2027",
    pastTitle: "Université Clermont Auvergne", pastWhere: "ATER, then lecturer, 2022-2026",
    aboutTitle: "Background",
    about: [
      "I am an economist working on international economic relations through the lens of geopolitics. My PhD, defended at CERDI in June 2025 under the supervision of Marie-Françoise Renard, measures geopolitical distance between states and estimates its effects on trade, official development assistance and Chinese foreign direct investment.",
      "For about a year and a half, I worked in the World Bank's Office of the Chief Economist for Africa, first as a fellow and then as a consultant. I contributed to the report “Integrating Africa: From Threads to Hubs”, in particular to the parts on regional value chains and regional public goods, and to research on job quality in multinational affiliates.",
      "I am now a temporary lecturer and researcher (ATER) in economics at Université Rennes 2, where I teach, among other courses, the economics of inequality and the economics of social protection.",
    ],
    timeline: [
      ["2026-2027", "ATER in economics", "Université Rennes 2"],
      ["2025-2026", "Fellow, then consultant", "World Bank, Office of the Chief Economist for Africa"],
      ["2025", "PhD in Economics", "CERDI, Université Clermont Auvergne"],
      ["2022-2026", "Teaching economics", "Université Clermont Auvergne"],
    ],
    marksTitle: "Awards and qualifications",
    marks: ["Young Researcher Prize 2026, UCA Foundation and City of Clermont-Ferrand", "Qualified for associate professor positions, CNU section 05 (economics)", "Presentations: CSAE Oxford, INFER, CEID, World Bank Brown Bag Lunch seminar"],
    contactTitle: "Contact",
    contactSub: "For research collaboration, an invitation or a conversation about a position.",
    contactPro: "University address", contactBase: "Based in", contactBaseValue: "Rennes, France",
    back: "Back to the site", copy: "Copy link", copied: "Link copied",
    by: "By", toc: "In this analysis", sources: "Sources",
    endNote: "A comment on this analysis or a question? Write to me at",
    langLabel: "Language",
  },
};

const PAPERS = {
  fr: [
    { title: "Friendship is as Important as Neighborhood: Geopolitical Distance and Bilateral Trade", desc: "Mesure l'effet de la distance géopolitique sur le commerce bilatéral à l'aide de modèles de gravité estimés en PPML.", year: "2024", status: "Working paper", presentations: "CSAE Oxford, INFER, CEID" },
    { title: "Geopolitical Dynamics and the Effectiveness of Regional Trade Agreements", desc: "Évalue la manière dont les dynamiques géopolitiques modifient l'efficacité des accords commerciaux régionaux.", year: "2024", status: "Working paper", presentations: "Séminaire Brown Bag Lunch, Banque mondiale" },
    { title: "Regional Public Goods and African Integration: A Polycentric Governance Framework", desc: "Propose un cadre de gouvernance polycentrique pour les biens publics régionaux et l'intégration africaine.", year: "2025", draft: true },
    { title: "China-Africa Value Chains: Structural Asymmetries and Belt & Road Effects", desc: "Analyse les chaînes de valeur entre la Chine et l'Afrique à partir des tableaux EORA MRIO, en évaluant les asymétries structurelles et les effets des Nouvelles routes de la soie.", year: "2025", draft: true },
  ],
  en: [
    { title: "Friendship is as Important as Neighborhood: Geopolitical Distance and Bilateral Trade", desc: "Measures the effect of geopolitical distance on bilateral trade using gravity models estimated with PPML.", year: "2024", status: "Working paper", presentations: "CSAE Oxford, INFER, CEID" },
    { title: "Geopolitical Dynamics and the Effectiveness of Regional Trade Agreements", desc: "Assesses how geopolitical dynamics change the effectiveness of regional trade agreements.", year: "2024", status: "Working paper", presentations: "World Bank Brown Bag Lunch seminar" },
    { title: "Regional Public Goods and African Integration: A Polycentric Governance Framework", desc: "Proposes a polycentric governance framework for regional public goods and African integration.", year: "2025", draft: true },
    { title: "China-Africa Value Chains: Structural Asymmetries and Belt & Road Effects", desc: "Analyses China-Africa value chains using EORA MRIO tables, assessing structural asymmetries and Belt and Road effects.", year: "2025", draft: true },
  ],
};

const THEMES = {
  fr: ["Géopolitique et relations économiques", "Commerce bilatéral", "Investissements directs étrangers en Afrique", "Aide publique au développement", "Intégration économique régionale", "Chaînes de valeur mondiales et régionales", "Économie politique du Sahel"],
  en: ["Geopolitics and economic relations", "Bilateral trade", "Foreign direct investment in Africa", "Official development assistance", "Regional economic integration", "Global and regional value chains", "Political economy of the Sahel"],
};

const COURSES_NOW = {
  fr: [
    { name: "Inégalités économiques et sociales", level: "CM, L3 MIASHS", body: "Mesure des inégalités (courbe de Lorenz, indice de Gini, rapports interdéciles), inégalités de revenus et de patrimoine, travail, salaires et écarts entre femmes et hommes, avec une mise en perspective historique des notions et des mesures." },
    { name: "Économie de la protection sociale", level: "CM, L3 AES", body: "Fondements économiques de la protection sociale, histoire des systèmes, branches du système français (santé, retraites, famille, chômage, pauvreté) et comparaisons européennes." },
    { name: "Économie politique, méthodologie", level: "TD, L1 AES", body: "Méthodes de travail en économie : lecture de documents, analyse de données simples, argumentation et dissertation." },
    { name: "Introduction à l'économie", level: "CM, L1 LEA, second semestre", body: "Notions de base de la micro et de la macroéconomie pour des étudiants en langues étrangères appliquées." },
    { name: "Lire, produire et visualiser les statistiques sur tableur", level: "TD, second semestre", body: "Construction, lecture et représentation graphique de données statistiques sur tableur." },
  ],
  en: [
    { name: "Economic and Social Inequality", level: "Lecture, 3rd-year MIASHS", body: "Measuring inequality (Lorenz curve, Gini index, interdecile ratios), income and wealth inequality, work, wages and gender gaps, with a historical perspective on concepts and measures." },
    { name: "Economics of Social Protection", level: "Lecture, 3rd-year AES", body: "Economic foundations of social protection, history of welfare systems, branches of the French system (health, pensions, family, unemployment, poverty) and European comparisons." },
    { name: "Political Economy: Methodology", level: "Tutorial, 1st-year AES", body: "Working methods in economics: reading documents, analysing simple data, building an argument and writing an essay." },
    { name: "Introduction to Economics", level: "Lecture, 1st-year LEA, second semester", body: "Basic micro and macroeconomic concepts for students in applied foreign languages." },
    { name: "Reading, Producing and Visualising Statistics with Spreadsheets", level: "Tutorial, second semester", body: "Building, reading and charting statistical data with spreadsheets." },
  ],
};

const COURSES_PAST = {
  fr: [
    { name: "Macroéconomie", level: "L2-L3", body: "Consommation, investissement, demande globale, politiques budgétaire et monétaire. Modèle IS-LM, fluctuations conjoncturelles et croissance de long terme, avec des applications aux économies en développement." },
    { name: "Économétrie", level: "L3-M1", body: "Régression linéaire simple et multiple, MCO, tests d'hypothèses, hétéroscédasticité, endogénéité et variables instrumentales. Applications sur données réelles avec Stata et R." },
    { name: "Économie internationale", level: "L3", body: "Avantages comparatifs (Ricardo, HOS), nouvelles théories du commerce (Krugman), modèles de gravité, politiques commerciales et intégration régionale." },
    { name: "Statistiques et probabilités", level: "L1-L2", body: "Statistique descriptive et inférentielle, lois de probabilité, estimation, intervalles de confiance et tests." },
    { name: "Mathématiques appliquées", level: "L1-L2", body: "Fonctions, dérivées, intégrales, algèbre linéaire et optimisation sous contrainte appliquées aux problèmes économiques." },
  ],
  en: [
    { name: "Macroeconomics", level: "Undergraduate", body: "Consumption, investment, aggregate demand, fiscal and monetary policy. IS-LM model, business cycles and long-run growth, with applications to developing economies." },
    { name: "Econometrics", level: "Undergraduate and master's", body: "Simple and multiple linear regression, OLS, hypothesis testing, heteroscedasticity, endogeneity and instrumental variables. Applied work on real data with Stata and R." },
    { name: "International Economics", level: "Undergraduate", body: "Comparative advantage (Ricardo, HOS), new trade theory (Krugman), gravity models, trade policy and regional integration." },
    { name: "Statistics and Probability", level: "Undergraduate", body: "Descriptive and inferential statistics, probability distributions, estimation, confidence intervals and tests." },
    { name: "Applied Mathematics", level: "Undergraduate", body: "Functions, derivatives, integrals, linear algebra and constrained optimisation applied to economic problems." },
  ],
};

function WestAfricaMap({ t, onOpenLatest }) {
  const { width, height, countries, cities, corridors } = MAP;
  const labelPos = {
    dakar: { dx: -9, dy: 4, anchor: "end" },
    abidjan: { dx: -8, dy: 15, anchor: "end" },
    tema: { dx: -6, dy: 18, anchor: "end" },
    lome: { dx: 0, dy: 30, anchor: "middle" },
    cotonou: { dx: 6, dy: 18, anchor: "start" },
    bamako: { dx: 0, dy: -9, anchor: "middle", aes: true },
    ouaga: { dx: 0, dy: -9, anchor: "middle", aes: true },
    niamey: { dx: 8, dy: -6, anchor: "start", aes: true },
  };
  return (
    <figure className="map-figure">
      <svg className="map-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.mapTitle}>
        <title>{t.mapTitle}</title>
        {countries.map(c => <path key={c.id} d={c.d} className={`c-${c.group}`} />)}
        {corridors.map(([a, b]) => {
          const [x1, y1] = cities[a].xy, [x2, y2] = cities[b].xy;
          return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} className="corridor" />;
        })}
        {Object.entries(cities).map(([k, c]) => {
          const p = labelPos[k];
          return (
            <g key={k}>
              {c.port ? <circle cx={c.xy[0]} cy={c.xy[1]} r="4" className="port" /> : <circle cx={c.xy[0]} cy={c.xy[1]} r="3" className="capital" />}
              <text x={c.xy[0] + p.dx} y={c.xy[1] + p.dy} textAnchor={p.anchor} className={p.aes ? "on-aes" : ""}>{c.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="map-caption">
        <span className="key"><span className="swatch swatch-ecowas" />{t.keyEcowas}</span>
        <span className="key"><span className="swatch swatch-aes" />{t.keyAes}</span>
        <span className="key"><span className="swatch swatch-line" />{t.keyCorridor}</span>
        <span className="map-note">{t.mapNote} <a href="#" onClick={(e) => { e.preventDefault(); onOpenLatest(); }}>{t.mapLink}</a></span>
      </figcaption>
    </figure>
  );
}

function Course({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="course">
      <button aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="course-name">{c.name}</span>
        <span className="course-level">{c.level}<span className="course-sign" aria-hidden="true">{open ? "−" : "+"}</span></span>
      </button>
      {open && <p className="course-body">{c.body}</p>}
    </div>
  );
}

function Reader({ b, lang, t, onClose }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(null);
  const [copied, setCopied] = useState(false);
  const body = b.content.filter(s => s.heading !== "Sources");
  const src = b.content.find(s => s.heading === "Sources");
  const sources = src ? src.paragraphs.join(" | ").split(/\s*\|\s*/).filter(Boolean) : [];
  const headings = body.filter(s => s.heading).map(s => ({ id: slugify(s.heading), label: s.heading }));

  useEffect(() => {
    const el = ref.current;
    el.scrollTop = 0;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
      let cur = null;
      for (const h of headings) {
        const node = document.getElementById(h.id);
        if (node && node.getBoundingClientRect().top < 140) cur = h.id;
      }
      setCurrent(cur);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [b.id, lang]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { /* presse-papiers indisponible */ }
  };

  return (
    <div className="reader" ref={ref} role="dialog" aria-modal="true" aria-label={b.title}>
      <div className="reader-bar">
        <div className="wrap">
          <button className="reader-back" onClick={onClose}>{"←"} {t.back}</button>
          <button className="reader-copy" onClick={copyLink}>{copied ? t.copied : t.copy}</button>
        </div>
        <div className="reader-progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="wrap">
        <header className="reader-head">
          <div className="reader-meta"><span className="cat">{b.category}</span><span>{fmtDate(b, lang)}</span><span>{readingTime(b.content)} {t.minutes}</span></div>
          <h1 className="reader-title">{b.title}</h1>
          <p className="reader-dek">{b.excerpt}</p>
          <p className="reader-author">{t.by} <strong>Ismaël Ouédraogo</strong></p>
        </header>
        <div className="reader-body">
          <nav className="toc" aria-label={t.toc}>
            {headings.length > 0 && <>
              <p>{t.toc}</p>
              <ol>{headings.map(h => <li key={h.id}><a href={`#${h.id}`} className={current === h.id ? "is-current" : ""} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" }); }}>{h.label}</a></li>)}</ol>
            </>}
          </nav>
          <article className="prose" lang={lang}>
            {body.map((s, i) => (
              <section key={i}>
                {s.heading && <h2 id={slugify(s.heading)}>{s.heading}</h2>}
                {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
              </section>
            ))}
            {sources.length > 0 && (
              <section className="sources">
                <h2>{t.sources}</h2>
                <ol>{sources.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </section>
            )}
            <p className="reader-end">{t.endNote} <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(b.title)}`}>{EMAIL}</a>.</p>
          </article>
        </div>
      </div>
    </div>
  );
}

const readHash = () => {
  const m = window.location.hash.match(/^#analyse-(\d+)(?:-(fr|en))?/);
  return m ? { id: Number(m[1]), lang: m[2] } : null;
};
const initialLang = () => {
  const h = readHash();
  if (h && h.lang) return h.lang;
  try { const s = localStorage.getItem("lang"); if (s === "fr" || s === "en") return s; } catch (e) { /* stockage indisponible */ }
  return "fr";
};

export default function App() {
  const [lang, setLang] = useState(initialLang);
  const [openId, setOpenId] = useState(() => readHash()?.id ?? null);
  const [filter, setFilter] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  const t = T[lang];
  const bulletins = lang === "fr" ? BULLETINS_FR : BULLETINS_EN;
  const categories = (lang === "fr" ? CATEGORIES_FR : CATEGORIES_EN).slice(1);
  const sorted = useMemo(() => [...bulletins].sort((a, b) => b.id - a.id), [bulletins]);
  const latest = sorted[0];
  const rest = filter ? sorted.filter(b => b.category === filter) : sorted.slice(1);
  const open = openId != null ? bulletins.find(b => b.id === openId) : null;

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) { /* stockage indisponible */ }
    setFilter(null);
  }, [lang]);

  useEffect(() => {
    const base = lang === "fr" ? "Ismaël Ouédraogo, économiste" : "Ismaël Ouédraogo, economist";
    document.title = open ? `${open.title} | Ismaël Ouédraogo` : base;
    const want = open ? `#analyse-${open.id}-${lang}` : "";
    if (window.location.hash !== want) history.replaceState(null, "", want || window.location.pathname);
  }, [open, lang]);

  useEffect(() => {
    const onHash = () => { const h = readHash(); setOpenId(h ? h.id : null); };
    window.addEventListener("hashchange", onHash);
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      let cur = "";
      for (const id of ["analyses", "research", "teaching", "about", "contact"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("scroll", onScroll); };
  }, []);

  const go = (id) => (e) => { e.preventDefault(); setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const openAnalysis = (id) => (e) => { if (e) e.preventDefault(); setOpenId(id); };
  const papers = PAPERS[lang].filter(p => showDrafts || !p.draft);

  return (
    <>
      <header className={`top ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap top-inner">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Ismaël Ouédraogo</a>
          <button className="menu-btn" aria-expanded={menuOpen} aria-controls="nav" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? t.close : t.menu}</button>
          <nav id="nav" className={`nav ${menuOpen ? "is-open" : ""}`}>
            {Object.entries(t.nav).map(([id, label]) => <a key={id} href={`#${id}`} onClick={go(id)} className={active === id ? "is-active" : ""}>{label}</a>)}
            <div className="lang" role="group" aria-label={t.langLabel}>
              <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
              <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>Ismaël Ouédraogo</h1>
              <p className="hero-lead">{t.lead}</p>
              <div className="hero-roles">
                {t.roles.map(([r, o]) => <div key={r}><strong>{r}</strong>, {o}</div>)}
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href={`#analyse-${latest.id}-${lang}`} onClick={openAnalysis(latest.id)}>{t.ctaRead}</a>
                <a className="btn btn-ghost" href="#contact" onClick={go("contact")}>{t.ctaContact}</a>
              </div>
            </div>
            <WestAfricaMap t={t} onOpenLatest={() => setOpenId(latest.id)} />
          </div>
        </section>

        <section className="section" id="analyses">
          <div className="wrap">
            <div className="section-head"><h2>{t.analysesTitle}</h2><p>{t.analysesSub}</p></div>
            <a className="lead-analysis" href={`#analyse-${latest.id}-${lang}`} onClick={openAnalysis(latest.id)}>
              <div className="lead-meta">
                <span>{t.latest}</span>
                <span className="when">{fmtDate(latest, lang)}</span>
                <span>{latest.category}</span>
                <span>{readingTime(latest.content)} {t.minutes}</span>
              </div>
              <div>
                <h3 className="lead-title">{latest.title}</h3>
                <p className="lead-excerpt">{latest.excerpt}</p>
                <span className="lead-cta">{t.read}</span>
              </div>
            </a>

            <div className="filters" role="group">
              <button className="filter" aria-pressed={!filter} onClick={() => setFilter(null)}>{t.all}<span className="count">{sorted.length}</span></button>
              {categories.map(c => {
                const n = sorted.filter(b => b.category === c).length;
                return n ? <button key={c} className="filter" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}<span className="count">{n}</span></button> : null;
              })}
            </div>
            {rest.length === 0 ? <p className="empty">{t.empty}</p> : (
              <ul className="index">
                {rest.map(b => (
                  <li key={b.id}>
                    <a href={`#analyse-${b.id}-${lang}`} onClick={openAnalysis(b.id)}>
                      <span className="date">{fmtDate(b, lang)}</span>
                      <span>
                        <span className="title">{b.title}</span>
                        <span className="excerpt">{b.excerpt}</span>
                      </span>
                      <span className="cat">{b.category}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="section" id="research">
          <div className="wrap">
            <div className="section-head"><h2>{t.researchTitle}</h2><p>{t.researchSub}</p></div>
            <div className="papers">
              {papers.map(p => (
                <div key={p.title} className={`paper ${p.draft ? "is-draft" : ""}`}>
                  <div className="paper-status">{p.draft ? t.draft : <><b>{p.status}</b>, {p.year}</>}</div>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    {p.presentations && <p className="presented">{t.presented} {p.presentations}</p>}
                  </div>
                </div>
              ))}
            </div>
            <label className="draft-toggle"><input type="checkbox" checked={showDrafts} onChange={e => setShowDrafts(e.target.checked)} /> {t.showDrafts}</label>
            <div className="themes">
              <h3>{t.themesTitle}</h3>
              <ul>{THEMES[lang].map(th => <li key={th}>{th}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="section" id="teaching">
          <div className="wrap">
            <div className="section-head"><h2>{t.teachingTitle}</h2><p>{t.teachingSub}</p></div>
            <div className="teach">
              <div>
                <h3>{t.nowTitle}</h3>
                <p className="where">{t.nowWhere}</p>
                {COURSES_NOW[lang].map(c => <Course key={c.name} c={c} />)}
              </div>
              <div>
                <h3>{t.pastTitle}</h3>
                <p className="where">{t.pastWhere}</p>
                {COURSES_PAST[lang].map(c => <Course key={c.name} c={c} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap about">
            <div>
              <div className="section-head" style={{ display: "block" }}><h2>{t.aboutTitle}</h2></div>
              <div className="portrait"><img src="/photo-ismael.jpg" alt="Ismaël Ouédraogo" loading="lazy" /></div>
            </div>
            <div>
              <div className="about-text">{t.about.map((p, i) => <p key={i}>{p}</p>)}</div>
              <ol className="timeline">
                {t.timeline.map(([yr, what, org]) => <li key={yr + what}><span className="yr">{yr}</span><span><span className="what">{what}</span><br /><span className="org">{org}</span></span></li>)}
              </ol>
              <div className="marks">
                <h3>{t.marksTitle}</h3>
                {t.marks.map(m => <p key={m}>{m}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="wrap contact">
            <div className="section-head" style={{ display: "block", marginBottom: 0 }}><h2>{t.contactTitle}</h2><p style={{ marginTop: 10 }}>{t.contactSub}</p></div>
            <div>
              <a className="contact-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <dl>
                <dt>{t.contactPro}</dt><dd><a href={`mailto:${EMAIL_PRO}`}>{EMAIL_PRO}</a></dd>
                <dt>{t.contactBase}</dt><dd>{t.contactBaseValue}</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap"><span>Ismaël Ouédraogo</span><span>{new Date().getFullYear()}</span></div>
      </footer>

      {open && <Reader b={open} lang={lang} t={t} onClose={() => setOpenId(null)} />}
    </>
  );
}
