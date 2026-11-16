// Tiny mock of the ServiceNow server-side API (gs + GlideRecord + GlideAggregate) so learners can write
// real-looking scripts in the browser. Pure ES module: used by the Web Worker and by node tests.
// Behaviour follows her Brazil PDI (checked with Background Scripts on 2026-11-14) — the notes say where.
import { CHOICES, SCHEMA, freshDb } from './snowData.js'
import { GlideDateTime, GS_DATES, resolveJsValue } from './dateMock.js'

const NOW = '2026-11-12 10:00:00'
// the user scripts run as when the scenario names no runAs: the PDI admin (admin passes every role / ACL check)
export const ADMIN = { sys_id: 'u_admin', user_name: 'admin', name: 'System Administrator', email: 'admin@example.com', roles: ['admin'] }
const str = (v) => (v === undefined || v === null ? '' : String(v))
const isBool = (table, f) => SCHEMA[table]?.fields[f] === 'boolean'
// true/false fields are stored as 'true' / 'false' (what gr.active.toString() shows); getValue() turns them into '1' / '0'
function normBool(v) {
  const s = str(v)
  const l = s.toLowerCase()
  return l === 'true' || l === '1' ? 'true' : l === 'false' || l === '0' ? 'false' : s
}
const norm = (table, f, v) => (isBool(table, f) ? normBool(v) : str(v))
// field used when get() is called with ONE value that is not a sys_id (PDI: gr.get('INC0000060') finds the record)
const DISPLAY = { incident: 'number', sys_user: 'name', sys_user_group: 'name' }
// dictionary defaults in her PDI: task.priority = 4, impact = 3, urgency = 3
const DEFAULTS = { incident: { state: '1', impact: '3', urgency: '3', priority: '4', active: 'true' } }

// "caller_id.email" style paths: follow reference fields to the referenced row
function fieldValue(db, table, row, path) {
  const parts = String(path).split('.')
  let t = table
  let r = row
  for (let i = 0; i < parts.length - 1; i++) {
    const ref = SCHEMA[t]?.refs[parts[i]]
    if (!ref || !r) return ''
    r = db[ref].find((x) => x.sys_id === str(r[parts[i]]))
    t = ref
  }
  return r ? r[parts[parts.length - 1]] : ''
}
function validPath(table, path) {
  const parts = String(path).split('.')
  let t = table
  for (let i = 0; i < parts.length; i++) {
    if (!SCHEMA[t] || !(parts[i] in SCHEMA[t].fields)) return false
    if (i < parts.length - 1) {
      t = SCHEMA[t].refs[parts[i]]
      if (!t) return false
    }
  }
  return true
}
const pathTable = (table, path) => String(path).split('.').slice(0, -1).reduce((t, p) => SCHEMA[t]?.refs[p] || t, table)
const lastPart = (path) => String(path).split('.').pop()

/* ---------------------------- GlideElement ---------------------------- */
// What `gr.priority` gives you. Like the real thing it is an OBJECT: `==` works with strings, `===` against a plain string
// does not. ONE element per field per GlideRecord, and it always shows the CURRENT row — so `arr.push(gr.number)` in a
// while (gr.next()) loop ends up with the last record N times, exactly like her PDI. Use gr.getValue('number') for a string.
// (In the PDI an EMPTY element is also falsy — `if (gr.assigned_to)` is false. A browser object can't copy that; use .nil().)
class GlideElement {
  constructor(gr, name) {
    this._gr = gr
    this._name = name
    this._type = SCHEMA[gr._table].fields[name]
    // dot-walking: gr.caller_id.email / current.assigned_to.name — on a reference field, unknown properties read the referenced record
    return new Proxy(this, {
      get: (t, p, r) => {
        if (typeof p === 'symbol' || p in t) return Reflect.get(t, p, r)
        const refTable = SCHEMA[t._gr._table].refs[t._name]
        if (refTable && typeof p === 'string' && p in SCHEMA[refTable].fields) return t.getRefRecord()[p]
        return undefined
      },
    })
  }
  get _v() { return str(this._gr._row?.[this._name]) }
  toString() { return this._v }
  valueOf() { return this._type === 'boolean' ? this._v === 'true' : this._v }
  getValue() { return this._gr.getValue(this._name) }
  setValue(v) { this._gr.setValue(this._name, v) }
  nil() { return this._v === '' }
  // date-time field → a GlideDateTime holding the field's (UTC) value
  getGlideObject() { return this._type === 'glide_date_time' ? new GlideDateTime(this._v) : null }
  // changes()/changesTo()/changesFrom() compare against `previous` (set by runScript for current/previous scenarios)
  _prev() { const p = this._gr._previous; return p ? str(p._row?.[this._name]) : null }
  changes() { const p = this._prev(); return p !== null && p !== this._v }
  changesTo(v) { return this.changes() && this._v === norm(this._gr._table, this._name, v) }
  changesFrom(v) { const p = this._prev(); return this.changes() && p === norm(this._gr._table, this._name, v) }
  getDisplayValue() { return displayValue(this._gr._db, this._gr._table, this._name, this._v) }
  getRefRecord() {
    const t = SCHEMA[this._gr._table].refs[this._name]
    const r = new this._gr.constructor(t, this._gr._db)
    r.get(this._v)
    return r
  }
}

function displayValue(db, table, field, v) {
  if (v === '' || v === undefined) return ''
  const ref = SCHEMA[table].refs[field]
  if (ref) {
    const row = db[ref].find((r) => r.sys_id === v)
    return row ? row.name || row.number || v : v
  }
  const ch = CHOICES[table]?.[field]
  if (ch && ch[v] !== undefined) return ch[v]
  return v
}

/* ---------------------------- queries ---------------------------- */
const OPS = ['NOT LIKE', 'STARTSWITH', 'ENDSWITH', 'ISNOTEMPTY', 'ISEMPTY', 'NOT IN', 'LIKE', 'IN', '>=', '<=', '!=', '=', '>', '<']
const WORD = { CONTAINS: 'LIKE', 'DOES NOT CONTAIN': 'NOT LIKE' }

function test(rowVal, op, target, bool) {
  const a = bool ? normBool(rowVal) : str(rowVal)
  const t = bool ? normBool(target) : str(target)
  const num = a !== '' && t !== '' && !isNaN(a) && !isNaN(t)
  switch (op) {
    case '=': return a === t
    case '!=': return a !== t
    case '>': return num ? +a > +t : a > t
    case '<': return num ? +a < +t : a < t
    case '>=': return num ? +a >= +t : a >= t
    case '<=': return num ? +a <= +t : a <= t
    case 'LIKE': return a.toLowerCase().includes(t.toLowerCase())
    case 'NOT LIKE': return !a.toLowerCase().includes(t.toLowerCase())
    case 'STARTSWITH': return a.toLowerCase().startsWith(t.toLowerCase())
    case 'ENDSWITH': return a.toLowerCase().endsWith(t.toLowerCase())
    case 'IN': return t.split(',').includes(a)
    case 'NOT IN': return !t.split(',').includes(a)
    case 'ISEMPTY': return a === ''
    case 'ISNOTEMPTY': return a !== ''
    default: return false
  }
}

// groups: a row matches when EVERY group has at least one true condition
// (a new addQuery = AND; addOrCondition on a condition = OR inside THAT condition's group)
const matches = (db, table, row, groups) =>
  groups.every((g) => g.some((c) => test(fieldValue(db, table, row, c.field), c.op, c.value, isBool(pathTable(table, c.field), lastPart(c.field)))))

// encoded query → { sets: [groups, ...], order }. "^OR" joins the condition just before it; "^NQ" starts a new query that is OR'ed in.
function parseEncoded(q) {
  const sets = [[]]
  const order = []
  for (let raw of String(q).split('^')) {
    if (!raw || raw === 'EQ') continue
    if (raw.startsWith('NQ')) {
      sets.push([])
      raw = raw.slice(2)
      if (!raw) continue
    }
    if (raw.startsWith('ORDERBYDESC')) { order.push({ f: raw.slice(11), desc: true }); continue }
    if (raw.startsWith('ORDERBY')) { order.push({ f: raw.slice(7), desc: false }); continue }
    const isOr = raw.startsWith('OR')
    const body = isOr ? raw.slice(2) : raw
    // operator = the one that appears EARLIEST (field names never contain operators); on a tie the longer one wins
    let op = null
    let i = -1
    for (const o of OPS) {
      const k = body.indexOf(o)
      if (k >= 0 && (i < 0 || k < i || (k === i && o.length > op.length))) { op = o; i = k }
    }
    if (!op) continue
    const cond = { field: body.slice(0, i), op, value: resolveJsValue(body.slice(i + op.length)) }
    const groups = sets[sets.length - 1]
    if (isOr && groups.length) groups[groups.length - 1].push(cond)
    else groups.push([cond])
  }
  return { sets, order }
}

const condOf = (field, a, b) => {
  let op = '='
  let value = a
  if (b !== undefined) { op = WORD[String(a).toUpperCase()] || String(a).toUpperCase(); value = b }
  if (Array.isArray(value)) value = value.join(',')
  return { field, op, value: str(resolveJsValue(value)) }
}

/* ---------------------------- GlideRecord ---------------------------- */
export class GlideRecord {
  constructor(table, db, log) {
    if (!SCHEMA[table]) throw new Error(`Invalid table: ${table} (practice sandbox lo ivi matrame untayi: ${Object.keys(SCHEMA).join(', ')})`)
    this._table = table
    this._db = db || globalThis.__snowDb
    this._log = log || (() => {})
    this._groups = []
    this._nq = [] // extra query sets OR'ed in with ^NQ
    this._order = []
    this._limit = 0
    this._ids = []
    this._idx = -1
    this._row = null
    this._isNew = false
    this._pending = {} // values set before any record is loaded (used by updateMultiple)
    this._els = {}
    return new Proxy(this, {
      get: (t, p, r) => {
        if (typeof p === 'symbol' || p in t) return Reflect.get(t, p, r)
        if (p in SCHEMA[t._table].fields) return t._el(p)
        return undefined
      },
      set: (t, p, v) => {
        if (typeof p === 'string' && !p.startsWith('_') && !(p in t) && p in SCHEMA[t._table].fields) {
          t.setValue(p, v)
          return true
        }
        t[p] = v
        return true
      },
    })
  }
  _el(f) { return this._els[f] || (this._els[f] = new GlideElement(this, f)) }

  /* building the query */
  // PDI: a misspelt field is IGNORED — the condition is dropped and the query returns every row (log: "Invalid query detected")
  _valid(c) {
    if (validPath(this._table, c.field)) return true
    this._log('sys', `⚠️ Invalid query: '${c.field}' ane field ${this._table} lo ledu — PDI lo ee condition ignore avtundi, query ANNI rows istundi!`)
    return false
  }
  addQuery(field, a, b) {
    // one argument = an encoded query, e.g. addQuery('active=true^priority=1')
    if (a === undefined && b === undefined) {
      this.addEncodedQuery(field)
      return this._qc(null)
    }
    const cond = condOf(field, a, b)
    if (!this._valid(cond)) return this._qc(null)
    this._groups.push([cond])
    return this._qc(this._groups.length - 1)
  }
  // the condition object addQuery() returns: addOrCondition() ORs into THAT condition (PDI: (A OR C) AND B)
  _qc(gi) {
    const gr = this
    const qc = {
      addOrCondition(f, x, y) {
        const cond = condOf(f, x, y)
        if (!gr._valid(cond)) return qc
        if (gi === null) { gr._groups.push([cond]); gi = gr._groups.length - 1 } else gr._groups[gi].push(cond)
        return qc
      },
    }
    return qc
  }
  addActiveQuery() { return this.addQuery('active', 'true') }
  addNullQuery(f) { return this.addQuery(f, 'ISEMPTY', '') }
  addNotNullQuery(f) { return this.addQuery(f, 'ISNOTEMPTY', '') }
  addEncodedQuery(q) {
    const p = parseEncoded(q)
    const clean = (groups) => groups.map((g) => g.filter((c) => this._valid(c))).filter((g) => g.length)
    this._groups.push(...clean(p.sets[0]))
    for (const s of p.sets.slice(1)) this._nq.push(clean(s))
    this._order.push(...p.order)
  }
  getEncodedQuery() {
    const enc = (groups) => groups.map((g) => g.map((c) => c.field + c.op + c.value).join('^OR')).join('^')
    return [enc(this._groups), ...this._nq.map(enc)].join('^NQ')
  }
  orderBy(f) { this._order.push({ f, desc: false }) }
  orderByDesc(f) { this._order.push({ f, desc: true }) }
  setLimit(n) { this._limit = Number(n) }

  /* running it */
  _matching() {
    const ok = (r) => matches(this._db, this._table, r, this._groups) || this._nq.some((s) => matches(this._db, this._table, r, s))
    let rows = this._db[this._table].filter(ok)
    for (const o of [...this._order].reverse()) {
      rows = [...rows].sort((x, y) => {
        const a = str(fieldValue(this._db, this._table, x, o.f))
        const b = str(fieldValue(this._db, this._table, y, o.f))
        const c = !isNaN(a) && !isNaN(b) && a !== '' && b !== '' ? a - b : a.localeCompare(b)
        return o.desc ? -c : c
      })
    }
    if (this._limit > 0) rows = rows.slice(0, this._limit)
    return rows
  }
  query() {
    this._ids = this._matching().map((r) => r.sys_id)
    this._idx = -1
    this._row = null
    this._isNew = false
  }
  _load(id) {
    const r = this._db[this._table].find((x) => x.sys_id === id)
    if (r) this._row = { ...r }
    return !!r
  }
  // PDI: after the loop ends the LAST record stays loaded. Records deleted inside the loop are skipped.
  next() {
    while (this._idx + 1 < this._ids.length) {
      this._idx++
      if (this._load(this._ids[this._idx])) return true
    }
    return false
  }
  hasNext() { return this._idx + 1 < this._ids.length }
  getRowCount() { return this._ids.length }
  get(a, b) {
    const rows = this._db[this._table]
    const row =
      b === undefined
        ? rows.find((r) => r.sys_id === str(a)) || rows.find((r) => str(r[DISPLAY[this._table]]) === str(a))
        : rows.find((r) => str(r[a]) === str(b))
    this._isNew = false
    if (!row) { this._row = null; this._ids = []; return false }
    this._ids = [row.sys_id]
    this._idx = 0
    this._row = { ...row }
    return true
  }

  /* reading & writing fields */
  // PDI: getValue() is a STRING, '1' / '0' for true/false fields, and null when the field is empty or does not exist
  getValue(f) {
    if (!this.isValidField(f)) return null
    const s = str(this._row?.[f])
    if (s === '') return null
    if (isBool(this._table, f)) return s === 'true' ? '1' : s === 'false' ? '0' : s
    return s
  }
  setValue(f, v) {
    if (!this.isValidField(f)) {
      this._log('sys', `⚠️ setValue('${f}'): ee field ${this._table} lo ledu — PDI lo error raadu, value ekkada save avvadu.`)
      return
    }
    const val = norm(this._table, f, v)
    if (this._row) this._row[f] = val
    else this._pending[f] = val
  }
  getDisplayValue(f) {
    if (!f) return this._table === 'incident' ? str(this._row?.number) : str(this._row?.name || this._row?.number)
    return displayValue(this._db, this._table, f, str(this._row?.[f]))
  }
  getElement(f) { return this.isValidField(f) ? this._el(f) : null }
  getUniqueValue() { return this._row && this._row.sys_id ? this._row.sys_id : null }
  getTableName() { return this._table }
  getRecordClassName() { return this._table }
  instanceOf(t) { return t === this._table || (t === 'task' && this._table === 'incident') }
  isValid() { return true }
  isValidField(f) { return f in SCHEMA[this._table].fields }
  isValidRecord() { return !!this._row && !!this._row.sys_id && this._db[this._table].some((r) => r.sys_id === this._row.sys_id) }
  isNewRecord() { return !!this._isNew }
  // ACLs (sandbox): scenario.acl = { incident: { read: { roles: ['itil'], cond: 'caller_id=ME' }, write: …, create: …, delete: … } }
  // checked for the user in scenario.runAs (default admin — admin passes every check, like her PDI). No rule = allowed.
  // ME in cond = the running user's sys_id.
  _allowed(op, row) {
    const ctx = this._db._ctx || {}
    const user = ctx.user || ADMIN
    if ((user.roles || []).includes('admin')) return true
    const rule = ctx.acl && ctx.acl[this._table] && ctx.acl[this._table][op]
    if (!rule) return true
    if (rule.roles && rule.roles.length && !rule.roles.some((r) => (user.roles || []).includes(r))) return false
    if (rule.cond && row) {
      const p = parseEncoded(String(rule.cond).split('ME').join(user.sys_id))
      if (!matches(this._db, this._table, row, p.sets[0])) return false
    }
    return true
  }
  canCreate() { return this._allowed('create', this._row || {}) }
  canRead() { return this._allowed('read', this._row) }
  canWrite() { return this._allowed('write', this._row) }
  canDelete() { return this._allowed('delete', this._row) }
  changes() {
    const p = this._previous
    return !!p && !!this._row && Object.keys(this._row).some((k) => str(this._row[k]) !== str(p._row?.[k]))
  }
  setWorkflow() {}
  autoSysFields() {}
  setAbortAction(b) { this._aborted = b !== false }
  isActionAborted() { return !!this._aborted }

  // PDI: initialize() = every field empty (getValue → null), no sys_id / number, isNewRecord() false
  initialize() {
    this._row = {}
    for (const f of Object.keys(SCHEMA[this._table].fields)) this._row[f] = ''
    this._ids = []
    this._idx = -1
    this._isNew = false
    this._pending = {}
  }
  // PDI: newRecord() = defaults applied, sys_id and number assigned straight away, isNewRecord() true
  newRecord() {
    this.initialize()
    this._applyDefaults()
    this._row.sys_id = this._newId()
    if (SCHEMA[this._table].numberPrefix) this._row.number = this._nextNumber()
    this._isNew = true
  }
  _applyDefaults() {
    for (const [k, v] of Object.entries(DEFAULTS[this._table] || {})) if (!str(this._row[k])) this._row[k] = v
    if (this._table === 'incident' && !this._row.opened_at) this._row.opened_at = NOW
  }
  _newId() { return 'new' + (this._db._seq = (this._db._seq || 0) + 1) }
  _nextNumber() {
    const pre = SCHEMA[this._table].numberPrefix
    const max = Math.max(this._db._num || 0, ...this._db[this._table].map((r) => parseInt(str(r.number).slice(pre.length), 10) || 0))
    this._db._num = max + 1
    return pre + String(max + 1).padStart(7, '0')
  }
  // insert() fills the dictionary defaults for anything still empty (so initialize() + insert() still gets state, priority …)
  insert() {
    if (!this._row) this.initialize()
    this._applyDefaults()
    const row = { ...this._row }
    if (!row.sys_id) row.sys_id = this._newId()
    if (SCHEMA[this._table].numberPrefix && !row.number) row.number = this._nextNumber()
    this._db[this._table].push(row)
    this._row = { ...row }
    this._ids = [row.sys_id]
    this._idx = 0
    this._isNew = false
    return row.sys_id
  }
  update() {
    if (!this._row) return null
    const i = this._db[this._table].findIndex((r) => r.sys_id === this._row.sys_id)
    if (i < 0) return this.insert()
    this._db[this._table][i] = { ...this._row }
    return this._row.sys_id
  }
  // updateMultiple(): set values first (setValue / gr.field = x, no next()), then every matching record gets them
  updateMultiple() {
    for (const r of this._matching()) Object.assign(r, this._pending)
  }
  // deleteMultiple(): deletes EVERY matching record — with a misspelt field that is the whole table (see _valid)
  deleteMultiple() {
    const ids = new Set(this._matching().map((r) => r.sys_id))
    this._db[this._table] = this._db[this._table].filter((r) => !ids.has(r.sys_id))
  }
  deleteRecord() {
    if (!this._row) return false
    const i = this._db[this._table].findIndex((r) => r.sys_id === this._row.sys_id)
    if (i < 0) return false
    this._db[this._table].splice(i, 1)
    return true
  }
}

/* ---------------------------- GlideAggregate ---------------------------- */
// Counting / summing on the server without loading every record. getAggregate() returns a STRING (PDI: '40').
export class GlideAggregate extends GlideRecord {
  constructor(table, db, log) {
    super(table, db, log)
    this._aggs = []
    this._groupBy = []
    this._out = []
    this._gi = -1
  }
  addAggregate(agg, field) { this._aggs.push({ agg: String(agg).toUpperCase(), field: field || '' }) }
  groupBy(f) { this._groupBy.push(f) }
  // addHaving('COUNT', '>', '1') — keep only groups whose aggregate passes (a SQL HAVING)
  addHaving(agg, op, value) { this._having = (this._having || []).concat([{ agg: String(agg).toUpperCase(), op: String(op), value: Number(value) }]) }
  // orderByAggregate('COUNT') — groups sorted by that aggregate, smallest first (sandbox; ⚠️ not verified in her PDI)
  orderByAggregate(agg, field) { this._aggOrder = { agg: String(agg).toUpperCase(), field: field || '' } }
  query() {
    const groups = new Map()
    for (const r of this._matching()) {
      const key = JSON.stringify(this._groupBy.map((f) => str(fieldValue(this._db, this._table, r, f))))
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(r)
    }
    if (!this._groupBy.length && !groups.size) groups.set('[]', [])
    this._out = [...groups.entries()].map(([k, rows]) => ({ key: JSON.parse(k), rows }))
    const val = (g, agg, field) => { this._out.push(g); const i = this._out.length - 1; this._gi = i; const v = Number(this.getAggregate(agg, field)); this._out.pop(); return v }
    const cmp = { '>': (a, b) => a > b, '<': (a, b) => a < b, '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '=': (a, b) => a === b, '!=': (a, b) => a !== b }
    for (const h of this._having || []) this._out = this._out.filter((g) => (cmp[h.op] || (() => true))(val(g, h.agg, ''), h.value))
    if (this._aggOrder) { const o = this._aggOrder; this._out = this._out.map((g) => [g, val(g, o.agg, o.field)]).sort((a, b) => a[1] - b[1]).map((x) => x[0]) }
    this._gi = -1
  }
  next() {
    if (this._gi + 1 >= this._out.length) return false
    this._gi++
    return true
  }
  hasNext() { return this._gi + 1 < this._out.length }
  getRowCount() { return this._out.length }
  getAggregate(agg, field) {
    const g = this._out[this._gi]
    if (!g) return null
    const vals = field ? g.rows.map((r) => str(fieldValue(this._db, this._table, r, field))).filter((v) => v !== '') : []
    const nums = vals.map(Number)
    switch (String(agg).toUpperCase()) {
      case 'COUNT': return String(field ? vals.length : g.rows.length)
      case 'SUM': return String(nums.reduce((a, b) => a + b, 0))
      case 'AVG': return nums.length ? String(nums.reduce((a, b) => a + b, 0) / nums.length) : null
      case 'MIN': return nums.length ? String(Math.min(...nums)) : null
      case 'MAX': return nums.length ? String(Math.max(...nums)) : null
      default: return null
    }
  }
  getValue(f) {
    const g = this._out[this._gi]
    const i = this._groupBy.indexOf(f)
    if (!g || i < 0) return null
    return g.key[i] === '' ? null : g.key[i]
  }
}

/* ---------------------------- GlideRecordSecure ---------------------------- */
// GlideRecord that checks ACLs for the running user (scenario.runAs + scenario.acl): rows the user can't read are skipped
// silently, insert / update / delete that the ACL denies do nothing (insert / update return null, deleteRecord false).
// ⚠️ exact return values / log text not verified in her PDI.
export class GlideRecordSecure extends GlideRecord {
  _matching() { return super._matching().filter((r) => this._allowed('read', r)) }
  get(a, b) {
    const ok = super.get(a, b)
    if (ok && !this._allowed('read', this._row)) { this._row = null; this._ids = []; return false }
    return ok
  }
  _deny(op) {
    this._log('sys', `🔒 Security restricted: ${op} on ${this._table} denied (user ki ACL permission ledu) — GlideRecordSecure em cheyyaledu.`)
    return null
  }
  insert() {
    if (!this._row) this.initialize()
    if (!this._allowed('create', this._row)) return this._deny('create')
    return super.insert()
  }
  update() {
    if (!this._row) return null
    const saved = this._db[this._table].find((r) => r.sys_id === this._row.sys_id)
    if (!saved) return this.insert()
    if (!this._allowed('write', saved)) return this._deny('write')
    return super.update()
  }
  deleteRecord() {
    if (!this._row) return false
    if (!this._allowed('delete', this._row)) { this._deny('delete'); return false }
    return super.deleteRecord()
  }
  updateMultiple() {
    const before = new Set(this._db[this._table].filter((r) => !this._allowed('write', r)).map((r) => r.sys_id))
    for (const r of this._matching()) if (!before.has(r.sys_id)) Object.assign(r, this._pending)
  }
  deleteMultiple() {
    const ids = new Set(this._matching().filter((r) => this._allowed('delete', r)).map((r) => r.sys_id))
    this._db[this._table] = this._db[this._table].filter((r) => !ids.has(r.sys_id))
  }
}

/* ---------------------------- gs ---------------------------- */
export function makeGs(logs, ctx) {
  // PDI: gs.info(null) prints "null", gs.info(undefined) prints "undefined"; {0} {1} are replaced by the extra arguments
  const s = (v) => (v === undefined ? 'undefined' : v === null ? 'null' : String(v))
  const fmt = (msg, args) => args.reduce((acc, a, i) => acc.split(`{${i}}`).join(s(a)), s(msg))
  const log = (level) => (msg, ...args) => { logs.push({ level, msg: fmt(msg, args) }) }
  const PROPS = { 'glide.product.name': 'ServiceNow', 'glide.ui.session_timeout': '30', 'glide.buildname': 'Brazil', ...((ctx && ctx.props) || {}) }
  const c = ctx || {}
  // the running user: scenario.runAs, else the PDI admin. PDI: admin passes EVERY hasRole() check (even a role that does not exist)
  const u = c.user || ADMIN
  const has = (r) => (u.roles || []).includes('admin') || (u.roles || []).includes(String(r))
  const first = String(u.name).split(' ')[0]
  const last = String(u.name).split(' ').slice(1).join(' ')
  let guid = 0
  return {
    info: log('info'), warn: log('warn'), error: log('error'), debug: log('debug'), print: log('info'),
    log: (msg) => { logs.push({ level: 'info', msg: s(msg) }) },
    addInfoMessage: (m) => { log('ui')(m); if (c.messages) c.messages.push({ type: 'info', text: s(m) }) },
    addErrorMessage: (m) => { log('ui-error')(m); if (c.messages) c.messages.push({ type: 'error', text: s(m) }) },
    getMessage: (key, args) => fmt(key, [].concat(args === undefined ? [] : args)),
    getUserID: () => u.sys_id, getUserName: () => u.user_name, getUserDisplayName: () => u.name,
    hasRole: (r) => has(r),
    nil: (x) => x === undefined || x === null || str(x) === '',
    ...GS_DATES,
    getProperty: (n, d) => (n in PROPS ? PROPS[n] : d === undefined ? null : d),
    isInteractive: () => false,
    tableExists: (t) => !!SCHEMA[String(t)],
    // sandbox: predictable 32-character ids so tests repeat (a real one is random)
    generateGUID: () => 'f'.repeat(24) + String(++guid).padStart(8, '0'),
    // gs.eventQueue('name', gr, parm1, parm2) — the sandbox only records it (__x.events); in the PDI the event lands in the
    // Event Log (sysevent) and fires Notifications / Script Actions registered for that name
    eventQueue: (name, gr, p1, p2) => {
      logs.push({ level: 'sys', msg: `[event queued: ${name}]` })
      if (c.events) c.events.push({ name: s(name), instance: gr && gr.getUniqueValue ? gr.getUniqueValue() : null, table: gr && gr.getTableName ? gr.getTableName() : null, parm1: p1 === undefined ? null : s(p1), parm2: p2 === undefined ? null : s(p2) })
    },
    // minimal GlideUser for the running user
    getUser: () => ({
      getID: () => u.sys_id, getName: () => u.user_name, getFullName: () => u.name, getDisplayName: () => u.name,
      getFirstName: () => first, getLastName: () => last, getEmail: () => u.email || '',
      hasRole: (r) => has(r), getRoles: () => (u.roles || []).slice(),
      isMemberOf: (g) => (u.groups || []).includes(String(g)),
    }),
  }
}

// record for `current` / `previous` style scenarios. If the scenario names a record that exists in the practice data
// (same sys_id or number) `current` IS that record — so current.update() changes it, like a real Business Rule / UI Action.
export function makeRecord(table, values, db, log) {
  const gr = new GlideRecord(table, db, log)
  const vals = values || {}
  const rows = db[table]
  const dbRow = (vals.sys_id && rows.find((r) => r.sys_id === str(vals.sys_id))) || (vals.number && rows.find((r) => r.number === str(vals.number)))
  gr.initialize()
  if (dbRow) Object.assign(gr._row, dbRow)
  else gr._applyDefaults()
  Object.entries(vals).forEach(([k, v]) => { gr._row[k] = norm(table, k, v) })
  if (!gr._row.sys_id) gr._row.sys_id = 'cur_' + table
  return gr
}

// scenario.seed = { incident: [ { sys_id?, ...fields } ] } — adds rows (or changes existing ones, matched by sys_id)
// so a variant can test a filter against different data
export function seedDb(db, seed) {
  for (const [table, rows] of Object.entries(seed || {})) {
    if (!SCHEMA[table]) continue
    for (const row of rows) {
      const existing = row.sys_id && db[table].find((r) => r.sys_id === row.sys_id)
      if (existing) { Object.assign(existing, row); continue }
      const blank = Object.fromEntries(Object.keys(SCHEMA[table].fields).map((f) => [f, '']))
      const full = { ...blank, ...(DEFAULTS[table] || {}), ...row }
      full.sys_id = full.sys_id || 'seed' + (db[table].length + 1)
      if (SCHEMA[table].numberPrefix && !full.number) {
        const n = Math.max(0, ...db[table].map((r) => parseInt(str(r.number).slice(3), 10) || 0)) + 1
        full.number = SCHEMA[table].numberPrefix + String(n).padStart(7, '0')
      }
      for (const [k, v] of Object.entries(full)) full[k] = norm(table, k, v)
      db[table].push(full)
    }
  }
}

export { freshDb }
