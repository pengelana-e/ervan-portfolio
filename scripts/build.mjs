import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

console.log('[BUILD] Starting production build for Cloudflare Pages...');

const distDir = 'dist';

// 1. Clean and initialize dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Build JS bundle with esbuild (minified, no sourcemaps)
await build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: path.join(distDir, 'Asset/dist/app.js'),
  loader: { '.jsx': 'jsx' },
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }
});

// Also keep root Asset/dist up-to-date for local root workflows
fs.mkdirSync('Asset/dist', { recursive: true });
fs.copyFileSync(path.join(distDir, 'Asset/dist/app.js'), 'Asset/dist/app.js');

// 3. Copy stylesheet to dist/Asset/dist/app.css and Asset/dist/app.css
fs.copyFileSync('src/styles.css', path.join(distDir, 'Asset/dist/app.css'));
fs.copyFileSync('src/styles.css', 'Asset/dist/app.css');

// 4. Helper function to copy file safely
function copyFileToDist(srcRel, distRel) {
  if (fs.existsSync(srcRel)) {
    const dest = path.join(distDir, distRel || srcRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(srcRel, dest);
  } else {
    console.warn(`[WARN] Asset not found: ${srcRel}`);
  }
}

// Helper function to copy directory
function copyDirToDist(srcDir, distDirTarget) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(distDirTarget, entry.name);
    if (entry.isDirectory()) {
      copyDirToDist(srcPath, destPath);
    } else {
      fs.mkdirSync(distDirTarget, { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 5. Copy ONLY actually used assets
console.log('[BUILD] Copying production assets...');
// A. Hero portrait & favicon
copyFileToDist('Asset/img/ervan-portrait.png', 'Asset/img/ervan-portrait.png');
copyFileToDist('Asset/img/favicon.svg', 'Asset/img/favicon.svg');

// B. Active initiative SVGs
copyDirToDist('Asset/img/initiatives', path.join(distDir, 'Asset/img/initiatives'));

// C. Active brand SVGs
copyDirToDist('Asset/svg/brand', path.join(distDir, 'Asset/svg/brand'));

// D. Active venture HD maquette images
copyDirToDist('Asset/img/ventures', path.join(distDir, 'Asset/img/ventures'));

// 6. Copy root configuration files for Cloudflare Pages, SEO, and domain
copyFileToDist('_headers', '_headers');
copyFileToDist('robots.txt', 'robots.txt');
copyFileToDist('sitemap.xml', 'sitemap.xml');
copyFileToDist('CNAME', 'CNAME');

// 7. Process index.html for dist with absolute root paths
let html = fs.readFileSync('index.html', 'utf-8');
// Normalize asset links to root domain paths (/Asset/...)
html = html.replace(/href="\.\/Asset\//g, 'href="/Asset/');
html = html.replace(/src="\.\/Asset\//g, 'src="/Asset/');
fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8');

// 8. Verify dist contents
const distFiles = [];
function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) walk(p);
    else distFiles.push(path.relative(distDir, p));
  }
}
walk(distDir);

console.log(`[BUILD SUCCESS] dist/ generated with ${distFiles.length} clean public files.`);
