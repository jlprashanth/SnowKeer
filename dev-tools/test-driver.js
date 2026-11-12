// DEV ONLY: auto-plays a lesson the way a learner would. Used to verify every step is completable.
window.__run = async (id) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const S = window.__snow
  const L = S.LESSONS.find((x) => x.id === id)
  const q = (t) => document.querySelector(`[data-tour="${t}"]`)
  const setNative = (el, v) => {
    const p = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
  S.startLesson(id)
  await sleep(700)
  const log = []
  let idx = -1
  let stall = 0
  for (let g = 0; g < 150; g++) {
    const se = document.querySelector('.bubble-step')
    if (!se) {
      log.push(document.body.innerText.includes('Question 1') ? 'QUIZ REACHED' : 'NO BUBBLE')
      break
    }
    const n = parseInt(se.textContent.split(' ')[1]) - 1
    if (n === idx) {
      stall++
      if (stall > 3) {
        const st = L.steps[n]
        log.push(`STUCK step ${n + 1}/${L.steps.length} [${st.type}] target=${st.target} exists=${!!(st.target && q(st.target))} :: ${st.text.slice(0, 70)}`)
        const e1 = document.querySelector('.form-err')?.textContent
        if (e1) log.push('formErr: ' + e1)
        break
      }
    } else {
      stall = 0
      idx = n
    }
    const st = L.steps[n]
    if (window.__stopAt && n + 1 === window.__stopAt) return 'stopped at ' + (n + 1)
    await sleep(250)
    const el = st.target ? q(st.target) : null
    if (window.__verbose && st.type === 'info' && el) log.push(`#${n + 1} ${st.target}: ` + el.innerText.replace(/\s+/g, ' ').slice(0, 110) + (el.querySelector?.('input,select') ? ' | val=' + el.querySelector('input,select').value : ''))
    if (st.type === 'click') {
      if (!el) await sleep(400)
      else el.click()
    } else if (st.type === 'input') {
      if (!el) await sleep(400)
      else {
        const inp = el.matches('input,select,textarea') ? el : el.querySelector('input,select,textarea')
        if (inp.type === 'checkbox') {
          if (inp.checked !== st.demo) inp.click()
        } else if (inp.multiple) {
          ;[...inp.options].forEach((o) => (o.selected = o.value === st.demo))
          inp.dispatchEvent(new Event('change', { bubbles: true }))
        } else setNative(inp, st.demo)
        await sleep(300)
        document.querySelector('.bubble-foot .btn.primary')?.click()
      }
    } else {
      document.querySelector('.bubble-foot .btn.primary')?.click()
    }
    // wait until the step actually advances (background tabs throttle timers)
    const before = document.querySelector('.bubble-step')?.textContent
    for (let w = 0; w < 40; w++) {
      await sleep(100)
      const now = document.querySelector('.bubble-step')?.textContent
      if (now !== before) break
    }
    await sleep(150)
  }
  return log.join('\n') || 'ok'
}
