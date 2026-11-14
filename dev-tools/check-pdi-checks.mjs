// "🔍 PDI lo ela check cheyyali?" recipes (src/data/pdi-checks.js) — run: node dev-tools/check-pdi-checks.mjs
// Every checks: ['key'] on content must name a recipe and sit next to a ⚠️ (glossary: check: true); every recipe must be linked.
// Recipes need a title, steps, what to see and cleanup; their scripts must avoid syntax her PDI rejects. Also counts the ⚠️
// "confirm" notes that have no box (fine when the exercise step itself is the check) — add --list to print them.
import { PDI_CHECKS } from '../src/data/pdi-checks.js'
import { LESSONS } from '../src/data/lessons.js'
import { EXERCISES } from '../src/data/exercises.js'
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'
import { GLOSSARY_JS } from '../src/data/glossary-js.js'
import { brazilSyntaxWarnings } from '../src/js/esCheck.js'

let bad = 0
const fail = (m) => { bad++; console.log('FAIL', m) }
const txt = (...xs) => xs.flat().filter((x) => typeof x === 'string').join(' ')

// [tag, item that may carry checks, the text shown with it]
const items = []
for (const l of LESSONS) {
  l.steps.forEach((s, i) => items.push([`${l.id} step ${i + 1}`, s, s.text]))
  l.quiz.forEach((x, i) => items.push([`${l.id} quiz ${i + 1}`, x, x.why]))
}
for (const e of EXERCISES) items.push([e.id, e, txt(e.scenario, e.hint, e.steps, e.answer, e.cleanup)])
for (const l of [...JS_LESSONS, ...CS_LESSONS]) {
  l.learn.forEach((c, i) => items.push([`${l.id} card ${i + 1} (${c.h})`, c, txt(c.body)]))
  l.quiz.forEach((x, i) => items.push([`${l.id} quiz ${i + 1}`, x, x.why]))
  l.exercises.forEach((e) => items.push([e.id, e, txt(e.task, e.scenario, e.hint, e.steps, e.answer, e.cleanup, e.explain)]))
}
for (const [k, g] of Object.entries(GLOSSARY_JS)) {
  if (g.check !== undefined && g.check !== true && g.check !== 'docs') fail(`glossary ${k}: check must be true or 'docs'`)
  items.push([`glossary ${k}`, g, g.check === true ? '⚠️' : g.m])
}

const used = new Map()
for (const [tag, it, text] of items) {
  if (it.checks === undefined) continue
  if (!Array.isArray(it.checks) || !it.checks.length) { fail(`${tag}: checks must be a non-empty array`); continue }
  for (const k of it.checks) {
    if (!PDI_CHECKS[k]) fail(`${tag}: unknown check "${k}"`)
    else used.set(k, (used.get(k) || 0) + 1)
  }
  if (!String(text || '').includes('⚠️')) fail(`${tag}: has checks but no ⚠️ next to it`)
}

for (const [k, c] of Object.entries(PDI_CHECKS)) {
  if (!used.get(k)) fail(`recipe "${k}" is not linked from any content`)
  if (!String(c.title || '').trim()) fail(`${k}: no title`)
  if (!Array.isArray(c.steps) || !c.steps.length) fail(`${k}: no steps`)
  else
    c.steps.forEach((s, i) => {
      const ok = typeof s === 'string' ? s.trim() : s && String(s.t || '').trim() && String(s.code || '').trim()
      if (!ok) fail(`${k}: step ${i + 1} is empty (a string, or { t, code })`)
      if (s && s.code) for (const w of brazilSyntaxWarnings(s.code)) fail(`${k}: step ${i + 1} code — ${w}`)
    })
  for (const f of ['see', 'cleanup']) if (String(c[f] || '').trim().length < 15) fail(`${k}: missing / too short "${f}"`)
}

const open = items.filter(([, it, text]) => !it.checks && /⚠️[^.]*confirm/i.test(String(text || '')))
if (process.argv.includes('--list')) for (const [tag] of open) console.log('  no box:', tag)
const links = [...used.values()].reduce((a, b) => a + b, 0)
console.log(`${Object.keys(PDI_CHECKS).length} recipes, ${links} links, ${bad} problems (${open.length} ⚠️ confirm notes without a 🔍 box)`)
process.exit(bad ? 1 : 0)
