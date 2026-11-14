# review-Q-S1 — Stage 1 extra quiz questions

File edited (only): `src/data/quiz-extra-s1.js`

## DONE
- Added **101** new questions (format: one `q()` per line, right answer listed first; `Quiz.jsx` shuffles the options). Per lesson
  (new + existing = total): account 5+4=9 · user-admin 6+4=10 · ui-tour 6+4=10 · products 5+4=9 · architecture 5+4=9 ·
  table-creation 6+4=10 · form-design 5+4=9 · views 5+4=9 · dictionary 6+4=10 · process-flow 7+3=10 · menus-modules 6+4=10 ·
  table-filters 6+4=10 · save-submit 6+4=10 · child-tables 5+4=9 · data-lookup 6+4=10 · update-sets 6+4=10 · ui-policies 5+4=9 ·
  data-policies 5+4=9. Every lesson still has ≥ 8 questions even if the other agent drops one existing question.
- Most are scenarios ("Nuvvu … chesav — em avtundi?") that test understanding. A few are lookups she will need anyway: module
  locations, the update set option names, the 2/2 priority value.
- Facts follow pdi-facts.md:
  - Priority lookup: 1/3 → 3, 2/2 → 3, 3/3 → 4. Defaults are impact 3, urgency 3, priority 4.
  - Insert / Insert and Stay copy an EXISTING record and are hidden on task tables (`glide.ui.task.insert`).
  - Update set: no "Mark as Complete"; the states are In progress / Complete / Ignore. Also uses Merge, Back Out and Retrieved Update Sets.
  - Process flow is display-only. Each stage is a `sys_process_flow` record (Table, Label, Order, Condition), and her PDI has 0 records for incident.
  - Assignment rules: module "Assignment" under System Policy.
  - Dictionary override is created from the parent field's entry. "Extensible" checkbox. Split items are `|- begin_split -|` / `|- split -|` / `|- end_split -|`.
  - Data Policy vs UI Policy: Data Policy also covers imports and API, but cannot hide fields or run scripts.
  - Dictionary mandatory does not stop a GlideRecord insert.
  - Caller is made mandatory by a UI Policy, not the dictionary.
  - Category "Inquiry" (value `inquiry`) and State In Progress = 2 (choice label vs value).
  - Encoded queries: `A^B^ORC` = A AND (B OR C), and `^NQ` starts an OR'ed new query.
  - OOB On hold reason UI Policy and "close info" Data Policy. "Mandatory wins" over hide/read-only.
  - "Set Password" user action. PDI hibernate (hours idle) vs reclaim (~10 days without a login).
- Length balance (my 101 questions): no question flagged by check-quiz; highest right/others ratio 1.20. The right option is the
  single longest in 19/101 = **19%**. I set it there on purpose: at first draft it was 1%, which teaches "never pick the longest".
  The Stage 1 share fell from **41% → 28%** (172 questions), even before the other agent's fixes to existing questions.
- Self-checks: no Hindi words; no newline in any question; 4 unique options each; no "all/none of the above"; every `why` is
  Tenglish and at least 15 chars. A word-overlap scan against each lesson's existing questions found no duplicates (same topics,
  different points).

## FLAGGED FOR PDI CHECK
`⚠️ … confirm chesuko` is in the `why` text (not verified in her PDI):
- `src/data/quiz-extra-s1.js:10` (account) — PDI hibernates after **a few hours** idle and the data is kept. Exact timing is from community sources.
- `src/data/quiz-extra-s1.js:11` (account) — PDI is **reclaimed / wiped after ~10 days** without a login. Exact days are from community sources.
- `src/data/quiz-extra-s1.js:89` (dictionary) — dictionary **Read only** only blocks the form; a Background Script / GlideRecord can still set the value.
- `src/data/quiz-extra-s1.js:149` (data-lookup) — assignment rules apply **only when Assignment group and Assigned to are empty**, so a group she typed is not overwritten.
- `src/data/quiz-extra-s1.js:150` (data-lookup) — when 2 assignment rules match, the **lowest Order** rule wins.
- `src/data/quiz-extra-s1.js:166` (ui-policies) — "mandatory wins" also for a **UI Policy action** Visible = False. pdi-facts #32 verified it only for g_form setDisplay/setReadOnly.

Memory-based but I'm fairly sure (no ⚠️ in the text). Worth a glance if she has time:
- `:30` — the All menu Filter does not find a record by its number (modules only); use Global search.
- `:34` — Next Experience banner has a **History** menu next to All / Favorites.
- `:52` — `/stats.do` shows the Build name.
- `:69` — Form Layout can **expand a reference field** (Caller) and add a dot-walked field (Caller.Email).
- `:71` — the incident activity formatter is labelled **"Activities (filtered)"** in Form Layout.
- `:80` — the module form has a **"View name"** field.
- `:88` — default value `javascript:gs.getUserID()` for a User reference.
- `:118` — clicking a middle breadcrumb condition removes the conditions to its right.
- `:136` — "Create mobile module" checkbox on the table form. It is only a distractor; the right answer "Extensible" is verified.
- `:156`, `:157`, `:159` — Merge Update Sets = combines into a new set; Back Out = undoes a committed set; State Ignore = "don't move this set". The action names themselves are verified (pdi-facts #21).
- `:158` — "Import Update Set from XML" link is on the Retrieved Update Sets list.
- `:160` — editing the same record 3× in one update set leaves **1** customer update (latest version).
- `:167` — UI Policy with "On load" unticked does not apply when the form opens.
- `:169` — UI Policy "Global" checkbox; when unticked, a View field appears.
- `:178` — Data Policy "Apply to import sets" checkbox.

## REQUESTS (files I don't own)
`exercises.js` already matches pdi-facts (checked just now). The lesson files below still say the opposite of verified facts, and
of my new questions, so she would get mixed messages:
1. **`src/data/lessons-a.js:21` + `:28`** (account): step says "~10 days → hibernate, data povadu", and quiz Q3 marks
   "Instance permanent ga delete ayipothundi" as wrong. Fix: hours idle → hibernate (data kept); ~10 days without login → reclaimed / wiped.
2. **`src/data/lessons-b.js:28` + `:32`** (form-design): `--split--` / `--end_split--` → `|- begin_split -|`, `|- split -|`, `|- end_split -|` (pdi-facts #20).
3. **`src/data/lessons-b.js:150-151`** (process-flow): clicking the "In Progress" stage changes State. In her PDI the formatter is
   display-only, and incident has 0 `sys_process_flow` records (#14). My process-flow Q1/Q4 teach the PDI behaviour.
4. **`src/data/lessons-c.js:38`** (table-filters): `priority=1^state=In Progress^ORcategory=network` is described as
   (A AND B) OR C. Per #10 it is A AND (B OR C). The "OR clause / new criteria" equivalent is `^NQ`.
5. **`src/data/lessons-c.js:64-73` + quiz `:78`** (save-submit): Insert & Stay is shown on a NEW record. In her PDI, Insert /
   Insert and Stay copy an EXISTING record and are hidden on task tables (#13). The label is "Insert and Stay".
6. **`src/data/lessons-c.js:181`** (update-sets): "Mark as Complete" does not exist (#21). Use State = Complete → Update.
   Quiz Q1 (`update-sets Q1`, 2.5×) is the only Stage 1 question check-quiz still flags.
7. **`src/data/lessons-c.js:134`** (data-lookup): `goTo('assignment rules', …)`. In her PDI the module title is "Assignment"
   (System Policy, #18), so typing "assignment rules" in the real All menu finds nothing. Use "assignment" as the filter text.

## NOT DONE
- I did not click through the quiz in a browser (npm is broken on this machine). The data file imports cleanly in every node check.

## Final check output
`node dev-tools/check-quiz.mjs`, Stage 1 lines:
```
✗ update-sets Q1: right answer is much longer than the others (2.5x) — easy to guess   ← existing question in lessons-c.js (not mine)
Stage 1: 18 lessons, 172 questions, right answer longest in 28%
```
No Stage 1 lesson is under 8 anymore, and none of my questions are flagged. The other failures in that run are Stage 2/3
lessons (other agents).
My own stats script (my 101 questions only): `MINE: 101 questions, right answer longest in 19 (19%), flagged 0`.
`node dev-tools/check-all.mjs`: check-mock ✔, check-js ✔, check-exercises ✔, check-page-terms ✔. check-cs, check-glossary and
check-quiz fail only on Stage 2/3 items owned by other agents, plus the `update-sets Q1` line above. (Those counts keep changing
while the other agents work.)
