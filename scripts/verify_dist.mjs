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
  // 2. BROWSER AUDIT: 5 VIEWPORTS
  // ==========================================
  console.log('\n--- 2. BROWSER NETWORK & CONSOLE AUDIT ---');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'compact-mobile-360', width: 360, height: 800 }
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

  // A. SEO Tags & Authoritative Identity
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
  if (!seoData.title.includes('Property Developer · Author · Business Systems')) {
    errors.push(`Title missing authoritative subtitle: "${seoData.title}"`);
  }
  if (!seoData.description.includes('Property Developer · Author · Business Systems')) {
    errors.push(`Meta description missing authoritative subtitle: "${seoData.description}"`);
  }
  if (seoData.canonical !== 'https://ervan.rewired.id') errors.push('Canonical mismatch');

  // B. Hero Elements
  const heroData = await page.evaluate(() => {
    return {
      headline: document.querySelector('.hero-title')?.textContent?.trim(),
      name: document.querySelector('.hero-display-name')?.textContent?.trim(),
      primaryProf: document.querySelector('.hero-primary-profession')?.textContent?.trim(),
      supportingIdentity: document.querySelector('.hero-supporting-identity')?.textContent?.trim(),
      portraitSrc: document.querySelector('.hero-portrait img')?.getAttribute('src')
    };
  });
  console.log('Hero Data:', heroData);
  if (heroData.headline !== 'BUILDER.') errors.push('Hero headline mismatch');
  if (!heroData.name.includes('Ervan Erianto')) errors.push('Hero name mismatch');
  if (heroData.supportingIdentity !== 'Property Developer · Author · Business Systems') {
    errors.push(`Hero supporting identity mismatch: got "${heroData.supportingIdentity}"`);
  }

  // C. Header & Nav Check (Public Mode - Zero Leaks)
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
  console.log('Header & Nav Data (Public Mode):', navData);
  if (navData.hasMotionToggle) errors.push('Visible motion toggle button should NOT exist in header');
  if (navData.hasTerhubung) errors.push('TERHUBUNG pill should NOT exist in header');
  const expectedHrefs = ['#work', '#milestones', '#about', '#contact'];
  const actualHrefs = navData.navLinks.map(n => n.href);
  for (const exp of expectedHrefs) {
    if (!actualHrefs.includes(exp)) errors.push(`Missing expected nav link: ${exp}`);
  }

  // D. Public Non-leakage: Selected Work must NOT appear when zero case studies approved
  const isSelectedWorkInPublicDom = await page.evaluate(() => !!document.querySelector('#selected-work'));
  console.log(`Selected Work in Public DOM: ${isSelectedWorkInPublicDom}`);
  if (isSelectedWorkInPublicDom) {
    errors.push('Selected Work section must NOT leak into public DOM when zero studies are approved');
  }

  // E. Founder Section Check
  const aboutData = await page.evaluate(() => {
    const h2 = document.querySelector('#about h2')?.textContent?.trim();
    const sub = document.querySelector('#about .about-v4-subtitle')?.textContent?.trim();
    const pCount = document.querySelectorAll('#about .about-v4-paragraph').length;
    return { h2, sub, pCount };
  });
  console.log('About / Founder Data:', aboutData);
  if (aboutData.h2 !== 'Berangkat dari Lapangan.') errors.push(`About heading mismatch: got "${aboutData.h2}"`);
  if (aboutData.sub !== 'Property Developer · Author · Business Systems') {
    errors.push(`About subtitle mismatch: got "${aboutData.sub}"`);
  }
  if (aboutData.pCount !== 3) errors.push(`About paragraph count mismatch: expected 3, got ${aboutData.pCount}`);

  // F. Milestones Check (Exact 5 timeline entries)
  const milestoneYears = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#milestones .milestone-v4-year')).map(el => el.textContent.trim());
  });
  console.log('Milestone Years:', milestoneYears);
  const expectedYears = ['2016', '2019', '2022', '2025', '2026'];
  if (JSON.stringify(milestoneYears) !== JSON.stringify(expectedYears)) {
    errors.push(`Milestone years mismatch: got ${JSON.stringify(milestoneYears)}, expected ${JSON.stringify(expectedYears)}`);
  }

  // G. Ventures & Enhanced Detail Modal Check
  const venturesCount = await page.evaluate(() => {
    return document.querySelectorAll('#work .project-card').length;
  });
  console.log(`Ventures count: ${venturesCount}`);
  if (venturesCount !== 6) errors.push(`Expected 6 venture cards, got ${venturesCount}`);

  console.log('Testing enhanced venture dialog interaction...');
  const firstVentureCard = page.locator('.project-card button.project-open').first();
  await firstVentureCard.click();
  await page.waitForTimeout(400);

  const ventureModalData = await page.evaluate(() => {
    const dialog = document.querySelector('.project-dialog');
    if (!dialog) return null;
    const title = dialog.querySelector('#dialog-title')?.textContent?.trim();
    const role = dialog.querySelector('.venture-modal-role')?.textContent?.trim();
    const areas = Array.from(dialog.querySelectorAll('.venture-areas-list li')).map(li => li.textContent.trim());
    const initiative = dialog.querySelector('.venture-initiative-strip .strip-value')?.textContent?.trim();
    return { title, role, areasCount: areas.length, initiative };
  });
  console.log('Enhanced Venture Modal Data:', ventureModalData);
  if (!ventureModalData) errors.push('Venture dialog failed to open');
  if (!ventureModalData.role) errors.push('Venture modal missing owner role');
  if (ventureModalData.areasCount === 0) errors.push('Venture modal missing specific areas of work');
  if (!ventureModalData.initiative) errors.push('Venture modal missing related initiative');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // H. Collaboration & Contact Check
  const contactData = await page.evaluate(() => {
    const primaryBtn = document.querySelector('.contact-primary-btn.btn-discuss');
    const secondaryBtn = document.querySelector('.contact-secondary-btn.btn-linkedin');
    const roleMeta = document.querySelector('.contact-v4-meta span:last-child')?.textContent?.trim();
    return {
      primaryText: primaryBtn?.textContent?.trim(),
      primaryHref: primaryBtn?.getAttribute('href'),
      secondaryText: secondaryBtn?.textContent?.trim(),
      secondaryHref: secondaryBtn?.getAttribute('href'),
      roleMeta
    };
  });
  console.log('Contact Section Data:', contactData);
  if (!contactData.primaryText.includes('Discuss a Project')) errors.push(`Primary CTA mismatch: "${contactData.primaryText}"`);
  if (!contactData.primaryHref.includes('linkedin.com/in/ervan-erianto')) errors.push(`Primary CTA href invalid: "${contactData.primaryHref}"`);
  if (!contactData.secondaryText.includes('Connect on LinkedIn')) errors.push(`Secondary CTA mismatch: "${contactData.secondaryText}"`);
  if (!contactData.roleMeta.includes('Property Developer · Author · Business Systems')) {
    errors.push(`Contact role descriptor mismatch: "${contactData.roleMeta}"`);
  }

  // ==========================================
  // 4. DEVELOPMENT PREVIEW MODE AUDIT (?preview=selected-work)
  // ==========================================
  console.log('\n--- 4. DEVELOPMENT PREVIEW MODE AUDIT ---');
  await page.goto('http://localhost:4173?preview=selected-work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const previewNavLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.desktop-nav a')).map(a => a.textContent.trim());
  });
  console.log('Nav links in Preview Mode:', previewNavLinks);
  if (!previewNavLinks.includes('CASE STUDIES')) errors.push('CASE STUDIES nav link should appear in preview mode');

  const selectedWorkData = await page.evaluate(() => {
    const sec = document.querySelector('#selected-work');
    const cards = Array.from(document.querySelectorAll('#selected-work .case-study-card')).map(c => ({
      title: c.querySelector('.case-study-title')?.textContent?.trim(),
      category: c.querySelector('.case-study-badge-tag')?.textContent?.trim(),
      role: c.querySelector('.case-study-role')?.textContent?.trim()
    }));
    const notice = document.querySelector('.dev-preview-notice-banner')?.textContent?.trim();
    return {
      exists: !!sec,
      cardsCount: cards.length,
      cards,
      hasNotice: !!notice
    };
  });
  console.log('Selected Work (Preview Mode) Data:', selectedWorkData);
  if (!selectedWorkData.exists) errors.push('Selected Work section failed to render in preview mode');
  if (selectedWorkData.cardsCount !== 3) errors.push(`Expected 3 candidate slots, got ${selectedWorkData.cardsCount}`);
  if (!selectedWorkData.hasNotice) errors.push('Selected Work missing development preview banner');

  // Test Case Study Detail Modal
  console.log('Testing Case Study Detail Modal...');
  const firstCsCard = page.locator('#selected-work .case-study-card').first();
  await firstCsCard.locator('.case-study-cta-btn').click();
  await page.waitForTimeout(400);

  const csModalData = await page.evaluate(() => {
    const dialog = document.querySelector('.case-study-dialog');
    if (!dialog) return null;
    const title = dialog.querySelector('#case-study-dialog-title')?.textContent?.trim();
    const blocks = Array.from(dialog.querySelectorAll('.cs-narrative-block h4')).map(h => h.textContent.trim());
    const outcomes = Array.from(dialog.querySelectorAll('.cs-outcomes-list li')).map(li => li.textContent.trim());
    return { title, blocks, outcomesCount: outcomes.length };
  });
  console.log('Case Study Detail Modal Data:', csModalData);
  if (!csModalData) errors.push('Case study detail modal failed to open');
  if (!csModalData.blocks.some(b => b.includes('01 / Konteks Proyek'))) {
    errors.push('Case study narrative missing Context block');
  }
  if (!csModalData.blocks.some(b => b.includes('02 / Lingkup Tanggung Jawab'))) {
    errors.push('Case study narrative missing Scope block');
  }
  if (csModalData.outcomesCount === 0) {
    errors.push('Case study detail missing verified outcomes');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await page.close();

  // ==========================================
  // 5. STATIC ENDPOINTS (robots, sitemap, CNAME)
  // ==========================================
  console.log('\n--- 5. STATIC ENDPOINT HTTP RESPONSES ---');
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

  console.log('✓ DIST & ARCHITECTURE VERIFICATION 100% PASSED!');
}

runDistQA().catch(err => {
  console.error('[FATAL QA ERROR]', err);
  process.exit(1);
});
