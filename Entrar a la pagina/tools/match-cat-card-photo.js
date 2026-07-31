const sharp = require("sharp");
const path = require("path");

const IMG = path.join(__dirname, "..", "assets", "img");

// User wants the Celosías catálogo overview card (portrait, cat-card-media)
// to show the SAME photo as the home hero loop's first slide (the pool
// shot), instead of the tighter red close-up it had before. The mobile hero
// crop (1080x1920, portrait) is the best available source for a 3:4 portrait
// card — cropping the 1600x900 desktop version to 3:4 would mean upscaling.
(async () => {
  await sharp(path.join(IMG, "hero-celosias-mobile.webp"))
    .resize({ width: 1080, height: 1440, fit: "cover", position: "centre" })
    .resize({ width: 960, height: 1280, fit: "cover" })
    .jpeg({ quality: 95 })
    .toFile(path.join(IMG, "cat-celosias-cover-new.jpg"));
  console.log("cat-celosias-cover-new.jpg replaced with hero pool photo (960x1280)");
})();
