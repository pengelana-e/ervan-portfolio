import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('qa_screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runQA() {
  console.log('--- STARTING AUTONOMOUS QA SUITE ---');
  const browser = await chromium.launch();
  const consoleErrors = [];

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'small-mobile-320', width: 320, height: 568 }
  ];

  const results = {
    viewportsTested: [],
    overflowCheck: {},
    consoleErrors: [],
    interactions: {}
  };

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[Console Error] [${vp.name}]:`, msg.text());
        consoleErrors.push({ viewport: vp.name, error: msg.text() });
      }
    });

    page.on('pageerror', err => {
      console.error(`[Page Error] [${vp.name}]:`, err.message);
      consoleErrors.push({ viewport: vp.name, error: err.message });
    });

    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // Wait a brief moment for initial render
    await page.waitForTimeout(500);

    // Hero screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `hero-${vp.name}.png`)
    });

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.overflowCheck[vp.name] = !hasHorizontalOverflow;
    console.log(`[${vp.name}] Horizontal overflow check: ${!hasHorizontalOverflow ? 'PASS (No overflow)' : 'FAIL (Horizontal overflow detected)'}`);

    // Full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `fullpage-${vp.name}.png`),
      fullPage: true
    });

    results.viewportsTested.push(vp.name);
    await page.close();
  }

  // INTERACTION TESTING ON DESKTOP & MOBILE
  console.log('\n--- TESTING FUNCTIONAL INTERACTIONS ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push({ viewport: 'interaction', error: msg.text() });
  });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  // 1. Motion Toggle
  try {
    const initialMotion = await page.evaluate(() => document.documentElement.dataset.motion);
    const motionToggleBtn = page.locator('.motion-toggle').first();
    await motionToggleBtn.click();
    await page.waitForTimeout(300);
    const toggledMotion = await page.evaluate(() => document.documentElement.dataset.motion);
    await motionToggleBtn.click(); // toggle back
    await page.waitForTimeout(300);
    const restoredMotion = await page.evaluate(() => document.documentElement.dataset.motion);

    const motionPass = initialMotion === 'on' && toggledMotion === 'off' && restoredMotion === 'on';
    results.interactions['motionToggle'] = { pass: motionPass, initial: initialMotion, toggled: toggledMotion };
    console.log(`[Interaction] Motion Toggle: ${motionPass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    results.interactions['motionToggle'] = { pass: false, error: e.message };
  }

  // 2. Reading Progress Bar & Scroll Parallax
  try {
    const initialScale = await page.evaluate(() => {
      const el = document.querySelector('.reading-progress');
      return el ? window.getComputedStyle(el).transform : null;
    });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    const scrolledScale = await page.evaluate(() => {
      const el = document.querySelector('.reading-progress');
      return el ? window.getComputedStyle(el).transform : null;
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    const scrollPass = initialScale !== scrolledScale;
    results.interactions['scrollProgress'] = { pass: scrollPass };
    console.log(`[Interaction] Scroll & Reading Progress: ${scrollPass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    results.interactions['scrollProgress'] = { pass: false, error: e.message };
  }

  // 3. Category Filter
  try {
    const vfxBtn = page.locator('button.filter-btn:has-text("VFX")');
    await vfxBtn.click();
    await page.waitForTimeout(400);
    const cardsVfxCount = await page.locator('.archive-grid .project-card').count();

    const filmBtn = page.locator('button.filter-btn:has-text("Film")');
    await filmBtn.click();
    await page.waitForTimeout(400);
    const cardsFilmCount = await page.locator('.archive-grid .project-card').count();

    const allBtn = page.locator('button.filter-btn:has-text("Semua")');
    await allBtn.click();
    await page.waitForTimeout(400);
    const cardsAllCount = await page.locator('.archive-grid .project-card').count();

    const filterPass = cardsVfxCount > 0 && cardsFilmCount > 0 && cardsAllCount >= cardsVfxCount;
    results.interactions['categoryFilter'] = { pass: filterPass, vfx: cardsVfxCount, film: cardsFilmCount, all: cardsAllCount };
    console.log(`[Interaction] Category Filter: ${filterPass ? 'PASS' : 'FAIL'} (VFX: ${cardsVfxCount}, Film: ${cardsFilmCount}, Semua: ${cardsAllCount})`);
  } catch (e) {
    results.interactions['categoryFilter'] = { pass: false, error: e.message };
  }

  // 4. Search Filter
  try {
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('cyberpunk');
    await page.waitForTimeout(400);
    const searchCount = await page.locator('.archive-grid .project-card').count();
    await searchInput.fill('');
    await page.waitForTimeout(400);
    const searchResetCount = await page.locator('.archive-grid .project-card').count();

    const searchPass = searchCount >= 1 && searchResetCount > searchCount;
    results.interactions['search'] = { pass: searchPass, resultCount: searchCount };
    console.log(`[Interaction] Search functionality: ${searchPass ? 'PASS' : 'FAIL'} (Found: ${searchCount})`);
  } catch (e) {
    results.interactions['search'] = { pass: false, error: e.message };
  }

  // 5. Load More Button
  try {
    const initialVisible = await page.locator('.archive-grid .project-card').count();
    const loadMoreBtn = page.locator('.load-more-btn');
    const hasLoadMore = await loadMoreBtn.isVisible();
    let loadMorePass = false;
    if (hasLoadMore) {
      await loadMoreBtn.click();
      await page.waitForTimeout(400);
      const afterVisible = await page.locator('.archive-grid .project-card').count();
      loadMorePass = afterVisible > initialVisible;
      results.interactions['loadMore'] = { pass: loadMorePass, before: initialVisible, after: afterVisible };
      console.log(`[Interaction] Load More button: ${loadMorePass ? 'PASS' : 'FAIL'} (${initialVisible} -> ${afterVisible})`);
    } else {
      results.interactions['loadMore'] = { pass: true, note: 'All items visible' };
    }
  } catch (e) {
    results.interactions['loadMore'] = { pass: false, error: e.message };
  }

  // 6. Project Dialog Modal & Escape to close
  try {
    const firstCard = page.locator('.featured-grid .project-card button').first();
    await firstCard.click();
    await page.waitForSelector('.dialog-window', { state: 'visible', timeout: 3000 });
    const dialogOpen = await page.locator('.dialog-window').isVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dialog-open.png') });
    
    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const dialogClosed = !(await page.locator('.dialog-window').isVisible());

    const dialogPass = dialogOpen && dialogClosed;
    results.interactions['projectDialog'] = { pass: dialogPass };
    console.log(`[Interaction] Project Dialog & Escape close: ${dialogPass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    results.interactions['projectDialog'] = { pass: false, error: e.message };
  }

  // 7. Breakdown Slider
  try {
    const slider = page.locator('.comparison-stage input[type="range"]');
    if (await slider.isVisible()) {
      await slider.fill('30');
      await page.waitForTimeout(200);
      const stageStyle = await page.locator('.comparison-stage').getAttribute('style');
      const sliderPass = stageStyle && stageStyle.includes('--cut: 30%');
      results.interactions['breakdownSlider'] = { pass: Boolean(sliderPass), style: stageStyle };
      console.log(`[Interaction] Breakdown Slider: ${sliderPass ? 'PASS' : 'FAIL'} (${stageStyle})`);
    } else {
      results.interactions['breakdownSlider'] = { pass: false, note: 'Slider not visible' };
    }
  } catch (e) {
    results.interactions['breakdownSlider'] = { pass: false, error: e.message };
  }

  // 8. Experience Accordion
  try {
    const accordionBtn = page.locator('.experience-row button').nth(1);
    await accordionBtn.click();
    await page.waitForTimeout(400);
    const isOpen = await page.locator('.experience-row.is-open').count();
    const accordionPass = isOpen >= 1;
    results.interactions['experienceAccordion'] = { pass: accordionPass, openCount: isOpen };
    console.log(`[Interaction] Experience Accordion: ${accordionPass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    results.interactions['experienceAccordion'] = { pass: false, error: e.message };
  }

  // 9. Awards Expand/Collapse
  try {
    const expandBtn = page.locator('.award-expand');
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
      await page.waitForTimeout(400);
      const expandedClass = await page.locator('.recognition').getAttribute('class');
      await expandBtn.click(); // collapse back
      await page.waitForTimeout(400);
      const collapsedClass = await page.locator('.recognition').getAttribute('class');

      const awardsPass = expandedClass.includes('awards-expanded') && !collapsedClass.includes('awards-expanded');
      results.interactions['awardsExpand'] = { pass: awardsPass };
      console.log(`[Interaction] Awards Expand / Collapse: ${awardsPass ? 'PASS' : 'FAIL'}`);
    } else {
      results.interactions['awardsExpand'] = { pass: true, note: 'Awards hidden' };
    }
  } catch (e) {
    results.interactions['awardsExpand'] = { pass: false, error: e.message };
  }

  // 10. Certificate Modal
  try {
    const certBtn = page.locator('.award-proof').first();
    if (await certBtn.isVisible()) {
      await certBtn.click();
      await page.waitForSelector('.dialog-window', { state: 'visible', timeout: 3000 });
      const certModalVisible = await page.locator('.dialog-window').isVisible();
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'cert-modal.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);

      const certPass = certModalVisible;
      results.interactions['certificateModal'] = { pass: certPass };
      console.log(`[Interaction] Certificate Modal: ${certPass ? 'PASS' : 'FAIL'}`);
    } else {
      results.interactions['certificateModal'] = { pass: true, note: 'No cert button' };
    }
  } catch (e) {
    results.interactions['certificateModal'] = { pass: false, error: e.message };
  }

  // 11. Mobile Navigation
  await page.close();
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await mobilePage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    const burger = mobilePage.locator('.menu-burger');
    await burger.click();
    await mobilePage.waitForSelector('.nav-mobile', { state: 'visible', timeout: 2000 });
    const navOpen = await mobilePage.locator('.nav-mobile').isVisible();
    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-menu-open.png') });
    await burger.click();
    await mobilePage.waitForTimeout(400);
    const navClosed = !(await mobilePage.locator('.nav-mobile').isVisible());

    const mobileNavPass = navOpen && navClosed;
    results.interactions['mobileNav'] = { pass: mobileNavPass };
    console.log(`[Interaction] Mobile Navigation Drawer: ${mobileNavPass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    results.interactions['mobileNav'] = { pass: false, error: e.message };
  }
  await mobilePage.close();

  results.consoleErrors = consoleErrors;
  console.log(`\n--- QA SUMMARY: ${consoleErrors.length} Console Errors Detected ---`);
  fs.writeFileSync('qa_results.json', JSON.stringify(results, null, 2));

  await browser.close();
}

runQA();
