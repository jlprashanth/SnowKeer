import { LESSONS_A } from './lessons-a.js'
import { LESSONS_B } from './lessons-b.js'
import { LESSONS_C } from './lessons-c.js'

// Stage 1 = the "Introduction" section of the Udemy course, in video order.
const order = [
  'account', 'user-admin', 'ui-tour', 'products', 'architecture', 'table-creation', 'form-design', 'views', 'dictionary',
  'process-flow', 'menus-modules', 'table-filters', 'save-submit', 'child-tables', 'data-lookup', 'update-sets', 'ui-policies', 'data-policies',
]
const all = [...LESSONS_A, ...LESSONS_B, ...LESSONS_C]
export const LESSONS = order.map((id) => ({ section: 'Introduction', ...all.find((l) => l.id === id) }))
