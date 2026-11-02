import { build } from 'esbuild';
import fs from 'fs';

// Build JS bundle without sourcemaps to ensure zero internal leak
await build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: 'Asset/dist/app.js',
  loader: { '.jsx': 'jsx' },
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }
});

// Copy src/styles.css to Asset/dist/app.css
fs.copyFileSync('src/styles.css', 'Asset/dist/app.css');

// Remove any lingering sourcemaps if present
if (fs.existsSync('Asset/dist/app.js.map')) fs.unlinkSync('Asset/dist/app.js.map');
if (fs.existsSync('Asset/dist/app.css.map')) fs.unlinkSync('Asset/dist/app.css.map');

console.log('Portfolio built: index.html + Asset/dist/app.js + Asset/dist/app.css');
