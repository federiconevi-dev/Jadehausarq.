import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as mupdf from "mupdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = "C:/Users/Fede/Downloads/jade-logo/Logo Jade copia.pdf";
const OUT_DIR = path.join(__dirname, "..", "assets", "img");

const data = fs.readFileSync(PDF_PATH);
const doc = mupdf.Document.openDocument(data, "application/pdf");
const page = doc.loadPage(0);
const bounds = page.getBounds();
console.log("Page bounds:", bounds);

const scale = 6;
const matrix = mupdf.Matrix.scale(scale, scale);
const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
const pngData = pixmap.asPNG();
const rawPath = path.join(OUT_DIR, "logo-raw.png");
fs.writeFileSync(rawPath, Buffer.from(pngData));
console.log("Wrote", rawPath, pixmap.getWidth(), "x", pixmap.getHeight());
