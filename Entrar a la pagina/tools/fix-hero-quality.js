const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

(async () => {
  // puerta negra / pared roja cocina were upscaled 1097x617 -> 1600x900
  // (a ~46% stretch), which is what made them look soft/"raro" compared to
  // the other hero photos. Re-cropped at their own native resolution
  // instead (still 16:9-ish, no upscale) and re-encoded near-lossless.
  await sharp(path.join(DL, "puerta negra.jpg"))
    .resize({ width: 1097, height: 617, fit: "cover" })
    .webp({ quality: 96 })
    .toFile(path.join(OUT, "hero-puerta-negra.webp"));
  await sharp(path.join(DL, "pared roja con agujeros cocina.jpg"))
    .resize({ width: 1097, height: 617, fit: "cover" })
    .webp({ quality: 96 })
    .toFile(path.join(OUT, "hero-pared-roja-cocina.webp"));

  // Mobile portrait versions — source (1097x1950) already comfortably
  // covers the 1080x1920 target (no upscale), just bumping encode quality.
  await sharp(path.join(DL, "pared blanca con agujeros.jpg"))
    .resize({ width: 1080, height: 1920, fit: "cover" })
    .webp({ quality: 96 })
    .toFile(path.join(OUT, "hero-pared-blanca-mobile.webp"));
  await sharp(path.join(DL, "pared roja con agujeros y cortina atras.jpg"))
    .resize({ width: 1080, height: 1920, fit: "cover" })
    .webp({ quality: 96 })
    .toFile(path.join(OUT, "hero-pared-roja-cortina-mobile.webp"));

  // celosías/geo/clásico originals are gone from Downloads now, so these
  // are re-encoded from the already-saved webp (marginal gain: strips
  // re-compression, can't recover detail already lost at the first pass).
  for (const f of ["hero-celosias.webp", "hero-az-geo.webp", "hero-az-clasico.webp", "hero-celosias-mobile.webp", "hero-az-geo-mobile.webp", "hero-az-clasico-mobile.webp"]) {
    const buf = await sharp(path.join(OUT, f)).webp({ quality: 96 }).toBuffer();
    await sharp(buf).toFile(path.join(OUT, f));
  }

  for (const f of ["hero-puerta-negra.webp", "hero-pared-roja-cocina.webp", "hero-pared-blanca-mobile.webp", "hero-pared-roja-cortina-mobile.webp"]) {
    const m = await sharp(path.join(OUT, f)).metadata();
    console.log(f, m.width + "x" + m.height);
  }
  console.log("done");
})();
