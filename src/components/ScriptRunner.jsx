import { useEffect, useRef, useState } from 'react'
import CodeEditor from './CodeEditor.jsx'
// ?worker&inline → classic (non-module) worker embedded as a Blob: works on older browsers, no separate file to fail loading
import RunnerWorker from '../js/runner.worker.js?worker&inline'

const TIMEOUT_MS = 3000
const show = (v) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v) ?? String(v))

// Editor + Run + Script Log + test results. `exercise` = null → free scratchpad (no tests).
export default function ScriptRunner({ exercise, starter, done, onPass, scenario, client }) {
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

  const clientCfg = exercise ? exercise.client : client
  const scen = exercise ? exercise.scenario : scenario

  // interactive = she edited a field in the mock form → re-run the script as an onChange
  const run = (interactive) => {
    stop()
    setRunning(true)
    setOut(null)
    const payload = {
      code,
      scenario: scen,
      tests: interactive ? [] : exercise?.tests || [],
      variants: interactive ? undefined : exercise?.variants,
      client: clientCfg ? (interactive ? { ...clientCfg, ...interactive, interactive: true } : clientCfg) : undefined,
    }
    const finish = (data) => {
      stop()
      setRunning(false)
      setOut(data)
      if (!interactive && data.passed && !passed.current) {
        passed.current = true
        onPass?.()
      }
    }
    // Fallback: this browser could not start the Web Worker → run on the page itself (no infinite-loop protection)
    const runOnPage = async () => {
      try {
        const { runScript } = await import('../js/runScript.js')
        const data = runScript(payload)
        finish(JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v))))
      } catch (err) {
        finish({ logs: [], results: [], error: String(err) })
      }
    }
    let w
    try {
      w = new RunnerWorker()
    } catch {
      runOnPage()
      return
    }
    worker.current = w
    timer.current = setTimeout(() => {
      stop()
      setRunning(false)
      setOut({ logs: [], results: [], error: `${TIMEOUT_MS / 1000} sec lo complete avvaledu — infinite loop (while(true)) undi emo chudu.` })
    }, TIMEOUT_MS)
    w.onmessage = (e) => finish(e.data)
    w.onerror = (e) => {
      // a script error is reported by the worker itself; an event with no message = the worker failed to start
      if (e.message) finish({ logs: [], results: [], error: e.message })
      else { stop(); runOnPage() }
    }
    w.postMessage(payload)
  }

  const editField = (name, value) => {
    const fields = out.form.fields
    const values = Object.fromEntries(fields.map((f) => [f.name, f.value]))
    const oldValue = values[name]
    if (oldValue === value) return
    delete values[name]
    run({ trigger: { type: 'onChange', field: name, oldValue, newValue: value }, formValues: values })
  }

  const reset = () => {
    setCode(initial)
    setOut(null)
  }

  return (
    <div className="runner">
      <CodeEditor value={code} onChange={setCode} onRun={() => run()} />
      <div className="runner-bar">
        <button className="btn primary small" onClick={() => run()} disabled={running}>{running ? 'Running…' : '▶ Run'}</button>
        <button className="btn small" onClick={reset}>↺ Reset</button>
        {exercise?.hint && !hint && <button className="btn small" onClick={() => setHint(true)}>💡 Hint</button>}
        {exercise && !solution && <button className="btn small" onClick={() => setSolution(true)}>✅ Solution chupinchu</button>}
        <span className="muted small">Ctrl + Enter = Run</span>
        {done && <span className="runner-done">✔ Done</span>}
      </div>

      {hint && <div className="ex-block ex-hint">💡 {exercise.hint}</div>}

      {out?.form && <ClientForm form={out.form} onEdit={editField} trigger={out.trigger} submit={out.submit} />}

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

// The mock incident form: shows what g_form did, and lets her change a field (→ onChange runs again)
function ClientForm({ form, onEdit, trigger, submit }) {
  const [shown, setShown] = useState(true)
  return (
    <div className="cf">
      <div className="cf-title" onClick={() => setShown(!shown)}>
        📋 Incident form (live) <span className="muted small">— trigger: {trigger?.type}{trigger?.type === 'onChange' ? ` (${trigger.field}: "${trigger.oldValue}" → "${trigger.newValue}")` : ''}{trigger?.type === 'onSubmit' || trigger?.type === 'onCellEdit' ? (submit ? ' · ✅ allowed' : ' · ⛔ blocked (false)') : ''}</span> {shown ? '▲' : '▼'}
      </div>
      {shown && (
        <>
          {form.messages.map((m, i) => (
            <div key={i} className={'cf-msg ' + m.kind}>{m.kind === 'error' ? '⛔' : 'ℹ️'} {m.text}</div>
          ))}
          <div className="cf-grid">
            {form.fields.filter((f) => f.visible || f.space).map((f) => f.visible ? (
              <label key={f.name} className={'cf-field' + (f.type === 'text' ? ' wide' : '')}>
                <span className="cf-label">{f.mandatory && <b className="cf-req">*</b>}{f.label}</span>
                {f.choices ? (
                  <select value={f.value} disabled={f.readOnly} onChange={(e) => onEdit(f.name, e.target.value)}>
                    <option value="">-- None --</option>
                    {f.choices.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                ) : f.type === 'text' ? (
                  <textarea key={f.value} rows={2} defaultValue={f.value} disabled={f.readOnly} onBlur={(e) => onEdit(f.name, e.target.value)} />
                ) : (
                  <input key={f.value} defaultValue={f.value} disabled={f.readOnly} onBlur={(e) => onEdit(f.name, e.target.value)} />
                )}
                {f.msgs.map((m, i) => <span key={i} className={'cf-fmsg ' + m.type}>{m.text}</span>)}
              </label>
            ) : (
              <div key={f.name} className="cf-field cf-gap" style={{ minHeight: 54 }} title="setVisible(false): field hide ayindi kani space migilindi (setDisplay ayithe space kuda povadam)" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
