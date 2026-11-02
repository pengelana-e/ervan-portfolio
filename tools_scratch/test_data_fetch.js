const fs = require('fs');

async function testFetch() {
  const urls = [
    'https://renando.duingzcreative.site/Asset/data/projects.json',
    'https://renando.duingzcreative.site/Asset/data/brands.json',
    'https://www.duingzforge.site/kit/portfolio/Asset/data/projects.json',
    'https://www.duingzforge.site/kit/portfolio/Asset/data/brands.json',
    'https://renando.duingzcreative.site/Asset/img/renando-portrait.png',
    'https://renando.duingzcreative.site/Asset/img/favicon.svg'
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, res.status, res.headers.get('content-type'));
      if (res.ok && (u.endsWith('.json') || u.endsWith('.svg'))) {
        const text = await res.text();
        console.log(`  Preview (${text.length} chars):`, text.slice(0, 150));
      }
    } catch (e) {
      console.log(u, 'FAILED:', e.message);
    }
  }
}
testFetch();
