import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette InterfacesIXFacture
 */
test.describe('Vérification visuelle - InterfacesIXFacture', () => {
  test('InterfacesIXFacture - Vérification de l\'alignement et des fonctionnalités', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/interfaces-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/interfaces-ixfacture-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier le titre et le sous-titre
    await expect(page.getByText('Paramétrage des interfaces')).toBeVisible();
    await expect(page.getByText("Définissez les règles métiers pour l'export des factures vers iXParapheur.")).toBeVisible();

    // Vérifier que l'onglet iXParapheur est présent et actif
    const ongletIXParapheur = page.getByRole('tab', { name: 'iXParapheur' });
    await expect(ongletIXParapheur).toBeVisible();
    await expect(ongletIXParapheur).toHaveAttribute('aria-selected', 'true');

    // Vérifier la barre d'outils des règles
    const toolbar = page.locator('div[class*="MuiToolbar"]').nth(1);
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Ajouter une règle' })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Modifier' })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Supprimer' })).toBeVisible();

    // Vérifier que le tableau des règles est présent
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.getByText('Nom de la règle')).toBeVisible();
    await expect(table.getByText('Conditions')).toBeVisible();
    await expect(table.getByText('Nature du document (iXParapheur)')).toBeVisible();
    await expect(table.getByText('Circuit de validation (iXParapheur)')).toBeVisible();

    // Prendre une capture du tableau de règles
    await table.screenshot({ path: 'tests/screenshots/interfaces-ixfacture-regles.png' });

    // Ouvrir la modale d'ajout de règle
    await toolbar.getByRole('button', { name: 'Ajouter une règle' }).click();
    const dialog = page.getByRole('dialog', { name: 'Ajouter une règle iXParapheur' });
    await expect(dialog).toBeVisible();

    // Prendre une capture de la modale
    await dialog.screenshot({ path: 'tests/screenshots/interfaces-ixfacture-dialog-ajout.png' });

    // Vérifier quelques champs dans la modale
    await expect(dialog.getByLabel('Nom de la règle')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Ajouter une condition' })).toBeVisible();
    await expect(dialog.getByText('Nature du document (iXParapheur)')).toBeVisible();
    await expect(dialog.getByText('Circuit de validation (iXParapheur)')).toBeVisible();

    // Fermer la modale
    await dialog.getByRole('button', { name: 'Annuler' }).click();
    await expect(dialog).not.toBeVisible();
  });
});
