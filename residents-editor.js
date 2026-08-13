(()=>{
  'use strict';
  const $=selector=>document.querySelector(selector);
  const cfg=window.FIELD_NOTEBOOK_CONFIG||{};
  const contractPromise=import('./domain/foundation-write-contract.mjs');
  const els={name:$('#name'),icon:$('#icon'),type:$('#type'),species:$('#species'),confidence:$('#confidence'),status:$('#residentStatus'),notes:$('#notes'),public:$('#public'),box:$('#residentStatusBox'),list:$('#residentList')};
  let residents=structuredClone(window.GARDEN_RESIDENTS||[]),selected=null,remoteRevision='';
  const key=()=>localStorage.getItem('gardenBrainKey')||'';
  const slug=value=>String(value||'resident').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'resident';
  function status(text,bad=false){els.box.textContent=text;els.box.style.background=bad?'#f9e7e2':'#eef3eb'}
  function render(){
    els.list.innerHTML=residents.map(record=>'<button type="button" class="resident-card" data-id="'+record.id+'" style="text-align:left"><strong>'+(record.icon||'🌿')+' '+record.name+'</strong><br><small>'+(record.type||'')+(record.species?' · '+record.species:'')+' · '+(record.confidence||'reasonable')+'</small></button>').join('')||'<div class="resident-card">No residents yet.</div>';
    els.list.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>load(button.dataset.id)));
  }
  function clear(){selected=null;['name','icon','type','species','notes'].forEach(name=>{els[name].value=''});els.confidence.value='reasonable';els.status.value='active';els.public.checked=true;status('Creating a staging acceptance resident.')}
  function load(id){const record=residents.find(candidate=>candidate.id===id);if(!record)return;selected=id;for(const [name,value] of Object.entries({name:record.name||'',icon:record.icon||'',type:record.type||'',species:record.species||'',notes:record.notes||''}))els[name].value=value;els.confidence.value=record.confidence||'reasonable';els.status.value=record.status||'active';els.public.checked=record.public!==false;status(id.startsWith('stg-')?'Editing staging resident.':'Foundation baseline resident is read-only.')}
  async function api(path,options={}){
    const token=key();if(!token)throw Error('Open a Garden Walk once and save your Garden Brain key first.');
    const response=await fetch(cfg.apiUrl.replace(/\/$/,'')+path,{...options,headers:{'content-type':'application/json',authorization:'Bearer '+token,...(options.headers||{})},cache:'no-store'});
    const body=await response.json();if(!response.ok)throw Error(body.error||'Resident request failed ('+response.status+').');return body;
  }
  async function refresh(){const body=await api('/garden');residents=body.residents||[];remoteRevision=body.revision||'';if(!remoteRevision)throw Error('No staging data revision was returned.');render();return body}
  async function save(){
    if(!els.name.value.trim())throw Error('Resident name is required.');
    if(selected&&!selected.startsWith('stg-'))throw Error('Foundation baseline residents are read-only during staging acceptance.');
    if(!remoteRevision)await refresh();
    const id=selected||'stg-'+slug(els.name.value)+'-'+crypto.randomUUID().slice(0,8);
    const original=residents.find(record=>record.id===id)||{};
    const record={...original,id,name:els.name.value.trim(),icon:els.icon.value.trim()||'🌿',type:els.type.value.trim(),species:els.species.value.trim(),confidence:els.confidence.value,status:els.status.value,notes:els.notes.value.trim(),public:els.public.checked};
    const next=residents.map(candidate=>candidate.id===id?record:candidate);if(!next.some(candidate=>candidate.id===id))next.push(record);
    const contract=await contractPromise,body=await api('/residents',{method:'POST',body:JSON.stringify(contract.withRevision({residents:next},remoteRevision))});
    residents=body.residents||next;remoteRevision=body.commitSha||remoteRevision;selected=id;render();status(record.name+' saved to the isolated staging data branch.');
  }
  $('#newResident').addEventListener('click',clear);
  $('#saveResident').addEventListener('click',()=>save().catch(error=>status(error.message,true)));
  $('#deleteResident').addEventListener('click',()=>status('Resident deletion is blocked during Foundation staging acceptance.',true));
  render();
  if(key())refresh().catch(error=>status(error.message,true));
})();
