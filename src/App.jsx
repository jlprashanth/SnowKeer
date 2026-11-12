import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { LESSONS } from './data/lessons.js'
import { buildSeed } from './engine/schema.js'
import * as ops from './engine/ops.js'
import { loadProgress, saveProgress } from './progress.js'
import Header from './components/Header.jsx'
import Navigator from './components/Navigator.jsx'
import Tooltip from './components/Tooltip.jsx'
import Tour from './components/Tour.jsx'
import Hub from './components/Hub.jsx'
import Quiz from './components/Quiz.jsx'
import Exercises from './components/Exercises.jsx'
// Stage 2 pulls in the CodeMirror editor (big) — only load it when a JS lesson is opened
const JsLesson = lazy(() => import('./components/JsLesson.jsx'))
import { JS_LESSONS } from './data/lessons-js.js'
import RecordList from './components/RecordList.jsx'
import RecordForm from './components/RecordForm.jsx'
import { DictList, DictForm, FormLayout } from './components/AdminPages.jsx'
import { DevPortal, Websites, Architecture } from './components/InfoPages.jsx'
import { Home, Soon } from './components/Pages.jsx'

const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)))

export default function App() {
  const [view, setView] = useState('hub') // hub | sim | quiz | exercises
  const [lessonId, setLessonId] = useState(null)
  const [exFilter, setExFilter] = useState(null) // lesson id, or null = all exercises
  const [jsId, setJsId] = useState(null) // Stage 2 (JavaScript) lesson being viewed
  const jsLesson = JS_LESSONS.find((l) => l.id === jsId) || null
  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(loadProgress)
  const [helpOn, setHelpOn] = useState(true)

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
    setStepIdx(0)
    setView('sim')
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
  const finishQuiz = (score, thenExercises) => {
    const next = { ...progress, [lessonId]: { done: true, score } }
    setProgress(next)
    saveProgress(next)
    if (thenExercises) openExercises(lessonId)
    else toHub()
  }
  const openExercises = (id = null) => {
    setLessonId(null)
    setExFilter(id)
    setView('exercises')
  }
  const updateProgress = (fn) =>
    setProgress((p) => {
      const n = fn(p)
      saveProgress(n)
      return n
    })
  const openJs = (id) => {
    setJsId(id)
    setView('js')
  }
  const finishJsQuiz = (id, score) =>
    updateProgress((p) => ({ ...p, [id]: { ...p[id], done: true, score: Math.max(score, p[id]?.score ?? 0) } }))
  const markJsDone = (exId) => updateProgress((p) => ({ ...p, jsDone: { ...(p.jsDone || {}), [exId]: true } }))
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

  return (
    <div className="app">
      <div className="coach-bar">
        <button className="brand" onClick={toHub}>❄ SnowKeer</button>
        {view === 'sim' && lesson && (
          <span className="coach-lesson">
            Lesson: <b>{lesson.title}</b> · Step {stepIdx + 1}/{lesson.steps.length}
          </span>
        )}
        {view === 'sim' && !lesson && <span className="coach-lesson">🧪 Free Play</span>}
        <div className="sn-spacer" />
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

      {view === 'hub' && <Hub progress={progress} onStart={startLesson} onFreePlay={freePlay} onExercises={openExercises} onOpenJs={openJs} />}
      {view === 'js' && jsLesson && (
        <Suspense fallback={<div className="js-page muted">Editor load avtundi…</div>}>
          <JsLesson key={jsLesson.id} lesson={jsLesson} progress={progress} onBack={toHub} onQuizFinish={finishJsQuiz} onExerciseDone={markJsDone} />
        </Suspense>
      )}
      {view === 'exercises' && <Exercises lessonId={exFilter} progress={progress} onToggle={toggleExercise} onBack={toHub} />}
      {view === 'quiz' && lesson && <Quiz lesson={lesson} onFinish={finishQuiz} />}

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
}
