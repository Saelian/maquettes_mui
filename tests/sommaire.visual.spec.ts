import { test, expect } from '@playwright/test';

test.describe('Page Sommaire', () => {
  test('doit afficher correctement la page sommaire avec toutes les sections', async ({ page }) => {
    // Naviguer vers la page d'accueil (sommaire)
    await page.goto('http://localhost:5173/');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Vérifier que le titre principal est présent
    await expect(page.getByRole('heading', { name: 'Maquettes Material UI' })).toBeVisible();

    // Vérifier que la description est présente
    await expect(page.getByText('Collection de templates et maquettes pour divers produits')).toBeVisible();

    // Vérifier que le chip avec le compteur est présent
    await expect(page.locator('text=/\\d+ template.*•.*\\d+ maquette/i')).toBeVisible();

    // Vérifier que la section Templates est présente
    await expect(page.getByRole('heading', { name: 'Templates', exact: true })).toBeVisible();

    // Vérifier que la section Maquettes est présente
    await expect(page.getByRole('heading', { name: 'Maquettes', exact: true })).toBeVisible();

    // Vérifier qu'au moins une carte de template est visible
    await expect(page.getByText('UtilisateurIxBus')).toBeVisible();

    // Vérifier qu'au moins une carte de maquette est visible
    await expect(page.getByText('Tableau de bord iXfacture')).toBeVisible();

    // Prendre une capture d'écran de la page complète
    await page.screenshot({ path: 'tests/screenshots/sommaire-page-complete.png', fullPage: true });
  });

  test('doit avoir des cartes cliquables qui redirigent correctement', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Cliquer sur la première carte de template
    const templateCard = page.getByText('UtilisateurIxBus').locator('..');
    await templateCard.click();

    // Vérifier la redirection (l'URL devrait changer)
    await expect(page).toHaveURL(/\/template-utilisateur-ixbus/);

    // Revenir en arrière
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Cliquer sur une carte de maquette
    const maquetteCard = page.getByText('Tableau de bord iXfacture').first();
    await maquetteCard.click();

    // Vérifier la redirection
    await expect(page).toHaveURL(/\/tableau-de-bord-ixfacture/);
  });

  test('doit avoir un effet hover visible sur les cartes', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Trouver une carte
    const card = page.locator('div[class*="MuiCard-root"]').first();

    // Prendre une capture avant hover
    await card.screenshot({ path: 'tests/screenshots/sommaire-card-before-hover.png' });

    // Hover sur la carte
    await card.hover();

    // Attendre un peu pour l'animation
    await page.waitForTimeout(500);

    // Prendre une capture après hover
    await card.screenshot({ path: 'tests/screenshots/sommaire-card-after-hover.png' });
  });

  test('doit être responsive', async ({ page }) => {
    // Tester en mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('load');
    await page.screenshot({ path: 'tests/screenshots/sommaire-mobile.png', fullPage: true });

    // Tester en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('load');
    await page.screenshot({ path: 'tests/screenshots/sommaire-tablet.png', fullPage: true });

    // Tester en desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('load');
    await page.screenshot({ path: 'tests/screenshots/sommaire-desktop.png', fullPage: true });
  });
});
