(async()=>{
  const cfg=window.FIELD_NOTEBOOK_CONFIG||{};
  const online=document.querySelector('#online');
  const note=document.querySelector('#connectionNote');
  let service=false;
  try{
    const r=await fetch(cfg.apiUrl.replace(/\/$/,'')+'/health',{cache:'no-store'});
    const j=await r.json();
    service=!!j.ok;
    online.classList.toggle('ok',service);
    online.querySelector('span:last-child').textContent=service?`Online · v${j.version}`:'Offline';
    note.textContent=service?'Secure helper is online. Field entries can publish directly to GitHub.':'The public website still works, but publishing is temporarily unavailable.';
  }catch(e){online.querySelector('span:last-child').textContent='Offline';note.textContent='Could not reach the secure helper. Existing garden data remains safe.';}
  const obs=window.OBSERVATIONS||[];
  const plants=window.PLANTS||[];
  const placements=window.GARDEN_PLACEMENTS||window.GARDEN_BRAIN?.placements||[];
  const portraits=plants.filter(p=>window.IMAGE_MANIFEST?.plants?.[p.number]?.hero).length;
  document.querySelector('#summary').innerHTML=[
    ['Plants',plants.length],['Portraits',`${portraits}/${plants.length}`],['Observations',obs.length],['Placements',placements.length]
  ].map(([a,b])=>`<div class="metric-card"><span>${a}</span><strong>${b}</strong></div>`).join('');
  const prompts=[];
  plants.forEach(p=>{if(!window.IMAGE_MANIFEST?.plants?.[p.number]?.hero)prompts.push(`<a class="prompt" href="field-notebook.html?kind=plant&id=${p.number}">📷 ${p.common} still needs a master portrait.</a>`)});
  if(!obs.length)prompts.unshift('<a class="prompt" href="field-notebook.html">🌼 Record the first live Garden Brain observation.</a>');
  document.querySelector('#prompts').innerHTML=prompts.slice(0,8).join('')||'<div class="prompt">Everything current. Go enjoy the garden. 💚</div>';
})();
