import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'small-mobile-320', width: 320, height: 700 }
];

async function runQA() {
  console.log('[QA] Starting visual verification across viewports...');
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // let motion settle

    // Check horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const overflow = scrollWidth > clientWidth;
    console.log(`[Viewport ${vp.name}] Width: ${clientWidth}px, ScrollWidth: ${scrollWidth}px -> Overflow: ${overflow ? 'FAIL' : 'PASS'}`);

    // Capture hero screenshot
    const heroShotPath = path.join(ARTIFACT_DIR, `qa_hero_${vp.name}.png`);
    const heroEl = await page.$('#home');
    if (heroEl) {
      await heroEl.screenshot({ path: heroShotPath });
      console.log(`  Saved hero screenshot: ${heroShotPath}`);
    }

    // Capture work section
    if (vp.name === 'desktop-1440' || vp.name === 'mobile-390') {
      const workEl = await page.$('#work');
      if (workEl) {
        const workShotPath = path.join(ARTIFACT_DIR, `qa_work_${vp.name}.png`);
        await workEl.screenshot({ path: workShotPath });
        console.log(`  Saved work screenshot: ${workShotPath}`);
      }

      const fullShotPath = path.join(ARTIFACT_DIR, `qa_fullpage_${vp.name}.png`);
      await page.screenshot({ path: fullShotPath, fullPage: true });
      console.log(`  Saved fullpage screenshot: ${fullShotPath}`);
    }

    await page.close();
  }

  // Also test interactive dialog opening
  const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await testPage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await testPage.waitForTimeout(1000);

  // Click first project card
  const firstCard = await testPage.$('.project-card button.project-open');
  if (firstCard) {
    await firstCard.click();
    await testPage.waitForTimeout(600);
    const dialogShotPath = path.join(ARTIFACT_DIR, 'qa_dialog_open.png');
    await testPage.screenshot({ path: dialogShotPath });
    console.log(`  Saved dialog screenshot: ${dialogShotPath}`);
  }

  await browser.close();
  console.log('[QA] All visual tests completed!');
}

runQA().catch(err => {
  console.error('[QA] Error:', err);
  process.exit(1);
});
