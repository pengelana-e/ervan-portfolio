const fs = require('fs');
const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

const awardsMatch = appJsx.match(/function Awards[\s\S]*?(?=function Breakdown)/);
if (awardsMatch) {
  console.log(awardsMatch[0]);
}
