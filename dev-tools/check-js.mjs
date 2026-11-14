// Stage 2 sanity check — run: node dev-tools/check-js.mjs
// For every JS exercise: the reference solution must pass ALL tests, the starter must NOT pass.
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { runScript } from '../src/js/runScript.js'
import { brazilSyntaxWarnings } from '../src/js/esCheck.js'

let bad = 0
let n = 0
const fail = (m) => { bad++; console.log('FAIL', m) }
const ids = new Set()

for (const l of JS_LESSONS) {
  if (!l.learn?.length) fail(l.id + ': no learn cards')
  if (!l.quiz?.length) fail(l.id + ': no quiz')
  if (l.exercises.length < 4) fail(l.id + ': fewer than 4 exercises')
  // exercises show in ARRAY order (the doing order) — the level badge must never go down along it
  const RANK = { easy: 0, medium: 1, 'medium+': 1.5, hard: 2 }
  l.exercises.forEach((e, i) => { if (i && RANK[e.level] < RANK[l.exercises[i - 1].level]) fail(`${e.id}: level '${e.level}' comes after '${l.exercises[i - 1].level}' — reorder the array or relabel`) })
  for (const e of l.exercises) {
    n++
    if (ids.has(e.id)) fail('duplicate id ' + e.id)
    ids.add(e.id)
    for (const k of ['title', 'task', 'starter', 'solution', 'hint', 'explain']) if (!String(e[k] || '').trim()) fail(`${e.id}: empty ${k}`)
    if (!['easy', 'medium', 'medium+', 'hard'].includes(e.level)) fail(`${e.id}: bad level`)
    if (!e.tests?.length) { fail(`${e.id}: no tests`); continue }
    // reference solutions must run in her PDI (Brazil, global scope): no let / destructuring / spread / class ...
    for (const w of brazilSyntaxWarnings(e.solution)) fail(`${e.id}: solution uses syntax her PDI rejects — ${w}`)
    const sol = runScript({ code: e.solution, scenario: e.scenario, tests: e.tests, variants: e.variants })
    if (!sol.passed) {
      fail(`${e.id}: solution does not pass`)
      if (sol.error) console.log('   error:', sol.error)
      sol.results.filter((r) => !r.pass).forEach((r) => console.log('   ✗', r.label, JSON.stringify(r.got), '≠', JSON.stringify(r.expect), r.note || ''))
    }
    const st = runScript({ code: e.starter, scenario: e.scenario, tests: e.tests, variants: e.variants })
    if (st.passed) fail(`${e.id}: starter already passes (nothing to do!)`)
  }
}
console.log(`${JS_LESSONS.length} lessons, ${n} exercises, ${bad} problems`)
process.exit(bad ? 1 : 0)
