import fs from 'fs';

const rawPrompt = fs.readFileSync('tools_scratch/extracted_app.jsx', 'utf8');

const heroMatch = rawPrompt.match(/function Hero[\s\S]*?(?=function ProjectCard)/);
if (heroMatch) {
  console.log('--- ORIGINAL HERO COMPONENT ---');
  console.log(heroMatch[0]);
}
