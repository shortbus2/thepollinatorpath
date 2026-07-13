
(function(){
 const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
 const menu=$('.menu-btn'), links=$('.nav-links'); if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));

 function statusLinks(status){
   const s=status.toLowerCase();
   const links=[];
   if(s.includes('native') && !s.includes('non-native')) links.push(`<a class="chip chip-link" href="native.html">Native</a>`);
   if(s.includes('cultivar')) links.push(`<a class="chip chip-link" href="native-cultivar.html">${s.includes('native cultivar')?'Native cultivar':'Cultivar'}</a>`);
   if(s.includes('plant select')) links.push(`<a class="chip chip-link" href="plant-select.html">Plant Select</a>`);
   if(s.includes('non-native')) links.push(`<span class="chip">Non-native</span>`);
   return links.length?links.join(''):`<span class="chip">${status}</span>`;
 }

 function iconFor(p){if(p.type==='Tree')return'🌳';if(p.type==='Grass')return'🌾';if(p.type==='Shrub')return'🌿';if(p.type==='Vine')return'🌱';return'🌼'}
 function card(p){return `<a class="plant-card" href="plant.html?id=${p.number}"><div class="plant-photo"><span class="plant-number">#${p.number}</span><span>${iconFor(p)}</span></div><div class="plant-content"><h3>${p.common}</h3><div class="botanical">${p.botanical}</div><div class="meta">${p.bloom}</div><div class="chips">${statusLinks(p.status)}<span class="chip">${p.type}</span></div><div class="card-link">View plant →</div></div></a>`}
 const grid=$('#plant-grid');
 if(grid){
   const search=$('#search'), type=$('#type'), status=$('#status'), bloom=$('#bloom');
   [...new Set(PLANTS.map(p=>p.type))].sort().forEach(v=>type.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
   [...new Set(PLANTS.map(p=>p.status))].sort().forEach(v=>status.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
   ['Spring','Summer','Fall','Long season'].forEach(v=>bloom.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
   function season(p,v){const b=p.bloom.toLowerCase(); if(!v)return true;if(v==='Spring')return /april|may/.test(b);if(v==='Summer')return /june|july|august/.test(b);if(v==='Fall')return /september|october/.test(b);return /may.*september|may.*october|june.*september|july.*october/.test(b)}
   function render(){const q=search.value.trim().toLowerCase();const list=PLANTS.filter(p=>(!q||[p.number,p.common,p.botanical,p.location,p.status,p.pollinators.join(' ')].join(' ').toLowerCase().includes(q))&&(!type.value||p.type===type.value)&&(!status.value||p.status===status.value)&&season(p,bloom.value));grid.innerHTML=list.map(card).join('')||'<p class="empty">No plants found. The bees have not stolen them; try another filter.</p>';$('#result-count').textContent=`Showing ${list.length} of ${PLANTS.length} plants.`}
   [search,type,status,bloom].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',render));render();
 }
 const page=$('#plant-page');
 if(page){
   const id=Number(new URLSearchParams(location.search).get('id')); const p=PLANTS.find(x=>x.number===id)||PLANTS[0];
   document.title=`${p.common} · The Pollinator Path`;
   const visitors=(p.observed.length?p.observed:['Visitor records coming soon']).map(v=>`<div class="visitor"><div class="visitor-icon">${/humming/i.test(v)?'🐦':/butter|monarch/i.test(v)?'🦋':/bird/i.test(v)?'🐦':'🐝'}</div><small>${v}</small></div>`).join('');
   page.innerHTML=`<div class="plant-layout"><div class="plant-hero-image"><span class="plant-number">Plant #${p.number}</span>${iconFor(p)}</div><div class="plant-header"><div class="standing">📍 You’re standing in front of this plant—or you found it from the map while avoiding eye contact with a spiderweb.</div><h1>${p.common}</h1><div class="botanical" style="font-size:1.25rem">${p.botanical}</div><div class="chips">${statusLinks(p.status)}<span class="chip">${p.type}</span>${p.pollinators.map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="quick-grid"><div class="quick">☀️ <strong>Light</strong><small>${p.sun}</small></div><div class="quick">💧 <strong>Water</strong><small>${p.water}</small></div><div class="quick">🌸 <strong>Blooms</strong><small>${p.bloom}</small></div><div class="quick">📍 <strong>Find it</strong><small>${p.mapZone}</small></div></div></div>
   <div class="content-grid"><div>
   <section class="panel"><h2>Why I love it</h2><p>${p.story}</p></section>
   <section class="panel"><h2>Observed in my garden</h2><div class="visitor-list">${visitors}</div><p><small>These are actual garden observations where available—not a generic “may attract” list.</small></p></section>
   <section class="panel"><h2>Photo gallery</h2><div class="gallery"><div class="gallery-item">🌱</div><div class="gallery-item">🌸</div><div class="gallery-item">🐝</div><div class="gallery-item">🌾</div></div><p><small>Add your own images as <code>${p.image}</code> and expand this section over time.</small></p></section>
   <section class="panel"><h2>My garden notes</h2><ul>${p.notes.map(n=>`<li>${n}</li>`).join('')}</ul></section></div>
   <aside><section class="panel"><h2>Where is this plant?</h2><p><strong>${p.mapZone}</strong><br>${p.location}</p><a class="btn btn-green" href="map.html?plant=${p.number}">View on map</a></section>
   <section class="panel"><h2>Rabbit-hole starter</h2><p>${p.pollinators.includes('Native bees')||p.pollinators.includes('Bees')?'Many native bees are solitary. Some nest in hollow stems; others excavate tiny tunnels in bare ground. Yes, the dirt is habitat. No, it does not need to be “fixed.”':'Follow the visitor links as observations are added to see how this plant fits into the larger food web.'}</p></section></aside></div></div>`;
 }
 const map=$('#garden-map');
 if(map){
   const zones={ "West Garden":[20,24], "Boulder Garden":[20,68], "Oak Garden":[61,26], "Front Path":[64,72], "Shed Garden":[86,76], "Planter":[80,16], "Garage Wall":[74,48] };
   const grouped={}; PLANTS.forEach(p=>(grouped[p.mapZone]??=[]).push(p));
   Object.entries(grouped).forEach(([z,list])=>{const base=zones[z]||[50,50];list.forEach((p,i)=>{const angle=i*2.399;const radius=3+Math.sqrt(i)*2.2;const x=Math.max(3,Math.min(97,base[0]+Math.cos(angle)*radius));const y=Math.max(4,Math.min(96,base[1]+Math.sin(angle)*radius));map.insertAdjacentHTML('beforeend',`<button class="pin" style="left:${x}%;top:${y}%" data-id="${p.number}" aria-label="Plant ${p.number}, ${p.common}">${p.number}</button>`);});});
   const pop=$('#map-pop');$$('.pin',map).forEach(btn=>btn.addEventListener('click',()=>{const p=PLANTS.find(x=>x.number===Number(btn.dataset.id));pop.innerHTML=`<button style="float:right;border:0;background:none;font-size:1.3rem" aria-label="Close">×</button><strong>#${p.number} · ${p.common}</strong><div class="botanical">${p.botanical}</div><p>${p.mapZone} · ${p.bloom}</p><a class="btn btn-green" href="plant.html?id=${p.number}">Open plant profile</a>`;pop.classList.add('open');$('button',pop).addEventListener('click',()=>pop.classList.remove('open'));}));
   const focus=Number(new URLSearchParams(location.search).get('plant'));if(focus){const b=$(`.pin[data-id="${focus}"]`,map);if(b){setTimeout(()=>b.click(),100);b.scrollIntoView({block:'center'});}}
 }
})();
