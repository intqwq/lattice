# Lattice — Windows learning platform blueprint

**Working name:** Lattice / 知序. **Version:** original design proposal 1, 28 September 2026. **Status:** retained as the target design; construction has now begun. See [README.md](README.md) for the implemented Windows release and its limits.

Lattice is a personal learning studio for mathematics, physics, chemistry, biology, computer science, and Olympiad problem-solving. Its central object is a connected curriculum: choose a destination, see the knowledge it depends on, learn through precise explanations and examples, and demonstrate understanding through practice.

The original design package includes a [90-course catalogue](blueprint/COURSE-CATALOGUE.md), [teaching specification and sample lessons](blueprint/TEACHING-SPEC.md), [curriculum data](blueprint/curriculum.json), an interactive interface proposal, and a [structural validation report](blueprint/validation.json). These remain design artifacts. A WinUI 3 executable and a 55-lesson bilingual starter library have since been implemented; planned architecture and complete curriculum coverage below should not be read as already shipped.

## 1. Decisions established with you

| Decision | Agreed direction |
|---|---|
| Platform | A Windows desktop application, constructed on Windows |
| Languages | Switchable Chinese and English for both interface and lessons |
| Starting point | Short placement checks separately for each subject |
| Priorities | Balanced foundations, with university and Olympiad branches |
| Curriculum | Country-independent; exam alignment is an optional later overlay |
| Connectivity | Fully offline initially, with no AI tutor |
| Input | Keyboard, mathematical notation, diagrams, and C++ coding |
| Visual experience | Modern, calm, responsive, with smooth purposeful animation |
| Current scope | Review the blueprint before implementation begins |

Working assumptions: a single learner profile by default; Windows 11 x64 as the first tested target; no account; downloaded or preinstalled content packs; optional advanced courses rather than an obligation to finish the entire catalogue. These are design defaults, not assumptions about your current academic level. Weekly study time, target competitions, and optional extensions can be configured later.

## 2. Curriculum structure

The initial map proposes **90 separate courses and 540 named modules**. Every course has an ordered route, readiness references, and a concrete exit task. The course catalogue gives the complete list.

| Area | Courses | Principal routes |
|---|---:|---|
| Shared foundations | 4 | Mathematical language; proof; measurement; learning and scientific communication |
| Mathematics | 26 | Algebra; trigonometry; geometry; calculus; linear and abstract algebra; combinatorics; number theory; probability; inequalities; analysis; topology; optimization |
| Physics | 14 | Newtonian mechanics; fluids; thermal physics; electricity; magnetism; waves; analytical mechanics; quantum physics; relativity; experiments; statistical mechanics |
| Chemistry | 10 | Stoichiometry; structure and bonding; equilibrium; kinetics; inorganic; organic; analytical; physical; biochemistry; Olympiad synthesis |
| Biology | 10 | Cells; genetics; molecular biology; evolution and ecology; plants; animals; microbiology; development and neuroscience; methods; Olympiad synthesis |
| Computer science and OI | 22 | C++; algorithms; data structures; DP; graphs; strings; OI mathematics; systems; networks; databases; software engineering; computation; compilers; AI; security; graphics; HCI; distributed computing |
| Connections and projects | 4 | Scientific computing; data and causal reasoning; signals and control; interdisciplinary research |

The catalogue is a broad school-to-undergraduate core with selected advanced electives. University disciplines are open-ended; specialized electives can be added without pretending the first map contains every possible course. Olympiad depth is a separate route: a student can study hard Euclidean geometry without first completing calculus, topology, or abstract algebra.

**Examples of routes** — arrows mean learning progression; they do not require relearning skills already demonstrated:

- Calculus: algebra and functions → trigonometry → limits and derivatives → integration and series → multivariable calculus → differential equations or analysis.
- Linear algebra: systems → span and independence → bases and dimension → linear maps → determinants → eigenvalues → orthogonality, least squares, and spectral methods.
- Abstract algebra: proof and modular arithmetic → groups → homomorphisms and quotients → rings → fields → extensions and Galois theory.
- Olympiad mathematics: elementary algebra, geometry, number theory, combinatorics → inequalities and proof techniques → specialized problems → mixed unseen sets.
- Physics: vectors and measurement → Newtonian mechanics → energy and momentum → rotations, fluids, and oscillations. Electricity and circuits can begin on a parallel branch; calculus opens the deeper mechanics and field-theory branches.
- Chemistry: matter and quantities → bonding → energetics and equilibrium → kinetics, inorganic, organic, and analysis → physical chemistry, biochemistry, or Olympiad problems.
- Biology: chemical foundations → cells → genetics and molecular mechanisms → physiology, evolution, ecology, and methods → integrated evidence problems.
- OI: C++ → correctness and complexity → basic structures and search → DP, graphs, strings, and mathematics in parallel → advanced algorithms → timed sets and independent reconstruction.

### A graph underneath, readable trees on screen

Use the hierarchy **subject → course → module → lesson → concept → problem**. A lesson can teach several concepts, and a problem can test several. The same concept ID can appear in multiple courses. “Vector dot product” should be explainable once and revisited in physics or graphics with new examples.

Maintain three distinct edge types:

1. **Required knowledge:** a directed acyclic graph of specific concepts. All-of and any-of prerequisite groups are explicit. Equivalent placement evidence can satisfy a prerequisite.
2. **Recommended next:** a pedagogical ordering that the learner may change.
3. **Related/application:** cross-subject links, allowed to form cycles.

The blueprint's 199 course-readiness links describe knowledge used across an entire route; they are not whole-course entry locks. Exact concept dependencies are an authoring requirement for each published lesson. This prevents, for example, requiring all of undergraduate statistics before introducing a genetics pedigree.

The interface initially shows the current course, its six modules, immediate prerequisites, and a few useful connections. A “Why this next?” explanation names the relevant skill and evidence. A full graph is optional; zooming out clusters it by subject. An equivalent keyboard-accessible outline is always available.

### Coverage and source alignment

Content is organized around concepts rather than a national textbook sequence. International contest mappings are independent metadata with organization, document version, date checked, and coverage notes. The IOI's official syllabus page currently labels its linked document **IOI 2025**, despite the page's 2026 update; the platform must preserve the actual document label rather than invent a 2026 syllabus. [IOI syllabus](https://ioinformatics.org/page/syllabus/12)

IPhO distinguishes theoretical and experimental preparation, so the physics route includes both. IBO explicitly says it has no fixed syllabus and emphasizes analysis and practical reasoning; a topic map must not be marketed as guaranteed exhaustive IBO coverage. [IPhO syllabus](https://www.ipho-new.org/statutes-syllabus/), [IBO preparation guidance](https://www.ibo-info.org/en/contest/participation.html)

The chemistry route uses the IChO topic framework as an alignment reference, with edition-specific additions checked when a pack is authored. The CS map is cross-checked against the CS2023 knowledge-area structure, including systems and human-computer interaction as well as algorithms. These are editorial references, not endorsements. [IChO topic framework](https://www.icho.sk/files/syllabus%20for%20the%20theoretical%20part%20of%20the%20icho%20competition.pdf), [CS2023 areas](https://csed.acm.org/knowledge-areas/)

MIT OCW's independent-study introductory courses provide useful external reference points for mathematical and scientific sequencing. Lessons in Lattice will be original or appropriately licensed; linking a resource is separate from permission to bundle it. [MIT OCW Scholar](https://ocw.mit.edu/collections/ocw-scholar/)

## 3. Placement and personal routes

Onboarding asks which subjects interest you, your rough level, and an optional weekly time budget. It then offers a **10–15 minute screening check per chosen subject**, one subject at a time. The duration is a product target, not a claim that a short quiz can establish mastery of an entire discipline.

Screening samples central skills using several question types: a calculation, a concept explanation, a diagram or data interpretation, and, where relevant, a proof or code-reading task. “I haven't learned this” is a valid response. The system records correct answers, hints used, confidence, and uncertainty rather than forcing a single global grade.

Results are **provisional placement**. If evidence is thin, the platform requests a short targeted check when the skill becomes relevant. Prior self-reported study is visible but is never silently converted into demonstrated mastery. Advanced learners can challenge a module instead of repeating its lessons.

The planner chooses a small daily set from: due review; the next useful concept in an active route; a problem that diagnoses a recurring error; an optional connection. Initially limit the home screen to two active course recommendations and one optional exploration. The learner can change the balance and pause courses without losing history.

Suggested session templates are adjustable: 20 minutes for review and one concept; 45 minutes for a lesson and practice; 90 minutes for deeper problems or a project. These are session formats, not fixed completion dates for subjects.

## 4. Teaching and assessment

Every lesson follows a common teaching contract:

1. A precise learning objective and a brief prerequisite check.
2. A motivating problem or observation.
3. Definitions, notation, domain restrictions, units, and assumptions.
4. Derivation or mechanism, with the reason for each step.
5. A worked example and a useful nonexample or common error.
6. A diagram, simulation, construction, or trace when it explains the concept.
7. Guided practice with a gradual hint ladder.
8. Independent practice with authored solutions and rubrics.
9. A transfer problem that changes the setting.
10. A short retrieval summary and a later review item.

An animation illustrates a claim; it is not a proof. A numerical coincidence is not an identity. A simulated experiment does not demonstrate laboratory dexterity. Lessons make these distinctions explicit.

**Offline feedback is authored and deterministic.** Numeric answers use units and specified tolerances. Expressions use a restricted parser and domain-aware checking. Equivalent forms that cannot be established are marked “needs comparison,” never incorrectly rejected based on a few random samples. Diagram problems use explicit geometric constraints. Coding tasks use verified test sets and validators.

Free-form proofs and scientific explanations receive a checklist, a worked solution, common-error branches, and self-assessment. Without an AI tutor or human reviewer, arbitrary proof correctness cannot be certified. Such evidence is labeled self-assessed; supported structured proof exercises can be checked automatically.

Readiness is recorded per skill, not as “83% good at physics.” States are **unknown → learning → practiced → demonstrated → review due**. A proposed objective-skill rule requires independent success on distinct problem forms, then delayed success; the actual item counts and intervals are configurable design heuristics to calibrate during use. Hinted or revealed solutions count as assisted practice. Proof self-assessment remains visibly distinct.

The mistake notebook records the original attempt, error category, explanation, repair exercise, and later reattempt. Categories include a missing prerequisite, concept confusion, algebra, units, boundary cases, a proof gap, and implementation errors. A failed review increases review priority without erasing earlier work.

See [TEACHING-SPEC.md](blueprint/TEACHING-SPEC.md) for a full linear-independence lesson, cross-subject examples, grading policies, and content release requirements.

## 5. Main screens and interactions

| Screen | Main job | Important behavior |
|---|---|---|
| Today | Resume meaningful work | One primary “Continue” action; due review; transparent recommendation |
| Courses | Choose a direction | Subject, level, and language filters; prerequisites; content availability |
| Learning map | Understand the route | Selected module, prerequisite explanations, related courses, outline alternative |
| Lesson studio | Learn and practice | Route rail; readable lesson; optional diagram, scratchpad, or code pane |
| Practice | Build independent skill | Untimed by default; hint ladder; answer review; mixed and timed modes |
| Notebook | Retain useful reasoning | Personal notes, saved derivations, mistakes, bookmarks, export |
| Progress | Inspect evidence | Skill history, assisted versus independent work, review needs |
| Library and settings | Manage the offline app | Installed packs, languages, display, storage, backup, local toolchain |

**Typical flow:** placement → proposed course entry → inspect prerequisites → learn → attempt → inspect feedback → repair or progress → delayed review. At any step, switch languages without changing the lesson, answer, diagram state, or progress.

**Lesson studio layout:** a compact route rail, a central reading column, and a contextual right pane. The pane contains a diagram, scratch work, or code according to the task. Reading mode hides both side panes. Coding mode gives the editor most of the width while keeping the statement and tests accessible. Detachable scratch work can be considered after the first release.

The offline tutor role is fulfilled by authored actions such as “Explain this step,” “Show a simpler example,” “Review the prerequisite,” and “Give me a hint.” There is no chat box that implies open-ended AI capability.

## 6. Visual and motion direction

Use Fluent-inspired Windows chrome, a compact navigation rail, generous reading space, restrained color, and clear type. The product should feel like a serious study environment with the responsiveness of a modern creative tool.

| Element | Proposed specification |
|---|---|
| Appearance | System-following light/dark, plus explicit override and high-contrast support |
| Typography | Segoe UI Variable / Segoe UI; Microsoft YaHei UI for Chinese; locally bundled mathematical fonts; Cascadia Mono or a local fallback for code |
| Reading | 16–18 px default body equivalent; configurable size; roughly 60–80 Latin characters per line; comfortable Chinese line spacing |
| Geometry | 8 px spacing rhythm; 12–16 px surface radii; quiet separators; minimum clutter |
| Accent | Iris/violet for current actions; subject identity through labels and small markers; mastery never communicated by color alone |
| Click/hover feedback | Approximately 100–140 ms opacity or surface transition |
| Pane/navigation transitions | Approximately 180–240 ms, easing out; keep the reading position stable |
| Route expansion | Approximately 240–320 ms; animate only the affected nodes and edges |
| Mathematical motion | User-controlled steps and pause; labels remain stable; no autoplay background motion |
| Reduced motion | Remove spatial travel and spring effects; preserve immediate state changes |

These timings and performance figures are design targets, not measured app results. Native title-bar behavior, resizing, snapping, DPI transitions, text selection, and keyboard focus should work normally. Avoid decorative animations during problem-solving and avoid movement that shifts a formula being read.

Target comfortable layouts at 1440×900 and 1280×800, with compact reflow around 960 px width and support for 200% scaling. The design preview also reflows to narrow conversation widths. Use keyboard navigation, clear focus rings, accessible mathematical alternatives, and a non-canvas outline for graph navigation. `Ctrl+K` opens course/concept search; `Ctrl+Enter` checks the active answer; shortcuts are suppressed where they conflict with the code editor or input method.

## 7. Recommended Windows architecture

**Recommendation: WinUI 3 + C# for the native application, with a locally bundled WebView2 surface for rich lessons, mathematical rendering, interactive diagrams, and the code editor.** Microsoft recommends WinUI 3 for new native Windows desktop UI, and documents local/web content hosting through WebView2. This is a Windows application with embedded content surfaces. [WinUI 3](https://learn.microsoft.com/windows/apps/winui), [WebView2 in WinUI 3](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/webview2)

The trade-off is a boundary between native and embedded UI. A short technical prototype must validate focus, input methods, accessibility, resizing, and mathematical rendering before committing to the full interface. Keep complex connected animations inside one surface; do not depend on an animation spanning XAML and WebView2.

| Layer | Responsibility |
|---|---|
| Native shell | Windows integration, navigation, file pickers, settings, window state, accessibility shell |
| Lesson surface | Structured lesson blocks, local math renderer, diagrams, editable answers, C++ editor |
| Learning core | Graph traversal, placement evidence, scheduling, grading orchestration, language mapping |
| SQLite store | Attempts, skill evidence, reviews, notes, bookmarks, and content indexes |
| Content packs | Versioned text, diagrams, exercise data, hints, answers, citations, local fonts and assets |
| Isolated workers | Numeric/symbolic checks, simulations, C++ compilation and execution with resource limits |

Pin supported dependency versions when implementation begins. A local MathJax or KaTeX distribution should be selected after a bilingual accessibility comparison; the preview's simple notation does not settle this choice. Monaco is a candidate for the code editor, also bundled locally. No runtime CDN calls.

Tauri 2 is a reasonable alternative if the technical prototype shows substantially better interaction consistency for an almost entirely web-rendered studio. It supports Windows MSI/setup distribution. The baseline here favors a native Windows shell because the requested platform is Windows. [Tauri Windows distribution](https://v2.tauri.app/distribute/windows-installer/)

### Offline means offline

- The core app starts and teaches with networking disabled. No account, server, AI endpoint, telemetry, remote font, or login is required.
- A full offline installation bundle includes the required runtime dependencies and starter content. Detect WebView2 availability and provide a compatible offline runtime installation path; do not equate an embedded web surface with internet dependence. Microsoft's guidance distinguishes Evergreen and fixed runtime deployment. [WebView2 deployment context](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/webview2)
- Additional packs and updates can be imported from local files. A pack manifest records version, compatible app versions, hashes, language coverage, sources, licenses, and editorial status.
- An incomplete or corrupted pack never replaces the working copy. Verify, stage, migrate, and commit atomically; preserve a rollback path.
- Store study data in the Windows user-local application data location. Support an explicit backup/export and restore flow; do not assume SQLite itself encrypts notes.
- Network infrastructure, including a Raspberry Pi, is not needed for this release.

### C++ workspace

Provide a statement, constraints, examples, editor, compile diagnostics, custom input, run result, and authored tests. Record compiler version, language mode, time/memory limits, input, result, and source revision with each attempt. Samples passing is visibly different from all tests passing; local completion is different from acceptance on an external judge.

Choose and bundle a redistributable Windows toolchain after a compatibility spike. The candidate is a MinGW-w64 GCC toolchain supporting C++17/20. Validate standard-library behavior, Unicode paths, large integers and intended GNU extensions against the chosen version; do not assume compatibility from the compiler name.

Compile and execute in disposable work directories, with a constrained security boundary, bounded output, process-tree termination, time/memory limits, and no network access. Windows Job Objects alone do not provide a complete security boundary. Prototype AppContainer/restricted-token containment for both compilation and execution, including child processes and filesystem access. If containment cannot be demonstrated, the Run feature remains unavailable until the execution design is fixed. This is a release gate, not a feature already implemented.

## 8. Data and content contracts

Stable IDs survive display-name and language changes. Keep content revisions separate from learner evidence; an edited exercise does not rewrite what a learner previously attempted.

| Record | Essential fields |
|---|---|
| Course/module | Stable ID; bilingual title; levels; route; readiness links; publication state |
| Concept | Definition; scope; prerequisites; examples; equivalent terms; related concepts |
| Lesson | Version; objectives; exact concept prerequisites; ordered blocks; source records; language variants |
| Exercise | Version; prompt; skill tags; difficulty rationale; assumptions; response type; answer specification; rubric; hints; solution |
| Attempt | Exercise version; answer; timestamps; hint/reveal events; result; checker version; assessment provenance |
| Skill evidence | Concept; supporting attempts; assisted/independent/self-assessed status; uncertainty; due date |
| Notebook entry | Local ID; linked concept or attempt; text/diagram data; revision; export metadata |
| Content pack | Manifest; compatibility; checksums; license and provenance; review state; migrations |

Translations share a stable content ID but have explicit revision alignment. Switching from English to Chinese must never silently substitute a different exercise. If a translation is unavailable, label the fallback and keep progress; only fully translated packs can claim complete bilingual coverage. Publish bilingual glossaries with mathematical terminology, standard symbols, and context-dependent meanings.

Course availability is distinct from skill state: **planned / draft / reviewed / installed / update available** describes content; **unknown / practiced / demonstrated / review due** describes the learner. A beautiful map must not imply that all mapped lessons already exist.

## 9. Construction sequence after blueprint review

Each milestone produces a usable result and has a concrete gate. Avoid calendar estimates until a technical prototype and the first authored lessons reveal actual work rates.

| Milestone | Deliverable | Acceptance gate |
|---|---|---|
| 0 · Blueprint | This design, catalogue, teaching examples, interactive proposal | Resolve direction and retain the stated offline and bilingual requirements |
| 1 · Technical prototype | Native window; one local bilingual lesson; math input; diagram; SQLite save; candidate C++ worker | Offline startup; language/state preservation; accessible focus; DPI reflow; execution containment evidence |
| 2 · Vertical learning slice | Placement → route → lesson → practice → mistake repair → delayed review | End-to-end persistence and restore; exact grading examples; assisted work never promoted as independent evidence |
| 3 · Balanced starter library | Five subject modules plus targeted shared prerequisites | All lesson, solution, translation, provenance, and accessibility checks complete |
| 4 · Course expansion | Complete priority courses and their university/Olympiad branches | Every promised course has actual content and calibrated assessments before being marked available |
| 5 · Personal release | Offline installer, content management, export/restore, help | Clean Windows installation, network-disabled use, update/rollback and recovery checks |

The **starter-library proposal** is 30 short lessons: six each for linear systems/vectors, Newton's laws, stoichiometry, cells/genetics, and algorithmic reasoning. Add concise prerequisite bridges based on placement. Each lesson should include a conceptual check, two worked examples, four or more authored exercises, and a transfer/review item where appropriate. That implies at least 120 authored exercises plus examples; it is an editorial workload target, not delivered content. No starter module should claim to complete its parent course.

Content production is a separate workstream from app development. Author → verify mathematics/science → validate answers and examples → translate → compare language versions → check accessibility → release. Source-verified or mechanically checked work must not be described as independently expert-reviewed unless that review actually occurred.

## 10. Validation and delivery requirements

**Educational correctness:** every theorem includes assumptions; units and limiting cases are checked; answer alternatives and rubrics are reviewed; sample code and validators are tested; translation discrepancies block bilingual publication.

**App behavior:** attempts survive a crash; migration preserves history; reinstall/import can restore a backup; language switching preserves state; missing packs and unavailable translations have clear handling; reduced motion and keyboard-only flows work.

**Performance targets to measure:** a warm lesson open under 300 ms; a typical installed-library launch under 2 seconds on a declared reference PC; responsive input during checking; 60 fps for ordinary transitions at 60 Hz; graph clustering for large catalogues. Do not advertise these numbers until measured with hardware, pack size, and conditions recorded.

**Offline acceptance:** install from the full bundle and complete a lesson, diagram exercise, review, C++ task, backup, and restore with networking disabled. Scan runtime assets for remote dependencies and inspect attempted network access.

**Current blueprint checks:** the generated catalogue has 90 unique course IDs, 540 unique module IDs, 199 resolving course-readiness references with no cycles, 20 resolving cross-subject links, and an exit task for every course. Those structural checks do not establish content completeness or pedagogical validity. See [validation.json](blueprint/validation.json).

The interactive proposal is for reviewing layout, navigation, bilingual switching, and one lesson interaction. Its sample states are not your progress. Native performance, Windows installation, the C++ execution boundary, and the complete lesson library remain construction work.
