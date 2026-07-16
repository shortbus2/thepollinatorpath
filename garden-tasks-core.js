window.GARDEN_TASK_ENGINE=(()=>{
  const list=()=>{
    const plants=window.PLANTS||[],obs=window.OBSERVATIONS||[],placements=window.GARDEN_PLACEMENTS||window.GARDEN_BRAIN?.placements||[],objects=window.GARDEN_BRAIN?.objects||[];
    const mapped=new Set(placements.filter(p=>p.kind==='plant').map(p=>Number(p.plantNumber??p.id)).filter(Number.isFinite));
    const observedPlants=new Set(obs.flatMap(o=>(o.plants||[]).map(Number)));
    const observedObjects=new Set(obs.flatMap(o=>o.objects||[]));
    const tasks=[];
    const portrait=p=>Boolean(window.IMAGE_MANIFEST?.plants?.[String(p.number)]?.hero);
    plants.forEach(p=>{
      if(!portrait(p))tasks.push({type:'portraits',priority:90,text:`${p.common} (#${p.number}) still needs a master portrait.`,href:`field-notebook.html?kind=plant&id=${p.number}`});
      if(!mapped.has(Number(p.number)))tasks.push({type:'map',priority:60,text:`${p.common} (#${p.number}) is not yet placed on the map.`,href:'garden-map-editor.html'});
      if(!observedPlants.has(Number(p.number)))tasks.push({type:'observations',priority:45,text:`${p.common} (#${p.number}) has no linked Garden Walk yet.`,href:`field-notebook.html?kind=plant&id=${p.number}`});
    });
    objects.forEach(o=>{if(!observedObjects.has(o.id))tasks.push({type:'places',priority:35,text:`${o.name} has no linked Garden Walk yet.`,href:`field-notebook.html?kind=object&id=${o.id}`});});
    if(obs.length<2)tasks.unshift({type:'walks',priority:100,text:'Take another Garden Walk so weekly patterns can begin to emerge.',href:'field-notebook.html'});
    return tasks.sort((a,b)=>b.priority-a.priority||a.text.localeCompare(b.text));
  };
  return {list};
})();
