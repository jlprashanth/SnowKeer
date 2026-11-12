// Tiny helpers so lessons read like a script.
export const info = (text, target, o = {}) => ({ type: 'info', text, target, ...o })
export const hover = (text, target, o = {}) => ({ type: 'info', allowHover: true, text, target, ...o })
export const click = (target, text, hint) => ({
  type: 'click',
  target,
  text,
  hint: hint || 'Highlight chesina daggara click cheyyi 🙂',
})
// type / choose something. `demo` is what the automatic test types.
export const type = (target, text, validate, demo, o = {}) => ({
  type: 'input',
  target,
  text,
  validate,
  demo,
  okText: 'Bagundi! 👍 Next click cheyyi.',
  hint: 'Highlight chesina field lo cheyyi.',
  ...o,
})
export const has = (s) => (v) => String(v).toLowerCase().includes(String(s).toLowerCase())
export const eq = (s) => (v) => String(v) === String(s)
export const len = (n) => (v) => String(v).trim().length >= n
export const yes = (v) => v === true

// open the All menu, filter, click a module (common 3-step navigation)
export const goTo = (filterText, modId, what) => [
  click('btn-all', `Mundu "All" click cheyyi — ${what} ki velladaniki.`),
  type('nav-filter', `Filter lo "${filterText}" ani type cheyyi.`, has(filterText), filterText, {
    hint: `Filter box lo "${filterText}" type cheyyi.`,
  }),
  click(modId, `Ippudu highlight chesina module click cheyyi.`),
]

export const q = (qs, options, answer, why) => ({ q: qs, options, answer, why })

// Stage 2 coding exercise (runs in the browser sandbox). tests: { label, logs:[..] } | { label, expr, expect }
export const jx = (lessonId, n, title, level, o) => ({ id: `${lessonId}-${n}`, lessonId, title, level, hint: '', scenario: undefined, ...o })

// Hands-on exercise for the real PDI. `cleanup` is optional (read-only tasks have none).
export const ex = (lessonId, n, title, level, o) => ({ id: `${lessonId}-${n}`, lessonId, title, level, cleanup: '', hint: '', ...o })
