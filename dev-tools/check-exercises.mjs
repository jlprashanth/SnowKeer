// Sanity check for src/data/exercises.js — run: node dev-tools/check-exercises.mjs
import { EXERCISES } from '../src/data/exercises.js'
import { LESSONS } from '../src/data/lessons.js'

const ids = new Set(LESSONS.map((l) => l.id))
const seen = new Set()
let bad = 0
const fail = (m) => { bad++; console.log('FAIL', m) }
for (const e of EXERCISES) {
  if (seen.has(e.id)) fail('duplicate id ' + e.id)
  seen.add(e.id)
  if (!ids.has(e.lessonId)) fail(e.id + ': unknown lessonId ' + e.lessonId)
  for (const k of ['title', 'scenario', 'answer']) if (!String(e[k] || '').trim()) fail(e.id + ': empty ' + k)
  if (!Array.isArray(e.steps) || !e.steps.length) fail(e.id + ': no steps')
  if (!['easy', 'medium', 'hard'].includes(e.level)) fail(e.id + ': bad level ' + e.level)
  // Practice Task exercises must say so, unless they are the one that creates the table
  const usesPT = /Practice Task|Practice Child/.test(e.scenario + e.steps.join(' '))
  if (usesPT && e.id !== 'table-creation-1' && !/Prerequisite/.test(e.scenario)) fail(e.id + ': uses Practice Task but no "Prerequisite" note')
}
const lacking = LESSONS.filter((l) => !EXERCISES.some((e) => e.lessonId === l.id)).map((l) => l.id)
console.log(`${EXERCISES.length} exercises, ${bad} problems. Lessons without exercises: ${lacking.join(', ') || 'none'}`)
process.exit(bad ? 1 : 0)
