const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Redo these 2 mobile crops plain-centered (matching every other hero mobile
// crop in the site) instead of sharp.strategy.attention, which zoomed into
// a small high-contrast detail instead of showing the photo normally —
// that mismatch with the rest of the site's convention is what read as
// "mucho zoom" / "not the right image".
const items = [
  { src: "celosias oficina.jpg", outMobile: "hero-celosias-oficina-mobile.webp" },
  { src: "rubi living.jpg", outMobile: "hero-rubi-living-mobile.webp" },
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
    const buf = await sharp(path.join(DL, it.src))
      .resize({ width: 1080, height: 1920, fit: "cover", position: "centre" })
      .webp({ quality: 96 })
      .toBuffer();
    overwrite(path.join(OUT, it.outMobile), buf);
    console.log(it.outMobile, "1080x1920,", buf.length, "bytes (plain center crop)");
  }
})();
