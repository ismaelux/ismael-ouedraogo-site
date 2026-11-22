// Après la construction : une petite page par analyse et par langue (/analyse/<id>-<langue>/),
// avec ses propres balises de partage (titre, résumé, image), qui renvoie ensuite vers l'analyse dans le site.
// LinkedIn, X et les moteurs de recherche lisent ces balises ; les lecteurs sont redirigés aussitôt.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { BULLETINS_FR, BULLETINS_EN } from "../src/bulletins-data.js";
import { BULLETINS_ZH } from "../src/bulletins-zh.js";

const SITE = "https://www.ismael-ouedraogo.com";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (s) => String(s).replace(/\[\^\d+\]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const LOCALE = { fr: "fr_FR", en: "en_GB", zh: "zh_CN" };
const sets = { fr: BULLETINS_FR, en: BULLETINS_EN, zh: BULLETINS_ZH };
let n = 0;
for (const [lang, list] of Object.entries(sets)) {
  for (const b of list) {
    const slug = `${b.id}-${lang}`;
    const target = `/#analyse-${slug}`;
    const own = `partage/analyse-${b.id}.png`;
    const img = existsSync(`public/${own}`) ? `${SITE}/${own}` : `${SITE}/partage/apercu-site.png`;
    const title = `${plain(b.title)} | Ismaël Ouédraogo`;
    const desc = plain(b.excerpt);
    const html = `<!doctype html>
<html lang="${lang === "zh" ? "zh-CN" : lang}"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/analyse/${slug}/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Ismaël Ouédraogo">
<meta property="og:title" content="${esc(plain(b.title))}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/analyse/${slug}/">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="${LOCALE[lang]}">
<meta property="article:author" content="Ismaël Ouédraogo">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(plain(b.title))}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head><body><p><a href="${target}">${esc(plain(b.title))}</a></p></body></html>
`;
    mkdirSync(`dist/analyse/${slug}`, { recursive: true });
    writeFileSync(`dist/analyse/${slug}/index.html`, html);
    n++;
  }
}
console.log(`share pages: ${n}`);
