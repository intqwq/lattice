import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const fragmentPath=process.argv[2];
if(!fragmentPath)throw new Error('Pass the absolute visualization fragment path.');
const curriculum=JSON.parse(fs.readFileSync(path.join(dir,'curriculum.json'),'utf8'));
const data={
  groups:curriculum.groups,
  courses:curriculum.courses.map(c=>({id:c.id,group:c.group,en:c.title.en,zh:c.title.zh,requires:c.fullRouteReadiness,modules:c.modules.map(m=>m.title.en),exit:c.exitTask})),
  connections:curriculum.relatedConnections.map(c=>[c.source,c.target]),
};
let fragment=fs.readFileSync(fragmentPath,'utf8');
fragment=fragment.replace(/(<script type="application\/json" id="lt-curriculum-data">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(data).replaceAll('<','\\u003c')+b);
if(fragment.includes('__COURSE_DATA__'))throw new Error('Unresolved data placeholder');
for(const match of fragment.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
if(Buffer.byteLength(fragment)>1_000_000)throw new Error('Visualization exceeds size limit');
fs.writeFileSync(fragmentPath,fragment);
const Ka=1e-5,C=.1,x=(Math.sqrt(Ka*Ka+4*Ka*C)-Ka)/2;
console.log(JSON.stringify({fragmentBytes:Buffer.byteLength(fragment),courses:data.courses.length,scriptSyntax:'passed',sampleCalculations:{staticThresholdN:.7*2*9.8*Math.cos(Math.PI/6),frictionAt20DegreesN:2*9.8*Math.sin(Math.PI/9),accelerationAt45Degrees:9.8*(Math.sin(Math.PI/4)-.2*Math.cos(Math.PI/4)),acidConcentration:x,pH:-Math.log10(x),carrierProportion:2*.7*.3,crtExampleRemainders:[14%6,14%9],crtPracticeRemainders:[11%4,11%6]}},null,2));
