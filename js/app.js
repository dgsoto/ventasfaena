/**
 * VentasFaena - App principal
 * Offline-first PWA + carrito + WhatsApp
 */

const WHATSAPP_NUMBER = "56966840210"; // sin + ni espacios
const BANK = {
  banco: "Banco Estado",
  tipo: "Cuenta RUT",
  numero: "28805519-K",
  titular: "Diego Gonzales"
};

// Asegurar que PRODUCTS exista (defensivo para file:// o carga fallida)
const PRODUCTS = window.PRODUCTS || [];
// Solo productos activos en catálogo y categorías
const ACTIVE_PRODUCTS = () => PRODUCTS.filter((p) => p.active !== false);
const CATEGORIES =
  window.CATEGORIES ||
  [...new Set(ACTIVE_PRODUCTS().map((p) => p.category))];

/** Etiquetas de promo → clase + texto */
const TAG_META = {
  "black-friday": { label: "Black Friday", cls: "tag-black-friday" },
  "cyber-day": { label: "Cyber Day", cls: "tag-cyber" },
  oferta: { label: "Oferta", cls: "tag-oferta" },
  nuevo: { label: "Nuevo", cls: "tag-nuevo" },
  "envio-gratis": { label: "Envío gratis", cls: "tag-envio" },
  ultimo: { label: "¡Últimos!", cls: "tag-ultimo" },
  hot: { label: "Hot", cls: "tag-hot" }
};

function renderTags(tags) {
  if (!tags || !tags.length) return "";
  return tags
    .map((t) => {
      const m = TAG_META[t] || { label: t, cls: "tag-default" };
      return `<span class="product-tag ${m.cls}">${m.label}</span>`;
    })
    .join("");
}

function discountPct(p) {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.compareAtPrice) * 100);
}

function priceHTML(p, size = "sm") {
  const pct = discountPct(p);
  if (pct > 0) {
    return `
      <div class="flex flex-wrap items-baseline gap-1.5 mt-1">
        <span class="text-primary-600 font-bold ${size === "lg" ? "text-2xl" : ""}">${formatCLP(p.price)}</span>
        <span class="text-slate-400 line-through text-xs ${size === "lg" ? "text-sm" : ""}">${formatCLP(p.compareAtPrice)}</span>
        <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-${pct}%</span>
      </div>`;
  }
  return `<p class="text-primary-600 font-bold mt-1 ${size === "lg" ? "text-2xl" : ""}">${formatCLP(p.price)}</p>`;
}

/** Detecta y embebe video (YouTube / Vimeo / MP4) */
function videoEmbedHTML(url) {
  if (!url) return "";
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (yt) {
    return `<div class="modal-video aspect-video w-full bg-black rounded-xl overflow-hidden mt-3">
      <iframe class="w-full h-full" src="https://www.youtube.com/embed/${yt[1]}?rel=0" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    </div>`;
  }
  const vim = url.match(/vimeo\.com\/(\d+)/);
  if (vim) {
    return `<div class="modal-video aspect-video w-full bg-black rounded-xl overflow-hidden mt-3">
      <iframe class="w-full h-full" src="https://player.vimeo.com/video/${vim[1]}" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    </div>`;
  }
  // MP4 / WebM directo
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes("video")) {
    return `<div class="modal-video w-full mt-3 rounded-xl overflow-hidden bg-black">
      <video class="w-full max-h-64" controls playsinline preload="metadata" src="${url}"></video>
    </div>`;
  }
  return "";
}

// ========== State ==========
let cart = {};
try {
  cart = JSON.parse(localStorage.getItem("vf_cart") || "{}");
} catch (e) {
  cart = {};
}
let currentProduct = null;
let modalQty = 1;
let currentFilter = "Todos";
let searchQuery = "";
let deferredPrompt = null;

// ========== Helpers ==========
const formatCLP = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const saveCart = () => {
  localStorage.setItem("vf_cart", JSON.stringify(cart));
  updateCartUI();
};

const getCartCount = () => Object.values(cart).reduce((s, i) => s + i.qty, 0);
const getCartTotal = () =>
  Object.values(cart).reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

function toast(msg, ms = 2200) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), ms);
}

// ========== Offline detection ==========
function updateOnlineStatus() {
  const banner = document.getElementById("offline-banner");
  if (!navigator.onLine) {
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

// ========== Render products ==========
function renderProducts() {
  const grid = document.getElementById("products-grid");
  const noRes = document.getElementById("no-results");

  if (!PRODUCTS || PRODUCTS.length === 0) {
    grid.innerHTML = "";
    noRes.classList.remove("hidden");
    noRes.innerHTML = `
      <div class="text-center py-12 px-4">
        <p class="text-lg font-semibold text-slate-700 mb-2">No se cargaron los productos</p>
        <p class="text-sm text-slate-500 mb-4">Esto suele pasar si abres el archivo HTML directamente (file://).<br>
        Usa un servidor local o sube a GitHub Pages.</p>
        <p class="text-xs text-slate-400">Revisa que la carpeta <code>js/</code> esté completa junto al index.html</p>
      </div>`;
    return;
  }

  // Solo activos + categoría + búsqueda
  let list = ACTIVE_PRODUCTS().filter((p) => {
    const matchCat = currentFilter === "Todos" || p.category === currentFilter;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      (p.description && p.description.toLowerCase().includes(searchQuery)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery)));
    return matchCat && matchSearch;
  });

  if (list.length === 0) {
    grid.innerHTML = "";
    noRes.classList.remove("hidden");
    noRes.textContent = "No se encontraron productos.";
    return;
  }
  noRes.classList.add("hidden");

  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23e2e8f0' width='400' height='400'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ESin imagen%3C/text%3E%3C/svg%3E";

  grid.innerHTML = list
    .map((p) => {
      const imgs = p.images && p.images.length ? p.images : [placeholder];
      const hasMulti = imgs.length > 1;
      const soldOut = p.stock !== undefined && p.stock <= 0;
      const hasVideo = !!p.video;
      const tagsHtml = renderTags(p.tags);

      return `
      <article class="product-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group ${soldOut ? "is-soldout" : ""}" data-id="${p.id}">
        <div class="img-wrap cursor-pointer relative" data-action="open">
          <img src="${imgs[0]}" alt="${p.name}" loading="lazy" class="main-img" data-idx="0" onerror="this.onerror=null;this.src='${placeholder}'" />
          ${hasMulti ? `<div class="dots">${imgs.map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`).join("")}</div>` : ""}
          ${tagsHtml ? `<div class="absolute top-2 left-2 flex flex-col gap-1 z-10">${tagsHtml}</div>` : ""}
          ${hasVideo && !soldOut ? `<div class="absolute bottom-2 right-2 z-10 bg-black/70 text-white rounded-full p-1.5 pointer-events-none" title="Tiene video"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>` : ""}
          ${soldOut ? `<div class="absolute inset-0 bg-slate-900/55 flex items-center justify-center z-10"><span class="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">AGOTADO</span></div>` : ""}
        </div>
        <div class="p-3">
          <p class="text-xs text-slate-500 font-medium">${p.category || ""}</p>
          <h3 class="font-semibold text-sm leading-snug mt-0.5 line-clamp-2">${p.name}</h3>
          ${priceHTML(p)}
          <button class="mt-2 w-full min-h-[44px] text-sm font-medium py-2.5 rounded-xl transition touch-manipulation ${
            soldOut
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white"
          }" data-action="quick-add" ${soldOut ? "disabled" : ""}>
            ${soldOut ? "Agotado" : "Agregar"}
          </button>
        </div>
      </article>`;
    })
    .join("");

  // Multi-image subtle auto-rotate on hover (desktop)
  grid.querySelectorAll(".product-card").forEach((card) => {
    const id = card.dataset.id;
    const product = PRODUCTS.find((x) => x.id === id);
    if (!product || !product.images || product.images.length < 2 || card.classList.contains("is-soldout")) return;

    const img = card.querySelector(".main-img");
    const dots = card.querySelectorAll(".dots span");
    let idx = 0;
    let timer = null;

    const show = (i) => {
      idx = i % product.images.length;
      img.classList.add("fade-out");
      setTimeout(() => {
        img.src = product.images[idx];
        img.onerror = function () {
          this.onerror = null;
          this.src = placeholder;
        };
        img.dataset.idx = idx;
        img.classList.remove("fade-out");
        dots.forEach((d, di) => d.classList.toggle("active", di === idx));
      }, 200);
    };

    card.addEventListener("mouseenter", () => {
      timer = setInterval(() => show(idx + 1), 1800);
    });
    card.addEventListener("mouseleave", () => {
      clearInterval(timer);
      show(0);
    });
  });
}

// ========== Categories ==========
function renderCategories() {
  const cont = document.getElementById("category-filters");
  const cats = ["Todos", ...CATEGORIES];
  cont.innerHTML = cats
    .map(
      (c) => `
    <button data-cat="${c}" class="cat-btn whitespace-nowrap px-4 py-2 min-h-[40px] rounded-full text-sm font-medium transition touch-manipulation ${
      c === currentFilter ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:bg-slate-200"
    }">${c}</button>`
    )
    .join("");
}

// ========== Cart UI ==========
function updateCartUI() {
  document.getElementById("cart-count").textContent = getCartCount();
  const itemsEl = document.getElementById("cart-items");
  const entries = Object.values(cart);

  if (entries.length === 0) {
    itemsEl.innerHTML = `<p class="text-center text-slate-400 py-10">Tu pedido está vacío</p>`;
  } else {
    itemsEl.innerHTML = entries
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <img src="${p.images[0]}" alt="${p.name}" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">${p.name}</p>
            <p class="text-primary-600 font-semibold text-sm">${formatCLP(p.price)}</p>
            <div class="flex items-center gap-2 mt-1">
              <button class="w-7 h-7 rounded-lg bg-slate-100 font-bold" data-action="dec" data-id="${p.id}">−</button>
              <span class="text-sm font-medium w-6 text-center">${item.qty}</span>
              <button class="w-7 h-7 rounded-lg bg-slate-100 font-bold" data-action="inc" data-id="${p.id}">+</button>
            </div>
          </div>
          <button class="text-slate-400 hover:text-red-500 p-1" data-action="remove" data-id="${p.id}" aria-label="Eliminar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>`;
      })
      .join("");
  }
  document.getElementById("cart-total").textContent = formatCLP(getCartTotal());
  document.getElementById("send-whatsapp").disabled = entries.length === 0;
}

// ========== Cart actions ==========
function addToCart(id, qty = 1) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p || p.active === false) return;
  if (p.stock !== undefined && p.stock <= 0) {
    toast("Producto agotado");
    return;
  }
  if (cart[id]) {
    cart[id].qty += qty;
  } else {
    cart[id] = { id, qty };
  }
  if (p.stock !== undefined) cart[id].qty = Math.min(cart[id].qty, p.stock);
  saveCart();
  toast(`Agregado: ${p.name}`);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  else {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p?.stock !== undefined) cart[id].qty = Math.min(cart[id].qty, p.stock);
  }
  saveCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
}

// ========== Modal ==========
function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p || p.active === false) return;
  currentProduct = p;
  modalQty = 1;
  const soldOut = p.stock !== undefined && p.stock <= 0;

  document.getElementById("modal-title").textContent = p.name;
  document.getElementById("modal-price").innerHTML = priceHTML(p, "lg");
  document.getElementById("modal-desc").textContent = p.description || "";
  document.getElementById("modal-qty").textContent = "1";

  // Tags en modal
  const tagsEl = document.getElementById("modal-tags");
  if (tagsEl) {
    tagsEl.innerHTML = renderTags(p.tags);
    tagsEl.classList.toggle("hidden", !p.tags || !p.tags.length);
  }

  // Video
  const videoEl = document.getElementById("modal-video");
  if (videoEl) {
    videoEl.innerHTML = videoEmbedHTML(p.video);
  }

  // Botón agregar
  const addBtn = document.getElementById("modal-add");
  if (soldOut) {
    addBtn.disabled = true;
    addBtn.textContent = "Agotado";
    addBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    addBtn.disabled = false;
    addBtn.textContent = "Agregar al pedido";
    addBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }

  const imgs = p.images && p.images.length ? p.images : [];
  const carousel = document.getElementById("modal-carousel");
  carousel.innerHTML = imgs
    .map(
      (src, i) =>
        `<img src="${src}" alt="${p.name}" class="${i === 0 ? "active" : ""}" data-i="${i}" />`
    )
    .join("");

  if (imgs.length > 1) {
    carousel.innerHTML += `
      <button class="carousel-nav prev" data-dir="-1" aria-label="Anterior">‹</button>
      <button class="carousel-nav next" data-dir="1" aria-label="Siguiente">›</button>
      <div class="dots" style="bottom:12px">${imgs
        .map((_, i) => `<span class="${i === 0 ? "active" : ""}" data-dot="${i}"></span>`)
        .join("")}</div>`;
  }

  document.getElementById("product-modal").classList.remove("hidden");
  document.getElementById("product-modal").classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  // Pausar videos/iframes al cerrar
  const videoEl = document.getElementById("modal-video");
  if (videoEl) videoEl.innerHTML = "";
  document.getElementById("product-modal").classList.add("hidden");
  document.getElementById("product-modal").classList.remove("flex");
  document.body.style.overflow = "";
  currentProduct = null;
}

function modalShowImage(idx) {
  const imgs = document.querySelectorAll("#modal-carousel img");
  const dots = document.querySelectorAll("#modal-carousel .dots span");
  imgs.forEach((img, i) => img.classList.toggle("active", i === idx));
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

// ========== WhatsApp order ==========
function buildWhatsAppMessage() {
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const note = document.getElementById("order-note").value.trim();
  let lines = ["🛒 *PEDIDO VENTASFAENA*", ""];

  Object.values(cart).forEach((item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    if (!p) return;
    lines.push(`• ${p.name}`);
    lines.push(`  ${item.qty} x ${formatCLP(p.price)} = ${formatCLP(p.price * item.qty)}`);
  });

  lines.push("");
  lines.push(`*Total: ${formatCLP(getCartTotal())}*`);
  lines.push(`Forma de pago: ${payment === "efectivo" ? "Efectivo" : "Transferencia"}`);

  if (payment === "transferencia") {
    lines.push("");
    lines.push("📌 *Datos transferencia:*");
    lines.push(`Banco: ${BANK.banco}`);
    lines.push(`${BANK.tipo}: ${BANK.numero}`);
    lines.push(`Titular: ${BANK.titular}`);
  }

  if (note) {
    lines.push("");
    lines.push(`📝 Nota: ${note}`);
  }

  lines.push("");
  lines.push("_Enviado desde VentasFaena_");
  return lines.join("\n");
}

function sendWhatsApp() {
  if (getCartCount() === 0) return;

  if (!navigator.onLine) {
    // Guardar pedido pendiente
    const pending = {
      message: buildWhatsAppMessage(),
      ts: Date.now()
    };
    localStorage.setItem("vf_pending_order", JSON.stringify(pending));
    toast("Sin internet. El pedido se guardó. Cuando tengas señal, vuelve a presionar Enviar.", 4000);
    return;
  }

  const text = encodeURIComponent(buildWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, "_blank");

  // Opcional: limpiar carrito después de enviar
  // cart = {}; saveCart();
  toast("WhatsApp abierto. ¡Revisa el mensaje y envíalo!");
}

// Intentar reenviar pendiente al volver online
window.addEventListener("online", () => {
  const pending = localStorage.getItem("vf_pending_order");
  if (pending) {
    toast("Internet recuperado. Puedes enviar el pedido pendiente desde el carrito.", 3500);
  }
});

// ========== Payment toggle ==========
function setupPaymentToggle() {
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const bank = document.getElementById("bank-details");
      if (radio.value === "transferencia" && radio.checked) {
        bank.classList.remove("hidden");
      } else {
        bank.classList.add("hidden");
      }
    });
  });
}

// ========== Copy bank ==========
function copyBank() {
  const text = `Banco Estado\nCuenta RUT: 28805519-K\nTitular: Diego Gonzales`;
  navigator.clipboard.writeText(text).then(() => toast("Datos copiados"));
}

// ========== Event listeners ==========
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  updateCartUI();
  setupPaymentToggle();

  // Search
  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  // Categories
  document.getElementById("category-filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    currentFilter = btn.dataset.cat;
    renderCategories();
    renderProducts();
  });

  // Products grid clicks
  document.getElementById("products-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    const id = card.dataset.id;
    const action = e.target.closest("[data-action]")?.dataset.action;

    if (action === "quick-add") {
      addToCart(id, 1);
    } else if (action === "open" || e.target.closest(".img-wrap")) {
      openModal(id);
    }
  });

  // Cart drawer
  document.getElementById("cart-btn").addEventListener("click", () => {
    document.getElementById("cart-drawer").classList.remove("translate-x-full");
    document.getElementById("cart-overlay").classList.remove("hidden");
    // No bloqueamos body.overflow aquí: el overlay usa pointer-events y el drawer es fixed
    // Bloquear overflow solo si el modal de producto no está abierto
    requestAnimationFrame(() => {
      document.getElementById("cart-overlay").classList.remove("opacity-0");
    });
  });
  const closeCart = () => {
    document.getElementById("cart-drawer").classList.add("translate-x-full");
    document.getElementById("cart-overlay").classList.add("opacity-0");
    setTimeout(() => {
      document.getElementById("cart-overlay").classList.add("hidden");
      // Asegurar que el body pueda scrollear de nuevo
      if (document.getElementById("product-modal").classList.contains("hidden")) {
        document.body.style.overflow = "";
      }
    }, 300);
  };
  document.getElementById("close-cart").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);

  // Cart item actions
  document.getElementById("cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "inc") changeQty(id, 1);
    if (btn.dataset.action === "dec") changeQty(id, -1);
    if (btn.dataset.action === "remove") removeFromCart(id);
  });

  // Modal
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document.getElementById("product-modal").addEventListener("click", (e) => {
    if (e.target.id === "product-modal") closeModal();
  });
  document.getElementById("modal-plus").addEventListener("click", () => {
    modalQty++;
    document.getElementById("modal-qty").textContent = modalQty;
  });
  document.getElementById("modal-minus").addEventListener("click", () => {
    if (modalQty > 1) {
      modalQty--;
      document.getElementById("modal-qty").textContent = modalQty;
    }
  });
  document.getElementById("modal-add").addEventListener("click", () => {
    if (currentProduct) {
      addToCart(currentProduct.id, modalQty);
      closeModal();
    }
  });

  // Carousel nav in modal
  document.getElementById("modal-carousel").addEventListener("click", (e) => {
    const nav = e.target.closest(".carousel-nav");
    if (nav) {
      const dir = parseInt(nav.dataset.dir, 10);
      const active = document.querySelector("#modal-carousel img.active");
      let idx = parseInt(active.dataset.i, 10) + dir;
      const total = currentProduct.images.length;
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      modalShowImage(idx);
    }
    const dot = e.target.closest("[data-dot]");
    if (dot) modalShowImage(parseInt(dot.dataset.dot, 10));
  });

  // WhatsApp
  document.getElementById("send-whatsapp").addEventListener("click", sendWhatsApp);

  // Copy bank
  document.getElementById("copy-bank").addEventListener("click", copyBank);

  // Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  }

  // Install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("install-banner").classList.remove("hidden");
  });
  document.getElementById("install-btn")?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById("install-banner").classList.add("hidden");
  });
  document.getElementById("dismiss-install")?.addEventListener("click", () => {
    document.getElementById("install-banner").classList.add("hidden");
  });
});
