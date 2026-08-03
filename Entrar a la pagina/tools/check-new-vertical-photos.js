const sharp = require("sharp");
const path = require("path");

const DIR = "C:\\Users\\Fede\\Downloads\\fotos-jade-haus";
const files = ["image-1785799624760.webp", "image-1785799631232.webp"];

(async () => {
  for (const f of files) {
    const m = await sharp(path.join(DIR, f)).metadata();
    console.log(f, m.width + "x" + m.height, "orientation:", m.width > m.height ? "landscape" : "portrait");
  }
})();
