import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const RECOVERY_DIR = path.resolve('recovery_screenshots');
fs.mkdirSync(RECOVERY_DIR, { recursive: true });

async function verify() {
  console.log('=== VERIFYING RECOVERY IN PLAYWRIGHT ===');
  const browser = await chromium.launch();
  
  // 1. DESKTOP 1440x900
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Measure Hero & elements
  const heroMetrics = await page.evaluate(() => {
    const hero = document.getElementById('home');
    const portrait = document.querySelector('.hero-portrait img');
    const title = document.querySelector('.hero-title');
    const intro = document.querySelector('.hero-intro');
    const side = document.querySelector('.hero-side');
    const bottom = document.querySelector('.hero-bottom');
    return {
      heroHeight: hero?.getBoundingClientRect().height,
      portraitVisible: portrait?.complete && portrait?.naturalWidth > 0,
      portraitSrc: portrait?.src,
      titleText: title?.textContent,
      introVisible: intro?.getBoundingClientRect().height > 0,
      sideVisible: side?.getBoundingClientRect().height > 0,
      bottomVisible: bottom?.getBoundingClientRect().height > 0
    };
  });
  console.log('Hero metrics:', heroMetrics);

  // Capture hero screenshot
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'hero-desktop-1440.png') });

  // Scroll down to Portfolio
  await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView());
  await page.waitForTimeout(600);

  const portfolioMetrics = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const brands = Array.from(document.querySelectorAll('.brand-logo'));
    return {
      cardsCount: cards.length,
      firstCardWidth: cards[0]?.getBoundingClientRect().width,
      firstCardHeight: cards[0]?.getBoundingClientRect().height,
      secondCardWidth: cards[1]?.getBoundingClientRect().width,
      secondCardHeight: cards[1]?.getBoundingClientRect().height,
      firstCardOpacity: window.getComputedStyle(cards[0]).opacity,
      brandsCount: brands.length,
      firstBrandWidth: brands[0]?.getBoundingClientRect().width,
      firstBrandHeight: brands[0]?.getBoundingClientRect().height
    };
  });
  console.log('Portfolio metrics:', portfolioMetrics);

  await page.screenshot({ path: path.join(RECOVERY_DIR, 'portfolio-desktop-1440.png') });

  // Scroll down to Brand strip
  await page.evaluate(() => document.querySelector('.brand-section')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'brands-desktop-1440.png') });

  // Scroll down to Breakdown
  await page.evaluate(() => document.querySelector('.breakdown')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'breakdown-desktop-1440.png') });

  // Scroll down to About
  await page.evaluate(() => document.getElementById('about')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'about-desktop-1440.png') });

  // Scroll down to Journey
  await page.evaluate(() => document.getElementById('experience')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'journey-desktop-1440.png') });

  // Scroll down to Contact & Footer
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'contact-desktop-1440.png') });

  // Full page screenshot desktop 1440
  await page.screenshot({ path: path.join(RECOVERY_DIR, 'fullpage-desktop-1440.png'), fullPage: true });

  // 2. DESKTOP 1920x1080
  const page1920 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page1920.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page1920.waitForTimeout(800);
  await page1920.screenshot({ path: path.join(RECOVERY_DIR, 'hero-desktop-1920.png') });
  await page1920.screenshot({ path: path.join(RECOVERY_DIR, 'fullpage-desktop-1920.png'), fullPage: true });
  await page1920.close();

  // 3. TABLET 768x1024
  const pageTablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await pageTablet.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(800);
  await pageTablet.screenshot({ path: path.join(RECOVERY_DIR, 'hero-tablet-768.png') });
  await pageTablet.screenshot({ path: path.join(RECOVERY_DIR, 'fullpage-tablet-768.png'), fullPage: true });
  await pageTablet.close();

  // 4. MOBILE 390x844
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMobile.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(800);
  await pageMobile.screenshot({ path: path.join(RECOVERY_DIR, 'hero-mobile-390.png') });
  await pageMobile.screenshot({ path: path.join(RECOVERY_DIR, 'fullpage-mobile-390.png'), fullPage: true });
  await pageMobile.close();

  // 5. TEST PDF EXPORT (AFTER FIX)
  console.log('Generating updated PDF export...');
  await page.pdf({
    path: 'audit_export_after.pdf',
    format: 'A4',
    printBackground: true
  });
  console.log('Saved audit_export_after.pdf');

  // Audit print media DOM
  await page.emulateMedia({ media: 'print' });
  const printAudit = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const opacities = cards.map(c => window.getComputedStyle(c).opacity);
    return {
      cardsCount: cards.length,
      allCardsVisibleInPrint: opacities.every(o => o === '1'),
      firstCardHeight: cards[0]?.getBoundingClientRect().height,
      firstBrandHeight: document.querySelector('.brand-logo')?.getBoundingClientRect().height
    };
  });
  console.log('Print media audit after fix:', printAudit);

  console.log('Errors caught during verification:', errors);
  await browser.close();
}

verify();
