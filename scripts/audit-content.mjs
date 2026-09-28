import fs from 'node:fs/promises';
import {lessons,outlines,titles} from '../content/index.mjs';

const root=new URL('../',import.meta.url);
const {courses}=JSON.parse(await fs.readFile(new URL('blueprint/curriculum.json',root),'utf8'));
const chapters=lessons.filter(l=>l.id.startsWith('module.'));
const frequency=new Map();
for(const lesson of chapters)for(const section of lesson.sections){
  const body=section.body.en.trim();
  frequency.set(body,(frequency.get(body)??0)+1);
}
const words=body=>(body.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)??[]).length;
const entries=courses.flatMap(course=>course.modules.map(module=>{
  const chapter=chapters.find(l=>l.moduleId===module.id);
  return {
    module:module.id,
    title:module.title.en,
    chapter:chapter?.id??null,
    bilingualTitle:!!titles[module.id]?.zh,
    conceptTargets:outlines[module.id]?.concepts.length??0,
    englishTeachingWords:chapter?chapter.sections.reduce((n,s)=>n+words(s.body.en),0):0,
    uniqueEnglishTeachingWords:chapter?chapter.sections.filter(s=>frequency.get(s.body.en.trim())===1).reduce((n,s)=>n+words(s.body.en),0):0,
    exercises:chapter?.exercises.length??0,
    editorialReview:chapter?.editorialStatus??'not-authored',
  };
}));
const report={
  generatedAt:new Date().toISOString(),
  methodology:'Word counts describe breadth only. Unique teaching words exclude whole section bodies repeated across module chapters; this does not detect paraphrased repetition or prove correctness, concept coverage or pedagogical depth. All introductions still require independent editorial review.',
  totals:{modules:entries.length,chapters:chapters.length,missingChapters:entries.filter(e=>!e.chapter).length,missingTranslations:entries.filter(e=>!e.bilingualTitle).length,chaptersBelow160UniqueWords:entries.filter(e=>e.chapter&&e.uniqueEnglishTeachingWords<160).length},
  modules:entries,
};
await fs.writeFile(new URL('content/editorial-audit.json',root),JSON.stringify(report,null,2)+'\n');
const table=courses.map(course=>{
  const modules=entries.filter(e=>e.module.startsWith(course.id+'.'));
  const authored=modules.filter(e=>e.chapter),written=lessons.filter(l=>l.courseId===course.id);
  const counts=authored.map(e=>e.uniqueEnglishTeachingWords);
  return `| ${course.id} | ${course.title.en} / ${course.title.zh} | ${authored.length}/${modules.length} | ${written.length} | ${written.reduce((n,l)=>n+l.exercises.length,0)} | ${counts.length?Math.min(...counts)+'–'+Math.max(...counts):'—'} | Pending |`;
});
const markdown=`# Course coverage\n\nGenerated from the same original sources as the local teaching pack. ${report.totals.chapters}/${report.totals.modules} modules have introductory chapters. These counts describe authored material, not mastery, completed textbook depth or expert review.\n\nUnique English words exclude whole section bodies repeated across chapters. They are a check against stubs and reused framing, not a quality score. Read the [editorial policy](coverage-map.md).\n\n| Course | Title | Module introductions | All lessons | Questions | Unique English words per introduction | Editorial review |\n|---|---|---:|---:|---:|---:|---|\n${table.join('\n')}\n`;
await fs.writeFile(new URL('content/COVERAGE.md',root),markdown);
console.log(JSON.stringify(report.totals,null,2));
