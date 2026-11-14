# SnowKeer audit and fixes — November 2026

Record of the audit done on 2026-11-13 and the fixes made on 2026-11-13/14 (branch `overnight-fixes`).

| File | What it is |
|---|---|
| [audit.md](audit.md) | The original audit: what the site is, what was done, what wasn't, the gaps found |
| [todo-p0-p3.md](todo-p0-p3.md) | The prioritised to-do list (P0–P3) and what happened to each item |
| [../pdi-facts-brazil.md](../pdi-facts-brazil.md) | ServiceNow behaviour verified in her Brazil PDI (the source of truth for content) |
| [../../REVIEW-NOTES.md](../../REVIEW-NOTES.md) | Review checklist for the branch: open ⚠️ items, UI decisions, click-test list |
| [change-logs/](change-logs/) | Per-area notes from the work, with file:line detail |

How the work ran:

1. **Audit (2026-11-13):** read the app and mocks, ran every check, and four parallel reviewers read all lesson content.
2. **PDI check, round 1 (night of 2026-11-13):** read-only Background Scripts and form checks in her PDI → pdi-facts items 1–37.
3. **Fixes (overnight):**
   - I rewrote the mocks and tooling myself.
   - Nine helpers each owned a set of files; their change logs are named:
     - `review-S1-GUIDED` (Stage 1 lessons and engine)
     - `review-S1-PDI` (Stage 1 real-PDI exercises)
     - `review-S2` (Stage 2)
     - `review-S3-CLIENT` (Stage 3 client lessons)
     - `review-S3-SERVER` (Stage 3 UI Actions / CRUD / PDI lessons)
     - `review-Q-S1`, `review-Q-S3-CLIENT`, `review-Q-S3-UI` (new quiz questions)
     - `review-UX` (app UI)
4. **PDI check, round 2 (morning of 2026-11-14):**
   - Read-only checks, plus temporary records that were deleted afterwards → pdi-facts items 38–53.
   - Verdicts are in `change-logs/verify-round2.md`.
   - Applied to content in `review-R1` to `review-R4`.
5. **Verification:**
   - All 7 `npm run check` scripts pass, and the whole app compiles (esbuild).
   - Stages 1–3 were clicked through in a browser harness (React 18 with stand-ins for the Astryx theme, CodeMirror and the Web Worker).
   - All 18 Stage 1 lessons auto-play to their quiz.
   - Not run: the real `npm run build` (npm was broken on the work PC).
6. **How-to-check steps (later on 2026-11-14):** the ⚠️ facts she can test got "🔍 PDI lo ela check cheyyali?" boxes, and the
   docs-only ones were reworded to 📄. See `change-logs/pdi-check-steps.md`. `npm run check` now runs 8 scripts.

The change logs are kept as written during the work. Some line numbers have moved since, and some "requests" in them were handled afterwards (see todo-p0-p3.md).
