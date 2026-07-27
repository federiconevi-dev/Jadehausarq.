// Dev-time only. Generates static HTML for catalog slides + dots from manifest.js data,
// so the deliverable ships hardcoded content (works without JS) with a single data source.
global.window = {};
require("../lib/manifest.js");
const DATA = global.window.__BRAND__;

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function slideHTML(slide, i, total, catName) {
  return `              <div class="product-slide" data-slider-slide role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${total}">
                <article class="product-card">
                  <div class="product-swatch" style="background-color:${slide.color};" aria-hidden="true"></div>
                  <div class="product-photos">
                    <img src="${slide.img1}" alt="${esc(slide.name)}, instalación" loading="lazy" decoding="async" width="550" height="550" />
                    <img src="${slide.img2}" alt="${esc(slide.name)}, detalle" loading="lazy" decoding="async" width="550" height="550" />
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">${esc(slide.name)}</h3>
                    <p class="product-code">${esc(slide.code)}</p>
                    <button type="button" class="btn btn-outline product-cta" data-consult="${esc(slide.name)} (${esc(slide.code)})">Consultar</button>
                  </div>
                </article>
              </div>`;
}

function dotsHTML(total) {
  let out = "";
  for (let i = 0; i < total; i++) {
    out += `<button type="button" class="slider-dot${i === 0 ? " is-active" : ""}" data-slider-dot data-index="${i}" aria-label="Ir a la diapositiva ${i + 1}"></button>\n              `;
  }
  return out.trim();
}

DATA.catalogo.categories.forEach((cat) => {
  const slides = cat.slides.map((s, i) => slideHTML(s, i, cat.slides.length, cat.name)).join("\n");
  console.log(`\n<!-- ===== SLIDES: ${cat.id} (${cat.slides.length}) ===== -->\n${slides}\n`);
  console.log(`<!-- ===== DOTS: ${cat.id} ===== -->\n${dotsHTML(cat.slides.length)}\n`);
});
