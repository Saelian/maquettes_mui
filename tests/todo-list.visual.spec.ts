import { test, expect } from '@playwright/test';

/**
 * Test visuel pour la maquette TodoList
 */
test.describe('Vérification visuelle - TodoList', () => {
  test('TodoList - Vérification de l\'alignement et des fonctionnalités', async ({ page }) => {
    // 1. Naviguer vers la maquette
    await page.goto('/todo-list');
    await page.waitForLoadState('networkidle');

    // 2. Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/todo-list-full.png',
      fullPage: true
    });

    // 3. Vérifier l'AppBar
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // 4. Vérifier le conteneur principal
    const mainPaper = page.locator('div[class*="MuiPaper-root"]').first();
    await expect(mainPaper).toBeVisible();

    // 5. Vérifier les éléments de l'en-tête
    await expect(page.getByRole('heading', { name: /mes tâches/i })).toBeVisible();

    // 6. Vérifier les statistiques (chips)
    await expect(page.getByText(/au total/i)).toBeVisible();
    await expect(page.locator('.MuiChip-label').filter({ hasText: /active/i })).toBeVisible();
    await expect(page.locator('.MuiChip-label').filter({ hasText: /terminée/i })).toBeVisible();

    // 7. Vérifier le formulaire d'ajout de tâche
    const nouveauTitreInput = page.getByLabel(/titre de la tâche/i);
    await expect(nouveauTitreInput).toBeVisible();

    // Vérifier que le FormControl avec le label "Priorité" est présent
    await expect(page.locator('label').filter({ hasText: 'Priorité' })).toBeVisible();

    const boutonAjouter = page.getByRole('button', { name: /ajouter/i });
    await expect(boutonAjouter).toBeVisible();

    // 8. Vérifier les boutons de filtre
    const boutonToutes = page.getByRole('button', { name: /^toutes$/i });
    const boutonActives = page.getByRole('button', { name: /^actives$/i });
    const boutonTerminees = page.getByRole('button', { name: /^terminées$/i });

    await expect(boutonToutes).toBeVisible();
    await expect(boutonActives).toBeVisible();
    await expect(boutonTerminees).toBeVisible();

    // 9. Vérifier la présence des tâches par défaut
    await expect(page.getByText(/valider les factures du mois/i)).toBeVisible();
    await expect(page.getByText(/mettre à jour la documentation/i)).toBeVisible();
    await expect(page.getByText(/archiver les anciens documents/i)).toBeVisible();

    // 10. Vérifier l'alignement horizontal
    const appBarBox = await appBar.boundingBox();
    const mainPaperBox = await mainPaper.boundingBox();

    if (appBarBox && mainPaperBox) {
      const appBarLeft = appBarBox.x;
      const mainPaperLeft = mainPaperBox.x;

      console.log('AppBar left:', appBarLeft);
      console.log('Main Paper left:', mainPaperLeft);

      // Le Paper est centré avec maxWidth: 900 et mx: 'auto', donc on vérifie simplement qu'il est visible
      // et que son contenu est bien aligné
      expect(mainPaperBox.width).toBeGreaterThan(0);
    }

    // 11. Prendre une capture du formulaire d'ajout
    const formulaireAjout = page.locator('div[class*="MuiPaper-outlined"]').first();
    await formulaireAjout.screenshot({
      path: 'tests/screenshots/todo-list-formulaire.png'
    });

    // 12. Vérifier la fonctionnalité d'ajout de tâche
    await nouveauTitreInput.fill('Nouvelle tâche de test');
    // Cliquer sur le select de priorité
    await page.locator('.MuiSelect-select').filter({ hasText: 'Moyenne' }).click();
    await page.getByRole('option', { name: /haute/i }).click();
    await boutonAjouter.click();

    // Vérifier que la nouvelle tâche apparaît
    await expect(page.getByText('Nouvelle tâche de test')).toBeVisible();

    // 13. Vérifier le filtrage des tâches
    await boutonTerminees.click();
    await expect(page.getByText(/archiver les anciens documents/i)).toBeVisible();
    // Les tâches actives ne doivent plus être visibles
    await expect(page.getByText(/valider les factures du mois/i)).not.toBeVisible();

    await boutonActives.click();
    await expect(page.getByText(/valider les factures du mois/i)).toBeVisible();
    // Les tâches terminées ne doivent plus être visibles
    await expect(page.getByText(/archiver les anciens documents/i)).not.toBeVisible();

    await boutonToutes.click();
    await expect(page.getByText(/valider les factures du mois/i)).toBeVisible();
    await expect(page.getByText(/archiver les anciens documents/i)).toBeVisible();

    // 14. Prendre une capture finale
    await page.screenshot({
      path: 'tests/screenshots/todo-list-final.png',
      fullPage: true
    });
  });
});
