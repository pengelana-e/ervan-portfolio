const fs = require('fs');

const extracted = fs.readFileSync('extracted_styles.css', 'utf8');
const live = fs.readFileSync('live_app.css', 'utf8');

console.log('extracted_styles.css length:', extracted.length);
console.log('live_app.css length:', live.length);
console.log('extracted starts with:', extracted.slice(0, 200));
console.log('live starts with:', live.slice(0, 200));
