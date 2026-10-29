import { useEffect, useState } from "react";

// Installation du site comme application (PWA) sur téléphone et ordinateur.
const TXT = {
  fr: {
    samsungNote: "Vous utilisez Samsung Internet. Sur les versions récentes d'Android, ce navigateur produit une application que Google Play Protect signale à tort comme conçue pour une ancienne version d'Android. Pour une installation sans avertissement, ouvrez le site dans Google Chrome puis touchez « Installer l'application ».",
    openChrome: "Ouvrir dans Chrome",
    anyway: "Installer avec Samsung Internet",
    title: "Application",
    lead: "Installez ce site comme une application sur votre téléphone ou votre ordinateur (Android, iPhone, Windows, macOS). Il s'ouvre depuis l'écran d'accueil ou le menu Démarrer, les analyses déjà consultées restent lisibles hors ligne, et le contenu se met à jour automatiquement.",
    install: "Installer l'application",
    how: "Comment installer",
    installed: "L'application est installée sur cet appareil.",
    close: "Fermer",
    sheetTitle: "Installer l'application",
    ios: ["Ouvrez ce site dans Safari.", "Touchez le bouton Partager (le carré avec une flèche vers le haut).", "Choisissez « Sur l'écran d'accueil », puis « Ajouter »."],
    other: [
      ["Windows, macOS, Linux (Chrome ou Edge)", "Cliquez sur l'icône d'installation à droite de la barre d'adresse, ou ouvrez le menu ⋮ puis « Installer Ismaël Ouédraogo »."],
      ["Android (Chrome)", "Ouvrez le menu ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil ». Si Google Play Protect affiche un avertissement, installez depuis Google Chrome plutôt que depuis un autre navigateur, ou choisissez « Ajouter à l'écran d'accueil » puis « Créer un raccourci »."],
      ["iPhone et iPad (Safari)", "Bouton Partager, puis « Sur l'écran d'accueil »."],
      ["Mac (Safari)", "Menu Fichier, puis « Ajouter au Dock »."],
    ],
  },
  en: {
    samsungNote: "You are using Samsung Internet. On recent versions of Android, this browser builds an app that Google Play Protect wrongly flags as designed for an older version of Android. To install without a warning, open the site in Google Chrome and tap “Install the app”.",
    openChrome: "Open in Chrome",
    anyway: "Install with Samsung Internet",
    title: "App",
    lead: "Install this site as an app on your phone or computer (Android, iPhone, Windows, macOS). It opens from your home screen or Start menu, analyses you have already read stay available offline, and content updates automatically.",
    install: "Install the app",
    how: "How to install",
    installed: "The app is installed on this device.",
    close: "Close",
    sheetTitle: "Install the app",
    ios: ["Open this site in Safari.", "Tap the Share button (the square with an upward arrow).", "Choose “Add to Home Screen”, then “Add”."],
    other: [
      ["Windows, macOS, Linux (Chrome or Edge)", "Click the install icon at the right of the address bar, or open the ⋮ menu and choose “Install Ismaël Ouédraogo”."],
      ["Android (Chrome)", "Open the ⋮ menu and choose “Install app” or “Add to Home screen”. If Google Play Protect shows a warning, install from Google Chrome rather than another browser, or choose “Add to Home screen” and then “Create shortcut”."],
      ["iPhone and iPad (Safari)", "Share button, then “Add to Home Screen”."],
      ["Mac (Safari)", "File menu, then “Add to Dock”."],
    ],
  },
  zh: {
    samsungNote: "您正在使用三星浏览器（Samsung Internet）。在较新的 Android 版本上，该浏览器生成的应用会被 Google Play 保护机制误报为“为旧版 Android 设计”。如需无警告安装，请在 Google Chrome 中打开本网站，然后点击“安装应用”。",
    openChrome: "在 Chrome 中打开",
    anyway: "使用三星浏览器安装",
    title: "应用程序",
    lead: "可将本网站作为应用安装到手机或电脑上（Android、iPhone、Windows、macOS）。安装后可从主屏幕或开始菜单直接打开，已阅读的分析文章可离线查看，内容自动更新。",
    install: "安装应用",
    how: "安装方法",
    installed: "本设备已安装该应用。",
    close: "关闭",
    sheetTitle: "安装应用",
    ios: ["在 Safari 中打开本网站。", "点击“分享”按钮（带向上箭头的方框）。", "选择“添加到主屏幕”，然后点击“添加”。"],
    other: [
      ["Windows、macOS、Linux（Chrome 或 Edge）", "点击地址栏右侧的安装图标，或打开 ⋮ 菜单并选择“安装 Ismaël Ouédraogo”。"],
      ["Android（Chrome）", "打开 ⋮ 菜单，选择“安装应用”或“添加到主屏幕”。如果 Google Play 保护机制显示警告，请改用 Google Chrome 安装，或选择“添加到主屏幕”后再选“创建快捷方式”。"],
      ["iPhone 和 iPad（Safari）", "点击“分享”按钮，然后选择“添加到主屏幕”。"],
      ["Mac（Safari）", "打开“文件”菜单，然后选择“添加到程序坞”。"],
    ],
  },
};

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.matchMedia?.("(display-mode: window-controls-overlay)").matches || window.navigator.standalone === true);

const isSamsung = () => typeof navigator !== "undefined" && /SamsungBrowser/i.test(navigator.userAgent);

// Lien qui ouvre la page courante dans Google Chrome sur Android (ou la fiche Chrome si absent).
const chromeIntent = () => {
  const { host, pathname, search } = window.location;
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`;
};

const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

// Capturé au plus tôt : l'événement peut arriver avant le montage du composant.
let deferred = null;
const listeners = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; listeners.forEach((f) => f()); });
  window.addEventListener("appinstalled", () => { deferred = null; listeners.forEach((f) => f(true)); });
}

export default function InstallApp({ lang }) {
  const t = TXT[lang] || TXT.fr;
  const [canPrompt, setCanPrompt] = useState(!!deferred);
  const [installed, setInstalled] = useState(isStandalone);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const f = (done) => { if (done === true) setInstalled(true); setCanPrompt(!!deferred); };
    listeners.add(f);
    return () => listeners.delete(f);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e) => { if (e.key === "Escape") setSheet(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const onInstall = async () => {
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch (e) { /* choix indisponible */ }
      deferred = null;
      setCanPrompt(false);
    } else {
      setSheet(true);
    }
  };

  const ios = isIOS();
  const samsung = isSamsung();

  return (
    <div className="app-install">
      <h3>{t.title}</h3>
      <p>{t.lead}</p>
      {installed ? (
        <p className="app-installed">{t.installed}</p>
      ) : (
        samsung ? (
        <>
          <p className="app-note">{t.samsungNote}</p>
          <div className="app-actions">
            <a className="btn btn-primary" href={chromeIntent()}>
              <img src="/icon-192.png" alt="" width="20" height="20" />
              {t.openChrome}
            </a>
            {canPrompt && <button className="app-how" onClick={onInstall}>{t.anyway}</button>}
          </div>
        </>
        ) : (
        <div className="app-actions">
          <button className="btn btn-primary" onClick={onInstall}>
            <img src="/icon-192.png" alt="" width="20" height="20" />
            {canPrompt || !ios ? t.install : t.how}
          </button>
          {canPrompt && <button className="app-how" onClick={() => setSheet(true)}>{t.how}</button>}
        </div>
        )
      )}

      {sheet && (
        <div className="app-sheet" role="dialog" aria-modal="true" aria-label={t.sheetTitle} onClick={() => setSheet(false)}>
          <div className="app-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="app-sheet-head">
              <img src="/icon-192.png" alt="" width="40" height="40" />
              <strong>{t.sheetTitle}</strong>
              <button onClick={() => setSheet(false)}>{t.close}</button>
            </div>
            {ios ? (
              <ol>{t.ios.map((s) => <li key={s}>{s}</li>)}</ol>
            ) : (
              <dl>{t.other.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
