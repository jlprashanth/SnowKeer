# review-S2 — Stage 2 "JavaScript, ServiceNow style"

Files edited (only these): src/data/lessons-js.js, src/data/lessons-js-b.js, src/data/lessons-js-c.js,
src/data/quiz-extra-js.js, src/data/glossary-js.js (GLOSSARY_STAGE2 entries only; imports, GLOSSARY_JS merge line and
GLOSSARY_GROUPS unchanged). No ids renumbered or deleted. Still 8 lessons, 56 exercises, 20 quiz questions per lesson.

## DONE

1. **getValue facts (#1–3)**
   - js-loops-3: the solution and hints use `getValue('active') === '0'` now (`=== 'false'` never matched). The main scenario seeds a CLOSED,
     unassigned P1 (INC0010000, sorted first), so the old `=== 'false'` code and the no-`continue` code both fail.
   - Updated text that said "empty string" or "always a string": lessons-js-b.js (operators quiz Q5, js-operators-3 hint and explain),
     lessons-js-c.js (truthy card, js-conditions-5 and js-conditions-4 explains), lessons-js.js (quiz Q1, gr-vs-current card, data-types
     card), glossary `getValue`.
   - The js-basics "getValue gotcha" card now covers '1'/'0' for booleans, null for empty fields, `gs.info(null)` → "null", `.nil()` and
     `gr.active == true`.
   - Quiz: the old `=== 'true'` answer is now `=== '1'`. New questions: getValue('active') returns '1'; Number(null) = 0 for an empty
     priority; an inactive '0' is a truthy string; getValue on an empty field is null, so `!a` is true.
   - The loops "break & continue" card code uses `=== '0'`.
2. **Truthiness (#4–5)**
   - Rewrote the truthy/falsy card. In her PDI `[]` is FALSY and an empty GlideElement is falsy. The card says the sandbox cannot copy
     this, so `.nil()` / `gs.nil()` / getValue are the safe habit, and to use `arr.length === 0` for arrays.
   - Arrays Gotchas card: use `length` to test for an empty array.
   - The js-conditions-5 explain warns that `if (gr.assigned_to)` works in the PDI but not in the sandbox.
   - Glossary `setAbortAction` example uses `.nil()`; glossary `nil` entry updated.
   - Two new conditions quiz questions ("Nee PDI lo": `[]` → else branch; empty element → else branch). They replace a trivial `||`
     question and a duplicate `Number(p) <= 2` question.
3. **Element-in-array gotcha (#8)**
   - New arrays card "push(gr.number) — anni okate vastayi!" with wrong vs right code. Mock output: INC0010008, INC0010008.
   - New quiz question (replaces the outdated "ES5 callback" question).
   - js-arrays-3, -5, -6 and -4 now test `typeof` of the pushed values. The harness confirms `push(gr.number)` / `{ number: gr.number }`
     fails in all four.
4. **addOrCondition (#9)**: glossary example is now `var qc = gr.addQuery('priority', 1); qc.addOrCondition('priority', 2);`, and it
   explains that the OR joins THAT condition: (A OR C) AND B.
5. **JS support in her PDI (#24)**
   - Removed every "ES12 mode" / "ES5" / "is not a function" claim (variables card, strings Vethakadam/padStart cards, arrays forEach
     card, js-strings-7/-4 explains, quiz Q on const, includes, padStart trick, arrays callbacks/includes, glossary let/const/includes/
     startsWith/padStart).
   - The variables card now has one exact works/fails line, plus ONE ⚠️ line saying scoped apps have their own JavaScript Mode.
   - Added short notes for template literals (strings), Object.values/entries + no destructuring/for…of (objects), for…of (loops), and
     default params (functions).
6. **Missing methods (#25/#26)**
   - The strings quiz "includes in ES5" question became "d.has('VPN') in her PDI → undefined, no error".
   - getP1Count-without-new now answers "undefined — error kuda raadu" (flagged below).
   - Functions Gotchas card: a method typo is silently undefined; a function-name typo gives ReferenceError: "x" is not defined.
   - The null property error is written in the PDI format: TypeError: Cannot read property "x" from null.
   - Nested-calls card: `getValue(NaN)` → null → `null <= 2` is true.
   - `gs.info(null)` → "null" is in the getValue card, glossary `null`, and the operators `caller && caller.name` question.
7. **Tests**
   - 37/56 exercises now have inline `variants`, mostly seed-based (seeded rows, or changed existing rows), some use a different `current`.
   - About 25 new `expr` checks of her variables and results.
   - The other 19 exercises have either fixed literal inputs (now with `expr` checks) or function exercises whose tests already pass
     several arguments.
   - Every known case is fixed: js-conditions-1, js-objects-3 (the JSON now comes from current.description, so a hardcode fails),
     js-conditions-2 (`p === 1` fails), js-loops-3, js-operators-4 (3 variants cover every ternary branch).
   - Harness `SCRATCH/s2-wrong.mjs` + `SCRATCH/s2-cases.mjs`: 90 wrong-but-plausible solutions across all 56 exercises all FAIL.
     10 alternative correct answers PASS: `.nil()`, `gs.nil()`, `gr.active == false`, `String(gr.number)`, `includes`,
     `addQuery('assignment_group.name', …)` (js-functions-4).
8. **Ladder order**
   - Array order is now the doing order in every lesson, and badges never go down along it. Five lessons were reordered: strings
     1,2,5,6,3,7,4; arrays 1,2,3,5,6,7,4; objects 1,2,6,5,3,7,4; conditions 1,2,7,3,5,6,4; functions 1,2,5,3,6,7,4.
   - 10 level relabels so each lesson reads easy, easy, medium, m+, m+, m+, hard. The 'medium' moved to the first ladder step and the
     old 'medium' became m+.
   - Every "Exercise 3/4", "Medium+ 6/7" and "next exercise" reference now names the exercise by its title.
   - Because levels are monotonic, a stable RANK sort shows the same order, whether or not JsLesson.jsx still sorts.
9. **Starters / hints**
   - Starters no longer contain the answer: arrays-4, strings-4, loops-4, plus strings-7, operators-6/-7/-4, objects-6, conditions-5,
     strings-5/-6/-3 and arrays-5.
   - Tier-3 hints now add something: arrays-7, operators-5, loops-3, strings-6, operators-3/-7, strings-3/-7, loops-4.
10. **`this` card** in the Objects lesson: object method + why Script Includes use `this.table`. An Objects quiz question on `this`
    replaces the near-duplicate `typeof o.b` question. The functions Script Include card links to it.
11. **Where scripts run / recursion**
    - New js-basics card: System Definition → Scripts - Background. It says update/insert/delete REALLY change her PDI and the sandbox
      does not save anything.
    - Recursion warning about `current.update()` in a Business Rule: gr-vs-current card, js-basics-4 explain, glossary `current` and
      `update`.
    - Glossary `setWorkflow(false)` says it skips Business Rules.
    - js-functions-4 task and explain accept the dot-walk; the harness confirms it passes.
12. **Quiz quality**
    - All 29 "much longer" flags are fixed. Stage 2 right-answer-longest went from 38% to 16%.
    - Give-aways fixed: quiz-extra-js.js:105, 106, 133, 149, 152, plus a few with "(explanation)" only on the right option.
    - Typos fixed: "randoms", "Medium nunchi".
    - The const question matches the PDI fact. Still 20 per lesson.
13. **Glossary updates (no new keys needed)**: current, addOrCondition, update, getValue, setAbortAction, setWorkflow, nil, let, const,
    throw, this, includes(), startsWith(), padStart(), null, get (one-argument number form, fact #27), getDisplayValue (fact #28).
14. **Rewritten exercises** (same ids, so stored progress stays valid; task/data changed):
    - js-strings-1: current short_description.
    - js-strings-6: current = sys_user record.
    - js-strings-4: last number comes from a query → INC0010009.
    - js-arrays-7: openDays [12,3,25,1,9], which catches the default text sort.
    - js-objects-3: JSON comes from current.description.
    - js-loops-3: seeded closed P1.

## FLAGGED FOR PDI CHECK
- lessons-js.js:60 — scoped apps have a "JavaScript Mode" (ES12) setting where `let` works. From docs; already marked ⚠️ in the text.
- lessons-js.js:86 and :89 — the Scripts - Background button is labelled "Run script", and gs.info output shows as `*** Script: …`.
  Written from memory.
- quiz-extra-js.js:149 — `IncidentUtils.getP1Count()` without `new` (a method on the Class.create() FUNCTION object) → silent undefined.
  Fact #25 lists string/array/object/number/GlideRecord, not function objects. Already marked ⚠️ in the `why`.
- lessons-js-b.js:392 and quiz-extra-js.js:58 — `String(gr.short_description)` on an EMPTY field gives "" (not "null").
- lessons-js-c.js:702 and :720 (js-loops-4 hint/explain) — `gr.getDisplayValue('assigned_to')` on an empty reference returns "".
  The code works whether it is "" or null; the glossary getDisplayValue entry says only "empty (falsy)".
- lessons-js-b.js:1132 and quiz-extra-js.js:91 — the undefined form of the message:
  `TypeError: Cannot read property "number" from undefined`. Fact #25 only shows the null form.
- glossary-js.js:61 — `setWorkflow(false)` also stops workflows/notifications, not only Business Rules (docs wording).
- lessons-js-b.js:58 — `gr.getValue(NaN)` returns null (follows from fact #2 "unknown field → null"; not run literally).

## REQUESTS (files I don't own)
- **CLAUDE.md**: the Stage 2 ladder text says "three 'medium+' exercises (ids 5–7)". Ids no longer map to positions. Suggested text:
  "display order = array order; badges go up along it (easy, easy, medium, m+, m+, m+, hard); which id holds which level varies by
  lesson".
- **src/components/JsLesson.jsx:17** still sorts by RANK. The brief says display = array order. Stage 2 is monotonic, so it shows
  correctly either way, but the sort should go so that a future non-monotonic order is not silently re-sorted.
- **dev-tools/check-js.mjs**: please add a check that levels never go down along the array order. Optionally copy
  `SCRATCH/s2-cases.mjs` (+ the loop in `s2-wrong.mjs`) into dev-tools as a regression test that wrong solutions keep failing.
- Not mine, seen in check-all: check-cs `cs-best-5` (starter passes); check-quiz 8 Stage 3 "much longer" flags (cs-snutils, cs-debug,
  cs-best, cs-uipages, cs-uipages2, cs-uimacros).

## NOT DONE
- 19 exercises have no variants:
  - Literal-input exercises (basics-1/-2, operators-1, strings-7, arrays-1, objects-1/-2/-6/-7, loops-1/-5): the inputs are literals in
    her own code, so a variant cannot change them. They got `expr` checks of her variables instead (e.g. `i` after the loop,
    `[hours, mins]`, `groups.join`).
  - Function exercises (functions-1/-2/-3/-4/-5/-6/-7): already parametric, with several arguments per test.
- Browser click-through: not possible (npm is broken on this machine). JSX was not touched.

## Final check output (Stage 2 parts)
```
$ node dev-tools/check-js.mjs
8 lessons, 56 exercises, 0 problems

$ node dev-tools/check-quiz.mjs  (Stage 2 lines)
Stage 2: 8 lessons, 160 questions, right answer longest in 16%

$ node dev-tools/check-glossary.mjs
OK — 178 glossary terms cover all Stage 2 + Stage 3 card terms and method calls

$ node dev-tools/check-page-terms.mjs
js-basics 35 terms | js-operators 15 | js-strings 27 | js-arrays 30 | js-objects 23 | js-conditions 21 | js-loops 17 | js-functions 19
OK — lesson glossary matching passes all checks

$ node SCRATCH/s2-wrong.mjs
56/56 exercises have wrong-solution checks; 0 problem(s)
js-basics      1:easy  2:easy  3:medium  5:medium+  6:medium+  7:medium+  4:hard
js-operators   1:easy  2:easy  3:medium  5:medium+  6:medium+  7:medium+  4:hard
js-strings     1:easy  2:easy  5:medium  6:medium+  3:medium+  7:medium+  4:hard
js-arrays      1:easy  2:easy  3:medium  5:medium+  6:medium+  7:medium+  4:hard
js-objects     1:easy  2:easy  6:medium  5:medium+  3:medium+  7:medium+  4:hard
js-conditions  1:easy  2:easy  7:medium  3:medium+  5:medium+  6:medium+  4:hard
js-loops       1:easy  2:easy  5:medium  6:medium+  7:medium+  3:medium+  4:hard
js-functions   1:easy  2:easy  5:medium  3:medium+  6:medium+  7:medium+  4:hard

$ node dev-tools/check-all.mjs
✔ check-mock  ✔ check-js  ✘ check-cs (cs-best-5, Stage 3)  ✘ check-quiz (8 Stage 3 flags only)  ✔ check-exercises
✔ check-glossary  ✔ check-page-terms
```
