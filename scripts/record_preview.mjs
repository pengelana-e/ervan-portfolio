import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772';
const VIDEO_TMP_DIR = 'C:/Users/ervan/.gemini/antigravity/brain/f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772/video_tmp';

if (!fs.existsSync(VIDEO_TMP_DIR)) {
  fs.mkdirSync(VIDEO_TMP_DIR, { recursive: true });
}

// Clean old webm in tmp
fs.readdirSync(VIDEO_TMP_DIR).forEach(f => {
  if (f.endsWith('.webm')) fs.unlinkSync(path.join(VIDEO_TMP_DIR, f));
});

async function recordPreview() {
  console.log('[VIDEO] Starting V4 Clean Editorial video recording...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_TMP_DIR,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero mouse movement for parallax
  for (let x = 400; x <= 1000; x += 80) {
    await page.mouse.move(x, 350 + Math.sin(x / 50) * 80);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);

  // 2. Click "EXPLORE MY WORK" CTA
  const exploreBtn = await page.locator('.hero-cta-group a.primary-link').first();
  if (exploreBtn) {
    await exploreBtn.click();
    await page.waitForTimeout(1200);
  }

  // 3. Hover over cards
  const cards = await page.locator('.project-card').all();
  if (cards.length > 0) {
    await cards[0].hover();
    await page.waitForTimeout(500);
    if (cards.length > 1) {
      await cards[1].hover();
      await page.waitForTimeout(500);
    }
  }

  // 4. Open project modal
  const firstOpen = await page.locator('.project-card button.project-open').first();
  if (firstOpen) {
    await firstOpen.click();
    await page.waitForTimeout(1200);
    // Close modal
    await page.locator('.dialog-heading button').click();
    await page.waitForTimeout(600);
  }

  // 5. Scroll through Selected Milestones
  await page.locator('#milestones').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);

  // 6. Scroll through About / How I Think
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);

  // 7. Scroll through Technology Spotlight
  await page.locator('#technology').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  // 8. Scroll to Contact
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Hover over LinkedIn CTA
  const ctaBtn = await page.locator('.contact-v4-actions a.contact-primary-btn').first();
  if (ctaBtn) {
    await ctaBtn.hover();
    await page.waitForTimeout(1200);
  }

  // Close context to finish video
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded video and move to artifact dir
  const files = fs.readdirSync(VIDEO_TMP_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const srcVideo = path.join(VIDEO_TMP_DIR, files[0]);
    const destVideo = path.join(ARTIFACT_DIR, 'ervan_cinematic_walkthrough.webm');
    fs.copyFileSync(srcVideo, destVideo);
    console.log(`[VIDEO] Video walkthrough saved successfully to: ${destVideo}`);
  }
}

recordPreview().catch(err => {
  console.error('[VIDEO] Error recording:', err);
  process.exit(1);
});
