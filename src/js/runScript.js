// Runs a learner's script against the mock ServiceNow API and checks the exercise's tests.
// Pure function: used inside the Web Worker (browser) and in node (dev-tools/check-js.mjs).
import { GlideRecord, makeGs, makeRecord, freshDb } from './snowMock.js'

// ServiceNow's Class.create() — the classic Script Include pattern
const Class = {
  create() {
    return function () {
      return this.initialize.apply(this, arguments)
    }
  },
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// scenario: { current: {table, values}, previous: {table, values} }  (optional)
// tests: [{ label, logs: [..] }  |  { label, expr, expect }]
//   expr is evaluated AFTER the script, in the script's own scope (so it can read her variables / call her functions)
export function runScript({ code, scenario = {}, tests = [] }) {
  const logs = []
  const db = freshDb()
  const gs = makeGs(logs)
  class GR extends GlideRecord {
    constructor(table) { super(table, db) }
  }
  const mk = (s) => (s ? makeRecord(s.table || 'incident', s.values, db) : undefined)
  const current = mk(scenario.current)
  const previous = scenario.previous ? mk(scenario.previous) : current ? makeRecord(scenario.current.table || 'incident', scenario.current.values, db) : undefined

  let evaluate = null
  let error = null
  try {
    // `evaluate` shares the script's scope (direct eval inside the closure)
    const body = `${code}\n;return function(__e){ return eval(__e) }`
    // eslint-disable-next-line no-new-func
    const fn = new Function('gs', 'GlideRecord', 'current', 'previous', 'Class', 'fetch', 'XMLHttpRequest', 'importScripts', body)
    evaluate = fn(gs, GR, current, previous, Class)
  } catch (e) {
    error = `${e && e.name ? e.name : 'Error'}: ${e && e.message ? e.message : e}`
  }

  const logLines = logs.filter((l) => l.level === 'info' || l.level === 'warn' || l.level === 'error' || l.level === 'debug').map((l) => l.msg)
  const results = tests.map((t) => {
    if (error) return { label: t.label, pass: false, note: 'Script error valla run avvaledu' }
    try {
      if (t.logs) {
        const pass = same(logLines, t.logs)
        return { label: t.label, pass, got: logLines, expect: t.logs }
      }
      const got = evaluate(t.expr)
      return { label: t.label, pass: same(got, t.expect), got, expect: t.expect }
    } catch (e) {
      return { label: t.label, pass: false, note: `${e.name}: ${e.message}` }
    }
  })
  return { logs, error, results, passed: !error && results.length > 0 && results.every((r) => r.pass) }
}
