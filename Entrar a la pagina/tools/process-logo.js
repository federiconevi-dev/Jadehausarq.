const sharp = require("sharp");
const path = require("path");

const RAW = path.join(__dirname, "..", "assets", "img", "logo-raw.png");
const OUT = path.join(__dirname, "..", "assets", "img");

// Builds a transparent RGBA buffer from a black-ink-on-white grayscale image:
// alpha = inverted luminance, color = solid (black or white ink).
async function toTransparentInk(buf, inkColor) {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i++) {
    const alpha = 255 - data[i];
    rgba[i * 4] = inkColor[0];
    rgba[i * 4 + 1] = inkColor[1];
    rgba[i * 4 + 2] = inkColor[2];
    rgba[i * 4 + 3] = alpha;
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });
}

(async () => {
  const fullBuf = await sharp(RAW).trim({ background: "#ffffff", threshold: 10 }).png().toBuffer();
  const fullMeta = await sharp(fullBuf).metadata();

  const cropHeight = Math.round(fullMeta.height * 0.78);
  const markBuf = await sharp(fullBuf)
    .extract({ left: 0, top: 0, width: fullMeta.width, height: cropHeight })
    .trim({ background: "#ffffff", threshold: 10 })
    .png()
    .toBuffer();

  const jobs = [
    { buf: fullBuf, name: "logo-full", width: 1000, ink: [17, 18, 17] },   // --ink
    { buf: fullBuf, name: "logo-full-white", width: 1000, ink: [247, 246, 243] }, // --panel-ink
    { buf: markBuf, name: "logo-mark", height: 320, ink: [17, 18, 17] },
    { buf: markBuf, name: "logo-mark-white", height: 320, ink: [247, 246, 243] },
  ];

  for (const job of jobs) {
    const transparent = await toTransparentInk(job.buf, job.ink);
    const resized = job.width
      ? transparent.resize({ width: job.width, withoutEnlargement: true })
      : transparent.resize({ height: job.height, withoutEnlargement: true });
    const outPath = path.join(OUT, job.name + ".webp");
    await resized.webp({ quality: 95 }).toFile(outPath);
    const m = await sharp(outPath).metadata();
    console.log(job.name, m.width, "x", m.height, "alpha:", m.hasAlpha);
  }
})().catch((e) => { console.error(e); process.exit(1); });
