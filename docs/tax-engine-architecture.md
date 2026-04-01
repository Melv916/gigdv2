# Moteur fiscal GIGD

## Vue d'ensemble

La couche fiscale v1 vit dans `src/lib/investment/tax`.

- `types.ts` centralise les types metier canoniques.
- `projectTaxAdapter.ts` normalise les donnees du cockpit vers `CanonicalInvestmentInput`.
- `compatibility.ts` filtre les regimes par plan, mode de detention et mode d'exploitation.
- `analysisService.ts` orchestre les 3 couches de sortie:
  - resultat economique
  - resultat fiscal
  - resultat patrimonial
- chaque regime fiscal est un module independant testable.

Le front ne contient aucune formule fiscale. Il ne fait que:

- collecter les choix utilisateur
- construire l'input canonique
- afficher les resultats et warnings renvoyes par le moteur

## Ajouter un nouveau regime fiscal

1. Ajouter l'identifiant dans `src/lib/investment/tax/types.ts`.
2. Ajouter la metadata UI dans `src/lib/investment/tax/assumptions.ts`.
3. Creer un moteur dans `src/lib/investment/tax/<regime>Engine.ts`.
4. Enregistrer le moteur dans `src/lib/investment/tax/registry.ts`.
5. Declarer la compatibilite dans `src/lib/investment/tax/compatibility.ts`.
6. Ajouter un test unitaire dedie dans `src/lib/investment/tax/`.

Contrat minimal d'un moteur:

- recevoir `TaxCalculationContext`
- retourner un `TaxResult` homogene
- renseigner `notes`, `warnings` et `assumptions`

## Versionning

Les versions actives sont dans `src/lib/investment/tax/constants.ts`.

- `CORE_CALC_VERSION`
- `TAX_CALC_VERSION`

Elles sont snapshottees dans `project_analyses` via:

- `core_calc_version`
- `tax_calc_version`
- `canonical_input_json`
- `tax_analysis_json`
- `tax_comparison_json`

Ne jamais modifier silencieusement un calcul historique sans incrementer la version correspondante.

## Debug d'un calcul

1. Verifier le `canonical_input_json` sauvegarde.
2. Comparer `economic_result_json`, `tax_analysis_json` et `tax_comparison_json`.
3. Confirmer le couple:
   - `exploitation_mode`
   - `ownership_mode`
4. Verifier le plan utilisateur et la sortie de `resolveAvailableTaxRegimes`.
5. Relancer les tests fiscaux:

```bash
npm run test -- src/lib/investment/tax
```

## Limites v1

- PHASE 1 uniquement:
  - micro-foncier
  - reel foncier
  - LMNP micro-BIC
  - LMNP reel
  - SCI IR
  - SCI IS
- les montages holding et mere-fille sont cadres dans le resolver mais pas encore calcules
- les simulations restent indicatives et doivent etre validees par un professionnel
