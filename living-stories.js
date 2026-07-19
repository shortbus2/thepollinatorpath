(function(){
'use strict';
const slugify=s=>String(s||'wildlife').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'wildlife';
const publicObs=()=> (window.OBSERVATIONS||[]).filter(o=>o.public!==false);
function rawSpecies(){return window.GARDEN_SPECIES||[]}
function resolveSpeciesId(id){let current=id,seen=new Set();while(current&&!seen.has(current)){seen.add(current);const record=rawSpecies().find(s=>s.id===current);if(!record?.mergedInto)break;current=record.mergedInto}return current||id}
function speciesRecords(){return rawSpecies().filter(s=>s.public!==false&&!s.mergedInto)}
function speciesForObservation(o){
 const ids=new Set(o.species||[]);
 (o.visitorDetails||[]).forEach(d=>{if(d.speciesId)ids.add(resolveSpeciesId(d.speciesId));else if(d.status!=='identification-pending')ids.add(d.id||slugify(d.label))});
 (o.visitors||[]).forEach(id=>{const resident=(window.GARDEN_RESIDENTS||[]).find(r=>r.id===id);ids.add(resolveSpeciesId(resident?.speciesId||id))});
 return [...ids];
}
function observationsForSpecies(id){id=resolveSpeciesId(id);return publicObs().filter(o=>speciesForObservation(o).map(resolveSpeciesId).includes(id))}
function residentsForSpecies(id){id=resolveSpeciesId(id);return (window.GARDEN_RESIDENTS||[]).filter(r=>r.public!==false&&resolveSpeciesId(r.speciesId)===id)}
function deriveSpecies(id){
 const base=speciesRecords().find(s=>s.id===id)||{id,name:id,icon:'🐾',status:'draft',public:true};
 const observations=observationsForSpecies(id).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const plants=[...new Set(observations.flatMap(o=>o.plants||[]).map(Number))];
 const behaviors=[...new Set(observations.flatMap(o=>o.behaviors||[]).filter(Boolean))];
 const areas=[...new Set(observations.flatMap(o=>o.areas||[]).filter(Boolean))];
 const photos=observations.flatMap(o=>(o.photos||[]).map(src=>({src,observationId:o.id,date:o.date,title:o.title}))); 
 const dates=observations.map(o=>o.date).filter(Boolean).sort();
 return {...base,observations,plants,behaviors,areas,photos,residents:residentsForSpecies(id),firstSeen:dates[0]||base.firstSeen||'',lastSeen:dates.at(-1)||'',observationCount:observations.length};
}
function allSpecies(){
 const ids=new Set(speciesRecords().map(s=>s.id)); publicObs().forEach(o=>speciesForObservation(o).forEach(id=>ids.add(id)));
 return [...ids].map(deriveSpecies);
}
window.LIVING_STORIES={slugify,publicObs,resolveSpeciesId,speciesForObservation,observationsForSpecies,residentsForSpecies,deriveSpecies,allSpecies};
})();
