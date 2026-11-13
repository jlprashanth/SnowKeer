// Stage 3 (client) lessons 4–8: GlideForm continuation, GlideList, Client Scripts, onLoad / onChange use cases.
import { q, jx } from './lessonKit.js'

const LOAD = { trigger: { type: 'onLoad' } }
const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const CALL = (fn) => ({ trigger: { type: 'call', fn } })
const MSGS = '__msgs.map(function (m) { return m.text })'
const GUARD = "  if (isLoading || newValue === '') {\n    return;\n  }\n"
const ONCHANGE = (body) => `function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n${GUARD}${body}}`

/* 4 — GlideForm continuation */
const glform2 = {
  id: 'cs-glform2',
  title: 'GlideForm Continuation',
  video: 'GlideForm Continuation',
  duration: '',
  no: 4,
  blurb: 'getReference, related lists, sections, field messages — g_form lo migilina useful methods.',
  scratch: {
    starter: "function onLoad() {\n  g_form.hideRelatedLists();\n  g_form.flash('priority', '#ffcc00', 0);\n}",
    scenario: { form: { values: { priority: '2' } } },
    client: LOAD,
  },
  learn: [
    {
      h: '🔗 getReference — reference record details',
      body: [
        'Caller field lo user sys_id matrame untundi. Aa user email, department lanti details kavali ante g_form.getReference("caller_id", callback) vaadali.',
        'Callback lo record object vastundi: caller.email, caller.name ... Important: "callback form" ye vaadu. Callback lekunda vaadithe browser freeze avtundi (synchronous call) — adi Best Practice kaadu.',
        '⚠️ getReference prathi sari server ki call chestundi. Chala sarlu vaadithe form slow — ante GlideAjax / g_scratchpad better. (Next lessons lo vastundi.)',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading || newValue === '') return;
  g_form.getReference('caller_id', function (caller) {
    g_form.setValue('description', 'Caller email: ' + caller.email);
  });
}`,
    },
    {
      h: '🗂️ Related lists, sections, flash',
      body: [
        'g_form.hideRelatedLists() / showRelatedLists() — form kinda unna related lists anni hide/show. g_form.hideRelatedList("name") — oka list matrame.',
        'g_form.setSectionDisplay("section_name", false) — form section (tab) hide. g_form.flash("field", "#ffcc00", 0) — field ni konchem sepu highlight chestundi.',
        '⚠️ setSectionDisplay, related list names — Brazil lo exact names nee PDI lo check chesuko (memory nunchi rasanu).',
      ],
      code: `g_form.hideRelatedLists();
g_form.setSectionDisplay('notes', false);
g_form.flash('priority', '#ffcc00', 0);`,
    },
    {
      h: '💬 Field messages cleanup',
      body: [
        'showFieldMsg tho pettina messages ni hideFieldMsg("field") tho teeseyyali. g_form.hideAllFieldMsgs() anni field messages teesestundi. g_form.clearMessages() top banner messages teesestundi.',
        'onChange lo mundu paata message clear chesi, tarvata kotta message pettadam manchi habit — leda messages pile avtayi.',
      ],
      code: `g_form.hideFieldMsg('description');
if (newValue == '6') {
  g_form.showFieldMsg('description', 'Resolution notes rayi', 'error');
}`,
    },
  ],
  quiz: [
    q('Reference field nunchi aa record yokka email ela teesukuntam?', ['g_form.getValue("caller_id.email")', 'g_form.getReference("caller_id", callback)', 'gs.getUser()', 'g_user.email'], 1, 'getReference(field, callback) — callback lo record vastundi.'),
    q('getReference ni callback lekunda vaadithe?', ['Fast ga untundi, extra benefit', 'Browser block avtundi (synchronous)', 'Error vastundi, run avvadu', 'Em maradu, same ga untundi'], 1, 'Callback lekapothe synchronous call — browser freeze. Ellappudu callback vaadu.'),
    q('Form kinda unna anni related lists hide cheyyali?', ['g_form.hideRelatedLists()', 'g_form.hideAll()', 'g_form.setDisplay("related", false)', 'gs.hideLists()'], 0, 'hideRelatedLists().'),
    q('Anni field messages ni oka saari teeseyyali?', ['g_form.clearMessages()', 'g_form.hideAllFieldMsgs()', 'g_form.removeAll()', 'g_form.clearValue()'], 1, 'hideAllFieldMsgs() field messages teesestundi (clearMessages top banner ki).'),
    q('getReference ki better alternative (performance)?', ['alert()', 'GlideAjax leda g_scratchpad', 'Direct GlideRecord client lo', 'setTimeout'], 1, 'GlideAjax / g_scratchpad server ni takkuva sarlu pilustayi leda controlled ga.'),
  ],
  exercises: [
    jx('cs-glform2', 1, 'New record lo related lists hide', 'easy', {
      scenario: { form: { isNew: true, values: {} } },
      client: LOAD,
      task: 'onLoad lo: form new record ayithe related lists anni hide chey (g_form.hideRelatedLists).',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (g_form.isNewRecord()) { g_form.hideRelatedLists(); }',
      solution: 'function onLoad() {\n  if (g_form.isNewRecord()) {\n    g_form.hideRelatedLists();\n  }\n}',
      explain: 'New record ki related lists ki data ledu kabatti hide cheyyadam clean ga untundi.',
      tests: [{ label: 'related lists hidden', expr: '__x.relatedHidden', expect: true }],
    }),
    jx('cs-glform2', 2, 'Closed ayithe section hide', 'easy', {
      scenario: { form: { values: { state: '7' } } },
      client: LOAD,
      task: 'onLoad lo: state "7" (Closed) ayithe "notes" section ni hide chey (g_form.setSectionDisplay("notes", false)).',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (g_form.getValue("state") == "7") { g_form.setSectionDisplay("notes", false); }',
      solution: "function onLoad() {\n  if (g_form.getValue('state') == '7') {\n    g_form.setSectionDisplay('notes', false);\n  }\n}",
      explain: 'Section name internal name — nee PDI lo form layout lo confirm chesuko.',
      tests: [{ label: 'notes section hidden', expr: '__x.hiddenSections', expect: ['notes'] }],
    }),
    jx('cs-glform2', 3, 'Caller email description lo', 'medium', {
      scenario: { form: { values: {} } },
      client: CHG('caller_id', '', 'u_bud'),
      task: 'onChange (caller_id) rayi: caller marchinappudu g_form.getReference tho caller record techchuko, description lo "Caller email: <email>" ani pettu. (Guard + callback vaadu.)',
      starter: ONCHANGE('  // TODO: g_form.getReference("caller_id", function (caller) { ... })\n'),
      hint: [
        'Caller details kavali ante getReference vaadu — result callback function lo vastundi. setValue aa callback LOPALE rayali.',
        'Shape: g_form.getReference("caller_id", function (caller) { ... });   — lopala caller.email vaadu.',
        'g_form.getReference("caller_id", function (caller) { g_form.setValue("description", "Caller email: " + caller.email); });',
      ],
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller email: ' + caller.email);\n  });\n"),
      explain: 'Callback lo caller record vastundi. Value set cheyyadam callback ki lopale cheyyali — adi async ga run avtundi.',
      tests: [{ label: 'description set', expr: "g_form.getValue('description')", expect: 'Caller email: bud.richman@example.com' }],
    }),
    jx('cs-glform2', 5, 'Resolved ayithe field message', 'medium+', {
      scenario: { form: { values: { state: '6', description: '' } } },
      client: CHG('state', '2', '6'),
      task: 'onChange (state) rayi: newValue "6" (Resolved) ayithe description field kinda "Resolution notes rayi" ani ERROR field message chupinchu (g_form.showFieldMsg, type "error"). 🧰 Vaade words: newValue, g_form.showFieldMsg()',
      starter: ONCHANGE("  // Step 1: newValue '6' aa ani check chey (if)\n\n  // Step 2: aithe description kinda error field message pettu\n  //         (field name, message text, type — moodu arguments)\n"),
      hint: [
        'Marchina value newValue lo undi (string). "6" tho == compare chey. Message field kinda kavali — form top banner kaadu.',
        'g_form.showFieldMsg(field, message, type)  — type ki "error" ivvu.',
        'if (newValue == "6") { g_form.showFieldMsg("description", "Resolution notes rayi", "error"); }',
      ],
      solution: ONCHANGE("  if (newValue == '6') {\n    g_form.showFieldMsg('description', 'Resolution notes rayi', 'error');\n  }\n"),
      explain: 'showFieldMsg field kinda message pedutundi (addInfoMessage form top lo). Third argument "info" / "error" message rangu decide chestundi.',
      tests: [{ label: 'description kinda error message', expr: '__f.description.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] }],
      variants: [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', description: '' } } }, client: CHG('state', '6', '2'), tests: [{ label: 'message raakudadu', expr: '__f.description.msgs.length', expect: 0 }] }],
    }),
    jx('cs-glform2', 6, 'Mandatory on / off (boolean tho)', 'medium+', {
      scenario: { form: { values: { state: '2', description: '' }, mandatory: ['description'] } },
      client: CHG('state', '6', '2'),
      task: 'Description ippudu mandatory ga undi. onChange (state) rayi: state "6" ayithe description mandatory, vere state ayithe mandatory TEESEYYI. if/else badulu oke line: g_form.setMandatory("description", newValue == "6"). 🧰 Vaade words: g_form.setMandatory(), newValue, ==',
      starter: ONCHANGE("  // newValue == '6'  →  true leda false istundi\n  // TODO: aa true/false ni direct ga setMandatory ki ivvu\n"),
      hint: [
        'Comparison (newValue == "6") result ye true / false. setMandatory ki rendo argument ga adi ivvochu — if/else avasaram ledu.',
        'g_form.setMandatory("description", <boolean>);   — boolean place lo comparison pettu.',
        'g_form.setMandatory("description", newValue == "6");',
      ],
      solution: ONCHANGE("  g_form.setMandatory('description', newValue == '6');\n"),
      explain: 'Mandatory pettadam enta mukhyamo, state marchinappudu teeseyyadam kuda anthe mukhyam — leda user save cheyyalekapotundi. Boolean expression tho rendu cases oke line lo.',
      tests: [{ label: 'state 2 → mandatory teesesindi', expr: '__f.description.mandatory', expect: false }],
      variants: [{ name: 'state 6 ayithe', scenario: { form: { values: { state: '6', description: '' } } }, client: CHG('state', '2', '6'), tests: [{ label: 'description mandatory', expr: '__f.description.mandatory', expect: true }] }],
    }),
    jx('cs-glform2', 7, 'Paata message clear, tarvata kotta message', 'medium+', {
      scenario: { form: { values: { state: '6', description: '' } } },
      client: CHG('state', '2', '6'),
      task: 'Description kinda already oka paata message undi (starter lo top line — adi marchaku). onChange (state) rayi: MUNDU description field messages teeseyyi (g_form.hideFieldMsg), tarvata state "6" ayithe "Resolution notes rayi" error field message chupinchu. Last lo oke message undali. 🧰 Vaade words: g_form.hideFieldMsg(), g_form.showFieldMsg()',
      starter: "// Practice setup: description kinda already paata message undi (ee line marchaku)\ng_form.showFieldMsg('description', 'Paata message', 'info');\n\n" + ONCHANGE('  // TODO: mundu clean\n  // TODO: tarvata condition + kotta message\n'),
      hint: [
        'Order mukhyam: clean first, show next. Clean cheyyadam condition bayata (prathi sari) jaragali.',
        'g_form.hideFieldMsg("description");  tarvata  if (newValue == "6") { ...showFieldMsg... }',
        'g_form.hideFieldMsg("description"); if (newValue == "6") { g_form.showFieldMsg("description", "Resolution notes rayi", "error"); }',
      ],
      solution: "// Practice setup: description kinda already paata message undi (ee line marchaku)\ng_form.showFieldMsg('description', 'Paata message', 'info');\n\n" + ONCHANGE("  g_form.hideFieldMsg('description');\n  if (newValue == '6') {\n    g_form.showFieldMsg('description', 'Resolution notes rayi', 'error');\n  }\n"),
      explain: 'hideFieldMsg lekapote prathi state marpuki messages pile avtayi. Clean → condition → show: ide pattern next (hard) exercise lo kuda.',
      tests: [{ label: 'oke error message', expr: '__f.description.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] }],
      variants: [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', description: '' } } }, client: CHG('state', '6', '2'), tests: [{ label: 'paata message kuda pooyindi', expr: '__f.description.msgs.length', expect: 0 }] }],
    }),
    jx('cs-glform2', 4, 'Resolved → resolution notes mandatory', 'hard', {
      scenario: { form: { values: { state: '6', description: '' } } },
      client: CHG('state', '2', '6'),
      task: 'onChange (state) rayi: mundu description field message hide chey (hideFieldMsg). Tarvata state "6" ayithe description mandatory chesi, kinda "Resolution notes rayi" ani error field message chupinchu; lekapothe mandatory teeseyyi.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Moodu pieces (medium+ 5–7 lo chesinavi): clean (hideFieldMsg) → if state 6 (mandatory + message) → else (mandatory teeseyyi).',
        'g_form.hideFieldMsg("description"); if (newValue == "6") { setMandatory true + showFieldMsg } else { setMandatory false }',
        'g_form.hideFieldMsg("description"); if (newValue == "6") { g_form.setMandatory("description", true); g_form.showFieldMsg("description", "Resolution notes rayi", "error"); } else { g_form.setMandatory("description", false); }',
      ],
      solution: ONCHANGE("  g_form.hideFieldMsg('description');\n  if (newValue == '6') {\n    g_form.setMandatory('description', true);\n    g_form.showFieldMsg('description', 'Resolution notes rayi', 'error');\n  } else {\n    g_form.setMandatory('description', false);\n  }\n"),
      explain: 'Mundu clean chesi tarvata pettadam tho duplicate messages raavu.',
      tests: [
        { label: 'description mandatory', expr: '__f.description.mandatory', expect: true },
        { label: 'oka error message matrame', expr: '__f.description.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] },
      ],
    }),
  ],
}

/* 5 — GlideList API */
const gllist = {
  id: 'cs-gllist',
  title: 'GlideList API (g_list)',
  video: 'GlideList API',
  duration: '',
  no: 5,
  blurb: 'List lo select chesina records ni client UI Action lo ela vaadali — g_list.getChecked().',
  scratch: {
    starter: "function showCount() {\n  jslog('Checked: ' + g_list.getChecked());\n}",
    scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'], query: 'active=true' } },
    client: CALL('showCount'),
  },
  learn: [
    {
      h: '📋 g_list ante emiti?',
      body: [
        'g_form form kosam. g_list LIST kosam — incident list lo checkbox tho select chesina records gurinchi. List lo UI Action (client) rasinappudu g_list vaadatam.',
        'g_list.getChecked() → select chesina records sys_ids oka comma-separated STRING ga istundi: "id1,id2,id3". Emi select cheyyakapothe empty string "".',
        'Inka: g_list.getTableName(), g_list.getQuery() (list filter), g_list.getView(). ✅ PDI lo list object (GlideList2) lo ivi unnayi, getChecked() em select cheyyakapote "" istundi. g_list.size ane method ledu. ✅ Plain list page console lo g_list undefined vastundi (adi normal) — kani list banner UI Action (client) lo g_list.getChecked() work ayindi (PDI lo tested).',
      ],
      code: `function bulkClose() {
  var ids = g_list.getChecked();     // "id1,id2"
  if (ids == '') {
    alert('Select at least one incident');
    return;
  }
  var count = ids.split(',').length;
}`,
    },
    {
      h: '✅ confirm() tho user ni adagadam',
      body: [
        'Bulk actions mundu user ni confirm cheyyadam manchidi: if (!confirm("Close 3 incidents?")) return; — user Cancel nokkite function aagipotundi.',
        'Tarvata server ki submit cheyyadaniki gsftSubmit vaadatam (UI Actions lessons lo chustam). Ikkada manam client logic ni practice chestunnam.',
      ],
      code: `function bulkClose() {
  var ids = g_list.getChecked();
  if (!confirm('Close ' + ids.split(',').length + ' incident(s)?')) {
    return;
  }
  // ... server ki pampali
}`,
    },
  ],
  quiz: [
    q('g_list.getChecked() em istundi?', ['Array of sys_ids (JavaScript array)', 'Comma-separated sys_ids string', 'Select chesina records count', 'GlideRecord object'], 1, 'Comma-separated string, e.g. "id1,id2".'),
    q('Emi select cheyyakapothe getChecked() em istundi?', ['null', 'undefined', '"" (empty string)', '0'], 2, 'Empty string "" — code lo if (!ids) tho "emi select cheyyaledu" ani check cheyyochu.'),
    q('g_list ekkada vaadatam?', ['Business Rule lo (server side)', 'List lo client UI Action lo', 'Scheduled Job lo', 'Update Set lo'], 1, 'List lo select chesina records kosam client UI Actions lo.'),
    q('Select chesina records count ela teesukuntam?', ['ids.length', 'ids.split(",").length', 'ids.count()', 'g_list.size'], 1, 'String ni split chesi length (empty check marchipoku).'),
    q('User confirm chesaka matrame munduku veltaniki?', ['alert()', 'confirm()', 'prompt()', 'jslog()'], 1, 'confirm() true/false istundi.'),
  ],
  exercises: [
    jx('cs-gllist', 1, 'Selected count', 'easy', {
      scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'] } },
      client: CALL('showCount'),
      task: 'showCount() function rayi: g_list.getChecked() nunchi count teesuko (empty ayithe 0) mariyu jslog("Selected: 2") laaga log chey.',
      starter: 'function showCount() {\n  // TODO\n}',
      hint: 'var ids = g_list.getChecked(); var n = ids == "" ? 0 : ids.split(",").length; jslog("Selected: " + n);',
      solution: "function showCount() {\n  var ids = g_list.getChecked();\n  var n = ids == '' ? 0 : ids.split(',').length;\n  jslog('Selected: ' + n);\n}",
      explain: '"".split(",") ki length 1 vastundi (empty element) — anduke empty check mundu cheyyali.',
      tests: [{ label: 'Log: Selected: 2', logs: ['Selected: 2'] }],
    }),
    jx('cs-gllist', 2, 'Emi select cheyyakapothe', 'easy', {
      scenario: { list: { table: 'incident', checked: [] } },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: emi select cheyyaledu ayithe alert("Select at least one incident") chupinchi return avvu.',
      starter: 'function bulkClose() {\n  // TODO\n}',
      hint: 'if (g_list.getChecked() == "") { alert("Select at least one incident"); return; }',
      solution: "function bulkClose() {\n  if (g_list.getChecked() == '') {\n    alert('Select at least one incident');\n    return;\n  }\n}",
      explain: 'Early return pattern: invalid case mundu handle chesi return.',
      tests: [{ label: 'alert shown', logs: ['Select at least one incident'] }],
    }),
    jx('cs-gllist', 3, 'Confirm tarvata close', 'medium', {
      scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'] }, confirmAnswer: true },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: selected n records ki confirm("Close n incident(s)?") adugu (n = count). User OK ante jslog("Closing: " + ids), Cancel ayithe return.',
      starter: 'function bulkClose() {\n  var ids = g_list.getChecked();\n  // TODO\n}',
      hint: [
        'Mundu count (split + length). confirm() true (OK) / false (Cancel) istundi — false ayithe return.',
        'var n = ids.split(",").length;   if (!confirm(...)) { return; }   tarvata jslog.',
        'var n = ids.split(",").length; if (!confirm("Close " + n + " incident(s)?")) { return; } jslog("Closing: " + ids);',
      ],
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  if (!confirm('Close ' + n + ' incident(s)?')) {\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'confirm message log lo kuda kanipistundi (practice kosam). Real browser lo dialog vastundi.',
      tests: [{ label: 'Confirm + Closing log', logs: ['Close 2 incident(s)?', 'Closing: inc1,inc2'] }],
    }),
    jx('cs-gllist', 5, 'Max 5 limit (alert matrame)', 'medium+', {
      scenario: { list: { table: 'incident', checked: ['a', 'b', 'c', 'd', 'e', 'f'] } },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: count 5 kante ekkuva ayithe alert("Max 5 at a time") chupinchi return avvu. Lekapothe jslog("Closing: " + ids). (Ippudu 6 select chesaru.) 🧰 Vaade words: g_list.getChecked(), split(), length, alert(), return',
      starter: "function bulkClose() {\n  var ids = g_list.getChecked();\n  // Step 1: count = ids ni ',' tho split chesi length\n  var n;\n\n  // Step 2: n > 5 ayithe alert('Max 5 at a time') + return\n\n  // Step 3: jslog('Closing: ' + ids)\n}",
      hint: [
        'Count teesuko, tarvata limit check. Limit daatithe alert chupinchi function nunchi bayataki (return) — Closing log raakudadu.',
        'var n = ids.split(",").length;   if (n > 5) { alert(...); return; }',
        'var n = ids.split(",").length; if (n > 5) { alert("Max 5 at a time"); return; } jslog("Closing: " + ids);',
      ],
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  if (n > 5) {\n    alert('Max 5 at a time');\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'Early return: invalid case (too many) mundu aapesi, migilina code normal case ki matrame. Limit enduku? Okkasari chala records update chesthe server slow — real UI Actions lo kuda ilanti checks pedataru.',
      tests: [{ label: 'Max 5 alert matrame', logs: ['Max 5 at a time'] }],
      variants: [{ name: '2 select chesaru', scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'] } }, tests: [{ label: 'Closing log', logs: ['Closing: inc1,inc2'] }] }],
    }),
    jx('cs-gllist', 6, 'Cancel nokkite aagipo', 'medium+', {
      scenario: { list: { table: 'incident', checked: ['inc1', 'inc2', 'inc3'] }, confirmAnswer: false },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: confirm("Close 3 incident(s)?") adugu (count tho). Ee sari user CANCEL nokkadu — appudu em cheyyakudadu (Closing log raakudadu). OK ayithe matrame jslog("Closing: " + ids). 🧰 Vaade words: confirm(), ! (not), return',
      starter: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  // TODO: confirm adugu — Cancel (false) ayithe return\n\n  // TODO: Closing log\n}",
      hint: [
        'confirm() Cancel ki false istundi. "false ayithe" ante !confirm(...) — appudu return.',
        'if (!confirm("Close " + n + " incident(s)?")) { return; }',
        'if (!confirm("Close " + n + " incident(s)?")) { return; } jslog("Closing: " + ids);',
      ],
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  if (!confirm('Close ' + n + ' incident(s)?')) {\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'Practice lo confirm question log lo kanipistundi, Cancel valla tarvata line raadu. confirm() result ni check cheyyakapote user Cancel nokkina action jarugutundi — bug!',
      tests: [{ label: 'Confirm matrame, Closing ledu', logs: ['Close 3 incident(s)?'] }],
      variants: [{ name: 'user OK nokkadu', scenario: { confirmAnswer: true }, tests: [{ label: 'Confirm + Closing', logs: ['Close 3 incident(s)?', 'Closing: inc1,inc2,inc3'] }] }],
    }),
    jx('cs-gllist', 7, 'Limit check confirm kante mundu', 'medium+', {
      scenario: { list: { table: 'incident', checked: ['inc1', 'inc2', 'inc3'] }, confirmAnswer: true },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: 1) 5 kante ekkuva ayithe alert("Max 5 at a time") + return (confirm ADAGAKUDADU), 2) lekapothe confirm("Close n incident(s)?"), Cancel ayithe return, 3) last lo jslog("Closing: " + ids). 🧰 Vaade words: g_list.getChecked(), alert(), confirm(), return',
      starter: "function bulkClose() {\n  var ids = g_list.getChecked();\n  // 1) count + limit check\n  // 2) confirm\n  // 3) action (log)\n}",
      hint: [
        'Validation (limit) FIRST, confirm tarvata. Limit daatina vaadini "Close 6?" ani adagatam waste.',
        'var n = ...; if (n > 5) { alert(...); return; }  if (!confirm(...)) { return; }  jslog(...);',
        'var n = ids.split(",").length; if (n > 5) { alert("Max 5 at a time"); return; } if (!confirm("Close " + n + " incident(s)?")) { return; } jslog("Closing: " + ids);',
      ],
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  if (n > 5) {\n    alert('Max 5 at a time');\n    return;\n  }\n  if (!confirm('Close ' + n + ' incident(s)?')) {\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'Order: validations → confirm → action. Hard exercise lo inko validation (emi select cheyyakapothe) mundu add avtundi.',
      tests: [{ label: 'Confirm + Closing', logs: ['Close 3 incident(s)?', 'Closing: inc1,inc2,inc3'] }],
      variants: [{ name: '6 select chesaru', scenario: { list: { table: 'incident', checked: ['a', 'b', 'c', 'd', 'e', 'f'] } }, tests: [{ label: 'Max alert matrame (confirm ledu)', logs: ['Max 5 at a time'] }] }],
    }),
    jx('cs-gllist', 4, 'Max 5 limit', 'hard', {
      scenario: { list: { table: 'incident', checked: ['a', 'b', 'c', 'd', 'e', 'f'] }, confirmAnswer: true },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: 1) emi select cheyyakapothe alert("Select at least one incident"), 2) 5 kante ekkuva select chesthe alert("Max 5 at a time") (confirm adagakudadu), 3) lekapothe confirm + jslog("Closing: " + ids). Return use chey.',
      starter: 'function bulkClose() {\n  var ids = g_list.getChecked();\n  // TODO\n}',
      hint: [
        'Medium+ 7 laage, kani anniti kante mundu empty check: "" ayithe split chesthe length 1 vastundi — anduke count kante MUNDU check.',
        'if (ids == "") { alert(...); return; }  var n = ...;  if (n > 5) { alert(...); return; }  if (!confirm(...)) { return; }  jslog(...);',
        'if (ids == "") { alert("Select at least one incident"); return; } var n = ids.split(",").length; if (n > 5) { alert("Max 5 at a time"); return; } if (!confirm("Close " + n + " incident(s)?")) { return; } jslog("Closing: " + ids);',
      ],
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  if (ids == '') {\n    alert('Select at least one incident');\n    return;\n  }\n  var n = ids.split(',').length;\n  if (n > 5) {\n    alert('Max 5 at a time');\n    return;\n  }\n  if (!confirm('Close ' + n + ' incident(s)?')) {\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'Validations mundu, confirm tarvata, action last lo. Ee order ye real UI Actions lo kuda follow avtundi.',
      tests: [{ label: 'Max 5 alert matrame', logs: ['Max 5 at a time'] }],
    }),
  ],
}

/* 6 — Client Scripts */
const clientScripts = {
  id: 'cs-client',
  title: 'Client Scripts',
  video: 'Client Scripts',
  duration: '',
  no: 6,
  blurb: 'Client Script record: Type (onLoad / onChange / onSubmit / onCellEdit), table, field, guard lines.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.addInfoMessage('Priority: ' + oldValue + ' → ' + newValue);\n}",
    scenario: { form: { values: { priority: '3' } } },
    client: CHG('priority', '3', '2'),
  },
  learn: [
    {
      h: '🧩 Client Script record',
      body: [
        'System Definition → Client Scripts lo create chestam. Important fields: Name, Table (incident), UI Type (Desktop / Mobile / All), Type (onLoad / onChange / onSubmit / onCellEdit), Field name (onChange mariyu onCellEdit ki), Active, Script.',
        'ServiceNow template function ichestundi — adi marchakunda andulo code rayali: function onLoad() { }, function onChange(control, oldValue, newValue, isLoading, isTemplate) { }, function onSubmit() { }.',
      ],
    },
    {
      h: '🛡️ onChange parameters & guard',
      body: [
        'control = marchina field element. oldValue = mundu value. newValue = ippudu value (ellappudu strings). isLoading = form load avtunnappudu true (field value initial ga set avtunnappudu kuda onChange run avtundi!). isTemplate = template apply chesthe true.',
        'Standard guard: if (isLoading || newValue === "") return; — idi lekapothe form open chesinappudu script run ayyi anavasara messages vastayi.',
        'Eppudaina oldValue == newValue ayithe kuda return cheyochu (nothing changed).',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }
  // nee logic
}`,
    },
    {
      h: '🔄 Client Script vs UI Policy vs Business Rule',
      body: [
        'Simple show/hide/mandatory/read-only → UI Policy (no code). Complex logic leda g_form methods avasaram → Client Script. Server lo data marchali / security → Business Rule / ACL.',
        '⚠️ Client scripts browser lo run avtayi — import / web service tho bypass cheyochu. Kabatti security ki ACL / Business Rule kavali.',
      ],
    },
  ],
  quiz: [
    q('onChange client script lo isLoading true ayithe?', ['User field marchadu — script run cheyyali', 'Form load avtundi — script return cheyyali', 'Error vachindi — script aapali', 'Record save avtundi — script run cheyyali'], 1, 'Form load lo field values set avtunnappudu kuda onChange fire avtundi — guard tho return.'),
    q('newValue / oldValue em types?', ['Number', 'Boolean', 'String', 'Object'], 2, 'Ellappudu strings.'),
    q('Simple mandatory / hide ki edi best?', ['Business Rule', 'UI Policy', 'Scheduled Job', 'Script Include'], 1, 'UI Policy — code avasaram ledu.'),
    q('Client Script template function ni emi cheyyali?', ['Rename cheyyali', 'Marchakunda andulo rayali', 'Delete cheyyali', 'gs.info add cheyyali'], 1, 'Function names marchakudadu — ServiceNow aa peru tho call chestundi.'),
    q('onChange Client Script ki extra field edi?', ['Field name', 'Order', 'Condition', 'Roles'], 0, 'Type onChange ayithe Field name select chestam.'),
  ],
  exercises: [
    jx('cs-client', 1, 'New incident urgency default', 'easy', {
      scenario: { form: { isNew: true, values: {} } },
      client: LOAD,
      task: 'onLoad lo: new record ayithe urgency ni "3" (Low) ki set chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (g_form.isNewRecord()) g_form.setValue("urgency", "3");',
      solution: "function onLoad() {\n  if (g_form.isNewRecord()) {\n    g_form.setValue('urgency', '3');\n  }\n}",
      explain: 'isNewRecord() true ayithe matrame default pettam — existing record values marchakudadu.',
      tests: [{ label: 'urgency = 3', expr: "g_form.getValue('urgency')", expect: '3' }],
    }),
    jx('cs-client', 2, 'Priority marpu log', 'easy', {
      scenario: { form: { values: { priority: '3' } } },
      client: CHG('priority', '3', '2'),
      task: 'onChange (priority) rayi (guard tho): jslog("Priority changed from 3 to 2") laaga oldValue, newValue vaadi log chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'jslog("Priority changed from " + oldValue + " to " + newValue);',
      solution: ONCHANGE("  jslog('Priority changed from ' + oldValue + ' to ' + newValue);\n"),
      explain: 'oldValue/newValue strings — direct ga + tho join cheyyochu.',
      tests: [{ label: 'Log', logs: ['Priority changed from 3 to 2'] }],
    }),
    jx('cs-client', 3, 'Escalation message', 'medium', {
      scenario: { form: { values: { priority: '3' } } },
      client: CHG('priority', '3', '1'),
      task: 'onChange (priority) rayi: priority number takkuvaite (1 = highest) ante escalate ayyindi. parseInt(newValue, 10) < parseInt(oldValue, 10) ayithe "Priority escalated!" ani info message chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'oldValue, newValue rendu strings. Number ga marchi compare chey — chinna number = high priority.',
        'parseInt(newValue, 10) < parseInt(oldValue, 10)   — idi true ayithe info message.',
        'if (parseInt(newValue, 10) < parseInt(oldValue, 10)) { g_form.addInfoMessage("Priority escalated!"); }',
      ],
      solution: ONCHANGE("  if (parseInt(newValue, 10) < parseInt(oldValue, 10)) {\n    g_form.addInfoMessage('Priority escalated!');\n  }\n"),
      explain: 'Strings ni compare cheste "10" < "9" lanti bugs vastayi — compare mundu number ki marchu.',
      tests: [{ label: 'Message', expr: MSGS, expect: ['Priority escalated!'] }],
    }),
    jx('cs-client', 5, 'Escalated leda de-escalated (else)', 'medium+', {
      scenario: { form: { values: { priority: '4' } } },
      client: CHG('priority', '2', '4'),
      task: 'onChange (priority) rayi: number takkuva ayithe jslog("Escalated: 2 → 1") laaga, lekapothe jslog("De-escalated: 2 → 4") laaga log chey (oldValue → newValue). Ippudu 2 nunchi 4 ki marindi. 🧰 Vaade words: oldValue, newValue, parseInt, if / else, jslog()',
      starter: ONCHANGE("  // Step 1: oldValue, newValue ni parseInt(.., 10) tho numbers ga marchu\n  var oldNum;\n  var newNum;\n\n  // Step 2: newNum < oldNum ayithe 'Escalated: ', lekapothe 'De-escalated: '\n  //         + oldValue + ' → ' + newValue\n"),
      hint: [
        'Medium exercise laage compare, kani ippudu else branch kuda undi. Log text lo original strings (oldValue / newValue) direct ga vaadochu.',
        'var oldNum = parseInt(oldValue, 10); var newNum = parseInt(newValue, 10);   if (newNum < oldNum) { ... } else { ... }',
        'if (newNum < oldNum) { jslog("Escalated: " + oldValue + " → " + newValue); } else { jslog("De-escalated: " + oldValue + " → " + newValue); }',
      ],
      solution: ONCHANGE("  var oldNum = parseInt(oldValue, 10);\n  var newNum = parseInt(newValue, 10);\n  if (newNum < oldNum) {\n    jslog('Escalated: ' + oldValue + ' → ' + newValue);\n  } else {\n    jslog('De-escalated: ' + oldValue + ' → ' + newValue);\n  }\n"),
      explain: 'oldValue = marpu mundu value. onChange lo idi chala useful — "ekkadi nunchi ekkadiki" ani telustundi. Next exercises lo oldValue tho marpu ni undo chestam.',
      tests: [{ label: 'De-escalated log', logs: ['De-escalated: 2 → 4'] }],
      variants: [{ name: '3 nunchi 1 ki', scenario: { form: { values: { priority: '1' } } }, client: CHG('priority', '3', '1'), tests: [{ label: 'Escalated log', logs: ['Escalated: 3 → 1'] }] }],
    }),
    jx('cs-client', 6, 'Marpu undo chey (oldValue tho)', 'medium+', {
      scenario: { form: { values: { priority: '1' } } },
      client: CHG('priority', '3', '1'),
      task: 'Practice rule: form lo nunchi priority "1" pettakudadu. onChange (priority) rayi: newValue "1" ayithe g_form.setValue("priority", oldValue) tho paata value ki revert chey. 🧰 Vaade words: oldValue, newValue, g_form.setValue()',
      starter: ONCHANGE("  // newValue '1' ayithe:\n  // TODO: priority ni malli oldValue ki set chey\n"),
      hint: [
        'Revert ante field ni paata value ki marchadam. Paata value ekkada undi? — oldValue parameter lo.',
        'if (newValue == "1") { g_form.setValue(<field>, <paata value>); }',
        'if (newValue == "1") { g_form.setValue("priority", oldValue); }',
      ],
      solution: ONCHANGE("  if (newValue == '1') {\n    g_form.setValue('priority', oldValue);\n  }\n"),
      explain: 'setValue(field, oldValue) user marpu ni venakki tippestundi. User ki enduko cheppakapote confuse avtaru — anduke hard exercise lo error message kuda pedatam. ⚠️ Real lo priority sadharanam ga impact + urgency nunchi calculate avtundi — ee rule practice kosam matrame.',
      tests: [{ label: 'priority back to 3', expr: "g_form.getValue('priority')", expect: '3' }],
      variants: [{ name: '3 nunchi 2 ki', scenario: { form: { values: { priority: '2' } } }, client: CHG('priority', '3', '2'), tests: [{ label: 'priority 2 ala undali', expr: "g_form.getValue('priority')", expect: '2' }] }],
    }),
    jx('cs-client', 7, 'P1 nunchi downgrade warning (&&)', 'medium+', {
      scenario: { form: { values: { priority: '3' } } },
      client: CHG('priority', '1', '3'),
      task: 'onChange (priority) rayi: oldValue "1" (P1) nunchi "1" kaani value ki marchite addErrorMessage("P1 ni downgrade cheyyaku — manager ni adugu") chupinchu. Rendu conditions && tho. 🧰 Vaade words: oldValue, newValue, &&, g_form.addErrorMessage()',
      starter: ONCHANGE('  // TODO: oldValue P1 AND newValue P1 kaadu → error message\n'),
      hint: [
        'Rendu conditions okesari nijam kavali: paata value "1", kotta value "1" kaadu.',
        'if (oldValue == "1" && newValue != "1") { ... }',
        'if (oldValue == "1" && newValue != "1") { g_form.addErrorMessage("P1 ni downgrade cheyyaku — manager ni adugu"); }',
      ],
      solution: ONCHANGE("  if (oldValue == '1' && newValue != '1') {\n    g_form.addErrorMessage('P1 ni downgrade cheyyaku — manager ni adugu');\n  }\n"),
      explain: 'newValue != "1" check enduku? Script lo setValue chesthe onChange malli fire avvachu — appudu same value tho vachina call ki message raakudadu. Hard exercise lo idi kavali.',
      tests: [{ label: 'Error message', expr: MSGS, expect: ['P1 ni downgrade cheyyaku — manager ni adugu'] }],
      variants: [
        { name: '2 nunchi 3 ki', scenario: { form: { values: { priority: '3' } } }, client: CHG('priority', '2', '3'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
        { name: '1 nunchi 1 (malli fire)', scenario: { form: { values: { priority: '1' } } }, client: CHG('priority', '1', '1'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
      ],
    }),
    jx('cs-client', 4, 'Resolved record reopen block', 'hard', {
      scenario: { form: { values: { state: '2' } } },
      client: CHG('state', '6', '2'),
      task: 'onChange (state) rayi: oldValue "6" (Resolved) nunchi vere state ki marchite, marpu ni revert chey (g_form.setValue("state", oldValue)) mariyu addErrorMessage("Resolved incident ni reopen cheyyaku") chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Medium+ 6 (revert) + 7 (&& condition + error) kalipi — ippudu state field, "6" (Resolved).',
        'if (oldValue == "6" && newValue != "6") { setValue tho revert; error message; }',
        'if (oldValue == "6" && newValue != "6") { g_form.setValue("state", oldValue); g_form.addErrorMessage("Resolved incident ni reopen cheyyaku"); }',
      ],
      solution: ONCHANGE("  if (oldValue == '6' && newValue != '6') {\n    g_form.setValue('state', oldValue);\n    g_form.addErrorMessage('Resolved incident ni reopen cheyyaku');\n  }\n"),
      explain: 'oldValue vaadi marpu ni undo cheyyochu. (Real lo setValue valla malli onChange fire avvachu — oldValue check ee loop ni aapestundi.)',
      tests: [
        { label: 'state back to 6', expr: "g_form.getValue('state')", expect: '6' },
        { label: 'Error message', expr: '__msgs.map(function (m) { return m.kind })', expect: ['error'] },
      ],
    }),
  ],
}

/* 7 — On Load use cases */
const onload = {
  id: 'cs-onload',
  title: 'onLoad Client Script — Use Cases',
  video: 'On Load Client script Use cases',
  duration: '',
  no: 7,
  blurb: 'Form open ayinappudu run ayye scripts: banners, read-only, defaults, role based hide.',
  scratch: {
    starter: "function onLoad() {\n  if (g_form.getValue('priority') == '1') {\n    g_form.addInfoMessage('P1 incident!');\n  }\n}",
    scenario: { form: { values: { priority: '1' } } },
    client: LOAD,
  },
  learn: [
    {
      h: '🚀 onLoad — eppudu run avtundi?',
      body: [
        'Form fully load ayyaka oka saari run avtundi. Anduke form values ippudu g_form.getValue tho chadavochu.',
        'Use cases: record state batti banners, closed records ni read-only cheyyadam, new record defaults, user role batti fields hide.',
        '⚠️ onLoad lo heavy work (getReference, GlideAjax chala sarlu) cheste form slow avtundi. g_scratchpad vaadu.',
      ],
    },
    {
      h: '🧰 Typical patterns',
      body: ['Condition check → g_form method. Patterns: if (g_form.getValue("state") == "7") { read-only }, if (!g_user.hasRole("itil")) { hide }, if (g_form.isNewRecord()) { defaults }.'],
      code: `function onLoad() {
  if (g_form.getValue('state') == '7') {
    g_form.setReadOnly('short_description', true);
  }
}`,
    },
  ],
  quiz: [
    q('onLoad eppudu run avtundi?', ['Field marchinappudu', 'Form load ayyaka', 'Submit mundu', 'Server lo'], 1, 'Form load ayyaka oka saari.'),
    q('New record defaults ki ela check chestam?', ['g_form.isNewRecord()', 'gs.isNew()', 'current.isNew', 'g_user.isNew'], 0, 'g_form.isNewRecord().'),
    q('onLoad lo server data kavali — best way?', ['g_scratchpad', 'getReference chala sarlu', 'Sync GlideRecord', 'prompt()'], 0, 'Display Business Rule tho g_scratchpad.'),
    q('Closed incident ni edit cheyyakunda cheyyali?', ['setReadOnly(field, true)', 'setMandatory', 'clearValue', 'setVisible(field,true)'], 0, 'setReadOnly(field, true) (+ ACL).'),
    q('onLoad lo oldValue / newValue untaya?', ['Avunu, onLoad ki kuda untayi', 'Ledu — adi onChange ki matrame', 'Strings ga untayi', 'Numbers ga untayi'], 1, 'onLoad function ki parameters levu.'),
  ],
  exercises: [
    jx('cs-onload', 1, 'P1 banner', 'easy', {
      scenario: { form: { values: { priority: '1' } } },
      client: LOAD,
      task: 'onLoad lo: priority "1" ayithe "P1 incident — immediate attention!" ani info message chupinchu.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (g_form.getValue("priority") == "1") { g_form.addInfoMessage("P1 incident — immediate attention!"); }',
      solution: "function onLoad() {\n  if (g_form.getValue('priority') == '1') {\n    g_form.addInfoMessage('P1 incident — immediate attention!');\n  }\n}",
      explain: 'getValue string ("1") — == tho compare.',
      tests: [{ label: 'Banner', expr: MSGS, expect: ['P1 incident — immediate attention!'] }],
    }),
    jx('cs-onload', 2, 'Closed → read-only', 'easy', {
      scenario: { form: { values: { state: '7' } } },
      client: LOAD,
      task: 'onLoad lo: state "7" (Closed) ayithe short_description, description, assignment_group moodu fields ni read-only chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'Closed ayithe prathi field ki g_form.setReadOnly(name, true) (array loop kuda vaadochu).',
      solution: "function onLoad() {\n  if (g_form.getValue('state') == '7') {\n    var fields = ['short_description', 'description', 'assignment_group'];\n    for (var i = 0; i < fields.length; i++) {\n      g_form.setReadOnly(fields[i], true);\n    }\n  }\n}",
      explain: 'Array + loop tho same code repeat cheyyakunda. (Stage 2 lo nerchukunnadi!)',
      tests: [{ label: 'moodu read-only', expr: "['short_description','description','assignment_group'].map(function (f) { return __f[f].readOnly })", expect: [true, true, true] }],
    }),
    jx('cs-onload', 3, 'New record defaults', 'medium', {
      scenario: { form: { isNew: true, values: {} } },
      client: LOAD,
      task: 'onLoad lo: new record ayithe category = "inquiry", caller_id mandatory, mariyu "Fill the form carefully" ani info message.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: [
        'Anni moodu panulu oke condition lopala: new record ayithe matrame.',
        'if (g_form.isNewRecord()) { setValue (category) ; setMandatory (caller_id) ; addInfoMessage }',
        'if (g_form.isNewRecord()) { g_form.setValue("category", "inquiry"); g_form.setMandatory("caller_id", true); g_form.addInfoMessage("Fill the form carefully"); }',
      ],
      solution: "function onLoad() {\n  if (g_form.isNewRecord()) {\n    g_form.setValue('category', 'inquiry');\n    g_form.setMandatory('caller_id', true);\n    g_form.addInfoMessage('Fill the form carefully');\n  }\n}",
      explain: 'Defaults new records ki matrame — existing records marchakudadu.',
      tests: [
        { label: 'category inquiry', expr: "g_form.getValue('category')", expect: 'inquiry' },
        { label: 'caller mandatory', expr: "g_form.isMandatory('caller_id')", expect: true },
        { label: 'message', expr: MSGS, expect: ['Fill the form carefully'] },
      ],
    }),
    jx('cs-onload', 5, 'itil agent ki banner', 'medium+', {
      scenario: { form: { values: {} }, user: { userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] } },
      client: LOAD,
      task: 'onLoad lo: logged-in user ki "itil" role unte "Agent view: anni fields chupistunnam" ani info message chupinchu. 🧰 Vaade words: g_user.hasRole(), g_form.addInfoMessage()',
      starter: "function onLoad() {\n  // Step 1: g_user.hasRole('itil') true aa?\n\n  // Step 2: aithe info message\n}",
      hint: [
        'Role check client lo g_user tho chestam. hasRole true / false istundi — adi if lo pettu.',
        'if (g_user.hasRole("itil")) { ... }',
        'if (g_user.hasRole("itil")) { g_form.addInfoMessage("Agent view: anni fields chupistunnam"); }',
      ],
      solution: "function onLoad() {\n  if (g_user.hasRole('itil')) {\n    g_form.addInfoMessage('Agent view: anni fields chupistunnam');\n  }\n}",
      explain: 'g_user.hasRole client lo current user role check chestundi. Gurtu: admin ki hasRole ellappudu true istundi (admin anni roles ni override chestundi).',
      tests: [{ label: 'banner', expr: MSGS, expect: ['Agent view: anni fields chupistunnam'] }],
      variants: [{ name: 'role ledu', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } }, tests: [{ label: 'banner raakudadu', expr: MSGS, expect: [] }] }],
    }),
    jx('cs-onload', 6, 'Role lekapote assigned_to hide', 'medium+', {
      scenario: { form: { values: {} }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'onLoad lo: user ki "itil" role LEKAPOTE assigned_to field ni hide chey — space kuda migalakudadu, anduke setDisplay (setVisible kaadu). 🧰 Vaade words: g_user.hasRole(), ! (not), g_form.setDisplay()',
      starter: "function onLoad() {\n  // \"role LEKAPOTE\" → ! tho condition ni tippu\n  // TODO: assigned_to hide (gap lekunda)\n}",
      hint: [
        '"Lekapote" ante condition ki mundu ! pettu. Gap lekunda hide = setDisplay.',
        'if (!g_user.hasRole("itil")) { g_form.setDisplay(...); }',
        'if (!g_user.hasRole("itil")) { g_form.setDisplay("assigned_to", false); }',
      ],
      solution: "function onLoad() {\n  if (!g_user.hasRole('itil')) {\n    g_form.setDisplay('assigned_to', false);\n  }\n}",
      explain: 'setVisible(false) field hide chestundi kani khaali space untundi; setDisplay(false) space kuda teesestundi. Idi UI convenience matrame — security ki ACL kavali.',
      tests: [{ label: 'assigned_to hidden, gap ledu', expr: '[__f.assigned_to.visible, __f.assigned_to.space]', expect: [false, false] }],
      variants: [{ name: 'itil unte', scenario: { user: { userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] } }, tests: [{ label: 'assigned_to visible', expr: '__f.assigned_to.visible', expect: true }] }],
    }),
    jx('cs-onload', 7, 'Role lekapote fields read-only (loop)', 'medium+', {
      scenario: { form: { values: { impact: '2', urgency: '2' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'onLoad lo: "itil" role lekapote impact, urgency, category moodu fields ni read-only chey — array + for loop vaadu. 🧰 Vaade words: g_user.hasRole(), g_form.setReadOnly(), length',
      starter: "function onLoad() {\n  // role check\n  // fields array + loop → setReadOnly\n}",
      hint: [
        'Same method moodu sarlu — fields ni array lo pettu, loop lo okko field ki setReadOnly. Anni role-check lopala.',
        'var fields = ["impact", "urgency", "category"]; for (var i = 0; i < fields.length; i++) { ... }',
        'if (!g_user.hasRole("itil")) { var fields = ["impact", "urgency", "category"]; for (var i = 0; i < fields.length; i++) { g_form.setReadOnly(fields[i], true); } }',
      ],
      solution: "function onLoad() {\n  if (!g_user.hasRole('itil')) {\n    var fields = ['impact', 'urgency', 'category'];\n    for (var i = 0; i < fields.length; i++) {\n      g_form.setReadOnly(fields[i], true);\n    }\n  }\n}",
      explain: 'Kotta field add cheyyali ante array lo oka peru add chesthe chalu. Hard exercise lo hide + read-only rendu kalipi chestam.',
      tests: [{ label: 'moodu read-only', expr: "['impact','urgency','category'].map(function (f) { return __f[f].readOnly })", expect: [true, true, true] }],
      variants: [{ name: 'itil unte', scenario: { user: { userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] } }, tests: [{ label: 'read-only kaadu', expr: "['impact','urgency','category'].map(function (f) { return __f[f].readOnly })", expect: [false, false, false] }] }],
    }),
    jx('cs-onload', 4, 'Role lekapote simplify', 'hard', {
      scenario: { form: { values: { impact: '2', urgency: '2' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'onLoad lo: user ki "itil" role lekapote 1) assigned_to, assignment_group fields hide (setDisplay false), 2) impact, urgency read-only chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: [
        'Oke role-check (!hasRole) lopala rendu rakala panulu: rendu fields hide (setDisplay), rendu fields read-only.',
        'if (!g_user.hasRole("itil")) { setDisplay × 2 (assigned_to, assignment_group); setReadOnly × 2 (impact, urgency) }',
        'if (!g_user.hasRole("itil")) { g_form.setDisplay("assigned_to", false); g_form.setDisplay("assignment_group", false); g_form.setReadOnly("impact", true); g_form.setReadOnly("urgency", true); }',
      ],
      solution: "function onLoad() {\n  if (!g_user.hasRole('itil')) {\n    g_form.setDisplay('assigned_to', false);\n    g_form.setDisplay('assignment_group', false);\n    g_form.setReadOnly('impact', true);\n    g_form.setReadOnly('urgency', true);\n  }\n}",
      explain: 'End user portal-like experience: role lekapote fields hide. Gurtu: idi UI convenience, security kosam ACL kavali.',
      tests: [
        { label: 'hidden', expr: '[__f.assigned_to.visible, __f.assignment_group.visible]', expect: [false, false] },
        { label: 'read-only', expr: '[__f.impact.readOnly, __f.urgency.readOnly]', expect: [true, true] },
      ],
    }),
  ],
}

/* 8 — On Change use cases */
const onchange = {
  id: 'cs-onchange',
  title: 'onChange Client Script — Use Cases',
  video: 'On Change Client script Use cases',
  duration: '',
  no: 8,
  blurb: 'Field marchinappudu: dependent fields clear, messages, mandatory, reference check.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.clearValue('assigned_to');\n}",
    scenario: { form: { values: { assignment_group: 'g_net', assigned_to: 'u_admin' } } },
    client: CHG('assignment_group', 'g_desk', 'g_net'),
  },
  learn: [
    {
      h: '⚡ onChange use cases',
      body: [
        'Dependent fields: assignment group marchite assigned_to clear cheyyali (aa group lo lenivaadu undakudadu). State = On Hold ayithe reason mandatory. Impact+Urgency → P1 warning.',
        'Eppudu guard (isLoading / newValue === "") marchipokudadu. Ainaa, newValue empty ayite kuda logic run cheyyali anukunte (clear chesinappudu) guard ni marchu — adi conscious decision.',
      ],
    },
    {
      h: '🙅 Inactive caller check',
      body: [
        'Reference value marchinappudu aa record details kavali ante getReference (callback) vaadatam. Udaharana: caller inactive user ayithe error chupinchi caller ni clear cheyyali.',
        'Prathi sari getReference server call kabatti, ee type checks ki chala avasaram unte matrame vaadu.',
      ],
      code: `g_form.getReference('caller_id', function (caller) {
  if (caller.active == 'false') {
    g_form.addErrorMessage('Caller inactive');
    g_form.clearValue('caller_id');
  }
});`,
    },
  ],
  quiz: [
    q('Assignment group marchite assigned_to emi cheyyali?', ['Alage vadileyyali, em cheyyakudadu', 'Clear cheyyali (group lo undakapovachu)', 'Aa record ni delete cheyyali', 'Assigned to ni mandatory cheyyali'], 1, 'Dependent field ni clear cheyyadam standard.'),
    q('onChange lo user ki visible ga cheppadaniki?', ['g_form.addInfoMessage / showFieldMsg', 'gs.info (server log matrame)', 'console.log matrame (user ki kanipinchadu)', 'jslog matrame (browser log)'], 0, 'g_form messages.'),
    q('Caller inactive check ki?', ['getReference (callback)', 'g_user.active property tho', 'gs.getUser() client lo', 'Update Set lo check chesi'], 0, 'getReference callback lo caller.active.'),
    q('onChange guard lo isLoading ni enduku check chestam?', ['Form load lo kuda fire avtundi', 'Performance penchadaniki matrame', 'Field mandatory cheyyadaniki', 'Security kosam'], 0, 'Load time lo field values set avvadam valla onChange fire avtundi.'),
    q('onChange ellappudu emi event ki run avtundi?', ['Field value marchinappudu', 'Page refresh chesinappudu', 'Record save chesinappudu', 'User login ayinappudu'], 0, 'Specified field value marchinappudu.'),
  ],
  exercises: [
    jx('cs-onchange', 1, 'Group marchite assigned_to clear', 'easy', {
      scenario: { form: { values: { assignment_group: 'g_net', assigned_to: 'u_admin' } } },
      client: CHG('assignment_group', 'g_desk', 'g_net'),
      task: 'onChange (assignment_group) rayi: assigned_to ni clear chey (g_form.clearValue).',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'g_form.clearValue("assigned_to");',
      solution: ONCHANGE("  g_form.clearValue('assigned_to');\n"),
      explain: 'Group marindi kabatti pata assignee invalid avtadu.',
      tests: [{ label: 'assigned_to empty', expr: "g_form.getValue('assigned_to')", expect: '' }],
    }),
    jx('cs-onchange', 2, 'P1 warning', 'easy', {
      scenario: { form: { values: { impact: '1', urgency: '1' } } },
      client: CHG('urgency', '2', '1'),
      task: 'onChange (urgency) rayi: newValue "1" mariyu impact "1" ayithe info message "This will be a P1 incident" chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'if (newValue == "1" && g_form.getValue("impact") == "1") { ... }',
      solution: ONCHANGE("  if (newValue == '1' && g_form.getValue('impact') == '1') {\n    g_form.addInfoMessage('This will be a P1 incident');\n  }\n"),
      explain: 'Marchina field newValue lo, migilina field g_form.getValue tho.',
      tests: [{ label: 'message', expr: MSGS, expect: ['This will be a P1 incident'] }],
    }),
    jx('cs-onchange', 3, 'On Hold → reason mandatory', 'medium', {
      scenario: { form: { values: { state: '3', description: '' } } },
      client: CHG('state', '2', '3'),
      task: 'onChange (state) rayi: state "3" (On Hold) ayithe description mandatory chesi, description kinda "Hold reason rayi" ani info field message chupinchu. Lekapothe description mandatory teeseyyi.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Rendu panulu: mandatory on/off (boolean tho oke line), On Hold ayithe matrame field message.',
        'g_form.setMandatory("description", newValue == "3");   if (newValue == "3") { showFieldMsg(...info...) }',
        'g_form.setMandatory("description", newValue == "3"); if (newValue == "3") { g_form.showFieldMsg("description", "Hold reason rayi", "info"); }',
      ],
      solution: ONCHANGE("  g_form.setMandatory('description', newValue == '3');\n  if (newValue == '3') {\n    g_form.showFieldMsg('description', 'Hold reason rayi', 'info');\n  }\n"),
      explain: 'Boolean expression ni direct ga setMandatory ki ivvochu.',
      tests: [
        { label: 'mandatory', expr: '__f.description.mandatory', expect: true },
        { label: 'field message', expr: '__f.description.msgs.length', expect: 1 },
      ],
    }),
    jx('cs-onchange', 5, 'Caller name short description lo', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', 'u_abel', 'u_bud'),
      task: 'onChange (caller_id) rayi: g_form.getReference tho caller record techchuko, callback lopala short_description ni "Issue for <caller name>" ga set chey (caller.name). 🧰 Vaade words: g_form.getReference(), callback function, g_form.setValue()',
      starter: ONCHANGE("  // Step 1: g_form.getReference('caller_id', function (caller) { ... });\n  // Step 2: callback LOPALA: short_description = 'Issue for ' + caller.name\n"),
      hint: [
        'caller_id lo sys_id matrame undi — name kavali ante record techchukovali. Result callback lo vastundi.',
        'g_form.getReference("caller_id", function (caller) { ...caller.name... });',
        'g_form.getReference("caller_id", function (caller) { g_form.setValue("short_description", "Issue for " + caller.name); });',
      ],
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('short_description', 'Issue for ' + caller.name);\n  });\n"),
      explain: 'Callback bayata setValue rasthe, caller inka raaledu (async). Kabatti caller vaade code anta callback lopale.',
      tests: [{ label: 'short_description', expr: "g_form.getValue('short_description')", expect: 'Issue for Bud Richman' }],
    }),
    jx('cs-onchange', 6, 'Inactive caller warning', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_fred' } } },
      client: CHG('caller_id', 'u_abel', 'u_fred'),
      task: 'onChange (caller_id) rayi: getReference tho caller techchuko. Callback lo caller.active == "false" ayithe addErrorMessage("Caller inactive") chupinchu. 🧰 Vaade words: g_form.getReference(), g_form.addErrorMessage(), "false" (string)',
      starter: ONCHANGE("  // TODO: getReference callback\n  //   lopala: caller.active string 'false' aa? → error message\n"),
      hint: [
        'Reference record fields callback lo STRINGS ga vastayi — active ki "true" / "false" (text), boolean kaadu.',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { ... } });',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { g_form.addErrorMessage("Caller inactive"); } });',
      ],
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    if (caller.active == 'false') {\n      g_form.addErrorMessage('Caller inactive');\n    }\n  });\n"),
      explain: 'if (!caller.active) rasthe pani cheyyadu — "false" string kuda truthy! Ellappudu == "false" tho compare chey.',
      tests: [{ label: 'error message', expr: MSGS, expect: ['Caller inactive'] }],
      variants: [{ name: 'active caller', scenario: { form: { values: { caller_id: 'u_bud' } } }, client: CHG('caller_id', 'u_abel', 'u_bud'), tests: [{ label: 'error ledu', expr: MSGS, expect: [] }] }],
    }),
    jx('cs-onchange', 7, 'Inactive assignee clear', 'medium+', {
      scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_fred' } } },
      client: CHG('assigned_to', 'u_abel', 'u_fred'),
      task: 'onChange (assigned_to) rayi: getReference("assigned_to", ...) tho user techchuko. Aa user inactive ("false") ayithe assigned_to ni clear chey (g_form.clearValue). 🧰 Vaade words: g_form.getReference(), g_form.clearValue()',
      starter: ONCHANGE('  // TODO: assigned_to user techchuko → inactive ayithe clear\n'),
      hint: [
        'Medium+ 6 laage getReference + active check, kani ippudu field assigned_to, action = clear.',
        'g_form.getReference("assigned_to", function (user) { if (user.active == "false") { ... } });',
        'g_form.getReference("assigned_to", function (user) { if (user.active == "false") { g_form.clearValue("assigned_to"); } });',
      ],
      solution: ONCHANGE("  g_form.getReference('assigned_to', function (user) {\n    if (user.active == 'false') {\n      g_form.clearValue('assigned_to');\n    }\n  });\n"),
      explain: 'Callback parameter peru manam pettukunedi (caller, user ...). Clear chesinappudu field malli marindi kabatti onChange malli fire avvachu — newValue === "" guard daanni aapestundi.',
      tests: [{ label: 'assigned_to empty', expr: "g_form.getValue('assigned_to')", expect: '' }],
      variants: [{ name: 'active user', scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_bud' } } }, client: CHG('assigned_to', 'u_abel', 'u_bud'), tests: [{ label: 'assigned_to ala undali', expr: "g_form.getValue('assigned_to')", expect: 'u_bud' }] }],
    }),
    jx('cs-onchange', 4, 'Inactive caller block', 'hard', {
      scenario: { form: { values: { caller_id: 'u_fred' } } },
      client: CHG('caller_id', 'u_abel', 'u_fred'),
      task: 'onChange (caller_id) rayi: getReference tho caller techchuko. caller.active == "false" ayithe addErrorMessage("Caller inactive") chupinchi caller_id ni clear chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Medium+ 6 (error message) + 7 (clear) kalipi — caller_id field meeda.',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { error message; clear; } });',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { g_form.addErrorMessage("Caller inactive"); g_form.clearValue("caller_id"); } });',
      ],
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    if (caller.active == 'false') {\n      g_form.addErrorMessage('Caller inactive');\n      g_form.clearValue('caller_id');\n    }\n  });\n"),
      explain: 'Reference record fields (caller.active) callback lo strings ga vastayi: "false".',
      tests: [
        { label: 'caller cleared', expr: "g_form.getValue('caller_id')", expect: '' },
        { label: 'error message', expr: MSGS, expect: ['Caller inactive'] },
      ],
    }),
  ],
}

export const CS_LESSONS_B = [glform2, gllist, clientScripts, onload, onchange]
