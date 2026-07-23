const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Portrait (3:4) crops for the catálogo overview cards, made from the
// original full-res source photos — reusing the wide 1600x900 hero crop
// via plain object-fit:cover looked bad (a 16:9 photo squeezed into a 3:4
// card only shows a narrow center sliver). These pick a sensible focal
// side/region instead.
const jobs = [
  { src: path.join(DL, "SLIDE01 CELOSIAS.jpg"), out: "cat-celosias-cover2.webp", position: "left" },
  { src: path.join(DL, "SLIDE 02 GEOMETRICO.jpg"), out: "cat-az-geo-cover2.webp", position: "centre" },
  { src: path.join(DL, "SLIDE 03 CLASICO.jpg"), out: "cat-az-clasico-cover2.webp", position: "centre" },
];

(async () => {
  for (const j of jobs) {
    await sharp(j.src)
      .resize({ width: 960, height: 1280, fit: "cover", position: j.position })
      .webp({ quality: 84 })
      .toFile(path.join(OUT, j.out));
    const meta = await sharp(path.join(OUT, j.out)).metadata();
    console.log(j.out, meta.width + "x" + meta.height);
  }
})();
