// Stage 3 sanity check — run: node dev-tools/check-cs.mjs
// Every client-script exercise: reference solution must pass ALL tests, starter must NOT pass.
import { CS_LESSONS } from '../src/data/lessons-cs.js'
import { runScript } from '../src/js/runScript.js'

let bad = 0
let n = 0
const fail = (m) => { bad++; console.log('FAIL', m) }
const ids = new Set()
for (const l of CS_LESSONS) {
  if (!l.learn?.length) fail(l.id + ': no learn cards')
  if (l.quiz?.length !== 5) fail(l.id + ': quiz should have 5 questions')
  if (l.exercises.length < (l.mode === 'pdi' ? 3 : 4)) fail(l.id + ': too few exercises')
  l.quiz.forEach((x, i) => { if (!(x.answer >= 0 && x.answer < x.options.length)) fail(`${l.id} quiz ${i}: bad answer index`) })
  for (const e of l.exercises) {
    n++
    if (l.mode === 'pdi') {
      if (ids.has(e.id)) fail('duplicate id ' + e.id)
      ids.add(e.id)
      for (const k of ['title', 'scenario', 'hint', 'answer', 'cleanup']) if (!String(e[k] || '').trim()) fail(`${e.id}: empty ${k}`)
      if (!e.steps?.length) fail(`${e.id}: no steps`)
      if (/Prerequisite/i.test(e.scenario + e.hint + e.steps.join(' ')) === false && /prerequisite/i.test(e.title)) fail(`${e.id}: bad prereq`)
      continue
    }
    if (ids.has(e.id)) fail('duplicate id ' + e.id)
    ids.add(e.id)
    for (const k of ['title', 'task', 'starter', 'solution', 'hint', 'explain']) if (!String(e[k] || '').trim()) fail(`${e.id}: empty ${k}`)
    if (!e.client && !e.server) fail(`${e.id}: needs client trigger or server:true`)
    if (!e.tests?.length) { fail(`${e.id}: no tests`); continue }
    const run = (code) => runScript({ code, scenario: e.scenario, tests: e.tests, client: e.client })
    const sol = run(e.solution)
    if (!sol.passed) {
      fail(`${e.id}: solution does not pass`)
      if (sol.error) console.log('   error:', sol.error)
      sol.results.filter((r) => !r.pass).forEach((r) => console.log('   ✗', r.label, JSON.stringify(r.got), '≠', JSON.stringify(r.expect), r.note || ''))
    }
    if (run(e.starter).passed) fail(`${e.id}: starter already passes`)
  }
}
console.log(`${CS_LESSONS.length} lessons, ${n} exercises, ${bad} problems`)
process.exit(bad ? 1 : 0)
