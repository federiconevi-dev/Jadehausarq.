const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// New celosía color lineup — replaces the old 8 (Terracota/Burdeos/etc).
// CENT/DESC = centrada/descentrada, the two framings of the same piece per
// color, matching the existing product-photos convention (2 square shots).
// GRIS and VERDE OSC each only came with one half of their pair explicitly
// named — DSC_0799.jpg (a plain grey piece, unrenamed by the camera) is the
// missing GRIS "centrada", and V OSC CENTR.jpg + VERDE OSC DESC.jpg are the
// same "Verde Oscuro" pair just labelled inconsistently.
const colors = [
  { slug: "caramelo", cent: "CARAMELO CENT.jpg", desc: "CARAMELO DESC.jpg" },
  { slug: "rubi", cent: "RUBI CENT.jpg", desc: "RUBI DESC.jpg" },
  { slug: "gris", cent: "DSC_0799.jpg", desc: "GRIS DESC.jpg" },
  { slug: "va", cent: "VA CENT.jpg", desc: "VA DESC.jpg" },
  { slug: "verde-oscuro", cent: "V OSC CENTR.jpg", desc: "VERDE OSC DESC.jpg" },
];

(async () => {
  for (const c of colors) {
    await sharp(path.join(DL, c.cent))
      .resize({ width: 550, height: 550, fit: "cover" })
      .webp({ quality: 86 })
      .toFile(path.join(OUT, `product-celosia-${c.slug}-cent.webp`));
    await sharp(path.join(DL, c.desc))
      .resize({ width: 550, height: 550, fit: "cover" })
      .webp({ quality: 86 })
      .toFile(path.join(OUT, `product-celosia-${c.slug}-desc.webp`));
    console.log(c.slug, "done");
  }

  // Shared, static header photo for all 5 — same lifestyle shot already
  // used for the hero (original download since cleaned up, so reprocessed
  // from the already-saved hero-celosias.webp instead), sized for the
  // product-card header specifically (16:9, matching its own ratio).
  await sharp(path.join(OUT, "hero-celosias.webp"))
    .resize({ width: 1200, height: 675, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(path.join(OUT, "product-celosia-header.webp"));
  console.log("header done");
})();
