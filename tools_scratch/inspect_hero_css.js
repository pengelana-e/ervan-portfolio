const fs = require('fs');
const css = fs.readFileSync('extracted_styles.css', 'utf8');

const matches = css.match(/[^{}]*(?:hero|portrait)[^{}]*\{[^}]*\}/gi);
console.log('Hero / portrait css rules:');
matches.slice(0, 15).forEach(m => console.log(m.trim()));
