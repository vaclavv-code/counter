const CACHE_NAME = "soutok-counter-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/soutok-192.png",
  "./icons/soutok-512.png"
];

// Instalace – nakešování základních souborů
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Aktivace – mazání starých cache, pokud změníš CACHE_NAME
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Obsluha requestů – jednoduchý cache-first pro základní soubory
self.addEventListener("fetch", event => {
  const { request } = event;

  // Pro navigace (klik na ikonu apky) vždy vrať index.html z cache (offline podpora)
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(response => response || fetch(request))
    );
    return;
  }

  // Ostatní – nejdřív cache, pak síť
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
