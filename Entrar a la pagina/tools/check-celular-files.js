const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const files = ["celular 01.jpg", "celular02.jpg", "celular03.jpg"];

async function avgColor(p) {
  const { data, info } = await sharp(p).resize(50, 50).raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0;
  const n = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i]; g += data[i + 1]; b += data[i + 2];
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

(async () => {
  for (const f of files) {
    const m = await sharp(path.join(DL, f)).metadata();
    const avg = await avgColor(path.join(DL, f));
    // sample top strip (likely sky/ceiling) and a mid strip separately
    const top = await sharp(path.join(DL, f)).extract({ left: 0, top: 0, width: m.width, height: Math.floor(m.height * 0.15) }).resize(10, 10).raw().toBuffer({ resolveWithObject: true });
    let tr=0,tg=0,tb=0, tn = top.info.width*top.info.height;
    for (let i=0;i<top.data.length;i+=top.info.channels){ tr+=top.data[i]; tg+=top.data[i+1]; tb+=top.data[i+2]; }
    console.log(f, m.width + "x" + m.height, "fullAvg:", avg, "topStripAvg:", {r:Math.round(tr/tn),g:Math.round(tg/tn),b:Math.round(tb/tn)});
  }
})();
