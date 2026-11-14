# review-R2 — Stage 2 fixes from PDI verification round 2

Files edited (only these): src/data/lessons-js.js, src/data/lessons-js-b.js, src/data/lessons-js-c.js,
src/data/quiz-extra-js.js, src/data/glossary-js.js (existing GLOSSARY_STAGE2 entries only; no new keys; imports and the
GLOSSARY_JS merge line untouched). No ids renumbered, added or deleted. Still 8 lessons, 56 exercises, 20 quiz questions per lesson.

## DONE

1. **❌ #1: reading a property of `undefined` does not throw**
   - lessons-js-b.js:1131-1146 (Objects "⚠️ Gotchas" card). Removed `TypeError … from undefined`. The card now says:
     - in her PDI, `data.result.number` with no `result` gives undefined and no error;
     - only `null` throws `TypeError: Cannot read property "number" from null`;
     - the sandbox (browser) throws for undefined too;
     - the silent undefined is a danger, so check `if (data.result)` first. A code example of this was added.
   - quiz-extra-js.js:91 (js-objects). The question now starts with "Nee PDI lo:". Right answer: `"undefined" print avtundi, error raadu`.
     The TypeError option is now a wrong answer. The `why` covers the null form, the sandbox difference and the safe check.
     The right answer is not the longest option.
   - glossary-js.js:77-78 (`null`, `undefined`): added property-read behaviour (null → TypeError, undefined → undefined in her PDI,
     TypeError in the browser).
   - A grep finds no other "from undefined" text in Stage 2. lessons-js-b.js:392 and quiz-extra-js.js:42 use the null form, which is
     correct.
2. **➕ #6: Scripts - Background**. lessons-js.js:86-96, "Ee scripts nee PDI lo ekkada run cheyyali?" card:
   - Monaco editor, **"Run Script"** button, output `*** Script: <nee text>`.
   - Scope picker ("global" for this course).
   - "Record for rollback?" is ticked by default; leave it. The old "undo ledu" became "rollback meeda aadharapadaku" (don't rely on
     it); update / insert / delete still change real data.
   - Code comment says "Run Script".
   - quiz-extra-js.js:17 `why` says "Run Script" and gives the `*** Script:` output.
   - glossary-js.js:29 `gs.info`: Background Script output shows as `*** Script: <text>`.
   - No ⚠️ flag left on these facts (verified).
3. **➕ #7: ES12 mode**
   - lessons-js.js:58-61 (Variables card):
     - The works / fails list is now stated as measured in **Background Script**.
     - New line: per-script toggle **"Turn on ECMAScript 2021 (ES12) mode"** on Business Rule / Script Include Script fields (global
       scope too). Only a script with it ON allows let / class. Background Script has no toggle. Scoped apps have app-level
       "JavaScript Mode" (Compatibility Mode / ES5 Standards Mode / ECMAScript 2021 (ES12)).
     - Line 61: the course uses var, which works everywhere.
     - The old ⚠️ "scoped app … confirm chesuko" line is removed.
     - lessons-js.js:70 code comment says "Background Script lo SyntaxError (ES12 mode ledu)".
   - The same exact wording ("Background Script lo (ES12 mode lekunda)") is now in lessons-js-b.js:1077 (for…of / destructuring),
     lessons-js-c.js:441 (for…of), lessons-js-c.js:818 (default params) and the quiz-extra-js.js:18 `why`.
   - glossary-js.js `let` (:71), `const` (:72), `class` (:86) were rewritten the same way.
   - lessons-js.js:160 autocomplete line: all script editors are Monaco, and Ctrl+Space shows the suggestion list (verified).
4. **✅ Verified: flags removed, "check chesam" added**
   - quiz-extra-js.js:149: the `IncidentUtils.getP1Count()` (no `new`) `why` lost its ⚠️ and now says it was checked in her PDI.
   - `String(gr.field)` empty → "": lessons-js-b.js:392 and quiz-extra-js.js:58.
   - getDisplayValue on an empty reference → "": glossary-js.js:57 (was "empty (falsy)") and lessons-js-c.js:727 (js-loops-4 explain).
   - `getValue(NaN)` → null: lessons-js-b.js:58.
   - ⏸ setWorkflow: glossary-js.js:61 now has an inline "(Workflows, notifications kuda skip avtayi ani docs — ⚠️ PDI lo confirm
     chesuko.)". Before, the flag was only in the review notes and the learner never saw it.
5. **Seed change (INC0010005 Closed, INC0010006 P4)**
   - **js-conditions-3 "State message (switch)"** (lessons-js-c.js:220-274), same id:
     - The task adds a `"7" → Closed` case. INC0010005 is a Closed incident in the practice data.
     - Main test: `Log: Closed` plus `expr msg = 'Closed'`.
     - Variants: states 1, 2, 3 and 6 (seeded active 'true', which is realistic) and 8 (Canceled → default "Other").
     - Tier-3 hint adds the '7' and default cases. The explain covers fall-through from '6' into '7', and that Resolved stays
       active = true while only Closed sets active = false.
     - Harness SCRATCH/r2/r2-verify.mjs: these 9 wrong solutions all FAIL: the old 4-case solution, hardcoded 'Closed', hardcoded
       'Resolved…', no break after '6', no break after '7', number cases, no break after '2', no default, using `active` instead of
       state. An if/else-chain version and a reordered switch both PASS.
   - lessons-js-c.js:919 (js-functions-3 explain): "INC0010005 … Closed — active = false" (was "resolved/inactive").
   - lessons-js-c.js:874 (js-functions-2 isActiveState explain): added a note that the function is our own "still being worked on" rule,
     not the active field. Resolved (6) still has active = true in her PDI.
   - lessons-js-b.js:210 (js-operators-5 variant INC0010064): the current scenario had priority 3 with impact 2 / urgency 3. Her lookup
     gives 2/3 → 4, the same mismatch as the old INC0010006. Urgency changed to '2' (2/2 → 3). The test only uses priority.
   - js-operators-4 "Priority calculate chey": the score formula gives her lookup for all 9 impact/urgency pairs (2/3 → 4 included).
     No change needed.
   - No Stage 2 text called INC0010006 priority 3. The tests that touch INC0010006 (arrays-4/-5/-6, conditions-4/-5, functions-6) all
     still pass, and the Triage top 3 did not change.

## FLAGGED FOR PDI CHECK (⚠️ left in text, or worded from the label)
- glossary-js.js:61: `setWorkflow(false)` also skips workflows / notifications (docs). ⏸ as instructed, now visible in the text.
- lessons-js.js:160: typing `gr.` in the Monaco editor lists GlideRecord methods. Ctrl+Space itself is verified.
- lessons-js.js:88 (no ⚠️, worded "peru batti" = going by the name): "Record for rollback?" records the run's changes so they can be
  rolled back. Only "ticked by default" is verified. If convenient, run a harmless update with it ticked and check that a rollback
  link appears in the output or under Script Execution History.
- lessons-js.js:159 (pre-existing, not a PDI fact): developer.servicenow.com menu names may change by release.
- Note, no ⚠️: the undefined fact was tested as `var u; u.number`. The card and quiz apply it to `data.result.number`, the same
  operation one level deeper. Fact #26 says `gs.info(undefined)` prints "undefined".

## REQUESTS (files I don't own)
- **src/js/runScript.js `errOf`**: please add a PDI note for the browser's undefined-read error, as is already done for "is not a
  function":
  - match `/Cannot read propert(y|ies) of undefined/`;
  - append "— ⚠️ nee PDI lo undefined meeda property chadivina error raadu, silent ga undefined vastundi; null meeda matrame TypeError."
  - Without it, the js-objects-3 starter (`var data; gs.info(data.result.number)`) shows a bare TypeError, and the learner may think
    her PDI does the same.
- **src/js/esCheck.js**: the header comment and messages say let / class / … fail in "Background Scripts, Business Rules, Script
  Includes". With fact #7 that is exact only for Background Scripts and for scripts with the ES12 toggle OFF. Suggested message prefix:
  "Background Script lo (ES12 mode lekunda) SyntaxError …".
- **CLAUDE.md** (Stage 2 notes): "`padStart` etc. need the 'ES12 mode' note in `explain`" is outdated. padStart, includes, const,
  arrows and template literals work in her global scope. The ES12 toggle only matters for let / class / destructuring / spread /
  default params / for…of.

## NOT DONE
- Nothing from the task list. A browser click-through is not possible (npm is broken), and no JSX was touched.

## Final check output
```
$ node dev-tools/check-js.mjs
8 lessons, 56 exercises, 0 problems

$ node dev-tools/check-quiz.mjs
Stage 1: 18 lessons, 172 questions, right answer longest in 24%
Stage 2: 8 lessons, 160 questions, right answer longest in 16%
Stage 3: 26 lessons, 390 questions, right answer longest in 15%
All quiz checks OK

$ node dev-tools/check-glossary.mjs
OK — 204 glossary terms cover all Stage 2 + Stage 3 card terms and method calls

$ node dev-tools/check-page-terms.mjs  (Stage 2 lines)
js-basics 35 | js-operators 15 | js-strings 27 | js-arrays 30 | js-objects 23 | js-conditions 21 | js-loops 17 | js-functions 19
OK — lesson glossary matching passes all checks

$ node SCRATCH/r2/r2-verify.mjs          (js-conditions-3 wrong / alt solutions)
reference passes: true | starter fails: true
0 problem(s)

$ node SCRATCH/s2-wrong.mjs
56/56 exercises have wrong-solution checks; 0 problem(s)

$ node dev-tools/check-all.mjs
✔ check-mock ✔ check-js ✔ check-cs ✔ check-quiz ✔ check-exercises ✔ check-glossary ✔ check-page-terms
All checks passed
```
(204 glossary terms: the count went up from 203 because another agent added a Stage 3 entry during the run. R2 added no keys.)
