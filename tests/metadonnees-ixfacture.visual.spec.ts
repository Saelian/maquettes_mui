import { test, expect } from '@playwright/test';

/**
 * Test visuel pour vérifier l'alignement et l'apparence de la maquette MetadonneesIXFacture
 */
test.describe('Vérification visuelle - MetadonneesIXFacture', () => {
  test('MetadonneesIXFacture - Vérification de l\'alignement et des fonctionnalités', async ({ page }) => {
    // Naviguer vers la maquette
    await page.goto('/metadonnees-ixfacture');

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    // Prendre une capture d'écran pleine page
    await page.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-full.png',
      fullPage: true
    });

    // Vérifier que l'AppBar est présente
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Vérifier que le titre et sous-titre sont affichés
    await expect(page.getByText('Paramétrage des métadonnées factures')).toBeVisible();
    await expect(page.getByText('Définissez ici les champs personnalisés')).toBeVisible();

    // Vérifier que le tableau est présent
    const tableau = page.locator('table');
    await expect(tableau).toBeVisible();

    // Vérifier les en-têtes du tableau
    await expect(page.getByRole('columnheader', { name: 'Nom du champ' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Code technique' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type de donnée' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Obligatoire' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Visibilité' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Ordre' })).toBeVisible();

    // Vérifier la présence du champ de recherche
    const champRecherche = page.getByPlaceholder('Rechercher...');
    await expect(champRecherche).toBeVisible();

    // Vérifier la présence des boutons d'action principaux
    const boutonAjouter = page.getByRole('button', { name: /ajouter/i });
    const boutonModifier = page.getByRole('button', { name: /modifier/i });
    const boutonSupprimer = page.getByRole('button', { name: /supprimer/i });
    await expect(boutonAjouter).toBeVisible();
    await expect(boutonModifier).toBeVisible();
    await expect(boutonSupprimer).toBeVisible();

    // Vérifier qu'il y a au moins 4 boutons dans la toolbar (Ajouter, Modifier, Supprimer, Prévisualiser)
    const boutons = page.locator('button:visible');
    const nombreBoutons = await boutons.count();
    expect(nombreBoutons).toBeGreaterThanOrEqual(4);

    // Vérifier que des métadonnées de démonstration sont affichées
    await expect(page.getByText('Code projet')).toBeVisible();
    await expect(page.getByText('Commentaire interne')).toBeVisible();
    await expect(page.getByText('Date de validation')).toBeVisible();

    // Récupérer les positions pour vérifier l'alignement
    const appBarBox = await appBar.boundingBox();
    const tableauContainer = page.locator('div[class*="MuiPaper"]').filter({ has: page.locator('table') }).first();
    const tableauBox = await tableauContainer.boundingBox();

    if (appBarBox && tableauBox) {
      const appBarLeftPadding = appBarBox.x;
      const tableauLeftPadding = tableauBox.x;

      console.log('AppBar left:', appBarLeftPadding);
      console.log('Tableau container left:', tableauLeftPadding);

      // Tolérance de 5px pour les différences de padding
      expect(Math.abs(appBarLeftPadding - tableauLeftPadding)).toBeLessThan(5);
    }

    // Test de la fenêtre d'ajout de métadonnée
    await boutonAjouter.click();
    await page.waitForTimeout(300); // Attendre l'animation du dialog

    // Vérifier que le dialog est ouvert
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Ajouter une métadonnée' })).toBeVisible();

    // Prendre une capture du dialog d'ajout
    await dialog.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-dialog-ajout.png'
    });

    // Vérifier les champs du formulaire dans le dialog
    await expect(dialog.getByText('Nom du champ')).toBeVisible();
    await expect(dialog.getByText('Code technique')).toBeVisible();
    await expect(dialog.getByText('Type de donnée')).toBeVisible();
    await expect(dialog.getByText('Champ obligatoire')).toBeVisible();
    await expect(dialog.getByText('Visible sur')).toBeVisible();
    await expect(dialog.getByText('Factures entrantes')).toBeVisible();
    await expect(dialog.getByText('Factures sortantes')).toBeVisible();
    await expect(dialog.getByText('Ordre d\'affichage')).toBeVisible();

    // Fermer le dialog
    const boutonAnnuler = page.getByRole('button', { name: 'Annuler' });
    await boutonAnnuler.click();
    await page.waitForTimeout(300);

    // Vérifier que le dialog est fermé
    await expect(dialog).not.toBeVisible();

    // Test de la prévisualisation utilisateur - chercher le bouton par son texte visible
    const boutonPrevisualiser = page.locator('button:has-text("Prévisualiser")');
    await boutonPrevisualiser.click();
    await page.waitForTimeout(300);

    // Vérifier que le dialog de prévisualisation est ouvert
    const dialogPreview = page.locator('div[role="dialog"]');
    await expect(dialogPreview).toBeVisible();
    await expect(dialogPreview.getByRole('heading', { name: 'Prévisualisation - Vue utilisateur' })).toBeVisible();

    // Prendre une capture du dialog de prévisualisation
    await dialogPreview.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-preview.png'
    });

    // Vérifier que les métadonnées apparaissent dans la preview
    await expect(dialogPreview.getByText('Code projet')).toBeVisible();
    await expect(dialogPreview.getByText('Commentaire interne')).toBeVisible();

    // Fermer le dialog de prévisualisation
    const boutonFermer = page.getByRole('button', { name: 'Fermer' });
    await boutonFermer.click();
    await page.waitForTimeout(300);

    // Test de la recherche
    await champRecherche.fill('projet');
    await page.waitForTimeout(300);

    // Vérifier que le filtrage fonctionne
    await expect(page.getByText('Code projet')).toBeVisible();
    // Les autres éléments ne contenant pas "projet" ne devraient plus être visibles dans le contexte de recherche

    // Prendre une capture avec filtre de recherche
    await page.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-recherche.png',
      fullPage: true
    });

    // Réinitialiser la recherche
    await champRecherche.fill('');
    await page.waitForTimeout(300);

    // Vérifier l'alignement final
    const tableauFinal = page.locator('div[class*="MuiPaper"]').filter({ has: page.locator('table') }).first();
    const tableauFinalBox = await tableauFinal.boundingBox();

    if (appBarBox && tableauFinalBox) {
      console.log('Alignement final vérifié');
      expect(Math.abs(appBarBox.x - tableauFinalBox.x)).toBeLessThan(5);
    }

    // TEST DE L'ONGLET RÈGLES DE CALCUL
    // Cliquer sur l'onglet Règles de calcul
    const ongletRegles = page.getByRole('tab', { name: 'Règles de calcul' });
    await expect(ongletRegles).toBeVisible();
    await ongletRegles.click();
    await page.waitForTimeout(300);

    // Prendre une capture de l'onglet règles
    await page.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-regles.png',
      fullPage: true
    });

    // Vérifier que le tableau des règles est visible
    const tableauRegles = page.locator('table');
    await expect(tableauRegles).toBeVisible();

    // Vérifier les en-têtes du tableau des règles
    await expect(page.getByRole('columnheader', { name: 'Nom de la règle' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Conditions' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Ordre' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'État' })).toBeVisible();

    // Vérifier les boutons d'action pour les règles
    const boutonAjouterRegle = page.getByRole('button', { name: /ajouter une règle/i });
    await expect(boutonAjouterRegle).toBeVisible();

    // Vérifier que les règles de démonstration sont affichées
    await expect(page.getByText('Affectation service DSI')).toBeVisible();
    await expect(page.getByText('Validation automatique petits montants')).toBeVisible();

    // Test de l'ouverture du dialog de création de règle
    await boutonAjouterRegle.click();
    await page.waitForTimeout(300);

    // Vérifier que le dialog est ouvert
    const dialogRegle = page.locator('div[role="dialog"]');
    await expect(dialogRegle).toBeVisible();
    await expect(dialogRegle.getByRole('heading', { name: 'Ajouter une règle' })).toBeVisible();

    // Vérifier les sections du formulaire
    await expect(dialogRegle.getByText('Conditions (SI)')).toBeVisible();
    await expect(dialogRegle.getByText('Actions (ALORS)')).toBeVisible();
    await expect(dialogRegle.getByText('Options avancées')).toBeVisible();

    // Prendre une capture du dialog de règle
    await dialogRegle.screenshot({
      path: 'tests/screenshots/metadonnees-ixfacture-dialog-regle.png'
    });

    // Fermer le dialog
    const boutonAnnulerRegle = dialogRegle.getByRole('button', { name: 'Annuler' });
    await boutonAnnulerRegle.click();
    await page.waitForTimeout(300);

    // Vérifier que le dialog est fermé
    await expect(dialogRegle).not.toBeVisible();

    console.log('Tests de l\'onglet règles complétés');
  });
});
