import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'

// Thin React wrapper around CodeMirror 6. `value` is the source of truth; Ctrl/Cmd+Enter runs.
export default function CodeEditor({ value, onChange, onRun, readOnly = false, minHeight = 160 }) {
  const host = useRef(null)
  const view = useRef(null)
  const cb = useRef({ onChange, onRun })
  cb.current = { onChange, onRun }

  useEffect(() => {
    const v = new EditorView({
      doc: value,
      parent: host.current,
      extensions: [
        basicSetup,
        javascript(),
        // Prec.highest: basicSetup's own Mod-Enter ("insert blank line") would otherwise win
        Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { cb.current.onRun?.(); return true } }])),
        keymap.of([indentWithTab]),
        EditorView.editable.of(!readOnly),
        EditorView.theme({
          '&': { fontSize: '14px', border: '1px solid #cbd5da', borderRadius: '6px', background: '#fff' },
          '.cm-scroller': { fontFamily: 'Consolas, "Courier New", monospace', minHeight: minHeight + 'px' },
          '&.cm-focused': { outline: '2px solid #2c8f6e55' },
        }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) cb.current.onChange?.(u.state.doc.toString())
        }),
      ],
    })
    view.current = v
    return () => v.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // external changes (Reset / Show solution)
  useEffect(() => {
    const v = view.current
    if (v && value !== v.state.doc.toString()) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } })
  }, [value])

  return <div ref={host} className="code-editor" />
}
