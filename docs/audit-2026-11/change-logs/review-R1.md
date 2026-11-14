# review-R1 — Stage 1 ⚠️ pass against verify-round2.md

Files edited: src/data/lessons-a.js, lessons-b.js, lessons-c.js, tips.js, exercises.js, quiz-extra-s1.js.
InfoPages.jsx NOT touched (its only ⚠️ is the ⏸ hibernate/reclaim line), so jsx-check was not needed.
No exercise ids changed or removed; no git commands run.

## DONE

### ❌ Contradicted → fixed
- **#5 Process Flow formatter** (custom table / incident needs its own sys_ui_formatter record):
  - exercises.js:331-341 (process-flow-2): hint rewritten; stage steps now fill Name + Label (:334-335); NEW step :336
    "System UI → Formatters → New: Name Process Flow, Formatter process_flow.xml, Table Practice Task, Type Formatter";
    removed the ⚠️ "formatter offered for custom table?"; answer :340 lists the 3 pieces; cleanup :341 now in order:
    remove from Form Layout → delete the formatter record → delete the 3 stage records.
  - exercises.js:317-326 (process-flow-1, read-only): the old step "incident Form Layout HAS Process Flow" was wrong —
    replaced by a look at System UI → Formatters (process_flow.xml rows: problem, change_request, problem_task…) and a check
    that incident's Form Layout only offers it if a formatter row exists; fields list now Name, Label, Table, Order,
    Condition, Active, Description; answer = 3 pieces.
  - exercises.js:673 + :676 (Final cleanup): delete the Practice Task formatter record (before the tables are deleted);
    also any incident formatter / stages she made in her PDI copying the mock lesson.
  - lessons-b.js:172 NEW info step (target fl-left) before the mock's Form Layout step: in her PDI the formatter record
    is needed first (exact fields), mock already has one for incident. :184 final info + :187 quiz why mention it.
  - tips.js:85 (flow.real); quiz-extra-s1.js:96 (why) and :98 (question reworded: "incident ki Formatter record create
    chesi … add chesav — stages levu" so the premise is possible; why mentions Formatters record).
- **Data Policy did NOT block a Background Script insert** — text that implied it did is fixed:
  - quiz-extra-s1.js:85 why ("Server lo kuda aapali ante Data Policy / Business Rule" → Data Policy didn't stop the
    script insert; Business Rule needed), :174 why (removed "Server lo kuda enforce avtundi"; now: form won't save,
    policy applies to import sets + SOAP, Background Script insert not blocked), :177 why ("Anni channels" → import sets /
    SOAP; scripts not blocked).
  - lessons-c.js:263 (Data Policies intro) and exercises.js:650 (data-policies-1 answer): one-line note "Background
    Script / GlideRecord insert ni Data Policy aapadu (nee PDI lo test chesindi)".
- **#8 Form Builder**: lessons-b.js:20 ("Form Builder module active ga ledu" → Form Builder, Form Design, Form Layout all
  in ☰ → Configure; only the navigator module is inactive); ⚠️ removed. lessons-b.js:37 quiz why.
- #4 Field Watcher / #2 macros: not mentioned anywhere in Stage 1 files (nothing to fix). "Enable Field Watcher" now
  appears correctly in the form ☰ lists (tips.js:75, exercises.js:106).

### ✅ Verified → ⚠️ removed (statement kept / sharpened)
- Controls tab: lessons-a.js:170 (Auto-number Prefix/Number/Maximum digits), lessons-c.js:105 (Extensible),
  exercises.js:185 (+ "Create access controls", "User role", u_<table>_user pattern).
- Choices related list: lessons-a.js:185, tips.js:92 (+ label right-click "Configure Choices"); lessons-a.js:197 quiz why
  "Choices tab" → dictionary entry "Choices" related list.
- Globe icon / scope + update set picker: tips.js:42, tips.js:60, exercises.js:569 (update-sets-1 step), lessons-c.js:185
  (new note "Application scope: Global", "Update set: Default [Global]").
- Back Out location: lessons-c.js:208 — UI action on the Local Update Set (sys_update_set), not the Retrieved one.
- Assignment rules: exercises.js:541-542 (tabs "Applies To" → Conditions, "Assign To" → Group / User; Order field),
  :546 answer (preset group not overwritten; lowest Order wins 100 vs 200); quiz-extra-s1.js:149, :150 (why sharpened
  to exactly what was tested); lessons-c.js:161 (PDI labels note), :168 (both facts added).
- Priority default 4 with Data Lookup inactive: exercises.js:559.
- Dictionary Read only = form-only: quiz-extra-s1.js:89 (tested on incident.reopened_by), exercises.js:311 (sharpened).
- Verified-but-⚠️-styled warnings re-labelled "Gamaninchu:" so ⚠️ keeps meaning "unverified": lessons-b.js:159
  (incident has 0 process-flow records), lessons-c.js:75 (Insert hidden on task tables; incident has "Copy Incident").
- Final cleanup roles: exercises.js:681 (⚠️ "role perlu" removed — u_<table>_user verified).

### ➕ New facts added where they fit
- #8 form ☰ menu: tips.js:75 (fMenu.real), exercises.js:106 (ui-tour-2 step lists the exact menu).
- #9 label right-click menu: lessons-b.js:100 (dictionary lesson), exercises.js:285 (dictionary-1 hint), tips.js:92.
- #12 header / avatar: exercises.js:23 (All, Favorites, History, Workspaces, Admin, globe, avatar), quiz-extra-s1.js:34,
  tips.js:119 (avatar menu incl. Elevate role), exercises.js:679 (Elevate role is in the avatar menu — verified; the
  "is elevation needed" part keeps its ⚠️).
- #13 incident form: lessons-a.js:91 (Priority read-only via Data Lookup UI Policy), :94 (tabs Notes / Related Records /
  Resolution Information), exercises.js:107 + :110 (ui-tour-2 step + answer).
- INC0010005 seed change: no Stage 1 file mentions INC0010005 / a Resolved practice incident — nothing to change.

## FLAGGED FOR PDI CHECK (⚠️ left in place — all ⏸ in verify-round2 or not covered by it)
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

## REQUESTS (files I don't own — optional)
- src/components/AdminPages.jsx (FormLayout): the mock offers "Process Flow" on every task table; her PDI offers it only on
  tables with a sys_ui_formatter (process_flow.xml) record. The lessons now explain this in text, so no change is required;
  if the mock is touched, model sys_ui_formatter or show a hint.
- src/engine/schema.js:398 (Stage 1 simulator data) still has INC0010005 as Resolved (state 6). It is a separate data set
  from snowData.js and no Stage 1 text depends on it — FYI only.

## NOT DONE
- Nothing from the task list. (Unrelated: check-cs currently fails on cs-ajax2-5 — Stage 3, another agent's file.)

## Final check output
```
$ node dev-tools/check-exercises.mjs
54 exercises, 0 problems. Lessons without exercises: none
$ node dev-tools/check-quiz.mjs
Stage 1: 18 lessons, 172 questions, right answer longest in 24%
Stage 2: 8 lessons, 160 questions, right answer longest in 16%
Stage 3: 26 lessons, 390 questions, right answer longest in 15%
All quiz checks OK
$ node dev-tools/check-all.mjs  (FYI)
✔ check-mock, check-js, check-quiz, check-exercises, check-glossary, check-page-terms
✘ check-cs: FAIL cs-ajax2-5 (Stage 3, not mine)
```
