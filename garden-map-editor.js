(()=>{
const B=structuredClone(window.GARDEN_BRAIN),cfg=window.FIELD_NOTEBOOK_CONFIG||{mode:'offline',apiUrl:''},$=s=>document.querySelector(s),map=$('#e-map'),kind=$('#e-kind'),sub=$('#e-subject'),img=$('#e-image'),layer=$('#e-layer'),stage=$('#e-stage'),status=$('#e-status'),key=$('#e-key');
const localKey='tpp-map-edits-v2';let placements=JSON.parse(localStorage.getItem(localKey)||'null')||B.placements;
key.value=localStorage.getItem('fieldNotebookKey')||'';
B.maps.forEach(m=>map.add(new Option(m.name,m.id)));
function subjects(){sub.innerHTML='';if(kind.value==='plant')PLANTS.forEach(p=>sub.add(new Option(`#${p.number} · ${p.common}`,p.number)));else B.objects.forEach(o=>sub.add(new Option(`${o.name} · ${o.type}`,o.id)))}
function label(p){return p.kind==='plant'?p.plantNumber:'●'}
function save(){localStorage.setItem(localKey,JSON.stringify(placements));status.textContent='Saved locally on this device.'}
function render(){const m=B.maps.find(x=>x.id===map.value);img.src=m.image;layer.innerHTML=placements.filter(p=>p.map===map.value).map(p=>`<button class="map-marker ${p.kind}" style="left:${p.x}%;top:${p.y}%" data-id="${p.id}" aria-label="Placement ${label(p)}">${label(p)}</button>`).join('')}
function point(ev){const r=stage.getBoundingClientRect();return{x:Math.max(0,Math.min(100,(ev.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(ev.clientY-r.top)/r.height*100))}}
stage.addEventListener('click',e=>{if(e.target.closest('.map-marker'))return;const q=point(e);placements.push({id:'p-'+Date.now(),kind:kind.value,map:map.value,x:+q.x.toFixed(2),y:+q.y.toFixed(2),quantity:+$('#e-qty').value||1,precision:$('#e-precision').value,status:'active',...(kind.value==='plant'?{plantNumber:+sub.value}:{objectId:sub.value})});save();render()});
let dragging=null;layer.addEventListener('pointerdown',e=>{const b=e.target.closest('.map-marker');if(!b)return;dragging=placements.find(p=>p.id===b.dataset.id);b.setPointerCapture(e.pointerId)});layer.addEventListener('pointermove',e=>{if(!dragging)return;const q=point(e);dragging.x=+q.x.toFixed(2);dragging.y=+q.y.toFixed(2);render()});layer.addEventListener('pointerup',()=>{if(dragging){save();dragging=null}});
map.addEventListener('change',render);kind.addEventListener('change',subjects);
$('#reset').addEventListener('click',()=>{localStorage.removeItem(localKey);placements=structuredClone(B.placements);render();status.textContent='Local edits reset.'});
$('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:B.version,placements},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='garden-placements-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status.textContent='Backup JSON downloaded.'});
$('#publish-map').addEventListener('click',async()=>{try{localStorage.setItem('fieldNotebookKey',key.value);if(cfg.mode!=='cloud'||!cfg.apiUrl)throw Error('The secure helper is not connected yet. Complete AUTOMATION-SETUP.md first.');status.textContent='Publishing placements…';const r=await fetch(cfg.apiUrl.replace(/\/$/,'')+'/placements',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+key.value},body:JSON.stringify({version:B.version,placements})});const j=await r.json();if(!r.ok)throw Error(j.error||'Publish failed');localStorage.removeItem(localKey);status.textContent='Published. GitHub Pages should update shortly.';}catch(err){status.textContent='Could not publish: '+err.message}});
subjects();render();
})();
