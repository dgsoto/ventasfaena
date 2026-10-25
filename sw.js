const CACHE_NAME = "ventasfaena-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/products.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install: cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML/JS, cache-first for rest + offline fallback
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Solo mismo origen
  if (url.origin !== location.origin) {
    // Para imágenes externas (Unsplash / ImgBB) intentamos cachear también
    if (event.request.destination === "image") {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
          cache.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request)
              .then((res) => {
                if (res.ok) cache.put(event.request, res.clone());
                return res;
              })
              .catch(() => cached);
            return cached || fetchPromise;
          })
        )
      );
    }
    return;
  }

  // App shell: network first, fallback to cache
  if (event.request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Otros: cache first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
