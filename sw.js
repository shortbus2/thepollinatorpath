const CACHE='pollinator-field-v10';
const FILES=['field-notebook.html','field-notebook.js','field-config.js','data.js','observations.js','styles.css','vendor/heic2any.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
