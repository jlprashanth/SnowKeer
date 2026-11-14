import { LESSONS_A } from './lessons-a.js'
import { LESSONS_B } from './lessons-b.js'
import { LESSONS_C } from './lessons-c.js'
import { QUIZ_EXTRA_S1 } from './quiz-extra-s1.js'

// Stage 1 = the "Introduction" section of the Udemy course, in video order.
const order = [
  'account', 'user-admin', 'ui-tour', 'products', 'architecture', 'table-creation', 'form-design', 'views', 'dictionary',
  'process-flow', 'menus-modules', 'table-filters', 'save-submit', 'child-tables', 'data-lookup', 'update-sets', 'ui-policies', 'data-policies',
]
const all = [...LESSONS_A, ...LESSONS_B, ...LESSONS_C]
export const LESSONS = order.map((id) => {
  const l = all.find((x) => x.id === id)
  return { section: 'Introduction', ...l, quiz: [...l.quiz, ...(QUIZ_EXTRA_S1[id] || [])] }
})
