import { useEffect, useState } from 'react'
import Quiz from './Quiz.jsx'
import ScriptRunner from './ScriptRunner.jsx'
import { Card as PdiCard, LEVEL, SolvedTag } from './Exercises.jsx'
import { TermBox } from './TermBox.jsx'
import LessonGlossary from './LessonGlossary.jsx'
import { cardTermKeys } from '../data/glossary-scan.js'

// openExerciseId (deep link from Hands-on Practice / hub "Continue"): start on the Code tab with that exercise open and scrolled into view
export default function JsLesson({ lesson, progress, onBack, backLabel = '← Course ki back', openExerciseId, onQuizFinish, onExerciseDone, onExerciseToggle }) {
  const pdi = lesson.mode === 'pdi'
  const deepLink = lesson.exercises.some((e) => e.id === openExerciseId) ? openExerciseId : null
  const [tab, setTab] = useState(deepLink ? 'code' : 'learn')
  const [open, setOpen] = useState(deepLink)
  const doneMap = progress.jsDone || {}
  const exs = lesson.exercises // ARRAY order = the order she should do them (no sorting by level)
  const doneCount = exs.filter((e) => doneMap[e.id]).length

  useEffect(() => {
    if (deepLink) document.getElementById('ex-' + deepLink)?.scrollIntoView({ block: 'start' })
  }, [deepLink])

  const tabBtn = (id, label) => (
    <button className={'tab' + (tab === id ? ' on' : '')} onClick={() => setTab(id)}>{label}</button>
  )

  return (
    <div className="js-page">
      <button className="btn small" onClick={onBack}>{backLabel}</button>
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
              <TermBox keys={cardTermKeys(c, lesson.stage)} collapsible />
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
          best={progress[lesson.id]?.score}
          finishLabel={pdi ? 'PDI practice ki →' : 'Code exercises ki →'}
          tip={
            pdi
              ? 'Next: "🛠 PDI Practice" tab lo tasks nee real PDI lo chey — steps / answer / cleanup akkade unnayi.'
              : 'Next: Code tab lo ServiceNow scripts rayi practice chey.'
          }
          onFinish={(score) => {
            onQuizFinish(lesson.id, score)
            setTab('code')
          }}
        />
      )}

      {tab === 'code' && pdi && (
        <div>
          <p className="muted">Ivi nee <b>real PDI</b> lo cheyyali — steps / answer / cleanup ikkada chudochu. Cleanup marchipoku!</p>
          {exs.map((e) => (
            <div key={e.id} id={'ex-' + e.id}>
              <PdiCard e={e} done={!!doneMap[e.id]} onToggle={onExerciseToggle} />
            </div>
          ))}
        </div>
      )}

      {tab === 'code' && !pdi && (
        <div>
          <p className="muted">
            Prathi exercise ki code rayyi → <b>Run</b> → tests pass avvali. Struck ayithe Hint, last lo Solution.
          </p>
          {exs.map((e) => (
            <div key={e.id} id={'ex-' + e.id} className={'ex-card' + (doneMap[e.id] ? ' done' : '')}>
              <div className="ex-head" onClick={() => setOpen(open === e.id ? null : e.id)} style={{ cursor: 'pointer' }}>
                <h3>{doneMap[e.id] ? '✔ ' : ''}{e.title} <SolvedTag v={doneMap[e.id]} /></h3>
                <span className="ex-level">{LEVEL[e.level]} {open === e.id ? '▲' : '▼'}</span>
              </div>
              {open === e.id && (
                <>
                  <p className="ex-scenario">{e.task}</p>
                  <ScriptRunner exercise={e} done={!!doneMap[e.id]} onPass={(info) => onExerciseDone(e.id, info)} />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {tab !== 'quiz' && <LessonGlossary lesson={lesson} />}
    </div>
  )
}
