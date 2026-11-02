const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
const renders = p.filter(x => x.type === 'render');
console.log('First render project:', JSON.stringify(renders[0], null, 2));
