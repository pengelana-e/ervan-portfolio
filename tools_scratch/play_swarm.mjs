import { chromium } from 'playwright';
import path from 'path';

async function playSwarm() {
  console.log('Testing optional Swarm Rebuild animation in Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  // Evaluate the one-line swarm injection
  await page.evaluate(() => {
    const s = document.createElement('script');
    s.src = 'https://www.duingzforge.site/kit/portfolio/swarm-play.js';
    document.head.appendChild(s);
  });

  console.log('Swarm script injected into running browser page.');
  // Wait 3 seconds to let animation initialize and capture a screenshot
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.resolve('qa_screenshots/swarm-animation-sample.png') });
  console.log('Captured swarm animation preview screenshot.');

  await browser.close();
}

playSwarm();
