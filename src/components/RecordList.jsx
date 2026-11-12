import { useMemo, useState } from 'react'
import FilterBuilder from './FilterBuilder.jsx'
import { rowsOf, fieldMap, crumbText, evalTerms, displayOf } from '../engine/ops.js'

const twoLine = (s) => {
  const [dt, tm] = String(s || '').split(' ')
  return (
    <>
      {dt}
      <br />
      {tm || ''}
    </>
  )
}

export function cellOf(d, fl, row) {
  const v = row[fl.name]
  if (fl.type === 'choice') return fl.choices?.find((c) => c.v === String(v))?.label ?? (v || '')
  if (fl.type === 'boolean') return String(v === undefined ? '' : v)
  if (fl.type === 'terms') return (v || []).length ? `${v.length} condition(s)` : ''
  if (fl.type === 'fieldname') return v || ''
  return v ?? ''
}

export default function RecordList({ ctx, route }) {
  const { d, go, mutate } = ctx
  const t = route.table
  const tb = d.tables[t]
  const fm = fieldMap(d, t)
  const cols = (tb.listCols?.length ? tb.listCols : Object.keys(fm).filter((n) => !fm[n].hidden).slice(0, 6)).filter((n) => fm[n])

  const [terms, setTerms] = useState(route.terms || [])
  const [draft, setDraft] = useState(route.terms || [])
  const [showFilter, setShowFilter] = useState(false)
  const [q, setQ] = useState('')
  const [col, setCol] = useState({})
  const [picked, setPicked] = useState([])

  const rows = useMemo(() => {
    let r = rowsOf(d, t).filter((row) => evalTerms(terms, (f) => String(row[f] ?? '')))
    if (q) {
      const ql = q.toLowerCase()
      r = r.filter((row) => cols.some((c) => String(cellOf(d, fm[c], row)).toLowerCase().includes(ql)))
    }
    r = r.filter((row) => cols.every((c) => !col[c] || String(cellOf(d, fm[c], row)).toLowerCase().includes(col[c].toLowerCase())))
    const keys = tb.sort || []
    if (!keys.length) return [...r].reverse()
    const rank = (f, row) => {
      const fl = fm[f]
      if (fl?.type === 'choice') return fl.choices.findIndex((c) => c.v === String(row[f]))
      return String(row[f] ?? '')
    }
    return [...r].sort((a, b) => {
      for (const k of keys) {
        const dir = k.startsWith('-') ? -1 : 1
        const f = k.replace('-', '')
        const x = rank(f, a)
        const y = rank(f, b)
        if (x < y) return -1 * dir
        if (x > y) return 1 * dir
      }
      return 0
    })
  }, [d, t, terms, q, col])

  const title = tb.listTitle || tb.label + 's'
  const open = (row) => go({ name: 'form', table: row.sys_class_name || t, id: row.sys_id })
  const run = () => {
    setTerms(draft)
    setShowFilter(false)
  }
  const doAction = (e) => {
    if (e.target.value === 'Delete' && picked.length) {
      mutate((n) => picked.forEach((id) => ctx.ops.deleteRow(n, t, id)))
      setPicked([])
    }
    e.target.value = ''
  }
  const first = cols[0]

  return (
    <div className="list-page" data-tour="list-page">
      <div className="list-tools">
        <button className="lt-ico" aria-label="Menu">☰</button>
        <button className={'lt-ico' + (showFilter ? ' on' : '')} data-tip="listFilter" data-tour="list-filter-btn" aria-label="Filter" onClick={() => setShowFilter((s) => !s)}>
          ⛉
        </button>
        <button className="lt-ico" aria-label="Context">▤</button>
        <b className="lt-title" data-tip="listTitle" data-tour="list-title">{title}</b>
        <select className="lt-select" aria-label="Search field" defaultValue="all">
          <option value="all">All fields</option>
        </select>
        <input className="lt-search" data-tip="listSearch" data-tour="list-search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="spacer" />
        <button className="lt-ico plain" aria-label="Pulse">∿</button>
        <button className="lt-ico plain" aria-label="Settings">⚙</button>
        <select className="lt-actions" aria-label="Actions on selected rows" defaultValue="" onChange={doAction}>
          <option value="">Actions on selected rows...</option>
          <option>Delete</option>
        </select>
        <button className="btn-new" data-tip="listNew" data-tour="list-new" onClick={() => go({ name: 'form', table: t, isNew: true, k: Date.now() })}>
          New
        </button>
      </div>
      <div className="crumbs" data-tip="listBreadcrumb" data-tour="crumbs">
        <span className="crumb-text">{crumbText(d, t, terms)}</span>
        {terms.length > 0 && (
          <button className="crumb-x" data-tour="crumb-clear" onClick={() => { setTerms([]); setDraft([]) }} aria-label="Clear filter">
            ✕
          </button>
        )}
      </div>

      {showFilter && (
        <div className="filter-slot">
          <FilterBuilder d={d} table={t} terms={draft} onChange={setDraft} onRun={run} onClear={() => setDraft([])} />
        </div>
      )}

      <div className="grid-wrap">
        <table className="grid">
          <thead data-tour="list-header" data-tip="listHeaderCol">
            <tr className="head-row">
              <th className="chk"><input type="checkbox" aria-label="Select all" onChange={(e) => setPicked(e.target.checked ? rows.map((r) => r.sys_id) : [])} /></th>
              <th className="mag">⌕</th>
              {cols.map((c) => (
                <th key={c}>
                  {fm[c].label}
                  {tb.sort?.includes(c) && <span className="sort"> ▲</span>}
                </th>
              ))}
            </tr>
            <tr className="search-row">
              <th className="chk" />
              <th className="mag" />
              {cols.map((c) => (
                <th key={c}>
                  <input placeholder="Search" aria-label={'Search ' + fm[c].label} value={col[c] || ''} onChange={(e) => setCol((p) => ({ ...p, [c]: e.target.value }))} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.sys_id} data-tour={idx === 0 ? 'list-row-first' : undefined}>
                <td className="chk">
                  <input type="checkbox" aria-label="Select row" checked={picked.includes(row.sys_id)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, row.sys_id] : p.filter((x) => x !== row.sys_id)))} />
                </td>
                <td className="mag" />
                {cols.map((c) => {
                  const fl = fm[c]
                  const txt = cellOf(d, fl, row)
                  if (c === first)
                    return (
                      <td key={c}>
                        <a className="lnk" data-tour={idx === 0 ? 'list-open-first' : undefined} data-tip={c === 'number' ? 'listNumber' : undefined} onClick={() => open(row)}>
                          {String(txt) || '(empty)'}
                        </a>
                      </td>
                    )
                  if (fl.type === 'datetime') return <td key={c}>{twoLine(txt)}</td>
                  if (fl.dot1 && String(row[c]) === '1')
                    return (
                      <td key={c} data-tip="listPriority">
                        <i className="dot" />
                        {txt}
                      </td>
                    )
                  if (fl.type === 'reference' && txt) return <td key={c}><a className="lnk">{txt}</a></td>
                  return (
                    <td key={c} data-tip={c === 'priority' ? 'listPriority' : c === 'state' ? 'listState' : undefined}>
                      {String(txt) === '' ? (fl.type === 'reference' ? '(empty)' : '') : String(txt)}
                    </td>
                  )
                })}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={cols.length + 2} className="center nodata">No records to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span className="pg off">⏮</span>
        <span className="pg off">◀</span>
        <span className="pg-box">1</span> to {rows.length} of {rows.length}
        <span className="pg">▶</span>
        <span className="pg">⏭</span>
      </div>
    </div>
  )
}
export { displayOf }
