const fs = require('fs');

const promptText = fs.readFileSync('prompt.md', 'utf8');

// Split by ## headers
const sections = promptText.split(/(?=\n##\s+)/);
console.log('Number of sections:', sections.length);
sections.forEach((sec, idx) => {
  const title = sec.trim().split('\n')[0];
  console.log(`[Section ${idx}] ${title} (chars: ${sec.length})`);
});
