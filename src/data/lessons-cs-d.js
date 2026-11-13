// Stage 3 (client) lessons 18–22: UI Actions (parts 1–4) and UI Actions on the table list.
// Server-side UI Action scripts run in the Stage 2 sandbox (current, action, gs, GlideRecord); client ones in the form sandbox.
import { q, jx } from './lessonKit.js'

const CALL = (fn) => ({ trigger: { type: 'call', fn } })
const MSGS = '__msgs.map(function (m) { return m.text })'
const CUR = (values) => ({ current: { table: 'incident', values: { number: 'INC0010001', ...values } } })
// run a condition function on several incidents by number → array of results
const COND = (fn, nums) => `${JSON.stringify(nums)}.map(function (n) { var g = new GlideRecord('incident'); g.get('number', n); return ${fn}(g); })`

/* 18 — UI Actions part 1 */
const ua1 = {
  id: 'cs-ua1',
  title: 'UI Actions — Part 1 (server-side buttons)',
  video: 'UI Actions',
  duration: '',
  no: 18,
  blurb: 'Form button / link / context menu ela create chestam; server script lo current + action.',
  learn: [
    {
      h: '🔘 UI Action ante emiti?',
      body: [
        'UI Action = form lo button, link leda right-click context menu item. User click chesinappudu script run avtundi. System Definition → UI Actions lo create chestam.',
        'Mukhyamaina fields: Name (button label), Table, Action name (unique id), Show insert / Show update, Form button / Form context menu / Form link, Condition (button eppudu kanipinchali), Client (tick = browser lo run), Onclick, Script.',
        'Client tick cheyyakapothe script SERVER lo run avtundi — current (aa record) vaadochu.',
      ],
    },
    {
      h: '🖧 Server-side UI Action script',
      body: [
        'Server script lo current = form lo unna record. current.field = value; current.update(); tarvata action.setRedirectURL(current) — user ni aa record ki malli teesukelutundi (form refresh).',
        'Messages: gs.addInfoMessage("..."), gs.addErrorMessage("..."). Condition lo e.g. current.active == true && current.state != 6.',
      ],
      code: `// UI Action: Resolve   (Client unchecked)
current.state = 6;
current.update();
gs.addInfoMessage('Incident resolved');
action.setRedirectURL(current);`,
    },
    {
      h: '⚠️ Gurtupettukovali',
      body: [
        'Server-side UI Action click chesinappudu form values server ki veltayi, aa values current lo untayi — kani record automatic ga save avvadu (nenu anukuntunnadi: nee script lo current.update() pilichinappude save avtundi). Nee PDI lo oka test UI Action tho confirm chesuko.',
        'Ee exercises lo "current" ivvabadindi. Real lo mandatory fields fail ayithe script run avvadu. Memory nunchi rasina details — nee PDI lo oka test UI Action tho confirm chesuko (nee PDI lo marpulu reverse cheyyi!).',
      ],
    },
  ],
  quiz: [
    q('UI Action ante?', ['Server lo run ayye Business Rule type', 'Form button / link / context menu', 'Time batti run ayye Scheduled Job', 'Data store chese Table'], 1, 'Form lo button, link, context menu.'),
    q('Client checkbox tick cheyyakapothe script ekkada run avtundi?', ['Browser', 'Server', 'MID', 'Mobile'], 1, 'Client tick cheyyakapothe UI Action script server lo run avtundi (current, gs vaadochu).'),
    q('Script tarvata user ni record ki ela pampali?', ['action.setRedirectURL(current)', 'gs.redirect', 'g_form.reload', 'current.redirect'], 0, 'action.setRedirectURL(current).'),
    q('Action name enduku?', ['Unique id (gsftSubmit etc. ki)', 'Button yokka colour', 'Table yokka peru', 'Roles list'], 0, 'Unique identifier — client nunchi pilavadaniki.'),
    q('Button eppudu kanipinchali ani control cheyyadam?', ['Condition field', 'Order', 'Hint', 'Active'], 0, 'Condition (e.g. current.state != 6).'),
  ],
  exercises: [
    jx('cs-ua1', 1, 'Resolve button', 'easy', {
      server: true,
      scenario: CUR({ state: '2', description: '' }),
      task: 'Resolve UI Action script rayi: current.state ni 6 ki set chey, description = "Resolved by UI Action", current.update(), tarvata action.setRedirectURL(current).',
      starter: '// UI Action: Resolve (server)\n// TODO',
      hint: "current.setValue('state', 6); current.setValue('description', 'Resolved by UI Action'); current.update(); action.setRedirectURL(current);",
      solution: "current.setValue('state', 6);\ncurrent.setValue('description', 'Resolved by UI Action');\ncurrent.update();\naction.setRedirectURL(current);",
      explain: 'current = form lo record. update() tho save, redirect tho form malli open. (Real PDI lo Resolved ki Resolution code + notes kuda mandatory — ee practice lo simple ga unchamu; nee PDI lo try chesetappudu avi kuda set chey.)',
      tests: [
        { label: 'state = 6', expr: "current.getValue('state')", expect: '6' },
        { label: 'description', expr: "current.getValue('description')", expect: 'Resolved by UI Action' },
      ],
    }),
    jx('cs-ua1', 2, 'Escalate button', 'easy', {
      server: true,
      scenario: CUR({ priority: '3' }),
      task: 'Escalate UI Action rayi: priority ni 1 step takkuva (3 → 2) chey (Number() vaadu), update() chey, gs.info("Escalated to P" + newPriority) log chey.',
      starter: '// UI Action: Escalate (server)\n// TODO',
      hint: "var p = Number(current.getValue('priority')) - 1; current.setValue('priority', p); current.update(); gs.info('Escalated to P' + p);",
      solution: "var p = Number(current.getValue('priority')) - 1;\ncurrent.setValue('priority', p);\ncurrent.update();\ngs.info('Escalated to P' + p);",
      explain: 'getValue string — Number() tho calculate (Stage 2 lo nerchukunnadi).',
      tests: [
        { label: 'priority 2', expr: "current.getValue('priority')", expect: '2' },
        { label: 'log', logs: ['Escalated to P2'] },
      ],
    }),
    jx('cs-ua1', 3, 'Assign to me', 'medium', {
      server: true,
      scenario: CUR({ assigned_to: '', state: '1' }),
      task: 'Assign to me UI Action rayi: assigned_to = gs.getUserID(), state "2" (In Progress) chey, update() chey. Assigned_to already unte (empty kaadu) gs.addErrorMessage("Already assigned") chupinchi emi marchakunda return avvu.',
      starter: '// UI Action: Assign to me (server)\n// TODO',
      hint: [
        'Rendu daarulu: assigned_to lo already evaro unte error chupinchi aagu; lekapothe nuvve assign chesuko. if / else kavali.',
        "Check: current.getValue('assigned_to') != ''.   Login user sys_id: gs.getUserID().   Save: current.update().",
        "if (current.getValue('assigned_to') != '') { gs.addErrorMessage('Already assigned'); } else { current.setValue('assigned_to', gs.getUserID()); current.setValue('state', 2); current.update(); }",
      ],
      solution: "if (current.getValue('assigned_to') != '') {\n  gs.addErrorMessage('Already assigned');\n} else {\n  current.setValue('assigned_to', gs.getUserID());\n  current.setValue('state', 2);\n  current.update();\n}",
      explain: 'gs.getUserID() = ippudu login ayina user sys_id.',
      tests: [
        { label: 'assigned_to = me', expr: "current.getValue('assigned_to')", expect: 'u_admin' },
        { label: 'state 2', expr: "current.getValue('state')", expect: '2' },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 (Reopen) ----
    jx('cs-ua1', 5, 'Reopen cheyyocha? (|| condition)', 'medium+', {
      server: true,
      task: 'canReopen(current) function rayi: state "6" (Resolved) leda "7" (Closed) ayithe true, lekapothe false return chey. (Reopen button ki idi condition laaga.) 🧰 Vaade words: current, getValue(), ||',
      starter: "function canReopen(current) {\n  // Step 1: state teesuko (getValue string istundi)\n  // Step 2: state '6' leda '7' aa? ani || tho check chesi return chey\n  return false;\n}",
      hint: [
        'Rendu states lo edaina okati ayithe chaalu — ante OR (||). getValue string istundi, kabatti quotes tho compare chey.',
        "var s = current.getValue('state');   return s == '6' || <inkoka check>;",
        "function canReopen(current) { var s = current.getValue('state'); return s == '6' || s == '7'; }",
      ],
      solution: "function canReopen(current) {\n  var s = current.getValue('state');\n  return s == '6' || s == '7';\n}",
      explain: '|| = "leda": okka side true ayina result true. INC0010005 Resolved (6) kabatti true, INC0010001 In Progress (2) kabatti false.',
      tests: [{ label: 'INC5 (Resolved) true, INC1 (In Progress) false', expr: COND('canReopen', ['INC0010005', 'INC0010001']), expect: [true, false] }],
    }),
    jx('cs-ua1', 6, 'Reopen: rendu fields + update', 'medium+', {
      server: true,
      scenario: CUR({ state: '7', active: 'false' }),
      task: 'Ee incident Closed (state 7, active false). Reopen chey: state = 2, active = true set chesi current.update() chey. Tarvata gs.info("Reopened " + number) log chey. (Guard inka vaddu — next exercise lo.) 🧰 Vaade words: current, setValue(), update(), getValue(), gs.info',
      starter: '// Step 1: state ni 2 ki set chey\n// Step 2: active ni true ki set chey\n// Step 3: save chey\n// Step 4: "Reopened " + number log chey\n',
      hint: [
        'Rendu fields marchali, tarvata okkasari save, last lo log. Number kosam current nunchi malli getValue.',
        "current.setValue('state', 2);   current.setValue('active', true);   — tarvata update().",
        "current.setValue('state', 2); current.setValue('active', true); current.update(); gs.info('Reopened ' + current.getValue('number'));",
      ],
      solution: "current.setValue('state', 2);\ncurrent.setValue('active', true);\ncurrent.update();\ngs.info('Reopened ' + current.getValue('number'));",
      explain: 'Okate update() tho rendu field changes save avtayi — prathi setValue tarvata update() avasaram ledu.',
      tests: [
        { label: 'state 2, active true', expr: "[current.getValue('state'), current.getValue('active')]", expect: ['2', 'true'] },
        { label: 'log', logs: ['Reopened INC0010001'] },
      ],
    }),
    jx('cs-ua1', 7, 'Reopen message (if / else)', 'medium+', {
      server: true,
      task: 'reopenMsg(current) function rayi: state "6" leda "7" ayithe "Reopen OK" return chey, lekapothe "Cannot reopen" return chey. (Exercise 4 lo ide if/else lo nijamga reopen chestam.) 🧰 Vaade words: current, getValue(), ||, if / else',
      starter: "function reopenMsg(current) {\n  // if (state 6 leda 7) → 'Reopen OK', lekapothe → 'Cannot reopen'\n  return '';\n}",
      hint: [
        'Exercise 5 lo rasina condition ne if lo pettu. True side oka text, else side inkoka text return.',
        "var s = current.getValue('state');   if (s == '6' || s == '7') { return ...; }   return ...;",
        "var s = current.getValue('state'); if (s == '6' || s == '7') { return 'Reopen OK'; } return 'Cannot reopen';",
      ],
      solution: "function reopenMsg(current) {\n  var s = current.getValue('state');\n  if (s == '6' || s == '7') {\n    return 'Reopen OK';\n  }\n  return 'Cannot reopen';\n}",
      explain: 'Rendu branches test avtayi: INC5 (Resolved) → Reopen OK, INC1 (In Progress) → Cannot reopen. if lo return ayithe kinda line run avvadu.',
      tests: [{ label: 'INC5 → Reopen OK, INC1 → Cannot reopen', expr: COND('reopenMsg', ['INC0010005', 'INC0010001']), expect: ['Reopen OK', 'Cannot reopen'] }],
    }),
    jx('cs-ua1', 4, 'Reopen (guarded)', 'hard', {
      server: true,
      scenario: CUR({ state: '7', active: 'false' }),
      task: 'Reopen UI Action rayi: state 6 leda 7 ayithe matrame — state = 2, active = true set chesi update() chey, gs.info("Reopened INC...") (number tho). Vere state ayithe gs.info("Cannot reopen") matrame.',
      starter: '// UI Action: Reopen (server)\n// TODO',
      hint: [
        'Exercises 5–7 kalipi: || condition, if lo rendu fields + update + log, else lo "Cannot reopen" log.',
        "var s = current.getValue('state');   if (s == '6' || s == '7') { setValue x2; update(); gs.info(...) } else { gs.info('Cannot reopen'); }",
        "var s = current.getValue('state'); if (s == '6' || s == '7') { current.setValue('state', 2); current.setValue('active', true); current.update(); gs.info('Reopened ' + current.getValue('number')); } else { gs.info('Cannot reopen'); }",
      ],
      solution: "var s = current.getValue('state');\nif (s == '6' || s == '7') {\n  current.setValue('state', 2);\n  current.setValue('active', true);\n  current.update();\n  gs.info('Reopened ' + current.getValue('number'));\n} else {\n  gs.info('Cannot reopen');\n}",
      explain: 'Guard conditions script lo kuda pettali (Condition field ki additional).',
      tests: [
        { label: 'state 2, active true', expr: "[current.getValue('state'), current.getValue('active')]", expect: ['2', 'true'] },
        { label: 'log', logs: ['Reopened INC0010001'] },
      ],
    }),
  ],
}

/* 19 — UI Actions part 2 (client) */
const ua2 = {
  id: 'cs-ua2',
  title: 'UI Actions — Part 2 (client-side)',
  video: 'UI Actions part 2',
  duration: '',
  no: 19,
  blurb: 'Client checkbox tick, Onclick function, g_form tho browser lo run, confirm.',
  scratch: {
    starter: "function markP1() {\n  g_form.setValue('priority', '1');\n  g_form.addInfoMessage('Priority set to 1');\n}",
    scenario: { form: { values: { priority: '3' } } },
    client: CALL('markP1'),
  },
  learn: [
    {
      h: '🖱️ Client UI Action',
      body: [
        'Client checkbox tick chesthe script browser lo run avtundi — g_form, g_user vaadochu, server ki velladu. Onclick field lo function peru rayali (e.g. markP1()), script lo aa function define cheyyali.',
        'Use cases: confirm dialogs, form values marchadam (save cheyyakunda), validation.',
        'Client UI Action lo current / gs levu (server only).',
      ],
      code: `// Client = true,  Onclick: markP1()
function markP1() {
  g_form.setValue('priority', '1');
  g_form.addInfoMessage('Priority set to 1');
}`,
    },
    {
      h: '📨 gsftSubmit — server ki submit',
      body: [
        'Client code tarvata server ki velli save cheyyali ante: gsftSubmit(null, g_form.getFormElement(), "action_name"). action_name = UI Action yokka "Action name" field value.',
        'Idi aa UI Action ni server side malli run chestundi (next lesson lo).',
        '⚠️ gsftSubmit exact pattern memory nunchi rasanu — nee PDI lo oka UI Action example tho confirm chesuko.',
      ],
      code: `function resolveIt() {
  if (!confirm('Resolve incident?')) return;
  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');
}`,
    },
  ],
  quiz: [
    q('Client UI Action lo vaadochu?', ['g_form', 'current', 'gs.update', 'GlideRecord server'], 0, 'g_form (client API).'),
    q('Onclick field lo emi rastam?', ['Function peru (markP1())', 'Table peru', 'Role peru', 'Pedda script'], 0, 'Script lo define chesina function pilustam.'),
    q('Client script nunchi server UI Action run cheyyadaniki?', ['gsftSubmit(...)', 'gs.run()', 'g_form.run()', 'GlideAjax matrame'], 0, 'gsftSubmit(null, g_form.getFormElement(), actionName).'),
    q('Client UI Action lo current vaadochaa?', ['Avunu', 'Ledu', 'Admin ki', 'Mobile lo'], 1, 'current server only.'),
    q('Confirm mundu adagadaniki?', ['confirm()', 'prompt()', 'gs.confirm', 'g_form.confirm'], 0, 'confirm() browser dialog lo OK/Cancel istundi — true/false return chestundi, adi check chesi continue avvachu.'),
  ],
  exercises: [
    jx('cs-ua2', 1, 'Mark P1', 'easy', {
      scenario: { form: { values: { priority: '3' } } },
      client: CALL('markP1'),
      task: 'markP1() function rayi: priority "1" ki set chey, "Priority set to 1" ani info message chupinchu.',
      starter: 'function markP1() {\n  // TODO\n}',
      hint: "g_form.setValue('priority', '1'); g_form.addInfoMessage('Priority set to 1');",
      solution: "function markP1() {\n  g_form.setValue('priority', '1');\n  g_form.addInfoMessage('Priority set to 1');\n}",
      explain: 'Client UI Action = button click → function.',
      tests: [
        { label: 'priority 1', expr: "g_form.getValue('priority')", expect: '1' },
        { label: 'message', expr: MSGS, expect: ['Priority set to 1'] },
      ],
    }),
    jx('cs-ua2', 2, 'Clear assignment', 'easy', {
      scenario: { form: { values: { assignment_group: 'g_net', assigned_to: 'u_admin' } } },
      client: CALL('clearAssignment'),
      task: 'clearAssignment() rayi: assignment_group mariyu assigned_to rendu clear chey.',
      starter: 'function clearAssignment() {\n  // TODO\n}',
      hint: "g_form.clearValue('assignment_group'); g_form.clearValue('assigned_to');",
      solution: "function clearAssignment() {\n  g_form.clearValue('assignment_group');\n  g_form.clearValue('assigned_to');\n}",
      explain: 'Form lo values marchindi — user Save nokkite matrame DB lo marutundi.',
      tests: [{ label: 'rendu empty', expr: "[g_form.getValue('assignment_group'), g_form.getValue('assigned_to')]", expect: ['', ''] }],
    }),
    jx('cs-ua2', 3, 'Validate tarvata submit', 'medium', {
      scenario: { form: { values: { short_description: 'VPN down' } } },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: short_description empty ayithe addErrorMessage("Short description kavali") chupinchi return. Lekapothe gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu.',
      starter: 'function resolveIt() {\n  // TODO\n}',
      hint: [
        'Mundu check, tarvata submit. Empty ayithe error chupinchi akkade return — appudu kinda unna submit line run avvadu.',
        "if (g_form.getValue('short_description') == '') { ...error...; return; }   tarvata gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
        "if (g_form.getValue('short_description') == '') { g_form.addErrorMessage('Short description kavali'); return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: "function resolveIt() {\n  if (g_form.getValue('short_description') == '') {\n    g_form.addErrorMessage('Short description kavali');\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n}",
      explain: 'Client lo validate chesi, OK ayithe matrame server ki submit.',
      tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 (confirm → submit) ----
    jx('cs-ua2', 5, 'confirm() answer chudu', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: true },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") adigi, vachina answer ni ok variable lo pettu. Tarvata g_form.addInfoMessage("Answer: " + ok) chupinchu. (Ikkada user OK nokkindi.) 🧰 Vaade words: confirm(), g_form.addInfoMessage()',
      starter: "function resolveIt() {\n  // Step 1: var ok = confirm(...)   — OK = true, Cancel = false\n  // Step 2: 'Answer: ' + ok ani info message chupinchu\n}",
      hint: [
        'confirm() oka value return chestundi — OK ki true, Cancel ki false. Adi variable lo pettukoni message lo chupinchu.',
        "var ok = confirm('Resolve incident?');   tarvata g_form.addInfoMessage(...)",
        "var ok = confirm('Resolve incident?'); g_form.addInfoMessage('Answer: ' + ok);",
      ],
      solution: "function resolveIt() {\n  var ok = confirm('Resolve incident?');\n  g_form.addInfoMessage('Answer: ' + ok);\n}",
      explain: 'confirm() browser dialog — user click chese varaku code aagutundi, tarvata true / false istundi. Ee practice lo answer scenario lo fix chesamu (OK).',
      tests: [
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
        { label: 'message', expr: MSGS, expect: ['Answer: true'] },
      ],
    }),
    jx('cs-ua2', 6, 'Cancel ayithe aagu (! + return)', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down', state: '2' } }, confirmAnswer: false },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") false ayithe (Cancel) g_form.addInfoMessage("Cancelled") chupinchi return. Lekapothe g_form.setValue("state", "6"). (Ikkada user Cancel nokkindi — state marakudadu.) 🧰 Vaade words: confirm(), ! (not), return, g_form.setValue()',
      starter: "function resolveIt() {\n  // if (Cancel nokkite) { 'Cancelled' message; return; }\n  // state ni '6' ki set chey\n}",
      hint: [
        'Cancel ante confirm() false istundi. "false ayithe" ani check cheyyadaniki ! (not) mundu pettu, akkade return.',
        "if (!confirm('Resolve incident?')) { ...message...; return; }   tarvata g_form.setValue('state', '6');",
        "if (!confirm('Resolve incident?')) { g_form.addInfoMessage('Cancelled'); return; } g_form.setValue('state', '6');",
      ],
      solution: "function resolveIt() {\n  if (!confirm('Resolve incident?')) {\n    g_form.addInfoMessage('Cancelled');\n    return;\n  }\n  g_form.setValue('state', '6');\n}",
      explain: '!confirm(...) = "user Cancel nokkite". Early return tho kinda unna code skip avtundi — state 2 laage undi.',
      tests: [
        { label: 'state marchaledu (2)', expr: "g_form.getValue('state')", expect: '2' },
        { label: 'Cancelled message', expr: MSGS, expect: ['Cancelled'] },
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
      ],
    }),
    jx('cs-ua2', 7, 'OK ayithe gsftSubmit', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: true },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") OK ayithe gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu. (Ikkada user OK nokkindi. Exercise 4 lo Cancel side chustam.) 🧰 Vaade words: confirm(), gsftSubmit, g_form.getFormElement()',
      starter: "function resolveIt() {\n  // confirm OK ayithe → server ki submit (action name: resolve_incident)\n}",
      hint: [
        'confirm() true ayithe matrame submit. gsftSubmit ki 3 parameters: null, form element, action name.',
        "if (confirm('Resolve incident?')) { gsftSubmit(null, <form element>, 'resolve_incident'); }",
        "if (confirm('Resolve incident?')) { gsftSubmit(null, g_form.getFormElement(), 'resolve_incident'); }",
      ],
      solution: "function resolveIt() {\n  if (confirm('Resolve incident?')) {\n    gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n  }\n}",
      explain: 'Action name ("resolve_incident") UI Action record lo unna Action name tho exact match avvali. ⚠️ gsftSubmit exact pattern memory nunchi — nee PDI lo oka UI Action example tho confirm chesuko.',
      tests: [
        { label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' },
        { label: 'confirm tarvata submit', logs: ['Resolve incident?', '[gsftSubmit: resolve_incident]'] },
      ],
    }),
    jx('cs-ua2', 4, 'Confirm tarvata submit', 'hard', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: false },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") adugu. User Cancel nokkite emi cheyyaku (submit cheyyakudadu). OK ayithe gsftSubmit(..., "resolve_incident"). (Ikkada user Cancel nokkindi anukundam.)',
      starter: 'function resolveIt() {\n  // TODO\n}',
      hint: [
        'Exercises 6 + 7 kalipi: Cancel ayithe early return, lekapothe submit.',
        "if (!confirm('Resolve incident?')) { return; }   tarvata gsftSubmit(null, ..., ...);",
        "if (!confirm('Resolve incident?')) { return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: "function resolveIt() {\n  if (!confirm('Resolve incident?')) {\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n}",
      explain: 'Early return pattern again.',
      tests: [
        { label: 'submit avvaledu', expr: '__x.submitted', expect: null },
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
      ],
    }),
  ],
}

/* 20 — UI Actions part 3 (client + server) */
const HYBRID_START = `// Client = true, Onclick: resolveIncident()
function resolveIncident() {
  // CLIENT part
  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');
}

// SERVER part — gsftSubmit valla script malli server lo run avtundi
if (typeof window == 'undefined') {
  serverResolve();
}

function serverResolve() {
  // TODO
}`
const HYBRID_IF = "if (typeof window == 'undefined') {\n  serverResolve();\n}"
const HYBRID_FILLED = HYBRID_START.replace('  // TODO', "  current.setValue('state', 6);\n  current.update();")
const ua3 = {
  id: 'cs-ua3',
  title: 'UI Actions — Part 3 (client + server together)',
  video: 'UI Actions part 3',
  duration: '',
  no: 20,
  blurb: 'Oke UI Action lo client + server: gsftSubmit, typeof window == "undefined" pattern.',
  learn: [
    {
      h: '🤝 Client + Server oke UI Action lo',
      body: [
        'Pattern: 1) Client tick, Onclick = resolveIncident(). 2) Client function lo validation/confirm cheyyi. 3) gsftSubmit(null, g_form.getFormElement(), "resolve_incident") tho submit — idi aa UI Action ne server lo malli run chestundi.',
        '4) Server lo script lo kinda unna if (typeof window == "undefined") { serverResolve(); } run avtundi — ante "browser lo kaadu, server lo unnam" ani check. Server function lo current vaadatam.',
        'Action name field = "resolve_incident" (gsftSubmit lo ichina peru tho exact match avvali).',
      ],
      code: `function resolveIncident() {
  if (!confirm('Resolve?')) return;
  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');
}

// Server side
if (typeof window == 'undefined') {
  serverResolve();
}

function serverResolve() {
  current.state = 6;
  current.update();
  action.setRedirectURL(current);
}`,
    },
    {
      h: '🧪 Ee site lo test chesedi',
      body: [
        'Client part exercises browser sandbox lo (g_form, gsftSubmit available). Server part exercises server sandbox lo (window ledu → typeof window == "undefined" true).',
        '⚠️ Ee pattern exact ga nee PDI lo (e.g. out-of-box "Resolve" UI Actions chudu) confirm chesuko — memory nunchi rasanu.',
      ],
    },
  ],
  quiz: [
    q('gsftSubmit(null, g_form.getFormElement(), "x") em chestundi?', ['Client script ni aapestundi', 'Server lo "x" UI Action ni run chestundi', 'Page ni reload matrame chestundi', 'Alert chupistundi'], 1, 'Server side script run avtundi.'),
    q('typeof window == "undefined" enduku?', ['Server lo unnama check', 'Browser check', 'Security', 'Speed'], 0, 'Server lo window ledu → true.'),
    q('Action name enduku match avvali?', ['gsftSubmit lo ichina peru tho exact', 'Optional, match avvakapoyina parledu', 'Table peru tho match avvali', 'Role peru tho match avvali'], 0, 'Exact match lekapothe server part run avvadu.'),
    q('Server function lo vaadochu?', ['current, gs', 'g_form', 'g_user', 'alert'], 0, 'Server function lo current, gs vaadochu — g_form, g_user client APIs kabatti vaadalem.'),
    q('Client function lo validation ekkada pettali?', ['gsftSubmit mundu', 'gsftSubmit tarvata', 'Server lo matrame', 'Emi vaddu'], 0, 'Client validation gsftSubmit mundu cheyyali — tarvata server ki velli pothundi, appudu aapalem.'),
  ],
  exercises: [
    jx('cs-ua3', 1, 'Client part: submit', 'easy', {
      scenario: { form: { values: {} } },
      client: CALL('resolveIncident'),
      task: 'Client function resolveIncident() lo gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu. (Kinda server part already undi — typeof window check client lo skip avtundi.)',
      starter: HYBRID_START.replace("  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');", '  // TODO'),
      hint: "gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      solution: HYBRID_START,
      explain: 'Browser lo window undi kabatti serverResolve() skip avtundi; gsftSubmit server ki submit chestundi.',
      tests: [{ label: 'submitted', expr: '__x.submitted', expect: 'resolve_incident' }],
    }),
    jx('cs-ua3', 2, 'Server part: resolve', 'easy', {
      server: true,
      scenario: CUR({ state: '2' }),
      task: 'Full hybrid script server lo run avtundi (window ledu → serverResolve() pilustundi). serverResolve() lo: current.state = 6, update(), action.setRedirectURL(current).',
      starter: HYBRID_START,
      hint: "current.setValue('state', 6); current.update(); action.setRedirectURL(current);",
      solution: HYBRID_START.replace('  // TODO', "  current.setValue('state', 6);\n  current.update();\n  action.setRedirectURL(current);"),
      explain: 'Server lo typeof window == "undefined" true — anduke serverResolve() run ayindi. Client function (resolveIncident) pilavabadadu.',
      tests: [{ label: 'state 6', expr: "current.getValue('state')", expect: '6' }],
    }),
    jx('cs-ua3', 3, 'Client: description mandatory', 'medium', {
      scenario: { form: { values: { description: '' } } },
      client: CALL('resolveIncident'),
      task: 'resolveIncident() lo: description empty ayithe addErrorMessage("Resolution notes kavali") chupinchi return (submit cheyyakudadu). Lekapothe gsftSubmit(..., "resolve_incident").',
      starter: HYBRID_START.replace("  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');", '  // TODO'),
      hint: [
        'Client function lo gsftSubmit MUNDU check pettu. Empty ayithe error + return — appudu server ki vellakunda aagutundi.',
        "if (g_form.getValue('description') == '') { g_form.addErrorMessage(...); return; }   tarvata gsftSubmit line.",
        "if (g_form.getValue('description') == '') { g_form.addErrorMessage('Resolution notes kavali'); return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: HYBRID_START.replace("  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');", "  if (g_form.getValue('description') == '') {\n    g_form.addErrorMessage('Resolution notes kavali');\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');"),
      explain: 'Server ki velle mundu client lo validate cheste round trip save avtundi.',
      tests: [
        { label: 'submit avvaledu', expr: '__x.submitted', expect: null },
        { label: 'error', expr: MSGS, expect: ['Resolution notes kavali'] },
      ],
    }),
    // ---- Medium+ ladder (server part): one new idea at a time, building up to exercise 4 ----
    jx('cs-ua3', 5, 'Server check: typeof window', 'medium+', {
      server: true,
      scenario: CUR({ state: '2' }),
      task: 'Ee script lo serverResolve() already rasi undi (state 6 + update), kani evaru pilavatledu. "Server lo unnama?" check (typeof window == "undefined") rasi, true ayithe serverResolve() pilu. Server lo window ledu kabatti idi run avvali. 🧰 Vaade words: typeof, gsftSubmit, current, update()',
      starter: HYBRID_FILLED.replace(HYBRID_IF, '// TODO: window ledu (server) ayithe serverResolve() pilu'),
      hint: [
        'Browser lo window object untundi, server lo undadu. typeof tho "undefined" aa ani check chesi serverResolve() pilu.',
        "if (typeof window == 'undefined') { ... }",
        "if (typeof window == 'undefined') { serverResolve(); }",
      ],
      solution: HYBRID_FILLED,
      explain: 'Oke script rendu chotla run avtundi: browser lo (window undi → if skip, Onclick function run) mariyu gsftSubmit tarvata server lo (window ledu → serverResolve()). ⚠️ Ee pattern nee PDI lo out-of-box UI Actions lo confirm chesuko.',
      tests: [{ label: 'serverResolve run ayindi (state 6)', expr: "current.getValue('state')", expect: '6' }],
    }),
    jx('cs-ua3', 6, 'Server: "Resolved by" user name', 'medium+', {
      server: true,
      scenario: CUR({ state: '2', description: '' }),
      task: 'serverResolve() lo: description = "Resolved by " + gs.getUserName() set chesi current.update() chey. (Practice lo login user "admin".) 🧰 Vaade words: gs.getUserName, setValue(), update()',
      starter: HYBRID_START.replace('  // TODO', "  // Step 1: description = 'Resolved by ' + login user name\n  // Step 2: save chey"),
      hint: [
        'Server lo login user peru gs nunchi vastundi (g_user kaadu — adi client). Text + user name join chesi description lo pettu.',
        "current.setValue('description', 'Resolved by ' + gs.getUserName());   tarvata save.",
        "current.setValue('description', 'Resolved by ' + gs.getUserName()); current.update();",
      ],
      solution: HYBRID_START.replace('  // TODO', "  current.setValue('description', 'Resolved by ' + gs.getUserName());\n  current.update();"),
      explain: 'gs.getUserName() = login user yokka user_name (ikkada "admin"). Server part lo g_user ledu — gs vaadali.',
      tests: [{ label: 'description', expr: "current.getValue('description')", expect: 'Resolved by admin' }],
    }),
    jx('cs-ua3', 7, 'Server: already closed ayithe return', 'medium+', {
      server: true,
      scenario: CUR({ state: '7' }),
      task: 'serverResolve() lo: state "7" (Closed) ayithe gs.info("Already closed") chesi return. Lekapothe state = 6, update(). (Ikkada incident already Closed — state 7 laage undali.) 🧰 Vaade words: getValue(), gs.info, return',
      starter: HYBRID_START.replace('  // TODO', '  // guard: Closed ayithe log + return\n  // tarvata state 6 + save'),
      hint: [
        'Function mundu guard pettu: Closed ayithe log chesi akkade return — kinda unna resolve code run avvakudadu.',
        "if (current.getValue('state') == '7') { gs.info(...); return; }   tarvata setValue('state', 6) + update().",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); return; } current.setValue('state', 6); current.update();",
      ],
      solution: HYBRID_START.replace('  // TODO', "  if (current.getValue('state') == '7') {\n    gs.info('Already closed');\n    return;\n  }\n  current.setValue('state', 6);\n  current.update();"),
      explain: 'Closed incident ni malli Resolved cheyyakudadu. return function ni akkade aapestundi.',
      tests: [
        { label: 'state 7 laage undi', expr: "current.getValue('state')", expect: '7' },
        { label: 'log', logs: ['Already closed'] },
      ],
    }),
    jx('cs-ua3', 4, 'Server: resolved by', 'hard', {
      server: true,
      scenario: CUR({ state: '2', description: '' }),
      task: 'serverResolve() lo: state already 7 (Closed) ayithe gs.info("Already closed") chesi return. Lekapothe state = 6, description = "Resolved by " + gs.getUserName(), update(), action.setRedirectURL(current).',
      starter: HYBRID_START,
      hint: [
        'Exercises 6 + 7 kalipi: mundu Closed guard, tarvata state + description set, save, last lo redirect.',
        "if (state == '7') { gs.info(...); return; }   current.setValue('state', 6);   current.setValue('description', 'Resolved by ' + gs.getUserName());   update();   action.setRedirectURL(current);",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); return; } current.setValue('state', 6); current.setValue('description', 'Resolved by ' + gs.getUserName()); current.update(); action.setRedirectURL(current);",
      ],
      solution: HYBRID_START.replace('  // TODO', "  if (current.getValue('state') == '7') {\n    gs.info('Already closed');\n    return;\n  }\n  current.setValue('state', 6);\n  current.setValue('description', 'Resolved by ' + gs.getUserName());\n  current.update();\n  action.setRedirectURL(current);"),
      explain: 'gs.getUserName() = login user_name (admin).',
      tests: [
        { label: 'state 6', expr: "current.getValue('state')", expect: '6' },
        { label: 'description', expr: "current.getValue('description')", expect: 'Resolved by admin' },
      ],
    }),
  ],
}

/* 21 — UI Actions part 4 (conditions) */
const ua4 = {
  id: 'cs-ua4',
  title: 'UI Actions — Part 4 (conditions & options)',
  video: 'UI Actions part 4',
  duration: '',
  no: 21,
  blurb: 'Button eppudu kanipinchali: Condition, roles, order, hint, form link vs context menu.',
  learn: [
    {
      h: '🎛️ Condition field',
      body: [
        'Condition = JavaScript expression (script kaadu, oka line) — true ayithe matrame button kanipistundi. e.g. current.active == true && current.state != 6.',
        'Roles field: e.g. itil — aa role unnavaarike button. Condition lo gs.hasRole("itil") kuda rayochu.',
        'Condition server lo evaluate avtundi (form load time), kabatti g_form ledu. Form lo values marchina tarvata condition re-evaluate avvadu (page reload / save varaku).',
      ],
      code: `current.active == true && current.state != 6
gs.hasRole('itil') && current.state < 6
current.priority == 1 && current.assigned_to.nil()`,
    },
    {
      h: '🧩 Options',
      body: [
        'Form button (button), Form context menu (right-click header), Form link (related links), Order (button order), Hint (hover tooltip), Active. List: List banner button, List choice, List context menu (next lesson).',
        'Show insert / Show update — new record form lo kanipinchala, existing record lo kanipinchala.',
      ],
    },
  ],
  quiz: [
    q('Condition lo emi rastam?', ['Oka JavaScript expression (true/false)', 'Pedda multi-line script', 'SQL query', 'Table peru'], 0, 'One-line expression.'),
    q('Condition ekkada evaluate avtundi?', ['Server lo, form load time', 'Browser lo live ga prathi click ki', 'Email lo', 'List lo'], 0, 'Server lo form load time lo.'),
    q('Role unnavaalake button chupinchali?', ['Roles field leda gs.hasRole condition', 'Order field set cheyyadam', 'Hint field rayadam', 'Client checkbox tick cheyyadam'], 0, 'Roles field / condition.'),
    q('Existing record lo matrame button?', ['Show update tick, Show insert untick', 'Show insert tick, Show update untick', 'Client tick cheyyadam', 'Order 0 pettadam'], 0, 'Show insert/update options.'),
    q('Condition lo g_form vaadochaa?', ['Avunu, ellappudu vaadochu', 'Ledu — server expression', 'Konni sarlu matrame', 'Admin ki matrame'], 1, 'Condition server side.'),
  ],
  exercises: [
    jx('cs-ua4', 1, 'Resolve button condition', 'easy', {
      server: true,
      task: 'canShow(current) function rayi: incident ACTIVE ayithe mariyu state 6 kakapothe matrame true return chey. (Condition: current.active == true && current.state != 6.)',
      starter: 'function canShow(current) {\n  // TODO\n  return false;\n}',
      hint: "return current.getValue('active') == 'true' && current.getValue('state') != '6';",
      solution: "function canShow(current) {\n  return current.getValue('active') == 'true' && current.getValue('state') != '6';\n}",
      explain: 'Condition lo true ayithe button kanipistundi. Mock lo getValue strings.',
      tests: [{ label: 'INC1 true, INC5 (resolved) false', expr: COND('canShow', ['INC0010001', 'INC0010005']), expect: [true, false] }],
    }),
    jx('cs-ua4', 2, 'Unassigned P1', 'easy', {
      server: true,
      task: 'canShow(current) rayi: priority "1" mariyu assigned_to empty ayithe true ("Take ownership" button kosam).',
      starter: 'function canShow(current) {\n  // TODO\n  return false;\n}',
      hint: "return current.getValue('priority') == '1' && current.getValue('assigned_to') == '';",
      solution: "function canShow(current) {\n  return current.getValue('priority') == '1' && current.getValue('assigned_to') == '';\n}",
      explain: 'INC2 P1 + unassigned. INC8 P1 kani assigned undi.',
      tests: [{ label: 'INC2 true, INC8 false, INC1 false', expr: COND('canShow', ['INC0010002', 'INC0010008', 'INC0010001']), expect: [true, false, false] }],
    }),
    jx('cs-ua4', 3, 'Role + state', 'medium', {
      server: true,
      task: 'canShow(current) rayi: gs.hasRole("itil") true mariyu state 6 kante takkuva (Number() tho) ayithe true.',
      starter: 'function canShow(current) {\n  // TODO\n  return false;\n}',
      hint: [
        'Rendu conditions: role undi AND state 6 kante chinnadi. Rendu true ayithe matrame true — && vaadu.',
        "Role check gs nunchi: gs.hasRole('itil').   State: getValue string kabatti Number() tho marchi < 6 compare chey.",
        "function canShow(current) { return gs.hasRole('itil') && Number(current.getValue('state')) < 6; }",
      ],
      solution: "function canShow(current) {\n  return gs.hasRole('itil') && Number(current.getValue('state')) < 6;\n}",
      explain: 'Role + state combine. (Mock lo user ki itil role undi.)',
      tests: [{ label: 'INC1 true, INC5 false, INC3 true', expr: COND('canShow', ['INC0010001', 'INC0010005', 'INC0010003']), expect: [true, false, true] }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 (Close script) ----
    jx('cs-ua4', 5, 'Close button condition (Resolved matrame)', 'medium+', {
      server: true,
      task: 'canShow(current) rayi — "Close" button Resolved (state "6") incidents ki matrame kanipinchali. state "6" ayithe true, lekapothe false. 🧰 Vaade words: current, getValue(), ==',
      starter: "function canShow(current) {\n  // Step 1: state teesuko\n  // Step 2: '6' aa? ani check chesi return chey\n  return false;\n}",
      hint: [
        'Okate condition: state Resolved aa? getValue string istundi kabatti "6" (quotes tho) tho compare chey.',
        "return current.getValue('state') == <Resolved value>;",
        "function canShow(current) { return current.getValue('state') == '6'; }",
      ],
      solution: "function canShow(current) {\n  return current.getValue('state') == '6';\n}",
      explain: 'UI Action Condition field lo idi current.state == 6 laaga rastaru. INC0010005 Resolved → true, INC0010001 In Progress → false.',
      tests: [{ label: 'INC5 true, INC1 false', expr: COND('canShow', ['INC0010005', 'INC0010001']), expect: [true, false] }],
    }),
    jx('cs-ua4', 6, 'Close script (guard lekunda)', 'medium+', {
      server: true,
      scenario: CUR({ number: 'INC0010001', state: '6' }),
      task: 'Close UI Action script rayi (incident Resolved, state 6): state = 7 set chesi current.update() chey, tarvata gs.info("Closed " + number) log chey. 🧰 Vaade words: current, setValue(), update(), getValue(), gs.info',
      starter: '// Step 1: state 7 ki set chey\n// Step 2: save chey\n// Step 3: "Closed " + number log chey\n',
      hint: [
        'Moodu lines: set, save, log. Log lo number current nunchi teesuko.',
        "current.setValue('state', 7);   current.update();   tarvata gs.info('Closed ' + ...);",
        "current.setValue('state', 7); current.update(); gs.info('Closed ' + current.getValue('number'));",
      ],
      solution: "current.setValue('state', 7);\ncurrent.update();\ngs.info('Closed ' + current.getValue('number'));",
      explain: 'Server UI Action script = button click tarvata server lo run ayye code. update() lekapothe save avvadu.',
      tests: [
        { label: 'state 7', expr: "current.getValue('state')", expect: '7' },
        { label: 'log', logs: ['Closed INC0010001'] },
      ],
    }),
    jx('cs-ua4', 7, 'Already closed aa? (if / else message)', 'medium+', {
      server: true,
      task: 'closeMsg(current) function rayi: state "7" ayithe "Already closed" return chey, lekapothe "Can close" return chey. (Condition button hide chestundi, kani script lo kuda ee guard pettali — exercise 4 lo vaadatam.) 🧰 Vaade words: current, getValue(), if / else, return',
      starter: "function closeMsg(current) {\n  // state '7' → 'Already closed', lekapothe → 'Can close'\n  return '';\n}",
      hint: [
        'if lo state Closed aa ani check — true ayithe oka text, lekapothe inkoka text return.',
        "if (current.getValue('state') == '7') { return ...; }   return ...;",
        "if (current.getValue('state') == '7') { return 'Already closed'; } return 'Can close';",
      ],
      solution: "function closeMsg(current) {\n  if (current.getValue('state') == '7') {\n    return 'Already closed';\n  }\n  return 'Can close';\n}",
      explain: 'Rendu branches test avtayi (state 2 → Can close, state 7 → Already closed). Button hide ayina URL tho direct ga pilavochu — anduke script lo guard.',
      tests: [{ label: 'state 2 → Can close, state 7 → Already closed', expr: "['2', '7'].map(function (s) { var g = new GlideRecord('incident'); g.get('number', 'INC0010001'); g.setValue('state', s); return closeMsg(g); })", expect: ['Can close', 'Already closed'] }],
    }),
    jx('cs-ua4', 4, 'Close action script', 'hard', {
      server: true,
      scenario: CUR({ number: 'INC0010001', state: '2' }),
      task: 'Close UI Action script rayi: state already "7" ayithe gs.info("Already closed") chesi return. Lekapothe state = 7, update(), gs.info("Closed " + number).',
      starter: '// UI Action: Close (server)\n// TODO',
      hint: [
        'Exercises 6 + 7 kalipi: if lo Closed check (log), else lo set + save + log.',
        "if (current.getValue('state') == '7') { gs.info('Already closed'); } else { setValue('state', 7); update(); gs.info('Closed ' + ...); }",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); } else { current.setValue('state', 7); current.update(); gs.info('Closed ' + current.getValue('number')); }",
      ],
      solution: "if (current.getValue('state') == '7') {\n  gs.info('Already closed');\n} else {\n  current.setValue('state', 7);\n  current.update();\n  gs.info('Closed ' + current.getValue('number'));\n}",
      explain: 'Condition hide chestundi kani script lo kuda guard pettadam safe (URL tho direct ga pilavochu).',
      tests: [
        { label: 'state 7', expr: "current.getValue('state')", expect: '7' },
        { label: 'log', logs: ['Closed INC0010001'] },
      ],
    }),
  ],
}

/* 22 — UI Actions on table list */
const ua5 = {
  id: 'cs-ua5',
  title: 'UI Actions on the Table List',
  video: 'UI Actions on Table List',
  duration: '',
  no: 22,
  blurb: 'List banner button, list choice, context menu — select chesina records meeda action.',
  learn: [
    {
      h: '📃 List UI Actions',
      body: [
        'List lo 3 types: List banner button (list paina button), List choice ("Actions on selected rows" dropdown), List context menu (row right-click). Same UI Action record lo checkbox tho enable chestam.',
        'List choice / context menu server script lo current = prathi selected record (script prathi row ki oka sari run avtundi anukuntunna). ⚠️ Memory nunchi — nee PDI lo test chesi confirm chesuko.',
        'List banner button (client) lo g_list.getChecked() vaadi selected ids teesukovachu; server ki ela pampalo (gsftSubmit leda GlideAjax) nee PDI lo confirm chesuko. Server lo ids tho GlideRecord sys_id IN query vaadatam.',
      ],
      code: `// Server: selectedIds = 'id1,id2' (ee site lo already ivvabadindi — real lo ela vastayo PDI lo confirm chesuko)
var gr = new GlideRecord('incident');
gr.addQuery('sys_id', 'IN', selectedIds);
gr.query();
while (gr.next()) {
  gr.setValue('state', 2);
  gr.update();
}`,
    },
  ],
  quiz: [
    q('List lo selected rows ki action cheyyadaniki?', ['List choice / List banner button UI Action', 'Business Rule tho', 'Update Set tho', 'Dictionary entry tho'], 0, 'List choice leda banner button.'),
    q('Selected sys_ids ni query lo ela vaadatam?', ['addQuery("sys_id", "IN", ids)', 'addQuery("ids")', 'get(ids)', 'IN ledu'], 0, 'sys_id IN comma-separated ids.'),
    q('Client lo selected ids?', ['g_list.getChecked()', 'g_form.getChecked()', 'current.getChecked()', 'gs.getChecked()'], 0, 'g_list.getChecked().'),
    q('Bulk action mundu confirm enduku?', ['Accident ga anni marchakunda', 'Speed penchadaniki', 'Security role kosam', 'Required kaadu, avasaram ledu'], 0, 'Bulk changes risky.'),
    q('Row right-click menu option edi?', ['List context menu', 'List banner', 'Form link', 'Related list'], 0, 'List context menu.'),
  ],
  exercises: [
    jx('cs-ua5', 1, 'List choice: Set P3', 'easy', {
      server: true,
      scenario: CUR({ priority: '1' }),
      task: 'List choice UI Action script rayi (current = oka selected row): priority 3 ki set chesi update() chey.',
      starter: '// List choice: Set priority 3 (server)\n// TODO',
      hint: "current.setValue('priority', 3); current.update();",
      solution: "current.setValue('priority', 3);\ncurrent.update();",
      explain: 'Prathi selected row ki ide script run avtundi.',
      tests: [{ label: 'priority 3', expr: "current.getValue('priority')", expect: '3' }],
    }),
    jx('cs-ua5', 2, 'Banner (client): close selected', 'medium', {
      scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'] }, confirmAnswer: true },
      client: CALL('closeSelected'),
      task: 'closeSelected() rayi (list banner button, client): emi select cheyyaledu ayithe alert("Select incidents first") return; lekapothe confirm("Close selected?") OK ayithe gsftSubmit(null, g_form.getFormElement(), "close_selected") — (list lo g_form ledu kani ee practice lo untundi).',
      starter: 'function closeSelected() {\n  // TODO\n}',
      hint: [
        'Moodu steps: selected ids teesuko → emi lekapothe alert + return → confirm Cancel ayithe return → submit.',
        "var ids = g_list.getChecked();   empty ante ids == ''.   Cancel check: if (!confirm(...)) return;",
        "var ids = g_list.getChecked(); if (ids == '') { alert('Select incidents first'); return; } if (!confirm('Close selected?')) { return; } gsftSubmit(null, g_form.getFormElement(), 'close_selected');",
      ],
      solution: "function closeSelected() {\n  var ids = g_list.getChecked();\n  if (ids == '') {\n    alert('Select incidents first');\n    return;\n  }\n  if (!confirm('Close selected?')) {\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'close_selected');\n}",
      explain: 'Ee practice lo g_form.getFormElement() vaadam, kani real list lo g_form ledu — list UI Actions lo submit ela cheyyalo exact pattern naaku teliyadu. Nee PDI lo out-of-box list banner / list choice UI Actions chusi confirm chesuko. Logic same: validate → confirm → submit.',
      tests: [{ label: 'submitted close_selected', expr: '__x.submitted', expect: 'close_selected' }],
    }),
    jx('cs-ua5', 3, 'Server: set In Progress', 'medium', {
      server: true,
      task: 'Server lo: var selectedIds = "inc1,inc3,inc4"; (already ivvabadindi). GlideRecord("incident") tho sys_id IN selectedIds query chesi, prathi record state ni 2 ki set chesi update() chey. Last lo gs.info("Updated " + count) (count = update chesina records).',
      starter: "var selectedIds = 'inc1,inc3,inc4';\n// TODO",
      hint: [
        'GlideRecord tho selected ids query chey (sys_id IN), loop lo prathi record update chesi count penchu, last lo log.',
        "gr.addQuery('sys_id', 'IN', selectedIds); gr.query();   var count = 0;   while (gr.next()) { ... count++; }",
        "var gr = new GlideRecord('incident'); gr.addQuery('sys_id', 'IN', selectedIds); gr.query(); var count = 0; while (gr.next()) { gr.setValue('state', 2); gr.update(); count++; } gs.info('Updated ' + count);",
      ],
      solution: "var selectedIds = 'inc1,inc3,inc4';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gr.setValue('state', 2);\n  gr.update();\n  count++;\n}\ngs.info('Updated ' + count);",
      explain: 'sys_id IN "a,b,c" bulk query. Loop lo update.',
      tests: [
        { label: 'log', logs: ['Updated 3'] },
        { label: 'states', expr: "['INC0010001','INC0010003','INC0010004'].map(function (n) { var g = new GlideRecord('incident'); g.get('number', n); return g.getValue('state'); })", expect: ['2', '2', '2'] },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 (Skip resolved) ----
    jx('cs-ua5', 5, 'Selected records chudu (loop lo read)', 'medium+', {
      server: true,
      task: 'selectedIds = "inc1,inc3,inc5" (already ivvabadindi). sys_id IN query chesi, loop lo prathi record ki number + ": " + state log chey (e.g. "INC0010001: 2"). Emi update cheyyaku — mundu chudatam matrame. 🧰 Vaade words: GlideRecord, addQuery(), query(), next(), getValue(), gs.info',
      starter: "var selectedIds = 'inc1,inc3,inc5';\n// Step 1: GlideRecord('incident') + sys_id IN selectedIds query\n// Step 2: while loop lo number + ': ' + state log chey\n",
      hint: [
        'Exercise 3 laage query, kani loop lo update kaadu — log matrame. Prathi record ki okka gs.info.',
        "gr.addQuery('sys_id', 'IN', selectedIds); gr.query();   while (gr.next()) { gs.info(...); }",
        "var gr = new GlideRecord('incident'); gr.addQuery('sys_id', 'IN', selectedIds); gr.query(); while (gr.next()) { gs.info(gr.getValue('number') + ': ' + gr.getValue('state')); }",
      ],
      solution: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ': ' + gr.getValue('state'));\n}",
      explain: 'Bulk action mundu records ela unnayo chudatam manchi alavatu. INC0010005 already Resolved (6) — exercise 4 lo daanni skip chestam.',
      tests: [{ label: 'logs', logs: ['INC0010001: 2', 'INC0010003: 3', 'INC0010005: 6'] }],
    }),
    jx('cs-ua5', 6, 'Resolved ni skip chey (continue)', 'medium+', {
      server: true,
      task: 'selectedIds = "inc1,inc3,inc5". Loop lo state "6" ayithe continue (skip); lekapothe gs.info("Will close " + number). Inka update vaddu. 🧰 Vaade words: next(), getValue(), continue, gs.info',
      starter: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nwhile (gr.next()) {\n  // state '6' ayithe continue\n  // 'Will close ' + number log chey\n}",
      hint: [
        'continue = "ee record vadilesi next record ki vellu". Loop lopala, log line kante mundu pettu.',
        "if (gr.getValue('state') == '6') { continue; }   tarvata gs.info(...)",
        "if (gr.getValue('state') == '6') { continue; } gs.info('Will close ' + gr.getValue('number'));",
      ],
      solution: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nwhile (gr.next()) {\n  if (gr.getValue('state') == '6') {\n    continue;\n  }\n  gs.info('Will close ' + gr.getValue('number'));\n}",
      explain: 'continue tarvata unna lines aa record ki run avvavu, loop next record tho continue avtundi. INC0010005 skip ayindi.',
      tests: [{ label: 'logs', logs: ['Will close INC0010001', 'Will close INC0010003'] }],
    }),
    jx('cs-ua5', 7, 'Rendu counters', 'medium+', {
      server: true,
      task: 'selectedIds = "inc1,inc3,inc5". resolved = 0, others = 0 tho start chey. Loop lo state "6" ayithe resolved++, lekapothe others++. Last lo gs.info("Resolved " + resolved + ", others " + others). (Update vaddu — exercise 4 lo chestam.) 🧰 Vaade words: next(), getValue(), ++, if / else',
      starter: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\n// TODO: rendu counters, loop, last lo log\n",
      hint: [
        'Rendu counters loop BAYATA (mundu) 0 tho start. Loop lo if / else tho edo okati penchu. Log loop tarvata.',
        "var resolved = 0; var others = 0;   while (gr.next()) { if (state == '6') { resolved++; } else { others++; } }",
        "var resolved = 0; var others = 0; while (gr.next()) { if (gr.getValue('state') == '6') { resolved++; } else { others++; } } gs.info('Resolved ' + resolved + ', others ' + others);",
      ],
      solution: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nvar resolved = 0;\nvar others = 0;\nwhile (gr.next()) {\n  if (gr.getValue('state') == '6') {\n    resolved++;\n  } else {\n    others++;\n  }\n}\ngs.info('Resolved ' + resolved + ', others ' + others);",
      explain: 'Counters loop lopala start chesthe prathi record ki 0 avtundi — anduke bayata. Bulk action tarvata user ki summary ivvadaniki idi.',
      tests: [
        { label: 'log', logs: ['Resolved 1, others 2'] },
        { label: 'counters', expr: '[resolved, others]', expect: [1, 2] },
      ],
    }),
    jx('cs-ua5', 4, 'Skip resolved', 'hard', {
      server: true,
      task: 'selectedIds = "inc1,inc3,inc5". Records loop chesi: state "6" (Resolved) ayithe skip (skipped++), lekapothe state = 7 (Closed), update(), closed++. Last lo gs.info("Closed " + closed + ", skipped " + skipped).',
      starter: "var selectedIds = 'inc1,inc3,inc5';\n// TODO",
      hint: [
        'Exercises 6 + 7 kalipi: rendu counters, loop lo Resolved ayithe skipped++ + continue, lekapothe close + update + closed++.',
        "Query (sys_id IN) → var closed = 0, skipped = 0 → while (gr.next()) { if (state == '6') { skipped++; continue; } setValue('state', 7); update(); closed++; } → log",
        "var gr = new GlideRecord('incident'); gr.addQuery('sys_id', 'IN', selectedIds); gr.query(); var closed = 0; var skipped = 0; while (gr.next()) { if (gr.getValue('state') == '6') { skipped++; continue; } gr.setValue('state', 7); gr.update(); closed++; } gs.info('Closed ' + closed + ', skipped ' + skipped);",
      ],
      solution: "var selectedIds = 'inc1,inc3,inc5';\nvar gr = new GlideRecord('incident');\ngr.addQuery('sys_id', 'IN', selectedIds);\ngr.query();\nvar closed = 0;\nvar skipped = 0;\nwhile (gr.next()) {\n  if (gr.getValue('state') == '6') {\n    skipped++;\n    continue;\n  }\n  gr.setValue('state', 7);\n  gr.update();\n  closed++;\n}\ngs.info('Closed ' + closed + ', skipped ' + skipped);",
      explain: 'continue loop lo aa iteration skip chestundi. Bulk actions lo already-done records skip cheyyadam common.',
      tests: [{ label: 'log', logs: ['Closed 2, skipped 1'] }],
    }),
  ],
}

export const CS_LESSONS_D = [ua1, ua2, ua3, ua4, ua5]
