# review-S1-GUIDED — Stage 1 guided mock lessons + mock engine/UI

Files edited (only my own): src/data/lessons-a.js, lessons-b.js, lessons-c.js, src/data/tips.js, src/engine/ops.js, src/engine/schema.js,
src/components/RecordForm.jsx, AdminPages.jsx, FilterBuilder.jsx, InfoPages.jsx, Header.jsx, Pages.jsx, SlushBucket.jsx (comment only).
Not touched: RecordList.jsx, Navigator.jsx (no change needed). Backups of the originals: SCRATCH\s1-orig\.

## DONE
1. PDI inactivity (lessons-a.js:20-21, quiz :28-29, InfoPages.jsx:74): hibernate after a few hours idle (data safe, "Wake up") vs reclaim + wipe
   after ~10 days without login, with the "⚠️ exact policy developer portal lo chudu" caveat. Quiz right answer is now the reclaim/wipe risk.
2. OR logic: ops.evalTerms now = encoded-query meaning — `^` AND, `^OR` joins the PREVIOUS condition (A^B^ORC = A AND (B OR C)), `^NQ` = New
   Criteria (separate set, OR'ed). toEncoded/fromEncoded handle ^NQ; breadcrumb = "All > A > B .or. C". FilterBuilder: toolbar "AND" (fb-add),
   "OR" (fb-or, joins the last condition, starts on the same field), "New Criteria" link (fb-nq); OR rows indented, NQ separator.
   Incident State now stored as the PDI values (1 New, 2 In Progress, 3 On Hold, 6 Resolved, 7 Closed, 8 Canceled) → encoded `state=2`;
   DONE / Resolve / Home count / "Resolved" module filter (state=6) updated. Module filters re-checked (engine-check: all give the intended rows).
   table-filters lesson: setup() adds INC0010007 (P1, Network, New) so the OR step really changes rows: 7 → 2 → 1 → 2 (verified in the harness);
   texts explain Priority 1 AND (In Progress OR Network) and why INC0010002 (Network, P2) is not in it; encoded query priority=1^state=2^ORcategory=network.
3. Insert / Insert and Stay: shown only on EXISTING records of non-task tables (incident has `task: true`; ops.isTaskTable follows extends);
   they COPY the open record (new sys_id + number, original unchanged; ops.copyValues). save-submit lesson reworked on Training Request
   (custom, non-task): Save → Update → open Kubernetes → change to Terraform → Insert and Stay (copy TRQ0000005, original intact — verified) →
   Submit. Quiz :79 now about copy semantics. (No setup needed — the lesson copies the record it just created.)
4. Process Flow: new sys_process_flow table (Table, Label, Order, Active, Condition) + module System UI → Process Flow (seed has 0 records,
   like her PDI). Formatter is display-only (spans, no onClick); current stage = first stage by Order whose Condition matches the SAVED record
   (new record: values at load). process-flow lesson rewritten (32 steps, setup seeds New/On Hold/Resolved/Closed): create "In Progress"
   (Order 200, State is In Progress) → add formatter → change State → highlight stays → Save → highlight moves (verified). Quiz why fixed; tips.flow.
5. Form Layout splits: layouts use '.begin_split' / '.split' / '.end_split'; slushbucket shows |- begin_split -|, |- split -|, |- end_split -|
   (repeatable); RecordForm renders any number of split areas. Lesson text + quiz (lessons-b.js:28,32).
6. Update Sets: "Mark as Complete" removed; lesson = State Complete + Update → reopen → Export to XML (related link shown only when the saved
   State is Complete; Make This My Current Set only while In progress). Added info steps: Retrieved Update Sets → Import from XML → Preview →
   Commit, and Back Out. "pettakudadu" fixed. tips.curSet reworded for Next Experience (globe picker, ⚠️); Header globe tip key language → scopePicker.
7. Child tables: sys_db_object has "Extensible" (is_extendable); "Extends table" only offers / accepts extensible tables (error otherwise).
   Lesson now: Training Request form → ☰ Configure → Table → tick Extensible → Update → create Online Training. Dictionary override path is now the
   PDI one: inherited column in the child's dictionary opens the PARENT entry → "Dictionary Overrides" related list → New → Table = child →
   Override default value = ongoing. (Override form also edits existing overrides.)
8. Priority lookup kept (3/3 → 4); data-lookup "change to 5" step unchanged. Category 'Inquiry'. Module "Assignment" (System Policy); lesson
   filters "assignment" + 1 info step.
9. Smaller: new tables get sys_id/sys_created_on/by/sys_updated_on/by/sys_mod_count (+ Number); Columns tab text fixed; Prefix field on the
   Table form (lesson types TRQ → consistent TRQ everywhere; schema help text no longer says TRA); info steps for Choices related list
   (lessons-a.js:185) and module Filter = condition builder (lessons-b.js:212); form-design mentions Form Layout / Form Design / Form Builder
   inactive; data-policies says Data Policy = Mandatory/Read only only (no hide, no scripts) and applies to imports / web services.
   Mock fidelity extras from pdi-facts: comments label "Additional comments"; close_code choices = her PDI value/label pairs;
   Data Policy error text "The following fields are mandatory: X" (⚠️).
10. Quiz fixes: give-aways lessons-a.js:29,127, lessons-b.js:128, lessons-c.js:46 rewritten; update-sets Q1 (was 2.5x longer) fixed; also
   child-tables Q3 and data-lookup Q1/Q2 got plausible distractors. My 71 questions: right answer longest in 32% (stage total 24%). No new questions.
11. Pre-existing bug fixed: after "New" in a related list + Submit, the parent form now reopens on that related-list tab (ui-policies step 21
   pointed at a list that was not rendered — confirmed failing with the ORIGINAL files too).

Lessons whose steps changed: account (text), table-creation (+Prefix step, +Choices info), form-design (text), views (fb-add text),
process-flow (rewritten + setup), menus-modules (+1 info), table-filters (setup, values, texts), save-submit (reworked), child-tables (reworked,
start = Training Request form), data-lookup (+1 info, assignment module), update-sets (reworked ending), ui-policies (fb-add text),
data-policies (texts). Unchanged steps: user-admin, ui-tour, products, architecture, dictionary.
data-tour ids — new: mod-system-ui-process-flow, mod-system-policy-assignment (replaces mod-system-policy-assignment-rules), f-is_extendable,
f-number_prefix, ov-list, ov-new, ov-grid, ov-table, fb-nq, flow-<label> (now non-clickable spans). Removed: us-complete. Kept: fb-add / fb-or
(labels now AND / OR), menu-insert / menu-insert-stay (label "Insert and Stay"), us-export, us-make-current.

Verification without a browser: SCRATCH\s1-tools\ — build-sim.mjs bundles a snapshot of src (esbuild from scratch tk; JsLesson + theme stubbed),
dom-shim.mjs is a small DOM for React 18, play.mjs is a port of dev-tools/test-driver.js (`node build-sim.mjs && node play.mjs [-v] [ids]`).
Result: all 18 Stage 1 lessons play to the quiz, no missing targets, no stuck steps, no React warnings. engine-check.mjs covers filters /
encoding / extensible / sys fields / copy / process flow. jsx-check-s1.mjs = the parent's compile check with a private outdir.

## FLAGGED FOR PDI CHECK (text carries ⚠️ unless noted)
- lessons-a.js:20 — admin password can be reset from the developer portal (instance options).
- lessons-a.js:21, InfoPages.jsx:74, quiz :28 — hibernate after a few hours / reclaim after ~10 days (community sources, per pdi-facts).
- lessons-a.js:170, schema.js:130,138, lessons-c.js:105 — "Extensible", "Auto-number", "Prefix" live in the Table form's "Controls" tab (mock keeps them in the main section).
- lessons-a.js:185, tips.js:92 — real choices are added in the column's "Choices" related list after the column is saved.
- lessons-b.js:20 — ☰ → Configure has "Form Layout" and "Form Design".
- lessons-b.js:180, RecordForm.jsx renderFlow — the Process Flow formatter only changes after save/reload (not live while editing State).
- lessons-c.js:30 — real list filter starts with an empty condition row and has AND / OR buttons on each row; mock uses toolbar AND / OR + New Criteria.
- lessons-c.js:68 — new-record ☰ menu has no Insert / Insert and Stay (they only show on existing records).
- lessons-c.js:208 — where "Back Out" appears (local vs retrieved update set).
- lessons-c.js:287, ops.js:344 — Data Policy error text "Data Policy Exception: The following fields are mandatory: Description".
- tips.js:42,60, Header.jsx:46 — Next Experience globe icon = application scope & update set picker.
- No ⚠️ in text (mock look only): breadcrumb ".or." (ops.js:268); "Export to XML" related link appears only when the set is Complete and
  "Make This My Current Set" only while In progress (RecordForm.jsx:519-526); Process Flow formatter offered only on task tables (AdminPages FormLayout).

## REQUESTS (files I do not own)
- src/styles.css (owner?): add `.bubble-text { white-space: pre-line; }` — tour bubbles with "\n•" bullet lists (lessons-a.js:21,
  lessons-c.js:85) currently render the bullets inline.
- CLAUDE.md: note the new Stage 1 mock conventions — incident State stored as values (1/2/3/6/7/8); layouts use .begin_split/.split/.end_split;
  condition terms = encoded-query meaning (AND, ^OR joins previous, ^NQ New Criteria); `task: true` tables hide Insert / Insert and Stay;
  Process Flow = sys_process_flow records (lessons seed them in `setup`); "Extensible" gates "Extends table".
- src/data/incidents.js and src/data/nav.js look unused (no imports) and still say "Inquiry / Help" — delete or update.
- Optional: the node auto-play harness (SCRATCH\s1-tools) could become a dev-tool once npm works (needs react, react-dom + esbuild).

## NOT DONE
- Retrieved Update Sets stays a "soon" placeholder module; Preview / Commit / Back Out are info steps only (brief asked for short steps/info).
- The Table form "Controls" tab and the real condition builder's per-row AND/OR + initial empty row are not modelled (flagged in the text).
- Completing the CURRENT update set does not switch the banner back to Default — real behaviour unverified, so left as before.
- No browser run (none available); the node harness above replaces it for target/flow checking only (no layout/visual check).

## Final check output
```
node dev-tools/check-all.mjs
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✔ check-cs: 26 lessons, 173 exercises, 0 problems
✔ check-quiz: All quiz checks OK          (Stage 1: 18 lessons, 172 questions, right answer longest in 24%)
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✔ check-glossary: OK — 203 glossary terms cover all Stage 2 + Stage 3 card terms and method calls
✔ check-page-terms: OK — lesson glossary matching passes all checks
All checks passed

node s1-tools/play.mjs  → all 18 lessons played to the quiz (account … data-policies ✔)
node s1-tools/jsx-check-s1.mjs → JSX check OK (whole import graph compiles)
node s1-tools/engine-check.mjs → engine checks OK
```
