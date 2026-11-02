const fs = require('fs');

const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

// Find function / component declarations
const comps = appJsx.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9_]*)/g);
console.log('Components/Declarations:', comps);
