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

async function verifyV4() {
  console.log('[V4 VERIFICATION] Starting Clean Editorial Quality Audit...');
  const browser = await chromium.launch({ headless: true });

  const errors = [];
  const failedRequests = [];

  // 1. Viewports & Overflow Check
  console.log('\n--- 1. VIEWPORT & OVERFLOW AUDIT ---');
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(`[Console Error][${vp.name}]: ${msg.text()}`);
    });

    page.on('response', res => {
      if (res.status() >= 400) failedRequests.push(`[${res.status()}][${vp.name}]: ${res.url()}`);
    });

    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to bottom
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total; y += 350) {
      await page.evaluate(t => window.scrollTo(0, t), y);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      return { docW, winW, diff: docW - winW };
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): ScrollWidth=${overflow.docW}, WinWidth=${overflow.winW}, Diff=${overflow.diff}px`);
    if (overflow.diff > 1) {
      errors.push(`Horizontal overflow on ${vp.name}: ${overflow.diff}px`);
    }

    // Check broken images
    const broken = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.complete && img.naturalWidth === 0)
        .map(img => img.src || img.getAttribute('src'));
    });
    if (broken.length > 0) {
      errors.push(`Broken images on ${vp.name}: ${broken.join(', ')}`);
    } else {
      console.log(`  ✓ All images loaded on ${vp.name}`);
    }

    // Capture Fullpage screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `qa_v4_fullpage_${vp.name}.png`), fullPage: true });
    console.log(`  Saved Fullpage: qa_v4_fullpage_${vp.name}.png`);

    if (vp.name === 'desktop-1440') {
      // Capture Desktop Sections
      await page.locator('#home').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_hero_desktop.png') });
      await page.locator('#work').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_work_desktop.png') });
      await page.locator('#milestones').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_milestones_desktop.png') });
      await page.locator('#about').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_about_desktop.png') });
      await page.locator('#technology').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_technology_desktop.png') });
      await page.locator('#contact').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_contact_desktop.png') });

      // Open Card 01 dialog
      await page.locator('.project-card button.project-open').first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_dialog_desktop.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else if (vp.name === 'mobile-390') {
      await page.locator('#home').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_hero_mobile.png') });
      await page.locator('#work').screenshot({ path: path.join(ARTIFACT_DIR, 'qa_v4_work_mobile.png') });
    }

    await page.close();
  }

  // 2. Functional & Content Integrity Verification (Desktop 1440)
  console.log('\n--- 2. CONTENT & EDITORIAL SPECIFICATION VERIFICATION ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // A. Hero Content
  const heroData = await page.evaluate(() => {
    return {
      title: document.querySelector('.hero-title')?.textContent?.trim(),
      name: document.querySelector('.hero-display-name')?.textContent?.trim(),
      profession: document.querySelector('.hero-primary-profession')?.textContent?.trim(),
      supporting: document.querySelector('.hero-supporting-identity')?.textContent?.trim(),
      manifesto: document.querySelector('.hero-manifesto-quote')?.textContent?.trim(),
      ctaText: document.querySelector('.hero-cta-group a.primary-link')?.textContent?.trim()
    };
  });
  console.log('Hero Verified Data:', JSON.stringify(heroData, null, 2));

  if (heroData.title !== 'BUILDER.') errors.push(`Hero title expected 'BUILDER.', got '${heroData.title}'`);
  if (!heroData.name.includes('Ervan Erianto')) errors.push(`Hero name missing 'Ervan Erianto'`);
  if (!heroData.profession.includes('Real Estate Developer since 2016')) errors.push(`Hero profession mismatch`);
  if (!heroData.supporting.includes('Founder · Author · Applied AI')) errors.push(`Hero supporting identity mismatch`);
  if (!heroData.ctaText.includes('EXPLORE MY WORK')) errors.push(`Hero CTA mismatch: ${heroData.ctaText}`);

  // B. Selected Work Cards Count & Order
  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.project-card')).map(c => ({
      number: c.querySelector('.project-number')?.textContent?.trim(),
      title: c.querySelector('h3')?.textContent?.trim(),
      category: c.querySelector('.project-category')?.textContent?.trim(),
      snippet: c.querySelector('.project-snippet')?.textContent?.trim()
    }));
  });
  console.log(`Found ${cards.length} cards in Selected Work:`);
  cards.forEach(c => console.log(`  ${c.number} | ${c.title} | ${c.category}`));

  if (cards.length !== 6) errors.push(`Expected exactly 6 cards, found ${cards.length}`);
  if (cards[0]?.title !== 'Real Estate Development') errors.push(`Card 1 title expected 'Real Estate Development'`);
  if (cards[1]?.title !== 'Arkavena') errors.push(`Card 2 title expected 'Arkavena'`);
  if (cards[2]?.title !== 'Asset Strategy') errors.push(`Card 3 title expected 'Asset Strategy'`);
  if (cards[3]?.title !== 'Real Estate Rewired') errors.push(`Card 4 title expected 'Real Estate Rewired'`);
  if (cards[4]?.title !== 'REWIRED') errors.push(`Card 5 title expected 'REWIRED'`);
  if (cards[5]?.title !== 'Applied AI & Business Systems') errors.push(`Card 6 title expected 'Applied AI & Business Systems'`);

  // C. Milestones Verification
  const milestones = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.milestone-v4-item')).map(m => ({
      year: m.querySelector('.milestone-v4-year')?.textContent?.trim(),
      title: m.querySelector('h3')?.textContent?.trim(),
      desc: m.querySelector('p')?.textContent?.trim()
    }));
  });
  console.log(`Found ${milestones.length} compact milestones:`);
  milestones.forEach(m => console.log(`  ${m.year}: ${m.title}`));
  if (milestones.length < 4 || milestones.length > 5) {
    errors.push(`Expected 4-5 milestones, found ${milestones.length}`);
  }

  // D. About / How I Think Principles
  const principles = await page.evaluate(() => {
    const headline = document.querySelector('#about h2')?.textContent?.trim();
    const statement = document.querySelector('.about-v4-main-statement')?.textContent?.trim();
    const items = Array.from(document.querySelectorAll('.principle-v4-card')).map(p => ({
      num: p.querySelector('.principle-v4-num')?.textContent?.trim(),
      title: p.querySelector('h4')?.textContent?.trim(),
      desc: p.querySelector('p')?.textContent?.trim()
    }));
    return { headline, statement, items };
  });
  console.log('About Principles:', JSON.stringify(principles, null, 2));
  if (!principles.headline.includes('NOT JUST WHAT I BUILD. HOW I THINK.')) {
    errors.push(`About headline mismatch`);
  }
  if (principles.items.length !== 3) {
    errors.push(`Expected 3 principles, found ${principles.items.length}`);
  }

  // E. Technology Spotlight
  const techSpotlight = await page.evaluate(() => {
    const title = document.querySelector('.tech-spotlight-content h3')?.textContent?.trim();
    const desc = document.querySelector('.tech-spotlight-desc')?.textContent?.trim();
    const supporting = document.querySelector('.tech-spotlight-supporting')?.textContent?.trim();
    return { title, desc, supporting };
  });
  console.log('Tech Spotlight:', techSpotlight);
  if (techSpotlight.title !== 'PRAKARA OS') errors.push(`Tech spotlight expected 'PRAKARA OS'`);

  // F. Motion Toggle
  const motionBtn = page.locator('.motion-toggle').first();
  await motionBtn.click();
  await page.waitForTimeout(200);
  const motionVal = await page.evaluate(() => document.documentElement.dataset.motion);
  console.log(`Motion toggle verified: data-motion="${motionVal}"`);
  if (motionVal !== 'off') errors.push('Motion toggle failed to switch to off');
  // toggle back
  await motionBtn.click();

  // Summary
  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Errors: ${errors.length}`);
  console.log(`Failed Requests: ${failedRequests.length}`);

  if (errors.length > 0) {
    console.error('Errors List:', errors);
    throw new Error(`Audit found ${errors.length} errors`);
  }
  if (failedRequests.length > 0) {
    console.error('Failed Requests List:', failedRequests);
    throw new Error(`Audit found ${failedRequests.length} failed requests`);
  }

  console.log('\n✓ ERVAN PORTFOLIO V4 VERIFICATION PASSED 100%!');

  await page.close();
  await browser.close();
}

verifyV4().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
