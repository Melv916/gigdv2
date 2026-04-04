import type { SeoArticleDefinition } from "./resourceTypes";

export const strategicResourcePages: SeoArticleDefinition[] = [
  {
    path: "/rendement-brut-net-net-net",
    listingTitle: "Rendement brut, net, net-net",
    listingDescription:
      "Comprendre ce que chaque niveau de rendement dit vraiment avant de juger un investissement locatif.",
    title: "Rendement brut, net, net-net : comment vraiment juger un investissement locatif",
    description:
      "Rendement brut, rendement net, rendement net-net : découvrez la différence, les formules utiles et comment lire correctement un investissement locatif.",
    h1: "Rendement brut, net, net-net : comment vraiment juger un investissement locatif",
    intro:
      "Le rendement brut est utile pour filtrer rapidement un bien. Le problème, c’est qu’il ne suffit presque jamais à décider. Entre les frais de notaire, la vacance, les charges, la taxe foncière, les travaux et la fiscalité, deux biens affichant le même rendement brut peuvent produire des résultats totalement différents.\n\nChez GIGD, le bon réflexe n’est pas de s’arrêter au brut. Il faut lire le bien en trois couches : rendement brut pour la vitesse de tri, rendement net pour la réalité opérationnelle, rendement net-net pour la réalité après fiscalité.",
    eyebrow: "Comprendre",
    heroTag: "Rendement",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le brut sert à filtrer vite, pas à décider seul.",
      "Le net remet les coûts d’exploitation dans la lecture.",
      "Le net-net montre ce qu’il reste vraiment après fiscalité.",
    ],
    keyPointsTitle: "Réflexes investisseur",
    keyPointsIntro:
      "Le bon niveau de rendement dépend moins d’un chiffre affiché que de la qualité de ce qu’il reste quand tous les étages du dossier sont remis dans l’analyse.",
    keyPoints: [
      "Le rendement brut est un filtre d’entrée, pas un verdict.",
      "Le rendement net répond à la réalité opérationnelle du bien.",
      "Le rendement net-net réintègre la fiscalité et évite les faux bons dossiers.",
      "Une analyse sérieuse croise rendement, coût global, cash-flow et régime fiscal.",
    ],
    sections: [
      {
        title: "Le rendement brut : utile, mais incomplet",
        paragraphs: [
          "Le rendement brut répond à une question simple : quel pourcentage du prix d’achat est théoriquement couvert par le loyer annuel ?",
          "C’est un bon indicateur d’entrée, car il permet de comparer rapidement plusieurs annonces. Mais il ne tient pas compte des frais de notaire, des travaux, des charges non récupérables, de la taxe foncière, de la vacance locative ni de la fiscalité.",
          "Un rendement brut élevé peut donc être trompeur.",
        ],
        bullets: [
          "Formule simple : rendement brut = loyer annuel / prix d’achat × 100",
          "Il accélère le tri initial entre plusieurs biens.",
          "Il ne mesure ni l’exploitation réelle ni la fiscalité finale.",
          "Deux biens au même brut peuvent produire deux résultats très différents.",
        ],
      },
      {
        title: "Le rendement net : la lecture opérationnelle",
        paragraphs: [
          "Le rendement net pousse l’analyse un cran plus loin. Il intègre les coûts récurrents que l’investisseur supporte réellement.",
          "En pratique, il faut généralement retrancher les charges non récupérables, la taxe foncière, l’assurance, les frais de gestion éventuels, une vacance prudente et les petits frais récurrents.",
          "Le rendement net répond à une question plus utile : ce bien reste-t-il solide une fois les vrais coûts intégrés ?",
        ],
      },
      {
        title: "Le rendement net-net : la lecture investisseur",
        paragraphs: [
          "Le rendement net-net ajoute la fiscalité. C’est là que les écarts deviennent significatifs.",
          "Un bien peut afficher un brut séduisant, un net correct, puis un résultat beaucoup plus faible après impôt selon le régime choisi.",
          "C’est exactement pour cela que GIGD distingue la lecture économique et la lecture fiscale.",
        ],
      },
      {
        title: "Exemple simple",
        paragraphs: [
          "Prenons un bien acheté 130 000 € et loué 1 000 € par mois.",
          "Le loyer annuel est de 12 000 € et le rendement brut ressort à 9,2 %. Si les charges, la taxe foncière, l’assurance et la vacance représentent 2 800 € par an, le rendement réel baisse déjà fortement. Si l’imposition vient ensuite rogner le cash-flow, la lecture finale peut être très différente.",
          "Le brut sert à filtrer. Le net et le net-net servent à décider.",
        ],
      },
      {
        title: "Ce qu’un investisseur regarde vraiment",
        paragraphs: [
          "Un investisseur ne devrait pas se demander seulement : le brut est-il bon ?",
          "Il devrait se demander si le loyer est crédible, si le coût global est cohérent, si le cash-flow tient après vacance et charges, si le résultat reste pertinent après impôt et si le montage fiscal choisi améliore vraiment le dossier.",
        ],
      },
      {
        title: "Bon réflexe GIGD",
        paragraphs: [
          "Dans GIGD, le rendement brut est un premier filtre. La vraie décision se joue ensuite avec le cash-flow, le coût global, le seuil de loyer, le marché local et la simulation fiscale selon le régime choisi.",
        ],
      },
    ],
    relatedPaths: [
      "/cash-flow-avant-impot-apres-impot",
      "/cout-global-acquisition",
      "/objectif-rendement-brut",
      "/calcul-rentabilite-locative",
    ],
    relatedTitle: "Pages à relier à cette lecture",
    productTitle: "Comment GIGD aide à juger le rendement",
    productPoints: [
      "Lecture du brut, du net et du net-net sur le même bien.",
      "Mise en contexte avec coût global, loyer et cash-flow.",
      "Simulation fiscale pour éviter les rendements seulement flatteurs.",
    ],
    ctaTitle: "Voir si le bien est solide, pas seulement séduisant",
    ctaDescription:
      "Vous voulez savoir si votre bien est bon seulement en apparence, ou réellement solide une fois tout intégré ? Lancez une analyse GIGD.",
    ctaLabel: "Lancer une analyse GIGD",
    ctaSecondaryLabel: "Lire le cash-flow avant et après impôt",
    ctaSecondaryHref: "/cash-flow-avant-impot-apres-impot",
    closingNote:
      "Le bon réflexe n’est pas de chercher le plus beau brut. C’est de vérifier ce qu’il reste quand le bien repasse dans sa vraie économie.",
  },
  {
    path: "/cash-flow-avant-impot-apres-impot",
    listingTitle: "Cash-flow avant impôt et après impôt",
    listingDescription:
      "Comparer la trésorerie avant fiscalité et après fiscalité pour éviter les faux dossiers positifs.",
    title: "Cash-flow avant impôt et après impôt : quelle différence pour un investissement locatif ?",
    description:
      "Découvrez pourquoi un cash-flow positif avant impôt ne suffit pas toujours, et comment lire correctement votre cash-flow après fiscalité.",
    h1: "Cash-flow avant impôt et après impôt : la différence qui change un deal",
    intro:
      "Beaucoup d’investisseurs s’arrêtent à une seule question : est-ce que mon cash-flow est positif ?\n\nEn réalité, il faut distinguer deux lectures : le cash-flow avant impôt et le cash-flow après impôt. Un bien peut produire un cash-flow mensuel positif sur le papier, puis devenir beaucoup moins intéressant une fois le régime fiscal appliqué.",
    eyebrow: "Comprendre",
    heroTag: "Cash-flow",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le cash-flow avant impôt mesure la tenue opérationnelle.",
      "Le cash-flow après impôt mesure la vraie trésorerie investisseur.",
      "Le régime fiscal peut changer complètement la lecture d’un même bien.",
    ],
    keyPointsTitle: "Lecture décisive",
    keyPointsIntro:
      "Un bien n’est pas bon parce qu’il dégage un petit surplus mensuel avant fiscalité. Il est bon si ce surplus reste cohérent dans le montage réellement utilisé.",
    keyPoints: [
      "Le cash-flow avant impôt aide à comparer l’exploitation de plusieurs biens.",
      "La fiscalité peut effacer une partie importante d’un cash-flow positif.",
      "Le bon indicateur de décision reste le cash-flow après impôt.",
      "Il faut toujours relier ce résultat à l’objectif poursuivi.",
    ],
    sections: [
      {
        title: "Le cash-flow avant impôt",
        paragraphs: [
          "Le cash-flow avant impôt mesure la trésorerie restante après les revenus et les dépenses d’exploitation, avant prise en compte de la fiscalité.",
          "Il permet de voir rapidement si le loyer couvre bien les charges, si la mensualité est soutenable et si le bien s’autofinance à peu près.",
          "C’est une lecture très utile pour comparer deux annonces à structure de financement comparable.",
        ],
      },
      {
        title: "Pourquoi ce n’est pas suffisant",
        paragraphs: [
          "Le cash-flow avant impôt ne dit rien de la manière dont les revenus seront imposés.",
          "Or la différence entre micro-foncier, réel foncier, micro-BIC, réel, SCI à l’IR et SCI à l’IS peut changer fortement le résultat final.",
        ],
      },
      {
        title: "Le cash-flow après impôt",
        paragraphs: [
          "Le cash-flow après impôt est la vraie lecture investisseur.",
          "Il répond à la question : qu’est-ce qu’il me reste réellement après la fiscalité du montage choisi ?",
          "C’est cet indicateur qui permet d’éviter les faux bons dossiers.",
        ],
      },
      {
        title: "Quand un cash-flow positif peut être trompeur",
        paragraphs: [
          "Un bien peut sembler intéressant parce qu’il dégage +50 € ou +100 € par mois avant impôt.",
          "Mais si le régime choisi est peu adapté, si la base taxable est élevée, si les charges ne sont pas correctement absorbées, si les amortissements ne jouent pas, ou si les prélèvements s’ajoutent fortement, le résultat réel peut devenir beaucoup moins bon.",
        ],
      },
      {
        title: "Bon réflexe",
        paragraphs: [
          "Un investisseur sérieux doit toujours lire quatre niveaux : cash-flow avant impôt, impôt estimé, cash-flow après impôt et cohérence avec son objectif.",
          "Un bien n’est pas bon parce qu’il affiche un cash-flow brut positif. Il est bon si ce cash-flow reste cohérent dans le régime que vous allez réellement utiliser.",
        ],
      },
    ],
    relatedPaths: [
      "/rendement-brut-net-net-net",
      "/micro-foncier-ou-reel",
      "/lmnp-micro-bic-ou-reel",
      "/cash-flow-immobilier",
    ],
    relatedTitle: "Comparer la trésorerie avec les bons angles",
    productTitle: "Dans GIGD, le cash-flow reste relié au montage",
    productPoints: [
      "Lecture avant impôt et après impôt sur le même dossier.",
      "Comparaison immédiate selon le régime fiscal retenu.",
      "Vision de trésorerie plus utile qu’un simple cash-flow brut positif.",
    ],
    ctaTitle: "Comparer la trésorerie avant et après fiscalité",
    ctaDescription:
      "Dans GIGD, comparez le cash-flow avant impôt et après impôt selon le régime fiscal choisi.",
    ctaLabel: "Comparer le cash-flow dans GIGD",
    ctaSecondaryLabel: "Revenir au rendement brut, net, net-net",
    ctaSecondaryHref: "/rendement-brut-net-net-net",
    closingNote:
      "Le vrai bon dossier n’est pas celui qui semble respirer avant fiscalité. C’est celui qui tient encore après.",
  },
  {
    path: "/micro-foncier-ou-reel",
    listingTitle: "Micro-foncier ou réel",
    listingDescription:
      "Arbitrer entre simplicité et charges réelles pour une location nue en nom propre.",
    title: "Micro-foncier ou régime réel : que choisir pour une location nue ?",
    description:
      "Découvrez quand le micro-foncier est pertinent, quand le réel devient plus intéressant, et comment arbitrer pour une location nue.",
    h1: "Micro-foncier ou régime réel : que choisir pour une location nue ?",
    intro:
      "Pour une location nue en nom propre, le choix du régime fiscal change directement la lecture de votre investissement.\n\nLe micro-foncier est simple. Le régime réel est souvent plus intéressant quand les charges deviennent significatives.\n\nLe bon choix dépend moins d’une préférence théorique que d’une question concrète : vos charges réelles dépassent-elles l’avantage du forfait ?",
    eyebrow: "Structurer",
    heroTag: "Fiscalité",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le micro-foncier privilégie la simplicité et un abattement forfaitaire.",
      "Le réel devient souvent pertinent dès que les charges pèsent réellement.",
      "Le bon arbitrage se fait sur la base taxable et le cash-flow après impôt.",
    ],
    keyPointsTitle: "Ce qu’il faut arbitrer",
    keyPointsIntro:
      "Le sujet n’est pas de savoir quel régime est meilleur en général. Il faut comparer ce que vaut réellement le forfait face à vos charges déductibles.",
    keyPoints: [
      "Le micro-foncier reste cohérent si les charges sont faibles et la gestion recherchée simple.",
      "Le réel prend souvent l’avantage avec intérêts, travaux et charges importantes.",
      "Le régime fiscal influence directement le cash-flow après impôt.",
      "Il faut comparer base taxable, impôt estimé et rendement net-net.",
    ],
    sections: [
      {
        title: "Le micro-foncier : simple, mais limité",
        paragraphs: [
          "Le micro-foncier s’applique si vos revenus fonciers bruts n’excèdent pas 15 000 € par an. Il ouvre droit à un abattement forfaitaire de 30 % représentatif des charges. En contrepartie, vous ne pouvez pas déduire vos charges réelles ni vos travaux.",
          "En clair, le micro-foncier est souvent pertinent si le bien a peu de charges, s’il n’y a pas de gros travaux, si les intérêts d’emprunt pèsent peu et si vous cherchez une gestion simple.",
        ],
      },
      {
        title: "Le régime réel : plus exigeant, souvent plus efficace",
        paragraphs: [
          "Le régime réel permet de prendre en compte les charges réelles éligibles, notamment les intérêts d’emprunt dans le cadre d’un bien acheté pour être loué.",
          "Il devient souvent plus intéressant si vous avez des intérêts d’emprunt élevés, des travaux, une taxe foncière importante, des charges non récupérables significatives ou des frais réels supérieurs au forfait implicite du micro-foncier.",
        ],
      },
      {
        title: "Le bon arbitre",
        paragraphs: [
          "La vraie question n’est pas : quel régime est le meilleur en général ?",
          "La vraie question est : le forfait de 30 % du micro-foncier est-il plus ou moins intéressant que vos charges réelles déductibles ?",
          "Si vos charges réelles sont faibles, le micro-foncier peut être cohérent. Si elles sont importantes, le réel devient souvent plus logique.",
        ],
      },
      {
        title: "Erreur fréquente",
        paragraphs: [
          "Beaucoup d’investisseurs regardent seulement le rendement brut et négligent le régime fiscal. Résultat : ils surévaluent le cash-flow après impôt.",
          "Un bien avec travaux et crédit n’a pas la même lecture qu’un bien déjà stabilisé.",
        ],
      },
      {
        title: "Ce que GIGD doit comparer",
        paragraphs: [
          "Pour arbitrer correctement, il faut comparer la base taxable, l’impôt estimé, le cash-flow après impôt, le rendement net-net et la complexité du régime.",
        ],
      },
    ],
    relatedPaths: [
      "/sci-ir-ou-sci-is",
      "/cash-flow-avant-impot-apres-impot",
      "/rendement-brut-net-net-net",
      "/sci-ou-nom-propre",
    ],
    relatedTitle: "Régimes et structures à comparer ensemble",
    productTitle: "Ce que GIGD remet dans l’arbitrage",
    productPoints: [
      "Comparaison micro-foncier vs réel sur le même bien.",
      "Lecture de l’impôt estimé et du cash-flow après impôt.",
      "Vision plus claire du vrai gain apporté par le régime retenu.",
    ],
    ctaTitle: "Comparer micro-foncier et réel sur un cas concret",
    ctaDescription:
      "Vous hésitez entre micro-foncier et réel ? Testez les deux dans GIGD et comparez le cash-flow après impôt.",
    ctaLabel: "Comparer les deux régimes",
    ctaSecondaryLabel: "Comparer aussi SCI IR et SCI IS",
    ctaSecondaryHref: "/sci-ir-ou-sci-is",
    closingNote:
      "La bonne option n’est pas la plus simple en théorie. C’est celle qui laisse le meilleur résultat dans le cadre réel de votre bien.",
  },
  {
    path: "/lmnp-micro-bic-ou-reel",
    listingTitle: "LMNP micro-BIC ou réel",
    listingDescription:
      "Comparer simplicité, charges et amortissements pour une location meublée.",
    title: "LMNP micro-BIC ou réel : quel régime choisir en location meublée ?",
    description:
      "Comparez LMNP micro-BIC et LMNP réel pour savoir quel régime est le plus adapté à votre location meublée.",
    h1: "LMNP micro-BIC ou réel : quel régime choisir en location meublée ?",
    intro:
      "En location meublée, les revenus sont imposés dans la catégorie des BIC. Le choix du régime fiscal peut fortement changer la rentabilité après impôt.\n\nEn pratique, l’arbitrage entre micro-BIC et réel revient à comparer la simplicité, la déduction réelle des charges et, surtout, l’effet économique du régime sur votre cash-flow après impôt.",
    eyebrow: "Structurer",
    heroTag: "LMNP",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le micro-BIC simplifie la lecture mais reste forfaitaire.",
      "Le réel devient puissant dès que charges et amortissements comptent.",
      "L’arbitrage se juge sur le cash-flow après impôt, pas sur la popularité du régime.",
    ],
    keyPointsTitle: "Lecture utile",
    keyPointsIntro:
      "En meublé, le bon régime n’est pas celui qui semble le plus connu. C’est celui qui améliore réellement la trésorerie et la base imposable du bien étudié.",
    keyPoints: [
      "Le micro-BIC reste pertinent si la simplicité prime et que les charges sont limitées.",
      "Le réel permet de tenir compte des charges, amortissements et frais comptables.",
      "Le meublé peut devenir beaucoup plus attractif avec une lecture fiscale adaptée.",
      "Il faut comparer cash-flow avant impôt, base imposable et charge administrative.",
    ],
    sections: [
      {
        title: "Le micro-BIC : simple, mais forfaitaire",
        paragraphs: [
          "Le micro-BIC s’applique par défaut si vous n’optez pas pour le réel. Pour la location meublée de longue durée, l’activité relève du régime BIC ; selon le cas, le micro-BIC repose sur un abattement forfaitaire et ne permet pas la déduction des charges réelles.",
          "C’est souvent le bon choix si vous privilégiez la simplicité, si vous avez peu de charges, si le bien nécessite peu de comptabilité ou d’ajustement et si vous ne cherchez pas à optimiser finement la base imposable.",
        ],
      },
      {
        title: "Le réel : plus technique, mais souvent plus puissant",
        paragraphs: [
          "Le réel permet de tenir compte des charges et, selon le montage, d’amortissements et de frais comptables, ce qui peut profondément modifier le résultat imposable.",
          "C’est souvent là que le meublé devient plus intéressant qu’une simple lecture du brut ne le laisse penser.",
        ],
      },
      {
        title: "La vraie question",
        paragraphs: [
          "Le bon arbitrage n’est pas : quel régime est le plus populaire ?",
          "C’est : le forfait du micro-BIC est-il plus intéressant que vos charges réelles et amortissements ?",
          "Si les charges, les intérêts, la comptabilité et la structure du bien pèsent réellement, le réel devient souvent très pertinent.",
        ],
      },
      {
        title: "Ce qu’un investisseur doit comparer",
        paragraphs: [
          "Pour choisir correctement, il faut regarder le cash-flow avant impôt, la base imposable, l’impôt estimé, le cash-flow après impôt et la charge administrative du régime.",
        ],
      },
    ],
    relatedPaths: [
      "/objectif-rendement-brut",
      "/cash-flow-avant-impot-apres-impot",
      "/estimation-loyer",
      "/rendement-brut-net-net-net",
    ],
    relatedTitle: "Pages à relier à un dossier meublé",
    productTitle: "Comment GIGD arbitre le meublé",
    productPoints: [
      "Comparaison LMNP micro-BIC vs réel sur le même bien.",
      "Lecture combinée de la base imposable et de la trésorerie finale.",
      "Vision plus concrète de l’impact des amortissements sur la décision.",
    ],
    ctaTitle: "Tester LMNP micro-BIC et réel sur le même bien",
    ctaDescription:
      "Dans GIGD, comparez LMNP micro-BIC et LMNP réel sur le même bien pour voir l’impact réel sur votre trésorerie.",
    ctaLabel: "Comparer les régimes LMNP",
    ctaSecondaryLabel: "Définir aussi votre objectif de rendement brut",
    ctaSecondaryHref: "/objectif-rendement-brut",
    closingNote:
      "Le bon régime en meublé n’est pas une habitude. C’est un arbitrage chiffré entre simplicité et résultat réel.",
  },
  {
    path: "/sci-ir-ou-sci-is",
    listingTitle: "SCI à l’IR ou SCI à l’IS",
    listingDescription:
      "Comparer logique patrimoniale, trésorerie et horizon de détention pour choisir la bonne structure.",
    title: "SCI à l’IR ou SCI à l’IS : comment choisir pour investir ?",
    description:
      "Comparez SCI à l’IR et SCI à l’IS pour comprendre la logique fiscale, patrimoniale et de trésorerie de chaque structure.",
    h1: "SCI à l’IR ou SCI à l’IS : comment choisir pour investir ?",
    intro:
      "SCI à l’IR ou SCI à l’IS : c’est une question fréquente, mais souvent mal posée.\n\nLe bon raisonnement n’est pas : quelle structure est la meilleure ?\n\nLe bon raisonnement est : quel est votre objectif, quel type de bien vous achetez, quel horizon vous visez et comment vous voulez utiliser la trésorerie.",
    eyebrow: "Structurer",
    heroTag: "SCI",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le bon choix dépend du projet, pas d’un taux isolé.",
      "IR et IS ne racontent pas la même logique patrimoniale.",
      "La vraie différence se lit dans la trésorerie, la distribution et l’horizon.",
    ],
    keyPointsTitle: "Ce qui change vraiment",
    keyPointsIntro:
      "Le choix entre IR et IS ne se résume pas à un arbitrage de taux. Il modifie la lecture de la détention, de la capitalisation et de la sortie.",
    keyPoints: [
      "La SCI à l’IR reste souvent plus intuitive dans une logique patrimoniale classique.",
      "La SCI à l’IS introduit une lecture plus capitalisée et plus “entreprise”.",
      "La comparaison doit intégrer trésorerie, amortissements, distribution et stratégie long terme.",
      "La holding n’entre que dans une lecture avancée, pas dans une réponse standard.",
    ],
    sections: [
      {
        title: "La SCI à l’IR : lecture patrimoniale plus simple",
        paragraphs: [
          "Dans une logique patrimoniale classique, la SCI à l’IR reste souvent plus intuitive à comprendre. Elle s’inscrit davantage dans une lecture proche des revenus fonciers.",
          "Elle peut convenir si vous cherchez une détention à plusieurs, une logique patrimoniale, une structure lisible, sans rechercher immédiatement une logique de capitalisation en société.",
        ],
      },
      {
        title: "La SCI à l’IS : logique plus “entreprise”",
        paragraphs: [
          "À l’IS, la logique change. On entre dans une lecture plus proche d’une structure capitalisée, avec un traitement différent du résultat, de la trésorerie et de la distribution.",
          "Le taux normal de l’IS est de 25 %. Un taux réduit de 15 % peut s’appliquer jusqu’à 42 500 € de bénéfices sous conditions pour certaines PME.",
        ],
      },
      {
        title: "La vraie différence",
        paragraphs: [
          "La différence entre SCI à l’IR et SCI à l’IS ne se limite pas au taux d’imposition.",
          "Elle porte sur la lecture du résultat, la place des amortissements selon la structure choisie, la capacité à laisser de la trésorerie dans la société, la distribution future et la stratégie à long terme.",
        ],
      },
      {
        title: "Quand l’IS attire… et pourquoi il faut rester prudent",
        paragraphs: [
          "La SCI à l’IS peut sembler plus séduisante parce qu’elle permet une lecture plus “business” de l’investissement. Mais elle n’est pas un bouton magique.",
          "Elle doit être lue à travers votre horizon, votre stratégie de revente, votre besoin de trésorerie personnelle et votre logique patrimoniale.",
        ],
      },
      {
        title: "Et la holding ?",
        paragraphs: [
          "Dans un montage avancé, la remontée de dividendes peut entrer dans une logique de holding. Le régime mère-fille permet en principe une exonération de 95 % des dividendes remontés, avec une quote-part imposable résiduelle.",
          "C’est un sujet puissant, mais plus complexe. Il doit rester dans une lecture avancée, pas dans une réponse standard.",
        ],
      },
      {
        title: "Ce qu’il faut comparer dans GIGD",
        paragraphs: [
          "Pour arbitrer SCI IR vs SCI IS, il faut comparer cash-flow avant impôt, fiscalité estimée, cash-flow après impôt, trésorerie laissée en structure, logique patrimoniale et complexité.",
        ],
      },
    ],
    relatedPaths: [
      "/micro-foncier-ou-reel",
      "/cash-flow-avant-impot-apres-impot",
      "/sci-ou-nom-propre",
      "/comparer-deux-investissements-locatifs",
    ],
    relatedTitle: "Compléter la réflexion de structuration",
    productTitle: "Comment GIGD cadre la comparaison",
    productPoints: [
      "Même bien, même financement, deux lectures de structure comparables.",
      "Mise en regard de la trésorerie, de la fiscalité et de la logique patrimoniale.",
      "Outil d’aide à la décision, sans remplacer un conseil juridique personnalisé.",
    ],
    ctaTitle: "Comparer SCI IR et SCI IS sur une base identique",
    ctaDescription:
      "Vous hésitez entre SCI à l’IR et SCI à l’IS ? Comparez les deux dans GIGD avec le même bien et le même financement.",
    ctaLabel: "Comparer SCI IR et SCI IS",
    ctaSecondaryLabel: "Comparer aussi micro-foncier et réel",
    ctaSecondaryHref: "/micro-foncier-ou-reel",
    closingNote:
      "La meilleure structure n’existe pas dans l’absolu. La bonne structure est celle qui sert votre stratégie sans fausser la lecture du deal.",
  },
  {
    path: "/cout-global-acquisition",
    listingTitle: "Coût global d’acquisition",
    listingDescription:
      "Revenir à la vraie base d’analyse d’un bien : le coût total, pas seulement le prix affiché.",
    title: "Coût global d’acquisition : la vraie base pour analyser un investissement locatif",
    description:
      "Prix d’achat, notaire, travaux, mobilier, frais annexes : découvrez pourquoi le coût global est la vraie base d’un calcul sérieux.",
    h1: "Coût global d’acquisition : la vraie base pour analyser un investissement locatif",
    intro:
      "Une erreur très fréquente consiste à analyser un investissement à partir du seul prix affiché.\n\nEn réalité, l’investisseur n’achète jamais seulement un prix d’annonce. Il achète un bien, des frais, des travaux éventuels, parfois du mobilier, et souvent une enveloppe totale très différente du prix de départ.",
    eyebrow: "Analyser",
    heroTag: "Coût global",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Le prix affiché n’est jamais la vraie base de calcul.",
      "Le coût global conditionne rendement, mensualité et apport.",
      "Une comparaison sans coût global est mécaniquement faussée.",
    ],
    keyPointsTitle: "Base d’analyse",
    keyPointsIntro:
      "Avant de commenter la rentabilité d’un bien, il faut savoir ce que coûte réellement l’opération dans son ensemble.",
    keyPoints: [
      "Le coût global inclut le prix, les frais, les travaux et les postes d’entrée.",
      "L’ignorer gonfle artificiellement le rendement brut.",
      "Il influence l’effort de financement et l’apport à mobiliser.",
      "Toute lecture sérieuse du cash-flow doit partir de cette base.",
    ],
    sections: [
      {
        title: "Le prix affiché n’est pas le vrai point de départ",
        paragraphs: [
          "Quand un bien est affiché à 130 000 €, cela ne signifie pas que votre analyse doit partir de 130 000 €.",
          "Il faut regarder les frais de notaire, les travaux, les autres coûts d’entrée, l’ameublement éventuel et les frais administratifs ou techniques.",
          "Le coût global est la vraie base de lecture du projet.",
        ],
      },
      {
        title: "Pourquoi c’est si important",
        paragraphs: [
          "Si vous calculez votre rendement sur le prix affiché uniquement, vous risquez d’améliorer artificiellement le brut, de minimiser l’effort de financement, de sous-estimer l’apport et de vous tromper sur la rentabilité réelle.",
        ],
      },
      {
        title: "Le bon réflexe",
        paragraphs: [
          "Avant de vous demander si le brut est bon, demandez-vous combien vous coûte réellement l’opération au total.",
          "C’est cette base qui permet ensuite de lire correctement la mensualité, le rendement, le cash-flow, la fiscalité et la projection patrimoniale.",
        ],
      },
      {
        title: "Dans GIGD",
        paragraphs: [
          "Le cockpit doit permettre de distinguer clairement le prix annoncé, le coût global, le coût global cible et l’impact de chaque poste sur l’analyse.",
        ],
      },
    ],
    relatedPaths: [
      "/comparer-deux-investissements-locatifs",
      "/frais-notaire",
      "/rendement-brut-net-net-net",
      "/analyser-une-annonce-immobiliere",
    ],
    relatedTitle: "Pages à relier au coût global",
    productTitle: "Ce que GIGD replace dans la base de calcul",
    productPoints: [
      "Distinction claire entre prix affiché et enveloppe réelle du projet.",
      "Impact direct du coût global sur rendement, cash-flow et effort de financement.",
      "Lecture plus juste pour comparer plusieurs biens sur une base homogène.",
    ],
    ctaTitle: "Analyser le bien à partir de son vrai coût",
    ctaDescription:
      "Ne partez plus du prix affiché. Lancez une analyse GIGD et lisez le bien à partir de son coût global réel.",
    ctaLabel: "Lire le coût global dans GIGD",
    ctaSecondaryLabel: "Comparer ensuite deux investissements",
    ctaSecondaryHref: "/comparer-deux-investissements-locatifs",
    closingNote:
      "Un rendement calculé sur une mauvaise base n’est pas un détail. C’est une décision biaisée dès la première ligne.",
  },
  {
    path: "/comparer-deux-investissements-locatifs",
    listingTitle: "Comparer deux investissements locatifs",
    listingDescription:
      "Utiliser une méthode homogène pour départager deux biens sans se laisser piéger par le brut.",
    title: "Comment comparer deux investissements locatifs sans se tromper",
    description:
      "Comparez deux biens locatifs avec une méthode simple : coût global, loyer, cash-flow, fiscalité, marché, projection patrimoniale.",
    h1: "Comment comparer deux investissements locatifs sans se tromper",
    intro:
      "Comparer deux biens uniquement sur le prix ou le rendement brut est une erreur classique.\n\nDeux biens peuvent afficher le même brut, un prix proche, une surface comparable, et pourtant produire des résultats totalement différents après charges, vacance, fiscalité et projection.",
    eyebrow: "Analyser",
    heroTag: "Comparaison",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Il faut comparer des hypothèses identiques avant de comparer des résultats.",
      "Le brut seul ne permet pas de départager deux biens.",
      "La meilleure comparaison est celle qui va jusqu’à la valeur nette créée.",
    ],
    keyPointsTitle: "Méthode de comparaison",
    keyPointsIntro:
      "Le bon comparatif investisseur ne cherche pas le bien “qui sonne le mieux”. Il cherche le bien qui reste le plus solide une fois toutes les hypothèses alignées.",
    keyPoints: [
      "Il faut poser un coût global, un financement et un horizon identiques.",
      "Le loyer doit être crédible et comparable, pas opportuniste.",
      "Le cash-flow avant et après impôt doivent être lus ensemble.",
      "La comparaison finale doit regarder la valeur nette créée à long terme.",
    ],
    sections: [
      {
        title: "Comparer les bonnes bases",
        paragraphs: [
          "Pour comparer deux investissements, il faut poser une base identique : coût global, financement, hypothèses de loyer, vacance, charges et horizon d’analyse.",
          "Sinon, la comparaison est faussée.",
        ],
      },
      {
        title: "Les 5 filtres à utiliser",
        paragraphs: [
          "Pour départager correctement deux biens, il faut comparer la cohérence prix / marché, le loyer crédible, le cash-flow avant impôt, le cash-flow après impôt et la valeur nette créée à horizon 10 ou 20 ans.",
          "Un bien n’est pas meilleur parce qu’il affiche un brut plus élevé. Il est meilleur si sa lecture globale est plus solide.",
        ],
      },
      {
        title: "Les faux critères de comparaison",
        paragraphs: [
          "Méfiez-vous des raccourcis du type : le moins cher est le meilleur, le plus haut brut gagne, le plus petit cash-flow positif suffit, ou le prix au m² sous marché est forcément une opportunité.",
        ],
      },
      {
        title: "Ce que GIGD doit afficher",
        paragraphs: [
          "Un bon comparatif doit montrer, bien par bien, le prix annoncé, le coût global, le loyer estimé, le rendement brut, le cash-flow, le régime fiscal testé, le cash-flow après impôt et la valeur nette créée.",
        ],
      },
    ],
    relatedPaths: [
      "/cout-global-acquisition",
      "/rendement-brut-net-net-net",
      "/cash-flow-avant-impot-apres-impot",
      "/analyser-une-annonce-immobiliere",
    ],
    relatedTitle: "Compléter un vrai comparatif investisseur",
    productTitle: "Comment GIGD aide à comparer proprement",
    productPoints: [
      "Même méthode, mêmes hypothèses, plusieurs biens comparés sur une base cohérente.",
      "Lecture simultanée du brut, du cash-flow et de la fiscalité.",
      "Vision plus utile qu’une comparaison au ressenti ou au prix affiché.",
    ],
    ctaTitle: "Comparer deux biens avec la même méthode",
    ctaDescription:
      "Vous hésitez entre deux biens ? Comparez-les dans GIGD avec la même méthode, pas avec une impression.",
    ctaLabel: "Comparer deux biens dans GIGD",
    ctaSecondaryLabel: "Revoir d’abord le coût global d’acquisition",
    ctaSecondaryHref: "/cout-global-acquisition",
    closingNote:
      "Le meilleur bien n’est pas celui qui gagne sur une seule métrique. C’est celui qui reste cohérent sur toute la chaîne de décision.",
  },
  {
    path: "/objectif-rendement-brut",
    listingTitle: "Objectif de rendement brut",
    listingDescription:
      "Définir un seuil de rendement utile sans confondre filtre d’entrée et décision finale.",
    title: "Quel objectif de rendement brut viser en investissement locatif ?",
    description:
      "6 %, 8 %, 10 % ? Découvrez comment fixer un objectif de rendement brut cohérent selon votre stratégie et vos contraintes.",
    h1: "Quel objectif de rendement brut viser en investissement locatif ?",
    intro:
      "La question quel rendement viser revient en permanence. Mais il n’existe pas un chiffre magique valable partout.\n\nUn objectif de rendement brut doit dépendre du marché, du niveau de risque, du type d’exploitation, de la qualité du bien et de votre besoin de cash-flow.",
    eyebrow: "Comprendre",
    heroTag: "Objectif",
    heroAsideTitle: "À retenir",
    heroAsidePoints: [
      "Un objectif de brut sert à filtrer, pas à conclure.",
      "La bonne cible dépend du marché, du risque et de votre stratégie.",
      "Le loyer nécessaire pour atteindre ce brut doit rester crédible.",
    ],
    keyPointsTitle: "Poser le bon seuil",
    keyPointsIntro:
      "Un objectif de rendement est utile s’il encadre votre pipeline et votre négociation. Il devient trompeur dès qu’il remplace l’analyse complète du bien.",
    keyPoints: [
      "Les zones tendues et patrimoniales n’impliquent pas les mêmes seuils que les marchés orientés cash-flow.",
      "Un brut élevé n’est pas une vérité, seulement un premier filtre.",
      "Le loyer nécessaire et la fiscalité doivent confirmer la cohérence du seuil visé.",
      "GIGD sert à relier objectif de rendement, loyer conseillé et prix cible.",
    ],
    sections: [
      {
        title: "Pourquoi le rendement cible dépend du contexte",
        paragraphs: [
          "Un investisseur qui cherche une zone très tendue, un bien patrimonial, une vacance faible et une valorisation long terme n’a pas la même cible qu’un investisseur qui cherche du cash-flow immédiat, un marché secondaire, une rentabilité élevée, plus de risque et plus de gestion.",
        ],
      },
      {
        title: "Le brut est un filtre, pas une vérité",
        paragraphs: [
          "Se fixer un objectif de 8 % ou 10 % brut peut être utile pour filtrer rapidement. Mais ce seuil ne remplace pas la lecture complète du bien.",
          "Un bien à 9,5 % brut peut être moins bon qu’un bien à 7,2 % si le loyer du premier est surévalué, si les charges sont lourdes, si les travaux sont sous-estimés ou si la fiscalité le pénalise davantage.",
        ],
      },
      {
        title: "Le bon usage d’un objectif de rendement",
        paragraphs: [
          "Un objectif de rendement sert à filtrer les annonces, définir un prix cible, vérifier si le loyer nécessaire est réaliste et poser un cadre de négociation.",
          "C’est exactement l’intérêt d’un cockpit comme GIGD : ne pas seulement afficher un brut, mais montrer ce qu’il faut obtenir pour atteindre ce brut.",
        ],
      },
      {
        title: "Comment raisonner proprement",
        paragraphs: [
          "Posez-vous quatre questions : quel brut minimal je vise, le loyer nécessaire pour atteindre ce brut est-il crédible, le cash-flow reste-t-il cohérent, et le résultat après impôt tient-il toujours ?",
        ],
      },
    ],
    relatedPaths: [
      "/rendement-brut-net-net-net",
      "/lmnp-micro-bic-ou-reel",
      "/estimation-loyer",
      "/cash-flow-avant-impot-apres-impot",
    ],
    relatedTitle: "Pages à lier à votre seuil de rendement",
    productTitle: "Comment GIGD transforme un seuil en décision",
    productPoints: [
      "Objectif de brut relié au loyer conseillé et au prix cible.",
      "Vérification immédiate de la crédibilité du loyer nécessaire.",
      "Lecture du cash-flow et du résultat après impôt pour valider le seuil.",
    ],
    ctaTitle: "Fixer un objectif de rendement utile",
    ctaDescription:
      "Dans GIGD, fixez votre objectif de rendement et voyez immédiatement le loyer conseillé, le prix cible et l’impact sur la décision.",
    ctaLabel: "Fixer un objectif dans GIGD",
    ctaSecondaryLabel: "Comparer aussi brut, net et net-net",
    ctaSecondaryHref: "/rendement-brut-net-net-net",
    closingNote:
      "Un bon objectif de brut vous aide à trier plus vite. Il ne doit jamais vous empêcher de penser plus loin.",
  },
];
