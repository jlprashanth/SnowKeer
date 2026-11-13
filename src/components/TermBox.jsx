import { GLOSSARY_GROUPS, GLOSSARY_JS, termsFor } from '../data/glossary-js.js'

// Sub-box inside a learn card: "📘 Ee topic lo words" — term → meaning rows.
// keys = glossary keys listed on the card, e.g. ['gs', 'GlideRecord', 'gr'].
// collapsible = card sub-boxes: closed by default (title + count), click to expand. The side panel's list and the
// full glossary use the plain always-open version.
export function TermBox({ keys, title = '📘 Ee topic lo words', collapsible = false }) {
  const items = termsFor(keys)
  if (!items.length) return null
  const rows = (
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
  )
  if (collapsible) {
    return (
      <details className="term-box term-fold">
        <summary className="term-title">{title} ({items.length})</summary>
        {rows}
      </details>
    )
  }
  return (
    <div className="term-box">
      <div className="term-title">{title}</div>
      {rows}
    </div>
  )
}

// Full glossary: every term grouped by kind. stage 2 (hub, Stage 2 lessons) = JavaScript part only;
// stage 3 (Stage 3 lessons) = everything, including the client-side words.
export function GlossaryPanel({ stage = 2 }) {
  const all = termsFor(Object.keys(GLOSSARY_JS)).filter((t) => stage >= 3 || !t.s)
  return (
    <details className="glossary">
      <summary>{stage >= 3 ? '📚 Full glossary — all words' : '📚 JavaScript part — words & abbreviations'} ({all.length})</summary>
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
