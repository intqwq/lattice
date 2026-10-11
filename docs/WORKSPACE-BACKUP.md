# Workspace preservation — 12 October 2026

The project source and history are in [intqwq/lattice](https://github.com/intqwq/lattice). The [workspace backup release](https://github.com/intqwq/lattice/releases/tag/workspace-backup-2026-10-12) preserves local project files before removal of the working folder.

The snapshot includes the source tree, original interactive blueprint, earlier validation snapshot, local build utilities and reports, all Windows build outputs, NuGet dependency packages, and the existing distribution ZIP. `MANIFEST.json` records each archived file, its size, SHA-256 hash and containing asset. `SHA256SUMS.txt` checks the downloadable assets. Archives preserve third-party packages with their existing licenses and notices.

## Restore

1. Download every `Lattice-workspace-part-*.zip` asset, `MANIFEST.json`, and `SHA256SUMS.txt` from the backup release.
2. Check each asset's SHA-256 against `SHA256SUMS.txt`.
3. Extract **all ZIP parts into the same parent directory**. They restore a `Learning/` folder with the original relative paths. Each part is an independent ZIP.
4. Clone the repository for a normal source checkout. For an offline copy of every local Git ref and its history, use `git clone Lattice-git-history.bundle restored-source`.
5. The optional Git recovery ZIP contains otherwise unreachable object payloads and restoration instructions.

The backup omits disposable WebView2 smoke-test profiles and raw local Git configuration. Git history is preserved separately. No credentials or private machine configuration should be published. The app's real learner profile is outside the project, at `%LOCALAPPDATA%/Lattice`, and is unaffected by removal of this working folder.

`blueprint/original-interactive-design.html` preserves the original standalone design artifact, which previously lived outside the repository. `blueprint/preview.html` remains the later curriculum preview. The runnable Windows release is [v0.2.0](https://github.com/intqwq/lattice/releases/tag/v0.2.0); this backup does not change its features or curriculum-review status.

To produce a future snapshot after committing changes, run `python scripts/archive-workspace.py --output dist/NEW-BACKUP-NAME`. The script checks file stability and verifies archived bytes against their hashes. It does not delete or overwrite an existing backup.
