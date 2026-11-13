// Stage 2 glossary check — run: node dev-tools/check-glossary.mjs
// 1) every card `terms` key must exist in GLOSSARY_JS
// 2) every method / gs.* / ServiceNow word used in Stage 2 learn code, hints and solutions must have a glossary entry
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { GLOSSARY_JS } from '../src/data/glossary-js.js'
import { scanCalls } from '../src/data/glossary-scan.js'

let bad = 0
const fail = (m) => { bad++; console.log('FAIL', m) }

// normalise a usage like "trim" / "Object.keys" / "gs.info" into the glossary key style
const known = new Set(Object.keys(GLOSSARY_JS))
// a short method name is covered if it is a key, or a key ends with it ("Object.keys()", "Math.floor()", "JSON")
const has = (name) => [...known].some((k) => k === name || k === name + '()' || k.endsWith('.' + name + '()') || k.endsWith('.' + name))

// JS keywords and literals we do not need a glossary entry for (plain syntax, not a method)
const SKIP = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'require', 'console', 'JSON', 'Math', 'Array', 'Object'])

const missing = new Map()
const note = (lesson, word) => {
  if (!missing.has(word)) missing.set(word, new Set())
  missing.get(word).add(lesson)
}

for (const l of JS_LESSONS) {
  for (const c of l.learn || []) {
    for (const k of c.terms || []) if (!known.has(k)) fail(`${l.id}: card "${c.h}" terms key "${k}" not in glossary`)
  }

  // collect all text where code is shown to the learner
  const texts = []
  for (const c of l.learn || []) if (c.code) texts.push(c.code)
  for (const e of l.exercises || []) for (const k of ['task', 'hint', 'solution', 'starter']) if (e[k]) texts.push(String(e[k]))
  const text = texts.join('\n')

  // ServiceNow object names
  for (const w of ['GlideRecord', 'GlideElement', 'GlideSystem', 'Class.create', 'current']) {
    if (text.includes(w) && !known.has(w)) note(l.id, w)
  }
  // every obj.method( and bare call( must resolve to an exact glossary key (shared rule with the panel)
  for (const u of scanCalls(text).unknown) note(l.id, u)
  for (const m of text.matchAll(/\bgs\.([A-Za-z]+)\s*\(/g)) {
    if (!has('gs.' + m[1])) note(l.id, 'gs.' + m[1])
  }
}

for (const [word, lessons] of [...missing].sort()) {
  console.log(`MISSING "${word}" used in: ${[...lessons].join(', ')}`)
  bad++
}

console.log(bad ? `\n${bad} issue(s)` : `OK — ${Object.keys(GLOSSARY_JS).length} glossary terms cover all Stage 2 card terms and method calls`)
process.exit(bad ? 1 : 0)
