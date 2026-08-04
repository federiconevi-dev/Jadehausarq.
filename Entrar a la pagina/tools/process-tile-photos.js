const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Already exactly 1080x1920 (mobile portrait) — used as-is, no crop, just
// re-encoded to webp at high quality.
const items = [
  { src: "celular02.jpg", out: "hero-hex-canilla-negra-mobile.webp" },
  { src: "celular03.jpg", out: "hero-ondas-terracota-mobile.webp" },
];

(async () => {
  for (const it of items) {
    const buf = await sharp(path.join(DL, it.src)).webp({ quality: 93 }).toBuffer();
    fs.writeFileSync(path.join(OUT, it.out), buf);
    const m = await sharp(buf).metadata();
    console.log(it.out, m.width + "x" + m.height, (buf.length / 1024).toFixed(0) + "KB");
  }
})();
