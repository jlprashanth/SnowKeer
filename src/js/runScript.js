// Runs a learner's script against the mock ServiceNow API and checks the exercise's tests.
// Pure function: used inside the Web Worker (browser) and in node (dev-tools/check-js.mjs).
import { GlideRecord, makeGs, makeRecord, freshDb } from './snowMock.js'
import { makeClient } from './clientMock.js'

// ServiceNow's Class.create() — the classic Script Include pattern
const Class = {
  create() {
    return function () {
      return this.initialize ? this.initialize.apply(this, arguments) : undefined
    }
  },
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// scenario: { current: {table, values}, previous: {table, values} }  (optional)
// tests: [{ label, logs: [..] }  |  { label, expr, expect }]
//   expr is evaluated AFTER the script, in the script's own scope (so it can read her variables / call her functions)
// variants (optional): [{ name, scenario?, client?, tests }] — the SAME code is run again under a different scenario
// (e.g. "condition is false") so a solution that ignores the condition cannot pass. Each variant's tests are added to the
// results, labelled "[name] ...". scenario keys are replaced (shallow merge); client replaces the whole client config.
export function runScript({ code, scenario = {}, tests = [], client, variants }) {
  const main = runOnce({ code, scenario, tests, client })
  if (!variants || !variants.length || !tests.length) return main
  const results = [...main.results]
  for (const v of variants) {
    const r = runOnce({ code, scenario: { ...scenario, ...(v.scenario || {}) }, tests: v.tests || [], client: v.client || client })
    const label = v.name || 'variant'
    if (r.error) results.push({ label: `[${label}] script run avvaledu`, pass: false, note: r.error })
    else results.push(...r.results.map((x) => ({ ...x, label: `[${label}] ${x.label}` })))
  }
  return { ...main, results, passed: !main.error && results.length > 0 && results.every((x) => x.pass) }
}

function runOnce({ code, scenario = {}, tests = [], client }) {
  if (client) return runClientScript({ code, scenario, tests, client })
  const logs = []
  const db = freshDb()
  const gs = makeGs(logs)
  class GR extends GlideRecord {
    constructor(table) { super(table, db) }
  }
  const mk = (s) => (s ? makeRecord(s.table || 'incident', s.values, db) : undefined)
  const current = mk(scenario.current)
  const previous = scenario.previous ? mk(scenario.previous) : current ? makeRecord(scenario.current.table || 'incident', scenario.current.values, db) : undefined
  if (current && previous) current._previous = previous // lets current.field.changes() compare with previous

  let evaluate = null
  let error = null
  try {
    // `evaluate` shares the script's scope (direct eval inside the closure)
    const body = `${code}\n;return function(__e){ return eval(__e) }`
    // eslint-disable-next-line no-new-func
    const action = { setRedirectURL: (r) => { logs.push({ level: 'ui', msg: 'redirect → ' + (r && r.getValue ? r.getValue('number') || r.getTableName() : String(r)) }) }, setReturn: () => {} }
    function AbstractAjaxProcessor() {}
    AbstractAjaxProcessor.prototype.getParameter = function (n) { return this.__params ? this.__params[n] : undefined }
    const extendsObject = (base, o) => Object.assign(Object.create(base.prototype), o)
    const callAjax = (Ctor, method, params) => { const inst = new Ctor(); inst.__params = params || {}; return inst[method]() }
    const fn = new Function('gs', 'GlideRecord', 'current', 'previous', 'Class', 'action', 'AbstractAjaxProcessor', '__ext', 'callAjax', 'fetch', 'XMLHttpRequest', 'importScripts', 'Object.extendsObject = __ext;' + body)
    evaluate = fn(gs, GR, current, previous, Class, action, AbstractAjaxProcessor, extendsObject, callAjax)
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

/* ------------------------------------------------------------------ */
// CLIENT-side run (Stage 3): Client Scripts, onSubmit ... against a mock form.
// client = { trigger: { type: 'onLoad' | 'onChange' | 'onSubmit' | 'onCellEdit', field?, oldValue?, newValue? }, formValues?: {..} }
// scenario.form / scenario.user / scenario.scratchpad / scenario.scriptInclude: { name, code }  (for GlideAjax)
// Tests: { label, logs:[..] } | { label, expr, expect }.  In `expr` you can use g_form, g_user and:
//   __f.<field>.{value,mandatory,readOnly,visible,display}, __msgs (form messages), __submit (false when onSubmit returned false)
export function runClientScript({ code, scenario = {}, tests = [], client = {} }) {
  const logs = []
  const db = freshDb()
  const trigger = client.trigger || { type: 'onLoad' }
  const form = { ...(scenario.form || {}), values: { ...((scenario.form || {}).values || {}), ...(client.formValues || {}) } }

  // Script Include for GlideAjax: server code + AbstractAjaxProcessor
  const makeServer = (si, params) => {
    const gs = makeGs(logs)
    class GR extends GlideRecord { constructor(t) { super(t, db) } }
    function AbstractAjaxProcessor() {}
    AbstractAjaxProcessor.prototype.getParameter = function (n) { return this.__params[n] }
    const extendsObject = (base, o) => Object.assign(Object.create(base.prototype), o)
    // eslint-disable-next-line no-new-func
    const fn = new Function('gs', 'GlideRecord', 'Class', 'AbstractAjaxProcessor', 'extendsObject', `Object.extendsObject = extendsObject;\n${si.code}\n;return new ${si.name}();`)
    const inst = fn(gs, GR, Class, AbstractAjaxProcessor, extendsObject)
    inst.__params = params
    const m = inst[params.sysparm_name]
    if (typeof m !== 'function') throw new Error(`Script Include '${si.name}' lo '${params.sysparm_name}' function ledu`)
    return m.call(inst)
  }

  const c = makeClient({ form, user: scenario.user, scratchpad: scenario.scratchpad, list: scenario.list, confirmAnswer: scenario.confirmAnswer, db, logs, scriptInclude: scenario.scriptInclude, makeServer })
  let rt = null
  let error = null
  let submit = true
  const errOf = (e) => `${e && e.name ? e.name : 'Error'}: ${e && e.message ? e.message : e}`
  try {
    const body = `var __f = __c.fieldsRaw, __msgs = __c.messages, __x = __c.extra, __submit = true;
${code}
;return {
  evaluate: function (__e) { return eval(__e) },
  setSubmit: function (v) { __submit = v },
  onLoad: typeof onLoad === 'function' ? onLoad : null,
  onChange: typeof onChange === 'function' ? onChange : null,
  onSubmit: typeof onSubmit === 'function' ? onSubmit : null,
  onCellEdit: typeof onCellEdit === 'function' ? onCellEdit : null
}`
    // eslint-disable-next-line no-new-func
    const fn = new Function('g_form', 'g_user', 'g_scratchpad', 'alert', 'confirm', 'jslog', 'GlideAjax', 'g_list', 'gsftSubmit', 'window', '__c', 'fetch', 'XMLHttpRequest', 'importScripts', body)
    rt = fn(c.g_form, c.g_user, c.g_scratchpad, c.alert, c.confirm, c.jslog, c.GlideAjax, c.g_list, c.gsftSubmit, {}, c)
  } catch (e) {
    error = errOf(e)
  }
  const need = (name) => { if (!rt[name]) { error = `${name}() function nuvvu define cheyyaledu`; return false } return true }
  if (!error && rt) {
    try {
      if (trigger.type === 'onChange') {
        if (rt.onChange || !client.interactive ? need('onChange') : false) {
          const f = c.fieldsRaw[trigger.field]
          if (f) f.value = String(trigger.newValue ?? '')
          rt.onChange({ name: trigger.field }, String(trigger.oldValue ?? ''), String(trigger.newValue ?? ''), false, false)
        }
      } else if (trigger.type === 'onSubmit') {
        if (need('onSubmit')) { submit = rt.onSubmit() !== false; rt.setSubmit(submit) }
      } else if (trigger.type === 'onCellEdit') {
        if (need('onCellEdit')) {
          let verdict = null
          rt.onCellEdit(trigger.sysIDs || ['inc1'], trigger.table || 'incident', trigger.oldValues || [''], trigger.newValue, (ok) => { verdict = ok }, trigger.field)
          submit = verdict !== false
          rt.setSubmit(submit)
        }
      } else if (trigger.type === 'call') {
        const fnc = rt.evaluate('typeof ' + trigger.fn + " === 'function' ? " + trigger.fn + ' : null')
        if (!fnc) error = trigger.fn + '() function nuvvu define cheyyaledu'
        else fnc.apply(null, trigger.args || [])
      } else if (rt.onLoad || need('onLoad')) {
        rt.onLoad()
      }
    } catch (e) {
      error = errOf(e)
    }
  }

  const logLines = logs.filter((l) => ['info', 'warn', 'error', 'debug', 'alert', 'confirm'].includes(l.level)).map((l) => l.msg)
  const results = tests.map((t) => {
    if (error) return { label: t.label, pass: false, note: 'Script error valla run avvaledu' }
    try {
      if (t.logs) return { label: t.label, pass: same(logLines, t.logs), got: logLines, expect: t.logs }
      const got = rt.evaluate(t.expr)
      return { label: t.label, pass: same(got, t.expect), got, expect: t.expect }
    } catch (e) {
      return { label: t.label, pass: false, note: `${e.name}: ${e.message}` }
    }
  })
  return { logs, error, results, passed: !error && results.length > 0 && results.every((r) => r.pass), form: c.snapshot(), submit, trigger }
}
