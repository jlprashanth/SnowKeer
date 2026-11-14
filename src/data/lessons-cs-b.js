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
    starter: "function onLoad() {\n  g_form.hideRelatedLists();\n  g_form.flash('incident.priority', '#ffcc00', 0);\n}",
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
        '✅ Nee PDI lo verified: getReference(field, callback) async — call kinda unna line callback kante MUNDU run avtundi. Reference field EMPTY ayina callback vastundi, kani andulo caller.sys_id / caller.name undefined ("" kaadu) — anduke guard (newValue === "" ayithe return) mundu pettu.',
        'Nee PDI lo OOB example: onChange client script "Highlight VIP Caller" (field caller_id) getReference(callback) tho caller VIP aa ani chustundi — callback lo caller.vip == "true" (record values strings, PDI lo verified). System Definition → Client Scripts lo open chesi chadivi chudu — marchaku.',
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
        'g_form.hideRelatedLists() / showRelatedLists() — form kinda unna related lists anni hide/show. g_form.hideRelatedList("incident.parent") — oka list matrame (Child Incidents — PDI lo tested).',
        'NEW record form lo related lists asalu undavu — record save ayyaka matrame vastayi. Kabatti related lists hide cheyyadam saved records ki (e.g. Closed state, leda role batti).',
        'g_form.setSectionDisplay("notes", false) — form section (tab) hide (PDI lo tested). Section names nee form layout batti untayi — g_form.getSectionNames() tho chudochu. g_form.flash("incident.priority", "#ffcc00", 0) — field ni konchem sepu highlight chestundi; docs "table.field" form lo rastayi, PDI lo "priority" kuda pani chesindi.',
      ],
      code: `g_form.hideRelatedLists();
g_form.setSectionDisplay('notes', false);
g_form.flash('incident.priority', '#ffcc00', 0);`,
    },
    {
      h: '💬 Field messages cleanup',
      body: [
        'showFieldMsg tho pettina messages ni hideFieldMsg("field") tho teeseyyali. g_form.hideAllFieldMsgs() anni field messages teesestundi. g_form.clearMessages() top banner messages teesestundi.',
        'onChange lo mundu paata message clear chesi, tarvata kotta message pettadam manchi habit — leda messages pile avtayi.',
      ],
      code: `g_form.hideFieldMsg('close_notes');
if (newValue == '6') {
  g_form.showFieldMsg('close_notes', 'Resolution notes rayi', 'error');
}`,
    },
  ],
  quiz: [
    q('Reference field nunchi aa record yokka email ela teesukuntam?', ['g_form.getValue("caller_id.email")', 'g_form.getReference(field, cb)', 'g_form.getDisplayBox("caller_id")', 'g_user.email property chaduvu'], 1, 'getReference(field, callback) — callback lo record vastundi (caller.email). g_user.email ane property PDI lo ledu.'),
    q('getReference ni callback lekunda vaadithe?', ['Fast ga untundi, extra benefit', 'Browser block avtundi (synchronous)', 'Error vastundi, run avvadu', 'Em maradu, same ga untundi'], 1, 'Callback lekapothe synchronous call — browser freeze. Ellappudu callback vaadu.'),
    q('Form kinda unna anni related lists hide cheyyali?', ['g_form.hideRelatedLists()', 'g_form.hideAll()', 'g_form.setDisplay("related", false)', 'gs.hideLists()'], 0, 'hideRelatedLists().'),
    q('Anni field messages ni oka saari teeseyyali?', ['g_form.clearMessages()', 'g_form.hideAllFieldMsgs()', 'g_form.removeAll()', 'g_form.clearValue()'], 1, 'hideAllFieldMsgs() field messages teesestundi (clearMessages top banner ki).'),
    q('getReference ki better alternative (performance)?', ['alert()', 'GlideAjax leda g_scratchpad', 'Direct GlideRecord client lo', 'setTimeout'], 1, 'GlideAjax / g_scratchpad server ni takkuva sarlu pilustayi leda controlled ga.'),
  ],
  exercises: [
    jx('cs-glform2', 1, 'Role lekapote related lists hide', 'easy', {
      scenario: { form: { values: { state: '2' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'onLoad lo: user ki "itil" role LEKAPOTE form kinda related lists anni hide chey (g_form.hideRelatedLists). (Ee form saved incident — new record lo related lists asalu undavu.)',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (!g_user.hasRole("itil")) { g_form.hideRelatedLists(); }',
      solution: "function onLoad() {\n  if (!g_user.hasRole('itil')) {\n    g_form.hideRelatedLists();\n  }\n}",
      explain: 'Related lists (Child Incidents, Tasks …) fulfillers ki useful, end users ki confusing. Gurtu: idi UI convenience matrame — data security ki ACL kavali. New record form lo related lists save ayyaka matrame vastayi, anduke new record ki hide cheyyadam waste.',
      tests: [{ label: 'related lists hidden', expr: '__x.relatedHidden', expect: true }],
    }),
    jx('cs-glform2', 2, 'Closed ayithe section hide', 'easy', {
      scenario: { form: { values: { state: '7' } } },
      client: LOAD,
      task: 'onLoad lo: state "7" (Closed) ayithe "notes" section ni hide chey (g_form.setSectionDisplay("notes", false)).',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'if (g_form.getValue("state") == "7") { g_form.setSectionDisplay("notes", false); }',
      solution: "function onLoad() {\n  if (g_form.getValue('state') == '7') {\n    g_form.setSectionDisplay('notes', false);\n  }\n}",
      explain: 'Section name internal name — nee PDI form lo g_form.getSectionNames() tho leda form layout lo confirm chesuko.',
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
      tests: [
        { label: 'description set', expr: "g_form.getValue('description')", expect: 'Caller email: bud.richman@example.com' },
        { label: 'callback style (freeze chese sync call ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
    }),
    // ---- Medium+ ladder (Resolution notes = close_notes): one new idea at a time, building up to the hard exercise ----
    jx('cs-glform2', 5, 'Resolved ayithe field message', 'medium+', {
      scenario: { form: { values: { state: '2', close_notes: '' } } },
      client: CHG('state', '2', '6'),
      task: 'onChange (state) rayi: newValue "6" (Resolved) ayithe close_notes ("Resolution notes") field kinda "Resolution notes rayi" ani ERROR field message chupinchu (g_form.showFieldMsg, type "error"). 🧰 Vaade words: newValue, g_form.showFieldMsg()',
      starter: ONCHANGE("  // Step 1: newValue '6' aa ani check chey (if)\n\n  // Step 2: aithe close_notes kinda error field message pettu\n  //         (field name, message text, type — moodu arguments)\n"),
      hint: [
        'Marchina value newValue lo undi (string). "6" tho == compare chey. Message field kinda kavali — form top banner kaadu.',
        'g_form.showFieldMsg(field, message, type)  — field "close_notes", type ki "error" ivvu.',
        'if (newValue == "6") { g_form.showFieldMsg("close_notes", "Resolution notes rayi", "error"); }',
      ],
      solution: ONCHANGE("  if (newValue == '6') {\n    g_form.showFieldMsg('close_notes', 'Resolution notes rayi', 'error');\n  }\n"),
      explain: 'showFieldMsg field kinda message pedutundi (addInfoMessage form top lo). Third argument "info" / "error" message rangu decide chestundi. Nee PDI lo already OOB Data Policy "Make close info mandatory when resolved or closed" (Resolution code + notes) undi — ee exercises same idea ni Client Script tho practice.',
      tests: [{ label: 'close_notes kinda error message', expr: '__f.close_notes.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] }],
      variants: [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '6', close_notes: '' } } }, client: CHG('state', '6', '2'), tests: [{ label: 'message raakudadu', expr: '__f.close_notes.msgs.length', expect: 0 }] }],
    }),
    jx('cs-glform2', 6, 'Mandatory on / off (boolean tho)', 'medium+', {
      scenario: { form: { values: { state: '6', close_notes: '' }, mandatory: ['close_notes'] } },
      client: CHG('state', '6', '2'),
      task: 'Resolution notes (close_notes) ippudu mandatory ga undi. onChange (state) rayi: state "6" ayithe close_notes mandatory, vere state ayithe mandatory TEESEYYI. if/else badulu oke line: g_form.setMandatory("close_notes", newValue == "6"). 🧰 Vaade words: g_form.setMandatory(), newValue, ==',
      starter: ONCHANGE("  // newValue == '6'  →  true leda false istundi\n  // TODO: aa true/false ni direct ga setMandatory ki ivvu\n"),
      hint: [
        'Comparison (newValue == "6") result ye true / false. setMandatory ki rendo argument ga adi ivvochu — if/else avasaram ledu.',
        'g_form.setMandatory("close_notes", <boolean>);   — boolean place lo comparison pettu.',
        'g_form.setMandatory("close_notes", newValue == "6");',
      ],
      solution: ONCHANGE("  g_form.setMandatory('close_notes', newValue == '6');\n"),
      explain: 'Mandatory pettadam enta mukhyamo, state marchinappudu teeseyyadam kuda anthe mukhyam — leda user save cheyyalekapotundi. Boolean expression tho rendu cases oke line lo.',
      tests: [{ label: 'state 2 → mandatory teesesindi', expr: '__f.close_notes.mandatory', expect: false }],
      variants: [{ name: 'state 6 ayithe', scenario: { form: { values: { state: '2', close_notes: '' } } }, client: CHG('state', '2', '6'), tests: [{ label: 'close_notes mandatory', expr: '__f.close_notes.mandatory', expect: true }] }],
    }),
    jx('cs-glform2', 7, 'Paata message clear, tarvata kotta message', 'medium+', {
      scenario: { form: { values: { state: '2', close_notes: '' } } },
      client: CHG('state', '2', '6'),
      task: 'Resolution notes (close_notes) kinda already oka paata message undi (starter lo top line — adi marchaku). onChange (state) rayi: MUNDU close_notes field messages teeseyyi (g_form.hideFieldMsg), tarvata state "6" ayithe "Resolution notes rayi" error field message chupinchu. Last lo oke message undali. 🧰 Vaade words: g_form.hideFieldMsg(), g_form.showFieldMsg()',
      starter: "// Practice setup: close_notes kinda already paata message undi (ee line marchaku)\ng_form.showFieldMsg('close_notes', 'Paata message', 'info');\n\n" + ONCHANGE('  // TODO: mundu clean\n  // TODO: tarvata condition + kotta message\n'),
      hint: [
        'Order mukhyam: clean first, show next. Clean cheyyadam condition bayata (prathi sari) jaragali.',
        'g_form.hideFieldMsg("close_notes");  tarvata  if (newValue == "6") { ...showFieldMsg... }',
        'g_form.hideFieldMsg("close_notes"); if (newValue == "6") { g_form.showFieldMsg("close_notes", "Resolution notes rayi", "error"); }',
      ],
      solution: "// Practice setup: close_notes kinda already paata message undi (ee line marchaku)\ng_form.showFieldMsg('close_notes', 'Paata message', 'info');\n\n" + ONCHANGE("  g_form.hideFieldMsg('close_notes');\n  if (newValue == '6') {\n    g_form.showFieldMsg('close_notes', 'Resolution notes rayi', 'error');\n  }\n"),
      explain: 'hideFieldMsg lekapote prathi state marpuki messages pile avtayi. Clean → condition → show: ide pattern next (hard) exercise lo kuda.',
      tests: [{ label: 'oke error message', expr: '__f.close_notes.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] }],
      variants: [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '6', close_notes: '' } } }, client: CHG('state', '6', '2'), tests: [{ label: 'paata message kuda pooyindi', expr: '__f.close_notes.msgs.length', expect: 0 }] }],
    }),
    jx('cs-glform2', 4, 'Resolved → resolution notes mandatory', 'hard', {
      scenario: { form: { values: { state: '2', close_notes: '' } } },
      client: CHG('state', '2', '6'),
      task: 'onChange (state) rayi: mundu close_notes ("Resolution notes") field message hide chey (hideFieldMsg). Tarvata state "6" ayithe close_notes mandatory chesi, kinda "Resolution notes rayi" ani error field message chupinchu; lekapothe mandatory teeseyyi.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Moodu pieces (medium+ exercises lo chesinavi): clean (hideFieldMsg) → if state 6 (mandatory + message) → else (mandatory teeseyyi).',
        'g_form.hideFieldMsg("close_notes"); if (newValue == "6") { setMandatory true + showFieldMsg } else { setMandatory false }',
        'g_form.hideFieldMsg("close_notes"); if (newValue == "6") { g_form.setMandatory("close_notes", true); g_form.showFieldMsg("close_notes", "Resolution notes rayi", "error"); } else { g_form.setMandatory("close_notes", false); }',
      ],
      solution: ONCHANGE("  g_form.hideFieldMsg('close_notes');\n  if (newValue == '6') {\n    g_form.setMandatory('close_notes', true);\n    g_form.showFieldMsg('close_notes', 'Resolution notes rayi', 'error');\n  } else {\n    g_form.setMandatory('close_notes', false);\n  }\n"),
      explain: 'Mundu clean chesi tarvata pettadam tho duplicate messages raavu. Nee PDI lo ide idea OOB ga undi: Data Policy "Make close info mandatory when resolved or closed" (form lo UI Policy laaga + import sets / SOAP ki; Background Script / GlideRecord save ni aapadu — PDI lo test chesam), onSubmit client script "(BP) Close Mandatory on Close or Resolve", onChange client script "Resolution details visibility on state" — open chesi chadivi chudu (marchaku).',
      tests: [
        { label: 'close_notes mandatory', expr: '__f.close_notes.mandatory', expect: true },
        { label: 'oka error message matrame', expr: '__f.close_notes.msgs.map(function (m) { return m.type + ":" + m.text })', expect: ['error:Resolution notes rayi'] },
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
  blurb: 'List lo select chesina records, list filter, refresh — client UI Action lo g_list ela vaadali.',
  scratch: {
    starter: "function showCount() {\n  jslog('Checked: ' + g_list.getChecked());\n  jslog('Filter: ' + g_list.getQuery());\n}",
    scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'], query: 'active=true' } },
    client: CALL('showCount'),
  },
  learn: [
    {
      h: '📋 g_list ante emiti?',
      body: [
        'g_form form kosam. g_list LIST kosam — incident list lo checkbox tho select chesina records gurinchi. List lo UI Action (client) rasinappudu g_list vaadatam.',
        'g_list.getChecked() → select chesina records sys_ids oka comma-separated STRING ga istundi: "id1,id2,id3". Emi select cheyyakapothe empty string "".',
        '✅ PDI lo: list object (GlideList2) lo g_list.getChecked(), g_list.getTableName(), g_list.getQuery(), g_list.getView(), g_list.refresh() unnayi; em select cheyyakapote getChecked "" istundi. g_list.size ane method ledu. g_list GLOBAL kaadu — list UI Action (client) script lopale untundi; anduke plain list page console lo g_list undefined (adi normal). List banner UI Action lo g_list.getChecked() work ayindi (PDI lo tested).',
        'Console lo try cheyyali ante: g_list badulu GlideList2.get("incident") vaadu (PDI lo tested) — Next Experience lo list gsft_main iframe lo untundi, kabatti mundu console context aa iframe ki marchu.',
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
    {
      h: '🔎 Filter, view, refresh — getQuery / getView / refresh',
      body: [
        'g_list.getQuery() → list meeda ippudu unna FILTER (encoded query), e.g. "active=true^priority=1" — select chesina records kaadu, filter motham. Sort (ORDERBY…) andulo raadu; sort kuda kavali ante g_list.getQuery({orderby: true}) → "active=true^priority=1^ORDERBYnumber" (list Number tho sort ayi unte). g_list.getTableName() → "incident". g_list.getView() → list view peru — default view ayithe "" (khali string).',
        'Server lo records marchina tarvata (GlideAjax / UI Action) kotha data chupinchadaniki g_list.refresh() — page motham kaadu, list matrame reload.',
        '✅ Nee PDI lo GlideList2.get("incident") tho test chesam: getQuery() → "active=true" (ORDERBY ledu), getQuery({orderby: true}) → "active=true^ORDERBYnumber", default view lo getView() → "", em tick cheyyakapothe getChecked() → "", refresh() method undi.',
      ],
      code: `var table = g_list.getTableName();   // "incident"
var filter = g_list.getQuery();      // "active=true^priority=1"  (ORDERBY raadu)
var sorted = g_list.getQuery({ orderby: true });   // "...^ORDERBYnumber"
var view = g_list.getView();         // default view ayithe ""
jslog(table + ' | ' + filter + ' | ' + view);
// server lo records marchaka — list reload:
g_list.refresh();`,
    },
  ],
  quiz: [
    q('g_list.getChecked() em istundi?', ['Array of sys_ids (JavaScript array)', 'Comma-separated sys_ids string', 'Select chesina records count', 'GlideRecord object'], 1, 'Comma-separated string, e.g. "id1,id2".'),
    q('Emi select cheyyakapothe getChecked() em istundi?', ['null (object ledu)', 'undefined (variable ledu)', '"" (empty string)', '0 (count zero)'], 2, 'Empty string "" — code lo if (!ids) tho "emi select cheyyaledu" ani check cheyyochu.'),
    q('g_list ekkada vaadatam?', ['Business Rule lo (server side)', 'List lo client UI Action lo', 'Scheduled Job lo', 'Update Set lo'], 1, 'List lo select chesina records kosam client UI Actions lo.'),
    q('Select chesina records count ela teesukuntam?', ['ids.length (string)', 'ids.split(",").length', 'ids.count() method', 'g_list.size property chaduvu'], 1, 'String ni split chesi length (empty check marchipoku). g_list.size ane property PDI lo ledu.'),
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
    jx('cs-gllist', 8, 'Filter check (getQuery)', 'medium', {
      scenario: { list: { table: 'incident', checked: [], query: 'active=true^priority=1' } },
      client: CALL('exportP1'),
      task: 'List banner UI Action kosam exportP1() rayi: list filter — g_list.getQuery() — lo "priority=1" lekapothe alert("Mundu priority=1 filter pettu") chupinchi return. Unte jslog("Exporting " + table + ": " + filter) — table = g_list.getTableName(). (Ippudu filter: active=true^priority=1.)',
      starter: "function exportP1() {\n  // Step 1: g_list nunchi list filter teesuko\n\n  // Step 2: andulo 'priority=1' lekapothe (indexOf == -1) alert + return\n\n  // Step 3: 'Exporting ' + table + ': ' + filter log chey\n}",
      hint: [
        'g_list.getQuery() list meeda unna filter ni encoded query string ga istundi. String lo oka mukka undha ani indexOf tho chudochu (-1 = ledu).',
        "var query = g_list.getQuery();   if (query.indexOf('priority=1') == -1) { alert(...); return; }",
        "var query = g_list.getQuery(); if (query.indexOf('priority=1') == -1) { alert('Mundu priority=1 filter pettu'); return; } jslog('Exporting ' + g_list.getTableName() + ': ' + query);",
      ],
      solution: "function exportP1() {\n  var query = g_list.getQuery();\n  if (query.indexOf('priority=1') == -1) {\n    alert('Mundu priority=1 filter pettu');\n    return;\n  }\n  jslog('Exporting ' + g_list.getTableName() + ': ' + query);\n}",
      explain: 'getQuery() = list paina breadcrumb lo kanipinche filter, encoded query form lo (active=true^priority=1) — selected records kaadu. Selected records kavali ante getChecked(). Sort (ORDERBY…) getQuery() lo raadu — getQuery({orderby: true}) isthe matrame vastundi (nee PDI lo tested), kabatti ee filter check ki sort adda raadu.',
      tests: [{ label: 'Exporting log', logs: ['Exporting incident: active=true^priority=1'] }],
      variants: [
        { name: 'P1 filter ledu', scenario: { list: { table: 'incident', checked: [], query: 'active=true' } }, tests: [{ label: 'alert matrame', logs: ['Mundu priority=1 filter pettu'] }] },
        { name: 'problem list', scenario: { list: { table: 'problem', checked: [], query: 'priority=1^state=2' } }, tests: [{ label: 'table + filter', logs: ['Exporting problem: priority=1^state=2'] }] },
      ],
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
        'Medium+ "Limit check confirm kante mundu" laage, kani anniti kante mundu empty check: "" ayithe split chesthe length 1 vastundi — anduke count kante MUNDU check.',
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
        'System Definition → Client Scripts lo create chestam. Important fields: Name, Table (incident), UI Type (choices: Desktop, "Mobile / Service Portal", All — PDI lo verified; All = rendu chotla), Type (onLoad / onChange / onSubmit / onCellEdit), Field name (onChange mariyu onCellEdit ki), Active, Script.',
        'ServiceNow template function ichestundi — adi marchakunda andulo code rayali: function onLoad() { }, function onChange(control, oldValue, newValue, isLoading, isTemplate) { }, function onSubmit() { }.',
      ],
    },
    {
      h: '🛡️ onChange parameters & guard',
      body: [
        'control = marchina field element. newValue = ippudu value. oldValue = form LOAD ayinappati value — user field ni rendu sarlu marchina, "last-before" value kaadu, form open ayinappudu unna value. (✅ Nee PDI lo verified: OOB "Worknotes mandatory onChange of priority" tho priority 4 → 2 → 3 → 4 chesam — Work notes mandatory, mandatory, mandatory KAADU; last step lo oldValue 4 = load value, newValue kuda 4.) Anni strings. isLoading = form load avtunnappudu true (load time lo kuda onChange run avtundi!). isTemplate = template apply chesthe true.',
        'Standard guard: if (isLoading || newValue === "") return; — idi lekapothe form open chesinappudu script run ayyi anavasara messages vastayi.',
        '🔁 Script g_form.setValue() tho ADE field ni marchite onChange MALLI run avtundi (PDI lo verified). "Revert" scripts (g_form.setValue(field, oldValue)) lo aa call ki newValue == oldValue — rendo guard: if (newValue == oldValue) return; lekapothe confirm / message rendu sarlu vastayi. Gurtu: user field ni load value ki tirigi pettinappudu kuda newValue == oldValue — appudu kuda run avvalsina logic (hide, options restore) unte ee guard pettaku.',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }
  if (newValue == oldValue) {   // revert scripts lo: g_form.setValue valla malli vachina call
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
    q('Client Script template function ni emi cheyyali?', ['Function peru marchali', 'Marchakunda andulo rayali', 'Delete chesi kotha di rayali', 'gs.info add cheyyali'], 1, 'Function names marchakudadu — ServiceNow aa peru tho call chestundi.'),
    q('onChange Client Script ki extra field edi?', ['Field name', 'Order', 'Condition builder', 'Roles list'], 0, 'Type onChange ayithe Field name select chestam.'),
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
      explain: 'oldValue/newValue strings — direct ga + tho join cheyyochu. Guard valla form load lo (isLoading) log raadu.',
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
      scenario: { form: { values: { priority: '2' } } },
      client: CHG('priority', '2', '4'),
      task: 'onChange (priority) rayi: number takkuva ayithe jslog("Escalated: 2 → 1") laaga, lekapothe jslog("De-escalated: 2 → 4") laaga log chey (oldValue → newValue). Ippudu 2 nunchi 4 ki marindi. 🧰 Vaade words: oldValue, newValue, parseInt, if / else, jslog()',
      starter: ONCHANGE("  // Step 1: oldValue, newValue ni parseInt(.., 10) tho numbers ga marchu\n  var oldNum;\n  var newNum;\n\n  // Step 2: newNum < oldNum ayithe 'Escalated: ', lekapothe 'De-escalated: '\n  //         + oldValue + ' → ' + newValue\n"),
      hint: [
        'Medium exercise laage compare, kani ippudu else branch kuda undi. Log text lo original strings (oldValue / newValue) direct ga vaadochu.',
        'var oldNum = parseInt(oldValue, 10); var newNum = parseInt(newValue, 10);   if (newNum < oldNum) { ... } else { ... }',
        'if (newNum < oldNum) { jslog("Escalated: " + oldValue + " → " + newValue); } else { jslog("De-escalated: " + oldValue + " → " + newValue); }',
      ],
      solution: ONCHANGE("  var oldNum = parseInt(oldValue, 10);\n  var newNum = parseInt(newValue, 10);\n  if (newNum < oldNum) {\n    jslog('Escalated: ' + oldValue + ' → ' + newValue);\n  } else {\n    jslog('De-escalated: ' + oldValue + ' → ' + newValue);\n  }\n"),
      explain: 'oldValue = form LOAD ayinappati value (ikkada 2) — "form open ayinappudu enta, ippudu enta" ani telustundi. User madhyalo inkoka value pettina, oldValue maaradu. Next exercises lo oldValue tho marpu ni undo chestam.',
      tests: [{ label: 'De-escalated log', logs: ['De-escalated: 2 → 4'] }],
      variants: [{ name: '3 nunchi 1 ki', scenario: { form: { values: { priority: '3' } } }, client: CHG('priority', '3', '1'), tests: [{ label: 'Escalated log', logs: ['Escalated: 3 → 1'] }] }],
    }),
    jx('cs-client', 6, 'Marpu undo chey (oldValue tho)', 'medium+', {
      scenario: { form: { values: { priority: '3' } } },
      client: CHG('priority', '3', '1'),
      task: 'Practice rule: form lo nunchi priority "1" pettakudadu. onChange (priority) rayi: newValue "1" ayithe g_form.setValue("priority", oldValue) tho form load ayinappati value ki revert chey. Revert valla onChange malli run avtundi — top lo guard "if (newValue == oldValue) return;" kuda pettu. 🧰 Vaade words: oldValue, newValue, g_form.setValue()',
      starter: ONCHANGE("  // Step 1: re-fire guard — newValue == oldValue ayithe return\n\n  // Step 2: newValue '1' ayithe priority ni malli oldValue ki set chey\n"),
      hint: [
        'Revert ante field ni paata value ki marchadam. Paata value ekkada undi? — oldValue parameter lo (form load ayinappati value).',
        'if (newValue == oldValue) { return; }   if (newValue == "1") { g_form.setValue(<field>, <paata value>); }',
        'if (newValue == oldValue) { return; } if (newValue == "1") { g_form.setValue("priority", oldValue); }',
      ],
      solution: ONCHANGE("  if (newValue == oldValue) {\n    return;\n  }\n  if (newValue == '1') {\n    g_form.setValue('priority', oldValue);\n  }\n"),
      explain: 'setValue(field, oldValue) user marpu ni venakki tippestundi. Aa setValue valla onChange MALLI run avtundi (newValue = "3" = oldValue) — guard ventane return. Ikkada "1" check valla guard lekunda kuda emi jaragadu, kani confirm / message unna revert scripts lo guard lekapothe avi rendu sarlu vastayi. ⚠️ Real lo priority impact + urgency nunchi Data Lookup tho set avtundi (nee PDI lo UI Policy "Priority is managed by Data Lookup - set as read-only") — ee rule practice kosam matrame.',
      tests: [{ label: 'priority back to 3', expr: "g_form.getValue('priority')", expect: '3' }],
      variants: [{ name: '3 nunchi 2 ki', scenario: { form: { values: { priority: '3' } } }, client: CHG('priority', '3', '2'), tests: [{ label: 'priority 2 ala undali', expr: "g_form.getValue('priority')", expect: '2' }] }],
    }),
    jx('cs-client', 7, 'P1 nunchi downgrade warning (&&)', 'medium+', {
      scenario: { form: { values: { priority: '1' } } },
      client: CHG('priority', '1', '3'),
      task: 'onChange (priority) rayi: oldValue "1" (P1) nunchi "1" kaani value ki marchite addErrorMessage("P1 ni downgrade cheyyaku — manager ni adugu") chupinchu. Rendu conditions && tho. 🧰 Vaade words: oldValue, newValue, &&, g_form.addErrorMessage()',
      starter: ONCHANGE('  // TODO: oldValue P1 AND newValue P1 kaadu → error message\n'),
      hint: [
        'Rendu conditions okesari nijam kavali: paata value "1", kotta value "1" kaadu.',
        'if (oldValue == "1" && newValue != "1") { ... }',
        'if (oldValue == "1" && newValue != "1") { g_form.addErrorMessage("P1 ni downgrade cheyyaku — manager ni adugu"); }',
      ],
      solution: ONCHANGE("  if (oldValue == '1' && newValue != '1') {\n    g_form.addErrorMessage('P1 ni downgrade cheyyaku — manager ni adugu');\n  }\n"),
      explain: 'newValue != "1" enduku? User P1 ki tirigi pettinappudu, leda revert setValue valla onChange malli vachinappudu, newValue = oldValue = "1" — appudu marpu ledu, message raakudadu. Hard exercise "Resolved record reopen block" lo revert tarvata idi kavali.',
      tests: [{ label: 'Error message', expr: MSGS, expect: ['P1 ni downgrade cheyyaku — manager ni adugu'] }],
      variants: [
        { name: '2 nunchi 3 ki', scenario: { form: { values: { priority: '2' } } }, client: CHG('priority', '2', '3'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
        { name: '1 nunchi 1 (malli fire)', scenario: { form: { values: { priority: '1' } } }, client: CHG('priority', '1', '1'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
      ],
    }),
    jx('cs-client', 4, 'Resolved record reopen block', 'hard', {
      scenario: { form: { values: { state: '6' } } },
      client: CHG('state', '6', '2'),
      task: 'onChange (state) rayi: oldValue "6" (Resolved) nunchi vere state ki marchite, marpu ni revert chey (g_form.setValue("state", oldValue)) mariyu addErrorMessage("Resolved incident ni reopen cheyyaku") chupinchu. Revert valla onChange malli run avtundi — error okkasari matrame raavali (guard).',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Medium+ "Marpu undo chey (oldValue tho)" (revert + guard) + "P1 nunchi downgrade warning (&&)" (&& condition + error) kalipi — ippudu state field, "6" (Resolved).',
        'if (newValue == oldValue) { return; }   if (oldValue == "6" && newValue != "6") { setValue tho revert; error message; }',
        'if (newValue == oldValue) { return; } if (oldValue == "6" && newValue != "6") { g_form.setValue("state", oldValue); g_form.addErrorMessage("Resolved incident ni reopen cheyyaku"); }',
      ],
      solution: ONCHANGE("  if (newValue == oldValue) {\n    return;\n  }\n  if (oldValue == '6' && newValue != '6') {\n    g_form.setValue('state', oldValue);\n    g_form.addErrorMessage('Resolved incident ni reopen cheyyaku');\n  }\n"),
      explain: 'oldValue (form load value) tho marpu ni undo chesam. setValue("state", "6") valla onChange MALLI run avtundi — appudu newValue = oldValue = "6", kabatti top guard (newValue == oldValue) ventane return chestundi; "newValue != 6" condition kuda aa call ni aapestundi. Rendu lekapothe error rendu sarlu vastundi (test: error okkate undali).',
      tests: [
        { label: 'state back to 6', expr: "g_form.getValue('state')", expect: '6' },
        { label: 'Error message (okkasari)', expr: '__msgs.map(function (m) { return m.kind })', expect: ['error'] },
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
    {
      h: '⚠️ onLoad gotchas — PDI lo test chesinavi',
      body: [
        '"Mandatory wins": field EMPTY + MANDATORY ga unte setReadOnly(true) / setDisplay(false) pani cheyyavu — field editable ga, kanipistu untundi, error kuda raadu. Mundu g_form.setMandatory(field, false), tarvata read-only / hide.',
        'Typo: form lo leni field peru (e.g. "assigned_too") ichina error raadu — silent ga emi jaragadu. Script pani cheyyakapothe field names check chey (SN Utils tho technical names chudochu).',
        'onLoad lo server data kavali ante Display Business Rule + g_scratchpad (form tho paatu vastundi). getReference / GlideAjax onLoad lo pedite form load ayyaka inko server call — slow.',
      ],
      code: `function onLoad() {
  if (!g_user.hasRole('itil')) {
    g_form.setMandatory('category', false); // empty + mandatory ayithe hide ignore avtundi
    g_form.setDisplay('category', false);
  }
}`,
    },
  ],
  quiz: [
    q('onLoad eppudu run avtundi?', ['Field marchinappudu', 'Form load ayyaka', 'Submit mundu', 'Server lo'], 1, 'Form load ayyaka oka saari.'),
    q('onLoad (client) lo new record aa ani ela check chestam?', ['g_form.isNewRecord()', 'gs.isNewRecord()', 'current.isNewRecord', 'g_user.isNewUser()'], 0, 'g_form.isNewRecord() — client lo. gs / current server objects.'),
    q('onLoad lo server data kavali — best way?', ['g_scratchpad', 'getReference chala sarlu', 'Sync GlideRecord', 'prompt()'], 0, 'Display Business Rule tho g_scratchpad.'),
    q('Closed incident ni edit cheyyakunda cheyyali?', ['setReadOnly(field, true)', 'setMandatory(field, true)', 'clearValue(field)', 'setVisible(field, true)'], 0, 'setReadOnly(field, true) (+ ACL). Gurtu: empty + mandatory field ki read-only pani cheyyadu.'),
    q('onLoad lo oldValue / newValue untaya?', ['Avunu, onLoad ki kuda untayi', 'Ledu — adi onChange ki matrame', 'Strings ga untayi', 'Untayi, kani numbers ga matrame'], 1, 'onLoad function ki parameters levu.'),
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
      explain: 'Defaults new records ki matrame — existing records marchakudadu. (Nee PDI lo Caller already OOB UI Policy "Set Caller field mandatory state" tho mandatory — ikkada practice.)',
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
      explain: 'End user portal-like experience: role lekapote fields hide. Gurtu: idi UI convenience, security kosam ACL kavali. Aa fields lo edaina empty + mandatory ayithe hide / read-only ignore avtundi ("mandatory wins") — appudu mundu setMandatory(false).',
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
  blurb: 'Field marchinappudu: dependent fields clear, messages, show + mandatory, reference check.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.clearValue('assigned_to');\n}",
    scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_admin' } } },
    client: CHG('assignment_group', 'g_desk', 'g_net'),
  },
  learn: [
    {
      h: '⚡ onChange use cases',
      body: [
        'Dependent fields: assignment group marchite assigned_to clear cheyyali (aa group lo lenivaadu undakudadu). State = On Hold ayithe "On hold reason" chupinchi mandatory. Impact+Urgency → P1 warning.',
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
    {
      h: '🏢 Nee PDI lo OOB onChange scripts — chadivi nerchuko',
      body: [
        'System Definition → Client Scripts lo Table = incident, Type = onChange filter pettu. Ee OOB scripts open chesi chadavu — read-only ga chudu, marchaku:',
        '"Empty assigned_to on group change" (assignment_group) — group marite assigned_to clear. "Highlight VIP Caller" (caller_id) — getReference(callback) tho caller VIP aa ani chusi highlight (callback lo caller.vip == "true" — string compare). "Resolution details visibility on state" (state). "Worknotes mandatory onChange of priority" (priority) — code (PDI lo chadivi verified): if (isLoading || newValue === "" || g_form.isNewRecord()) return; newValue == oldValue ayithe g_form.setMandatory("work_notes", false), lekapothe true. Ante priority form LOAD value nunchi marithe Work notes mandatory, load value ki tirigi vasthe mandatory teesestundi; new record lo emi cheyyadu.',
        'UI Policy "When state is On Hold the On hold reason field is visible and mandatory" kuda undi — simple show / mandatory ki UI Policy chalu; logic / server data kavali ante Client Script.',
      ],
    },
  ],
  quiz: [
    q('Assignment group marchite assigned_to emi cheyyali?', ['Alage vadileyyali, em cheyyakudadu', 'Clear cheyyali (group lo undakapovachu)', 'Aa record ni delete cheyyali', 'Assigned to ni mandatory cheyyali'], 1, 'Dependent field ni clear cheyyadam standard (PDI lo OOB "Empty assigned_to on group change").'),
    q('onChange lo user ki visible ga cheppadaniki?', ['g_form.addInfoMessage / showFieldMsg', 'gs.info (server log matrame)', 'console.log matrame (user ki kanipinchadu)', 'jslog matrame (browser log)'], 0, 'g_form messages.'),
    q('Caller inactive check ki?', ['getReference (callback)', 'g_user.active property tho', 'gs.getUser() client lo', 'Update Set lo check chesi'], 0, 'getReference callback lo caller.active.'),
    q('onChange guard lo isLoading ni enduku check chestam?', ['Form load lo kuda fire avtundi', 'Performance penchadaniki matrame', 'Field mandatory cheyyadaniki', 'Security kosam'], 0, 'Load time lo field values set avvadam valla onChange fire avtundi.'),
    q('onChange Client Script eppudu run avtundi?', ['Field marinappudu, form load lo kuda', 'Record save ayyaka, server lo matrame', 'User login ayinappudu matrame', 'Page refresh lo matrame'], 0, 'Select chesina field value marinappudu — form load lo kuda (isLoading = true) run avtundi, anduke guard.'),
  ],
  exercises: [
    jx('cs-onchange', 1, 'Group marchite assigned_to clear', 'easy', {
      scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_admin' } } },
      client: CHG('assignment_group', 'g_desk', 'g_net'),
      task: 'onChange (assignment_group) rayi: assigned_to ni clear chey (g_form.clearValue). (Guard marchaku — form load lo clear avvakudadu.)',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'g_form.clearValue("assigned_to");',
      solution: ONCHANGE("  g_form.clearValue('assigned_to');\n"),
      explain: 'Group marindi kabatti pata assignee invalid avtadu. Guard (isLoading) lekapothe form OPEN chesinappude assigned_to clear ayipotundi — classic bug. Nee PDI lo OOB client script "Empty assigned_to on group change" ide chestundi — open chesi chudu (marchaku).',
      tests: [{ label: 'assigned_to empty', expr: "g_form.getValue('assigned_to')", expect: '' }],
    }),
    jx('cs-onchange', 2, 'P1 warning', 'easy', {
      scenario: { form: { values: { impact: '1', urgency: '2' } } },
      client: CHG('urgency', '2', '1'),
      task: 'onChange (urgency) rayi: newValue "1" mariyu impact "1" ayithe info message "This will be a P1 incident" chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: 'if (newValue == "1" && g_form.getValue("impact") == "1") { ... }',
      solution: ONCHANGE("  if (newValue == '1' && g_form.getValue('impact') == '1') {\n    g_form.addInfoMessage('This will be a P1 incident');\n  }\n"),
      explain: 'Marchina field newValue lo, migilina field g_form.getValue tho.',
      tests: [{ label: 'message', expr: MSGS, expect: ['This will be a P1 incident'] }],
    }),
    jx('cs-onchange', 3, 'On Hold → On hold reason chupinchu + mandatory', 'medium', {
      scenario: { form: { values: { state: '2', hold_reason: '' }, hidden: ['hold_reason'] } },
      client: CHG('state', '2', '3'),
      task: 'onChange (state) rayi: state "3" (On Hold) ayithe hold_reason ("On hold reason") ni chupinchu (setDisplay true) mariyu mandatory chey. Vere state ki marite: mandatory TEESI, tarvata hide chey (setDisplay false). ⚠️ Order mukhyam — empty + mandatory field ni hide cheyyalemu ("mandatory wins", PDI lo test chesam).',
      starter: ONCHANGE('  // TODO: On Hold (3) → show + mandatory\n  //       lekapothe → mundu mandatory false, tarvata hide\n'),
      hint: [
        'Rendu branches: On Hold ayithe show + mandatory; lekapothe mandatory off + hide. Else lo ORDER chudu — field empty + mandatory ga unte hide ignore avtundi.',
        'if (newValue == "3") { setDisplay(true); setMandatory(true); } else { setMandatory(false); setDisplay(false); }',
        'if (newValue == "3") { g_form.setDisplay("hold_reason", true); g_form.setMandatory("hold_reason", true); } else { g_form.setMandatory("hold_reason", false); g_form.setDisplay("hold_reason", false); }',
      ],
      solution: ONCHANGE("  if (newValue == '3') {\n    g_form.setDisplay('hold_reason', true);\n    g_form.setMandatory('hold_reason', true);\n  } else {\n    g_form.setMandatory('hold_reason', false);\n    g_form.setDisplay('hold_reason', false);\n  }\n"),
      explain: 'Nee PDI lo OOB UI Policy "When state is On Hold the On hold reason field is visible and mandatory" ide pani chestundi — ikkada same idea Client Script tho practice. "Mandatory wins": hold_reason empty + mandatory ga unnappudu setDisplay(false) PDI lo ignore avtundi — anduke mundu setMandatory(false). Gurtu: ikkada "newValue == oldValue" guard pettaku — user load value (In Progress) ki tirigi vachinappudu kuda hide jaragali.',
      tests: [{ label: 'hold_reason visible + mandatory', expr: '[__f.hold_reason.visible, __f.hold_reason.mandatory]', expect: [true, true] }],
    }),
    jx('cs-onchange', 5, 'Caller name short description lo', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_abel' } } },
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
      tests: [
        { label: 'short_description', expr: "g_form.getValue('short_description')", expect: 'Issue for Bud Richman' },
        { label: 'callback style (sync getReference ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
    }),
    jx('cs-onchange', 6, 'Inactive caller warning', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_abel' } } },
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
      tests: [
        { label: 'error message', expr: MSGS, expect: ['Caller inactive'] },
        { label: 'callback style (sync getReference ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
      variants: [{ name: 'active caller', scenario: { form: { values: { caller_id: 'u_abel' } } }, client: CHG('caller_id', 'u_abel', 'u_bud'), tests: [{ label: 'error ledu', expr: MSGS, expect: [] }] }],
    }),
    jx('cs-onchange', 7, 'Inactive assignee clear', 'medium+', {
      scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_abel' } } },
      client: CHG('assigned_to', 'u_abel', 'u_fred'),
      task: 'onChange (assigned_to) rayi: getReference("assigned_to", ...) tho user techchuko. Aa user inactive ("false") ayithe assigned_to ni clear chey (g_form.clearValue). 🧰 Vaade words: g_form.getReference(), g_form.clearValue()',
      starter: ONCHANGE('  // TODO: assigned_to user techchuko → inactive ayithe clear\n'),
      hint: [
        'Medium+ "Inactive caller warning" laage getReference + active check, kani ippudu field assigned_to, action = clear.',
        'g_form.getReference("assigned_to", function (user) { if (user.active == "false") { ... } });',
        'g_form.getReference("assigned_to", function (user) { if (user.active == "false") { g_form.clearValue("assigned_to"); } });',
      ],
      solution: ONCHANGE("  g_form.getReference('assigned_to', function (user) {\n    if (user.active == 'false') {\n      g_form.clearValue('assigned_to');\n    }\n  });\n"),
      explain: 'Callback parameter peru manam pettukunedi (caller, user ...). Clear chesinappudu ADE field marindi kabatti onChange malli run avtundi — newValue === "" guard daanni aapestundi.',
      tests: [
        { label: 'assigned_to empty', expr: "g_form.getValue('assigned_to')", expect: '' },
        { label: 'callback style (sync getReference ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
      variants: [{ name: 'active user', scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_abel' } } }, client: CHG('assigned_to', 'u_abel', 'u_bud'), tests: [{ label: 'assigned_to ala undali', expr: "g_form.getValue('assigned_to')", expect: 'u_bud' }] }],
    }),
    jx('cs-onchange', 4, 'Inactive caller block', 'hard', {
      scenario: { form: { values: { caller_id: 'u_abel' } } },
      client: CHG('caller_id', 'u_abel', 'u_fred'),
      task: 'onChange (caller_id) rayi: getReference tho caller techchuko. caller.active == "false" ayithe addErrorMessage("Caller inactive") chupinchi caller_id ni clear chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'Medium+ "Inactive caller warning" (error message) + "Inactive assignee clear" (clear) kalipi — caller_id field meeda.',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { error message; clear; } });',
        'g_form.getReference("caller_id", function (caller) { if (caller.active == "false") { g_form.addErrorMessage("Caller inactive"); g_form.clearValue("caller_id"); } });',
      ],
      solution: ONCHANGE("  g_form.getReference('caller_id', function (caller) {\n    if (caller.active == 'false') {\n      g_form.addErrorMessage('Caller inactive');\n      g_form.clearValue('caller_id');\n    }\n  });\n"),
      explain: 'Reference record fields (caller.active) callback lo strings ga vastayi: "false". clearValue("caller_id") valla onChange malli vastundi (newValue ""), guard aapestundi.',
      tests: [
        { label: 'caller cleared', expr: "g_form.getValue('caller_id')", expect: '' },
        { label: 'error message', expr: MSGS, expect: ['Caller inactive'] },
        { label: 'callback style (sync getReference ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
    }),
  ],
}

export const CS_LESSONS_B = [glform2, gllist, clientScripts, onload, onchange]
