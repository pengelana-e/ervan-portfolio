import fs from 'fs';

const projects = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));

// Replace drive thumbnails with working high-res visuals from the same category or reliable Cloudinary
for (const p of projects) {
  if (p.image && p.image.includes('drive.google.com')) {
    if (p.title === 'ENDING DOSA TURUNAN') {
      p.image = 'https://res.cloudinary.com/do76nqxfr/image/upload/v1772850519/0001-2_qs9nah.jpg';
    } else if (p.category === 'Commercial') {
      p.image = 'https://img.youtube.com/vi/Lv5rUKFkJbQ/hqdefault.jpg';
    } else {
      p.image = 'https://res.cloudinary.com/do76nqxfr/image/upload/v1772850529/0001_a4n9pw.png';
    }
    console.log(`Replaced image for ${p.title} -> ${p.image}`);
  }
}

fs.writeFileSync('src/data/projects.json', JSON.stringify(projects, null, 2));
console.log('Updated src/data/projects.json with 100% reliable images');
