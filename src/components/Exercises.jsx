import { useEffect, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { exercisesFor } from '../data/exercises.js'
import { STAGES, lessonExercises, exerciseDone } from '../data/stages.js'

// Exercises always show in the lesson file's ARRAY order (the order she should do them); the badge just shows the level.
export const LEVEL = { easy: '🟢 Easy', medium: '🟡 Medium', 'medium+': '🟠 Medium+', hard: '🔴 Hard' }

// Code exercise tick: true = passed on her own, 'solution' = passed after opening the solution (still counts as done)
export function SolvedTag({ v }) {
  if (v !== 'solution') return null
  return (
    <span className="ex-help" title="Solution chusaka pass ayyindi — konni rojula tarvata sontanga malli try cheyyi">
      👀 (solution chusi)
    </span>
  )
}

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
function Fold({ id, title, meta, open, onToggle, top = false, nested = false, children }) {
  return (
    <div id={id} className={'fold' + (top ? ' fold-top' : '') + (nested ? ' fold-nested' : '')}>
      <button className="fold-head" aria-expanded={open} onClick={onToggle}>
        <span className="fold-title">{title}</span>
        {meta && <span className="fold-meta">{meta}</span>}
        <span className="fold-chev">▾</span>
      </button>
      {open && <div className="fold-body">{children}</div>}
    </div>
  )
}

// Fold keys: stage = stage.key, lesson = stage.key + ':' + lesson id, exercise = 'ex:' + exercise id
const foldsOpenFor = (exId) => {
  for (const s of STAGES) {
    for (const l of s.lessons) {
      if (lessonExercises(s, l).some((e) => e.id === exId)) return { [s.key]: true, [s.key + ':' + l.id]: true, ['ex:' + exId]: true }
    }
  }
  return {}
}

// "2 & 3", "2, 3 & 4"
const stageNums = (kind) => {
  const a = STAGES.filter((s) => s.kind === kind).map((s) => s.num)
  return a.length > 1 ? a.slice(0, -1).join(', ') + ' & ' + a[a.length - 1] : String(a[0] ?? '')
}

// focusId = the exercise she opened in a lesson from here (back button) → that row opens again and scrolls into view
export default function Exercises({ lessonId, focusId, progress, onToggle, onJsToggle, onOpenJs, onBack }) {
  const done = progress.exercises || {} // Stage 1 (real PDI)
  const jsDone = progress.jsDone || {} // code stages (code runner + PDI practice)
  const [open, setOpen] = useState(() => (focusId ? foldsOpenFor(focusId) : {}))
  const flip = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))

  useEffect(() => {
    if (!focusId || lessonId) return
    document.getElementById('fx-' + focusId)?.scrollIntoView({ block: 'center' })
  }, [focusId, lessonId])

  // Opened from a single Stage 1 lesson's "Exercises" button
  if (lessonId) {
    const lesson = LESSONS.find((l) => l.id === lessonId)
    const list = exercisesFor(lessonId)
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

  // All stages: one fold per stage (lessons without exercises are left out)
  const rows = STAGES.map((s) => {
    const lessons = s.lessons.map((l) => ({ l, exs: lessonExercises(s, l) })).filter((x) => x.exs.length)
    const total = lessons.reduce((a, x) => a + x.exs.length, 0)
    const doneN = lessons.reduce((a, x) => a + x.exs.filter((e) => exerciseDone(s, progress, e.id)).length, 0)
    return { s, lessons, total, doneN }
  })
  const totalAll = rows.reduce((a, r) => a + r.total, 0)
  const doneAll = rows.reduce((a, r) => a + r.doneN, 0)

  // Stage 1 lesson: real-PDI cards (ticks in progress.exercises)
  const guidedBlock = (s, l, exs) => {
    const lk = s.key + ':' + l.id
    const n = exs.filter((e) => done[e.id]).length
    return (
      <Fold key={lk} title={l.title} meta={`${n}/${exs.length} done`} open={!!open[lk]} onToggle={() => flip(lk)} nested>
        {exs.map((e) => <Card key={e.id} e={e} done={!!done[e.id]} onToggle={onToggle} />)}
      </Fold>
    )
  }

  // Code-stage lesson: code exercises open the lesson runner, PDI ones expand in place
  const codeBlock = (s, l, exs) => {
    const lk = s.key + ':' + l.id
    const n = exs.filter((e) => jsDone[e.id]).length
    const isPdi = l.mode === 'pdi'
    return (
      <Fold key={lk} title={l.title} meta={`${n}/${exs.length} done`} open={!!open[lk]} onToggle={() => flip(lk)} nested>
        {exs.map((e) => {
          const ek = 'ex:' + e.id
          const v = jsDone[e.id]
          const title = (
            <>
              {v ? '✔ ' : ''}{e.title} <SolvedTag v={v} />
            </>
          )
          return (
            <Fold key={ek} id={'fx-' + e.id} title={title} meta={LEVEL[e.level]} open={!!open[ek]} onToggle={() => flip(ek)} nested>
              {isPdi ? (
                <Card e={e} done={!!v} onToggle={onJsToggle} />
              ) : (
                <div>
                  <p className="ex-scenario">{e.task}</p>
                  <button className="btn small" onClick={() => onOpenJs(l.id, e.id)}>💻 Lesson lo open cheyyi (code run cheyyi)</button>
                </div>
              )}
            </Fold>
          )
        })}
      </Fold>
    )
  }

  return (
    <div className="ex-page">
      <button className="btn small" onClick={onBack}>← Course ki back</button>
      <h2>🛠 Hands-on Practice</h2>
      <p className="muted">
        Anni stages exercises ikkada unnayi. Stage {stageNums('guided')} nee <b>own PDI</b> lo cheyyali. Stage {stageNums('code')} lo code
        exercises lesson lo run cheyyali; PDI practice ivi ikkade cheyyachu. Total progress: <b>{doneAll}/{totalAll}</b>
      </p>

      {rows.map(({ s, lessons, total, doneN }) => (
        <Fold
          key={s.key}
          top
          title={`STAGE ${s.num} · ${s.title}${s.kind === 'guided' ? ' (real PDI)' : ''}`}
          meta={`${doneN}/${total} done`}
          open={!!open[s.key]}
          onToggle={() => flip(s.key)}
        >
          {lessons.map(({ l, exs }) => (s.kind === 'guided' ? guidedBlock(s, l, exs) : codeBlock(s, l, exs)))}
        </Fold>
      ))}
    </div>
  )
}
