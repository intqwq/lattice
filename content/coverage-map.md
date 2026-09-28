# Content coverage and editorial status

The library has 90 course pathways and 540 curriculum modules. Current counts come from [coverage.json](coverage.json); [the course-by-course report](COVERAGE.md) and [module audit](editorial-audit.json) distinguish written chapters from remaining work. Run `node scripts/build-content.mjs` to regenerate the teaching pack and its reports.

## What a chapter provides

Each authored module has English and Chinese explanations, stated concepts, a worked example, conditions or misconceptions, practice, hints, explained answers, source links and prerequisite routes. Focused foundation lessons provide additional steps for beginning learners. Module introductions establish the main ideas; they do not replace a complete sequence of carefully scaffolded lessons for every concept in a broad module.

A new chapter is labelled **introductory-module-chapter** and **review-pending** in its data. A detailed focused lesson is labelled separately. A written chapter, a concept checklist and an independently reviewed teaching unit are different states. The application does not label the whole school, university or Olympiad curriculum complete merely because each module has a chapter.

## Quality checks

The build validates both languages, unique lesson and exercise IDs, answer formats, resolving prerequisites, acyclic course and lesson graphs, and bilingual outline targets. Tests check numerical grading, backup handling, versioned assessment evidence, offline math rendering, search and the focused atlas.

The editorial audit measures each chapter's English teaching text and excludes whole section bodies repeated across chapters from its unique-word count. This catches short placeholders and reused framing. It cannot establish correctness, translation quality, all-concept coverage or effective teaching. Word count is an authoring floor, never an educational outcome.

Changed questions receive new IDs. Old answers remain historical records and do not satisfy a revised assessment. Help and repeated attempts are distinguished from first-attempt correct answers. None of these signals certifies mastery; a solved example recalled immediately is weaker evidence than successful transfer to a new situation.

## Review still required

- Check every declared concept against an actual explanation, example and suitable practice task; split broad modules into additional focused lessons when needed.
- Independently review subject accuracy, proofs, numerical answers, model assumptions and English–Chinese alignment.
- Add mixed problems, multi-step applications, counterexamples, proof tasks, delayed retrieval and progressively harder Olympiad sets.
- Test the zero-start sequence with learners, adding definitions and repair routes wherever an unstated prerequisite appears.
- Provide supervised experimental work for science and actual resource-bounded compilation/judging for programming. Simulations and code editing cannot demonstrate those practical skills.
- Evaluate keyboard, screen-reader, high-contrast and language-input accessibility with real users.

The intended destination is systematic study from school foundations into university and competition branches. No diploma equivalence, accreditation, examination readiness or complete practical competence is claimed by the current chapter pack. “Zero start” assumes the learner can read the selected language and use basic computer controls.

## Scope and references

Mathematics covers shared numeracy and reasoning, algebra and functions, geometry, trigonometry, calculus, linear and abstract algebra, discrete mathematics, probability, statistics and Olympiad methods. Sciences cover mechanics, fields, waves, thermodynamics, modern physics, chemical quantities and structure, reactions, organic and analytical chemistry, cells, genetics, evolution, physiology, ecology and experimental reasoning. Computing connects C++ and algorithmic problem solving to systems, theory, databases, networks, security, graphics, machine learning and interdisciplinary methods.

Explanations and exercises are original. Per-lesson primary references and the mathematics/science reference manifests document scope checks; external textbooks are not copied or bundled. All teaching and interaction assets needed to study remain local. Optional reference links open externally.
