const CACHE='pollinator-path-v3.2.1-qc-hotfix';
const FILES=[
  'index.html','styles.css','app.js','data.js','image-manifest.js','observations.js','residents.js','weekly-recap.js',
  'garden-brain.html','garden-brain.css','garden-brain-home.js','garden-dashboard.html','garden-dashboard.js',
  'garden-tasks.html','garden-tasks.js','garden-residents.html','garden-residents.js',
  'field-notebook.html','field-notebook.js','field-config.js','garden-brain.js','vendor/heic2any.min.js'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
const MUTABLE=/\/(observations|placements|residents|image-manifest)\.js(?:\?|$)/;
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(MUTABLE.test(url.pathname)){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
