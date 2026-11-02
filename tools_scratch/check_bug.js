const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
const bug = p.filter(x => x.type === '${item.type}');
console.log('Bug entry:', bug);
