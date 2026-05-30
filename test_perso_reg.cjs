const { chromium } = require('playwright');

// getByRole based on text content, not accessible name
const clickBtn = async (pg, text) => {
  await pg.locator('button').filter({ hasText: text }).first().click();
  await pg.waitForTimeout(500);
};

const shot = async (pg, name) => {
  await pg.screenshot({ path: `${name}.png`, fullPage: false });
};

(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.setViewportSize({ width: 1280, height: 800 });

  await pg.goto('http://localhost:5173/auth/register');
  await pg.waitForLoadState('networkidle');

  // Particulier est le tab par défaut
  await shot(pg, 'perso_step0_identite');

  // ── Step 0 : Identité ──────────────────────────────────────────────────────
  // Validation sans données
  await clickBtn(pg, 'Continuer');
  await shot(pg, 'perso_step0_validation');

  await pg.getByPlaceholder('Jean').fill('Sophie');
  await pg.getByPlaceholder('Dupont').fill('Martin');
  await pg.getByPlaceholder('+33 6 00 00 00 00').fill('+33698765432');
  await shot(pg, 'perso_step0_filled');
  await clickBtn(pg, 'Continuer');

  // ── Step 1 : Sécurité ──────────────────────────────────────────────────────
  await shot(pg, 'perso_step1_securite');

  await pg.getByPlaceholder('vous@exemple.fr').fill('sophie.martin@exemple.fr');
  const pwds = await pg.locator('input[type="password"]').all();
  await pwds[0].fill('Pass@word123');

  // Mots de passe différents → erreur
  await pwds[1].fill('MotDePasse456');
  await clickBtn(pg, 'Continuer');
  await shot(pg, 'perso_step1_pwd_mismatch');

  // Correction
  await pwds[1].fill('Pass@word123');
  await shot(pg, 'perso_step1_filled');
  await clickBtn(pg, 'Continuer');

  // ── Step 2 : Préférences ───────────────────────────────────────────────────
  await shot(pg, 'perso_step2_prefs');

  // Sélectionner Achat + Investissement (accessible name = label + desc, utiliser hasText)
  await pg.locator('button').filter({ hasText: 'Achat' }).first().click();
  await pg.waitForTimeout(200);
  await pg.locator('button').filter({ hasText: 'Investissement' }).first().click();
  await pg.waitForTimeout(300);
  await shot(pg, 'perso_step2_selected');
  await clickBtn(pg, 'Continuer');

  // ── Step 3 : Confirmation ──────────────────────────────────────────────────
  await shot(pg, 'perso_step3_confirm');

  // Validation sans CGU/RGPD
  await clickBtn(pg, 'Créer');
  await shot(pg, 'perso_step3_validation');

  // Accepter CGU et RGPD
  const checkboxes = pg.locator('[class*="rounded-md"][class*="border-2"][class*="w-5"]');
  await checkboxes.nth(0).click();
  await pg.waitForTimeout(200);
  await checkboxes.nth(1).click();
  await pg.waitForTimeout(200);
  await shot(pg, 'perso_step3_ready');

  await br.close();
  console.log('Done ✓');
})();
