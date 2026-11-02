const fs = require('fs');
const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

const matches = appJsx.split('\n').filter(l => l.includes('gwe.jpeg') || l.includes('renando') || l.includes('Renando') || l.includes('SERTIFIKAT') || l.includes('dododididaw') || l.includes('DuingZStudio'));
console.log('Occurrences of personal references in extracted_app.jsx:');
matches.forEach(m => console.log(m.trim()));
