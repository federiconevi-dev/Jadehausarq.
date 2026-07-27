const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Dedicated portrait crops for phone/tablet — the user sent these already
// composed as verticals (unlike the 16:9 desktop hero photos), so no crop
// needed here, just resize down to a sane max width for a phone screen.
const jobs = [
  { src: path.join(DL, "celular 01.jpg"), out: "hero-celosias-mobile.webp" },
  { src: path.join(DL, "celular02.jpg"), out: "hero-az-geo-mobile.webp" },
  { src: path.join(DL, "celular03.jpg"), out: "hero-az-clasico-mobile.webp" },
];

(async () => {
  for (const j of jobs) {
    const meta = await sharp(j.src).metadata();
    console.log(j.out, "source:", meta.width + "x" + meta.height);
    await sharp(j.src)
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(path.join(OUT, j.out));
    const outMeta = await sharp(path.join(OUT, j.out)).metadata();
    console.log("  ->", outMeta.width + "x" + outMeta.height);
  }
})();
