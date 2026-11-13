import { LESSONS } from '../src/data/lessons.js'
import { JS_LESSONS } from '../src/data/lessons-js.js'
import { CS_LESSONS } from '../src/data/lessons-cs.js'
const stages = { S1: LESSONS, S2: JS_LESSONS, S3: CS_LESSONS }
for (const [s, ls] of Object.entries(stages)) {
  const pos = {}; let total = 0, longest = 0, shortest = 0
  for (const l of ls) {
    const qs = l.quiz || l.steps?.filter(x => x.type === 'quiz') || []
    const quiz = l.quiz || []
    if (!quiz.length) console.log(s, l.id, 'NO QUIZ (steps-based?)', Object.keys(l).join(','))
    quiz.forEach((x, i) => {
      total++; pos[x.answer] = (pos[x.answer] || 0) + 1
      const o = x.options.map(String)
      if (new Set(o.map(t => t.trim().toLowerCase())).size !== o.length) console.log(s, l.id, i, 'DUP OPTION')
      if (o.some(t => !t.trim())) console.log(s, l.id, i, 'EMPTY OPTION')
      if (!x.why || x.why.length < 15) console.log(s, l.id, i, 'WEAK WHY')
      const lens = o.map(t => t.length), a = lens[x.answer]
      if (a === Math.max(...lens) && a > 1.4 * (lens.reduce((p, c) => p + c) - a) / (lens.length - 1)) longest++
      if (o.length !== 4) console.log(s, l.id, i, 'options=' + o.length)
      if (/all of the above|none of the above/i.test(o.join('|'))) console.log(s, l.id, i, 'ALL/NONE')
    })
  }
  console.log(s, 'questions', total, 'answer positions', JSON.stringify(pos), 'answer-is-much-longest', longest)
}
