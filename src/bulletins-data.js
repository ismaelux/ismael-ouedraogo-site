// Données des bulletins avec contenu détaillé pour la vue article
const BULLETINS_DATA = [
  {
    id: 4, day: "16", month: "AVR", year: "2026",
    title: "Guerre en Iran : consequences economiques pour l'Afrique de l'Ouest",
    excerpt: "Analyse des retombees a court et long terme du conflit americano-iranien sur les economies ouest-africaines. Choc petrolier, revisions de croissance et penuries d'engrais au Sahel.",
    tags: ["Iran", "Petrole", "CEDEAO", "Sahel", "Nigeria"], category: "Geopolitique",
    content: [
      { heading: null, paragraphs: [
        "Le 28 fevrier 2026, les Etats-Unis et Israel ont lance des frappes coordonnees sur l'Iran, eliminant le Guide supreme Ali Khamenei. L'Iran a riposte par des tirs de missiles et de drones contre Israel et les bases americaines dans les pays du Golfe, puis a ferme le detroit d'Ormuz, par lequel transitent environ 20 % de l'approvisionnement mondial en petrole (AIE, Oil Market Report, avril 2026). Au 16 avril 2026, un blocus americain des ports iraniens est en cours et les negociations de paix pietinent. Ce bulletin analyse les consequences economiques de ce conflit pour les economies ouest-africaines, en distinguant les effets immediats des dynamiques structurelles de moyen terme."
      ]},
      { heading: "1. Le choc petrolier : ampleur et mecanismes de transmission", paragraphs: [
        "Le prix du Brent est passe d'environ 70 dollars le baril avant le conflit a 80-82 dollars des le 2 mars, avant d'atteindre un pic a 120 dollars, puis de redescendre autour de 100 dollars mi-avril, soit une hausse de plus de 40 % depuis le debut de la guerre (CNN Business, 13 avril 2026 ; CBS News, avril 2026). Le directeur de l'Agence internationale de l'energie a qualifie cette situation de \"plus grand defi de securite energetique mondiale de l'histoire\" (AIE, cite par Al Jazeera, 13 avril 2026).",
        "Pour l'Afrique de l'Ouest, region largement importatrice nette de produits petroliers raffines, ce choc se transmet par trois canaux principaux : le cout direct des carburants importes, le rencherissement du transport et donc des prix alimentaires, et l'alourdissement des depenses publiques pour les pays qui subventionnent les carburants. Les prix du carburant sur le continent ont augmente de 15 a 40 % selon les pays (CNN, 10 avril 2026)."
      ]},
      { heading: "2. Nigeria : une position duale", paragraphs: [
        "Le Nigeria occupe une position ambivalente. En tant que producteur petrolier, il beneficie de la hausse des cours pour ses revenus d'exportation. La raffinerie Dangote, qui a atteint sa capacite nominale de 650 000 barils par jour en fevrier 2026, s'est imposee comme un acteur continental majeur : les exportations nigerianes de produits petroliers raffines ont plus que double, passant de 100 000 barils par jour en fevrier a 214 000 barils par jour en mars 2026 (Semafor, 8 avril 2026). Dangote a livre 456 000 tonnes de produits raffines a la Cote d'Ivoire, au Cameroun, a la Tanzanie, au Ghana et au Togo (Bloomberg, 23 mars 2026).",
        "Ce positionnement transforme le Nigeria en amortisseur regional. Les importations de diesel en Afrique de l'Ouest ont chute a 899 000 tonnes en avril, contre 1,355 million de tonnes en mars (S&P Global/IndexBox, avril 2026), signe d'un debut de substitution regionale. Toutefois, les prix a la pompe ont egalement augmente pour les consommateurs nigerians (Africanews, 11 mars 2026)."
      ]},
      { heading: "3. Senegal : un producteur emergent en position favorable", paragraphs: [
        "Le Senegal se distingue comme nouveau producteur petrolier depuis le demarrage du champ Sangomar, dont la premiere production a eu lieu en juin 2024, avec environ 3,8 millions de barils exportes en janvier 2026 (Energy Capital & Power). Le pays est egalement devenu exportateur de GNL via le projet Greater Tortue Ahmeyim (GTA) partage avec la Mauritanie, dont le premier cargo a ete exporte en avril 2025. Dans le contexte actuel, le Senegal renforce son cadre reglementaire pour les hydrocarbures (World Oil, 14 avril 2026) et pourrait tirer parti de cette conjoncture, a condition de gerer les retombees inflationnistes internes."
      ]},
      { heading: "4. Ghana et pays saheliens : vulnerabilites accentuees", paragraphs: [
        "Le Ghana, importateur net d'energie et deja fragilise par sa restructuration de dette, est parmi les plus exposes. La Banque mondiale, le FMI et l'AIE ont averti que le conflit pourrait provoquer des problemes de securite alimentaire, des pertes d'emplois et une hausse marquee des prix des carburants dans le pays (World Bank/IMF/IEA, avril 2026).",
        "Les pays saheliens — Mali, Burkina Faso et Niger — deja fragilises par l'instabilite securitaire et leur retrait de la CEDEAO, subissent un choc supplementaire. Les intrants fertilisants lies aux chaines d'approvisionnement du Golfe sont devenus rares et chers. Selon le Stimson Center, des reductions de rendement de 20 a 30 % sont plausibles dans certaines parties du Sahel si les penuries d'intrants persistent (Stimson Center, 2026). Cette crise survient au moment de la saison de plantation de mars a mai, quand la demande en engrais est a son pic (CSIS, 2026)."
      ]},
      { heading: "5. Impact macroeconomique regional", paragraphs: [
        "Le FMI a abaisse ses previsions de croissance pour l'Afrique subsaharienne a 4,3 % en 2026, contre 4,6 % estimes en janvier, soit une revision a la baisse de 0,4 point de pourcentage (FMI, World Economic Outlook, avril 2026). La Banque mondiale prevoit desormais une croissance de 4,1 %, en baisse par rapport aux 4,4 % anticipes en octobre 2025 (Bloomberg, 8 avril 2026). Le FMI projette une inflation en hausse de 190 points de base, atteignant 5,8 % pour la region. Le franc CFA a perdu plus de 2 % depuis le debut du conflit (Atlas Institute for International Affairs).",
        "A plus long terme, les pays du Golfe pourraient reevaluer ou retarder plus de 100 milliards de dollars d'investissements prevus en Afrique pour se concentrer sur la securite interieure (CGDev, 2026). Les transferts de fonds depuis les pays du Golfe, estimes a 88 milliards de dollars par an au niveau mondial (Stimson Center), sont egalement menaces. Les donnees desagregees pour l'Afrique de l'Ouest ne sont pas encore disponibles."
      ]},
      { heading: "6. Elements de resilience et perspectives", paragraphs: [
        "Malgre ce tableau, des facteurs jouent en faveur de la region. Le role de la raffinerie Dangote comme amortisseur regional est structurellement significatif. Le Senegal et la Mauritanie, en tant que nouveaux producteurs, diversifient les sources d'approvisionnement regionales. Selon African Business (avril 2026), cette crise pourrait agir comme catalyseur d'une reconstruction strategique en accelerant les politiques d'autonomie energetique du continent."
      ]},
      { heading: "Sources", paragraphs: [
        "FMI, World Economic Outlook, avril 2026 | Banque mondiale, Africa Economic Update, avril 2026 | AIE, Oil Market Report, avril 2026 | Stimson Center, Impacts of the Iran War on North Africa, the Sahel, and the Mediterranean, 2026 | Bloomberg, Dangote Ships Fuel to Five Nations, 23 mars 2026 | Semafor, Dangote Refinery Increases Exports, 8 avril 2026 | CNN Business, Oil Prices and Hormuz Blockade, 13 avril 2026 | CSIS, Iran, Fertilizer, and Food Security, 2026 | CGDev, Will the Iran War Be the Breaking Point?, 2026"
      ]}
    ]
  },
  {
    id: 1, day: "10", month: "MAR", year: "2026",
    title: "Integration economique africaine : ou en est la ZLECAf ?",
    excerpt: "Etat des lieux de la mise en oeuvre de la Zone de libre-echange continentale africaine : avancees, obstacles structurels et perspectives pour les economies ouest-africaines.",
    tags: ["ZLECAf", "Integration", "Commerce"], category: "Integration economique africaine",
    content: [
      { heading: null, paragraphs: [
        "La Zone de libre-echange continentale africaine (ZLECAf), entree en vigueur le 1er janvier 2021, est le plus vaste accord commercial par le nombre de pays participants : 54 des 55 Etats membres de l'Union africaine l'ont signe et 47 l'ont ratifie a fin 2025 (Secretariat de la ZLECAf). L'accord vise a creer un marche unique de 1,4 milliard de personnes avec un PIB combine estime a 3 400 milliards de dollars (Banque mondiale, 2020). Cinq ans apres son lancement, ou en est veritablement sa mise en oeuvre ?"
      ]},
      { heading: "1. Etat des lieux de la mise en oeuvre", paragraphs: [
        "La Phase I, qui couvre le commerce des marchandises et des services, a progresse de maniere inegale. L'Initiative de commerce guide (Guided Trade Initiative), lancee en octobre 2022 entre sept pays pilotes, a ete elargie a 29 pays en 2024, avec plus de 300 produits couverts (Secretariat de la ZLECAf). Les volumes echanges sous ce regime restent toutefois limites par rapport au commerce total intra-africain.",
        "A fin 2025, environ 88 % des lignes tarifaires avaient fait l'objet d'offres de liberalisation, mais les produits sensibles et exclus representent un enjeu de taille (CNUCED, 2025). La Phase II, portant sur l'investissement, la concurrence et la propriete intellectuelle, n'a pas encore debute formellement."
      ]},
      { heading: "2. Obstacles structurels persistants", paragraphs: [
        "Plusieurs facteurs limitent l'impact de la ZLECAf. Les barrieres non tarifaires (BNT) restent le principal frein au commerce intra-africain : controles douaniers excessifs, normes divergentes, restrictions de transit. La Banque mondiale estime que les BNT representent un cout d'echange parfois superieur aux droits de douane eux-memes.",
        "Les infrastructures de transport demeurent insuffisantes. Le cout logistique en Afrique subsaharienne represente en moyenne 50 a 75 % de la valeur des produits echanges, contre 6 a 12 % dans les pays developpes (Banque africaine de developpement). Le commerce intra-africain ne represente qu'environ 15 % du commerce total du continent, contre 60 % en Europe et 50 % en Asie (CNUCED, 2024)."
      ]},
      { heading: "3. Implications pour l'Afrique de l'Ouest", paragraphs: [
        "L'Afrique de l'Ouest, a travers la CEDEAO, dispose deja d'un des schemas d'integration les plus avances du continent avec un tarif exterieur commun (TEC) et un protocole de libre circulation. La ZLECAf offre l'opportunite d'elargir les debouches vers l'Afrique centrale, orientale et australe.",
        "Le Nigeria, premiere economie du continent, est un acteur cle. L'operationnalisation de la raffinerie Dangote, combinee a la ZLECAf, pourrait structurer des chaines de valeur energetiques regionales. Le Senegal, la Cote d'Ivoire et le Ghana pourraient beneficier de l'acces a de nouveaux marches. Le retrait du Mali, du Burkina Faso et du Niger de la CEDEAO complexifie cependant la donne sous-regionale."
      ]},
      { heading: "4. Perspectives", paragraphs: [
        "La Banque mondiale estime que la pleine mise en oeuvre de la ZLECAf pourrait augmenter les revenus de l'Afrique de 450 milliards de dollars d'ici 2035 et sortir 30 millions de personnes de l'extreme pauvrete (Banque mondiale, 2020). Ces estimations reposent sur des hypotheses ambitieuses. A court terme, l'impact restera modeste tant que les infrastructures logistiques et les mecanismes de facilitation du commerce ne seront pas renforces."
      ]},
      { heading: "Sources", paragraphs: [
        "Secretariat de la ZLECAf, Rapports annuels 2023-2025 | Banque mondiale, The African Continental Free Trade Area, 2020 | CNUCED, Economic Development in Africa Report, 2024-2025 | Banque africaine de developpement, Africa Infrastructure Development Index, 2024 | Commission de la CEDEAO, Rapport sur le commerce intra-communautaire, 2024"
      ]}
    ]
  },
  {
    id: 2, day: "03", month: "MAR", year: "2026",
    title: "Geopolitique du Sahel : recompositions economiques post-CEDEAO",
    excerpt: "Analyse des consequences economiques du retrait du Mali, du Burkina Faso et du Niger de la CEDEAO : flux commerciaux, transferts de fonds et corridors economiques.",
    tags: ["Sahel", "CEDEAO", "Geopolitique"], category: "Geopolitique Sahel",
    content: [
      { heading: null, paragraphs: [
        "Le retrait du Mali, du Burkina Faso et du Niger de la CEDEAO constitue une rupture institutionnelle majeure dans l'architecture de l'integration ouest-africaine. Officialise en janvier 2025, ce retrait s'accompagne de la creation de l'Alliance des Etats du Sahel (AES) et d'un projet de confederation. Ce bulletin analyse les consequences economiques de cette fragmentation pour les pays concernes et pour l'ensemble de la sous-region."
      ]},
      { heading: "1. La rupture institutionnelle", paragraphs: [
        "La CEDEAO repose sur trois piliers economiques : le tarif exterieur commun (TEC), le protocole de libre circulation des personnes et des biens, et des politiques sectorielles communes. Le retrait des trois pays saheliens remet en question leur participation a ces mecanismes. Les modalites pratiques de la sortie restent en cours de negociation, mais l'incertitude juridique affecte deja les decisions d'investissement et les flux commerciaux."
      ]},
      { heading: "2. Impact sur les flux commerciaux", paragraphs: [
        "Les trois pays saheliens sont des economies enclavees dont le commerce exterieur depend fortement des ports cotiers de la CEDEAO. Environ 70 a 80 % des importations du Mali transitent par le Senegal et la Cote d'Ivoire (Commission de la CEDEAO). Le Burkina Faso depend des corridors via le Togo, le Ghana et la Cote d'Ivoire.",
        "L'ODI estime que les couts logistiques pourraient augmenter de 10 a 20 % en cas de perturbation des corridors actuels. Les sanctions economiques imposees par la CEDEAO au Niger en 2023, bien que levees, ont illustre la vulnerabilite de ces economies enclavees."
      ]},
      { heading: "3. Transferts de fonds et diaspora", paragraphs: [
        "Les transferts de fonds constituent un flux vital pour le Sahel. Des communautes significatives de ces pays resident en Cote d'Ivoire, au Senegal et au Ghana. Ces transferts representent entre 4 et 6 % du PIB du Mali et environ 3 % de celui du Burkina Faso (Banque mondiale). Toute restriction a la libre circulation des personnes pourrait affecter ces flux, avec des consequences directes sur la consommation des menages."
      ]},
      { heading: "4. Nouveaux partenariats et zone CFA", paragraphs: [
        "Les pays de l'AES se tournent vers la Russie et la Turquie, mais ces partenaires restent marginaux sur le plan commercial. La question de l'UEMOA et de la zone CFA est distincte de celle de la CEDEAO. A ce stade, les trois pays restent membres de l'UEMOA, ce qui preserve la stabilite monetaire. Des declarations politiques evoquant une sortie de la zone CFA alimentent cependant l'incertitude."
      ]},
      { heading: "5. Implications pour la CEDEAO", paragraphs: [
        "Pour la CEDEAO, la perte de trois Etats membres reduit la portee de l'organisation et complique la gestion des corridors de transport, la lutte contre le terrorisme et les politiques agricoles. Le defi est de maintenir la porte ouverte a un retour eventuel des pays dissidents tout en preservant la coherence du projet d'integration."
      ]},
      { heading: "Sources", paragraphs: [
        "Commission de la CEDEAO, Communiques officiels, 2023-2025 | Banque mondiale, Migration and Remittances Data, 2024 | ODI, Sahel Conflict: Economic and Security Spillovers, 2023 | International Crisis Group, The Sahel Alliance, 2024 | UEMOA, Rapport economique et monetaire, 2025"
      ]}
    ]
  },
  {
    id: 3, day: "24", month: "FEV", year: "2026",
    title: "Chaines de valeur en Afrique : le role croissant de la Chine",
    excerpt: "Comment la presence chinoise restructure les chaines de valeur industrielles en Afrique subsaharienne : investissements, dependances et politique industrielle.",
    tags: ["Chine-Afrique", "Chaines de valeur", "Industrie"], category: "Chaines de valeur regionales",
    content: [
      { heading: null, paragraphs: [
        "La Chine est le premier partenaire commercial de l'Afrique depuis 2009, avec des echanges bilateraux depassant 280 milliards de dollars en 2024 (ministere chinois du Commerce). Au-dela des flux commerciaux, c'est la restructuration des chaines de valeur industrielles africaines par les acteurs chinois qui constitue le phenomene le plus significatif. A travers les IDE, les zones economiques speciales (ZES) et l'Initiative Ceinture et Route (BRI), la Chine reconfigure les modes de production sur le continent."
      ]},
      { heading: "1. Cartographie des investissements chinois", paragraphs: [
        "Les IDE chinois en Afrique se sont diversifies. Si les secteurs extractifs et les infrastructures restent predominants, le manufacturier a connu une croissance notable. Selon McKinsey, plus de 10 000 entreprises chinoises operent en Afrique, dont environ un tiers dans le manufacturier.",
        "Les ZES financees par la Chine, en Ethiopie, au Nigeria, en Zambie et au Rwanda, servent de plateformes pour l'insertion des economies africaines dans les chaines de valeur mondiales. La CNUCED note que ces ZES ont cree des emplois manufacturiers, bien que les effets d'entrainement sur le tissu local restent limites."
      ]},
      { heading: "2. La BRI et ses effets structurels", paragraphs: [
        "La BRI, lancee en 2013, a canalise des dizaines de milliards de dollars vers l'Afrique en infrastructures de transport et d'energie : chemin de fer Mombasa-Nairobi, port de Doraleh a Djibouti, reseau ferroviaire Addis-Abeba-Djibouti.",
        "Ces investissements facilitent le commerce mais peuvent renforcer l'orientation des economies africaines vers l'exportation de matieres premieres non transformees. La Banque mondiale souligne que l'impact sur l'industrialisation depend de la capacite des gouvernements a negocier des clauses de transfert de technologie et de contenu local."
      ]},
      { heading: "3. Risques de dependance", paragraphs: [
        "La concentration des relations commerciales avec un seul partenaire comporte des risques systemiques. Le ralentissement de l'economie chinoise en 2023-2024 a directement affecte les prix des matieres premieres et les revenus d'exportation de plusieurs pays africains. Le deficit commercial bilateral est structurel : l'Afrique exporte des matieres premieres et importe des produits manufactures, reproduisant un schema de type Nord-Sud."
      ]},
      { heading: "4. Opportunites et politique industrielle", paragraphs: [
        "La presence chinoise offre neanmoins des opportunites si elle est accompagnee de politiques industrielles adequates. Le transfert d'activites manufacturieres a faible cout de la Chine vers l'Afrique constitue une fenetre d'opportunite. L'Ethiopie, le Rwanda et le Kenya ont tente de capter cette dynamique.",
        "Pour l'Afrique de l'Ouest, l'enjeu est d'integrer la presence chinoise dans une strategie de diversification. La ZLECAf pourrait jouer un role catalyseur en elargissant les marches regionaux et en rendant l'Afrique plus attractive pour les investissements manufacturiers."
      ]},
      { heading: "Sources", paragraphs: [
        "Ministere chinois du Commerce, Statistiques bilaterales, 2024 | McKinsey, Dance of the Lions and Dragons, 2023 | CNUCED, World Investment Report, 2024 | Banque mondiale, Belt and Road Economics, 2019 | Johns Hopkins SAIS China-Africa Research Initiative, 2024"
      ]}
    ]
  },
];

export const BULLETINS = BULLETINS_DATA;
export const BULLETIN_CATEGORIES = ["Tous", "Geopolitique", "Integration economique africaine", "Geopolitique Sahel", "Chaines de valeur regionales"];
