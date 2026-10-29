import { useEffect, useState } from "react";

// Installation du site comme application (PWA) sur téléphone et ordinateur.
// Un seul bouton : il lance l'installation du navigateur quand c'est possible ;
// sinon il rouvre le site dans Chrome (Android) ou propose Firefox / Edge (Windows).
const CHROME_PLAY = "https://play.google.com/store/apps/details?id=com.android.chrome";
const FIREFOX_PLAY = "https://play.google.com/store/apps/details?id=org.mozilla.firefox";
const CHROME_DL = "https://www.google.com/chrome/";

const TXT = {
  fr: {
    title: "Application",
    lead: "Installez ce site comme une application sur votre téléphone ou votre ordinateur (Android, iPhone, Windows, macOS). Il s'ouvre depuis l'écran d'accueil, la barre des tâches ou le menu Démarrer, les analyses déjà consultées restent lisibles hors ligne, et le contenu se met à jour automatiquement.",
    via: "Sur Android, l'installation passe par Google Chrome ; sur ordinateur, par Chrome, Microsoft Edge ou Firefox ; sur iPhone et iPad, par Safari.",
    install: "Installer l'application",
    info: "Comment installer",
    installed: "L'application est installée sur cet appareil.",
    ready: "Cliquez sur « Installer l'application » pour confirmer l'installation.",
    close: "Fermer",
    sheetTitle: "Installer l'application",
    steps: [
      ["Android", "Dans Google Chrome, touchez « Installer l'application ». Depuis un autre navigateur, le bouton ouvre le site dans Chrome. Sans Chrome, Firefox permet aussi l'installation : menu ⋮, puis « Installer » ou « Ajouter à l'écran d'accueil »."],
      ["Windows", "Dans Chrome ou Edge, cliquez sur « Installer l'application ». Edge propose ensuite d'épingler l'application à la barre des tâches et de créer une icône sur le Bureau ; Chrome crée une icône sur le Bureau. Dans Firefox (version 143 ou plus récente), cliquez sur l'icône Web apps de la barre d'adresse : l'application s'ajoute à la barre des tâches et au menu Démarrer."],
      ["Mac", "Dans Chrome ou Edge, cliquez sur « Installer l'application ». Dans Safari, menu Fichier, puis « Ajouter au Dock »."],
      ["iPhone et iPad", "Dans Safari, touchez le bouton Partager (le carré avec une flèche vers le haut), puis « Sur l'écran d'accueil » et « Ajouter »."],
    ],
    ffTitle: "Installer avec Firefox",
    ffText: "Firefox installe les applications depuis sa barre d'adresse. Cliquez sur l'icône Web apps qui y apparaît, en haut de la fenêtre : l'application s'ajoute à la barre des tâches et au menu Démarrer.",
    ffEdge: "Installer plutôt avec Microsoft Edge",
    ffEdgeNote: "Edge, présent sur Windows, propose aussi une icône sur le Bureau.",
    ncTitle: "Google Chrome est nécessaire",
    ncText: "L'installation de cette application sur Android passe par Google Chrome, qui n'est pas installé sur cet appareil. Installez Chrome, ou à défaut Firefox, puis revenez sur ce site.",
    ncChrome: "Installer Google Chrome",
    ncFirefox: "Installer Firefox",
    ncInFirefox: "Vous utilisez déjà Firefox : ouvrez le menu ⋮, puis « Installer » ou « Ajouter à l'écran d'accueil ».",
    niTitle: "Navigateur non compatible",
    niText: "Ce navigateur ne permet pas d'installer d'application sur cet ordinateur. Ouvrez ce site dans Google Chrome ou Microsoft Edge, puis cliquez sur « Installer l'application ».",
    niCopy: "Copier le lien du site",
    niCopied: "Lien copié",
    niChrome: "Télécharger Google Chrome",
    safTitle: "Installer avec Safari",
    saf: ["Ouvrez le menu Fichier de Safari.", "Choisissez « Ajouter au Dock », puis « Ajouter »."],
    iosTitle: "Installer sur iPhone ou iPad",
    ios: ["Ouvrez ce site dans Safari.", "Touchez le bouton Partager (le carré avec une flèche vers le haut).", "Choisissez « Sur l'écran d'accueil », puis « Ajouter »."],
  },
  en: {
    title: "App",
    lead: "Install this site as an app on your phone or computer (Android, iPhone, Windows, macOS). It opens from your home screen, taskbar or Start menu, analyses you have already read stay available offline, and content updates automatically.",
    via: "On Android, installation goes through Google Chrome; on computers, through Chrome, Microsoft Edge or Firefox; on iPhone and iPad, through Safari.",
    install: "Install the app",
    info: "How to install",
    installed: "The app is installed on this device.",
    ready: "Click “Install the app” to confirm the installation.",
    close: "Close",
    sheetTitle: "Install the app",
    steps: [
      ["Android", "In Google Chrome, tap “Install the app”. From any other browser, the button opens the site in Chrome. Without Chrome, Firefox can also install it: ⋮ menu, then “Install” or “Add to Home screen”."],
      ["Windows", "In Chrome or Edge, click “Install the app”. Edge then offers to pin the app to the taskbar and create a desktop icon; Chrome creates a desktop icon. In Firefox (version 143 or later), click the Web apps icon in the address bar: the app is added to the taskbar and the Start menu."],
      ["Mac", "In Chrome or Edge, click “Install the app”. In Safari, use the File menu, then “Add to Dock”."],
      ["iPhone and iPad", "In Safari, tap the Share button (the square with an upward arrow), then “Add to Home Screen” and “Add”."],
    ],
    ffTitle: "Install with Firefox",
    ffText: "Firefox installs apps from its address bar. Click the Web apps icon that appears there, at the top of the window: the app is added to the taskbar and the Start menu.",
    ffEdge: "Install with Microsoft Edge instead",
    ffEdgeNote: "Edge, which comes with Windows, can also add a desktop icon.",
    ncTitle: "Google Chrome is required",
    ncText: "On Android, this app installs through Google Chrome, which is not installed on this device. Install Chrome, or Firefox as an alternative, then come back to this site.",
    ncChrome: "Install Google Chrome",
    ncFirefox: "Install Firefox",
    ncInFirefox: "You are already using Firefox: open the ⋮ menu, then “Install” or “Add to Home screen”.",
    niTitle: "Browser not supported",
    niText: "This browser cannot install apps on this computer. Open this site in Google Chrome or Microsoft Edge, then click “Install the app”.",
    niCopy: "Copy the site link",
    niCopied: "Link copied",
    niChrome: "Download Google Chrome",
    safTitle: "Install with Safari",
    saf: ["Open Safari's File menu.", "Choose “Add to Dock”, then “Add”."],
    iosTitle: "Install on iPhone or iPad",
    ios: ["Open this site in Safari.", "Tap the Share button (the square with an upward arrow).", "Choose “Add to Home Screen”, then “Add”."],
  },
  zh: {
    title: "应用程序",
    lead: "可将本网站作为应用安装到手机或电脑上（Android、iPhone、Windows、macOS）。安装后可从主屏幕、任务栏或开始菜单直接打开，已阅读的分析文章可离线查看，内容自动更新。",
    via: "在 Android 上通过 Google Chrome 安装；在电脑上通过 Chrome、Microsoft Edge 或 Firefox 安装；在 iPhone 和 iPad 上通过 Safari 安装。",
    install: "安装应用",
    info: "安装方法",
    installed: "本设备已安装该应用。",
    ready: "点击“安装应用”以确认安装。",
    close: "关闭",
    sheetTitle: "安装应用",
    steps: [
      ["Android", "在 Google Chrome 中点击“安装应用”。如使用其他浏览器，该按钮会在 Chrome 中打开本网站。如未安装 Chrome，也可使用 Firefox 安装：打开 ⋮ 菜单，选择“安装”或“添加到主屏幕”。"],
      ["Windows", "在 Chrome 或 Edge 中点击“安装应用”。Edge 随后会提供固定到任务栏和创建桌面图标的选项；Chrome 会创建桌面图标。在 Firefox（143 及以上版本）中，点击地址栏中的“Web 应用”图标，应用即会添加到任务栏和开始菜单。"],
      ["Mac", "在 Chrome 或 Edge 中点击“安装应用”。在 Safari 中，打开“文件”菜单，选择“添加到程序坞”。"],
      ["iPhone 和 iPad", "在 Safari 中点击“分享”按钮（带向上箭头的方框），然后选择“添加到主屏幕”并点击“添加”。"],
    ],
    ffTitle: "使用 Firefox 安装",
    ffText: "Firefox 通过地址栏安装应用。请点击窗口顶部地址栏中出现的“Web 应用”图标，应用即会添加到任务栏和开始菜单。",
    ffEdge: "改用 Microsoft Edge 安装",
    ffEdgeNote: "Windows 自带的 Edge 还可以创建桌面图标。",
    ncTitle: "需要 Google Chrome",
    ncText: "在 Android 上，本应用需通过 Google Chrome 安装，而本设备尚未安装 Chrome。请安装 Chrome，或改为安装 Firefox，然后返回本网站。",
    ncChrome: "安装 Google Chrome",
    ncFirefox: "安装 Firefox",
    ncInFirefox: "您已在使用 Firefox：打开 ⋮ 菜单，选择“安装”或“添加到主屏幕”。",
    niTitle: "浏览器不受支持",
    niText: "此浏览器无法在本电脑上安装应用。请在 Google Chrome 或 Microsoft Edge 中打开本网站，然后点击“安装应用”。",
    niCopy: "复制网站链接",
    niCopied: "链接已复制",
    niChrome: "下载 Google Chrome",
    safTitle: "使用 Safari 安装",
    saf: ["打开 Safari 的“文件”菜单。", "选择“添加到程序坞”，然后点击“添加”。"],
    iosTitle: "在 iPhone 或 iPad 上安装",
    ios: ["在 Safari 中打开本网站。", "点击“分享”按钮（带向上箭头的方框）。", "选择“添加到主屏幕”，然后点击“添加”。"],
  },
};

const UA = typeof navigator !== "undefined" ? navigator.userAgent : "";
const isAndroid = /Android/i.test(UA);
const isWindows = /Windows NT/i.test(UA);
const isIOS = /iphone|ipad|ipod/i.test(UA) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isFirefox = /Firefox\//i.test(UA);
const firefoxVersion = Number((UA.match(/Firefox\/(\d+)/) || [])[1] || 0);
const isChromium = /Chrome\//.test(UA) && !isFirefox;
// Chrome « authentique » sur Android (pas Samsung, Edge, Opera, Firefox, ni WebView).
const isAndroidChrome = isAndroid && /Chrome\//.test(UA) && !/SamsungBrowser|EdgA|OPR|Firefox|; wv\)/i.test(UA);
const isMacSafari = !isIOS && /Macintosh/.test(UA) && /Safari\//.test(UA) && !/Chrome\/|Firefox\//.test(UA);

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.matchMedia?.("(display-mode: window-controls-overlay)").matches || window.navigator.standalone === true);

const pageUrl = (param) => {
  const u = new URL(window.location.href);
  u.searchParams.delete("installer");
  u.searchParams.delete("sans-chrome");
  u.searchParams.set(param, "1");
  u.hash = "app";
  return u;
};
// Rouvre la page dans Chrome sur Android ; si Chrome est absent, revient sur le site avec un message.
const chromeIntent = () => {
  const u = pageUrl("installer");
  const fallback = encodeURIComponent(pageUrl("sans-chrome").href);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
};
// Rouvre la page dans Microsoft Edge sur Windows.
const edgeUrl = () => `microsoft-edge:${pageUrl("installer").href}`;

// Capturé au plus tôt : l'événement peut arriver avant le montage du composant.
let deferred = null;
const listeners = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; listeners.forEach((f) => f()); });
  window.addEventListener("appinstalled", () => { deferred = null; listeners.forEach((f) => f(true)); });
}

// Permet à d'autres liens du site (pied de page) de déclencher la même installation.
export const requestInstall = () => window.dispatchEvent(new Event("install-app"));

const Steps = ({ items, ordered }) => ordered
  ? <ol>{items.map((s) => <li key={s}>{s}</li>)}</ol>
  : <dl>{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;

export default function InstallApp({ lang }) {
  const t = TXT[lang] || TXT.fr;
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [canPrompt, setCanPrompt] = useState(!!deferred);
  const [installed, setInstalled] = useState(isStandalone);
  const [panel, setPanel] = useState(() => (params.has("sans-chrome") && !isAndroidChrome ? "noChrome" : null));
  const [copied, setCopied] = useState(false);
  const [arrived] = useState(() => params.has("installer") || params.has("sans-chrome"));

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
    if (!panel) return;
    const onKey = (e) => { if (e.key === "Escape") setPanel(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  const onInstall = async () => {
    // Android hors Chrome : l'installation passe par Chrome.
    if (isAndroid && !isAndroidChrome) { window.location.href = chromeIntent(); return; }
    if (isIOS) { setPanel("ios"); return; }
    // Juste après l'ouverture de la page, le navigateur peut ne pas encore avoir signalé
    // que l'installation est possible : on lui laisse un court délai.
    if (!deferred && isChromium) {
      await new Promise((resolve) => {
        const f = () => { listeners.delete(f); resolve(); };
        listeners.add(f);
        setTimeout(f, 2000);
      });
    }
    if (deferred) {
      const e = deferred;
      e.prompt();
      try { await e.userChoice; } catch (err) { /* choix indisponible */ }
      deferred = null;
      setCanPrompt(false);
      return;
    }
    if (isWindows && isFirefox) {
      // Firefox 143+ installe depuis sa barre d'adresse ; les versions antérieures passent par Edge.
      if (firefoxVersion >= 143) setPanel("firefox");
      else window.location.href = edgeUrl();
      return;
    }
    if (isMacSafari) { setPanel("safari"); return; }
    if (isChromium) { setPanel("info"); return; }
    setPanel("unsupported");
  };

  useEffect(() => {
    const f = () => { if (!isStandalone()) onInstall(); };
    window.addEventListener("install-app", f);
    return () => window.removeEventListener("install-app", f);
  });

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.origin + "/"); setCopied(true); } catch (e) { /* presse-papiers indisponible */ }
  };

  const titles = { info: t.sheetTitle, firefox: t.ffTitle, noChrome: t.ncTitle, unsupported: t.niTitle, safari: t.safTitle, ios: t.iosTitle };

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
            <button className="app-info" onClick={() => setPanel("info")} aria-label={t.info} title={t.info}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 10.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="7.4" r="1.15" fill="currentColor" /></svg>
            </button>
          </div>
          {arrived && canPrompt && <p className="app-ready">{t.ready}</p>}
        </>
      )}

      {panel && (
        <div className={`app-sheet ${panel === "firefox" ? "is-top" : ""}`} role="dialog" aria-modal="true" aria-label={titles[panel]} onClick={() => setPanel(null)}>
          <div className="app-sheet-card" onClick={(e) => e.stopPropagation()}>
            {panel === "firefox" && (
              <svg className="app-arrow" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
            <div className="app-sheet-head">
              <img src="/icon-192.png" alt="" width="40" height="40" />
              <strong>{titles[panel]}</strong>
              <button onClick={() => setPanel(null)}>{t.close}</button>
            </div>

            {panel === "info" && <Steps items={isIOS ? [...t.steps].reverse() : t.steps} />}
            {panel === "ios" && <Steps items={t.ios} ordered />}
            {panel === "safari" && <Steps items={t.saf} ordered />}

            {panel === "firefox" && (
              <>
                <p className="app-sheet-text">{t.ffText}</p>
                <div className="app-sheet-actions">
                  <a className="btn btn-ghost" href={edgeUrl()}>{t.ffEdge}</a>
                </div>
                <p className="app-sheet-note">{t.ffEdgeNote}</p>
              </>
            )}

            {panel === "noChrome" && (
              <>
                <p className="app-sheet-text">{t.ncText}</p>
                <div className="app-sheet-actions">
                  <a className="btn btn-primary" href={CHROME_PLAY} target="_blank" rel="noopener">{t.ncChrome}</a>
                  <a className="btn btn-ghost" href={FIREFOX_PLAY} target="_blank" rel="noopener">{t.ncFirefox}</a>
                </div>
                {isFirefox && <p className="app-sheet-note">{t.ncInFirefox}</p>}
              </>
            )}

            {panel === "unsupported" && (
              <>
                <p className="app-sheet-text">{t.niText}</p>
                <div className="app-sheet-actions">
                  <button className="btn btn-primary" onClick={copyLink}>{copied ? t.niCopied : t.niCopy}</button>
                  <a className="btn btn-ghost" href={CHROME_DL} target="_blank" rel="noopener">{t.niChrome}</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
