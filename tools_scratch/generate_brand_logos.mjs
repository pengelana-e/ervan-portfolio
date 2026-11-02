import fs from 'fs';
import path from 'path';

const brands = [
  { file: 'Netflix.svg', name: 'Netflix' },
  { file: 'ChromaVFX.svg', name: 'Chroma VFX Studio' },
  { file: 'AetherFilms.svg', name: 'Aether Films' },
  { file: 'LuminaStudios.svg', name: 'Lumina Studios' },
  { file: 'ApexCinema.svg', name: 'Apex Cinema Group' },
  { file: 'NexusPost.svg', name: 'Nexus Post Production' },
  { file: 'Hyperion3D.svg', name: 'Hyperion 3D' },
  { file: 'SpectraGrade.svg', name: 'Spectra Color Science' },
  { file: 'VanguardMedia.svg', name: 'Vanguard Media' },
  { file: 'HorizonVisuals.svg', name: 'Horizon Visuals' },
  { file: 'KinetixLab.svg', name: 'Kinetix Creative Lab' },
  { file: 'OnyxSound.svg', name: 'Onyx Sound Design' }
];

function createSvgLogo(name, text) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
    <text x="100" y="38" font-family="'Anton', sans-serif" font-size="22" letter-spacing="3" fill="#ffffff" text-anchor="middle" opacity="0.85">${text.toUpperCase()}</text>
  </svg>`;
}

fs.mkdirSync('Asset/svg/brand', { recursive: true });

for (const b of brands) {
  if (b.file === 'Netflix.svg' && fs.existsSync('Asset/svg/brand/Netflix.svg')) {
    continue;
  }
  const svg = createSvgLogo(b.name, b.name.replace(/(Studio|Films|Group|Post Production|Media|Color Science|Creative Lab|Design)/gi, '').trim());
  fs.writeFileSync(path.join('Asset/svg/brand', b.file), svg);
  console.log(`Generated Asset/svg/brand/${b.file}`);
}

fs.writeFileSync('src/data/brands.json', JSON.stringify(brands, null, 2));
console.log('Saved src/data/brands.json with neutral sample studio brands');
