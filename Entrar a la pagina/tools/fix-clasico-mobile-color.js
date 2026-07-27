const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// The mobile hero photo for Clásicos (from celular03.jpg) turned out to be
// the orange/copper colorway, while the desktop one (from SLIDE 03
// CLASICO.jpg) is the red/rust colorway the user actually wants — same
// wavy-fan pattern, two different color batches sent at different times.
// Regenerating mobile from the SAME red source as desktop, portrait-cropped,
// so both breakpoints show the same red tile consistently.
sharp(path.join(DL, "slide clasico.jpg"))
  .resize({ width: 1080, height: 1920, fit: "cover", position: "centre" })
  .webp({ quality: 84 })
  .toFile(path.join(OUT, "hero-az-clasico-mobile.webp"))
  .then(async () => {
    const meta = await sharp(path.join(OUT, "hero-az-clasico-mobile.webp")).metadata();
    console.log("hero-az-clasico-mobile.webp ->", meta.width + "x" + meta.height);
  });
