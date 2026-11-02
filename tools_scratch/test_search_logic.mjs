import fs from 'fs';

const archive = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));

const query = 'cyberpunk';
const results = archive.filter(p => `${p.title} ${p.category} ${p.role} ${p.description || ''}`.toLowerCase().includes(query.toLowerCase()));

console.log('Results count for query "cyberpunk":', results.length);
results.forEach(r => console.log(r.title));
