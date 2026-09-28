# Lattice / 知序

An offline, bilingual Windows learning studio connecting mathematics, physics, chemistry, biology, computer science and Olympiad study.

Built with WinUI 3 and a bundled local WebView2 interface. No account, server, AI service or internet connection is required for study. English and Chinese switch together across lessons, examples, hints and practice.

## Explore

- **Learning atlas:** choose a subject, follow a school/university/Olympiad branch, then focus on one topic. Prerequisites and next steps appear on either side, with cross-subject bridges and a complete ordered route when needed.
- **Course library:** 90 course pathways and 540 modules, with bilingual concept checklists and introductory teaching chapters being expanded across the catalogue. [Generated coverage counts](content/coverage.json) describe the current checked-in pack.
- **Teaching:** original explanations, worked examples, misconceptions, practice, hints and explained answers. Focused foundation lessons complement the module chapters.
- **Study tools:** local mathematics rendering, interactive diagrams, short starting-point checks, notes, practice history, review reminders and JSON backup/restore.
- **C++ notebook:** edit, retain and export `.cpp` files. Compile and judge with your own toolchain; this app does not execute submissions.

This is an actively developed learning application. Introductory chapter coverage is not a complete textbook, diploma-equivalent curriculum or mastery certificate. Subject-expert review, deeper problem sets, laboratory work and learner testing remain necessary. See the [coverage and editorial policy](content/coverage-map.md).

## Run on Windows

Build the application below, then open `native/bin/publish/Lattice.exe`. Keep the entire publish folder together. The current distribution is an unpackaged **Windows x64 folder**, not an installer.

The .NET and Windows App SDK runtimes are bundled. The Microsoft Edge WebView2 Runtime must be installed. Initial dependency restore requires internet access; study after building is offline. Clean-machine installation has not yet been validated.

```powershell
# Requires Node.js, PowerShell 7 and the .NET 10 SDK on Windows.
node scripts/build-content.mjs
node --test tests/*.test.mjs
pwsh -File scripts/build-windows.ps1 -SmokeTest
```

The smoke test launches an isolated desktop profile, checks the local teaching surface and saves a native screenshot/report under `native/smoke/`. A non-interactive build can omit `-SmokeTest`.

For interface development only:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory web
```

Open `http://127.0.0.1:4173`. Browser and desktop profiles are separate. The desktop app does not need this server.

## Data

Progress, notes and code stay in the desktop WebView2 profile under `%LOCALAPPDATA%/Lattice/WebView2`. Export a backup from Settings before replacing that profile. Restore validates the file and asks before replacing current data.

Embedded resources are local. Clicking an optional source link opens the system browser. The native bridge only exposes backup, restore and C++ file export; it does not accept arbitrary shell commands or paths. Proofs and open-ended scientific reasoning are self-assessed. Starting-point checks are provisional suggestions.

## Source guide

| Directory | Purpose |
|---|---|
| `web/` | Local interface, learning routes, practice model and diagrams |
| `content/` | Original bilingual lessons, outlines, references and coverage audit |
| `native/` | WinUI window, WebView2 origin and narrow file bridges |
| `scripts/` | Validated content assembly, pinned asset download and Windows build |
| `tests/` | Content, prerequisite, grading, backup and navigation regressions |
| `blueprint/` | Original curriculum and teaching design |

The build rejects missing prerequisites, dependency cycles, duplicate questions, invalid answers and incomplete bilingual structures. These checks cannot establish that every explanation or exercise is pedagogically sufficient.

KaTeX and its fonts are bundled for offline use. [Third-party notices](THIRD-PARTY-NOTICES.md) identify dependencies. The [original blueprint](BLUEPRINT.md) describes longer-term ambitions, including features not implemented yet. [Integrated review](tests/UI-REVIEW.md) records validation and limitations.
