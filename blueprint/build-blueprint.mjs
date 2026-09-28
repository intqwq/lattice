import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { groups, rows, moreRows, connections } from './curriculum-source.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const courses = `${rows}\n${moreRows}`.trim().split(/\r?\n/).filter(Boolean).map(line => {
  const cells = line.split('|');
  if (cells.length !== 7) throw new Error(`Expected seven fields: ${line}`);
  const [id,en,zh,level,prerequisites,route,exitTask] = cells;
  return {
    id, group: id[0], title: { en, zh }, levels: level.split(','),
    availability: 'planned',
    fullRouteReadiness: prerequisites ? prerequisites.split(',') : [],
    modules: route.split(' > ').map((title,i) => ({
      id: `${id}.${String(i+1).padStart(2,'0')}`, title: {en:title},
      translationState: 'zh-planned', availability:'planned',
      prerequisiteAuthoringState:'requires-lesson-level-mapping',
    })),
    exitTask,
  };
});

const ids = new Set(courses.map(c => c.id));
const moduleIds = new Set(courses.flatMap(c=>c.modules.map(m=>m.id)));
if (ids.size !== courses.length) throw new Error('Duplicate course IDs');
if (moduleIds.size !== courses.length*6) throw new Error('Duplicate or missing module IDs');
const byId = new Map(courses.map(c=>[c.id,c]));
for (const c of courses) {
  if (!groups.some(g=>g.id===c.group)) throw new Error(`Unknown group: ${c.id}`);
  if (c.modules.length!==6 || c.modules.some(m=>!m.title.en)) throw new Error(`Invalid route: ${c.id}`);
  if (!c.title.en || !c.title.zh || !c.exitTask) throw new Error(`Incomplete course: ${c.id}`);
  if (c.levels.some(l=>!['H','U','O','E'].includes(l))) throw new Error(`Invalid level: ${c.id}`);
  for (const p of c.fullRouteReadiness) if (!ids.has(p)||p===c.id) throw new Error(`Invalid prerequisite: ${c.id} -> ${p}`);
}
const marks = new Map(), order=[];
function visit(id, trail=[]) {
  if (marks.get(id)===1) throw new Error(`Readiness cycle: ${[...trail,id].join(' -> ')}`);
  if (marks.get(id)===2) return;
  marks.set(id,1);
  for (const p of byId.get(id).fullRouteReadiness) visit(p,[...trail,id]);
  marks.set(id,2); order.push(id);
}
for (const id of ids) visit(id);
for (const [a,b,label] of connections) if (!ids.has(a)||!ids.has(b)||!label||a===b) throw new Error('Invalid connection');

const curriculum = {
  schemaVersion:'blueprint-1', designDate:'2026-09-28', status:'proposal',
  languagePolicy:'UI and published lessons switch between zh-CN and en; course names are bilingual here; module and lesson translations remain authoring work.',
  scope:'Country-independent school foundations, undergraduate core, Olympiad branches, and selected advanced electives. Not an exhaustive university catalogue.',
  readinessSemantics:'Course links describe knowledge needed across the full route. They are not entry locks or a requirement to complete every predecessor. Published lessons need precise concept-level all-of/any-of prerequisites, verified by placement or practice.',
  groups,courses,
  relatedConnections:connections.map(([source,target,reason])=>({source,target,reason,type:'related',directed:false})),
};
fs.writeFileSync(path.join(dir,'curriculum.json'),JSON.stringify(curriculum,null,2)+'\n');

let md = '# Course catalogue and learning routes\n\n';
md += 'Design proposal · 28 September 2026 · All courses and modules below are **planned**, not published lessons.\n\n';
md += 'The catalogue contains **'+courses.length+' courses and '+moduleIds.size+' named modules**. Course titles are bilingual; full module and lesson translations will be reviewed during authoring. H = school foundations; U = undergraduate; O = Olympiad; E = advanced elective. These are independent tags, not a ladder that makes university completion mandatory before Olympiad study.\n\n';
md += '**How to read a route:** follow its six modules in the displayed order, with placement-based skips and optional deeper branches. Readiness references identify knowledge used somewhere in the full course. They are not whole-course entry locks. Exact lesson-level prerequisites must be authored before a course can be published. Exit tasks are proposed assessment targets, not evidence of learner mastery.\n\n';
md += '## Index\n\n| Area | Courses | Modules |\n|---|---:|---:|\n';
for(const g of groups){const n=courses.filter(c=>c.group===g.id).length;md+=`| ${g.en} / ${g.zh} | ${n} | ${n*6} |\n`;}
for(const g of groups){
  md+=`\n## ${g.en} / ${g.zh}\n\n`;
  for(const c of courses.filter(c=>c.group===g.id)){
    md+=`### ${c.id} · ${c.title.en} / ${c.title.zh}\n\n`;
    md+=`**Level:** ${c.levels.join(' / ')}. **Full-route readiness references:** ${c.fullRouteReadiness.join(', ')||'no course prerequisite; placement supplies a starting point'}.\n\n`;
    md+=c.modules.map((m,i)=>`${i+1}. ${m.title.en} (${m.id})`).join('\n')+'\n\n';
    md+=`**Exit task:** ${c.exitTask}\n\n`;
  }
}
md+='## Connections across courses\n\nThese links explain transfer of ideas. They are not prerequisite edges, and cycles are allowed.\n\n';
for(const [a,b,label] of connections) md+=`- **${a} ↔ ${b}:** ${label}\n`;
md+='\n## Coverage and authoring boundaries\n\n';
md+='The catalogue covers the requested subjects and a broad undergraduate core. It does not claim to include every specialized degree elective or every competition syllabus. Examples of later packs include measure-theoretic probability, PDEs, algebraic number theory, advanced materials, specialized organismal biology, robotics, and deeper programming-language theory. Extensions must connect to the existing graph rather than duplicate foundational lessons.\n\n';
md+='Olympiad studios reference topic families, not a guaranteed competition result or national selection path. Current competition alignment is separately versioned. Biology practicals and chemistry/physics laboratory technique require supervised physical work; software can teach reasoning and analyze evidence but cannot certify manual proficiency.\n\n';
md+='Rebuild and validate the catalogue with `node blueprint/build-blueprint.mjs` from the project root. See `validation.json` for structural checks and their limits.\n';
fs.writeFileSync(path.join(dir,'COURSE-CATALOGUE.md'),md);

const report={
  designDate:'2026-09-28',result:'passed',courses:courses.length,modules:moduleIds.size,
  readinessEdges:courses.reduce((n,c)=>n+c.fullRouteReadiness.length,0),relatedConnections:connections.length,
  countsByGroup:Object.fromEntries(groups.map(g=>[g.en,courses.filter(c=>c.group===g.id).length])),
  checks:['Unique course and module IDs','All readiness references resolve','No course-readiness cycles','Six nonempty modules and one exit task per course','Bilingual course titles present','All related links resolve','All course and module availability states are planned'],
  topologicalOrder:order,
  limitations:['Structural checks are not expert curriculum review.','Lesson-level dependency edges and Chinese module translations are not yet authored.','No production app, native build, installer, code runner, or authored-course completion is claimed.'],
};
fs.writeFileSync(path.join(dir,'validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:report.result,courses:report.courses,modules:report.modules,readinessEdges:report.readinessEdges,relatedConnections:report.relatedConnections,countsByGroup:report.countsByGroup},null,2));
