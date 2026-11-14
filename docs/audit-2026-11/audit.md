# SnowKeer audit — 2026-11-13 (commit 73173a1)

State of the repo **before** the fixes. Some claims here were later overturned by checking her PDI; see the notes in *italics*
and [../pdi-facts-brazil.md](../pdi-facts-brazil.md).

## What it is
A React + Vite site with no backend, hosted on GitHub Pages. It follows the Udemy course "Total ServiceNow Developer and Admin
course with JavaScript" lecture by lecture, in Tenglish, for one learner. It teaches three ways:
- guided spotlight tours in a mock ServiceNow UI (Stage 1)
- in-browser coding against a mock `gs` / `GlideRecord` / `g_form`, with auto-graded tests (Stages 2–3)
- step cards for her real PDI

Progress is saved in the browser's `localStorage`.

## What was done
| Stage | Lectures | Teaching | Quiz | Exercises |
|---|---|---|---|---|
| 1 Introduction | 18/18 | 436 guided steps | 71 (3–4 per lesson) | 54 in her real PDI |
| 2 JavaScript | 8/8 | 43 learn cards | 160 (20 per lesson) | 56 coded |
| 3 Client scripting | 26/26 | 61 learn cards | 130 (5 per lesson) | 140 coded + 21 PDI |

That's 52 of the course's 119 lectures. All 7 `dev-tools/check-*.mjs` scripts passed.

## What wasn't done
- Stages 4–6 (67 lectures, lecture titles unknown).
- Browser click-through of most of Stages 2–3.
- Learner feedback; the Telugu-script toggle.
- The build couldn't be verified (npm broken on the work PC).

## Gaps found

### 1. The mocks passed code that would fail in a real instance (all stages)
- GlideAjax / `getReference` callbacks ran synchronously, so cs-ajax1-1 passed with the async bug and with no GlideAjax call at all.
- `gr.number` pushed into an array gave distinct values (in a real instance it repeats the last record).
- `addOrCondition` attached to the last condition instead of its own, and the glossary example was wrong.
- `getValue()` returned `''` / `'true'` (real: `null` / `'1'`).
- `oldValue` in the live form was the last edit (real: the value at form load).
- `isLoading` was never true.
- Modern JS ran with no warning.
- The Stage 1 engine had:
  - `^OR` precedence wrong
  - Insert / Insert and Stay offered on new records
  - a clickable Process Flow bar
  - priority 3/3 → 4. *(Round 1 PDI check: 4 is correct for her PDI — kept.)*

### 2. Tests could be passed without doing the task
- No variants in Stage 2; hardcoded `gs.info` passed many exercises.
- Server tests never checked the database (`current` had no sys_id, so `update()` inserted a duplicate).
- Copying the solution counted as solved.
- The right quiz answer was much the longest in 21/71, 54/160 and 61/130 questions.

### 3. Factual errors
- PDI "hibernates after ~10 days, data kept", when it is reclaimed and wiped.
- onSubmit + GlideAjax understated.
- SN Utils `/tn`.
- Dictionary mandatory "applies to scripts".
- A missing "kudadu".
- `initialize()` described with defaults.
- Resolution notes taught in Description.
- UI Page `ok_type="button"`.
- An invalid field in a query returning no rows in the mock.

### 4. Real-PDI exercise flow
- Cards were sorted by level, so dependent cards showed first.
- Cleanup steps deleted what later exercises needed (hari.test, UI pages and macros).
- Stage 2's ladder order contradicted its hints.

### 5. Depth
- Stage 3 had 5 quiz questions and about 2.3 learn cards per lesson.
- Stage 1 had 3–4 questions per lesson.
- `this`, GlideModal, Jelly phase 2 and Update Set preview / commit were missing.

### 6. App / UX
- Code was lost on switching tab or exercise.
- "Continue" only knew Stage 1.
- No progress backup.
- A Stage 1 quiz retake needed the whole tour, and the score was overwritten.
- The deep link didn't open the exercise.

### 7. Engineering
- The deploy ran no checks.
- README / CLAUDE.md were out of date (React 18, "no CSS framework", Stage 3 "Next", 17 vs 20 lessons).
- Dead files `nav.js` and `incidents.js`.
- Stages were hard-coded in three components.

## Sources used in the audit
ServiceNow Community threads and the SN Utils cheat sheet, as cited in the original report. These were later superseded by direct
checks in her PDI (pdi-facts-brazil.md).
