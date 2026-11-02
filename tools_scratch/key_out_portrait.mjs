import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function keyOut() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });

  const rawBuffer = fs.readFileSync('Asset/img/hero-director-raw.jpg');
  const base64Img = `data:image/jpeg;base64,${rawBuffer.toString('base64')}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; background: transparent; overflow: hidden; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="c" width="1024" height="1536"></canvas>
        <script>
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 1024, 1536);
            
            const imgData = ctx.getImageData(0, 0, 1024, 1536);
            const data = imgData.data;

            for (let y = 0; y < 1536; y++) {
              for (let x = 0; x < 1024; x++) {
                const idx = (y * 1024 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                const maxVal = Math.max(r, g, b);
                
                if (maxVal < 18) {
                  data[idx + 3] = 0;
                } else if (maxVal < 42) {
                  const alpha = (maxVal - 18) / (42 - 18);
                  data[idx + 3] = Math.round(alpha * 255);
                }
              }
            }

            // Bottom fade
            for (let y = 1200; y < 1536; y++) {
              const bottomFade = Math.max(0, 1 - (y - 1200) / (1536 - 1200));
              for (let x = 0; x < 1024; x++) {
                const idx = (y * 1024 + x) * 4;
                data[idx + 3] = Math.round(data[idx + 3] * bottomFade);
              }
            }

            ctx.putImageData(imgData, 0, 0);
            window.__done = true;
          };
          img.src = '${base64Img}';
        </script>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForFunction(() => window.__done === true);

  const outPath = path.resolve('Asset/img/portrait-cinematic.png');
  await page.screenshot({ path: outPath, omitBackground: true });
  console.log('Saved keyed-out transparent cinematic portrait to Asset/img/portrait-cinematic.png');

  await browser.close();
}

keyOut();
