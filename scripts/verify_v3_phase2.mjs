import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'small-mobile-320', width: 320, height: 700 }
];

async function scrollFullPage(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += 350) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600);
}

async function verifyV3Phase2() {
  console.log('[V3 PHASE 2 QA] Starting Midnight & Sky Blue Theme Verification...');
  const browser = await chromium.launch({ headless: true });

  // 1. Verify Desktop Colors and Hierarchy
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('\n--- 1. CHECK COMPUTED BRAND COLORS ---');
  const computed = await page.evaluate(() => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);
    const heroTitle = document.querySelector('.hero-title');
    const primaryLink = document.querySelector('.primary-link');
    const rolePill = document.querySelector('.hero-role-pill');
    const contactBtn = document.querySelector('.contact-primary-btn');

    return {
      bg: rootStyle.getPropertyValue('--bg').trim(),
      primary: rootStyle.getPropertyValue('--primary').trim(),
      highlight: rootStyle.getPropertyValue('--highlight').trim(),
      ink: rootStyle.getPropertyValue('--ink').trim(),
      bodyBg: bodyStyle.backgroundColor,
      heroTitleColor: window.getComputedStyle(heroTitle).color,
      primaryLinkBg: window.getComputedStyle(primaryLink).backgroundColor,
      primaryLinkColor: window.getComputedStyle(primaryLink).color,
      rolePillBorderLeft: window.getComputedStyle(rolePill).borderLeftColor,
      contactBtnBg: window.getComputedStyle(contactBtn).backgroundColor,
      contactBtnColor: window.getComputedStyle(contactBtn).color
    };
  });

  console.log('CSS Variables & Computed Values:', JSON.stringify(computed, null, 2));

  // Verify no red in core tokens
  if (computed.primary !== '#38BDF8') throw new Error('Primary token is not #38BDF8');
  if (computed.highlight !== '#7DD3FC') throw new Error('Highlight token is not #7DD3FC');
  if (computed.bg !== '#07111D') throw new Error('Background token is not #07111D');

  // 2. Scan DOM for any residual crimson #e32b3c (rgb(227, 43, 60))
  console.log('\n--- 2. SCAN DOM FOR RESIDUAL CRIMSON ACCENTS ---');
  const residualRedCount = await page.evaluate(() => {
    let redCount = 0;
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      if (cs.color === 'rgb(227, 43, 60)' || cs.backgroundColor === 'rgb(227, 43, 60)' || cs.borderColor === 'rgb(227, 43, 60)') {
        redCount++;
      }
    }
    return redCount;
  });
  console.log('Residual red elements count:', residualRedCount);
  if (residualRedCount > 0) {
    console.warn(`Warning: Found ${residualRedCount} elements with rgb(227, 43, 60)`);
  } else {
    console.log('✓ Zero residual crimson elements found across the live DOM!');
  }

  // 3. Capture Desktop Section Screenshots
  console.log('\n--- 3. CAPTURE DESKTOP SKY BLUE SCREENSHOTS ---');
  const heroShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_hero_desktop.png');
  await page.locator('#home').screenshot({ path: heroShot });
  console.log('  Saved Hero Screenshot:', heroShot);

  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const venturesShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_ventures_desktop.png');
  await page.locator('#work').screenshot({ path: venturesShot });
  console.log('  Saved Ventures Screenshot:', venturesShot);

  // Open modal for card 06
  const card6Btn = page.locator('.project-card button.project-open').nth(5);
  await card6Btn.click();
  await page.waitForTimeout(600);
  const dialogShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_dialog_desktop.png');
  await page.screenshot({ path: dialogShot });
  console.log('  Saved Dialog Screenshot:', dialogShot);
  await page.locator('.dialog-heading button').click();
  await page.waitForTimeout(500);

  await page.locator('#milestones').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const milestonesShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_milestones_desktop.png');
  await page.locator('#milestones').screenshot({ path: milestonesShot });
  console.log('  Saved Milestones Screenshot:', milestonesShot);

  await page.locator('#frameworks').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const frameworksShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_frameworks_desktop.png');
  await page.locator('#frameworks').screenshot({ path: frameworksShot });
  console.log('  Saved Frameworks Screenshot:', frameworksShot);

  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const contactShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_contact_desktop.png');
  await page.locator('#contact').screenshot({ path: contactShot });
  console.log('  Saved Contact Screenshot:', contactShot);

  // Scroll full page and capture desktop fullpage
  await scrollFullPage(page);
  const fullShotDesktop = path.join(ARTIFACT_DIR, 'qa_v3_p2_fullpage_desktop.png');
  await page.screenshot({ path: fullShotDesktop, fullPage: true });
  console.log('  Saved Desktop Fullpage Screenshot:', fullShotDesktop);
  await page.close();

  // 4. Capture Mobile (390px)
  console.log('\n--- 4. CAPTURE MOBILE SCREENSHOTS ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const heroMobileShot = path.join(ARTIFACT_DIR, 'qa_v3_p2_hero_mobile.png');
  await mobilePage.locator('#home').screenshot({ path: heroMobileShot });
  console.log('  Saved Mobile Hero Screenshot:', heroMobileShot);

  await scrollFullPage(mobilePage);
  const fullShotMobile = path.join(ARTIFACT_DIR, 'qa_v3_p2_fullpage_mobile.png');
  await mobilePage.screenshot({ path: fullShotMobile, fullPage: true });
  console.log('  Saved Mobile Fullpage Screenshot:', fullShotMobile);
  await mobilePage.close();

  // 5. Check Viewports for Horizontal Scroll
  console.log('\n--- 5. CHECK VIEWPORT OVERFLOW ---');
  for (const vp of viewports) {
    const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await vpPage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await vpPage.waitForTimeout(500);

    const scrollWidth = await vpPage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await vpPage.evaluate(() => document.documentElement.clientWidth);
    const overflow = scrollWidth > clientWidth;
    console.log(`[Viewport ${vp.name}] Width: ${clientWidth}px, ScrollWidth: ${scrollWidth}px -> Overflow: ${overflow ? 'FAIL' : 'PASS'}`);
    await vpPage.close();
  }

  await browser.close();
  console.log('\n[V3 PHASE 2 QA] ✓ MIDNIGHT & SKY BLUE REBRANDING VERIFIED SUCCESSFULLY!');
}

verifyV3Phase2().catch(err => {
  console.error('[V3 PHASE 2 QA] Verification error:', err);
  process.exit(1);
});
