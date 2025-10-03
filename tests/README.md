# Tests visuels des maquettes

## Vue d'ensemble

Chaque maquette doit avoir son propre fichier de test visuel pour vérifier l'alignement et l'apparence.

## Nomenclature des fichiers de test

Les tests visuels doivent suivre cette nomenclature :
```
tests/[nom-maquette].visual.spec.ts
```

Exemples :
- `tests/preparer-ixfacture.visual.spec.ts` - Test pour PrepareriXFacture
- `tests/tableau-de-bord-ixfacture.visual.spec.ts` - Test pour TableauDeBordIxfacture
- `tests/premier-test.visual.spec.ts` - Test pour PremierTest

## Structure type d'un test visuel

```typescript
import { test, expect } from '@playwright/test';

test.describe('Vérification visuelle - [NomMaquette]', () => {
  test('Vérification de l\'alignement', async ({ page }) => {
    // 1. Naviguer vers la maquette
    await page.goto('/chemin-maquette');
    await page.waitForLoadState('networkidle');

    // 2. Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/nom-maquette-full.png',
      fullPage: true
    });

    // 3. Vérifier l'AppBar
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // 4. Vérifier les éléments spécifiques à la maquette
    // Exemple : toolbar, tableau, cartes, etc.

    // 5. Vérifier l'alignement horizontal
    const appBarBox = await appBar.boundingBox();
    // Récupérer les positions des autres éléments...

    // 6. Assertions d'alignement
    // expect(Math.abs(appBarLeft - elementLeft)).toBeLessThan(5);

    // 7. Vérifier les éléments fonctionnels spécifiques
    // Boutons, formulaires, etc.
  });
});
```

## Éléments à vérifier systématiquement

### 1. Alignement horizontal
- L'AppBar doit être alignée avec tous les éléments de contenu
- Tolérance : 5px maximum
- Utiliser `boundingBox()` pour obtenir les positions

### 2. Captures d'écran
- Capture pleine page : `nom-maquette-full.png`
- Captures des zones importantes : `nom-maquette-[zone].png`

### 3. Éléments visuels
- Tous les boutons principaux doivent être visibles
- Les formulaires doivent être accessibles
- Les tableaux/grilles doivent s'afficher correctement

### 4. Espacement
- Vérifier l'espacement entre l'AppBar et le contenu (généralement `mt: 2`)
- Vérifier les marges et paddings des conteneurs principaux

## Exécution des tests

```bash
# Exécuter tous les tests visuels
npm run test:visual

# Exécuter un test spécifique
npx playwright test tests/preparer-ixfacture.visual.spec.ts

# Mode debug avec interface
npm run test:visual:ui

# Avec navigateur visible
npm run test:visual:headed
```

## Quand créer un test visuel ?

**OBLIGATOIRE :** Chaque nouvelle maquette DOIT avoir son test visuel avant d'être livrée.

Le test doit :
1. Vérifier l'alignement de tous les éléments majeurs
2. Prendre des captures d'écran pour référence
3. Valider la présence des éléments fonctionnels clés
4. Passer sans erreur avant la livraison

## Debugging

Si un test échoue :
1. Lancer `npm run test:visual:ui` pour voir l'interface de debug
2. Vérifier les captures d'écran dans `tests/screenshots/`
3. Consulter le rapport HTML avec `npx playwright show-report`
4. Ajuster les sélecteurs ou les assertions selon les besoins

## Bonnes pratiques

- ✅ Un fichier de test par maquette
- ✅ Nommer les tests de façon explicite
- ✅ Documenter les vérifications spécifiques
- ✅ Prendre des captures d'écran aux points clés
- ✅ Vérifier l'alignement de tous les conteneurs majeurs
- ❌ Ne pas créer de tests génériques qui testent plusieurs maquettes
- ❌ Ne pas avoir de tests qui dépendent d'autres tests
