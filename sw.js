// Zwijnerij offline: pagina's eerst van het net, anders uit de cache
const C='zwijnerij-v12';
const CORE=['./','./index.html','./manifest.json','./icon-180.png','./icon-512.png','./fclatem.png','./fclatem-64.png','./pinte.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.pathname.endsWith('version.txt')||u.hostname.endsWith('supabase.co'))return; // altijd live
  const isPage=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
  if(isPage){const key=u.origin+u.pathname.replace(/\/$/,'/index.html');
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp))}return res}).catch(()=>caches.match(key).then(m=>m||caches.match('./index.html'))));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
