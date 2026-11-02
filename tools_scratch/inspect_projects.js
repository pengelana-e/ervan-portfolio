const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
console.log('Projects count:', p.length);
console.log('First 5 projects:');
console.log(JSON.stringify(p.slice(0, 5), null, 2));

const types = {};
p.forEach(item => { types[item.type] = (types[item.type] || 0) + 1; });
console.log('Types distribution:', types);

const categories = {};
p.forEach(item => { categories[item.category] = (categories[item.category] || 0) + 1; });
console.log('Categories distribution:', categories);
