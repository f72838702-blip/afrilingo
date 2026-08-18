// AfriLingo — service worker (hand-written, pas de next-pwa/serwist).
// Stratégies :
//  - /audio/*                 → cache-first (offline-friendly)
//  - /fonts/*                  → cache-first (police N'Ko)
//  - same-origin navigation    → stale-while-revalidate (app shell)
//  - same-origin assets (_next)→ stale-while-revalidate
//  - cross-origin              → network (pas de cache)
// Dev-gating côté registrant (components/service-worker-register.tsx).

const CACHE = "afrilingo-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/fonts/NotoSansNKo-Regular.ttf",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Cross-origin : réseau uniquement.
  if (url.origin !== self.location.origin) return;

  // Audio + fonts : cache-first.
  if (url.pathname.startsWith("/audio/") || url.pathname.startsWith("/fonts/")) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Navigation : app shell SWR, fallback offline si échec.
  if (req.mode === "navigate") {
    event.respondWith(
      staleWhileRevalidate(req).catch(() => caches.match("/offline"))
    );
    return;
  }

  // Autres assets same-origin : SWR.
  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req, { cache: "force-cache" });
    if (res.ok) {
      const c = await caches.open(CACHE);
      c.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response("", { status: 504 });
  }
}

async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res.ok) {
        const c = caches.open(CACHE);
        c.then((cache) => cache.put(req, res.clone()));
      }
      return res;
    })
    .catch(() => cached);
  return cached || network;
}