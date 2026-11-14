# review-S3-CLIENT — Stage 3 client lessons (cs-gluser … cs-oncell)

Files edited (mine only): src/data/lessons-cs.js (gluser + glform objects and top helpers only — imports and the CS_LESSONS
merge block untouched), src/data/lessons-cs-b.js, src/data/lessons-cs-c.js, src/data/variants-cs.js, src/data/glossary-cs.js.
Backups of the originals: SCRATCH\s3client-orig\. Wrong-solution test script: SCRATCH\s3client-wrong.mjs (50 wrong-but-plausible
solutions, all fail).

## DONE
1. **Revert + re-fire guard.** cs-usecases-7 now teaches `if (newValue == oldValue) return;` (task, starter step, 3 hints, solution,
   explain: "guard lekunda Run chesi Script Log chudu — confirm RENDU sarlu"); its test checks the confirm is asked once. Guard also added
   to cs-client-6, cs-client-4, cs-usecases-6, cs-usecases-4. lessons-cs-b.js cs-client-4 explain fixed (the GUARD / `newValue != '6'`
   stops the loop, not "the oldValue check"). New variant cs-usecases-4 "form already Closed → Closed again" (7→7) fails without the
   guard; cs-client-4 test still requires one error only. Learn cards: cs-client "onChange parameters & guard" + new cs-usecases card
   "Revert + confirm — onChange malli fire avtundi" (incl. when NOT to use the guard: hide / restore logic on return to the load value).
2. **oldValue = value at form load** (⚠️ flagged): cs-client card (b.js:379), cs-client-5 explain, cs-usecases-6 hint/explain,
   glossary onChange. Scenario form values now hold the load value (= trigger.oldValue) so the interactive form matches.
3. **onSubmit + GlideAjax:** aside fixed ("EPPUDU kaadu" — never), new learn card (verdict taken at return; safe pattern 1 = validate
   in onChange → g_scratchpad; pattern 2 = return false + g_form.getActionName() + callback g_form.submit(action) + flag against the
   re-run loop; getXMLWait = sync, classic UI only, freezes). New exercise **cs-onsubmit-8** "Duplicate check (GlideAjax + malli submit)"
   (DupCheckAjax Script Include in scenario). Tests: __submit, __x.ajaxCalls (+ sysparm_short), error text, __x.formSubmits,
   __x.syncAjax = 0; variants: no duplicate + actionName sysverb_update (must submit('sysverb_update')), round 2 (flag true → save,
   no Ajax). Fails for: return false inside callback, getXMLWait version, hardcoded 'sysverb_insert', no flag check.
4. **New fields:** cs-glform2-5/6/7/4 + card code moved to close_notes ("Resolution notes"); cs-onchange-3 moved to hold_reason and
   reworked to "On Hold → show + mandatory, else mandatory OFF then hide" (teaches PDI "mandatory wins"; wrong order fails the
   variant). OOB pointers: Data Policy "Make close info mandatory when resolved or closed", UI Policy (On hold reason), "Highlight VIP
   Caller", "Empty assigned_to on group change", "Resolution details visibility on state", "(BP) Close Mandatory on Close or Resolve",
   "Worknotes mandatory onChange of priority", "Priority is managed by Data Lookup", Caller-mandatory rule — plus a new cs-onchange card
   "Nee PDI lo OOB onChange scripts — chadivi nerchuko" (read-only).
5. **GlideAjax facts:** "Glide AJAX enabled" label (ajax1 card + quiz + glossary). getParameter → String(): ajax2 card 1 + new card
   "getParameter() → String()" + new exercise **cs-ajax2-8** "Param ni String() lo wrap chey (===)" (fails without String()). All
   scenario/solution Script Includes wrap params. Coordinator extra task: cs-ajax2 `getName` → **getUserName** (card code, cs-ajax2-1
   title/task/starter/solution/test) + card line on why (process() runs this[this.getName()]; never define getName / getValue / getType /
   getParameter; "_" names are private) — pdi-facts #36; the ⚠️ on the String() advice was removed (now verified).
6. **g_form facts:** mandatory wins (glform card + code, onload new card, glform-3 / onload-4 explains, glossary setReadOnly/setDisplay/
   setVisible); unknown field silent (glform card, onload card, glossary getValue); setValue(ref, sys_id, displayValue) (glform card 1,
   cs-gluser-3 solution/hints uses g_user.getFullName(), glossary); flash('incident.priority') (glform2 card + scratch, usecases
   scratch, glossary); cs-usecases-2 no longer hardcodes sys_ids — map comes from g_scratchpad.groupByCategory (Display BR) + new card
   "sys_ids client script lo hardcode cheyyaku" (Display BR code, Assignment rules / Data Lookup); cs-glform-7 / -4 now RESTORE options
   (clearOptions + addOption rebuild). Restore is testable via a "Practice setup" block that replays her own onChange for the earlier
   impact (variants impact 1→2 / 3→2 fail any script that never puts the option back; -4 also checks order 1,2,3 and hideFieldMsg).
7. **Hardcode-proof tests:** ajaxCalls asserts on cs-ajax1-1/-3/-5/-7/-4 + variants (other caller / other impact / g_desk) for -1/-3/-5/-6;
   cs-onchange-5 variant (Beth) + __x.syncGetReference = 0 (also on glform2-3, onchange-6/-7/-4); cs-gluser-1/-3/-5/-7 variants with
   another user / group; cs-usecases-3/-6/-7/-4 and cs-client-2/-6 variants with other values; isLoading variants on cs-glform-2,
   cs-client-2, cs-onchange-1, cs-onchange-2, cs-ajax1-1 (no Ajax call), cs-usecases-2; cs-oncell-3 now 2 sysIDs (second Resolved)
   + variants (none Resolved / first Resolved) — oldValues[0]-only or last-only solutions fail. List editing skips onChange / UI Policies
   → new cs-oncell card + glossary onCellEdit.
8. hideRelatedLists exercise (cs-glform2-1) now role-based on a saved record (+ card note: new records have no related lists);
   cs-onchange Q5 contradiction fixed (onChange also runs on load); "sirf" / "Zaroori" removed; g_list: new card "getQuery / getView /
   refresh", scratch logs getQuery, new exercise **cs-gllist-8** "Filter check (getQuery)" (3 runs).
9. Learn cards: every lesson now has ≥ 3 (8 new cards: gllist, onload, onchange, ajax2, onsubmit, usecases ×2, oncell).
10. Quiz: ~30 option / why edits in my 60 original questions — no "much longer" lines; right answer longest in 12/60 (was 24/60).
    Numbered refs ("Exercise 4 lo …", "Medium+ 6 …") replaced by exercise titles everywhere.
11. Glossary (glossary-cs.js): 7 new entries — g_user.getFullName(), g_form.getActionName(), g_form.submit() (check), g_form.getSectionNames(),
    g_list.refresh() (check), ga.getXMLWait() (check), ga.getAnswer() (check); ~17 entries corrected (setValue, getValue, setReadOnly,
    setDisplay, setVisible, flash, addOption, hideRelatedLists, setSectionDisplay, onChange, onSubmit, onCellEdit, Script Include,
    AbstractAjaxProcessor, this.getParameter, g_list.getQuery/getView, jslog, Client Script). Also fixed prose that pulled server entries
    (setValue / getValue / query / filter() / sort()) onto client lesson pages.
12. Coordinator extra (glossary-cs.js): setTitle() / render() now say GlideModal first (use it), GlideDialogWindow = old / deprecated
    but present; GlideDialogWindow entry reworded the same way; Syntax Editor entry lists her PDI macros doc, for, ialogbr, ialogsi,
    info, method, vargr, vargror (pdi-facts #19). (GlideAggregate boolean getValue fact: not mentioned in my lessons — nothing to change.)
Counts: 3 new exercises (cs-gllist-8, cs-ajax2-8, cs-onsubmit-8), ~19 reworked, variant runs 77 → 108, 8 new learn cards.

## FLAGGED FOR PDI CHECK (⚠️ in the text)
- lessons-cs-b.js:379, lessons-cs-c.js:876, :966, glossary-cs.js:79 — oldValue = value at form LOAD; g_form.setValue() on the script's
  own field fires onChange again (test: onChange on priority with jslog(oldValue, newValue); change 3→2→1; then a revert script).
- lessons-cs-c.js:642, :644, :798, glossary-cs.js:54 — onSubmit verdict is taken before a getXMLAnswer callback; g_form.submit(action)
  re-runs onSubmit scripts (flag needed).
- lessons-cs-c.js:645, glossary-cs.js:93-94 — getXMLWait: synchronous, freezes, classic UI only; ga.getAnswer() returns the answer.
- lessons-cs.js:254, :353, glossary-cs.js:58 — does g_form.addOption() add a DUPLICATE when the value already exists?
- lessons-cs-b.js:223, :286, glossary-cs.js:74-75 — g_list.getQuery() output (ORDERBY included?), getView() for the default view,
  g_list.refresh() behaviour (list banner UI Action + jslog).
- lessons-cs-c.js:1057, glossary-cs.js:81 — list editing does not run onChange / UI Policies; OOB Data Policy blocks a list edit of
  state → Resolved without Resolution notes (revert the edit afterwards).
- lessons-cs-c.js:1121 (pre-existing) — calling the onCellEdit callback twice.
- Not ⚠️-marked but docs-only: setValue 3rd argument avoids a server round trip (lessons-cs.js:129, :217 — ServiceNow docs);
  "Worknotes mandatory onChange of priority" described from its name only (lessons-cs.js:290, lessons-cs-b.js:706) — open it once
  and check what it makes mandatory.

## REQUESTS (files I don't own)
- src/js/clientMock.js — addOption() silently skips a value that already exists. If her PDI adds a duplicate option (see flag above),
  make the mock add it too (my exercises clearOptions first, so they keep passing; a learner's addOption-in-else would then show the
  duplicate like the PDI).
- src/js/clientMock.js — g_list.refresh() only writes a 'sys' log line; please record it in __x (e.g. __x.listRefreshed = n) so a
  g_list exercise can test it (today refresh is taught in the card + glossary only).
- (FYI, no change needed) quiz-extra-cs.js questions I spot-checked agree with the new behaviour (oldValue = load value, re-fire guard,
  onSubmit async, getXMLWait, OOB On-hold UI Policy).

## NOT DONE
- g_list.refresh() and the setValue display value (3rd argument) are taught but not asserted — the mock does not record either
  (see REQUESTS).
- Not clicked through in a browser (npm is broken on this machine). JSX untouched; data files load in node and all checks pass.

## Final check output (node dev-tools/check-all.mjs)
```
✔ check-mock: mock checks OK
✔ check-js: 8 lessons, 56 exercises, 0 problems
✔ check-cs: 26 lessons, 173 exercises, 0 problems
✔ check-quiz: All quiz checks OK
✔ check-exercises: 54 exercises, 0 problems. Lessons without exercises: none
✔ check-glossary: OK — 203 glossary terms cover all Stage 2 + Stage 3 card terms and method calls
✔ check-page-terms: OK — lesson glossary matching passes all checks

All checks passed
```
Wrong-solution run (SCRATCH\s3client-wrong.mjs): "all wrong solutions fail" (50 cases).
