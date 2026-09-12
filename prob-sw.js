/* ══ HumAIno® · Probabilidad y Distribuciones · SW v1.2 ══ */
const CACHE = 'hia-prob-v2';
/* El Cache Storage es por ORIGEN completo (cadafiq-eng.github.io), no por
   subcarpeta: caches.keys() ve también los cachés de estadística-avanzada,
   medicamentos, etc. Sin este prefijo, la limpieza en 'activate' borraba
   cachés de otras apps del mismo dominio. */
const PREFIX = 'hia-prob-';
const ASSETS = [
  '/probabilidad/',
  '/probabilidad/index.html',
  '/probabilidad/icon-192.png',
  '/probabilidad/icon-512.png',
  '/probabilidad/jstat.min.js',
  '/probabilidad/chart.umd.min.js'
  /* La hoja de Google Fonts se deja fuera a propósito: sigue viniendo de la
     red cuando hay conexión, y si no la hay el navegador cae a una fuente
     del sistema — es solo tipografía, no rompe ningún cálculo. */
];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(cached=>{if(cached)return cached;return fetch(e.request).then(r=>{if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}return r;});}));
  }
});
