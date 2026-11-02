import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function generateCvPdf() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Curriculum Vitae - Alex Vance</title>
      <style>
        @page {
          size: A4;
          margin: 18mm;
        }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #0b0b0b;
          color: #e5e5e5;
          margin: 0;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #e32b3c;
          padding-bottom: 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .name {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #ffffff;
          margin: 0;
        }
        .title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #e32b3c;
          margin-top: 6px;
        }
        .contacts {
          font-size: 11px;
          color: #999;
          text-align: right;
          line-height: 1.8;
        }
        .section-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2.5px;
          color: #e32b3c;
          text-transform: uppercase;
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 1px solid #222;
          padding-bottom: 4px;
        }
        .job {
          margin-bottom: 16px;
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 13px;
          color: #f2f2f2;
        }
        .job-company {
          font-size: 11px;
          color: #888;
          margin-bottom: 4px;
        }
        .job-desc {
          font-size: 11px;
          color: #bbb;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tag {
          background: #181818;
          border: 1px solid #333;
          padding: 4px 8px;
          font-size: 10px;
          border-radius: 3px;
          color: #ddd;
        }
        .footer-note {
          margin-top: 30px;
          font-size: 9px;
          color: #555;
          text-align: center;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="name">ALEX VANCE</h1>
          <div class="title">CINEMATIC DIRECTOR & VFX ARTIST</div>
        </div>
        <div class="contacts">
          contact@alexvance.studio<br>
          +62 812-3456-7890<br>
          Jakarta, Indonesia · alexvance.creative
        </div>
      </div>

      <div class="section-title">Professional Profile</div>
      <p style="font-size: 11px; color: #ccc; margin-bottom: 16px;">
        Creative director and visual effects artist specializing in narrative film editing, procedural 3D worldbuilding, photorealistic compositing, and color grading. Over 6 years of experience transforming ambitious creative concepts into high-impact cinematic imagery.
      </p>

      <div class="section-title">Selected Experience</div>
      <div class="job">
        <div class="job-header">
          <span>Senior VFX Artist & Director</span>
          <span>2024 – PRESENT</span>
        </div>
        <div class="job-company">Independent Cinema & Commercial Productions</div>
        <div class="job-desc">
          Directing visual post-production workflows for narrative film and commercial campaigns. Supervising on-set VFX setups, matchmoving, 3D environment synthesis, and color timing in ACES.
        </div>
      </div>

      <div class="job">
        <div class="job-header">
          <span>Lead Compositor & CGI Generalist</span>
          <span>2022 – 2024</span>
        </div>
        <div class="job-company">Post-Production Studio</div>
        <div class="job-desc">
          Executed complex multi-pass photorealistic compositing, digital matte painting, rotoscoping, and 3D lighting for commercial broadcasts and narrative productions.
        </div>
      </div>

      <div class="job">
        <div class="job-header">
          <span>Cinematic Video Editor & Colorist</span>
          <span>2019 – 2022</span>
        </div>
        <div class="job-company">Film & Agency Freelance</div>
        <div class="job-desc">
          Cut and finished dramatic short films, commercial spots, and music videos. Emphasized pacing, micro-transitions, and emotional tone matching.
        </div>
      </div>

      <div class="grid-2">
        <div>
          <div class="section-title">Core Skills</div>
          <div class="tag-list">
            <span class="tag">VFX Compositing</span>
            <span class="tag">3D Environments</span>
            <span class="tag">CGI Integration</span>
            <span class="tag">Matchmove & Tracking</span>
            <span class="tag">Narrative Editing</span>
            <span class="tag">Color Science & ACES</span>
            <span class="tag">Virtual Production</span>
            <span class="tag">Sound Design Sync</span>
          </div>
        </div>
        <div>
          <div class="section-title">Software Toolkit</div>
          <div class="tag-list">
            <span class="tag">Premiere Pro</span>
            <span class="tag">After Effects</span>
            <span class="tag">Blender 3D</span>
            <span class="tag">Photoshop</span>
            <span class="tag">Lightroom</span>
            <span class="tag">Unreal Engine</span>
            <span class="tag">DaVinci Resolve</span>
          </div>
        </div>
      </div>

      <div class="footer-note">
        PORTFOLIO RESUME · VERIFIED SAMPLE DOCUMENT · WWW.ALEXVANCE.CREATIVE
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  fs.mkdirSync('Asset/cv', { recursive: true });
  const outPath = path.resolve('Asset/cv/curriculum-vitae-sample.pdf');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true
  });
  console.log('Saved Asset/cv/curriculum-vitae-sample.pdf successfully!');
  await browser.close();
}

generateCvPdf();
