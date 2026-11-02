import fs from 'fs';

const css = fs.readFileSync('src/styles.css', 'utf8');
console.log('Does styles.css have print media?', css.includes('@media print'));
console.log('Total css length:', css.length);
