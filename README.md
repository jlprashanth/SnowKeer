# SnowKeer

Interactive ServiceNow practice site for learning ServiceNow (Admin + Developer), following the Udemy course
**"Total ServiceNow Developer and Admin course with JavaScript"**. Lessons are written in Tenglish (Telugu in English letters).

**Live site:** https://jlprashanth.github.io/SnowKeer/

## What's inside

| Stage | Topic | Status |
|---|---|---|
| 1 | Introduction: guided mock-ServiceNow lessons, quiz, and hands-on exercises for a real PDI | Done |
| 2 | JavaScript, ServiceNow style: learn cards, quiz, in-browser coding exercises (`gs`, `GlideRecord`) | Done |
| 3 | Client scripting & UI: g_form / g_user / GlideAjax / UI Actions / UI Pages — coding exercises against a live mock form, plus real-PDI practice | Done |
| 4 | Server scripting | Planned |
| 5 | Service Catalog and Flow Designer | Planned |
| 6 | ITSM and Now Assist | Planned |

Progress is saved in the browser's `localStorage`. There is no backend and no login.

## Run locally

```
npm install
npm run dev        # dev server
npm run build      # production build into dist/
```

Checks (solutions pass and starters fail for every coding exercise, quizzes, glossary, Stage 1 exercise data, mock behaviour):

```
npm run check      # = node dev-tools/check-all.mjs (runs all dev-tools/check-*.mjs)
```

## Tech

React 19 + Vite 5, plain JS/JSX, no router. Stage pages use the Astryx design-system theme; the ServiceNow mock is unthemed.
CodeMirror 6 for the code editor; scripts run in a Web Worker against a mock ServiceNow API whose behaviour follows a real
Brazil PDI (see `docs/pdi-facts-brazil.md`). See `CLAUDE.md` for architecture and content conventions.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm run check`, builds the site and publishes it to
GitHub Pages. A failing check stops the deploy.

## Note

This is an unofficial learning aid, not affiliated with ServiceNow or the course author. Key ServiceNow behaviours were
checked in a Brazil PDI (`docs/pdi-facts-brazil.md`); anything marked ⚠️ in a lesson should still be confirmed in your own PDI.
