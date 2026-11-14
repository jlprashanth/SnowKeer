# Overnight changes — review notes (2026-11-14)

All audit items P0–P3 are done. `npm run check` (7 checks) passes and the whole app compiles. Stages 1–3 were clicked through in a
browser test harness, and all 18 Stage 1 guided lessons auto-play to their quiz. This morning her PDI was checked again (round 2,
below). **Nothing is committed or pushed** — every change is in the working tree (`git status`). Delete this file when you're done
with it.

## 1. Test it on the other PC
On this PC, put the work on a branch and push it (pushing a branch does not deploy; only `main` does):
```
git checkout -b overnight-fixes
git add -A
git commit -m "Align content and mocks with her Brazil PDI; audit fixes P0–P3"
git push -u origin overnight-fixes
```
On the other PC:
```
git fetch && git checkout overnight-fixes
npm ci
npm run check    # 7 checks, all should pass
npm run build    # the one thing I could not run here
npm run dev      # then click through: see "Click-test list" at the end
```
Merging to `main` deploys, and the deploy now runs `npm run check` first.

## 2. PDI check, round 2 (this morning)
Everything verified is now in `docs/pdi-facts-brazil.md` (items 38–53). Highlights:
- **Fixed because her PDI said otherwise:**
  - Syntax Editor Macros expand with **Ctrl+Space → pick → Enter** in her Monaco editors, not Tab.
  - Field Watcher is in the form **☰ → "Enable Field Watcher"**.
  - `g_form.addOption()` never adds a duplicate.
  - Reading a property of `undefined` is silent (only `null` throws).
  - A custom table needs its own **Process Flow formatter** record.
- **Confirmed, so the "⚠️ confirm" notes were removed:**
  - `oldValue` is the form-load value (proved with the OOB "Worknotes mandatory" script), and `setValue` fires onChange.
  - `getReference` / GlideAjax answers are asynchronous.
  - A Resolved incident stays **active**; Closed makes it inactive.
  - Assignment rules: lowest Order wins, and a preset group is kept.
  - Dictionary Read only is form-only, and a Data Policy didn't block a script insert.
  - A second `insert()` without `initialize()` creates another record.
  - About 25 more labels, module locations and OOB scripts.
- **New facts now taught:**
  - The "Scripts - Background" module opens a Monaco page with a **"Run Script"** button.
  - Business Rule / Script Include scripts have a per-script **"Turn on ECMAScript 2021 (ES12) mode"** toggle.
  - **Form Builder** is in ☰ → Configure.
  - `g_list` exists only inside list UI Actions.
- **Practice data now matches her PDI:**
  - INC0010005 is **Closed** (inactive) instead of "Resolved but inactive".
  - INC0010006's priority follows her lookup (4).
  - The exercises these changes affected were updated.
- **Mock matches more PDI behaviour:**
  - `addOption` skips existing values.
  - An empty `getReference` passes back an object with undefined fields.
  - A Script Include with its own empty `initialize()` breaks `getParameter()`, as in her PDI.
- **Still unverified:** 63 "confirm in your PDI" notes. They're listed in section 4: list editing, `g_form.submit()` re-running
  onSubmit, UI Policy order conflicts, table-delete side effects, PDI hibernate/reclaim timing, SN Utils, and some UI navigation
  details. Most need temporary records or UI clicking; I can do them if you want.

## 3. What my PDI checks left behind
- **Records:** none. Temporary records were deleted and the cleanup was verified: 6 test incidents, 2 assignment rules and their 2
  update-set entries, and 2 SLA flow runs started by the test incidents.
- **Incident numbers used up:** INC0010012–INC0010018 (read-only `newRecord()`, opening blank New forms, and the deleted test
  incidents).
- **Platform history entries (normal):** the deleted incidents appear in the platform's Deleted Records audit. Background Script runs
  left script-execution history entries, plus one empty rollback entry: the modern page ticks "Record for rollback?" by default.

## 4. Other things you may want to revisit
- **Priority 3/3 stays "4 - Low"** (her PDI's lookup).
- **The mock copies PDI behaviour even where it trips her up:**
  - `getValue()` returns `'1'`/`'0'`/`null`.
  - Pushing `gr.number` into an array repeats the last record.
  - A misspelt field returns all rows.
  - GlideAjax answers arrive after the script finishes.
  - `setValue()` on its own field fires onChange again.
  - An empty mandatory field can't be hidden.
  - `getParameter()` returns a Java-style string.
  - A Script Include must not define `getName()` or an empty `initialize()`.
  - Hint lines in the Script Log explain these, and tests never count them.
- **The Final cleanup card is filed under Data Policies** (id still `table-creation-4`).
- **What I could not run:** the real `npm run build` with React 19, the Astryx theme, CodeMirror and the Web Worker.

## 5. Items still marked ⚠️ (confirm in her PDI) and the UI notes

**Added later on 2026-11-14:** the ⚠️ facts she can test now have a closed "🔍 PDI lo ela check cheyyali?" box under them: 15
recipes in `src/data/pdi-checks.js` (steps, what she should see, cleanup), linked from 35 places. Docs-only facts (Portal / Workspace
limits, Jelly caching, Isolate script, `hasRoles`, `getAnswer`, `setWorkflow` notifications) now say "📄 docs nunchi" instead of
"confirm". The ⚠️ notes with no box are the ones where the exercise step itself shows the answer, plus the developer portal and SN Utils
ones. Details: `docs/audit-2026-11/change-logs/pdi-check-steps.md`.

### Stage 1 (guided lessons, real-PDI exercises, extra quiz)
- lessons-a.js:20 — admin password reset from the developer portal (portal, not PDI).
- lessons-a.js:21, exercises.js:26, quiz-extra-s1.js:10, :11, InfoPages.jsx:74 — hibernate / reclaim timings (⏸).
- lessons-b.js:181, exercises.js:340 — Process Flow highlight changes only after save / reload (⏸).
- lessons-c.js:30 — real filter opens with an empty row + AND/OR per row (not in verify-round2).
- lessons-c.js:68 — new-record ☰ has no Insert options (not in verify-round2; #8 menu was an existing incident).
- lessons-c.js:287, exercises.js:650 — exact "Data Policy Exception" message text (⏸).
- exercises.js:133 — un-grouping a list option name (⏸).
- exercises.js:143 — learning-site name / URL (⏸).
- exercises.js:234 — Form Layout Section → "New..." (⏸).
- exercises.js:429 — saved filter load menu place (sys_filter table itself is verified; the ☰ → Filters path is not).
- exercises.js:600, quiz-extra-s1.js:166 — UI Policy action ignored on an empty mandatory field (⏸).
- exercises.js:635 — conflicting UI Policies, higher Order wins (⏸).
- exercises.js:679 — whether table delete needs security_admin elevation (⏸); :686 — table delete removes its ACLs (⏸).
- Unverified WITHOUT ⚠️ (left as before, the exercise itself is the test): exercises.js data-policies-2 (:653-664)
  list edit skips UI Policies / Data Policy blocks list edit (⏸); exercises.js:229-239 (form-design-2) Form Sections note,
  :243-279 (views-1/3/2) "View name" dropdown / View Rule on open, :472 (save-submit-2) Insert navigation (⏸, fallbacks given).
- New wording I am fairly (not fully) sure of, no ⚠️: lessons-c.js:208 "a committed retrieved set also shows in Local
  Update Sets with the same name" (standard behaviour); exercises.js:541 Conditions sit on the "Applies To" tab (tab names
  verified, field-to-tab mapping inferred); tips.js:75 "Delete is a form button" (Delete absent from the verified ☰ list).

### Stage 2 JavaScript
- glossary-js.js:61: `setWorkflow(false)` also skips workflows / notifications (docs). ⏸ as instructed, now visible in the text.
- lessons-js.js:160: typing `gr.` in the Monaco editor lists GlideRecord methods. Ctrl+Space itself is verified.
- lessons-js.js:88 (no ⚠️, worded "peru batti" = going by the name): "Record for rollback?" records the run's changes so they can be
  rolled back. Only "ticked by default" is verified. If convenient, run a harmless update with it ticked and check that a rollback
  link appears in the output or under Script Execution History.
- lessons-js.js:159 (pre-existing, not a PDI fact): developer.servicenow.com menu names may change by release.
- Note, no ⚠️: the undefined fact was tested as `var u; u.number`. The card and quiz apply it to `data.result.number`, the same
  operation one level deeper. Fact #26 says `gs.info(undefined)` prints "undefined".

### Stage 3 client lessons
- lessons-cs-c.js:652 + quiz-extra-cs.js:137 — return false inside a getXMLAnswer callback does not stop the save (softened:
  async is verified, the "save not stopped" part is not).
- lessons-cs-c.js:654 (⚠️ ADDED — the statement had none), :808, glossary-cs.js:54 (check: true), quiz-extra-cs.js:138, :144 —
  g_form.submit(action) re-runs onSubmit scripts.
- lessons-cs-c.js:655, :808, glossary-cs.js:94 (check: true), quiz-extra-cs.js:111, :145 — getXMLWait not working in Service
  Portal / Workspace (⚠️ narrowed to that part only).
- lessons-cs-c.js:1067 (card), :1131 (callback twice), :1182 (⚠️ ADDED), glossary-cs.js:82 (⚠️ ADDED, onCellEdit),
  quiz-extra-cs.js:167, :168, :173 — list editing: onCellEdit newValue = choice value, onChange / UI Policies skipped, Data Policy on list edit.
- quiz-extra-cs.js:101 — clearValue() firing the other field's onChange (setValue verified; clearValue not) — ⚠️ narrowed.
- quiz-extra-cs.js:90 — onLoad Client Scripts run before UI Policies (UI Policy specifics ⏸).
- glossary-cs.js:66 g_user.hasRoles() for a role-less user, :95 ga.getAnswer() — still check: true (not in round 2).

### Stage 3 UI Actions / CRUD / debugging / macros / UI Pages
- lessons-cs-d.js:42, :582, quiz :612 (right answer is now `Condition lo gs.hasRole("itil")`), glossary :23 (check kept).

### App UI / progress
#### UI judgment calls (confirm or ask to revert)
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

#### Click-test list (on the other PC: npm ci && npm run dev)
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
9. "🔍 PDI lo ela check cheyyali?" boxes (only server-rendered here — the browser extension was offline): Stage 3 "onSubmit Client
   Scripts & Use Cases" → Learn → "⏳ onSubmit + GlideAjax" card has two closed boxes; open one (steps, code, 👀, 🧹). Same lesson's
   quiz: Q6 and Q7 show a box under the explanation. Code tab → "Duplicate check (GlideAjax + malli submit)" → open the solution → box
   under the explanation. Stage 1 "Save, Submit, Update, Insert & Stay" tour, step 3 bubble → open the box: the bubble scrolls instead
   of running off screen. Hands-on Practice → Stage 1 → Data Policies → Final cleanup card has a box. Glossary 📘 →
   `g_form.submit()` has a box, `ga.getXMLWait()` shows 📄. Dark mode: the box is readable.
