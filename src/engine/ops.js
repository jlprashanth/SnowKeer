// The "mini ServiceNow" engine. Everything is plain JSON in one `db` object, so the UI can
// clone it, change it, and a lesson can reset it. All functions here take `d` (a mutable clone).

export const DONE = ['Resolved', 'Closed', 'Canceled']
export const uid = () => Math.random().toString(36).slice(2, 10)
export const nowStr = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
export const snake = (s) =>
  'u_' +
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

// config tables = changes that get captured in an Update Set
export const CONFIG = {
  sys_db_object: 'Table',
  sys_app_application: 'Application Menu',
  sys_app_module: 'Module',
  sys_ui_policy: 'UI Policy',
  sys_ui_policy_action: 'UI Policy Action',
  sys_data_policy2: 'Data Policy',
  sys_data_policy_rule: 'Data Policy Rule',
  sys_ui_view: 'View',
  sys_ui_view_rule: 'View Rule',
  sysrule_assignment: 'Assignment Rule',
  dl_u_priority: 'Priority Data Lookup Rule',
}

/* ---------- tables, fields, layout ---------- */
export const chain = (d, t) => {
  const out = []
  let c = t
  while (c && d.tables[c] && !out.includes(c)) {
    out.push(c)
    c = d.tables[c].extends
  }
  return out
}

export function tableByLabel(d, label) {
  if (!label) return null
  return Object.values(d.tables).find((x) => x.label === label || x.name === label)?.name || null
}

export function fieldsOf(d, t) {
  const ch = chain(d, t)
  const out = []
  for (const n of [...ch].reverse()) {
    for (const fl of d.tables[n].fields) {
      let ov = null
      for (const c of ch) {
        if (c === n) break
        const o = d.tables[c].overrides?.[fl.name]
        if (o) {
          ov = o
          break
        }
      }
      out.push({ ...fl, ...(ov || {}), _from: n, _overridden: !!ov })
    }
  }
  return out
}

export const fieldMap = (d, t) => Object.fromEntries(fieldsOf(d, t).map((x) => [x.name, x]))

export function layoutFor(d, t, view = 'default') {
  const ch = chain(d, t)
  for (const c of ch) {
    const l = d.tables[c].layouts?.[view]
    if (l) return l
  }
  if (view !== 'default') return layoutFor(d, t, 'default')
  const names = fieldsOf(d, t)
    .filter((x) => !x.hidden)
    .map((x) => x.name)
  return [{ name: d.tables[t].label, fields: names }]
}

export const viewTitle = (d, v) =>
  v === 'default' ? 'Default view' : (d.rows.sys_ui_view || []).find((x) => x.name === v)?.title || v

export function addField(d, t, fld, opts = {}) {
  const tb = d.tables[t]
  tb.fields.push(fld)
  const lay = tb.layouts?.default
  if (lay && !lay[0].fields.includes(fld.name)) lay[0].fields.push(fld.name)
  if (!tb.display && fld.type === 'string') tb.display = fld.name
  if (!opts.silent) recordConfig(d, 'Dictionary Entry', `${t}.${fld.name}`)
}

/* ---------- rows ---------- */
export function rowsOf(d, t) {
  if (t === 'sys_db_object') {
    return Object.values(d.tables).map((x) => ({
      sys_id: x.name,
      sys_class_name: 'sys_db_object',
      label: x.label,
      name: x.name,
      extends: x.extends ? d.tables[x.extends]?.label || x.extends : '',
      application: 'Global',
    }))
  }
  const own = d.rows[t] || []
  const kids = Object.keys(d.tables).filter((n) => n !== t && chain(d, n).includes(t))
  return [...own, ...kids.flatMap((k) => d.rows[k] || [])]
}

export const getRow = (d, t, id) => rowsOf(d, t).find((r) => r.sys_id === id)

export function displayOf(d, t, row) {
  if (!row) return ''
  const tb = d.tables[row.sys_class_name || t] || d.tables[t]
  const key = tb?.display
  return (key && row[key]) || row.name || row.title || row.number || row.short_description || row.sys_id
}

export function refOptions(d, fld) {
  if (!fld.ref) return []
  if (fld.ref === 'sys_db_object') return Object.values(d.tables).map((x) => x.label)
  if (fld.ref === 'sys_app_application') return (d.rows.sys_app_application || []).map((r) => r.title)
  return rowsOf(d, fld.ref).map((r) => displayOf(d, fld.ref, r))
}

export function nextNumber(d, t) {
  const ch = chain(d, t)
  const owner = ch.find((c) => d.tables[c].autoNumber)
  const cfg = d.tables[owner]?.autoNumber
  if (!cfg) return ''
  const nums = rowsOf(d, owner)
    .map((r) => parseInt(String(r.number || '').replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  const n = Math.max(cfg.start - 1, ...nums) + 1
  return cfg.prefix + String(n).padStart(7, '0')
}

export const defaultsFor = (d, t) =>
  Object.fromEntries(
    fieldsOf(d, t)
      .filter((x) => x.default !== undefined && x.default !== '')
      .map((x) => [x.name, x.default]),
  )

/* ---------- condition terms (used by list filters, policies, rules) ---------- */
export const OPS = {
  string: ['is', 'is not', 'contains', 'does not contain', 'starts with', 'ends with', 'is empty', 'is not empty'],
  choice: ['is', 'is not', 'is empty', 'is not empty'],
  reference: ['is', 'is not', 'contains', 'is empty', 'is not empty'],
  boolean: ['is'],
}
export const opsFor = (type) => OPS[type] || OPS.string

export function opMatch(op, val, target) {
  const v = String(val ?? '')
  let t = String(target ?? '')
  if (t === '@me') t = 'System Administrator'
  const lv = v.toLowerCase()
  const lt = t.toLowerCase()
  switch (op) {
    case 'is': return v === t
    case 'is not': return v !== t
    case 'contains': return lv.includes(lt)
    case 'does not contain': return !lv.includes(lt)
    case 'starts with': return lv.startsWith(lt)
    case 'ends with': return lv.endsWith(lt)
    case 'is empty': return v === ''
    case 'is not empty': return v !== ''
    default: return true
  }
}

export function evalTerms(terms, getVal) {
  if (!terms || !terms.length) return true
  const groups = []
  for (const tm of terms) {
    if (tm.or || !groups.length) groups.push([])
    groups[groups.length - 1].push(tm)
  }
  return groups.some((g) => g.every((tm) => opMatch(tm.op, getVal(tm.field), tm.value)))
}

const SYM = { is: '=', 'is not': '!=', contains: 'LIKE', 'does not contain': 'NOTLIKE', 'starts with': 'STARTSWITH', 'ends with': 'ENDSWITH' }
export function toEncoded(terms) {
  return (terms || [])
    .map((t, i) => {
      const lead = i === 0 ? '' : t.or ? '^OR' : '^'
      if (t.op === 'is empty') return `${lead}${t.field}ISEMPTY`
      if (t.op === 'is not empty') return `${lead}${t.field}ISNOTEMPTY`
      return `${lead}${t.field}${SYM[t.op] || '='}${t.value}`
    })
    .join('')
}
export function fromEncoded(q) {
  if (!q) return []
  const out = []
  q.split('^').forEach((part, i) => {
    let or = false
    if (part.startsWith('OR')) {
      or = true
      part = part.slice(2)
    }
    let m
    if ((m = part.match(/^(\w+)ISEMPTY$/))) out.push({ field: m[1], op: 'is empty', value: '', or })
    else if ((m = part.match(/^(\w+)ISNOTEMPTY$/))) out.push({ field: m[1], op: 'is not empty', value: '', or })
    else if ((m = part.match(/^(\w+?)(!=|=|NOTLIKE|LIKE|STARTSWITH|ENDSWITH)(.*)$/))) {
      const op = Object.keys(SYM).find((k) => SYM[k] === m[2])
      out.push({ field: m[1], op, value: m[3], or })
    }
    if (i === 0) out[out.length - 1] && (out[out.length - 1].or = false)
  })
  return out
}

export function crumbText(d, t, terms) {
  const fm = fieldMap(d, t)
  const lbl = (fl, v) => {
    if (v === '@me') return 'Me'
    if (fl?.type === 'choice') return fl.choices?.find((c) => c.v === v)?.label || v
    return v
  }
  if (!terms || !terms.length) return 'All'
  return terms
    .map((tm, i) => {
      const fl = fm[tm.field]
      const name = fl?.label || tm.field
      const val = tm.op === 'is empty' || tm.op === 'is not empty' ? '' : lbl(fl, tm.value)
      const op = { is: '=', 'is not': '!=' }[tm.op] || tm.op
      return `${i ? (tm.or ? 'OR ' : '> ') : ''}${name} ${op} ${val}`.trim()
    })
    .join(' ')
}

/* ---------- computed fields ---------- */
export function derive(d, t, vals) {
  const v = { ...vals }
  for (const fl of fieldsOf(d, t)) {
    if (fl.calc === 'priority') {
      const def = (d.rows.dl_definition || []).find((r) => r.name === 'Priority Data Lookup')
      if (!def || def.active !== false) {
        const m = (d.rows.dl_u_priority || []).find(
          (r) => String(r.impact) === String(v.impact) && String(r.urgency) === String(v.urgency),
        )
        if (m) v.priority = String(m.priority)
      }
    }
    if (fl.calc === 'tablename') v.name = v.label ? snake(v.label) : ''
    if (fl.calc === 'fullname') v.name = [v.first_name, v.last_name].filter(Boolean).join(' ')
  }
  return v
}

/* ---------- policies ---------- */
const policyApplies = (d, t, polTableLabel, inherit) => {
  const pt = tableByLabel(d, polTableLabel)
  if (!pt) return false
  if (pt === t) return true
  return inherit && chain(d, t).includes(pt)
}

// UI policies + Data policies that are "also used as UI policy" -> client side effects
export function uiEffects(d, t, vals) {
  const out = {}
  const put = (field, key, val) => {
    out[field] = { ...(out[field] || {}), [key]: val }
  }
  const getVal = (f) => String(vals[f] ?? '')
  for (const p of d.rows.sys_ui_policy || []) {
    if (p.active === false || !policyApplies(d, t, p.table, p.inherit)) continue
    const match = evalTerms(p.conditions, getVal)
    if (!match && p.reverse === false) continue
    for (const a of d.rows.sys_ui_policy_action || []) {
      if (a.ui_policy !== p.short_description) continue
      for (const key of ['mandatory', 'visible', 'readonly']) {
        const v = a[key]
        if (!v || v === 'Leave alone') continue
        put(a.field_name, key, match ? v === 'True' : v !== 'True')
      }
    }
  }
  for (const p of d.rows.sys_data_policy2 || []) {
    if (p.active === false || p.use_ui === false || !policyApplies(d, t, p.table, p.inherit)) continue
    const match = evalTerms(p.conditions, getVal)
    if (!match && p.reverse === false) continue
    for (const r of d.rows.sys_data_policy_rule || []) {
      if (r.data_policy !== p.short_description) continue
      if (r.mandatory && r.mandatory !== 'Leave alone') put(r.field_name, 'mandatory', match ? r.mandatory === 'True' : r.mandatory !== 'True')
      if (r.disabled && r.disabled !== 'Leave alone') put(r.field_name, 'readonly', match ? r.disabled === 'True' : r.disabled !== 'True')
    }
  }
  return out
}

// server-side enforcement (works even when the UI policy part is turned off)
export function dataPolicyError(d, t, vals, old) {
  const fm = fieldMap(d, t)
  for (const p of d.rows.sys_data_policy2 || []) {
    if (p.active === false || !policyApplies(d, t, p.table, p.inherit)) continue
    if (!evalTerms(p.conditions, (f) => String(vals[f] ?? ''))) continue
    for (const r of d.rows.sys_data_policy_rule || []) {
      if (r.data_policy !== p.short_description) continue
      const label = fm[r.field_name]?.label || r.field_name
      if (r.mandatory === 'True' && String(vals[r.field_name] ?? '').trim() === '')
        return `Data Policy Exception: ${label} is mandatory`
      if (r.disabled === 'True' && old && String(vals[r.field_name] ?? '') !== String(old[r.field_name] ?? ''))
        return `Data Policy Exception: ${label} is read only`
    }
  }
  return null
}

export function viewForRecord(d, t, vals) {
  for (const r of d.rows.sys_ui_view_rule || []) {
    if (r.active === false) continue
    if (tableByLabel(d, r.table) !== t) continue
    if (evalTerms(r.conditions, (f) => String(vals[f] ?? ''))) {
      const v = (d.rows.sys_ui_view || []).find((x) => x.title === r.view || x.name === r.view)
      return v ? v.name : r.view
    }
  }
  return 'default'
}

/* ---------- update sets ---------- */
export function recordConfig(d, kind, name, action = 'INSERT_OR_UPDATE') {
  const setName = d.currentSet
  const set = (d.rows.sys_update_set || []).find((s) => s.name === setName)
  if (!set || set.state !== 'In progress') return
  const arr = (d.rows.sys_update_xml ||= [])
  const ex = arr.find((r) => r.update_set === setName && r.type === kind && r.target_name === name)
  if (ex) {
    ex.action = action
    ex.sys_updated_on = nowStr()
  } else
    arr.push({
      sys_id: uid(),
      sys_class_name: 'sys_update_xml',
      update_set: setName,
      name: `${kind.toLowerCase().replace(/[^a-z]+/g, '_')}_${uid()}`,
      type: kind,
      target_name: name,
      action,
      sys_created_on: nowStr(),
      sys_updated_by: 'admin',
    })
}

/* ---------- write operations ---------- */
function applyAssignment(d, t, row) {
  if (row.assignment_group) return
  for (const r of d.rows.sysrule_assignment || []) {
    if (r.active === false || tableByLabel(d, r.table) !== t) continue
    if (evalTerms(r.conditions, (f) => String(row[f] ?? ''))) {
      row.assignment_group = r.assignment_group
      return
    }
  }
}

function createTable(d, row) {
  const name = snake(row.label)
  const parent = tableByLabel(d, row.extends)
  const fields = []
  const auto = row.auto_number
  const tb = {
    name,
    label: row.label,
    extends: parent,
    custom: true,
    fields,
    layouts: {},
    listCols: [],
    display: null,
    autoNumber: auto
      ? { prefix: row.label.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase(), start: 1 }
      : parent
        ? undefined
        : undefined,
  }
  d.tables[name] = tb
  d.rows[name] = []
  if (auto && !parent) {
    fields.push({ name: 'number', label: 'Number', type: 'string', readonly: true, calc: 'number' })
    tb.display = 'number'
  }
  recordConfig(d, 'Table', name)
  if (row.create_module !== false) {
    let menu = row.menu
    if (!menu || menu === '-- Create new --') menu = row.new_menu || row.label
    const apps = (d.rows.sys_app_application ||= [])
    if (!apps.find((a) => a.title === menu)) {
      apps.push({ sys_id: uid(), sys_class_name: 'sys_app_application', title: menu, order: 100, active: true, application: 'Global' })
      recordConfig(d, 'Application Menu', menu)
    }
    const mods = (d.rows.sys_app_module ||= [])
    mods.push({ sys_id: uid(), sys_class_name: 'sys_app_module', title: 'Create New', application: menu, order: 100, link_type: 'New Record', table: row.label, filter: '', active: true })
    mods.push({ sys_id: uid(), sys_class_name: 'sys_app_module', title: 'All', application: menu, order: 200, link_type: 'List of Records', table: row.label, filter: '', active: true })
    recordConfig(d, 'Module', `${menu} > Create New`)
    recordConfig(d, 'Module', `${menu} > All`)
  }
  return { sys_id: name, sys_class_name: 'sys_db_object', ...row, name }
}

function stamp(row, isNew) {
  const n = nowStr()
  if (isNew && !row.opened_at) row.opened_at = n
  row.sys_updated_on = n
  row.sys_updated_by = 'admin'
}

export function insertRow(d, t, vals, { silent } = {}) {
  if (t === 'sys_db_object') return createTable(d, derive(d, t, { ...defaultsFor(d, t), ...vals }))
  let row = derive(d, t, { ...defaultsFor(d, t), ...vals })
  row.sys_id = uid()
  row.sys_class_name = t
  if (fieldsOf(d, t).some((x) => x.calc === 'number') && !row.number) row.number = nextNumber(d, t)
  if (t === 'incident') {
    row.active = !DONE.includes(row.state)
    applyAssignment(d, t, row)
  }
  stamp(row, true)
  ;(d.rows[t] ||= []).push(row)
  if (!silent && CONFIG[t]) recordConfig(d, CONFIG[t], displayOf(d, t, row))
  return row
}

export function updateRow(d, t, id, vals) {
  const cur = getRow(d, t, id)
  if (!cur) return null
  if (t === 'sys_db_object') {
    if (d.tables[id]) d.tables[id].label = vals.label || d.tables[id].label
    recordConfig(d, 'Table', id)
    return cur
  }
  const cls = cur.sys_class_name || t
  const arr = d.rows[cls]
  const i = arr.findIndex((r) => r.sys_id === id)
  let row = derive(d, cls, { ...arr[i], ...vals })
  if (cls === 'incident') {
    row.active = !DONE.includes(row.state)
    applyAssignment(d, cls, row)
  }
  stamp(row, false)
  arr[i] = row
  if (CONFIG[cls]) recordConfig(d, CONFIG[cls], displayOf(d, cls, row))
  return row
}

export function deleteRow(d, t, id) {
  const cur = getRow(d, t, id)
  if (!cur) return
  if (t === 'sys_db_object') {
    delete d.tables[id]
    delete d.rows[id]
    return
  }
  const cls = cur.sys_class_name || t
  d.rows[cls] = d.rows[cls].filter((r) => r.sys_id !== id)
  if (CONFIG[cls]) recordConfig(d, CONFIG[cls], displayOf(d, cls, cur), 'DELETE')
}

/* ---------- navigator ---------- */
export function buildNav(d) {
  const menus = [...(d.rows.sys_app_application || [])]
    .filter((m) => m.active !== false)
    .sort((a, b) => Number(a.order) - Number(b.order) || a.title.localeCompare(b.title))
  const mods = d.rows.sys_app_module || []
  return menus.map((m) => ({
    id: m.sys_id,
    name: m.title,
    modules: mods
      .filter((x) => x.application === m.title && x.active !== false)
      .sort((a, b) => Number(a.order) - Number(b.order))
      .map((x) => ({ id: x.sys_id, name: x.title, mod: x })),
  }))
}

export function moduleRoute(d, mod) {
  const t = tableByLabel(d, mod.table)
  switch (mod.link_type) {
    case 'Homepage':
      return { name: 'home' }
    case 'List of Records':
      return t ? { name: 'list', table: t, terms: fromEncoded(mod.filter) } : { name: 'soon', title: mod.title }
    case 'New Record':
      return t ? { name: 'form', table: t, isNew: true, k: Date.now() } : { name: 'soon', title: mod.title }
    case 'Page':
      return { name: 'page', id: mod.table }
    default:
      return { name: 'soon', title: mod.title }
  }
}
