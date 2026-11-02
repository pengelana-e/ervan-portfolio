const fs = require('fs');

const appJsx = fs.readFileSync('extracted_app.jsx', 'utf8');

// Let's print sections of app.jsx
const lines = appJsx.split('\n');
console.log('Total lines:', lines.length);

// Let's print Header, Hero, Portfolio, Awards, Breakdown, About, Journey, Contact
const compNames = ['Header', 'Hero', 'ProjectCard', 'BrandStrip', 'Portfolio', 'Awards', 'Breakdown', 'About', 'Journey', 'Contact', 'ProjectDialog', 'App'];

compNames.forEach(name => {
  const start = lines.findIndex(l => l.startsWith(`function ${name}`));
  console.log(`Component ${name} starts at line ${start + 1}`);
});
