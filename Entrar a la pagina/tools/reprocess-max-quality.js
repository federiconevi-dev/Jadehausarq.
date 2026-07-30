const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const SRC = path.join(__dirname, "..", "assets", "photos", "source");
const OUT = path.join(__dirname, "..", "assets", "img");

(async () => {
  // Celosía color pairs — real 3067x3067 originals were only ever used at
  // 550x550. Re-cropped at 2200x2200 (well past what any display shows
  // them at, even retina) and near-lossless quality.
  const colors = [
    { slug: "caramelo", cent: "CARAMELO CENT.jpg", desc: "CARAMELO DESC.jpg" },
    { slug: "rubi", cent: "RUBI CENT.jpg", desc: "RUBI DESC.jpg" },
    { slug: "gris", cent: "DSC_0799.jpg", desc: "GRIS DESC.jpg" },
    { slug: "va", cent: "VA CENT.jpg", desc: "VA DESC.jpg" },
    { slug: "verde-oscuro", cent: "V OSC CENTR.jpg", desc: "VERDE OSC DESC.jpg" },
  ];
  for (const c of colors) {
    for (const [suffix, file] of [["cent", c.cent], ["desc", c.desc]]) {
      await sharp(path.join(DL, file))
        .resize({ width: 2200, height: 2200, fit: "cover" })
        .webp({ quality: 95 })
        .toFile(path.join(OUT, `product-celosia-${c.slug}-${suffix}.webp`));
    }
    console.log(c.slug, "done (2200x2200)");
  }

  // Original celosía installation/detail photoshoot — sources are 1600x1600
  // (except detalle-macro, native 571x571), currently only used at 1100x1100.
  const installShots = [
    ["celosia-atardecer-1.jpeg", "product-celosia-atardecer-1.webp"],
    ["celosia-atardecer-2.jpeg", "product-celosia-atardecer-2.webp"],
    ["celosia-atardecer-3.jpeg", "product-celosia-atardecer-3.webp"],
    ["celosia-atardecer-flare.jpeg", "product-celosia-atardecer-flare.webp"],
    ["celosia-dia-1.jpeg", "product-celosia-dia-1.webp"],
    ["celosia-interior-rojo.jpeg", "product-celosia-interior-rojo.webp"],
    ["celosia-noche-1.jpeg", "product-celosia-noche-1.webp"],
    ["celosia-noche-2.jpeg", "product-celosia-noche-2.webp"],
  ];
  for (const [src, out] of installShots) {
    await sharp(path.join(SRC, src))
      .resize({ width: 1600, height: 1600, fit: "cover" })
      .webp({ quality: 95 })
      .toFile(path.join(OUT, out));
  }
  console.log("install shots done (1600x1600, native)");

  // detalle-macro's own source is only 571x571 — re-encoding at max quality
  // is all that's possible here, no extra resolution to gain.
  await sharp(path.join(SRC, "celosia-detalle-macro.jpeg"))
    .webp({ quality: 96 })
    .toFile(path.join(OUT, "product-celosia-detalle-macro.webp"));
  console.log("detalle-macro re-encoded (native 571x571, can't go higher)");
})();
