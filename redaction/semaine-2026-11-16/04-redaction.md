# Semaine du 16 novembre 2026 : rédaction

Rédigé le jeudi 19 novembre 2026 (heure de Paris) par l'agent rédacteur.

- **Anti-doublon** : aucune branche `veille-*` non fusionnée ; dernière analyse sur main datée du 12 novembre (n° 11), soit 7 jours. Semaine non couverte, rédaction engagée.
- **Branche** : `veille-2026-11-19` (créée depuis main, poussée ; jamais fusionnée par l'agent)
- **id** : 12 (19 NOV 2026)
- **Titre** : « Marché obligataire ouest-africain : le passeport bute sur la monnaie »
- EN : « West Africa's bond market: a passport that stops at the currency »
- **Catégorie** : Intégration économique africaine / African Economic Integration
- **Prévisualisation locale** : `/#analyse-12-fr`, `-en`, `-zh`

## Thèse et plan

Thèse : le projet nigérian traite une fragmentation réglementaire, alors que ce qui sépare l'épargne en franc CFA (≈ 6 % à dix ans) de la dette en naira (> 17 %) est le risque de change, nourri par un écart d'inflation de ≈ 15 points par an depuis 2015 ; un passeport n'y change rien. Contre-argument discuté : Burger et Warnock (institutions et désinflation, Ghana 2026). Fin sur un choix d'ordre des opérations (plomberie, émetteurs non souverains, Ghana, contribution nigériane) et sur le MPC de la CBN des 23-24 novembre.

Sections : introduction ; Une proposition assemblée à partir de chantiers anciens (Repères) ; Deux marchés de même ordre de grandeur, à des prix sans rapport ; Le change, un coût qu'aucun passeport ne supprime ; Une épargne de l'UMOA retenue par ses banques et par son droit des changes ; Un tiers de l'encours émis par des États sortis de la CEDEAO ; Commencer par ce qui ne dépend pas de la monnaie ; Scénarios ; Sources.

Scénarios : « Des liaisons techniques, des épargnes toujours nationales » / « Un premier compartiment pour les émetteurs non souverains » / « Une rechute du naira qui fige le projet ».

## Références retenues (aucune déjà citée sur main ni sur les branches)

1. Bekaert et Harvey, « Time-Varying World Market Integration », Journal of Finance, 1995 (intégration de fait contre ouverture de droit).
2. Eichengreen, Hausmann et Panizza, « Currency Mismatches, Debt Intolerance, and the Original Sin », in Edwards (dir.), University of Chicago Press, 2007 (péché originel).
3. Burger et Warnock, « Local Currency Bond Markets », IMF Staff Papers, 2006 (contre-argument ; pages omises).
4. Olson et Zeckhauser, « An Economic Theory of Alliances », Review of Economics and Statistics, 1966 (le grand membre finance le bien collectif ; ajoutée par le rédacteur pour sortir de la seule économie financière, référence connue avec certitude).
5. Gelos, Sahay et Sandleris, « Sovereign Borrowing by Developing Countries », Journal of International Economics, 2011 (Ghana).

Verbes d'introduction distincts : mesurer, établir, étudier/conclure, formaliser, observer.

## Figures (combinaison table, line, bars ; analyse précédente : pairs, stacked, map)

1. **table** (section 2) : trois régimes monétaires, taux directeurs, inflation, titre à ≈ 10 ans, taux moins inflation, change 2026, encours. Plusieurs chiffres précis à comparer. Cellules raccourcies après le rendu mobile, détail des titres en note.
2. **line** (section 3) : inflation annuelle 2015-2025, Nigeria, Ghana, Côte d'Ivoire (Banque mondiale WDI via FRED, lue le 19 nov.). Série temporelle qui porte la thèse (écart d'inflation durable). Nouvelle donnée, absente du dossier ; rebasement de l'IPC nigérian en 2025 signalé en note.
3. **bars** (section 5) : encours des titres en vie par pays de l'UMOA au 31 août 2026, AES en surbrillance (32,5 %, calcul).

Carte non retenue : la géographie n'explique pas le mécanisme.

## Vérifications faites aujourd'hui

- Relus : BusinessDay, Ecofin, Daba Finance (proposition, citation d'Oyedele, « planning stage », indice et rehaussement « à l'étude ») ; Nairametrics/NBS (16,78 Md$, 2,16 M$, Ghana 1,50 M$, Côte d'Ivoire 0,03 M$) ; allAfrica mars 2025 (90 % détenus par les banques, secondaire 3 400 / 2 000 Md, levées 8 127 Md en 2024) ; UMOA-Titres LTV (Côte d'Ivoire, Bénin, Burkina, Guinée-Bissau lus mot pour mot) ; règlement 09/2010 (art. 6, 7, 8 et 10).
- **Financial Afrik (entretien d'Oulimata Ndiaye) : page inaccessible (erreur serveur)**. Tous les chiffres marqués [résumé] qui en venaient ont été retirés (encours 21 629 Md fin 2025, ratio au PIB, part des non-bancaires, baisse de 150-200 pb, OAT à 20 ans, citation).
- Faits ajoutés de connaissance générale, sans lien : admission des titres publics de l'UMOA en garantie aux guichets de la BCEAO ; aucun pays de l'AES n'a émis d'euro-obligation ; sanctions de janvier 2022 contre le Mali ; suspension du service de la dette extérieure du Ghana en décembre 2022 ; présidence de la CEDEAO par Bola Tinubu en juillet 2023.

## Points incertains (pour le relecteur)

- Encours du Sénégal, du Mali, du Niger et du Togo au 31 août 2026 : lus dans le résumé automatique du PDF (deux lectures concordantes, total 23 950,99 cohérent), pas dans le texte intégral.
- Règlement 06/2024 (en vigueur depuis le 20 décembre 2024) non lu : le texte décrit le régime de 2010 au passé et dit seulement qu'il a été remplacé ; vérifier si la dispense pour les titres étrangers autorisés par le régulateur régional subsiste.
- Encours UMOA : 27 449 Md FCFA fin 2025 (Ecofin, périmètre large) contre 23 951 Md au 31 août 2026 (LTV) ; l'écart de périmètre est signalé dans la note de la figure 3.
- Table : coupon ivoirien (taux d'émission) comparé à des rendements de marché ; dit en note. Ligne « taux moins inflation » = calcul de l'auteur à dates voisines.
- Réaction de l'UEMOA, de la BCEAO ou de la BRVM : aucune trouvée au 19 novembre (WebSearch). À revérifier.

## Contrôles

- Node : import OK ; structure FR/EN/ZH identique (sections, paragraphes, figures, factbox, appels de note, notes, URL) ; appels [^1]..[^5] = 5 notes ; aucun « — » (FR, EN, ZH) ; aucun mot interdit (FR, EN) ; toutes les sections titrées ≥ 3 paragraphes ; aucun auteur des notes déjà cité ; titres de scénarios inédits ; « c'est-à-dire » : 0.
- Anti-tics FR : premières phrases ≤ 12 mots : 1 paragraphe sur 23 (4 %) ; EN : 13 % ; aucun début interdit détecté par expression régulière ; « moins … que » : 1.
- Attributions : FR 1 occurrence pour 3 433 mots (« rien n'indique », faux positif), 0,29 pour 1 000 ; EN 0 ; ZH 0.
- Longueur : 3 433 mots hors scénarios et sources (≈ 3 660 avec scénarios), paragraphes de 129 à 178 mots.
- `npm ci` et `npx vite build` sans erreur. Playwright (vite preview) sur `/#analyse-12-fr` en 1 200 et 390 px, `-en` et `-zh` en 1 200 px : aucune erreur de page, pas de défilement horizontal, chaque figure capturée et regardée.
- Correctif de composant : à 390 px, les abscisses « 2024 » et « 2025 » de la courbe se chevauchaient ; `src/Charts2.jsx` (LineChart) n'affiche plus la graduation régulière quand elle tombe trop près de la dernière. Effet limité aux courbes concernées dans les autres analyses (une graduation en moins, aucun chevauchement).
