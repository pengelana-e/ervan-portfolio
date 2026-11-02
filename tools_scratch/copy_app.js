const fs = require('fs');
fs.copyFileSync('extracted_app.jsx', 'src/app.jsx');
console.log('Copied extracted_app.jsx to src/app.jsx');
