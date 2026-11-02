const fs = require('fs');
const css = fs.readFileSync('extracted_styles.css', 'utf8');
const urls = [];
const match = css.match(/url\([^)]+\)/g);
console.log('URLs in CSS:', match);
