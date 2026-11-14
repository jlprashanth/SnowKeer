# review-R3 — Stage 3 client lessons: verify-round2 applied

Files touched: src/data/lessons-cs.js (gluser / glform objects only), lessons-cs-b.js, lessons-cs-c.js, glossary-cs.js,
quiz-extra-cs.js. variants-cs.js: no change needed. No ids added, removed or renumbered. No git commands that change anything.

## DONE

### ✅ Verified: ⚠️ removed, statement kept (with the proof where it helps)
- oldValue = value at form LOAD (proof: OOB "Worknotes mandatory onChange of priority", priority 4 → 2 → 3 → 4 →
  mandatory, mandatory, NOT mandatory): lessons-cs-b.js:382, lessons-cs-c.js:886, :976, glossary-cs.js:80 (onChange),
  quiz-extra-cs.js:68, :100.
- g_form.setValue fires onChange again (revert guard needed): lessons-cs-b.js:384, lessons-cs-c.js:886, :976,
  glossary-cs.js:33, quiz-extra-cs.js:95, :151.
- getReference / getXMLAnswer async: lessons-cs-b.js:31, lessons-cs-c.js:119, glossary-cs.js:36, :92, quiz-extra-cs.js:39, :109.
- getParameter = Java String: quiz-extra-cs.js:123. Empty `initialize: function () {}` breaks getParameter: quiz-extra-cs.js:126;
  NEW learn line lessons-cs-c.js:276 (the quiz asked it but no card taught it) + glossary-cs.js:100 (initialize).
- Submit = 'sysverb_insert': lessons-cs-c.js:654, :808, glossary-cs.js:53, quiz-extra-cs.js:140.
- Highlight VIP Caller `caller.vip == 'true'`: lessons-cs.js:189, lessons-cs-b.js:32, :709, glossary-cs.js:36, quiz-extra-cs.js:46.
- UI Type choices Desktop / "Mobile / Service Portal" / All: lessons-cs-b.js:375, quiz-extra-cs.js:70.
- hasRoleFromList true for admin: glossary-cs.js:67, quiz-extra-cs.js:19. showFieldMsg stacks: glossary-cs.js:46, quiz-extra-cs.js:44.
  g_scratchpad always exists: glossary-cs.js:24, quiz-extra-cs.js:86. getXMLWait exists: lessons-cs-c.js:655, glossary-cs.js:94.
- Exact OOB "Worknotes mandatory" logic (was "from its name only"): lessons-cs.js:291 (cs-glform-2 explain), lessons-cs-b.js:709.

### ❌ Fixed
- #3 addOption with an existing value → NO duplicate (emi maradu, position kuda maradu): lessons-cs.js:254-255 (card),
  :354 (cs-glform-7 explain), glossary-cs.js:58. No test expected a duplicate (scanned all Stage 3 tests; cs-glform-4 / -7
  use clearOptions first) — nothing else to adjust.
- #2 macros: glossary-cs.js:114 'Syntax Editor' — Monaco editor, type name → Ctrl+Space → pick → Enter; Tab does NOT expand.
- Data Policy claims that contradict pdi-facts #42 ("server side kuda check chestundi" / "form kakapoyina apply"):
  lessons-cs-b.js:166, quiz-extra-cs.js:142, :169 — now: form (as UI Policy) + import sets / SOAP; a Background Script /
  GlideRecord save is NOT blocked.
- jslog glossary (glossary-cs.js:28) said "classic UI developer settings lo JavaScript Log" — her Preferences has no such item
  (verify #4); removed.

### ➕ New facts used
- #10 empty reference → callback with undefined fields: lessons-cs-b.js:31, glossary-cs.js:36. No exercise in my files relied on
  `caller.sys_id === ''` (the ONCHANGE guard returns on '' first).
- #11 g_list: not a global outside a list UI Action, console = GlideList2.get('incident') (+ gsft_main iframe note),
  getQuery() no ORDERBY / getQuery({orderby: true}) adds it, getView() '' on default view, getChecked() '', refresh() exists:
  lessons-cs-b.js:194-195, :223-229 (card + code), :289 (cs-gllist-8 explain); glossary-cs.js:23, :74-76 (check: true removed
  from getView / refresh); NEW glossary entry 'GlideList2.get()' glossary-cs.js:71 (so the prose call does not resolve to the
  server `get` entry on the page panel).

### Seed change (INC0010005 Closed, INC0010006 priority 4)
- cs-ajax2-5 (lessons-cs-c.js:445-487): tests now software + 4 → 1 and network + 1 → 1; NEW inline variant seeds one more
  software / P4 incident → software + 4 → 2, software + 3 → 1. Task text updated (INC0010006; software 2, P4 3, both 1).
  Checked: category-only, priority-only, hardcoded `return 1`, swapped params all FAIL; solution passes (+ addActiveQuery also passes — allowed).
- cs-oncell-3 task (lessons-cs-c.js:1105) no longer calls INC0010005 "Resolved" (now "first record In Progress, rendodi
  Resolved — oldValues ["2", "6"]"). sysIDs ['inc1','inc5'] left as-is (never shown / used by tests).

## FLAGGED FOR PDI CHECK (⚠️ kept — ⏸ in verify-round2)
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

## REQUESTS (files I don't own)
- src/js/runScript.js (makeAjaxBase / callAjax): an empty `initialize: function () {}` does NOT break getParameter in the practice
  runner (probe: returns 'hi'), but it does in her PDI and the lessons now teach that. Suggest: base `initialize(request) { this.request = request }`,
  getParameter reads `this.request`, callAjax passes the params object to `new Ctor(req)` — an overriding initialize then leaves
  getParameter returning null like the PDI.
- (FYI, not mine) lessons-cs-e.js:932-ish "what getReference's callback receives for an empty reference" — now verified (#10).

## NOT DONE
- variants-cs.js: no edits needed (its header note "oldValue = load value" is now verified; the 'cs-oncell-3' variant uses sysID
  'inc5' with old value '6' — harmless, ids are not shown or checked).

## Final check output (2026-11-14)
```
check-cs exit=0 :: 26 lessons, 173 exercises, 0 problems
check-quiz exit=0 :: All quiz checks OK            (Stage 3: 393 questions, right answer longest in 15%)
check-glossary exit=0 :: OK — 204 glossary terms cover all Stage 2 + Stage 3 card terms and method calls
check-page-terms exit=0 :: OK — lesson glossary matching passes all checks
check-all: All checks passed (mock, js, cs, quiz, exercises, glossary, page-terms)
```
