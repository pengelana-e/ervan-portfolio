import fs from 'fs';

const css = fs.readFileSync('src/styles.css', 'utf8');

const heroSideMatches = css.match(/[^{}]*(?:hero-side|hero-bottom|hero-manifesto|reel-button|hero-scroll|edition)[^{}]*\{[^}]*\}/gi);
console.log('Hero elements in CSS:', heroSideMatches);
