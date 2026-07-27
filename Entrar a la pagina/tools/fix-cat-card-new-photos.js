const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

// Fixing a mix-up: the geo/clasico catálogo cards were showing swapped
// photos (geo had the clásico "provisorio 3" tile, clásico had the "slide
// clasico" hero photo, and "provisorio 2" — the green diagonal tile — was
// never used anywhere). Correct mapping by content, verified visually:
//   celosias  -> catalogo provisorio 1.jpg (red celosía wall) — already correct
//   geo       -> catalogo provisorio 2.jpg (green diagonal tile)
//   clasico   -> catalogo provisorio 3 clasico.jpg (orange wavy-fan mosaic)
// Matches the existing cat-*-cover-new.jpg files' own format (1024x576 cover-fit JPEG).
const jobs = [
  { src: path.join(DL, "catalogo provisorio 2.jpg"), out: "cat-az-geo-cover-new.jpg" },
  { src: path.join(DL, "catalogo provisorio 3 clasico.jpg"), out: "cat-az-clasico-cover-new.jpg" },
];

(async () => {
  for (const j of jobs) {
    await sharp(j.src)
      .resize({ width: 1024, height: 576, fit: "cover" })
      .jpeg({ quality: 88 })
      .toFile(path.join(OUT, j.out));
    const meta = await sharp(path.join(OUT, j.out)).metadata();
    console.log(j.out, meta.width + "x" + meta.height, meta.format);
  }
})();
