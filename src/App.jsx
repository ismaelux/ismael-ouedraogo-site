import { useState, useEffect, useRef } from "react";
import { BULLETINS_FR, BULLETINS_EN, CATEGORIES_FR, CATEGORIES_EN } from "./bulletins-data.js";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --bg-primary: #FAFAF8;
    --bg-secondary: #F2F0EC;
    --bg-card: #FFFFFF;
    --bg-card-hover: #FEFEFE;
    --accent-primary: #1A1A2E;
    --accent-gold: #B8860B;
    --accent-gold-light: #D4A853;
    --accent-teal: #2A6F6F;
    --accent-blue: #1E3A5F;
    --accent-red: #8B2500;
    --text-primary: #1A1A2E;
    --text-secondary: #4A4A5A;
    --text-muted: #8A8A9A;
    --border-subtle: rgba(0,0,0,0.08);
    --border-card: rgba(0,0,0,0.06);
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --max-width: 1200px;
    --reading-width: 720px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: var(--font-body); line-height: 1.7; overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: var(--accent-gold); color: #fff; }
  .scroll-progress { position: fixed; top: 0; left: 0; height: 2px; background: var(--accent-gold); z-index: 1000; transition: width 0.1s; }
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.2rem 2rem; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    background: rgba(250,250,248,0.9); backdrop-filter: blur(20px);
  }
  .nav.scrolled { padding: 0.7rem 2rem; box-shadow: 0 1px 0 var(--border-subtle); }
  .nav-inner { max-width: var(--max-width); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .nav-logo { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); cursor: pointer; text-decoration: none; letter-spacing: -0.02em; }
  .nav-logo span { color: var(--text-muted); font-family: var(--font-body); font-weight: 400; font-size: 0.8rem; margin-left: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .nav-links { display: flex; gap: 0.1rem; align-items: center; }
  .nav-link {
    padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.82rem; font-weight: 500;
    color: var(--text-muted); cursor: pointer; transition: all 0.25s;
    border: none; background: none; font-family: var(--font-body); letter-spacing: 0.02em;
  }
  .nav-link:hover { color: var(--text-primary); }
  .nav-link.active { color: var(--text-primary); background: rgba(0,0,0,0.04); }
  .lang-switch { display: flex; gap: 0.2rem; margin-left: 1rem; background: rgba(0,0,0,0.03); border-radius: 6px; padding: 0.15rem; }
  .lang-btn { padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--text-muted); font-family: var(--font-body); letter-spacing: 0.05em; transition: all 0.25s; }
  .lang-btn.active { background: var(--bg-card); color: var(--text-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .mobile-toggle { display: none; background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 1.3rem; }
  @media (max-width: 768px) {
    .mobile-toggle { display: block; }
    .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; background: rgba(250,250,248,0.98); backdrop-filter: blur(20px); padding: 1rem; border-bottom: 1px solid var(--border-subtle); }
    .nav-links.open { display: flex; }
    .lang-switch { margin-left: 0; margin-top: 0.5rem; align-self: center; }
  }
  .hero { min-height: 90vh; display: flex; align-items: center; position: relative; padding: 8rem 2rem 5rem; border-bottom: 1px solid var(--border-subtle); }
  .hero-content { max-width: var(--max-width); margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: center; }
  @media (max-width: 900px) { .hero-content { grid-template-columns: 1fr; text-align: center; } }
  .hero-tag { display: inline-block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent-gold); margin-bottom: 1.5rem; font-weight: 600; animation: fadeSlideUp 0.8s ease both; }
  .hero h1 { font-family: var(--font-display); font-size: clamp(2.8rem,5vw,4rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1.5rem; letter-spacing: -0.02em; animation: fadeSlideUp 0.8s 0.1s ease both; }
  .hero-subtitle { font-size: 1.05rem; color: var(--text-secondary); max-width: 520px; margin-bottom: 2rem; line-height: 1.8; font-weight: 300; animation: fadeSlideUp 0.8s 0.2s ease both; }
  .hero-fields { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; animation: fadeSlideUp 0.8s 0.3s ease both; }
  .hero-field { padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.78rem; font-weight: 500; border: 1px solid var(--border-subtle); color: var(--text-secondary); background: var(--bg-card); transition: all 0.3s; }
  .hero-field:hover { border-color: var(--accent-gold); color: var(--accent-gold); }
  .hero-visual { display: flex; justify-content: center; animation: fadeSlideUp 0.8s 0.4s ease both; }
  .hero-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; max-width: 380px; }
  .hero-stat { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
  .hero-stat:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); transform: translateY(-2px); }
  .hero-stat-number { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--accent-gold); line-height: 1; }
  .hero-stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-top: 0.4rem; }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
  .section { padding: 5rem 2rem; max-width: var(--max-width); margin: 0 auto; }
  .section-header { margin-bottom: 3rem; }
  .section-tag { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: var(--accent-gold); margin-bottom: 0.5rem; font-weight: 600; }
  .section-title { font-family: var(--font-display); font-size: clamp(1.8rem,3vw,2.5rem); font-weight: 700; color: var(--text-primary); line-height: 1.2; letter-spacing: -0.02em; }
  .section-subtitle { color: var(--text-secondary); margin-top: 0.75rem; max-width: 560px; font-size: 0.95rem; font-weight: 300; }
  .section-divider { width: 40px; height: 2px; background: var(--accent-gold); margin-top: 1.25rem; }
  .section-bg-alt { background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
  .tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; flex-wrap: wrap; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0; }
  .tab-btn { padding: 0.7rem 1.2rem; font-size: 0.82rem; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: all 0.3s; border: none; background: transparent; font-family: var(--font-body); border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .tab-btn:hover { color: var(--text-primary); }
  .tab-btn.active { color: var(--text-primary); border-bottom-color: var(--accent-gold); }
  .card-grid { display: grid; gap: 1.25rem; }
  .card-grid.cols-2 { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
  .card-grid.cols-3 { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 1.75rem; transition: all 0.35s; position: relative; }
  .card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); transform: translateY(-2px); }
  .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent-gold); opacity: 0; transition: opacity 0.3s; border-radius: 12px 12px 0 0; }
  .card:hover .card-accent { opacity: 1; }
  .card-tag { display: inline-block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600; margin-bottom: 0.75rem; }
  .card-tag.public { color: var(--accent-teal); background: rgba(42,111,111,0.08); }
  .card-tag.private { color: var(--text-muted); background: rgba(0,0,0,0.04); }
  .card-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.35; }
  .card-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; }
  .card-meta { display: flex; gap: 0.75rem; margin-top: 0.75rem; font-size: 0.72rem; color: var(--text-muted); flex-wrap: wrap; }
  .card-meta-item { display: flex; align-items: center; gap: 0.3rem; }
  .lock-badge { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem; }
  .bulletin-featured { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 2.5rem; margin-bottom: 2rem; cursor: pointer; transition: all 0.35s; display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: start; }
  .bulletin-featured:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
  .bulletin-featured .bulletin-title { font-size: 1.5rem; }
  .bulletin-featured .bulletin-excerpt { font-size: 0.95rem; }
  .bulletin-featured-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem; }
  .bulletin-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 1.75rem; display: grid; grid-template-columns: auto 1fr; gap: 1.5rem; transition: all 0.35s; cursor: pointer; align-items: start; }
  .bulletin-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); }
  .bulletin-date { text-align: center; padding: 0.6rem 0.75rem; min-width: 55px; }
  .bulletin-date .day { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
  .bulletin-date .month { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-top: 0.15rem; }
  .bulletin-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; line-height: 1.3; }
  .bulletin-excerpt { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; }
  .bulletin-tags { display: flex; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap; }
  .bulletin-tag { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.15rem 0.5rem; border-radius: 3px; border: 1px solid var(--border-subtle); color: var(--text-muted); font-weight: 500; }
  .bulletin-read-more { font-size: 0.78rem; color: var(--accent-gold); margin-top: 0.75rem; font-weight: 500; }
  .bulletin-card:hover .bulletin-read-more { text-decoration: underline; }
  .bulletin-reading-time { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem; }
  .article-overlay { position: fixed; inset: 0; z-index: 200; background: var(--bg-primary); overflow-y: auto; animation: articleIn 0.3s ease; }
  @keyframes articleIn { from { opacity: 0; } to { opacity: 1; } }
  .article-container { max-width: var(--reading-width); margin: 0 auto; padding: 2rem 2rem 5rem; }
  .article-back-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: none; border: 1px solid var(--border-subtle); color: var(--text-secondary); padding: 0.5rem 1.2rem; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-family: var(--font-body); margin-bottom: 2.5rem; transition: all 0.25s; }
  .article-back-btn:hover { border-color: var(--accent-gold); color: var(--accent-gold); }
  .article-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; font-size: 0.78rem; color: var(--text-muted); flex-wrap: wrap; }
  .article-meta-cat { background: rgba(184,134,11,0.08); padding: 0.2rem 0.7rem; border-radius: 3px; color: var(--accent-gold); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
  .article-title { font-family: var(--font-display); font-size: clamp(1.8rem,3.5vw,2.4rem); font-weight: 700; color: var(--text-primary); line-height: 1.2; margin-bottom: 1rem; letter-spacing: -0.02em; }
  .article-tags { display: flex; gap: 0.4rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .article-tag { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; border-radius: 3px; border: 1px solid var(--border-subtle); color: var(--text-muted); }
  .article-divider { width: 40px; height: 2px; background: var(--accent-gold); margin-bottom: 2rem; }
  .article-section { margin-bottom: 1.75rem; }
  .article-sh { font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.6rem; line-height: 1.3; }
  .article-p { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.9; margin-bottom: 0.75rem; text-align: justify; }
  .article-sources { margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); }
  .article-sources .article-sh { font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-body); font-weight: 600; }
  .article-sources .article-p { font-size: 0.78rem; color: var(--text-muted); line-height: 1.7; font-family: var(--font-mono); font-size: 0.72rem; }
  .course-item { border-bottom: 1px solid var(--border-subtle); transition: background 0.3s; cursor: pointer; }
  .course-item:last-child { border-bottom: none; }
  .course-item:hover { background: rgba(0,0,0,0.01); }
  .course-header { display: flex; gap: 1.5rem; padding: 1.25rem 1.5rem; align-items: center; }
  .course-code { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-gold); white-space: nowrap; background: rgba(184,134,11,0.06); padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 500; }
  .course-name { font-weight: 600; color: var(--text-primary); font-size: 0.95rem; }
  .course-detail { font-size: 0.82rem; color: var(--text-muted); }
  .course-toggle { margin-left: auto; font-size: 1rem; color: var(--text-muted); transition: transform 0.3s; }
  .course-toggle.open { transform: rotate(180deg); }
  .course-summary { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.3s; padding: 0 1.5rem 0 4.5rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.8; }
  .course-summary.open { max-height: 500px; padding: 0 1.5rem 1.5rem 4.5rem; }
  @media (max-width: 768px) { .course-summary, .course-summary.open { padding-left: 1.5rem; } }
  .about-grid { display: grid; grid-template-columns: 280px 1fr; gap: 4rem; align-items: start; }
  @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
  .about-sidebar { position: sticky; top: 100px; }
  .about-photo-frame { width: 100%; aspect-ratio: 1; border-radius: 12px; background: var(--bg-secondary); border: 1px solid var(--border-card); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .about-compact { margin-top: 1.25rem; }
  .about-role { display: flex; align-items: baseline; gap: 0.5rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border-subtle); }
  .about-role:last-child { border-bottom: none; }
  .about-role-title { font-weight: 600; color: var(--text-primary); font-size: 0.88rem; }
  .about-role-org { color: var(--text-secondary); font-size: 0.82rem; }
  .about-role-period { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); margin-left: auto; white-space: nowrap; }
  .about-text { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.85; margin-bottom: 1.5rem; }
  .about-affiliations { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
  .about-affiliation { padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.78rem; font-weight: 500; border: 1px solid var(--border-subtle); color: var(--text-secondary); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
  .contact-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 1.75rem; text-align: center; transition: all 0.3s; }
  .contact-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
  .contact-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
  .contact-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.3rem; font-weight: 600; }
  .contact-value { color: var(--text-primary); font-weight: 500; font-size: 0.9rem; }
  .contact-value a { color: var(--accent-gold); text-decoration: none; }
  .contact-value a:hover { text-decoration: underline; }
  .footer { border-top: 1px solid var(--border-subtle); padding: 3rem 2rem; text-align: center; color: var(--text-muted); font-size: 0.78rem; }
  .footer-brand { font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.3rem; font-weight: 600; }
  .fade-in { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .private-toggle { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--text-muted); }
  .private-toggle label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .private-toggle input[type="checkbox"] { accent-color: var(--accent-gold); width: 14px; height: 14px; }
`;

const T = {
  fr: {
    navSubtitle: "\u00C9conomiste",
    heroTag: "\u00C9conomiste \u00B7 Chercheur \u00B7 Consultant",
    heroSubtitle: "Consultant au Bureau de l\u2019\u00C9conomiste en chef pour l\u2019Afrique, Banque mondiale. Docteur en \u00e9conomie du CERDI (Universit\u00e9 Clermont Auvergne). Recherche en g\u00e9opolitique \u00e9conomique, commerce international et dynamiques d\u2019int\u00e9gration africaine.",
    heroFields: ["G\u00e9opolitique \u00e9conomique", "Commerce international", "Int\u00e9gration africaine", "Cha\u00eenes de valeur", "\u00C9conomie du Sahel"],
    statWP: "Working Papers",
    statAnalyses: "Analyses",
    statCourses: "Cours dispens\u00e9s",
    statConf: "Conf\u00e9rences",
    sectionResearchTag: "Recherche",
    sectionResearchTitle: "Travaux de recherche",
    sectionResearchSub: "\u00C0 l\u2019intersection de la g\u00e9opolitique et de l\u2019\u00e9conomie internationale, avec un focus sur les dynamiques africaines.",
    tabPapers: "Working Papers",
    tabThemes: "Th\u00e9matiques",
    showPrivate: "Afficher les travaux en cours",
    presentedAt: "Pr\u00e9sent\u00e9 \u00e0 : ",
    draftLabel: "Brouillon - visible uniquement par vous",
    sectionBulletinTag: "Analyses \u00e9conomiques",
    sectionBulletinTitle: "\u00C9clairages & Analyses",
    sectionBulletinSub: "Analyses structur\u00e9es mobilisant les outils de la th\u00e9orie \u00e9conomique sur les dynamiques africaines contemporaines.",
    latestLabel: "Derni\u00e8re analyse",
    readMin: "min de lecture",
    readMore: "\u2192 Lire l\u2019analyse",
    noAnalysis: "Aucune analyse dans cette cat\u00e9gorie pour le moment.",
    sectionTeachingTag: "Enseignement",
    sectionTeachingTitle: "Cours dispens\u00e9s",
    sectionTeachingSub: "Enseignements en \u00e9conomie \u00e0 l\u2019Universit\u00e9 Clermont Auvergne (2022-2026).",
    sectionAboutTag: "Profil",
    sectionAboutTitle: "\u00C0 propos",
    aboutText1: "\u00C9conomiste sp\u00e9cialis\u00e9 dans les relations \u00e9conomiques internationales \u00e0 travers le prisme de la g\u00e9opolitique. Mes recherches portent sur la distance g\u00e9opolitique et ses effets sur le commerce bilat\u00e9ral, l\u2019aide publique au d\u00e9veloppement et les investissements directs \u00e9trangers en Afrique.",
    aboutText2: "Au sein du Bureau de l\u2019\u00C9conomiste en chef pour l\u2019Afrique \u00e0 la Banque mondiale, je contribue au rapport phare \u201CIntegrating Africa Forward\u201D et \u00e0 des recherches sur la qualit\u00e9 de l\u2019emploi dans les entreprises multinationales et les biens publics r\u00e9gionaux africains.",
    aboutText3: "Parall\u00e8lement, je d\u00e9veloppe sur ce site des analyses \u00e9conomiques structur\u00e9es sur les dynamiques africaines contemporaines, en mobilisant les outils de la th\u00e9orie \u00e9conomique pour offrir un \u00e9clairage acad\u00e9mique qui d\u00e9passe le simple commentaire journalistique.",
    confTitle: "Conf\u00e9rences & pr\u00e9sentations",
    sectionContactTag: "Contact",
    sectionContactTitle: "Me contacter",
    sectionContactSub: "Collaborations, invitations \u00e0 conf\u00e9rences ou questions de recherche.",
    contactEmail: "Email",
    contactAffiliation: "Affiliation",
    contactBase: "Base",
    contactFormation: "Formation",
    backBtn: "\u2190 Retour",
    navHome: "Accueil",
    navResearch: "Recherche",
    navBulletins: "Analyses",
    navTeaching: "Enseignement",
    navAbout: "Profil",
    navContact: "Contact",
    roleConsultant: "Consultant, AFRCE",
    roleTeacher: "Enseignant en \u00e9conomie",
    rolePhD: "Doctorat en Sciences \u00C9conomiques",
    orgWB: "Banque mondiale",
    orgUCA: "Universit\u00e9 Clermont Auvergne",
    orgCERDI: "CERDI, UCA",
  },
  en: {
    navSubtitle: "Economist",
    heroTag: "Economist \u00B7 Researcher \u00B7 Consultant",
    heroSubtitle: "Consultant at the Office of the Chief Economist for Africa, World Bank. PhD in Economics from CERDI (Universit\u00e9 Clermont Auvergne). Research in economic geopolitics, international trade and African integration dynamics.",
    heroFields: ["Economic Geopolitics", "International Trade", "African Integration", "Value Chains", "Sahel Economics"],
    statWP: "Working Papers",
    statAnalyses: "Analyses",
    statCourses: "Courses Taught",
    statConf: "Conferences",
    sectionResearchTag: "Research",
    sectionResearchTitle: "Research Work",
    sectionResearchSub: "At the intersection of geopolitics and international economics, with a focus on African dynamics.",
    tabPapers: "Working Papers",
    tabThemes: "Themes",
    showPrivate: "Show work in progress",
    presentedAt: "Presented at: ",
    draftLabel: "Draft - visible only to you",
    sectionBulletinTag: "Economic Analyses",
    sectionBulletinTitle: "Insights & Analyses",
    sectionBulletinSub: "Structured analyses drawing on economic theory tools to examine contemporary African dynamics.",
    latestLabel: "Latest analysis",
    readMin: "min read",
    readMore: "\u2192 Read the analysis",
    noAnalysis: "No analysis in this category yet.",
    sectionTeachingTag: "Teaching",
    sectionTeachingTitle: "Courses Taught",
    sectionTeachingSub: "Economics courses at Universit\u00e9 Clermont Auvergne (2022-2026).",
    sectionAboutTag: "Profile",
    sectionAboutTitle: "About",
    aboutText1: "Economist specializing in international economic relations through the lens of geopolitics. My research focuses on geopolitical distance and its effects on bilateral trade, official development assistance and foreign direct investment in Africa.",
    aboutText2: "Within the Office of the Chief Economist for Africa at the World Bank, I contribute to the flagship report \u201CIntegrating Africa Forward\u201D and to research on job quality in multinational enterprises and African regional public goods.",
    aboutText3: "In parallel, I develop on this site structured economic analyses on contemporary African dynamics, drawing on economic theory tools to offer an academic perspective that goes beyond simple journalistic commentary.",
    confTitle: "Conferences & Presentations",
    sectionContactTag: "Contact",
    sectionContactTitle: "Get in Touch",
    sectionContactSub: "Collaborations, conference invitations or research inquiries.",
    contactEmail: "Email",
    contactAffiliation: "Affiliation",
    contactBase: "Location",
    contactFormation: "Education",
    backBtn: "\u2190 Back",
    navHome: "Home",
    navResearch: "Research",
    navBulletins: "Analyses",
    navTeaching: "Teaching",
    navAbout: "Profile",
    navContact: "Contact",
    roleConsultant: "Consultant, AFRCE",
    roleTeacher: "Economics Lecturer",
    rolePhD: "PhD in Economics",
    orgWB: "World Bank",
    orgUCA: "Universit\u00e9 Clermont Auvergne",
    orgCERDI: "CERDI, UCA",
  }
};

const RESEARCH_PAPERS_FR = [
  { title: "Friendship is as Important as Neighborhood: Geopolitical Distance and Bilateral Trade", desc: "Analyse l\u2019impact de la distance g\u00e9opolitique sur le commerce bilat\u00e9ral, en utilisant des mod\u00e8les de gravit\u00e9 et l\u2019estimation PPML.", tags: ["Commerce bilat\u00e9ral", "G\u00e9opolitique", "PPML"], year: "2024", status: "Working Paper", visibility: "public", presentations: "CSAE Oxford, INFER, CEID" },
  { title: "Geopolitical Dynamics and the Effectiveness of Regional Trade Agreements", desc: "\u00C9value comment les dynamiques g\u00e9opolitiques influencent l\u2019efficacit\u00e9 des accords commerciaux r\u00e9gionaux.", tags: ["Accords commerciaux", "G\u00e9opolitique", "Panel data"], year: "2024", status: "Working Paper", visibility: "public", presentations: "World Bank Brown Bag Lunch Series" },
  { title: "Regional Public Goods and African Integration: A Polycentric Governance Framework", desc: "Propose un cadre de gouvernance polycentrique pour les biens publics r\u00e9gionaux et l\u2019int\u00e9gration africaine.", tags: ["Int\u00e9gration africaine", "Biens publics r\u00e9gionaux", "Gouvernance"], year: "2025", status: "En cours", visibility: "private" },
  { title: "China-Africa Value Chains: Structural Asymmetries and Belt & Road Effects", desc: "Analyse les cha\u00eenes de valeur Chine-Afrique avec les donn\u00e9es EORA MRIO, en \u00e9valuant les asym\u00e9tries structurelles et les effets de la BRI.", tags: ["Chine-Afrique", "Cha\u00eenes de valeur", "BRI"], year: "2025", status: "En cours", visibility: "private" },
];

const RESEARCH_PAPERS_EN = [
  { title: "Friendship is as Important as Neighborhood: Geopolitical Distance and Bilateral Trade", desc: "Analyzes the impact of geopolitical distance on bilateral trade, using gravity models and PPML estimation.", tags: ["Bilateral Trade", "Geopolitics", "PPML"], year: "2024", status: "Working Paper", visibility: "public", presentations: "CSAE Oxford, INFER, CEID" },
  { title: "Geopolitical Dynamics and the Effectiveness of Regional Trade Agreements", desc: "Evaluates how geopolitical dynamics influence the effectiveness of regional trade agreements.", tags: ["Trade Agreements", "Geopolitics", "Panel Data"], year: "2024", status: "Working Paper", visibility: "public", presentations: "World Bank Brown Bag Lunch Series" },
  { title: "Regional Public Goods and African Integration: A Polycentric Governance Framework", desc: "Proposes a polycentric governance framework for regional public goods and African integration.", tags: ["African Integration", "Regional Public Goods", "Governance"], year: "2025", status: "In progress", visibility: "private" },
  { title: "China-Africa Value Chains: Structural Asymmetries and Belt & Road Effects", desc: "Analyzes China-Africa value chains using EORA MRIO data, assessing structural asymmetries and BRI effects.", tags: ["China-Africa", "Value Chains", "BRI"], year: "2025", status: "In progress", visibility: "private" },
];

const RESEARCH_THEMES_FR = [
  { icon: "\u{1F310}", label: "G\u00e9opolitique et relations \u00e9conomiques" },
  { icon: "\u{1F4B0}", label: "Investissements directs \u00e9trangers (FDI) en Afrique" },
  { icon: "\u{1F91D}", label: "Aide publique au d\u00e9veloppement (APD)" },
  { icon: "\u{1F517}", label: "Int\u00e9gration \u00e9conomique r\u00e9gionale" },
  { icon: "\u26A1", label: "Cha\u00eenes de valeur mondiales et r\u00e9gionales" },
  { icon: "\u{1F4CA}", label: "Commerce bilat\u00e9ral" },
  { icon: "\u{1F3DB}", label: "\u00C9conomie politique du Sahel" },
];

const RESEARCH_THEMES_EN = [
  { icon: "\u{1F310}", label: "Geopolitics and Economic Relations" },
  { icon: "\u{1F4B0}", label: "Foreign Direct Investment (FDI) in Africa" },
  { icon: "\u{1F91D}", label: "Official Development Assistance (ODA)" },
  { icon: "\u{1F517}", label: "Regional Economic Integration" },
  { icon: "\u26A1", label: "Global and Regional Value Chains" },
  { icon: "\u{1F4CA}", label: "Bilateral Trade" },
  { icon: "\u{1F3DB}", label: "Political Economy of the Sahel" },
];

const TEACHING_FR = [
  { code: "MACRO", name: "Macro\u00e9conomie", detail: "Licence - UCA / Clermont-Ferrand", level: "L2-L3", summary: "\u00C9tude des grandes fonctions macro\u00e9conomiques : consommation, investissement, demande globale, politiques budg\u00e9taire et mon\u00e9taire. Analyse des mod\u00e8les IS-LM, des fluctuations conjoncturelles et de la croissance \u00e9conomique \u00e0 long terme. Applications aux \u00e9conomies en d\u00e9veloppement." },
  { code: "ECMTR", name: "\u00C9conom\u00e9trie", detail: "Licence & Master - UCA", level: "L3-M1", summary: "Introduction aux m\u00e9thodes \u00e9conom\u00e9triques : r\u00e9gressions lin\u00e9aires simples et multiples, moindres carr\u00e9s ordinaires (MCO), tests d\u2019hypoth\u00e8ses, h\u00e9t\u00e9rosc\u00e9dasticit\u00e9, endog\u00e9n\u00e9it\u00e9 et variables instrumentales. Applications sur donn\u00e9es r\u00e9elles avec Stata et R." },
  { code: "INTEC", name: "\u00C9conomie internationale", detail: "Licence - UCA", level: "L3", summary: "Th\u00e9ories du commerce international : avantages comparatifs (Ricardo, HOS), nouvelles th\u00e9ories du commerce (Krugman), mod\u00e8les de gravit\u00e9. Politiques commerciales, int\u00e9gration r\u00e9gionale, libre-\u00e9change vs protectionnisme. \u00C9tudes de cas sur les accords commerciaux et l\u2019OMC." },
  { code: "STATS", name: "Statistiques", detail: "Licence - UCA", level: "L1-L2", summary: "Fondements de la statistique descriptive et inf\u00e9rentielle : mesures de tendance centrale et de dispersion, distributions de probabilit\u00e9, estimation et intervalles de confiance, tests param\u00e9triques et non param\u00e9triques. Exercices appliqu\u00e9s sur donn\u00e9es socio-\u00e9conomiques." },
  { code: "MATHS", name: "Math\u00e9matiques appliqu\u00e9es", detail: "Licence - UCA", level: "L1-L2", summary: "Outils math\u00e9matiques pour l\u2019\u00e9conomie : analyse (fonctions, d\u00e9riv\u00e9es, int\u00e9grales), alg\u00e8bre lin\u00e9aire (matrices, syst\u00e8mes d\u2019\u00e9quations), optimisation sous contrainte (Lagrangien). Applications aux probl\u00e8mes \u00e9conomiques classiques : maximisation de l\u2019utilit\u00e9, minimisation des co\u00fbts." },
];

const TEACHING_EN = [
  { code: "MACRO", name: "Macroeconomics", detail: "Undergraduate - UCA / Clermont-Ferrand", level: "L2-L3", summary: "Study of core macroeconomic functions: consumption, investment, aggregate demand, fiscal and monetary policies. Analysis of IS-LM models, business cycles and long-term economic growth. Applications to developing economies." },
  { code: "ECMTR", name: "Econometrics", detail: "Undergraduate & Master - UCA", level: "L3-M1", summary: "Introduction to econometric methods: simple and multiple linear regressions, ordinary least squares (OLS), hypothesis testing, heteroscedasticity, endogeneity and instrumental variables. Applied exercises using real data with Stata and R." },
  { code: "INTEC", name: "International Economics", detail: "Undergraduate - UCA", level: "L3", summary: "International trade theories: comparative advantages (Ricardo, HOS), new trade theories (Krugman), gravity models. Trade policies, regional integration, free trade vs protectionism. Case studies on trade agreements and the WTO." },
  { code: "STATS", name: "Statistics", detail: "Undergraduate - UCA", level: "L1-L2", summary: "Foundations of descriptive and inferential statistics: measures of central tendency and dispersion, probability distributions, estimation and confidence intervals, parametric and non-parametric tests. Applied exercises on socio-economic data." },
  { code: "MATHS", name: "Applied Mathematics", detail: "Undergraduate - UCA", level: "L1-L2", summary: "Mathematical tools for economics: analysis (functions, derivatives, integrals), linear algebra (matrices, systems of equations), constrained optimization (Lagrangian). Applications to classic economic problems: utility maximization, cost minimization." },
];

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

function estimateReadingTime(content) {
  if (!content) return 0;
  const words = content.reduce((sum, s) => sum + s.paragraphs.join(" ").split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 220));
}

export default function AcademicSite() {
  const [lang, setLang] = useState("fr");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [researchTab, setResearchTab] = useState("papers");
  const [bulletinFilter, setBulletinFilter] = useState(null);
  const [selectedBulletin, setSelectedBulletin] = useState(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [openCourses, setOpenCourses] = useState({});

  const t = T[lang];
  const bulletins = lang === "fr" ? BULLETINS_FR : BULLETINS_EN;
  const categories = lang === "fr" ? CATEGORIES_FR : CATEGORIES_EN;
  const papers = lang === "fr" ? RESEARCH_PAPERS_FR : RESEARCH_PAPERS_EN;
  const themes = lang === "fr" ? RESEARCH_THEMES_FR : RESEARCH_THEMES_EN;
  const teaching = lang === "fr" ? TEACHING_FR : TEACHING_EN;
  const allCat = categories[0];

  const activeFilter = bulletinFilter || allCat;

  const NAV_ITEMS = [
    { id: "home", label: t.navHome },
    { id: "research", label: t.navResearch },
    { id: "bulletins", label: t.navBulletins },
    { id: "teaching", label: t.navTeaching },
    { id: "about", label: t.navAbout },
    { id: "contact", label: t.navContact },
  ];

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(style); document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      const navIds = ["home","research","bulletins","teaching","about","contact"];
      const sections = navIds.map(id => document.getElementById(id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= 150) { setActiveSection(navIds[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setBulletinFilter(null); }, [lang]);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };
  const toggleCourse = (code) => { setOpenCourses(prev => ({ ...prev, [code]: !prev[code] })); };

  const filteredBulletins = activeFilter === allCat ? bulletins : bulletins.filter(b => b.category === activeFilter);
  const privatePapers = papers.filter(p => p.visibility === "private");

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="nav-logo" onClick={() => scrollTo("home")}>Isma\u00ebl Ouedraogo<span>{t.navSubtitle}</span></a>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? "\u2715" : "\u2630"}</button>
          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            {NAV_ITEMS.map(n => (<button key={n.id} className={`nav-link ${activeSection === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>{n.label}</button>))}
            <div className="lang-switch">
              <button className={`lang-btn ${lang === "fr" ? "active" : ""}`} onClick={() => setLang("fr")}>FR</button>
              <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div>
            <div className="hero-tag">{t.heroTag}</div>
            <h1>Isma\u00ebl Ouedraogo</h1>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <div className="hero-fields">
              {t.heroFields.map(e => (<span key={e} className="hero-field">{e}</span>))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-number">4</div><div className="hero-stat-label">{t.statWP}</div></div>
              <div className="hero-stat"><div className="hero-stat-number">{bulletins.length}</div><div className="hero-stat-label">{t.statAnalyses}</div></div>
              <div className="hero-stat"><div className="hero-stat-number">5</div><div className="hero-stat-label">{t.statCourses}</div></div>
              <div className="hero-stat"><div className="hero-stat-number">5+</div><div className="hero-stat-label">{t.statConf}</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-bg-alt">
        <section className="section" id="research">
          <FadeIn>
            <div className="section-header">
              <div className="section-tag">{t.sectionResearchTag}</div>
              <h2 className="section-title">{t.sectionResearchTitle}</h2>
              <p className="section-subtitle">{t.sectionResearchSub}</p>
              <div className="section-divider" />
            </div>
          </FadeIn>
          <div className="tabs">
            {[{ id: "papers", label: t.tabPapers }, { id: "themes", label: t.tabThemes }].map(tab => (
              <button key={tab.id} className={`tab-btn ${researchTab === tab.id ? "active" : ""}`} onClick={() => setResearchTab(tab.id)}>{tab.label}</button>
            ))}
          </div>

          {researchTab === "papers" && (
            <>
              <div className="private-toggle">
                <label><input type="checkbox" checked={showPrivate} onChange={e => setShowPrivate(e.target.checked)} /> {t.showPrivate}</label>
              </div>
              <div className="card-grid cols-2">
                {papers.filter(p => p.visibility === "public").map((p, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div className="card">
                      <div className="card-accent" />
                      <div className="card-tag public">{p.status}</div>
                      <div className="card-title">{p.title}</div>
                      <div className="card-desc">{p.desc}</div>
                      {p.presentations && <div style={{ fontSize: "0.78rem", color: "var(--accent-teal)", marginTop: "0.5rem", fontStyle: "italic" }}>{t.presentedAt}{p.presentations}</div>}
                      <div className="card-meta">
                        {p.tags.map(tg => <span key={tg} className="card-meta-item" style={{ color: "var(--accent-gold)" }}>#{tg}</span>)}
                        <span className="card-meta-item" style={{ marginLeft: "auto" }}>{p.year}</span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
                {showPrivate && privatePapers.map((p, i) => (
                  <FadeIn key={`priv-${i}`} delay={(i + 2) * 100}>
                    <div className="card" style={{ borderStyle: "dashed" }}>
                      <div className="card-accent" style={{ background: "var(--text-muted)" }} />
                      <div className="card-tag private">{"\u{1F512}"} {p.status}</div>
                      <div className="card-title">{p.title}</div>
                      <div className="card-desc">{p.desc}</div>
                      <div className="lock-badge">{"\u{1F512}"} {t.draftLabel}</div>
                      <div className="card-meta">
                        {p.tags.map(tg => <span key={tg} className="card-meta-item" style={{ color: "var(--text-muted)" }}>#{tg}</span>)}
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
                {themes.map((th, i) => (
                  <div key={i} className="card" style={{ textAlign: "center", padding: "2rem" }}>
                    <div className="card-accent" />
                    <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem", opacity: 0.5 }}>{th.icon}</div>
                    <div className="card-title" style={{ fontSize: "1rem" }}>{th.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </section>
      </div>

      <section className="section" id="bulletins">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">{t.sectionBulletinTag}</div>
            <h2 className="section-title">{t.sectionBulletinTitle}</h2>
            <p className="section-subtitle">{t.sectionBulletinSub}</p>
            <div className="section-divider" />
          </div>
        </FadeIn>
        <div className="tabs">
          {categories.map(c => (<button key={c} className={`tab-btn ${activeFilter === c ? "active" : ""}`} onClick={() => setBulletinFilter(c)}>{c}</button>))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredBulletins.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>{t.noAnalysis}</div>}
          {filteredBulletins.map((b, i) => (
            <FadeIn key={b.id} delay={i * 80}>
              <div className={i === 0 && activeFilter === allCat ? "bulletin-featured" : "bulletin-card"} onClick={() => setSelectedBulletin(b)}>
                <div className="bulletin-date"><div className="day">{b.day}</div><div className="month">{b.month}</div></div>
                <div>
                  {i === 0 && activeFilter === allCat && <div className="bulletin-featured-label">{t.latestLabel}</div>}
                  <div className="bulletin-title">{b.title}</div>
                  <div className="bulletin-excerpt">{b.excerpt}</div>
                  <div className="bulletin-reading-time">{estimateReadingTime(b.content)} {t.readMin}</div>
                  <div className="bulletin-tags">{(b.tags || []).map(tg => <span key={tg} className="bulletin-tag">{tg}</span>)}</div>
                  <div className="bulletin-read-more">{t.readMore}</div>
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
              <div className="section-tag">{t.sectionTeachingTag}</div>
              <h2 className="section-title">{t.sectionTeachingTitle}</h2>
              <p className="section-subtitle">{t.sectionTeachingSub}</p>
              <div className="section-divider" />
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-card)", overflow: "hidden" }}>
              {teaching.map((c) => (
                <div key={c.code} className="course-item" onClick={() => toggleCourse(c.code)}>
                  <div className="course-header">
                    <span className="course-code">{c.code}</span>
                    <div><div className="course-name">{c.name}</div><div className="course-detail">{c.detail}</div></div>
                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--text-muted)", background: "rgba(0,0,0,0.03)", padding: "0.15rem 0.5rem", borderRadius: "4px", whiteSpace: "nowrap", marginRight: "1rem" }}>{c.level}</span>
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
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">{t.sectionAboutTag}</div>
            <h2 className="section-title">{t.sectionAboutTitle}</h2>
            <div className="section-divider" />
          </div>
        </FadeIn>
        <div className="about-grid">
          <FadeIn delay={100}>
            <div className="about-sidebar">
              <div className="about-photo-frame"><img src="/photo-ismael.jpg" alt="Isma\u00ebl Ouedraogo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-family: Playfair Display, serif; font-size: 4rem; font-weight: 700; color: #B8860B; opacity: 0.3;">IO</span>'; }} /></div>
              <div className="about-compact">
                <div className="about-role">
                  <div><div className="about-role-title">{t.roleConsultant}</div><div className="about-role-org">{t.orgWB}</div></div>
                  <div className="about-role-period">2024 -</div>
                </div>
                <div className="about-role">
                  <div><div className="about-role-title">{t.roleTeacher}</div><div className="about-role-org">{t.orgUCA}</div></div>
                  <div className="about-role-period">2022 - 2026</div>
                </div>
                <div className="about-role">
                  <div><div className="about-role-title">{t.rolePhD}</div><div className="about-role-org">{t.orgCERDI}</div></div>
                  <div className="about-role-period">2023</div>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div>
              <p className="about-text">{t.aboutText1}</p>
              <p className="about-text">{t.aboutText2}</p>
              <p className="about-text">{t.aboutText3}</p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "0.75rem", marginTop: "1rem", color: "var(--text-primary)" }}>{t.confTitle}</h3>
              <div className="about-affiliations">
                {["CSAE Oxford", "INFER", "CEID", "World Bank BBL Series", "Prix jeunes chercheurs 2026"].map(c => (<span key={c} className="about-affiliation">{c}</span>))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-bg-alt">
        <section className="section" id="contact">
          <FadeIn>
            <div className="section-header" style={{ textAlign: "center" }}>
              <div className="section-tag">{t.sectionContactTag}</div>
              <h2 className="section-title">{t.sectionContactTitle}</h2>
              <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>{t.sectionContactSub}</p>
              <div className="section-divider" style={{ margin: "1.25rem auto 0" }} />
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="contact-grid" style={{ maxWidth: 640, margin: "0 auto" }}>
              <div className="contact-card"><div className="contact-icon">{"\u{1F4E7}"}</div><div className="contact-label">{t.contactEmail}</div><div className="contact-value"><a href="mailto:contact@ismael-ouedraogo.com">contact@ismael-ouedraogo.com</a></div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F3DB}"}</div><div className="contact-label">{t.contactAffiliation}</div><div className="contact-value">{t.orgWB} - AFRCE</div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F4CD}"}</div><div className="contact-label">{t.contactBase}</div><div className="contact-value">France</div></div>
              <div className="contact-card"><div className="contact-icon">{"\u{1F393}"}</div><div className="contact-label">{t.contactFormation}</div><div className="contact-value">CERDI, Universit\u00e9 Clermont Auvergne</div></div>
            </div>
          </FadeIn>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-brand">Isma\u00ebl Ouedraogo</div>
        <p>{t.heroTag}</p>
        <p style={{ marginTop: "0.5rem" }}>{"\u00A9"} {new Date().getFullYear()}</p>
      </footer>

      {selectedBulletin && (
        <div className="article-overlay">
          <div className="article-container">
            <button className="article-back-btn" onClick={() => setSelectedBulletin(null)}>{t.backBtn}</button>
            <div className="article-meta">
              <span>{selectedBulletin.day} {selectedBulletin.month} {selectedBulletin.year}</span>
              <span className="article-meta-cat">{selectedBulletin.category}</span>
              <span>{estimateReadingTime(selectedBulletin.content)} {t.readMin}</span>
            </div>
            <h1 className="article-title">{selectedBulletin.title}</h1>
            <div className="article-tags">{(selectedBulletin.tags || []).map(tg => <span key={tg} className="article-tag">{tg}</span>)}</div>
            <div className="article-divider" />
            {(selectedBulletin.content || []).map((s, i) => (
              <div key={i} className={s.heading === "Sources" ? "article-sources" : "article-section"}>
                {s.heading && <h2 className="article-sh">{s.heading}</h2>}
                {s.paragraphs.map((p, j) => <p key={j} className="article-p">{p}</p>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
