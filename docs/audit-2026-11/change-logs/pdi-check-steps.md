# How-to-check steps for the ⚠️ facts (2026-11-14, after the audit)

The open ⚠️ "PDI lo confirm chesuko" notes told the learner to check something without saying how. The ones she can test now have
a "🔍 PDI lo ela check cheyyali?" box under them. It's closed by default, so busy cards stay short, and opens to show:
- the steps, including any test script
- what she should see if the lesson is right ("👀 Em chudali")
- cleanup ("🧹")

## How it works
- **Recipes:** `src/data/pdi-checks.js`, 15 recipes, one per fact.
- **Linking:** content links a recipe with `checks: ['key']`. This works on learn cards, quiz questions (5th `q()` argument),
  exercises, glossary entries and Stage 1 guided steps. There are 35 links, and every mention of a fact links the same recipe.
- **Rendering:** `src/components/PdiCheck.jsx` draws the box. It's used in JsLesson (learn cards), Quiz (under the explanation),
  Exercises `Card` (PDI cards), ScriptRunner (under the solution's explanation), TermBox (glossary rows) and Tour (guided bubble).
  The bubble now has a max height, so an open box scrolls inside it.
- **Test scripts:**
  - They only act on a test incident whose Short description is "pdi check".
  - Items they create are named "SnowKeer check …".
  - Every recipe ends with exact cleanup.
  - GlideAjax behaviour is tested with `getReference` callbacks. Both are asynchronous (pdi-facts #39), so no Script Include is needed.
- **New check:** `dev-tools/check-pdi-checks.mjs` (part of `npm run check`, now 8 scripts). It requires that:
  - every key exists
  - every link sits next to a ⚠️
  - every recipe is used
  - every recipe has steps, "see" and cleanup
  - recipe scripts avoid syntax her PDI rejects

## Recipes and where they show

**Small tests (they create something, then clean up):**

| Recipe | Shown in |
|---|---|
| `submit-rerun`: does `g_form.submit()` re-run onSubmit? | "onSubmit Client Scripts & Use Cases" (card, Q7, Q13, "Duplicate check" solution), glossary `g_form.submit()` |
| `async-submit`: does `return false` in a callback stop the save? | "onSubmit Client Scripts & Use Cases" (card, Q6), "Client Side Scripting Best Practices" (card, Q12) |
| `list-edit`: onCellEdit value, onChange / UI Policy skipped, Data Policy on list edit | "onCellEdit Client Scripts" (card, Q8, Q9, Q14, "Role check" solution), glossary `onCellEdit` |
| `clearvalue-onchange`: does `clearValue()` fire onChange? | "onChange Client Script — Use Cases" Q12 |
| `onload-vs-uipolicy`: who wins on form load? | "onLoad Client Script — Use Cases" Q15 |
| `uipolicy-empty-mandatory`: can a UI Policy hide / lock an empty mandatory field? | Stage 1 "UI Policies" Q6, exercise ui-policies-1 |
| `ui-action-no-autosave`: does a server UI Action save without `update()`? | "UI Actions — Part 1" card "⚠️ Gurtupettukovali" |
| `list-choice-per-record`: does a List choice action run once per record? | "UI Actions on the Table List" (card, Q12) |
| `process-flow-save`: does the highlight change only after save? | Stage 1 "Process Flow" tour step 30, exercise process-flow-2 |
| `table-delete`: is elevation needed? Do the ACLs go too? | Stage 1 Final cleanup card (table-creation-4) |

**Look-only (nothing is changed):**

| Recipe | Shown in |
|---|---|
| `requires-role` | "UI Actions — Part 1" and "Part 4" cards, Part 4 Q3, glossary "Requires role" |
| `field-watcher` | "Client & Server Side Debugging" card, glossary "Field Watcher" |
| `monaco-suggest` | Stage 2 "Comments, Data Types & Variables" card, "Syntax Editor Macros" card |
| `new-record-menu` | Stage 1 "Save, Submit, Update, Insert & Stay" tour step 3 |
| `filter-panel` | Stage 1 "Table Filters" tour step 4 |

## Docs-only facts: reworded from ⚠️ to 📄
These say "📄 docs nunchi — PDI lo easy ga test cheyyalem", and glossary entries use `check: 'docs'`, which shows 📄:
- `getXMLWait` / synchronous GlideRecord / `getReference` without a callback don't work in Service Portal / Workspace:
  - lessons-cs-c (card and the "Duplicate check" explanation)
  - lessons-cs-e (Best Practices cards and the getReference exercise task)
  - quiz-extra-cs Q (two), quiz-extra-cs-ui (one)
  - glossary `ga.getXMLWait()` and `ga.getAnswer()`
- Jelly phase-1 results may be cached (lessons-cs-e, "Jelly phase 1 vs phase 2").
- A UI Action's "Isolate script" works like the Client Script one (lessons-cs-d, "Options" card).
- `g_user.hasRoles()` returns false for a user with no roles (glossary).
- `setWorkflow(false)` also skips workflows and notifications (glossary).

One more wording change in the "Role check" onCellEdit explanation: calling `callback` twice is no longer something to test. It now
just says to always call it once.

## ⚠️ notes left without a box (by design)
`node dev-tools/check-pdi-checks.mjs --list` prints them (14):
- **The exercise step itself shows the answer:** option names (un-group, Form Layout section "New...", saved-filter menu), the exact
  "Data Policy Exception" text, UI Policy Order, Debug UI Macro output.
- **Developer portal or browser:** admin password reset, hibernate / reclaim timing, the learning-site URL.
- **SN Utils `/tn`:** needs the extension, and the note says to look in its "/" list.
- One false match on the JavaScript `confirm()` dialog.

## Verification
- `node dev-tools/check-all.mjs`: all 8 checks pass. The esbuild compile check of the whole app passes.
- Server-rendered with React 18 (79 checks, all pass):
  - every Stage 2/3 Learn tab shows the expected number of boxes, all closed
  - the PDI cards, glossary rows and Stage 1 tour bubbles show theirs
  - the bubble has a max height
- **Not done:** a real browser click-through, because the Chrome extension was offline. Quiz and solution boxes only appear after a
  click, so they're on the click-test list (REVIEW-NOTES.md item 9).
- **Not run in her PDI:** the recipes themselves. Their navigation and labels come from pdi-facts-brazil.md where verified; the rest
  ("Watch" option, Requires role location …) is exactly what the recipe asks her to look for.
