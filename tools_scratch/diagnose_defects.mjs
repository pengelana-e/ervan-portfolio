import fs from 'fs';

const css = fs.readFileSync('src/styles.css', 'utf8');
const app = fs.readFileSync('src/app.jsx', 'utf8');
const projects = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));

// 1. Check CYBERPUNK ENVIRONMENT
const cyberpunk = projects.find(p => p.title.includes('CYBERPUNK'));
console.log('CYBERPUNK project data:', cyberpunk);

// 2. Check brand-strip and brand-item CSS
console.log('\n--- BRAND CSS RULES ---');
const brandRules = css.match(/[^{}]*brand[^{}]*\{[^}]*\}/gi);
if (brandRules) brandRules.forEach(r => console.log(r.trim()));

// 3. Check card CSS
console.log('\n--- PROJECT CARD CSS RULES ---');
const cardRules = css.match(/[^{}]*project-card[^{}]*\{[^}]*\}/gi);
if (cardRules) cardRules.forEach(r => console.log(r.trim()));

// 4. Check media-image CSS
console.log('\n--- MEDIA-IMAGE CSS RULES ---');
const mediaRules = css.match(/[^{}]*media-image[^{}]*\{[^}]*\}/gi);
if (mediaRules) mediaRules.forEach(r => console.log(r.trim()));
