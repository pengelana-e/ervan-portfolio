const fs = require('fs');
const path = require('path');

const assetList = [
  'Asset/cv/Renando_Editor_VFX.pdf.pdf',
  'Asset/img/SERTIFIKAT/dalang.jpg',
  'Asset/img/SERTIFIKAT/juara2.jpg',
  'Asset/img/SERTIFIKAT/mindplace2.jpg',
  'Asset/img/SERTIFIKAT/peringkat2.jpg',
  'Asset/img/SERTIFIKAT/shortmovie.jpeg',
  'Asset/img/SERTIFIKAT/videolabs.jpg',
  'Asset/img/favicon.svg',
  'Asset/img/gwe.jpeg',
  'Asset/img/renando-portrait.png',
  'Asset/svg/CUI.svg',
  'Asset/svg/EBS.svg',
  'Asset/svg/EG.svg',
  'Asset/svg/PF.svg',
  'Asset/svg/SB.svg',
  'Asset/svg/SD.svg',
  'Asset/svg/UE.svg',
  'Asset/svg/ae.svg',
  'Asset/svg/ai.svg',
  'Asset/svg/am.svg',
  'Asset/svg/bl.svg',
  'Asset/svg/brand/Extrajoss.png',
  'Asset/svg/brand/Netflix.svg',
  'Asset/svg/brand/SevenDragon.png',
  'Asset/svg/brand/Whatsin.png',
  'Asset/svg/brand/diskominfo.png',
  'Asset/svg/brand/dpmptsp.png',
  'Asset/svg/brand/hara.png',
  'Asset/svg/brand/jeta.png',
  'Asset/svg/brand/logogatsu.png',
  'Asset/svg/brand/magma.png',
  'Asset/svg/brand/mbc.png',
  'Asset/svg/brand/pemda.png',
  'Asset/svg/brand/raincreation.png',
  'Asset/svg/brand/seven.png',
  'Asset/svg/brand/sma1seragen.png',
  'Asset/svg/brand/sma2indramayu.png',
  'Asset/svg/brand/unwir.png',
  'Asset/svg/brand/vianos.png',
  'Asset/svg/cc.svg',
  'Asset/svg/cv.svg',
  'Asset/svg/cx.svg',
  'Asset/svg/ibis.svg',
  'Asset/svg/is.svg',
  'Asset/svg/km.svg',
  'Asset/svg/lr.svg',
  'Asset/svg/lrc.svg',
  'Asset/svg/pa.svg',
  'Asset/svg/pl.svg',
  'Asset/svg/pr.svg',
  'Asset/svg/ps.svg',
  'Asset/svg/vn.svg',
  'Asset/svg/vs.svg',
  'Asset/svg/vsco.svg'
];

async function downloadOne(relPath) {
  const primaryUrl = `https://www.duingzforge.site/kit/portfolio/${relPath}`;
  const backupUrl = `https://renando.duingzcreative.site/${relPath}`;

  const destPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  for (const url of [primaryUrl, backupUrl]) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buf));
        return { success: true, url, bytes: buf.byteLength };
      }
    } catch (e) {
      // try backup
    }
  }
  return { success: false };
}

async function run() {
  console.log(`Starting download of ${assetList.length} assets...`);
  let okCount = 0;
  let failCount = 0;
  for (const item of assetList) {
    const res = await downloadOne(item);
    if (res.success) {
      okCount++;
    } else {
      failCount++;
      console.log(`FAILED: ${item}`);
    }
  }
  console.log(`Done: ${okCount} downloaded, ${failCount} failed.`);
}

run();
