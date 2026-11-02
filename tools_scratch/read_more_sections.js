const fs = require('fs');
const promptText = fs.readFileSync('prompt.md', 'utf8');
const sections = promptText.split(/(?=\n##\s+)/);

console.log('=== SECTION 6 ===');
console.log(sections[6]);

console.log('=== SECTION 8 ===');
console.log(sections[8]);

console.log('=== SECTION 9 ===');
console.log(sections[9]);

console.log('=== SECTION 10 ===');
console.log(sections[10]);
