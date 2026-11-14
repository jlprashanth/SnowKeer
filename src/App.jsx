import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { LESSONS } from './data/lessons.js'
import { buildSeed } from './engine/schema.js'
import * as ops from './engine/ops.js'
import { loadProgress, saveProgress, loadThemeMode, saveThemeMode, clearSavedCode, importProgress } from './progress.js'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import Header from './components/Header.jsx'
import Navigator from './components/Navigator.jsx'
import Tooltip from './components/Tooltip.jsx'
import Tour from './components/Tour.jsx'
import Hub from './components/Hub.jsx'
import Quiz from './components/Quiz.jsx'
import Exercises from './components/Exercises.jsx'
// Stage 2 pulls in the CodeMirror editor (big) — only load it when a JS lesson is opened
const JsLesson = lazy(() => import('./components/JsLesson.jsx'))
import { findCodeLesson } from './data/stages.js'
import RecordList from './components/RecordList.jsx'
import RecordForm from './components/RecordForm.jsx'
import { DictList, DictForm, FormLayout } from './components/AdminPages.jsx'
import { DevPortal, Websites, Architecture } from './components/InfoPages.jsx'
import { Home, Soon } from './components/Pages.jsx'

const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)))

export default function App() {
  const [view, setView] = useState('hub') // hub | sim | quiz | exercises | js
  const [lessonId, setLessonId] = useState(null)
  const [quizOnly, setQuizOnly] = useState(false) // Stage 1 "❓ Quiz matrame": quiz without the guided tour
  const [exFilter, setExFilter] = useState(null) // lesson id, or null = all exercises
  const [jsId, setJsId] = useState(null) // code-stage lesson (Stage 2, 3, ...) being viewed
  const [jsExId, setJsExId] = useState(null) // exercise to open on its Code tab (deep link), or null
  const [jsFrom, setJsFrom] = useState('hub') // where its back button goes: 'hub' | 'exercises'
  const jsLesson = findCodeLesson(jsId)
  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(loadProgress)
  const [helpOn, setHelpOn] = useState(true)
  const [themeMode, setThemeMode] = useState(loadThemeMode) // 'light' | 'dark' — stages only, never the ServiceNow mock
  const [confirmReset, setConfirmReset] = useState(false)
  const resetProgress = () => {
    setProgress({})
    saveProgress({})
    clearSavedCode() // her saved exercise code goes too
    setConfirmReset(false)
  }
  // Hub "⬆ Progress load cheyyi" (already confirmed): replaces progress + saved code; returns { ok, error }
  const loadBackup = (json) => {
    const r = importProgress(json)
    if (r.ok) setProgress(r.progress)
    return r
  }
  const toggleTheme = () =>
    setThemeMode((m) => {
      const n = m === 'dark' ? 'light' : 'dark'
      saveThemeMode(n)
      return n
    })

  const [db, setDb] = useState(() => buildSeed())
  const dbRef = useRef(db)
  const [route, setRoute] = useState({ name: 'home' })
  const [navOpen, setNavOpen] = useState(false)
  const [navFilter, setNavFilter] = useState('')
  const lastList = useRef({})

  const lesson = LESSONS.find((l) => l.id === lessonId) || null

  // mutate(fn): fn gets a mutable clone, may return a value; we store the clone as the new db
  const mutate = (fn) => {
    const next = clone(dbRef.current)
    const res = fn(next)
    dbRef.current = next
    setDb(next)
    return res
  }
  const replaceDb = (next) => {
    dbRef.current = next
    setDb(next)
  }

  const go = (r) => {
    if (r.name === 'list') lastList.current[r.table] = r
    setRoute(r)
    setNavOpen(false)
    setNavFilter('')
  }
  const listRoute = (table, override) => override || lastList.current[table] || { name: 'list', table, terms: [] }

  const ctx = { d: db, mutate, go, listRoute, ops }

  const resetSim = (l) => {
    const seed = buildSeed({ withTraining: l ? l.withTraining !== false : true })
    if (l?.setup) l.setup(seed, ops)
    replaceDb(seed)
    lastList.current = {}
    setRoute(l?.start || { name: 'home' })
    setNavOpen(false)
    setNavFilter('')
  }

  const startLesson = (id) => {
    const l = LESSONS.find((x) => x.id === id)
    resetSim(l)
    setLessonId(id)
    setQuizOnly(false)
    setStepIdx(0)
    setView('sim')
  }
  // Stage 1 lesson done at least once → retake just its quiz (no tour)
  const openQuiz = (id) => {
    setLessonId(id)
    setQuizOnly(true)
    setView('quiz')
  }
  const freePlay = () => {
    resetSim(null)
    setLessonId(null)
    setView('sim')
  }
  const toHub = () => {
    setLessonId(null)
    setView('hub')
  }

  const advance = () => {
    setStepIdx((i) => {
      if (lesson && i + 1 >= lesson.steps.length) {
        setTimeout(() => setView('quiz'), 0)
        return i
      }
      return i + 1
    })
  }
  const updateProgress = (fn) =>
    setProgress((p) => {
      const n = fn(p)
      saveProgress(n)
      return n
    })
  // Stage 1 quiz: keeps the BEST score (a lower retry never overwrites it)
  const finishQuiz = (score, thenExercises) => {
    const id = lessonId
    updateProgress((p) => ({ ...p, [id]: { ...p[id], done: true, score: Math.max(score, p[id]?.score ?? 0) } }))
    if (thenExercises) openExercises(id)
    else toHub()
  }
  const openExercises = (id = null) => {
    setLessonId(null)
    setExFilter(id)
    setJsExId(null) // fresh visit: no exercise row to re-open (only the lesson's back button keeps it)
    setView('exercises')
  }
  // Open a code-stage lesson; exId = open that exercise on the Code tab (deep link); from = where "back" returns
  const openJs = (id, exId = null, from = 'hub') => {
    setJsId(id)
    setJsExId(exId)
    setJsFrom(from)
    setView('js')
  }
  const backFromJs = () => {
    if (jsFrom === 'exercises') setView('exercises') // same Hands-on Practice page, that exercise's row open again
    else toHub()
  }
  const finishJsQuiz = (id, score) =>
    updateProgress((p) => ({ ...p, [id]: { ...p[id], done: true, score: Math.max(score, p[id]?.score ?? 0) } }))
  // ScriptRunner calls onPass({ viewedSolution }) on the first passing run: true = solved alone, 'solution' = solved after
  // opening the solution. Both count as done; an earlier true is never downgraded to 'solution'.
  const markJsDone = (exId, info) =>
    updateProgress((p) => {
      const cur = p.jsDone || {}
      const val = info?.viewedSolution ? 'solution' : true
      if (cur[exId] === true || cur[exId] === val) return p
      return { ...p, jsDone: { ...cur, [exId]: val } }
    })
  const toggleJsDone = (exId) =>
    updateProgress((p) => {
      const cur = { ...(p.jsDone || {}) }
      if (cur[exId]) delete cur[exId]
      else cur[exId] = true
      return { ...p, jsDone: cur }
    })
  const toggleExercise = (exId) => {
    const cur = progress.exercises || {}
    const ex = { ...cur, [exId]: !cur[exId] }
    if (!ex[exId]) delete ex[exId]
    const next = { ...progress, exercises: ex }
    setProgress(next)
    saveProgress(next)
  }

  const pickModule = (mod) => go(ops.moduleRoute(dbRef.current, mod))
  const shortcut = (table, kind) =>
    go(kind === 'list' ? { name: 'list', table, terms: [] } : { name: 'form', table, isNew: true, k: Date.now() })
  const toggleFav = (id) =>
    mutate((n) => {
      n.favorites = n.favorites.includes(id) ? n.favorites.filter((x) => x !== id) : [...n.favorites, id]
    })

  const pageTitle = () => {
    switch (route.name) {
      case 'home': return 'ServiceNow'
      case 'list': return db.tables[route.table]?.listTitle || (db.tables[route.table]?.label || '') + 's'
      case 'form': {
        const tb = db.tables[route.table]
        if (route.id) return `${tb.label} - ${ops.displayOf(db, route.table, ops.getRow(db, route.table, route.id))}`
        const n = ops.nextNumber(db, route.table)
        return `${tb.label} - ${n ? 'Create ' + n : 'New Record'}`
      }
      case 'dict.list': return 'Dictionary Entries'
      case 'dict.form': return 'Dictionary Entry'
      case 'layout': return 'Form Layout'
      case 'page': return { websites: 'Products & Websites', architecture: 'Architecture' }[route.id] || 'ServiceNow'
      default: return route.title || 'ServiceNow'
    }
  }

  // free play only: clicking outside closes the All menu (like the real one)
  useEffect(() => {
    if (!navOpen || lesson) return
    const close = (e) => {
      if (e.target.closest('.nav-panel') || e.target.closest('[data-tour="btn-all"]')) return
      setNavOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [navOpen, lesson])

  // for testing from the browser console
  useEffect(() => {
    window.__snow = { LESSONS, getDb: () => dbRef.current, startLesson }
  })

  const keyOf = (r) => JSON.stringify([r.name, r.table, r.id, r.k, r.field, JSON.stringify(r.terms || '')])

  const page = () => {
    switch (route.name) {
      case 'home': return <Home incidents={ops.rowsOf(db, 'incident')} />
      case 'list': return <RecordList key={keyOf(route)} ctx={ctx} route={route} />
      case 'form': return <RecordForm key={keyOf(route)} ctx={ctx} route={route} />
      case 'dict.list': return <DictList key={keyOf(route)} ctx={ctx} route={route} />
      case 'dict.form': return <DictForm key={keyOf(route)} ctx={ctx} route={route} />
      case 'layout': return <FormLayout key={keyOf(route) + JSON.stringify(route.view)} ctx={ctx} route={route} />
      case 'page':
        if (route.id === 'websites') return <Websites />
        if (route.id === 'architecture') return <Architecture />
        return <Soon name="Page" />
      default: return <Soon name={route.title} />
    }
  }

  const bare = route.name === 'page' && route.id === 'devportal'

  const themed = view !== 'sim'
  const app = (
    <div className={'app' + (themed ? ' themed' : '')}>
      <div className="coach-bar">
        <button className="brand" onClick={toHub}>❄ SnowKeer</button>
        {view === 'sim' && lesson && (
          <span className="coach-lesson">
            Lesson: <b>{lesson.title}</b> · Step {stepIdx + 1}/{lesson.steps.length}
          </span>
        )}
        {view === 'sim' && !lesson && <span className="coach-lesson">🧪 Free Play</span>}
        <div className="sn-spacer" />
        {themed && (
          <button className="btn small" onClick={() => setConfirmReset(true)} title="Progress motham clear chestundi">
            ↺ Reset progress
          </button>
        )}
        {themed && (
          <button className="btn small" onClick={toggleTheme} title="Light / dark mode">
            {themeMode === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
        )}
        {view === 'sim' && (
          <>
            <label className="toggle" title="Hover chesthe explanation vastundi">
              <input type="checkbox" checked={helpOn} onChange={(e) => setHelpOn(e.target.checked)} />
              Hover help
            </label>
            {lesson && <button className="btn small" onClick={() => startLesson(lesson.id)}>↺ Restart</button>}
            <button className="btn small" onClick={toHub}>✕ Exit</button>
          </>
        )}
      </div>

      {confirmReset && themed && (
        <div className="modal-back" onClick={() => setConfirmReset(false)}>
          <div className="modal" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>⚠ Reset all progress?</h3>
            <p>
              Lessons, quizzes, exercises, nuvvu rasina saved code anni clear avtayi. <b>Idi undo cheyyadam kudaradu.</b>
              {' '}Kavalante mundu hub lo "⬇ Progress save cheyyi" tho backup teesuko.
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmReset(false)}>No</button>
              <button className="btn danger" onClick={resetProgress}>Yes, reset</button>
            </div>
          </div>
        </div>
      )}

      {view === 'hub' && (
        <Hub
          progress={progress}
          onStart={startLesson}
          onQuiz={openQuiz}
          onFreePlay={freePlay}
          onExercises={openExercises}
          onOpenJs={(id, exId) => openJs(id, exId, 'hub')}
          onLoadBackup={loadBackup}
        />
      )}
      {view === 'js' && jsLesson && (
        <Suspense fallback={<div className="js-page muted">Editor load avtundi…</div>}>
          <JsLesson
            key={jsLesson.id + ':' + (jsExId || '')}
            lesson={jsLesson}
            progress={progress}
            openExerciseId={jsExId}
            onBack={backFromJs}
            backLabel={jsFrom === 'exercises' ? '← Hands-on Practice ki back' : '← Course ki back'}
            onQuizFinish={finishJsQuiz}
            onExerciseDone={markJsDone}
            onExerciseToggle={toggleJsDone}
          />
        </Suspense>
      )}
      {view === 'exercises' && (
        <Exercises
          lessonId={exFilter}
          focusId={jsFrom === 'exercises' ? jsExId : null}
          progress={progress}
          onToggle={toggleExercise}
          onJsToggle={toggleJsDone}
          onOpenJs={(id, exId) => openJs(id, exId, 'exercises')}
          onBack={toHub}
        />
      )}
      {view === 'quiz' && lesson && (
        <Quiz
          key={lesson.id}
          lesson={lesson}
          best={progress[lesson.id]?.score}
          title={quizOnly ? 'Quiz complete ✅' : undefined}
          onExit={quizOnly ? toHub : undefined}
          onFinish={finishQuiz}
        />
      )}

      {view === 'sim' && (
        <div className="sim">
          {!bare && (
            <Header curSet={db.currentSet} navOpen={navOpen} title={pageTitle()} onToggleNav={() => setNavOpen((o) => !o)} onHome={() => go({ name: 'home' })} />
          )}
          <div className="sim-body">
            {navOpen && !bare && <Navigator d={db} filter={navFilter} setFilter={setNavFilter} onPick={pickModule} onShortcut={shortcut} toggleFav={toggleFav} />}
            <main className="sim-main">
              {bare ? <DevPortal onDone={() => go({ name: 'home' })} /> : page()}
            </main>
          </div>
          {lesson && <Tour lesson={lesson} stepIdx={stepIdx} onAdvance={advance} />}
          <Tooltip enabled={helpOn} />
        </div>
      )}
    </div>
  )
  // The Astryx theme wraps every stage page but NOT the ServiceNow mock ('sim'): unmounting it there
  // also removes its attributes from <html>, so the mock renders exactly as before.
  return themed ? <Theme theme={neutralTheme} mode={themeMode}>{app}</Theme> : app
}
