const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase();
const bilingual=value=>[value?.en??'',value?.zh??''].join(' ');

// Search both reading languages, including concepts explained inside a chapter.
export function searchCatalogue(data,query){
  const q=normalize(query).trim();
  if(!q)return {lessons:[],courses:[]};
  const ranked=(items,extra)=>items.map(item=>{
    const title=normalize(bilingual(item.title)),body=normalize(extra(item));
    const score=normalize(item.id)===q||title===q?5:title.includes(q)?4:body.includes(q)?1:0;
    return {item,score};
  }).filter(x=>x.score).sort((a,b)=>b.score-a.score).map(x=>x.item);
  return {
    lessons:ranked(data.lessons,l=>[
      l.id,l.moduleId,l.courseId,bilingual(l.summary),
      ...(l.objectives??[]).map(bilingual),
      ...(l.sections??[]).map(s=>bilingual(s.title)+' '+bilingual(s.body)),
      ...(data.outlines?.[l.moduleId]?.concepts??[]).map(bilingual),
    ].join(' ')),
    courses:ranked(data.courses,c=>[c.id,bilingual(c.exitTask),...(c.modules??[]).map(m=>bilingual(m.title))].join(' ')),
  };
}
