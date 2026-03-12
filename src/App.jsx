import { useState, useEffect, useRef } from "react";

const CSS = `
  :root {
    --bg-primary: #0B0F1A;
    --bg-secondary: #111827;
    --bg-card: #1A2035;
    --bg-card-hover: #1F2845;
    --accent-gold: #D4A853;
    --accent-gold-light: #E8C97A;
    --accent-amber: #F59E0B;
    --accent-teal: #2DD4BF;
    --accent-blue: #3B82F6;
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;
    --border-subtle: rgba(212, 168, 83, 0.15);
    --border-card: rgba(255,255,255,0.06);
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: var(--font-body); line-height: 1.7; overflow-x: hidden;
  }
  ::selection { background: var(--accent-gold); color: var(--bg-primary); }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1rem 2rem; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter: blur(20px); background: rgba(11,15,26,0.85);
    border-bottom: 1px solid var(--border-subtle);
  }
  .nav.scrolled { padding: 0.6rem 2rem; background: rgba(11,15,26,0.95); }
  .nav-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .nav-logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--accent-gold); cursor: pointer; text-decoration: none; }
  .nav-logo span { color: var(--text-muted); font-weight: 400; font-size: 0.9rem; margin-left: 0.5rem; }
  .nav-links { display: flex; gap: 0.25rem; align-items: center; }
  .nav-link {
    padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
    color: var(--text-secondary); cursor: pointer; transition: all 0.25s;
    border: none; background: none; font-family: var(--font-body);
    letter-spacing: 0.03em; text-transform: uppercase;
  }
  .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
  .nav-link.active { color: var(--accent-gold); background: rgba(212,168,83,0.1); }
  .mobile-toggle { display: none; background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 1.5rem; }
  @media (max-width: 768px) {
    .mobile-toggle { display: block; }
    .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; background: rgba(11,15,26,0.98); padding: 1rem; border-bottom: 1px solid var(--border-subtle); }
    .nav-links.open { display: flex; }
  }

  .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 8rem 2rem 4rem; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 70% 40%, rgba(212,168,83,0.08), transparent), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(45,212,191,0.05), transparent), var(--bg-primary); }
  .hero-grid { position: absolute; inset: 0; opacity: 0.03; background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 60px 60px; }
  .hero-content { max-width: 1280px; margin: 0 auto; width: 100%; position: relative; z-index: 2; display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; }
  @media (max-width: 900px) { .hero-content { grid-template-columns: 1fr; text-align: center; } }
  .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(212,168,83,0.1); border: 1px solid rgba(212,168,83,0.2); padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-gold); margin-bottom: 1.5rem; animation: fadeSlideUp 0.8s ease both; }
  .hero-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); animation: pulse 2s ease infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .hero h1 { font-family: var(--font-display); font-size: clamp(2.8rem,5vw,4.5rem); font-weight: 700; line-height: 1.1; color: var(--text-primary); margin-bottom: 1rem; animation: fadeSlideUp 0.8s 0.15s ease both; }
  .hero h1 .gold { color: var(--accent-gold); }
  .hero-subtitle { font-size: 1.1rem; color: var(--text-secondary); max-width: 540px; margin-bottom: 2rem; line-height: 1.8; animation: fadeSlideUp 0.8s 0.3s ease both; }
  .hero-visual { display: flex; justify-content: center; align-items: center; animation: fadeSlideUp 0.8s 0.5s ease both; }
  .hero-map-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 20px; padding: 2rem; width: 100%; max-width: 420px; position: relative; overflow: hidden; }
  .hero-map-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(212,168,83,0.05), transparent 60%); }
  .map-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 1rem; }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  .section { padding: 6rem 2rem; max-width: 1280px; margin: 0 auto; }
  .section-header { margin-bottom: 3.5rem; }
  .section-tag { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent-gold); margin-bottom: 0.75rem; font-family: var(--font-mono); }
  .section-title { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,3rem); font-weight: 700; color: var(--text-primary); line-height: 1.2; }
  .section-subtitle { color: var(--text-secondary); margin-top: 0.75rem; max-width: 600px; font-size: 1rem; }
  .section-divider { width: 60px; height: 3px; background: linear-gradient(90deg, var(--accent-gold), transparent); margin-top: 1.25rem; border-radius: 2px; }

  .tabs { display: flex; gap: 0.5rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
  .tab-btn { padding: 0.6rem 1.4rem; border-radius: 10px; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.3s; border: 1px solid var(--border-card); background: transparent; font-family: var(--font-body); }
  .tab-btn:hover { border-color: var(--accent-gold); color: var(--text-primary); }
  .tab-btn.active { background: rgba(212,168,83,0.15); border-color: var(--accent-gold); color: var(--accent-gold); }

  .card-grid { display: grid; gap: 1.5rem; }
  .card-grid.cols-2 { grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); }
  .card-grid.cols-3 { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 1.75rem; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden; }
  .card:hover { background: var(--bg-card-hover); border-color: rgba(212,168,83,0.2); transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent-gold), var(--accent-teal)); opacity: 0; transition: opacity 0.3s; }
  .card:hover .card-accent { opacity: 1; }
  .card-tag { display: inline-block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; padding: 0.25rem 0.7rem; border-radius: 6px; font-family: var(--font-mono); margin-bottom: 0.75rem; }
  .card-tag.public { color: var(--accent-teal); background: rgba(45,212,191,0.1); }
  .card-tag.private { color: var(--text-muted); background: rgba(100,116,139,0.15); }
  .card-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.6rem; line-height: 1.35; }
  .card-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; }
  .card-meta { display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); flex-wrap: wrap; }
  .card-meta-item { display: flex; align-items: center; gap: 0.3rem; }
  .lock-badge { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.65rem; color: var(--text-muted); margin-top: 0.75rem; }

  .bulletin-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 2rem; display: grid; grid-template-columns: auto 1fr; gap: 1.5rem; transition: all 0.35s; cursor: pointer; align-items: start; }
  .bulletin-card:hover { border-color: rgba(212,168,83,0.3); background: var(--bg-card-hover); }
  .bulletin-date { text-align: center; padding: 0.75rem; background: rgba(212,168,83,0.08); border-radius: 12px; min-width: 60px; }
  .bulletin-date .day { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--accent-gold); line-height: 1; }
  .bulletin-date .month { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-top: 0.2rem; }
  .bulletin-title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
  .bulletin-excerpt { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; }
  .bulletin-tags { display: flex; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap; }
  .bulletin-tag { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-subtle); color: var(--text-muted); }

  .course-item { border-bottom: 1px solid var(--border-card); transition: background 0.3s; cursor: pointer; }
  .course-item:last-child { border-bottom: none; }
  .course-item:hover { background: rgba(255,255,255,0.02); }
  .course-header { display: flex; gap: 1.5rem; padding: 1.5rem; align-items: center; }
  .course-code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-gold); white-space: nowrap; background: rgba(212,168,83,0.1); padding: 0.3rem 0.7rem; border-radius: 6px; }
  .course-name { font-weight: 600; color: var(--text-primary); }
  .course-detail { font-size: 0.85rem; color: var(--text-secondary); }
  .course-toggle { margin-left: auto; font-size: 1.2rem; color: var(--text-muted); transition: transform 0.3s; }
  .course-toggle.open { transform: rotate(180deg); }
  .course-summary { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.3s; padding: 0 1.5rem 0 4.5rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8; }
  .course-summary.open { max-height: 500px; padding: 0 1.5rem 1.5rem 4.5rem; }
  @media (max-width: 768px) { .course-summary, .course-summary.open { padding-left: 1.5rem; } }

  .about-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; }
  @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
  .about-sidebar { position: sticky; top: 100px; }
  .about-photo-frame { width: 100%; aspect-ratio: 3/4; border-radius: 20px; background: linear-gradient(135deg, var(--bg-card), var(--bg-card-hover)); border: 1px solid var(--border-card); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .about-initials { font-family: var(--font-display); font-size: 5rem; font-weight: 700; color: var(--accent-gold); opacity: 0.3; }
  .about-info-block { margin-top: 1.5rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; }
  .about-info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-card); font-size: 0.85rem; }
  .about-info-row:last-child { border-bottom: none; }
  .about-info-label { color: var(--text-muted); }
  .about-info-value { color: var(--text-primary); font-weight: 500; text-align: right; }
  .timeline-item { padding-left: 2rem; border-left: 2px solid var(--border-card); margin-bottom: 2rem; position: relative; }
  .timeline-item::before { content: ''; position: absolute; left: -6px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-gold); }
  .timeline-year { font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-gold); margin-bottom: 0.3rem; }
  .timeline-role { font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem; }
  .timeline-org { font-size: 0.9rem; color: var(--text-secondary); }

  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
  .contact-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 16px; padding: 2rem; text-align: center; transition: all 0.3s; }
  .contact-card:hover { border-color: rgba(212,168,83,0.3); transform: translateY(-2px); }
  .contact-icon { font-size: 2rem; margin-bottom: 1rem; }
  .contact-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.5rem; }
  .contact-value { color: var(--text-primary); font-weight: 500; }
  .contact-value a { color: var(--accent-gold); text-decoration: none; }
  .contact-value a:hover { text-decoration: underline; }

  .footer { border-top: 1px solid var(--border-card); padding: 3rem 2rem; text-align: center; color: var(--text-muted); font-size: 0.8rem; }
  .footer-brand { font-family: var(--font-display); font-size: 1.2rem; color: var(--accent-gold); margin-bottom: 0.5rem; }

  .fade-in { opacity: 0; transform: translateY(25px); transition: all 0.7s cubic-bezier(0.4,0,0.2,1); }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  .expertise-grid { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.5rem; }
  .expertise-pill { padding: 0.5rem 1.2rem; border-radius: 100px; font-size: 0.8rem; font-weight: 500; border: 1px solid var(--border-subtle); color: var(--text-secondary); transition: all 0.3s; }
  .expertise-pill:hover { border-color: var(--accent-gold); color: var(--accent-gold); background: rgba(212,168,83,0.08); }

  .editor-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .editor-panel { background: var(--bg-secondary); border: 1px solid var(--border-card); border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
  .editor-field { margin-bottom: 1.25rem; }
  .editor-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.4rem; display: block; }
  .editor-input, .editor-textarea, .editor-select { width: 100%; padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 10px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; outline: none; transition: border-color 0.3s; }
  .editor-input:focus, .editor-textarea:focus { border-color: var(--accent-gold); }
  .editor-textarea { min-height: 180px; resize: vertical; line-height: 1.7; }
  .editor-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
  .btn { padding: 0.7rem 1.5rem; border-radius: 10px; font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; }
  .btn-primary { background: var(--accent-gold); color: var(--bg-primary); }
  .btn-primary:hover { background: var(--accent-gold-light); }
  .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-card); }
  .btn-ghost:hover { border-color: var(--text-muted); color: var(--text-primary); }
  .section-bg-alt { background: var(--bg-secondary); border-top: 1px solid var(--border-card); border-bottom: 1px solid var(--border-card); }
  .private-toggle { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; font-size: 0.8rem; color: var(--text-muted); }
  .private-toggle label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .private-toggle input[type="checkbox"] { accent-color: var(--accent-gold); width: 16px; height: 16px; }
`;

const RESEARCH_PAPERS = [
  { title: "Friendship is as Important as Neighborhood: Geopolitical Distance and Bilateral Trade", desc: "Analyse l'impact de la distance geopolitique sur le commerce bilateral, en utilisant des modeles de gravite et l'estimation PPML.", tags: ["Commerce bilateral", "Geopolitique", "PPML"], year: "2024", status: "Working Paper", visibility: "public", presentations: "CSAE Oxford, INFER, CEID" },
  { title: "Geopolitical Dynamics and the Effectiveness of Regional Trade Agreements", desc: "Evalue comment les dynamiques geopolitiques influencent l'efficacite des accords commerciaux regionaux.", tags: ["Accords commerciaux", "Geopolitique", "Panel data"], year: "2024", status: "Working Paper", visibility: "public", presentations: "World Bank Brown Bag Lunch Series" },
  { title: "Regional Public Goods and African Integration: A Polycentric Governance Framework", desc: "Propose un cadre de gouvernance polycentrique pour les biens publics regionaux et l'integration africaine.", tags: ["Integration africaine", "Biens publics regionaux", "Gouvernance"], year: "2025", status: "En cours", visibility: "private" },
  { title: "China-Africa Value Chains: Structural Asymmetries and Belt & Road Effects", desc: "Analyse les chaines de valeur Chine-Afrique avec les donnees EORA MRIO, en evaluant les asymetries structurelles et les effets de la BRI.", tags: ["Chine-Afrique", "Chaines de valeur", "BRI"], year: "2025", status: "En cours", visibility: "private" },
];

const RESEARCH_THEMES = [
  { icon: "\u{1F310}", label: "Geopolitique et relations economiques" },
  { icon: "\u{1F4B0}", label: "Investissements directs etrangers (FDI) en Afrique" },
  { icon: "\u{1F91D}", label: "Aide publique au developpement (APD)" },
  { icon: "\u{1F517}", label: "Integration economique regionale" },
  { icon: "\u26A1", label: "Chaines de valeur mondiales et regionales" },
  { icon: "\u{1F4CA}", label: "Commerce bilateral" },
  { icon: "\u{1F3DB}", label: "Economie politique du Sahel" },
];

const TEACHING = [
  { code: "MACRO", name: "Macroeconomie", detail: "Licence - UCA / Clermont-Ferrand", level: "L2-L3", summary: "Etude des grandes fonctions macroeconomiques : consommation, investissement, demande globale, politiques budgetaire et monetaire. Analyse des modeles IS-LM, des fluctuations conjoncturelles et de la croissance economique a long terme. Applications aux economies en developpement." },
  { code: "ECMTR", name: "Econometrie", detail: "Licence & Master - UCA", level: "L3-M1", summary: "Introduction aux methodes econometriques : regressions lineaires simples et multiples, moindres carres ordinaires (MCO), tests d'hypotheses, heteroscedasticite, endogeneite et variables instrumentales. Applications sur donnees reelles avec Stata et R." },
  { code: "INTEC", name: "Economie internationale", detail: "Licence - UCA", level: "L3", summary: "Theories du commerce international : avantages comparatifs (Ricardo, HOS), nouvelles theories du commerce (Krugman), modeles de gravite. Politiques commerciales, integration regionale, libre-echange vs protectionnisme. Etudes de cas sur les accords commerciaux et l'OMC." },
  { code: "STATS", name: "Statistiques", detail: "Licence - UCA", level: "L1-L2", summary: "Fondements de la statistique descriptive et inferentielle : mesures de tendance centrale et de dispersion, distributions de probabilite, estimation et intervalles de confiance, tests parametriques et non parametriques. Exercices appliques sur donnees socio-economiques." },
  { code: "MATHS", name: "Mathematiques appliquees", detail: "Licence - UCA", level: "L1-L2", summary: "Outils mathematiques pour l'economie : analyse (fonctions, derivees, integrales), algebre lineaire (matrices, systemes d'equations), optimisation sous contrainte (Lagrangien). Applications aux problemes economiques classiques : maximisation de l'utilite, minimisation des couts." },
];

const BULLETINS_INIT = [
  { id: 1, day: "10", month: "MAR", year: "2026", title: "Integration economique africaine : ou en est la ZLECAf ?", excerpt: "Etat des lieux de la mise en oeuvre de la Zone de libre-echange continentale africaine, les defis logistiques, les avancees commerciales et les perspectives pour les economies ouest-africaines.", tags: ["ZLECAf", "Integration", "Commerce"], category: "Integration economique africaine" },
  { id: 2, day: "03", month: "MAR", year: "2026", title: "Geopolitique du Sahel : recompositions economiques post-CEDEAO", excerpt: "Analyse des consequences economiques du retrait du Mali, du Burkina Faso et du Niger de la CEDEAO. Impact sur les flux commerciaux, les transferts de fonds et les corridors economiques.", tags: ["Sahel", "CEDEAO", "Geopolitique"], category: "Geopolitique Sahel" },
  { id: 3, day: "24", month: "FEV", year: "2026", title: "Chaines de valeur en Afrique : le role croissant de la Chine", excerpt: "Comment la presence chinoise restructure les chaines de valeur industrielles en Afrique subsaharienne : opportunites, dependances et implications pour la politique industrielle.", tags: ["Chine-Afrique", "Chaines de valeur", "Industrie"], category: "Chaines de valeur regionales" },
];

const CATEGORIES = ["Tous", "Integration economique africaine", "Geopolitique Sahel", "Chaines de valeur regionales"];

const NAV_ITEMS = [
  { id: "home", label: "Accueil" },
  { id: "research", label: "Recherche" },
  { id: "bulletins", label: "Bulletins" },
  { id: "teaching", label: "Enseignement" },
  { id: "about", label: "A propos" },
  { id: "contact", label: "Contact" },
];

const GlobeIcon = () => (
  <svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={{ width: "100%", maxWidth: 280, margin: "0 auto", display: "block" }}>
    <circle cx="140" cy="140" r="110" fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5"/>
    <circle cx="140" cy="140" r="110" fill="rgba(212,168,83,0.03)"/>
    <ellipse cx="140" cy="140" rx="110" ry="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
    <ellipse cx="140" cy="105" rx="95" ry="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
    <ellipse cx="140" cy="175" rx="95" ry="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
    <ellipse cx="140" cy="140" rx="40" ry="110" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
    <ellipse cx="140" cy="140" rx="75" ry="110" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
    <path d="M148 70 C142 70, 132 78, 130 88 C128 95, 130 102, 132 108 C133 112, 131 118, 130 124 C128 133, 131 145, 137 155 C142 162, 147 166, 150 168 C152 169, 154 167, 155 164 C158 158, 163 150, 164 142 C165 137, 167 132, 168 127 C169 122, 170 114, 168 106 C166 97, 161 86, 156 78 C153 73, 150 70, 148 70Z" fill="rgba(212,168,83,0.15)" stroke="rgba(212,168,83,0.35)" strokeWidth="1"/>
    <circle cx="138" cy="108" r="4" fill="#D4A853"><animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="125" cy="118" r="3.5" fill="#2DD4BF"><animate attributeName="r" values="2.5;4.5;2.5" dur="3s" begin="0.5s" repeatCount="indefinite"/></circle>
    <circle cx="160" cy="132" r="3.5" fill="#F59E0B"><animate attributeName="r" values="2.5;4.5;2.5" dur="3s" begin="1s" repeatCount="indefinite"/></circle>
    <circle cx="148" cy="158" r="3" fill="#3B82F6"><animate attributeName="r" values="2;4;2" dur="3s" begin="1.5s" repeatCount="indefinite"/></circle>
    <circle cx="145" cy="55" r="3" fill="#D4A853" opacity="0.7"/>
    <circle cx="215" cy="90" r="3" fill="#F59E0B" opacity="0.7"/>
    <circle cx="60" cy="110" r="3" fill="#2DD4BF" opacity="0.7"/>
    <circle cx="185" cy="100" r="3" fill="#3B82F6" opacity="0.7"/>
    <line x1="138" y1="108" x2="145" y2="55" stroke="rgba(212,168,83,0.25)" strokeWidth="1" strokeDasharray="4,3"><animate attributeName="strokeDashoffset" values="0;14" dur="3s" repeatCount="indefinite"/></line>
    <line x1="138" y1="108" x2="215" y2="90" stroke="rgba(245,158,11,0.25)" strokeWidth="1" strokeDasharray="4,3"><animate attributeName="strokeDashoffset" values="0;14" dur="3s" begin="0.5s" repeatCount="indefinite"/></line>
    <line x1="125" y1="118" x2="60" y2="110" stroke="rgba(45,212,191,0.25)" strokeWidth="1" strokeDasharray="4,3"><animate attributeName="strokeDashoffset" values="0;14" dur="3s" begin="1s" repeatCount="indefinite"/></line>
    <line x1="160" y1="132" x2="185" y2="100" stroke="rgba(59,130,246,0.25)" strokeWidth="1" strokeDasharray="4,3"><animate attributeName="strokeDashoffset" values="0;14" dur="3s" begin="1.5s" repeatCount="indefinite"/></line>
    <line x1="138" y1="108" x2="125" y2="118" stroke="rgba(212,168,83,0.18)" strokeWidth="0.8"/>
    <line x1="138" y1="108" x2="160" y2="132" stroke="rgba(212,168,83,0.18)" strokeWidth="0.8"/>
    <line x1="125" y1="118" x2="148" y2="158" stroke="rgba(45,212,191,0.18)" strokeWidth="0.8"/>
    <line x1="160" y1="132" x2="148" y2="158" stroke="rgba(245,158,11,0.18)" strokeWidth="0.8"/>
    <line x1="138" y1="108" x2="125" y2="118" stroke="rgba(212,168,83,0.3)" strokeWidth="1.2" strokeDasharray="2,2"><animate attributeName="strokeDashoffset" values="0;8" dur="2s" repeatCount="indefinite"/></line>
    <circle cx="140" cy="140" r="125" fill="none" stroke="rgba(212,168,83,0.06)" strokeWidth="0.5"/>
    <circle cx="140" cy="140" r="135" fill="none" stroke="rgba(212,168,83,0.03)" strokeWidth="0.5"/>
  </svg>
);

function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.unobserve(el); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`fade-in ${visible ? "visible" : ""} ${className}`}>{children}</div>;
}

export default function AcademicSite() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [researchTab, setResearchTab] = useState("papers");
  const [bulletinFilter, setBulletinFilter] = useState("Tous");
  const [bulletins, setBulletins] = useState(BULLETINS_INIT);
  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState({ title: "", excerpt: "", category: "Integration economique africaine", tags: "" });
  const [showPrivate, setShowPrivate] = useState(false);
  const [openCourses, setOpenCourses] = useState({});

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= 150) { setActiveSection(NAV_ITEMS[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };
  const toggleCourse = (code) => { setOpenCourses(prev => ({ ...prev, [code]: !prev[code] })); };

  const addBulletin = () => {
    if (!editorData.title.trim()) return;
    const now = new Date();
    const newB = {
      id: Date.now(),
      day: String(now.getDate()).padStart(2, "0"),
      month: now.toLocaleString("fr-FR", { month: "short" }).toUpperCase().replace(".", ""),
      year: String(now.getFullYear()),
      title: editorData.title, excerpt: editorData.excerpt,
      tags: editorData.tags.split(",").map(t => t.trim()).filter(Boolean),
      category: editorData.category
    };
    setBulletins(prev => [newB, ...prev]);
    setEditorData({ title: "", excerpt: "", category: "Integration economique africaine", tags: "" });
    setShowEditor(false);
  };

  const filteredBulletins = bulletinFilter === "Tous" ? bulletins : bulletins.filter(b => b.category === bulletinFilter);
  const privatePapers = RESEARCH_PAPERS.filter(p => p.visibility === "private");

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="nav-logo" onClick={() => scrollTo("home")}>I. Ouedraogo<span>- Economiste</span></a>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? "\u2715" : "\u2630"}</button>
          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            {NAV_ITEMS.map(n => (<button key={n.id} className={`nav-link ${activeSection === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>{n.label}</button>))}
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div>
            <div className="hero-badge"><span className="dot" /> Chercheur & Consultant</div>
            <h1>Ismael <span className="gold">Ouedraogo</span></h1>
            <p className="hero-subtitle">Economiste au Bureau de l'Economiste en chef pour l'Afrique, Banque mondiale. Docteur en economie (CERDI, Universite Clermont Auvergne). Specialiste de la geopolitique et des relations economiques internationales, avec un focus sur les dynamiques africaines.</p>
            <div className="expertise-grid" style={{ marginTop: "2rem" }}>
              {["Geopolitique & Economie", "FDI en Afrique", "Commerce bilateral", "Integration regionale", "Chaines de valeur", "Aide au developpement"].map(e => (<span key={e} className="expertise-pill">{e}</span>))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-map-card">
              <div className="map-label">Reseaux de recherche - Perspective mondiale</div>
              <GlobeIcon />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                {[{ c: "#D4A853", l: "Commerce" }, { c: "#2DD4BF", l: "FDI" }, { c: "#F59E0B", l: "APD" }, { c: "#3B82F6", l: "Geopolitique" }].map(i => (
                  <div key={i.l} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: i.c, display: "inline-block" }} />{i.l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-bg-alt">
        <section className="section" id="research">
          <FadeIn>
            <div className="section-header">
              <div className="section-tag">// Recherche</div>
              <h2 className="section-title">Travaux de recherche</h2>
              <p className="section-subtitle">Mes travaux se situent a l'intersection de la geopolitique et de l'economie internationale, avec un focus sur l'Afrique et ses dynamiques d'integration.</p>
              <div className="section-divider" />
            </div>
          </FadeIn>
          <div className="tabs">
            {[{ id: "papers", label: "Working Papers" }, { id: "themes", label: "Thematiques" }].map(t => (
              <button key={t.id} className={`tab-btn ${researchTab === t.id ? "active" : ""}`} onClick={() => setResearchTab(t.id)}>{t.label}</button>
            ))}
          </div>

          {researchTab === "papers" && (
            <>
              <div className="private-toggle">
                <label><input type="checkbox" checked={showPrivate} onChange={e => setShowPrivate(e.target.checked)} /> Afficher les travaux en cours (brouillons)</label>
              </div>
              <div className="card-grid cols-2">
                {RESEARCH_PAPERS.filter(p => p.visibility === "public").map((p, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div className="card">
                      <div className="card-accent" />
                      <div className="card-tag public">{p.status}</div>
                      <div className="card-title">{p.title}</div>
                      <div className="card-desc">{p.desc}</div>
                      {p.presentations && <div style={{ fontSize: "0.8rem", color: "var(--accent-teal)", marginTop: "0.5rem", fontStyle: "italic" }}>Presente : {p.presentations}</div>}
                      <div className="card-meta">
                        {p.tags.map(t => <span key={t} className="card-meta-item" style={{ color: "var(--accent-gold)" }}>#{t}</span>)}
                        <span className="card-meta-item" style={{ marginLeft: "auto" }}>{p.year}</span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
                {showPrivate && privatePapers.map((p, i) => (
                  <FadeIn key={`priv-${i}`} delay={(i + 2) * 100}>
                    <div className="card" style={{ borderColor: "rgba(100,116,139,0.15)" }}>
                      <div className="card-accent" style={{ background: "linear-gradient(90deg, #64748B, #475569)" }} />
                      <div className="card-tag private">{"\u{1F512}"} {p.status} - Brouillon</div>
                      <div className="card-title">{p.title}</div>
                      <div className="card-desc">{p.desc}</div>
                      <div className="lock-badge">{"\u{1F512}"} Visible uniquement par vous</div>
                      <div className="card-meta">
                        {p.tags.map(t => <span key={t} className="card-meta-item" style={{ color: "var(--text-muted)" }}>#{t}</span>)}
                        <span className="card-meta-item" style={{ marginLeft: "auto" }}>{p.year}</span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          {researchTab === "themes" && (
            <FadeIn>
              <div className="card-grid cols-3">
                {RESEARCH_THEMES.map((t, i) => (
                  <div key={i} className="card" style={{ textAlign: "center", padding: "2rem" }}>
                    <div className="card-accent" />
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem", opacity: 0.6 }}>{t.icon}</div>
                    <div className="card-title" style={{ fontSize: "1.05rem" }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </section>
      </div>

      <section className="section" id="bulletins">
        <FadeIn>
          <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="section-tag">// Bulletins</div>
              <h2 className="section-title">Analyses & Eclairages</h2>
              <p className="section-subtitle">Bulletins sur l'integration economique africaine, la geopolitique du Sahel et les chaines de valeur regionales.</p>
              <div className="section-divider" />
            </div>
            <button className="btn btn-primary" onClick={() => setShowEditor(true)} style={{ marginTop: "0.5rem" }}>+ Nouveau bulletin</button>
          </div>
        </FadeIn>
        <div className="tabs">
          {CATEGORIES.map(c => (<button key={c} className={`tab-btn ${bulletinFilter === c ? "active" : ""}`} onClick={() => setBulletinFilter(c)}>{c}</button>))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredBulletins.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Aucun bulletin dans cette categorie pour le moment.</div>}
          {filteredBulletins.map((b, i) => (
            <FadeIn key={b.id} delay={i * 80}>
              <div className="bulletin-card">
                <div className="bulletin-date"><div className="day">{b.day}</div><div className="month">{b.month}</div></div>
                <div>
                  <div className="bulletin-title">{b.title}</div>
                  <div className="bulletin-excerpt">{b.excerpt}</div>
                  <div className="bulletin-tags">{(b.tags || []).map(t => <span key={t} className="bulletin-tag">{t}</span>)}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="section-bg-alt">
        <section className="section" id="teaching">
          <FadeIn>
            <div className="section-header">
              <div className="section-tag">// Enseignement</div>
              <h2 className="section-title">Cours dispenses</h2>
              <p className="section-subtitle">Enseignements en economie a l'Universite Clermont Auvergne. Cliquez sur un cours pour en savoir plus.</p>
              <div className="section-divider" />
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-card)", overflow: "hidden" }}>
              {TEACHING.map((c) => (
                <div key={c.code} className="course-item" onClick={() => toggleCourse(c.code)}>
                  <div className="course-header">
                    <span className="course-code">{c.code}</span>
                    <div><div className="course-name">{c.name}</div><div className="course-detail">{c.detail}</div></div>
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.2rem 0.6rem", borderRadius: "6px", whiteSpace: "nowrap", marginRight: "1rem" }}>{c.level}</span>
                    <span className={`course-toggle ${openCourses[c.code] ? "open" : ""}`}>{"\u25BE"}</span>
                  </div>
                  <div className={`course-summary ${openCourses[c.code] ? "open" : ""}`}>{c.summary}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
      </div>

      <section className="section" id="about">
        <FadeIn><div className="section-header"><div className="section-tag">// A propos</div><h2 className="section-title">Parcours</h2><div className="section-divider" /></div></FadeIn>
        <div className="about-grid">
          <FadeIn delay={100}>
            <div className="about-sidebar">
              <div className="about-photo-frame"><div className="about-initials">IO</div></div>
              <div className="about-info-block">
                <div className="about-info-row"><span className="about-info-label">Position</span><span className="about-info-value">Consultant, AFRCE</span></div>
                <div className="about-info-row"><span className="about-info-label">Institution</span><span className="about-info-value">Banque mondiale</span></div>
                <div className="about-info-row"><span className="about-info-label">Doctorat</span><span className="about-info-value">CERDI, UCA</span></div>
                <div className="about-info-row"><span className="about-info-label">Base en</span><span className="about-info-value">France</span></div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "1.02rem" }}>Economiste specialise dans les relations economiques internationales a travers le prisme de la geopolitique. Ma these de doctorat, soutenue au CERDI (Universite Clermont Auvergne) sous la direction du Professeur Mary-Francoise Renard, porte sur la distance geopolitique et ses effets sur le commerce bilateral, l'aide publique au developpement des pays du CAD et les investissements directs etrangers (FDI) chinois en Afrique.</p>
              <p style={{ color: "var(--text-secondary)", marginBottom: "3rem", fontSize: "1.02rem" }}>Depuis septembre 2024, je suis consultant au Bureau de l'Economiste en chef pour l'Afrique (AFRCE) a la Banque mondiale, ou je contribue notamment au rapport phare "Integrating Africa Forward" et a des recherches sur la qualite de l'emploi dans les entreprises multinationales et les biens publics regionaux africains.</p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Parcours professionnel</h3>
              <div>
                <div className="timeline-item"><div className="timeline-year">2024 - Present</div><div className="timeline-role">Consultant, Office of the Chief Economist for Africa</div><div className="timeline-org">Banque mondiale</div></div>
                <div className="timeline-item"><div className="timeline-year">2023 - 2024</div><div className="timeline-role">ATER (Attache Temporaire d'Enseignement et de Recherche)</div><div className="timeline-org">Universite Clermont Auvergne - Clermont-Ferrand</div></div>
                <div className="timeline-item"><div className="timeline-year">2019 - 2023</div><div className="timeline-role">Doctorat en Sciences Economiques</div><div className="timeline-org">CERDI, Universite Clermont Auvergne - Dir. Prof. M.-F. Renard</div></div>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "1rem", marginTop: "2rem", color: "var(--text-primary)" }}>Conferences & presentations</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["CSAE Oxford", "INFER", "CEID", "World Bank BBL Series", "Prix jeunes chercheurs 2026"].map(c => (<span key={c} className="expertise-pill">{c}</span>))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-bg-alt">
        <section className="section" id="contact">
          <FadeIn>
            <div className="section-header" style={{ textAlign: "center" }}>
              <div className="section-tag">// Contact</div>
              <h2 className="section-title">Me contacter</h2>
              <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>Pour toute collaboration, invitation a conference ou question de recherche.</p>
              <div className="section-divider" style={{ margin: "1.25rem auto 0" }} />
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="contact-grid" style={{ maxWidth: 700, margin: "0 auto" }}>
              <div className="contact-card"><div className="contact-icon">{"\u{1F4E7}"}</div><div className="contact-label">Email professionnel</div><div className="contact-value"><a href="mailto:contact@ismael-ouedraogo.com">contact@ismael-ouedraogo.com</a></div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F3DB}"}</div><div className="contact-label">Affiliation</div><div className="contact-value">Banque mondiale - AFRCE</div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F4CD}"}</div><div className="contact-label">Localisation</div><div className="contact-value">France</div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F393}"}</div><div className="contact-label">Alma Mater</div><div className="contact-value">CERDI, Universite Clermont Auvergne</div></div>
            </div>
          </FadeIn>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-brand">Ismael Ouedraogo</div>
        <p>Economiste - Chercheur - Consultant</p>
        <p style={{ marginTop: "0.75rem", fontSize: "0.7rem" }}>{"\u00A9"} {new Date().getFullYear()} - Tous droits reserves</p>
      </footer>

      {showEditor && (
        <div className="editor-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowEditor(false); }}>
          <div className="editor-panel">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--accent-gold)" }}>Nouveau bulletin</h3>
            <div className="editor-field"><label className="editor-label">Titre</label><input className="editor-input" placeholder="Ex : L'integration economique en Afrique de l'Ouest" value={editorData.title} onChange={e => setEditorData(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="editor-field"><label className="editor-label">Categorie</label><select className="editor-input editor-select" value={editorData.category} onChange={e => setEditorData(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="editor-field"><label className="editor-label">Contenu / Resume</label><textarea className="editor-textarea" placeholder="Redigez votre analyse..." value={editorData.excerpt} onChange={e => setEditorData(p => ({ ...p, excerpt: e.target.value }))} /></div>
            <div className="editor-field"><label className="editor-label">Tags (separes par des virgules)</label><input className="editor-input" placeholder="Ex : ZLECAf, Commerce, CEDEAO" value={editorData.tags} onChange={e => setEditorData(p => ({ ...p, tags: e.target.value }))} /></div>
            <div className="editor-actions">
              <button className="btn btn-primary" onClick={addBulletin}>Publier le bulletin</button>
              <button className="btn btn-ghost" onClick={() => setShowEditor(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
