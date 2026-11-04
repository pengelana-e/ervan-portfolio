import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const distDir = path.join(process.cwd(), 'dist');

async function runDistQA() {
  console.log('[DIST QA] Starting comprehensive verification of dist/ directory...');
  const errors = [];

  // ==========================================
  // 1. AUDIT DIST FILE INTEGRITY & EXCLUSIONS
  // ==========================================
  console.log('\n--- 1. AUDIT FILES IN DIST ---');
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist!');
  }

  const forbiddenPatterns = [
    'node_modules',
    'src',
    'scripts',
    '.git',
    '.md',
    '.docx',
    '.pdf',
    'tools_scratch',
    'qa_screenshots',
    'assets-inbox',
    'audit_export'
  ];

  const distFiles = [];
  function scan(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) scan(p);
      else distFiles.push(path.relative(distDir, p));
    }
  }
  scan(distDir);
  console.log(`Found ${distFiles.length} files in dist/`);

  for (const f of distFiles) {
    for (const pat of forbiddenPatterns) {
      if (f.toLowerCase().includes(pat.toLowerCase())) {
        errors.push(`Forbidden file/path found in dist: ${f} (matches ${pat})`);
      }
    }
  }

  // Required files
  const requiredFiles = [
    'index.html',
    '_headers',
    'robots.txt',
    'sitemap.xml',
    'CNAME',
    'Asset/dist/app.js',
    'Asset/dist/app.css',
    'Asset/img/ervan-portrait.png',
    'Asset/img/favicon.svg'
  ];

  for (const req of requiredFiles) {
    const full = path.join(distDir, req);
    if (!fs.existsSync(full)) {
      errors.push(`Required production file missing in dist: ${req}`);
    } else {
      console.log(`  ✓ ${req} present (${(fs.statSync(full).size / 1024).toFixed(1)} KB)`);
    }
  }

  // ==========================================
  // 2. BROWSER AUDIT: NETWORK, CONSOLE, IMAGES
  // ==========================================
  console.log('\n--- 2. BROWSER NETWORK & CONSOLE AUDIT ---');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'small-mobile-320', width: 320, height: 568 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const pageErrors = [];
    const failed404s = [];

    page.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(`[Console Error][${vp.name}]: ${msg.text()}`);
    });

    page.on('response', res => {
      if (res.status() >= 400) failed404s.push(`[HTTP ${res.status()}][${vp.name}]: ${res.url()}`);
    });

    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Responsive horizontal overflow check
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      return { docW, winW, diff: docW - winW };
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): ScrollWidth=${overflow.docW}, WinWidth=${overflow.winW}, OverflowDiff=${overflow.diff}px`);
    if (overflow.diff > 1) {
      errors.push(`Horizontal overflow detected on ${vp.name}: ${overflow.diff}px`);
    }

    // Verify all images loaded
    const imageStatus = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      return { total: imgs.length, broken };
    });

    console.log(`  ${vp.name}: ${imageStatus.total} images on page, ${imageStatus.broken.length} broken.`);
    if (imageStatus.broken.length > 0) {
      errors.push(`Broken images on ${vp.name}: ${imageStatus.broken.join(', ')}`);
    }

    if (pageErrors.length > 0) errors.push(...pageErrors);
    if (failed404s.length > 0) errors.push(...failed404s);

    await page.close();
  }

  // ==========================================
  // 3. JAVASCRIPT, INTERACTION & SEO AUDIT (1440)
  // ==========================================
  console.log('\n--- 3. JAVASCRIPT, INTERACTION & SEO AUDIT ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // A. SEO Tags
  const seoData = await page.evaluate(() => {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content')
    };
  });
  console.log('SEO Data:', JSON.stringify(seoData, null, 2));
  if (!seoData.title.includes('Ervan Erianto')) errors.push('Title missing Ervan Erianto');
  if (seoData.canonical !== 'https://ervan.rewired.id') errors.push('Canonical mismatch');
  if (seoData.ogUrl !== 'https://ervan.rewired.id') errors.push('og:url mismatch');
  if (seoData.ogImage !== 'https://ervan.rewired.id/Asset/img/ervan-portrait.png') errors.push('og:image mismatch');

  // B. Hero Elements
  const heroData = await page.evaluate(() => {
    return {
      headline: document.querySelector('.hero-title')?.textContent?.trim(),
      name: document.querySelector('.hero-display-name')?.textContent?.trim(),
      portraitSrc: document.querySelector('.hero-portrait img')?.getAttribute('src'),
      hasMaskRect: !!document.querySelector('.hero-portrait-mask:not([style*="display: none"])')
    };
  });
  console.log('Hero Data:', heroData);
  if (heroData.headline !== 'BUILDER.') errors.push('Hero headline mismatch');
  if (!heroData.name.includes('Ervan Erianto')) errors.push('Hero name mismatch');

  // C. Dialog Open/Close
  console.log('Testing card dialog interaction...');
  const firstCard = page.locator('.project-card button.project-open').first();
  await firstCard.click();
  await page.waitForTimeout(400);
  const isDialogOpen = await page.evaluate(() => !!document.querySelector('.project-dialog'));
  console.log(`Dialog open state: ${isDialogOpen}`);
  if (!isDialogOpen) errors.push('Project dialog failed to open on card click');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // D. Motion Toggle
  console.log('Testing motion toggle...');
  const motionBtn = page.locator('.motion-toggle').first();
  await motionBtn.click();
  await page.waitForTimeout(200);
  const motionVal = await page.evaluate(() => document.documentElement.dataset.motion);
  console.log(`Motion toggle state: data-motion="${motionVal}"`);
  if (motionVal !== 'off') errors.push('Motion toggle failed to switch to off');
  await motionBtn.click(); // toggle back

  await page.close();

  // ==========================================
  // 4. VERIFY ENDPOINTS (robots, sitemap, CNAME)
  // ==========================================
  console.log('\n--- 4. STATIC ENDPOINT HTTP RESPONSES ---');
  for (const endpoint of ['/robots.txt', '/sitemap.xml', '/CNAME']) {
    const res = await fetch(`http://localhost:4173${endpoint}`);
    const text = await res.text();
    console.log(`  GET ${endpoint}: HTTP ${res.status} (${text.trim().substring(0, 40)}...)`);
    if (res.status !== 200) errors.push(`Endpoint ${endpoint} returned status ${res.status}`);
  }

  await browser.close();

  // ==========================================
  // FINAL SUMMARY
  // ==========================================
  console.log('\n==========================================');
  console.log(`DIST AUDIT FINISHED WITH ${errors.length} ERRORS.`);
  console.log('==========================================');

  if (errors.length > 0) {
    console.error('Audit Errors:\n' + errors.join('\n'));
    process.exit(1);
  }

  console.log('✓ DIST VERIFICATION 100% PASSED!');
}

runDistQA().catch(err => {
  console.error('[FATAL QA ERROR]', err);
  process.exit(1);
});
