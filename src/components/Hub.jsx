import { Fragment, useRef, useState } from 'react'
import { GlossaryPanel } from './TermBox.jsx'
import { STAGES, lessonExercises, exerciseDone, lessonDone, stageDoneCount, nextLesson } from '../data/stages.js'
import { exportProgress, readBackup } from '../progress.js'

// Reusable collapsible stage header — one per STAGES entry
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

// Every exercise of every stage as [stage, id] (ids are unique across stages)
const ALL_EXERCISES = STAGES.flatMap((s) => s.lessons.flatMap((l) => lessonExercises(s, l).map((e) => [s, e.id])))
const countDone = (progress) => ({
  lessons: STAGES.reduce((a, s) => a + stageDoneCount(s, progress), 0),
  exercises: ALL_EXERCISES.filter(([s, id]) => exerciseDone(s, progress, id)).length,
})
const fmtDate = (iso) => {
  const d = new Date(iso)
  return iso && !isNaN(d) ? d.toLocaleString() : ''
}

export default function Hub({ progress, onStart, onQuiz, onFreePlay, onExercises, onOpenJs, onLoadBackup }) {
  const [open, setOpen] = useState({})
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const [pending, setPending] = useState(null) // backup file waiting for "Yes" — or why it can't be loaded
  const [notice, setNotice] = useState('')
  const fileRef = useRef(null)
  const jsDone = progress.jsDone || {}
  const exDone = progress.exercises || {}

  const stageCounts = STAGES.map((s) => stageDoneCount(s, progress))
  const total = countDone(progress)
  const lessonsTotal = STAGES.reduce((a, s) => a + s.lessons.length, 0)
  const next = nextLesson(progress) // first unfinished lesson across all stages (null = all finished)
  const resume = next || { stage: STAGES[0], lesson: STAGES[0].lessons[0] }
  const started = total.lessons > 0 || Object.keys(progress).length > 0

  // Open a lesson where she left off: guided → the tour; code → once its quiz is done, the Code tab at the first unfinished exercise
  const openLesson = (stage, l) => {
    if (stage.kind === 'guided') return onStart(l.id)
    const quizTaken = typeof progress[l.id]?.score === 'number'
    onOpenJs(l.id, quizTaken ? l.exercises.find((e) => !jsDone[e.id])?.id : undefined)
  }

  // ⬇ backup: progress + her saved code → snowkeer-progress.json
  const saveFile = () => {
    const url = URL.createObjectURL(new Blob([exportProgress(progress)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'snowkeer-progress.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('✅ snowkeer-progress.json download ayyindi (Downloads folder chudu) — jagratta ga dachuko.')
  }
  // ⬆ restore: read + check the file first, replace only after she says Yes
  const pickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // picking the same file again must fire onChange again
    if (!file) return
    setNotice('')
    if (file.size > 5e6) {
      setPending({ ok: false, error: 'Ee file chala pedda ga undi — idi SnowKeer progress file kaadu.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result)
      setPending({ ...readBackup(text), text, name: file.name })
    }
    reader.onerror = () => setPending({ ok: false, error: 'File chadavadam kudharaledu — malli try cheyyi.' })
    reader.readAsText(file)
  }
  const confirmLoad = () => {
    const r = onLoadBackup(pending.text)
    if (!r.ok) {
      setPending({ ok: false, error: r.error })
      return
    }
    setPending(null)
    setNotice('✅ Progress load ayyindi.')
  }
  const pendingCount = pending?.ok ? countDone(pending.progress) : null

  // Stage 1 style: guided tour + quiz, real-PDI exercises (cards look exactly as before)
  const guidedBody = (s) => (
    <div className="lesson-grid stage-body">
      {s.lessons.map((l, n) => {
        const p = progress[l.id]
        const exs = lessonExercises(s, l)
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
              {p?.done && (
                <button className="btn small" onClick={() => onQuiz(l.id)} title="Tour lekunda quiz matrame — best score save avtundi">
                  ❓ Quiz matrame
                </button>
              )}
              {exs.length > 0 && (
                <button className="btn small" onClick={() => onExercises(l.id)}>
                  🛠 Exercises ({exs.filter((e) => exDone[e.id]).length}/{exs.length})
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Code stages: Learn / Quiz / Code lessons (✓ = quiz taken AND every exercise done)
  const codeBody = (s) => (
    <div className="stage-body">
      {s.intro && <div className="muted small" style={{ marginBottom: 8 }}>{s.intro}</div>}
      {s.glossary && <GlossaryPanel />}
      <div className="lesson-grid">
        {s.lessons.map((l, n) => {
          const p = progress[l.id]
          const codeDone = l.exercises.filter((e) => jsDone[e.id]).length
          const finished = lessonDone(s, progress, l)
          return (
            <div key={l.id} className="lesson-card">
              <div className={'lesson-num' + (finished ? ' done' : '')}>{finished ? '✓' : l.no ?? n + 1}</div>
              <div className="lesson-main">
                <h3>{l.title}</h3>
                <p>{l.blurb}</p>
                <div className="muted small">
                  🎬 Video: <b>{l.video}</b>
                  {p?.score != null && <> · Quiz: {p.score}/{l.quiz.length}</>} · {l.mode === 'pdi' ? '🛠 PDI' : '💻 Code'}: {codeDone}/{l.exercises.length}
                </div>
              </div>
              <div className="lesson-btns">
                <button className="btn primary" onClick={() => openLesson(s, l)}>{p?.done || codeDone ? 'Continue' : 'Start'}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="hub">
      <div className="hub-hero">
        <h1>ServiceNow nerchukundam 🚀</h1>
        <p>
          Videos chusaka, ikkada practice cheyyi. Nenu step-by-step guide chestanu — mistakes
          cheyyadam gurinchi bhayapadakku, idi just practice instance.
        </p>
        <div className="hub-actions">
          <button className="btn primary big" onClick={() => openLesson(resume.stage, resume.lesson)}>
            {next ? `▶ ${started ? 'Continue' : 'Start'}: ` : '🔁 Replay: '}
            {resume.lesson.title}
            <span className="hero-stage"> · Stage {resume.stage.num}</span>
          </button>
          <button className="btn big" onClick={onFreePlay}>
            🧪 Free Play (guide lekunda)
          </button>
          <button className="btn big" onClick={() => onExercises()}>
            🛠 Hands-on Practice ({total.exercises}/{ALL_EXERCISES.length})
          </button>
        </div>
        <div className="muted small">
          Release: Brazil UI (Next Experience) · Progress: {total.lessons}/{lessonsTotal} lessons (
          {STAGES.map((s, i) => `Stage ${s.num}: ${stageCounts[i]}/${s.lessons.length}`).join(' · ')})
          {!next && ' · 🎉 Anni stages complete!'}
        </div>
        <div className="hub-backup">
          <button className="btn small" onClick={saveFile} title="Progress + nuvvu rasina code anni oka file lo (snowkeer-progress.json) download avtayi">
            ⬇ Progress save cheyyi
          </button>
          <button className="btn small" onClick={() => fileRef.current?.click()} title="Mundu save chesina snowkeer-progress.json file select cheyyi">
            ⬆ Progress load cheyyi
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={pickFile} />
          <span className="hub-backup-note small">Progress ee browser lo matrame untundi — vere laptop / browser ki ee file tho teesukellu.</span>
        </div>
        {notice && <div className="hub-notice" role="status">{notice}</div>}
      </div>

      {STAGES.map((s, i) => (
        <Fragment key={s.key}>
          <StageHeader
            num={s.num}
            icon={s.icon}
            title={s.title}
            subtitle={s.subtitle}
            done={stageCounts[i]}
            total={s.lessons.length}
            open={!!open[s.key]}
            onToggle={() => toggle(s.key)}
          />
          {open[s.key] && (s.kind === 'guided' ? guidedBody(s) : codeBody(s))}
        </Fragment>
      ))}

      {pending && (
        <div className="modal-back" onClick={() => setPending(null)}>
          <div className="modal" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {pending.ok ? (
              <>
                <h3>⬆ Ee progress load cheyyala?</h3>
                <p>
                  File: <b>{pending.name}</b>
                  {fmtDate(pending.savedAt) && <> (save chesindi: {fmtDate(pending.savedAt)})</>}
                  <br />
                  Andulo: {pendingCount.lessons}/{lessonsTotal} lessons, {pendingCount.exercises} exercises done,{' '}
                  {Object.keys(pending.code).length} exercises ki saved code.
                  <br />
                  <b>Ippudu ee browser lo unna progress + saved code motham ee file tho replace avtayi.</b> Idi undo cheyyadam kudaradu.
                </p>
                <div className="modal-actions">
                  <button className="btn" onClick={() => setPending(null)}>No</button>
                  <button className="btn danger" onClick={confirmLoad}>Yes, load cheyyi</button>
                </div>
              </>
            ) : (
              <>
                <h3>⚠ Ee file load avvadu</h3>
                <p>{pending.error}</p>
                <div className="modal-actions">
                  <button className="btn" onClick={() => setPending(null)}>OK</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
