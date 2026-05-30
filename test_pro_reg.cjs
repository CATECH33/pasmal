const { chromium } = require('playwright');
const { writeFileSync, unlinkSync } = require('fs');
const path = require('path');

// ── Temp test files ───────────────────────────────────────────────────────────
const PDF_PATH = path.join(__dirname, '__test_kbis.pdf');
const PNG_PATH = path.join(__dirname, '__test_id.png');

// Minimal valid PDF 1.4
writeFileSync(PDF_PATH, Buffer.from(
  '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n' +
  'xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n' +
  '0000000058 00000 n \n0000000115 00000 n \n' +
  'trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n173\n%%EOF\n'
));

// Minimal valid 1×1 white PNG
writeFileSync(PNG_PATH, Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108020000009001' +
  '2e0000000c4944415408d76360f8cf00000000ffff03000001e20057',
  'hex'
));

// ── Helpers ───────────────────────────────────────────────────────────────────
const click = async (pg, label) => {
  await pg.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
  await pg.waitForTimeout(500);
};

const shot = async (pg, name) => {
  await pg.screenshot({ path: `${name}.png`, fullPage: false });
};

// ── Test ──────────────────────────────────────────────────────────────────────
(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.setViewportSize({ width: 1280, height: 800 });

  await pg.goto('http://localhost:5173/auth/register');
  await pg.waitForLoadState('networkidle');

  // ── Switch to Pro tab ──────────────────────────────────────────────────────
  await pg.getByRole('button', { name: 'Professionnel' }).first().click();
  await pg.waitForTimeout(500);
  await shot(pg, 'pro_step0_entreprise');

  // ── Step 0 : Entreprise ────────────────────────────────────────────────────
  await pg.getByPlaceholder('Immobilier & Co.').fill('Agence Lumière');
  await pg.getByPlaceholder('362 521 879 00034').fill('36252187900034');
  await pg.getByPlaceholder('12 rue de la Paix').fill('10 Avenue Montaigne');
  await pg.getByPlaceholder('Paris').fill('Paris');
  await pg.getByPlaceholder('75001').fill('75008');
  await pg.getByRole('button', { name: 'Agence' }).click();
  await shot(pg, 'pro_step0_filled');
  await click(pg, 'continuer');

  // ── Step 1 : Contact ───────────────────────────────────────────────────────
  await shot(pg, 'pro_step1_contact');
  await pg.getByPlaceholder('Jean').fill('Marie');
  await pg.getByPlaceholder('Dupont').fill('Lambert');
  await pg.getByPlaceholder('contact@agence.fr').fill('marie@agence-lumiere.fr');
  await pg.getByPlaceholder('+33 1 00 00 00 00').fill('+33612345678');
  const pwds = await pg.locator('input[type="password"]').all();
  await pwds[0].fill('Pass@word123');
  await pwds[1].fill('Pass@word123');
  await shot(pg, 'pro_step1_filled');
  await click(pg, 'continuer');

  // ── Step 2 : Médias (optionnel, on passe) ──────────────────────────────────
  await shot(pg, 'pro_step2_medias');
  await click(pg, 'continuer');

  // ── Step 3 : Documents ─────────────────────────────────────────────────────
  await shot(pg, 'pro_step3_documents');

  // Validation sans fichiers
  await click(pg, 'continuer');
  await shot(pg, 'pro_step3_validation');

  // Upload Kbis (premier input[type="file"])
  await pg.locator('input[type="file"]').nth(0).setInputFiles(PDF_PATH);
  await pg.waitForTimeout(300);
  // Upload pièce d'identité (deuxième input)
  await pg.locator('input[type="file"]').nth(1).setInputFiles(PNG_PATH);
  await pg.waitForTimeout(300);
  await shot(pg, 'pro_step3_uploaded');
  await click(pg, 'continuer');

  // ── Step 4 : Paramètres ────────────────────────────────────────────────────
  await shot(pg, 'pro_step4_params');

  // Validation URL invalide
  await pg.getByPlaceholder('https://mon-agence.fr').fill('not-a-url');
  await click(pg, 'continuer');
  await shot(pg, 'pro_step4_url_error');

  // Corriger l'URL
  await pg.getByPlaceholder('https://mon-agence.fr').fill('https://agence-lumiere.fr');

  // Activer les toggles (phone visible + WhatsApp)
  await pg.getByRole('button', { name: /Afficher mon téléphone/i }).click();
  await pg.waitForTimeout(200);
  await pg.getByRole('button', { name: /Activer le contact WhatsApp/i }).click();
  await pg.waitForTimeout(200);
  await shot(pg, 'pro_step4_filled');
  await click(pg, 'continuer');

  // ── Step 5 : Vérification ──────────────────────────────────────────────────
  await shot(pg, 'pro_step5_verification');

  // Validation sans CGU/RGPD
  await click(pg, 'soumettre');
  await shot(pg, 'pro_step5_validation');

  // Accepter CGU et RGPD (chaque Checkbox est une div cliquable)
  const checkboxes = pg.locator('[class*="rounded-md"][class*="border-2"][class*="w-5"]');
  await checkboxes.nth(0).click();
  await pg.waitForTimeout(200);
  await checkboxes.nth(1).click();
  await pg.waitForTimeout(200);
  await shot(pg, 'pro_step5_ready');

  await br.close();

  // Nettoyage fichiers temporaires
  try { unlinkSync(PDF_PATH); } catch {}
  try { unlinkSync(PNG_PATH); } catch {}

  console.log('Done ✓');
})();
