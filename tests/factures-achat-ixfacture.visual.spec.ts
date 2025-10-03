import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette FacturesAchatiXfacture
 */
test.describe('Vérification visuelle - FacturesAchatiXfacture', () => {
  test('FacturesAchatiXfacture - Vérification de l\'alignement', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/factures-achat-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/factures-achat-ixfacture-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier que la barre d'actions est présente
    const toolbar = page.locator('div[class*="MuiToolbar"]').nth(1); // Le 2ème toolbar (après l'AppBar)
    await expect(toolbar).toBeVisible();

    // Prendre une capture de la barre d'actions
    await toolbar.screenshot({
      path: 'tests/screenshots/factures-achat-ixfacture-toolbar.png'
    });

    // Vérifier que le tableau est présent
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Récupérer les positions pour vérifier l'alignement
    const appBarBox = await appBar.boundingBox();
    const toolbarBox = await toolbar.boundingBox();
    const tableContainer = page.locator('div[class*="MuiTableContainer"]');
    const tableBox = await tableContainer.boundingBox();

    if (appBarBox && toolbarBox && tableBox) {
      // Vérifier que la barre d'actions et le tableau ont le même padding horizontal que l'AppBar
      const appBarLeftPadding = appBarBox.x;
      const toolbarLeftPadding = toolbarBox.x;
      const tableLeftPadding = tableBox.x;

      console.log('AppBar left:', appBarLeftPadding);
      console.log('Toolbar left:', toolbarLeftPadding);
      console.log('Table left:', tableLeftPadding);

      // Tolérance de 5px pour les différences de padding
      expect(Math.abs(appBarLeftPadding - toolbarLeftPadding)).toBeLessThan(5);
      expect(Math.abs(appBarLeftPadding - tableLeftPadding)).toBeLessThan(5);
    }

    // Vérifier que les boutons principaux sont présents
    await expect(toolbar.getByText('Valider')).toBeVisible();
    await expect(toolbar.getByText('Refuser')).toBeVisible();
    await expect(toolbar.getByText('Transmettre')).toBeVisible();
    await expect(toolbar.getByText('Rechercher')).toBeVisible();
    await expect(toolbar.getByText('Exporter')).toBeVisible();
    await expect(toolbar.getByText('Télécharger')).toBeVisible();
    await expect(toolbar.getByText('Colonnes')).toBeVisible();
    await expect(toolbar.getByText('Réinitialiser')).toBeVisible();

    // Vérifier que le champ de recherche rapide est présent
    await expect(page.getByPlaceholder(/rechercher/i)).toBeVisible();

    // Vérifier que les colonnes spécifiques sont visibles
    await expect(page.getByText('N° Facture')).toBeVisible();
    await expect(page.getByText('Fournisseur')).toBeVisible();
    await expect(page.getByText('Statut')).toBeVisible();
  });

  test('FacturesAchatiXfacture - Vérification de la modale de détail', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/factures-achat-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Cliquer sur la première ligne du tableau pour ouvrir la modale
    const premiereFacture = page.locator('tbody tr').first();
    await premiereFacture.click();

    // Attendre que la modale soit visible
    const modale = page.locator('div[role="dialog"]');
    await expect(modale).toBeVisible();

    // Prendre une capture de la modale
    await modale.screenshot({
      path: 'tests/screenshots/factures-achat-ixfacture-modale.png'
    });

    // Vérifier que le titre de la modale est présent
    await expect(page.getByText(/Détail de la facture/i)).toBeVisible();

    // Vérifier que l'aperçu PDF est présent
    await expect(page.getByText(/Aperçu de la facture PDF/i)).toBeVisible();

    // Vérifier que l'historique est présent
    await expect(page.getByText(/Historique de la facture/i)).toBeVisible();

    // Vérifier que les métadonnées sont présentes
    await expect(page.getByText(/Métadonnées supplémentaires/i)).toBeVisible();

    // Vérifier que certains champs de métadonnées sont visibles
    await expect(page.getByText(/Centre de coût/i)).toBeVisible();
    await expect(page.getByText(/Projet/i)).toBeVisible();

    // Fermer la modale
    await page.getByRole('button', { name: /Fermer/i }).click();

    // Vérifier que la modale est fermée
    await expect(modale).not.toBeVisible();
  });
});
