import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));

console.log('Original projects count:', raw.length);

const cleaned = raw.map(p => {
  let title = p.title;
  let description = p.description || '';
  let type = p.type;
  let media = p.media;
  let role = p.role || '';
  let year = p.year || '';
  let category = p.category || 'VFX';
  let image = p.image || '';

  // Fix bug entry
  if (type === '${item.type}') {
    type = 'image';
    media = 'https://res.cloudinary.com/do76nqxfr/image/upload/v1772850519/0001-2_qs9nah.jpg';
    image = 'https://res.cloudinary.com/do76nqxfr/image/upload/v1772850519/0001-2_qs9nah.jpg';
    role = 'VFX Artist';
    year = '2024';
  }

  // Sanitize personal name occurrences in description
  description = description.replace(/Renando/g, 'Studio Vance');

  return {
    ...p,
    type,
    title,
    description,
    role,
    year,
    category,
    image,
    media
  };
});

fs.writeFileSync('src/data/projects.json', JSON.stringify(cleaned, null, 2));
console.log('Cleaned and saved src/data/projects.json');
