# 📧 Configuración de Formspree

El formulario de contacto está configurado para usar **Formspree**, un servicio gratuito que envía los mensajes del formulario directo a tu email.

## 🚀 Pasos para activarlo:

### 1. Crear cuenta en Formspree
1. Ve a [https://formspree.io/register](https://formspree.io/register)
2. Crea una cuenta gratuita con tu email

### 2. Crear un nuevo formulario
1. Una vez dentro, haz clic en **"+ New Form"**
2. Dale un nombre: `Contacto Jade Haus`
3. Copia el **Form ID** que te dan (algo como `xyzabc123`)

### 3. Configurar el HTML
En el archivo `index.html`, busca esta línea (aprox. línea 710):

```html
<form class="contacto-form" data-contact-form novalidate action="https://formspree.io/f/YOUR_FORM_ID" method="POST" data-reveal>
```

**Reemplaza `YOUR_FORM_ID`** con tu Form ID real:

```html
<form class="contacto-form" data-contact-form novalidate action="https://formspree.io/f/xyzabc123" method="POST" data-reveal>
```

### 4. ¡Listo!
- Los mensajes llegarán al email que usaste para registrarte en Formspree
- Plan gratuito: hasta 50 envíos por mes
- Si necesitas más, puedes actualizar el plan después

## ✅ Para probar:
1. Abre tu página web
2. Llena el formulario de contacto
3. Envía un mensaje de prueba
4. Revisa tu email (puede tardar 1-2 minutos)

## 🔧 Configuraciones opcionales en Formspree:
- Cambiar el email destino
- Añadir notificaciones
- Personalizar mensaje de confirmación
- Ver estadísticas de envíos
- Exportar datos a CSV

---

**Nota:** Si prefieres otro servicio, también puedes usar:
- **Netlify Forms** (si usas Netlify para hosting)
- **EmailJS** (alternativa gratuita)
- **Tu propio backend** (PHP, Node.js, etc.)
