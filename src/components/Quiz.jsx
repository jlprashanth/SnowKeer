import { useMemo, useState } from 'react'
import { exercisesFor } from '../data/exercises.js'

// Shuffle each question's options once per quiz run (the data always lists the right answer in a fixed slot).
function shuffleQuiz(quiz) {
  return quiz.map((x) => {
    const order = x.options.map((_, n) => n)
    for (let k = order.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1))
      ;[order[k], order[j]] = [order[j], order[k]]
    }
    return { ...x, options: order.map((n) => x.options[n]), answer: order.indexOf(x.answer) }
  })
}

// best = her saved best score for this quiz (the app keeps the best, never a lower retry); onExit = show a back button
export default function Quiz({ lesson, onFinish, finishLabel = 'Course ki back', tip, best, title = 'Lesson complete ✅', onExit }) {
  const qs = useMemo(() => shuffleQuiz(lesson.quiz), [lesson])
  const hasExercises = exercisesFor(lesson.id).length > 0
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    const msg =
      score === qs.length
        ? 'Perfect! 🎉 Nuvvu super!'
        : score >= qs.length / 2
          ? 'Bagundi 👍 Oka sari video lo kothaga chusi malli try cheyochu.'
          : 'Parledu 🙂 Lesson malli replay chesi try cheyyi.'
    const hadBest = typeof best === 'number'
    return (
      <div className="quiz">
        <h2>{title}</h2>
        <div className="score">{score} / {qs.length}</div>
        {hadBest && best > score && (
          <p className="quiz-best">🏆 Nee best score <b>{best}/{qs.length}</b> alage save ayyi untundi 👍</p>
        )}
        {hadBest && score > best && <p className="quiz-best">🏆 Kotha best score! (mundu {best}/{qs.length})</p>}
        <p>{msg}</p>
        <p className="muted">
          {tip || 'Next step: nee real PDI lo ide try chey — All → filter "incident" → New → Submit.'}
        </p>
        <div className="hub-actions">
          {hasExercises && (
            <button className="btn primary big" onClick={() => onFinish(score, true)}>
              🛠 Practice exercises →
            </button>
          )}
          <button className={'btn big' + (hasExercises ? '' : ' primary')} onClick={() => onFinish(score)}>
            {finishLabel}
          </button>
        </div>
      </div>
    )
  }

  const q = qs[i]
  const answered = picked !== null
  const next = () => {
    if (i + 1 < qs.length) {
      setI(i + 1)
      setPicked(null)
    } else setDone(true)
  }

  return (
    <div className="quiz">
      {onExit && <button className="btn small quiz-exit" onClick={onExit}>← Course ki back</button>}
      <div className="muted small">Question {i + 1} / {qs.length}</div>
      <h2>{q.q}</h2>
      <div className="opts">
        {q.options.map((o, n) => {
          let cls = 'opt'
          if (answered && n === q.answer) cls += ' right'
          else if (answered && n === picked) cls += ' wrong'
          return (
            <button
              key={o}
              className={cls}
              disabled={answered}
              onClick={() => {
                setPicked(n)
                if (n === q.answer) setScore((s) => s + 1)
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={'why ' + (picked === q.answer ? 'ok' : 'no')}>
          {picked === q.answer ? '✅ Correct! ' : '❌ Kaadu. '}
          {q.why}
        </div>
      )}
      {answered && (
        <button className="btn primary" onClick={next}>
          {i + 1 < qs.length ? 'Next question →' : 'Finish'}
        </button>
      )}
    </div>
  )
}
