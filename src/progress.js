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

// Light/dark preference for the stage pages (the ServiceNow mock is never themed). Default: light.
const THEME_KEY = 'snowkeer-theme-mode'

export function loadThemeMode() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveThemeMode(m) {
  try {
    localStorage.setItem(THEME_KEY, m)
  } catch {
    /* ignore */
  }
}
