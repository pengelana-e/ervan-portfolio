const fs = require('fs');

async function fetchFile(url, dest) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(`Fetch ${url}: ${res.status}`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buf));
      console.log(`Saved ${dest} (${buf.byteLength} bytes)`);
      return true;
    }
  } catch (e) {
    console.error(`Error fetching ${url}:`, e.message);
  }
  return false;
}

async function run() {
  // Fetch app.css and app.js from live site
  await fetchFile('https://renando.duingzcreative.site/Asset/dist/app.css', 'live_app.css');
  await fetchFile('https://renando.duingzcreative.site/Asset/dist/app.js', 'live_app.js');
  await fetchFile('https://renando.duingzcreative.site/Asset/dist/app.js.map', 'live_app.js.map');
  await fetchFile('https://renando.duingzcreative.site/Asset/dist/app.css.map', 'live_app.css.map');

  // Let's also check prompt link
  await fetchFile('https://www.duingzforge.site/learn/portfolio-sinematik-ai-copy-prompt/prompt?lang=id&block=0', 'prompt_id_0.md');
  await fetchFile('https://www.duingzforge.site/learn/portfolio-sinematik-ai-copy-prompt/prompt?lang=en&block=0', 'prompt_en_0.md');
  await fetchFile('https://www.duingzforge.site/learn/portfolio-sinematik-ai-copy-prompt/prompt', 'prompt.md');
  await fetchFile('https://duingzforge.com/learn/portfolio-sinematik-ai-copy-prompt/prompt', 'prompt_com.md');
  await fetchFile('https://www.duingzforge.site/kit/portfolio.zip', 'portfolio.zip');
  await fetchFile('https://www.duingzforge.site/kit/portfolio/prompt.md', 'kit_prompt.md');
}

run();
