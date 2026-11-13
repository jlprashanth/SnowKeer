import { useEffect, useMemo, useState } from 'react'
import { TermBox, GlossaryPanel } from './TermBox.jsx'
import { pageTermKeys } from '../data/glossary-scan.js'

// Floating 📘 Glossary button (right edge). Opens a side card with:
//   1) "Ee page lo words" — terms used on this lesson page
//   2) the full glossary (collapsed by default)
// Mounted only on Learn/Code tabs (JsLesson hides it on Quiz), so opening it never shows answers there.
export default function LessonGlossary({ lesson }) {
  const [open, setOpen] = useState(false)
  const keys = useMemo(() => pageTermKeys(lesson), [lesson])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button className="gl-fab" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        📘 Glossary
      </button>
      {open && (
        <aside className="gl-panel" aria-label="Glossary">
          <div className="gl-head">
            <b>📘 Glossary</b>
            <button className="gl-close" onClick={() => setOpen(false)} aria-label="Close glossary">✕</button>
          </div>
          <div className="gl-body">
            {keys.length
              ? <TermBox keys={keys} title="📘 Ee page lo words" />
              : <p className="muted small">Ee page lo special words ledu. Kinda full glossary chudu 👇</p>}
            <GlossaryPanel stage={lesson.stage || 2} />
          </div>
        </aside>
      )}
    </>
  )
}
