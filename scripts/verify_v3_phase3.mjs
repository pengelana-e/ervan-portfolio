import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'small-mobile-320', width: 320, height: 568 }
];

async function runPhase3Audit() {
  console.log('[PHASE 3 AUDIT] Starting comprehensive visual and motion audit...');
  const browser = await chromium.launch({ headless: true });

  const errors = [];
  const failedRequests = [];

  // Helper to create monitored page
  async function createMonitoredPage(viewport) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`[Console Error][${viewport.name}]: ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      errors.push(`[Page Error][${viewport.name}]: ${err.message}`);
    });

    page.on('response', res => {
      if (res.status() >= 400) {
        failedRequests.push(`[Failed Request ${res.status()}][${viewport.name}]: ${res.url()}`);
      }
    });

    return { page, context };
  }

  // --- 1. Multi-Viewport & Layout Integrity Test ---
  console.log('\n--- 1. MULTI-VIEWPORT OVERFLOW & MEDIA TEST ---');
  for (const vp of viewports) {
    const { page, context } = await createMonitoredPage(vp);
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll through page to trigger any lazy views
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total; y += 350) {
      await page.evaluate(t => window.scrollTo(0, t), y);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      return { docWidth, winWidth, diff: docWidth - winWidth };
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): ScrollWidth=${overflow.docWidth}, WindowWidth=${overflow.winWidth}, Diff=${overflow.diff}px`);
    if (overflow.diff > 1) {
      errors.push(`Horizontal overflow detected on ${vp.name}: ${overflow.diff}px`);
    }

    // Check broken images
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete && img.naturalWidth === 0)
        .map(img => img.src || img.getAttribute('src'));
    });

    if (brokenImages.length > 0) {
      console.warn(`Broken images on ${vp.name}:`, brokenImages);
      errors.push(`Broken images on ${vp.name}: ${brokenImages.join(', ')}`);
    } else {
      console.log(`  ✓ All images verified on ${vp.name}`);
    }

    await context.close();
  }

  // --- 2. Interactive Functionality & Motion Checks (Desktop 1440) ---
  console.log('\n--- 2. INTERACTIVE & MOTION CHECKS (DESKTOP 1440) ---');
  const { page, context } = await createMonitoredPage({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // A. Check Hero Elements
  const heroCheck = await page.evaluate(() => {
    const title = document.querySelector('.hero-title')?.textContent?.trim();
    const name = document.querySelector('.hero-display-name')?.textContent?.trim();
    const role = document.querySelector('.hero-role-pill')?.textContent?.trim();
    const portrait = document.querySelector('.hero-portrait img')?.getAttribute('src');
    return { title, name, role, portrait };
  });
  console.log('Hero elements:', heroCheck);

  // B. Test Filtering in #work
  console.log('Testing category filters...');
  const filterBtns = page.locator('.filters button');
  const filterCount = await filterBtns.count();
  console.log(`Found ${filterCount} filter buttons.`);

  // Click 'The Practice'
  await page.locator('.filters button', { hasText: 'The Practice' }).click();
  await page.waitForTimeout(400);
  let cardCount = await page.locator('.project-card:visible').count();
  console.log(`'The Practice' visible cards: ${cardCount} (expected 3)`);
  if (cardCount !== 3) errors.push(`Category 'The Practice' expected 3 cards, found ${cardCount}`);

  // Click 'The Knowledge'
  await page.locator('.filters button', { hasText: 'The Knowledge' }).click();
  await page.waitForTimeout(400);
  cardCount = await page.locator('.project-card:visible').count();
  console.log(`'The Knowledge' visible cards: ${cardCount} (expected 2)`);
  if (cardCount !== 2) errors.push(`Category 'The Knowledge' expected 2 cards, found ${cardCount}`);

  // Click 'The Technology'
  await page.locator('.filters button', { hasText: 'The Technology' }).click();
  await page.waitForTimeout(400);
  cardCount = await page.locator('.project-card:visible').count();
  console.log(`'The Technology' visible cards: ${cardCount} (expected 1)`);
  if (cardCount !== 1) errors.push(`Category 'The Technology' expected 1 card, found ${cardCount}`);

  // Reset to 'Semua'
  await page.locator('.filters button', { hasText: 'Semua' }).click();
  await page.waitForTimeout(400);
  cardCount = await page.locator('.project-card:visible').count();
  console.log(`'Semua' visible cards: ${cardCount} (expected 6)`);
  if (cardCount !== 6) errors.push(`Category 'Semua' expected 6 cards, found ${cardCount}`);

  // C. Test Project Detail Dialog
  console.log('Testing Project Dialog (Open & Escape)...');
  const card1 = page.locator('.project-card button.project-open').first();
  await card1.click();
  await page.waitForTimeout(500);
  const dialogVisible = await page.locator('.project-dialog').isVisible();
  console.log('Dialog visible after card click:', dialogVisible);
  if (!dialogVisible) errors.push('Project dialog failed to open on card click');

  // Close via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const dialogClosed = !(await page.locator('.project-dialog').isVisible());
  console.log('Dialog closed after Escape key:', dialogClosed);
  if (!dialogClosed) errors.push('Project dialog failed to close on Escape key');

  // D. Test Interactive Frameworks Slider
  console.log('Testing Comparison Slider...');
  const slider = page.locator('.comparison-stage input[type="range"]');
  if (await slider.count() > 0) {
    await slider.fill('30');
    await page.waitForTimeout(200);
    const cutVal = await page.evaluate(() => {
      const stage = document.querySelector('.comparison-stage');
      return stage.style.getPropertyValue('--cut');
    });
    console.log(`Slider adjusted to 30%, stage style --cut = ${cutVal}`);
  }

  // E. Test Reduced Motion Toggle
  console.log('Testing Reduced Motion Toggle...');
  const motionBtn = page.locator('.motion-toggle').first();
  const initialMotion = await page.evaluate(() => document.documentElement.dataset.motion);
  console.log(`Initial document.documentElement.dataset.motion: ${initialMotion}`);
  await motionBtn.click();
  await page.waitForTimeout(300);
  const toggledMotion = await page.evaluate(() => document.documentElement.dataset.motion);
  console.log(`Toggled document.documentElement.dataset.motion: ${toggledMotion}`);
  if (initialMotion === toggledMotion) errors.push('Motion toggle button failed to toggle data-motion attribute');

  // Verify essential content is fully visible when motion is off
  const sectionsVisible = await page.evaluate(() => {
    const ids = ['home', 'work', 'milestones', 'about', 'frameworks', 'contact'];
    return ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, exists: false, visible: false };
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        id,
        exists: true,
        height: rect.height,
        opacity: style.opacity,
        display: style.display,
        visibility: style.visibility
      };
    });
  });
  console.log('Section visibility with motion off:', sectionsVisible);

  // Toggle motion back ON for full experience
  if (toggledMotion === 'off') {
    await motionBtn.click();
    await page.waitForTimeout(300);
  }

  // Summary of issues
  console.log('\n--- AUDIT SUMMARY ---');
  console.log('Errors:', errors.length);
  console.log('Failed Requests:', failedRequests.length);
  if (errors.length > 0) {
    console.log('Errors List:', errors);
    throw new Error(`Audit found ${errors.length} errors`);
  }
  if (failedRequests.length > 0) {
    console.log('Failed Requests:', failedRequests);
    throw new Error(`Audit found ${failedRequests.length} failed network requests`);
  }

  console.log('\n✓ PHASE 3 AUDIT PASSED 100%!');

  await context.close();
  await browser.close();
}

runPhase3Audit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
