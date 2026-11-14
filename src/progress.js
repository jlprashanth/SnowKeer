// Progress is saved in this browser only (localStorage). Wrapped in try/catch:
// private windows or blocked storage must never crash the app.
const KEY = 'snowkeer-progress-v1'
// ScriptRunner saves her code per exercise under 'snowkeer-code-v1:<exerciseId>' (backup / reset handle these too)
export const CODE_PREFIX = 'snowkeer-code-v1:'

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

// All saved-code keys (collected first: removing while walking localStorage by index would skip keys)
function codeKeys() {
  const keys = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(CODE_PREFIX)) keys.push(k)
    }
  } catch {
    /* storage blocked */
  }
  return keys
}

// Reset progress → her saved code goes too
export function clearSavedCode() {
  for (const k of codeKeys()) {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  }
}

// Backup file (Hub "⬇ Progress save cheyyi"): { version: 1, progress, code: { 'snowkeer-code-v1:<id>': code } }
export function exportProgress(progress = loadProgress()) {
  const code = {}
  for (const k of codeKeys()) {
    try {
      const v = localStorage.getItem(k)
      if (v != null) code[k] = v
    } catch {
      /* ignore */
    }
  }
  return JSON.stringify({ version: 1, app: 'snowkeer', savedAt: new Date().toISOString(), progress, code }, null, 2)
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const NOT_OURS = 'Idi SnowKeer progress file la ledu. "⬇ Progress save cheyyi" tho download chesina snowkeer-progress.json file ne ivvu.'

// Check a backup file WITHOUT changing anything → { ok: true, progress, code, savedAt } or { ok: false, error } (Tenglish)
export function readBackup(json) {
  let data
  try {
    data = JSON.parse(json)
  } catch {
    return { ok: false, error: 'Ee file JSON kaadu (paadaipoyindi emo). ' + NOT_OURS }
  }
  if (!isObj(data) || !isObj(data.progress)) return { ok: false, error: NOT_OURS }
  if (data.version !== 1) return { ok: false, error: `Ee file version (${String(data.version)}) ee SnowKeer ki teliyadu — version 1 file kavali.` }
  const p = data.progress
  for (const [k, v] of Object.entries(p)) {
    if (!isObj(v)) return { ok: false, error: `Progress lo "${k}" sarigga ledu. ` + NOT_OURS }
    if (k === 'exercises' || k === 'jsDone') {
      // ticks: true (done) or 'solution' (passed after opening the solution); false = an old unticked box
      if (!Object.values(v).every((t) => typeof t === 'boolean' || t === 'solution')) return { ok: false, error: `Progress lo "${k}" sarigga ledu. ` + NOT_OURS }
    } else if (('score' in v && typeof v.score !== 'number') || ('done' in v && typeof v.done !== 'boolean')) {
      return { ok: false, error: `Lesson "${k}" progress sarigga ledu. ` + NOT_OURS }
    }
  }
  const code = data.code == null ? {} : data.code
  if (!isObj(code) || !Object.entries(code).every(([k, v]) => k.startsWith(CODE_PREFIX) && typeof v === 'string')) {
    return { ok: false, error: 'Saved code part sarigga ledu. ' + NOT_OURS }
  }
  return { ok: true, progress: p, code, savedAt: typeof data.savedAt === 'string' ? data.savedAt : null }
}

// Hub "⬆ Progress load cheyyi" (after she confirms): REPLACES progress and all saved code with the file's
export function importProgress(json) {
  const r = readBackup(json)
  if (!r.ok) return r
  try {
    for (const [k, v] of Object.entries(r.code)) localStorage.setItem(k, v)
    localStorage.setItem(KEY, JSON.stringify(r.progress))
  } catch {
    return { ok: false, error: 'Browser storage lo save avvaledu (private window leda storage full emo). Progress load avvaledu.' }
  }
  for (const k of codeKeys()) {
    if (!Object.prototype.hasOwnProperty.call(r.code, k)) {
      try {
        localStorage.removeItem(k)
      } catch {
        /* ignore */
      }
    }
  }
  return r
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
