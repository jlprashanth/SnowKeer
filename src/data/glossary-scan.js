// Shared glossary matching. Used by the in-lesson glossary panel (LessonGlossary.jsx)
// and by the dev-tools checks, so everything agrees on what a page "uses".
import { GLOSSARY_JS } from './glossary-js.js'

const KNOWN = new Set(Object.keys(GLOSSARY_JS))

// Client objects (g_form, g_user, g_list, g_scratchpad) have their OWN entries ('g_form.getValue()' ...).
// A call like g_form.getValue() must never fall back to the server getValue entry — different API, different behaviour.
const CLIENT_OBJ = /^g_/
// Plain syntax words that look like calls but are not API
const SYNTAX = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'require', 'console'])
// Words that are safe to find in normal prose too (never ordinary English): g_form, sys_id, onChange, GlideAjax, Jelly...
const PROSE_SAFE = /_|^on[A-Z]|^[A-Z]/

// Names the code itself defines (function foo / foo: function) are the lesson's own code, not API
const ownNames = (text) =>
  new Set([...text.matchAll(/function\s+(\w+)|(\w+)\s*:\s*function/g)].map((m) => m[1] || m[2]))

// Returns { keys: Set of glossary keys found, unknown: Set of calls with no glossary entry }
export function scanCalls(text) {
  const keys = new Set()
  const unknown = new Set()
  const own = ownNames(text)

  // obj.method(  e.g. gs.info(  gr.getValue(  Object.keys(  g_form.setVisible(  ga.addParam(
  for (const m of text.matchAll(/\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*\(/g)) {
    const [, obj, meth] = m
    if (SYNTAX.has(meth) || own.has(meth)) continue
    if (CLIENT_OBJ.test(obj)) {
      // client object: exact entry only (never the bare server name); also show the object's own overview entry
      if (KNOWN.has(obj)) keys.add(obj)
      if (KNOWN.has(`${obj}.${meth}()`)) keys.add(`${obj}.${meth}()`)
      else unknown.add(`${obj}.${meth}()`)
      continue
    }
    // GlideRecord/GlideElement entries are stored as bare names (getValue, query), so try the bare name too.
    // `ga.` is the usual GlideAjax variable name, so it is the last fallback for any other variable name.
    const hit = [`${obj}.${meth}()`, `${obj}.${meth}`, `${meth}()`, meth, `ga.${meth}()`].find((c) => KNOWN.has(c))
    if (hit) keys.add(hit)
    else unknown.add(`${obj}.${meth}()`)
  }

  // bare call  Number(  parseInt(  String(  confirm(  gsftSubmit(
  for (const m of text.matchAll(/(?<![.\w])([A-Za-z_]\w*)\s*\(/g)) {
    const name = m[1]
    if (SYNTAX.has(name) || own.has(name)) continue
    const hit = [`${name}()`, name].find((c) => KNOWN.has(c))
    if (hit) keys.add(hit)
  }
  return { keys, unknown }
}

// Plain words (gr, current, const, GlideRecord, g_user, onChange...). Normal lowercase words (new, next, get...) are
// matched only in code, because they are also ordinary English; names that are never English (PROSE_SAFE) match in prose too.
export function scanWords(code, prose = '') {
  const keys = new Set()
  for (const k of KNOWN) {
    if (k.includes('(') || k.includes('.') || k.includes(' ')) continue
    const text = PROSE_SAFE.test(k) ? code + '\n' + prose : code
    if (new RegExp(`(?<![\\w.])${k.replace(/[$^]/g, '\\$&')}(?![\\w])`).test(text)) keys.add(k)
  }
  return keys
}

// Two-word terms (UI Action, Client Script, Business Rule...) — matched literally in code or prose.
export function scanPhrases(text) {
  const keys = new Set()
  for (const k of KNOWN) {
    if (!k.includes(' ') || k.includes('(') || k.includes('/')) continue
    if (text.includes(k)) keys.add(k)
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
  const codeText = code.join('\n')
  const proseText = prose.join('\n')
  const out = new Set(curated)
  for (const k of scanCalls(codeText + '\n' + proseText).keys) out.add(k)
  for (const k of scanWords(codeText, proseText)) out.add(k)
  for (const k of scanPhrases(codeText + '\n' + proseText)) out.add(k)
  // Stage 3-only entries (s: 3) are not in the Stage 2 full glossary, so Stage 2 pages leave them out too
  const stage = lesson.stage || 2
  return [...out].filter((k) => stage >= 3 || !GLOSSARY_JS[k]?.s)
}

// Terms for ONE learn card (the "📘 Ee topic lo words" sub-box).
// A hand-written card.terms list always wins; otherwise the card's own code + text is scanned.
// Plain JavaScript words (var, return, ===) are left out — the sub-box is for the ServiceNow words and methods that
// card introduces. Cards with fewer than 2 such terms get no box; at most `max` are shown.
export function cardTermKeys(card, stage = 2, max = 6) {
  if (card.terms) return card.terms.filter((k) => KNOWN.has(k))
  const code = card.code || ''
  const prose = [].concat(card.body || []).join('\n')
  const found = new Set()
  for (const k of scanCalls(code + '\n' + prose).keys) found.add(k)
  for (const k of scanWords(code, prose)) found.add(k)
  for (const k of scanPhrases(code + '\n' + prose)) found.add(k)
  const keys = [...found].filter((k) => {
    const e = GLOSSARY_JS[k]
    return e && e.g !== 'js' && (stage >= 3 || !e.s)
  })
  // an overview entry (g_form, gs) is dropped when the card already shows that object's own methods (g_form.setValue(), gs.info)
  const specific = keys.filter((k) => !keys.some((o) => o !== k && o.startsWith(k + '.')))
  return specific.length >= 2 ? specific.slice(0, max) : []
}
