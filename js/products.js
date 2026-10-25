/**
 * PRODUCTOS - Edita este archivo para agregar / quitar / modificar productos.
 *
 * ── CAMPOS ──────────────────────────────────────────────────────────────
 * id            string único (sin espacios)
 * name          nombre visible
 * price         precio actual en CLP (solo número)
 * compareAtPrice (opcional) precio anterior → se muestra tachado + % dto
 * category      categoría (genera filtros solos)
 * description   texto del detalle
 * images        array de URLs (ImgBB direct links). Mínimo 1.
 * video         (opcional) URL de video:
 *                 - archivo .mp4 / .webm (ImgBB no sirve; usa Streamable, Cloudinary, o tu host)
 *                 - o link de YouTube / Vimeo (se embebe)
 * stock         (opcional) cantidad. 0 o menos = AGOTADO (gris + botón inactivo)
 * active        true = se muestra en el catálogo | false = oculto (no se vende)
 * tags          (opcional) etiquetas de promo. Valores sugeridos:
 *                 "black-friday" | "cyber-day" | "oferta" | "nuevo" | "envio-gratis"
 *                 "ultimo" | "hot"
 *
 * ── IMÁGENES (ImgBB) ────────────────────────────────────────────────────
 * 1. https://imgbb.com → sube → copia "Direct link"
 * 2. Pégalo en images: ["https://i.ibb.co/....jpg"]
 *
 * ── VIDEOS ──────────────────────────────────────────────────────────────
 * YouTube:  "https://www.youtube.com/watch?v=XXXX" o "https://youtu.be/XXXX"
 * Vimeo:    "https://vimeo.com/XXXX"
 * MP4:      URL directa al archivo (ej. Cloudinary, tu CDN)
 */

window.PRODUCTS = [
  {
    id: "frac-chocolate",
    name: "Frac Chocolate Costa",
    price: 1000,
    category: "Alimentos",
    description: "Galleta Frac rellena de chocolate Costa...",
    images: ["https://i.ibb.co/8LmqTs7g/frac-chocolate.png"],
    stock: 10,
    active: true,
    tags: ["nuevo"]
  },
    {
    id: "frac-chocolate-frutilla",
    name: "Frac Chocolate y Frutilla Costa",
    price: 1000,
    category: "Alimentos",
    description: "Galleta Frac Costa sabor chocolate y frutilla. Ideal para la colación.",
    images: [
      "https://i.ibb.co/HD4QrTKd/fracchocolate-y-frutilla.png"
    ],
    stock: 10,
    active: true,
    tags: ["nuevo"]
  },
  {
    id: "score-mojito",
    name: "Score Mojito",
    price: 2000,
    category: "Bebidas",
    description: "Bebida energética Score sabor Mojito.",
    images: [
      "https://i.ibb.co/8LftwScD/score-mojito-portada.png",
      "https://i.ibb.co/5h7dcjdk/score-mojito.png"
    ],
    stock: 24,
    active: true,
    tags: ["nuevo"]
  },
  {
    id: "bebida-pepsi",
    name: "Pepsi",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Pepsi.",
    images: [
      "https://i.ibb.co/7xbmMqry/bebida-pepsi.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "bebida-pap",
    name: "Pap",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Pap.",
    images: [
      "https://i.ibb.co/p8fH4VP/bebida-pap.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "bebida-limon-soda",
    name: "Limón Soda",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Limón Soda.",
    images: [
      "https://i.ibb.co/bg8v5FQt/bebida-limon-soda.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "bebida-kem",
    name: "Kem",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Kem.",
    images: [
      "https://i.ibb.co/tPMx4Xtq/bebida-kem.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "bebida-fanta",
    name: "Fanta",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Fanta.",
    images: [
      "https://i.ibb.co/Kj1R7d3K/bebida-fanta.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "bebida-coca-cola",
    name: "Coca-Cola",
    price: 1500,
    category: "Bebidas",
    description: "Bebida Coca-Cola.",
    images: [
      "https://i.ibb.co/F4Sjwscr/bebida-coca-cola.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "triton-vainilla",
    name: "Tritón Vainilla",
    price: 1000,
    category: "Alimentos",
    description: "Galletas Tritón sabor vainilla.",
    images: [
      "https://i.ibb.co/gL809qr4/triton-vainilla-1.png",
      "https://i.ibb.co/NgvcmVXN/triton-vainilla.png"
    ],
    stock: 15,
    active: true,
    tags: []
  },
  {
    id: "score-morado",
    name: "Score Morado",
    price: 2000,
    category: "Bebidas",
    description: "Bebida energética Score sabor morado.",
    images: [
      "https://i.ibb.co/fdywW12J/score-morado.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "drive-gift-clip",
    name: "Drive Gift con clip cigarro",
    price: 2000,
    category: "Otros",
    description: "Drive Gift con clip para cigarro.",
    images: [
      "https://i.ibb.co/ksFr4DPt/drive-gift-con-clip-cigarro.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "drive-eight-clip",
    name: "Drive Eight con clip cigarro",
    price: 2000,
    category: "Otros",
    description: "Drive Eight con clip para cigarro.",
    images: [
      "https://i.ibb.co/RG0V9F0H/drive-eight-con-clip-cigarro.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "barra-cereal-chips-chocolate",
    name: "Barra de cereal con chips de chocolate",
    price: 500,
    category: "Alimentos",
    description: "Barra de cereal con chips de chocolate.",
    images: [
      "https://i.ibb.co/2YYHSxwQ/barra-de-cereal-con-chips-de-chocolate.png"
    ],
    stock: 8,
    active: true,
    tags: []
  },
  {
    id: "barra-cereal-chocolate",
    name: "Barra de cereal de chocolate",
    price: 500,
    category: "Alimentos",
    description: "Barra de cereal sabor chocolate.",
    images: [
      "https://i.ibb.co/5hNZFw7d/barra-de-cereal-de-chocolate.png"
    ],
    stock: 8,
    active: true,
    tags: []
  },
  {
    id: "barra-cereal-frutos-rojos",
    name: "Barra de cereal frutos rojos",
    price: 500,
    category: "Alimentos",
    description: "Barra de cereal de frutos rojos.",
    images: [
      "https://i.ibb.co/bgPGtT8V/barra-de-cereal-frutos-rojos.png"
    ],
    stock: 8,
    active: true,
    tags: []
  },
  {
    id: "barra-cereal-miel",
    name: "Barra de cereal con miel",
    price: 500,
    category: "Alimentos",
    description: "Barra de cereal con miel.",
    images: [
      "https://i.ibb.co/p6kSDPDZ/barra-de-cereal-con-miel.png"
    ],
    stock: 8,
    active: true,
    tags: []
  },
  {
    id: "nik-chirimoya",
    name: "Nik Chirimoya",
    price: 1000,
    category: "Alimentos",
    description: "Galletas Nik sabor chirimoya.",
    images: [
      "https://i.ibb.co/nNLWgQRt/nik-chirimolla.png",
      "https://i.ibb.co/Jw0TpjKj/nik-chhirimolla2.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "nik-frutilla",
    name: "Nik Frutilla",
    price: 1000,
    category: "Alimentos",
    description: "Galletas Nik sabor frutilla.",
    images: [
      "https://i.ibb.co/8gF0H9yg/nik-frutilla.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "nik-limon",
    name: "Nik Limón",
    price: 1000,
    category: "Alimentos",
    description: "Galletas Nik sabor limón.",
    images: [
      "https://i.ibb.co/bgq0rj0m/nik-limon.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "nik-vainilla",
    name: "Nik Vainilla",
    price: 1000,
    category: "Alimentos",
    description: "Galletas Nik sabor vainilla.",
    images: [
      "https://i.ibb.co/3YhQFBt5/nik-vainilla.png"
    ],
    stock: 12,
    active: true,
    tags: []
  },
  {
    id: "monster",
    name: "Monster Energy",
    price: 2500,
    category: "Bebidas",
    description: "Bebida energética Monster.",
    images: [
      "https://i.ibb.co/d4PDsB6t/monster.png"
    ],
    stock: 24,
    active: true,
    tags: ["hot"]
  },
  {
    id: "score-amarillo",
    name: "Score Amarillo",
    price: 2000,
    category: "Bebidas",
    description: "Bebida energética Score sabor amarillo.",
    images: [
      "https://i.ibb.co/nsfn5SZf/score-amarillo.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
  {
    id: "score-chicle",
    name: "Score Chicle",
    price: 2000,
    category: "Bebidas",
    description: "Bebida energética Score sabor chicle.",
    images: [
      "https://i.ibb.co/tMnqq6nV/score-chicle.png"
    ],
    stock: 24,
    active: true,
    tags: []
  },
];

// Solo categorías de productos activos
window.CATEGORIES = [
  ...new Set(
    window.PRODUCTS.filter((p) => p.active !== false).map((p) => p.category)
  )
];
