// Progress is saved in this browser only (localStorage). Wrapped in try/catch:
// private windows or blocked storage must never crash the app.
const KEY = 'snowkeer-progress-v1'

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}
