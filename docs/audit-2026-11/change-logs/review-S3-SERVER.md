# review-S3-SERVER — UI Actions 1–5, SN Utils, CRUD 1–2, Debugging, Macros, Best Practices, UI Pages 1–2, UI Macros

Files edited (only these): `src/data/lessons-cs-d.js`, `src/data/lessons-cs-e.js`, `src/data/variants-cs-ua.js`, `src/data/glossary-cs-ui.js`.
No exercise id was renumbered or deleted. New ids appended: cs-crud1-8, cs-crud2-8, cs-crud2-9, cs-debug-5, cs-macros-4,
cs-snutils-5, cs-uipages2-4, cs-uimacros-4, cs-uimacros-5 (162 → 173 Stage 3 exercises in total incl. other agents' work).

## DONE
- **check-cs failures fixed** — cs-ua1-3 / cs-ua4-2 use `current.assigned_to.nil()`, cs-ua4-1 uses `current.active == true`
  (cards + explains teach why: PDI getValue → null / '1'); cs-ua1-4 / cs-ua1-6 expect active '1'; cs-best-5 has a
  `__x.syncGetReference === 0` test and the task/explain no longer say the sync call "returns nothing".
- **Server tests read the table** — `REC(values, id)` seeds the stored row and makes `current` that row; `DB / DBS` read it back
  with a fresh GlideRecord. Every UI Action server exercise (ua1, ua3, ua4, ua5) and crud1-1 / crud1-4 / crud2-1/2/8 now fail
  without `update()` / `insert()` of real values.
- **Hardcoded logs / missing conditions now fail** via `scenario.seed` variants (crud1-1/2/3/5/6/7/8, crud2-1/2/3/5/7/4/8/9,
  ua1-2/6/4, ua4-6/4, best-1/2/4). crud1-3 without addActiveQuery / orderBy, crud2-4 with one condition, crud2-5 with state=6
  all fail. Verified with a harness of **79 wrong-but-plausible solutions — all fail** (scratchpad `s3server/wrong-*.mjs`).
- **CRUD facts** — initialize() = all null / newRecord() = defaults + number (new card + code); getRowCount vs GlideAggregate
  card; Delete card rewritten around "count / dry-run first"; new "🚨 field typo = ALL rows" card; update sets don't capture
  data (no undo) fixed; updateMultiple + deleteMultiple cards **and** one careful exercise each (crud2-8 count first,
  crud2-9 count limit); GlideAggregate exercise crud1-8 (category-wise, orderBy, string result).
- **Priority realism** — ua1-2 escalates urgency, ua2-1 sets impact + urgency, ua5-1 sets urgency, crud2-2 sets state; cards
  explain the Data Lookup / read-only priority; cs-debug-3 uses urgency (priority is read-only on her form).
- **cs-ua5 rebuilt (same ids)** — 5 learn cards (3 list types, server list action = once per record with current ⚠️,
  g_list.getChecked(), Script Include "Glide AJAX enabled", bulk safety). Ladder: list choice (server) → banner count → banner
  confirm + GlideAjax (`scenario.scriptInclude`, tests on `__x.ajaxCalls`) → Script Include assignToMe (callAjax + table) →
  getRowCount mismatch guard → skip already-assigned (.nil()) → full safe bulk assign (empty / mismatch / skip / state 2).
  No g_form on lists; no `selectedIds` magic variable. Script Include names avoid getName/getValue/getType (pdi #36).
- **UI Action facts** — Brazil labels (Client, Onclick, Action name, Form button/link/context menu, List banner button/choice/
  context menu, Show insert/update, Isolate script); roles via "Requires role" related list ⚠️; all "memory nunchi" ⚠️ notes on
  gsftSubmit removed (now "✅ tested"). Resolve/Close exercises set or already have Resolution code + notes (Data Policy).
  ua3-3 validates close_notes (Resolution notes) instead of description; ua3-6/4 write a work note.
- **SN Utils** (cheat sheet https://snutils.com/docs/guide/slash-commands/cheatsheet fetched): Ctrl + / opens the slash window,
  `/incident` opens a list, `/tn` toggles technical names (also double-click a label), /bg, /xml, /me, /u, /br /cs /ua /si,
  /log, /help. Card, code sample, exercises 2–3 fixed; new exercise /xml (values vs labels).
- **UI Pages** — no ok_type="button" anywhere; `<g:dialog_buttons_ok_cancel ok="return validate()" />`; code shown PER FIELD
  (HTML with the full j:jelly wrapper / Client script / Processing script cards); phase 1 vs phase 2 card; XML escaping
  (&amp;&amp;, &lt;) in g:evaluate; GlideModal (GlideDialogWindow = deprecated); duplicate URL question replaced; new
  exercise "ok_type trap" demonstrates the verified behaviour.
- **PDI card order / cleanup** — cs-uipages, cs-uipages2, cs-uimacros: arrays in doing order, "Prerequisite:" in dependent
  scenarios, no early cleanup deletes what a later card needs (final cleanup on the last card; earlier cards say what to delete
  if she stops there). Levels never go down along any array (so display is the same whether or not the UI sorts by level).
- **cs-macros** — real list (doc, for, ialogbr, ialogsi, info, method, vargr, vargror), vargr template per pdi #19, help+Tab ⚠️,
  Scripts - Background under System Definition, custom-macro card + exercise cs-macros-4 (Name / Comments / Text with $0,
  cleanup = delete record), full-screen/shortcuts ⚠️ (F11 is the browser's). **cs-debug** — System Diagnostics modules (fixed
  :417), Field Watcher / JavaScript Log have no module ⚠️ how to reach, new read-only exercise "Debug tools ekkada unnayi?".
  **cs-uimacros** — g:macro_invoke, formatters ⚠️, ref_contributions ⚠️, Debug UI Macro (+ exercises 4, 5).
- **Thin lessons** — every one of my 14 lessons now has 3–5 learn cards. Quiz: all "much longer" flags in my lessons fixed;
  facts already covered by the 140 new quiz-extra questions were not duplicated (two of the quiz agent's suggested option sets
  adopted: cs-uipages2 Q2, cs-uimacros Q2). Stage 3 "right answer longest" is now 15%.
- **variants-cs-ua.js** emptied on purpose: all cs-ua variants are now inline next to the REC/DB helpers (the old entries
  expected `current.getValue(...)` on unsaved current and would have been merged onto the new exercises).
- **Glossary** (glossary-cs-ui.js, 28 entries): newRecord, isNewRecord, updateMultiple, deleteMultiple, autoSysFields,
  GlideAggregate, addAggregate, getAggregate, groupBy, Requires role, Data Lookup, GlideModal, response.sendRedirect(),
  g:evaluate, g:ui_form, g:dialog_buttons_ok_cancel, gel(), g:macro_invoke, ref_contributions, Scripts - Background,
  Script Debugger, Session Debug, Script Tracer, Debug UI Macro, Field Watcher (unverified ones carry check: true).

## FLAGGED FOR PDI CHECK (⚠️ in the text)
- lessons-cs-d.js:39, :579 — UI Action roles go in a "Requires role" related list at the bottom of the UI Action form.
- lessons-cs-d.js:60 — server UI Action: form values are in `current` but nothing is saved until `current.update()`.
- lessons-cs-d.js:602 — client UI Action "Isolate script" = strict mode like Client Scripts.
- lessons-cs-d.js:762 — List choice / List context menu with Client unticked runs once per selected record, `current` = that row.
- lessons-cs-d.js:825 — `g_list.refresh()` exists in a list UI Action.
- lessons-cs-d.js (cs-ua4-1 explain) and lessons-cs-e.js (cs-crud2-4 explain) — Resolved (6) incidents stay active=true until
  Closed. (If false, the seeded "Resolved but active" rows are still valid test data — only the sentence changes.)
- lessons-cs-d.js:451 (not ⚠️, hedged) — OOB incident "Resolve…" UI Action shows the gsftSubmit / typeof window pattern.
- lessons-cs-e.js:57 — `incident.list` typed in the Next Experience navigator opens the list.
- lessons-cs-e.js:286 — second insert() without initialize() duplicates the old values (told not to try it).
- lessons-cs-e.js:375, :568 — docs warning: updateMultiple + direct assignment (gr.state = 2) may update the whole table.
- lessons-cs-e.js:506 — deleteRecord() after a failed get() (told not to try it).
- lessons-cs-e.js:619 — classic form inside iframe "gsft_main"; opening incident.do directly avoids it.
- lessons-cs-e.js:638, :691 — Session Debug "Disable All" module name.
- lessons-cs-e.js:645 — "JavaScript Log and Field Watcher" option in user Preferences → Developer.
- lessons-cs-e.js:713, :766 — help + Tab built-in macro list.
- lessons-cs-e.js:744, :745 — editor toolbar buttons / shortcut keys; gs. / gr. auto-complete.
- lessons-cs-e.js:814, :826, :891 — client GlideRecord / sync getReference / getXMLWait unsupported in Service Portal / Workspace;
  onSubmit can't wait for async answers.
- lessons-cs-e.js:932 — what getReference's callback receives for an empty reference.
- lessons-cs-e.js:1003 — phase 1 may be cached / phase 2 per request; $[ ] usage in OOB pages.
- lessons-cs-e.js:1116, :1147 — `response.sendRedirect()` in a UI Page Processing script.
- lessons-cs-e.js:1183 — macro attributes arrive as `${jvar_<attr>}`.
- lessons-cs-e.js:1192, :1193, :1248 — UI Formatters render macros on forms; Caller's `ref_contributions` attribute.
- lessons-cs-e.js:1199, :1240 — what Debug UI Macro shows on the page.
- Not ⚠️-marked but from docs/third party: SN Utils commands (snutils.com cheat sheet — "/help is the final truth" note in the
  card); UI Page form "Try It" button; g:evaluate assigns the LAST expression's value.

## REQUESTS (files I don't own)
1. **src/js/runScript.js** (server `runOnce`, line ~109): add `'window'` to the shadowed Function parameters (passed as
   undefined), like fetch / XMLHttpRequest. When the Web Worker can't start, ScriptRunner falls back to running on the page
   where `window` exists → `typeof window == 'undefined'` is false and the cs-ua3 server exercises (2, 4, 5, 6, 7) can never pass.
2. **src/data/glossary-cs.js** — `'setTitle()'` / `'render()'` (lines ~106–107) describe GlideDialogWindow only; cs-uipages now
   teaches GlideModal (same method names) → "GlideModal (leda paata GlideDialogWindow) pop-up ki title …". `'Syntax Editor'`
   (line ~113) lists "doc, for, info, method, vargr, vargror" — add ialogbr, ialogsi (pdi #19).
3. **src/components/JsLesson.jsx:17 / Exercises.jsx:9** still sort exercises by level (RANK). The brief says display = array
   order. My 14 lessons are monotonic, so either way is fine for them — FYI for whoever owns the UI.
4. **src/js/snowData.js** (low priority): INC0010005 is Resolved with active 'false' (a real Resolved incident is normally still
   active ⚠️), and INC0010006 has impact 2 / urgency 3 / priority 3 while her Data Lookup gives 2/3 → 4. Many exercises depend on
   the current rows, so change only with a full check-all run.
5. **CLAUDE.md** — Stage 3 row says 161 exercises (now 173); cs-ua* variants now live inline in lessons-cs-d.js (variants-cs-ua.js
   is an empty map); cs-ua5 is the g_list → GlideAjax → Script Include design.

## NOT DONE
- New quiz questions: by design (quiz-extra-cs-ui.js belongs to the quiz agent). My lessons keep 5 own questions each (15 with extras).
- Could not run the app / `npm run build` (npm broken here) — no JSX touched; data files load fine in all node checks.
- cs-crud2-8 can't force `updateMultiple()` over a loop (tests see only results); explain + hints steer to it.

## Final check output
```
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✔ check-cs: 26 lessons, 173 exercises, 0 problems
✔ check-quiz: All quiz checks OK            (Stage 3: 26 lessons, 390 questions, right answer longest in 15%)
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✔ check-glossary: OK — 203 glossary terms cover all Stage 2 + Stage 3 card terms and method calls
✔ check-page-terms: OK — lesson glossary matching passes all checks
All checks passed
wrong-solution harness: wrong-d.mjs (43) + wrong-e.mjs (36) — all wrong solutions fail
```
