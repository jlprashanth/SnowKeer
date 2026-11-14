import { Fragment } from 'react'
import { fieldsOf, opsFor } from '../engine/ops.js'

// Condition builder (list filter, UI policy conditions, view rules, assignment rules, process flow...).
// Same logic as an encoded query in her PDI (see ops.evalTerms):
//   AND          -> a new condition that must ALSO be true                      (^)
//   OR           -> an alternative for the condition just above it: A AND (B OR C)  (^OR)
//   New Criteria -> a separate set of conditions, OR'ed with everything before   (^NQ)
export default function FilterBuilder({ d, table, terms, onChange, onRun, onClear, runLabel = 'Run' }) {
  const fields = table
    ? fieldsOf(d, table).filter((x) => !['lockbox', 'terms'].includes(x.type))
    : []
  const fm = Object.fromEntries(fields.map((x) => [x.name, x]))

  const defaultVal = (fl) => (fl?.type === 'choice' ? fl.choices?.[0]?.v ?? '' : fl?.type === 'boolean' ? 'true' : '')
  const upd = (i, patch) => onChange(terms.map((t, n) => (n === i ? { ...t, ...patch } : t)))
  const add = (kind) => {
    const last = terms[terms.length - 1]
    // an OR condition starts on the same field as the condition it joins
    const fl = kind === 'or' && last && fm[last.field] ? fm[last.field] : fields[0]
    const first = terms.length === 0
    onChange([...terms, { field: fl?.name || '', op: 'is', value: defaultVal(fl), or: kind === 'or' && !first, nq: kind === 'nq' && !first }])
  }
  const del = (i) => onChange(terms.filter((_, n) => n !== i))

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
            <button type="button" className="fb-btn" data-tour="fb-add" title="AND: kotha condition — idi KUDA true avvali" onClick={() => add('and')}>
              AND
            </button>
            <button type="button" className="fb-btn" data-tour="fb-or" title="OR: paina unna (last) condition ki alternative — A AND (B OR C)" onClick={() => add('or')}>
              OR
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
          {terms.map((t, i) => {
            const nq = i > 0 && t.nq
            const or = i > 0 && !t.nq && t.or
            return (
              <Fragment key={i}>
                {nq && <div className="fb-empty" style={{ fontWeight: 700 }}>— or — (New Criteria: ee kinda conditions oka separate set)</div>}
                <div className="fb-row" style={or ? { marginLeft: 26 } : undefined}>
                  <span className="fb-join">{i === 0 || nq ? '' : or ? 'OR' : 'AND'}</span>
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
              </Fragment>
            )
          })}
          {!terms.length && <div className="fb-empty">-- No filter conditions -- ("AND" click chesi condition add cheyyi)</div>}
          {terms.length > 0 && (
            <button type="button" className="fb-link" data-tour="fb-nq" title="Kotha condition set — paina unna set ki OR (^NQ)" onClick={() => add('nq')}>
              New Criteria
            </button>
          )}
        </>
      )}
    </div>
  )
}
