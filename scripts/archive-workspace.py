"""Create a checksummed, restorable project snapshot without browser credentials.

Run after committing project changes. Output must be a new directory under dist/.
Every ZIP part extracts into the same Learning/ directory; no files are deleted.
"""
from pathlib import Path
import argparse, collections, hashlib, json, os, re, subprocess, zipfile

ROOT = Path(__file__).resolve().parents[1]
SIGNATURES = re.compile(rb'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-(?:proj-)?[A-Za-z0-9_-]{40,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[ \t\r\n]+[A-Za-z0-9+/=]{32,})')

def git(*args, binary=False):
    return subprocess.check_output(['git', '-c', 'safe.directory='+ROOT.as_posix(), *args], cwd=ROOT, text=not binary)

def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(2**20), b''): h.update(block)
    return h.hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--part-mib', type=int, default=512)
    args=parser.parse_args()
    output=(ROOT/args.output).resolve()
    if not output.is_relative_to(ROOT/'dist') or output==ROOT/'dist':
        raise SystemExit('Choose a new subdirectory inside dist/.')
    if output.exists(): raise SystemExit('Output already exists; no files were overwritten.')
    if args.part_mib<64: raise SystemExit('Part size must be at least 64 MiB.')
    if git('status','--porcelain').strip(): raise SystemExit('Commit all nonignored changes first.')
    output.mkdir(parents=True)
    excluded=collections.defaultdict(lambda:{'files':0,'bytes':0})
    selected=[]
    def walk_error(error): raise error
    for base,dirs,files in os.walk(ROOT,followlinks=False,onerror=walk_error):
        base=Path(base)
        dirs[:]=sorted(d for d in dirs if (base/d).resolve()!=output and not (base==ROOT and d=='.git'))
        for d in dirs:
            p=base/d
            if p.is_symlink() or p.is_junction(): raise RuntimeError('Inspect linked directory before archiving: '+str(p))
        for name in sorted(files):
            path=base/name
            if path.is_symlink(): raise RuntimeError('Inspect linked file before archiving: '+str(path))
            rel=path.relative_to(ROOT).as_posix()
            parts={part.lower() for part in path.relative_to(ROOT).parts}
            reason='disposable-browser-test-profile' if parts & {'smoke-profile','webview2'} else None
            if parts & {'.aws','.ssh','.codex','.agents'} or name.lower().startswith('.env') or name=='AGENTS.md':
                reason='private-machine-configuration'
            info=path.stat()
            if reason:
                excluded[reason]['files']+=1;excluded[reason]['bytes']+=info.st_size
                continue
            selected.append((path,rel,info.st_size,info.st_mtime_ns))
    # Scan all selected payloads, including binaries, before any upload. Never print a match.
    for path,rel,_,_ in selected:
        tail=b''
        with path.open('rb') as stream:
            for block in iter(lambda:stream.read(2**20),b''):
                chunk=tail+block
                if SIGNATURES.search(chunk): raise RuntimeError('Potential credential requires review in '+rel)
                tail=chunk[-256:]
    print(json.dumps({'selectedFiles':len(selected),'selectedBytes':sum(x[2] for x in selected),'excluded':dict(excluded)}),flush=True)
    bundle=output/'Lattice-git-history.bundle'
    git('bundle','create',str(bundle),'--all')
    git('bundle','verify',str(bundle))
    unreachable=[]
    for line in git('fsck','--full','--no-reflogs','--unreachable').splitlines():
        fields=line.split()
        if len(fields)==3 and fields[0] in {'dangling','unreachable'}:
            kind,oid=fields[1:]; raw=git('cat-file',kind,oid,binary=True)
            if SIGNATURES.search(raw): raise RuntimeError('Potential credential in unreachable Git object '+oid)
            unreachable.append((kind,oid,raw))
    if unreachable:
        recovery=output/'Lattice-git-recovery.zip'
        with zipfile.ZipFile(recovery,'w',compression=zipfile.ZIP_DEFLATED) as z:
            for kind,oid,raw in unreachable:z.writestr(f'{kind}-{oid}.object',raw)
            z.writestr('RESTORE.txt','These are unreachable Git object payloads. To restore an object, run git hash-object -t TYPE -w FILE. The resulting object ID must match its filename.\n')
    parts=[]; records=[]; chunk=[]; size=0; limit=args.part_mib*2**20
    def write_part(rows):
        name=f'Lattice-workspace-part-{len(parts)+1:02d}.zip'; target=output/name
        with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
            for path,rel,n,mtime in rows:
                before=path.stat()
                if (before.st_size,before.st_mtime_ns)!=(n,mtime):raise RuntimeError('File changed before capture: '+rel)
                h=hashlib.sha256()
                entry=zipfile.ZipInfo.from_file(path,'Learning/'+rel)
                entry.compress_type=zipfile.ZIP_DEFLATED
                with path.open('rb') as src,z.open(entry,'w',force_zip64=True) as dest:
                    for block in iter(lambda:src.read(2**20),b''):h.update(block);dest.write(block)
                after=path.stat()
                if (after.st_size,after.st_mtime_ns)!=(n,mtime):raise RuntimeError('File changed during capture: '+rel)
                records.append({'path':rel,'bytes':n,'sha256':h.hexdigest(),'asset':name})
        with zipfile.ZipFile(target) as z:
            if z.testzip() is not None:raise RuntimeError('CRC verification failed: '+name)
            for record in records[-len(rows):]:
                with z.open('Learning/'+record['path']) as stream:
                    h=hashlib.sha256()
                    for block in iter(lambda:stream.read(2**20),b''):h.update(block)
                if h.hexdigest()!=record['sha256']:raise RuntimeError('Restored hash mismatch: '+record['path'])
        parts.append(name)
        print(json.dumps({'verifiedPart':name,'files':len(rows),'compressedBytes':target.stat().st_size}),flush=True)
    for row in selected:
        if chunk and size+row[2]>limit:write_part(chunk);chunk=[];size=0
        chunk.append(row);size+=row[2]
    if chunk:write_part(chunk)
    manifest={'sourceCommit':git('rev-parse','HEAD').strip(),'repository':'https://github.com/intqwq/lattice','files':records,'includedFiles':len(records),'includedBytes':sum(r['bytes'] for r in records),'excluded':dict(excluded),'gitMetadata':'Raw .git machine configuration is omitted; all refs/history are in the bundle, and unreachable objects are in the recovery ZIP.','unreachableGitObjects':[{'type':k,'id':oid} for k,oid,_ in unreachable],'archiveOutput':'This newly generated backup directory excludes itself.'}
    (output/'MANIFEST.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    (output/'RESTORE.txt').write_text('Download every Lattice-workspace-part-*.zip and extract all parts into the SAME parent directory. Each uses a Learning/ prefix and restores its recorded relative paths. Verify per-file SHA-256 hashes using MANIFEST.json.\n\nRestore Git history separately with: git clone Lattice-git-history.bundle restored-source\nThe Git recovery ZIP preserves any unreachable objects. It is optional for ordinary project restoration. Browser test profiles are disposable and intentionally excluded; the application creates a new profile when needed.\n\nThe normal learner profile is outside this project folder, under %LOCALAPPDATA%/Lattice. It is neither included nor removed by this archive procedure. No local files were deleted.\n',encoding='utf-8')
    assets=sorted(p for p in output.iterdir() if p.is_file())
    (output/'SHA256SUMS.txt').write_text(''.join(f'{digest(p)}  {p.name}\n' for p in assets),encoding='ascii')
    print(json.dumps({'complete':True,'parts':len(parts),'files':len(records),'output':str(output)}),flush=True)

if __name__=='__main__': main()
