import fs from 'node:fs/promises';
import {topological} from '../web/core.mjs';
import {lessons as authoredLessons,outlines,titles,goals} from '../content/index.mjs';
const root=new URL('../',import.meta.url);
const blueprint=JSON.parse(await fs.readFile(new URL('blueprint/curriculum.json',root),'utf8'));
const courses=blueprint.courses.map(c=>({...c,exitTask:goals[c.id]??{en:c.exitTask},modules:c.modules.map(m=>({...m,...(titles[m.id]?{title:titles[m.id],translationState:'bilingual'}:{}),availability:authoredLessons.some(l=>l.moduleId===m.id)?'teaching-available':'planned',chapterId:authoredLessons.find(l=>l.moduleId===m.id&&l.id.startsWith('module.'))?.id??null}))}));
const byCourse=new Map(courses.map(c=>[c.id,c]));
const lessons=authoredLessons.map(l=>({...l,group:byCourse.get(l.courseId)?.group??l.courseId[0]}));
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const bilingual=(v,where)=>assert(typeof v?.en==='string'&&v.en.trim()&&typeof v?.zh==='string'&&v.zh.trim(),`Missing bilingual text: ${where}`);
for(const c of courses){bilingual(c.exitTask,c.id+' goal');bilingual(c.title,c.id+' title');for(const m of c.modules)if(titles[m.id])bilingual(m.title,m.id+' title');}
assert(new Set(lessons.map(l=>l.id)).size===lessons.length,'Duplicate lesson IDs');
const exerciseIds=new Set();
for(const l of lessons){
  const c=byCourse.get(l.courseId);assert(c,`Unknown course ${l.courseId}`);assert(c.modules.some(m=>m.id===l.moduleId),`Unknown module ${l.moduleId}`);
  bilingual(l.title,l.id);bilingual(l.summary,l.id);assert(l.objectives.length>=2,`Too few objectives: ${l.id}`);l.objectives.forEach(v=>bilingual(v,l.id));
  assert(l.sections.length>=4,`Too few sections: ${l.id}`);for(const s of l.sections){bilingual(s.title,l.id);bilingual(s.body,l.id);}
  assert(l.exercises.length>=2,`Too few exercises: ${l.id}`);
  for(const e of l.exercises){assert(!exerciseIds.has(e.id),`Duplicate exercise ${e.id}`);exerciseIds.add(e.id);bilingual(e.prompt,e.id);bilingual(e.explanation,e.id);assert(e.hints?.length,`Missing hints ${e.id}`);e.hints.forEach(h=>bilingual(h,e.id));assert(['numeric','choice'].includes(e.type),`Invalid type ${e.id}`);if(e.type==='choice'){assert(e.options.some(o=>o.id===e.answer),`Invalid choice answer ${e.id}`);assert(new Set(e.options.map(o=>o.id)).size===e.options.length,`Duplicate option ${e.id}`);e.options.forEach(o=>bilingual(o.text,e.id));}else assert(Number.isFinite(e.answer),`Invalid numeric answer ${e.id}`);}
  assert(l.sources?.length,`Missing source ${l.id}`);for(const s of l.sources)assert(new URL(s.url).protocol==='https:',`Invalid source ${l.id}`);
}
topological(lessons);
for(const [id,o]of Object.entries(outlines)){assert(courses.some(c=>c.modules.some(m=>m.id===id)),`Unknown outline ${id}`);assert(o.concepts.length>=3,`Too few concepts ${id}`);o.concepts.forEach(x=>bilingual(x,id));bilingual(o.check,id);}
const sources=[...new Map(lessons.flatMap(l=>l.sources).map(s=>[s.url,s])).values()];
const data={version:1,generatedAt:new Date().toISOString(),courses,lessons,outlines,connections:blueprint.relatedConnections??blueprint.connections??[],sources,totals:{courses:courses.length,modules:courses.reduce((n,c)=>n+c.modules.length,0),lessons:lessons.length,exercises:exerciseIds.size,outlinedModules:Object.keys(outlines).length,moduleChapters:lessons.filter(l=>l.id.startsWith('module.')).length,coveredModules:new Set(lessons.map(l=>l.moduleId)).size,coursesWithAllChapters:courses.filter(c=>c.modules.every(m=>m.chapterId)).length,lessonEdges:lessons.reduce((n,l)=>n+l.prerequisites.length,0),crossSubjectEdges:lessons.reduce((n,l)=>n+l.prerequisites.filter(p=>lessons.find(x=>x.id===p).group!==l.group).length,0)}};
await fs.mkdir(new URL('web/data/',root),{recursive:true});await fs.writeFile(new URL('web/data/catalogue.json',root),JSON.stringify(data,null,2)+'\n');
await fs.writeFile(new URL('content/coverage.json',root),JSON.stringify(data.totals,null,2)+'\n');console.log(JSON.stringify(data.totals,null,2));
await import('./audit-content.mjs');
