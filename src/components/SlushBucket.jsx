import { useState } from 'react'

// "Slushbucket": Available <-> Selected. Used for Roles/Groups, Form Layout, etc.
// items are strings. `repeatable` items (like |- split -| in Form Layout) stay in Available after being added.
export default function SlushBucket({ title, available, selected, repeatable = [], ordered, onSave, onCancel, tourPrefix = 'sb' }) {
  const [sel, setSel] = useState(selected)
  const [pickL, setPickL] = useState([])
  const [pickR, setPickR] = useState([])
  const left = [...available.filter((a) => !sel.includes(a)), ...repeatable]

  const add = () => {
    setSel((s) => [...s, ...pickL])
    setPickL([])
  }
  const remove = () => {
    setSel((s) => s.filter((x) => !pickR.includes(x) || false))
    setPickR([])
  }
  const move = (dir) => {
    if (pickR.length !== 1) return
    setSel((s) => {
      const i = s.indexOf(pickR[0])
      const j = i + dir
      if (i < 0 || j < 0 || j >= s.length) return s
      const n = [...s]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  }
  const opts = (e) => [...e.target.selectedOptions].map((o) => o.value)

  return (
    <div className="sb" data-tour={tourPrefix + '-box'}>
      {title && <div className="sb-title">{title}</div>}
      <div className="sb-cols">
        <div className="sb-col">
          <div className="sb-h">Available</div>
          <select multiple size={10} data-tour={tourPrefix + '-left'} value={pickL} onChange={(e) => setPickL(opts(e))} onDoubleClick={add}>
            {left.map((x, i) => (
              <option key={x + i} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div className="sb-mid">
          <button type="button" data-tour={tourPrefix + '-add'} onClick={add} aria-label="Add">
            ▶
          </button>
          <button type="button" data-tour={tourPrefix + '-remove'} onClick={remove} aria-label="Remove">
            ◀
          </button>
        </div>
        <div className="sb-col">
          <div className="sb-h">Selected</div>
          <select multiple size={10} data-tour={tourPrefix + '-right'} value={pickR} onChange={(e) => setPickR(opts(e))} onDoubleClick={remove}>
            {sel.map((x, i) => (
              <option key={x + i} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        {ordered && (
          <div className="sb-mid">
            <button type="button" onClick={() => move(-1)} aria-label="Up">
              ▲
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Down">
              ▼
            </button>
          </div>
        )}
      </div>
      <div className="sb-foot">
        <button type="button" className="fb-btn" data-tour={tourPrefix + '-save'} onClick={() => onSave(sel)}>
          Save
        </button>
        <button type="button" className="fb-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
