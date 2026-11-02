import fs from 'fs';
import path from 'path';

const srcImg = 'C:\\Users\\ervan\\.gemini\\antigravity\\brain\\f231f4f5-aa2f-4f1f-90cb-9f01ae1ba772\\hero_director_portrait_1793631174046.jpg';

if (fs.existsSync(srcImg)) {
  const stat = fs.statSync(srcImg);
  console.log('Found generated portrait:', srcImg, 'Size:', stat.size);
  fs.copyFileSync(srcImg, 'Asset/img/hero-director-raw.jpg');
  console.log('Copied to Asset/img/hero-director-raw.jpg');
} else {
  console.log('File does not exist:', srcImg);
}
