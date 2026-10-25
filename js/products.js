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
    id: "guantes-nitrilo",
    name: "Guantes de Nitrilo (caja x100)",
    price: 6990,
    compareAtPrice: 8990,
    category: "Seguridad",
    description: "Guantes de nitrilo azul, talla M/L. Resistentes a químicos y aceites. Ideal para faena.",
    images: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c4e?w=600&q=80"
    ],
    stock: 25,
    active: true,
    tags: ["oferta", "cyber-day"]
  },
  {
    id: "casco-seguridad",
    name: "Casco de Seguridad",
    price: 12990,
    category: "Seguridad",
    description: "Casco industrial con suspensión ajustable. Colores: blanco, amarillo, naranja.",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80"
    ],
    stock: 12,
    active: true,
    tags: ["nuevo"]
  },
  {
    id: "lentes-seguridad",
    name: "Lentes de Seguridad",
    price: 4990,
    category: "Seguridad",
    description: "Lentes transparentes con protección UV y anti-rayaduras. Cómodos para uso prolongado.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
    ],
    stock: 40,
    active: true,
    tags: []
  },
  {
    id: "botella-agua",
    name: "Botella de Agua 1L",
    price: 1990,
    category: "Hidratación",
    description: "Botella reutilizable de acero inoxidable. Mantiene frío/calor. Perfecta para el turno.",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"
    ],
    stock: 0,
    active: true,
    tags: []
  },
  {
    id: "snack-pack",
    name: "Pack Snacks Energéticos",
    price: 2990,
    compareAtPrice: 3500,
    category: "Alimentos",
    description: "Incluye barras de cereal, frutos secos y geles energéticos. Ideal para medias jornadas.",
    images: [
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80"
    ],
    stock: 30,
    active: true,
    tags: ["black-friday", "oferta"]
  },
  {
    id: "polera-faena",
    name: "Polera Dry-Fit Faena",
    price: 9990,
    category: "Ropa",
    description: "Polera técnica de secado rápido. Tallas S a XXL. Color navy con logo discreto.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
    ],
    stock: 18,
    active: true,
    tags: ["nuevo"]
  },
  {
    id: "linterna-led",
    name: "Linterna LED Recargable",
    price: 14990,
    category: "Herramientas",
    description: "1200 lúmenes, zoom ajustable, batería 5000mAh. Incluye cable USB-C. Mira el video de demostración.",
    images: [
      "https://images.unsplash.com/photo-1503694978374-8a2fa272b05f?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
    ],
    // Ejemplo YouTube (reemplaza por tu video real)
    video: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    stock: 8,
    active: true,
    tags: ["hot"]
  },
  {
    id: "protector-solar",
    name: "Protector Solar FPS 50+",
    price: 7990,
    category: "Cuidado",
    description: "Crema resistente al agua y sudor. 200ml. Ideal para trabajos al aire libre.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"
    ],
    stock: 22,
    active: true,
    tags: ["envio-gratis"]
  },
  // Ejemplo de producto INACTIVO: no aparece en el catálogo hasta que pongas active: true
  {
    id: "chaleco-reflectante",
    name: "Chaleco Reflectante",
    price: 5990,
    category: "Seguridad",
    description: "Chaleco alta visibilidad. Próximamente disponible.",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80"
    ],
    stock: 0,
    active: false,
    tags: ["nuevo"]
  }
];

// Solo categorías de productos activos
window.CATEGORIES = [
  ...new Set(
    window.PRODUCTS.filter((p) => p.active !== false).map((p) => p.category)
  )
];
