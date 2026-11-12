# SnowKeer — project guide (read this first)

Interactive ServiceNow practice site, built by the user for a friend learning ServiceNow (Admin + Developer) from the Udemy
course **"Total ServiceNow Developer and Admin course with JavaScript"** (9 sections, 119 lectures).
The friend is Telugu-speaking and uses a laptop.

## FIRST: get the lecture titles before building anything
**Before developing any new stage or lesson, ask the user to paste the Udemy lecture titles (and durations) for that section, and wait for them.**
Do not invent a lesson list, start planning lessons, or write code/content for a stage until the titles are provided. Map one lesson to each
title, in the course's order. Stage 1 and Stage 2 titles are already in the code; stages 3–6 are not known yet.

## Rules for new content
- **Language: Tenglish** — Telugu written in English letters, technical terms stay English. Casual, friendly tone
  (e.g. "Ippudu 'Submit' click cheyyi"). A Telugu-script toggle was deferred.
- **ServiceNow-only.** Never teach generic JavaScript/web concepts; every example must be a ServiceNow scenario
  (incident, `GlideRecord`, `gs`, `current`, `g_form`, ...).
- Release: **Brazil** (Next Experience UI). The Stage 1 mock was modelled on the user's own PDI.
- Follow the course's lecture order. The user pastes the Udemy lecture titles for each section; one lesson per lecture/topic.
- **Never create or modify things in the user's real PDI** without reversing them; never enter credentials on the developer site.
- ServiceNow steps/behaviour are written from memory — flag anything uncertain so the friend can confirm in her PDI.

## Stage plan and status
| Stage | Topic | Status |
|---|---|---|
| 1 | Introduction (18 lessons: account, users, UI tour, tables, forms, views, dictionary, update sets, UI/data policies...) | DONE — guided mock lessons + quiz, plus 54 real-PDI exercises |
| 2 | JavaScript, ServiceNow style (8 lessons) | DONE — learn cards + quiz + 32 coding exercises (only lesson 1 clicked through in a browser) |
| 3 | Client scripting & UI (26 lectures, titles below) | DONE — all 26 lectures in `src/data/lessons-cs*.js` (101 exercises: client runner, server runner, and `mode: 'pdi'` real-PDI lessons). Not clicked through in a browser except a few exercises |
| 4 | Server scripting (Business Rules, Script Includes, GlideRecord deeper, GlideAggregate, scheduled jobs) | planned |
| 5 | Service Catalog and Flow Designer | planned |
| 6 | ITSM and Now Assist | planned |

For stages 3–6 the exact lecture titles are unknown: **ask the user to paste the Udemy section's lecture list and wait** before planning or writing anything (see the first section above).

## Tech and architecture
React 18 + Vite 5, plain JS/JSX, no router, no backend, no CSS framework. Progress lives in `localStorage`
(`snowkeer-progress-v1`, see `src/progress.js`). Run with `npm run dev`; build with `npm run build`.

- `src/App.jsx` — all state; `view` = `hub | sim | quiz | exercises | js`. No router library.
- `src/data/lessons-{a,b,c}.js` + `lessons.js` — **Stage 1** lessons (guided steps, built with helpers in `lessonKit.js`: `info/click/type/goTo/q`).
- `src/engine/` — mini ServiceNow (tables, dictionary, layouts, views, policies, update sets) used by the Stage 1 simulator;
  UI pieces in `src/components/` (`Tour.jsx` guided steps, `Quiz.jsx`, `Hub.jsx`).
- `src/data/exercises.js` — Stage 1 hands-on exercises done in the **real PDI** (scenario / hint / steps / answer / cleanup revealed on click; `Exercises.jsx`).
  IDs are `lessonId-n` and are stored in progress — **never renumber existing exercises**.
- **Stage 2 code runner:** `src/js/` — `snowMock.js` (mock `gs`, `GlideRecord`, GlideElement), `snowData.js` (fixed practice data: 8 incidents,
  users, groups), `runScript.js` (runs code + tests, also provides `Class.create`), `runner.worker.js` (Web Worker, 3 s timeout in `ScriptRunner.jsx`).
  Lessons: `src/data/lessons-js.js`, `lessons-js-b.js`, `lessons-js-c.js`. UI: `JsLesson.jsx` (Learn / Quiz / Code tabs),
  `ScriptRunner.jsx`, `CodeEditor.jsx` (CodeMirror 6; lazy-loaded because it is large).
- Practice exercise shape: `jx(lessonId, n, title, level, { task, starter, hint, solution, explain, scenario?, tests })`;
  tests are `{ label, logs: [...] }` or `{ label, expr, expect }` (expr runs in the script's own scope). Each lesson: 4–5 learn cards, 5 quiz
  questions, 4 exercises (easy, easy, medium, hard).
- Mock fidelity matters: `gr.priority == 1` works but `=== '1'` does not (field values are GlideElement-like objects), `getValue()` returns strings,
  changes need `update()`. Keep the mock faithful so she learns real behaviour.

## How to test
- `node dev-tools/check-js.mjs` — every Stage 2 reference solution must pass all tests and every starter must FAIL. Run after any change to `src/js/` or JS lessons.
- `node dev-tools/check-exercises.mjs` — Stage 1 exercise data sanity (ids, lessonIds, prerequisite notes on Practice Task exercises).
- `dev-tools/test-driver.js` — auto-plays Stage 1 guided lessons (sets `window.__run`). Not loaded by the app: with the dev server running,
  load it in the page (e.g. `await import('/dev-tools/test-driver.js')` in the console), then `await __run('<lessonId>')`. It does not play
  the quiz. Re-run it after engine changes. (Load path not re-verified in this session.)
- `npm run build` must pass. For UI changes, also check in a real browser (Claude in Chrome) — start `npx vite --port 5199`.

## Conventions
- New Stage 1-style lessons: keep the `lessonKit.js` step format. New coding lessons: keep the `jx` format above.
- Add `data-tour="id"` to elements the tour/test driver must target, and `data-tip="key"` + a `TIPS` entry for hover help.
- Stage 1 `Hub.jsx` is hardcoded per stage; new stages need their own section there (see the Stage 2 block).
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
Lesson ids prefix `cs-`; check with `node dev-tools/check-cs.mjs`. GlideAjax runs `scenario.scriptInclude {name, code}` on the server mock. Flag uncertain API details (gsftSubmit pattern, onCellEdit signature, g_list methods) for her to confirm in her PDI.
