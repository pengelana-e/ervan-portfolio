import { chromium } from 'playwright';

async function testSearch() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  const input = page.locator('.search-box input[type="search"]');
  console.log('Input visible:', await input.isVisible());

  // Focus and type
  await input.click();
  await input.pressSequentially('cyberpunk', { delay: 50 });
  await page.waitForTimeout(500);

  const value = await input.inputValue();
  console.log('Input value after typing:', value);

  const cards = await page.locator('.project-grid .project-card').count();
  console.log('Cards count after typing cyberpunk:', cards);

  const cardTitles = await page.locator('.project-grid .project-card h3').allTextContents();
  console.log('Card titles:', cardTitles);

  await browser.close();
}

testSearch();
