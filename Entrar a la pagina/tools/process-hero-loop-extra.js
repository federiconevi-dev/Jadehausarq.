const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

(async () => {
  const files = [
    "puerta negra.jpg",
    "pared blanca con agujeros.jpg",
    "pared roja con agujeros cocina.jpg",
    "pared roja con agujeros y cortina atras.jpg",
  ];
  for (const f of files) {
    const m = await sharp(path.join(DL, f)).metadata();
    console.log(f, m.width + "x" + m.height);
  }

  // Desktop (16:9-ish, matching the other desktop hero photos): puerta negra, pared roja cocina
  await sharp(path.join(DL, "puerta negra.jpg"))
    .resize({ width: 1600, height: 900, fit: "cover" })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, "hero-puerta-negra.webp"));
  await sharp(path.join(DL, "pared roja con agujeros cocina.jpg"))
    .resize({ width: 1600, height: 900, fit: "cover" })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, "hero-pared-roja-cocina.webp"));

  // Mobile/tablet portrait: pared blanca, pared roja con cortina
  await sharp(path.join(DL, "pared blanca con agujeros.jpg"))
    .resize({ width: 1080, height: 1920, fit: "cover" })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, "hero-pared-blanca-mobile.webp"));
  await sharp(path.join(DL, "pared roja con agujeros y cortina atras.jpg"))
    .resize({ width: 1080, height: 1920, fit: "cover" })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, "hero-pared-roja-cortina-mobile.webp"));

  console.log("done");
})();
