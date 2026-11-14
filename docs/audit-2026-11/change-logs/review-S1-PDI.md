# review-S1-PDI — Stage 1 real-PDI exercises (src/data/exercises.js)

Only file edited: `src/data/exercises.js`. 54 exercises, same 54 ids (none renumbered, none added or deleted).
The array is now grouped by lesson in course order. Inside each lesson the cards are in the order she should do them
(Exercises.jsx already shows them in array order via `exercisesFor`).

## DONE
- **Order + dependency chains** (54/54 checked):
  - views: 1 → 3 → 2 (the View Rule exercise is now last). menus-modules: 2 → 1 → 3 → 4. table-filters: 1, 3, 5 (easy) → 2, 4 (medium) → 6 (hard).
  - Levels now go up along the order. child-tables-1 hard→medium, data-policies-1 hard→medium, process-flow-1 is now an easy read-only exercise.
  - Rule for shared items: hari.test, Practice Team, Practice Task / Practice Child, Practice menu, auto-created roles and practice_view are
    deleted only in table-creation-4 (Final cleanup). Every earlier cleanup for them now says "keep it" and names the exercise that needs it.
  - Fixed cleanups that deleted things a later exercise needed:
    - user-admin-1, 2 and 4 deleted hari.test / Practice Team, which user-admin-2…4, menus-modules-4 and data-lookup-2 need.
    - views-1 and views-2 deleted practice_view, which views-2 and views-3 need.
    - menus-modules-1 deleted My Tools, which menus-modules-3 and 4 need.
    - dictionary-2's cleanup removed the "Untitled" default that child-tables-3 expected.
  - views-2 now deletes its View Rule straight away. Otherwise every later Done = true record opens in Practice View (Topic only), which
    breaks the UI Policy exercises.
  - Added "Prerequisite: …" notes, naming exercises by title (no "exercise N"). user-admin-4 now ends with Hari back in Practice Team
    (itil inherited), which is the state menus-modules-4 needs.
- **Accuracy vs pdi-facts**:
  - dictionary-1: dictionary Mandatory is enforced on forms only; scripts and imports can still save an empty value. This now matches
    dictionary-3.
  - ui-policies-1: "mandatory wins". She fills Short description first; a bonus step shows that an empty field stays editable.
  - Caller is filled in every incident Submit: menus-modules-2, save-submit-1, data-lookup-2, data-policies-1. Exercises that never need
    a save (data-lookup-1/3, ui-policies-1, menus-modules-3, ui-tour-3) now say "Submit cheyyakunda close chey".
  - user-admin-1: the "Password set chey" step is gone. It now says no password is needed and mentions the "Set Password" button.
  - update-sets-1/2: "Mark as Complete" replaced by State = Complete → Update. Switching back uses Default → "Make This My Current Set".
  - save-submit-2: rewritten on a Practice Task record (table-creation-1 now says leave "Extends table" empty, so it is not a task table).
    She edits Topic and then uses Insert / Insert and Stay, so it is visible that the original does not change. Cleanup deletes the 2 copies.
    It also explains glide.ui.task.insert.
  - save-submit-1: Save on an existing record. It edits Description instead of Urgency, so the OOB "Worknotes mandatory onChange of
    priority" script cannot interfere.
  - process-flow-2: rebuilt as 3 sys_process_flow records (Table, Label, Order, Condition: Level is Easy/Medium/Hard) plus the formatter.
    Cleanup deletes both.
  - process-flow-1 was also wrong: incident has 0 process-flow records, the formatter is display-only and clicking a stage does not change
    State. It is now a read-only exercise (System UI → Process Flow, look at the fields, see the formatter in Form Layout without saving).
    Its cleanup removes the formatter from the incident form if she added it with the old version.
  - Assignment rules: "System Policy → Assignment" module.
  - Form Layout split items: |- begin_split -| / |- split -| / |- end_split -| (new bonus in form-design-1).
  - Category label "Inquiry".
  - data-lookup-1 opens dl_u_priority.list and checks 1/1 → 1 - Critical and 3/3 → 4 - Low (pdi-facts #12). It also mentions the
    read-only Priority UI Policy.
  - data-lookup-2 assigns to Practice Team (her own group), so the result can only come from her rule. Rule name "Network incidents".
  - Removed the claim that Data Policies apply to server *scripts* (not verified). They are now described as covering form, list edit,
    import sets and web services.
- **child-tables-3**: the override's Table must be **Practice Child** (stated as the key step). The scenario now says the parent has no
  default, so the parent form's Topic is empty and the child's is "Child default". Cleanup deletes the override.
- **Final cleanup (table-creation-4)** rewritten, 13 ordered steps:
  - update sets Complete and Default made current;
  - OOB safety checks (Priority Data Lookup Active = true, incident Process Flow formatter);
  - every UI / Data Policy by name;
  - Assignment rule "Network incidents" (and "Database incidents" only if she copied the simulator into her PDI);
  - View Rule, Process Flow records, saved filters (sys_filter.list);
  - Practice / My Tools / Demo menus with their modules;
  - tables child first, then parent (with a security_admin elevate fallback);
  - practice_view, auto-created u_practice_* roles, Practice Team, hari.test, leftover test incidents;
  - a final navigator check.
  - The scenario says in capitals that it is the LAST Stage 1 task.
- **Form sections (form-design-2)**: the section is created from Form Layout → Section → "New..." so it is attached to the form.
  The answer explains that a record created directly in Form Sections is not attached.
- **ui-tour-4**: personal changes only. It adds Impact (Priority is already in the list) with the ⚙ gear, then sort and group by.
  Cleanup resets group by and columns. The hint warns that List Layout is global and not to touch it.
- **views-3**: uses ☰ → Configure → List Layout with the view selected (the old step wrongly said ⚙), with a fallback URL
  `u_practice_task_list.do?sysparm_view=practice_view`.
- account-2: hibernate after a few hours (data safe) vs reclaim after about 10 days (data gone).
- products-1: Docs / Community / Learning site URLs updated.
- architecture-1: "Brazil".
- menus-modules-4: explains that module roles only hide navigation; ACLs protect the data.

## FLAGGED FOR PDI CHECK
Text already carries "⚠️ PDI lo confirm chesuko" unless marked (no ⚠️).
- exercises.js:26 — hibernate after "konni gantalu", reclaimed after about 10 days (community sources).
- exercises.js:132 — un-grouping a list: list title ☰ → Group By → "-- None --" or a right-click "Ungroup". Also the
  "Reset to column defaults" label in Personalize List Columns.
- exercises.js:142 — learning site is now "ServiceNow University" at learning.servicenow.com (browser check, not PDI).
- exercises.js:184 (no ⚠️, worded "undochu") — table form Controls tab: "Create access controls" + "User role" u_practice_task_user
  auto-created for a global-scope table.
- exercises.js:225 — deleting a table may need security_admin elevation because of its auto-created ACLs.
- exercises.js:227 — names of the auto-created roles (u_practice_task_user, u_practice_child_user?).
- exercises.js:232 — does deleting a table also delete its ACLs, form sections and list layouts?
- exercises.js:253 — Form Layout "Section" dropdown has "New..." (name prompt).
- exercises.js:257 (no ⚠️) — a sys_ui_section record created directly in System UI → Form Sections is not attached to the form.
- exercises.js:268, 281 (no ⚠️, fallback URL given) — Form Layout / List Layout "View name" dropdown lists the new view. The list ☰ →
  View submenu shows "Practice View" once a layout exists.
- exercises.js:295 (no ⚠️) — the View Rule applies when the record is opened from the list (sysparm_view in the URL).
- exercises.js:352 (no ⚠️) — sys_process_flow may also have a "Name" field.
- exercises.js:354 — the "Process Flow" formatter is offered in Form Layout for a custom non-task table.
- exercises.js:357 — the process-flow highlight changes only after save / reload.
- exercises.js:446 — load a saved filter from list title ☰ → Filters → name. Saved filters live in sys_filter.
- exercises.js:457 (no ⚠️, fallback given) — condition builder ">" expander vs "Show Related Fields" for dot-walking.
- exercises.js:495-496 (no ⚠️) — Insert goes back to the list; Insert and Stay stays on the new record. (Copy behaviour is verified in
  pdi-facts #13; the navigation is not.)
- exercises.js:522 (no ⚠️) — sys_class_name label on a custom table is "Class".
- exercises.js:557-559 — assignment rule form: Order field, Conditions, "Assign To" tab / Group field labels.
- exercises.js:563 — lowest Order wins; rules run only when the task is unassigned.
- exercises.js:576 — with Priority Data Lookup inactive, Priority stays "4 - Low" on a new incident.
- exercises.js:586 — update set picker (globe icon) in the Next Experience header.
- exercises.js:617 — a UI Policy "Read only" action is also ignored on an empty mandatory field (verified for g_form.setReadOnly,
  pdi-facts #32).
- exercises.js:652 — conflicting UI policies: the higher Order runs last and wins. The exercise itself tests this.
- exercises.js:667 — exact "Data Policy Exception…" message text.
- exercises.js:676 (no ⚠️; this is the exercise's own test) — UI Policies do not run in list edit; Data Policies do.

## REQUESTS (files I don't own)
- src/data/lessons-b.js:28, :32 — "--split--" / "--end_split--" → Brazil shows `|- begin_split -|`, `|- split -|`, `|- end_split -|`
  (pdi-facts #20).
- src/data/lessons-b.js:139-151, :156 (process-flow simulator):
  - Adding the formatter to incident does not produce a New → In Progress… bar in her PDI; incident has 0 sys_process_flow records.
  - Clicking a stage does not change State; the formatter is display-only (pdi-facts #14).
  - Each stage is a sys_process_flow record (Table, Label, Order, Condition), so "State field meeda adharapadi" is misleading.
  - The exercises now teach this.
- src/data/lessons-c.js:181-182 — "Mark as Complete" does not exist; it should be State = Complete → Update (pdi-facts #21).
- src/data/lessons-c.js:263 — "Data Policy Exception: Description is mandatory" wording is unverified; add ⚠️ or make it generic.
- Optional, Exercises.jsx / Hub owner: the Final cleanup card (id table-creation-4, so it must stay in the Table Creation lesson) is easy
  to do too early. Consider a small note or link to it at the end of the Stage 1 fold (e.g. under Data Policies).
- (lessons-a.js account hibernate text was already fixed by its owner — no request.)

## NOT DONE
- No ⚠️ item could be verified: I have no PDI or browser access in this task, and npm/app can't run here. Exercises are data-only and
  check-exercises passes.
- I did not move Final cleanup to the last lesson. Its id `table-creation-4` is stored in progress, so its lessonId can't change.
  Mitigated by the scenario wording and the optional UI request above.

## Final check output
```
$ node dev-tools/check-exercises.mjs
54 exercises, 0 problems. Lessons without exercises: none

$ node dev-tools/check-all.mjs   (summary — failures are in other agents' files)
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✘ check-cs: 26 lessons, 161 exercises, 7 problems
✘ check-quiz: 71 problem(s)
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✘ check-glossary: 2 issue(s)
✔ check-page-terms: OK — lesson glossary matching passes all checks
```
