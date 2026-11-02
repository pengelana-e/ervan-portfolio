import { chromium } from 'playwright';

async function test() {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent('<h1>Test</h1>');
    console.log('Playwright Chromium launched and rendered successfully!');
    await browser.close();
  } catch (err) {
    console.error('Playwright launch error:', err.message);
  }
}
test();
