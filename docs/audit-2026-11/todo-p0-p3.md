# To-do list from the audit, and what happened to each item

✅ done · 🔁 done differently (her PDI said otherwise) · ⏸ open

## P0 — wrong teaching, lost work, or no safety net
| # | Item | Status |
|---|---|---|
| 1 | Repair Node/npm on the work PC | ⏸ owner's task (testing on another PC) |
| 2 | PDI hibernate vs reclaim text + quiz | ✅ |
| 3 | Run checks in the deploy workflow | ✅ `npm run check` before build |
| 4 | Exercises in authored order | ✅ array order everywhere; the level-order check enforces it |
| 5 | Async GlideAjax / getReference in the mock | ✅ verified in the PDI |
| 6 | One element per field; `addOrCondition`; glossary example | ✅ |
| 7 | Idioms that work in the mock and the PDI (`.nil()`, `== true`) | ✅ |
| 8 | `oldValue` = load value (text + live form) | ✅ verified in the PDI (round 2) |
| 9 | Stage 1 OR logic (`^OR`, `^NQ`) | ✅ |
| 10 | Re-run checks; fix the solutions that broke | ✅ |

## P1 — before Stage 4
| # | Item | Status |
|---|---|---|
| 11 | Variants for Stage 2 | ✅ 37 of 56 exercises |
| 12 | Assert GlideAjax calls; other-data variants | ✅ `__x.ajaxCalls` |
| 13 | Server tests read the database | ✅ `current` = the stored record |
| 14 | Seed rows for variants | ✅ `scenario.seed` |
| 15 | `isLoading` runs | ✅ |
| 16 | Syntax warning in the editor | 🔁 only for syntax her PDI actually rejects; arrows / `const` / template literals work there |
| 17 | Save her code per exercise | ✅ |
| 18 | onSubmit + GlideAjax card and exercise | ✅ (g_form.submit re-run still ⏸ unverified) |
| 19 | Real incident fields on the mock form | ✅ close_code, close_notes, hold_reason, work_notes, comments |
| 20 | Rebuild cs-ua5 list actions | ✅ |
| 21 | Fix cleanup chains | ✅ (Final cleanup card filed under Data Policies) |
| 22 | process-flow-2, save-submit-2 | ✅ (plus a Process Flow formatter record, round 2) |
| 23 | Stage 1 mock: priority, Insert copy, Process Flow | 🔁 priority 3/3 = 4 kept (PDI); Insert / Process Flow fixed |
| 24 | Short text fixes | ✅ |
| 25 | Final-cleanup checklist | ✅ |

## P2 — depth and UX
| Item | Status |
|---|---|
| Apply PDI-verified fixes | ✅ rounds 1 and 2 |
| Quiz depth: Stage 1 ≥ 8, Stage 3 ≥ 15 per lesson | ✅ 172 / 160 / 393 questions |
| Learn cards ≥ 3 per Stage 3 lesson | ✅ |
| Missing topics (`this`, GlideModal, Jelly phase 2, Update Set preview / commit, …) | ✅ |
| "Longest answer is right" rebalance | ✅ 24% / 16% / 15% |
| UX: Continue, backup, quiz retake, deep link, 👀 badge | ✅ |
| Starters and hints | ✅ |
| Data-driven stages | ✅ `src/data/stages.js` |

## P3 — housekeeping
| Item | Status |
|---|---|
| README / CLAUDE.md | ✅ |
| Dead files | ✅ deleted |
| `npm run check`; audit-quiz false positive | ✅ |
| Language and typos | ✅ |

## Still open
- The unverified "⚠️ PDI lo confirm chesuko" facts (list editing, `g_form.submit` re-run, UI Policy order, table-delete side effects,
  PDI reclaim timing, SN Utils, some navigation details). Listed in REVIEW-NOTES.md section 5. Since 2026-11-14 the testable ones have
  "🔍 PDI lo ela check cheyyali?" steps for the learner, and docs-only ones say 📄 (change-logs/pdi-check-steps.md). Still open
  until someone runs the steps.
- Real `npm run build` and a browser click-through with React 19 / Astryx / CodeMirror (click-test list in REVIEW-NOTES.md).
- Stages 4–6 (needs the Udemy lecture titles).
