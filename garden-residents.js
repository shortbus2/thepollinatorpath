(()=>{
  const cfg=window.FIELD_NOTEBOOK_CONFIG||{mode:'offline',apiUrl:''};
  const $=s=>document.querySelector(s);
  const list=$('#residentList');
  const status=$('#residentStatus');
  const keyInput=$('#residentApiKey');
  let residents=structuredClone(window.GARDEN_RESIDENTS||[]);

  keyInput.value=localStorage.getItem('gardenBrainKey')||localStorage.getItem('fieldNotebookKey')||'';

  function setStatus(message,type=''){
    status.textContent=message;
    status.className=`connection-note ${type}`.trim();
  }
  function slug(value){
    return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  function authHeaders(){
    const key=keyInput.value.trim();
    if(!key) throw new Error('Enter your Garden Brain key first.');
    localStorage.setItem('gardenBrainKey',key);
    return {'content-type':'application/json',authorization:`Bearer ${key}`};
  }
  function render(){
    if(!residents.length){
      list.innerHTML='<p class="connection-note">No residents have been added yet.</p>';
      return;
    }
    list.innerHTML=residents.map(r=>`<button class="resident-card" type="button" data-id="${escapeHtml(r.id)}"><span>${escapeHtml(r.icon||'🌿')}</span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.species||r.type||'')}</small><em>${escapeHtml(r.confidence||'reasonable')} confidence</em></button>`).join('');
    list.querySelectorAll('[data-id]').forEach(button=>button.addEventListener('click',()=>edit(button.dataset.id)));
  }
  function escapeHtml(value){
    return String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  }
  function edit(id){
    const r=residents.find(item=>item.id===id);
    if(!r)return;
    $('#residentId').value=r.id;
    $('#residentName').value=r.name||'';
    $('#residentType').value=r.type||'';
    $('#residentSpecies').value=r.species||'';
    $('#residentConfidence').value=r.confidence||'reasonable';
    $('#residentStatusField').value=r.status||'active';
    $('#residentIcon').value=r.icon||'';
    $('#residentPhoto').value=r.photo||'';
    $('#residentNotes').value=r.notes||'';
    $('#residentHeading').textContent=`Edit ${r.name}`;
    document.querySelector('.resident-editor').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function clear(){
    ['residentId','residentName','residentType','residentSpecies','residentIcon','residentPhoto','residentNotes'].forEach(id=>$('#'+id).value='');
    $('#residentConfidence').value='reasonable';
    $('#residentStatusField').value='active';
    $('#residentHeading').textContent='Add a resident';
  }
  async function loadLatest(showSuccess=true){
    if(cfg.mode!=='cloud'||!cfg.apiUrl){
      setStatus('Shared publishing is not configured. Showing the bundled resident list.','error');
      render();
      return false;
    }
    try{
      setStatus('Loading the latest residents…');
      const response=await fetch(cfg.apiUrl.replace(/\/$/,'')+'/garden',{headers:{authorization:`Bearer ${keyInput.value.trim()}`},cache:'no-store'});
      const body=await response.json();
      if(!response.ok) throw new Error(body.error||'Could not load residents.');
      if(Array.isArray(body.residents)) residents=body.residents;
      render();
      setStatus(showSuccess?'Latest residents loaded from GitHub.':'Ready.','success');
      return true;
    }catch(error){
      render();
      setStatus(`${error.message} Showing the resident list included with this site.`, 'error');
      return false;
    }
  }
  async function publishResidents(){
    const response=await fetch(cfg.apiUrl.replace(/\/$/,'')+'/residents',{
      method:'POST',
      headers:authHeaders(),
      body:JSON.stringify({residents}),
    });
    const body=await response.json();
    if(!response.ok) throw new Error(body.error||'Resident publishing failed.');
    return body;
  }

  $('#saveResident').addEventListener('click',async()=>{
    const name=$('#residentName').value.trim();
    if(!name){ setStatus('Give the resident a name before publishing.','error'); return; }
    const originalId=$('#residentId').value;
    const id=originalId||slug(name);
    const resident={
      id,
      name,
      type:$('#residentType').value.trim(),
      species:$('#residentSpecies').value.trim(),
      confidence:$('#residentConfidence').value,
      status:$('#residentStatusField').value,
      icon:$('#residentIcon').value.trim()||'🌿',
      notes:$('#residentNotes').value.trim(),
      public:true,
      photo:$('#residentPhoto').value.trim(),
    };
    const index=residents.findIndex(item=>item.id===id);
    if(index>=0) residents.splice(index,1,resident); else residents.push(resident);
    render();
    try{
      setStatus(`Publishing ${name}…`);
      const result=await publishResidents();
      clear();
      setStatus(`${name} published. ${result.changedFiles||1} file committed to GitHub; the site will refresh shortly. Pull the change in GitHub Desktop before editing source code on your laptop.`,'success');
    }catch(error){
      setStatus(`Could not publish: ${error.message} Your change has not been saved to GitHub.`,'error');
      await loadLatest(false);
    }
  });
  $('#newResident').addEventListener('click',clear);
  $('#loadResidents').addEventListener('click',()=>{
    if(keyInput.value.trim()) localStorage.setItem('gardenBrainKey',keyInput.value.trim());
    loadLatest();
  });

  render();
  if(keyInput.value.trim()) loadLatest(false);
  else setStatus('Enter your Garden Brain key to load and publish the shared resident list.');
})();
