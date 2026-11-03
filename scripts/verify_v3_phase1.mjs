import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772';

async function verifyV3Phase1() {
  console.log('[V3 QA] Starting Phase 1 Content & Identity Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Verify Hero Identity
  console.log('\n--- 1. VERIFY HERO IDENTITY ---');
  const heroDisplayWord = await page.locator('.hero-title').innerText();
  const heroName = await page.locator('.hero-display-name').innerText();
  const heroPill = await page.locator('.hero-role-pill').innerText();
  const manifesto = await page.locator('.hero-manifesto p').innerText();
  const timeline = await page.locator('.hero-timeline-link').innerText();

  console.log('Hero Display Word:', heroDisplayWord.trim());
  console.log('Hero Name:', heroName.trim());
  console.log('Hero Role Pill:', heroPill.trim());
  console.log('Manifesto:', manifesto.replace(/\n/g, ' '));
  console.log('Timeline Text:', timeline.replace(/\n/g, ' '));

  if (!heroDisplayWord.includes('BUILDER.')) throw new Error('Missing BUILDER. in hero display');
  if (!heroPill.includes('2016')) throw new Error('Missing 2016 in hero role pill');
  if (!manifesto.includes('intelligent systems')) throw new Error('Manifesto not updated');

  // Save Hero screenshot
  const heroShot = path.join(ARTIFACT_DIR, 'qa_v3_hero.png');
  await page.locator('#home').screenshot({ path: heroShot });
  console.log('  Saved Hero Screenshot:', heroShot);

  // 2. Verify Selected Work & Ventures (Exactly 6 Cards)
  console.log('\n--- 2. VERIFY 6 PRIMARY CARDS ---');
  const cardTitles = await page.locator('.project-card h3').allInnerTexts();
  console.log('Found Cards:', cardTitles);

  const expectedTitles = [
    'REAL ESTATE DEVELOPMENT',
    'ARKAVENA',
    'ASSET STRATEGY',
    'REAL ESTATE REWIRED',
    'REWIRED',
    'APPLIED AI & BUSINESS SYSTEMS'
  ];

  if (cardTitles.length !== 6) {
    throw new Error(`Expected exactly 6 cards, but got ${cardTitles.length}`);
  }

  for (let i = 0; i < expectedTitles.length; i++) {
    if (cardTitles[i].toUpperCase() !== expectedTitles[i].toUpperCase()) {
      throw new Error(`Card ${i + 1} mismatch: expected "${expectedTitles[i]}", got "${cardTitles[i]}"`);
    }
  }
  console.log('✓ All 6 cards match required titles and exact sequence!');

  // Save Ventures grid screenshot
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const venturesShot = path.join(ARTIFACT_DIR, 'qa_v3_ventures_6cards.png');
  await page.locator('#work').screenshot({ path: venturesShot });
  console.log('  Saved Ventures Screenshot:', venturesShot);

  // 3. Test Category Filters
  console.log('\n--- 3. TEST CATEGORY FILTERS ---');
  // Click "The Practice"
  await page.locator('.filters button:has-text("The Practice")').click();
  await page.waitForTimeout(400);
  let count = await page.locator('.project-card').count();
  console.log('Filter "The Practice" cards count:', count);
  if (count !== 3) throw new Error('Expected 3 cards for The Practice');

  // Click "The Knowledge"
  await page.locator('.filters button:has-text("The Knowledge")').click();
  await page.waitForTimeout(400);
  count = await page.locator('.project-card').count();
  console.log('Filter "The Knowledge" cards count:', count);
  if (count !== 2) throw new Error('Expected 2 cards for The Knowledge');

  // Click "The Technology"
  await page.locator('.filters button:has-text("The Technology")').click();
  await page.waitForTimeout(400);
  count = await page.locator('.project-card').count();
  console.log('Filter "The Technology" cards count:', count);
  if (count !== 1) throw new Error('Expected 1 card for The Technology');

  // Reset to "Semua"
  await page.locator('.filters button:has-text("Semua")').click();
  await page.waitForTimeout(400);

  // 4. Test Dialog for Card 06 (Applied AI & Business Systems)
  console.log('\n--- 4. TEST PROJECT DIALOG (CARD 06) ---');
  const card6Btn = page.locator('.project-card button.project-open').nth(5);
  await card6Btn.click();
  await page.waitForTimeout(600);

  const dialogTitle = await page.locator('#dialog-title').innerText();
  const dialogDesc = await page.locator('.dialog-description p').innerText();
  console.log('Dialog Title:', dialogTitle);
  console.log('Dialog Description Snippet:', dialogDesc.slice(0, 100) + '...');

  if (!dialogDesc.includes('PRAKARA OS') || !dialogDesc.includes('E.C.H.O') || !dialogDesc.includes('REWIRED Intelligence')) {
    throw new Error('Card 6 dialog missing proof points (PRAKARA OS, E.C.H.O, REWIRED Intelligence)');
  }

  const dialogShot = path.join(ARTIFACT_DIR, 'qa_v3_card6_ai_dialog.png');
  await page.screenshot({ path: dialogShot });
  console.log('  Saved Card 6 Dialog Screenshot:', dialogShot);

  // Close dialog
  await page.locator('.dialog-heading button').click();
  await page.waitForTimeout(500);

  // 5. Verify Milestones
  console.log('\n--- 5. VERIFY MILESTONES ---');
  await page.locator('#milestones').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const milestoneYears = await page.locator('.milestone-stream-card .milestone-year').allInnerTexts();
  console.log('Milestone Years:', milestoneYears);
  if (!milestoneYears[0].includes('2016')) {
    throw new Error('First milestone year should be 2016');
  }

  // 6. Smooth full page scroll & capture fullpage
  console.log('\n--- 6. FULLPAGE FLOW CAPTURE ---');
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += 350) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(800);

  const fullShot = path.join(ARTIFACT_DIR, 'qa_v3_fullpage.png');
  await page.screenshot({ path: fullShot, fullPage: true });
  console.log('  Saved Fullpage Screenshot:', fullShot);

  await browser.close();
  console.log('\n[V3 QA] ✓ PHASE 1 CONTENT & IDENTITY VERIFICATION PASSED COMPLETELY!');
}

verifyV3Phase1().catch(err => {
  console.error('[V3 QA] Verification failed:', err);
  process.exit(1);
});
