import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const version='0.18.9';
const expected='8ad9RyoKsb/g8/yLFE+KAlP+DhbCTRUNi/V9XGsxn0R+trJJltNwzcDNo0q/DEkOy5fQUQTAQyCXCYSE+OakTQ==';
const cache=path.join(root,'.build-tools');
await fs.mkdir(cache,{recursive:true});
const archive=path.join(cache,`katex-${version}.tgz`);
const response=await fetch(`https://registry.npmjs.org/katex/-/katex-${version}.tgz`);
if(!response.ok)throw new Error(`KaTeX download: ${response.status}`);
const bytes=Buffer.from(await response.arrayBuffer());
if(createHash('sha512').update(bytes).digest('base64')!==expected)throw new Error('KaTeX integrity mismatch');
await fs.writeFile(archive,bytes);
const dest=path.join(root,'web/vendor/katex');
await fs.mkdir(dest,{recursive:true});
for(const args of [['-xf',archive,'-C',dest,'--strip-components=2','package/dist'],['-xf',archive,'-C',dest,'--strip-components=1','package/LICENSE']]){
  const r=spawnSync('tar',args,{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr||'tar failed');
}
await fs.writeFile(path.join(root,'web/vendor/NOTICE.txt'),`KaTeX ${version}\nCopyright (c) 2013-2020 Khan Academy and other contributors.\nMIT license: katex/LICENSE\nSource: https://github.com/KaTeX/KaTeX\nDownloaded from the npm registry; SHA-512 verified.\nAll scripts, CSS, and mathematical fonts are bundled locally.\n`);
console.log(`Bundled KaTeX ${version}; package integrity verified.`);
