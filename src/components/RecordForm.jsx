import { useState } from 'react'
import FilterBuilder from './FilterBuilder.jsx'
import SlushBucket from './SlushBucket.jsx'
import { cellOf } from './RecordList.jsx'
import {
  fieldMap, fieldsOf, layoutFor, derive, defaultsFor, uiEffects, dataPolicyError, getRow, rowsOf,
  refOptions, displayOf, viewForRecord, viewTitle, tableByLabel, nextNumber,
} from '../engine/ops.js'

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

  const [vals, setVals] = useState(() => {
    if (existing) return { ...existing }
    const base = { ...defaultsFor(d, table), ...(preset || {}) }
    if (fieldsOf(d, table).some((x) => x.calc === 'number')) base.number = nextNumber(d, table)
    return base
  })
  const [view, setView] = useState(() => route.view || (existing ? viewForRecord(d, tbl, existing) : 'default'))
  const [err, setErr] = useState('')
  const [info, setInfo] = useState(route.msg || '')
  const [tab, setTab] = useState(0)
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
  const validate = (ignore = []) => {
    const missing = Object.values(fm).filter(
      (fl) => isVisible(fl) && isMandatory(fl) && !ignore.includes(fl.name) && String(dv[fl.name] ?? '').trim() === '' && fl.type !== 'boolean',
    )
    if (missing.length) {
      setErr('The following mandatory fields are not filled in: ' + missing.map((m) => m.label).join(', '))
      return false
    }
    const dp = dataPolicyError(d, tbl, dv, existing)
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

  const insert = (after) => {
    if (!validate()) return
    let row
    mutate((n) => {
      row = ops.insertRow(n, tbl, clean())
      if (after === 'makeCurrent') n.currentSet = row.name
    })
    if (after === 'stay') go({ name: 'form', table: tbl, id: row.sys_id, msg: 'Record inserted' })
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
    const next = { ...clean(), state: 'Resolved' }
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
    if (name === '#process_flow') return null
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

  const renderFlow = () => {
    if (!tb.flow) return null
    const cur = dv[tb.flow.field]
    const ci = tb.flow.steps.indexOf(cur)
    return (
      <div className="flow" data-tour="process-flow" data-tip="flow">
        {tb.flow.steps.map((s, i) => (
          <button key={s} type="button" data-tour={'flow-' + s.toLowerCase().replace(/[^a-z]+/g, '-')} className={'flow-step' + (i < ci ? ' done' : '') + (i === ci ? ' cur' : '')} onClick={() => setRaw(tb.flow.field, s)}>
            {s}
          </button>
        ))}
      </div>
    )
  }

  const renderItems = (items) => {
    const sp = items.indexOf('--split--')
    const en = items.indexOf('--end_split--')
    const nodes = []
    const flow = items.includes('#process_flow') ? <div key="flow">{renderFlow()}</div> : null
    const plain = items.filter((x) => x !== '#process_flow')
    const sp2 = plain.indexOf('--split--')
    const en2 = plain.indexOf('--end_split--')
    if (sp2 < 0) {
      plain.filter((x) => !x.startsWith('--')).forEach((n) => nodes.push(field(n, true)))
    } else {
      const left = plain.slice(0, sp2)
      const right = plain.slice(sp2 + 1, en2 < 0 ? undefined : en2)
      const rest = en2 < 0 ? [] : plain.slice(en2 + 1).filter((x) => !x.startsWith('--'))
      for (let i = 0; i < Math.max(left.length, right.length); i++) {
        nodes.push(left[i] ? field(left[i]) : <div key={'l' + i} className="frow-empty" />)
        nodes.push(right[i] ? field(right[i]) : <div key={'r' + i} className="frow-empty" />)
      }
      rest.forEach((n) => nodes.push(field(n, true)))
    }
    void sp
    void en
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
  const cur = tabs[Math.min(tab, tabs.length - 1)]

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
                <tr><td colSpan="6" className="center nodata">Insert a new row... (New button click chesi columns add cheyyi)</td></tr>
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
            <button type="button" className="fb-btn" data-tour={'rel-new-' + ct} onClick={() => go({ name: 'form', table: ct, isNew: true, k: Date.now(), preset: { [r.field]: key }, backTo: { name: 'form', table: tbl, id } })}>
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
              {!isExisting && menuItem('insert', 'Insert', () => insert())}
              {!isExisting && menuItem('insert-stay', 'Insert & Stay', () => insert('stay'))}
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

        {tbl === 'sys_update_set' && isExisting && (
          <div className="rel-links" data-tour="us-links">
            <b>Related Links</b>
            <a className="lnk" data-tour="us-make-current" onClick={() => { mutate((n) => { n.currentSet = existing.name }); setInfo(`"${existing.name}" ippudu nee Current update set ✔`) }}>Make this my current set</a>
            <a className="lnk" data-tour="us-complete" onClick={() => { mutate((n) => ops.updateRow(n, tbl, id, { state: 'Complete' })); setVals((p) => ({ ...p, state: 'Complete' })); setInfo('State = Complete. Ippudu ee set lo changes capture avvav.') }}>Mark as Complete</a>
            <a className="lnk" data-tour="us-export" onClick={() => setInfo(`Export to XML: "${existing.name}.xml" download ayyindi (mock). Real lo idi XML file ga save avtundi.`)}>Export to XML</a>
          </div>
        )}
      </div>
    </div>
  )
}
