# review-Q-S3-UI — extra quiz questions for 14 Stage 3 lessons

File edited (only this one): `src/data/quiz-extra-cs-ui.js`

## DONE
- Added **140 questions, 10 per lesson** for cs-snutils, cs-crud1, cs-crud2, cs-debug, cs-macros, cs-best, cs-uipages,
  cs-uipages2, cs-uimacros, cs-ua1, cs-ua2, cs-ua3, cs-ua4, cs-ua5. Each lesson now has **15** (5 in the lesson file + 10 here).
- Format: `q(question, [4 options], 0, why)` — right answer listed first (same convention as quiz-extra-js.js; Quiz.jsx
  shuffles). Template literals; Jelly `${…}` escaped as `\${…}`. One line per question, 4 unique options, Tenglish `why`
  (all 40+ chars), no "all/none of the above", no Hindi words (scripted check).
- Length balance (scratch script `qui-stats.mjs`): right answer is the single longest option in **28/140 = 20%**, the single
  shortest in 25%; when it is longest the ratio vs the other options is ≤ 1.35 (check-quiz limit 1.6). None of my 140 is flagged.
- Scenario / practical, built on pdi-facts: initialize() null vs newRecord() defaults; insert() fills defaults; get() with one
  value; getValue '1'/'0'/null; misspelt field → ALL rows (read, delete-loop, log warning, vargr "name" placeholder);
  element-in-array; encoded query `A^B^ORC`; GlideAggregate string; updateMultiple; autoSysFields; update sets don't capture
  data; System Diagnostics vs System Definition modules; Syntax Editor Macro list (no while/help) and vargr `if (gr.next())`;
  mandatory-wins; ok_type="button" stops the Processing script / default submit; GlideModal vs deprecated GlideDialogWindow;
  Insert / Insert and Stay hidden on task tables; admin `gs.hasRole()` always true → impersonate; g_list.getChecked() string
  ('' when nothing selected → `''.split(',').length` is 1).
- Checked for overlap with the lesson files' own (current, just-edited) questions; replaced 3 of mine that came too close
  (cs-ua4 `== 'true'`, cs-ua3 "gsftSubmit submits the form", cs-debug "gs.info output → log").

## FLAGGED FOR PDI CHECK
Marked "⚠️ PDI lo confirm chesuko" in the `why` text (src/data/quiz-extra-cs-ui.js):
- :11 SN Utils `/tn` = toggle technical names (third-party extension; pdi-facts "not tested").
- :18 `incident.list` typed in the Next Experience All-menu filter opens the list (`.do` = new form).
- :61 Next Experience: classic form is in an iframe (gsft_main) → switch Console context to reach g_form.
- :83 getXMLWait freezes the browser and is classic-UI only (not Portal / Workspace).
- :87 onSubmit: `return false` inside a getXMLAnswer callback cannot stop the submit (async).
- :115 UI Page Processing script redirect = `response.sendRedirect(url)`.
- :117 `GlideModal.setPreference(name, value)` passes a value to the dialog page (how the page reads it not stated).
- :124 macro attribute `text="VIP"` is read as `${jvar_text}` inside the macro (from the brief, not PDI-tested).
- :125 a UI Macro is put on a form through a UI Formatter record + Form Layout.
- :126 Debug UI Macro shows macro names / boundaries on the page (module location IS verified, the output is not).
- :130 `ref_contributions=<macro>` dictionary attribute renders a macro next to a reference field.
- :146 UI Actions module = System Definition → UI Actions; form menu → Configure → UI Actions.
- :199 List choice server UI Action runs once per selected record with current = that record (lesson card says the same, ⚠️).

Not in pdi-facts but standard docs behaviour (no ⚠️ in text — confirm if convenient):
:14 `/bg` = Background Script · :55 gs.log / gs.print not allowed in scoped apps · :58 Script Tracer shows the scripts + field
changes of one transaction · :60 gs.error → Error level in Script Log · :70/:76 `$0` = cursor position after expansion ·
:73 `for` = array loop snippet, :74 `doc` = documentation comment block · :82 3rd argument of g_form.setValue (display value)
avoids a round trip · :85 Isolate script (strict mode) on new client scripts (lesson card states it from her PDI banner) ·
:97 Jelly phase 1 `${}` / phase 2 `$[]` (j2:/g2:) · :101 Jelly is XML (close `<br/>`, escape `&`) · :111 `<g:ui_form>` needed
for the post · :118 `gel()` = getElementById shortcut · :123 `<g:macro_invoke macro="…"/>` · :128 UI Macro code field label
"XML" · :140 Show insert meaning · :145 UI Actions on task show on incident · :166 client UI Action script also loads in the
browser (why the typeof-window guard is needed) · :180 Active untick hides a UI Action · :185 Hint = tooltip · :186 Order:
lower number first.

## REQUESTS (files I don't own)
**src/data/lessons-cs-e.js** (content that contradicts pdi-facts and now also contradicts the new quiz questions):
1. cs-crud1 card, line ~97: "initialize() empty record ready chestundi (defaults tho)" → wrong (pdi #7): initialize() = every
   field null, isNewRecord() false; defaults come at insert(), or immediately with newRecord(). (quiz Q6–Q8 teach pdi #7.)
2. cs-debug card, line ~417: "Script Debugger (System Definition → Script Debugger)" → **System Diagnostics** (pdi #18).
3. cs-snutils card lines ~30/33 and exercise cs-snutils-2 (lines ~61/63): "/tn <table> opens the table list" → per pdi-facts
   SN Utils `/tn` toggles technical names. Exercise 2 could use the native `incident.list` (+ ⚠️) instead.
4. cs-macros card lines ~480–488: list is "vargr, vargror, for, method, info, doc" (missing ialogbr, ialogsi) and the vargr
   sample shows `addQuery('', '')` + `while (gr.next())`; PDI vargr (pdi #19) = `var gr = new GlideRecord("$0");
   gr.addQuery("name", "value"); gr.query(); if (gr.next()) { }`. Lesson quiz Q3 / exercise cs-macros-2 ("help + Tab") —
   pdi #19: no "help" record, built-in help+Tab unverified → add ⚠️ to that why/exercise.
5. cs-uipages2 card lines ~751/757 (and exercise cs-uipages2-1, which pastes that code): `ok_type="button"` means the form
   never posts and the **Processing script never runs** (pdi #35) — the exercise cannot create the incident. Drop ok_type.
6. cs-uipages exercise 4 (lines ~728–730): GlideDialogWindow is deprecated; suggest `var gm = new GlideModal('snowkeer_hello');
   gm.setTitle('Hello'); gm.render();` (pdi #29: both exist).
7. Lesson-file quiz questions still failing check-quiz (right answer much longer). Ready-to-paste balanced options:
   - cs-snutils Q3: `['Column name (short_description)', 'Field label (Short description)', 'Record sys_id (32 characters)', 'Form view peru (Default view)']`
   - cs-debug Q2: `['System Logs → Script Log Statements', 'Browser F12 → Console tab lo', 'Form paina blue info message ga', 'Admin ki email notification ga']`
   - cs-debug Q3: `['Session Debug → Debug Business Rule', 'Client Scripts list lo jslog chudu', 'UI Policies list lo order chudu', 'Dictionary lo default value chudu']`
   - cs-best Q2: `['Upgrades / Workspace lo break avtundi', 'Browser lo chala slow ga run avtundi', 'ServiceNow licence ki against', 'Server lo kuda adhe code run avvadu']`
   - cs-uipages Q2: `['${gs.getUserDisplayName()} (Jelly)', 'g_form.getValue() (client)', 'current.getValue() (record)', 'g_user.getFullName() (client)']`
   - cs-uipages2 Q1: `['request.getParameter("name")', 'g_form.getValue("name")', 'current.getValue("name")', 'gs.getProperty("name")']`
   - cs-uipages2 Q2: `['ok="return validate()"', 'Processing script lo check', 'Before Business Rule lo', 'onSubmit Client Script lo']`
   - cs-uimacros Q2: `['<g:snowkeer_badge />', '<j:snowkeer_badge />', '<snowkeer_badge></snowkeer_badge>', 'gs.include("snowkeer_badge")']`
   (all answer index 0; each keeps the right option ≤ 1.3× the others.)
8. FYI (not quiz): check-cs currently reports `cs-best-5: starter already passes` (lessons-cs-e.js).

## NOT DONE
- Nothing from my task. I did not touch the lesson files (the 8 flagged lesson-file questions above are theirs).

## Final check output
`node dev-tools/check-quiz.mjs` (my 14 lessons + totals):
```
Stage 1: 18 lessons, 172 questions, right answer longest in 26%
Stage 2: 8 lessons, 160 questions, right answer longest in 20%
✗ cs-snutils Q3: right answer is much longer than the others (1.9x) — easy to guess      ← lesson file (Q1–Q5), not mine
✗ cs-debug Q2: right answer is much longer than the others (2.0x) — easy to guess        ← lesson file
✗ cs-debug Q3: right answer is much longer than the others (1.9x) — easy to guess        ← lesson file
✗ cs-best Q2: right answer is much longer than the others (1.9x) — easy to guess         ← lesson file
✗ cs-uipages Q2: right answer is much longer than the others (4.1x) — easy to guess      ← lesson file
✗ cs-uipages2 Q1: right answer is much longer than the others (2.5x) — easy to guess     ← lesson file
✗ cs-uipages2 Q2: right answer is much longer than the others (1.8x) — easy to guess     ← lesson file
✗ cs-uimacros Q2: right answer is much longer than the others (1.7x) — easy to guess     ← lesson file
Stage 3: 26 lessons, 390 questions, right answer longest in 25%
8 problem(s)
```
- No "N questions (Stage 3 needs 15+)" line for any of my 14 lessons (all = 15); none of Q6–Q15 flagged.
- `qui-stats.mjs`: `mine: 140 questions, right longest 28 (20%), right shortest 35 (25%) — no problems`.
- `check-all`: check-mock ✔, check-js ✔, check-exercises ✔, check-page-terms ✔; check-cs / check-glossary failures are in other
  agents' lessons (glform2, onchange, best-5 starter, onsubmit/gllist/gluser glossary) — nothing from quiz-extra-cs-ui.js.
