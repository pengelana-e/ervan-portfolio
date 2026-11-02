const fs = require('fs');
fs.copyFileSync('extracted_styles.css', 'src/styles.css');
console.log('Copied extracted_styles.css to src/styles.css');
