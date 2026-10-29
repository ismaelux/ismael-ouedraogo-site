// Service worker de l'application : fonctionnement hors ligne et chargement rapide.
// Pages : réseau d'abord (le contenu publié est toujours à jour), copie locale si hors ligne.
// Fichiers versionnés (/assets/*), images et polices : copie locale d'abord.
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const STATIC = `static-${VERSION}`;
const PRECACHE = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![PAGES, STATIC].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const putIfOk = async (cacheName, req, res) => {
  if (res && (res.ok || res.type === "opaque")) {
    const c = await caches.open(cacheName);
    await c.put(req, res.clone());
  }
  return res;
};

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Statistiques Vercel et autres services : jamais mis en cache.
  if (url.pathname.startsWith("/_vercel")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => putIfOk(PAGES, "/", res))
        .catch(async () => (await caches.match("/")) || Response.error())
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  const isStatic = sameOrigin && (url.pathname.startsWith("/assets/") || /\.(png|jpe?g|svg|webp|ico|woff2?)$/.test(url.pathname));

  if (isStatic || isFont) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => putIfOk(STATIC, req, res)))
    );
    return;
  }

  if (sameOrigin) {
    event.respondWith(
      fetch(req).then((res) => putIfOk(PAGES, req, res)).catch(() => caches.match(req).then((hit) => hit || Response.error()))
    );
  }
});
