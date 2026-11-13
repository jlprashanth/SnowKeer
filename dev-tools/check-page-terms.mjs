// Lesson glossary panel check — run: node dev-tools/check-page-terms.mjs
// 1) Stage 3 client calls (g_form / g_user / g_list) never resolve to a server glossary entry
// 2) exercise hint / solution text never adds a term to the page list (no spoilers)
// 3) every page term is a real glossary key; prints the count per lesson
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'
import { scanCalls, pageTermKeys } from '../src/data/glossary-scan.js'
import { GLOSSARY_JS } from '../src/data/glossary-js.js'

let bad = 0
const fail = (m) => { bad++; console.log('FAIL', m) }

// 1) client-object calls must not resolve to server entries
const client = scanCalls('g_form.getValue("priority"); g_form.addInfoMessage("x"); g_user.hasRole("itil"); g_list.setFilterAndRefresh("a");')
if (client.keys.size) fail(`g_* calls resolved to glossary keys: ${[...client.keys].join(', ')}`)
if (client.unknown.size) fail(`g_* calls were reported as unknown (should be skipped): ${[...client.unknown].join(', ')}`)

// a normal GlideRecord call still resolves (guards against over-skipping)
const server = scanCalls('var gr = new GlideRecord("incident"); gr.getValue("priority"); gs.info("hi");')
if (!server.keys.has('getValue')) fail('gr.getValue() should resolve to the getValue entry')
if (!server.keys.has('gs.info')) fail('gs.info() should resolve to the gs.info entry')

// 2) spoiler rule: a method that only appears in a solution must not be listed for the page
const fake = {
  id: 'fake', learn: [{ h: 'x', body: ['Basic text.'], code: 'var a = 1;' }],
  exercises: [{ id: 'fake-1', task: 'Print a value.', starter: '// your code', hint: 'Try gr.addQuery', solution: 'gr.addNullQuery("x");' }],
}
const fakeKeys = pageTermKeys(fake)
if (fakeKeys.includes('addNullQuery') || fakeKeys.includes('addQuery')) fail(`solution/hint leaked into page terms: ${fakeKeys.join(', ')}`)

// 3) every returned key is a real glossary key, and print counts
const report = []
for (const l of [...JS_LESSONS, ...CS_LESSONS]) {
  const keys = pageTermKeys(l)
  for (const k of keys) if (!GLOSSARY_JS[k]) fail(`${l.id}: page key "${k}" is not in glossary`)
  report.push(`${l.id.padEnd(14)} ${String(keys.length).padStart(3)} terms${keys.length === 0 ? '  (empty: shows the "full glossary" hint)' : ''}`)
}
console.log(report.join('\n'))

console.log(bad ? `\n${bad} issue(s)` : 'OK — lesson glossary matching passes all checks')
process.exit(bad ? 1 : 0)
