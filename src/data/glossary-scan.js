// Shared glossary matching. Used by the in-lesson glossary panel (LessonGlossary.jsx)
// and by dev-tools/check-glossary.mjs, so both always agree on what a page "uses".
import { GLOSSARY_JS } from './glossary-js.js'

const KNOWN = new Set(Object.keys(GLOSSARY_JS))

// Stage 3 client objects (g_form, g_user, g_list). Their entries are not written yet, so a call like
// g_form.getValue() must NOT fall back to the server getValue() entry (that would teach wrong behaviour).
const CLIENT_OBJ = /^g_/
// Plain syntax words that look like calls but are not API
const SYNTAX = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'require', 'console'])

// Names the code itself defines (function foo / foo: function) are the lesson's own code, not API
const ownNames = (text) =>
  new Set([...text.matchAll(/function\s+(\w+)|(\w+)\s*:\s*function/g)].map((m) => m[1] || m[2]))

// Returns { keys: Set of glossary keys found, unknown: Set of calls with no glossary entry }
export function scanCalls(text) {
  const keys = new Set()
  const unknown = new Set()
  const own = ownNames(text)

  // obj.method(  e.g. gs.info(  gr.getValue(  Object.keys(  g_form.setVisible(
  for (const m of text.matchAll(/\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*\(/g)) {
    const [, obj, meth] = m
    if (CLIENT_OBJ.test(obj) || SYNTAX.has(meth) || own.has(meth)) continue
    // GlideRecord/GlideElement entries are stored as bare names (getValue, query), so try the bare name too
    const hit = [`${obj}.${meth}()`, `${obj}.${meth}`, `${meth}()`, meth].find((c) => KNOWN.has(c))
    if (hit) keys.add(hit)
    else unknown.add(`${obj}.${meth}()`)
  }

  // bare call  Number(  parseInt(  String(
  for (const m of text.matchAll(/(?<![.\w])([A-Za-z_]\w*)\s*\(/g)) {
    const name = m[1]
    if (SYNTAX.has(name) || own.has(name)) continue
    const hit = [`${name}()`, name].find((c) => KNOWN.has(c))
    if (hit) keys.add(hit)
  }
  return { keys, unknown }
}

// Plain words (gr, current, const, GlideRecord...) — matched only in code, not in prose,
// because words like "new" or "next" are also normal English.
export function scanWords(code) {
  const keys = new Set()
  for (const k of KNOWN) {
    if (k.includes('(') || k.includes('.') || k.includes(' ')) continue
    if (new RegExp(`(?<![\\w.])${k.replace(/[$^]/g, '\\$&')}(?![\\w])`).test(code)) keys.add(k)
  }
  return keys
}

// Terms for one lesson page. Spoiler rule: uses learn code/body and exercise task/starter ONLY,
// never exercise hint or solution, so the panel cannot reveal the answer.
export function pageTermKeys(lesson) {
  const code = []
  const prose = []
  const curated = []
  for (const c of lesson.learn || []) {
    for (const k of c.terms || []) if (KNOWN.has(k)) curated.push(k)
    if (c.code) code.push(c.code)
    if (c.body) prose.push(...[].concat(c.body))
  }
  for (const e of lesson.exercises || []) {
    if (e.task) prose.push(String(e.task))
    if (e.starter) code.push(String(e.starter))
  }
  const out = new Set(curated)
  for (const k of scanCalls([...code, ...prose].join('\n')).keys) out.add(k)
  for (const k of scanWords(code.join('\n'))) out.add(k)
  return [...out]
}
