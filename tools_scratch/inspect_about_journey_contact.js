const fs = require('fs');
const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

const match = appJsx.match(/function About[\s\S]*?(?=function ProjectDialog)/);
if (match) console.log(match[0]);
