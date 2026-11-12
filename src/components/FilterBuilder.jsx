import { fieldsOf, opsFor } from '../engine/ops.js'

// Condition builder (list filter, UI policy conditions, view rules, assignment rules...)
export default function FilterBuilder({ d, table, terms, onChange, onRun, onClear, runLabel = 'Run' }) {
  const fields = table
    ? fieldsOf(d, table).filter((x) => !['lockbox', 'terms'].includes(x.type))
    : []
  const fm = Object.fromEntries(fields.map((x) => [x.name, x]))

  const upd = (i, patch) => onChange(terms.map((t, n) => (n === i ? { ...t, ...patch } : t)))
  const add = (or) =>
    onChange([...terms, { field: fields[0]?.name || '', op: 'is', value: defaultVal(fields[0]), or: !!or && terms.length > 0 }])
  const del = (i) => onChange(terms.filter((_, n) => n !== i))

  const defaultVal = (fl) => (fl?.type === 'choice' ? fl.choices?.[0]?.v ?? '' : fl?.type === 'boolean' ? 'true' : '')

  const valueCtl = (t, i) => {
    const fl = fm[t.field]
    if (t.op === 'is empty' || t.op === 'is not empty') return <span className="fb-none" />
    if (fl?.type === 'choice')
      return (
        <select className="fb-val" data-tour={'fb-value-' + i} value={t.value} onChange={(e) => upd(i, { value: e.target.value })}>
          {fl.choices.map((c) => (
            <option key={c.v} value={c.v}>
              {c.label}
            </option>
          ))}
        </select>
      )
    if (fl?.type === 'boolean')
      return (
        <select className="fb-val" data-tour={'fb-value-' + i} value={t.value} onChange={(e) => upd(i, { value: e.target.value })}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      )
    return (
      <input
        className="fb-val"
        data-tour={'fb-value-' + i}
        value={t.value}
        placeholder="value"
        onChange={(e) => upd(i, { value: e.target.value })}
      />
    )
  }

  return (
    <div className="fb" data-tour="filter-panel">
      {!table && <div className="fb-empty">Mundu "Table" select cheyyi — appudu fields vastayi.</div>}
      {table && (
        <>
          <div className="fb-bar">
            <button type="button" className="fb-btn" data-tour="fb-add" onClick={() => add(false)}>
              Add Filter Condition
            </button>
            <button type="button" className="fb-btn" data-tour="fb-or" onClick={() => add(true)}>
              Add OR Clause
            </button>
            {onClear && (
              <button type="button" className="fb-link" onClick={onClear}>
                Clear all
              </button>
            )}
            <div className="spacer" />
            {onRun && (
              <button type="button" className="fb-run" data-tour="fb-run" onClick={onRun}>
                {runLabel}
              </button>
            )}
          </div>
          {terms.map((t, i) => (
            <div key={i} className="fb-row">
              <span className="fb-join">{i === 0 ? '' : t.or ? 'OR' : 'AND'}</span>
              <select
                className="fb-fld"
                data-tour={'fb-field-' + i}
                value={t.field}
                onChange={(e) => upd(i, { field: e.target.value, op: 'is', value: defaultVal(fm[e.target.value]) })}
              >
                {fields.map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.label}
                  </option>
                ))}
              </select>
              <select className="fb-op" data-tour={'fb-op-' + i} value={t.op} onChange={(e) => upd(i, { op: e.target.value })}>
                {opsFor(fm[t.field]?.type).map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {valueCtl(t, i)}
              <button type="button" className="fb-x" aria-label="Remove condition" onClick={() => del(i)}>
                ✕
              </button>
            </div>
          ))}
          {!terms.length && <div className="fb-empty">-- No filter conditions --</div>}
        </>
      )}
    </div>
  )
}
