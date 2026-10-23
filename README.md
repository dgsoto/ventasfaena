# VentasFaena 🛒

Catálogo de productos para la faena. Tus compañeros eligen lo que necesitan y envían el pedido directo a tu WhatsApp.

**Nombre fácil de recordar · Funciona offline · Rápido · Buen SEO y UX**

---

## Características

- ✅ Catálogo con precios en CLP
- ✅ Un producto puede tener **1 o varias imágenes** (carrusel sutil automático)
- ✅ Carrito multi-producto + cantidades
- ✅ Pago **Efectivo** o **Transferencia** (muestra datos Banco Estado)
- ✅ Pedido se arma automáticamente y se abre WhatsApp con el mensaje listo
- ✅ **PWA offline-first**: funciona sin internet, guarda el carrito y el pedido pendiente
- ✅ Cuando vuelve internet, avisa para reenviar
- ✅ Buscador + filtros por categoría
- ✅ Instalable en el celular (Add to Home Screen)
- ✅ SEO básico + Open Graph + JSON-LD
- ✅ Muy liviano (vanilla JS + Tailwind CDN)
- ✅ Fácil de actualizar: solo editas `js/products.js`

**WhatsApp destino:** +56 9 6684 0210  
**Transferencia:** Banco Estado · Cuenta RUT 28805519-K · Diego Gonzales

---

## Cómo agregar / editar productos

1. Abre `js/products.js`
2. Agrega un objeto al array `PRODUCTS`:

```js
{
  id: "mi-producto-unico",          // sin espacios, único
  name: "Nombre del producto",
  price: 9990,                      // solo número, CLP
  category: "Seguridad",            // crea filtros automáticamente
  description: "Descripción corta...",
  images: [
    "https://i.ibb.co/XXXX/foto1.jpg",   // ← links directos de ImgBB
    "https://i.ibb.co/YYYY/foto2.jpg"    // opcional, 2da imagen
  ],
  stock: 20                         // opcional (0 = Agotado)
}
```

### Subir fotos a ImgBB (gratis)

1. Entrá a [https://imgbb.com](https://imgbb.com)
2. Arrastrá la imagen (o varias)
3. Copiá el **Direct link** (el que termina en `.jpg` / `.png` / `.webp`)
4. Pegalo en el array `images`

---

## ⚠️ Por qué no ves los productos en el teléfono (local)

Si abres el `index.html` **directamente** desde el gestor de archivos del teléfono (protocolo `file://`):

- Muchos navegadores móviles **bloquean o fallan** al cargar los scripts (`js/products.js`, Tailwind CDN, etc.).
- El Service Worker no funciona en `file://`.
- A veces la carpeta `js/` no se copió completa junto al HTML.

**Soluciones correctas para probar en el teléfono:**

### Opción A – Servidor local desde el PC (recomendado para pruebas)
1. En la carpeta `ventasfaena` ejecuta:
   ```bash
   python3 -m http.server 8080
   ```
2. PC y teléfono en la **misma WiFi**.
3. En el teléfono abre: `http://IP-DE-TU-PC:8080`  
   (IP: Windows → `ipconfig` | Mac/Linux → `ifconfig` o `ip a`)

### Opción B – Subir a GitHub Pages (lo mejor)
Funciona perfecto en cualquier celular, tablet o PC (ver sección de abajo).

### Opción C – App “Web Server” en Android
Instala una app tipo “Simple HTTP Server” o “Web Server”, apunta a la carpeta y abre desde Chrome.

**Importante:** Siempre transfiere **toda la carpeta** `ventasfaena/` (con `js/`, `css/`, `icons/`, etc.), nunca solo el `index.html`.

---

## Cómo subirlo a GitHub Pages (gratis y rápido)

### 1. Crear repositorio
```bash
# En tu PC
git clone https://github.com/TU_USUARIO/ventasfaena.git
# o crea uno vacío en github.com y sube la carpeta
```

### 2. Subir los archivos
Copia **todo** el contenido de esta carpeta `ventasfaena/` a la raíz del repo.

### 3. Activar GitHub Pages
1. Ve a **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (o `master`) → carpeta `/ (root)`
4. Save

En unos minutos estará en:  
`https://TU_USUARIO.github.io/ventasfaena/`

> **Importante:** Si el repo se llama exactamente `ventasfaena`, la URL es la de arriba.  
> Si usas otro nombre de repo, cambia la `canonical` y el `start_url` del manifest si es necesario.

### 4. Actualizar productos después
Solo edita `js/products.js` → `git add .` → `git commit -m "nuevos productos"` → `git push`.  
GitHub Pages se actualiza solo.

---

## Opción Supabase (si quieres panel admin)

Si más adelante quieres que alguien no-técnico agregue productos sin tocar código:

1. Crea un proyecto gratis en [supabase.com](https://supabase.com)
2. Tabla `products` con columnas: `id`, `name`, `price`, `category`, `description`, `images` (jsonb), `stock`
3. En `js/app.js` reemplaza la carga de `PRODUCTS` por un `fetch` a la API REST de Supabase (anon key)
4. El resto del carrito / offline / WhatsApp sigue igual

Por ahora el archivo `products.js` es más simple y no necesita backend.

---

## Estructura de archivos

```
ventasfaena/
├── index.html          # Página principal
├── css/styles.css      # Estilos extra
├── js/
│   ├── products.js     # ← AQUÍ editas los productos
│   └── app.js          # Lógica del carrito, WhatsApp, offline
├── sw.js               # Service Worker (offline)
├── manifest.json       # PWA
├── icons/              # Iconos de la app
└── README.md
```

---

## Personalización rápida

| Qué                  | Dónde                          |
|----------------------|--------------------------------|
| Número WhatsApp      | `js/app.js` → `WHATSAPP_NUMBER` |
| Datos bancarios      | `js/app.js` → objeto `BANK`    |
| Nombre del sitio     | `index.html` + `manifest.json` |
| Colores              | Tailwind config en `index.html`|
| Productos            | `js/products.js`               |

---

## Tips de uso en la faena

- Los compañeros pueden **instalar** la app en el celular (Chrome → “Agregar a pantalla de inicio”).
- Funciona aunque no haya señal: el carrito se guarda y cuando haya internet se puede enviar el WhatsApp.
- El mensaje llega ya formateado con productos, cantidades, total y datos de transferencia.

¡Listo para usar!  
Cualquier duda o mejora, avísame.
