# review — Q-S3-CLIENT (Stage 3 client-lesson extra quiz questions)

File edited (only this one): `src/data/quiz-extra-cs.js`

## DONE
- Added 120 questions (10 each) for cs-gluser, cs-glform, cs-glform2, cs-gllist, cs-client, cs-onload, cs-onchange,
  cs-ajax1, cs-ajax2, cs-onsubmit, cs-usecases, cs-oncell. Every one of these lessons now has 15 questions (5 base + 10 extra).
- Questions are scenario / code-snippet based and do not repeat the 5 base questions. They cover:
  - g_user properties, including that email / active are undefined
  - hasRole vs hasRoleExactly vs hasRoleFromList
  - "mandatory wins", unknown fields being ignored silently, setVisible vs setDisplay, and getValue returning strings
    ('12' join, '' when empty)
  - g_scratchpad with a Display BR
  - that getReference and getXMLAnswer are async, the getXMLWait limits, and the guards
  - oldValue being the value at form load, and setValue firing onChange again
  - the onSubmit async pattern (return false, then g_form.submit(g_form.getActionName()), plus a flag)
  - the onCellEdit signature, callback(false) or calling it twice, and list edit skipping onChange and UI Policies
  - g_list.getChecked() returning a string (`''.split(',').length` is 1, `ids.length` counts characters), and the 'IN' query
  - UI Policy vs Client Script vs Business Rule
  - out-of-box PDI rules: Highlight VIP Caller, Empty assigned_to on group change, the On Hold UI Policy, the close-info
    Data Policy, the Priority Data Lookup UI Policy, and 3/3 = 4 - Low
- Every option list has 4 unique options, no "all/none of the above", and the why is in Tenglish. No question contains a
  newline. The right answer is listed first, because Quiz.jsx shuffles the options.
- Length balance: the right answer is the single longest option in 11/120 (9%) of my questions, and none fails the 1.6x
  ratio. Stage 3 went from 58% to 34% overall (250 questions so far).

## FLAGGED FOR PDI CHECK (src/data/quiz-extra-cs.js line → what to confirm)
Lines with "⚠️ PDI lo confirm chesuko" in the why. These are from the "NOT tested" list in pdi-facts, or from docs:
- :39 glform2 — getReference(field, cb) is async, so the line after it runs before the callback.
- :46 glform2 — the OOB "Highlight VIP Caller" callback compares `caller.vip == 'true'` (string values in the getReference record).
- :68 cs-client — oldValue = the value at form load (A→B→A case).
- :70 cs-client — UI Type choices are Desktop / Mobile-Service Portal / All. "All" makes the script run in Service Portal too.
- :90 cs-onload — onLoad Client Scripts run before UI Policies, so on a conflict the UI Policy wins.
- :95 cs-onchange — setValue on the script's own field fires onChange again.
- :100 cs-onchange — oldValue = the load value, so A → B → A gives no message.
- :101 cs-onchange — clearValue('assigned_to') fires assigned_to's own onChange script.
- :109 ajax1 — getXMLAnswer is async ('A' shows before 'B').
- :111 ajax1 — getXMLWait is sync, classic UI only, and blocks the browser. ga.getAnswer() comes after it.
- :123 ajax2 — this.getParameter() returns a Java string, so `=== 'network'` is false. Use String(...).
- :126 ajax2 — an empty `initialize: function () {}` in an AbstractAjaxProcessor Script Include breaks getParameter.
  It overrides the parent initialize that stores the request.
- :137 onsubmit — return false inside a GlideAjax callback does not stop the save.
- :138 onsubmit — the pattern: return false, then in the callback call g_form.submit(g_form.getActionName()).
- :140 onsubmit — "Submit" on a new record → getActionName() = 'sysverb_insert'.
- :144 onsubmit — g_form.submit() runs onSubmit again, so a flag (g_scratchpad.ajaxOk) is needed.
- :145 onsubmit — getXMLWait in onSubmit: classic UI only, and the browser freezes.
- :151 usecases — the setValue(state, oldValue) revert fires onChange again, so without a guard the confirm shows twice.
  The failing cs-usecases-7 in check-cs shows the same behaviour in the mock.
- :167 oncell — onChange Client Scripts do not run on a list cell edit.
- :168 oncell — UI Policies do not apply to list edit.
- :173 oncell — onCellEdit newValue is the choice VALUE ('7'), not the label.
Lower risk: not PDI-verified, but standard docs behaviour. No ⚠️ in the text:
- :19 hasRoleFromList is true for admin too.
- :44 repeated showFieldMsg calls with different text stack.
- :48 a reference field inside the getReference record (caller.location) is a sys_id.
- :53 "List choice" = the "Actions on selected rows…" dropdown.
- :73 the Client Scripts module is under System Definition.
- :86 g_scratchpad is always defined on a form, so a missing property is just undefined.
- :116 getXML → response.responseXML.documentElement.getAttribute('answer').

## REQUESTS (files I don't own)
1. lessons-cs*.js (lesson owner): check-quiz flags these BASE questions in my lessons (right answer much longer):
   cs-glform2 Q1, cs-gllist Q4, cs-onload Q2 + Q4, cs-ajax1 Q1 + Q4, cs-ajax2 Q1 + Q2, cs-onsubmit Q5,
   cs-usecases Q1 + Q2 + Q3, cs-oncell Q4. (cs-gluser Q4 and cs-glform Q3 were already fixed during my run.) My extra questions are not flagged.
2. Brazil label (pdi-facts #15): the checkbox is "Glide AJAX enabled", not "Client callable". Places to change:
   - lessons-cs-c.js:111 (cs-ajax1 card) and :121 (cs-ajax1 Q5 option + why)
   - lessons-cs-c.js:227 (cs-ajax2 blurb), :232 and :250 (cs-ajax2 cards)
   - glossary-cs.js:79 (the 'Script Include' entry)
   My questions already use "Glide AJAX enabled".
3. lessons-cs-b.js:342 (cs-client card) says "oldValue = mundu value". Suggest: "oldValue = form LOAD ayinappati value (last
   edit kaadu) ⚠️ PDI lo confirm chesuko". This matches lessons-cs-c.js:768 and my questions at :68 and :100.
4. lessons-cs-c.js:237, 263–284 (cs-ajax2 card + exercise "getName function"): AbstractAjaxProcessor itself has a getName() that returns
   sysparm_name. Overriding it in a client-callable Script Include MAY break the GlideAjax call in the real PDI. This is not
   verified. Safer: rename the function to getUserName (card code, exercise, tests, hints). PDI check: a test Script Include
   with a getName function, called from a client script.
5. check-cs currently fails cs-usecases-7 ("confirm asked twice"). The revert needs an `if (newValue == oldValue) return;` guard.
   Not my file, so it is noted here only.

## NOT DONE
- Nothing from my task. The base 5 questions per lesson are in the lesson files (another agent's), so I did not touch them (see REQUESTS 1).

## Final check output (my lessons)
```
cs-gluser 15 · cs-glform 15 · cs-glform2 15 · cs-gllist 15 · cs-client 15 · cs-onload 15 · cs-onchange 15 · cs-ajax1 15 ·
cs-ajax2 15 · cs-onsubmit 15 · cs-usecases 15 · cs-oncell 15
node dev-tools/check-quiz.mjs → my lessons: no "questions (Stage 3 needs 15+)" errors; only flags are base Q1–Q5 (listed above):
✗ cs-glform2 Q1 / cs-gllist Q4 / cs-onload Q2, Q4 / cs-ajax1 Q1, Q4 / cs-ajax2 Q1, Q2 / cs-onsubmit Q5 /
  cs-usecases Q1, Q2, Q3 / cs-oncell Q4 — right answer much longer (base questions, lesson files)
Stage 3: 26 lessons, 250 questions, right answer longest in 34%
Own stats (120 extra questions): right answer single-longest 11 (9%), ratio fails 0, 4 options each, no dup options,
why ≥ 15 chars, no newline, no Telugu-script characters, no Hindi words.
node dev-tools/check-cs.mjs → quiz answer indices OK. Its 7 failures are exercises in other agents' lessons
(cs-usecases-7, cs-ua1-3/4/6, cs-ua4-1/2, cs-best-5).
```
