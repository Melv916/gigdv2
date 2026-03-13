export type SeoArticleSubsection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: SeoArticleSubsection[];
};

export type SeoArticleFaq = {
  question: string;
  answer: string;
};

export type SeoArticleDefinition = {
  path: string;
  listingTitle: string;
  listingDescription: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  eyebrow?: string;
  heroTag?: string;
  heroAsideTitle?: string;
  heroAsidePoints?: string[];
  keyPointsTitle?: string;
  keyPointsIntro?: string;
  sections: SeoArticleSection[];
  keyPoints: string[];
  faq?: SeoArticleFaq[];
  faqTitle?: string;
  faqIntro?: string;
  relatedPaths: string[];
  relatedTitle?: string;
  productTitle?: string;
  productPoints?: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  closingNote?: string;
};

export const seoPages: SeoArticleDefinition[] = [
  {
    path: "/calcul-rentabilite-locative",
    listingTitle: "Calcul rentabilite locative",
    listingDescription: "Comprendre rendement brut, net et net net avant de juger un bien.",
    title: "Calcul rentabilite locative : methode simple, brute, nette et nette nette",
    description:
      "Comprendre comment calculer la rentabilite locative, eviter les erreurs frequentes et analyser un bien immobilier avec une methode claire.",
    h1: "Comment calculer la rentabilite locative",
    intro:
      "La rentabilite locative rassure parce qu'elle tient en un chiffre. C'est justement pour cela qu'elle est souvent mal utilisee. Bien lue, elle sert a trier, comparer et cadrer un dossier. Mal lue, elle donne une illusion de precision et masque tout ce qui fait la vraie tenue d'un investissement.",
    eyebrow: "Guide de lecture",
    heroTag: "Brut, net, net net",
    heroAsideTitle: "Ce que cette page aide a clarifier",
    heroAsidePoints: [
      "Quand la rentabilite est utile pour faire un premier tri",
      "Pourquoi deux pourcentages proches peuvent cacher deux deals tres differents",
      "Ce qu'il faut regarder avant de croire un rendement affiche",
    ],
    keyPointsTitle: "Retenir l'essentiel",
    keyPointsIntro:
      "Avant d'aller plus loin dans les sections, gardez ce cadre en tete: la rentabilite est un point d'entree, pas une decision.",
    keyPoints: [
      "La rentabilite locative sert a comparer des biens, pas a conclure seule.",
      "La lecture brute, nette et nette nette ne raconte pas la meme histoire.",
      "Une rentabilite flatteuse peut venir d'un loyer trop optimiste ou d'un cout incomplet.",
      "Le bon usage consiste a la croiser avec cash-flow, marche et niveau de risque.",
    ],
    sections: [
      {
        title: "Qu'est-ce que la rentabilite locative",
        paragraphs: [
          "La rentabilite locative mesure le rapport entre ce qu'un bien rapporte et ce qu'il coute. Elle vous donne un langage commun pour comparer plusieurs opportunites sur une base simple.",
          "Elle est pratique parce qu'elle permet de prioriser vite. Elle est dangereuse si vous la transformez en verite suffisante. Un investisseur rigoureux s'en sert pour ouvrir l'analyse, pas pour la fermer.",
        ],
      },
      {
        title: "Difference entre rentabilite brute, nette et nette nette",
        paragraphs: [
          "La rentabilite brute donne une image rapide. La rentabilite nette remet les charges proprietaire dans le decor. La rentabilite nette nette pousse la lecture plus loin en integrant la couche fiscale retenue.",
          "Ces trois lectures ne sont pas des variantes marketing. Elles repondent a trois niveaux de profondeur. Quand quelqu'un annonce un rendement sans preciser sa base, il manque deja une partie du sujet.",
        ],
        subsections: [
          {
            title: "Le vrai piege",
            paragraphs: [
              "Le piege n'est pas de regarder la brute. Le piege est de croire que tout le monde parle du meme chiffre. Deux annonces peuvent afficher un rendement proche avec des hypotheses qui n'ont rien a voir.",
            ],
            bullets: [
              "La brute accelere le tri initial",
              "La nette rend la lecture plus exploitable",
              "La nette nette devient utile pour arbitrer plus finement",
            ],
          },
        ],
      },
      {
        title: "Comment calculer la rentabilite locative",
        paragraphs: [
          "La logique generale est simple: partir d'un revenu locatif plausible et le confronter au cout reel du projet. Ce cout ne s'arrete pas au prix affiche. Il faut raisonner avec l'ensemble des postes qui conditionnent vraiment la detention du bien.",
          "Sans exposer les formules internes de GIGD, une lecture serieuse tient compte du prix, des frais d'acquisition, des charges recurrentes, de la vacance probable, du loyer realiste et, selon le niveau d'analyse, des hypotheses fiscales.",
        ],
        bullets: [
          "Cout global d'acquisition",
          "Hypothese de loyer defendable",
          "Charges proprietaire et frais recurrents",
          "Niveau de prudence sur l'occupation et le risque",
        ],
      },
      {
        title: "Les erreurs frequentes dans le calcul",
        paragraphs: [
          "La plus repandue consiste a croire le loyer le plus haut possible parce qu'il rend le dossier plus confortable. Viennent ensuite l'oubli des charges, la vacance sous-estimee et la confusion entre rendement d'annonce et performance exploitable.",
          "Une autre erreur consiste a comparer des biens seulement sur leur rentabilite brute alors que le financement, la qualite du bien ou le prix au m2 racontent parfois une histoire bien plus importante.",
        ],
      },
      {
        title: "Pourquoi la rentabilite seule ne suffit pas",
        paragraphs: [
          "Deux biens peuvent afficher la meme rentabilite et ne pas demander le meme effort mensuel, ni exposer le meme niveau de risque. L'un peut etre solide et calme a detenir. L'autre peut etre fragile des qu'une hypothese se degrade.",
          "La bonne lecture consiste donc a rebrancher la rentabilite dans un ensemble plus large: cash-flow, estimation de loyer, prix au m2, tension locative, travaux et robustesse generale du dossier.",
        ],
      },
      {
        title: "Comment GIGD aide a lire la rentabilite d'un bien",
        paragraphs: [
          "GIGD ne laisse pas la rentabilite flotter seule. Le produit la relie au loyer, au cout global, au cash-flow et aux points de vigilance pour que le chiffre soit interpretable.",
          "L'objectif n'est pas d'afficher une promesse rassurante, mais d'aider a savoir si le pourcentage tient encore quand on remet le bien dans le reel.",
        ],
      },
    ],
    faqTitle: "Questions qui reviennent souvent",
    faqIntro:
      "La rentabilite est souvent la premiere question posee, puis la premiere source de confusion. Voici les clarifications utiles avant de comparer plusieurs biens.",
    faq: [
      {
        question: "Quelle est une bonne rentabilite locative ?",
        answer:
          "Il n'existe pas de seuil universel. Une bonne rentabilite depend du marche vise, du risque accepte, du financement et du temps que vous voulez consacrer a la gestion.",
      },
      {
        question: "Quelle difference entre brut et net ?",
        answer:
          "La brute donne un repere rapide. La nette ajoute les charges supportees par le proprietaire et se rapproche davantage de l'exploitation reelle.",
      },
      {
        question: "Peut-on se fier a une rentabilite affichee dans une annonce ?",
        answer:
          "Pas sans verification. Le chiffre affiche repose souvent sur des hypotheses partielles, favorables ou non explicitees.",
      },
      {
        question: "Pourquoi deux biens avec la meme rentabilite peuvent etre tres differents ?",
        answer:
          "Parce que le prix au m2, les charges, la vacance, le financement et la qualite du marche local peuvent produire des profils de risque radicalement differents.",
      },
    ],
    relatedPaths: ["/cash-flow-immobilier", "/analyser-une-annonce-immobiliere", "/estimation-loyer", "/methode"],
    relatedTitle: "Pour prolonger l'analyse",
    productTitle: "Dans GIGD, la rentabilite n'est jamais isolee",
    productPoints: [
      "Lecture du rendement avec le cout global du projet",
      "Lien direct entre rentabilite, cash-flow et loyer retenu",
      "Hypotheses visibles pour eviter les conclusions trop rapides",
    ],
    ctaTitle: "Analyser un bien avec GIGD",
    ctaDescription:
      "Passez d'un pourcentage theorique a une lecture plus complete du rendement, du cash-flow, du loyer et du contexte de marche.",
    ctaLabel: "Analyser un bien avec GIGD",
    ctaSecondaryLabel: "Comprendre la methode GIGD",
    ctaSecondaryHref: "/methode",
    closingNote:
      "Si vous comparez plusieurs annonces, la bonne question n'est pas seulement 'quel bien affiche le meilleur rendement ?', mais 'quel bien garde encore du sens quand les hypotheses deviennent prudentes ?'",
  },
  {
    path: "/cash-flow-immobilier",
    listingTitle: "Cash-flow immobilier",
    listingDescription: "Comprendre le cash-flow et sa place dans une vraie decision.",
    title: "Cash-flow immobilier : definition, calcul et interpretation",
    description:
      "Comprendre le cash-flow immobilier, savoir comment l'interpreter et eviter les erreurs frequentes lors de l'analyse d'un investissement locatif.",
    h1: "Comprendre le cash-flow immobilier",
    intro:
      "Le cash-flow parle la langue du terrain. Il ne demande pas si le dossier est seduisant sur le papier. Il demande si, chaque mois, le bien se tient, vous soulage ou vous met sous tension. C'est pour cela qu'il occupe une place centrale dans la lecture d'un investissement locatif.",
    eyebrow: "Lecture mensuelle du projet",
    heroTag: "Tresorerie, effort, tenue",
    heroAsideTitle: "A garder en tete",
    heroAsidePoints: [
      "Un cash-flow positif n'efface pas tous les risques",
      "Un cash-flow negatif n'est pas automatiquement redhibitoire",
      "La qualite du financement change souvent plus la lecture qu'on ne l'imagine",
    ],
    keyPointsTitle: "Ce que dit vraiment le cash-flow",
    keyPointsIntro:
      "Le cash-flow ne remplace pas tous les indicateurs. En revanche, il rend visible ce que la detention du bien vous demandera concretement.",
    keyPoints: [
      "Le cash-flow dit comment le projet vit mois apres mois.",
      "Il peut etre positif, nul ou negatif sans resumer a lui seul la qualite du bien.",
      "Le financement, le loyer, les charges et la vacance le font varier fortement.",
      "Il doit etre interprete avec nuance, pas comme un feu vert automatique.",
    ],
    sections: [
      {
        title: "Definition du cash-flow immobilier",
        paragraphs: [
          "Le cash-flow represente l'equilibre entre les encaissements lies a la location et les sorties supportees par l'investisseur. En clair, il indique si le projet s'autofinance, s'il consomme de la tresorerie ou s'il en degage.",
          "C'est un indicateur de detente ou de tension. Il parle de vie courante, pas seulement de theorie d'investissement.",
        ],
      },
      {
        title: "Pourquoi le cash-flow est important",
        paragraphs: [
          "Un dossier peut etre attirant en rendement et pourtant peser lourd chaque mois. Le cash-flow sert justement a mesurer cet effort et a verifier si le montage reste supportable dans la duree.",
          "Il joue aussi un role de confort de detention. Un bien plus simple a porter est souvent plus facile a conserver, a piloter et a arbitrer sereinement.",
        ],
      },
      {
        title: "Comment le lire correctement",
        paragraphs: [
          "Un cash-flow positif est plutot rassurant, mais il ne suffit pas a qualifier un bon investissement. Il faut encore verifier si le loyer est realiste, si le prix d'achat est coherent et si le bien n'est pas fragile sur d'autres dimensions.",
          "A l'inverse, un cash-flow negatif peut etre accepte dans une logique patrimoniale ou de long terme. Ce qui compte, c'est de savoir si cet effort mensuel est choisi, assume et compatible avec votre strategie.",
        ],
      },
      {
        title: "Ce qui influence le cash-flow",
        paragraphs: [
          "Le loyer retenu, la mensualite, les charges recurrentes, la vacance locative, les travaux, les frais annexes et la fiscalite peuvent tous le faire bouger sensiblement.",
          "C'est pourquoi un cash-flow n'a de valeur que si les hypotheses qui le produisent sont claires, prudentes et en phase avec le marche vise.",
        ],
        bullets: [
          "Loyer et rythme d'occupation",
          "Mensualite et structure de financement",
          "Charges recurrentes et taxe fonciere",
          "Travaux, frais annexes et fiscalite",
        ],
      },
      {
        title: "Les erreurs frequentes",
        paragraphs: [
          "L'erreur la plus classique consiste a regarder uniquement la rentabilite puis a decouvrir trop tard que le financement deteriore toute la lecture mensuelle du projet.",
          "Le cash-flow est aussi souvent embelli par un loyer trop optimiste ou une vacance trop faible. Dans ce cas, on ne lit pas le projet tel qu'il est, mais tel qu'on aimerait qu'il soit.",
        ],
      },
      {
        title: "Ce que GIGD permet de visualiser",
        paragraphs: [
          "GIGD replace le cash-flow au milieu des bons voisins: loyer, cout global, prix au m2, hypotheses retenues et points a verifier. Cela aide a savoir si un cash-flow confortable repose sur des bases solides ou sur une lecture trop legere.",
        ],
      },
    ],
    faqTitle: "FAQ cash-flow",
    faqIntro:
      "Le cash-flow est souvent simplifie en 'positif ou negatif'. La realite est un peu plus subtile, surtout quand on investit avec un objectif patrimonial.",
    faq: [
      {
        question: "Un cash-flow negatif est-il forcement mauvais ?",
        answer:
          "Non. Tout depend de votre strategie, de votre horizon de detention, du risque et de l'effort mensuel que vous acceptez.",
      },
      {
        question: "Quelle difference entre cash-flow et rentabilite ?",
        answer:
          "La rentabilite mesure la performance du bien par rapport a son cout. Le cash-flow mesure ce qu'il reste ou manque chaque mois dans la vie concrete du projet.",
      },
      {
        question: "Peut-on avoir une bonne rentabilite et un mauvais cash-flow ?",
        answer:
          "Oui. Un financement plus lourd, des charges elevees ou une fiscalite moins favorable peuvent degrader le cash-flow malgre un rendement seduisant.",
      },
    ],
    relatedPaths: ["/calcul-rentabilite-locative", "/estimation-loyer", "/frais-notaire", "/methode"],
    relatedTitle: "Guides utiles autour du cash-flow",
    productTitle: "Ce que GIGD remet en perspective",
    productPoints: [
      "Cash-flow relie au loyer et au cout global",
      "Lecture de l'effort mensuel dans une analyse complete",
      "Vision plus nuancee qu'un simple resultat positif ou negatif",
    ],
    ctaTitle: "Voir le cash-flow d'un bien avec GIGD",
    ctaDescription:
      "Visualisez le cash-flow dans son contexte, avec les autres indicateurs qui comptent vraiment pour une decision locative.",
    ctaLabel: "Voir le cash-flow d'un bien avec GIGD",
    ctaSecondaryLabel: "Lire la methode",
    ctaSecondaryHref: "/methode",
    closingNote:
      "Le bon cash-flow n'est pas celui qui rassure visuellement. C'est celui qui reste coherent quand vous remettez du financement, de la vacance et des charges dans le dossier.",
  },
  {
    path: "/analyser-une-annonce-immobiliere",
    listingTitle: "Analyser une annonce immobiliere",
    listingDescription: "Passer de la lecture d'une annonce a une vraie analyse d'investissement.",
    title: "Comment analyser une annonce immobiliere avant d'investir",
    description:
      "Prix, surface, loyer, emplacement, charges, marche : decouvrez comment analyser correctement une annonce immobiliere avant d'investir.",
    h1: "Comment analyser une annonce immobiliere",
    intro:
      "Une annonce est ecrite pour faire avancer une vente. Un investisseur, lui, cherche a faire avancer une decision. Entre les deux, il y a un travail de reconstruction: verifier ce qui est dit, identifier ce qui manque et remettre les bons indicateurs dans le bon ordre.",
    eyebrow: "Lecture d'annonce",
    heroTag: "Trier, verifier, reconstruire",
    heroAsideTitle: "Ce qu'une annonce ne montre pas toujours",
    heroAsidePoints: [
      "Le niveau reel de charges et de frais annexes",
      "La robustesse du loyer retenu",
      "La coherence du prix avec le micro-marche",
    ],
    keyPointsTitle: "Changer de posture",
    keyPointsIntro:
      "Lire une annonce en investisseur, c'est passer d'un texte commercial a une grille de decision. Ces points donnent la bonne posture des les premieres minutes.",
    keyPoints: [
      "Une annonce est souvent incomplete ou orientee par la vente.",
      "Les premiers chiffres a verifier ne suffisent pas a eux seuls.",
      "Une bonne analyse reconstruit rendement, loyer, prix au m2 et effort mensuel.",
      "Le contexte de marche compte autant que le bien lui-meme.",
    ],
    sections: [
      {
        title: "Pourquoi une annonce ne suffit pas a elle seule",
        paragraphs: [
          "Les annonces sont faites pour declencher un contact. Elles mettent en avant les atouts visibles et resument le reste. Ce n'est pas un probleme en soi. C'est simplement une limite qu'il faut connaitre.",
          "Pour investir, il faut lire au-dela du prix, de la surface et des photos. Ce qui manque dans l'annonce est parfois aussi important que ce qui est mis en vitrine.",
        ],
      },
      {
        title: "Les premieres donnees a verifier",
        paragraphs: [
          "Le prix, la surface, la localisation, l'etat du bien, le type de location vise et les charges connues forment le premier filtre.",
          "A ce stade, le but n'est pas encore de conclure. Il s'agit de savoir si l'annonce merite un approfondissement ou si elle doit sortir de votre pipeline.",
        ],
        bullets: [
          "Prix et surface reelle",
          "Micro-secteur et environnement",
          "Etat apparent du bien et travaux visibles",
          "Charges, copropriete et contraintes d'exploitation",
        ],
      },
      {
        title: "Les indicateurs a reconstruire",
        paragraphs: [
          "Une vraie analyse d'investissement reconstruit la rentabilite, le loyer plausible, le prix au m2, la coherence avec le marche, l'effort mensuel et le niveau de risque.",
          "C'est cette etape qui transforme une impression de visite en lecture decidee. Tant qu'elle n'est pas faite, vous naviguez surtout a l'instinct.",
        ],
      },
      {
        title: "Les erreurs les plus frequentes",
        paragraphs: [
          "Se fier a un seul chiffre est l'erreur la plus courante. Viennent ensuite la confiance aveugle dans un loyer theorique, l'oubli des frais annexes et la sous-estimation de la qualite du marche local.",
          "Un bien peut paraitre convaincant dans l'annonce et se reveiller mediocre des que l'on remet les charges, la vacance ou la vraie valeur de marche dans le raisonnement.",
        ],
      },
      {
        title: "Ce qu'une bonne analyse doit montrer",
        paragraphs: [
          "Une bonne analyse rend les hypotheses visibles, les KPI lisibles et les points de vigilance explicites. Elle aide a comparer plusieurs biens et a savoir rapidement ou se situent les fragilites.",
          "Le bon resultat n'est pas d'avoir beaucoup de chiffres. C'est d'avoir ceux qui changent vraiment votre decision.",
        ],
      },
      {
        title: "Comment GIGD simplifie cette etape",
        paragraphs: [
          "GIGD aide a transformer une annonce en lecture exploitable: prix, loyer, rentabilite, cash-flow, comparaison au marche et zones a verifier. Le produit structure l'analyse sans vous pousser artificiellement vers un 'oui'.",
        ],
      },
    ],
    faqTitle: "Questions de lecture d'annonce",
    faqIntro:
      "Avant visite, avant offre, avant simulation plus fine: voici les questions qui reviennent le plus souvent quand on passe d'une annonce a une analyse.",
    faq: [
      {
        question: "Peut-on se fier au prix affiche ?",
        answer:
          "Le prix affiche est un point de depart. Il doit etre compare au marche local et a la qualite reelle du bien avant d'etre pris comme reference.",
      },
      {
        question: "Comment savoir si le loyer projete est realiste ?",
        answer:
          "Il faut le confronter aux references de marche, a la typologie du bien, a son etat et a la demande locative locale avec une hypothese prudente plutot qu'optimiste.",
      },
      {
        question: "Quels indicateurs regarder en priorite ?",
        answer:
          "Le trio prix au m2, loyer plausible et effort mensuel donne deja une lecture utile. Ensuite viennent la rentabilite, la vacance probable et les points de risque.",
      },
      {
        question: "Faut-il comparer le prix au m2 du bien au marche ?",
        answer:
          "Oui. C'est un repere de premier niveau tres utile pour savoir si l'annonce est correctement positionnee ou si une marge de negotiation semble exister.",
      },
    ],
    relatedPaths: ["/prix-m2", "/estimation-loyer", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Pages complementaires pour lire une annonce",
    productTitle: "Ce que GIGD aide a remettre a plat",
    productPoints: [
      "Les chiffres de l'annonce remis dans un cadre d'investissement",
      "Une lecture plus structuree du loyer, du prix et des risques",
      "Une aide a la comparaison avant visite ou offre",
    ],
    ctaTitle: "Analyser une annonce avec GIGD",
    ctaDescription:
      "Passez d'une annonce commerciale a une analyse structuree du prix, du loyer, du rendement et du contexte de marche.",
    ctaLabel: "Analyser une annonce avec GIGD",
    ctaSecondaryLabel: "Voir toutes les ressources",
    ctaSecondaryHref: "/ressources",
    closingNote:
      "L'annonce sert a ouvrir une piste. La decision, elle, commence quand vous recomposez ce que l'annonce ne raconte pas.",
  },
  {
    path: "/estimation-loyer",
    listingTitle: "Estimation de loyer",
    listingDescription: "Verifier qu'un loyer cible reste coherent avec le marche local.",
    title: "Estimation de loyer : comment savoir si un bien se louera au bon prix",
    description:
      "Decouvrez comment estimer un loyer de maniere coherente, eviter les surestimations et analyser le potentiel locatif reel d'un bien.",
    h1: "Comment estimer le loyer d'un bien immobilier",
    intro:
      "Le loyer est souvent l'hypothese la plus fragile d'un dossier et pourtant celle qui change le plus la lecture finale. Quelques dizaines d'euros d'ecart peuvent suffire a faire bouger la rentabilite, le cash-flow et le niveau de confiance que vous pouvez accorder au projet.",
    eyebrow: "Hypothese critique",
    heroTag: "Loyer plausible, pas reve",
    heroAsideTitle: "Pourquoi cette question est sensible",
    heroAsidePoints: [
      "Le loyer retenu influence presque tous les KPI du dossier",
      "Une hypothese optimiste suffit a embellir artificiellement l'analyse",
      "Le marche local impose souvent plus de prudence que l'annonce",
    ],
    keyPointsTitle: "Le bon reflexe",
    keyPointsIntro:
      "L'objectif n'est pas de trouver le loyer maximal imaginable. L'objectif est de retenir un loyer defendable, compatible avec le bien et avec le marche.",
    keyPoints: [
      "Le loyer cible influence directement la solidite du projet.",
      "Une surestimation du loyer fausse toute l'analyse.",
      "Le marche local et la typologie du bien restent centraux.",
      "Une bonne estimation doit rester defendable, pas simplement optimiste.",
    ],
    sections: [
      {
        title: "Pourquoi l'estimation de loyer est decisive",
        paragraphs: [
          "Le loyer retenu alimente la plupart des indicateurs d'un projet locatif. Si cette hypothese de depart est trop haute, le rendement et le cash-flow paraitront meilleurs qu'ils ne le sont vraiment.",
          "Commencer par une hypothese locative prudente, c'est gagner du temps. Vous evitez de tomber amoureux d'un dossier qui ne tient que dans le meilleur scenario.",
        ],
      },
      {
        title: "Les criteres qui influencent le loyer",
        paragraphs: [
          "La ville, le secteur precis, la surface, l'etat du bien, la typologie, la tension locative et le positionnement du bien dans son micro-marche jouent tous un role.",
          "Deux biens a quelques rues d'ecart peuvent se louer sur des bases tres differentes si l'immeuble, l'etat, la distribution ou la cible locative ne sont pas comparables.",
        ],
      },
      {
        title: "Les erreurs frequentes d'estimation",
        paragraphs: [
          "La premiere erreur consiste a recopier une annonce haute comme si elle representait la norme. La seconde est de confondre le souhait d'un vendeur ou d'un bailleur avec le prix reellement absorbable par le marche.",
          "Il faut aussi se mefier des moyennes trop larges. Une moyenne de ville peut orienter. Elle ne remplace jamais une lecture plus fine du quartier et de la typologie.",
        ],
      },
      {
        title: "Comment verifier la coherence d'un loyer",
        paragraphs: [
          "La bonne pratique consiste a croiser plusieurs references, puis a retenir une hypothese prudente. Ensuite, il faut tester la sensibilite du projet si le loyer reel est legerement plus bas que prevu.",
          "Si une petite baisse de loyer suffit deja a fragiliser le dossier, vous apprenez quelque chose d'important: le projet manque de marge.",
        ],
        subsections: [
          {
            title: "Exemple pedagogique",
            paragraphs: [
              "Exemple de demonstration: un ecart de 80 EUR par mois entre un scenario central et un scenario prudent peut suffire a faire passer un projet d'un equilibre confortable a un effort mensuel visible. Cet exemple sert uniquement a illustrer la sensibilite d'un dossier.",
            ],
          },
        ],
      },
      {
        title: "Comment GIGD aide a estimer un loyer plus intelligemment",
        paragraphs: [
          "GIGD replace le loyer dans une lecture plus complete du bien. L'outil n'essaie pas de promettre le chiffre le plus haut possible. Il aide a verifier si l'hypothese retenue reste tenable face au marche, au prix et au reste de l'equilibre economique.",
        ],
      },
    ],
    faqTitle: "FAQ estimation de loyer",
    faqIntro:
      "Le sujet parait simple jusqu'au moment ou un petit ecart de loyer suffit a changer l'interet d'une operation. Voici les points a clarifier.",
    faq: [
      {
        question: "Comment savoir si un loyer est surevalue ?",
        answer:
          "S'il n'est pas coherent avec les references locales, l'etat du bien, sa surface ou sa typologie, il y a un risque fort de surestimation.",
      },
      {
        question: "Le loyer affiche dans une annonce est-il fiable ?",
        answer:
          "Pas toujours. Il peut s'agir d'une projection theorique ou d'une hypothese optimiste qui doit etre verifiee avant d'etre integree a votre analyse.",
      },
      {
        question: "Une petite difference de loyer change-t-elle vraiment l'analyse ?",
        answer:
          "Oui. Sur un projet tendu, quelques dizaines d'euros par mois peuvent changer la lecture du cash-flow et de la marge de securite.",
      },
    ],
    relatedPaths: ["/prix-m2", "/cash-flow-immobilier", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Autres reperes a croiser avec le loyer",
    productTitle: "Comment GIGD vous aide a cadrer le loyer",
    productPoints: [
      "Loyer remis dans le contexte du prix et du marche",
      "Impact visible sur rendement et cash-flow",
      "Lecture plus prudente que le simple meilleur cas",
    ],
    ctaTitle: "Tester un loyer cible avec GIGD",
    ctaDescription:
      "Confrontez votre hypothese de loyer a une lecture plus globale du bien et a l'equilibre economique du projet.",
    ctaLabel: "Tester un loyer cible avec GIGD",
    ctaSecondaryLabel: "Comparer le prix au marche",
    ctaSecondaryHref: "/prix-m2",
    closingNote:
      "Quand un dossier ne tient qu'avec le loyer le plus haut, le sujet n'est plus l'estimation de loyer. Le sujet devient la fragilite du projet.",
  },
  {
    path: "/prix-m2",
    listingTitle: "Prix au m2",
    listingDescription: "Comprendre ce que ce repere dit vraiment d'une annonce.",
    title: "Prix au m2 : comment l'interpreter pour un investissement immobilier",
    description:
      "Le prix au m2 est un repere utile, mais insuffisant seul. Decouvrez comment l'analyser correctement avant d'investir.",
    h1: "Comment lire le prix au m2 d'un bien immobilier",
    intro:
      "Le prix au m2 est souvent le premier reflexe d'un investisseur presse. C'est logique: en quelques secondes, il permet de situer une annonce. Mais justement, sa vitesse en fait aussi un indicateur trompeur si vous lui demandez plus qu'il ne peut dire.",
    eyebrow: "Repere de comparaison",
    heroTag: "Filtre utile, verdict insuffisant",
    heroAsideTitle: "Ce ratio est utile pour",
    heroAsidePoints: [
      "Prioriser vos annonces en amont",
      "Reperer rapidement un ecart avec le marche",
      "Preparer une question de negociation ou de vigilance",
    ],
    keyPointsTitle: "Avant de juger un prix au m2",
    keyPointsIntro:
      "Ce ratio est puissant pour filtrer vite. Il devient dangereux si vous oubliez tout ce qu'il ne capte pas: immeuble, rue, etat, annexes, tension locative.",
    keyPoints: [
      "Le prix au m2 est un excellent filtre de premier niveau.",
      "Il peut etre trompeur s'il est lu sans contexte.",
      "La micro-localisation et la qualite du bien changent tout.",
      "Il doit etre croise avec loyer, rendement, cash-flow et travaux.",
    ],
    sections: [
      {
        title: "A quoi sert le prix au m2",
        paragraphs: [
          "Le prix au m2 donne un repere rapide pour comparer plusieurs annonces et detecter celles qui semblent au-dessus ou au-dessous du marche.",
          "C'est un outil de tri tres efficace quand vous etudiez beaucoup de biens ou que vous voulez prioriser vos visites sans perdre de temps.",
        ],
      },
      {
        title: "Pourquoi il peut etre trompeur",
        paragraphs: [
          "Deux biens dans un meme quartier peuvent avoir des prix au m2 tres differents pour de bonnes raisons: etage, etat, exposition, qualite de l'immeuble, presence d'annexes ou adresse plus ou moins qualitative.",
          "Le probleme commence quand ce repere devient une conclusion. Le ratio ne voit pas a lui seul la desirabilite locative ni la qualite economique complete du dossier.",
        ],
      },
      {
        title: "Comment le comparer au marche",
        paragraphs: [
          "La bonne methode consiste a confronter le prix au m2 du bien a des references comparables, puis a expliquer l'ecart observe. Un ecart n'est pas forcement mauvais. Il doit simplement etre compris.",
          "Si le bien est plus cher que le marche, encore faut-il savoir si cette prime est justifiee. S'il est moins cher, il faut identifier ce que le marche est en train de sanctionner.",
        ],
      },
      {
        title: "Ce qu'il faut regarder en plus",
        paragraphs: [
          "Le loyer possible, la rentabilite, le cash-flow, la demande locative et le besoin de travaux sont indispensables pour transformer le prix au m2 en outil de decision.",
          "Un prix au m2 bas ne suffit jamais a faire une bonne affaire. Ce qui compte, c'est la coherence d'ensemble entre prix, usage et exploitation.",
        ],
        bullets: [
          "Loyer cible et demande locative",
          "Rendement et cash-flow",
          "Travaux, etat du bien et copropriete",
          "Qualite du micro-marche",
        ],
      },
      {
        title: "Comment GIGD remet le prix au m2 dans son contexte",
        paragraphs: [
          "GIGD aide a replacer le prix au m2 dans une lecture plus complete: comparaison au marche, loyer potentiel, cout global, cash-flow et points de vigilance. Cela permet de sortir d'un jugement trop rapide base sur un seul ratio.",
        ],
      },
    ],
    faqTitle: "FAQ prix au m2",
    faqIntro:
      "Le prix au m2 est pratique parce qu'il va vite. Voici comment l'utiliser sans lui faire dire ce qu'il ne sait pas dire.",
    faq: [
      {
        question: "Un prix au m2 bas est-il toujours une bonne affaire ?",
        answer:
          "Non. Il peut signaler un mauvais etat, un immeuble problematique, une faible demande locative ou des travaux a absorber.",
      },
      {
        question: "Peut-on acheter au-dessus du marche et faire une bonne operation ?",
        answer:
          "Oui, si l'ecart se justifie et si l'ensemble du projet reste coherent. Encore faut-il comprendre ce que vous payez et pourquoi.",
      },
      {
        question: "Pourquoi deux biens proches n'ont-ils pas le meme prix au m2 ?",
        answer:
          "Parce que la rue, l'immeuble, l'etage, l'etat, la distribution et les annexes peuvent changer fortement la valeur d'usage et la valeur de marche.",
      },
    ],
    relatedPaths: ["/estimation-loyer", "/analyser-une-annonce-immobiliere", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Pour donner du contexte au prix au m2",
    productTitle: "Comment GIGD l'utilise sans le surestimer",
    productPoints: [
      "Comparaison du bien avec son marche disponible",
      "Mise en perspective avec loyer, cout global et cash-flow",
      "Aide a repasser d'un ratio a une decision plus complete",
    ],
    ctaTitle: "Comparer un bien a son marche avec GIGD",
    ctaDescription:
      "Ne vous contentez pas d'un ratio isole. Comparez le prix au m2 du bien avec les autres indicateurs qui comptent pour l'investisseur.",
    ctaLabel: "Comparer un bien a son marche avec GIGD",
    ctaSecondaryLabel: "Apprendre a lire une annonce",
    ctaSecondaryHref: "/analyser-une-annonce-immobiliere",
    closingNote:
      "Le prix au m2 est tres bon pour vous faire gagner du temps. Il est moins bon pour prendre une decision a votre place.",
  },
  {
    path: "/frais-notaire",
    listingTitle: "Frais de notaire",
    listingDescription: "Comprendre leur poids dans le cout global d'un projet.",
    title: "Frais de notaire : quel impact reel sur un investissement immobilier",
    description:
      "Comprendre les frais de notaire, leur poids dans l'operation et leur impact sur la rentabilite reelle d'un investissement.",
    h1: "Comprendre les frais de notaire dans un investissement immobilier",
    intro:
      "Les frais de notaire sont rarement ce qui fait rever dans une annonce. Pourtant, ils font partie des premiers postes qui remettent un dossier a sa vraie place. Quand on les oublie, on ne surestime pas un detail: on sous-estime le cout reel du projet.",
    eyebrow: "Cout global",
    heroTag: "Le prix affiche ne suffit pas",
    heroAsideTitle: "Ce que les frais de notaire changent",
    heroAsidePoints: [
      "La lecture du cout d'entree dans l'operation",
      "La comparaison entre deux biens apparemment equivalents",
      "Le niveau d'apport ou de financement a mobiliser",
    ],
    keyPointsTitle: "A retenir des la premiere lecture",
    keyPointsIntro:
      "Si vous analysez un bien sur son seul prix affiche, vous regardez deja le dossier avec un angle incomplet. Les frais d'acquisition doivent entrer tot dans le raisonnement.",
    keyPoints: [
      "Les frais de notaire font partie du cout reel d'acquisition.",
      "Ils influencent le rendement, le cash-flow et l'apport mobilise.",
      "Les ignorer fausse la comparaison entre plusieurs biens.",
      "Ils doivent etre integres des le debut de l'analyse.",
    ],
    sections: [
      {
        title: "Que recouvrent les frais de notaire",
        paragraphs: [
          "Dans le langage courant, on parle de frais de notaire comme d'un bloc unique. En pratique, cette expression recouvre plusieurs composantes liees a l'acquisition et a sa formalisation.",
          "Pour l'investisseur, l'enjeu n'est pas de memoriser chaque detail technique. L'enjeu est de comprendre que cette ligne fait pleinement partie du cout reel du projet.",
        ],
      },
      {
        title: "Pourquoi ils changent l'analyse d'un bien",
        paragraphs: [
          "Des que vous les reintegrez, le cout total augmente. Cela agit directement sur la lecture du rendement et, selon le montage retenu, sur l'apport ou le financement necessaire.",
          "Un bien qui paraissait correct a la seule lecture du prix affiche peut devenir beaucoup moins convaincant une fois les frais d'acquisition reellement remis dans l'equation.",
        ],
      },
      {
        title: "Les erreurs frequentes",
        paragraphs: [
          "L'erreur la plus simple consiste a les oublier. Une autre erreur consiste a les traiter comme une petite marge annexe alors qu'ils modifient reellement le cout d'entree dans l'operation.",
          "Enfin, beaucoup d'analyses restent coincees sur le prix affiche alors que c'est le cout global qui devrait servir de base au raisonnement investisseur.",
        ],
      },
      {
        title: "Comment integrer correctement les frais dans son analyse",
        paragraphs: [
          "La bonne logique consiste a raisonner en cout global des la premiere lecture: prix d'achat, frais de notaire, frais annexes et enveloppes complementaires doivent etre visibles tot.",
          "Cette discipline evite les comparaisons trompeuses et permet de mieux mesurer l'effort reel demande par chaque dossier.",
        ],
        subsections: [
          {
            title: "Exemple de demonstration",
            paragraphs: [
              "Exemple pedagogique: deux biens affiches au meme prix peuvent paraitre equivalents. Si l'un impose une enveloppe d'acquisition plus lourde au demarrage, son rendement reel et son effort de financement ne seront plus lus de la meme facon. Cet exemple reste demonstratif et ne pilote aucun calcul de production.",
            ],
          },
        ],
      },
      {
        title: "Comment GIGD les remet dans une analyse plus complete",
        paragraphs: [
          "GIGD aide a replacer les frais de notaire dans une lecture d'ensemble du projet. L'idee est de raisonner sur le cout reel, puis de relier ce cout au loyer, au rendement, au cash-flow et au niveau de risque du bien.",
        ],
      },
    ],
    faqTitle: "FAQ frais de notaire",
    faqIntro:
      "Les frais d'acquisition sont souvent minimises dans les premieres discussions. Pourtant, ce sont eux qui remettent rapidement un dossier sur sa vraie base.",
    faq: [
      {
        question: "Les frais de notaire changent-ils vraiment la rentabilite ?",
        answer:
          "Oui. Comme ils augmentent le cout reel du projet, ils abaissent mecaniquement la lecture du rendement et changent parfois le montage financier necessaire.",
      },
      {
        question: "Faut-il les integrer des la premiere lecture d'une annonce ?",
        answer:
          "Oui, au moins dans votre logique d'analyse. Sinon, vous comparez des biens sur une base incomplete.",
      },
      {
        question: "Peut-on analyser un bien correctement sans les frais ?",
        answer:
          "Non. Vous pouvez faire un premier tri visuel, mais pas une vraie analyse d'investissement.",
      },
    ],
    relatedPaths: ["/calcul-rentabilite-locative", "/cash-flow-immobilier", "/analyser-une-annonce-immobiliere", "/methode"],
    relatedTitle: "Pages utiles autour du cout global",
    productTitle: "Comment GIGD les remet dans le decor",
    productPoints: [
      "Cout global relie a la rentabilite et au cash-flow",
      "Lecture plus juste de l'effort d'acquisition",
      "Comparaison de biens sur une base moins trompeuse",
    ],
    ctaTitle: "Lancer une analyse complete avec GIGD",
    ctaDescription:
      "Replacez les frais d'acquisition dans le cout global et voyez leur impact sur la lecture du bien.",
    ctaLabel: "Lancer une analyse complete avec GIGD",
    ctaSecondaryLabel: "Voir le cash-flow immobilier",
    ctaSecondaryHref: "/cash-flow-immobilier",
    closingNote:
      "Quand le cout d'acquisition n'est pas complet, ce n'est pas seulement le rendement qui est faux. C'est toute la comparaison entre biens qui devient moins fiable.",
  },
  {
    path: "/sci-ou-nom-propre",
    listingTitle: "SCI ou nom propre",
    listingDescription: "Reflechir a la structure sans tomber dans le conseil simpliste.",
    title: "SCI ou nom propre : comment reflechir avant d'investir",
    description:
      "SCI ou achat en nom propre : decouvrez les grands criteres de reflexion avant de structurer un investissement immobilier.",
    h1: "SCI ou nom propre : quelle logique pour investir",
    intro:
      "La question de la structure arrive souvent tres tot, parfois meme avant l'analyse du bien. C'est comprehensible: elle touche au patrimoine, a la gestion et a la projection dans le temps. Mais il faut garder l'ordre logique. La structure vient organiser un projet. Elle ne transforme jamais un mauvais deal en bon investissement.",
    eyebrow: "Structuration du projet",
    heroTag: "Pedagogie, pas conseil personnalise",
    heroAsideTitle: "Cette page sert a",
    heroAsidePoints: [
      "Donner une premiere grille de reflexion sur la structuration",
      "Montrer qu'il n'existe pas de reponse universelle",
      "Rappeler que la qualite du bien reste le premier sujet",
    ],
    keyPointsTitle: "Le cadre de reflexion",
    keyPointsIntro:
      "Nom propre ou SCI n'est pas une question de tendance. C'est une question de contexte: objectifs, horizon, gestion, financement, detention a plusieurs ou non.",
    keyPoints: [
      "La structure sert une strategie, elle ne remplace jamais la qualite du bien.",
      "Le nom propre et la SCI repondent a des logiques differentes.",
      "Le bon choix depend du contexte, pas d'une regle universelle.",
      "L'analyse du bien reste la premiere etape avant la structuration.",
    ],
    sections: [
      {
        title: "Pourquoi la question se pose",
        paragraphs: [
          "La question apparait des qu'il faut arbitrer entre simplicite, achat a plusieurs, logique patrimoniale ou organisation de la detention du bien.",
          "Elle se pose differemment selon que vous investissez seul, avec un associe, avec un objectif de transmission ou avec la volonte de structurer plusieurs acquisitions dans le temps.",
        ],
      },
      {
        title: "Ce que permet l'achat en nom propre",
        paragraphs: [
          "L'achat en nom propre reste la voie la plus simple a comprendre et a mettre en place dans beaucoup de cas. C'est souvent l'option la plus lisible pour un investisseur seul qui veut un cadre direct.",
          "Cette simplicite n'en fait pas une reponse universelle. Elle en fait une solution frequente, souvent adaptee a certains profils et a certains projets.",
        ],
      },
      {
        title: "Ce que permet une SCI",
        paragraphs: [
          "La SCI introduit une logique d'organisation et de detention collective. Elle peut devenir pertinente quand plusieurs personnes investissent ensemble ou quand la structuration patrimoniale prend de l'importance.",
          "Elle ne doit toutefois pas etre idealisee. Elle repond a certains besoins, avec des implications qu'il faut comprendre au cas par cas.",
        ],
      },
      {
        title: "Les criteres de reflexion",
        paragraphs: [
          "Le bon raisonnement part des objectifs: recherche de simplicite, logique patrimoniale, horizon de detention, mode de gestion, conditions de financement et perspective de transmission.",
          "C'est cette combinaison de criteres qui permet de savoir quelle logique semble la plus coherente pour votre situation, pas une regle entendue trop vite sur internet.",
        ],
        bullets: [
          "Objectif d'investissement",
          "Horizon et logique patrimoniale",
          "Gestion quotidienne et gouvernance",
          "Financement et lisibilite du montage",
          "Transmission et organisation dans le temps",
        ],
      },
      {
        title: "Pourquoi il faut raisonner au cas par cas",
        paragraphs: [
          "Il n'existe pas de meilleure structure dans l'absolu. Une meme solution peut etre excellente dans un contexte et peu pertinente dans un autre.",
          "C'est pourquoi ce sujet merite de la prudence. Une page utile doit rester pedagogique et rappeler qu'une validation juridique ou comptable adaptee devient necessaire quand le projet se precise.",
        ],
      },
      {
        title: "Comment GIGD s'insere dans la reflexion d'investissement",
        paragraphs: [
          "GIGD aide a lire la qualite economique du bien et la solidite de ses hypotheses. Le produit n'a pas vocation a remplacer un conseil juridique personnalise sur la structure de detention. Il aide en revanche a clarifier ce que vaut le deal avant d'aller plus loin dans le montage.",
        ],
      },
    ],
    faqTitle: "FAQ structuration",
    faqIntro:
      "La meilleure structure depend toujours du contexte. Les questions ci-dessous servent a poser les bons reperes sans glisser vers un conseil personnalise.",
    faq: [
      {
        question: "Faut-il toujours investir en SCI ?",
        answer:
          "Non. La SCI peut etre pertinente dans certains cas, mais elle n'est pas une reponse automatique a tous les projets.",
      },
      {
        question: "Est-ce plus simple d'acheter en nom propre ?",
        answer:
          "Dans beaucoup de situations, oui. C'est souvent la voie la plus lisible pour un premier investissement seul, mais cela depend du contexte global.",
      },
      {
        question: "La structure change-t-elle la qualite du bien analyse ?",
        answer:
          "Non. Un mauvais bien reste un mauvais bien, quelle que soit la structure retenue. L'analyse du deal vient avant la structuration.",
      },
    ],
    relatedPaths: ["/calcul-rentabilite-locative", "/cash-flow-immobilier", "/analyser-une-annonce-immobiliere", "/methode"],
    relatedTitle: "Guides a lire avant de choisir une structure",
    productTitle: "La place de GIGD dans cette reflexion",
    productPoints: [
      "Verifier d'abord si le bien tient economiquement",
      "Clarifier le deal avant les questions de structuration",
      "Servir d'appui a une decision plus documentee",
    ],
    ctaTitle: "Commencer par analyser le bien avec GIGD",
    ctaDescription:
      "Avant de discuter structure, commencez par verifier si le bien tient economiquement et si ses hypotheses sont solides.",
    ctaLabel: "Commencer par analyser le bien avec GIGD",
    ctaSecondaryLabel: "Comprendre la methode",
    ctaSecondaryHref: "/methode",
    closingNote:
      "La structure organise la detention. Elle ne corrige ni un mauvais prix, ni un loyer mal estime, ni un cash-flow trop fragile.",
  },
];

export function getSeoPageByPath(pathname: string) {
  return seoPages.find((page) => page.path === pathname) || null;
}
