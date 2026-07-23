const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

const files = [
  { src: path.join(DL, "SLIDE01 CELOSIAS.jpg"), out: "hero-celosias.webp" },
  { src: path.join(DL, "SLIDE 02 GEOMETRICO.jpg"), out: "hero-az-geo.webp" },
  { src: path.join(DL, "SLIDE 03 CLASICO.jpg"), out: "hero-az-clasico.webp" },
];

(async () => {
  for (const f of files) {
    const meta = await sharp(f.src).metadata();
    console.log(f.out, "source:", meta.width + "x" + meta.height, meta.format);
    await sharp(f.src)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, f.out));
    const outMeta = await sharp(path.join(OUT, f.out)).metadata();
    console.log("  ->", f.out, outMeta.width + "x" + outMeta.height);
  }
})();
