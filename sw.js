/* HumAIno® · Probabilidad y Distribuciones · SW v1.3.3 */
const CACHE='hia-prob-v1.3.3';
const LOCAL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./jstat.min.js','./chart.umd.min.js'];
const REMOTE=['https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(LOCAL);await Promise.allSettled(REMOTE.map(u=>c.add(u)));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(e.request.mode==='navigate'){e.respondWith((async()=>{try{const r=await fetch(e.request);const c=await caches.open(CACHE);c.put('./index.html',r.clone());return r;}catch(_){return (await caches.match('./index.html'))||(await caches.match('./'));}})());return;}e.respondWith((async()=>{const hit=await caches.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r&&(r.ok||r.type==='opaque')){const c=await caches.open(CACHE);c.put(e.request,r.clone());}return r;}catch(_){return hit||Response.error();}})());});
