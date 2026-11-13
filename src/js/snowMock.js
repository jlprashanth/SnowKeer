// Tiny mock of the ServiceNow server-side API (gs + GlideRecord) so learners can write
// real-looking scripts in the browser. Pure ES module: used by the Web Worker and by node tests.
import { CHOICES, SCHEMA, freshDb } from './snowData.js'

const NOW = '2026-11-12 10:00:00'
const str = (v) => (v === undefined || v === null ? '' : String(v))

/* ---------------------------- GlideElement ---------------------------- */
// What `gr.priority` gives you. Like the real thing it is an OBJECT: `==` works with strings,
// `===` against a plain string does not. Use gr.getValue('priority') for a real string.
class GlideElement {
  constructor(gr, name) {
    this._gr = gr
    this._name = name
    this._v = str(gr._row?.[name])
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
  toString() { return this._v }
  valueOf() { return this._type === 'boolean' ? this._v === 'true' : this._v }
  getValue() { return this._v }
  nil() { return this._v === '' }
  // changes()/changesTo()/changesFrom() compare against `previous` (set by runScript for current/previous scenarios)
  _prev() { const p = this._gr._previous; return p ? str(p._row?.[this._name]) : null }
  changes() { const p = this._prev(); return p !== null && p !== this._v }
  changesTo(v) { return this.changes() && this._v === str(v) }
  changesFrom(v) { const p = this._prev(); return this.changes() && p === str(v) }
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

function test(rowVal, op, target) {
  const a = str(rowVal)
  const t = str(target)
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

// conds: array of groups; a row matches when EVERY group has at least one true condition
// (a new group = AND, a condition added to an existing group = OR)
const matches = (row, groups) => groups.every((g) => g.some((c) => test(row[c.field], c.op, c.value)))

function parseEncoded(q) {
  const out = { groups: [], order: [] }
  for (const raw of String(q).split('^')) {
    if (!raw || raw === 'NQ') continue
    if (raw.startsWith('ORDERBYDESC')) { out.order.push({ f: raw.slice(11), desc: true }); continue }
    if (raw.startsWith('ORDERBY')) { out.order.push({ f: raw.slice(7), desc: false }); continue }
    const isOr = raw.startsWith('OR')
    const body = isOr ? raw.slice(2) : raw
    // operator = the one that appears EARLIEST (field names never contain operators); on a tie the longer one wins
    let op = null, i = -1
    for (const o of OPS) {
      const k = body.indexOf(o)
      if (k >= 0 && (i < 0 || k < i || (k === i && o.length > op.length))) { op = o; i = k }
    }
    if (!op) continue
    const cond = { field: body.slice(0, i), op, value: body.slice(i + op.length) }
    if (isOr && out.groups.length) out.groups[out.groups.length - 1].push(cond)
    else out.groups.push([cond])
  }
  return out
}

/* ---------------------------- GlideRecord ---------------------------- */
export class GlideRecord {
  constructor(table, db) {
    if (!SCHEMA[table]) throw new Error(`Invalid table: ${table} (practice sandbox lo ivi matrame untayi: ${Object.keys(SCHEMA).join(', ')})`)
    this._table = table
    this._db = db || globalThis.__snowDb
    this._groups = []
    this._order = []
    this._limit = 0
    this._ids = []
    this._idx = -1
    this._row = null
    return new Proxy(this, {
      get: (t, p, r) => {
        if (typeof p === 'symbol' || p in t) return Reflect.get(t, p, r)
        if (p in SCHEMA[t._table].fields) return new GlideElement(t, p)
        return undefined
      },
      set: (t, p, v) => {
        if (typeof p === 'string' && !p.startsWith('_') && !(p in t) && p in SCHEMA[t._table].fields) {
          if (t._row) t._row[p] = str(v)
          return true
        }
        t[p] = v
        return true
      },
    })
  }

  /* building the query */
  addQuery(field, a, b) {
    let op = '=', value = a
    if (b !== undefined) { op = WORD[String(a).toUpperCase()] || String(a).toUpperCase(); value = b }
    if (Array.isArray(value)) value = value.join(',')
    const cond = { field, op, value: str(value) }
    this._groups.push([cond])
    const gr = this
    return {
      addOrCondition(f, x, y) {
        let o = '=', v = x
        if (y !== undefined) { o = WORD[String(x).toUpperCase()] || String(x).toUpperCase(); v = y }
        gr._groups[gr._groups.length - 1].push({ field: f, op: o, value: str(Array.isArray(v) ? v.join(',') : v) })
        return this
      },
    }
  }
  addActiveQuery() { return this.addQuery('active', 'true') }
  addNullQuery(f) { return this.addQuery(f, 'ISEMPTY', '') }
  addNotNullQuery(f) { return this.addQuery(f, 'ISNOTEMPTY', '') }
  addEncodedQuery(q) {
    const p = parseEncoded(q)
    this._groups.push(...p.groups)
    this._order.push(...p.order)
  }
  getEncodedQuery() { return this._groups.map((g) => g.map((c) => c.field + c.op + c.value).join('^OR')).join('^') }
  orderBy(f) { this._order.push({ f, desc: false }) }
  orderByDesc(f) { this._order.push({ f, desc: true }) }
  setLimit(n) { this._limit = Number(n) }

  /* running it */
  query() {
    let rows = this._db[this._table].filter((r) => matches(r, this._groups))
    for (const o of [...this._order].reverse()) {
      rows = [...rows].sort((x, y) => {
        const a = str(x[o.f]), b = str(y[o.f])
        const c = !isNaN(a) && !isNaN(b) && a !== '' && b !== '' ? a - b : a.localeCompare(b)
        return o.desc ? -c : c
      })
    }
    if (this._limit > 0) rows = rows.slice(0, this._limit)
    this._ids = rows.map((r) => r.sys_id)
    this._idx = -1
    this._row = null
  }
  _load(id) {
    const r = this._db[this._table].find((x) => x.sys_id === id)
    this._row = r ? { ...r } : null
    return !!r
  }
  next() {
    if (this._idx + 1 >= this._ids.length) { this._row = null; return false }
    this._idx++
    return this._load(this._ids[this._idx])
  }
  hasNext() { return this._idx + 1 < this._ids.length }
  getRowCount() { return this._ids.length }
  get(a, b) {
    const row = b === undefined ? this._db[this._table].find((r) => r.sys_id === str(a)) : this._db[this._table].find((r) => str(r[a]) === str(b))
    if (!row) { this._row = null; this._ids = []; return false }
    this._ids = [row.sys_id]
    this._idx = 0
    this._row = { ...row }
    return true
  }

  /* reading & writing fields */
  getValue(f) { return str(this._row?.[f]) }
  setValue(f, v) { if (this._row) this._row[f] = str(v) }
  getDisplayValue(f) {
    if (!f) return this._table === 'incident' ? str(this._row?.number) : str(this._row?.name || this._row?.number)
    return displayValue(this._db, this._table, f, str(this._row?.[f]))
  }
  getElement(f) { return new GlideElement(this, f) }
  getUniqueValue() { return str(this._row?.sys_id) }
  getTableName() { return this._table }
  isValid() { return true }
  isValidField(f) { return f in SCHEMA[this._table].fields }
  isValidRecord() { return !!this._row && this._db[this._table].some((r) => r.sys_id === this._row.sys_id) }
  isNewRecord() { return !!this._row && !this.isValidRecord() }
  changes() {
    const p = this._previous
    return !!p && !!this._row && Object.keys(this._row).some((k) => str(this._row[k]) !== str(p._row?.[k]))
  }
  setWorkflow() {}
  autoSysFields() {}
  setAbortAction() {}

  initialize() { this.newRecord() }
  newRecord() {
    this._row = { sys_id: '', ...(this._table === 'incident' ? { state: '1', impact: '3', urgency: '3', priority: '5', active: 'true', opened_at: NOW } : {}) }
    for (const f of Object.keys(SCHEMA[this._table].fields)) if (!(f in this._row)) this._row[f] = ''
    this._ids = []
    this._idx = -1
  }
  _nextNumber() {
    const pre = SCHEMA[this._table].numberPrefix
    const max = Math.max(0, ...this._db[this._table].map((r) => parseInt(str(r.number).slice(pre.length), 10) || 0))
    return pre + String(max + 1).padStart(7, '0')
  }
  insert() {
    if (!this._row) this.newRecord()
    const row = { ...this._row }
    row.sys_id = 'new' + (this._db._seq = (this._db._seq || 0) + 1)
    if (SCHEMA[this._table].numberPrefix && !row.number) row.number = this._nextNumber()
    this._db[this._table].push(row)
    this._row = { ...row }
    this._ids = [row.sys_id]
    this._idx = 0
    return row.sys_id
  }
  update() {
    if (!this._row) return null
    const i = this._db[this._table].findIndex((r) => r.sys_id === this._row.sys_id)
    if (i < 0) return this.insert()
    this._db[this._table][i] = { ...this._row }
    return this._row.sys_id
  }
  deleteRecord() {
    if (!this._row) return false
    const i = this._db[this._table].findIndex((r) => r.sys_id === this._row.sys_id)
    if (i < 0) return false
    this._db[this._table].splice(i, 1)
    return true
  }
}

/* ---------------------------- gs ---------------------------- */
export function makeGs(logs) {
  const fmt = (msg, args) => args.reduce((s, a, i) => s.split(`{${i}}`).join(str(a)), str(msg))
  const log = (level) => (msg, ...args) => { logs.push({ level, msg: fmt(msg, args) }) }
  const PROPS = { 'glide.product.name': 'ServiceNow', 'glide.ui.session_timeout': '30' }
  return {
    info: log('info'), warn: log('warn'), error: log('error'), debug: log('debug'), log: log('info'), print: log('info'),
    addInfoMessage: log('ui'), addErrorMessage: log('ui-error'),
    getUserID: () => 'u_admin', getUserName: () => 'admin', getUserDisplayName: () => 'System Administrator',
    hasRole: (r) => ['admin', 'itil'].includes(r),
    nil: (x) => x === undefined || x === null || str(x) === '',
    nowDateTime: () => NOW, now: () => NOW.slice(0, 10),
    getProperty: (n, d) => (n in PROPS ? PROPS[n] : d === undefined ? null : d),
    isInteractive: () => false,
    // minimal GlideUser: the practice user is "System Administrator" (u_admin)
    getUser: () => ({
      getID: () => 'u_admin', getFullName: () => 'System Administrator', getDisplayName: () => 'System Administrator',
      getFirstName: () => 'System', getLastName: () => 'Administrator', getEmail: () => 'admin@example.com',
      hasRole: (r) => ['admin', 'itil'].includes(r),
    }),
  }
}

// record for `current` / `previous` style scenarios
export function makeRecord(table, values, db) {
  const gr = new GlideRecord(table, db)
  gr.newRecord()
  Object.entries(values || {}).forEach(([k, v]) => { gr._row[k] = str(v) })
  if (!gr._row.sys_id) gr._row.sys_id = 'cur_' + table
  return gr
}

export { freshDb }
