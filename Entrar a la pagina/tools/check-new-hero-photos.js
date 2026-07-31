const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const files = ["rubi living.jpg", "celosias oficina.jpg"];

(async () => {
  for (const f of files) {
    const m = await sharp(path.join(DL, f)).metadata();
    console.log(f, m.width + "x" + m.height, "ratio:", (m.width / m.height).toFixed(3));
  }
  console.log("target desktop ratio (1600x900):", (1600 / 900).toFixed(3));
  console.log("target mobile ratio (1080x1920):", (1080 / 1920).toFixed(3));
})();
