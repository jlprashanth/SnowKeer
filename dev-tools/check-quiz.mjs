// Quiz sanity for ALL stages — run: node dev-tools/check-quiz.mjs
// Per question: 3–5 options, unique options, valid answer index, an explanation, no newline, no duplicate question in a lesson.
// Per lesson: Stage 1 at least 8 questions, Stage 2 exactly 20, Stage 3 at least 15.
// Guessability: the right option must not be MUCH longer than the others (ratio > 1.6 and 20+ chars fails), and in each stage
// the right option may be the single longest in at most 40% of questions (options are shuffled on screen, length is not).
import { LESSONS } from '../src/data/lessons.js'
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'

let bad = 0
const fail = (m) => { bad++; console.log('✗', m) }
const STAGES = [
  { name: 'Stage 1', lessons: LESSONS, min: 8, max: Infinity },
  { name: 'Stage 2', lessons: JS_LESSONS, min: 20, max: 20 },
  { name: 'Stage 3', lessons: CS_LESSONS, min: 15, max: Infinity },
]
for (const s of STAGES) {
  let total = 0
  let longest = 0
  for (const l of s.lessons) {
    const n = l.quiz.length
    if (n < s.min || n > s.max) fail(`${l.id}: ${n} questions (${s.name} needs ${s.max === s.min ? s.min : s.min + '+'})`)
    const seen = new Set()
    l.quiz.forEach((x, i) => {
      total++
      const tag = `${l.id} Q${i + 1}`
      if (seen.has(x.q)) fail(`${tag}: duplicate question`)
      seen.add(x.q)
      const opts = x.options.map(String)
      if (new Set(opts).size !== opts.length) fail(`${tag}: duplicate options`)
      if (opts.length < 3 || opts.length > 5) fail(`${tag}: ${opts.length} options`)
      if (!(x.answer >= 0 && x.answer < opts.length)) fail(`${tag}: bad answer index`)
      if (!x.why || String(x.why).trim().length < 15) fail(`${tag}: missing / too short explanation`)
      if (/\n/.test(x.q)) fail(`${tag}: newline in question`)
      const lens = opts.map((o) => o.length)
      const a = lens[x.answer]
      const others = (lens.reduce((p, c) => p + c, 0) - a) / (lens.length - 1)
      if (lens.filter((v) => v === a).length === 1 && a === Math.max(...lens)) longest++
      if (a === Math.max(...lens) && a >= 20 && a > 1.6 * others) fail(`${tag}: right answer is much longer than the others (${(a / others).toFixed(1)}x) — easy to guess`)
    })
  }
  const pct = total ? Math.round((longest / total) * 100) : 0
  if (pct > 40) fail(`${s.name}: the right answer is the longest option in ${pct}% of questions (max 40%)`)
  console.log(`${s.name}: ${s.lessons.length} lessons, ${total} questions, right answer longest in ${pct}%`)
}
console.log(bad ? `\n${bad} problem(s)` : '\nAll quiz checks OK')
process.exit(bad ? 1 : 0)
