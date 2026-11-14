// Every stage of the course, in order. The hub (stage cards + "Continue"), Hands-on Practice (one fold per stage) and App
// (finding a code lesson) all read this list, so adding Stage 4 = one more entry here.
//   kind 'guided' = Stage 1 style: guided simulator lesson + quiz; exercises live in exercises.js (real PDI), ticks in progress.exercises
//   kind 'code'   = Learn / Quiz / Code lesson opened in JsLesson; exercises on the lesson, ticks in progress.jsDone
//                   (true = passed, 'solution' = passed after opening the solution; both count as done)
// Optional: intro (text above the lesson cards), glossary (show the JavaScript glossary panel on the hub).
import { LESSONS } from './lessons.js'
import { JS_LESSONS } from './lessons-js.js'
import { CS_LESSONS } from './lessons-cs.js'
import { exercisesFor } from './exercises.js'

export const STAGES = [
  {
    key: 's1',
    num: 1,
    icon: '🧭',
    title: 'Introduction',
    subtitle: 'Account, UI tour, tables, forms, update sets',
    kind: 'guided',
    lessons: LESSONS,
  },
  {
    key: 's2',
    num: 2,
    icon: '💻',
    title: 'JavaScript (ServiceNow style)',
    subtitle: 'gs, GlideRecord, incident — code ikkade run cheyyi',
    kind: 'code',
    lessons: JS_LESSONS,
    glossary: true,
    intro: 'Idi generic JavaScript kaadu — anni examples ServiceNow lo (gs, GlideRecord, incident) nunchi. Code ikkade rayi run cheyochu.',
  },
  {
    key: 's3',
    num: 3,
    icon: '🖱️',
    title: 'Client scripting',
    subtitle: 'g_form, g_user, Client Scripts, UI Actions — form react avtundi',
    kind: 'code',
    lessons: CS_LESSONS,
    intro:
      'Client scripts browser lo run avtayi. Ikkada code rasi Run cheste kinda unna mock Incident form lo marpulu live ga kanipistayi. Course lo 26 lectures anni ikkada unnayi. Konni lessons lo code ikkade run avtundi, konni (SN Utils, debugging, macros, UI Pages, UI Macros) nee real PDI lo cheyyali.',
  },
]

// A code lesson (any 'code' stage) by id — App uses it to open JsLesson
export const findCodeLesson = (id) =>
  STAGES.filter((s) => s.kind === 'code').flatMap((s) => s.lessons).find((l) => l.id === id) || null

// Exercises of one lesson, in the lesson file's ARRAY order (that is the order she should do them)
export const lessonExercises = (stage, lesson) => (stage.kind === 'guided' ? exercisesFor(lesson.id) : lesson.exercises)

// Is this exercise ticked? Stage 1 → progress.exercises, code stages → progress.jsDone
export const exerciseDone = (stage, progress, id) =>
  !!(stage.kind === 'guided' ? progress.exercises?.[id] : progress.jsDone?.[id])

// Finished lesson: guided = tour + quiz done; code = quiz has a score AND every exercise is done
export function lessonDone(stage, progress, lesson) {
  if (stage.kind === 'guided') return !!progress[lesson.id]?.done
  return typeof progress[lesson.id]?.score === 'number' && lesson.exercises.every((e) => progress.jsDone?.[e.id])
}

export const stageDoneCount = (stage, progress) => stage.lessons.filter((l) => lessonDone(stage, progress, l)).length

// First unfinished lesson across all stages, in course order → { stage, lesson } (null = everything finished)
export function nextLesson(progress) {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((l) => !lessonDone(stage, progress, l))
    if (lesson) return { stage, lesson }
  }
  return null
}
