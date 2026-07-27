(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Jade Haus Arq.",
    shortName: "JH",
    tagline: "Forma, luz y materia.",

    nav: [
      { label: "Inicio", href: "#inicio" },
      { label: "Nosotros", href: "#nosotros" },
      { label: "Catálogo", href: "#catalogo" },
      { label: "Contacto", href: "#contacto" }
    ],

    hero: {
      kicker: "ESTUDIO DE DISEÑO ARQUITECTÓNICO",
      title: "La luz\ntambién se\ndiseña.",
      subtitle: "Revestimientos cerámicos y celosías de autor para una arquitectura contemporánea.",
      image: "assets/img/hero.webp"
    },

    nosotros: {
      eyebrow: "EL ESTUDIO",
      title: "Materia con intención.",
      paragraphs: [
        "Jade Haus Arq. es un estudio de arquitectura y diseño dedicado a la creación de superficies cerámicas que transforman la manera en que la luz habita un espacio. Trabajamos junto a arquitectos, interioristas y desarrolladores en proyectos residenciales, comerciales y de hospitalidad.",
        "Cada colección — celosías, azulejos geométricos, azulejos clásicos — nace de un mismo principio: el material como herramienta de composición espacial, no como decoración añadida."
      ],
      image: "assets/img/nosotros.webp",
      stats: [
        { value: "12", suffix: "+", label: "años de oficio" },
        { value: "180", suffix: "+", label: "proyectos realizados" },
        { value: "20", suffix: "", label: "acabados de color" }
      ]
    },

    catalogo: {
      eyebrow: "CATÁLOGO",
      title: "Tres colecciones, un mismo lenguaje.",
      categories: [
        {
          id: "celosias",
          name: "Celosías",
          eyebrow: "PIEZA CERÁMICA PERFORADA",
          cover: "assets/img/catalog-celosias-cover.webp",
          description: "Paneles cerámicos perforados que filtran la luz natural y definen umbrales entre interior y exterior.",
          slides: [
            { name: "Celosía Circular — Terracota", code: "JH-CL-01", color: "#b5601f", img1: "assets/img/product-celosia-dia-1.webp", img2: "assets/img/product-celosia-detalle-macro.webp" },
            { name: "Celosía Circular — Burdeos", code: "JH-CL-02", color: "#7a1f2b", img1: "assets/img/product-celosia-interior-rojo.webp", img2: "assets/img/product-celosia-detalle-macro.webp" },
            { name: "Celosía Circular — Turquesa", code: "JH-CL-03", color: "#1f9e9c", img1: "assets/img/product-celosia-atardecer-1.webp", img2: "assets/img/product-celosia-dia-1.webp" },
            { name: "Celosía Circular — Gris Piedra", code: "JH-CL-04", color: "#a9a29a", img1: "assets/img/product-celosia-noche-1.webp", img2: "assets/img/product-celosia-detalle-macro.webp" },
            { name: "Celosía Circular — Verde Petróleo", code: "JH-CL-05", color: "#14625f", img1: "assets/img/product-celosia-atardecer-2.webp", img2: "assets/img/product-celosia-atardecer-flare.webp" },
            { name: "Celosía Circular — Ámbar", code: "JH-CL-06", color: "#c9862f", img1: "assets/img/product-celosia-atardecer-3.webp", img2: "assets/img/product-celosia-noche-2.webp" },
            { name: "Celosía Circular — Cobre", code: "JH-CL-07", color: "#a45a2a", img1: "assets/img/product-celosia-atardecer-flare.webp", img2: "assets/img/product-celosia-dia-1.webp" },
            { name: "Celosía Circular — Antracita", code: "JH-CL-08", color: "#3a3a3a", img1: "assets/img/product-celosia-noche-2.webp", img2: "assets/img/product-celosia-interior-rojo.webp" }
          ]
        },
        {
          id: "geometricos",
          name: "Azulejos Geométricos",
          eyebrow: "REVESTIMIENTO CONTEMPORÁNEO",
          cover: "assets/img/az-geo-cover.webp",
          description: "Trazos geométricos de precisión industrial para superficies que ordenan el espacio con ritmo propio.",
          slides: [
            { name: "Azulejo Hexagonal — Blanco Hueso", code: "JH-AG-01", color: "#ece7de", img1: "assets/img/az-geo-1.webp", img2: "assets/img/az-geo-2.webp" },
            { name: "Azulejo Triangular — Grafito", code: "JH-AG-02", color: "#2e2e2e", img1: "assets/img/az-geo-3.webp", img2: "assets/img/az-geo-4.webp" },
            { name: "Azulejo Losange — Arena", code: "JH-AG-03", color: "#cbb896", img1: "assets/img/az-geo-5.webp", img2: "assets/img/az-geo-6.webp" },
            { name: "Azulejo Panal — Musgo", code: "JH-AG-04", color: "#5c6b4f", img1: "assets/img/az-geo-7.webp", img2: "assets/img/az-geo-8.webp" }
          ]
        },
        {
          id: "clasicos",
          name: "Azulejos Clásicos",
          eyebrow: "REVESTIMIENTO DE AUTOR",
          cover: "assets/img/az-clas-cover.webp",
          description: "Piezas de raíz artesanal reinterpretadas para la arquitectura contemporánea, sin perder su carácter.",
          slides: [
            { name: "Azulejo Sevillano — Cobalto", code: "JH-AC-01", color: "#2a4d8f", img1: "assets/img/az-clas-1.webp", img2: "assets/img/az-clas-2.webp" },
            { name: "Azulejo Portugués — Blanco Roto", code: "JH-AC-02", color: "#e8e2d5", img1: "assets/img/az-clas-3.webp", img2: "assets/img/az-clas-4.webp" },
            { name: "Azulejo Victoriano — Vino", code: "JH-AC-03", color: "#6b1f2b", img1: "assets/img/az-clas-5.webp", img2: "assets/img/az-clas-6.webp" },
            { name: "Azulejo Hidráulico — Ocre", code: "JH-AC-04", color: "#b57b2e", img1: "assets/img/az-clas-7.webp", img2: "assets/img/az-clas-8.webp" },
            { name: "Azulejo Mosaico — Verde Botella", code: "JH-AC-05", color: "#2f4a3a", img1: "assets/img/az-clas-9.webp", img2: "assets/img/az-clas-1.webp" },
            { name: "Azulejo Toscano — Terracota", code: "JH-AC-06", color: "#a85c33", img1: "assets/img/az-clas-2.webp", img2: "assets/img/az-clas-3.webp" },
            { name: "Azulejo Provenzal — Azul Cielo", code: "JH-AC-07", color: "#7fa8c9", img1: "assets/img/az-clas-4.webp", img2: "assets/img/az-clas-5.webp" },
            { name: "Azulejo Clásico — Marfil", code: "JH-AC-08", color: "#ded4bd", img1: "assets/img/az-clas-7.webp", img2: "assets/img/az-clas-9.webp" }
          ]
        }
      ]
    },

    contacto: {
      eyebrow: "CONTACTO",
      title: "Hablemos de su proyecto.",
      text: "Escríbanos para recibir el catálogo completo, muestras físicas de color o coordinar una visita al showroom.",
      email: "hola@jadehausarq.com",
      phone: "+54 11 5555-0134",
      address: "Av. del Libertador 1234, Buenos Aires, Argentina",
      hours: "Lunes a viernes · 9 a 18 h"
    },

    social: [
      { label: "Instagram", href: "https://instagram.com/jadehausarq" },
      { label: "Pinterest", href: "https://pinterest.com/jadehausarq" }
    ],

    footer: {
      note: "Estudio de diseño arquitectónico.",
      copyright: "© 2026 Jade Haus Arq. Todos los derechos reservados."
    }
  };
})();
