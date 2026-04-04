import { strategicResourcePages } from "./strategicResourcePages";
import type { ResourceCategoryKey, ResourceHubCategory, SeoArticleDefinition } from "./resourceTypes";

export type {
  ResourceCategoryKey,
  ResourceHubCategory,
  SeoArticleDefinition,
  SeoArticleFaq,
  SeoArticleSection,
  SeoArticleSubsection,
} from "./resourceTypes";

export const seoPages: SeoArticleDefinition[] = [
  {
    path: "/calcul-rentabilite-locative",
    listingTitle: "Calcul rentabilité locative",
    listingDescription: "Comprendre rendement brut, net et net net avant de juger un bien.",
    title: "Calcul rentabilité locative : méthode simple, brute, nette et nette nette",
    description:
      "Comprendre comment calculer la rentabilité locative, éviter les erreurs fréquentes et analyser un bien immobilier avec une méthode claire.",
    h1: "Comment calculer la rentabilité locative",
    intro:
      "La rentabilité locative rassure parce qu'elle tient en un chiffre. C'est justement pour cela qu'elle est souvent mal utilisée. Bien lue, elle sert a trier, comparer et cadrer un dossier. Mal lue, elle donne une illusion de précision et masque tout ce qui fait la vraie tenue d'un investissement.",
    eyebrow: "Guide de lecture",
    heroTag: "Brut, net, net net",
    heroAsideTitle: "Ce que cette page aide à clarifier",
    heroAsidePoints: [
      "Quand la rentabilité est utile pour faire un premier tri",
      "Pourquoi deux pourcentages proches peuvent cacher deux deals très differents",
      "Ce qu'il faut regarder avant de croire un rendement affiché",
    ],
    keyPointsTitle: "Retenir l'essentiel",
    keyPointsIntro:
      "Avant d'aller plus loin dans les sections, gardez ce cadre en tête: la rentabilité est un point d'entrée, pas une décision.",
    keyPoints: [
      "La rentabilité locative sert à comparer des biens, pas à conclure seule.",
      "La lecture brute, nette et nette nette ne raconte pas la même histoire.",
      "Une rentabilité flatteuse peut venir d'un loyer trop optimiste ou d'un coût incomplet.",
      "Le bon usage consiste à la croiser avec cash-flow, marché et niveau de risque.",
    ],
    sections: [
      {
        title: "Qu'est-ce que la rentabilité locative",
        paragraphs: [
          "La rentabilité locative mesure le rapport entre ce qu'un bien rapporte et ce qu'il coute. Elle vous donne un langage commun pour comparer plusieurs opportunités sur une base simple.",
          "Elle est pratique parce qu'elle permet de prioriser vite. Elle est dangereuse si vous la transformez en vérité suffisante. Un investisseur rigoureux s'en sert pour ouvrir l'analyse, pas pour la fermer.",
        ],
      },
      {
        title: "Différence entre rentabilité brute, nette et nette nette",
        paragraphs: [
          "La rentabilité brute donne une image rapide. La rentabilité nette remet les charges propriétaire dans le décor. La rentabilité nette nette pousse la lecture plus loin en integrant la couche fiscale retenue.",
          "Ces trois lectures ne sont pas des variantes marketing. Elles répondent à trois niveaux de profondeur. Quand quelqu'un annonce un rendement sans préciser sa base, il manque déjà une partie du sujet.",
        ],
        subsections: [
          {
            title: "Le vrai piège",
            paragraphs: [
              "Le piège n'est pas de regarder la brute. Le piège est de croire que tout le monde parle du même chiffre. Deux annonces peuvent afficher un rendement proche avec des hypothèses qui n'ont rien à voir.",
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
        title: "Comment calculer la rentabilité locative",
        paragraphs: [
          "La logique générale est simple: partir d'un revenu locatif plausible et le confronter au coût réel du projet. Ce coût ne s'arrête pas au prix affiché. Il faut raisonner avec l'ensemble des postes qui conditionnent vraiment la détention du bien.",
          "Sans exposer les formules internes de GIGD, une lecture sérieuse tient compte du prix, des frais d'acquisition, des charges récurrentes, de la vacance probable, du loyer réaliste et, selon le niveau d'analyse, des hypothèses fiscales.",
        ],
        bullets: [
          "Cout global d'acquisition",
          "Hypothese de loyer défendable",
          "Charges propriétaire et frais recurrents",
          "Niveau de prudence sur l'occupation et le risque",
        ],
      },
      {
        title: "Les erreurs fréquentes dans le calcul",
        paragraphs: [
          "La plus répandue consiste à croire le loyer le plus haut possible parce qu'il rend le dossier plus confortable. Viennent ensuite l'oubli des charges, la vacance sous-estimée et la confusion entre rendement d'annonce et performance exploitable.",
          "Une autre erreur consiste à comparer des biens seulement sur leur rentabilité brute alors que le financement, la qualité du bien ou le prix au m2 racontent parfois une histoire bien plus importante.",
        ],
      },
      {
        title: "Pourquoi la rentabilité seule ne suffit pas",
        paragraphs: [
          "Deux biens peuvent afficher la même rentabilité et ne pas demander le même effort mensuel, ni exposer le même niveau de risque. L'un peut être solide et calme a détenir. L'autre peut être fragile dès qu'une hypothèse se dégrade.",
          "La bonne lecture consiste donc à rebrancher la rentabilité dans un ensemble plus large: cash-flow, estimation de loyer, prix au m2, tension locative, travaux et robustesse générale du dossier.",
        ],
      },
      {
        title: "Comment GIGD aide à lire la rentabilité d'un bien",
        paragraphs: [
          "GIGD ne laisse pas la rentabilité flotter seule. Le produit la relie au loyer, au coût global, au cash-flow et aux points de vigilance pour que le chiffre soit interprétable.",
          "L'objectif n'est pas d'afficher une promesse rassurante, mais d'aider à savoir si le pourcentage tient encore quand on remet le bien dans le réel.",
        ],
      },
    ],
    faqTitle: "Questions qui reviennent souvent",
    faqIntro:
      "La rentabilité est souvent la première question posée, puis la première source de confusion. Voici les clarifications utiles avant de comparer plusieurs biens.",
    faq: [
      {
        question: "Quelle est une bonne rentabilité locative ?",
        answer:
          "Il n'existe pas de seuil universel. Une bonne rentabilité dépend du marché visé, du risque accepté, du financement et du temps que vous voulez consacrer à la gestion.",
      },
      {
        question: "Quelle différence entre brut et net ?",
        answer:
          "La brute donne un repère rapide. La nette ajoute les charges supportées par le propriétaire et se rapproche davantage de l'exploitation réelle.",
      },
      {
        question: "Peut-on se fier à une rentabilité affichée dans une annonce ?",
        answer:
          "Pas sans vérification. Le chiffre affiché repose souvent sur des hypothèses partielles, favorables ou non explicitées.",
      },
      {
        question: "Pourquoi deux biens avec la même rentabilité peuvent être très differents ?",
        answer:
          "Parce que le prix au m2, les charges, la vacance, le financement et la qualité du marché local peuvent produire des profils de risque radicalement differents.",
      },
    ],
    relatedPaths: ["/cash-flow-immobilier", "/analyser-une-annonce-immobiliere", "/estimation-loyer", "/methode"],
    relatedTitle: "Pour prolonger l'analyse",
    productTitle: "Dans GIGD, la rentabilité n'est jamais isolée",
    productPoints: [
      "Lecture du rendement avec le coût global du projet",
      "Lien direct entre rentabilité, cash-flow et loyer retenu",
      "Hypothèses visibles pour éviter les conclusions trop rapides",
    ],
    ctaTitle: "Analyser un bien avec GIGD",
    ctaDescription:
      "Passez d'un pourcentage théorique à une lecture plus complète du rendement, du cash-flow, du loyer et du contexte de marché.",
    ctaLabel: "Analyser un bien avec GIGD",
    ctaSecondaryLabel: "Comprendre la méthode GIGD",
    ctaSecondaryHref: "/methode",
    closingNote:
      "Si vous comparez plusieurs annonces, la bonne question n'est pas seulement 'quel bien affiché le meilleur rendement ?', mais 'quel bien garde encore du sens quand les hypothèses deviennent prudentes ?'",
  },
  {
    path: "/cash-flow-immobilier",
    listingTitle: "Cash-flow immobilier",
    listingDescription: "Comprendre le cash-flow et sa place dans une vraie décision.",
    title: "Cash-flow immobilier : définition, calcul et interprétation",
    description:
      "Comprendre le cash-flow immobilier, savoir comment l'interpréter et éviter les erreurs fréquentes lors de l'analyse d'un investissement locatif.",
    h1: "Comprendre le cash-flow immobilier",
    intro:
      "Le cash-flow parle la langue du terrain. Il ne demande pas si le dossier est séduisant sur le papier. Il demande si, chaque mois, le bien se tient, vous soulage ou vous met sous tension. C'est pour cela qu'il occupe une place centrale dans la lecture d'un investissement locatif.",
    eyebrow: "Lecture mensuelle du projet",
    heroTag: "Tresorerie, effort, tenue",
    heroAsideTitle: "A garder en tête",
    heroAsidePoints: [
      "Un cash-flow positif n'efface pas tous les risques",
      "Un cash-flow negatif n'est pas automatiquement redhibitoire",
      "La qualité du financement change souvent plus la lecture qu'on ne l'imagine",
    ],
    keyPointsTitle: "Ce que dit vraiment le cash-flow",
    keyPointsIntro:
      "Le cash-flow ne remplace pas tous les indicateurs. En revanche, il rend visible ce que la détention du bien vous demandera concretement.",
    keyPoints: [
      "Le cash-flow dit comment le projet vit mois apres mois.",
      "Il peut être positif, nul ou negatif sans resumer à lui seul la qualité du bien.",
      "Le financement, le loyer, les charges et la vacance le font varier fortement.",
      "Il doit être interprete avec nuance, pas comme un feu vert automatique.",
    ],
    sections: [
      {
        title: "Definition du cash-flow immobilier",
        paragraphs: [
          "Le cash-flow représente l'équilibre entre les encaissements liés a la location et les sorties supportées par l'investisseur. En clair, il indique si le projet s'autofinance, s'il consomme de la tresorerie ou s'il en dégage.",
          "C'est un indicateur de détente ou de tension. Il parle de vie courante, pas seulement de theorie d'investissement.",
        ],
      },
      {
        title: "Pourquoi le cash-flow est important",
        paragraphs: [
          "Un dossier peut être attirant en rendement et pourtant peser lourd chaque mois. Le cash-flow sert justement à mesurer cet effort et à vérifier si le montage reste supportable dans la durée.",
          "Il joue aussi un role de confort de détention. Un bien plus simple a porter est souvent plus facile a conserver, a piloter et a arbitrer sereinement.",
        ],
      },
      {
        title: "Comment le lire correctement",
        paragraphs: [
          "Un cash-flow positif est plutôt rassurant, mais il ne suffit pas à qualifier un bon investissement. Il faut encore vérifier si le loyer est réaliste, si le prix d'achat est cohérent et si le bien n'est pas fragile sur d'autres dimensions.",
          "A l'inverse, un cash-flow negatif peut être accepté dans une logique patrimoniale ou de long terme. Ce qui compte, c'est de savoir si cet effort mensuel est choisi, assume et compatible avec votre stratégie.",
        ],
      },
      {
        title: "Ce qui influence le cash-flow",
        paragraphs: [
          "Le loyer retenu, la mensualite, les charges récurrentes, la vacance locative, les travaux, les frais annexes et la fiscalite peuvent tous le faire bouger sensiblement.",
          "C'est pourquoi un cash-flow n'a de valeur que si les hypothèses qui le produisent sont claires, prudentes et en phase avec le marché visé.",
        ],
        bullets: [
          "Loyer et rythme d'occupation",
          "Mensualite et structure de financement",
          "Charges récurrentes et taxe fonciere",
          "Travaux, frais annexes et fiscalite",
        ],
      },
      {
        title: "Les erreurs fréquentes",
        paragraphs: [
          "L'erreur la plus classique consiste à regarder uniquement la rentabilité puis a découvrir trop tard que le financement détériore toute la lecture mensuelle du projet.",
          "Le cash-flow est aussi souvent embelli par un loyer trop optimiste ou une vacance trop faible. Dans ce cas, on ne lit pas le projet tel qu'il est, mais tel qu'on aimerait qu'il soit.",
        ],
      },
      {
        title: "Ce que GIGD permet de visualiser",
        paragraphs: [
          "GIGD replace le cash-flow au milieu des bons voisins: loyer, coût global, prix au m2, hypothèses retenues et points à vérifier. Cela aide à savoir si un cash-flow confortable repose sur des bases solides ou sur une lecture trop légère.",
        ],
      },
    ],
    faqTitle: "FAQ cash-flow",
    faqIntro:
      "Le cash-flow est souvent simplifie en 'positif ou negatif'. La réalité est un peu plus subtile, surtout quand on investit avec un objectif patrimonial.",
    faq: [
      {
        question: "Un cash-flow negatif est-il forcement mauvais ?",
        answer:
          "Non. Tout dépend de votre stratégie, de votre horizon de détention, du risque et de l'effort mensuel que vous acceptez.",
      },
      {
        question: "Quelle différence entre cash-flow et rentabilité ?",
        answer:
          "La rentabilité mesure la performance du bien par rapport à son coût. Le cash-flow mesure ce qu'il reste ou manque chaque mois dans la vie concrète du projet.",
      },
      {
        question: "Peut-on avoir une bonne rentabilité et un mauvais cash-flow ?",
        answer:
          "Oui. Un financement plus lourd, des charges élevées ou une fiscalite moins favorable peuvent dégrader le cash-flow malgré un rendement séduisant.",
      },
    ],
    relatedPaths: ["/calcul-rentabilite-locative", "/estimation-loyer", "/frais-notaire", "/methode"],
    relatedTitle: "Guides utiles autour du cash-flow",
    productTitle: "Ce que GIGD remet en perspective",
    productPoints: [
      "Cash-flow relie au loyer et au coût global",
      "Lecture de l'effort mensuel dans une analyse complète",
      "Vision plus nuancee qu'un simple resultat positif ou negatif",
    ],
    ctaTitle: "Voir le cash-flow d'un bien avec GIGD",
    ctaDescription:
      "Visualisez le cash-flow dans son contexte, avec les autres indicateurs qui comptent vraiment pour une décision locative.",
    ctaLabel: "Voir le cash-flow d'un bien avec GIGD",
    ctaSecondaryLabel: "Lire la méthode",
    ctaSecondaryHref: "/methode",
    closingNote:
      "Le bon cash-flow n'est pas celui qui rassure visuellement. C'est celui qui reste cohérent quand vous remettez du financement, de la vacance et des charges dans le dossier.",
  },
  {
    path: "/analyser-une-annonce-immobiliere",
    listingTitle: "Analyser une annonce immobiliere",
    listingDescription: "Passer de la lecture d'une annonce à une vraie analyse d'investissement.",
    title: "Comment analyser une annonce immobiliere avant d'investir",
    description:
      "Prix, surface, loyer, emplacement, charges, marché : découvrez comment analyser correctement une annonce immobiliere avant d'investir.",
    h1: "Comment analyser une annonce immobiliere",
    intro:
      "Une annonce est écrite pour faire avancer une vente. Un investisseur, lui, cherche à faire avancer une décision. Entre les deux, il y a un travail de reconstruction: vérifier ce qui est dit, identifier ce qui manque et remettre les bons indicateurs dans le bon ordre.",
    eyebrow: "Lecture d'annonce",
    heroTag: "Trier, vérifier, reconstruire",
    heroAsideTitle: "Ce qu'une annonce ne montre pas toujours",
    heroAsidePoints: [
      "Le niveau réel de charges et de frais annexes",
      "La robustesse du loyer retenu",
      "La cohérence du prix avec le micro-marché",
    ],
    keyPointsTitle: "Changer de posture",
    keyPointsIntro:
      "Lire une annonce en investisseur, c'est passer d'un texte commercial à une grille de décision. Ces points donnent la bonne posture des les premières minutes.",
    keyPoints: [
      "Une annonce est souvent incomplete ou orientée par la vente.",
      "Les premiers chiffres à vérifier ne suffisent pas à eux seuls.",
      "Une bonne analyse reconstruit rendement, loyer, prix au m2 et effort mensuel.",
      "Le contexte de marché compte autant que le bien lui-même.",
    ],
    sections: [
      {
        title: "Pourquoi une annonce ne suffit pas a elle seule",
        paragraphs: [
          "Les annonces sont faites pour declencher un contact. Elles mettent en avant les atouts visibles et resument le reste. Ce n'est pas un problème en soi. C'est simplement une limite qu'il faut connaitre.",
          "Pour investir, il faut lire au-dela du prix, de la surface et des photos. Ce qui manque dans l'annonce est parfois aussi important que ce qui est mis en vitrine.",
        ],
      },
      {
        title: "Les premières données à vérifier",
        paragraphs: [
          "Le prix, la surface, la localisation, l'état du bien, le type de location visé et les charges connues forment le premier filtre.",
          "A ce stade, le but n'est pas encore de conclure. Il s'agit de savoir si l'annonce mérite un approfondissement ou si elle doit sortir de votre pipeline.",
        ],
        bullets: [
          "Prix et surface réelle",
          "Micro-secteur et environnement",
          "Etat apparent du bien et travaux visibles",
          "Charges, copropriété et contraintes d'exploitation",
        ],
      },
      {
        title: "Les indicateurs a reconstruire",
        paragraphs: [
          "Une vraie analyse d'investissement reconstruit la rentabilité, le loyer plausible, le prix au m2, la cohérence avec le marché, l'effort mensuel et le niveau de risque.",
          "C'est cette étape qui transforme une impression de visite en lecture décidée. Tant qu'elle n'est pas faite, vous naviguez surtout à l'instinct.",
        ],
      },
      {
        title: "Les erreurs les plus fréquentes",
        paragraphs: [
          "Se fier a un seul chiffre est l'erreur la plus courante. Viennent ensuite la confiance aveugle dans un loyer théorique, l'oubli des frais annexes et la sous-estimation de la qualité du marché local.",
          "Un bien peut paraître convaincant dans l'annonce et se reveiller médiocre des que l'on remet les charges, la vacance ou la vraie valeur de marché dans le raisonnement.",
        ],
      },
      {
        title: "Ce qu'une bonne analyse doit montrer",
        paragraphs: [
          "Une bonne analyse rend les hypothèses visibles, les KPI lisibles et les points de vigilance explicites. Elle aide à comparer plusieurs biens et à savoir rapidement ou se situent les fragilites.",
          "Le bon resultat n'est pas d'avoir beaucoup de chiffres. C'est d'avoir ceux qui changent vraiment votre décision.",
        ],
      },
      {
        title: "Comment GIGD simplifie cette étape",
        paragraphs: [
          "GIGD aide à transformer une annonce en lecture exploitable: prix, loyer, rentabilité, cash-flow, comparaison au marché et zones à vérifier. Le produit structure l'analyse sans vous pousser artificiellement vers un 'oui'.",
        ],
      },
    ],
    faqTitle: "Questions de lecture d'annonce",
    faqIntro:
      "Avant visite, avant offre, avant simulation plus fine: voici les questions qui reviennent le plus souvent quand on passe d'une annonce à une analyse.",
    faq: [
      {
        question: "Peut-on se fier au prix affiché ?",
        answer:
          "Le prix affiché est un point de départ. Il doit être comparé au marché local et a la qualité réelle du bien avant d'être pris comme référence.",
      },
      {
        question: "Comment savoir si le loyer projete est réaliste ?",
        answer:
          "Il faut le confronter aux références de marché, à la typologie du bien, à son état et à la demande locative locale avec une hypothèse prudente plutôt qu'optimiste.",
      },
      {
        question: "Quels indicateurs regarder en priorite ?",
        answer:
          "Le trio prix au m2, loyer plausible et effort mensuel donne déjà une lecture utile. Ensuite viennent la rentabilité, la vacance probable et les points de risque.",
      },
      {
        question: "Faut-il comparer le prix au m2 du bien au marché ?",
        answer:
          "Oui. C'est un repère de premier niveau très utile pour savoir si l'annonce est correctement positionnée ou si une marge de negotiation semble exister.",
      },
    ],
    relatedPaths: ["/prix-m2", "/estimation-loyer", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Pages complémentaires pour lire une annonce",
    productTitle: "Ce que GIGD aide à remettre à plat",
    productPoints: [
      "Les chiffres de l'annonce remis dans un cadre d'investissement",
      "Une lecture plus structurée du loyer, du prix et des risques",
      "Une aide a la comparaison avant visite ou offre",
    ],
    ctaTitle: "Analyser une annonce avec GIGD",
    ctaDescription:
      "Passez d'une annonce commerciale à une analyse structurée du prix, du loyer, du rendement et du contexte de marché.",
    ctaLabel: "Analyser une annonce avec GIGD",
    ctaSecondaryLabel: "Voir toutes les ressources",
    ctaSecondaryHref: "/ressources",
    closingNote:
      "L'annonce sert a ouvrir une piste. La décision, elle, commence quand vous recomposez ce que l'annonce ne raconte pas.",
  },
  {
    path: "/estimation-loyer",
    listingTitle: "Estimation de loyer",
    listingDescription: "Verifier qu'un loyer cible reste cohérent avec le marché local.",
    title: "Estimation de loyer : comment savoir si un bien se louera au bon prix",
    description:
      "Decouvrez comment estimer un loyer de maniere coherente, éviter les surestimations et analyser le potentiel locatif réel d'un bien.",
    h1: "Comment estimer le loyer d'un bien immobilier",
    intro:
      "Le loyer est souvent l'hypothèse la plus fragile d'un dossier et pourtant celle qui change le plus la lecture finale. Quelques dizaines d'euros d'écart peuvent suffire à faire bouger la rentabilité, le cash-flow et le niveau de confiance que vous pouvez accorder au projet.",
    eyebrow: "Hypothèse critique",
    heroTag: "Loyer plausible, pas rêvé",
    heroAsideTitle: "Pourquoi cette question est sensible",
    heroAsidePoints: [
      "Le loyer retenu influence presque tous les KPI du dossier",
      "Une hypothèse optimiste suffit à embellir artificiellement l'analyse",
      "Le marché local impose souvent plus de prudence que l'annonce",
    ],
    keyPointsTitle: "Le bon reflexe",
    keyPointsIntro:
      "L'objectif n'est pas de trouver le loyer maximal imaginable. L'objectif est de retenir un loyer défendable, compatible avec le bien et avec le marché.",
    keyPoints: [
      "Le loyer cible influence directement la solidité du projet.",
      "Une surestimation du loyer fausse toute l'analyse.",
      "Le marché local et la typologie du bien restent centraux.",
      "Une bonne estimation doit rester défendable, pas simplement optimiste.",
    ],
    sections: [
      {
        title: "Pourquoi l'estimation de loyer est décisive",
        paragraphs: [
          "Le loyer retenu alimente la plupart des indicateurs d'un projet locatif. Si cette hypothèse de départ est trop haute, le rendement et le cash-flow paraîtront meilleurs qu'ils ne le sont vraiment.",
          "Commencer par une hypothèse locative prudente, c'est gagner du temps. Vous évitez de tomber amoureux d'un dossier qui ne tient que dans le meilleur scénario.",
        ],
      },
      {
        title: "Les critères qui influencent le loyer",
        paragraphs: [
          "La ville, le secteur precis, la surface, l'état du bien, la typologie, la tension locative et le positionnement du bien dans son micro-marché jouent tous un role.",
          "Deux biens a quelques rues d'écart peuvent se louer sur des bases très differentes si l'immeuble, l'état, la distribution ou la cible locative ne sont pas comparables.",
        ],
      },
      {
        title: "Les erreurs fréquentes d'estimation",
        paragraphs: [
          "La première erreur consiste a recopier une annonce haute comme si elle representait la norme. La seconde est de confondre le souhait d'un vendeur ou d'un bailleur avec le prix reellement absorbable par le marché.",
          "Il faut aussi se méfier des moyennes trop larges. Une moyenne de ville peut orienter. Elle ne remplace jamais une lecture plus fine du quartier et de la typologie.",
        ],
      },
      {
        title: "Comment vérifier la cohérence d'un loyer",
        paragraphs: [
          "La bonne pratique consiste à croiser plusieurs références, puis à retenir une hypothèse prudente. Ensuite, il faut tester la sensibilité du projet si le loyer réel est légèrement plus bas que prévu.",
          "Si une petite baisse de loyer suffit déjà a fragiliser le dossier, vous apprenez quelque chose d'important: le projet manque de marge.",
        ],
        subsections: [
          {
            title: "Exemple pédagogique",
            paragraphs: [
              "Exemple de démonstration: un écart de 80 EUR par mois entre un scénario central et un scénario prudent peut suffire à faire passer un projet d'un équilibre confortable à un effort mensuel visible. Cet exemple sert uniquement à illustrer la sensibilité d'un dossier.",
            ],
          },
        ],
      },
      {
        title: "Comment GIGD aide à estimer un loyer plus intelligemment",
        paragraphs: [
          "GIGD replace le loyer dans une lecture plus complète du bien. L'outil n'essaie pas de promettre le chiffre le plus haut possible. Il aide à vérifier si l'hypothèse retenue reste tenable face au marché, au prix et au reste de l'équilibre économique.",
        ],
      },
    ],
    faqTitle: "FAQ estimation de loyer",
    faqIntro:
      "Le sujet paraît simple jusqu'au moment ou un petit écart de loyer suffit a changer l'interet d'une opération. Voici les points à clarifier.",
    faq: [
      {
        question: "Comment savoir si un loyer est surevalue ?",
        answer:
          "S'il n'est pas cohérent avec les références locales, l'état du bien, sa surface ou sa typologie, il y a un risque fort de surestimation.",
      },
      {
        question: "Le loyer affiché dans une annonce est-il fiable ?",
        answer:
          "Pas toujours. Il peut s'agir d'une projection théorique ou d'une hypothèse optimiste qui doit être vérifiée avant d'être intégrée à votre analyse.",
      },
      {
        question: "Une petite différence de loyer change-t-elle vraiment l'analyse ?",
        answer:
          "Oui. Sur un projet tendu, quelques dizaines d'euros par mois peuvent changer la lecture du cash-flow et de la marge de securite.",
      },
    ],
    relatedPaths: ["/prix-m2", "/cash-flow-immobilier", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Autres repères à croiser avec le loyer",
    productTitle: "Comment GIGD vous aide à cadrer le loyer",
    productPoints: [
      "Loyer remis dans le contexte du prix et du marché",
      "Impact visible sur rendement et cash-flow",
      "Lecture plus prudente que le simple meilleur cas",
    ],
    ctaTitle: "Tester un loyer cible avec GIGD",
    ctaDescription:
      "Confrontez votre hypothèse de loyer à une lecture plus globale du bien et a l'équilibre économique du projet.",
    ctaLabel: "Tester un loyer cible avec GIGD",
    ctaSecondaryLabel: "Comparer le prix au marché",
    ctaSecondaryHref: "/prix-m2",
    closingNote:
      "Quand un dossier ne tient qu'avec le loyer le plus haut, le sujet n'est plus l'estimation de loyer. Le sujet devient la fragilite du projet.",
  },
  {
    path: "/prix-m2",
    listingTitle: "Prix au m2",
    listingDescription: "Comprendre ce que ce repère dit vraiment d'une annonce.",
    title: "Prix au m2 : comment l'interpréter pour un investissement immobilier",
    description:
      "Le prix au m2 est un repère utile, mais insuffisant seul. Decouvrez comment l'analyser correctement avant d'investir.",
    h1: "Comment lire le prix au m2 d'un bien immobilier",
    intro:
      "Le prix au m2 est souvent le premier reflexe d'un investisseur presse. C'est logique: en quelques secondes, il permet de situer une annonce. Mais justement, sa vitesse en fait aussi un indicateur trompeur si vous lui demandez plus qu'il ne peut dire.",
    eyebrow: "Repere de comparaison",
    heroTag: "Filtre utile, verdict insuffisant",
    heroAsideTitle: "Ce ratio est utile pour",
    heroAsidePoints: [
      "Prioriser vos annonces en amont",
      "Reperer rapidement un écart avec le marché",
      "Preparer une question de négociation ou de vigilance",
    ],
    keyPointsTitle: "Avant de juger un prix au m2",
    keyPointsIntro:
      "Ce ratio est puissant pour filtrer vite. Il devient dangereux si vous oubliez tout ce qu'il ne capte pas: immeuble, rue, état, annexes, tension locative.",
    keyPoints: [
      "Le prix au m2 est un excellent filtre de premier niveau.",
      "Il peut être trompeur s'il est lu sans contexte.",
      "La micro-localisation et la qualité du bien changent tout.",
      "Il doit être croise avec loyer, rendement, cash-flow et travaux.",
    ],
    sections: [
      {
        title: "A quoi sert le prix au m2",
        paragraphs: [
          "Le prix au m2 donne un repère rapide pour comparer plusieurs annonces et détecter celles qui semblent au-dessus ou au-dessous du marché.",
          "C'est un outil de tri très efficace quand vous étudiez beaucoup de biens ou que vous voulez prioriser vos visites sans perdre de temps.",
        ],
      },
      {
        title: "Pourquoi il peut être trompeur",
        paragraphs: [
          "Deux biens dans un même quartier peuvent avoir des prix au m2 très differents pour de bonnes raisons: étage, état, exposition, qualité de l'immeuble, présence d'annexes ou adresse plus ou moins qualitative.",
          "Le problème commence quand ce repère devient une conclusion. Le ratio ne voit pas à lui seul la désirabilité locative ni la qualité économique complète du dossier.",
        ],
      },
      {
        title: "Comment le comparer au marché",
        paragraphs: [
          "La bonne méthode consiste a confronter le prix au m2 du bien a des références comparables, puis a expliquer l'écart observé. Un écart n'est pas forcement mauvais. Il doit simplement être compris.",
          "Si le bien est plus cher que le marché, encore faut-il savoir si cette prime est justifiee. S'il est moins cher, il faut identifier ce que le marché est en train de sanctionner.",
        ],
      },
      {
        title: "Ce qu'il faut regarder en plus",
        paragraphs: [
          "Le loyer possible, la rentabilité, le cash-flow, la demande locative et le besoin de travaux sont indispensables pour transformer le prix au m2 en outil de décision.",
          "Un prix au m2 bas ne suffit jamais à faire une bonne affaire. Ce qui compte, c'est la cohérence d'ensemble entre prix, usage et exploitation.",
        ],
        bullets: [
          "Loyer cible et demande locative",
          "Rendement et cash-flow",
          "Travaux, état du bien et copropriété",
          "Qualite du micro-marché",
        ],
      },
      {
        title: "Comment GIGD remet le prix au m2 dans son contexte",
        paragraphs: [
          "GIGD aide à replacer le prix au m2 dans une lecture plus complète: comparaison au marché, loyer potentiel, coût global, cash-flow et points de vigilance. Cela permet de sortir d'un jugement trop rapide base sur un seul ratio.",
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
          "Non. Il peut signaler un mauvais état, un immeuble problematique, une faible demande locative ou des travaux a absorber.",
      },
      {
        question: "Peut-on acheter au-dessus du marché et faire une bonne opération ?",
        answer:
          "Oui, si l'écart se justifie et si l'ensemble du projet reste cohérent. Encore faut-il comprendre ce que vous payez et pourquoi.",
      },
      {
        question: "Pourquoi deux biens proches n'ont-ils pas le même prix au m2 ?",
        answer:
          "Parce que la rue, l'immeuble, l'étage, l'état, la distribution et les annexes peuvent changer fortement la valeur d'usage et la valeur de marché.",
      },
    ],
    relatedPaths: ["/estimation-loyer", "/analyser-une-annonce-immobiliere", "/calcul-rentabilite-locative", "/methode"],
    relatedTitle: "Pour donner du contexte au prix au m2",
    productTitle: "Comment GIGD l'utilise sans le surestimer",
    productPoints: [
      "Comparaison du bien avec son marché disponible",
      "Mise en perspective avec loyer, coût global et cash-flow",
      "Aide à repasser d'un ratio à une décision plus complète",
    ],
    ctaTitle: "Comparer un bien à son marché avec GIGD",
    ctaDescription:
      "Ne vous contentez pas d'un ratio isole. Comparez le prix au m2 du bien avec les autres indicateurs qui comptent pour l'investisseur.",
    ctaLabel: "Comparer un bien à son marché avec GIGD",
    ctaSecondaryLabel: "Apprendre à lire une annonce",
    ctaSecondaryHref: "/analyser-une-annonce-immobiliere",
    closingNote:
      "Le prix au m2 est très bon pour vous faire gagner du temps. Il est moins bon pour prendre une décision à votre place.",
  },
  {
    path: "/frais-notaire",
    listingTitle: "Frais de notaire",
    listingDescription: "Comprendre leur poids dans le coût global d'un projet.",
    title: "Frais de notaire : quel impact réel sur un investissement immobilier",
    description:
      "Comprendre les frais de notaire, leur poids dans l'opération et leur impact sur la rentabilité réelle d'un investissement.",
    h1: "Comprendre les frais de notaire dans un investissement immobilier",
    intro:
      "Les frais de notaire sont rarement ce qui fait rêver dans une annonce. Pourtant, ils font partie des premiers postes qui remettent un dossier à sa vraie place. Quand on les oublie, on ne surestime pas un détail: on sous-estime le coût réel du projet.",
    eyebrow: "Cout global",
    heroTag: "Le prix affiché ne suffit pas",
    heroAsideTitle: "Ce que les frais de notaire changent",
    heroAsidePoints: [
      "La lecture du coût d'entrée dans l'opération",
      "La comparaison entre deux biens apparemment équivalents",
      "Le niveau d'apport ou de financement à mobiliser",
    ],
    keyPointsTitle: "A retenir des la première lecture",
    keyPointsIntro:
      "Si vous analysez un bien sur son seul prix affiché, vous regardez déjà le dossier avec un angle incomplet. Les frais d'acquisition doivent entrer tôt dans le raisonnement.",
    keyPoints: [
      "Les frais de notaire font partie du coût réel d'acquisition.",
      "Ils influencent le rendement, le cash-flow et l'apport mobilise.",
      "Les ignorer fausse la comparaison entre plusieurs biens.",
      "Ils doivent être intégrés des le début de l'analyse.",
    ],
    sections: [
      {
        title: "Que recouvrent les frais de notaire",
        paragraphs: [
          "Dans le langage courant, on parle de frais de notaire comme d'un bloc unique. En pratique, cette expression recouvre plusieurs composantes liées à l'acquisition et à sa formalisation.",
          "Pour l'investisseur, l'enjeu n'est pas de memoriser chaque détail technique. L'enjeu est de comprendre que cette ligne fait pleinement partie du coût réel du projet.",
        ],
      },
      {
        title: "Pourquoi ils changent l'analyse d'un bien",
        paragraphs: [
          "Des que vous les reintegrez, le coût total augmente. Cela agit directement sur la lecture du rendement et, selon le montage retenu, sur l'apport ou le financement nécessaire.",
          "Un bien qui paraissait correct a la seule lecture du prix affiché peut devenir beaucoup moins convaincant une fois les frais d'acquisition reellement remis dans l'equation.",
        ],
      },
      {
        title: "Les erreurs fréquentes",
        paragraphs: [
          "L'erreur la plus simple consiste a les oublier. Une autre erreur consiste a les traiter comme une petite marge annexe alors qu'ils modifient reellement le coût d'entrée dans l'opération.",
          "Enfin, beaucoup d'analyses restent coincees sur le prix affiché alors que c'est le coût global qui devrait servir de base au raisonnement investisseur.",
        ],
      },
      {
        title: "Comment integrer correctement les frais dans son analyse",
        paragraphs: [
          "La bonne logique consiste a raisonner en coût global des la première lecture: prix d'achat, frais de notaire, frais annexes et enveloppes complémentaires doivent être visibles tôt.",
          "Cette discipline evite les comparaisons trompeuses et permet de mieux mesurer l'effort réel demande par chaque dossier.",
        ],
        subsections: [
          {
            title: "Exemple de démonstration",
            paragraphs: [
              "Exemple pédagogique: deux biens affichés au même prix peuvent paraître équivalents. Si l'un impose une enveloppe d'acquisition plus lourde au démarrage, son rendement réel et son effort de financement ne seront plus lus de la même façon. Cet exemple reste démonstratif et ne pilote aucun calcul de production.",
            ],
          },
        ],
      },
      {
        title: "Comment GIGD les remet dans une analyse plus complète",
        paragraphs: [
          "GIGD aide à replacer les frais de notaire dans une lecture d'ensemble du projet. L'idée est de raisonner sur le coût réel, puis de relier ce coût au loyer, au rendement, au cash-flow et au niveau de risque du bien.",
        ],
      },
    ],
    faqTitle: "FAQ frais de notaire",
    faqIntro:
      "Les frais d'acquisition sont souvent minimisés dans les premières discussions. Pourtant, ce sont eux qui remettent rapidement un dossier sur sa vraie base.",
    faq: [
      {
        question: "Les frais de notaire changent-ils vraiment la rentabilité ?",
        answer:
          "Oui. Comme ils augmentent le coût réel du projet, ils abaissent mecaniquement la lecture du rendement et changent parfois le montage financier nécessaire.",
      },
      {
        question: "Faut-il les integrer des la première lecture d'une annonce ?",
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
    relatedTitle: "Pages utiles autour du coût global",
    productTitle: "Comment GIGD les remet dans le décor",
    productPoints: [
      "Cout global relie a la rentabilité et au cash-flow",
      "Lecture plus juste de l'effort d'acquisition",
      "Comparaison de biens sur une base moins trompeuse",
    ],
    ctaTitle: "Lancer une analyse complète avec GIGD",
    ctaDescription:
      "Replacez les frais d'acquisition dans le coût global et voyez leur impact sur la lecture du bien.",
    ctaLabel: "Lancer une analyse complète avec GIGD",
    ctaSecondaryLabel: "Voir le cash-flow immobilier",
    ctaSecondaryHref: "/cash-flow-immobilier",
    closingNote:
      "Quand le coût d'acquisition n'est pas complet, ce n'est pas seulement le rendement qui est faux. C'est toute la comparaison entre biens qui devient moins fiable.",
  },
  {
    path: "/sci-ou-nom-propre",
    listingTitle: "SCI ou nom propre",
    listingDescription: "Réfléchir a la structure sans tomber dans le conseil simpliste.",
    title: "SCI ou nom propre : comment réfléchir avant d'investir",
    description:
      "SCI ou achat en nom propre : découvrez les grands critères de réflexion avant de structurer un investissement immobilier.",
    h1: "SCI ou nom propre : quelle logique pour investir",
    intro:
      "La question de la structure arrive souvent très tôt, parfois même avant l'analyse du bien. C'est compréhensible: elle touche au patrimoine, à la gestion et à la projection dans le temps. Mais il faut garder l'ordre logique. La structure vient organiser un projet. Elle ne transforme jamais un mauvais deal en bon investissement.",
    eyebrow: "Structuration du projet",
    heroTag: "Pedagogie, pas conseil personnalisé",
    heroAsideTitle: "Cette page sert a",
    heroAsidePoints: [
      "Donner une première grille de réflexion sur la structuration",
      "Montrer qu'il n'existe pas de réponse universelle",
      "Rappeler que la qualité du bien reste le premier sujet",
    ],
    keyPointsTitle: "Le cadre de réflexion",
    keyPointsIntro:
      "Nom propre ou SCI n'est pas une question de tendance. C'est une question de contexte: objectifs, horizon, gestion, financement, détention à plusieurs ou non.",
    keyPoints: [
      "La structure sert une stratégie, elle ne remplace jamais la qualité du bien.",
      "Le nom propre et la SCI répondent a des logiques differentes.",
      "Le bon choix dépend du contexte, pas d'une règle universelle.",
      "L'analyse du bien reste la première étape avant la structuration.",
    ],
    sections: [
      {
        title: "Pourquoi la question se pose",
        paragraphs: [
          "La question apparaît dès qu'il faut arbitrer entre simplicité, achat à plusieurs, logique patrimoniale ou organisation de la détention du bien.",
          "Elle se pose differemment selon que vous investissez seul, avec un associe, avec un objectif de transmission ou avec la volonte de structurer plusieurs acquisitions dans le temps.",
        ],
      },
      {
        title: "Ce que permet l'achat en nom propre",
        paragraphs: [
          "L'achat en nom propre reste la voie la plus simple a comprendre et à mettre en place dans beaucoup de cas. C'est souvent l'option la plus lisible pour un investisseur seul qui veut un cadre direct.",
          "Cette simplicité n'en fait pas une réponse universelle. Elle en fait une solution fréquente, souvent adaptée à certains profils et à certains projets.",
        ],
      },
      {
        title: "Ce que permet une SCI",
        paragraphs: [
          "La SCI introduit une logique d'organisation et de détention collective. Elle peut devenir pertinente quand plusieurs personnes investissent ensemble ou quand la structuration patrimoniale prend de l'importance.",
          "Elle ne doit toutefois pas être idéalisée. Elle repond a certains besoins, avec des implications qu'il faut comprendre au cas par cas.",
        ],
      },
      {
        title: "Les critères de réflexion",
        paragraphs: [
          "Le bon raisonnement part des objectifs: recherche de simplicité, logique patrimoniale, horizon de détention, mode de gestion, conditions de financement et perspective de transmission.",
          "C'est cette combinaison de critères qui permet de savoir quelle logique semble la plus coherente pour votre situation, pas une règle entendue trop vite sur internet.",
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
          "Il n'existe pas de meilleure structure dans l'absolu. Une même solution peut être excellente dans un contexte et peu pertinente dans un autre.",
          "C'est pourquoi ce sujet mérite de la prudence. Une page utile doit rester pédagogique et rappeler qu'une validation juridique ou comptable adaptée devient nécessaire quand le projet se précise.",
        ],
      },
      {
        title: "Comment GIGD s'insere dans la réflexion d'investissement",
        paragraphs: [
          "GIGD aide à lire la qualité économique du bien et la solidité de ses hypothèses. Le produit n'a pas vocation à remplacer un conseil juridique personnalisé sur la structure de détention. Il aide en revanche à clarifier ce que vaut le deal avant d'aller plus loin dans le montage.",
        ],
      },
    ],
    faqTitle: "FAQ structuration",
    faqIntro:
      "La meilleure structure dépend toujours du contexte. Les questions ci-dessous servent à poser les bons repères sans glisser vers un conseil personnalisé.",
    faq: [
      {
        question: "Faut-il toujours investir en SCI ?",
        answer:
          "Non. La SCI peut être pertinente dans certains cas, mais elle n'est pas une réponse automatique à tous les projets.",
      },
      {
        question: "Est-ce plus simple d'acheter en nom propre ?",
        answer:
          "Dans beaucoup de situations, oui. C'est souvent la voie la plus lisible pour un premier investissement seul, mais cela dépend du contexte global.",
      },
      {
        question: "La structure change-t-elle la qualité du bien analyse ?",
        answer:
          "Non. Un mauvais bien reste un mauvais bien, quelle que soit la structure retenue. L'analyse du deal vient avant la structuration.",
      },
    ],
    relatedPaths: ["/calcul-rentabilite-locative", "/cash-flow-immobilier", "/analyser-une-annonce-immobiliere", "/methode"],
    relatedTitle: "Guides à lire avant de choisir une structure",
    productTitle: "La place de GIGD dans cette réflexion",
    productPoints: [
      "Vérifier d'abord si le bien tient économiquement",
      "Clarifier le deal avant les questions de structuration",
      "Servir d'appui à une décision plus documentée",
    ],
    ctaTitle: "Commencer par analyser le bien avec GIGD",
    ctaDescription:
      "Avant de discuter structure, commencez par vérifier si le bien tient économiquement et si ses hypothèses sont solides.",
    ctaLabel: "Commencer par analyser le bien avec GIGD",
    ctaSecondaryLabel: "Comprendre la méthode",
    ctaSecondaryHref: "/methode",
    closingNote:
      "La structure organise la détention. Elle ne corrige ni un mauvais prix, ni un loyer mal estime, ni un cash-flow trop fragile.",
  },
  ...strategicResourcePages,
];

export const resourceHubCategories: ResourceHubCategory[] = [
  {
    key: "comprendre",
    indexLabel: "A",
    title: "Comprendre",
    description:
      "Les bases de lecture qui permettent de trier un bien, d'interpréter un rendement et d'éviter les faux signaux de trésorerie.",
    paths: [
      "/rendement-brut-net-net-net",
      "/cash-flow-avant-impot-apres-impot",
      "/objectif-rendement-brut",
    ],
  },
  {
    key: "analyser",
    indexLabel: "B",
    title: "Analyser",
    description:
      "Les guides qui servent à reconstruire une base comparable, repartir du coût global et comparer deux opportunités avec la même méthode.",
    paths: ["/cout-global-acquisition", "/comparer-deux-investissements-locatifs"],
  },
  {
    key: "structurer",
    indexLabel: "C",
    title: "Structurer",
    description:
      "Les arbitrages de régime et de structure qui changent la fiscalité, la trésorerie nette et la logique patrimoniale du projet.",
    paths: ["/micro-foncier-ou-reel", "/lmnp-micro-bic-ou-reel", "/sci-ir-ou-sci-is"],
  },
];

export const homeFeaturedResourcePaths = [
  "/rendement-brut-net-net-net",
  "/cash-flow-avant-impot-apres-impot",
  "/cout-global-acquisition",
  "/comparer-deux-investissements-locatifs",
  "/micro-foncier-ou-reel",
  "/lmnp-micro-bic-ou-reel",
  "/sci-ir-ou-sci-is",
  "/objectif-rendement-brut",
  "/analyser-une-annonce-immobiliere",
  "/estimation-loyer",
] as const;

export const featuredResourcePath = "/comparer-deux-investissements-locatifs";

export function getSeoPageByPath(pathname: string) {
  return seoPages.find((page) => page.path === pathname) || null;
}

export function getSeoPagesByPaths(paths: readonly string[]) {
  return paths
    .map((pathname) => getSeoPageByPath(pathname))
    .filter((page): page is SeoArticleDefinition => Boolean(page));
}

export function getHubResourcePathSet() {
  return new Set(resourceHubCategories.flatMap((category) => category.paths));
}

export function getHubExplorerPages() {
  const hubPathSet = getHubResourcePathSet();
  return seoPages.filter((page) => !hubPathSet.has(page.path));
}

export function getResourcePagesByCategory(categoryKey: ResourceCategoryKey) {
  const category = resourceHubCategories.find((item) => item.key === categoryKey);
  return category ? getSeoPagesByPaths(category.paths) : [];
}
