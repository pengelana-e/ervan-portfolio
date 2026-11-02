const fs = require('fs');
const path = require('path');

async function downloadJson() {
  fs.mkdirSync('src/data', { recursive: true });

  const pRes = await fetch('https://www.duingzforge.site/kit/portfolio/Asset/data/projects.json');
  if (pRes.ok) {
    const pData = await pRes.text();
    fs.writeFileSync('src/data/projects.json', pData);
    console.log('Saved src/data/projects.json, bytes:', pData.length);
  } else {
    console.log('Failed projects.json:', pRes.status);
  }

  const bRes = await fetch('https://www.duingzforge.site/kit/portfolio/Asset/data/brands.json');
  if (bRes.ok) {
    const bData = await bRes.text();
    fs.writeFileSync('src/data/brands.json', bData);
    console.log('Saved src/data/brands.json, bytes:', bData.length);
  } else {
    console.log('Failed brands.json:', bRes.status);
  }
}
downloadJson();
