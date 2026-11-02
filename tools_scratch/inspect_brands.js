const fs = require('fs');
const b = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));
console.log('Brands count:', b.length);
console.log(b);
