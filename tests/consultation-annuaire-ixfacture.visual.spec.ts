import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette ConsultationAnnuaireIXFacture
 */
test.describe('Vérification visuelle - ConsultationAnnuaireIXFacture', () => {
  test('ConsultationAnnuaireIXFacture - Vérification de l\'alignement et des éléments principaux', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/consultation-annuaire-ixfacture-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier que la Toolbar avec les actions est présente
    const toolbar = page.locator('div[class*="MuiToolbar"]').nth(1); // Le 2ème toolbar (après l'AppBar)
    await expect(toolbar).toBeVisible();

    // Vérifier que le sélecteur de type d'annuaire est présent et que "Annuaire français" est sélectionné par défaut
    const annuaireFrancais = page.getByText('Annuaire PPF (France)');
    await expect(annuaireFrancais).toBeVisible();
    // Vérifier que le bouton parent est pressed
    const boutonFrancais = page.locator('button', { has: annuaireFrancais });
    await expect(boutonFrancais).toHaveAttribute('aria-pressed', 'true');

    const annuaireInternational = page.getByText('Annuaire Peppol (International)');
    await expect(annuaireInternational).toBeVisible();
    const boutonInternational = page.locator('button', { has: annuaireInternational });
    await expect(boutonInternational).toHaveAttribute('aria-pressed', 'false');

    // Vérifier que les boutons d'action sont présents (dans le Paper des critères)
    const boutonRechercher = page.getByRole('button', { name: /rechercher/i });
    await expect(boutonRechercher).toBeVisible();
    // Le bouton doit être désactivé au départ car aucun critère n'est saisi
    await expect(boutonRechercher).toBeDisabled();

    const boutonReinitialiser = page.getByRole('button', { name: /réinitialiser/i });
    await expect(boutonReinitialiser).toBeVisible();

    // Vérifier que les champs de recherche pour l'annuaire français sont présents
    await expect(page.getByLabel(/nom de l'entreprise/i)).toBeVisible();
    await expect(page.getByLabel(/^siren$/i)).toBeVisible();
    await expect(page.getByLabel(/^siret$/i)).toBeVisible();
    await expect(page.getByLabel(/^adresse$/i)).toBeVisible();
    await expect(page.getByLabel(/^ville$/i)).toBeVisible();
    await expect(page.getByLabel(/code postal/i)).toBeVisible();

    // Vérifier l'alignement des conteneurs principaux
    const appBarBox = await appBar.boundingBox();
    const toolbarBox = await toolbar.boundingBox();

    if (appBarBox && toolbarBox) {
      const appBarLeftPadding = appBarBox.x;
      const toolbarLeftPadding = toolbarBox.x;

      console.log('AppBar left:', appBarLeftPadding);
      console.log('Toolbar left:', toolbarLeftPadding);

      // Les deux toolbars doivent être alignés avec une tolérance de 5px
      expect(Math.abs(appBarLeftPadding - toolbarLeftPadding)).toBeLessThan(5);
    }
  });

  test('ConsultationAnnuaireIXFacture - Recherche dans l\'annuaire français', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Saisir un critère de recherche dans le champ Nom
    const champNom = page.getByLabel(/nom de l'entreprise/i);
    await champNom.fill('Entreprise test');

    // Vérifier que le bouton Rechercher est maintenant activé
    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await expect(boutonRechercher).toBeEnabled();

    // Cliquer sur le bouton Rechercher
    await boutonRechercher.click();

    // Attendre que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();

    // Prendre une capture des résultats
    await page.screenshot({
      path: 'tests/screenshots/consultation-annuaire-ixfacture-resultats-francais.png',
      fullPage: true
    });

    // Vérifier que le nombre de résultats est affiché
    await expect(page.locator('text=/\\d+ résultat/i')).toBeVisible();

    // Vérifier que le tableau est présent
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Vérifier que les colonnes spécifiques à l'annuaire français sont présentes
    await expect(page.getByRole('columnheader', { name: /^nom$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^type$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^siren$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^siret$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^adresse$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^ville$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /code postal/i })).toBeVisible();

    // Vérifier que la pagination est présente
    await expect(page.getByText(/lignes par page/i)).toBeVisible();
  });

  test('ConsultationAnnuaireIXFacture - Recherche dans l\'annuaire international', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Sélectionner l'annuaire international
    const annuaireInternational = page.getByText('Annuaire Peppol (International)');
    await annuaireInternational.click();

    // Vérifier que l'annuaire international est maintenant sélectionné
    const boutonInternational = page.locator('button', { has: annuaireInternational });
    await expect(boutonInternational).toHaveAttribute('aria-pressed', 'true');

    // Vérifier que les champs de recherche ont changé
    await expect(page.getByLabel(/nom de l'entreprise/i)).toBeVisible();
    await expect(page.getByLabel(/code adresse/i)).toBeVisible();
    await expect(page.getByLabel(/code routage/i)).toBeVisible();
    await expect(page.getByLabel(/^pays$/i)).toBeVisible();

    // Saisir un critère de recherche
    const champNom = page.getByLabel(/nom de l'entreprise/i);
    await champNom.fill('International Company');

    // Cliquer sur le bouton Rechercher
    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await boutonRechercher.click();

    // Attendre que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();

    // Prendre une capture des résultats
    await page.screenshot({
      path: 'tests/screenshots/consultation-annuaire-ixfacture-resultats-international.png',
      fullPage: true
    });

    // Vérifier que le tableau est présent
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Vérifier que les colonnes spécifiques à l'annuaire international sont présentes
    await expect(page.getByRole('columnheader', { name: /^nom$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^pays$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /adresse électronique/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^contact$/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^email$/i })).toBeVisible();
  });

  test('ConsultationAnnuaireIXFacture - Réinitialisation de la recherche', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Saisir des critères de recherche
    const champNom = page.getByLabel(/nom de l'entreprise/i);
    await champNom.fill('Test');

    const champSiren = page.getByLabel(/^siren$/i);
    await champSiren.fill('123456789');

    // Cliquer sur le bouton Rechercher
    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await boutonRechercher.click();

    // Attendre que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();

    // Cliquer sur le bouton Réinitialiser
    const boutonReinitialiser = page.getByRole('button', { name: /réinitialiser/i });
    await boutonReinitialiser.click();

    // Vérifier que les champs de recherche sont vides
    await expect(champNom).toHaveValue('');
    await expect(champSiren).toHaveValue('');

    // Vérifier que les résultats ont disparu
    await expect(page.getByText(/résultats de recherche/i)).not.toBeVisible();
  });

  test('ConsultationAnnuaireIXFacture - Vérification des multiples critères', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Saisir plusieurs critères de recherche
    await page.getByLabel(/nom de l'entreprise/i).fill('Entreprise');
    await page.getByLabel(/^siren$/i).fill('123456789');
    await page.getByLabel(/^ville$/i).fill('Paris');

    // Vérifier que le bouton Rechercher est activé
    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await expect(boutonRechercher).toBeEnabled();

    // Cliquer sur Rechercher
    await boutonRechercher.click();

    // Vérifier que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();
  });

  test('ConsultationAnnuaireIXFacture - Modale de détails annuaire français', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Effectuer une recherche
    const champNom = page.getByLabel(/nom de l'entreprise/i);
    await champNom.fill('Entreprise test');

    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await boutonRechercher.click();

    // Attendre que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();

    // Cliquer sur la première ligne du tableau
    const premiereLigne = page.locator('tbody tr').first();
    await premiereLigne.click();

    // Vérifier que la modale s'ouvre
    const modale = page.getByRole('dialog');
    await expect(modale).toBeVisible();

    // Vérifier le titre de la modale
    await expect(page.getByText('Détails de l\'entité')).toBeVisible();

    // Vérifier que les sections principales sont présentes
    await expect(page.getByText('Informations principales')).toBeVisible();
    await expect(page.getByText(/ID de l'entité/i)).toBeVisible();
    await expect(page.getByText(/^Type$/)).toBeVisible();
    await expect(page.getByText(/^SIREN$/)).toBeVisible();

    // Vérifier que la section Identifiants est présente et peut être dépliée
    const accordeonIdentifiants = page.locator('div[role="button"]', { hasText: /Identifiants/ });
    await expect(accordeonIdentifiants).toBeVisible();

    // Prendre une capture d'écran de la modale
    await page.screenshot({
      path: 'tests/screenshots/consultation-annuaire-ixfacture-modale-francais.png',
      fullPage: true
    });

    // Fermer la modale
    const boutonFermer = page.getByRole('button', { name: /fermer/i });
    await boutonFermer.click();

    // Vérifier que la modale est fermée
    await expect(modale).not.toBeVisible();
  });

  test('ConsultationAnnuaireIXFacture - Modale de détails annuaire international', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/consultation-annuaire-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Sélectionner l'annuaire international
    const annuaireInternational = page.getByText('Annuaire Peppol (International)');
    await annuaireInternational.click();

    // Effectuer une recherche
    const champNom = page.getByLabel(/nom de l'entreprise/i);
    await champNom.fill('International Company');

    const boutonRechercher = page.getByRole('button', { name: /^rechercher$/i });
    await boutonRechercher.click();

    // Attendre que les résultats s'affichent
    await expect(page.getByText(/résultats de recherche/i)).toBeVisible();

    // Cliquer sur la première ligne du tableau
    const premiereLigne = page.locator('tbody tr').first();
    await premiereLigne.click();

    // Vérifier que la modale s'ouvre
    const modale = page.getByRole('dialog');
    await expect(modale).toBeVisible();

    // Vérifier le titre de la modale
    await expect(page.getByText('Détails de l\'entité')).toBeVisible();

    // Vérifier que les sections principales sont présentes
    await expect(page.getByText('Informations principales')).toBeVisible();
    await expect(page.getByText(/^Nom$/)).toBeVisible();
    await expect(page.getByText(/^Pays$/)).toBeVisible();
    await expect(page.getByText(/Adresse électronique/i)).toBeVisible();

    // Vérifier que les sections Contacts et Documents autorisés sont présentes
    const accordeonContacts = page.locator('div[role="button"]', { hasText: /Contacts/ });
    await expect(accordeonContacts).toBeVisible();

    const accordeonDocuments = page.locator('div[role="button"]', { hasText: /Documents autorisés/ });
    await expect(accordeonDocuments).toBeVisible();

    // Prendre une capture d'écran de la modale
    await page.screenshot({
      path: 'tests/screenshots/consultation-annuaire-ixfacture-modale-international.png',
      fullPage: true
    });

    // Fermer la modale
    const boutonFermer = page.getByRole('button', { name: /fermer/i });
    await boutonFermer.click();

    // Vérifier que la modale est fermée
    await expect(modale).not.toBeVisible();
  });
});
