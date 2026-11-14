// Lists quiz questions whose right answer is much longer than the other options (easy to guess even though options are shuffled).
// run: node dev-tools/audit-quiz2.mjs [ratio=1.7] [v]   — v = verbose (prints question + options). check-quiz.mjs fails at ratio 1.6.
import { LESSONS } from '../src/data/lessons.js'
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'
const T = Number(process.argv[2] || 1.7), V = process.argv[3] === 'v'
let n = 0
for (const [s, ls] of Object.entries({ S1: LESSONS, S2: JS_LESSONS, S3: CS_LESSONS })) for (const l of ls) l.quiz.forEach((x, i) => {
  const lens = x.options.map(o => String(o).length), a = lens[x.answer]
  const others = (lens.reduce((p, c) => p + c) - a) / (lens.length - 1)
  if (a === Math.max(...lens) && a > T * others && a >= 20) {
    n++
    if (V) console.log(`${l.id}#${i} | ${x.q} | A: ${x.options[x.answer]} | W: ${x.options.filter((_, k) => k !== x.answer).join(' ¦ ')}`)
    else console.log(`${s} ${l.id} #${i} ratio=${(a / others).toFixed(1)}`)
  }
})
if (!V) console.log('flagged', n)
