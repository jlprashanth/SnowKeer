// Stage 3 · Client-side scripting (Udemy section "Client scripting & UI"): same Learn / Quiz / Code format as Stage 2,
// but the code runs against a mock incident FORM (g_form, g_user, g_scratchpad ... — see src/js/clientMock.js) and the form is shown live.
// Each exercise: client: { trigger: { type: 'onLoad' | 'onChange' | 'onSubmit', ... } }. Tests may use:
//   __f.<field>.{value,mandatory,readOnly,visible,choices,msgs}, __msgs (form messages), __submit, g_form, g_user.
import { q, jx } from './lessonKit.js'
import { CS_LESSONS_B } from './lessons-cs-b.js'
import { CS_LESSONS_C } from './lessons-cs-c.js'
import { CS_LESSONS_D } from './lessons-cs-d.js'
import { CS_LESSONS_E } from './lessons-cs-e.js'

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
        '⚠️ Memory nunchi rasina details (nee PDI lo confirm chesuko): hasRole(…) admin ki true ravadam, g_user properties list — Brazil lo same ani anukuntunna.',
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
      hint: 'if (g_form.isNewRecord() && g_form.getValue("caller_id") == "") { g_form.setValue("caller_id", g_user.userID); }',
      solution: "function onLoad() {\n  if (g_form.isNewRecord() && g_form.getValue('caller_id') == '') {\n    g_form.setValue('caller_id', g_user.userID);\n  }\n}",
      explain: 'Reference field ki setValue lo sys_id istam — g_user.userID sys_id. Empty check lekapothe existing caller ni overwrite chestav.',
      tests: [{ label: 'caller_id = u_abel', expr: "g_form.getValue('caller_id')", expect: 'u_abel' }],
    }),
    jx('cs-gluser', 4, 'VIP caller (g_scratchpad)', 'hard', {
      scenario: { scratchpad: { callerIsVip: true }, form: { values: { urgency: '3', impact: '3' } }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } },
      client: LOAD,
      task: 'Display Business Rule g_scratchpad.callerIsVip = true pettindi anukundam. onLoad lo: VIP ayithe 1) "VIP caller — handle fast!" ani info message, 2) urgency ni "1" ki set chey, 3) short_description mandatory chey.',
      starter: 'function onLoad() {\n  // TODO: g_scratchpad.callerIsVip check chey\n}',
      hint: 'if (g_scratchpad.callerIsVip) { g_form.addInfoMessage(...); g_form.setValue("urgency", "1"); g_form.setMandatory("short_description", true); }',
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
      hint: 'if (g_form.getValue("state") == "6") { g_form.setDisplay("assignment_group", false); g_form.addInfoMessage("Incident already resolved"); }',
      solution: "function onLoad() {\n  if (g_form.getValue('state') == '6') {\n    g_form.setDisplay('assignment_group', false);\n    g_form.addInfoMessage('Incident already resolved');\n  }\n}",
      explain: 'getValue("state") "6" string tho compare chesam.',
      tests: [
        { label: 'assignment_group hidden', expr: '__f.assignment_group.visible', expect: false },
        { label: 'Info message', expr: MSGS, expect: ['Incident already resolved'] },
      ],
    }),
    jx('cs-glform', 4, 'Impact Low → urgency High teeseyyi', 'hard', {
      scenario: { form: { values: { impact: '2', urgency: '2' } } },
      client: onChangeOf('impact', '2', '3'),
      task: 'onChange (impact) rayi: impact "3" (Low) ayithe urgency choice list nunchi "1" (High) option teeseyyi, urgency field kinda "High urgency Low impact ki vaddu" ani info field message chupinchu. (Guard marchipoku.)',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // TODO\n}",
      hint: 'if (newValue == "3") { g_form.removeOption("urgency", "1"); g_form.showFieldMsg("urgency", "High urgency Low impact ki vaddu", "info"); }',
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
  .map((l) => ({ stage: 3, section: 'Client scripting', ...l }))
