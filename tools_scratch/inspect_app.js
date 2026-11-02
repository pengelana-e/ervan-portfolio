const fs = require('fs');

const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');
console.log('Lines in app.jsx:', appJsx.split('\n').length);
console.log('First 40 lines:');
console.log(appJsx.split('\n').slice(0, 40).join('\n'));
console.log('\nLast 40 lines:');
console.log(appJsx.split('\n').slice(-40).join('\n'));
