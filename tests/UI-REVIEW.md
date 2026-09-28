# Integrated review — 2026-09-28

## Automated model and content checks

`node scripts/build-content.mjs` succeeds. `node --test tests/*.test.mjs` passes 27 tests covering numerical parsing, tolerances, invalid inputs, unique assessments, bilingual lessons, actual course/lesson dependency graphs, route closure, assisted practice, preserved independent evidence, backup validation and review timestamps. All 32 authored LaTeX formula occurrences render using the locally bundled KaTeX with errors enabled.

Current content: 90 course routes, 540 named modules, 174 detailed bilingual module outlines, 55 written lessons, 119 exercises, 98 lesson prerequisite links. Forty links cross curriculum groups (the shared Foundations group is counted separately from Mathematics and Physics).

## Browser integration checks

The same `web/` app was served only on localhost for testing through the browser UI. These checks used a disposable development profile, separate from the native app profile.

- Home, course/module detail, search, atlas, lesson, settings and placement navigation rendered.
- The focused calculus-to-motion atlas showed nine nearby nodes. Its generated from-zero route contained 20 lessons, with shared prerequisites listed once. Graph zoom-to-fit and the accessible ordered route were exercised.
- Chinese module detail displayed translated core module titles, concept checklists, understanding targets and available lesson counts; planned teaching was clearly labelled.
- A physics answer of `12/1` was accepted as independently correct. A second answer after a hint was labelled supported practice and did not increase independent evidence.
- Switching Chinese/English preserved entered answers, the note and practice evidence. Reloading preserved the same values.
- Notes rendered `$v=2ct$` locally. The physics lesson displayed its newly authored KaTeX formulas.
- A motion control changed time to 2.1 s and calculated x = 8.82 m and v = 8.4 m/s. Switching language preserved the selected values and result.
- All three “not learned yet” responses in the mathematics placement screen yielded a provisional starting lesson and explicitly gave no practice credit.
- Searching for “What is a program” found the written lesson. A modified C++ draft, including Tab indentation, survived reload.
- Light and dark themes were visually inspected. At 736 px and 320 px viewport widths, the home document had no horizontal overflow; settings remained reachable at the narrow width.
- At 960 × 600 CSS pixels, the navigation rail scrolls independently (600 px viewport, 805 px contents), keeping the settings controls reachable at Windows display scaling.
- Browser error/warning logs were empty during these flows.

The browser export action displayed its completion status, but the in-app browser automation did not return a download file event. A resulting backup file and a complete browser file-picker restore were therefore **not independently verified**. Backup validation and serialization boundaries have automated tests; the native bridges are implemented, but their interactive Windows save/open picker flows still need a manual acceptance check.

## Native Windows validation

`pwsh -File scripts/build-windows.ps1 -SmokeTest` publishes the actual WinUI 3 executable and tests a separate smoke profile. See `native/smoke/native-app-smoke.json` and `native/smoke/lattice-native.png` for the latest result and actual WebView capture. The smoke checks the local origin, app readiness, loaded curriculum counts, localStorage, host-info bridge and JavaScript errors. It exits without modifying the normal learner profile.

The actual app's remote-request probe is stopped by its Content Security Policy before reaching the native resource filter. An earlier explicitly synthetic fixture separately exercised the native remote-resource block. These are separate validation layers.

## Remaining validation and product work

- Independent subject-expert review, novice learner testing, broader exercise banks and comprehensive curriculum authoring.
- Keyboard-only and screen-reader acceptance, Chinese IME testing in the native window, high-DPI multi-monitor checks, clean Windows installation and offline WebView2 distribution.
- Interactive native backup/code-export picker acceptance and crash-recovery/storage-limit testing.
- C++ execution, sandboxing, contest judging, formal proof feedback, practical laboratory assessment and the proposed SQLite store are not implemented.

The visual model DOM-shim report is in `visuals-validation.json`. It covers calculated model behavior, not browser layout or physical experiments; its original stdin harness was not retained.
