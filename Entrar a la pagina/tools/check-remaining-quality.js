const sharp = require("sharp");
const path = require("path");

const OUT = path.join(__dirname, "..", "assets", "img");
const files = [
  "hero-celosias.webp", "hero-celosias-mobile.webp",
  "hero-az-geo.webp", "hero-az-geo-mobile.webp",
  "hero-az-clasico.webp", "hero-az-clasico-mobile.webp",
  "cat-celosias-cover-new.jpg", "cat-az-geo-cover-new.jpg", "cat-az-clasico-cover-new.jpg",
  "hero-puerta-negra.webp", "hero-pared-roja-cocina.webp",
  "hero-pared-blanca-mobile.webp", "hero-pared-roja-cortina-mobile.webp",
];

(async () => {
  for (const f of files) {
    try {
      const m = await sharp(path.join(OUT, f)).metadata();
      console.log(f, m.width + "x" + m.height, m.size ? (m.size / 1024).toFixed(0) + "KB" : "");
    } catch (e) {
      console.log(f, "ERROR", e.message);
    }
  }
})();
