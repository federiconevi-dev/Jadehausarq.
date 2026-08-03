# 🏛️ Jade Haus Arq. — Sitio Web Oficial

Sitio web corporativo para **Jade Haus Arq.**, primer fabricante de celosías cerámicas en Argentina. Estudio de diseño arquitectónico especializado en revestimientos cerámicos de autor.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🛠️ Tecnologías](#️-tecnologías)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Configuración](#️-configuración)
- [🎨 Diseño](#-diseño)
- [📱 Responsive](#-responsive)
- [♿ Accesibilidad](#-accesibilidad)
- [🔍 SEO](#-seo)
- [🚢 Despliegue](#-despliegue)
- [📝 Licencias](#-licencias)

---

## ✨ Características

### 🎬 Experiencia de Usuario
- **Loader animado** con intro de 2 beats (~4s primera carga, rápido en navegación)
- **Sistema de slides** fullscreen con transiciones suaves
- **Hero con rotación de imágenes** (3 fotos con efecto Ken Burns)
- **Transiciones FLIP** (First, Last, Invert, Play) entre Hero y Catálogo
- **Paneles laterales** para menú y catálogo de productos
- **Sliders táctiles** con scroll nativo y botones de navegación
- **Formulario de contacto** funcional con Formspree

### 🎨 Diseño Técnico
- **CSS puro** sin frameworks (optimizado, ~30KB)
- **JavaScript vanilla** sin dependencias externas
- **Animaciones suaves** con cubic-bezier personalizados
- **Variables CSS** para theming consistente
- **Prefers-reduced-motion** respetado
- **Lazy loading** de imágenes
- **WebP** para todas las imágenes

### ♿ Accesibilidad
- **ARIA labels** y roles semánticos
- **Focus trapping** en paneles modales
- **Skip links** para navegación por teclado
- **Alt texts descriptivos** en todas las imágenes
- **Navegación por teclado** completa

### 🔍 SEO Optimizado
- **Open Graph** completo (Facebook)
- **Twitter Cards**
- **JSON-LD structured data** (Schema.org)
- **Metadatos semánticos**
- **Sitemap.xml** listo para usar
- **robots.txt** configurado

---

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/federiconevi-dev/Jadehausarq..git
cd Jadehausarq.
```

2. **Abrir con Live Server**
   - Usa [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code
   - O cualquier servidor HTTP local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

3. **Abrir en navegador**
```
http://localhost:8000
```

---

## 🛠️ Tecnologías

### Core
- **HTML5** — Markup semántico
- **CSS3** — Variables, Grid, Flexbox, Animaciones
- **JavaScript ES5** — Compatible con navegadores antiguos

### Fonts
- **Archivo** (Google Fonts) — Títulos y navegación
- **Inter** (Google Fonts) — Cuerpo de texto
- **JetBrains Mono** (Google Fonts) — Códigos y etiquetas

### Servicios Externos
- **Formspree** — Envío de formularios por email
- **Google Fonts** — Tipografías web

---

## 📂 Estructura del Proyecto

```
Jadehausarq./
├── assets/
│   ├── img/                    # Imágenes (WebP)
│   │   ├── logo-mark.webp
│   │   ├── logo-mark-white.webp
│   │   ├── favicon.svg
│   │   ├── catalog-*.webp
│   │   ├── product-*.webp
│   │   └── az-*.webp
│   └── credits.json            # Créditos fotográficos CC
├── lib/
│   └── credits-render.js       # Carga créditos en página
├── index.html                  # Página principal
├── creditos.html               # Página de créditos
├── styles.css                  # Estilos principales
├── main.js                     # JavaScript principal
├── README.md                   # Este archivo
├── FORMSPREE-SETUP.md          # Instrucciones formulario
└── .gitignore
```

### Páginas

- **`index.html`** — Página principal con 4 secciones:
  - **Inicio (Hero)** — Presentación con rotación de imágenes
  - **Nosotros** — Historia del estudio
  - **Catálogo** — 3 colecciones de productos
  - **Contacto** — Formulario + mapa + datos

- **`creditos.html`** — Créditos de fotografías Creative Commons

---

## ⚙️ Configuración

### 1. Formulario de Contacto

El formulario usa **Formspree**. Para activarlo:

1. Regístrate en [formspree.io](https://formspree.io/register)
2. Crea un nuevo formulario
3. Copia tu Form ID
4. Edita `index.html` línea ~710:

```html
<!-- Reemplaza YOUR_FORM_ID con tu ID real -->
<form ... action="https://formspree.io/f/YOUR_FORM_ID" ...>
```

📖 **[Ver guía completa →](FORMSPREE-SETUP.md)**

### 2. Google Analytics (Opcional)

Añade antes de `</head>` en ambos HTML:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. Personalización de Datos

En `index.html`, busca y actualiza:

- **Email:** `hola@jadehausarq.com`
- **Teléfono:** `+54 11 5555-0134`
- **Dirección:** Av. del Libertador 1234, Buenos Aires
- **Redes sociales:**
  - Instagram: `https://instagram.com/jadehausarq`
  - Pinterest: `https://pinterest.com/jadehausarq`

---

## 🎨 Diseño

### Paleta de Colores

```css
/* Light mode */
--bg: #f7f6f3;           /* Fondo principal */
--ink: #131211;          /* Texto principal */
--line: rgba(19,18,17,0.14); /* Líneas/bordes */

/* Dark mode (paneles) */
--panel-bg: #141311;     /* Fondo oscuro */
--panel-ink: #f4f2ec;    /* Texto claro */
```

### Tipografía

- **Títulos:** Archivo (500-700)
- **Cuerpo:** Inter (300-500)
- **Mono:** JetBrains Mono (400-500)

### Breakpoints

```css
/* Mobile first */
@media (min-width: 540px)  { /* Tablet pequeña */ }
@media (min-width: 720px)  { /* Tablet */ }
@media (min-width: 960px)  { /* Desktop */ }
```

---

## 📱 Responsive

✅ **Optimizado para:**
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1440px+)

### Técnicas Responsive
- **Fluid typography** con `clamp()`
- **Flexible grids** con CSS Grid
- **Touch-friendly** tap targets (44px+)
- **Viewport units** (`dvh`, `svh`)

---

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1 AA

✅ **Implementado:**
- Contraste de color adecuado (4.5:1)
- Navegación por teclado completa
- ARIA labels y roles
- Focus visible en todos los controles
- Skip links para contenido principal
- Alt texts descriptivos
- Respeto a `prefers-reduced-motion`

### Testing

```bash
# Lighthouse
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:8000

# axe DevTools (extensión navegador)
# https://www.deque.com/axe/devtools/
```

---

## 🔍 SEO

### Metadatos Incluidos

- ✅ Title y Description optimizados
- ✅ Open Graph (Facebook)
- ✅ Twitter Cards
- ✅ JSON-LD structured data
- ✅ Canonical URLs
- ✅ Sitemap.xml
- ✅ robots.txt

### Mejoras Recomendadas

1. **Crear `sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jadehausarq.com/</loc>
    <lastmod>2026-01-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jadehausarq.com/creditos.html</loc>
    <lastmod>2026-01-15</lastmod>
    <priority>0.5</priority>
  </url>
</urlset>
```

2. **Crear `robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://jadehausarq.com/sitemap.xml
```

3. **Google Search Console**
   - Registra tu sitio
   - Sube el sitemap
   - Monitorea indexación

---

## 🚢 Despliegue

### Opción 1: GitHub Pages (Gratis)

1. **Configurar repositorio**
```bash
# Asegúrate de estar en la rama main
git checkout main
git push origin main
```

2. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: `main` branch, carpeta `/` (root)
   - Save

3. **Tu sitio estará en:**
```
https://federiconevi-dev.github.io/Jadehausarq./
```

### Opción 2: Netlify (Gratis)

1. **Deploy con drag & drop**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta del proyecto
   - ¡Listo!

2. **O con CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Opción 3: Vercel (Gratis)

```bash
npm install -g vercel
vercel --prod
```

### Dominio Personalizado

Para usar `jadehausarq.com`:

1. Compra el dominio (Namecheap, GoDaddy, etc.)
2. Configura DNS apuntando a tu hosting
3. Espera 24-48h para propagación

---

## 📝 Licencias

### Código del Sitio
**MIT License** — Código HTML, CSS, JavaScript

```
Copyright (c) 2026 Jade Haus Arq.

Se concede permiso para usar, copiar, modificar y distribuir
este software con fines comerciales o no comerciales.
```

### Fotografías

- **Celosías Jade:** © Jade Haus Arq. (Producción propia)
- **Azulejos:** Creative Commons (ver [`assets/credits.json`](assets/credits.json))
  - Fuentes: Flickr, Wikimedia Commons, Rawpixel
  - Licencias: CC BY 2.0, CC BY-SA 2.0-4.0, CC0 1.0

📖 **[Ver créditos completos →](creditos.html)**

### Fuentes Tipográficas

- **Archivo, Inter, JetBrains Mono:** [SIL Open Font License](https://scripts.sil.org/OFL)

---

## 🤝 Contribuir

¿Encontraste un bug o tienes una sugerencia?

1. **Reporta issues** en GitHub
2. **Fork** el repositorio
3. Crea una **branch** para tu feature
4. Haz **commit** de tus cambios
5. Abre un **Pull Request**

---

## 📞 Contacto

**Jade Haus Arq.**

- 🌐 Web: [jadehausarq.com](https://jadehausarq.com)
- 📧 Email: hola@jadehausarq.com
- 📱 Teléfono: +54 11 5555-0134
- 📍 Dirección: Av. del Libertador 1234, Buenos Aires, Argentina
- 📷 Instagram: [@jadehausarq](https://instagram.com/jadehausarq)
- 📌 Pinterest: [@jadehausarq](https://pinterest.com/jadehausarq)

---

## 🙏 Agradecimientos

- Fotografías de azulejos de [Openverse](https://openverse.org)
- Tipografías de [Google Fonts](https://fonts.google.com)
- Formularios vía [Formspree](https://formspree.io)

---

<div align="center">

**Hecho con ❤️ por Jade Haus Arq.**

_Celosías y azulejos cerámicos de autor para arquitectura contemporánea._

[⬆️ Volver arriba](#️-jade-haus-arq--sitio-web-oficial)

</div>
