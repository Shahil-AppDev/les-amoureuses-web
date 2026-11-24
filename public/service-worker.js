// Les Amoureuses PWA — cache statique public uniquement.
// Jamais de cache sur : panier, compte, commande, paiement, réservation, APIs.
const CACHE = 'la-static-v1';
const NEVER_CACHE = [
  /\/wp-json\//, /\/panier/, /\/cart/, /\/commande/, /\/checkout/,
  /\/mon-compte/, /\/my-account/, /reservation\.elloha\.com/, /paybox/i,
  /booking\.addock\.co/, /fonts\.googleapis\.com/, /fonts\.gstatic\.com/,
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || NEVER_CACHE.some((re) => re.test(url.href))) return;
  // Static same-origin assets only (js/css/images/icons/manifest)
  const isStatic = url.origin === location.origin &&
    /\.(js|css|png|jpg|jpeg|webp|svg|woff2?|webmanifest|ico)$/.test(url.pathname);
  if (!isStatic) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(e.request);
      const fetchp = fetch(e.request).then((res) => {
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => hit);
      return hit || fetchp;
    })
  );
});
