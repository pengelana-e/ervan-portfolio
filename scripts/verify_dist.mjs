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
    'Asset/img/favicon.svg',
    'Asset/img/ventures/01_Real_Estate_Development.jpg',
    'Asset/img/ventures/02_Construction_Project_Management.jpg',
    'Asset/img/ventures/03_Commercial_Property_Management.jpg',
    'Asset/img/ventures/04_Writing_Publishing.jpg',
    'Asset/img/ventures/05_Education_Consulting.jpg',
    'Asset/img/ventures/06_AI_Software_Development.jpg'
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
  // 3. JAVASCRIPT, CONTENT & SEO AUDIT (1440)
  // ==========================================
  console.log('\n--- 3. JAVASCRIPT, CONTENT & SEO AUDIT ---');
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

  // C. Header & Nav Check
  const navData = await page.evaluate(() => {
    const motionBtn = document.querySelector('.motion-toggle');
    const terhubungBtn = Array.from(document.querySelectorAll('.site-header a, .site-header button')).find(el => el.textContent.includes('TERHUBUNG'));
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a')).map(a => ({
      href: a.getAttribute('href'),
      label: a.textContent.trim()
    }));
    return {
      hasMotionToggle: !!motionBtn,
      hasTerhubung: !!terhubungBtn,
      navLinks
    };
  });
  console.log('Header & Nav Data:', navData);
  if (navData.hasMotionToggle) errors.push('Visible motion toggle button should NOT exist in header');
  if (navData.hasTerhubung) errors.push('TERHUBUNG pill should NOT exist in header');
  const expectedHrefs = ['#work', '#milestones', '#about', '#contact'];
  const actualHrefs = navData.navLinks.map(n => n.href);
  for (const exp of expectedHrefs) {
    if (!actualHrefs.includes(exp)) errors.push(`Missing expected nav link: ${exp}`);
  }

  // D. Obsolete Technology Spotlight Check
  const techSectionExists = await page.evaluate(() => !!document.querySelector('#technology'));
  console.log(`Technology section exists: ${techSectionExists}`);
  if (techSectionExists) errors.push('#technology section should be removed');

  // E. Founder Section Check
  const aboutData = await page.evaluate(() => {
    const h2 = document.querySelector('#about h2')?.textContent?.trim();
    const sub = document.querySelector('#about .about-v4-subtitle')?.textContent?.trim();
    const pCount = document.querySelectorAll('#about .about-v4-paragraph').length;
    const p1 = document.querySelectorAll('#about .about-v4-paragraph')[0]?.textContent?.trim() || '';
    const p2 = document.querySelectorAll('#about .about-v4-paragraph')[1]?.textContent?.trim() || '';
    const p3 = document.querySelectorAll('#about .about-v4-paragraph')[2]?.textContent?.trim() || '';
    return { h2, sub, pCount, p1: p1.substring(0, 30), p2: p2.substring(0, 30), p3: p3.substring(0, 30) };
  });
  console.log('About / Founder Data:', aboutData);
  if (aboutData.h2 !== 'Berangkat dari Lapangan.') errors.push(`About heading mismatch: got "${aboutData.h2}"`);
  if (!aboutData.sub.includes('Property Developer')) errors.push(`About subtitle mismatch: got "${aboutData.sub}"`);
  if (aboutData.pCount !== 3) errors.push(`About paragraph count mismatch: expected 3, got ${aboutData.pCount}`);

  // F. Milestones Check
  const milestoneYears = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#milestones .milestone-v4-year')).map(el => el.textContent.trim());
  });
  console.log('Milestone Years:', milestoneYears);
  const expectedYears = ['2016', '2019', '2022', '2025', '2026'];
  if (JSON.stringify(milestoneYears) !== JSON.stringify(expectedYears)) {
    errors.push(`Milestone years mismatch: got ${JSON.stringify(milestoneYears)}, expected ${JSON.stringify(expectedYears)}`);
  }

  // G. Ventures Check
  const venturesCount = await page.evaluate(() => {
    return document.querySelectorAll('#work .project-card').length;
  });
  console.log(`Ventures count: ${venturesCount}`);
  if (venturesCount !== 6) errors.push(`Expected 6 venture cards, got ${venturesCount}`);

  // H. Dialog Open/Close
  console.log('Testing card dialog interaction...');
  const firstCard = page.locator('.project-card button.project-open').first();
  await firstCard.click();
  await page.waitForTimeout(400);
  const isDialogOpen = await page.evaluate(() => !!document.querySelector('.project-dialog'));
  console.log(`Dialog open state: ${isDialogOpen}`);
  if (!isDialogOpen) errors.push('Project dialog failed to open on card click');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

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
