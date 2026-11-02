import fs from 'fs';
import path from 'path';

const brandConfigs = [
  { file: 'Netflix.svg', name: 'Netflix', isExisting: true },
  {
    file: 'AetherFilms.svg',
    name: 'Aether Films',
    icon: '<polygon points="20,10 32,38 8,38" fill="none" stroke="#fff" stroke-width="3"/><circle cx="20" cy="28" r="4" fill="#e32b3c"/>',
    text: 'AETHER FILMS'
  },
  {
    file: 'ApexCinema.svg',
    name: 'Apex Cinema Group',
    icon: '<path d="M10,38 L20,12 L30,38 L25,38 L20,24 L15,38 Z" fill="#fff"/><circle cx="20" cy="36" r="2.5" fill="#e32b3c"/>',
    text: 'APEX CINEMA'
  },
  {
    file: 'ChromaVFX.svg',
    name: 'Chroma VFX',
    icon: '<circle cx="16" cy="25" r="9" fill="none" stroke="#e32b3c" stroke-width="2.5"/><circle cx="25" cy="25" r="9" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.8"/>',
    text: 'CHROMA VFX'
  },
  {
    file: 'LuminaStudios.svg',
    name: 'Lumina Studios',
    icon: '<polygon points="20,8 24,18 34,20 26,27 28,38 20,32 12,38 14,27 6,20 16,18" fill="none" stroke="#fff" stroke-width="2"/>',
    text: 'LUMINA'
  },
  {
    file: 'NexusPost.svg',
    name: 'Nexus Post',
    icon: '<rect x="8" y="14" width="24" height="22" rx="3" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="8" y1="25" x2="32" y2="25" stroke="#e32b3c" stroke-width="2.5"/>',
    text: 'NEXUS POST'
  },
  {
    file: 'Hyperion3D.svg',
    name: 'Hyperion 3D',
    icon: '<path d="M20,10 L32,18 L32,32 L20,40 L8,32 L8,18 Z" fill="none" stroke="#fff" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="40" stroke="#e32b3c" stroke-width="1.5"/>',
    text: 'HYPERION 3D'
  },
  {
    file: 'SpectraGrade.svg',
    name: 'Spectra Grade',
    icon: '<circle cx="20" cy="25" r="12" fill="none" stroke="#fff" stroke-width="2"/><path d="M12,25 C12,18 28,18 28,25 C28,32 12,32 12,25" fill="#e32b3c"/>',
    text: 'SPECTRA'
  },
  {
    file: 'VanguardMedia.svg',
    name: 'Vanguard Media',
    icon: '<polygon points="8,12 20,38 32,12 26,12 20,28 14,12" fill="#fff"/>',
    text: 'VANGUARD'
  },
  {
    file: 'HorizonVisuals.svg',
    name: 'Horizon Visuals',
    icon: '<path d="M8,30 C12,16 28,16 32,30" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="6" y1="34" x2="34" y2="34" stroke="#e32b3c" stroke-width="2"/>',
    text: 'HORIZON'
  },
  {
    file: 'KinetixLab.svg',
    name: 'Kinetix Lab',
    icon: '<line x1="10" y1="12" x2="10" y2="38" stroke="#fff" stroke-width="3"/><path d="M10,25 L26,12 M10,25 L26,38" stroke="#fff" stroke-width="3"/><circle cx="28" cy="25" r="3" fill="#e32b3c"/>',
    text: 'KINETIX LAB'
  },
  {
    file: 'OnyxSound.svg',
    name: 'Onyx Sound',
    icon: '<polygon points="20,10 32,25 20,40 8,25" fill="#fff"/><circle cx="20" cy="25" r="4" fill="#090909"/>',
    text: 'ONYX SOUND'
  }
];

for (const b of brandConfigs) {
  if (b.isExisting) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50">
    <g transform="translate(0, 0)">
      ${b.icon}
    </g>
    <text x="44" y="32" font-family="'Anton', Impact, sans-serif" font-size="16" letter-spacing="2" fill="#ffffff" opacity="0.95">${b.text}</text>
  </svg>`;
  fs.writeFileSync(path.join('Asset/svg/brand', b.file), svg);
  console.log(`Generated authentic mark for Asset/svg/brand/${b.file}`);
}

const brandsJson = brandConfigs.map(b => ({ file: b.file, name: b.name }));
fs.writeFileSync('src/data/brands.json', JSON.stringify(brandsJson, null, 2));
console.log('Saved src/data/brands.json');
