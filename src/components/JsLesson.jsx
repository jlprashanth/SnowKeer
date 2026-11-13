import { useState } from 'react'
import Quiz from './Quiz.jsx'
import ScriptRunner from './ScriptRunner.jsx'
import { Card as PdiCard } from './Exercises.jsx'
import { TermBox } from './TermBox.jsx'

const RANK = { easy: 0, medium: 1, 'medium+': 1.5, hard: 2 }
const LEVEL = { easy: '🟢 Easy', medium: '🟡 Medium', 'medium+': '🟠 Medium+', hard: '🔴 Hard' }

export default function JsLesson({ lesson, progress, onBack, onQuizFinish, onExerciseDone, onExerciseToggle }) {
  const pdi = lesson.mode === 'pdi'
  const [tab, setTab] = useState('learn')
  const [open, setOpen] = useState(null)
  const doneMap = progress.jsDone || {}
  const exs = [...lesson.exercises].sort((a, b) => RANK[a.level] - RANK[b.level])
  const doneCount = exs.filter((e) => doneMap[e.id]).length

  const tabBtn = (id, label) => (
    <button className={'tab' + (tab === id ? ' on' : '')} onClick={() => setTab(id)}>{label}</button>
  )

  return (
    <div className="js-page">
      <button className="btn small" onClick={onBack}>← Course ki back</button>
      <h2>{lesson.title}</h2>
      <div className="muted small">🎬 Video: <b>{lesson.video}</b></div>
      <div className="tabs">
        {tabBtn('learn', '📖 Learn')}
        {tabBtn('quiz', '❓ Quiz' + (progress[lesson.id]?.score != null ? ` (${progress[lesson.id].score}/${lesson.quiz.length})` : ''))}
        {tabBtn('code', `${pdi ? '🛠 PDI Practice' : '💻 Code'} (${doneCount}/${exs.length})`)}
      </div>

      {tab === 'learn' && (
        <div>
          {lesson.learn.map((c, i) => (
            <div key={i} className="learn-card">
              <h3>{c.h}</h3>
              {c.body.map((p, j) => <p key={j}>{p}</p>)}
              {c.terms && <TermBox keys={c.terms} />}
              {c.code && <pre className="code-sample">{c.code}</pre>}
            </div>
          ))}
          {!pdi && <div className="learn-card">
            <h3>🧪 Scratchpad — nuvve try chey</h3>
            <p>Edaina rasi Run click cheyyi. {lesson.scratch?.client ? 'Ikkada g_form, g_user anni untayi — Run chesaka kinda form lo marpulu kanipistayi, form lo field marchite onChange kuda run avtundi.' : 'Ikkada gs, GlideRecord, incident data anni untayi.'} (Em marchina save avvadu.)</p>
            <ScriptRunner
              starter={lesson.scratch?.starter || "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\ngs.info(gr.getValue('short_description'));"}
              scenario={lesson.scratch?.scenario}
              client={lesson.scratch?.client}
            />
          </div>}
          <button className="btn primary big" onClick={() => setTab('quiz')}>Quiz ki veldam →</button>
        </div>
      )}

      {tab === 'quiz' && (
        <Quiz
          key="quiz"
          lesson={lesson}
          finishLabel={pdi ? 'PDI practice ki →' : 'Code exercises ki →'}
          tip="Next: Code tab lo ServiceNow scripts rayi practice chey."
          onFinish={(score) => {
            onQuizFinish(lesson.id, score)
            setTab('code')
          }}
        />
      )}

      {tab === 'code' && pdi && (
        <div>
          <p className="muted">Ivi nee <b>real PDI</b> lo cheyyali — steps / answer / cleanup ikkada chudochu. Cleanup marchipoku!</p>
          {exs.map((e) => <PdiCard key={e.id} e={e} done={!!doneMap[e.id]} onToggle={onExerciseToggle} />)}
        </div>
      )}

      {tab === 'code' && !pdi && (
        <div>
          <p className="muted">
            Prathi exercise ki code rayyi → <b>Run</b> → tests pass avvali. Struck ayithe Hint, last lo Solution.
          </p>
          {exs.map((e) => (
            <div key={e.id} className={'ex-card' + (doneMap[e.id] ? ' done' : '')}>
              <div className="ex-head" onClick={() => setOpen(open === e.id ? null : e.id)} style={{ cursor: 'pointer' }}>
                <h3>{doneMap[e.id] ? '✔ ' : ''}{e.title}</h3>
                <span className="ex-level">{LEVEL[e.level]} {open === e.id ? '▲' : '▼'}</span>
              </div>
              {open === e.id && (
                <>
                  <p className="ex-scenario">{e.task}</p>
                  <ScriptRunner exercise={e} done={!!doneMap[e.id]} onPass={() => onExerciseDone(e.id)} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
