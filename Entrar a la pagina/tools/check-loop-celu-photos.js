const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const files = ["loop celu 1.jpg", "loop celu 3.jpg", "loop celu 3 (1).jpg"];

(async () => {
  for (const f of files) {
    const m = await sharp(path.join(DL, f)).metadata();
    console.log(f, m.width + "x" + m.height, "orientation:", m.width > m.height ? "landscape" : "portrait");
  }
})();
