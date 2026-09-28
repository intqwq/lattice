export const GROUPS={F:{en:'Foundations',zh:'通用基础',color:'#8a7c9d'},M:{en:'Mathematics',zh:'数学',color:'#8065da'},P:{en:'Physics',zh:'物理',color:'#348f9d'},C:{en:'Chemistry',zh:'化学',color:'#c38a38'},B:{en:'Biology',zh:'生物学',color:'#4c946c'},S:{en:'Computer science & OI',zh:'计算机与 OI',color:'#547fb6'},X:{en:'Connections',zh:'学科交叉',color:'#b47291'}};
export const text=(value,lang='en')=>typeof value==='string'?value:(value?.[lang]??value?.en??'');
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function indexLessons(lessons){return new Map(lessons.map(l=>[l.id,l]));}
export function ancestors(id,index){const seen=new Set();function visit(key){const n=index.get(key);if(!n)return;for(const p of n.prerequisites||[]){if(!seen.has(p)){seen.add(p);visit(p);}}}visit(id);return seen;}
export function topological(nodes){
  const byId=new Map(nodes.map(n=>[n.id,n])),mark=new Map(),result=[];
  if(byId.size!==nodes.length)throw new Error('Duplicate node IDs');
  function visit(id){if(mark.get(id)===1)throw new Error(`Dependency cycle at ${id}`);if(mark.get(id)===2)return;mark.set(id,1);for(const p of byId.get(id).prerequisites||[]){if(!byId.has(p))throw new Error(`Missing prerequisite ${p} for ${id}`);visit(p);}mark.set(id,2);result.push(byId.get(id));}
  for(const n of nodes)visit(n.id);return result;
}
export function routeTo(id,lessons){const index=indexLessons(lessons),ids=ancestors(id,index);ids.add(id);return topological(lessons).filter(n=>ids.has(n.id));}
export function numericValue(raw){
  const s=String(raw).trim().replaceAll('−','-');
  const atom='[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?';
  const m=s.match(new RegExp(`^(${atom})(?:\\s*/\\s*(${atom}))?$`));
  if(!m)return null;const a=Number(m[1]),b=m[2]===undefined?1:Number(m[2]);const value=a/b;return Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(value)&&b!==0?value:null;
}
export function grade(exercise,answer){
  if(exercise.type==='choice'){const valid=exercise.options.some(o=>o.id===answer);return {valid,correct:valid&&answer===exercise.answer};}
  const value=numericValue(answer);if(value===null)return{valid:false,correct:false};
  const tolerance=exercise.tolerance??Math.max(1e-9,Math.abs(exercise.answer)*1e-8);
  return{valid:true,correct:Math.abs(value-exercise.answer)<=tolerance};
}
export function initialState(){return{version:1,language:'en',theme:'light',view:'home',selectedLesson:'math.whole-numbers',selectedCourse:'F01',goal:'physics.velocity-calculus',graphMode:'subjects',atlasLevel:'all',designVersion:2,graphFocus:true,activeGroup:'all',search:'',progress:{},answers:{},notes:{},code:{},placement:{},routeGoal:null,lastLesson:null};}
export function lessonStatus(lesson,state,now=Date.now()){
  const p=state.progress[lesson.id];if(!p)return'new';
  if(Number.isFinite(p.practicedAt)&&Number.isFinite(p.dueAt)&&now>=p.dueAt)return'due';
  if(Number.isFinite(p.practicedAt))return'practiced';return'learning';
}
export function progressEvidence(lesson,state){const attempts=state.progress[lesson.id]?.attempts||[];return lesson.exercises.filter(e=>attempts.some(a=>a.exerciseId===e.id&&a.correct&&!a.assisted)).length;}
function retainedAttempts(attempts,limit=200){
  const evidence=new Set(),keep=new Set();
  for(let i=0;i<attempts.length;i++){const a=attempts[i];if(a.correct&&!a.assisted&&!evidence.has(a.exerciseId)){evidence.add(a.exerciseId);keep.add(i);}}
  for(let i=attempts.length-1;i>=0&&keep.size<limit;i--)keep.add(i);
  return [...keep].sort((a,b)=>a-b).map(i=>attempts[i]);
}
export function recordAttempt(state,lesson,exercise,result,assisted,answer,now=Date.now()){
  const canonical=lesson.exercises.find(e=>e.id===exercise.id);
  if(!canonical)throw new Error(`Unknown exercise ${exercise.id} for ${lesson.id}`);
  const checked=grade(canonical,answer);
  if(result?.valid!==true||!checked.valid)return state.progress[lesson.id]??null;
  const p=state.progress[lesson.id]??={startedAt:now,attempts:[]};
  const priorExposure=(p.assistedExercises??[]).includes(exercise.id)||p.attempts.some(a=>a.exerciseId===exercise.id);
  p.attempts.push({exerciseId:exercise.id,correct:checked.correct,assisted:!!assisted||priorExposure,answer:String(answer).slice(0,1000),at:now});
  p.assistedExercises??=[];
  if(!p.assistedExercises.includes(exercise.id))p.assistedExercises.push(exercise.id);
  if(p.attempts.length>200)p.attempts=retainedAttempts(p.attempts);
  const correct=new Set(p.attempts.filter(a=>a.correct&&!a.assisted).map(a=>a.exerciseId));
  if(lesson.exercises.length&&lesson.exercises.every(e=>correct.has(e.id))&&!Number.isFinite(p.practicedAt)){p.practicedAt=now;p.dueAt=now+3*86400000;}
  return p;
}
export function validateImport(value,lessons,courses){
  if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1)throw new Error('Unsupported backup format.');
  const data=value.state??value;
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid backup state.');
  const fresh=initialState(),lessonIds=new Set(lessons.map(l=>l.id)),courseIds=new Set(courses.map(c=>c.id));
  if(['en','zh'].includes(data.language))fresh.language=data.language;
  if(['light','dark','system'].includes(data.theme))fresh.theme=data.theme;
  if(lessonIds.has(data.lastLesson))fresh.lastLesson=data.lastLesson;
  if(lessonIds.has(data.selectedLesson))fresh.selectedLesson=data.selectedLesson;
  if(courseIds.has(data.selectedCourse))fresh.selectedCourse=data.selectedCourse;
  if(lessonIds.has(data.routeGoal))fresh.routeGoal=data.routeGoal;
  for(const [key,value]of Object.entries(data.notes||{})){if(lessonIds.has(key)&&typeof value==='string'&&value.length<=50000)fresh.notes[key]=value;}
  for(const [key,value]of Object.entries(data.code||{})){if(lessonIds.has(key)&&typeof value==='string'&&value.length<=200000)fresh.code[key]=value;}
  for(const [key,p]of Object.entries(data.progress||{})){
    if(!lessonIds.has(key)||!p||typeof p!=='object')continue;
    const lesson=lessons.find(l=>l.id===key),exerciseById=new Map(lesson.exercises.map(e=>[e.id,e]));
    const checkedAttempts=Array.isArray(p.attempts)?p.attempts.filter(a=>a&&exerciseById.has(a.exerciseId)&&typeof a.correct==='boolean'&&typeof a.assisted==='boolean'&&Number.isFinite(a.at)&&a.at>=0&&(typeof a.answer==='string'||typeof a.answer==='number')&&String(a.answer).length<=1000).flatMap(a=>{const answer=String(a.answer),result=grade(exerciseById.get(a.exerciseId),answer);return result.valid?[{exerciseId:a.exerciseId,correct:result.correct,assisted:a.assisted,at:a.at,answer}]:[];}):[];
    const attempts=retainedAttempts(checkedAttempts);
    const assistedExercises=[...new Set([...(Array.isArray(p.assistedExercises)?p.assistedExercises.filter(id=>typeof id==='string'&&exerciseById.has(id)):[]),...checkedAttempts.map(a=>a.exerciseId)])];
    fresh.progress[key]={startedAt:Number.isFinite(p.startedAt)&&p.startedAt>=0?p.startedAt:Date.now(),attempts,assistedExercises};
    const correct=new Set(attempts.filter(a=>a.correct&&!a.assisted).map(a=>a.exerciseId));
    if(lesson.exercises.length&&lesson.exercises.every(e=>correct.has(e.id))&&Number.isFinite(p.practicedAt)&&p.practicedAt>=0){fresh.progress[key].practicedAt=p.practicedAt;fresh.progress[key].dueAt=Number.isFinite(p.dueAt)&&p.dueAt>=p.practicedAt?p.dueAt:p.practicedAt+3*86400000;if(Number.isFinite(p.reviewedAt)&&p.reviewedAt>=p.practicedAt&&p.reviewedAt<=fresh.progress[key].dueAt)fresh.progress[key].reviewedAt=p.reviewedAt;}
  }
  return fresh;
}
export function layoutDAG(nodes){
  const ids=new Set(nodes.map(n=>n.id));
  const local=nodes.map(n=>({...n,prerequisites:(n.prerequisites||[]).filter(p=>ids.has(p))}));
  const ordered=topological(local),depth=new Map(),columns=new Map(),positions=new Map();
  for(const n of ordered){const d=Math.max(0,...n.prerequisites.map(p=>depth.get(p)+1));depth.set(n.id,d);if(!columns.has(d))columns.set(d,[]);columns.get(d).push(n);}
  for(const [d,column] of columns){column.sort((a,b)=>{const pa=a.prerequisites.map(p=>positions.get(p)?.y??0),pb=b.prerequisites.map(p=>positions.get(p)?.y??0);return(pa.length?pa.reduce((x,y)=>x+y,0)/pa.length:0)-(pb.length?pb.reduce((x,y)=>x+y,0)/pb.length:0)||a.group.localeCompare(b.group);});column.forEach((n,i)=>positions.set(n.id,{x:44+d*280,y:44+i*112,width:218,height:82}));}
  return{positions,width:Math.max(680,(columns.size)*280+60),height:Math.max(440,...[...columns.values()].map(c=>c.length*112+80))};
}
