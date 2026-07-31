const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Sources are genuine 3840x2160 (4K), ratio 1.778 — an exact match for the
// hero desktop slot (1600x900, also 1.778), so the desktop crop needs zero
// cropping, the whole photo shows. Mobile (1080x1920 portrait) still needs a
// real crop from a landscape source — using content-aware "attention"
// cropping instead of a blind center crop so it doesn't cut through the
// celosía itself.
const items = [
  { src: "rubi living.jpg", outDesktop: "hero-rubi-living.webp", outMobile: "hero-rubi-living-mobile.webp" },
  { src: "celosias oficina.jpg", outDesktop: "hero-celosias-oficina.webp", outMobile: "hero-celosias-oficina-mobile.webp" },
];

function overwrite(p, buf, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    try {
      fs.writeFileSync(p, buf);
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      const sab = new SharedArrayBuffer(4);
      Atomics.wait(new Int32Array(sab), 0, 0, 300);
    }
  }
}

(async () => {
  for (const it of items) {
    const srcPath = path.join(DL, it.src);

    const desktopBuf = await sharp(srcPath)
      .resize({ width: 1600, height: 900, fit: "cover" })
      .webp({ quality: 96 })
      .toBuffer();
    overwrite(path.join(OUT, it.outDesktop), desktopBuf);

    const mobileBuf = await sharp(srcPath)
      .resize({ width: 1080, height: 1920, fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 96 })
      .toBuffer();
    overwrite(path.join(OUT, it.outMobile), mobileBuf);

    console.log(it.outDesktop, "1600x900,", desktopBuf.length, "bytes");
    console.log(it.outMobile, "1080x1920,", mobileBuf.length, "bytes");
  }
})();
