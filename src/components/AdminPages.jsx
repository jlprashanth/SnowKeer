import { useState } from 'react'
import SlushBucket from './SlushBucket.jsx'
import { fieldsOf, layoutFor, snake, tableByLabel, viewTitle, chain, isTaskTable } from '../engine/ops.js'

// tables that extend `t` (directly or further down)
const childTablesOf = (d, t) => Object.keys(d.tables).filter((n) => n !== t && chain(d, n).includes(t))

const TYPES = [
  ['string', 'String'], ['choice', 'Choice'], ['reference', 'Reference'], ['integer', 'Integer'], ['boolean', 'True/False'], ['longtext', 'String (Long text)'], ['datetime', 'Date/Time'],
]
const typeLabel = (v) => TYPES.find((t) => t[0] === v)?.[1] || v

/* ---------- Dictionary list for one table ---------- */
export function DictList({ ctx, route }) {
  const { d, go } = ctx
  const t = route.table
  const tb = d.tables[t]
  const flds = fieldsOf(d, t).filter((x) => !x.hidden)
  return (
    <div className="list-page">
      <div className="list-tools">
        <button className="lt-ico" aria-label="Back" data-tour="dict-back" onClick={() => go({ name: 'form', table: t, isNew: true, k: Date.now() })}>‹</button>
        <b className="lt-title" data-tour="dict-title">Dictionary Entries</b>
        <span className="lt-sub">Table: {tb.label} ({t})</span>
        <div className="spacer" />
        <button className="btn-new" data-tour="dict-new" onClick={() => go({ name: 'dict.form', table: t, isNew: true, k: Date.now() })}>New</button>
      </div>
      <div className="crumbs">All &gt; Table = {t}</div>
      <div className="grid-wrap">
        <table className="grid" data-tour="dict-grid">
          <thead>
            <tr className="head-row">
              <th>Column label</th><th>Column name</th><th>Type</th><th>Table</th><th>Mandatory</th><th>Read only</th><th>Default value</th><th>Display</th>
            </tr>
          </thead>
          <tbody>
            {flds.map((x) => (
              <tr key={x.name} data-tour={'dict-row-' + x.name}>
                {/* an inherited column's dictionary entry belongs to the PARENT table (that is where Dictionary Overrides live) */}
                <td><a className="lnk" data-tour={'dict-open-' + x.name} onClick={() => go(x._from === t ? { name: 'dict.form', table: t, field: x.name } : { name: 'dict.form', table: x._from, field: x.name, backTo: { name: 'dict.list', table: t } })}>{x.label}</a></td>
                <td>{x.name}</td>
                <td>{typeLabel(x.type)}</td>
                <td>{x._from}{x._overridden ? ' (overridden)' : ''}</td>
                <td>{String(!!x.mandatory)}</td>
                <td>{String(!!x.readonly)}</td>
                <td>{String(x.default ?? '')}</td>
                <td>{String(d.tables[x._from].display === x.name)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- Dictionary entry form + its "Dictionary Overrides" related list (and the override form) ----------
   Like the PDI: an override is made from the PARENT column's dictionary entry → Dictionary Overrides → New → Table = child.
   route.override = show the override form for column route.field of table route.table (route.ovTable = child to edit). */
export function DictForm({ ctx, route }) {
  const { d, go, mutate, ops } = ctx
  const t = route.table
  const tb = d.tables[t]
  const all = fieldsOf(d, t)
  const existing = route.field ? all.find((x) => x.name === route.field) : null
  const inherited = existing && existing._from !== t
  const base = inherited ? existing._from : t // the table that owns the column
  const ovMode = !!existing && (!!route.override || inherited)
  const children = childTablesOf(d, base)
  const ovOf = (child) => (child && existing ? d.tables[child]?.overrides?.[existing.name] : null) || null
  const flagsOf = (o) => ({ mandatory: !!o && 'mandatory' in o, readonly: !!o && 'readonly' in o, default: !!o && 'default' in o })
  const startOv = route.ovTable || (inherited ? t : '')
  const [ovTable, setOvTable] = useState(startOv)
  const [f, setF] = useState(() =>
    existing
      ? { ...existing, ...(ovOf(startOv) || {}), choicesText: (existing.choices || []).map((c) => (c.dep ? `${c.label} | ${c.dep}` : c.label)).join('\n'), isDisplay: d.tables[existing._from].display === existing.name }
      : { label: '', type: 'string', maxLength: '', default: '', mandatory: false, readonly: false, dependent: '', ref: '', choicesText: '', isDisplay: false },
  )
  const [ov, setOv] = useState(() => flagsOf(ovOf(startOv)))
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const colName = existing ? existing.name : f.label ? snake(f.label) : ''

  const back = () => go(route.backTo || { name: 'dict.list', table: t })
  const toEntry = () => go({ name: 'dict.form', table: base, field: existing.name, backTo: route.backTo, k: Date.now() })

  // switching the Table shows that child's existing override (or the base column values when it has none)
  const pickOvTable = (child) => {
    setOvTable(child)
    const o = ovOf(child)
    setOv(flagsOf(o))
    setF((p) => ({ ...p, mandatory: existing.mandatory, readonly: existing.readonly, default: existing.default, ...(o || {}) }))
  }

  const submitOverride = () => {
    if (!ovTable) return setErr('The following mandatory fields are not filled in: Table')
    const o = {}
    if (ov.mandatory) o.mandatory = !!f.mandatory
    if (ov.readonly) o.readonly = !!f.readonly
    if (ov.default) o.default = String(f.default ?? '').trim()
    mutate((n) => {
      n.tables[ovTable].overrides = { ...(n.tables[ovTable].overrides || {}), [existing.name]: o }
      ops.recordConfig(n, 'Dictionary Override', `${ovTable}.${existing.name}`)
    })
    toEntry()
  }

  const submit = () => {
    if (!f.label.trim()) return setErr('The following mandatory fields are not filled in: Column label')
    if (f.type === 'reference' && !f.ref) return setErr('The following mandatory fields are not filled in: Reference')
    const choices =
      f.type === 'choice'
        ? f.choicesText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => {
              const [label, dep] = l.split('|').map((x) => x.trim())
              return { v: snake(label).replace(/^u_/, ''), label, dep: dep || undefined }
            })
        : undefined
    const def = f.default === '' ? undefined : f.type === 'boolean' ? f.default === 'true' : f.default
    const fld = {
      name: colName, label: f.label, type: f.type, maxLength: f.maxLength ? Number(f.maxLength) : undefined,
      mandatory: !!f.mandatory, readonly: !!f.readonly, default: def, dependent: f.dependent || undefined,
      ref: f.type === 'reference' ? tableByLabel(d, f.ref) : undefined, choices,
    }
    mutate((n) => {
      const ntb = n.tables[t]
      if (existing) {
        const i = ntb.fields.findIndex((x) => x.name === existing.name)
        ntb.fields[i] = { ...ntb.fields[i], ...fld, name: existing.name }
        ops.recordConfig(n, 'Dictionary Entry', `${t}.${existing.name}`)
      } else ops.addField(n, t, fld)
      if (f.isDisplay) ntb.display = existing ? existing.name : colName
    })
    back()
  }

  const dependents = all.filter((x) => x.name !== colName && x.type === 'choice').map((x) => x.name)

  if (ovMode)
    return (
      <div className="form-page">
        <div className="form-bar">
          <button className="fb-back" onClick={toEntry} aria-label="Back">‹</button>
          <div className="fb-title">Dictionary Override<br /><span>{ovTable ? `${ovTable}.${existing.name}` : 'New record'}</span></div>
          <div className="spacer" />
          <button className="fb-btn" data-tour="ov-submit" onClick={submitOverride}>Submit</button>
        </div>
        <div className="form-scroll">
          {err && <div className="form-err">⛔ {err}</div>}
          <div className="note-bar">
            "{existing.label}" column <b>{base}</b> (parent) table di. "Table" lo child table select chesi, aa child lo matrame behaviour marchu — parent ki, migatha child tables ki effect undadu.
          </div>
          <div className="fgrid">
            <div className="frow" data-tour="ov-table">
              <label><b className="req">∗</b>Table</label>
              <select value={ovTable} onChange={(e) => pickOvTable(e.target.value)} aria-label="Table">
                <option value="">-- None --</option>
                {children.map((n) => <option key={n} value={n}>{d.tables[n].label}</option>)}
              </select>
            </div>
            <div className="frow"><label>Base table</label><div className="ro">{d.tables[base].label} ({base})</div></div>
            <div className="frow"><label>Column name</label><div className="ro">{existing.label} ({existing.name})</div></div>
            {!children.length && <div className="frow"><label /><div className="muted small">Ee table ni extend chese child tables inka levu.</div></div>}
            {[['mandatory', 'Mandatory'], ['readonly', 'Read only']].map(([k, lab]) => (
              <div key={k} className="frow check" data-tour={'ov-' + k}>
                <label>Override {lab.toLowerCase()}</label>
                <input type="checkbox" className="cb" checked={ov[k]} onChange={(e) => setOv((p) => ({ ...p, [k]: e.target.checked }))} />
                <span className="lbl-inline">{lab}</span>
                <input type="checkbox" className="cb" disabled={!ov[k]} checked={!!f[k]} onChange={set(k)} data-tour={'ov-' + k + '-val'} />
              </div>
            ))}
            <div className="frow" data-tour="ov-default">
              <label>Override default value</label>
              <input type="checkbox" className="cb" checked={ov.default} onChange={(e) => setOv((p) => ({ ...p, default: e.target.checked }))} />
              <input data-tour="ov-default-val" value={f.default ?? ''} disabled={!ov.default} onChange={set('default')} aria-label="Default value" />
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="form-page">
      <div className="form-bar">
        <button className="fb-back" onClick={back} aria-label="Back">‹</button>
        <div className="fb-title">Dictionary Entry<br /><span>{existing ? `${t}.${existing.name}` : 'New record'}</span></div>
        <div className="spacer" />
        <button className="fb-btn" data-tour="dict-submit" onClick={submit}>{existing ? 'Update' : 'Submit'}</button>
      </div>
      <div className="form-scroll">
        {err && <div className="form-err">⛔ {err}</div>}
        <div className="fgrid">
          <div className="frow"><label>Table</label><div className="ro">{tb.label} ({t})</div></div>
          <div className="frow" data-tour="dd-type">
            <label>Type</label>
            <select value={f.type} onChange={set('type')} disabled={!!existing}>
              {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="frow" data-tour="dd-label" data-tip="dd-label">
            <label><b className="req">∗</b>Column label</label>
            <input value={f.label} onChange={set('label')} />
          </div>
          <div className="frow"><label>Column name</label><div className="ro">{colName}</div></div>
          {f.type === 'string' && (
            <div className="frow" data-tour="dd-maxlen" data-tip="dd-maxlen">
              <label>Max length</label>
              <input type="number" value={f.maxLength ?? ''} onChange={set('maxLength')} />
            </div>
          )}
          {f.type === 'reference' && (
            <div className="frow" data-tour="dd-ref">
              <label><b className="req">∗</b>Reference</label>
              <input list="dl-ref" value={f.ref} onChange={set('ref')} />
              <datalist id="dl-ref">{Object.values(d.tables).map((x) => <option key={x.name} value={x.label} />)}</datalist>
            </div>
          )}
          {f.type === 'choice' && (
            <div className="frow wide" data-tour="dd-choices" data-tip="dd-choices">
              <label>Choices</label>
              <textarea rows="4" value={f.choicesText} onChange={set('choicesText')} placeholder={'Oka line ki oka choice.\nDependent ayithe:  Label | parentValue'} />
            </div>
          )}
          <div className="frow" data-tour="dd-default" data-tip="dd-default">
            <label>Default value</label>
            <input value={f.default ?? ''} onChange={set('default')} />
          </div>
          <div className="frow" data-tour="dd-dependent" data-tip="dd-dependent">
            <label>Dependent</label>
            <select value={f.dependent || ''} onChange={set('dependent')}>
              <option value="">-- None --</option>
              {dependents.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="frow check" data-tour="dd-mandatory" data-tip="dd-mandatory">
            <label>Mandatory</label>
            <input type="checkbox" className="cb" checked={!!f.mandatory} onChange={set('mandatory')} />
          </div>
          <div className="frow check" data-tour="dd-readonly" data-tip="dd-readonly">
            <label>Read only</label>
            <input type="checkbox" className="cb" checked={!!f.readonly} onChange={set('readonly')} />
          </div>
          <div className="frow check" data-tour="dd-display" data-tip="dd-display">
            <label>Display</label>
            <input type="checkbox" className="cb" checked={!!f.isDisplay} onChange={set('isDisplay')} />
          </div>
        </div>
        {existing && (
          <>
            <div className="tabs">
              <button type="button" className="tab on">Dictionary Overrides</button>
            </div>
            <div className="tab-body" data-tour="ov-list">
              <div className="rel">
                <div className="rel-head">
                  <b>Dictionary Overrides</b>
                  <button type="button" className="fb-btn" data-tour="ov-new" onClick={() => go({ name: 'dict.form', table: t, field: existing.name, override: true, backTo: route.backTo, k: Date.now() })}>
                    New
                  </button>
                </div>
                <table className="mini-grid" data-tour="ov-grid">
                  <thead>
                    <tr><th>Table</th><th>Override default value</th><th>Default value</th><th>Override mandatory</th><th>Override read only</th></tr>
                  </thead>
                  <tbody>
                    {children.filter((n) => ovOf(n)).map((n) => {
                      const o = ovOf(n)
                      return (
                        <tr key={n} onClick={() => go({ name: 'dict.form', table: t, field: existing.name, override: true, ovTable: n, backTo: route.backTo, k: Date.now() })}>
                          <td><a className="lnk">{d.tables[n].label}</a></td><td>{String('default' in o)}</td><td>{String(o.default ?? '')}</td><td>{String('mandatory' in o)}</td><td>{String('readonly' in o)}</td>
                        </tr>
                      )
                    })}
                    {!children.some((n) => ovOf(n)) && <tr><td colSpan="5" className="center nodata">No records to display</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Form Layout (slushbucket) ---------- */
// layout item -> how the PDI's slushbucket shows it (2-column area: begin_split … split … end_split)
const SPLIT = { '.begin_split': '|- begin_split -|', '.split': '|- split -|', '.end_split': '|- end_split -|' }

export function FormLayout({ ctx, route }) {
  const { d, go, mutate, ops } = ctx
  const t = route.table
  const tb = d.tables[t]
  const [view, setView] = useState(route.view || 'default')
  const layout = layoutFor(d, t, view)
  const [secIdx, setSecIdx] = useState(0)
  const [newSec, setNewSec] = useState('')
  const [msg, setMsg] = useState('')
  const [local, setLocal] = useState(null)
  const sections = local || layout
  const flds = fieldsOf(d, t).filter((x) => !x.hidden)
  const toLabel = (n) => SPLIT[n] || (n === '#process_flow' ? 'Process Flow' : flds.find((x) => x.name === n)?.label || n)
  const toName = (l) => Object.keys(SPLIT).find((k) => SPLIT[k] === l) || (l === 'Process Flow' ? '#process_flow' : flds.find((x) => x.label === l)?.name || l)
  const sec = sections[Math.min(secIdx, sections.length - 1)]
  const used = new Set(sections.flatMap((s) => s.fields))
  // "Process Flow" is a formatter (not a field) — offered on task tables, like incident
  const available = [...flds.filter((x) => !used.has(x.name)).map((x) => x.label), ...(isTaskTable(d, t) && !used.has('#process_flow') ? ['Process Flow'] : [])]

  const addSection = () => {
    if (!newSec.trim()) return
    setLocal([...sections, { name: newSec.trim(), fields: [] }])
    setSecIdx(sections.length)
    setNewSec('')
  }
  const save = (selLabels) => {
    const next = sections.map((s, i) => (i === Math.min(secIdx, sections.length - 1) ? { ...s, fields: selLabels.map(toName) } : s))
    mutate((n) => {
      n.tables[t].layouts = { ...(n.tables[t].layouts || {}), [view]: next }
      ops.recordConfig(n, 'Form Section', `${t} [${view}]`)
    })
    setLocal(null)
    setMsg('Form layout saved. Form open chesi chudu ✔')
  }

  const views = ['default', ...(d.rows.sys_ui_view || []).map((v) => v.name)]
  return (
    <div className="form-page">
      <div className="form-bar">
        <button className="fb-back" aria-label="Back" onClick={() => go({ name: 'form', table: t, isNew: true, k: Date.now(), view })}>‹</button>
        <div className="fb-title">Form Layout<br /><span>{tb.label}</span></div>
        <div className="spacer" />
        <button className="fb-btn" data-tour="layout-open-form" onClick={() => go({ name: 'form', table: t, isNew: true, k: Date.now(), view })}>Open form</button>
      </div>
      <div className="form-scroll">
        {msg && <div className="form-ok" data-tour="layout-ok">✔ {msg}</div>}
        <div className="layout-top">
          <div className="frow" data-tour="layout-view" data-tip="layout-view">
            <label>View</label>
            <select value={view} onChange={(e) => { setView(e.target.value); setSecIdx(0); setLocal(null) }}>
              {views.map((v) => <option key={v} value={v}>{viewTitle(d, v)}</option>)}
            </select>
          </div>
          <div className="frow" data-tour="layout-section" data-tip="layout-section">
            <label>Section</label>
            <select value={secIdx} onChange={(e) => setSecIdx(Number(e.target.value))}>
              {sections.map((s, i) => <option key={s.name + i} value={i}>{s.name}</option>)}
            </select>
          </div>
          <div className="frow" data-tour="layout-newsec">
            <label>New section</label>
            <input value={newSec} onChange={(e) => setNewSec(e.target.value)} placeholder="Section name" />
            <button type="button" className="fb-btn" data-tour="layout-addsec" onClick={addSection}>Add section</button>
          </div>
        </div>
        <SlushBucket
          key={view + secIdx + sections.length + JSON.stringify(sec.fields)}
          tourPrefix="fl"
          title={`Section: ${sec.name}`}
          available={available}
          selected={sec.fields.map(toLabel)}
          repeatable={Object.values(SPLIT)}
          ordered
          onSave={save}
          onCancel={() => setLocal(null)}
        />
      </div>
    </div>
  )
}

export { chain }
