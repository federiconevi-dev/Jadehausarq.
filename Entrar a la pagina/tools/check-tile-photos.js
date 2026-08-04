const sharp = require("sharp");
const path = require("path");
const DL = "C:\\Users\\Fede\\Downloads";
(async () => {
  for (const f of ["celular02.jpg", "celular03.jpg"]) {
    const m = await sharp(path.join(DL, f)).metadata();
    console.log(f, m.width + "x" + m.height);
  }
})();
