import fs from 'fs';

const requiredFiles = [
  'index.html',
  'src/app.jsx',
  'src/styles.css',
  'src/data/projects.json',
  'src/data/brands.json',
  'Asset/dist/app.js',
  'Asset/dist/app.css'
];

let allOk = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file);
    console.log(`[OK] ${file} (${stat.size} bytes)`);
  } else {
    console.error(`[MISSING] ${file}`);
    allOk = false;
  }
}

if (!allOk) {
  console.error('\nVerification failed.');
  process.exit(1);
} else {
  console.log('\nAll core files verified successfully.');
}
