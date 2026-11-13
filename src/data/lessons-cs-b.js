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
    q('getReference ni callback lekunda vaadithe?', ['Fast ga untundi', 'Browser block avtundi (synchronous)', 'Error vastundi', 'Em maradu'], 1, 'Callback lekapothe synchronous call — browser freeze. Ellappudu callback vaadu.'),
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
      hint: 'g_form.getReference("caller_id", function (caller) { g_form.setValue("description", "Caller email: " + caller.email); });',
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller email: ' + caller.email);\n  });\n"),
      explain: 'Callback lo caller record vastundi. Value set cheyyadam callback ki lopale cheyyali — adi async ga run avtundi.',
      tests: [{ label: 'description set', expr: "g_form.getValue('description')", expect: 'Caller email: bud.richman@example.com' }],
    }),
    jx('cs-glform2', 4, 'Resolved → resolution notes mandatory', 'hard', {
      scenario: { form: { values: { state: '6', description: '' } } },
      client: CHG('state', '2', '6'),
      task: 'onChange (state) rayi: mundu description field message hide chey (hideFieldMsg). Tarvata state "6" ayithe description mandatory chesi, kinda "Resolution notes rayi" ani error field message chupinchu; lekapothe mandatory teeseyyi.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'g_form.hideFieldMsg("description"); if (newValue == "6") { g_form.setMandatory("description", true); g_form.showFieldMsg("description", "Resolution notes rayi", "error"); } else { g_form.setMandatory("description", false); }',
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
        'Inka: g_list.getTableName(), g_list.getQuery() (list filter), g_list.getView(). ⚠️ Memory nunchi rasanu — exact method list nee PDI lo SN Utils tho confirm chesuko.',
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
    q('g_list.getChecked() em istundi?', ['Array of sys_ids', 'Comma-separated sys_ids string', 'Number of records', 'GlideRecord'], 1, 'Comma-separated string, e.g. "id1,id2".'),
    q('Emi select cheyyakapothe getChecked() em istundi?', ['null', 'undefined', '"" (empty string)', '0'], 2, 'Empty string.'),
    q('g_list ekkada vaadatam?', ['Business Rule lo', 'List lo client UI Action lo', 'Scheduled Job lo', 'Update Set lo'], 1, 'List lo select chesina records kosam client UI Actions lo.'),
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
      hint: 'var n = ids.split(",").length; if (!confirm("Close " + n + " incident(s)?")) return; jslog("Closing: " + ids);',
      solution: "function bulkClose() {\n  var ids = g_list.getChecked();\n  var n = ids.split(',').length;\n  if (!confirm('Close ' + n + ' incident(s)?')) {\n    return;\n  }\n  jslog('Closing: ' + ids);\n}",
      explain: 'confirm message log lo kuda kanipistundi (practice kosam). Real browser lo dialog vastundi.',
      tests: [{ label: 'Confirm + Closing log', logs: ['Close 2 incident(s)?', 'Closing: inc1,inc2'] }],
    }),
    jx('cs-gllist', 4, 'Max 5 limit', 'hard', {
      scenario: { list: { table: 'incident', checked: ['a', 'b', 'c', 'd', 'e', 'f'] }, confirmAnswer: true },
      client: CALL('bulkClose'),
      task: 'bulkClose() rayi: 1) emi select cheyyakapothe alert("Select at least one incident"), 2) 5 kante ekkuva select chesthe alert("Max 5 at a time") (confirm adagakudadu), 3) lekapothe confirm + jslog("Closing: " + ids). Return use chey.',
      starter: 'function bulkClose() {\n  var ids = g_list.getChecked();\n  // TODO\n}',
      hint: 'Count teesuko; if (ids == "") {...return}; if (n > 5) { alert("Max 5 at a time"); return; } ...',
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
    q('onChange client script lo isLoading true ayithe?', ['User field marchadu', 'Form load avtundi — script return cheyyali', 'Error', 'Record save avtundi'], 1, 'Form load lo field values set avtunnappudu kuda onChange fire avtundi — guard tho return.'),
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
      hint: 'if (parseInt(newValue, 10) < parseInt(oldValue, 10)) { g_form.addInfoMessage("Priority escalated!"); }',
      solution: ONCHANGE("  if (parseInt(newValue, 10) < parseInt(oldValue, 10)) {\n    g_form.addInfoMessage('Priority escalated!');\n  }\n"),
      explain: 'Strings ni compare cheste "10" < "9" lanti bugs vastayi — compare mundu number ki marchu.',
      tests: [{ label: 'Message', expr: MSGS, expect: ['Priority escalated!'] }],
    }),
    jx('cs-client', 4, 'Resolved record reopen block', 'hard', {
      scenario: { form: { values: { state: '2' } } },
      client: CHG('state', '6', '2'),
      task: 'onChange (state) rayi: oldValue "6" (Resolved) nunchi vere state ki marchite, marpu ni revert chey (g_form.setValue("state", oldValue)) mariyu addErrorMessage("Resolved incident ni reopen cheyyaku") chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'if (oldValue == "6" && newValue != "6") { g_form.setValue("state", oldValue); g_form.addErrorMessage("..."); }',
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
    q('onLoad lo oldValue / newValue untaya?', ['Avunu', 'Ledu — adi onChange ki matrame', 'Strings untayi', 'Number untayi'], 1, 'onLoad function ki parameters levu.'),
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
      hint: 'if (g_form.isNewRecord()) { g_form.setValue("category","inquiry"); g_form.setMandatory("caller_id", true); g_form.addInfoMessage("..."); }',
      solution: "function onLoad() {\n  if (g_form.isNewRecord()) {\n    g_form.setValue('category', 'inquiry');\n    g_form.setMandatory('caller_id', true);\n    g_form.addInfoMessage('Fill the form carefully');\n  }\n}",
      explain: 'Defaults new records ki matrame — existing records marchakudadu.',
      tests: [
        { label: 'category inquiry', expr: "g_form.getValue('category')", expect: 'inquiry' },
        { label: 'caller mandatory', expr: "g_form.isMandatory('caller_id')", expect: true },
        { label: 'message', expr: MSGS, expect: ['Fill the form carefully'] },
      ],
    }),
    jx('cs-onload', 4, 'Role lekapote simplify', 'hard', {
      scenario: { form: { values: { impact: '2', urgency: '2' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'onLoad lo: user ki "itil" role lekapote 1) assigned_to, assignment_group fields hide (setDisplay false), 2) impact, urgency read-only chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (!g_user.hasRole("itil")) { ...4 g_form calls... }',
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
    q('Assignment group marchite assigned_to emi cheyyali?', ['Alage vadileyyali', 'Clear cheyyali (group lo undakapovachu)', 'Delete record', 'Mandatory chey'], 1, 'Dependent field ni clear cheyyadam standard.'),
    q('onChange lo user ki visible ga cheppadaniki?', ['g_form.addInfoMessage / showFieldMsg', 'gs.info', 'console only', 'jslog matrame'], 0, 'g_form messages.'),
    q('Caller inactive check ki?', ['getReference (callback)', 'g_user.active', 'gs.getUser', 'Update Set'], 0, 'getReference callback lo caller.active.'),
    q('onChange guard lo isLoading ni enduku check chestam?', ['Form load lo kuda fire avtundi', 'Performance', 'Mandatory ki', 'Security'], 0, 'Load time lo field values set avvadam valla onChange fire avtundi.'),
    q('onChange ellappudu emi event ki run avtundi?', ['Field value marchinappudu', 'Page refresh', 'Save', 'Login'], 0, 'Specified field value marchinappudu.'),
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
      hint: 'g_form.setMandatory("description", newValue == "3"); if (newValue == "3") g_form.showFieldMsg(...)',
      solution: ONCHANGE("  g_form.setMandatory('description', newValue == '3');\n  if (newValue == '3') {\n    g_form.showFieldMsg('description', 'Hold reason rayi', 'info');\n  }\n"),
      explain: 'Boolean expression ni direct ga setMandatory ki ivvochu.',
      tests: [
        { label: 'mandatory', expr: '__f.description.mandatory', expect: true },
        { label: 'field message', expr: '__f.description.msgs.length', expect: 1 },
      ],
    }),
    jx('cs-onchange', 4, 'Inactive caller block', 'hard', {
      scenario: { form: { values: { caller_id: 'u_fred' } } },
      client: CHG('caller_id', 'u_abel', 'u_fred'),
      task: 'onChange (caller_id) rayi: getReference tho caller techchuko. caller.active == "false" ayithe addErrorMessage("Caller inactive") chupinchi caller_id ni clear chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { ... } });',
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
