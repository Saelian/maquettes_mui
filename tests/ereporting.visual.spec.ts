import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette EReporting
 */
test.describe('Vérification visuelle - EReporting', () => {
  test('EReporting - Vérification de l\'alignement', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/ereporting');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/ereporting-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier que le titre principal est présent
    await expect(page.getByRole('heading', { name: /Suivi des flux e-reporting/i })).toBeVisible();

    // Vérifier que le texte descriptif est présent
    await expect(page.getByText(/Consultation des flux de données transmis/i)).toBeVisible();

    // Vérifier que la section de filtres est présente
    const filtres = page.locator('div[class*="MuiPaper"]').first();
    await expect(filtres).toBeVisible();

    // Prendre une capture de la section de filtres
    await filtres.screenshot({
      path: 'tests/screenshots/ereporting-filtres.png'
    });

    // Vérifier que le champ de recherche est présent
    await expect(page.getByPlaceholder(/ID transmission, SIREN, raison sociale/i)).toBeVisible();

    // Vérifier que le sélecteur de type de flux est présent
    await expect(page.getByLabel(/Type de flux/i)).toBeVisible();

    // Vérifier que le tableau est présent
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Récupérer les positions pour vérifier l'alignement
    const appBarBox = await appBar.boundingBox();
    const tableContainer = page.locator('div[class*="MuiTableContainer"]');
    const tableBox = await tableContainer.boundingBox();

    if (appBarBox && tableBox) {
      // Vérifier que le tableau a le même padding horizontal que l'AppBar
      const appBarLeftPadding = appBarBox.x;
      const tableLeftPadding = tableBox.x;

      console.log('AppBar left:', appBarLeftPadding);
      console.log('Table left:', tableLeftPadding);

      // Tolérance de 5px pour les différences de padding
      expect(Math.abs(appBarLeftPadding - tableLeftPadding)).toBeLessThan(5);
    }

    // Vérifier que les colonnes spécifiques sont visibles dans le tableau
    await expect(table.getByRole('columnheader', { name: 'Type de flux' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Identifiant transmission' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Date/Heure' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Type transmission' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Émetteur', exact: true })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'SIREN Émetteur' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Déclarant', exact: true })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'SIREN Déclarant' })).toBeVisible();

    // Vérifier que des flux sont affichés (au moins une ligne de données)
    const lignesTableau = page.locator('tbody tr');
    await expect(lignesTableau.first()).toBeVisible();

    // Vérifier que les chips de flux sont visibles
    await expect(page.locator('span').filter({ hasText: /^Flux 10\.[1-4]$/ }).first()).toBeVisible();
  });

  test('EReporting - Vérification des filtres', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/ereporting');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Obtenir le nombre initial de flux affichés
    const compteurInitial = page.getByText(/flux affiché/i);
    await expect(compteurInitial).toBeVisible();

    // Tester le filtre par type de flux
    const selecteurTypeFlux = page.getByLabel(/Type de flux/i);
    await selecteurTypeFlux.click();

    // Sélectionner le Flux 10.1
    await page.getByText('Flux 10.1 - Données de factures B2B').click();

    // Vérifier que le compteur a changé
    await expect(compteurInitial).toBeVisible();

    // Prendre une capture avec le filtre appliqué
    await page.screenshot({
      path: 'tests/screenshots/ereporting-filtre-flux-10-1.png',
      fullPage: true
    });

    // Tester la recherche textuelle
    await page.getByPlaceholder(/ID transmission, SIREN, raison sociale/i).fill('TRANS');

    // Attendre que le tableau soit mis à jour
    await page.waitForTimeout(300);

    // Prendre une capture avec la recherche appliquée
    await page.screenshot({
      path: 'tests/screenshots/ereporting-recherche.png',
      fullPage: true
    });

    // Effacer la recherche
    await page.getByPlaceholder(/ID transmission, SIREN, raison sociale/i).clear();

    // Remettre le filtre à "Tous les flux"
    await selecteurTypeFlux.click();
    await page.getByText('Tous les flux').click();
  });

  test('EReporting - Vérification de la modale de détail', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/ereporting');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Cliquer sur le bouton "Voir le détail" de la première ligne
    const premierBoutonDetail = page.locator('button[aria-label="Voir le détail"]').first();
    await premierBoutonDetail.click();

    // Attendre que la modale soit visible
    const modale = page.locator('div[role="dialog"]');
    await expect(modale).toBeVisible();

    // Prendre une capture de la modale
    await modale.screenshot({
      path: 'tests/screenshots/ereporting-modale-detail.png'
    });

    // Vérifier que le titre de la modale est présent
    await expect(page.getByText(/Détail du flux e-reporting/i)).toBeVisible();

    // Vérifier que les sections principales sont présentes
    await expect(modale.getByText(/Informations générales/i)).toBeVisible();
    await expect(modale.getByText(/Émetteur du document/i)).toBeVisible();
    await expect(modale.getByRole('heading', { name: /Déclarant/i })).toBeVisible();

    // Vérifier que certains champs sont visibles dans la modale
    await expect(modale.locator('p').filter({ hasText: /^Type de flux$/ })).toBeVisible();
    await expect(modale.locator('p').filter({ hasText: /^Identifiant transmission$/ })).toBeVisible();
    await expect(modale.locator('p').filter({ hasText: /^Date et heure$/ })).toBeVisible();
    await expect(modale.locator('p').filter({ hasText: /^Type de transmission$/ })).toBeVisible();

    // Scroller vers le bas de la modale pour voir toutes les sections
    await modale.evaluate((el) => {
      const content = el.querySelector('[role="dialog"] > div:nth-child(2)');
      if (content) content.scrollTop = content.scrollHeight;
    });

    // Attendre un peu pour que le scroll soit effectué
    await page.waitForTimeout(300);

    // Prendre une capture de la modale scrollée
    await modale.screenshot({
      path: 'tests/screenshots/ereporting-modale-detail-scrolled.png'
    });

    // Fermer la modale
    await page.getByRole('button', { name: /Fermer/i }).click();

    // Vérifier que la modale est fermée
    await expect(modale).not.toBeVisible();
  });

  test('EReporting - Vérification de l\'interaction avec le tableau', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/ereporting');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Cliquer sur une ligne du tableau (pas sur le bouton)
    const premiereLigne = page.locator('tbody tr').first();
    await premiereLigne.click();

    // Attendre que la modale soit visible
    const modale = page.locator('div[role="dialog"]');
    await expect(modale).toBeVisible();

    // Prendre une capture
    await page.screenshot({
      path: 'tests/screenshots/ereporting-interaction-ligne.png',
      fullPage: true
    });

    // Fermer la modale
    await page.getByRole('button', { name: /Fermer/i }).click();

    // Vérifier que la modale est fermée
    await expect(modale).not.toBeVisible();
  });
});
