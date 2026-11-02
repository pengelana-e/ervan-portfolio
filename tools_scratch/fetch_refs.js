const fs = require('fs');

async function fetchUrl(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log('Status', url, res.status);
    const text = await res.text();
    return text;
  } catch (err) {
    console.error('Error fetching', url, err.message);
    return null;
  }
}

async function run() {
  const urls = [
    { name: 'article', url: 'https://www.duingzforge.site/learn/portfolio-sinematik-ai-copy-prompt' },
    { name: 'live', url: 'https://renando.duingzcreative.site/' },
    { name: 'kit', url: 'https://www.duingzforge.site/kit/portfolio' }
  ];
  for (const item of urls) {
    const content = await fetchUrl(item.url);
    if (content) {
      fs.writeFileSync(`ref_${item.name}.html`, content);
      console.log(`Saved ref_${item.name}.html (${content.length} bytes)`);
    }
  }
}

run();
