import { PDI_CHECKS } from '../data/pdi-checks.js'

// "🔍 PDI lo ela check cheyyali?" box under a ⚠️ fact. ids = the item's checks: ['key'] (recipes in pdi-checks.js).
// Closed by default so busy cards stay short; click the title row for steps, what to look for and cleanup.
export default function PdiCheck({ ids }) {
  if (!ids?.length) return null
  return ids.map((id) => {
    const c = PDI_CHECKS[id]
    if (!c) return null
    return (
      <details key={id} className="pdi-check">
        <summary>🔍 PDI lo ela check cheyyali? — {c.title}</summary>
        <ol className="pdi-check-steps">
          {c.steps.map((s, i) => (
            <li key={i}>
              {typeof s === 'string' ? s : s.t}
              {s.code && <pre className="term-ex">{s.code}</pre>}
            </li>
          ))}
        </ol>
        <div><b>👀 Em chudali:</b> {c.see}</div>
        <div className="ex-cleanup"><b>🧹 Cleanup:</b> {c.cleanup}</div>
      </details>
    )
  })
}
