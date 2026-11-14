import { useState } from 'react'
import FilterBuilder from './FilterBuilder.jsx'
import SlushBucket from './SlushBucket.jsx'
import { cellOf } from './RecordList.jsx'
import {
  fieldMap, fieldsOf, layoutFor, derive, defaultsFor, uiEffects, dataPolicyError, getRow, rowsOf,
  refOptions, displayOf, viewForRecord, viewTitle, tableByLabel, nextNumber, isTaskTable, flowStages, flowCurrent, copyValues,
} from '../engine/ops.js'

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const dynTip = (fl, tbl) =>
  'dyn:' +
  encodeURIComponent(
    JSON.stringify({
      title: fl.label,
      body: fl.help || `Idi "${fl.label}" field (${fl.type}). Column name: ${fl.name}.`,
      real: `Column: ${tbl}.${fl.name} · Type: ${fl.type}${fl.mandatory ? ' · Mandatory' : ''}${fl.readonly ? ' · Read-only' : ''}`,
    }),
  )

export default function RecordForm({ ctx, route }) {
  const { d, mutate, go, ops } = ctx
  const { table, id, isNew, preset } = route
  const existing = id ? getRow(d, table, id) : null
  const tbl = existing?.sys_class_name || table
  const tb = d.tables[tbl]

  // values when the form was loaded (a new record's defaults) — the Process Flow formatter is drawn from these, not from unsaved edits
  const [loadVals] = useState(() => {
    if (existing) return { ...existing }
    const base = { ...defaultsFor(d, table), ...(preset || {}) }
    if (fieldsOf(d, table).some((x) => x.calc === 'number')) base.number = nextNumber(d, table)
    return base
  })
  const [vals, setVals] = useState(loadVals)
  const [view, setView] = useState(() => route.view || (existing ? viewForRecord(d, tbl, existing) : 'default'))
  const [err, setErr] = useState('')
  const [info, setInfo] = useState(route.msg || '')
  // index, or a tab title (coming back from a related list's New form opens that related list again)
  const [tab, setTab] = useState(route.tab ?? 0)
  const [menu, setMenu] = useState(false)
  const [slush, setSlush] = useState(null)

  const fm = fieldMap(d, tbl)
  const dv = derive(d, tbl, vals)
  const fx = uiEffects(d, tbl, dv)
  const layout = layoutFor(d, tbl, view)
  const main = layout[0]
  const extra = layout.slice(1)
  const isExisting = !!existing

  const set = (name) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setVals((p) => {
      const n = { ...p, [name]: v }
      // dependent fields: clear when the parent changes
      for (const fl of Object.values(fm)) {
        if (fl.dependent === name && fl.choices && !fl.choices.some((c) => c.dep === v && c.v === n[fl.name])) n[fl.name] = ''
      }
      return n
    })
  }
  const setRaw = (name, v) => setVals((p) => ({ ...p, [name]: v }))

  const isMandatory = (fl) => (fx[fl.name]?.mandatory ?? fl.mandatory) === true
  const isReadonly = (fl) => (fx[fl.name]?.readonly ?? fl.readonly) === true
  const isVisible = (fl) => fx[fl.name]?.visible !== false

  // ---------- save logic ----------
  // asNew = the values are saved as a NEW record (Submit, or Insert / Insert and Stay copying an open record)
  const validate = (asNew = !isExisting) => {
    const missing = Object.values(fm).filter(
      (fl) => isVisible(fl) && isMandatory(fl) && String(dv[fl.name] ?? '').trim() === '' && fl.type !== 'boolean',
    )
    if (missing.length) {
      setErr('The following mandatory fields are not filled in: ' + missing.map((m) => m.label).join(', '))
      return false
    }
    // "Extends table" only accepts a table that has "Extensible" ticked
    if (tbl === 'sys_db_object' && asNew && String(dv.extends ?? '') !== '') {
      const p = tableByLabel(d, dv.extends)
      if (!p) {
        setErr(`Invalid reference: "${dv.extends}" ane table ledu.`)
        return false
      }
      if (!d.tables[p].extensible) {
        setErr(`Invalid reference: "${dv.extends}" table "Extensible" kaadu — mundu aa table record lo "Extensible" tick chesi Update cheyyi.`)
        return false
      }
    }
    const dp = dataPolicyError(d, tbl, dv, asNew ? null : existing)
    if (dp) {
      setErr(dp)
      return false
    }
    setErr('')
    return true
  }

  const backToList = () => go(ctx.listRoute(route.backTo?.table || tbl, route.backTo))
  const clean = () => {
    const out = { ...dv }
    return out
  }

  // copy = Insert / Insert and Stay on an OPEN record: its (edited) values go into a NEW record; the original is not updated
  const insert = (after, copy = false) => {
    if (!validate(true)) return
    let row
    mutate((n) => {
      row = ops.insertRow(n, tbl, copy ? copyValues(clean()) : clean())
      if (after === 'makeCurrent') n.currentSet = row.name
    })
    if (after === 'stay') go({ name: 'form', table: tbl, id: row.sys_id, msg: copy ? 'Record inserted — idi kotha copy. Original record maraledu.' : 'Record inserted' })
    else backToList()
  }
  const save = () => {
    if (!validate()) return
    if (!isExisting) return insert('stay')
    mutate((n) => ops.updateRow(n, tbl, id, clean()))
    setInfo('Record updated')
  }
  const update = () => {
    if (!validate()) return
    mutate((n) => ops.updateRow(n, tbl, id, clean()))
    backToList()
  }
  const del = () => {
    mutate((n) => ops.deleteRow(n, tbl, id))
    backToList()
  }
  const resolve = () => {
    if (!String(dv.close_code || '').trim() || !String(dv.close_notes || '').trim()) {
      setErr('The following mandatory fields are not filled in: Resolution code, Resolution notes')
      return
    }
    const next = { ...clean(), state: '6' } // 6 = Resolved
    mutate((n) => (isExisting ? ops.updateRow(n, tbl, id, next) : ops.insertRow(n, tbl, next)))
    backToList()
  }

  // ---------- field rendering ----------
  const labelOf = (fl) => (
    <label>
      {isMandatory(fl) && <b className="req">∗</b>}
      {fl.labelLink ? <a className="lnk">{fl.label}</a> : fl.label}
    </label>
  )

  const resolveTable = (fl) => {
    const src = fl.ofTable
    if (src === 'table') return tableByLabel(d, dv.table)
    if (src === 'ui_policy') {
      const p = (d.rows.sys_ui_policy || []).find((x) => x.short_description === dv.ui_policy)
      return p ? tableByLabel(d, p.table) : null
    }
    if (src === 'data_policy') {
      const p = (d.rows.sys_data_policy2 || []).find((x) => x.short_description === dv.data_policy)
      return p ? tableByLabel(d, p.table) : null
    }
    return null
  }

  const control = (fl) => {
    const v = dv[fl.name] ?? ''
    const ro = isReadonly(fl)
    switch (fl.type) {
      case 'longtext':
        return <textarea rows="3" className={fl.yellow ? 'yellow' : ''} value={v} disabled={ro} onChange={set(fl.name)} aria-label={fl.label} />
      case 'boolean':
        return <input type="checkbox" className="cb" checked={v === true || v === 'true'} disabled={ro} onChange={set(fl.name)} aria-label={fl.label} />
      case 'integer':
        return <input type="number" value={v} readOnly={ro} className={ro ? 'ro-in' : ''} onChange={set(fl.name)} aria-label={fl.label} />
      case 'lockbox':
        return (
          <span className="lockbox">
            <span className="mini">🔒</span>
            <span className="mini">👥</span>
          </span>
        )
      case 'choice': {
        const parentVal = fl.dependent ? dv[fl.dependent] : null
        const opts = (fl.choices || []).filter((c) => !fl.dependent || (parentVal && c.dep === parentVal))
        if (ro) return <div className="ro">{fl.choices?.find((c) => c.v === String(v))?.label ?? v}</div>
        return (
          <select value={v} onChange={set(fl.name)} aria-label={fl.label}>
            <option value="">-- None --</option>
            {opts.map((c) => (
              <option key={c.v} value={c.v}>
                {c.label}
              </option>
            ))}
          </select>
        )
      }
      case 'reference': {
        if (ro) return <div className="ro">{v}</div>
        const list = refOptions(d, fl)
        return (
          <div className="ref">
            <input value={v} list={'dl-' + fl.name} onChange={set(fl.name)} aria-label={fl.label} />
            <datalist id={'dl-' + fl.name}>
              {list.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button type="button" className="mag-btn" tabIndex={-1} aria-label="Lookup">⌕</button>
          </div>
        )
      }
      case 'fieldname': {
        const t2 = resolveTable(fl)
        const list = t2 ? fieldsOf(d, t2).filter((x) => !x.hidden || ['active'].includes(x.name)) : []
        return (
          <select value={v} onChange={set(fl.name)} aria-label={fl.label}>
            <option value="">-- Select field --</option>
            {list.map((x) => (
              <option key={x.name} value={x.name}>
                {x.label}
              </option>
            ))}
          </select>
        )
      }
      case 'terms':
        return <FilterBuilder d={d} table={resolveTable(fl)} terms={v || []} onChange={(t) => setRaw(fl.name, t)} />
      default:
        if (ro) return <div className="ro">{v}</div>
        return <input value={v} maxLength={fl.maxLength || undefined} onChange={set(fl.name)} aria-label={fl.label} />
    }
  }

  const field = (name, wide) => {
    if (name === '#process_flow' || name.startsWith('.')) return null
    const fl = fm[name]
    if (!fl || !isVisible(fl)) return <div key={name} className="frow-empty" />
    const isCheck = fl.type === 'boolean'
    return (
      <div
        key={name}
        className={'frow' + (wide ? ' wide' : '') + (isCheck ? ' check' : '') + (fl.type === 'terms' ? ' terms' : '')}
        data-tour={'f-' + name}
        data-tip={fl.tip || dynTip(fl, tbl)}
      >
        {labelOf(fl)}
        {control(fl)}
      </div>
    )
  }

  // Process Flow formatter: DISPLAY only. Stages = System UI > Process Flow records of this table (sorted by Order);
  // the current stage is the first whose Condition matches the SAVED record (a new record: its values at load).
  // Changing State on the form does not move it until the record is saved and the form reloads.
  const renderFlow = () => {
    const stages = flowStages(d, tbl)
    const ci = flowCurrent(stages, derive(d, tbl, existing || loadVals))
    return (
      <div className="flow" data-tour="process-flow" data-tip="flow">
        {stages.map((s, i) => (
          <span key={s.sys_id} data-tour={'flow-' + slug(s.label)} className={'flow-step' + (i < ci ? ' done' : '') + (i === ci ? ' cur' : '')} style={{ textAlign: 'center', cursor: 'default' }}>
            {s.label}
          </span>
        ))}
        {!stages.length && <span className="muted small">Process Flow: ee table ki stages levu (System UI → Process Flow lo records create cheyyi).</span>}
      </div>
    )
  }

  // Layout items in order. '.begin_split' … '.split' … '.end_split' = a 2-column area (left | right); everything else is full width.
  const renderItems = (items) => {
    const nodes = []
    const flow = items.includes('#process_flow') ? <div key="flow">{renderFlow()}</div> : null
    const plain = items.filter((x) => x !== '#process_flow')
    let i = 0
    while (i < plain.length) {
      const it = plain[i]
      if (it === '.begin_split') {
        const left = []
        const right = []
        let side = left
        i++
        while (i < plain.length && plain[i] !== '.end_split') {
          if (plain[i] === '.split') side = right
          else if (!plain[i].startsWith('.')) side.push(plain[i])
          i++
        }
        i++ // skip '.end_split'
        for (let k = 0; k < Math.max(left.length, right.length); k++) {
          nodes.push(left[k] ? field(left[k]) : <div key={'l' + nodes.length} className="frow-empty" />)
          nodes.push(right[k] ? field(right[k]) : <div key={'r' + nodes.length} className="frow-empty" />)
        }
      } else {
        if (!it.startsWith('.')) nodes.push(field(it, true))
        i++
      }
    }
    return (
      <>
        {flow}
        <div className="fgrid">{nodes}</div>
      </>
    )
  }

  // ---------- related lists ----------
  const relTabs = isExisting ? tb.related || [] : []
  const parentDisp = displayOf(d, tbl, existing)
  const tabs = [...extra.map((s) => ({ kind: 'sec', s })), ...relTabs.map((r) => ({ kind: 'rel', r }))]
  const tabTitle = (tobj) => (tobj.kind === 'sec' ? tobj.s.name : tobj.r.title)
  const cur = (typeof tab === 'string' && tabs.find((tobj) => tabTitle(tobj) === tab)) || tabs[Math.min(typeof tab === 'number' ? tab : 0, tabs.length - 1)]

  const renderRel = (r) => {
    if (r.dict) {
      const tt = existing.name // the table this record describes
      const own = d.tables[tt]?.fields || []
      return (
        <div className="rel">
          <div className="rel-head">
            <b>Table Columns</b>
            <button type="button" className="fb-btn" data-tour="col-all" onClick={() => go({ name: 'dict.list', table: tt })}>
              All columns
            </button>
            <button type="button" className="fb-btn" data-tour="col-new" onClick={() => go({ name: 'dict.form', table: tt, isNew: true, k: Date.now() })}>
              New
            </button>
          </div>
          <table className="mini-grid">
            <thead>
              <tr><th>Column label</th><th>Column name</th><th>Type</th><th>Max length</th><th>Default value</th><th>Display</th></tr>
            </thead>
            <tbody>
              {own.map((f2) => (
                <tr key={f2.name} onClick={() => go({ name: 'dict.form', table: tt, field: f2.name })}>
                  <td><a className="lnk">{f2.label}</a></td><td>{f2.name}</td><td>{f2.type}</td><td>{f2.maxLength || ''}</td><td>{String(f2.default ?? '')}</td><td>{String(d.tables[tt]?.display === f2.name)}</td>
                </tr>
              ))}
              {!own.length && (
                <tr><td colSpan="6" className="center nodata">Insert a new row... (Ee table ki own columns levu{d.tables[tt]?.extends ? ' — parent columns inherit avtayi, "All columns" chudu' : ''}.)</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }
    if (r.slush) {
      const chosen = existing[r.slush] || []
      return (
        <div className="rel">
          <div className="rel-head">
            <b>{r.title}</b>
            <button type="button" className="fb-btn" data-tour={'edit-' + r.slush} onClick={() => setSlush(r)}>
              Edit...
            </button>
          </div>
          {slush?.slush === r.slush ? (
            <SlushBucket
              title={`Edit ${r.title}`}
              available={rowsOf(d, r.source).map((x) => displayOf(d, r.source, x))}
              selected={chosen}
              onCancel={() => setSlush(null)}
              onSave={(sel) => {
                mutate((n) => ops.updateRow(n, tbl, id, { [r.slush]: sel }))
                setVals((p) => ({ ...p, [r.slush]: sel }))
                setSlush(null)
                setInfo(`${r.title} updated`)
              }}
            />
          ) : (
            <table className="mini-grid">
              <thead><tr><th>{r.title}</th></tr></thead>
              <tbody>
                {chosen.map((c) => (
                  <tr key={c}><td>{c}</td></tr>
                ))}
                {!chosen.length && <tr><td className="center nodata">No records to display</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      )
    }
    const ct = r.table
    const cfm = fieldMap(d, ct)
    const key = r.fieldInParent ? existing[r.fieldInParent] : parentDisp
    const rows = rowsOf(d, ct).filter((x) => x[r.field] === key)
    const cols = (d.tables[ct].listCols || []).filter((c) => cfm[c])
    return (
      <div className="rel">
        <div className="rel-head">
          <b>{d.tables[ct].listTitle || d.tables[ct].label}</b>
          {!r.readonlyList && (
            <button type="button" className="fb-btn" data-tour={'rel-new-' + ct} onClick={() => go({ name: 'form', table: ct, isNew: true, k: Date.now(), preset: { [r.field]: key }, backTo: { name: 'form', table: tbl, id, tab: r.title } })}>
              New
            </button>
          )}
        </div>
        <table className="mini-grid" data-tour={'rel-grid-' + ct}>
          <thead>
            <tr>{cols.map((c) => <th key={c}>{cfm[c].label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.sys_id} onClick={() => !r.readonlyList && go({ name: 'form', table: ct, id: row.sys_id })}>
                {cols.map((c, i) => (
                  <td key={c}>{i === 0 && !r.readonlyList ? <a className="lnk">{String(cellOf(d, cfm[c], row))}</a> : String(cellOf(d, cfm[c], row))}</td>
                ))}
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={cols.length} className="center nodata">No records to display</td></tr>}
          </tbody>
        </table>
      </div>
    )
  }

  // ---------- menu / buttons ----------
  const views = ['default', ...(d.rows.sys_ui_view || []).map((v) => v.name)]
  // Insert / Insert and Stay copy the OPEN record, so they show on existing records only — and never on task tables
  // (incident...). Tables and update sets are left out of the mock: copying them would clash on name.
  const canInsertCopy = isExisting && !isTaskTable(d, tbl) && !['sys_db_object', 'sys_update_set'].includes(tbl)
  const menuItem = (key, label, fn) => (
    <button key={key} type="button" className="mi" data-tour={'menu-' + key} onClick={() => { setMenu(false); fn() }}>
      {label}
    </button>
  )

  const topButtons = (bottom) => (
    <>
      {!isExisting && (
        <>
          <button type="button" className="fb-btn" data-tip="fSubmit" data-tour={bottom ? undefined : 'f-submit'} onClick={() => insert()}>Submit</button>
          {tb.buttons?.includes('Submit and Make Current') && (
            <button type="button" className="fb-btn" data-tour={bottom ? undefined : 'f-submit-current'} onClick={() => insert('makeCurrent')}>Submit and Make Current</button>
          )}
        </>
      )}
      {isExisting && (
        <>
          <button type="button" className="fb-btn" data-tip="fUpdate" data-tour={bottom ? undefined : 'f-update'} onClick={update}>Update</button>
          {bottom && <button type="button" className="fb-btn" data-tour="f-delete" onClick={del}>Delete</button>}
        </>
      )}
      {tb.buttons?.includes('Resolve') && <button type="button" className="fb-btn" data-tip="fResolve" onClick={resolve}>Resolve</button>}
    </>
  )

  const title2 = isExisting ? displayOf(d, tbl, existing) : 'New record'

  return (
    <div className="form-page" data-tour="form-page">
      <div className="form-bar">
        <button className="fb-back" data-tip="formBack" data-tour="f-back" onClick={() => go(ctx.listRoute(route.backTo?.table || tbl, route.backTo))} aria-label="Back">‹</button>
        <div className="menu-wrap">
          <button className="fb-menu" data-tip="fMenu" data-tour="f-menu" onClick={() => setMenu((m) => !m)} aria-label="Form menu">☰</button>
          {menu && (
            <div className="form-menu" data-tour="form-menu">
              {menuItem('save', 'Save', save)}
              {canInsertCopy && menuItem('insert', 'Insert', () => insert(undefined, true))}
              {canInsertCopy && menuItem('insert-stay', 'Insert and Stay', () => insert('stay', true))}
              {isExisting && menuItem('delete', 'Delete', del)}
              <div className="mi-h">View</div>
              {views.map((v) => menuItem('view-' + v, (v === view ? '✓ ' : '') + viewTitle(d, v), () => setView(v)))}
              <div className="mi-h">Configure</div>
              {menuItem('cfg-dictionary', 'Dictionary', () => go({ name: 'dict.list', table: tbl }))}
              {menuItem('cfg-layout', 'Form Layout', () => go({ name: 'layout', table: tbl, view }))}
              {menuItem('cfg-table', 'Table', () => go({ name: 'form', table: 'sys_db_object', id: tbl }))}
              {menuItem('cfg-uipolicy', 'UI Policies', () => go({ name: 'list', table: 'sys_ui_policy', terms: [{ field: 'table', op: 'is', value: tb.label }] }))}
            </div>
          )}
        </div>
        <div className="fb-title">
          {tb.label}
          <br />
          <span>{title2}{view !== 'default' ? ` · View: ${viewTitle(d, view)}` : ''}</span>
        </div>
        <div className="spacer" />
        <button className="fb-ico" aria-label="Attach">⌁</button>
        <button className="fb-ico" aria-label="More">⋯</button>
        {topButtons(false)}
      </div>

      <div className="form-scroll">
        {err && <div className="form-err" data-tour="form-err">⛔ {err}</div>}
        {info && <div className="form-ok" data-tour="form-ok">✔ {info}</div>}

        <div data-tour="main-section">{renderItems(main.fields)}</div>

        {tb.relatedSearch && (
          <>
            <div className="rel-divider"><span>Related Search Results ⌄</span></div>
            <div className="rel-search">
              <label>Related Search</label>
              <div className="rs-box">⌕<input aria-label="Related search" /></div>
              <select defaultValue="all"><option value="all">Knowledge &amp; Catalog (All)</option></select>
            </div>
            <div className="rel-none">No results to display</div>
          </>
        )}

        {tabs.length > 0 && (
          <>
            <div className="tabs" data-tour="form-tabs">
              {tabs.map((tobj, i) => (
                <button key={i} type="button" className={'tab' + (cur === tobj ? ' on' : '')} data-tour={'tab-' + (tobj.kind === 'sec' ? tobj.s.name : tobj.r.title).toLowerCase().replace(/[^a-z]+/g, '-')} onClick={() => setTab(i)}>
                  {tobj.kind === 'sec' ? tobj.s.name : tobj.r.title}
                </button>
              ))}
            </div>
            <div className="tab-body">{cur.kind === 'sec' ? renderItems(cur.s.fields) : renderRel(cur.r)}</div>
          </>
        )}

        <div className="bottom-btns">{topButtons(true)}</div>

        {/* There is no "Mark as Complete" in the PDI: you set State = Complete and click Update. Export to XML shows once the
            SAVED state is Complete; Make This My Current Set only while it is In progress. */}
        {tbl === 'sys_update_set' && isExisting && (
          <div className="rel-links" data-tour="us-links">
            <b>Related Links</b>
            {existing.state === 'In progress' && (
              <a className="lnk" data-tour="us-make-current" onClick={() => { mutate((n) => { n.currentSet = existing.name }); setInfo(`"${existing.name}" ippudu nee Current update set ✔`) }}>Make This My Current Set</a>
            )}
            {existing.state === 'Complete' && (
              <a className="lnk" data-tour="us-export" onClick={() => setInfo(`Export to XML: "${existing.name}.xml" download ayyindi (mock). Real lo idi XML file ga save avtundi.`)}>Export to XML</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
