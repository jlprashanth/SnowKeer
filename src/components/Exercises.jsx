import { useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { EXERCISES } from '../data/exercises.js'
import { JS_LESSONS } from '../data/lessons-js.js'
import { CS_LESSONS } from '../data/lessons-cs.js'

const RANK = { easy: 0, medium: 1, 'medium+': 1.5, hard: 2 }
const LEVEL = { easy: '🟢 Easy', medium: '🟡 Medium', 'medium+': '🟠 Medium+', hard: '🔴 Hard' }
const byLevel = (list) => [...list].sort((a, b) => RANK[a.level] - RANK[b.level]) // stable: easy → hard

export function Card({ e, done, onToggle }) {
  const [hint, setHint] = useState(false)
  const [shown, setShown] = useState(0) // how many steps revealed
  const [answer, setAnswer] = useState(false)
  const allSteps = shown >= e.steps.length
  return (
    <div className={'ex-card' + (done ? ' done' : '')}>
      <div className="ex-head">
        <h3>{e.title}</h3>
        <span className="ex-level">{LEVEL[e.level]}</span>
      </div>
      <p className="ex-scenario">{e.scenario}</p>
      <div className="muted small">Nee real PDI lo cheyyi 👉 idi nee instance lo changes chestundi, last lo cleanup step marchipoku.</div>

      <div className="ex-actions">
        {e.hint && !hint && <button className="btn small" onClick={() => setHint(true)}>💡 Hint</button>}
        {!allSteps && (
          <button className="btn small" onClick={() => setShown((n) => n + 1)}>
            {shown === 0 ? '🪜 Steps chupinchu' : 'Next step →'}
          </button>
        )}
        {shown > 0 && !allSteps && <button className="btn small" onClick={() => setShown(e.steps.length)}>Anni steps</button>}
        {!answer && <button className="btn small" onClick={() => setAnswer(true)}>✅ Answer chupinchu</button>}
      </div>

      {hint && <div className="ex-block ex-hint">💡 {e.hint}</div>}
      {shown > 0 && (
        <ol className="ex-steps">
          {e.steps.slice(0, shown).map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      )}
      {answer && (
        <div className="ex-block ex-answer">
          <b>Expected result:</b> {e.answer}
          {e.cleanup && <div className="ex-cleanup"><b>🧹 Cleanup:</b> {e.cleanup}</div>}
        </div>
      )}

      <label className="ex-done">
        <input type="checkbox" checked={done} onChange={() => onToggle(e.id)} /> Chesesaanu ✔
      </label>
    </div>
  )
}

// Expandable row: click the head to show/hide the body
function Fold({ title, meta, open, onToggle, top = false, nested = false, children }) {
  return (
    <div className={'fold' + (top ? ' fold-top' : '') + (nested ? ' fold-nested' : '')}>
      <button className="fold-head" aria-expanded={open} onClick={onToggle}>
        <span className="fold-title">{title}</span>
        {meta && <span className="fold-meta">{meta}</span>}
        <span className="fold-chev">▾</span>
      </button>
      {open && <div className="fold-body">{children}</div>}
    </div>
  )
}

export default function Exercises({ lessonId, progress, onToggle, onJsToggle, onOpenJs, onBack }) {
  const done = progress.exercises || {} // Stage 1 (real PDI)
  const jsDone = progress.jsDone || {} // Stage 2 + Stage 3 (code runner + PDI practice)
  const [open, setOpen] = useState({})
  const flip = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))

  // Opened from a single Stage 1 lesson's "Exercises" button
  if (lessonId) {
    const lesson = LESSONS.find((l) => l.id === lessonId)
    const list = byLevel(EXERCISES.filter((e) => e.lessonId === lessonId))
    const doneCount = list.filter((e) => done[e.id]).length
    return (
      <div className="ex-page">
        <button className="btn small" onClick={onBack}>← Course ki back</button>
        <h2>🛠 Hands-on Practice: {lesson?.title}</h2>
        <p className="muted">
          Prathi task nee <b>own PDI</b> lo cheyyali. Mundu try chey — struck ayithe Hint, tarvata Steps, last lo Answer
          chupinchu. Progress: <b>{doneCount}/{list.length}</b>
        </p>
        {list.map((e) => <Card key={e.id} e={e} done={!!done[e.id]} onToggle={onToggle} />)}
      </div>
    )
  }

  // All stages
  const s2Ex = JS_LESSONS.flatMap((l) => l.exercises)
  const s3Ex = CS_LESSONS.flatMap((l) => l.exercises)
  const s1Done = EXERCISES.filter((e) => done[e.id]).length
  const s2Done = s2Ex.filter((e) => jsDone[e.id]).length
  const s3Done = s3Ex.filter((e) => jsDone[e.id]).length
  const totalAll = EXERCISES.length + s2Ex.length + s3Ex.length
  const doneAll = s1Done + s2Done + s3Done

  // A lesson's exercise list for Stage 2/3: code exercises open the lesson runner, PDI ones expand in place
  const jsLessonBlock = (l, stageKey) => {
    const exs = byLevel(l.exercises)
    const n = exs.filter((e) => jsDone[e.id]).length
    const lk = stageKey + ':' + l.id
    const isPdi = l.mode === 'pdi'
    return (
      <Fold key={lk} title={l.title} meta={`${n}/${exs.length} done`} open={!!open[lk]} onToggle={() => flip(lk)} nested>
        {exs.map((e) => {
          const ek = 'ex:' + e.id
          const isDone = !!jsDone[e.id]
          return (
            <Fold key={ek} title={(isDone ? '✓ ' : '') + e.title} meta={LEVEL[e.level]} open={!!open[ek]} onToggle={() => flip(ek)} nested>
              {isPdi ? (
                <Card e={e} done={isDone} onToggle={onJsToggle} />
              ) : (
                <div>
                  <p className="ex-scenario">{e.task}</p>
                  <button className="btn small" onClick={() => onOpenJs(l.id)}>💻 Lesson lo open cheyyi (code run cheyyi)</button>
                </div>
              )}
            </Fold>
          )
        })}
      </Fold>
    )
  }

  const s1Key = 's1'
  const s2Key = 's2'
  const s3Key = 's3'

  return (
    <div className="ex-page">
      <button className="btn small" onClick={onBack}>← Course ki back</button>
      <h2>🛠 Hands-on Practice</h2>
      <p className="muted">
        Anni stages exercises ikkada unnayi. Stage 1 nee <b>own PDI</b> lo cheyyali. Stage 2 & 3 lo code exercises
        lesson lo run cheyyali; PDI practice ivi ikkade cheyyachu. Total progress: <b>{doneAll}/{totalAll}</b>
      </p>

      <Fold top title="STAGE 1 · Introduction (real PDI)" meta={`${s1Done}/${EXERCISES.length} done`} open={!!open[s1Key]} onToggle={() => flip(s1Key)}>
        {LESSONS.filter((l) => EXERCISES.some((e) => e.lessonId === l.id)).map((l) => {
          const list = byLevel(EXERCISES.filter((e) => e.lessonId === l.id))
          const n = list.filter((e) => done[e.id]).length
          const lk = 's1:' + l.id
          return (
            <Fold key={lk} title={l.title} meta={`${n}/${list.length} done`} open={!!open[lk]} onToggle={() => flip(lk)} nested>
              {list.map((e) => <Card key={e.id} e={e} done={!!done[e.id]} onToggle={onToggle} />)}
            </Fold>
          )
        })}
      </Fold>

      <Fold top title="STAGE 2 · JavaScript (ServiceNow style)" meta={`${s2Done}/${s2Ex.length} done`} open={!!open[s2Key]} onToggle={() => flip(s2Key)}>
        {JS_LESSONS.map((l) => jsLessonBlock(l, 's2'))}
      </Fold>

      <Fold top title="STAGE 3 · Client scripting & UI" meta={`${s3Done}/${s3Ex.length} done`} open={!!open[s3Key]} onToggle={() => flip(s3Key)}>
        {CS_LESSONS.filter((l) => l.exercises.length).map((l) => jsLessonBlock(l, 's3'))}
      </Fold>
    </div>
  )
}
