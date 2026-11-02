const fs = require('fs');

const promptText = fs.readFileSync('prompt.md', 'utf8');
console.log('prompt.md total length:', promptText.length);
console.log('First 2000 characters:');
console.log(promptText.slice(0, 2000));
console.log('\n--- Section Headers ---');
const headers = promptText.match(/^#+\s+.+$/gm);
console.log(headers ? headers.slice(0, 50).join('\n') : 'No headers');
