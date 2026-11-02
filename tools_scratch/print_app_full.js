const fs = require('fs');

const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');
const lines = appJsx.split('\n');

function printRange(start, end) {
  console.log(`=== LINES ${start} to ${end} ===`);
  console.log(lines.slice(start - 1, end).join('\n'));
}

printRange(1, 120);
printRange(121, 240);
printRange(241, 352);
