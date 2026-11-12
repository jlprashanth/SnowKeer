import { useEffect, useState } from 'react'
import { TIPS } from '../data/tips.js'

// One global tooltip. Any element with data-tip="key" gets a Tenglish help card on hover.
export default function Tooltip({ enabled }) {
  const [tip, setTip] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setTip(null)
      return
    }
    const over = (e) => {
      const el = e.target.closest?.('[data-tip]')
      if (!el) return setTip(null)
      const k = el.dataset.tip
      let data = null
      try {
        data = k.startsWith('dyn:') ? JSON.parse(decodeURIComponent(k.slice(4))) : TIPS[k]
      } catch {
        data = null
      }
      if (!data) return setTip(null)
      setTip({ data, rect: el.getBoundingClientRect() })
    }
    const out = (e) => {
      if (!e.relatedTarget?.closest?.('[data-tip]')) setTip(null)
    }
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [enabled])

  if (!tip) return null
  const W = 320
  const { rect, data } = tip
  const below = rect.bottom + 12 + 190 < window.innerHeight
  const top = below ? rect.bottom + 10 : Math.max(8, rect.top - 10 - 190)
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - W - 8)

  return (
    <div className="tip-card" style={{ top, left, width: W }} role="tooltip">
      <div className="tip-title">💡 {data.title}</div>
      <div className="tip-body">{data.body}</div>
      {data.real && <div className="tip-real">🔎 {data.real}</div>}
    </div>
  )
}
