(()=>{
  const manifest=window.IMAGE_MANIFEST||{};
  const configured=Array.isArray(manifest.hero)?manifest.hero:[];
  const imagePaths=configured.map(item=>typeof item==='string'?item:item?.src).filter(Boolean);
  const carousel=document.querySelector('#heroCarousel');
  const progress=document.querySelector('#heroProgress');
  let active=0,timer=null,startX=0;
  if(carousel&&imagePaths.length){
    carousel.innerHTML=imagePaths.map((src,i)=>`<div class="hero-slide${i===0?' active':''}" style="background-image:url('${String(src).replace(/'/g,"%27")}')"></div>`).join('');
    progress.innerHTML=imagePaths.map((_,i)=>`<button type="button" class="${i===0?'active':''}" aria-label="Show featured image ${i+1}"></button>`).join('');
    const slides=[...carousel.children],dots=[...progress.children];
    const show=index=>{active=(index+slides.length)%slides.length;slides.forEach((x,i)=>x.classList.toggle('active',i===active));dots.forEach((x,i)=>{x.classList.remove('active');void x.offsetWidth;x.classList.toggle('active',i===active)});restart();};
    const restart=()=>{clearTimeout(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&slides.length>1)timer=setTimeout(()=>show(active+1),8000)};
    dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));
    carousel.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});
    carousel.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45)show(active+(delta<0?1:-1))},{passive:true});
    restart();
  }else if(progress){progress.hidden=true;}

  const observations=(window.OBSERVATIONS||[]).filter(o=>o.public!==false);
  const now=new Date();
  const recent=observations.filter(o=>{const d=new Date(`${o.date}T12:00:00`);return Number.isFinite(d.valueOf())&&(now-d)/864e5<=7&&(now-d)/864e5>=-1;});
  const title=document.querySelector('#weeklyTitle'),summary=document.querySelector('#weeklySummary'),chips=document.querySelector('#weeklyChips');
  if(!title||!summary||!chips)return;
  if(!recent.length){title.textContent='The garden keeps its own rhythm';summary.textContent='No public Garden Walks were published this week—and that is perfectly fine. The garden is still growing, visiting, resting, and waiting to be noticed again.';return;}
  const visitorIds=[...new Set(recent.flatMap(o=>o.visitors||[]))];
  const plantNums=[...new Set(recent.flatMap(o=>o.plants||[]).map(Number))];
  const behaviors=[...new Set(recent.flatMap(o=>o.behaviors||[]).filter(Boolean))];
  const visitorRecords=visitorIds.map(id=>(window.VISITORS||[]).find(v=>v.slug===id)||(window.GARDEN_RESIDENTS||[]).find(r=>r.id===id)||{id,slug:id,name:id,icon:'🐝'}).filter(Boolean);
  const plantRecords=plantNums.map(n=>(window.PLANTS||[]).find(p=>Number(p.number)===n)).filter(Boolean);
  const visitors=visitorRecords.map(v=>v.name);
  const plants=plantRecords.map(p=>p.common);
  title.textContent=recent.length===1?'One Garden Walk, worth remembering':`${recent.length} Garden Walks, woven together`;
  const parts=[];
  if(visitors.length)parts.push(`${visitors.slice(0,3).join(', ')}${visitors.length>3?` and ${visitors.length-3} more visitor${visitors.length-3===1?'':'s'}`:''} appeared in this week’s field notes`);
  if(plants.length)parts.push(`${plants.slice(0,3).join(', ')}${plants.length>3?' and other plants':''} helped tell the story`);
  if(behaviors.length)parts.push(`the notes included ${behaviors.slice(0,3).join(', ').toLowerCase()}`);
  summary.textContent=(parts.length?parts.join('. ')+'. ':'')+'Every name below opens another part of the garden’s story.';
  chips.innerHTML=[...visitorRecords.slice(0,4).map(v=>`<a class="weekly-chip" href="wildlife.html?id=${encodeURIComponent(v.slug||v.id)}">${v.icon||'🐝'} ${v.name}</a>`),...plantRecords.slice(0,4).map(p=>`<a class="weekly-chip" href="plant.html?id=${p.number}">🌿 ${p.common}</a>`)].join('');
})();
