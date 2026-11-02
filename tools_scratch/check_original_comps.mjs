import fs from 'fs';

const rawPrompt = fs.readFileSync('tools_scratch/extracted_app.jsx', 'utf8');

// Find BrandStrip or Brands component in original app.jsx
const brandMatch = rawPrompt.match(/function Brands[\s\S]*?(?=function Portfolio)/);
if (brandMatch) {
  console.log('--- ORIGINAL BRANDS COMPONENT ---');
  console.log(brandMatch[0]);
} else {
  // search for brand in rawPrompt
  const matches = rawPrompt.split('\n').filter(l => l.includes('brands') || l.includes('brand'));
  console.log('Brand occurrences in original:', matches);
}

// Find ProjectCard or card in original
const cardMatch = rawPrompt.match(/function (?:ProjectCard|Card|ProjectItem|Portfolio)[\s\S]*?(?=function Awards)/);
if (cardMatch) {
  console.log('--- ORIGINAL PORTFOLIO / CARDS COMPONENT ---');
  console.log(cardMatch[0]);
}
