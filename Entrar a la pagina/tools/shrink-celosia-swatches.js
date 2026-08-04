const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "assets", "img");

// These display in a 2-col grid inside the product card — max realistic
// display width even on the widest desktop panel is ~350px, so ~700px at
// 2x retina is already generous. 2200x2200 was 3x more than any display
// could use, at ~1.1-1.4MB each — that gap between the (small, fast) header
// photo and these (huge) swatches is what read as "they load separately".
// 1200x1200 stays well above anything actually needed while cutting the
// byte size dramatically.
const colors = ["caramelo", "rubi", "gris", "va", "verde-oscuro"];

(async () => {
  for (const c of colors) {
    for (const suffix of ["cent", "desc"]) {
      const f = `product-celosia-${c}-${suffix}.webp`;
      const p = path.join(DIR, f);
      const before = fs.statSync(p).size;
      const buf = await sharp(p).resize({ width: 1200, height: 1200, fit: "cover" }).webp({ quality: 90 }).toBuffer();
      fs.writeFileSync(p + ".new", buf);
      console.log(f, (before / 1024).toFixed(0) + "KB ->", (buf.length / 1024).toFixed(0) + "KB");
    }
  }
})();
