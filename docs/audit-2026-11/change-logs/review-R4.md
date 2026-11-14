# review-R4 — Stage 3 UI Actions / CRUD / debug / macros / UI Pages: verify-round2 applied

Files edited (mine only): src/data/lessons-cs-d.js, src/data/lessons-cs-e.js, src/data/glossary-cs-ui.js, src/data/quiz-extra-cs-ui.js.
src/data/variants-cs-ua.js: no change needed (all cs-ua* variants are inline). No exercise id added, removed or renumbered.
Line numbers below are AFTER my edits.

## DONE

### Seed change (INC0010005 now Closed/inactive, INC0010006 priority 4) — check-cs failures fixed
- lessons-cs-d.js:20-26 — comment updated; new `INC1_RESOLVED` seed (INC0010001 as a Resolved incident with Resolution code + notes).
- cs-ua4-5 (:673-674) — Resolved row is now INC0010022 (EXTRA): `[INC22, INC1, INC5] → [true, false, false]`; explain/label updated.
- cs-ua4-6 (:678-692) — current = INC0010022 (Resolved); variant = INC0010001 seeded Resolved. Task/explain/tests updated.
- cs-ua4-4 (:709-725) — current = INC0010022; variants: "already closed (INC0010005)" (base data, checks log + state 7 unchanged)
  and "vere Resolved incident (INC0010001)". Task/explain updated.
- cs-crud2-9 (lessons-cs-e.js:592-608) — INC0010005 is a 3rd Closed row: main expects "Deleting 3", total 7, plus a new test
  "INC0010005 (Closed) kuda poyindi"; variant renamed "8 Closed incidents", expects "Too many: 8 - stopped". Task/explain mention INC0010005.
- Tests that still passed but lost strength or had stale labels:
  - cs-ua1-5 (:151) / cs-ua1-7 (:183) — the Resolved case used INC0010005 (now Closed) so `state == '7'` alone passed;
    now INC0010022 (Resolved) + INC0010005 (Closed). Labels/explains updated.
  - cs-ua4-3 (:646, :655-657) — added `scenario: EXTRA` and INC0010022 (state 6) so `<= 6` fails again (boundary was lost).
  - cs-ua4-1 (:628-629) — label/explain: INC5 is Closed.
  - cs-ua4-2 (:641) — "INC6 … P3" → "P4".
  - cs-crud2-5 (lessons-cs-e.js:492-503) — `state = 7` alone passed; variant now seeds a Resolved (6, active) INC0009997 + Closed
    INC0009998 → 3 rows in number order (also catches a missing orderBy). Explain links to "Safe cleanup" (Resolved is still active).
  - Verified with a scratch script (scratchpad\r4-wrong.mjs): 19 wrong-but-plausible solutions on these exercises all FAIL,
    reference solutions pass.

### ❌ fixes
- #2 Syntax Editor Macros = Monaco, Ctrl+Space → pick → Enter (Tab only inserts a tab):
  lessons-cs-e.js:720 blurb; :725-727 learn card (Monaco in Background page + form Script fields, Tab = tab space, "video lo
  Tab = paata editor", `help` shows in Ctrl+Space, no ⚠️); :729 code block; :741-743 own-macro card; :758-760 editor card;
  quiz :765 (Q1 rewritten, "Tab" now a distractor), :767, :769; exercises cs-macros-1..4 (:772-798 — steps/answer/cleanup;
  cs-macros-1 now has her try Tab first and see it NOT expand; cs-macros-2 cleanup clears the editor after trying `help`).
  quiz-extra-cs-ui.js:69, :71, :73, :74, :75, :77 ("+ Tab" → Ctrl+Space → Enter); NEW :78 "vargr + Tab in her PDI → tab space only".
- #4 Field Watcher: lessons-cs-e.js:653-659 card rewritten (no module, not in Preferences; Preferences → Debugging = Script
  Debugger / ATF Page Inspector / Next Experience Developer Tools — "vere extension, install cheyyaku"; real place = classic form ☰ →
  "Enable Field Watcher"). cs-debug-5 (:674-678) — scenario/hint/new step: open ☰ and see "Enable Field Watcher" (read-only).
  glossary-cs-ui.js:44 'Field Watcher' rewritten (ex: "Incident form ☰ → Enable Field Watcher"; check stays for the panel part).
  NEW quiz-extra-cs-ui.js:62 "Field Watcher ekkada?" (Preferences / System Diagnostics as distractors).

### ➕ new facts used
- #6 Scripts - Background: lessons-cs-e.js:81-82 (Monaco, "Run Script", scope picker, "Record for rollback?" ticked, `*** Script:`;
  "undo ledu" → "rollback tick unna undo meeda aadharapadaku"), :125, :684, :769, :789 ("Run script" → "Run Script"), :1043
  (distractor label), :427 / :600 + glossary :13 deleteMultiple ("undo ledu" softened), glossary :39 'Scripts - Background',
  quiz-extra :15.
- #7 ES12 toggle: lessons-cs-e.js:760 (where it helps: Script Include / Business Rule per script; not in Background Scripts);
  NEW quiz-extra-cs-ui.js:79; glossary :39 (no toggle in Background Scripts).
- #8 form ☰ menu: lessons-cs-e.js:75 + :117 (Show XML without SN Utils), :654 (Show XML, Copy sys_id, Configure ▸ …),
  lessons-cs-d.js:603 (Form context menu = header right-click / ☰), quiz-extra :141, :149.
- #9 label right-click "Show - 'field'": lessons-cs-e.js:74. #10 empty getReference → callback with undefined fields:
  cs-best-7 explain :947 (⚠️ removed). #11 g_list not global / GlideList2.get / refresh(): lessons-cs-d.js:760, :829 (⚠️ removed).
  #12 avatar menu → Impersonate user: lessons-cs-d.js:582. #13 "Resolution Information" tab: lessons-cs-d.js:446.

### ✅ ⚠️ removed (statement kept)
- Resolved stays active, only Closed → inactive: cs-ua4-1 explain lessons-cs-d.js:628; cs-crud2-4 explain lessons-cs-e.js:550;
  quiz-extra :48 why (added the fact).
- 2nd insert() without initialize() → another record with the same values: lessons-cs-e.js:289 (number not claimed).
- `incident.list` in the All filter: lessons-cs-e.js:60; quiz-extra :18.
- gsft_main iframe: lessons-cs-e.js:630; quiz-extra :61.
- "Disable All" (System Diagnostics → Session Debug): lessons-cs-e.js:649, :704.
- `help` in Ctrl+Space: lessons-cs-e.js:727, cs-macros-2 hint :781.
- response.sendRedirect in OOB Processing scripts: lessons-cs-e.js:1131, :1162; glossary :28 (check removed); quiz-extra :118.
- ${jvar_<attr>} (OOB ui_reference): lessons-cs-e.js:1198; quiz-extra :127.
- Formatters (activity.xml / process_flow.xml records → Form Layout): lessons-cs-e.js:1207; quiz-extra :128.
- ref_contributions=user_show_incidents on Caller: lessons-cs-e.js:1208, :1263; glossary :36 (check removed); quiz-extra :133.
- GlideModal.setPreference exists: quiz-extra :120.
- UI Actions module (System Definition AND System UI): quiz-extra :149 — option "System UI → UI Actions" was ALSO correct, so it
  was replaced by "System Policy → UI Actions".
- OOB "Resolve" UI Action (resolveIncident(), resolve_incident, setValue state 6 + gsftSubmit): lessons-cs-d.js:454 (no hedge).
- Jelly: "227 OOB UI Pages use $[ ]" stated as seen (lessons-cs-e.js:1018); the ⚠️ moved to the unverified caching claim (:1017).

### ⏸ "Requires role" reworded (⚠️ kept, no location stated)
- lessons-cs-d.js:42, :582, quiz :612 (right answer is now `Condition lo gs.hasRole("itil")`), glossary :23 (check kept).

## FLAGGED FOR PDI CHECK (⚠️ that remain in my files)
- lessons-cs-d.js:63 — server UI Action: form values in `current` but nothing saved until current.update() (not in round 2).
- lessons-cs-d.js:42, :582, :612, glossary-cs-ui.js:23 — where UI Action roles live (field / related list on another view?).
- lessons-cs-d.js:605 — client UI Action "Isolate script" = strict mode like Client Scripts.
- lessons-cs-d.js:766, quiz-extra-cs-ui.js:202 — List choice server UI Action runs once per selected record (current = that row).
- lessons-cs-e.js:378, :578 — updateMultiple + direct assignment (gr.state = 2) may update the whole table (docs; don't test).
- lessons-cs-e.js:516 — deleteRecord() after a failed get() (don't test).
- lessons-cs-e.js:657 (NEW) — after "Enable Field Watcher": the field-label "watch" option and what the panel shows.
- lessons-cs-e.js:758 — Background Script toolbar buttons / shortcut keys. :759 — do gs. / gr. method suggestions appear.
- lessons-cs-e.js:829, :841, :906, quiz-extra :86 — client GlideRecord / sync getReference / getXMLWait unsupported in Service
  Portal / Workspace; :841, quiz-extra :90 — onSubmit can't wait for async answers / return false in a callback.
- lessons-cs-e.js:1017 — Jelly phase-1 result caching.
- lessons-cs-e.js:1214, :1255, quiz-extra :129 (why), glossary 'Debug UI Macro' — what Debug UI Macro shows on the page.
- quiz-extra-cs-ui.js:11 — SN Utils /tn (third-party). glossary 'Script Tracer' (check kept — what it traces).
- Low risk, no ⚠️ (docs / tips): "paata editor lo Tab tho expand ayyedi" (:726, quiz :765, :78); "Kotha macro list lo raakapothe
  page reload" tip (:767, cs-macros-4 step); setPreference "standard method" (quiz :120); formatter field value = UI macro name
  with .xml (:1207).

## REQUESTS (files I don't own)
- src/data/glossary-cs.js:113 'Syntax Editor' — ex says `"vargr" + Tab`; in her Brazil PDI it is `vargr → Ctrl+Space → Enter`
  (Monaco; Tab only inserts a tab).
- src/data/lessons-js.js:86 and :89 — button label is "Run Script" (capital S) on the Scripts - Background page (verify-round2 #6).

## NOT DONE
- Nothing from my brief left open.

## Final check output (node dev-tools/check-all.mjs, after my last edit)
```
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✔ check-cs: 26 lessons, 173 exercises, 0 problems
✔ check-quiz: All quiz checks OK            (Stage 3: 26 lessons, 393 questions, right answer longest in 15%)
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✔ check-glossary: OK — 204 glossary terms cover all Stage 2 + Stage 3 card terms and method calls
✔ check-page-terms: OK — lesson glossary matching passes all checks
All checks passed
```
