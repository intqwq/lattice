# Blueprint review and verification

28 September 2026. This record concerns the design package and its browser-rendered interface proposal.

## Delivered design artifacts

- `../BLUEPRINT.md`: product direction, agreed requirements, curriculum architecture, learning behavior, Windows architecture, delivery milestones, and acceptance gates.
- `COURSE-CATALOGUE.md`: 90 planned courses, with six modules and an exit task each.
- `TEACHING-SPEC.md`: the lesson contract, a bilingual linear-independence specimen, and physics, chemistry, biology, and OI specimens.
- `curriculum.json`: stable course and module IDs, course-readiness references, and cross-subject links.
- `preview.html`: a browser fixture used to inspect the visual proposal. It is not the Windows app or an installer. The preview wrapper may load its icon/tooltip helpers from a CDN; the proposed production app instead bundles all required assets locally.
- `validation.json`: the generated curriculum-structure report.

The original inline design was exported to `preview.html` for this repository. The current application lives under `web/`.

## Completed checks

1. Generated and validated 90 unique courses, 540 unique modules, 199 resolving readiness references, and 20 resolving related-course connections. The course-readiness graph is acyclic. Every course has six modules, a bilingual course title, and an exit task.
2. Parsed the preview's JavaScript successfully. Embedded catalogue data is local to the fragment; there are no application fetch calls.
3. Exercised subject navigation for all seven groups. The course selectors showed 4 / 26 / 14 / 10 / 10 / 22 / 4 courses respectively, and each selected route rendered six modules.
4. Opened the lesson specimen; changed the vector parameter from 1 to 0 by keyboard; verified the displayed span changed from plane to line.
5. Submitted an incorrect and a correct practice answer. The displayed feedback explained different reasoning for the two cases.
6. Switched the specimen to Chinese and verified that the selected answer, feedback, and zero parameter were retained. Reloading the standalone fixture also retained its local presentation state.
7. Inspected route and lesson layouts at browser viewport widths 1024, 736, and 320 pixels. Measured root scroll width equal to client width and no right-overflowing descendants in the inspected narrow route and lesson states. Reviewed screenshots of the desktop route, desktop lesson, narrow route, and Chinese lesson.
8. The browser's captured warning/error list was empty after the final script changes.
9. Independently recalculated the friction examples, weak-acid concentration/pH, carrier proportion, and CRT remainders in the teaching specimens. Their stated rounded values agree.
10. Followed the linear-algebra connection to Quantum physics, then selected Inequalities and its sixth module. Course and module detail headings updated correctly.

These are focused design checks, not a complete accessibility audit, all-course pedagogical review, or Windows app test. The bilingual prototype translates the specimen and selected example routes; other module names explicitly fall back to English while translations are planned.

## Still to establish during construction

Native WinUI/WebView focus and input-method behavior; actual offline installation and startup; supported Windows builds and toolchain versions; isolated C++ compilation/execution; crash recovery and backup/restore; production grading coverage; screen-reader and high-contrast behavior; measured motion performance; dark-theme visual review; content licensing review; lesson-level prerequisites; complete bilingual lesson authoring.

The design has no real learner profile. Preview clicks and answers are presentation state only.

## Reproducibility

From the repository root, run:

```powershell
node blueprint/build-blueprint.mjs
```

This regenerates the catalogue, JSON, and structural report. `prepare-preview.mjs` is an optional authoring utility for an original inline design fragment supplied as its path argument. The visualization renderer generated `preview.html` for inspection; it is not part of the production stack.
