import { useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { EXERCISES, exercisesFor } from '../data/exercises.js'
import { JS_LESSONS } from '../data/lessons-js.js'
import { CS_LESSONS } from '../data/lessons-cs.js'

// Reusable collapsible stage header — use one per stage (Stage 3+ too)
function StageHeader({ num, icon, title, subtitle, done, total, open, onToggle }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <button className={'stage-card' + (open ? ' open' : '')} onClick={onToggle} aria-expanded={open}>
      <span className="stage-badge">{icon}</span>
      <span className="stage-info">
        <span className="stage-kicker">STAGE {num}</span>
        <span className="stage-title">{title}</span>
        <span className="stage-sub">{subtitle}</span>
      </span>
      <span className="stage-progress">
        <span className="stage-count">{done}/{total} done</span>
        <span className="stage-bar"><span style={{ width: pct + '%' }} /></span>
      </span>
      <span className="stage-chev">▾</span>
    </button>
  )
}

export default function Hub({ progress, onStart, onFreePlay, onExercises, onOpenJs }) {
  const [open, setOpen] = useState({ s1: false, s2: false, s3: false })
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const jsDone = progress.jsDone || {}
  const exDone = progress.exercises || {}
  const exDoneCount = EXERCISES.filter((e) => exDone[e.id]).length
  const doneCount = LESSONS.filter((l) => progress[l.id]?.done).length
  const next = LESSONS.find((l) => !progress[l.id]?.done) || LESSONS[0]
  return (
    <div className="hub">
      <div className="hub-hero">
        <h1>ServiceNow nerchukundam 🚀</h1>
        <p>
          Videos chusaka, ikkada practice cheyyi. Nenu step-by-step guide chestanu — mistakes
          cheyyadam gurinchi bhayapadakku, idi just practice instance.
        </p>
        <div className="hub-actions">
          <button className="btn primary big" onClick={() => onStart(next.id)}>
            ▶ {doneCount ? 'Continue' : 'Start'}: {next.title}
          </button>
          <button className="btn big" onClick={onFreePlay}>
            🧪 Free Play (guide lekunda)
          </button>
          <button className="btn big" onClick={() => onExercises()}>
            🛠 Hands-on Practice ({exDoneCount}/{EXERCISES.length})
          </button>
        </div>
        <div className="muted small">
          Release: Brazil UI (Next Experience) · Progress: {doneCount}/{LESSONS.length} lessons
        </div>
      </div>

      <StageHeader num={1} icon="🧭" title="Introduction" subtitle="Account, UI tour, tables, forms, update sets" done={doneCount} total={LESSONS.length} open={open.s1} onToggle={() => toggle('s1')} />
      {open.s1 && <div className="lesson-grid stage-body">
        {LESSONS.map((l, n) => {
          const p = progress[l.id]
          return (
            <div key={l.id} className="lesson-card">
              <div className={'lesson-num' + (p?.done ? ' done' : '')}>{p?.done ? '✓' : n + 1}</div>
              <div className="lesson-main">
                <h3>{l.title}</h3>
                <p>{l.blurb}</p>
                <div className="muted small">
                  🎬 Video: <b>{l.video}</b> ({l.duration})
                  {p?.score != null && <> · Quiz: {p.score}/{l.quiz.length}</>}
                </div>
              </div>
              <div className="lesson-btns">
                <button className="btn primary" onClick={() => onStart(l.id)}>
                  {p?.done ? 'Replay' : 'Start'}
                </button>
                {exercisesFor(l.id).length > 0 && (
                  <button className="btn small" onClick={() => onExercises(l.id)}>
                    🛠 Exercises ({exercisesFor(l.id).filter((e) => exDone[e.id]).length}/{exercisesFor(l.id).length})
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>}

      <StageHeader num={2} icon="💻" title="JavaScript (ServiceNow style)" subtitle="gs, GlideRecord, incident — code ikkade run cheyyi" done={JS_LESSONS.filter((l) => l.exercises.every((e) => jsDone[e.id])).length} total={JS_LESSONS.length} open={open.s2} onToggle={() => toggle('s2')} />
      {open.s2 && <div className="stage-body">
      <div className="muted small" style={{ marginBottom: 8 }}>
        Idi generic JavaScript kaadu — anni examples ServiceNow lo (gs, GlideRecord, incident) nunchi. Code ikkade rayi run cheyochu.
      </div>
      <div className="lesson-grid">
        {JS_LESSONS.map((l, n) => {
          const p = progress[l.id]
          const codeDone = l.exercises.filter((e) => jsDone[e.id]).length
          return (
            <div key={l.id} className="lesson-card">
              <div className={'lesson-num' + (codeDone === l.exercises.length ? ' done' : '')}>{codeDone === l.exercises.length ? '✓' : n + 1}</div>
              <div className="lesson-main">
                <h3>{l.title}</h3>
                <p>{l.blurb}</p>
                <div className="muted small">
                  🎬 Video: <b>{l.video}</b>
                  {p?.score != null && <> · Quiz: {p.score}/{l.quiz.length}</>} · 💻 Code: {codeDone}/{l.exercises.length}
                </div>
              </div>
              <div className="lesson-btns">
                <button className="btn primary" onClick={() => onOpenJs(l.id)}>{p?.done || codeDone ? 'Continue' : 'Start'}</button>
              </div>
            </div>
          )
        })}
      </div>
      </div>}

      <StageHeader num={3} icon="🖱️" title="Client scripting" subtitle="g_form, g_user, Client Scripts, UI Actions — form react avtundi" done={CS_LESSONS.filter((l) => l.exercises.every((e) => jsDone[e.id])).length} total={CS_LESSONS.length} open={open.s3} onToggle={() => toggle('s3')} />
      {open.s3 && <div className="stage-body">
      <div className="muted small" style={{ marginBottom: 8 }}>
        Client scripts browser lo run avtayi. Ikkada code rasi Run cheste kinda unna mock Incident form lo marpulu live ga kanipistayi. Course lo 26 lectures anni ikkada unnayi. Konni lessons lo code ikkade run avtundi, konni (SN Utils, debugging, macros, UI Pages, UI Macros) nee real PDI lo cheyyali.
      </div>
      <div className="lesson-grid">
        {CS_LESSONS.map((l) => {
          const p = progress[l.id]
          const codeDone = l.exercises.filter((e) => jsDone[e.id]).length
          return (
            <div key={l.id} className="lesson-card">
              <div className={'lesson-num' + (codeDone === l.exercises.length ? ' done' : '')}>{codeDone === l.exercises.length ? '✓' : l.no}</div>
              <div className="lesson-main">
                <h3>{l.title}</h3>
                <p>{l.blurb}</p>
                <div className="muted small">
                  🎬 Video: <b>{l.video}</b>
                  {p?.score != null && <> · Quiz: {p.score}/{l.quiz.length}</>} · 💻 Code: {codeDone}/{l.exercises.length}
                </div>
              </div>
              <div className="lesson-btns">
                <button className="btn primary" onClick={() => onOpenJs(l.id)}>{p?.done || codeDone ? 'Continue' : 'Start'}</button>
              </div>
            </div>
          )
        })}
      </div>
      </div>}
    </div>
  )
}
