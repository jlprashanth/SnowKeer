import { useEffect, useRef, useState } from 'react'
import PdiCheck from './PdiCheck.jsx'

const PAD = 6
const BUBBLE_W = 360

// Spotlight + coach bubble. Everything outside the highlighted element is blocked,
// so she can only do the step we are teaching.
export default function Tour({ lesson, stepIdx, onAdvance }) {
  const step = lesson.steps[stepIdx]
  const total = lesson.steps.length
  const [rect, setRect] = useState(null)
  const [valid, setValid] = useState(false)
  const [shake, setShake] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const advanceRef = useRef(onAdvance)
  advanceRef.current = onAdvance

  useEffect(() => {
    setValid(false)
    setRect(null)
    setShowHint(false)
    let scrolled = false
    const find = () =>
      step.target ? document.querySelector(`[data-tour="${step.target}"]`) : null

    const tick = () => {
      const el = find()
      if (!el) return setRect((p) => (p ? null : p))
      if (!scrolled) {
        scrolled = true
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      const r = el.getBoundingClientRect()
      setRect((p) =>
        p && p.x === r.x && p.y === r.y && p.w === r.width && p.h === r.height
          ? p
          : { x: r.x, y: r.y, w: r.width, h: r.height },
      )
    }
    tick()
    const id = setInterval(tick, 100)

    const onClick = (e) => {
      if (step.type !== 'click') return
      const el = find()
      if (el && el.contains(e.target)) setTimeout(() => advanceRef.current(), 60)
    }
    const onInput = (e) => {
      if (step.type !== 'input') return
      const el = find()
      if (!el || !(e.target === el || el.contains(e.target))) return
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setValid(step.validate ? step.validate(val) : true)
    }
    // capture phase: must run BEFORE React re-renders (the clicked element may disappear)
    document.addEventListener('click', onClick, true)
    document.addEventListener('input', onInput)
    document.addEventListener('change', onInput)
    return () => {
      clearInterval(id)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('input', onInput)
      document.removeEventListener('change', onInput)
    }
  }, [stepIdx, step])

  const blocked = () => {
    setShake((s) => s + 1)
    setShowHint(true)
  }

  const hole = rect && {
    x: rect.x - PAD,
    y: rect.y - PAD,
    w: rect.w + PAD * 2,
    h: rect.h + PAD * 2,
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  // info steps block everything, unless allowHover (so she can hover the highlighted thing)
  const holeOpen = hole && (step.type !== 'info' || step.allowHover)

  // bubble placement (maxHeight: an opened 🔍 PDI-check box scrolls inside the bubble instead of running off screen)
  let bubbleStyle
  if (!hole) {
    bubbleStyle = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', maxHeight: '90vh' }
  } else {
    const H = 230
    let top
    if (hole.y + hole.h + H + 16 < vh) top = hole.y + hole.h + 14
    else if (hole.y - H - 16 > 50) top = hole.y - H - 14
    else top = Math.max(60, Math.min(vh - H - 10, hole.y))
    let left = Math.min(Math.max(12, hole.x), vw - BUBBLE_W - 12)
    // if placed beside the element (not above/below), push to the side with more room
    if (top < hole.y + hole.h && top + H > hole.y) {
      left = hole.x + hole.w + 16 + BUBBLE_W < vw ? hole.x + hole.w + 16 : Math.max(12, hole.x - BUBBLE_W - 16)
    }
    bubbleStyle = { top, left, maxHeight: vh - top - 10 }
  }

  const needsNext = step.type === 'info' || (step.type === 'input' && valid)
  const last = stepIdx === total - 1

  return (
    <div className="tour-root">
      {holeOpen ? (
        <>
          <div className="blocker" style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.y) }} onClick={blocked} />
          <div className="blocker" style={{ top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }} onClick={blocked} />
          <div className="blocker" style={{ top: hole.y, left: 0, width: Math.max(0, hole.x), height: hole.h }} onClick={blocked} />
          <div className="blocker" style={{ top: hole.y, left: hole.x + hole.w, right: 0, height: hole.h }} onClick={blocked} />
        </>
      ) : (
        <div className="blocker full" onClick={blocked} />
      )}
      {hole && (
        <div className="ring" style={{ top: hole.y, left: hole.x, width: hole.w, height: hole.h }} />
      )}

      <div className={'bubble' + (shake ? ' shake' : '')} key={shake} style={{ ...bubbleStyle, width: BUBBLE_W }}>
        <div className="bubble-step">
          Step {stepIdx + 1} / {total}
        </div>
        <div className="bubble-text">{step.text}</div>
        <PdiCheck ids={step.checks} />
        {showHint && step.hint && <div className="bubble-hint">👉 {step.hint}</div>}
        {step.type === 'input' && valid && step.okText && <div className="bubble-ok">{step.okText}</div>}
        {step.type === 'click' && <div className="bubble-action">👆 Highlight chesina daggara click cheyyi</div>}
        {step.type === 'input' && !valid && <div className="bubble-action">⌨️ Highlight chesina field lo cheyyi</div>}
        <div className="bubble-foot">
          {step.type !== 'info' && !needsNext && (
            <button className="skip" onClick={() => onAdvance()}>
              Stuck aa? Skip step →
            </button>
          )}
          {needsNext ? (
            <button className="btn primary" onClick={() => onAdvance()}>
              {last ? 'Quiz start cheyyi →' : 'Next →'}
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}
