# 🌍 Ismaël Ouédraogo — Site Académique

Site personnel académique. Géopolitique, commerce international et dynamiques économiques africaines.

---

## 🚀 Guide de déploiement pas à pas

### Prérequis

1. **Node.js** (version 18 ou plus) : télécharge sur [nodejs.org](https://nodejs.org/)
2. **Git** : télécharge sur [git-scm.com](https://git-scm.com/)
3. **Un compte GitHub** : crée-le sur [github.com](https://github.com/)
4. **Un compte Vercel** (gratuit) : crée-le sur [vercel.com](https://vercel.com/) en te connectant avec GitHub

### Étape 1 — Préparer le projet en local

Ouvre un terminal (ou PowerShell sous Windows) et exécute :

```bash
# Va dans le dossier du projet (adapte le chemin si nécessaire)
cd ismael-site

# Installe les dépendances
npm install

# Lance le site en local pour le tester
npm run dev
```

Le terminal affichera une URL du type `http://localhost:5173`. Ouvre-la dans ton navigateur pour voir le site.

### Étape 2 — Créer un dépôt GitHub

1. Va sur [github.com/new](https://github.com/new)
2. Nom du dépôt : `ismael-ouedraogo-site` (ou le nom de ton choix)
3. Laisse en **Public** ou **Private** selon ta préférence
4. Ne coche rien d'autre, clique **Create repository**
5. GitHub te montrera des commandes. Dans ton terminal :

```bash
# Initialise Git dans le projet
git init

# Ajoute tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - site académique"

# Connecte au dépôt GitHub (remplace l'URL par la tienne)
git remote add origin https://github.com/TON-PSEUDO/ismael-ouedraogo-site.git

# Pousse le code
git branch -M main
git push -u origin main
```

### Étape 3 — Déployer sur Vercel (gratuit)

1. Va sur [vercel.com](https://vercel.com/) et connecte-toi avec ton compte GitHub
2. Clique **"Add New..." → "Project"**
3. Tu verras la liste de tes dépôts GitHub. Sélectionne `ismael-ouedraogo-site`
4. Vercel détecte automatiquement que c'est un projet Vite/React
5. Clique **"Deploy"**
6. En 30 secondes, ton site est en ligne ! Tu recevras une URL du type :
   `https://ismael-ouedraogo-site.vercel.app`

### Étape 4 — Ajouter un nom de domaine personnalisé (optionnel)

1. Achète un domaine (ex : `ismael-ouedraogo.com`) sur [Namecheap](https://namecheap.com), [Google Domains](https://domains.google), ou [OVH](https://ovh.com)
2. Dans le dashboard Vercel de ton projet, va dans **Settings → Domains**
3. Ajoute ton domaine personnalisé
4. Vercel te donnera les enregistrements DNS à configurer chez ton registrar
5. Une fois propagé (quelques minutes à 24h), ton site sera accessible à `ismael-ouedraogo.com`

---

## ✏️ Comment modifier le site

### Modifier le contenu

Le fichier principal est `src/App.jsx`. Voici les sections que tu peux modifier facilement :

| Contenu | Où dans le fichier | Quoi modifier |
|---|---|---|
| **Working Papers** | Objet `RESEARCH.working` | Ajoute/modifie les objets dans le tableau |
| **Thématiques** | Objet `RESEARCH.themes` | Modifie les chaînes de texte |
| **Cours** | Tableau `TEACHING` | Ajoute/modifie les cours |
| **Bulletins** | Tableau `BULLETINS_INIT` | Ajoute de nouveaux bulletins |
| **Catégories bulletins** | Tableau `CATEGORIES` | Ajoute de nouvelles catégories |
| **Parcours / Timeline** | Section `about` dans le JSX | Modifie les `timeline-item` |
| **Contact** | Section `contact` dans le JSX | Modifie les infos de contact |

### Ajouter un nouveau bulletin

**Option 1 — Via l'interface** : Clique sur "**+ Nouveau bulletin**" dans la section Bulletins du site. Note : ces bulletins sont temporaires (disparaissent au rechargement).

**Option 2 — Dans le code** (permanent) : Ajoute un objet dans `BULLETINS_INIT` :

```javascript
{
  id: 4,
  day: "17", month: "MAR", year: "2026",
  title: "Titre de ton bulletin",
  excerpt: "Contenu ou résumé de ton analyse...",
  tags: ["Tag1", "Tag2"],
  category: "Intégration africaine"  // Doit correspondre à une valeur de CATEGORIES
}
```

### Redéployer après modification

```bash
git add .
git commit -m "Mise à jour du contenu"
git push
```

Vercel redéploie automatiquement à chaque push. Ton site sera à jour en quelques secondes.

### Ajouter ta photo

1. Place ta photo dans le dossier `public/` sous le nom `photo-ismael.jpg`
2. Dans `src/App.jsx`, remplace le bloc `about-photo-frame` contenant les initiales par :

```jsx
<div className="about-photo-frame">
  <img src="/photo-ismael.jpg" alt="Ismaël Ouédraogo"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</div>
```

---

## 🏗️ Structure du projet

```
ismael-site/
├── public/
│   └── favicon.svg          ← Favicon du site
├── src/
│   ├── main.jsx              ← Point d'entrée React
│   └── App.jsx               ← Composant principal (tout le site)
├── index.html                ← Page HTML + SEO
├── package.json              ← Dépendances
├── vite.config.js            ← Configuration Vite
├── .gitignore                ← Fichiers ignorés par Git
└── README.md                 ← Ce fichier
```

---

## 🔧 Commandes utiles

| Commande | Action |
|---|---|
| `npm run dev` | Lance le serveur de développement local |
| `npm run build` | Génère le site optimisé pour la production |
| `npm run preview` | Prévisualise la version de production |

---

## 📝 Évolutions possibles

- **Blog complet** : intégrer un CMS headless (Sanity, Strapi) pour gérer les bulletins
- **Multilingue** : ajouter une version anglaise du site
- **Analytics** : intégrer Google Analytics ou Plausible
- **Newsletter** : ajouter un formulaire d'inscription (Mailchimp, Buttondown)
- **CV téléchargeable** : ajouter un PDF dans `public/`
- **Moteur de recherche** : ajouter une barre de recherche pour les bulletins

---

*Construit avec React + Vite · Déployable sur Vercel*
