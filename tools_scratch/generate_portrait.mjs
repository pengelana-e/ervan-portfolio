import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function generatePortrait() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1536 },
    deviceScaleFactor: 1
  });

  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1536" width="1024" height="1536">
    <defs>
      <!-- Gradients for cinematic lighting -->
      <radialGradient id="redRimGlow" cx="50%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#ff3b50" stop-opacity="0.85"/>
        <stop offset="45%" stop-color="#e32b3c" stop-opacity="0.5"/>
        <stop offset="75%" stop-color="#800615" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1c1d"/>
        <stop offset="40%" stop-color="#141314"/>
        <stop offset="85%" stop-color="#0c0b0c"/>
        <stop offset="100%" stop-color="#080708"/>
      </linearGradient>

      <linearGradient id="suitGrad" x1="0%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stop-color="#1c1b1c"/>
        <stop offset="50%" stop-color="#121112"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>

      <linearGradient id="rimLeft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff3045" stop-opacity="0.9"/>
        <stop offset="35%" stop-color="#e32b3c" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="rimRight" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#ff4458" stop-opacity="0.85"/>
        <stop offset="40%" stop-color="#e32b3c" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="keyLight" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stop-color="#f5e6d3" stop-opacity="0.25"/>
        <stop offset="50%" stop-color="#d4c0aa" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="fadeBottom" x1="0%" y1="70%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.95"/>
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>

      <filter id="softRim" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Ambient Red Atmosphere Behind Silhouette -->
    <ellipse cx="512" cy="560" rx="420" ry="520" fill="url(#redRimGlow)"/>

    <!-- GROUP: CHARACTER SILHOUETTE -->
    <g id="figure">
      <!-- TORSO & SUIT JACKET -->
      <!-- Outer Coat Shape -->
      <path d="M 230 1536 
               L 245 920 
               C 260 840, 290 770, 340 710 
               C 380 660, 410 630, 440 615
               L 512 650
               L 584 615
               C 614 630, 644 660, 684 710
               C 734 770, 764 840, 779 920
               L 794 1536
               Z" 
            fill="url(#suitGrad)" />

      <!-- Shoulders & Coat Creases -->
      <path d="M 340 710 
               Q 275 800 250 940 
               Q 270 910 320 860 
               Q 360 820 420 780 
               Z" 
            fill="#181617" opacity="0.7"/>

      <path d="M 684 710 
               Q 749 800 774 940 
               Q 754 910 704 860 
               Q 664 820 604 780 
               Z" 
            fill="#181617" opacity="0.7"/>

      <!-- Lapels & Blazer Collar -->
      <path d="M 440 615 
               L 410 780 
               L 470 960 
               L 512 1100 
               L 512 650 
               Z" 
            fill="#121113"/>

      <path d="M 584 615 
               L 614 780 
               L 554 960 
               L 512 1100 
               L 512 650 
               Z" 
            fill="#161517"/>

      <!-- Inner Shirt / Turtleneck Collar -->
      <path d="M 445 610 
               Q 512 640 579 610 
               L 570 540 
               Q 512 555 454 540 
               Z" 
            fill="#0f0e0f"/>

      <!-- NECK -->
      <path d="M 460 545 
               Q 512 558 564 545 
               L 560 410 
               Q 512 420 464 410 
               Z" 
            fill="url(#bodyGrad)"/>

      <!-- HEAD & HAIR SILHOUETTE -->
      <!-- Jawline and Face Base -->
      <path d="M 460 415 
               C 440 370, 436 330, 442 280 
               C 446 240, 470 200, 512 195 
               C 554 200, 578 240, 582 280 
               C 588 330, 584 370, 564 415 
               C 542 455, 482 455, 460 415 
               Z" 
            fill="url(#bodyGrad)"/>

      <!-- Stylized Cinematic Hair Cutout -->
      <path d="M 436 290 
               C 426 250, 430 200, 452 165 
               C 475 130, 510 120, 545 125 
               C 580 130, 605 160, 612 205 
               C 615 225, 608 260, 590 280 
               C 580 250, 570 210, 540 195 
               C 505 180, 465 210, 450 255 
               Z" 
            fill="#100f10"/>

      <!-- Subtle Key Light on High Cheekbone / Forehead Angle -->
      <path d="M 470 240 
               C 490 230, 530 230, 550 245 
               C 535 285, 485 285, 470 240 
               Z" 
            fill="url(#keyLight)" opacity="0.6"/>

      <!-- RED RIM LIGHT - LEFT SIDE (Shoulder to Hair) -->
      <path d="M 452 165 
               C 440 190, 434 230, 438 275 
               C 432 320, 442 360, 458 400 
               C 435 440, 385 530, 340 710 
               C 290 770, 260 840, 245 920 
               L 230 1536 
               L 255 1536 
               L 268 930 
               C 282 855, 310 785, 355 725 
               C 398 545, 446 450, 468 410 
               C 450 370, 444 330, 448 280 
               C 442 240, 448 200, 460 175 
               Z" 
            fill="url(#rimLeft)" filter="url(#softRim)"/>

      <!-- RED RIM LIGHT - RIGHT SIDE (Shoulder to Hair) -->
      <path d="M 545 125 
               C 580 130, 605 160, 612 205 
               C 615 225, 608 260, 590 280 
               C 580 340, 575 380, 566 415 
               C 590 460, 640 550, 684 710 
               C 734 770, 764 840, 779 920 
               L 794 1536 
               L 770 1536 
               L 756 930 
               C 742 855, 714 785, 669 725 
               C 626 545, 578 450, 556 410 
               C 574 370, 580 330, 576 280 
               C 582 240, 576 200, 564 175 
               Z" 
            fill="url(#rimRight)" filter="url(#softRim)"/>

      <!-- HAIR TOP HIGHLIGHT ACCENT -->
      <path d="M 480 135 
               Q 520 120 565 138 
               Q 525 130 480 135 
               Z" 
            fill="#ff5d6e" filter="url(#glow)"/>

      <!-- Soft gradient falloff to bottom -->
      <rect x="0" y="1100" width="1024" height="436" fill="url(#fadeBottom)"/>
    </g>
  </svg>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1024px;
            height: 1536px;
            background: transparent;
            overflow: hidden;
          }
          svg {
            display: block;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  await page.setContent(html);
  const outPath = path.resolve('Asset/img/portrait-cinematic.png');
  await page.screenshot({ path: outPath, omitBackground: true });
  console.log('Saved Asset/img/portrait-cinematic.png at 1024x1536 with transparency');
  await browser.close();
}

generatePortrait();
