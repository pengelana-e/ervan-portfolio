const fs = require('fs');
const promptText = fs.readFileSync('prompt.md', 'utf8');
const sections = promptText.split(/(?=\n##\s+)/);

console.log('=== SECTION 2 ===');
console.log(sections[2]);

console.log('=== SECTION 3 ===');
console.log(sections[3]);

console.log('=== SECTION 6 ===');
console.log(sections[6]);

console.log('=== SECTION 7 ===');
console.log(sections[7]);
