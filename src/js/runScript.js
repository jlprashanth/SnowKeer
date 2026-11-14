// Runs a learner's script against the mock ServiceNow API and checks the exercise's tests.
// Pure function: used inside the Web Worker (browser) and in node (dev-tools/check-js.mjs).
import { GlideRecord, GlideAggregate, makeGs, makeRecord, freshDb, seedDb } from './snowMock.js'
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
const str = (v) => (v === undefined || v === null ? '' : String(v))

// The PDI (Brazil, global scope) does NOT throw when you call a method that doesn't exist — it quietly returns undefined.
// The browser throws; we keep the error (so a typo is visible) but say how the PDI behaves.
const errOf = (e) => {
  let m = `${e && e.name ? e.name : 'Error'}: ${e && e.message ? e.message : e}`
  if (/is not a function/.test(m)) m += ' — ⚠️ PDI lo leni method pilisthe error raadu, silent ga undefined vastundi; ikkada typo kanipinchaalani error chupistunnam.'
  // PDI: reading a property of `undefined` is silent too (only `null` throws) — checked in her PDI
  if (/Cannot read propert(y|ies) of undefined/.test(m)) m += ' — ⚠️ nee PDI lo undefined meeda property chadivithe error raadu, silent ga undefined vastundi; null meeda matrame TypeError.'
  return m
}

// AbstractAjaxProcessor for Script Include exercises, modelled on the OOB one in her PDI (read 2026-11-14):
// - getParameter() / getName() give a Java string (typeof 'object'), so `=== 'x'` and switch fail — wrap: String(this.getParameter('x')).
//   We hand back a String object to match.
// - process() finds the method to run with this.getName() (= sysparm_name), so a Script Include must NOT define its own
//   getName / getValue / getType / getParameter. Names starting with "_" are private (not callable from the browser).
function makeAjaxBase() {
  function AbstractAjaxProcessor() {}
  const P = AbstractAjaxProcessor.prototype
  // like the OOB one: initialize(request, responseXML, gc) stores the request — a Script Include with its OWN empty
  // initialize() overrides this, so getParameter() has no request any more (breaks in her PDI too)
  P.initialize = function (request) { this.request = request }
  P.getParameter = function (n) {
    if (!this.request) throw new Error("getParameter(): request ledu — nee Script Include lo sontha initialize() undi, adi AbstractAjaxProcessor initialize (request ni store chesedi) ni override chesindi. Aa initialize teeseyi.")
    const v = this.request.params ? this.request.params[n] : undefined
    // eslint-disable-next-line no-new-wrappers
    return v === undefined || v === null ? null : new String(v)
  }
  P.getName = function () { return this.getParameter('sysparm_name') }
  P.getValue = function () { return this.getParameter('sysparm_value') }
  P.getType = function () { return this.getParameter('sysparm_type') }
  P.setAnswer = function (v) { this.__answer = v }
  P.setError = function (e) { this.__error = e }
  P.newItem = function () { return { setAttribute() {} } }
  return AbstractAjaxProcessor
}
const extendsObject = (base, o) => Object.assign(Object.create(base.prototype), o)
// what AbstractAjaxProcessor.process() does: pick the method by this.getName(), skip private "_" names, call it
function dispatchAjax(inst, siName) {
  const fnName = str(inst.getName())
  if (!fnName) throw new Error(`Script Include '${siName}': sysparm_name ivvaledu`)
  if (fnName.indexOf('_') === 0) throw new Error(`Script Include '${siName}': '${fnName}' "_" tho modalaindi — private, browser nunchi pilavalemu`)
  const f = typeof inst[fnName] === 'function' ? inst[fnName] : inst['ajaxFunction_' + fnName]
  if (typeof f !== 'function') {
    const own = Object.prototype.hasOwnProperty.call(inst, 'getName') || Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(inst), 'getName')
    throw new Error(`Script Include '${siName}' lo '${fnName}' function ledu${own ? " — nuvvu getName() ane function rasav, adi AbstractAjaxProcessor di (sysparm_name chadivedi) override chesindi. Vere peru pettu (e.g. getUserName)." : ''}`)
  }
  const r = f.call(inst)
  return r === undefined ? inst.__answer : r
}

// scenario: { current: {table, values}, previous: {table, values}, seed: { incident: [rows] } }  (all optional)
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
  seedDb(db, scenario.seed)
  const log = (level, msg) => { logs.push({ level, msg }) }
  const gs = makeGs(logs)
  class GR extends GlideRecord {
    constructor(table) { super(table, db, log) }
  }
  class GA extends GlideAggregate {
    constructor(table) { super(table, db, log) }
  }
  const mk = (s) => (s ? makeRecord(s.table || 'incident', s.values, db, log) : undefined)
  const current = mk(scenario.current)
  const previous = scenario.previous ? mk(scenario.previous) : current ? mk(scenario.current) : undefined
  if (current && previous) current._previous = previous // lets current.field.changes() compare with previous

  let evaluate = null
  let error = null
  try {
    // `evaluate` shares the script's scope (direct eval inside the closure)
    const body = `${code}\n;return function(__e){ return eval(__e) }`
    const action = { setRedirectURL: (r) => { logs.push({ level: 'ui', msg: 'redirect → ' + (r && r.getValue ? r.getValue('number') || r.getTableName() : String(r)) }) }, setReturn: () => {} }
    const AbstractAjaxProcessor = makeAjaxBase()
    // callAjax(MyAjax, 'getEmail', { sysparm_user_id: 'u_bud' }) — runs the Script Include the way a GlideAjax call would
    const callAjax = (Ctor, method, params) => { const inst = new Ctor({ params: { sysparm_name: method, ...(params || {}) } }); return dispatchAjax(inst, Ctor.name || 'Script Include') }
    // eslint-disable-next-line no-new-func
    // `window` is hidden (undefined) like on the server — the UI Action pattern `if (typeof window == 'undefined') serverFn();`
    // must work even when the runner falls back to running on the page itself
    const fn = new Function('gs', 'GlideRecord', 'GlideAggregate', 'current', 'previous', 'Class', 'action', 'AbstractAjaxProcessor', '__ext', 'callAjax', 'fetch', 'XMLHttpRequest', 'importScripts', 'window', 'Object.extendsObject = __ext;' + body)
    evaluate = fn(gs, GR, GA, current, previous, Class, action, AbstractAjaxProcessor, extendsObject, callAjax)
  } catch (e) {
    error = errOf(e)
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
// client = { trigger: { type: 'onLoad' | 'onChange' | 'onSubmit' | 'onCellEdit' | 'call', field?, oldValue?, newValue?, isLoading? },
//            formValues?: {..} }
// scenario.form / scenario.user / scenario.scratchpad / scenario.list / scenario.confirmAnswer / scenario.seed /
// scenario.scriptInclude: { name, code }  (for GlideAjax)
// Tests: { label, logs:[..] } | { label, expr, expect }. In `expr` you can use g_form, g_user and:
//   __f.<field>.{value,mandatory,readOnly,visible,choices,msgs}, __msgs (form messages), __submit (false when onSubmit returned false),
//   __x.{ajaxCalls, formSubmits, submitted, flashed, hiddenSections, ...}
// Like the PDI: GlideAjax / getReference callbacks run AFTER the handler returned (the onSubmit verdict is taken before them),
// and g_form.setValue() on the script's own field runs onChange again (oldValue = the value when the form loaded).
export function runClientScript({ code, scenario = {}, tests = [], client = {} }) {
  const logs = []
  const db = freshDb()
  seedDb(db, scenario.seed)
  const trigger = client.trigger || { type: 'onLoad' }
  const form = { ...(scenario.form || {}), values: { ...((scenario.form || {}).values || {}), ...(client.formValues || {}) } }

  // Script Include for GlideAjax: server code + AbstractAjaxProcessor
  const makeServer = (si, params) => {
    const gs = makeGs(logs)
    const log = (level, msg) => { logs.push({ level, msg }) }
    class GR extends GlideRecord { constructor(t) { super(t, db, log) } }
    class GA extends GlideAggregate { constructor(t) { super(t, db, log) } }
    const AbstractAjaxProcessor = makeAjaxBase()
    // eslint-disable-next-line no-new-func
    // the platform builds the processor with the request: new MyAjax(request, responseXML, gc) → initialize() stores it
    const fn = new Function('gs', 'GlideRecord', 'GlideAggregate', 'Class', 'AbstractAjaxProcessor', 'extendsObject', '__req', `Object.extendsObject = extendsObject;\n${si.code}\n;return new ${si.name}(__req);`)
    const inst = fn(gs, GR, GA, Class, AbstractAjaxProcessor, extendsObject, { params })
    return dispatchAjax(inst, si.name)
  }

  const c = makeClient({ form, user: scenario.user, scratchpad: scenario.scratchpad, list: scenario.list, confirmAnswer: scenario.confirmAnswer, db, logs, scriptInclude: scenario.scriptInclude, makeServer })
  const initialValues = c.values() // what the form showed when it loaded (before her script) — the real oldValue
  let rt = null
  let error = null
  let submit = true

  // onChange fires again when the script changes ITS OWN field (PDI behaviour) — capped so a loop can't hang the page
  if (trigger.type === 'onChange') {
    let depth = 0
    c.setHook((name, before, after) => {
      if (name !== trigger.field || !rt || !rt.onChange) return
      if (depth >= 5) {
        logs.push({ level: 'sys', msg: '⚠️ onChange malli malli run avtondi (setValue → onChange → setValue loop). 5 sarlu tarvata aapesam — PDI lo browser hang avvochu. Guard pettu: if (newValue == oldValue) return;' })
        return
      }
      depth++
      try { rt.onChange({ name }, str(trigger.oldValue), after, false, false) } finally { depth-- }
    })
  }

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
          if (f) f.value = str(trigger.newValue)
          rt.onChange({ name: trigger.field }, str(trigger.oldValue), str(trigger.newValue), !!trigger.isLoading, false)
          c.flush()
        }
      } else if (trigger.type === 'onSubmit') {
        if (need('onSubmit')) {
          submit = rt.onSubmit() !== false // decided NOW — a GlideAjax answer that comes later can't stop the save
          rt.setSubmit(submit)
          c.flush()
        }
      } else if (trigger.type === 'onCellEdit') {
        if (need('onCellEdit')) {
          let verdict = null
          rt.onCellEdit(trigger.sysIDs || ['inc1'], trigger.table || 'incident', trigger.oldValues || [''], trigger.newValue, (ok) => { verdict = ok }, trigger.field)
          c.flush() // onCellEdit may call callback() later (inside a GlideAjax answer) — that is allowed
          submit = verdict !== false
          rt.setSubmit(submit)
        }
      } else if (trigger.type === 'call') {
        const fnc = rt.evaluate('typeof ' + trigger.fn + " === 'function' ? " + trigger.fn + ' : null')
        if (!fnc) error = trigger.fn + '() function nuvvu define cheyyaledu'
        else {
          fnc.apply(null, trigger.args || [])
          c.flush()
        }
      } else if (rt.onLoad || need('onLoad')) {
        rt.onLoad()
        c.flush()
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
  return { logs, error, results, passed: !error && results.length > 0 && results.every((r) => r.pass), form: c.snapshot(), submit, trigger, initialValues }
}
