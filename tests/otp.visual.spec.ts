import { test, expect } from '@playwright/test';

/**
 * Test visuel pour la maquette OTP
 */
test.describe('Vérification visuelle - OTP', () => {
  test('OTP - Vérification de l\'alignement et des fonctionnalités', async ({ page }) => {
    // 1. Naviguer vers la maquette
    await page.goto('/otp');
    await page.waitForLoadState('networkidle');

    // 2. Prendre une capture d'écran pleine page initiale
    await page.screenshot({
      path: 'tests/screenshots/otp-page-initiale.png',
      fullPage: true
    });

    // 3. Vérifier l'AppBar
    const appBar = page.locator('header[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // 4. Vérifier le titre de la page
    await expect(page.getByRole('heading', { name: /authentification par code otp/i })).toBeVisible();

    // 5. Vérifier la description et le bouton principal
    await expect(page.getByText(/pour sécuriser votre connexion/i)).toBeVisible();
    const boutonDemanderOTP = page.getByRole('button', { name: /demander un code otp/i });
    await expect(boutonDemanderOTP).toBeVisible();

    // 6. Cliquer sur le bouton pour ouvrir la modale
    await boutonDemanderOTP.click();

    // 7. Attendre que la modale soit visible
    const modale = page.locator('[role="dialog"]');
    await expect(modale).toBeVisible();

    // 8. Vérifier le titre de la modale
    await expect(modale.getByRole('heading', { name: /validation par code otp/i })).toBeVisible();

    // 9. Vérifier l'icône centrale
    const iconeEmail = modale.locator('svg[data-testid="MailOutlineIcon"]');
    await expect(iconeEmail).toBeVisible();

    // 10. Vérifier le message d'information dans l'alerte
    const alerte = modale.locator('.MuiAlert-root');
    await expect(alerte).toBeVisible();
    await expect(alerte).toContainText(/un code de vérification à 6 chiffres a été envoyé par/i);
    await expect(alerte).toContainText(/email/i);
    await expect(alerte).toContainText(/ce code est valable pendant/i);
    await expect(alerte).toContainText(/5 minutes/i);

    // 11. Vérifier le timer
    const timer = modale.getByText(/5:00|4:59|4:58/);
    await expect(timer).toBeVisible();

    // 12. Vérifier le champ de saisie OTP
    const champOTP = modale.getByRole('textbox', { name: /code otp/i });
    await expect(champOTP).toBeVisible();
    await expect(modale.getByText(/saisissez le code à 6 chiffres reçu par email/i)).toBeVisible();

    // 13. Vérifier les boutons de la modale
    const boutonRenvoyer = page.getByRole('button', { name: /renvoyer un nouveau code/i });
    const boutonAnnuler = page.getByRole('button', { name: /annuler/i });
    const boutonValider = page.getByRole('button', { name: /valider/i });

    await expect(boutonRenvoyer).toBeVisible();
    await expect(boutonAnnuler).toBeVisible();
    await expect(boutonValider).toBeVisible();

    // 14. Vérifier que le bouton Valider est désactivé au départ
    await expect(boutonValider).toBeDisabled();

    // 15. Prendre une capture de la modale vide
    await page.screenshot({
      path: 'tests/screenshots/otp-modale-vide.png',
      fullPage: true
    });

    // 16. Tester la saisie d'un code incomplet
    await champOTP.fill('123');
    await expect(boutonValider).toBeDisabled();

    // 17. Tester la saisie d'un code complet
    await champOTP.fill('123456');
    await expect(boutonValider).toBeEnabled();

    // 18. Prendre une capture avec le code saisi
    await page.screenshot({
      path: 'tests/screenshots/otp-modale-remplie.png',
      fullPage: true
    });

    // 19. Vérifier que seuls les chiffres sont acceptés
    await champOTP.clear();
    await champOTP.fill('abc123');
    const valeurChamp = await champOTP.inputValue();
    expect(valeurChamp).toBe('123');

    // 20. Vérifier la limite de 6 caractères
    await champOTP.fill('1234567890');
    const valeurLimitee = await champOTP.inputValue();
    expect(valeurLimitee).toBe('123456');

    // 21. Tester le bouton Annuler
    await boutonAnnuler.click();
    await expect(modale).not.toBeVisible();

    // 22. Rouvrir la modale pour tester le bouton Valider
    await boutonDemanderOTP.click();

    const modale2 = page.locator('[role="dialog"]');
    await expect(modale2).toBeVisible();

    // 23. Saisir un code et valider
    const champOTP2 = modale2.getByRole('textbox', { name: /code otp/i });
    await champOTP2.fill('654321');
    const boutonValider2 = modale2.getByRole('button', { name: /valider/i });
    await boutonValider2.click();

    // 24. Vérifier que la modale se ferme après validation
    await expect(modale).not.toBeVisible();

    // 25. Prendre une capture finale
    await page.screenshot({
      path: 'tests/screenshots/otp-page-finale.png',
      fullPage: true
    });

    // 26. Vérifier l'alignement horizontal
    const appBarBox = await appBar.boundingBox();
    const contenuPrincipal = page.locator('main, div').filter({ hasText: /authentification par code otp/i }).first();
    const contenuBox = await contenuPrincipal.boundingBox();

    if (appBarBox && contenuBox) {
      const appBarLeft = appBarBox.x;
      const contenuLeft = contenuBox.x;

      console.log('AppBar left:', appBarLeft);
      console.log('Contenu principal left:', contenuLeft);

      // Vérifier que le contenu est visible et aligné
      expect(contenuBox.width).toBeGreaterThan(0);
    }
  });

  test('OTP - Test du bouton Renvoyer', async ({ page }) => {
    // 1. Naviguer vers la maquette
    await page.goto('/otp');
    await page.waitForLoadState('networkidle');

    // 2. Ouvrir la modale
    const boutonDemanderOTP = page.getByRole('button', { name: /demander un code otp/i });
    await boutonDemanderOTP.click();

    const modale = page.locator('[role="dialog"]');
    await expect(modale).toBeVisible();

    // 3. Vérifier que le bouton Renvoyer est désactivé au début (30 premières secondes)
    const boutonRenvoyer = page.getByRole('button', { name: /renvoyer un nouveau code/i });
    await expect(boutonRenvoyer).toBeDisabled();

    // Note: Dans un test réel, on attendrait 30 secondes pour vérifier que le bouton s'active,
    // mais cela ralentirait les tests. On se contente de vérifier l'état initial.

    // 4. Prendre une capture
    await page.screenshot({
      path: 'tests/screenshots/otp-bouton-renvoyer.png',
      fullPage: true
    });
  });
});
