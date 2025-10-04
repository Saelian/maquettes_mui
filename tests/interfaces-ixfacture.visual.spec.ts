import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette InterfacesIXFacture
 */
test.describe('Vérification visuelle - InterfacesIXFacture', () => {
  test('InterfacesIXFacture - Vérification de l\'alignement et des onglets', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/interfaces-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page (onglet PISTE par défaut)
    await page.screenshot({
      path: 'tests/screenshots/interfaces-ixfacture-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier que le titre et sous-titre sont affichés
    await expect(page.getByText('Configuration iXFacture')).toBeVisible();
    await expect(page.getByText('Interfaces API - Facturation électronique 2026')).toBeVisible();

    // Vérifier que les onglets sont présents
    const ongletPiste = page.getByRole('tab', { name: 'PISTE / Chorus Pro' });
    const ongletPlateforme = page.getByRole('tab', { name: 'Plateforme Agréée' });
    await expect(ongletPiste).toBeVisible();
    await expect(ongletPlateforme).toBeVisible();

    // ONGLET 1 : PISTE / Chorus Pro (actif par défaut)
    const cardPiste = page.locator('div[class*="MuiCard"]').filter({ hasText: 'Interface PISTE / Chorus Pro' }).first();
    await expect(cardPiste).toBeVisible();

    // Prendre une capture de la carte PISTE
    await cardPiste.screenshot({
      path: 'tests/screenshots/interfaces-ixfacture-piste.png'
    });

    // Récupérer les positions pour vérifier l'alignement
    const appBarBox = await appBar.boundingBox();
    const cardPisteBox = await cardPiste.boundingBox();

    if (appBarBox && cardPisteBox) {
      const appBarLeftPadding = appBarBox.x;
      const cardPisteLeftPadding = cardPisteBox.x;

      console.log('AppBar left:', appBarLeftPadding);
      console.log('Card PISTE left:', cardPisteLeftPadding);

      // Tolérance de 5px pour les différences de padding
      expect(Math.abs(appBarLeftPadding - cardPisteLeftPadding)).toBeLessThan(5);
    }

    // Vérifier les champs de la carte PISTE / Chorus Pro
    await expect(page.getByLabel("Nom de l'interface").first()).toBeVisible();
    await expect(page.locator('label:has-text("Type de plateforme")').first()).toBeVisible();
    await expect(page.locator('label:has-text("Environnement")').first()).toBeVisible();
    await expect(page.getByLabel('Structure (SIRET)')).toBeVisible();
    await expect(page.getByLabel("Nom de l'application PISTE")).toBeVisible();
    await expect(page.getByLabel('Client ID (OAuth2)').first()).toBeVisible();
    await expect(page.getByLabel('Client Secret (OAuth2)').first()).toBeVisible();
    await expect(page.getByLabel('Authorization Endpoint URL')).toBeVisible();
    await expect(page.getByLabel('Token Endpoint URL').first()).toBeVisible();
    await expect(page.getByLabel('Redirect URI(s)').first()).toBeVisible();
    await expect(page.getByLabel('Scopes').first()).toBeVisible();
    await expect(page.getByLabel('Grant type(s)').first()).toBeVisible();
    await expect(page.getByLabel('Refresh Token').first()).toBeVisible();

    // Vérifier les boutons de la carte PISTE
    const boutonEnregistrerPiste = cardPiste.getByRole('button', { name: 'Enregistrer' });
    const boutonTesterPiste = cardPiste.getByRole('button', { name: 'Tester la connexion' });
    await expect(boutonEnregistrerPiste).toBeVisible();
    await expect(boutonTesterPiste).toBeVisible();

    // ONGLET 2 : Plateforme Agréée
    // Cliquer sur l'onglet Plateforme Agréée
    await ongletPlateforme.click();
    await page.waitForTimeout(300); // Attendre l'animation de changement d'onglet

    // Vérifier que la carte Plateforme est visible
    const cardPlateforme = page.locator('div[class*="MuiCard"]').filter({ hasText: 'Interface Plateforme agréée' }).first();
    await expect(cardPlateforme).toBeVisible();

    // Prendre une capture de la carte Plateforme agréée
    await cardPlateforme.screenshot({
      path: 'tests/screenshots/interfaces-ixfacture-plateforme.png'
    });

    // Vérifier l'alignement de la carte Plateforme
    const cardPlateformeBox = await cardPlateforme.boundingBox();
    if (appBarBox && cardPlateformeBox) {
      const cardPlateformeLeftPadding = cardPlateformeBox.x;
      console.log('Card Plateforme left:', cardPlateformeLeftPadding);

      // Tolérance de 5px pour les différences de padding
      expect(Math.abs(appBarBox.x - cardPlateformeLeftPadding)).toBeLessThan(5);
    }

    // Vérifier les champs de la carte Plateforme agréée
    await expect(page.getByLabel("Nom de l'interface").first()).toBeVisible();
    await expect(page.locator('label:has-text("Environnement")').first()).toBeVisible();
    await expect(page.getByLabel('Client ID (OAuth2)').first()).toBeVisible();
    await expect(page.getByLabel('Client Secret (OAuth2)').first()).toBeVisible();
    await expect(page.getByLabel('Authorization Server URL')).toBeVisible();
    await expect(page.getByLabel('Token Endpoint URL').first()).toBeVisible();
    await expect(page.getByLabel('Redirect URI(s)').first()).toBeVisible();
    await expect(page.getByLabel('Scopes API')).toBeVisible();
    await expect(page.getByLabel('Grant type(s)').first()).toBeVisible();
    await expect(page.getByLabel('Refresh Token').first()).toBeVisible();

    // Vérifier les boutons de la carte Plateforme
    const boutonEnregistrerPlateforme = cardPlateforme.getByRole('button', { name: 'Enregistrer' });
    const boutonTesterPlateforme = cardPlateforme.getByRole('button', { name: 'Tester la connexion' });
    await expect(boutonEnregistrerPlateforme).toBeVisible();
    await expect(boutonTesterPlateforme).toBeVisible();
  });
});
