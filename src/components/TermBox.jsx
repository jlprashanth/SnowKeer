import { GLOSSARY_GROUPS, GLOSSARY_JS, termsFor } from '../data/glossary-js.js'

// Sub-box inside a learn card: "📘 Ee topic lo words" — term → meaning rows.
// keys = glossary keys listed on the card, e.g. ['gs', 'GlideRecord', 'gr'].
export function TermBox({ keys, title = '📘 Ee topic lo words' }) {
  const items = termsFor(keys)
  if (!items.length) return null
  return (
    <div className="term-box">
      <div className="term-title">{title}</div>
      <dl className="term-list">
        {items.map((t) => (
          <div className="term-row" key={t.term}>
            <dt><code>{t.term}</code>{t.check && <span className="term-check" title="PDI lo confirm chey">⚠️</span>}</dt>
            <dd>
              {t.m}
              {t.ex && <pre className="term-ex">{t.ex}</pre>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Full glossary: every term grouped by kind. Used on the Stage 2 hub.
export function GlossaryPanel() {
  const all = termsFor(Object.keys(GLOSSARY_JS))
  return (
    <details className="glossary">
      <summary>📚 JavaScript part — words & abbreviations ({all.length})</summary>
      <p className="muted small">Prathi word ki meaning + ServiceNow example. ⚠️ unna words PDI lo confirm chesuko.</p>
      {Object.entries(GLOSSARY_GROUPS).map(([gk, label]) => {
        const rows = all.filter((t) => t.g === gk)
        if (!rows.length) return null
        return (
          <div key={gk} className="glossary-group">
            <h4>{label} ({rows.length})</h4>
            <TermBox keys={rows.map((r) => r.term)} />
          </div>
        )
      })}
    </details>
  )
}
