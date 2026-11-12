import { useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { EXERCISES } from '../data/exercises.js'

const RANK = { easy: 0, medium: 1, hard: 2 }
const LEVEL = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }

function Card({ e, done, onToggle }) {
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

export default function Exercises({ lessonId, progress, onToggle, onBack }) {
  const done = progress.exercises || {}
  const lessons = lessonId ? LESSONS.filter((l) => l.id === lessonId) : LESSONS
  const total = EXERCISES.filter((e) => !lessonId || e.lessonId === lessonId)
  const doneCount = total.filter((e) => done[e.id]).length

  return (
    <div className="ex-page">
      <button className="btn small" onClick={onBack}>← Course ki back</button>
      <h2>🛠 Hands-on Practice{lessonId ? ': ' + lessons[0]?.title : ''}</h2>
      <p className="muted">
        Prathi task nee <b>own PDI</b> lo cheyyali. Mundu try chey — struck ayithe Hint, tarvata Steps, last lo Answer
        chupinchu. Progress: <b>{doneCount}/{total.length}</b>
      </p>
      {lessons.map((l) => {
        const list = EXERCISES.filter((e) => e.lessonId === l.id).sort((a, b) => RANK[a.level] - RANK[b.level]) // stable: easy → hard
        if (!list.length) return null
        return (
          <section key={l.id}>
            {!lessonId && <h3 className="ex-lesson">{l.title}</h3>}
            {list.map((e) => <Card key={e.id} e={e} done={!!done[e.id]} onToggle={onToggle} />)}
          </section>
        )
      })}
    </div>
  )
}
