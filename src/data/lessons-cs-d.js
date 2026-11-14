// Stage 3 (client) lessons 18–22: UI Actions (parts 1–4) and UI Actions on the table list.
// Server-side UI Action scripts run in the Stage 2 sandbox (current, action, gs, GlideRecord); client ones in the form / list sandbox.
// `current` is a STORED practice incident: REC writes the row into the table and current IS that row (like a real UI Action),
// so current.update() really saves — tests read the table back with a FRESH GlideRecord (DB / DBS) to prove update() ran.
// Exercises are listed in the order she should do them (display order = array order). Else-branch runs are inline `variants`.
// Facts follow her Brazil PDI (scratchpad pdi-facts): getValue() → '1'/'0' for true/false and null for empty, priority is set by
// the Data Lookup (impact × urgency) and is read-only on the form, Resolve/Close need Resolution code + notes (Data Policy).
import { q, jx } from './lessonKit.js'

const CALL = (fn) => ({ trigger: { type: 'call', fn } })
const MSGS = '__msgs.map(function (m) { return m.text })'
// current = the stored incident `id` (inc1 = INC0010001 …) after `values` are written into the table
const REC = (values, id = 'inc1') => ({ seed: { incident: [{ sys_id: id, ...values }] }, current: { table: 'incident', values: { sys_id: id } } })
// fields of one stored incident, read back with a fresh GlideRecord (getValue strings, null when empty)
const DB = (fields, id = 'inc1') => `(function () { var g = new GlideRecord('incident'); g.get('${id}'); return [${fields.map((f) => `g.getValue('${f}')`).join(', ')}]; })()`
// one field of several stored incidents
const DBS = (field, ids) => `${JSON.stringify(ids)}.map(function (id) { var g = new GlideRecord('incident'); g.get(id); return g.getValue('${field}'); })`
// run a condition function on several incidents by number → array of results
const COND = (fn, nums) => `${JSON.stringify(nums)}.map(function (n) { var g = new GlideRecord('incident'); g.get('number', n); return ${fn}(g); })`
// extra practice incidents: a Closed one, and a Resolved one that is still active (verified in her PDI: Resolved stays active = true,
// only Closed sets active = false). Base data INC0010005 is Closed too, so INC0010022 is the only Resolved incident — use it for state 6.
const CLOSED = { sys_id: 'inc_closed', number: 'INC0010021', short_description: 'Laptop battery replacement', category: 'hardware', state: '7', active: 'false', close_code: 'Resolved by caller', close_notes: 'New battery fitted.' }
const RESOLVED = { sys_id: 'inc_res', number: 'INC0010022', short_description: 'Outlook keeps asking for the password', category: 'software', state: '6', active: 'true', close_code: 'Workaround provided', close_notes: 'Cleared the cached credentials.' }
const EXTRA = { seed: { incident: [CLOSED, RESOLVED] } }
// INC0010001 turned into a Resolved incident (with Resolution code + notes) — a second Resolved row for "Close" variants
const INC1_RESOLVED = { state: '6', close_code: 'Workaround provided', close_notes: 'Re-synced the mailbox.' }

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
        'UI Action = form lo button, link leda right-click context menu item (list lo kuda — "UI Actions on the Table List" lesson lo). User click chesinappudu script run avtundi. All → System Definition → UI Actions lo create chestam.',
        'Mukhyamaina fields (Brazil labels): Name (button meeda text), Table, Action name (unique id), Active, Show insert / Show update, Client, Form button / Form context menu / Form link, List banner button / List choice / List context menu, Condition (button eppudu kanipinchali), Onclick (Client tick chesthe), Script.',
        'Client untick chesthe script SERVER lo run avtundi — current (aa record), gs, action vaadochu. Roles: nee PDI default UI Action form lo "Requires role" related list kanipinchaledu (akkada UI Action Visibility, Versions … unnayi) — roles field / related list vere view lo undochu ⚠️ PDI lo chudu. Sure way: Condition lo gs.hasRole("itil") ("UI Actions — Part 4" lo).',
      ],
      checks: ['requires-role'],
    },
    {
      h: '🖧 Server-side UI Action script',
      body: [
        'Server script lo current = form lo unna record (user form lo marchina values tho saha). current.field = value; current.update(); tarvata action.setRedirectURL(current) — user ni malli aa record ki teesukelutundi.',
        'User ki messages: gs.addInfoMessage("..."), gs.addErrorMessage("...") — next page lo kanipistayi.',
        'Nee PDI lo Resolved / Closed ki Resolution code + Resolution notes kavali (Data Policy "Make close info mandatory when resolved or closed") — anduke Resolve script lo avi kuda set chestam.',
      ],
      code: `// UI Action: Resolve   (Client untick, Form button tick)
current.state = 6;
current.close_code = 'Workaround provided';
current.close_notes = 'Resolved from the Resolve button';
current.update();
gs.addInfoMessage('Incident resolved');
action.setRedirectURL(current);`,
    },
    {
      h: '⚠️ Gurtupettukovali',
      body: [
        'Click chesinappudu form values current lo untayi — kani record automatic ga save avvadu: script lo current.update() pilichinappude save avtundi. ⚠️ Nee PDI lo oka test UI Action tho confirm chesuko — steps kinda 🔍 box lo (tarvata aa UI Action delete chey!).',
        'Priority nee PDI lo read-only — Data Lookup impact × urgency chusi pedutundi (e.g. impact 2 + urgency 1 → 2 - High). Script lo priority direct ga set cheyyaku; impact / urgency marchu.',
        'Ee site lo current = practice table lo unna NIJAMAINA record (e.g. INC0010001). update() marchipothe tests table nunchi fresh ga chadivi fail avtayi — real PDI laage.',
      ],
      checks: ['ui-action-no-autosave'],
    },
    {
      h: '🔍 Empty / true-false checks (PDI lo tested)',
      body: [
        'getValue() empty field ki null istundi ("" kaadu); true/false field ki "1" / "0" istundi ("true" kaadu). Anduke getValue("assigned_to") != "" ane check null ki kuda true avtundi, getValue("active") == "true" ellappudu false.',
        'Safe ga: empty aa? → current.assigned_to.nil() (leda gs.nil(current.assigned_to)). Active aa? → current.active == true. Ivi nee PDI lo, ee site lo — rendu chotla correct.',
      ],
      code: `current.assigned_to.nil()               // true = evaru assign avvaledu
!current.assigned_to.nil()              // evaro already unnaru
current.active == true                  // ✅ active
current.getValue('active') == 'true'    // ❌ PDI lo getValue '1' istundi → false`,
    },
  ],
  quiz: [
    q('UI Action ante?', ['Server lo run ayye Business Rule type', 'Form button / link / context menu', 'Time batti run ayye Scheduled Job', 'Data store chese Table'], 1, 'Form lo button, link, context menu (list lo kuda) — click chesthe script run avtundi.'),
    q('Client checkbox tick cheyyakapothe script ekkada run avtundi?', ['Browser lo', 'Server lo', 'MID Server lo', 'Mobile app lo'], 1, 'Client untick → script server lo run avtundi (current, gs, action vaadochu).'),
    q('Script tarvata user ni malli record ki ela pampali?', ['action.setRedirectURL(current)', 'gs.setRedirect(current.number)', 'g_form.reloadForm(current)', 'current.redirectTo(form)'], 0, 'action.setRedirectURL(current) — save tarvata aa record form malli open avtundi.'),
    q('"Action name" field enduku?', ['Unique id — gsftSubmit lo vaadataniki', 'Button meeda kanipinche text kosam', 'Button colour / style set cheyyadaniki', 'Roles list store cheyyadaniki'], 0, 'Action name = unique id. Button text "Name" field nunchi vastundi; client nunchi server part pilavataniki gsftSubmit lo Action name vaadatam.'),
    q('Button eppudu kanipinchali ani control chesedi?', ['Condition field', 'Order field', 'Hint field', 'Description field'], 0, 'Condition (e.g. current.state != 6) true ayithe matrame button kanipistundi. Order = position, Hint = tooltip.'),
  ],
  exercises: [
    jx('cs-ua1', 1, 'Resolve button', 'easy', {
      server: true,
      scenario: REC({ state: '2', close_code: '', close_notes: '' }),
      task: 'Resolve UI Action script rayi (Client untick): state = 6, close_code = "Workaround provided", close_notes = "Resolved by UI Action" set chesi current.update() chey, tarvata action.setRedirectURL(current). (current = INC0010001, In Progress.)',
      starter: '// UI Action: Resolve (server)\n// Step 1: state + Resolution code + Resolution notes set chey\n// Step 2: save chey\n// Step 3: user ni malli ee record ki pampu\n',
      hint: [
        'Moodu fields set chesi, okkasari save, last lo redirect. setValue(field, value) vaadu.',
        "current.setValue('state', 6);   current.setValue('close_code', ...);   current.setValue('close_notes', ...);   tarvata current.update();",
        "current.setValue('state', 6); current.setValue('close_code', 'Workaround provided'); current.setValue('close_notes', 'Resolved by UI Action'); current.update(); action.setRedirectURL(current);",
      ],
      solution: "current.setValue('state', 6);\ncurrent.setValue('close_code', 'Workaround provided');\ncurrent.setValue('close_notes', 'Resolved by UI Action');\ncurrent.update();\naction.setRedirectURL(current);",
      explain: 'current = form lo record. update() lekapothe table lo em save avvadu — test fresh GlideRecord tho table nunchi chaduvutundi. Nee PDI lo Data Policy valla Resolved ki Resolution code + Resolution notes kavali — anduke avi kuda set chesam.',
      tests: [
        { label: 'Table lo state 6 (update() chesava?)', expr: DB(['state']), expect: ['6'] },
        { label: 'Table lo Resolution code + notes', expr: DB(['close_code', 'close_notes']), expect: ['Workaround provided', 'Resolved by UI Action'] },
      ],
    }),
    jx('cs-ua1', 2, 'Escalate button (urgency paiki)', 'easy', {
      server: true,
      scenario: REC({ urgency: '3' }, 'inc6'),
      task: 'Escalate UI Action rayi (current = INC0010006, urgency 3): urgency ni oka step paiki teesuko — number 1 takkuva (3 → 2; chinna number = ekkuva urgent). Number() tho calculate chesi setValue, update(), tarvata gs.info("Urgency now " + kotha value). (Priority kaadu — nee PDI lo priority read-only, Data Lookup impact × urgency nunchi vastundi.)',
      starter: "// UI Action: Escalate (server)\n// Step 1: ippati urgency teesukoni 1 teesey (Number() vaadu)\n// Step 2: kotha urgency set chesi save chey\n// Step 3: 'Urgency now ' + kotha value log chey\n",
      hint: [
        'getValue string istundi — Number() tho number chesi 1 teesey. Aa value ne set chey, log lo kuda ade vaadu.',
        "var u = Number(current.getValue('urgency')) - 1;   current.setValue('urgency', u);   current.update();",
        "var u = Number(current.getValue('urgency')) - 1; current.setValue('urgency', u); current.update(); gs.info('Urgency now ' + u);",
      ],
      solution: "var u = Number(current.getValue('urgency')) - 1;\ncurrent.setValue('urgency', u);\ncurrent.update();\ngs.info('Urgency now ' + u);",
      explain: 'getValue string — Number() tho calculate. Nee PDI lo impact 2 + urgency 2 → Data Lookup priority "3 - Moderate" pedutundi (ee sandbox lo Data Lookup ledu, priority alage untundi). Urgency already 1 ayithe? Condition field lo current.urgency > 1 pettu — button ee case lo kanipinchadu.',
      tests: [
        { label: 'Table lo urgency 2', expr: DB(['urgency'], 'inc6'), expect: ['2'] },
        { label: 'log', logs: ['Urgency now 2'] },
      ],
      variants: [{ name: 'urgency 2 tho start', scenario: REC({ urgency: '2' }, 'inc6'), tests: [{ label: 'Table lo urgency 1', expr: DB(['urgency'], 'inc6'), expect: ['1'] }, { label: 'log', logs: ['Urgency now 1'] }] }],
    }),
    jx('cs-ua1', 3, 'Assign to me', 'medium', {
      server: true,
      scenario: REC({ assigned_to: '', state: '1' }, 'inc6'),
      task: 'Assign to me UI Action rayi (current = INC0010006): assigned_to empty ayithe — assigned_to = gs.getUserID(), state = 2 (In Progress), update(). Already evaraina unte gs.addErrorMessage("Already assigned") chupinchi emi marchaku. Empty check ki current.assigned_to.nil() vaadu (PDI lo getValue empty ki null istundi, "" kaadu).',
      starter: '// UI Action: Assign to me (server)\n// if (evaraina already assign ayi unte) → error message\n// lekapothe → assigned_to = login user, state 2, save\n',
      hint: [
        'Rendu daarulu: evaraina already unte error chupinchi aagu; lekapothe nuvve assign chesuko. if / else kavali.',
        'Empty check: current.assigned_to.nil() (true = empty).   Login user sys_id: gs.getUserID().   Save: current.update().',
        "if (!current.assigned_to.nil()) { gs.addErrorMessage('Already assigned'); } else { current.setValue('assigned_to', gs.getUserID()); current.setValue('state', 2); current.update(); }",
      ],
      solution: "if (!current.assigned_to.nil()) {\n  gs.addErrorMessage('Already assigned');\n} else {\n  current.setValue('assigned_to', gs.getUserID());\n  current.setValue('state', 2);\n  current.update();\n}",
      explain: 'gs.getUserID() = login user sys_id (ikkada u_admin). ⚠️ Trap: getValue("assigned_to") != "" ane check PDI lo empty field ki kuda true (null != "") — appudu "Already assigned" tappu ga vastundi. .nil() rendu chotla correct.',
      tests: [{ label: 'Table lo assigned_to = me (u_admin), state 2', expr: DB(['assigned_to', 'state'], 'inc6'), expect: ['u_admin', '2'] }],
      variants: [{ name: 'already assigned (Bud)', scenario: REC({ assigned_to: 'u_bud', state: '2' }, 'inc6'), tests: [{ label: 'Table lo em marchaledu', expr: DB(['assigned_to', 'state'], 'inc6'), expect: ['u_bud', '2'] }] }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to "Reopen (guarded)" ----
    jx('cs-ua1', 5, 'Reopen cheyyocha? (|| condition)', 'medium+', {
      server: true,
      scenario: EXTRA,
      task: 'canReopen(current) function rayi: state "6" (Resolved) leda "7" (Closed) ayithe true, lekapothe false return chey. (Reopen button ki idi condition laaga.) 🧰 Vaade words: current, getValue(), ||',
      starter: "function canReopen(current) {\n  // Step 1: state teesuko (getValue string istundi)\n  // Step 2: state '6' leda '7' aa? ani || tho check chesi return chey\n  return false;\n}",
      hint: [
        'Rendu states lo edaina okati ayithe chaalu — ante OR (||). getValue string istundi, kabatti quotes tho compare chey.',
        "var s = current.getValue('state');   return s == '6' || <inkoka check>;",
        "function canReopen(current) { var s = current.getValue('state'); return s == '6' || s == '7'; }",
      ],
      solution: "function canReopen(current) {\n  var s = current.getValue('state');\n  return s == '6' || s == '7';\n}",
      explain: '|| = "leda": okka side true ayina result true. INC0010022 Resolved (6) → true, INC0010001 In Progress (2) → false, INC0010005 Closed (7) → true.',
      tests: [{ label: 'INC22 (Resolved) true, INC1 (In Progress) false, INC5 (Closed) true', expr: COND('canReopen', ['INC0010022', 'INC0010001', 'INC0010005']), expect: [true, false, true] }],
    }),
    jx('cs-ua1', 6, 'Reopen: rendu fields + update', 'medium+', {
      server: true,
      scenario: REC({ state: '7', active: 'false' }),
      task: 'Ee incident (INC0010001) Closed — state 7, active false. Reopen chey: state = 2, active = true set chesi current.update() chey. Tarvata gs.info("Reopened " + number) log chey. (Guard inka vaddu — "Reopen message" exercise lo.) 🧰 Vaade words: current, setValue(), update(), getValue(), gs.info',
      starter: '// Step 1: state ni 2 ki set chey\n// Step 2: active ni true ki set chey\n// Step 3: save chey\n// Step 4: "Reopened " + number log chey\n',
      hint: [
        'Rendu fields marchali, tarvata okkasari save, last lo log. Number kosam current nunchi malli getValue.',
        "current.setValue('state', 2);   current.setValue('active', true);   — tarvata update().",
        "current.setValue('state', 2); current.setValue('active', true); current.update(); gs.info('Reopened ' + current.getValue('number'));",
      ],
      solution: "current.setValue('state', 2);\ncurrent.setValue('active', true);\ncurrent.update();\ngs.info('Reopened ' + current.getValue('number'));",
      explain: 'Okate update() tho rendu field changes save avtayi — prathi setValue tarvata update() avasaram ledu. Table nunchi chadivithe active "1" vastundi — PDI lo getValue true/false ki "1" / "0" istundi.',
      tests: [
        { label: 'Table lo state 2, active "1"', expr: DB(['state', 'active']), expect: ['2', '1'] },
        { label: 'log', logs: ['Reopened INC0010001'] },
      ],
      variants: [{ name: 'vere closed incident (INC0010004)', scenario: REC({ state: '7', active: 'false' }, 'inc4'), tests: [{ label: 'Table lo state 2, active "1"', expr: DB(['state', 'active'], 'inc4'), expect: ['2', '1'] }, { label: 'log', logs: ['Reopened INC0010004'] }] }],
    }),
    jx('cs-ua1', 7, 'Reopen message (if / else)', 'medium+', {
      server: true,
      scenario: EXTRA,
      task: 'reopenMsg(current) function rayi: state "6" leda "7" ayithe "Reopen OK" return chey, lekapothe "Cannot reopen" return chey. ("Reopen (guarded)" exercise lo ide if / else lo nijamga reopen chestam.) 🧰 Vaade words: current, getValue(), ||, if / else',
      starter: "function reopenMsg(current) {\n  // if (state 6 leda 7) → 'Reopen OK', lekapothe → 'Cannot reopen'\n  return '';\n}",
      hint: [
        '"Reopen cheyyocha?" lo rasina condition ne if lo pettu. True side oka text, else side inkoka text return.',
        "var s = current.getValue('state');   if (s == '6' || s == '7') { return ...; }   return ...;",
        "var s = current.getValue('state'); if (s == '6' || s == '7') { return 'Reopen OK'; } return 'Cannot reopen';",
      ],
      solution: "function reopenMsg(current) {\n  var s = current.getValue('state');\n  if (s == '6' || s == '7') {\n    return 'Reopen OK';\n  }\n  return 'Cannot reopen';\n}",
      explain: 'Anni branches test avtayi: INC22 (Resolved) → Reopen OK, INC1 (In Progress) → Cannot reopen, INC5 (Closed) → Reopen OK. if lo return ayithe kinda line run avvadu.',
      tests: [{ label: 'INC22 → Reopen OK, INC1 → Cannot reopen, INC5 → Reopen OK', expr: COND('reopenMsg', ['INC0010022', 'INC0010001', 'INC0010005']), expect: ['Reopen OK', 'Cannot reopen', 'Reopen OK'] }],
    }),
    jx('cs-ua1', 4, 'Reopen (guarded)', 'hard', {
      server: true,
      scenario: REC({ state: '7', active: 'false' }),
      task: 'Reopen UI Action rayi: state 6 leda 7 ayithe matrame — state = 2, active = true set chesi update() chey, gs.info("Reopened " + number). Vere state ayithe gs.info("Cannot reopen") matrame (em marchakudadu).',
      starter: '// UI Action: Reopen (server)\n// state 6 / 7 ayithe → reopen + save + log\n// lekapothe → "Cannot reopen" log\n',
      hint: [
        '"Reopen cheyyocha?", "Reopen: rendu fields + update", "Reopen message" exercises kalipi: || condition, if lo rendu fields + update + log, else lo "Cannot reopen" log.',
        "var s = current.getValue('state');   if (s == '6' || s == '7') { setValue x2; update(); gs.info(...) } else { gs.info('Cannot reopen'); }",
        "var s = current.getValue('state'); if (s == '6' || s == '7') { current.setValue('state', 2); current.setValue('active', true); current.update(); gs.info('Reopened ' + current.getValue('number')); } else { gs.info('Cannot reopen'); }",
      ],
      solution: "var s = current.getValue('state');\nif (s == '6' || s == '7') {\n  current.setValue('state', 2);\n  current.setValue('active', true);\n  current.update();\n  gs.info('Reopened ' + current.getValue('number'));\n} else {\n  gs.info('Cannot reopen');\n}",
      explain: 'Condition field button ni hide chestundi, kani script lo kuda guard pettali (URL tho direct ga pilavochu). Variants: New (1) incident marakudadu; Resolved (6) incident reopen avvali.',
      tests: [
        { label: 'Table lo state 2, active "1"', expr: DB(['state', 'active']), expect: ['2', '1'] },
        { label: 'log', logs: ['Reopened INC0010001'] },
      ],
      variants: [
        { name: 'state 1 (New) — reopen kudaradu', scenario: REC({ state: '1', active: 'true' }), tests: [{ label: 'Table lo state 1 laage', expr: DB(['state']), expect: ['1'] }, { label: 'log', logs: ['Cannot reopen'] }] },
        { name: 'Resolved (6) incident INC0010004', scenario: REC({ state: '6', active: 'true' }, 'inc4'), tests: [{ label: 'Table lo state 2', expr: DB(['state'], 'inc4'), expect: ['2'] }, { label: 'log', logs: ['Reopened INC0010004'] }] },
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
    starter: "function markLow() {\n  g_form.setValue('impact', '3');\n  g_form.setValue('urgency', '3');\n  g_form.addInfoMessage('Impact + urgency Low');\n}",
    scenario: { form: { values: { impact: '1', urgency: '1', priority: '1' } } },
    client: CALL('markLow'),
  },
  learn: [
    {
      h: '🖱️ Client UI Action',
      body: [
        'Client tick chesthe script BROWSER lo run avtundi — g_form, g_user vaadochu, server ki velladu. Onclick field lo function call rayali (e.g. markLow()), Script field lo aa function define cheyyali.',
        'Use cases: confirm dialogs, form values marchadam, validation. Client UI Action lo current / gs levu (avi server only).',
        'Priority ni direct ga set cheyyaku — nee PDI lo Priority field read-only, Data Lookup impact × urgency chusi set chestundi. Kabatti impact / urgency marchu.',
      ],
      code: `// Client ✔,  Onclick: markLow()
function markLow() {
  g_form.setValue('impact', '3');
  g_form.setValue('urgency', '3');     // PDI: Data Lookup → Priority 4 - Low
  g_form.addInfoMessage('Impact + urgency Low');
}`,
    },
    {
      h: '📨 gsftSubmit — server ki submit',
      body: [
        'Client code tarvata server lo pani (save, server script) kavali ante: gsftSubmit(null, g_form.getFormElement(), "action_name"). action_name = UI Action "Action name" field value — exact match avvali.',
        'Idi form ni submit chesi, ade UI Action ni server side malli run chestundi (next lesson lo full pattern). ✅ Ee 3-parameter pattern nee PDI lo tested.',
      ],
      code: `function resolveIt() {
  if (!confirm('Resolve incident?')) return;
  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');
}`,
    },
    {
      h: '💬 confirm / alert & save',
      body: [
        'confirm("...") → OK = true, Cancel = false; user click chese varaku code aagutundi. alert("...") → message + OK button matrame.',
        'Cancel ki early return: if (!confirm("...")) { return; } — kinda unna code run avvadu.',
        'Client UI Action g_form tho values marchina, record SAVE avvadu — user Save / Update nokkali, leda script lo g_form.save() / gsftSubmit.',
      ],
      code: `function startWork() {
  if (!confirm('Start work on this incident?')) {
    return;                         // Cancel → ikkade aagu
  }
  g_form.setValue('state', '2');
  g_form.save();
}`,
    },
  ],
  quiz: [
    q('Client UI Action lo vaadochu?', ['g_form', 'current', 'gs.update', 'GlideRecord server'], 0, 'g_form (client API). current, gs server lo matrame.'),
    q('Onclick field lo emi rastam?', ['Function call — markP1()', 'Table peru — incident', 'Role peru — itil', 'Script motham (pedda code)'], 0, 'Onclick lo function call; aa function Script field lo define chestam.'),
    q('Client script nunchi server UI Action run cheyyadaniki?', ['gsftSubmit(...)', 'gs.run()', 'g_form.run()', 'GlideAjax matrame'], 0, 'gsftSubmit(null, g_form.getFormElement(), actionName).'),
    q('Client UI Action lo current vaadochaa?', ['Avunu', 'Ledu', 'Admin ki', 'Mobile lo'], 1, 'current server only — client lo g_form vaadu.'),
    q('Confirm mundu adagadaniki?', ['confirm()', 'prompt()', 'gs.confirm', 'g_form.confirm'], 0, 'confirm() browser dialog lo OK/Cancel istundi — true/false return chestundi, adi check chesi continue avvachu.'),
  ],
  exercises: [
    jx('cs-ua2', 1, 'Mark P1 (impact + urgency High)', 'easy', {
      scenario: { form: { values: { impact: '3', urgency: '3', priority: '4' } } },
      client: CALL('markP1'),
      task: 'markP1() rayi: impact "1" mariyu urgency "1" set chey, "Impact + urgency High" ani info message chupinchu. (Priority ni direct ga marchaku — nee PDI lo Priority read-only; Data Lookup impact 1 × urgency 1 chusi "1 - Critical" pedutundi.)',
      starter: 'function markP1() {\n  // impact + urgency 1 chey\n  // info message chupinchu\n}',
      hint: "g_form.setValue('impact', '1'); g_form.setValue('urgency', '1'); g_form.addInfoMessage('Impact + urgency High');",
      solution: "function markP1() {\n  g_form.setValue('impact', '1');\n  g_form.setValue('urgency', '1');\n  g_form.addInfoMessage('Impact + urgency High');\n}",
      explain: 'Client UI Action = button click → function. Form lo values marutayi; user Save nokkite save avtundi. Ee sandbox lo Data Lookup ledu kabatti priority alage untundi — nee PDI lo 1 - Critical ki marutundi.',
      tests: [
        { label: 'impact 1, urgency 1', expr: "[g_form.getValue('impact'), g_form.getValue('urgency')]", expect: ['1', '1'] },
        { label: 'message', expr: MSGS, expect: ['Impact + urgency High'] },
      ],
    }),
    jx('cs-ua2', 2, 'Clear assignment', 'easy', {
      scenario: { form: { values: { assignment_group: 'g_net', assigned_to: 'u_admin' } } },
      client: CALL('clearAssignment'),
      task: 'clearAssignment() rayi: assignment_group mariyu assigned_to rendu clear chey.',
      starter: 'function clearAssignment() {\n  // rendu fields clear chey\n}',
      hint: "g_form.clearValue('assignment_group'); g_form.clearValue('assigned_to');",
      solution: "function clearAssignment() {\n  g_form.clearValue('assignment_group');\n  g_form.clearValue('assigned_to');\n}",
      explain: 'Form lo values marchindi — user Save nokkite matrame table lo marutundi.',
      tests: [{ label: 'rendu empty', expr: "[g_form.getValue('assignment_group'), g_form.getValue('assigned_to')]", expect: ['', ''] }],
    }),
    jx('cs-ua2', 3, 'Validate tarvata submit', 'medium', {
      scenario: { form: { values: { short_description: 'VPN down' } } },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: short_description empty ayithe addErrorMessage("Short description kavali") chupinchi return. Lekapothe gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu.',
      starter: 'function resolveIt() {\n  // empty ayithe error + return\n  // lekapothe server ki submit (action name: resolve_incident)\n}',
      hint: [
        'Mundu check, tarvata submit. Empty ayithe error chupinchi akkade return — appudu kinda unna submit line run avvadu.',
        "if (g_form.getValue('short_description') == '') { ...error...; return; }   tarvata gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
        "if (g_form.getValue('short_description') == '') { g_form.addErrorMessage('Short description kavali'); return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: "function resolveIt() {\n  if (g_form.getValue('short_description') == '') {\n    g_form.addErrorMessage('Short description kavali');\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n}",
      explain: 'Client lo validate chesi, OK ayithe matrame server ki submit. (Client lo g_form.getValue empty field ki "" istundi — server getValue laaga null kaadu.)',
      tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }],
      variants: [{ name: 'short_description empty', scenario: { form: { values: { short_description: '' } } }, tests: [{ label: 'submit avvaledu', expr: '__x.submitted', expect: null }, { label: 'error message', expr: MSGS, expect: ['Short description kavali'] }] }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to "Confirm tarvata submit" ----
    jx('cs-ua2', 5, 'confirm() answer chudu', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: true },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") adigi, vachina answer ni ok variable lo pettu. Tarvata g_form.addInfoMessage("Answer: " + ok) chupinchu. (Ikkada user OK nokkindi.) 🧰 Vaade words: confirm(), g_form.addInfoMessage()',
      starter: "function resolveIt() {\n  // Step 1: confirm answer ni ok ane variable lo pettu — OK = true, Cancel = false\n  // Step 2: 'Answer: ' + ok ani info message chupinchu\n}",
      hint: [
        'confirm() oka value return chestundi — OK ki true, Cancel ki false. Adi variable lo pettukoni message lo chupinchu.',
        "var ok = confirm('Resolve incident?');   tarvata g_form.addInfoMessage(...)",
        "var ok = confirm('Resolve incident?'); g_form.addInfoMessage('Answer: ' + ok);",
      ],
      solution: "function resolveIt() {\n  var ok = confirm('Resolve incident?');\n  g_form.addInfoMessage('Answer: ' + ok);\n}",
      explain: 'confirm() browser dialog — user click chese varaku code aagutundi, tarvata true / false istundi. Ee practice lo answer scenario lo fix chesamu (OK; variant lo Cancel).',
      tests: [
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
        { label: 'message', expr: MSGS, expect: ['Answer: true'] },
      ],
      variants: [{ name: 'user Cancel', scenario: { confirmAnswer: false }, tests: [{ label: 'message', expr: MSGS, expect: ['Answer: false'] }] }],
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
      explain: '!confirm(...) = "user Cancel nokkite". Early return tho kinda unna code skip avtundi — state 2 laage undi. Variant lo OK nokkite state 6 avvali.',
      tests: [
        { label: 'state marchaledu (2)', expr: "g_form.getValue('state')", expect: '2' },
        { label: 'Cancelled message', expr: MSGS, expect: ['Cancelled'] },
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
      ],
      variants: [{ name: 'user OK', scenario: { confirmAnswer: true }, tests: [{ label: 'state 6 avvali', expr: "g_form.getValue('state')", expect: '6' }, { label: 'message ledu', expr: MSGS, expect: [] }] }],
    }),
    jx('cs-ua2', 7, 'OK ayithe gsftSubmit', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: true },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") OK ayithe gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu. (Ikkada user OK nokkindi. Cancel side "Confirm tarvata submit" exercise lo.) 🧰 Vaade words: confirm(), gsftSubmit, g_form.getFormElement()',
      starter: "function resolveIt() {\n  // confirm OK ayithe → server ki submit (action name: resolve_incident)\n}",
      hint: [
        'confirm() true ayithe matrame submit. gsftSubmit ki 3 parameters: null, form element, action name.',
        "if (confirm('Resolve incident?')) { gsftSubmit(null, <form element>, 'resolve_incident'); }",
        "if (confirm('Resolve incident?')) { gsftSubmit(null, g_form.getFormElement(), 'resolve_incident'); }",
      ],
      solution: "function resolveIt() {\n  if (confirm('Resolve incident?')) {\n    gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n  }\n}",
      explain: 'Action name ("resolve_incident") UI Action record lo unna Action name tho exact match avvali. ✅ gsftSubmit 3-parameter pattern nee PDI lo tested.',
      tests: [
        { label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' },
        { label: 'confirm tarvata submit', logs: ['Resolve incident?', '[gsftSubmit: resolve_incident]'] },
      ],
      variants: [{ name: 'user Cancel', scenario: { confirmAnswer: false }, tests: [{ label: 'submit avvakudadu', expr: '__x.submitted', expect: null }] }],
    }),
    jx('cs-ua2', 4, 'Confirm tarvata submit', 'hard', {
      scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: false },
      client: CALL('resolveIt'),
      task: 'resolveIt() rayi: confirm("Resolve incident?") adugu. User Cancel nokkite emi cheyyaku (submit cheyyakudadu). OK ayithe gsftSubmit(..., "resolve_incident"). (Ikkada user Cancel nokkindi; variant lo OK.)',
      starter: 'function resolveIt() {\n  // Cancel → emi cheyyaku\n  // OK → server ki submit\n}',
      hint: [
        '"Cancel ayithe aagu" + "OK ayithe gsftSubmit" exercises kalipi: Cancel ayithe early return, lekapothe submit.',
        "if (!confirm('Resolve incident?')) { return; }   tarvata gsftSubmit(null, ..., ...);",
        "if (!confirm('Resolve incident?')) { return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: "function resolveIt() {\n  if (!confirm('Resolve incident?')) {\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');\n}",
      explain: 'Early return pattern: Cancel → aagu, OK → submit. Rendu branches test avtayi.',
      tests: [
        { label: 'submit avvaledu', expr: '__x.submitted', expect: null },
        { label: 'confirm adigindi', logs: ['Resolve incident?'] },
      ],
      variants: [{ name: 'user OK', scenario: { confirmAnswer: true }, tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }] }],
    }),
  ],
}

/* 20 — UI Actions part 3 (client + server) */
const HYBRID_START = `// Client = true, Onclick: resolveIncident(), Action name: resolve_incident
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
const GSFT_LINE = "  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');"
// the user filled the Resolution fields on the form — gsftSubmit sends them, so `current` has them on the server
const FILLED = { close_code: 'Workaround provided', close_notes: 'Restarted the VPN service' }
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
        'Setup: Client tick, Onclick = resolveIncident(), Action name = "resolve_incident". Client function lo validation / confirm; tarvata gsftSubmit(null, g_form.getFormElement(), "resolve_incident") — idi aa UI Action ne server lo malli run chestundi.',
        'Script lo kinda unna if (typeof window == "undefined") { serverResolve(); } server lo matrame true avtundi (browser lo window untundi, server lo undadu). Server function lo current vaadatam.',
        'Action name field value = gsftSubmit 3rd parameter — exact match lekapothe server part run avvadu.',
      ],
      code: `// Client ✔, Onclick: resolveIncident(), Action name: resolve_incident
function resolveIncident() {
  if (g_form.getValue('close_notes') == '') {
    g_form.addErrorMessage('Resolution notes kavali');
    return;
  }
  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');
}

// Server side — gsftSubmit tarvata ide script server lo malli run avtundi
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
      h: '🧭 Flow — step by step',
      body: [
        '1) Button click → browser lo Onclick function. 2) Validation / confirm (fail ayithe return — server ki vellakunda aagutundi). 3) gsftSubmit → form submit. 4) Server lo SAME script malli run — window ledu kabatti serverResolve(). 5) current.update() + redirect.',
        'Form lo user rasina values (e.g. Resolution code, Resolution notes — incident form lo "Resolution Information" tab lo untayi) submit tho server ki veltayi — serverResolve() lo current lo untayi.',
        'Client function lo current / gs levu; server function lo g_form / g_user levu.',
      ],
    },
    {
      h: '🧪 Ee site lo test chesedi',
      body: [
        'Client part exercises form sandbox lo (g_form, gsftSubmit untayi; window undi → server part skip). Server part exercises server sandbox lo (window ledu → typeof window == "undefined" true → serverResolve() run).',
        '✅ gsftSubmit 3-parameter pattern nee PDI lo tested. Out-of-box example: System Definition → UI Actions → Table = incident, "Resolve" UI Action open chey — Client ✔, Onclick resolveIncident(), Action name resolve_incident; script lo g_form.setValue("state", 6) + gsftSubmit(null, g_form.getFormElement(), "resolve_incident") (nee PDI lo chusam — ee lesson pattern ade). Script kinda server part ela rasaro kuda chadivi chudu. Read matrame, save cheyyaku.',
      ],
    },
  ],
  quiz: [
    q('gsftSubmit(null, g_form.getFormElement(), "x") em chestundi?', ['Form submit chesi "x" action server lo run', 'Client script ni ikkade aapesi exit avtundi', 'Page ni reload matrame chestundi, save ledu', '"x" ane message tho alert popup chupistundi'], 0, 'Form submit avtundi, Action name "x" unna UI Action server side lo run avtundi.'),
    q('typeof window == "undefined" enduku?', ['Server lo run avtunnama ani check', 'Browser version enti ani check', 'User ki role undo ani check', 'Form save ayyindo ani check'], 0, 'Server lo window object ledu → true; browser lo false. Anduke server part matrame run avtundi.'),
    q('UI Action "Action name" field value deeni tho match avvali?', ['gsftSubmit lo ichina 3rd parameter', 'Onclick lo rasina function peru', 'UI Action Name (button text)', 'Table peru (incident)'], 0, 'gsftSubmit(null, form, "resolve_incident") lo 3rd parameter = Action name. Match lekapothe server part run avvadu.'),
    q('Server function lo vaadochu?', ['current, gs', 'g_form, g_user', 'alert, confirm', 'g_list, jslog'], 0, 'Server function lo current, gs vaadochu — g_form, g_user, alert client things.'),
    q('Client function lo validation ekkada pettali?', ['gsftSubmit mundu', 'gsftSubmit tarvata', 'Server lo matrame', 'Emi vaddu'], 0, 'Client validation gsftSubmit mundu cheyyali — tarvata server ki velli pothundi, appudu aapalem.'),
  ],
  exercises: [
    jx('cs-ua3', 1, 'Client part: submit', 'easy', {
      scenario: { form: { values: {} } },
      client: CALL('resolveIncident'),
      task: 'Client function resolveIncident() lo gsftSubmit(null, g_form.getFormElement(), "resolve_incident") pilu. (Kinda server part already undi — typeof window check browser lo skip avtundi.)',
      starter: HYBRID_START.replace(GSFT_LINE, '  // TODO'),
      hint: "gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      solution: HYBRID_START,
      explain: 'Browser lo window undi kabatti serverResolve() skip avtundi; gsftSubmit server ki submit chestundi.',
      tests: [{ label: 'submitted', expr: '__x.submitted', expect: 'resolve_incident' }],
    }),
    jx('cs-ua3', 2, 'Server part: resolve', 'easy', {
      server: true,
      scenario: REC({ state: '2', ...FILLED }),
      task: 'Full hybrid script server lo run avtundi (window ledu → serverResolve() pilustundi). serverResolve() lo: current.state = 6, update(), action.setRedirectURL(current). (Resolution code + notes user form lo fill chesindi — current lo already unnayi.)',
      starter: HYBRID_START,
      hint: "current.setValue('state', 6); current.update(); action.setRedirectURL(current);",
      solution: HYBRID_START.replace('  // TODO', "  current.setValue('state', 6);\n  current.update();\n  action.setRedirectURL(current);"),
      explain: 'Server lo typeof window == "undefined" true — anduke serverResolve() run ayindi. Client function (resolveIncident) server lo pilavabadadu.',
      tests: [{ label: 'Table lo state 6 (update() chesava?)', expr: DB(['state']), expect: ['6'] }],
    }),
    jx('cs-ua3', 3, 'Client: Resolution notes mandatory', 'medium', {
      scenario: { form: { values: { close_notes: '' } } },
      client: CALL('resolveIncident'),
      task: 'resolveIncident() lo: Resolution notes (close_notes) empty ayithe addErrorMessage("Resolution notes kavali") chupinchi return (submit cheyyakudadu). Lekapothe gsftSubmit(..., "resolve_incident").',
      starter: HYBRID_START.replace(GSFT_LINE, '  // TODO: close_notes empty ayithe error + return; lekapothe submit'),
      hint: [
        'Client function lo gsftSubmit MUNDU check pettu. Empty ayithe error + return — appudu server ki vellakunda aagutundi.',
        "if (g_form.getValue('close_notes') == '') { g_form.addErrorMessage(...); return; }   tarvata gsftSubmit line.",
        "if (g_form.getValue('close_notes') == '') { g_form.addErrorMessage('Resolution notes kavali'); return; } gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');",
      ],
      solution: HYBRID_START.replace(GSFT_LINE, "  if (g_form.getValue('close_notes') == '') {\n    g_form.addErrorMessage('Resolution notes kavali');\n    return;\n  }\n  gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');"),
      explain: 'Server ki velle mundu client lo validate cheste round trip save avtundi. (Nee PDI lo Data Policy kuda Resolved ki Resolution code + notes adugutundi.)',
      tests: [
        { label: 'submit avvaledu', expr: '__x.submitted', expect: null },
        { label: 'error', expr: MSGS, expect: ['Resolution notes kavali'] },
      ],
      variants: [{ name: 'Resolution notes unnayi', scenario: { form: { values: { close_notes: 'Restarted the VPN service' } } }, tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
    }),
    // ---- Medium+ ladder (server part): one new idea at a time, building up to "Server: resolved by" ----
    jx('cs-ua3', 5, 'Server check: typeof window', 'medium+', {
      server: true,
      scenario: REC({ state: '2', ...FILLED }),
      task: 'Ee script lo serverResolve() already rasi undi (state 6 + update), kani evaru pilavatledu. "Server lo unnama?" check (typeof window == "undefined") rasi, true ayithe serverResolve() pilu. Server lo window ledu kabatti idi run avvali. 🧰 Vaade words: typeof, gsftSubmit, current, update()',
      starter: HYBRID_FILLED.replace(HYBRID_IF, '// TODO: window ledu (server) ayithe serverResolve() pilu'),
      hint: [
        'Browser lo window object untundi, server lo undadu. typeof tho "undefined" aa ani check chesi serverResolve() pilu.',
        "if (typeof window == 'undefined') { ... }",
        "if (typeof window == 'undefined') { serverResolve(); }",
      ],
      solution: HYBRID_FILLED,
      explain: 'Oke script rendu chotla run avtundi: browser lo (window undi → if skip, Onclick function run) mariyu gsftSubmit tarvata server lo (window ledu → serverResolve()).',
      tests: [{ label: 'serverResolve run ayindi (table lo state 6)', expr: DB(['state']), expect: ['6'] }],
    }),
    jx('cs-ua3', 6, 'Server: "Resolved by" work note', 'medium+', {
      server: true,
      scenario: REC({ state: '2', work_notes: '', ...FILLED }),
      task: 'serverResolve() lo: work_notes = "Resolved by " + gs.getUserName() set chesi current.update() chey. (Practice lo login user "admin".) 🧰 Vaade words: gs.getUserName, setValue(), update()',
      starter: HYBRID_START.replace('  // TODO', "  // Step 1: work_notes = 'Resolved by ' + login user name\n  // Step 2: save chey"),
      hint: [
        'Server lo login user peru gs nunchi vastundi (g_user kaadu — adi client). Text + user name join chesi work_notes lo pettu.',
        "current.setValue('work_notes', 'Resolved by ' + gs.getUserName());   tarvata save.",
        "current.setValue('work_notes', 'Resolved by ' + gs.getUserName()); current.update();",
      ],
      solution: HYBRID_START.replace('  // TODO', "  current.setValue('work_notes', 'Resolved by ' + gs.getUserName());\n  current.update();"),
      explain: 'gs.getUserName() = login user yokka user_name (ikkada "admin"). Server part lo g_user ledu — gs vaadali. Nee PDI lo work note form kinda Activity lo kotha entry ga kanipistundi.',
      tests: [{ label: 'Table lo work_notes', expr: DB(['work_notes']), expect: ['Resolved by admin'] }],
    }),
    jx('cs-ua3', 7, 'Server: already closed ayithe return', 'medium+', {
      server: true,
      scenario: REC({ state: '7', active: 'false', ...FILLED }),
      task: 'serverResolve() lo: state "7" (Closed) ayithe gs.info("Already closed") chesi return. Lekapothe state = 6, update(). (Ikkada incident already Closed — state 7 laage undali; variant lo In Progress incident Resolved avvali.) 🧰 Vaade words: getValue(), gs.info, return',
      starter: HYBRID_START.replace('  // TODO', '  // guard: Closed ayithe log + return\n  // tarvata state 6 + save'),
      hint: [
        'Function mundu guard pettu: Closed ayithe log chesi akkade return — kinda unna resolve code run avvakudadu.',
        "if (current.getValue('state') == '7') { gs.info(...); return; }   tarvata setValue('state', 6) + update().",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); return; } current.setValue('state', 6); current.update();",
      ],
      solution: HYBRID_START.replace('  // TODO', "  if (current.getValue('state') == '7') {\n    gs.info('Already closed');\n    return;\n  }\n  current.setValue('state', 6);\n  current.update();"),
      explain: 'Closed incident ni malli Resolved cheyyakudadu. return function ni akkade aapestundi.',
      tests: [
        { label: 'Table lo state 7 laage undi', expr: DB(['state']), expect: ['7'] },
        { label: 'log', logs: ['Already closed'] },
      ],
      variants: [{ name: 'In Progress incident', scenario: REC({ state: '2', ...FILLED }), tests: [{ label: 'Table lo state 6', expr: DB(['state']), expect: ['6'] }, { label: 'log ledu', logs: [] }] }],
    }),
    jx('cs-ua3', 4, 'Server: resolved by', 'hard', {
      server: true,
      scenario: REC({ state: '2', work_notes: '', ...FILLED }),
      task: 'serverResolve() lo: state already 7 (Closed) ayithe gs.info("Already closed") chesi return. Lekapothe state = 6, work_notes = "Resolved by " + gs.getUserName(), update(), action.setRedirectURL(current).',
      starter: HYBRID_START,
      hint: [
        '"Server: Resolved by work note" + "Server: already closed ayithe return" kalipi: mundu Closed guard, tarvata state + work_notes set, save, last lo redirect.',
        "if (state == '7') { gs.info(...); return; }   current.setValue('state', 6);   current.setValue('work_notes', 'Resolved by ' + gs.getUserName());   update();   action.setRedirectURL(current);",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); return; } current.setValue('state', 6); current.setValue('work_notes', 'Resolved by ' + gs.getUserName()); current.update(); action.setRedirectURL(current);",
      ],
      solution: HYBRID_START.replace('  // TODO', "  if (current.getValue('state') == '7') {\n    gs.info('Already closed');\n    return;\n  }\n  current.setValue('state', 6);\n  current.setValue('work_notes', 'Resolved by ' + gs.getUserName());\n  current.update();\n  action.setRedirectURL(current);"),
      explain: 'gs.getUserName() = login user_name (admin). Variant: already Closed incident ki em marakudadu (work note kuda raakudadu).',
      tests: [{ label: 'Table lo state 6 + work note', expr: DB(['state', 'work_notes']), expect: ['6', 'Resolved by admin'] }],
      variants: [{ name: 'already closed', scenario: REC({ state: '7', active: 'false', work_notes: '', ...FILLED }), tests: [{ label: 'Table lo state 7, work note ledu', expr: DB(['state', 'work_notes']), expect: ['7', null] }, { label: 'log', logs: ['Already closed'] }] }],
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
        'Roles: role unnavaariki matrame button kavali ante Condition lo gs.hasRole("itil") rayi — idi sure way. "Requires role" related list nee PDI default UI Action form lo kanipinchaledu — roles field / related list vere view lo undochu ⚠️ PDI lo chudu. Admin ki gs.hasRole(edaina) ellappudu true (PDI lo tested), so non-admin user ni impersonate chesi test chey (avatar menu → Impersonate user).',
        'Condition server lo evaluate avtundi (form load time), kabatti g_form ledu. Form lo values marchina tarvata condition re-evaluate avvadu (save / reload varaku).',
      ],
      code: `current.active == true && current.state != 6
gs.hasRole('itil') && current.state < 6
current.priority == 1 && current.assigned_to.nil()`,
      checks: ['requires-role'],
    },
    {
      h: '🔍 Condition lo true / empty checks',
      body: [
        'Nee PDI lo getValue() true/false field ki "1" / "0", empty field ki null istundi (tested). Anduke getValue("active") == "true" ellappudu false, getValue("assigned_to") == "" empty ki kuda false!',
        'Correct: current.active == true (true/false), current.assigned_to.nil() (empty aa?), current.state != 6 (numbers / choices). Ivi PDI lo, ee site lo rendu chotla pani chestayi.',
      ],
      code: `current.active == true                   // ✅
current.getValue('active') == 'true'     // ❌ getValue '1' istundi
current.assigned_to.nil()                // ✅ empty
current.getValue('assigned_to') == ''    // ❌ empty ki getValue null`,
    },
    {
      h: '🧩 Options (Brazil labels)',
      body: [
        'Form lo ekkada: Form button (form header lo button), Form context menu (form header right-click / form title pakkana ☰ menu), Form link (form kinda "Related Links"). Order = buttons order, Hint = mouse hover tooltip, Active = on / off.',
        'List lo: List banner button, List choice, List context menu ("UI Actions on the Table List" lesson).',
        'Show insert = kotha (inka save avvani) record form lo kanipistundi; Show update = existing record form lo. Existing record ki matrame kavali ante Show update tick, Show insert untick. (UI Action form lo "Isolate script" checkbox kuda undi — client UI Action ki kuda Client Script laage strict mode (DOM / window ledu) ani 📄 docs; PDI lo easy ga test cheyyalem.)',
      ],
    },
  ],
  quiz: [
    q('Condition lo emi rastam?', ['Oka line JavaScript expression (true/false)', 'Pedda multi-line function with loops', 'SQL query (SELECT ... WHERE ...)', 'Table peru mariyu view peru list'], 0, 'One-line expression — true ayithe button kanipistundi.'),
    q('Condition ekkada evaluate avtundi?', ['Server lo, form load time', 'Browser lo live ga prathi click ki', 'Email lo', 'List lo'], 0, 'Server lo form load time lo — g_form ledu.'),
    q('Role unnavaalake button chupinchali?', ['Condition lo gs.hasRole("itil")', 'Order field lo role number pettadam', 'Hint field lo role peru rayadam', 'Onclick field lo role peru rayadam'], 0, 'Condition lo gs.hasRole("itil") — sure way (admin ki ellappudu true, kabatti non-admin ga impersonate chesi test). "Requires role" related list nee PDI default UI Action form lo ledu — vere view lo undochu ⚠️ PDI lo chudu.', ['requires-role']),
    q('Existing record lo matrame button?', ['Show update tick, Show insert untick', 'Show insert tick, Show update untick', 'Client tick cheyyadam', 'Order 0 pettadam'], 0, 'Show update = saved record form; Show insert = kotha record form.'),
    q('Nee PDI lo current.getValue("active") == "true" em istundi (active incident)?', ['false — getValue "1" istundi', 'true — getValue "true" istundi', 'Error vastundi, script aagutundi', 'null — active field ledu kabatti'], 0, 'PDI lo getValue true/false field ki "1" / "0" istundi — "1" == "true" false. current.active == true vaadu.'),
  ],
  exercises: [
    jx('cs-ua4', 1, 'Resolve button condition', 'easy', {
      server: true,
      scenario: EXTRA,
      task: 'canShow(current) function rayi: incident ACTIVE ayithe mariyu state 6 kakapothe matrame true return chey. getValue("active") == "true" vaadaku (PDI lo "1" vastundi) — current.active == true vaadu.',
      starter: 'function canShow(current) {\n  // active AND state 6 kaadu\n  return false;\n}',
      hint: [
        'Rendu conditions rendu nijam kavali → &&. Active check ki element ni direct ga true tho compare chey.',
        'current.active == true   &&   current.state != 6',
        'function canShow(current) { return current.active == true && current.state != 6; }',
      ],
      solution: 'function canShow(current) {\n  return current.active == true && current.state != 6;\n}',
      explain: 'Condition field lo exact ga ide line rastaru. Tests: INC1 (active, In Progress) true; INC22 (Resolved kani inka active — nee PDI lo tested: Resolved incident active = true ga untundi, Closed ayinappude active false) false — active check okkate chalu ani anukunte ikkade dorikipotav; INC21, INC5 (Closed, inactive) false.',
      tests: [{ label: 'INC1 true, INC22 (Resolved) false, INC21 (Closed) false, INC5 (Closed) false', expr: COND('canShow', ['INC0010001', 'INC0010022', 'INC0010021', 'INC0010005']), expect: [true, false, false, false] }],
    }),
    jx('cs-ua4', 2, 'Unassigned P1', 'easy', {
      server: true,
      task: 'canShow(current) rayi ("Take ownership" button kosam): priority 1 mariyu assigned_to EMPTY ayithe true. Empty check ki current.assigned_to.nil() vaadu (PDI lo empty field getValue null istundi, "" kaadu).',
      starter: 'function canShow(current) {\n  // priority 1 AND evaru assign avvaledu\n  return false;\n}',
      hint: [
        'Rendu conditions: P1 aa? + evaru assign avvaledaa? — && tho kalupu. Empty check ki .nil().',
        'current.priority == 1   &&   current.assigned_to.nil()',
        'function canShow(current) { return current.priority == 1 && current.assigned_to.nil(); }',
      ],
      solution: 'function canShow(current) {\n  return current.priority == 1 && current.assigned_to.nil();\n}',
      explain: 'INC2 P1 + unassigned → true. INC8 P1 kani assigned → false. INC6 unassigned kani P4 → false. (Priority chadavadam OK — set cheyyadam matrame vaddu.)',
      tests: [{ label: 'INC2 true, INC8 false, INC6 false, INC1 false', expr: COND('canShow', ['INC0010002', 'INC0010008', 'INC0010006', 'INC0010001']), expect: [true, false, false, false] }],
    }),
    jx('cs-ua4', 3, 'Role + state', 'medium', {
      server: true,
      scenario: EXTRA,
      task:'canShow(current) rayi: gs.hasRole("itil") true mariyu state 6 kante takkuva (Number() tho) ayithe true.',
      starter: 'function canShow(current) {\n  // itil role undi AND state < 6\n  return false;\n}',
      hint: [
        'Rendu conditions: role undi AND state 6 kante chinnadi. Rendu true ayithe matrame true — && vaadu.',
        "Role check gs nunchi: gs.hasRole('itil').   State: getValue string kabatti Number() tho marchi < 6 compare chey.",
        "function canShow(current) { return gs.hasRole('itil') && Number(current.getValue('state')) < 6; }",
      ],
      solution: "function canShow(current) {\n  return gs.hasRole('itil') && Number(current.getValue('state')) < 6;\n}",
      explain: 'Practice user admin — nee PDI lo kuda admin ki gs.hasRole(edaina) true. Anduke rendo test lo itil LENI user ni simulate chesam. Nee PDI lo non-admin user ni impersonate chesi chudu. INC22 Resolved (6) — 6 < 6 false, kabatti <= 6 rasthe ikkade fail.',
      tests: [
        { label: 'INC1 true, INC22 (Resolved 6) false, INC5 (Closed) false, INC3 true', expr: COND('canShow', ['INC0010001', 'INC0010022', 'INC0010005', 'INC0010003']), expect: [true, false, false, true] },
        { label: 'itil role LENI user ki false', expr: "(function () { var real = gs.hasRole; gs.hasRole = function (r) { return r != 'itil'; }; var g = new GlideRecord('incident'); g.get('number', 'INC0010001'); var out = canShow(g); gs.hasRole = real; return out; })()", expect: false },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to "Close action script" ----
    jx('cs-ua4', 5, 'Close button condition (Resolved matrame)', 'medium+', {
      server: true,
      scenario: EXTRA,
      task: 'canShow(current) rayi — "Close" button Resolved (state 6) incidents ki matrame kanipinchali. state 6 ayithe true, lekapothe false. 🧰 Vaade words: current, getValue(), ==',
      starter: "function canShow(current) {\n  // Step 1: state teesuko\n  // Step 2: Resolved aa? ani check chesi return chey\n  return false;\n}",
      hint: [
        'Okate condition: state Resolved aa? getValue string istundi kabatti "6" (quotes tho) tho compare chey.',
        "return current.getValue('state') == <Resolved value>;",
        "function canShow(current) { return current.getValue('state') == '6'; }",
      ],
      solution: "function canShow(current) {\n  return current.getValue('state') == '6';\n}",
      explain: 'UI Action Condition field lo idi current.state == 6 laaga rastaru. INC0010022 Resolved → true, INC0010001 In Progress → false, INC0010005 Closed → false.',
      tests: [{ label: 'INC22 (Resolved) true, INC1 false, INC5 (Closed) false', expr: COND('canShow', ['INC0010022', 'INC0010001', 'INC0010005']), expect: [true, false, false] }],
    }),
    jx('cs-ua4', 6, 'Close script (guard lekunda)', 'medium+', {
      server: true,
      scenario: REC(RESOLVED, 'inc_res'),
      task: 'Close UI Action script rayi (current = INC0010022, Resolved — Resolution code + notes already unnayi): state = 7 set chesi current.update() chey, tarvata gs.info("Closed " + number) log chey. 🧰 Vaade words: current, setValue(), update(), getValue(), gs.info',
      starter: '// Step 1: state 7 ki set chey\n// Step 2: save chey\n// Step 3: "Closed " + number log chey\n',
      hint: [
        'Moodu lines: set, save, log. Log lo number current nunchi teesuko.',
        "current.setValue('state', 7);   current.update();   tarvata gs.info('Closed ' + ...);",
        "current.setValue('state', 7); current.update(); gs.info('Closed ' + current.getValue('number'));",
      ],
      solution: "current.setValue('state', 7);\ncurrent.update();\ngs.info('Closed ' + current.getValue('number'));",
      explain: 'Server UI Action script = button click tarvata server lo run ayye code. update() lekapothe save avvadu. Close ki Resolution code + notes kavali (Data Policy) — Resolved incident lo avi already untayi. Variant lo vere Resolved incident (INC0010001) — number hardcode chesthe fail.',
      tests: [
        { label: 'Table lo state 7', expr: DB(['state'], 'inc_res'), expect: ['7'] },
        { label: 'log', logs: ['Closed INC0010022'] },
      ],
      variants: [{ name: 'vere Resolved incident (INC0010001)', scenario: REC(INC1_RESOLVED), tests: [{ label: 'Table lo state 7', expr: DB(['state']), expect: ['7'] }, { label: 'log', logs: ['Closed INC0010001'] }] }],
    }),
    jx('cs-ua4', 7, 'Already closed aa? (if / else message)', 'medium+', {
      server: true,
      task: 'closeMsg(current) function rayi: state "7" ayithe "Already closed" return chey, lekapothe "Can close" return chey. (Condition button hide chestundi, kani script lo kuda ee guard pettali — "Close action script" exercise lo vaadatam.) 🧰 Vaade words: current, getValue(), if / else, return',
      starter: "function closeMsg(current) {\n  // state '7' → 'Already closed', lekapothe → 'Can close'\n  return '';\n}",
      hint: [
        'if lo state Closed aa ani check — true ayithe oka text, lekapothe inkoka text return.',
        "if (current.getValue('state') == '7') { return ...; }   return ...;",
        "if (current.getValue('state') == '7') { return 'Already closed'; } return 'Can close';",
      ],
      solution: "function closeMsg(current) {\n  if (current.getValue('state') == '7') {\n    return 'Already closed';\n  }\n  return 'Can close';\n}",
      explain: 'Rendu branches test avtayi (state 6 → Can close, state 7 → Already closed). Button hide ayina URL tho direct ga pilavochu — anduke script lo guard.',
      tests: [{ label: 'state 6 → Can close, state 7 → Already closed', expr: "['6', '7'].map(function (s) { var g = new GlideRecord('incident'); g.get('number', 'INC0010001'); g.setValue('state', s); return closeMsg(g); })", expect: ['Can close', 'Already closed'] }],
    }),
    jx('cs-ua4', 4, 'Close action script', 'hard', {
      server: true,
      scenario: REC(RESOLVED, 'inc_res'),
      task: 'Close UI Action script rayi: state already "7" ayithe gs.info("Already closed") matrame. Lekapothe state = 7, update(), gs.info("Closed " + number). (Ikkada current = INC0010022, Resolved; variants lo already Closed INC0010005, inkoka Resolved incident.)',
      starter: '// UI Action: Close (server)\n// already Closed ayithe → log matrame\n// lekapothe → state 7, save, log\n',
      hint: [
        '"Close script (guard lekunda)" + "Already closed aa?" kalipi: if lo Closed check (log), else lo set + save + log.',
        "if (current.getValue('state') == '7') { gs.info('Already closed'); } else { setValue('state', 7); update(); gs.info('Closed ' + ...); }",
        "if (current.getValue('state') == '7') { gs.info('Already closed'); } else { current.setValue('state', 7); current.update(); gs.info('Closed ' + current.getValue('number')); }",
      ],
      solution: "if (current.getValue('state') == '7') {\n  gs.info('Already closed');\n} else {\n  current.setValue('state', 7);\n  current.update();\n  gs.info('Closed ' + current.getValue('number'));\n}",
      explain: 'Condition hide chestundi kani script lo kuda guard pettadam safe (URL tho direct ga pilavochu). Variants: already Closed INC0010005 (log matrame, em marakudadu), inkoka Resolved incident (INC0010001).',
      tests: [
        { label: 'Table lo state 7', expr: DB(['state'], 'inc_res'), expect: ['7'] },
        { label: 'log', logs: ['Closed INC0010022'] },
      ],
      variants: [
        { name: 'already closed (INC0010005)', scenario: REC({}, 'inc5'), tests: [{ label: 'log', logs: ['Already closed'] }, { label: 'Table lo state 7 laage', expr: DB(['state'], 'inc5'), expect: ['7'] }] },
        { name: 'vere Resolved incident (INC0010001)', scenario: REC(INC1_RESOLVED), tests: [{ label: 'Table lo state 7', expr: DB(['state']), expect: ['7'] }, { label: 'log', logs: ['Closed INC0010001'] }] },
      ],
    }),
  ],
}

/* 22 — UI Actions on table list */
// List banner button (client) → g_list.getChecked() → GlideAjax → Script Include (IncidentListAjax.assignToMe) does the updates.
const AJAX = "__x.ajaxCalls.map(function (c) { return c.name + ' ' + c.params.sysparm_name + ' ' + c.params.sysparm_ids; })"
const LIST = (checked) => ({ table: 'incident', checked })
const si = (body) => "var IncidentListAjax = Class.create();\nIncidentListAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {\n  assignToMe: function () {\n" + body + "  },\n  type: 'IncidentListAjax'\n});"
const SI_QUERY = "    var ids = String(this.getParameter('sysparm_ids'));\n    var gr = new GlideRecord('incident');\n    gr.addQuery('sys_id', 'IN', ids);\n    gr.query();\n"
const SI_GUARD = "    if (gr.getRowCount() != ids.split(',').length) {\n      return 'Mismatch';\n    }\n"
const SI_LOOP = "    var count = 0;\n    while (gr.next()) {\n      gr.setValue('assigned_to', gs.getUserID());\n      gr.update();\n      count++;\n    }\n    return count;\n"
const SI_SKIP_LOOP = (extra) => "    var assigned = 0;\n    var skipped = 0;\n    while (gr.next()) {\n      if (!gr.assigned_to.nil()) {\n        skipped++;\n        continue;\n      }\n      gr.setValue('assigned_to', gs.getUserID());\n" + extra + "      gr.update();\n      assigned++;\n    }\n    return 'Assigned ' + assigned + ', skipped ' + skipped;\n"
const SI_BASIC = si(SI_QUERY + SI_LOOP)
const SI_FULL = si("    var ids = String(this.getParameter('sysparm_ids'));\n    if (ids == '') {\n      return 'Nothing selected';\n    }\n    var gr = new GlideRecord('incident');\n    gr.addQuery('sys_id', 'IN', ids);\n    gr.query();\n" + SI_GUARD + SI_SKIP_LOOP("      gr.setValue('state', 2);\n"))
// the Script Include behind the list button — the client exercises call it through GlideAjax
const LIST_AJAX = { name: 'IncidentListAjax', code: SI_BASIC }
const CALL_SI = (ids) => `String(callAjax(IncidentListAjax, 'assignToMe', { sysparm_ids: '${ids}' }))`
const BUD_ON_INC6 = { seed: { incident: [{ sys_id: 'inc6', assigned_to: 'u_bud' }] } }
const CLIENT_LIST_SOLUTION = "function assignSelected() {\n  var ids = g_list.getChecked();\n  if (ids == '') {\n    alert('Select incidents first');\n    return;\n  }\n  var n = ids.split(',').length;\n  if (!confirm('Assign ' + n + ' incidents to you?')) {\n    return;\n  }\n  var ga = new GlideAjax('IncidentListAjax');\n  ga.addParam('sysparm_name', 'assignToMe');\n  ga.addParam('sysparm_ids', ids);\n  ga.getXMLAnswer(function (answer) {\n    alert('Assigned ' + answer);\n  });\n}"
const ua5 = {
  id: 'cs-ua5',
  title: 'UI Actions on the Table List',
  video: 'UI Actions on Table List',
  duration: '',
  no: 22,
  blurb: 'List banner button, List choice, List context menu — select chesina records meeda action (g_list → GlideAjax → Script Include).',
  learn: [
    {
      h: '📃 List lo 3 rakaala UI Actions',
      body: [
        'Same UI Action record lo checkboxes tick chesi list lo chupistam (Brazil labels): List banner button — list paina button. List choice — list kinda "Actions on selected rows…" dropdown lo option. List context menu — row meeda right-click menu lo option.',
        'Form options (Form button / Form link / Form context menu) laage — okate UI Action ni form + list rendu chotla chupinchochu.',
        'List page lo g_form LEDU (form open ledu kabatti). Client list action lo g_list, alert(), confirm() vaadali. g_list list UI Action script LOPALE untundi — F12 Console lo global kaadu; Console lo try cheyyali ante GlideList2.get("incident") vaadu (nee PDI lo tested).',
      ],
    },
    {
      h: '🖧 Server list action (Client untick)',
      body: [
        'List choice / List context menu ki Client untick chesthe script SERVER lo run avtundi — select chesina PRATHI record ki okasari, current = aa record. Anduke script lo loop avasaram ledu. ⚠️ Nee PDI lo 2 records select chesi gs.addInfoMessage(current.number) tho confirm chesuko.',
        'Simple bulk changes (urgency, assignment) ki idi easiest. Priority direct ga marchaku — Data Lookup impact × urgency nunchi vastundi.',
      ],
      code: `// UI Action: Urgency High   (Client untick, List choice ✔)
// select chesina PRATHI record ki ee script okasari run avtundi
current.urgency = 1;
current.update();`,
      checks: ['list-choice-per-record'],
    },
    {
      h: '🖱️ Client list action: g_list.getChecked()',
      body: [
        'Client tick + List banner button: Onclick = urgentSelected(). g_list.getChecked() tick chesina records sys_ids ni comma tho oka STRING ga istundi ("id1,id2"). Emi select cheyyakapothe "" (empty) — PDI lo tested.',
        '"" ni split(",") chesthe [""] (length 1!) — anduke mundu empty check, tarvata count.',
        'Updates server lo jaragali — ids ni GlideAjax tho Script Include ki pampistam (next card). Answer async ga callback lo vastundi.',
      ],
      code: `// Client ✔, List banner button ✔, Onclick: urgentSelected()
function urgentSelected() {
  var ids = g_list.getChecked();           // 'id1,id2'
  if (ids == '') {
    alert('Select incidents first');
    return;
  }
  if (!confirm('Mark ' + ids.split(',').length + ' incidents urgent?')) {
    return;
  }
  var ga = new GlideAjax('IncidentListAjax');
  ga.addParam('sysparm_name', 'setUrgencyHigh');
  ga.addParam('sysparm_ids', ids);
  ga.getXMLAnswer(function (answer) {
    alert(answer + ' incidents updated');
  });
}`,
    },
    {
      h: '🖧 Script Include (Glide AJAX enabled ✔)',
      body: [
        'Script Include form lo "Glide AJAX enabled" tick (nee PDI label). this.getParameter("sysparm_ids") Java string istundi — String(...) tho marchi vaadu.',
        'sys_id IN ids query → loop → update → count return. Client ki answer STRING ga veltundi ("2").',
        '🔒 Evaraina browser nunchi ee function pilavochu — sensitive pani ayithe server lo gs.hasRole("itil") check pettu (admin ki ellappudu true — non-admin user ni impersonate chesi test chey).',
      ],
      code: `var IncidentListAjax = Class.create();
IncidentListAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  setUrgencyHigh: function () {
    var ids = String(this.getParameter('sysparm_ids'));
    var gr = new GlideRecord('incident');
    gr.addQuery('sys_id', 'IN', ids);
    gr.query();
    var count = 0;
    while (gr.next()) {
      gr.setValue('urgency', 1);
      gr.update();
      count++;
    }
    return count;
  },
  type: 'IncidentListAjax'
});`,
    },
    {
      h: '🚨 Bulk action safety',
      body: [
        'Field peru typo (sysid, sys_Id) ayithe nee PDI aa condition ni IGNORE chesi ANNI records istundi (log lo "Invalid query detected … Unknown field" — PDI lo tested). Bulk update lo idi danger: motham table marutundi!',
        'Safety: query tarvata gr.getRowCount() == ids.split(",").length aa ani check chey — match avvakapothe emi marchakunda return. ids empty ayithe query ki vellakunda mundu aapeyyi.',
        'Answer vachaka list lo kotha values kanipinchadaniki list refresh chey — callback lo g_list.refresh() (nee PDI lo undi), leda browser reload.',
      ],
      code: `gr.query();
if (gr.getRowCount() != ids.split(',').length) {
  return 'Mismatch';        // typo / wrong ids → emi marchaku
}`,
    },
  ],
  quiz: [
    q('List lo selected rows ki action cheyyadaniki?', ['List choice / List banner button UI Action', 'Before Business Rule (on update) record', 'Update Set lo selected records add chesi', 'Dictionary entry lo attribute pettadam'], 0, 'List choice / List banner button / List context menu — UI Action record lo checkboxes.'),
    q('Selected sys_ids ni query lo ela vaadatam?', ['addQuery("sys_id", "IN", ids)', 'addQuery("number", "=", ids)', 'gr.get("sys_id", ids) okkasari', 'addEncodedQuery("ids=" + ids)'], 0, 'sys_id IN "id1,id2" — comma-separated ids lo edaina okati.'),
    q('Client list action lo selected ids ela vastayi?', ['g_list.getChecked()', 'g_form.getChecked()', 'current.getChecked()', 'gs.getChecked()'], 0, 'g_list.getChecked() — comma tho ids string; emi select cheyyakapothe "".'),
    q('Bulk action mundu confirm enduku?', ['Accident ga anni marchakunda', 'Speed penchadaniki', 'Security role kosam', 'Required kaadu, avasaram ledu'], 0, 'Bulk changes risky — user ki "N incidents marchala?" ani adugu.'),
    q('Row right-click menu option edi?', ['List context menu', 'List banner button', 'Form context menu', 'Related list link'], 0, 'List context menu = list row meeda right-click. Form context menu = form header right-click.'),
  ],
  exercises: [
    jx('cs-ua5', 1, 'List choice: Urgency High', 'easy', {
      server: true,
      scenario: REC({}, 'inc6'),
      task: 'List choice UI Action (Client untick) script rayi — ee script select chesina PRATHI record ki okasari run avtundi, current = aa record. urgency ni 1 (High) chesi current.update() chey. (Priority direct ga marchaku — nee PDI lo Data Lookup impact × urgency nunchi pedutundi.)',
      starter: '// List choice: Urgency High (server)\n// current urgency 1 chesi save chey\n',
      hint: "current.setValue('urgency', 1); current.update();",
      solution: "current.setValue('urgency', 1);\ncurrent.update();",
      explain: 'Server list action lo loop ledu — platform prathi selected record ki script ni malli run chestundi. Test rendu records tho run chesindi (INC0010006, variant lo INC0010003). Nee PDI lo impact 2 + urgency 1 → priority 2 - High.',
      tests: [{ label: 'Table lo INC0010006 urgency 1', expr: DB(['urgency'], 'inc6'), expect: ['1'] }],
      variants: [{ name: 'inko selected row (INC0010003)', scenario: REC({}, 'inc3'), tests: [{ label: 'Table lo INC0010003 urgency 1', expr: DB(['urgency'], 'inc3'), expect: ['1'] }] }],
    }),
    jx('cs-ua5', 2, 'Banner (client): entha select chesav?', 'easy', {
      scenario: { list: LIST(['inc2', 'inc6']) },
      client: CALL('assignSelected'),
      task: 'List banner button (Client ✔, Onclick: assignSelected()) — assignSelected() rayi: g_list.getChecked() tho selected ids teesuko. Emi select cheyyakapothe alert("Select incidents first") chupinchi return. Lekapothe alert(count + " incidents selected"). (List lo g_form ledu — alert vaadu.)',
      starter: "function assignSelected() {\n  // Step 1: selected ids (comma string)\n  // Step 2: empty ayithe alert + return\n  // Step 3: ids lo entha ids? count alert chey\n}",
      hint: [
        'getChecked() oka string istundi ("inc2,inc6"). Empty string ayithe emi select cheyyaledu. Count kosam comma tho split chey.',
        "var ids = g_list.getChecked();   if (ids == '') { alert(...); return; }   count = ids.split(',').length",
        "var ids = g_list.getChecked(); if (ids == '') { alert('Select incidents first'); return; } alert(ids.split(',').length + ' incidents selected');",
      ],
      solution: "function assignSelected() {\n  var ids = g_list.getChecked();\n  if (ids == '') {\n    alert('Select incidents first');\n    return;\n  }\n  alert(ids.split(',').length + ' incidents selected');\n}",
      explain: 'Empty check MUNDU enduku: "".split(",") = [""] — length 1, appudu "1 incidents selected" ani tappu ga vastundi. List lo g_form undadu — alert() / confirm() vaadu.',
      tests: [{ label: '2 select chesaru', logs: ['2 incidents selected'] }],
      variants: [
        { name: 'emi select cheyyaledu', scenario: { list: LIST([]) }, tests: [{ label: 'alert', logs: ['Select incidents first'] }] },
        { name: '3 select chesaru', scenario: { list: LIST(['inc2', 'inc4', 'inc6']) }, tests: [{ label: 'alert', logs: ['3 incidents selected'] }] },
      ],
    }),
    jx('cs-ua5', 3, 'Banner: confirm + GlideAjax', 'medium', {
      scenario: { list: LIST(['inc2', 'inc6']), confirmAnswer: true, scriptInclude: LIST_AJAX },
      client: CALL('assignSelected'),
      task: 'assignSelected() poorti chey: (1) empty check (ready ga undi). (2) confirm("Assign " + n + " incidents to you?") — Cancel ayithe return. (3) GlideAjax("IncidentListAjax"): sysparm_name = "assignToMe", sysparm_ids = ids. (4) getXMLAnswer callback lo alert("Assigned " + answer). (Script Include already undi — answer = entha records assign ayyayo.)',
      starter: "function assignSelected() {\n  var ids = g_list.getChecked();\n  if (ids == '') {\n    alert('Select incidents first');\n    return;\n  }\n  // Step 2: n = entha ids; confirm — Cancel ayithe return\n  // Step 3: GlideAjax('IncidentListAjax') + sysparm_name + sysparm_ids\n  // Step 4: answer callback lo alert('Assigned ' + answer)\n}",
      hint: [
        'Count split tho, confirm false ayithe return. Tarvata GlideAjax: Script Include peru, method peru (sysparm_name), ids (sysparm_ids). Answer callback lone vastundi.',
        "if (!confirm('Assign ' + n + ' incidents to you?')) { return; }   var ga = new GlideAjax('IncidentListAjax'); ga.addParam('sysparm_name', 'assignToMe'); ga.addParam('sysparm_ids', ids);",
        "ga.getXMLAnswer(function (answer) { alert('Assigned ' + answer); });   — n = ids.split(',').length",
      ],
      solution: CLIENT_LIST_SOLUTION,
      explain: 'Client (list) → ids → GlideAjax → Script Include server lo update → answer callback lo. Answer ventane raadu (async) — alert callback LOPALE undali. Variants: Cancel / emi select cheyyaledu → GlideAjax call ledu.',
      tests: [
        { label: 'GlideAjax call (ids tho)', expr: AJAX, expect: ['IncidentListAjax assignToMe inc2,inc6'] },
        { label: 'confirm, tarvata answer', logs: ['Assign 2 incidents to you?', 'Assigned 2'] },
      ],
      variants: [
        { name: 'Cancel nokkaru', scenario: { confirmAnswer: false }, tests: [{ label: 'GlideAjax call ledu', expr: AJAX, expect: [] }, { label: 'confirm matrame', logs: ['Assign 2 incidents to you?'] }] },
        { name: 'emi select cheyyaledu', scenario: { list: LIST([]) }, tests: [{ label: 'GlideAjax call ledu', expr: AJAX, expect: [] }, { label: 'alert', logs: ['Select incidents first'] }] },
        { name: '3 select chesaru', scenario: { list: LIST(['inc2', 'inc4', 'inc7']) }, tests: [{ label: 'GlideAjax ids', expr: AJAX, expect: ['IncidentListAjax assignToMe inc2,inc4,inc7'] }, { label: 'logs', logs: ['Assign 3 incidents to you?', 'Assigned 3'] }] },
      ],
    }),
    // ---- Medium+ ladder (Script Include side): one new idea at a time, building up to "Safe bulk assign" ----
    jx('cs-ua5', 5, 'Script Include: ids tho assign', 'medium+', {
      server: true,
      task: 'IncidentListAjax lo assignToMe function rayi: sysparm_ids param (String(...) tho) teesuko; sys_id IN ids query; loop lo assigned_to = gs.getUserID() set chesi update(), count penchu; last lo count return. (Test browser GlideAjax laage pilustundi: callAjax(IncidentListAjax, "assignToMe", { sysparm_ids: "inc2,inc6" }).) 🧰 Vaade words: this.getParameter(), addQuery() (IN), next(), update()',
      starter: si("    // Step 1: sysparm_ids param teesuko (String(...) tho)\n    // Step 2: incident lo sys_id IN ids query\n    // Step 3: loop lo assigned_to = login user, save, count++\n    // Step 4: count return\n"),
      hint: [
        'Client pampina ids comma string. IN operator tho aa sys_ids anni okesari query chesi, prathi record ki assign + save.',
        "var ids = String(this.getParameter('sysparm_ids'));   gr.addQuery('sys_id', 'IN', ids);   gr.query();   var count = 0;",
        "while (gr.next()) { gr.setValue('assigned_to', gs.getUserID()); gr.update(); count++; }   return count;",
      ],
      solution: SI_BASIC,
      explain: 'this.getParameter() Java string istundi — String(...) tho JavaScript string chesi split / compare cheyyi. Return chesina count client ki answer ("2") ga veltundi.',
      tests: [
        { label: "'inc2,inc6' → 2", expr: CALL_SI('inc2,inc6'), expect: '2' },
        { label: 'Table: INC2 + INC6 = me, INC7 marchaledu', expr: DBS('assigned_to', ['inc2', 'inc6', 'inc7']), expect: ['u_admin', 'u_admin', null] },
        { label: "'inc4' → 1", expr: CALL_SI('inc4'), expect: '1' },
      ],
    }),
    jx('cs-ua5', 6, 'getRowCount() safety check', 'medium+', {
      server: true,
      task: 'assignToMe lo query tarvata safety check add chey: gr.getRowCount() selected ids count (ids.split(",").length) tho match avvakapothe "Mismatch" return chey — emi marchakunda. (Field typo ayithe PDI condition ignore chesi ANNI rows istundi — ee check aa danger nunchi kapadutundi.) 🧰 Vaade words: getRowCount(), split(), return',
      starter: si(SI_QUERY + "    // TODO: rows count != ids count ayithe 'Mismatch' return (emi marchakunda)\n" + SI_LOOP),
      hint: [
        'Query entha rows ichindo vs client entha ids pampindo — rendu equal kakapothe aagu. Check loop KANTE MUNDU.',
        "if (gr.getRowCount() != ids.split(',').length) { return ...; }",
        "if (gr.getRowCount() != ids.split(',').length) { return 'Mismatch'; }",
      ],
      solution: si(SI_QUERY + SI_GUARD + SI_LOOP),
      explain: '"inc7,nope" → 1 row kani 2 ids → Mismatch, INC7 kuda marchaledu. sys_id ni "sysid" ani typo chesthe ee site lo kuda 8 rows vastayi → Mismatch → safe.',
      tests: [
        { label: "'inc7,nope' → Mismatch", expr: CALL_SI('inc7,nope'), expect: 'Mismatch' },
        { label: 'Mismatch tarvata INC7 marchaledu', expr: DBS('assigned_to', ['inc7']), expect: [null] },
        { label: "'inc2,inc6' → 2", expr: CALL_SI('inc2,inc6'), expect: '2' },
        { label: 'Table: INC2 + INC6 = me', expr: DBS('assigned_to', ['inc2', 'inc6']), expect: ['u_admin', 'u_admin'] },
      ],
    }),
    jx('cs-ua5', 7, 'Already assigned ni skip chey', 'medium+', {
      server: true,
      scenario: BUD_ON_INC6,
      task: 'Vere vaalla tickets teesukokudadu: loop lo record already evarikaina assign ayi unte (assigned_to.nil() false) skipped++ chesi continue; lekapothe assign + update + assigned++. Last lo "Assigned X, skipped Y" return chey. (Ikkada INC0010006 Bud ki assign ayi undi.) 🧰 Vaade words: nil(), continue, ++',
      starter: si(SI_QUERY + SI_GUARD + "    // TODO: assigned = 0, skipped = 0\n    // loop: evaraina already unte skipped++ + continue; lekapothe assign + save + assigned++\n    // last lo 'Assigned ' + assigned + ', skipped ' + skipped return\n"),
      hint: [
        'Rendu counters loop bayata 0 tho. Loop lo mundu "already assigned aa?" check — avunu ante skip (continue), kinda unna assign lines run avvakudadu.',
        "if (!gr.assigned_to.nil()) { skipped++; continue; }   tarvata setValue + update + assigned++",
        "var assigned = 0; var skipped = 0; while (gr.next()) { if (!gr.assigned_to.nil()) { skipped++; continue; } gr.setValue('assigned_to', gs.getUserID()); gr.update(); assigned++; } return 'Assigned ' + assigned + ', skipped ' + skipped;",
      ],
      solution: si(SI_QUERY + SI_GUARD + SI_SKIP_LOOP('')),
      explain: '.nil() = empty aa? Empty kakapothe evaro already pani chestunnaru — skip. getValue("assigned_to") == "" check PDI lo empty ki kuda false (null) — anduke .nil().',
      tests: [
        { label: "'inc2,inc6,inc7' → Assigned 2, skipped 1", expr: CALL_SI('inc2,inc6,inc7'), expect: 'Assigned 2, skipped 1' },
        { label: 'Table: INC2 me, INC6 Bud ki ne, INC7 me', expr: DBS('assigned_to', ['inc2', 'inc6', 'inc7']), expect: ['u_admin', 'u_bud', 'u_admin'] },
        { label: "'inc4' → Assigned 1, skipped 0", expr: CALL_SI('inc4'), expect: 'Assigned 1, skipped 0' },
      ],
    }),
    jx('cs-ua5', 4, 'Safe bulk assign (full Script Include)', 'hard', {
      server: true,
      scenario: BUD_ON_INC6,
      task: 'assignToMe poorti ga rayi: (1) ids empty ("") ayithe "Nothing selected" return — query ki vellakunda. (2) sys_id IN query; getRowCount() ids count tho match avvakapothe "Mismatch". (3) Loop: already assigned ayithe skip; lekapothe assigned_to = gs.getUserID(), state = 2 (In Progress), update(). (4) "Assigned X, skipped Y" return.',
      starter: si("    // TODO: empty guard → query → Mismatch guard → loop (skip / assign + state 2) → summary return\n"),
      hint: [
        '"ids tho assign" + "getRowCount() safety check" + "Already assigned ni skip chey" kalipi, mundu empty guard, loop lo state 2 kuda.',
        "var ids = String(this.getParameter('sysparm_ids')); if (ids == '') { return 'Nothing selected'; }   → query → if (gr.getRowCount() != ids.split(',').length) { return 'Mismatch'; }",
        "while (gr.next()) { if (!gr.assigned_to.nil()) { skipped++; continue; } gr.setValue('assigned_to', gs.getUserID()); gr.setValue('state', 2); gr.update(); assigned++; } return 'Assigned ' + assigned + ', skipped ' + skipped;",
      ],
      solution: SI_FULL,
      explain: 'Empty ids tho IN query PDI lo ela behave chestundo risk teesukokunda mundu aapestam. Mismatch guard = typo / wrong ids safety. Skip = vere vaalla tickets teesukoru. Idi real bulk action ki manchi template.',
      tests: [
        { label: "'' → Nothing selected", expr: CALL_SI(''), expect: 'Nothing selected' },
        { label: "'inc2,nope' → Mismatch", expr: CALL_SI('inc2,nope'), expect: 'Mismatch' },
        { label: 'Mismatch tarvata INC2 marchaledu', expr: DBS('assigned_to', ['inc2']), expect: [null] },
        { label: "'inc2,inc6,inc7' → Assigned 2, skipped 1", expr: CALL_SI('inc2,inc6,inc7'), expect: 'Assigned 2, skipped 1' },
        { label: 'Table assigned_to: INC2 me, INC6 Bud, INC7 me', expr: DBS('assigned_to', ['inc2', 'inc6', 'inc7']), expect: ['u_admin', 'u_bud', 'u_admin'] },
        { label: 'Table state: INC2 2, INC6 1 (skip), INC7 2', expr: DBS('state', ['inc2', 'inc6', 'inc7']), expect: ['2', '1', '2'] },
      ],
    }),
  ],
}

export const CS_LESSONS_D = [ua1, ua2, ua3, ua4, ua5]
