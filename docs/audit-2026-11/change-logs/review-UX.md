# review-UX — UI / progress agent

Files touched (only mine): src/App.jsx, src/components/Hub.jsx, src/components/Exercises.jsx, src/components/JsLesson.jsx,
src/components/Quiz.jsx, src/progress.js, src/styles2.css, NEW src/data/stages.js. DELETED src/data/nav.js, src/data/incidents.js
(grep: nothing in src/, dev-tools/, index.html or vite.config.js imports them). styles.css not changed. No git commands that change anything.
Every data-tour attribute and window.__snow ({ LESSONS, getDb, startLesson }) unchanged. My files are normalised to CRLF like the rest of the working copy.

## DONE
1. **Array order everywhere**: removed the RANK sort in JsLesson.jsx and `byLevel` in Exercises.jsx (Stage 1 single-lesson page,
   Stage 1 folds, Stage 2/3 folds). Level badges kept (`LEVEL` now exported from Exercises.jsx and reused by JsLesson).
2. **Data-driven stages**: src/data/stages.js exports `STAGES` (s1 guided / s2 code / s3 code; icons, titles, subtitles copied
   from Hub; optional `intro` text and `glossary: true` for Stage 2's glossary panel) plus helpers `findCodeLesson`,
   `lessonExercises`, `exerciseDone`, `lessonDone`, `stageDoneCount`, `nextLesson`. Hub (stage cards), Exercises (one fold per
   stage) and App (`findCodeLesson`) all read it, so Stage 4 = one STAGES entry (kind 'code' + lessons array).
3. **Continue across stages**: hero button = first unfinished lesson over all stages in order (Stage 1: `progress[id].done`;
   code lesson: quiz has a score AND every exercise done). Label shows the stage ("▶ Continue: <title> · Stage 2"); when all is
   finished it shows "🔁 Replay: <first lesson>" + "🎉 Anni stages complete!". Progress line: "Progress: x/52 lessons
   (Stage 1: a/18 · Stage 2: b/8 · Stage 3: c/26)".
4. **Progress backup** (progress.js): `exportProgress(progress?)` → JSON `{ version: 1, app, savedAt, progress, code: { all
   'snowkeer-code-v1:*' keys } }`; `readBackup(json)` validates without side effects (Tenglish error text); `importProgress(json)`
   validates then REPLACES progress + saved code (keys not in the file are removed); `clearSavedCode()`. Hub hero:
   "⬇ Progress save cheyyi" (Blob + a[download] → snowkeer-progress.json) and "⬆ Progress load cheyyi" (hidden file input →
   confirm modal styled like Reset, shows file name/date and counts → "Yes, load cheyyi" / "No"; bad file → "⚠ Ee file load
   avvadu" + reason). Reset (App) now also clears the saved code keys; its text says so and suggests saving a backup first.
5. **Stage 1 "❓ Quiz matrame"** on every Stage 1 card done at least once → Quiz view directly (no tour), with a
   "← Course ki back" button and "Quiz complete ✅" title. `finishQuiz` keeps the BEST score (Math.max, other fields kept).
   Quiz end screen (all stages) now says "🏆 Nee best score X/N alage save ayyi untundi" on a lower retry or "Kotha best score!".
6. **Deep link**: Exercises "💻 Lesson lo open cheyyi" → `App.openJs(lessonId, exerciseId, 'exercises')` → JsLesson
   `openExerciseId`: starts on the Code / PDI Practice tab, that exercise expanded, `scrollIntoView` on `#ex-<id>`.
7. **Solved-with-help**: `markJsDone(exId, info)` stores `true` or `'solution'` (`info.viewedSolution`), never turns a `true`
   into `'solution'`. JsLesson header and Practice rows show "✔ title 👀 (solution chusi)" (amber pill `.ex-help`); all counts
   use truthiness so both count as done. PDI toggles unchanged.
8. **Quiz tip**: PDI-mode lessons say: Next: "🛠 PDI Practice" tab lo tasks nee real PDI lo chey — steps / answer / cleanup akkade unnayi.
9. nav.js / incidents.js deleted (dead code).
10. CSS (styles2.css, end of file): `.hero-stage`, `.hub-backup`, `.hub-backup-note`, `.hub-notice`, `.ex-help`, `.quiz-exit`,
    `.quiz-best`, with dark-mode rules using the existing `--tint-warn` tokens. Modal reuses `.modal-back/.modal/.btn.danger`.

### Judgment calls (please confirm or tell me to revert)
- **Code-lesson ✓ and stage-header counts** (Stage 2/3) now use the same rule as Continue: quiz taken AND all exercises done
  (before: all exercises done, quiz ignored). Otherwise a ✓ lesson could still be the Continue target.
- **"Continue" on a code-lesson card** behaves like the hero: once its quiz is done it opens the Code tab at the first unfinished
  exercise (before: always the Learn tab). Not started / quiz not taken → Learn tab as before.
- **Back from a deep-linked lesson** returns to Hands-on Practice (button reads "← Hands-on Practice ki back") with that
  exercise's row (stage → lesson → exercise) open and scrolled to centre. A fresh visit from the hub starts all-closed as before.
- Practice page Stage 3 fold title now comes from STAGES: "STAGE 3 · Client scripting" (was "… Client scripting & UI").
- Hub card status reads "🛠 PDI: x/y" for PDI-mode lessons (was "💻 Code: x/y").
- Backup import is strict: version must be 1; every progress entry must be an object; `score` number / `done` boolean;
  `exercises` / `jsDone` values boolean or 'solution'; code keys must start with 'snowkeer-code-v1:' and be strings; max 5 MB.

## CLICK-TEST IN THE BROWSER (npx vite --port 5199)
(All of these already pass in my fake-DOM test with React 18.3.1; the app ships React 19, so please still click them.)
1. Hub: hero says "▶ Start: … · Stage 1"; progress line shows the 3 stage counts; open/close the 3 stage cards.
2. Finish one Stage 1 lesson → "❓ Quiz matrame" appears on that card only → do the quiz badly → end screen keeps the best
   score; card still shows the best. Also try "← Course ki back" mid-quiz.
3. Stage 2 lesson: take the quiz, open an exercise, click "✅ Solution chupinchu", "Editor lo pettu", Run → header shows
   "✔ … 👀 (solution chusi)"; same row in Hands-on Practice shows it too.
4. Hands-on Practice → Stage 2 → lesson → exercise → "💻 Lesson lo open cheyyi": Code tab, that exercise open AND scrolled to;
   "← Hands-on Practice ki back" → the same row is open and in view.
5. "⬇ Progress save cheyyi" downloads snowkeer-progress.json (check it contains your code). Reset progress → everything and
   saved code gone (re-open an exercise: starter code). "⬆ Progress load cheyyi" with that file → modal (No changes nothing,
   Yes restores progress + code). Try a random .json → "⚠ Ee file load avvadu".
6. A PDI-mode Stage 3 lesson (e.g. SN Utils): finish the quiz → tip points to the PDI Practice tab.
7. Dark mode: hero buttons/notice, the 👀 pill, the quiz best-score box, the load modal.
8. Narrow window: the hero button label is longer now (title + "· Stage N"); check it wraps OK.

## FLAGGED FOR PDI CHECK
- None. These are UI and progress changes only; no ServiceNow content.

## REQUESTS (files I don't own)
- **CLAUDE.md** (out of date after this):
  - line 51: "`JsLesson.jsx` sorts by RANK, so ids need not match display order" → "display order = ARRAY order in the lesson
    file (no sorting); ids need not match display order".
  - line 80: "Stage 1 `Hub.jsx` is hardcoded per stage; new stages need their own section there" → "add one entry to
    `src/data/stages.js` (kind 'guided' | 'code', lessons, optional intro / glossary); Hub, Hands-on Practice and App read it".
  - Progress section: `jsDone[id]` is `true` or `'solution'` (passed after opening the solution); Hub has progress backup
    save/load (progress.js exportProgress / readBackup / importProgress); Reset also clears 'snowkeer-code-v1:*'.
  - Architecture bullets: `src/data/nav.js` / `incidents.js` no longer exist (they were not listed, so just FYI).
- **ScriptRunner.jsx** (`viewedSolution` is per visit): if she pasted the solution, it is saved as her code; next visit a plain
  Run reports `viewedSolution: false`, and App upgrades 'solution' → ✔ (the spec only forbids true → 'solution'). For a sticky
  👀, either persist "solution viewed" per exercise (e.g. 'snowkeer-solseen-v1:<id>', and add it to the backup prefix list) or
  report `viewedSolution: true` when the code being run equals `exercise.solution`. Tell me if you would rather have App never
  upgrade 'solution' → true; it is a one-line change in `markJsDone`.

## NOT DONE
- Could not run `npm run build` or a real browser (npm is broken here). Covered instead by esbuild over the whole import graph,
  a server-render test and a fake-DOM click test (below).

## FINAL CHECK OUTPUT
`node SCRATCH\ux-rt\run-all.mjs` (re-runnable; React 18.3.1 copied from SCRATCH\tk, CodeMirror/Astryx stubbed, the stand-in
worker runs the REAL src/js/runScript.js):
```
✔ jsx-check: JSX check OK (whole import graph compiles)
✔ progress/stages unit tests: 11 tests passed
✔ server-render tests: 14 render tests passed, 0 React warnings
✔ click-flow tests: 8 click-flow tests passed, 0 React warnings
All UX tests passed
```
Click flows covered: quiz-only + best score kept / raised, cross-stage Continue to the first unfinished exercise (open +
scrolled), solution-viewed pass → 'solution' + 👀, never-downgrade, Practice deep link + back, array order, backup save / load
(No, Yes, bad file), reset clears code, PDI quiz tip.

`node dev-tools/check-all.mjs` at the end (no check imports my files; the failures are in lesson content other agents are
editing right now, and the counts changed between my runs):
```
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✘ check-cs: 26 lessons, 164 exercises, 1 problems
✘ check-quiz: 8 problem(s)
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✘ check-glossary: 4 issue(s)
✔ check-page-terms: OK — lesson glossary matching passes all checks
```
