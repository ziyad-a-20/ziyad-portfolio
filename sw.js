const CACHE = "ziyad-v4";
const PRE = ["/", "/index.html", "/style.css", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(e.request).then((cached) => {
        const net = fetch(e.request)
          .then((r) => {
            if (r && r.status === 200) c.put(e.request, r.clone());
            return r;
          })
          .catch(() => cached);
        return cached || net;
      }),
    ),
  );
});
