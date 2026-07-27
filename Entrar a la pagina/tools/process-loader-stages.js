const sharp = require("sharp");
const path = require("path");

const SRC_DIR = "C:/Users/Fede/Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");
const INK = [244, 242, 236]; // --panel-ink (white, for the dark loader background)

// Source PNGs are already black ink on a transparent background — just
// swap the ink color to white and keep the existing alpha untouched.
async function recolorToWhite(inputPath, outName, height) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4] = INK[0];
    rgba[i * 4 + 1] = INK[1];
    rgba[i * 4 + 2] = INK[2];
    rgba[i * 4 + 3] = data[i * 4 + 3];
  }
  const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .trim()
    .toBuffer();
  const outPath = path.join(OUT, outName + ".webp");
  await sharp(trimmed).resize({ height, withoutEnlargement: true }).webp({ quality: 95 }).toFile(outPath);
  const m = await sharp(outPath).metadata();
  console.log(outName, m.width, "x", m.height, "alpha:", m.hasAlpha);
}

(async () => {
  // Same height (320) as the existing logo-mark-white.webp so the JH mark
  // reads at a consistent scale across all three loader stages.
  await recolorToWhite(path.join(SRC_DIR, "Logo Jade2.png"), "loader-stage-tagline", 320);
  await recolorToWhite(path.join(SRC_DIR, "Logo Jade3.png"), "loader-stage-wordmark", 320);
})().catch((e) => { console.error(e); process.exit(1); });
