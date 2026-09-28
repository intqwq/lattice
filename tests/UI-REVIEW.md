# Interface and integration review — 28 September 2026

## Current redesign

The full-catalogue node cloud has been replaced by subject destinations, course-level pathways and a focused prerequisite/current-topic/next-step view. Only three immediate neighbors per side appear initially; additional connections expand on demand. A complete ordered prerequisite route remains available separately. Text is no longer scaled down to squeeze the graph into the window.

The application now has a consistent forest-and-mint palette, aligned cards, responsive reading columns, a compact navigation rail, light/dark themes, hover transitions and reduced-motion rules. Sidebar and reading-surface colors are separate, including lesson prerequisite links, badges and diagrams.

## Automated checks

The current suite contains 35 tests. It covers content mappings and both languages, unique assessments, resolving acyclic dependencies, mathematics-to-physics/genetics routes, offline KaTeX rendering, numerical parsing and grading, assisted practice, versioned questions, backup validation, retained evidence and review dates. Atlas tests verify subject-level entry, filter membership, preserved direct connections, bounded initial neighbor counts and title escaping. Search tests exercise concepts inside both languages, full-width course IDs and literal punctuation.

The content builder generates [current counts](../content/coverage.json), [course coverage](../content/COVERAGE.md) and the [editorial audit](../content/editorial-audit.json). Mechanical checks are not an independent subject review.

## Browser review

The same local `web/` interface was tested on localhost in a development profile separate from the native app's learner profile.

- Subject overview, mathematics pathways, university filtering, linear-algebra course focus and the calculus-to-motion lesson focus rendered.
- The motion focus explicitly showed its mathematics dependency. Its complete route listed 20 distinct lessons from counting through derivatives and motion.
- Chinese switching retained the selected topic. The focused map had no horizontal overflow at 960×640 and 390×844 viewport settings; narrow layouts stacked the dependency columns in reading order.
- The navigation rail can scroll at Windows display scaling while keeping Settings reachable. The mobile layout exposes Settings alongside the header.
- English and Chinese lesson layouts were inspected in light and dark themes. A low-contrast prerequisite-link background inherited from the sidebar was found and fixed.
- Full-width search `Ｍ０９` found the course and its lessons. Search also covers concepts in explanation bodies and outline targets.
- A new matrix question accepted `17/1`; the new linearity check accepted the correct map. Both first-attempt records survived a language switch and reload.
- A note containing `$Ax=x_1a_1+x_2a_2$` survived reload and rendered with the bundled math renderer.
- The captured browser warning/error list was empty during these revised flows.

Earlier integration checks also exercised placement, hint-assisted evidence, backup validation, C++ draft persistence and interactive diagrams. Those mechanisms remain covered by their existing model tests; they were not all re-run manually for each content-writing batch.

## Native Windows check

Version 0.2 is built into `native/bin/publish-v0.2/`, allowing an older open build to remain undisturbed. The isolated WinUI smoke test verifies a loaded local WebView2 teaching surface, positive curriculum counts, local storage, the narrow host-info bridge, no captured startup errors, and a blocked external fetch. Its actual screenshot and report are written to `native/smoke/`; those machine-local outputs are excluded from source control.

A clean-machine install, full screen-reader/high-contrast audit, sustained animation benchmark, complete subject-expert review and real learner progression study remain unverified. The application is an unpackaged Windows x64 build and requires WebView2. It edits and exports C++ but does not compile or judge submissions.
