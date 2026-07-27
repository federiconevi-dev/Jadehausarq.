// Dev-time only. Converts source photos to optimized WebP. Not shipped to Hostinger.
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "photos", "source");
const OUT = path.join(__dirname, "..", "assets", "img");

// [srcFile, outFile, maxWidth, quality]
const jobs = [
  // Hero / large editorial
  ["celosia-atardecer-flare.jpeg", "hero.webp", 2000, 78],
  ["celosia-noche-1.jpeg", "hero-menu.webp", 1600, 78],

  // Nosotros
  ["celosia-interior-rojo.jpeg", "nosotros.webp", 1400, 80],

  // Catalog category covers
  ["celosia-dia-1.jpeg", "catalog-celosias-cover.webp", 1200, 80],

  // Materials / palette strip
  ["celosia-muestra-colores.jpeg", "muestra-colores.webp", 1400, 82],

  // Product card images (celosías slides) — 1100px q80
  ["celosia-noche-1.jpeg", "product-celosia-noche-1.webp", 1100, 80],
  ["celosia-atardecer-1.jpeg", "product-celosia-atardecer-1.webp", 1100, 80],
  ["celosia-dia-1.jpeg", "product-celosia-dia-1.webp", 1100, 80],
  ["celosia-atardecer-2.jpeg", "product-celosia-atardecer-2.webp", 1100, 80],
  ["celosia-atardecer-3.jpeg", "product-celosia-atardecer-3.webp", 1100, 80],
  ["celosia-noche-2.jpeg", "product-celosia-noche-2.webp", 1100, 80],
  ["celosia-detalle-macro.jpeg", "product-celosia-detalle-macro.webp", 1100, 80],
  ["celosia-atardecer-flare.jpeg", "product-celosia-atardecer-flare.webp", 1100, 80],
  ["celosia-interior-rojo.jpeg", "product-celosia-interior-rojo.webp", 1100, 80],
];

(async () => {
  for (const [src, out, width, quality] of jobs) {
    const inPath = path.join(SRC, src);
    const outPath = path.join(OUT, out);
    await sharp(inPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outPath);
    console.log("OK", out);
  }
  console.log("Done.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
