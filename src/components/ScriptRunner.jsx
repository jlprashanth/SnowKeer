import { useEffect, useRef, useState } from 'react'
import CodeEditor from './CodeEditor.jsx'

const TIMEOUT_MS = 3000
const show = (v) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v) ?? String(v))

// Editor + Run + Script Log + test results. `exercise` = null → free scratchpad (no tests).
export default function ScriptRunner({ exercise, starter, done, onPass }) {
  const initial = exercise ? exercise.starter : starter || ''
  const [code, setCode] = useState(initial)
  const [out, setOut] = useState(null)
  const [running, setRunning] = useState(false)
  const [hint, setHint] = useState(false)
  const [solution, setSolution] = useState(false)
  const worker = useRef(null)
  const timer = useRef(null)
  const passed = useRef(false)

  const stop = () => {
    clearTimeout(timer.current)
    worker.current?.terminate()
    worker.current = null
  }
  useEffect(() => stop, [])

  const run = () => {
    stop()
    setRunning(true)
    setOut(null)
    const w = new Worker(new URL('../js/runner.worker.js', import.meta.url), { type: 'module' })
    worker.current = w
    timer.current = setTimeout(() => {
      stop()
      setRunning(false)
      setOut({ logs: [], results: [], error: `${TIMEOUT_MS / 1000} sec lo complete avvaledu — infinite loop (while(true)) undi emo chudu.` })
    }, TIMEOUT_MS)
    w.onmessage = (e) => {
      stop()
      setRunning(false)
      setOut(e.data)
      if (e.data.passed && !passed.current) {
        passed.current = true
        onPass?.()
      }
    }
    w.onerror = (e) => {
      stop()
      setRunning(false)
      setOut({ logs: [], results: [], error: e.message || 'Runner error' })
    }
    w.postMessage({ code, scenario: exercise?.scenario, tests: exercise?.tests || [] })
  }

  const reset = () => {
    setCode(initial)
    setOut(null)
  }

  return (
    <div className="runner">
      <CodeEditor value={code} onChange={setCode} onRun={run} />
      <div className="runner-bar">
        <button className="btn primary small" onClick={run} disabled={running}>{running ? 'Running…' : '▶ Run'}</button>
        <button className="btn small" onClick={reset}>↺ Reset</button>
        {exercise?.hint && !hint && <button className="btn small" onClick={() => setHint(true)}>💡 Hint</button>}
        {exercise && !solution && <button className="btn small" onClick={() => setSolution(true)}>✅ Solution chupinchu</button>}
        <span className="muted small">Ctrl + Enter = Run</span>
        {done && <span className="runner-done">✔ Done</span>}
      </div>

      {hint && <div className="ex-block ex-hint">💡 {exercise.hint}</div>}

      {out && (
        <div className="runner-out">
          <div className="log-title">Script Log</div>
          <div className="log-panel">
            {out.logs.length === 0 && !out.error && <span className="muted small">(log lo emi ledu — gs.info() vaadu)</span>}
            {out.logs.map((l, i) => (
              <div key={i} className={'log-line ' + l.level}>
                <span className="log-lvl">{l.level}</span> {l.msg}
              </div>
            ))}
            {out.error && <div className="log-line error"><span className="log-lvl">error</span> {out.error}</div>}
          </div>

          {exercise && out.results.length > 0 && (
            <div className="tests">
              {out.results.map((r, i) => (
                <div key={i} className={'test ' + (r.pass ? 'ok' : 'no')}>
                  {r.pass ? '✅' : '❌'} {r.label}
                  {!r.pass && r.note && <div className="test-diff">{r.note}</div>}
                  {!r.pass && !r.note && r.expect !== undefined && (
                    <div className="test-diff">
                      Expected: <code>{show(r.expect)}</code> · Got: <code>{show(r.got)}</code>
                    </div>
                  )}
                </div>
              ))}
              {out.passed && <div className="test-win">🎉 Anni tests pass ayyayi! Super.</div>}
            </div>
          )}
        </div>
      )}

      {solution && (
        <div className="ex-block ex-answer">
          <b>Solution:</b>
          <pre className="code-sample">{exercise.solution}</pre>
          <div>{exercise.explain}</div>
          <button className="btn small" onClick={() => setCode(exercise.solution)}>Editor lo pettu</button>
        </div>
      )}
    </div>
  )
}
