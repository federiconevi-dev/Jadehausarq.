const sharp = require("sharp");
const path = require("path");

const IMG = path.join(__dirname, "..", "assets", "img");

(async () => {
  const a = await sharp(path.join(IMG, "product-celosia-header.webp")).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(path.join(IMG, "hero-celosias.webp")).resize(a.info.width, a.info.height).raw().toBuffer({ resolveWithObject: true });
  let diff = 0;
  const n = Math.min(a.data.length, b.data.length);
  for (let i = 0; i < n; i += 97) {
    diff += Math.abs(a.data[i] - b.data[i]);
  }
  console.log("header dims:", a.info.width + "x" + a.info.height);
  console.log("avg sampled diff vs hero-celosias:", (diff / (n / 97)).toFixed(2), "(near 0 = same photo)");
})();
