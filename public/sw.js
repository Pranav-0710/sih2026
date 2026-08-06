/*
 * Monastery360 service worker.
 *
 * Sikkim's monasteries sit in areas with unreliable connectivity, so the goal
 * is that a visitor who has already loaded the app can still open it and read
 * previously-viewed monastery content while offline.
 *
 * Deliberately conservative:
 *  - Only same-origin GET requests are touched.
 *  - Supabase / Hugging Face / weather API calls are never cached, so live
 *    data is never served stale. They fall through to the network untouched.
 *  - Navigations use network-first, so a fresh deploy is picked up as soon as
 *    the device is back online, with the cached shell as the fallback.
 */

const CACHE = "monastery360-v1";
const OFFLINE_URL = "/";

// Never intercept these — they must always hit the network.
const BYPASS_HOSTS = [
  "supabase.co",
  "huggingface.co",
  "openweathermap.org",
  "tile.openstreetmap.org",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (BYPASS_HOSTS.some((host) => url.hostname.endsWith(host))) return;

  // Navigations: network-first so new deploys win, cache as offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(OFFLINE_URL, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL).then((r) => r || Response.error()))
    );
    return;
  }

  // Static assets: cache-first, then fill the cache in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
