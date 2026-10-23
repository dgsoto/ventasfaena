/**
 * PRODUCTOS - Edita este archivo para agregar / quitar / modificar productos.
 * 
 * Cómo subir imágenes a ImgBB:
 * 1. Ve a https://imgbb.com
 * 2. Sube la foto (puedes subir varias)
 * 3. Copia el "Direct link" (termina en .jpg / .png / .webp)
 * 4. Pégalo en el array "images" del producto
 * 
 * Un producto puede tener 1 o varias imágenes.
 * Si tiene más de 1, se muestra un efecto de carrusel sutil.
 * 
 * Formato de precio: número entero en CLP (sin puntos ni $)
 * stock: opcional, si es 0 se muestra "Agotado"
 * category: para filtros
 */

// Expuesto globalmente para que app.js lo encuentre siempre
window.PRODUCTS = window.PRODUCTS || [
  {
    id: "guantes-nitrilo",
    name: "Guantes de Nitrilo (caja x100)",
    price: 8990,
    category: "Seguridad",
    description: "Guantes de nitrilo azul, talla M/L. Resistentes a químicos y aceites. Ideal para faena.",
    images: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c4e?w=600&q=80"
    ],
    stock: 25
  },
  {
    id: "casco-seguridad",
    name: "Casco de Seguridad",
    price: 12990,
    category: "Seguridad",
    description: "Casco industrial con suspensión ajustable. Colores disponibles: blanco, amarillo, naranja.",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80"
    ],
    stock: 12
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
    stock: 40
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
    stock: 50
  },
  {
    id: "snack-pack",
    name: "Pack Snacks Energéticos",
    price: 3500,
    category: "Alimentos",
    description: "Incluye barras de cereal, frutos secos y geles energéticos. Ideal para medias jornadas.",
    images: [
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80"
    ],
    stock: 30
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
    stock: 18
  },
  {
    id: "linterna-led",
    name: "Linterna LED Recargable",
    price: 14990,
    category: "Herramientas",
    description: "1200 lúmenes, zoom ajustable, batería 5000mAh. Incluye cable USB-C.",
    images: [
      "https://images.unsplash.com/photo-1503694978374-8a2fa272b05f?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
    ],
    stock: 8
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
    stock: 22
  }
];

// Categorías únicas (se generan automáticamente)
window.CATEGORIES = [...new Set(window.PRODUCTS.map(p => p.category))];
