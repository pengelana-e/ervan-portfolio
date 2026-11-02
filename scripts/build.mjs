import { build } from 'esbuild';
import fs from 'fs';

// Build JS bundle
await build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'Asset/dist/app.js',
  loader: { '.jsx': 'jsx' },
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }
});

// Copy src/styles.css to Asset/dist/app.css
fs.copyFileSync('src/styles.css', 'Asset/dist/app.css');

console.log('Portfolio built: index.html + Asset/dist/app.js + Asset/dist/app.css');
