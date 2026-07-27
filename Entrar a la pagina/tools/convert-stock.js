// Dev-time only. Converts Openverse stock photos to optimized WebP.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "photos", "source", "stock");
const OUT = path.join(__dirname, "..", "assets", "img");

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));

(async () => {
  for (const f of files) {
    const id = f.replace(/\.(jpe?g|png)$/i, "");
    const isCover = id.endsWith("-cover");
    const width = isCover ? 1200 : 1100;
    const outFile = `${id}.webp`;
    await sharp(path.join(SRC, f))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(OUT, outFile));
    console.log("OK", outFile);
  }
  console.log("Done.", files.length, "files.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
