# Semaine du 16 novembre 2026 : relecture critique

Relu le jeudi 19 novembre 2026 (heure de Paris) par l'agent relecteur. Branche `veille-2026-11-19`, commit `9d5f874`. Analyse n° 12, « Marché obligataire ouest-africain : le passeport bute sur la monnaie » (Intégration économique africaine).

## Corrections faites (FR, EN, ZH)

- **Chiffre non sourcé retiré** : « 9 069 milliards de FCFA levés par adjudication et syndication en 2025 » ne figure dans aucune source. Remplacé par 11 858 milliards en 2025 (+46 % sur les 8 127 milliards de 2024), lu sur allAfrica/Sud Quotidien (30 janv. 2026) et Senego ; lien et entrée de la liste Sources ajoutés.
- **Droit des changes réécrit sur le texte en vigueur** : le paragraphe décrivait le règlement 09/2010, abrogé. Lecture du règlement 06/2024 (art. 3, 12 et 17) : la dispense pour les titres étrangers autorisés par l'AMF-UMOA subsiste, mais l'offre exige l'accord préalable de la BCEAO avant le visa de l'AMF et les achats doivent être financés à 75 % au moins par des ressources mobilisées hors de l'Union. Conséquence intégrée : une banque d'Abidjan ne pourrait financer qu'un quart de ses achats sur ses ressources en franc CFA. Cela renforce la thèse. Sources 09/2010 et Droit Médias Finance remplacées par le texte du règlement 06/2024.
- **NBS** : la phrase « couvrent investissements directs, portefeuille et prêts » n'est pas dans la source ; ramenée à « l'ensemble des importations de capitaux enregistrées ».
- **Figure 3 et section 5** : la liste UMOA-Titres ne couvre que les titres émis par adjudication (en-tête du document) ; titre, texte et note précisent ce périmètre ; la note n'affirme plus que le chiffre Ecofin « inclut d'autres catégories ».
- **WASRA** : « le Mali, le Burkina et le Niger ne siègent plus dans ces instances » était inexact (l'AMF-UMOA régule les huit pays) ; remplacé par leur absence du Conseil de convergence et du Conseil des ministres de la CEDEAO qui doivent adopter la charte.
- **Sanctions de 2022 contre le Mali** : précisé qu'elles ont été décidées par la CEDEAO et l'UEMOA (l'argument ne laissait croire qu'à la CEDEAO).
- **Burger et Warnock** : « 49 pays » → « 49 marchés » (abstract) ; ajout de leur conclusion que le péché originel est une appellation trompeuse, ce qui rend le contre-argument plus loyal ; la phrase qui leur prêtait un résultat sur la séquence stabilisation/ouverture, absente de l'article, est remplacée par une lecture limitée à ce qu'ils établissent ; pages 115-132 ajoutées à la note 3.
- **Raisonnement** : « rémunère, à peine, une perte de change » était incohérent avec un écart d'inflation courant de 15 points pour un écart de rendement de 11 ; corrigé en « compense mal ».
- **Voix d'auteur et débuts de paragraphe** : six paragraphes réécrits pour entrer par le contenu (« Abuja dispose en revanche… », « L'argument inverse mérite… », « Le flux inverse aurait plus de logique… », « Les émetteurs non souverains offrent un premier terrain… », « Le Ghana est le partenaire souverain par lequel commencer… », « Le choix qui se présente… »).
- **Redondances** : la chute « rejoint la liste des intentions sans date » apparaissait trois fois (thèse, conclusion, scénario 3) ; conclusion réécrite (« reste un discours de sommet ») avec un choix explicite pour Abuja ; « banc d'essai » dédoublé retiré du scénario 2 ; « plutôt que » ramené de 5 à 3.

## Vérifications contre les sources (WebFetch, 19 nov.)

Confirmés mot pour mot : BusinessDay (citation d'Oyedele, cinq briques, « planning stage », note investment grade sous trois ans, 1 000 Md$) ; Daba Finance (indice et rehaussement « à l'étude ») ; Ecofin (27 449 Md FCFA = 46,6 Md$, 29 Md$, 16 Md$, 27,45 trillions de nairas, AELP 2022, périmètre flou) ; Nairametrics (16,78 Md$, 2,16 M$, Ghana 1,50 M$, Côte d'Ivoire 0,03 M$ ; dette 166,79 trillions, 120,93 Md$, 91,59 ; 59,1 → 89,4) ; CBN 307e MPC (23 %, 15,39 %, CRR 45 %, réserves 55,25 Md$ au 18 sept., MPC 23-24 nov.) ; BoG (14,0 %, 5,0 %, bon à 91 jours 10,3 → 5,4 %, cedi −9,5 % au 18 sept.) ; IC Securities (17,39 %, 15,68 %, naira +5,6 % sur sept mois) ; BCEAO (3,00 % depuis le 16 mars, 0,4 % au T2) ; allAfrica 2025 (90 %, 3 400 / 2 000, 8 127) ; FRED (les 33 valeurs de la figure 2, mise à jour du 13 oct. 2026) ; BRVM (WACMIC) ; News Ghana (Lomé, Agama) ; UMOA-Titres (Côte d'Ivoire, Burkina, Bénin, Guinée-Bissau, coupons 6,25 %, émissions burkinabè des 13 et 27 août).
Références : les cinq notices vérifiées (Bekaert-Harvey JF 1995 ; Eichengreen-Hausmann-Panizza 2007 ; Burger-Warnock IMF Staff Papers 2006, p. 115-132 ; Olson-Zeckhauser REStat 1966 ; Gelos-Sahay-Sandleris JIE 2011). Aucun des douze auteurs n'est cité dans les analyses 1 à 11 (node). Verbes d'introduction tous différents. Aucun lien vers un domaine russe.

## Contrôles

- Structure FR/EN/ZH identique (sections, paragraphes, figures et positions, factbox, scénarios) ; URL identiques ; appels [^1]..[^5] = 5 notes dans les trois langues ; aucun « — ».
- Mots interdits FR et EN : aucun. « c'est-à-dire » : 0. « moins … que » : 1.
- Anti-tics : premières phrases de 12 mots ou moins : 0 / 23 (FR), 0 / 23 (EN) ; aucun début interdit détecté (expressions régulières et relecture des 23 débuts).
- Attributions : FR 1 pour 3 463 mots (« rien n'indique », faux positif), soit 0,29 pour 1 000 ; EN 0 ; ZH 0.
- Longueur : 3 463 mots hors scénarios et sources ; paragraphes de 128 à 182 mots ; toutes les sections titrées ≥ 3 paragraphes.
- Visualisations : table (7 lignes), line (3 séries × 11 ans, évolution), bars (8 valeurs) ; combinaison différente de l'analyse 11 (pairs, stacked, map) ; toutes les valeurs revérifiées ; titres-constats avec unité ; notes de source complètes.
- `npm ci`, `npx vite build` : OK. Playwright (vite preview), /#analyse-12-fr, -en, -zh, chacun dans une nouvelle page, à 1 200 et 390 px : aucune erreur de page (seuls échecs : Google Fonts bloqué par le proxy du bac à sable et /_vercel/insights en 404 local) ; figures capturées et regardées, libellés lisibles, rien de coupé.

## Points non résolus

- Encours du Sénégal, du Mali, du Niger et du Togo au 31 août 2026 : toujours lus dans le résumé automatique du PDF (trois lectures concordantes ; sous-totaux OAT + BAT cohérents au centime près ; total 23 951 cohérent). Le PDF n'a pas pu être téléchargé directement (domaine bloqué). Risque faible, à vérifier à l'œil si possible.
- La date exacte d'adoption du règlement 06/2024 (20 décembre 2024) n'a été lue que dans un résumé et dans la presse ; le texte dit « décembre 2024 ».
- Hors analyse : en anglais à 390 px, la section Enseignement de la page (« Université Rennes 2 ») déborde de 32 px (défilement horizontal). Défaut préexistant, non lié à l'analyse 12, non corrigé.
- Aucune réaction de l'UEMOA, de la BCEAO ou de la BRVM trouvée au 19 novembre.

## Note de solidité : 8/10

Thèse nette et originale, mécanisme renforcé par le texte du règlement 06/2024, contre-argument loyal, chiffres désormais tous rattachés à une source lue. Réserves : quatre encours par pays lus en résumé ; la figure 3 reste plus descriptive qu'analytique.
