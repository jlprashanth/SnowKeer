import { LESSONS } from '../data/lessons.js'
import { EXERCISES, exercisesFor } from '../data/exercises.js'
import { JS_LESSONS } from '../data/lessons-js.js'

export default function Hub({ progress, onStart, onFreePlay, onExercises, onOpenJs }) {
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

      <h2>Stage 1 · Introduction</h2>
      <div className="lesson-grid">
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
      </div>

      <h2 style={{ marginTop: 28 }}>Stage 2 · JavaScript (ServiceNow style)</h2>
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
    </div>
  )
}
