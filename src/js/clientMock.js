// Tiny mock of the ServiceNow CLIENT-side API (g_form, g_user, g_scratchpad, GlideAjax ...) so learners can
// write Client Scripts in the browser and SEE the form react. Pure ES module (Web Worker + node tests).
import { CHOICES } from './snowData.js'

const str = (v) => (v === undefined || v === null ? '' : String(v))

// Fields shown on the practice incident form (order = form order)
export const FORM_FIELDS = [
  { name: 'number', label: 'Number', type: 'string', readOnly: true },
  { name: 'caller_id', label: 'Caller', type: 'reference', table: 'sys_user' },
  { name: 'category', label: 'Category', type: 'choice' },
  { name: 'impact', label: 'Impact', type: 'choice' },
  { name: 'urgency', label: 'Urgency', type: 'choice' },
  { name: 'priority', label: 'Priority', type: 'choice' },
  { name: 'state', label: 'State', type: 'choice' },
  { name: 'assignment_group', label: 'Assignment group', type: 'reference', table: 'sys_user_group' },
  { name: 'assigned_to', label: 'Assigned to', type: 'reference', table: 'sys_user' },
  { name: 'short_description', label: 'Short description', type: 'string' },
  { name: 'description', label: 'Description', type: 'text' },
]

const CATEGORY = { inquiry: 'Inquiry / Help', software: 'Software', hardware: 'Hardware', network: 'Network', database: 'Database' }
const choiceMap = (field) => (field === 'category' ? CATEGORY : CHOICES.incident[field] || {})

// scenario.form = { values: {...}, mandatory: [...], readOnly: [...], hidden: [...] }
// scenario.user  = { userName, firstName, lastName, userID, roles: [...] }
export function makeClient({ form = {}, user = {}, scratchpad = {}, list = {}, confirmAnswer = true, db, logs, scriptInclude, makeServer }) {
  const extra = { hiddenRelated: [], relatedHidden: false, hiddenSections: [], flashed: [], submitted: null }
  const fields = {}
  const messages = [] // form-level: {kind:'info'|'error', text}
  const values0 = form.values || {}

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
  const F = (n) => {
    if (!fields[n]) throw new Error(`g_form: '${n}' field form lo ledu (typo emo?) — gs lo laaga kaadu, client lo field name exact ga undali`)
    return fields[n]
  }
  const has = (n) => !!fields[n]
  const displayOf = (f) => (f.type === 'reference' ? refDisplay(f.table, f.value) : f.type === 'choice' ? (f.choices.find((c) => c.value === f.value) || {}).label || '' : f.value)

  const g_form = {
    getValue: (n) => (has(n) ? F(n).value : ''), // real: missing field → '' (we throw nothing for reads)
    setValue: (n, v, dv) => {
      const f = F(n)
      f.value = str(v)
      if (f.type === 'reference' && dv !== undefined && !f.choices.some((c) => c.value === f.value)) f.choices.push({ value: f.value, label: str(dv) })
    },
    clearValue: (n) => { F(n).value = '' },
    getBooleanValue: (n) => ['true', '1', 'yes'].includes(F(n).value.toLowerCase()),
    getIntValue: (n) => parseInt(F(n).value, 10) || 0,
    setMandatory: (n, b) => { F(n).mandatory = !!b },
    isMandatory: (n) => F(n).mandatory,
    setReadOnly: (n, b) => { F(n).readOnly = !!b },
    setDisabled: (n, b) => { F(n).readOnly = !!b },
    // setVisible(false) hides the field but KEEPS its space (blank gap); setDisplay(false) hides it and removes the space
    setVisible: (n, b) => { F(n).visible = !!b; F(n).space = !b },
    setDisplay: (n, b) => { F(n).visible = !!b; F(n).space = false },
    hasField: (n) => has(n),
    getLabelOf: (n) => F(n).label,
    setLabelOf: (n, l) => { F(n).label = str(l) },
    addOption: (n, value, label, index) => {
      const c = F(n).choices || (F(n).choices = [])
      if (c.some((x) => x.value === str(value))) return
      const item = { value: str(value), label: str(label) }
      if (index === undefined) c.push(item); else c.splice(index, 0, item)
    },
    removeOption: (n, value) => { F(n).choices = (F(n).choices || []).filter((x) => x.value !== str(value)) },
    clearOptions: (n) => { F(n).choices = [] },
    addInfoMessage: (t) => { messages.push({ kind: 'info', text: str(t) }) },
    addErrorMessage: (t) => { messages.push({ kind: 'error', text: str(t) }) },
    clearMessages: () => { messages.length = 0 },
    showFieldMsg: (n, t, type) => { F(n).msgs.push({ type: type === 'error' ? 'error' : 'info', text: str(t) }) },
    hideFieldMsg: (n) => { F(n).msgs = [] },
    showErrorBox: (n, t) => { F(n).msgs.push({ type: 'error', text: str(t) }) },
    hideErrorBox: (n) => { F(n).msgs = [] },
    getTableName: () => form.table || 'incident',
    isNewRecord: () => !!form.isNew,
    getUniqueValue: () => (form.isNew ? '' : str(form.sys_id || 'inc_current')),
    getActionName: () => 'sysverb_update',
    getReference: (n, cb) => {
      const f = F(n)
      const row = f.table ? db[f.table].find((r) => r.sys_id === f.value) : null
      const ref = row ? { ...row, getValue: (k) => str(row[k]) } : { sys_id: '', getValue: () => '' }
      if (cb) cb(ref) // real life: callback fires later (async) — always use the callback form!
      return undefined
    },
    hideRelatedList: (n) => { extra.hiddenRelated.push(str(n)) },
    hideRelatedLists: () => { extra.relatedHidden = true },
    showRelatedList: (n) => { extra.hiddenRelated = extra.hiddenRelated.filter((x) => x !== str(n)) },
    showRelatedLists: () => { extra.relatedHidden = false },
    setSectionDisplay: (n, b) => { if (!b) extra.hiddenSections.push(str(n)); else extra.hiddenSections = extra.hiddenSections.filter((x) => x !== str(n)) },
    flash: (n, color, count) => { F(n); extra.flashed.push(n) },
    hideAllFieldMsgs: () => { Object.values(fields).forEach((f) => { f.msgs = [] }) },
    getFormElement: () => ({ form: 'sys_form' }),
    save: () => { logs.push({ level: 'info', msg: '[g_form.save() called]' }) },
    submit: () => { logs.push({ level: 'info', msg: '[g_form.submit() called]' }) },
  }

  const roles = user.roles || ['itil']
  const g_user = {
    userName: user.userName || 'abel.tuter',
    firstName: user.firstName || 'Abel',
    lastName: user.lastName || 'Tuter',
    userID: user.userID || 'u_abel',
    hasRole: (r) => roles.includes('admin') || roles.includes(r),
    hasRoleExactly: (r) => roles.includes(r),
    hasRoles: () => roles.length > 0,
    hasRoleFromList: (list) => str(list).split(',').some((r) => roles.includes(r.trim()) || roles.includes('admin')),
    getFullName: () => `${user.firstName || 'Abel'} ${user.lastName || 'Tuter'}`,
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
  }
  const jslog = (m) => { logs.push({ level: 'info', msg: str(m) }) }

  // GlideAjax -> runs the exercise's Script Include (server mock) synchronously and hands back the answer
  class GlideAjax {
    constructor(name) { this._name = name; this._p = {} }
    addParam(k, v) { this._p[k] = str(v) }
    _run() {
      if (!scriptInclude || scriptInclude.name !== this._name) throw new Error(`GlideAjax: Script Include '${this._name}' dorakaledu`)
      return makeServer(scriptInclude, this._p)
    }
    getXMLAnswer(cb) { const a = this._run(); cb(a === undefined || a === null ? null : str(a)) }
    getXML(cb) { const a = this._run(); cb({ responseXML: { documentElement: { getAttribute: (k) => (k === 'answer' ? str(a) : null) } } }) }
  }

  const snapshot = () => ({
    fields: FORM_FIELDS.map((d) => {
      const f = fields[d.name]
      return { ...f, display: displayOf(f) }
    }),
    messages: [...messages],
  })

  return { extra, g_list, gsftSubmit, g_form, g_user, g_scratchpad: { ...scratchpad }, alert: alertFn, confirm: confirmFn, jslog, GlideAjax, snapshot, fieldsRaw: fields, messages }
}
