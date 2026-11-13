// Stage 2 glossary check — run: node dev-tools/check-glossary.mjs
// 1) every card `terms` key must exist in GLOSSARY_JS
// 2) every method / gs.* / ServiceNow word used in Stage 2 learn code, hints and solutions must have a glossary entry
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { GLOSSARY_JS } from '../src/data/glossary-js.js'

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

  // gs.xxx and Class.create are glossary keys by full name
  for (const m of text.matchAll(/\bgs\.([A-Za-z]+)\s*\(/g)) {
    if (!has('gs.' + m[1])) note(l.id, 'gs.' + m[1])
  }
  // ServiceNow object names
  for (const w of ['GlideRecord', 'GlideElement', 'GlideSystem', 'Class.create', 'current']) {
    if (text.includes(w) && !known.has(w)) note(l.id, w)
  }
  // method calls on any object: x.method(  — the method name is the key
  // names the lesson defines itself (function foo / foo: function) are its own code, not API
  const own = new Set([...text.matchAll(/function\s+(\w+)|(\w+)\s*:\s*function/g)].map((m) => m[1] || m[2]))
  for (const m of text.matchAll(/\.([A-Za-z_]\w*)\s*\(/g)) {
    const name = m[1]
    if (name.startsWith('gs') || SKIP.has(name) || own.has(name)) continue
    if (!has(name)) note(l.id, '.' + name + '()')
  }
}

for (const [word, lessons] of [...missing].sort()) {
  console.log(`MISSING "${word}" used in: ${[...lessons].join(', ')}`)
  bad++
}

console.log(bad ? `\n${bad} issue(s)` : `OK — ${Object.keys(GLOSSARY_JS).length} glossary terms cover all Stage 2 card terms and method calls`)
process.exit(bad ? 1 : 0)
