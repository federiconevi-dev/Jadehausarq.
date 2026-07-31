const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "assets", "img");

// hero-celosias/az-geo/az-clasico were originally encoded at webp quality 82
// (process-hero-photos.js) — their true originals (SLIDE01 CELOSIAS.jpg etc.)
// are gone from Downloads, so this can't add back detail, but re-encoding at
// near-lossless quality removes the extra compression blockiness the q82
// pass added, which is the only quality gain still available for these.
// Plain writeFileSync('w') fails here with EPERM/UNKNOWN on Windows (some
// other process — AV scanner, the dev server — briefly holds the file), so
// this opens 'r+' and truncates instead, which succeeds where 'w' doesn't.
function sleepMs(ms) {
  const sab = new SharedArrayBuffer(4);
  Atomics.wait(new Int32Array(sab), 0, 0, ms);
}

function overwrite(p, buf, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    try {
      const fd = fs.openSync(p, "r+");
      fs.ftruncateSync(fd, 0);
      fs.writeSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      sleepMs(500);
    }
  }
}

const files = [
  "hero-celosias-mobile.webp",
  "hero-az-geo.webp", "hero-az-geo-mobile.webp",
  "hero-az-clasico.webp", "hero-az-clasico-mobile.webp",
];

(async () => {
  for (const f of files) {
    const p = path.join(OUT, f);
    const before = await sharp(p).metadata();
    const buf = await sharp(p).webp({ quality: 96 }).toBuffer();
    fs.writeFileSync(p + ".new", buf);
    console.log(f, before.width + "x" + before.height, "-> " + f + ".new, " + buf.length + " bytes");
  }
  const tmp = path.join(OUT, "hero-celosias.webp.tmp");
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
})();
