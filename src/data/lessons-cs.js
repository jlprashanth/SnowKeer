// Stage 3 · Client-side scripting (Udemy section "Client scripting & UI"): same Learn / Quiz / Code format as Stage 2,
// but the code runs against a mock incident FORM (g_form, g_user, g_scratchpad ... — see src/js/clientMock.js) and the form is shown live.
// Each exercise: client: { trigger: { type: 'onLoad' | 'onChange' | 'onSubmit', ... } }. Tests may use:
//   __f.<field>.{value,mandatory,readOnly,visible,choices,msgs}, __msgs (form messages), __submit, g_form, g_user.
import { q, jx } from './lessonKit.js'
import { CS_LESSONS_B } from './lessons-cs-b.js'
import { CS_LESSONS_C } from './lessons-cs-c.js'
import { CS_LESSONS_D } from './lessons-cs-d.js'
import { CS_LESSONS_E } from './lessons-cs-e.js'
import { VARIANTS_CS } from './variants-cs.js'

const LOAD = { trigger: { type: 'onLoad' } }
const onChangeOf = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const MSGS = '__msgs.map(function (m) { return m.text })'

/* 2 — What is client and server, GlideUser API */
const gluser = {
  id: 'cs-gluser',
  title: 'Client vs Server & GlideUser (g_user)',
  video: 'What is client and Server, GlideUser API',
  duration: '',
  no: 2,
  blurb: 'Script ekkada run avtundi — browser lo na server lo? g_user, g_scratchpad tho current user details.',
  scratch: {
    starter: "function onLoad() {\n  g_form.addInfoMessage('Hello ' + g_user.firstName + '!');\n}",
    scenario: { user: { userName: 'abel.tuter', firstName: 'Abel', lastName: 'Tuter', userID: 'u_abel', roles: ['itil'] } },
    client: LOAD,
  },
  learn: [
    {
      h: '🖥️ Client vs Server — script ekkada run avtundi?',
      body: [
        'Client = nee browser. Server = ServiceNow instance. Client Script, UI Policy script, UI Action (client = true) browser lo run avtayi — form open chesinappudu, field marchinappudu, Submit nokkinappudu.',
        'Business Rule, Script Include, Scheduled Job server lo run avtayi — database tho direct ga matladatayi.',
        'Ee difference chala important: client lo gs (GlideSystem) ledu. Client lo g_form, g_user vaadataam. Server lo gs, current vaadataam.',
      ],
      code: `// CLIENT (browser)            // SERVER (instance)
g_form.setValue(...)           gs.info(...)
g_user.userName                gs.getUserName()
g_scratchpad.xyz               current.short_description`,
    },
    {
      h: '👤 g_user — ippudu login ayina user gurinchi',
      body: [
        'g_user object lo ippudu logged-in user info untundi. Server ki round trip avasaram ledu, anduke fast.',
        'Properties: g_user.userName, g_user.firstName, g_user.lastName, g_user.userID (sys_id). Methods: g_user.hasRole("itil"), g_user.hasRoleExactly("admin"), g_user.hasRoles(), g_user.hasRoleFromList("itil,admin").',
        '⚠️ g_user.hasRole("x") admin users ki ellappudu true istundi (admin ki anni roles untayi anukuntundi). Exact check kavalante hasRoleExactly vaadu.',
      ],
      code: `function onLoad() {
  if (g_user.hasRole('itil')) {
    g_form.addInfoMessage('Welcome ' + g_user.firstName + ' — nuvvu fulfiller vi');
  }
}`,
    },
    {
      h: '🎒 g_scratchpad — server nunchi client ki data',
      body: [
        'Client lo database query cheyyadam slow. Alternative: Display Business Rule server lo run ayyi, form load ayye mundu g_scratchpad lo values pettestundi. Client Script ee values ni vaadochu.',
        'Server (Display BR): g_scratchpad.callerIsVip = current.caller_id.vip == true;',
        'Client: if (g_scratchpad.callerIsVip) { ... } — extra server call ledu.',
      ],
      code: `// Display Business Rule (server)
g_scratchpad.callerIsVip = (current.caller_id.vip == true);

// Client Script (onLoad)
function onLoad() {
  if (g_scratchpad.callerIsVip) g_form.addInfoMessage('VIP caller!');
}`,
    },
    {
      h: '🧠 Gurtupettukovali',
      body: [
        'Client lo field value ellappudu string. g_form.getValue("priority") → "1" (number kaadu).',
        'Client lo gs.info() work avvadu — debug ki jslog() / console.log() / g_form.addInfoMessage() vaadu.',
        '✅ Mana PDI lo test chesam: hasRole("edaina") admin ki true (role ledu ante kuda), hasRoleExactly exact role matrame; g_user properties: userName, firstName, lastName, fullName, userID (g_user.email / g_user.active levu). Nee release lo kuda ila ne ani check chesuko.',
      ],
    },
  ],
  quiz: [
    q('Client Script ekkada run avtundi?', ['ServiceNow server lo', 'User browser lo', 'Database lo', 'MID Server lo'], 1, 'Client Scripts browser lo run avtayi.'),
    q('Client script lo current user first name ela teesukuntam?', ['gs.getUserName()', 'g_user.firstName', 'current.firstName', 'g_form.getValue("firstName")'], 1, 'Client lo g_user.firstName. gs. server only.'),
    q('g_user.hasRole("itil") — admin user ki em istundi?', ['false', 'true', 'error', 'undefined'], 1, 'Admin ki hasRole ellappudu true. Exact kavali ante hasRoleExactly.'),
    q('Server data ni client ki extra call lekunda ela pampali?', ['g_scratchpad (Display BR)', 'g_user.userID', 'gs.getProperty', 'Update Set'], 0, 'Display Business Rule lo g_scratchpad lo values pettali.'),
    q('Client script lo gs.info("hi") rasthe?', ['Script Log lo vastundi', 'Error — gs client lo ledu', 'Form lo message', 'Em jaragadu'], 1, 'gs server API. Client lo adi available ledu.'),
  ],
  exercises: [
    jx('cs-gluser', 1, 'User ki welcome message', 'easy', {
      scenario: { user: { firstName: 'Abel', lastName: 'Tuter', userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'onLoad Client Script rayi: form load ayinappudu "Welcome Abel" ani info message chupinchu (g_user.firstName vaadu — peru hardcode cheyyaku).',
      starter: 'function onLoad() {\n  // TODO: g_form.addInfoMessage("Welcome " + ...)\n}',
      hint: 'g_form.addInfoMessage("Welcome " + g_user.firstName);',
      solution: "function onLoad() {\n  g_form.addInfoMessage('Welcome ' + g_user.firstName);\n}",
      explain: 'g_user.firstName current user peru istundi. addInfoMessage form paina blue message chupistundi.',
      tests: [{ label: 'Message: Welcome Abel', expr: MSGS, expect: ['Welcome Abel'] }],
    }),
    jx('cs-gluser', 2, 'Role lekapote read-only', 'easy', {
      scenario: { user: { firstName: 'Abel', userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: LOAD,
      task: 'Assignment group ni "itil" role unna vaallu matrame edit cheyyali. onLoad lo: user ki itil role lekapote assignment_group ni read-only chey (g_form.setReadOnly).',
      starter: 'function onLoad() {\n  // TODO: itil role ledu ante assignment_group read-only\n}',
      hint: 'if (!g_user.hasRole("itil")) { g_form.setReadOnly("assignment_group", true); }',
      solution: "function onLoad() {\n  if (!g_user.hasRole('itil')) {\n    g_form.setReadOnly('assignment_group', true);\n  }\n}",
      explain: '! tho role lekapote ani check chesam. Real lo ACL kuda pettali — client script security kaadu, just UI convenience (browser lo evaraina bypass cheyochu).',
      tests: [{ label: 'assignment_group read-only', expr: '__f.assignment_group.readOnly', expect: true }],
    }),
    jx('cs-gluser', 3, 'New incident lo caller = nenu', 'medium', {
      scenario: { form: { isNew: true, values: {} }, user: { firstName: 'Abel', lastName: 'Tuter', userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'New incident form lo caller_id empty ga undi. onLoad lo: form new record ayithe (g_form.isNewRecord()) mariyu caller empty ayithe, caller_id ni current user (g_user.userID) tho set chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: [
        'Rendu conditions kavali: form kotha record aa? caller inka empty aa? Rendu true ayithe matrame caller ni current user tho fill chey.',
        'g_form.isNewRecord() true/false istundi; empty check: g_form.getValue("caller_id") == "". Reference field ki sys_id ivvali — adi g_user.userID lo undi.',
        'if (g_form.isNewRecord() && g_form.getValue("caller_id") == "") { g_form.setValue("caller_id", g_user.userID); }',
      ],
      solution: "function onLoad() {\n  if (g_form.isNewRecord() && g_form.getValue('caller_id') == '') {\n    g_form.setValue('caller_id', g_user.userID);\n  }\n}",
      explain: 'Reference field ki setValue lo sys_id istam — g_user.userID sys_id. Empty check lekapothe existing caller ni overwrite chestav.',
      tests: [{ label: 'caller_id = u_abel', expr: "g_form.getValue('caller_id')", expect: 'u_abel' }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 ----
    jx('cs-gluser', 5, 'g_scratchpad nundi value chaduvu', 'medium+', {
      scenario: { scratchpad: { callerGroup: 'Network' }, user: { firstName: 'Abel', userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'Display Business Rule server lo g_scratchpad.callerGroup = "Network" pettindi anukundam. onLoad lo aa value ni chadivi "Caller group: Network" ani info message chupinchu (peru hardcode cheyyaku — g_scratchpad nundi teesuko). 🧰 Vaade words: g_scratchpad, g_form.addInfoMessage()',
      starter: 'function onLoad() {\n  // Step 1: g_scratchpad.callerGroup ni oka variable lo pettu\n  var group;\n\n  // Step 2: "Caller group: " + group ani info message\n}',
      hint: [
        'g_scratchpad oka normal object laage — server pettina value ni g_scratchpad.<peru> tho chadavochu. Extra server call avasaram ledu.',
        'var group = g_scratchpad.callerGroup;   tarvata g_form.addInfoMessage(...) lo text + group join chey.',
        'var group = g_scratchpad.callerGroup;   g_form.addInfoMessage("Caller group: " + group);',
      ],
      solution: "function onLoad() {\n  var group = g_scratchpad.callerGroup;\n  g_form.addInfoMessage('Caller group: ' + group);\n}",
      explain: 'g_scratchpad lo values form load ayye mundu Display BR (server) pedutundi. Client script vaatini direct ga chaduvutundi — GlideAjax / getReference kante fast.',
      tests: [{ label: 'Message: Caller group: Network', expr: MSGS, expect: ['Caller group: Network'] }],
    }),
    jx('cs-gluser', 6, 'Scratchpad flag tho mandatory', 'medium+', {
      scenario: { scratchpad: { needsApproval: true }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'Display BR g_scratchpad.needsApproval = true pettindi. onLoad lo: ee flag true ayithe matrame description field ni mandatory chey. 🧰 Vaade words: g_scratchpad, if, g_form.setMandatory()',
      starter: 'function onLoad() {\n  // Step 1: if (g_scratchpad.needsApproval) { ... }\n  // Step 2: lopala description ni mandatory chey\n}',
      hint: [
        'Ee sari scratchpad value ni condition ga vaadu: flag true ayithe matrame action.',
        'if (g_scratchpad.needsApproval) { ... }   — lopala g_form.setMandatory(field, true).',
        'if (g_scratchpad.needsApproval) { g_form.setMandatory("description", true); }',
      ],
      solution: "function onLoad() {\n  if (g_scratchpad.needsApproval) {\n    g_form.setMandatory('description', true);\n  }\n}",
      explain: 'Display BR boolean pedithe client lo direct ga if lo vaadochu. Flag false ayithe em jaragadu — form normal ga untundi.',
      tests: [{ label: 'description mandatory', expr: "g_form.isMandatory('description')", expect: true }],
    }),
    jx('cs-gluser', 7, 'Flag true → rendu actions', 'medium+', {
      scenario: { scratchpad: { callerIsVip: true }, form: { values: { urgency: '3' } }, user: { firstName: 'Abel', userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'g_scratchpad.callerIsVip = true. onLoad lo VIP ayithe okate if block lo RENDU panulu chey: 1) urgency ni "1" ki set chey, 2) "VIP caller — Abel, please check" ani info message (Abel = g_user.firstName, hardcode cheyyaku). 🧰 Vaade words: g_scratchpad, g_user, g_form.setValue(), g_form.addInfoMessage()',
      starter: 'function onLoad() {\n  if (g_scratchpad.callerIsVip) {\n    // Step 1: urgency = "1"  (choice value string ga)\n    // Step 2: info message — g_user.firstName join chey\n  }\n}',
      hint: [
        'Okate condition, { } lopala rendu lines. Choice field ki stored value ("1") ivvali, label ("1 - High") kaadu.',
        'g_form.setValue("urgency", "1");   message: "VIP caller — " + g_user.firstName + ", please check".',
        'g_form.setValue("urgency", "1");   g_form.addInfoMessage("VIP caller — " + g_user.firstName + ", please check");',
      ],
      solution: "function onLoad() {\n  if (g_scratchpad.callerIsVip) {\n    g_form.setValue('urgency', '1');\n    g_form.addInfoMessage('VIP caller — ' + g_user.firstName + ', please check');\n  }\n}",
      explain: 'Okate if lo enni actions aina pettochu. Exercise 4 lo inko action (mandatory) kalipi full VIP script rastam.',
      tests: [
        { label: 'urgency = 1', expr: "g_form.getValue('urgency')", expect: '1' },
        { label: 'Message', expr: MSGS, expect: ['VIP caller — Abel, please check'] },
      ],
    }),
    jx('cs-gluser', 4, 'VIP caller (g_scratchpad)', 'hard', {
      scenario: { scratchpad: { callerIsVip: true }, form: { values: { urgency: '3', impact: '3' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'Display Business Rule g_scratchpad.callerIsVip = true pettindi anukundam. onLoad lo: VIP ayithe 1) "VIP caller — handle fast!" ani info message, 2) urgency ni "1" ki set chey, 3) short_description mandatory chey.',
      starter: 'function onLoad() {\n  // TODO: g_scratchpad.callerIsVip check chey\n}',
      hint: [
        'Medium+ exercises lo chesindi kalupu: g_scratchpad flag condition, lopala moodu actions (message, value, mandatory).',
        'if (g_scratchpad.callerIsVip) { ... }   lopala: g_form.addInfoMessage(...), g_form.setValue(field, "1"), g_form.setMandatory(field, true).',
        'if (g_scratchpad.callerIsVip) { g_form.addInfoMessage("VIP caller — handle fast!"); g_form.setValue("urgency", "1"); g_form.setMandatory("short_description", true); }',
      ],
      solution: "function onLoad() {\n  if (g_scratchpad.callerIsVip) {\n    g_form.addInfoMessage('VIP caller — handle fast!');\n    g_form.setValue('urgency', '1');\n    g_form.setMandatory('short_description', true);\n  }\n}",
      explain: 'g_scratchpad lo values server (Display BR) nunchi vastayi, client lo extra GlideRecord/GlideAjax avasaram ledu.',
      tests: [
        { label: 'Info message', expr: MSGS, expect: ['VIP caller — handle fast!'] },
        { label: 'urgency = 1', expr: "g_form.getValue('urgency')", expect: '1' },
        { label: 'short_description mandatory', expr: "g_form.isMandatory('short_description')", expect: true },
      ],
    }),
  ],
}

/* 3 — GlideForm API */
const glform = {
  id: 'cs-glform',
  title: 'GlideForm API (g_form)',
  video: 'GlideForm API',
  duration: '',
  no: 3,
  blurb: 'g_form tho form fields ni control cheyyadam: value, mandatory, read-only, hide, choices, messages.',
  scratch: {
    starter: "function onLoad() {\n  g_form.setMandatory('short_description', true);\n  g_form.setReadOnly('category', true);\n  g_form.addInfoMessage('Form ready');\n}",
    scenario: { form: { values: { priority: '3', category: 'software' } } },
    client: LOAD,
  },
  learn: [
    {
      h: '📝 Values — getValue / setValue / clearValue',
      body: [
        'g_form.getValue("field") ellappudu STRING istundi. g_form.setValue("field", value) field ni marchutundi. clearValue field ni empty chestundi.',
        'Reference field ki setValue lo sys_id istam: g_form.setValue("assignment_group", "g_net"). Number kavali ante g_form.getIntValue("priority"), true/false kavali ante getBooleanValue.',
      ],
      code: `var p = g_form.getValue('priority');      // "1" (string!)
if (p == '1') { ... }                      // idi work avtundi
g_form.setValue('urgency', '1');
g_form.clearValue('assigned_to');`,
    },
    {
      h: '🔒 Mandatory / Read-only / Visible',
      body: [
        'g_form.setMandatory("field", true|false) — red * vastundi, empty ayithe submit avvadu.',
        'g_form.setReadOnly("field", true) / setDisabled — edit cheyyaleru. g_form.setVisible("field", false) — field hide (space migilistundi), g_form.setDisplay("field", false) — hide + space kuda teesestundi.',
        'g_form.isMandatory("field") — ippudu mandatory na ani check.',
        '⚠️ UI Policy kuda ide chestundi — simple cases ki UI Policy better, complex logic ki Client Script. (Stage 1 lo chusam.)',
      ],
      code: `g_form.setMandatory('assignment_group', true);
g_form.setReadOnly('number', true);
g_form.setDisplay('assigned_to', false);`,
    },
    {
      h: '💬 Messages',
      body: [
        'g_form.addInfoMessage("text") — form paina blue banner. g_form.addErrorMessage("text") — red banner.',
        'g_form.showFieldMsg("field", "text", "info"|"error") — field kinda chinna message. g_form.hideFieldMsg("field") — teeseyyadaniki. g_form.clearMessages() — form-level messages anni clear.',
      ],
      code: `g_form.addErrorMessage('Short description rayi!');
g_form.showFieldMsg('category', 'Hardware ayithe asset tag kuda rayi', 'info');`,
    },
    {
      h: '🔽 Choice list options',
      body: [
        'g_form.addOption("field", "value", "Label") — choice add. g_form.removeOption("field", "value") — teeseyyadam. g_form.clearOptions("field") — anni teeseyyadam.',
        'Use case: impact Low ayithe urgency lo "1 - High" option teesestam.',
        '⚠️ Memory nunchi rasina method list — oka method peru nee PDI lo work avvakapote, SN Utils lo / docs lo confirm chesuko.',
      ],
      code: `g_form.removeOption('urgency', '1');
g_form.addOption('category', 'cloud', 'Cloud');`,
    },
  ],
  quiz: [
    q('g_form.getValue("priority") em type istundi?', ['number', 'string', 'boolean', 'object'], 1, 'Client lo getValue ellappudu string.'),
    q('Field ni hide chesi, aa space kuda teeseyyali ante?', ['setVisible(f,false)', 'setDisplay(f,false)', 'setReadOnly(f,true)', 'setMandatory(f,false)'], 1, 'setDisplay hide + space remove. setVisible space migilistundi.'),
    q('Field ki red error message kinda chupinchali ante?', ['g_form.addInfoMessage', 'g_form.showFieldMsg(f, msg, "error")', 'gs.addErrorMessage', 'alert()'], 1, 'showFieldMsg field kinda message chupistundi.'),
    q('Reference field assignment_group ki setValue lo em istam?', ['Group name', 'Group sys_id', 'Group description', 'Table name'], 1, 'Reference fields ki sys_id istam.'),
    q('Choice list nunchi oka option teeseyyadaniki?', ['g_form.removeOption', 'g_form.clearValue', 'g_form.deleteOption', 'g_form.hideOption'], 0, 'removeOption(field, value).'),
  ],
  exercises: [
    jx('cs-glform', 1, 'Mandatory fields', 'easy', {
      scenario: { form: { values: {} } },
      client: LOAD,
      task: 'onLoad lo: short_description mariyu category fields ni mandatory chey.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: 'g_form.setMandatory("short_description", true);',
      solution: "function onLoad() {\n  g_form.setMandatory('short_description', true);\n  g_form.setMandatory('category', true);\n}",
      explain: 'setMandatory(fieldName, true) red asterisk pedutundi.',
      tests: [
        { label: 'short_description mandatory', expr: "g_form.isMandatory('short_description')", expect: true },
        { label: 'category mandatory', expr: "g_form.isMandatory('category')", expect: true },
      ],
    }),
    jx('cs-glform', 2, 'P1 ayithe group mandatory', 'easy', {
      scenario: { form: { values: { priority: '3' } } },
      client: onChangeOf('priority', '3', '1'),
      task: 'onChange (priority) rayi: priority "1" ayithe assignment_group mandatory chey, lekapothe mandatory teeseyyi. (Guard: isLoading leda newValue empty ayithe return.)',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // TODO\n}",
      hint: 'g_form.setMandatory("assignment_group", newValue == "1");',
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.setMandatory('assignment_group', newValue == '1');\n}",
      explain: 'newValue string ("1"). Condition result (true/false) ni direct ga setMandatory ki pampochu — if/else avasaram ledu.',
      tests: [{ label: 'assignment_group mandatory', expr: "g_form.isMandatory('assignment_group')", expect: true }],
    }),
    jx('cs-glform', 3, 'Resolved ayithe group hide', 'medium', {
      scenario: { form: { values: { state: '6', assignment_group: 'g_desk' } } },
      client: LOAD,
      task: 'onLoad lo: state "6" (Resolved) ayithe 1) assignment_group ni hide chey (setDisplay), 2) "Incident already resolved" ani info message chupinchu.',
      starter: 'function onLoad() {\n  // TODO\n}',
      hint: [
        'Mundu state value chaduvu, adi Resolved ("6") aa ani check chey. True ayithe rendu panulu: field hide + form message.',
        'g_form.getValue("state") == "6" (string compare).   Hide + space teeseyyadaniki g_form.setDisplay(field, false).',
        'if (g_form.getValue("state") == "6") { g_form.setDisplay("assignment_group", false); g_form.addInfoMessage("Incident already resolved"); }',
      ],
      solution: "function onLoad() {\n  if (g_form.getValue('state') == '6') {\n    g_form.setDisplay('assignment_group', false);\n    g_form.addInfoMessage('Incident already resolved');\n  }\n}",
      explain: 'getValue("state") "6" string tho compare chesam.',
      tests: [
        { label: 'assignment_group hidden', expr: '__f.assignment_group.visible', expect: false },
        { label: 'Info message', expr: MSGS, expect: ['Incident already resolved'] },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to exercise 4 ----
    jx('cs-glform', 5, 'Choice list nundi option teeseyyi', 'medium+', {
      scenario: { form: { values: { category: 'software' } } },
      client: LOAD,
      task: 'Mee team database tickets teesukodu. onLoad lo category choice list nundi "database" option teeseyyi (value tho — label "Database" kaadu). 🧰 Vaade words: g_form.removeOption()',
      starter: 'function onLoad() {\n  // Step: g_form.removeOption(field, value) — category field, "database" value\n}',
      hint: [
        'Dropdown nundi oka option teeseyyadaniki g_form lo direct method undi. Choice yokka stored VALUE ivvali.',
        'g_form.removeOption(<field>, <value>) — field = "category".',
        'g_form.removeOption("category", "database");',
      ],
      solution: "function onLoad() {\n  g_form.removeOption('category', 'database');\n}",
      explain: 'removeOption(field, value) — value choice yokka backend value ("database"), screen meeda kanipinche label ("Database") kaadu.',
      tests: [{ label: 'category options lo database ledu', expr: '__f.category.choices.map(function (c) { return c.value })', expect: ['inquiry', 'software', 'hardware', 'network'] }],
    }),
    jx('cs-glform', 6, 'Field kinda message (showFieldMsg)', 'medium+', {
      scenario: { form: { values: { short_description: '' } } },
      client: LOAD,
      task: 'onLoad lo: short_description empty ayithe, aa field kinda "Problem ni okka line lo rayi" ani info field message chupinchu (form paina banner kaadu — field kinda). 🧰 Vaade words: g_form.getValue(), g_form.showFieldMsg()',
      starter: "function onLoad() {\n  // Step 1: short_description empty aa? (getValue == '')\n  // Step 2: g_form.showFieldMsg(field, text, 'info')\n}",
      hint: [
        'addInfoMessage form paina banner chupistundi. Ikkada oka field kinda message kavali — vere g_form method.',
        'if (g_form.getValue("short_description") == "") { ... }   lopala g_form.showFieldMsg(field, text, "info").',
        'g_form.showFieldMsg("short_description", "Problem ni okka line lo rayi", "info");',
      ],
      solution: "function onLoad() {\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Problem ni okka line lo rayi', 'info');\n  }\n}",
      explain: 'showFieldMsg 3rd value "info" leda "error". Message field kinda vastundi — user ki ekkada fix cheyyalo clear ga telustundi. Teeseyyadaniki g_form.hideFieldMsg(field).',
      tests: [
        { label: 'Field message (info)', expr: '__f.short_description.msgs.map(function (m) { return m.type + ": " + m.text })', expect: ['info: Problem ni okka line lo rayi'] },
        { label: 'Form banner ledu', expr: MSGS, expect: [] },
      ],
    }),
    jx('cs-glform', 7, 'onChange lo newValue batti option teeseyyi', 'medium+', {
      scenario: { form: { values: { impact: '2', urgency: '2' } } },
      client: onChangeOf('impact', '2', '1'),
      task: 'onChange (impact) rayi: impact "1" (High) ki maarithe urgency choice list nundi "3" (Low) option teeseyyi. (Guard: isLoading leda newValue empty ayithe return.) 🧰 Vaade words: onChange, newValue, g_form.removeOption()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // Step 1: newValue == '1' aa?\n  // Step 2: urgency nundi '3' option teeseyyi\n}",
      hint: [
        'onChange lo kotha value newValue lo undi (string). Adi "1" ayithe matrame option teeseyyi.',
        'if (newValue == "1") { ... }   lopala g_form.removeOption(field, value).',
        'if (newValue == "1") { g_form.removeOption("urgency", "3"); }',
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  if (newValue == '1') {\n    g_form.removeOption('urgency', '3');\n  }\n}",
      explain: 'newValue = user ippude select chesina value. Exercise 4 lo ide pattern ki field message kuda kaluputham.',
      tests: [{ label: 'urgency options = 1,2', expr: '__f.urgency.choices.map(function (c) { return c.value })', expect: ['1', '2'] }],
    }),
    jx('cs-glform', 4, 'Impact Low → urgency High teeseyyi', 'hard', {
      scenario: { form: { values: { impact: '2', urgency: '2' } } },
      client: onChangeOf('impact', '2', '3'),
      task: 'onChange (impact) rayi: impact "3" (Low) ayithe urgency choice list nunchi "1" (High) option teeseyyi, urgency field kinda "High urgency Low impact ki vaddu" ani info field message chupinchu. (Guard marchipoku.)',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // TODO\n}",
      hint: [
        'Medium+ lo chesina rendu ideas kalupu: newValue check chesi option teeseyyi (ex 7), field kinda message (ex 6).',
        'if (newValue == "3") { ... }   lopala g_form.removeOption("urgency", <value>) mariyu g_form.showFieldMsg("urgency", text, "info").',
        'if (newValue == "3") { g_form.removeOption("urgency", "1"); g_form.showFieldMsg("urgency", "High urgency Low impact ki vaddu", "info"); }',
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  if (newValue == '3') {\n    g_form.removeOption('urgency', '1');\n    g_form.showFieldMsg('urgency', 'High urgency Low impact ki vaddu', 'info');\n  }\n}",
      explain: 'removeOption(field, value) — value choice yokka stored value ("1"), label kaadu.',
      tests: [
        { label: 'urgency options = 2,3', expr: '__f.urgency.choices.map(function (c) { return c.value })', expect: ['2', '3'] },
        { label: 'urgency field message', expr: '__f.urgency.msgs.length', expect: 1 },
      ],
    }),
  ],
}

// Course order (Udemy "Client scripting" section, 26 lectures) — all 26 covered. mode 'pdi' lessons are done in her real PDI.
export const CS_LESSONS = [gluser, glform, ...CS_LESSONS_B, ...CS_LESSONS_C, ...CS_LESSONS_D, ...CS_LESSONS_E]
  .sort((a, b) => a.no - b.no)
  .map((l) => ({
    stage: 3,
    section: 'Client scripting',
    ...l,
    // extra test runs (else-branches etc.) live in variants-cs.js, keyed by exercise id
    exercises: l.exercises.map((e) => (VARIANTS_CS[e.id] ? { ...e, variants: VARIANTS_CS[e.id] } : e)),
  }))
