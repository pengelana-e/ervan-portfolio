const fs = require('fs');
const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

const match = appJsx.match(/function Breakdown[\s\S]*?(?=function About)/);
if (match) console.log(match[0]);
