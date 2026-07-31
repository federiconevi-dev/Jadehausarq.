const sharp = require("sharp");
const path = require("path");

const IMG = path.join(__dirname, "..", "assets", "img");

// The fixed horizontal photo above each celosía product (product-celosia-header.webp)
// had been set to the hero pool shot. User wants it to instead be the red close-up
// photo (same one shown on the Celosías catálogo overview card, cat-celosias-cover-new.jpg).
// That card's source is only 1024x576 (true original lost) — upscaled here to the
// 1600x900 the product header slot needs, since no higher-res source exists.
(async () => {
  await sharp(path.join(IMG, "cat-celosias-cover-new.jpg"))
    .resize({ width: 1600, height: 900, fit: "cover", kernel: "lanczos3" })
    .webp({ quality: 96 })
    .toFile(path.join(IMG, "product-celosia-header.webp"));
  console.log("product-celosia-header.webp replaced with the red close-up photo (1600x900)");
})();
