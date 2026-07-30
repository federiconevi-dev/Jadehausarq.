const sharp = require("sharp");
const path = require("path");

const DL = "C:\\Users\\Fede\\Downloads";
const OUT = path.join(__dirname, "..", "assets", "img");

async function meta(file, fromDL) {
  const m = await sharp(fromDL ? path.join(DL, file) : path.join(OUT, file)).metadata();
  console.log(file, m.width + "x" + m.height);
}

(async () => {
  console.log("=== sources still on disk (Downloads) ===");
  for (const f of ["CARAMELO CENT.jpg", "CARAMELO DESC.jpg", "RUBI CENT.jpg", "RUBI DESC.jpg", "DSC_0799.jpg", "GRIS DESC.jpg", "VA CENT.jpg", "VA DESC.jpg", "V OSC CENTR.jpg", "VERDE OSC DESC.jpg", "puerta negra.jpg", "pared roja con agujeros cocina.jpg", "pared blanca con agujeros.jpg", "pared roja con agujeros y cortina atras.jpg"]) {
    await meta(f, true);
  }
  console.log("=== currently-used assets ===");
  for (const f of ["product-celosia-caramelo-cent.webp", "product-celosia-header.webp", "hero-celosias.webp", "hero-az-geo.webp", "hero-az-clasico.webp", "cat-celosias-cover-new.jpg", "cat-az-geo-cover-new.jpg", "cat-az-clasico-cover-new.jpg", "product-celosia-dia-1.webp", "product-celosia-detalle-macro.webp"]) {
    await meta(f, false);
  }
})();
