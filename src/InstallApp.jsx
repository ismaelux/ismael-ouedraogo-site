import { useEffect, useState } from "react";

// Installation du site comme application (PWA) sur téléphone et ordinateur.
// Un seul bouton : il lance l'installation du navigateur quand c'est possible,
// sinon il rouvre le site dans Chrome (Android) ou Edge (Windows) pour l'installer.
const TXT = {
  fr: {
    title: "Application",
    lead: "Installez ce site comme une application sur votre téléphone ou votre ordinateur (Android, iPhone, Windows, macOS). Il s'ouvre depuis l'écran d'accueil ou le menu Démarrer, les analyses déjà consultées restent lisibles hors ligne, et le contenu se met à jour automatiquement.",
    via: "L'installation passe par Google Chrome sur Android, par Chrome ou Microsoft Edge sur ordinateur, et par Safari sur iPhone et iPad.",
    install: "Installer l'application",
    info: "Comment installer",
    installed: "L'application est installée sur cet appareil.",
    ready: "Touchez « Installer l'application » pour confirmer l'installation.",
    close: "Fermer",
    sheetTitle: "Installer l'application",
    steps: [
      ["Android", "Ouvrez le site dans Google Chrome et touchez « Installer l'application ». Depuis un autre navigateur, le bouton ouvre automatiquement le site dans Chrome."],
      ["Windows", "Ouvrez le site dans Microsoft Edge ou Google Chrome et cliquez sur « Installer l'application ». Depuis Firefox, le bouton ouvre automatiquement le site dans Edge, déjà présent sur Windows."],
      ["Mac", "Dans Chrome ou Edge, cliquez sur « Installer l'application ». Dans Safari, menu Fichier, puis « Ajouter au Dock »."],
      ["iPhone et iPad", "Dans Safari, touchez le bouton Partager (le carré avec une flèche vers le haut), puis « Sur l'écran d'accueil » et « Ajouter »."],
    ],
  },
  en: {
    title: "App",
    lead: "Install this site as an app on your phone or computer (Android, iPhone, Windows, macOS). It opens from your home screen or Start menu, analyses you have already read stay available offline, and content updates automatically.",
    via: "Installation goes through Google Chrome on Android, Chrome or Microsoft Edge on computers, and Safari on iPhone and iPad.",
    install: "Install the app",
    info: "How to install",
    installed: "The app is installed on this device.",
    ready: "Tap “Install the app” to confirm the installation.",
    close: "Close",
    sheetTitle: "Install the app",
    steps: [
      ["Android", "Open the site in Google Chrome and tap “Install the app”. From any other browser, the button opens the site in Chrome for you."],
      ["Windows", "Open the site in Microsoft Edge or Google Chrome and click “Install the app”. From Firefox, the button opens the site in Edge, which comes with Windows."],
      ["Mac", "In Chrome or Edge, click “Install the app”. In Safari, use the File menu, then “Add to Dock”."],
      ["iPhone and iPad", "In Safari, tap the Share button (the square with an upward arrow), then “Add to Home Screen” and “Add”."],
    ],
  },
  zh: {
    title: "应用程序",
    lead: "可将本网站作为应用安装到手机或电脑上（Android、iPhone、Windows、macOS）。安装后可从主屏幕或开始菜单直接打开，已阅读的分析文章可离线查看，内容自动更新。",
    via: "在 Android 上通过 Google Chrome 安装，在电脑上通过 Chrome 或 Microsoft Edge 安装，在 iPhone 和 iPad 上通过 Safari 安装。",
    install: "安装应用",
    info: "安装方法",
    installed: "本设备已安装该应用。",
    ready: "点击“安装应用”以确认安装。",
    close: "关闭",
    sheetTitle: "安装应用",
    steps: [
      ["Android", "在 Google Chrome 中打开本网站，点击“安装应用”。如使用其他浏览器，该按钮会自动在 Chrome 中打开本网站。"],
      ["Windows", "在 Microsoft Edge 或 Google Chrome 中打开本网站，点击“安装应用”。如使用 Firefox，该按钮会自动在 Windows 自带的 Edge 中打开本网站。"],
      ["Mac", "在 Chrome 或 Edge 中点击“安装应用”。在 Safari 中，打开“文件”菜单，选择“添加到程序坞”。"],
      ["iPhone 和 iPad", "在 Safari 中点击“分享”按钮（带向上箭头的方框），然后选择“添加到主屏幕”并点击“添加”。"],
    ],
  },
};

const UA = typeof navigator !== "undefined" ? navigator.userAgent : "";
const isAndroid = /Android/i.test(UA);
const isWindows = /Windows NT/i.test(UA);
const isIOS = /iphone|ipad|ipod/i.test(UA) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isSamsung = /SamsungBrowser/i.test(UA);
// Chrome « authentique » sur Android (pas Samsung, Edge, Opera, Firefox, ni WebView).
const isAndroidChrome = isAndroid && /Chrome\//.test(UA) && !/SamsungBrowser|EdgA|OPR|Firefox|; wv\)/i.test(UA);
// Navigateur Windows capable d'installer (Chrome, Edge, Opera, Brave…), par opposition à Firefox.
const isWindowsChromium = isWindows && /Chrome\//.test(UA) && !/Firefox/i.test(UA);

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.matchMedia?.("(display-mode: window-controls-overlay)").matches || window.navigator.standalone === true);

const targetUrl = () => {
  const u = new URL(window.location.href);
  u.searchParams.set("installer", "1");
  u.hash = "app";
  return u;
};
// Rouvre la page dans Chrome sur Android (ou propose Chrome s'il est absent).
const chromeIntent = () => { const u = targetUrl(); return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;end`; };
// Rouvre la page dans Microsoft Edge sur Windows.
const edgeUrl = () => `microsoft-edge:${targetUrl().href}`;

// Capturé au plus tôt : l'événement peut arriver avant le montage du composant.
let deferred = null;
const listeners = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; listeners.forEach((f) => f()); });
  window.addEventListener("appinstalled", () => { deferred = null; listeners.forEach((f) => f(true)); });
}

// Permet à d'autres liens du site (pied de page) de déclencher la même installation.
export const requestInstall = () => window.dispatchEvent(new Event("install-app"));

export default function InstallApp({ lang }) {
  const t = TXT[lang] || TXT.fr;
  const [canPrompt, setCanPrompt] = useState(!!deferred);
  const [installed, setInstalled] = useState(isStandalone);
  const [sheet, setSheet] = useState(false);
  const [arrived] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("installer"));

  useEffect(() => {
    const f = (done) => { if (done === true) setInstalled(true); setCanPrompt(!!deferred); };
    listeners.add(f);
    return () => listeners.delete(f);
  }, []);

  // Arrivée depuis un autre navigateur : on amène directement à la section.
  useEffect(() => {
    if (arrived) setTimeout(() => document.getElementById("app")?.scrollIntoView({ block: "center" }), 300);
  }, [arrived]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e) => { if (e.key === "Escape") setSheet(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const onInstall = async () => {
    // Juste après l'ouverture de la page, le navigateur peut ne pas encore avoir signalé
    // que l'installation est possible : on lui laisse un court délai.
    if (!deferred && /Chrome\//.test(UA) && !isSamsung && !isIOS) {
      await new Promise((resolve) => {
        const f = () => { listeners.delete(f); resolve(); };
        listeners.add(f);
        setTimeout(f, 2000);
      });
    }
    // Samsung Internet : l'installation passe par Chrome.
    if (isSamsung || (isAndroid && !isAndroidChrome && !deferred)) { window.location.href = chromeIntent(); return; }
    if (deferred) {
      const e = deferred;
      e.prompt();
      try { await e.userChoice; } catch (err) { /* choix indisponible */ }
      deferred = null;
      setCanPrompt(false);
      return;
    }
    // Firefox et autres navigateurs Windows sans installation : l'installation passe par Edge.
    if (isWindows && !isWindowsChromium) { window.location.href = edgeUrl(); return; }
    setSheet(true);
  };

  useEffect(() => {
    const f = () => { if (!isStandalone()) onInstall(); };
    window.addEventListener("install-app", f);
    return () => window.removeEventListener("install-app", f);
  });

  return (
    <div className="app-install">
      <h3>{t.title}</h3>
      <p>{t.lead} {t.via}</p>
      {installed ? (
        <p className="app-installed">{t.installed}</p>
      ) : (
        <>
          <div className="app-actions">
            <button className={`btn btn-primary ${arrived && canPrompt ? "is-ready" : ""}`} onClick={onInstall}>
              <img src="/icon-192.png" alt="" width="20" height="20" />
              {t.install}
            </button>
            <button className="app-info" onClick={() => setSheet(true)} aria-label={t.info} title={t.info}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 10.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="7.4" r="1.15" fill="currentColor" /></svg>
            </button>
          </div>
          {arrived && canPrompt && <p className="app-ready">{t.ready}</p>}
        </>
      )}

      {sheet && (
        <div className="app-sheet" role="dialog" aria-modal="true" aria-label={t.sheetTitle} onClick={() => setSheet(false)}>
          <div className="app-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="app-sheet-head">
              <img src="/icon-192.png" alt="" width="40" height="40" />
              <strong>{t.sheetTitle}</strong>
              <button onClick={() => setSheet(false)}>{t.close}</button>
            </div>
            <dl>{(isIOS ? [...t.steps].reverse() : t.steps).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </div>
      )}
    </div>
  );
}
