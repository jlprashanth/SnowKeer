// Lesson glossary panel check — run: node dev-tools/check-page-terms.mjs
// 1) client calls (g_form / g_user / g_list) resolve to their OWN entries, never to the server entry of the same method name
// 2) exercise hint / solution text never adds a term to the page list (no spoilers)
// 3) Stage 2 pages never list Stage 3-only entries; every page term is a real glossary key; prints the count per lesson
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'
import { scanCalls, pageTermKeys, cardTermKeys } from '../src/data/glossary-scan.js'
import { GLOSSARY_JS } from '../src/data/glossary-js.js'

let bad = 0
const fail = (m) => { bad++; console.log('FAIL', m) }

// 1) client calls use their own entries
const client = scanCalls('g_form.getValue("priority"); g_form.addInfoMessage("x"); g_user.hasRole("itil"); g_list.getChecked();')
for (const k of ['g_form', 'g_user', 'g_list', 'g_form.getValue()', 'g_form.addInfoMessage()', 'g_user.hasRole()', 'g_list.getChecked()']) {
  if (!client.keys.has(k)) fail(`expected client entry "${k}" to be found`)
}
for (const k of ['getValue', 'gs.addInfoMessage', 'gs.hasRole']) {
  if (client.keys.has(k)) fail(`client call wrongly resolved to server entry "${k}"`)
}
// an unwritten client method is reported as unknown (never silently mapped to a server entry)
if (!scanCalls('g_form.notARealMethod();').unknown.has('g_form.notARealMethod()')) fail('unknown g_form method should be reported as unknown')

// a normal GlideRecord call still resolves (guards against over-skipping)
const server = scanCalls('var gr = new GlideRecord("incident"); gr.getValue("priority"); gs.info("hi");')
if (!server.keys.has('getValue')) fail('gr.getValue() should resolve to the getValue entry')
if (!server.keys.has('gs.info')) fail('gs.info() should resolve to the gs.info entry')

// 2) spoiler rule: a method that only appears in a hint / solution must not be listed for the page
const fake = {
  id: 'fake', stage: 3, learn: [{ h: 'x', body: ['Basic text.'], code: 'var a = 1;' }],
  exercises: [{ id: 'fake-1', task: 'Print a value.', starter: '// your code', hint: 'Try g_form.flash', solution: 'g_form.setMandatory("x", true); gr.addNullQuery("x");' }],
}
const fakeKeys = pageTermKeys(fake)
for (const k of ['g_form.setMandatory()', 'g_form.flash()', 'addNullQuery', 'g_form']) {
  if (fakeKeys.includes(k)) fail(`solution/hint leaked into page terms: ${k}`)
}

// 4) per-card sub-box: hand-written terms win; auto picks skip JS words, respect the stage, stay within 6, need 2+
const hand = cardTermKeys({ terms: ['GlideAjax', 'nope-not-a-key'], body: [], code: '' }, 3)
if (hand.join() !== 'GlideAjax') fail('hand-written card.terms should win and drop unknown keys')
let cardBoxes = 0
for (const l of [...JS_LESSONS, ...CS_LESSONS]) {
  for (const c of l.learn) {
    const keys = cardTermKeys(c, l.stage)
    if (keys.length) cardBoxes++
    if (!c.terms && keys.length === 1) fail(`${l.id}: auto card box should have 2+ terms: ${c.h}`)
    if (!c.terms && keys.length > 6) fail(`${l.id}: auto card box has more than 6 terms: ${c.h}`)
    for (const k of keys) {
      if (!GLOSSARY_JS[k]) fail(`${l.id}: card key "${k}" is not in glossary`)
      if (!c.terms && GLOSSARY_JS[k]?.g === 'js') fail(`${l.id}: auto card box lists a plain JS word "${k}"`)
      if ((l.stage || 2) < 3 && GLOSSARY_JS[k]?.s) fail(`${l.id}: Stage 2 card lists Stage 3-only entry "${k}"`)
    }
  }
}
console.log(`card sub-boxes: ${cardBoxes}`)

// 3) Stage 2 pages leave out Stage 3-only entries; every key is real; print counts
const report = []
for (const l of [...JS_LESSONS, ...CS_LESSONS]) {
  const keys = pageTermKeys(l)
  for (const k of keys) {
    if (!GLOSSARY_JS[k]) fail(`${l.id}: page key "${k}" is not in glossary`)
    else if ((l.stage || 2) < 3 && GLOSSARY_JS[k].s) fail(`${l.id}: Stage 2 page lists Stage 3-only entry "${k}"`)
  }
  report.push(`${l.id.padEnd(14)} ${String(keys.length).padStart(3)} terms${keys.length === 0 ? '  (empty: shows the "full glossary" hint)' : ''}`)
}
console.log(report.join('\n'))

console.log(bad ? `\n${bad} issue(s)` : 'OK — lesson glossary matching passes all checks')
process.exit(bad ? 1 : 0)
