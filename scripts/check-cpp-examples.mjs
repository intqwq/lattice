import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {lessons} from '../content/index.mjs';

// Optional authoring check. This never runs a program and is not an in-app judge.
const directory=path.resolve(import.meta.dirname,'../.build-tools/cpp-check');
await fs.mkdir(directory,{recursive:true});
const compiler=process.env.CXX??'g++';
const examples=lessons.filter(l=>typeof l.code==='string'&&l.code.trim());
const checked=[];
for(const lesson of examples){
  const filename=path.join(directory,lesson.id.replace(/[^a-zA-Z0-9_.-]/g,'_')+'.cpp');
  await fs.writeFile(filename,lesson.code);
  const result=spawnSync(compiler,['-std=c++20','-fsyntax-only','-Wall','-Wextra','-Wpedantic','-Werror=return-type',filename],{encoding:'utf8',timeout:20000,windowsHide:true});
  if(result.error||result.status!==0)throw new Error(`${lesson.id}: ${result.error?.message??result.stderr}`);
  checked.push({lesson:lesson.id,warnings:result.stderr.trim()});
}
await fs.writeFile(path.join(directory,'report.json'),JSON.stringify({compiler,mode:'syntax-only; no programs executed',examples:checked},null,2));
console.log(JSON.stringify({checked:checked.length,withWarnings:checked.filter(x=>x.warnings).length,report:'.build-tools/cpp-check/report.json'}));
