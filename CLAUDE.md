# SnowKeer — project guide (read this first)

Interactive ServiceNow practice site, built by the user for a friend learning ServiceNow (Admin + Developer) from the Udemy
course **"Total ServiceNow Developer and Admin course with JavaScript"** (9 sections, 119 lectures).
The friend is Telugu-speaking and uses a laptop.

## FIRST: get the lecture titles before building anything
**Before developing any new stage or lesson, ask the user to paste the Udemy lecture titles (and durations) for that section, and wait for them.**
Do not invent a lesson list, start planning lessons, or write code/content for a stage until the titles are provided. Map one lesson to each
title, in the course's order. Stage 1–3 titles are already in the code (Stage 3's list is at the bottom of this file); stages 4–6 are not known yet.

## Rules for new content
- **Language: Tenglish** — Telugu written in English letters, technical terms stay English. Casual, friendly tone
  (e.g. "Ippudu 'Submit' click cheyyi"). A Telugu-script toggle was deferred.
- **ServiceNow-only.** Never teach generic JavaScript/web concepts; every example must be a ServiceNow scenario
  (incident, `GlideRecord`, `gs`, `current`, `g_form`, ...).
- Release: **Brazil** (Next Experience UI). The Stage 1 mock was modelled on the user's own PDI.
- Follow the course's lecture order. The user pastes the Udemy lecture titles for each section; one lesson per lecture/topic.
- **Never create or modify things in the user's real PDI** without reversing them; never enter credentials on the developer site.
- ServiceNow behaviour must match her **Brazil PDI**. Check `docs/pdi-facts-brazil.md` first (verified in her PDI with read-only
  Background Scripts, 2026-11-14 — several memory-based claims turned out wrong, e.g. priority 3/3 is 4 there, `let` fails but
  arrow functions work). Anything not verified gets "⚠️ PDI lo confirm chesuko" in the text so the friend can confirm it.

## Stage plan and status
| Stage | Topic | Status |
|---|---|---|
| 1 | Introduction (18 lessons: account, users, UI tour, tables, forms, views, dictionary, update sets, UI/data policies...) | DONE — 471 guided mock steps (all 18 auto-play to the quiz with `dev-tools/test-driver.js`), 9–10 quiz questions per lesson (extra ones in `quiz-extra-s1.js`), 54 real-PDI exercises in doing order (shared practice items are deleted only by the Final cleanup card, `table-creation-4`, filed under Data Policies) |
| 2 | JavaScript, ServiceNow style (8 lessons) | DONE — 46 learn cards, 20 quiz questions per lesson, 56 coding exercises (ladder with Medium+ and 3-tier hints; 37 with variants); facts aligned to her Brazil PDI on 2026-11-14; awaiting friend feedback on step size |
| 3 | Client scripting & UI (26 lectures, titles below) | DONE — all 26 lectures in `src/data/lessons-cs*.js`: 95 learn cards (≥ 3 per lesson), 15 quiz questions per lesson, 173 exercises (146 coded on the client / server runner, 115 with variants; 27 real-PDI cards in the 6 `mode: 'pdi'` lessons) |
| 4 | Server scripting (Business Rules, Script Includes, GlideRecord deeper, GlideAggregate, scheduled jobs) | planned |
| 5 | Service Catalog and Flow Designer | planned |
| 6 | ITSM and Now Assist | planned |

For stages 4–6 the exact lecture titles are unknown: **ask the user to paste the Udemy section's lecture list and wait** before planning or writing anything (see the first section above).

## Tech and architecture
React 19 + Vite 5, plain JS/JSX, no router, no backend. Stage pages use the Astryx design-system theme
(`@astryxdesign/core` + `theme-neutral`; `@stylexjs/stylex` is its required peer) — the ServiceNow mock is never themed.
Progress lives in `localStorage` (`snowkeer-progress-v1`, see `src/progress.js`; her code per exercise under `snowkeer-code-v1:<id>`;
Hub has progress save/load to a JSON file). Run with `npm run dev`; build with `npm run build`; checks with `npm run check`.

- `src/App.jsx` — all state; `view` = `hub | sim | quiz | exercises | js`. No router library.
- `src/data/stages.js` — STAGES list (num, title, kind `guided` | `code`, lessons). Hub, Hands-on Practice and App all read it,
  so a new stage = one entry + its lessons.
- `src/data/lessons-{a,b,c}.js` + `lessons.js` — **Stage 1** lessons (guided steps, built with helpers in `lessonKit.js`: `info/click/type/goTo/q`).
- `src/engine/` — mini ServiceNow (tables, dictionary, layouts, views, policies, update sets) used by the Stage 1 simulator. It follows her
  Brazil PDI: filters use encoded-query rules (`^OR` joins the condition before it, "New Criteria" = `^NQ`, choice fields store values like
  state=2); Insert / Insert and Stay copy an existing record and are hidden on task tables (incident); the Process Flow bar is display-only,
  driven by Process Flow records; update sets are completed with State = Complete; priority 3/3 → 4 (her PDI's lookup);
  UI pieces in `src/components/` (`Tour.jsx` guided steps, `Quiz.jsx`, `Hub.jsx`).
- `src/data/exercises.js` — Stage 1 hands-on exercises done in the **real PDI** (scenario / hint / steps / answer / cleanup revealed on click; `Exercises.jsx`).
  IDs are `lessonId-n` and are stored in progress — **never renumber existing exercises**.
- **Stage 2 code runner:** `src/js/` — `snowMock.js` (mock `gs`, `GlideRecord`, GlideElement, `GlideAggregate`), `clientMock.js` (g_form,
  g_user, g_list, GlideAjax, mock incident form), `snowData.js` (fixed practice data: 8 incidents, users, groups), `runScript.js` (runs code +
  tests, also provides `Class.create` and an AbstractAjaxProcessor that dispatches like the real `process()`), `esCheck.js` (syntax her PDI
  rejects in global scope — the runner warns, check-js/check-cs fail on it), `runner.worker.js` (Web Worker, 3 s timeout in `ScriptRunner.jsx`;
  imported with `?worker&inline` = classic Blob worker so old browsers work, and `ScriptRunner` falls back to running on the page if the
  worker cannot start). `ScriptRunner` saves her code per exercise and reports `onPass({ viewedSolution })` (👀 badge).
  Lessons: `src/data/lessons-js.js`, `lessons-js-b.js`, `lessons-js-c.js`. UI: `JsLesson.jsx` (Learn / Quiz / Code tabs),
  `ScriptRunner.jsx`, `CodeEditor.jsx` (CodeMirror 6; lazy-loaded because it is large).
- Practice exercise shape: `jx(lessonId, n, title, level, { task, starter, hint, solution, explain, scenario?, tests })`;
  tests are `{ label, logs: [...] }` or `{ label, expr, expect }` (expr runs in the script's own scope). Each lesson: 4–5 learn cards, 20 quiz
  questions, and a 7-exercise **ladder** (easy → medium → three `'medium+'` steps that each add one idea, starter fading → hard).
  `level` is `easy | medium | medium+ | hard`. Exercises display in **ARRAY order** (no sorting): keep each lesson's array in the order she
  should do them, with level badges that never go down along it (check-js / check-cs enforce this; PDI lessons follow dependency order
  instead). Ids are stored in progress — append new ones, never renumber; ids 5–7 are usually the medium+ steps but not always.
  `hint` is a string or a **3-tier array** (nudge → method/shape → near-complete line; tier 3 must give more than tier 2). Keep starter
  comments to the step outline, not the finished code. Never write "Exercise 4 lo…" — cards are unnumbered; name the exercise by title.
  Server code must avoid syntax her PDI rejects in GLOBAL scope (`let`, destructuring, spread, `class`, default params, `for…of`,
  Map/Set/Promise); `const`, arrow functions, template literals, `includes`, `padStart`, `Object.entries` DO work there (verified).
  (Measured in Background Scripts. Business Rule / Script Include Script fields have a per-script "Turn on ECMAScript 2021 (ES12) mode"
  toggle that allows the rest; reference solutions stay without it.)
  Tests must fail for wrong-but-plausible code (hardcoded `gs.info`, ignored condition, the bug the lesson warns about): use `variants`
  (inline on the exercise, or `variants-cs.js` / `variants-cs-ua.js`), `scenario.seed` for other data, and `expr` checks of real state.
  Stage 3 client/server exercises share `JsLesson`, so they get the same level badge and tiered hints for free.
- Mock fidelity matters — it follows her Brazil PDI (`docs/pdi-facts-brazil.md`): `getValue()` is a string, `'1'`/`'0'` for true/false and
  `null` when empty; `gr.priority == 1` works but `=== '1'` does not, `gr.active == 'true'` is false; ONE element per field (so
  `arr.push(gr.number)` in a loop gives the last record N times); `addOrCondition` joins its own condition; a misspelt field in `addQuery`
  returns ALL rows; `initialize()` ≠ `newRecord()`; `current` with a stored number IS that record; GlideAjax / `getReference` callbacks run
  AFTER the script; `setValue` on the onChange field re-fires onChange; an empty mandatory field can't be hidden / made read-only; unknown
  fields are ignored; changes need `update()`. Mock 'sys' log lines are hints for her and never part of a test.

## How to test
- `npm run check` (= `node dev-tools/check-all.mjs`) runs every check below; the GitHub Pages deploy runs it before building, so a failing
  check stops the deploy.
- `node dev-tools/check-js.mjs` — every Stage 2 reference solution must pass all tests and every starter must FAIL; solutions must use only syntax
  her PDI accepts; level badges must not go down along the array. Run after any change to `src/js/` or JS lessons.
- `node dev-tools/check-mock.mjs` — mock API checks, mostly the behaviours verified in her PDI (getValue types, initialize vs newRecord, element-in-
  array, addOrCondition, ^OR / ^NQ, misspelt fields, async client callbacks, onChange re-fire, mandatory-wins …). Run after editing `src/js/`.
- `node dev-tools/check-quiz.mjs` — ALL quizzes: Stage 1 ≥ 8 per lesson (extra ones in `quiz-extra-s1.js`), Stage 2 exactly 20 (`quiz-extra-js.js`),
  Stage 3 ≥ 15 (`quiz-extra-cs.js` / `quiz-extra-cs-ui.js`); unique options, valid answers, explanations; the right option must not be much longer
  than the others, and may be the longest in at most 40% of a stage's questions (options are shuffled on screen, length is not).
  `audit-quiz.mjs` / `audit-quiz2.mjs` are optional reports, not gates.
- `node dev-tools/check-exercises.mjs` — Stage 1 exercise data sanity (ids, lessonIds, prerequisite notes on Practice Task exercises).
- `node dev-tools/check-glossary.mjs` — Stage 2 + Stage 3: every card `terms` key exists, and every `obj.method(` / bare call used in lesson code, hints and solutions has a glossary entry. Run after adding code to any Stage 2/3 lesson.
- `node dev-tools/check-page-terms.mjs` — floating glossary panel: client calls (`g_form.x()`) resolve to their own entries (never the server `getValue`), hints/solutions never add terms to a page (no spoilers), Stage 2 pages never list Stage 3-only entries.
- `dev-tools/test-driver.js` — auto-plays Stage 1 guided lessons (sets `window.__run`). Not loaded by the app: with the dev server running,
  load it in the page (e.g. `await import('/dev-tools/test-driver.js')` in the console), then `await __run('<lessonId>')`. It does not play
  the quiz. Re-run it after engine changes. (Load path verified 2026-11-14: all 18 lessons reach the quiz.)
- `npm run build` must pass. For UI changes, also check in a real browser (Claude in Chrome) — start `npx vite --port 5199`.

## Glossary (Stage 2 + Stage 3)
- Entries live in `src/data/glossary-js.js` (Stage 2), `src/data/glossary-cs.js` (Stage 3 client lessons) and `src/data/glossary-cs-ui.js`
  (Stage 3 UI Actions, CRUD, debugging, macros, UI Pages / Macros); Stage 3 entries are tagged `s: 3`; all merged into `GLOSSARY_JS`. Fields: `g` group, `m` meaning (Tenglish), `ex` example, `check: true` = shows ⚠️ "confirm in your PDI".
- Key naming: GlideRecord/GlideElement methods and JS words are bare (`getValue`, `var`); `gs.*` are `gs.info`; JS methods are `trim()`; client objects are exact (`g_form.setMandatory()`); two-word terms are phrases (`UI Action`).
- `src/data/glossary-scan.js` decides which terms a lesson page uses (shared by the panel and the checks). `LessonGlossary.jsx` is the floating 📘 button on every Stage 2/3 lesson (hidden on the Quiz tab). Per-card sub-boxes (`terms: [...]` on a learn card) are still used on `js-basics`.
- New API in a lesson → add its glossary entry (the check fails until you do). Never let a client method (`g_form.x`) fall back to a server entry.

## Conventions
- New Stage 1-style lessons: keep the `lessonKit.js` step format. New coding lessons: keep the `jx` format above.
- Add `data-tour="id"` to elements the tour/test driver must target, and `data-tip="key"` + a `TIPS` entry for hover help.
- Stages come from `src/data/stages.js` — a new stage = one STAGES entry (+ its lessons); Hub / Hands-on Practice / App pick it up.
- Real-PDI exercises that edit things must give exact cleanup steps; Practice Task–based exercises need a "Prerequisite:" note.

## Stage 3 — Udemy lecture list (26, course order; user-pasted, no durations)
1 SN Utils Tools · 2 What is client and Server, GlideUser API · 3 GlideForm API · 4 GlideForm Continuation · 5 GlideList API · 6 Client Scripts ·
7 On Load Client script Use cases · 8 On Change Client script Use cases · 9 CRUD using GlideRecord Part 1 (Create & Read) · 10 CRUD Part 2 (Update & Delete) ·
11 Glide Ajax & on change client script use cases (Part 1) · 12 same title (Part 2) · 13 Client and Server side Debugging · 14 Syntax Editor Macros ·
15 On Submit Client Scripts and Use cases · 16 Client Script Use cases · 17 On Cell Edit Client scripts · 18–21 UI Actions (parts 1–4) · 22 UI Actions on Table List ·
23 Client Side Scripting best Practices · 24 UI Pages · 25 UI Pages continuation · 26 UI Macros.
Status: all written. `mode: 'pdi'` lessons (1, 13, 14, 24–26) use `Card` from Exercises.jsx with scenario/hint/steps/answer/cleanup. Original plan: client runner lessons (g_user/g_form/g_list/Client Scripts/onLoad/onChange/GlideAjax/onSubmit/onCellEdit/UI Actions) use the client runner;
CRUD lessons 9–10 reuse the Stage 2 server runner; SN Utils, debugging, macros, best practices, UI Pages, UI Macros (Jelly) = learn cards + quiz + real-PDI exercises.
Client runner: exercise has `client: { trigger: { type: 'onLoad'|'onChange'|'onSubmit'|'onCellEdit', ... } }`; tests use `__f.<field>.{value,mandatory,readOnly,visible,choices,msgs}`, `__msgs`, `__submit`.
Lesson ids prefix `cs-`; check with `node dev-tools/check-cs.mjs`. Extra test runs: inline `variants` on the exercise, plus `src/data/variants-cs.js`
(cs-gluser … cs-oncell) and `src/data/variants-cs-ua.js` (cs-ua*, currently empty — they live inline), keyed by exercise id and merged with the inline
ones in `lessons-cs.js`; `runScript` takes optional `variants`. Extra quiz questions: `quiz-extra-cs.js` (client lessons) and `quiz-extra-cs-ui.js`
(the rest). Quiz options are shuffled at render time in `Quiz.jsx`. GlideAjax runs `scenario.scriptInclude {name, code}` on the server mock and
dispatches through `getName()` like the real AbstractAjaxProcessor (so a Script Include must not define getName / getValue / getType).
Client tests can read `__x.ajaxCalls`, `__x.formSubmits`, `__x.syncGetReference`, `__x.listRefreshes`; `client.trigger.isLoading` simulates a form
load; `scenario.seed` adds practice rows. Verified API details (gsftSubmit pattern, onCellEdit, g_list, labels, module locations) are in
`docs/pdi-facts-brazil.md`; anything else gets ⚠️ for her to confirm in her PDI.
