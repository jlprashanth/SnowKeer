// Tiny mock of the ServiceNow CLIENT-side API (g_form, g_user, g_scratchpad, GlideAjax ...) so learners can
// write Client Scripts in the browser and SEE the form react. Pure ES module (Web Worker + node tests).
// Behaviour follows her Brazil PDI (classic incident form, checked 2026-11-14) — the notes say where.
import { CHOICES } from './snowData.js'

const str = (v) => (v === undefined || v === null ? '' : String(v))

// Fields shown on the practice incident form (order = form order). Labels as on her Brazil incident form.
export const FORM_FIELDS = [
  { name: 'number', label: 'Number', type: 'string', readOnly: true },
  { name: 'caller_id', label: 'Caller', type: 'reference', table: 'sys_user' },
  { name: 'category', label: 'Category', type: 'choice' },
  { name: 'impact', label: 'Impact', type: 'choice' },
  { name: 'urgency', label: 'Urgency', type: 'choice' },
  { name: 'priority', label: 'Priority', type: 'choice' },
  { name: 'state', label: 'State', type: 'choice' },
  { name: 'hold_reason', label: 'On hold reason', type: 'choice' },
  { name: 'assignment_group', label: 'Assignment group', type: 'reference', table: 'sys_user_group' },
  { name: 'assigned_to', label: 'Assigned to', type: 'reference', table: 'sys_user' },
  { name: 'short_description', label: 'Short description', type: 'string' },
  { name: 'description', label: 'Description', type: 'text' },
  { name: 'work_notes', label: 'Work notes', type: 'text' },
  { name: 'comments', label: 'Additional comments', type: 'text' },
  { name: 'close_code', label: 'Resolution code', type: 'choice' },
  { name: 'close_notes', label: 'Resolution notes', type: 'text' },
]

const CATEGORY = { inquiry: 'Inquiry', software: 'Software', hardware: 'Hardware', network: 'Network', database: 'Database' }
const choiceMap = (field) => (field === 'category' ? CATEGORY : CHOICES.incident[field] || {})

// scenario.form = { values: {...}, mandatory: [...], readOnly: [...], hidden: [...], isNew, actionName }
// scenario.user  = { userName, firstName, lastName, userID, roles: [...] }
export function makeClient({ form = {}, user = {}, scratchpad = {}, list = {}, confirmAnswer = true, db, logs, scriptInclude, makeServer }) {
  // __x in tests. syncGetReference / syncAjax count the old blocking calls, so a test can insist on the callback style.
  const extra = { hiddenRelated: [], relatedHidden: false, hiddenSections: [], flashed: [], submitted: null, formSubmits: [], ajaxCalls: [], syncGetReference: 0, syncAjax: 0, listRefreshes: 0 }
  const fields = {}
  const messages = [] // form-level: {kind:'info'|'error', text}
  const values0 = form.values || {}
  // async callbacks (GlideAjax answers, getReference) — like the PDI they run AFTER the client script has returned
  const pending = []
  const later = (fn) => { pending.push(fn) }
  const flush = () => { let n = 0; while (pending.length && n++ < 50) pending.shift()() }
  let onSet = null // runClientScript hooks this: setValue() on the script's own field fires onChange again
  // 'sys' lines show in the Script Log but are never part of a test's expected logs
  const hint = (msg) => { logs.push({ level: 'sys', msg }) }

  const refOptions = (table) => db[table].map((r) => ({ value: r.sys_id, label: r.name }))
  const refDisplay = (table, id) => (db[table].find((r) => r.sys_id === id) || {}).name || ''

  for (const f of FORM_FIELDS) {
    const choices =
      f.type === 'choice'
        ? Object.entries(choiceMap(f.name)).map(([value, label]) => ({ value, label }))
        : f.type === 'reference'
          ? refOptions(f.table)
          : null
    fields[f.name] = {
      name: f.name, label: f.label, type: f.type, table: f.table || null,
      value: str(values0[f.name] ?? (f.name === 'state' ? '1' : '')),
      mandatory: (form.mandatory || []).includes(f.name),
      readOnly: !!f.readOnly || (form.readOnly || []).includes(f.name),
      visible: !(form.hidden || []).includes(f.name),
      space: false,
      choices, msgs: [],
    }
  }
  const F = (n) => fields[n] || null
  // PDI: g_form calls on a field that is not on the form do NOTHING (no error). We do the same, plus a hint in the log.
  const get = (method, n) => {
    if (fields[n]) return fields[n]
    hint(`⚠️ g_form.${method}('${n}'): '${n}' ane field ee form lo ledu. PDI lo error raadu — silent ga emi jaragadu, so field name spelling check chey.`)
    return null
  }
  // PDI: an EMPTY MANDATORY field can't be made read-only or hidden — the call is ignored until setMandatory(false)
  const locked = (f, what) => {
    if (!(f.mandatory && f.value === '')) return false
    hint(`⚠️ '${f.name}' mandatory + empty — ${what} PDI lo kuda ignore avtundi. Mundu g_form.setMandatory('${f.name}', false) chey.`)
    return true
  }
  const displayOf = (f) => (f.type === 'reference' ? refDisplay(f.table, f.value) : f.type === 'choice' ? (f.choices.find((c) => c.value === f.value) || {}).label || '' : f.value)
  const setRO = (method) => (n, b) => {
    const f = get(method, n)
    if (!f || (b && locked(f, 'read-only cheyyadam'))) return
    f.readOnly = !!b
  }

  const g_form = {
    getValue: (n) => (F(n) ? F(n).value : ''), // PDI: missing field → ''
    setValue: (n, v, dv) => {
      const f = get('setValue', n)
      if (!f) return
      const before = f.value
      f.value = str(v)
      if (f.type === 'reference' && dv !== undefined && !f.choices.some((c) => c.value === f.value)) f.choices.push({ value: f.value, label: str(dv) })
      if (onSet && before !== f.value) onSet(f.name, before, f.value)
    },
    clearValue: (n) => {
      const f = get('clearValue', n)
      if (!f) return
      const before = f.value
      f.value = ''
      if (onSet && before !== '') onSet(f.name, before, '')
    },
    getBooleanValue: (n) => ['true', '1', 'yes'].includes(g_form.getValue(n).toLowerCase()),
    getIntValue: (n) => parseInt(g_form.getValue(n), 10) || 0,
    getDecimalValue: (n) => parseFloat(g_form.getValue(n)) || 0,
    setMandatory: (n, b) => { const f = get('setMandatory', n); if (f) f.mandatory = !!b },
    isMandatory: (n) => !!F(n)?.mandatory,
    setReadOnly: setRO('setReadOnly'),
    setDisabled: setRO('setDisabled'),
    // setVisible(false) hides the field but KEEPS its space (blank gap); setDisplay(false) hides it and removes the space
    setVisible: (n, b) => {
      const f = get('setVisible', n)
      if (!f || (!b && locked(f, 'hide cheyyadam'))) return
      f.visible = !!b
      f.space = !b
    },
    setDisplay: (n, b) => {
      const f = get('setDisplay', n)
      if (!f || (!b && locked(f, 'hide cheyyadam'))) return
      f.visible = !!b
      f.space = false
    },
    isVisible: (n) => !!F(n)?.visible,
    hasField: (n) => !!F(n),
    getLabelOf: (n) => F(n)?.label || '',
    setLabelOf: (n, l) => { const f = get('setLabelOf', n); if (f) f.label = str(l) },
    addOption: (n, value, label, index) => {
      const f = get('addOption', n)
      if (!f) return
      const c = f.choices || (f.choices = [])
      // PDI: adding a value that already exists does nothing (no duplicate option) — checked on her incident form
      if (c.some((x) => x.value === str(value))) {
        hint(`g_form.addOption('${n}', '${str(value)}'): ee value already undi — PDI lo kuda emi maradu (duplicate raadu).`)
        return
      }
      const item = { value: str(value), label: str(label) }
      if (index === undefined) c.push(item)
      else c.splice(index, 0, item)
    },
    removeOption: (n, value) => { const f = get('removeOption', n); if (f) f.choices = (f.choices || []).filter((x) => x.value !== str(value)) },
    clearOptions: (n) => { const f = get('clearOptions', n); if (f) f.choices = [] },
    addInfoMessage: (t) => { messages.push({ kind: 'info', text: str(t) }) },
    addErrorMessage: (t) => { messages.push({ kind: 'error', text: str(t) }) },
    clearMessages: () => { messages.length = 0 },
    showFieldMsg: (n, t, type) => { const f = get('showFieldMsg', n); if (f) f.msgs.push({ type: type === 'error' ? 'error' : 'info', text: str(t) }) },
    hideFieldMsg: (n) => { const f = get('hideFieldMsg', n); if (f) f.msgs = [] },
    showErrorBox: (n, t) => { const f = get('showErrorBox', n); if (f) f.msgs.push({ type: 'error', text: str(t) }) },
    hideErrorBox: (n) => { const f = get('hideErrorBox', n); if (f) f.msgs = [] },
    hideAllFieldMsgs: () => { Object.values(fields).forEach((f) => { f.msgs = [] }) },
    getTableName: () => form.table || 'incident',
    isNewRecord: () => !!form.isNew,
    getUniqueValue: () => (form.isNew ? '' : str(form.sys_id || 'inc_current')),
    getActionName: () => str(form.actionName || 'sysverb_update'),
    getReference: (n, cb) => {
      const f = get('getReference', n)
      const row = f && f.table ? db[f.table].find((r) => r.sys_id === f.value) : null
      // PDI: an EMPTY reference still calls back, with an object whose fields are undefined (c.sys_id / c.name undefined)
      const ref = row ? { ...row, getValue: (k) => str(row[k]) } : { getValue: () => '' }
      // PDI: with a callback the record arrives LATER — after your script has returned. Code below the call can't use it.
      if (cb) { later(() => cb(ref)); return undefined }
      extra.syncGetReference++
      hint('⚠️ getReference() ki callback ivvaledu — PDI lo idi browser ni freeze chese old synchronous call. Callback function ivvu.')
      return ref
    },
    hideRelatedList: (n) => { extra.hiddenRelated.push(str(n)) },
    hideRelatedLists: () => { extra.relatedHidden = true },
    showRelatedList: (n) => { extra.hiddenRelated = extra.hiddenRelated.filter((x) => x !== str(n)) },
    showRelatedLists: () => { extra.relatedHidden = false },
    setSectionDisplay: (n, b) => { if (!b) extra.hiddenSections.push(str(n)); else extra.hiddenSections = extra.hiddenSections.filter((x) => x !== str(n)) },
    getSectionNames: () => ['notes', 'related_records', 'resolution_information'],
    // PDI: flash('priority', …) and flash('incident.priority', …) both run; docs write 'table.field'
    flash: (n) => { const f = get('flash', String(n).replace(/^incident\./, '')); if (f) extra.flashed.push(f.name) },
    addDecoration: () => {},
    getDisplayBox: (n) => (F(n) ? { value: displayOf(F(n)) } : null),
    getFormElement: () => ({ form: 'sys_form' }),
    save: () => { logs.push({ level: 'info', msg: '[g_form.save() called]' }) },
    submit: (action) => { extra.formSubmits.push(str(action)); logs.push({ level: 'info', msg: `[g_form.submit(${str(action)}) called]` }) },
  }

  const roles = user.roles || ['itil']
  const first = user.firstName || 'Abel'
  const last = user.lastName || 'Tuter'
  const g_user = {
    userName: user.userName || 'abel.tuter',
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`, // PDI: fullName exists; g_user.email / g_user.active do not
    userID: user.userID || 'u_abel',
    hasRole: (r) => roles.includes('admin') || roles.includes(r),
    hasRoleExactly: (r) => roles.includes(r),
    hasRoles: () => roles.length > 0,
    hasRoleFromList: (list) => str(list).split(',').some((r) => roles.includes(r.trim()) || roles.includes('admin')),
    getFullName: () => `${first} ${last}`,
    getClientData: (k) => (user.clientData || {})[k],
  }

  // alert / confirm / GlideDialogWindow are browser things; we just record them
  const alertFn = (m) => { logs.push({ level: 'alert', msg: str(m) }) }
  const confirmFn = (m) => { logs.push({ level: 'confirm', msg: str(m) }); return confirmAnswer !== false }
  const gsftSubmit = (btn, formEl, actionName) => { extra.submitted = str(actionName); logs.push({ level: 'info', msg: '[gsftSubmit: ' + str(actionName) + ']' }) }
  const checked = list.checked || []
  const g_list = {
    getChecked: () => checked.join(','),
    getTableName: () => list.table || 'incident',
    getQuery: () => list.query || '',
    getView: () => list.view || '',
    getGroupBy: () => '',
    refresh: () => { extra.listRefreshes++; logs.push({ level: 'sys', msg: '[g_list.refresh()]' }) },
  }
  const jslog = (m) => { logs.push({ level: 'info', msg: str(m) }) }

  // GlideAjax -> runs the exercise's Script Include (server mock). Every call is recorded in __x.ajaxCalls for the tests.
  class GlideAjax {
    constructor(name) {
      this._name = name
      this._p = {}
      this._answer = null
    }
    addParam(k, v) { this._p[k] = str(v) }
    _run() {
      extra.ajaxCalls.push({ name: this._name, params: { ...this._p } })
      if (!scriptInclude || scriptInclude.name !== this._name) throw new Error(`GlideAjax: Script Include '${this._name}' dorakaledu`)
      const a = makeServer(scriptInclude, this._p)
      return a === undefined || a === null ? null : str(a)
    }
    // PDI: getXMLAnswer / getXML are ASYNC — the callback runs after the rest of your script (and after onSubmit returned)
    getXMLAnswer(cb) { const a = this._run(); later(() => cb(a)) }
    getXML(cb) {
      const a = this._run()
      later(() => cb({ responseXML: { documentElement: { getAttribute: (k) => (k === 'answer' ? str(a) : null) } } }))
    }
    // getXMLWait(): synchronous — classic UI only (not Service Portal / Workspace) and it freezes the browser until the answer
    getXMLWait() {
      extra.syncAjax++
      this._answer = this._run()
      hint('⚠️ getXMLWait() synchronous — classic UI lo matrame pani chestundi (Service Portal / Workspace lo kaadu), answer vachhe varaku browser freeze.')
    }
    getAnswer() { return this._answer }
  }

  const snapshot = () => ({
    fields: FORM_FIELDS.map((d) => {
      const f = fields[d.name]
      return { ...f, display: displayOf(f) }
    }),
    messages: [...messages],
  })
  const values = () => Object.fromEntries(FORM_FIELDS.map((d) => [d.name, fields[d.name].value]))

  return {
    extra, g_list, gsftSubmit, g_form, g_user, g_scratchpad: { ...scratchpad }, alert: alertFn, confirm: confirmFn, jslog, GlideAjax,
    snapshot, values, flush, setHook: (fn) => { onSet = fn }, fieldsRaw: fields, messages,
  }
}
