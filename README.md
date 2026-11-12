# SnowKeer

Interactive ServiceNow practice site for learning ServiceNow (Admin + Developer), following the Udemy course
**"Total ServiceNow Developer and Admin course with JavaScript"**. Lessons are written in Tenglish (Telugu in English letters).

**Live site:** https://jlprashanth.github.io/SnowKeer/

## What's inside

| Stage | Topic | Status |
|---|---|---|
| 1 | Introduction: guided mock-ServiceNow lessons, quiz, and hands-on exercises for a real PDI | Done |
| 2 | JavaScript, ServiceNow style: learn cards, quiz, in-browser coding exercises (`gs`, `GlideRecord`) | Done |
| 3 | Client scripting | Next |
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

Sanity checks:

```
node dev-tools/check-js.mjs         # Stage 2 solutions pass, starters fail
node dev-tools/check-exercises.mjs  # Stage 1 exercise data
```

## Tech

React 18 + Vite 5, plain JS/JSX, no router, no CSS framework. CodeMirror 6 for the code editor; scripts run in a Web Worker
against a mock ServiceNow API. See `CLAUDE.md` for architecture and content conventions.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

## Note

This is an unofficial learning aid, not affiliated with ServiceNow or the course author. ServiceNow steps are written from
memory (Brazil release); confirm anything uncertain in your own PDI.
