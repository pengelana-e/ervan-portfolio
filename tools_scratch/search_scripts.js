const fs = require('fs');
const p = fs.readFileSync('prompt.md', 'utf8');

console.log('dev.mjs occurrences:');
p.split('\n').filter(l => l.includes('dev.mjs') || l.includes('check.mjs')).forEach(l => console.log(l));
