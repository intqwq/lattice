import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessons,outlines,titles,goals} from '../content/index.mjs';
import {topological,routeTo,grade} from '../web/core.mjs';
import katex from '../web/vendor/katex/katex.mjs';

const blueprint=JSON.parse(fs.readFileSync(new URL('../blueprint/curriculum.json',import.meta.url),'utf8'));
const courseById=new Map(blueprint.courses.map(c=>[c.id,c]));
const locale=(value,label)=>{
  for(const language of ['en','zh'])assert.ok(typeof value?.[language]==='string'&&value[language].trim(),`${label}: missing ${language}`);
};

test('authored lessons have bilingual teaching, valid curriculum mappings and unique assessments', () => {
  const lessonIds=new Set(),exerciseIds=new Set();
  for(const lesson of lessons){
    assert.ok(!lessonIds.has(lesson.id),`Duplicate lesson ${lesson.id}`);lessonIds.add(lesson.id);
    const course=courseById.get(lesson.courseId);
    assert.ok(course,`Unknown course ${lesson.courseId}`);
    assert.ok(course.modules.some(m=>m.id===lesson.moduleId),`Unknown module ${lesson.moduleId}`);
    locale(lesson.title,lesson.id);locale(lesson.summary,lesson.id);
    assert.ok(lesson.objectives.length>=2,`${lesson.id}: objectives`);
    lesson.objectives.forEach(value=>locale(value,lesson.id));
    assert.ok(lesson.sections.length>=4,`${lesson.id}: sections`);
    for(const section of lesson.sections){
      assert.ok(['concept','example','pitfall','connection'].includes(section.type));
      locale(section.title,lesson.id);locale(section.body,lesson.id);
    }
    assert.ok(lesson.exercises.length>=2,`${lesson.id}: exercises`);
    assert.ok(lesson.exercises.length<=200,`${lesson.id}: too many exercise evidence records for the retained-history cap`);
    for(const exercise of lesson.exercises){
      assert.ok(!exerciseIds.has(exercise.id),`Duplicate exercise ${exercise.id}`);exerciseIds.add(exercise.id);
      locale(exercise.prompt,exercise.id);locale(exercise.explanation,exercise.id);
      assert.ok(exercise.hints.length>0,`${exercise.id}: hints`);
      exercise.hints.forEach(value=>locale(value,exercise.id));
      if(exercise.type==='choice'){
        assert.equal(new Set(exercise.options.map(o=>o.id)).size,exercise.options.length);
        exercise.options.forEach(option=>locale(option.text,exercise.id));
        assert.ok(exercise.options.some(o=>o.id===exercise.answer));
      }else{
        assert.equal(exercise.type,'numeric');assert.ok(Number.isFinite(exercise.answer));
        if(exercise.tolerance!==undefined)assert.ok(Number.isFinite(exercise.tolerance)&&exercise.tolerance>=0);
      }
      assert.deepEqual(grade(exercise,String(exercise.answer)),{valid:true,correct:true},`${exercise.id}: answer key fails its grader`);
    }
    assert.ok(lesson.sources.length>0,`${lesson.id}: sources`);
    for(const source of lesson.sources){assert.ok(source.title.trim());assert.equal(new URL(source.url).protocol,'https:');}
  }
});

test('actual course and lesson graphs are acyclic with no missing prerequisites', () => {
  assert.equal(topological(lessons).length,lessons.length);
  assert.equal(topological(blueprint.courses.map(c=>({...c,prerequisites:c.fullRouteReadiness}))).length,blueprint.courses.length);
});

test('every curriculum module has original bilingual teaching beyond shared framing', () => {
  const chapters=lessons.filter(l=>l.id.startsWith('module.'));
  const byModule=new Map(chapters.map(l=>[l.moduleId,l]));
  const bodyFrequency=new Map();
  for(const chapter of chapters)for(const section of chapter.sections){
    const body=section.body.en.trim();bodyFrequency.set(body,(bodyFrequency.get(body)??0)+1);
  }
  assert.equal(byModule.size,540);
  for(const course of blueprint.courses)for(const module of course.modules){
    const chapter=byModule.get(module.id);
    assert.ok(chapter,`Missing introductory chapter ${module.id}`);
    assert.ok(titles[module.id]?.zh&&outlines[module.id]?.concepts.length>=3,module.id);
    const uniqueText=chapter.sections.filter(s=>bodyFrequency.get(s.body.en.trim())===1).map(s=>s.body.en).join(' ');
    const count=(uniqueText.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)??[]).length;
    assert.ok(count>=160,`${module.id}: only ${count} topic-specific English words; investigate a stub or repeated framing`);
  }
});

test('every science module has a new application check and small nonzero keys reject zero', () => {
  for(const lesson of lessons){
    if(/^module\.[PCB]/.test(lesson.id)){
      assert.ok(lesson.exercises.some(e=>e.id.startsWith(lesson.id+'.transfer-v')&&Number(e.id.split('.transfer-v')[1])>=2),`${lesson.id}: missing new application check`);
    }
    for(const exercise of lesson.exercises){
      if(exercise.type==='numeric'&&exercise.answer!==0)
        assert.equal(grade(exercise,'0').correct,false,`${exercise.id}: tolerance incorrectly accepts zero`);
    }
  }
});

test('cross-subject routes include the mathematics needed by calculus physics and genetics', () => {
  const velocity=routeTo('physics.velocity-calculus',lessons).map(l=>l.id);
  for(const id of ['math.whole-numbers','math.fractions','math.variables','math.functions','math.limits','math.derivatives'])
    assert.ok(velocity.includes(id),`Velocity route omits ${id}`);
  assert.ok(velocity.indexOf('math.derivatives')<velocity.indexOf('physics.velocity-calculus'));
  const work=routeTo('physics.work-integral',lessons).map(l=>l.id);
  assert.ok(work.includes('math.integrals'));
  assert.ok(work.includes('math.fundamental-theorem'));
  const inheritance=routeTo('biology.inheritance',lessons).map(l=>l.id);
  assert.ok(inheritance.includes('math.probability'));
});

test('authored inline and display math renders with the bundled offline KaTeX', () => {
  let count=0;
  const visit=(value,path)=>{
    if(typeof value==='string'){
      for(const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)){
        const formula=match[1]??match[2];
        assert.doesNotThrow(()=>katex.renderToString(formula,{throwOnError:true,trust:false,displayMode:match[1]!==undefined}),path+': '+formula);
        count++;
      }
    }else if(Array.isArray(value))value.forEach((item,i)=>visit(item,path+'['+i+']'));
    else if(value&&typeof value==='object')for(const [key,item]of Object.entries(value))visit(item,path+'.'+key);
  };
  lessons.forEach(lesson=>visit(lesson,lesson.id));
  assert.ok(count>=20,'Only '+count+' math expressions checked; verify math formatting was not removed');
});

test('detailed module outlines refer to known modules and contain bilingual checks', () => {
  const modules=new Set(blueprint.courses.flatMap(c=>c.modules.map(m=>m.id)));
  for(const [id,outline] of Object.entries(outlines)){
    assert.ok(modules.has(id),`Unknown outlined module ${id}`);
    assert.ok(outline.concepts.length>=3,`${id}: too few concept entries`);
    outline.concepts.forEach(value=>locale(value,id));locale(outline.check,id);
  }
});
