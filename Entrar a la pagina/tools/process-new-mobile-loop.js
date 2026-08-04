const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// User wants the mobile/tablet hero loop entirely replaced with these 3
// photos (desktop loop untouched, separate set). Sources are already
// genuine portrait (9:16-ish) — 1080 width matches the existing mobile
// hero convention (hero-celosias-mobile.webp etc.), comfortably sharp on
// any real phone screen while keeping file size sane (sources were
// 1.6-5.2MB each, way past what's useful at mobile display size).
const items = [
  { src: "loop celu 1.jpg", out: "hero-terracota-pileta-mobile.webp" },
  { src: "loop celu 3.jpg", out: "hero-blanca-angular-mobile.webp" },
  { src: "loop celu 3 (1).jpg", out: "hero-rubi-cocina-mobile.webp" },
];

(async () => {
  for (const it of items) {
    const srcPath = path.join(DL, it.src);
    const meta = await sharp(srcPath).metadata();
    const buf = await sharp(srcPath)
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 93 })
      .toBuffer();
    fs.writeFileSync(path.join(OUT, it.out), buf);
    const outMeta = await sharp(buf).metadata();
    console.log(it.out, meta.width + "x" + meta.height, "->", outMeta.width + "x" + outMeta.height, (buf.length / 1024).toFixed(0) + "KB");
  }
})();
