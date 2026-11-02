import fs from 'fs';

const projects = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));

const driveProjects = projects.filter(p => p.image && (p.image.includes('drive.google.com') || p.image.includes('lh3.googleusercontent.com')));
console.log('Projects with Google Drive images:', driveProjects.length);
driveProjects.forEach(p => console.log(p.title, p.image));

const nonWorkingImages = [];
for (const p of projects) {
  if (!p.image || p.image.includes('${')) {
    nonWorkingImages.push(p);
  }
}
console.log('Non working images count:', nonWorkingImages.length);
