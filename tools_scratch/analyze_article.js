const fs = require('fs');

const articleHtml = fs.readFileSync('ref_article.html', 'utf8');

// Find links
const links = [];
const linkRegex = /href=["']([^"']+)["']/g;
let match;
while ((match = linkRegex.exec(articleHtml)) !== null) {
  if (match[1].includes('prompt') || match[1].includes('kit') || match[1].includes('github') || match[1].includes('.md') || match[1].includes('.zip') || match[1].includes('drive') || match[1].includes('renando') || match[1].includes('download')) {
    links.push(match[1]);
  }
}
console.log('Relevant links in article:', Array.from(new Set(links)));

// Search for prompt text or code blocks
console.log('Article length:', articleHtml.length);

// Let's also check live html
const liveHtml = fs.readFileSync('ref_live.html', 'utf8');
console.log('Live html:');
console.log(liveHtml);
