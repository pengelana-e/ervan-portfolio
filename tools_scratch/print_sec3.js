const fs = require('fs');
const p = fs.readFileSync('prompt.md', 'utf8');
const sections = p.split(/(?=\n##\s+)/);
console.log(sections[3]);
