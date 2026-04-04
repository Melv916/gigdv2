# GIGD Premium Visual System

## Intent

Cette refonte reste strictement visuelle.

- Aucun calcul, flux, endpoint ou schema de donnees n'a ete modifie.
- Le but est de faire percevoir GIGD comme un cockpit investisseur premium.
- La direction retenue combine immobilier, finance et intelligence de decision.

## Core Style

- Fond principal: `#0B1424`
- Cartes principales: `#101C33`
- Cartes secondaires: `#16243D`
- Accent: `#2F8CFF`
- Glow cyan: `#22D3EE`
- Success: `#10B981`
- Danger attenue: `#EF4444`

## Typography

- Headings: `Inter Tight` puis `Manrope`
- Body: `Inter` puis `Manrope`
- Labels: uppercase, tracking large, contraste plus doux
- KPIs: taille forte, chasse serree, lecture immediate

## Surfaces

- Les surfaces premium reposent sur `glass-card`, `premium-shell`, `analysis-cockpit-card` et `analysis-cockpit-subcard`.
- Les bordures sont fines et lumineuses, jamais opaques.
- Les ombres restent profondes mais diffuses pour garder un rendu institutionnel.

## Hero

- `PremiumHeroScene.tsx` ajoute une scene WebGL lente et abstraite.
- Si WebGL n'est pas disponible, le fallback CSS garde la meme ambiance.
- Le mouvement est allege sur mobile, mis en pause hors viewport et neutralise si `prefers-reduced-motion` est actif.

## Analysis Cockpit

- Le cockpit est traite comme une surface de decision.
- Les verdicts, KPI, scripts et projections utilisent une hierarchie visuelle plus nette sans toucher aux donnees.
- Les tableaux et cartes restent lisibles sur mobile avec la meme structure fonctionnelle.

## Extend

Pour harmoniser une nouvelle page sans toucher a sa logique:

1. Utiliser `premium-shell` pour les sections principales.
2. Utiliser `glass-card` pour les modules standards.
3. Utiliser `premium-eyebrow` pour les labels de section.
4. Rester dans la palette navy/blue/cyan sans introduire de nouvelles familles de couleurs.
