const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "assets", "img");

(async () => {
  const files = ["az-geo-1.webp", "az-geo-2.webp", "az-clasico-1.webp",
    "product-celosia-caramelo-cent.webp", "product-celosia-caramelo-desc.webp"];
  for (const f of files) {
    const p = path.join(DIR, f);
    if (!fs.existsSync(p)) { console.log(f, "MISSING"); continue; }
    const m = await sharp(p).metadata();
    const bytes = fs.statSync(p).size;
    console.log(f, m.width + "x" + m.height, (bytes / 1024).toFixed(0) + "KB");
  }
})();
