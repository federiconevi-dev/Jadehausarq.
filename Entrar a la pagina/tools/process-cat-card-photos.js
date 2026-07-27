const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Full, uncropped photos for the catálogo overview cards — no crop at all
// this time (fit: "inside" scales down to fit within the box but never
// cuts anything off), at a high enough resolution that they stay sharp
// even zoomed in on a large screen.
const jobs = [
  { src: path.join(DL, "catalogo provisorio 1.jpg"), out: "cat-celosias-cover2.webp" },
  { src: path.join(DL, "catalogo provisorio 2.jpg"), out: "cat-az-geo-cover2.webp" },
  { src: path.join(DL, "catalogo provisorio 3 clasico.jpg"), out: "cat-az-clasico-cover2.webp" },
];

(async () => {
  for (const j of jobs) {
    await sharp(j.src)
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(OUT, j.out));
    const meta = await sharp(path.join(OUT, j.out)).metadata();
    console.log(j.out, meta.width + "x" + meta.height);
  }
})();
