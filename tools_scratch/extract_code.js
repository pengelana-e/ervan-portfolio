const fs = require('fs');

const promptText = fs.readFileSync('prompt.md', 'utf8');

// Section 4 begins with `## 4. `src/app.jsx`, verbatim`
// Section 5 begins with `## 5. `src/styles.css`, verbatim`
// Section 6 begins with `## 6. Data and assets`

const sec4Match = promptText.match(/## 4\. `src\/app\.jsx`, verbatim\s+([\s\S]*?)(?=\n## 5\.)/);
const sec5Match = promptText.match(/## 5\. `src\/styles\.css`, verbatim\s+([\s\S]*?)(?=\n## 6\.)/);

if (sec4Match) {
  let code = sec4Match[1].trim();
  // strip markdown code block fences
  if (code.startsWith('```') || code.startsWith('~~~')) {
    code = code.replace(/^(?:```|~~~)[a-z0-9_-]*\n/i, '').replace(/\n(?:```|~~~)$/, '');
  }
  fs.writeFileSync('extracted_app.jsx', code);
  console.log('Extracted app.jsx, length:', code.length);
} else {
  console.log('sec4Match failed');
}

if (sec5Match) {
  let css = sec5Match[1].trim();
  if (css.startsWith('```') || css.startsWith('~~~')) {
    css = css.replace(/^(?:```|~~~)[a-z0-9_-]*\n/i, '').replace(/\n(?:```|~~~)$/, '');
  }
  fs.writeFileSync('extracted_styles.css', css);
  console.log('Extracted styles.css, length:', css.length);
} else {
  console.log('sec5Match failed');
}
