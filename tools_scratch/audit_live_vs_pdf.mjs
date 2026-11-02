import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function audit() {
  console.log('=== AUDITING LIVE BROWSER VS PDF EXPORT ===');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Generate PDF exactly as user printed
  console.log('Generating PDF export...');
  await page.pdf({
    path: 'audit_export_before.pdf',
    format: 'A4',
    printBackground: true
  });
  console.log('Saved audit_export_before.pdf');

  // 2. Inspect print media DOM vs live DOM
  await page.emulateMedia({ media: 'print' });
  const printOpacityAudit = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, header, footer, .project-card, .breakdown, .about, .journey, .contact'));
    return sections.map(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        id: el.id || el.className,
        opacity: style.opacity,
        display: style.display,
        visibility: style.visibility,
        transform: style.transform,
        height: rect.height,
        width: rect.width
      };
    });
  });

  console.log('--- PRINT MEDIA STYLES AUDIT ---');
  printOpacityAudit.forEach(item => {
    if (item.opacity === '0' || item.height < 10) {
      console.log(`[PRINT INVISIBLE/EMPTY] ${item.id} -> opacity: ${item.opacity}, height: ${item.height}px`);
    } else {
      console.log(`[PRINT VISIBLE] ${item.id} -> opacity: ${item.opacity}, height: ${item.height}px`);
    }
  });

  // Switch back to screen
  await page.emulateMedia({ media: 'screen' });

  // 3. Inspect Live DOM & Media
  const liveAudit = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      visible: img.getBoundingClientRect().height > 0
    }));

    const mediaWrappers = Array.from(document.querySelectorAll('.media-image')).map(w => ({
      className: w.className,
      hasError: w.classList.contains('error'),
      hasLoaded: w.classList.contains('loaded'),
      isLoading: w.classList.contains('loading')
    }));

    const brandItems = Array.from(document.querySelectorAll('.brand-item')).map(b => {
      const rect = b.getBoundingClientRect();
      const img = b.querySelector('img');
      return {
        width: rect.width,
        height: rect.height,
        imgSrc: img?.src,
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight
      };
    });

    const cards = Array.from(document.querySelectorAll('.project-card')).map(c => {
      const rect = c.getBoundingClientRect();
      const style = window.getComputedStyle(c);
      return {
        title: c.querySelector('h3')?.textContent,
        opacity: style.opacity,
        height: rect.height,
        width: rect.width
      };
    });

    return {
      imagesCount: images.length,
      brokenImages: images.filter(i => i.complete && i.naturalWidth === 0),
      mediaWrappersErrorCount: mediaWrappers.filter(w => w.hasError).length,
      mediaWrappersTotal: mediaWrappers.length,
      brandItemsSample: brandItems.slice(0, 5),
      cardsCount: cards.length,
      cardsSample: cards.slice(0, 6)
    };
  });

  console.log('\n--- LIVE BROWSER MEDIA AUDIT ---');
  console.log('Total images:', liveAudit.imagesCount);
  console.log('Broken images count:', liveAudit.brokenImages.length);
  console.log('Broken images list:', liveAudit.brokenImages);
  console.log(`Media wrappers: ${liveAudit.mediaWrappersTotal} total, ${liveAudit.mediaWrappersErrorCount} in error state`);
  console.log('Brand items sample dimensions:', liveAudit.brandItemsSample);
  console.log('Cards count:', liveAudit.cardsCount);
  console.log('Cards sample:', liveAudit.cardsSample);
  console.log('Failed network requests:', failedRequests);

  await browser.close();
}

audit();
