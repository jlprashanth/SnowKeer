// Sanity check for Stage 2 quizzes: 20 questions per lesson, unique options, valid answer index, no duplicate questions.
import { JS_LESSONS } from '../src/data/lessons-js.js'
let bad = 0
const fail = (m) => { bad++; console.log('✗', m) }
for (const l of JS_LESSONS) {
  if (l.quiz.length !== 20) fail(`${l.id}: ${l.quiz.length} questions (expected 20)`)
  const seen = new Set()
  l.quiz.forEach((x, i) => {
    const tag = `${l.id} Q${i + 1}`
    if (seen.has(x.q)) fail(`${tag}: duplicate question`)
    seen.add(x.q)
    if (new Set(x.options).size !== x.options.length) fail(`${tag}: duplicate options`)
    if (x.options.length < 3 || x.options.length > 5) fail(`${tag}: ${x.options.length} options`)
    if (!(x.answer >= 0 && x.answer < x.options.length)) fail(`${tag}: bad answer index`)
    if (!x.why) fail(`${tag}: missing explanation`)
    if (/\n/.test(x.q)) fail(`${tag}: newline in question`)
  })
  console.log(`${l.id}: ${l.quiz.length} questions`)
}
console.log(bad ? `\n${bad} problem(s)` : '\nAll quiz checks OK')
process.exit(bad ? 1 : 0)
