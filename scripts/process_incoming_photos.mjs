import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { execSync } from 'child_process';

const inboxDir = path.resolve('assets-inbox/ervan-photos');
const outputDir = path.resolve('Asset/img');
const destPortrait = path.join(outputDir, 'ervan-portrait.png');

async function processPhotos() {
  if (!fs.existsSync(inboxDir)) {
    fs.mkdirSync(inboxDir, { recursive: true });
  }

  const files = fs.readdirSync(inboxDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  if (files.length === 0) {
    console.log('[Notice] No new photos found in assets-inbox/ervan-photos/.');
    console.log('[Notice] Current active portrait remains: Asset/img/ervan-portrait.png');
    return;
  }

  // Sort by file size / resolution descending
  files.sort((a, b) => {
    return fs.statSync(path.join(inboxDir, b)).size - fs.statSync(path.join(inboxDir, a)).size;
  });

  const chosenFile = path.join(inboxDir, files[0]);
  console.log(`[Processing] Selected highest quality photo: ${files[0]}`);

  const photoBase64 = fs.readFileSync(chosenFile).toString('base64');
  const mimeType = chosenFile.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const dataUri = `data:${mimeType};base64,${photoBase64}`;

  // Launch headless browser to perform high-fidelity canvas composition
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });

  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body, html { margin: 0; padding: 0; background: transparent; overflow: hidden; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <canvas id="c" width="1024" height="1536"></canvas>
    <script>
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const cw = 1024;
        const ch = 1536;

        // Scale to fit nicely with eye line at ~35-40% height
        const scale = 1180 / img.naturalWidth;
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (cw - drawW) / 2;
        const drawY = 280;

        // Subtle dark crimson rim light behind subject
        const bgGlow = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 120, cw * 0.5, ch * 0.45, 480);
        bgGlow.addColorStop(0, 'rgba(189, 12, 34, 0.22)');
        bgGlow.addColorStop(0.6, 'rgba(189, 12, 34, 0.08)');
        bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, cw, ch);

        // Draw subject
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Alpha fade out at the bottom
        ctx.globalCompositeOperation = 'destination-out';
        const grad = ctx.createLinearGradient(0, 950, 0, 1536);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
        grad.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 950, cw, 586);

        window.__DONE = true;
      };
      img.src = "${dataUri}";
    </script>
  </body>
  </html>`);

  await page.waitForFunction(() => window.__DONE === true, { timeout: 10000 });

  const canvasHandle = await page.$('#c');
  const buffer = await canvasHandle.screenshot({ omitBackground: true });
  fs.writeFileSync(destPortrait, buffer);
  console.log(`[Success] Processed portrait written to: ${destPortrait} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

  await browser.close();

  // Rebuild
  console.log('[Building] Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
}

processPhotos().catch(err => {
  console.error('[Error] Processing photo failed:', err);
  process.exit(1);
});
