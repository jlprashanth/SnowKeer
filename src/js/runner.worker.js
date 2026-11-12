// Web Worker: learner code runs here, never on the page itself.
import { runScript } from './runScript.js'

self.onmessage = (e) => {
  let out
  try {
    out = runScript(e.data)
  } catch (err) {
    out = { logs: [], error: String(err), results: [], passed: false }
  }
  // JSON round trip drops anything that cannot be cloned (functions etc.)
  self.postMessage(JSON.parse(JSON.stringify(out, (k, v) => (v === undefined ? null : v))))
}
