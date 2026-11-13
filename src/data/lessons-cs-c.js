// Stage 3 (client) lessons 11, 12, 15, 16, 17: GlideAjax (client + Script Include), onSubmit, use cases, onCellEdit.
import { q, jx } from './lessonKit.js'

const LOAD = { trigger: { type: 'onLoad' } }
const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const SUBMIT = { trigger: { type: 'onSubmit' } }
const CELL = (newValue, oldValues) => ({ trigger: { type: 'onCellEdit', newValue, oldValues: oldValues || [''], table: 'incident', sysIDs: ['inc1'] } })
const MSGS = '__msgs.map(function (m) { return m.text })'
const GUARD = "  if (isLoading || newValue === '') {\n    return;\n  }\n"
const ONCHANGE = (body) => `function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n${GUARD}${body}}`

// Script Includes used by the GlideAjax exercises (server side, "Client callable")
const USER_AJAX = {
  name: 'UserAjax',
  code: `var UserAjax = Class.create();
UserAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getEmail: function () {
    var gr = new GlideRecord('sys_user');
    if (gr.get(this.getParameter('sysparm_user_id'))) {
      return gr.getValue('email');
    }
    return '';
  },
  type: 'UserAjax'
});`,
}
const PRIORITY_AJAX = {
  name: 'PriorityAjax',
  code: `var PriorityAjax = Class.create();
PriorityAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getPriority: function () {
    var impact = parseInt(this.getParameter('sysparm_impact'), 10);
    var urgency = parseInt(this.getParameter('sysparm_urgency'), 10);
    return String(impact + urgency - 1);
  },
  type: 'PriorityAjax'
});`,
}
const INC_AJAX = {
  name: 'IncidentAjax',
  code: `var IncidentAjax = Class.create();
IncidentAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getOpenCount: function () {
    var gr = new GlideRecord('incident');
    gr.addQuery('assignment_group', this.getParameter('sysparm_group'));
    gr.addActiveQuery();
    gr.query();
    return gr.getRowCount();
  },
  type: 'IncidentAjax'
});`,
}

/* 11 & 12 — GlideAjax */
const ajax1 = {
  id: 'cs-ajax1',
  title: 'GlideAjax + onChange — Part 1 (client side)',
  video: 'Glide Ajax & on change client script use cases',
  duration: '',
  no: 11,
  blurb: 'Client nunchi server Script Include ni pilavadam: new GlideAjax, addParam, getXMLAnswer.',
  scratch: {
    starter: `function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }
  var ga = new GlideAjax('UserAjax');
  ga.addParam('sysparm_name', 'getEmail');
  ga.addParam('sysparm_user_id', newValue);
  ga.getXMLAnswer(function (answer) {
    g_form.setValue('description', 'Email: ' + answer);
  });
}`,
    scenario: { scriptInclude: USER_AJAX, form: { values: {} } },
    client: CHG('caller_id', '', 'u_abel'),
  },
  learn: [
    {
      h: '📞 GlideAjax — client nunchi server ki call',
      body: [
        'Client lo database access ledu. Server data kavali ante GlideAjax vaadatam: client lo ga = new GlideAjax("ScriptIncludeName"), params pettali, server function pilavali, answer callback lo vastundi.',
        'Mukhyamaina rules: 1) sysparm_name = server lo call cheyyali anukune function peru. 2) Extra parameters sysparm_ tho start avvali (e.g. sysparm_user_id). 3) Answer ellappudu STRING (null kuda raavachu). 4) getXMLAnswer(callback) — async, callback lopale value vaadali.',
      ],
      terms: ['GlideAjax', 'Script Include', 'sysparm_name', 'ga.addParam()', 'ga.getXMLAnswer()'],
      code: `var ga = new GlideAjax('UserAjax');           // Script Include peru
ga.addParam('sysparm_name', 'getEmail');       // function peru
ga.addParam('sysparm_user_id', newValue);      // parameter
ga.getXMLAnswer(function (answer) {
  g_form.setValue('description', 'Email: ' + answer);
});`,
    },
    {
      h: '⏳ Async — callback ki velupala answer ledu',
      body: [
        'getXMLAnswer ki kinda unna code answer ravakamundey run avtundi. Anduke answer tho chese pani anta callback function lone cheyyali.',
        'Server error ayithe / answer null ayithe — handle cheyyali: if (!answer) { ... }.',
      ],
      terms: ['ga.getXMLAnswer()', 'g_form.showFieldMsg()', 'g_form.setValue()'],
      code: `ga.getXMLAnswer(function (answer) {
  if (!answer) {
    g_form.showFieldMsg('caller_id', 'Email dorakaledu', 'error');
    return;
  }
  g_form.setValue('description', 'Email: ' + answer);
});`,
    },
    {
      h: '🆚 GlideAjax vs getReference',
      body: [
        'getReference ki reference record motham vastundi (anni fields) — kani prathi sari server call. GlideAjax lo nee kavalsina data matrame (chinna payload), logic server lo untundi (secure, reusable). Pedda projects lo GlideAjax preferred.',
        '⚠️ Script Include lo "Client callable" checkbox tick cheyyali — lekapothe GlideAjax pilavaledu. (Real PDI lo confirm chesuko.)',
      ],
      terms: ['g_form.getReference()', 'GlideAjax', 'Script Include'],
    },
  ],
  quiz: [
    q('GlideAjax lo server function peru ela pampali?', ['addParam("sysparm_name", "functionName")', 'ga.call("functionName")', 'ga.name = ...', 'g_form.setValue'], 0, 'sysparm_name param tho.'),
    q('Extra parameters peru ela undali?', ['Edaina', 'sysparm_ tho start', 'ga_ tho start', 'g_ tho start'], 1, 'sysparm_user_id laaga sysparm_ prefix.'),
    q('getXMLAnswer lo answer em type?', ['String (leda null)', 'Number', 'Object', 'Boolean'], 0, 'Ellappudu string.'),
    q('GlideAjax answer tho pani ekkada cheyyali?', ['Callback function lo', 'getXMLAnswer kinda', 'Server lo', 'onLoad lo'], 0, 'Async kabatti callback lone.'),
    q('Script Include ki GlideAjax pilavalante?', ['Script Include Active ayithe chalu', 'Client callable tick cheyyali', 'Admin role unte chalu', 'Update Set lo undali'], 1, 'Client callable checkbox.'),
  ],
  exercises: [
    jx('cs-ajax1', 1, 'Caller email teesuko', 'easy', {
      scenario: { scriptInclude: USER_AJAX, form: { values: {} } },
      client: CHG('caller_id', '', 'u_abel'),
      task: 'onChange (caller_id) rayi: GlideAjax("UserAjax") tho getEmail function pilichi (sysparm_user_id = newValue), answer tho description lo "Email: <answer>" pettu.',
      starter: ONCHANGE("  // TODO: var ga = new GlideAjax('UserAjax'); ...\n"),
      hint: "ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', newValue); ga.getXMLAnswer(function (answer) { ... });",
      solution: ONCHANGE("  var ga = new GlideAjax('UserAjax');\n  ga.addParam('sysparm_name', 'getEmail');\n  ga.addParam('sysparm_user_id', newValue);\n  ga.getXMLAnswer(function (answer) {\n    g_form.setValue('description', 'Email: ' + answer);\n  });\n"),
      explain: 'Server (UserAjax.getEmail) sys_user table nunchi email techchi string ga istundi.',
      tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Email: abel.tuter@example.com' }],
    }),
    jx('cs-ajax1', 2, 'Answer empty ayithe', 'easy', {
      scenario: { scriptInclude: USER_AJAX, form: { values: {} } },
      client: CHG('caller_id', '', 'u_unknown'),
      task: 'Same GlideAjax call. Answer empty ayithe caller_id kinda showFieldMsg("caller_id", "Email dorakaledu", "error") chupinchu; unte description lo "Email: <answer>" pettu.',
      starter: ONCHANGE("  var ga = new GlideAjax('UserAjax');\n  ga.addParam('sysparm_name', 'getEmail');\n  ga.addParam('sysparm_user_id', newValue);\n  ga.getXMLAnswer(function (answer) {\n    // TODO\n  });\n"),
      hint: 'if (!answer) { g_form.showFieldMsg("caller_id", "Email dorakaledu", "error"); return; } g_form.setValue(...)',
      solution: ONCHANGE("  var ga = new GlideAjax('UserAjax');\n  ga.addParam('sysparm_name', 'getEmail');\n  ga.addParam('sysparm_user_id', newValue);\n  ga.getXMLAnswer(function (answer) {\n    if (!answer) {\n      g_form.showFieldMsg('caller_id', 'Email dorakaledu', 'error');\n      return;\n    }\n    g_form.setValue('description', 'Email: ' + answer);\n  });\n"),
      explain: 'Server data ellappudu undadu — empty/null cases handle cheyyadam mukhyam.',
      tests: [
        { label: 'field message', expr: '__f.caller_id.msgs.map(function (m) { return m.text })', expect: ['Email dorakaledu'] },
        { label: 'description empty', expr: "g_form.getValue('description')", expect: '' },
      ],
    }),
    jx('cs-ajax1', 3, 'Server nunchi priority', 'medium', {
      scenario: { scriptInclude: PRIORITY_AJAX, form: { values: { impact: '2', urgency: '2' } } },
      client: CHG('urgency', '3', '2'),
      task: 'onChange (urgency) rayi: GlideAjax("PriorityAjax") getPriority function ki rendu params pampu — sysparm_impact (form lo impact value) mariyu sysparm_urgency (newValue). Answer tho priority field set chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: "ga.addParam('sysparm_impact', g_form.getValue('impact')); ga.addParam('sysparm_urgency', newValue);",
      solution: ONCHANGE("  var ga = new GlideAjax('PriorityAjax');\n  ga.addParam('sysparm_name', 'getPriority');\n  ga.addParam('sysparm_impact', g_form.getValue('impact'));\n  ga.addParam('sysparm_urgency', newValue);\n  ga.getXMLAnswer(function (answer) {\n    g_form.setValue('priority', answer);\n  });\n"),
      explain: 'Business logic (priority formula) server lo untundi — client sirf pilustundi. Formula marchali ante Script Include okkate marchali.',
      tests: [{ label: 'priority = 3', expr: "g_form.getValue('priority')", expect: '3' }],
    }),
    jx('cs-ajax1', 4, 'Group lo open incidents', 'hard', {
      scenario: { scriptInclude: INC_AJAX, form: { values: { assignment_group: 'g_net' } } },
      client: CHG('assignment_group', '', 'g_net'),
      task: 'onChange (assignment_group) rayi: IncidentAjax.getOpenCount (param sysparm_group = newValue) pilichi, answer parseInt(answer, 10) >= 2 ayithe addInfoMessage("Group already has " + answer + " open incidents") chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: "ga.addParam('sysparm_name', 'getOpenCount'); ... if (parseInt(answer, 10) >= 2) g_form.addInfoMessage(...)",
      solution: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    if (parseInt(answer, 10) >= 2) {\n      g_form.addInfoMessage('Group already has ' + answer + ' open incidents');\n    }\n  });\n"),
      explain: 'Answer string ("2") — compare mundu parseInt tho number ki marchu.',
      tests: [{ label: 'message', expr: MSGS, expect: ['Group already has 2 open incidents'] }],
    }),
  ],
}

const ajax2 = {
  id: 'cs-ajax2',
  title: 'GlideAjax — Part 2 (Script Include side)',
  video: 'Glide Ajax & on change client script use cases (2nd video)',
  duration: '',
  no: 12,
  blurb: 'Server side: AbstractAjaxProcessor, getParameter, Client callable Script Include rayadam.',
  learn: [
    {
      h: '🖧 Script Include — server half',
      body: [
        'Client callable Script Include = Class.create() + Object.extendsObject(AbstractAjaxProcessor, { ... }). Prathi function ki client nunchi vachina parameters this.getParameter("sysparm_x") tho chaduvutam.',
        'Function return chesina value client ki answer ga veltundi — string ga. Array/object pampali ante JSON.stringify(obj) chesi pampu, client lo JSON.parse(answer) tho teeskoo.',
      ],
      code: `var UserAjax = Class.create();
UserAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getName: function () {
    var gr = new GlideRecord('sys_user');
    if (gr.get(this.getParameter('sysparm_user_id'))) {
      return gr.getValue('name');
    }
    return '';
  },
  type: 'UserAjax'
});`,
    },
    {
      h: '🔒 Security gurtupettukovali',
      body: [
        'Client callable function ni evaraina browser nunchi pilavochu — sensitive data (salary, passwords) return cheyyakudadu. Zaroori ayithe gs.hasRole() / ACL check server lo cheyyi.',
        'Function lo parameter validate chey (empty / invalid ids). Ikkada exercises lo Stage 2 laaga code ni nuvve rastav — tests "callAjax(...)" tho nee function ni pilustayi.',
      ],
    },
  ],
  quiz: [
    q('Client callable Script Include edi extend cheyyali?', ['AbstractAjaxProcessor', 'GlideRecord', 'GlideAjax', 'Class'], 0, 'Object.extendsObject(AbstractAjaxProcessor, {...}).'),
    q('Client nunchi vachina param server lo ela chaduvutam?', ['this.getParameter("sysparm_x")', 'current.sysparm_x', 'gs.getParam', 'g_form.getValue'], 0, 'this.getParameter().'),
    q('Array ni client ki pampali ante?', ['Direct ga array return cheyyadam', 'JSON.stringify chesi return', 'gs.info tho log cheyyadam', 'Array ni pampadam sadhyam kaadu'], 1, 'Answer string — JSON tho.'),
    q('Sensitive data return cheyyadam?', ['Parledu, anni data pampochu', 'Cheyyakudadu / roles check cheyyali', 'Ellappudu pampali', 'Client lo hide cheste chalu, server ki avasaram ledu'], 1, 'Evaraina pilavochu — server lo checks.'),
    q('Function em return cheste client ki veltundi?', ['Function return chese value (answer)', 'gs.info output client ki veltundi', 'current record client ki veltundi', 'Emi veltundi, nothing'], 0, 'Return value answer ga.'),
  ],
  exercises: [
    jx('cs-ajax2', 1, 'getName function', 'easy', {
      server: true,
      task: 'UserNameAjax Script Include rayi: getName function — sysparm_user_id param tho sys_user record techchi aa user "name" return chey.',
      starter: `var UserNameAjax = Class.create();
UserNameAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getName: function () {
    // TODO
  },
  type: 'UserNameAjax'
});`,
      hint: "var gr = new GlideRecord('sys_user'); gr.get(this.getParameter('sysparm_user_id')); return gr.getValue('name');",
      solution: `var UserNameAjax = Class.create();
UserNameAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getName: function () {
    var gr = new GlideRecord('sys_user');
    gr.get(this.getParameter('sysparm_user_id'));
    return gr.getValue('name');
  },
  type: 'UserNameAjax'
});`,
      explain: 'Client addParam("sysparm_user_id", ..) → server lo this.getParameter("sysparm_user_id").',
      tests: [{ label: 'u_abel → Abel Tuter', expr: "callAjax(UserNameAjax, 'getName', { sysparm_user_id: 'u_abel' })", expect: 'Abel Tuter' }],
    }),
    jx('cs-ajax2', 2, 'Unknown user → empty', 'easy', {
      server: true,
      task: 'EmailAjax.getEmail rayi: user dorikithe email return chey, dorakapothe "" (empty string) return chey. (gr.get() true/false istundi.)',
      starter: `var EmailAjax = Class.create();
EmailAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getEmail: function () {
    // TODO
  },
  type: 'EmailAjax'
});`,
      hint: "if (gr.get(id)) { return gr.getValue('email'); } return '';",
      solution: `var EmailAjax = Class.create();
EmailAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getEmail: function () {
    var gr = new GlideRecord('sys_user');
    if (gr.get(this.getParameter('sysparm_user_id'))) {
      return gr.getValue('email');
    }
    return '';
  },
  type: 'EmailAjax'
});`,
      explain: 'Ellappudu not-found case handle chey — client ki clear ga empty answer vastundi.',
      tests: [
        { label: 'known user', expr: "callAjax(EmailAjax, 'getEmail', { sysparm_user_id: 'u_bud' })", expect: 'bud.richman@example.com' },
        { label: 'unknown user', expr: "callAjax(EmailAjax, 'getEmail', { sysparm_user_id: 'nobody' })", expect: '' },
      ],
    }),
    jx('cs-ajax2', 3, 'Open incidents by category', 'medium', {
      server: true,
      task: 'IncidentCountAjax.getOpenCount rayi: sysparm_category param ki match ayye ACTIVE incidents count (gr.getRowCount()) return chey.',
      starter: `var IncidentCountAjax = Class.create();
IncidentCountAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getOpenCount: function () {
    // TODO
  },
  type: 'IncidentCountAjax'
});`,
      hint: "gr.addQuery('category', this.getParameter('sysparm_category')); gr.addActiveQuery(); gr.query(); return gr.getRowCount();",
      solution: `var IncidentCountAjax = Class.create();
IncidentCountAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getOpenCount: function () {
    var gr = new GlideRecord('incident');
    gr.addQuery('category', this.getParameter('sysparm_category'));
    gr.addActiveQuery();
    gr.query();
    return gr.getRowCount();
  },
  type: 'IncidentCountAjax'
});`,
      explain: 'Client ki count string ga veltundi ("2") — client lo parseInt cheyyali.',
      tests: [
        { label: 'network → 2', expr: "callAjax(IncidentCountAjax, 'getOpenCount', { sysparm_category: 'network' })", expect: 2 },
        { label: 'hardware → 1', expr: "callAjax(IncidentCountAjax, 'getOpenCount', { sysparm_category: 'hardware' })", expect: 1 },
      ],
    }),
    jx('cs-ajax2', 4, 'P1 incident numbers (JSON)', 'hard', {
      server: true,
      task: 'P1Ajax.getP1Numbers rayi: priority 1 unna ACTIVE incidents numbers ni number order lo oka array lo petti JSON.stringify chesi return chey. (Array direct ga pampaleru!)',
      starter: `var P1Ajax = Class.create();
P1Ajax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getP1Numbers: function () {
    // TODO
  },
  type: 'P1Ajax'
});`,
      hint: "var list = []; ... while (gr.next()) { list.push(gr.getValue('number')); } return JSON.stringify(list);",
      solution: `var P1Ajax = Class.create();
P1Ajax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getP1Numbers: function () {
    var list = [];
    var gr = new GlideRecord('incident');
    gr.addQuery('priority', 1);
    gr.addActiveQuery();
    gr.orderBy('number');
    gr.query();
    while (gr.next()) {
      list.push(gr.getValue('number'));
    }
    return JSON.stringify(list);
  },
  type: 'P1Ajax'
});`,
      explain: 'Client lo JSON.parse(answer) tho array malli vastundi. Idi complex data pampadaniki standard pattern.',
      tests: [{ label: 'JSON array', expr: "JSON.parse(callAjax(P1Ajax, 'getP1Numbers', {}))", expect: ['INC0010002', 'INC0010008'] }],
    }),
  ],
}

/* 15 — onSubmit */
const onsubmit = {
  id: 'cs-onsubmit',
  title: 'onSubmit Client Scripts & Use Cases',
  video: 'On Submit Client Scripts and Use cases',
  duration: '',
  no: 15,
  blurb: 'Save / Submit nokkinappudu validation: return false tho aapadam.',
  scratch: {
    starter: "function onSubmit() {\n  if (g_form.getValue('short_description').length < 10) {\n    g_form.addErrorMessage('Short description kanisam 10 chars undali');\n    return false;\n  }\n}",
    scenario: { form: { values: { short_description: 'VPN' } } },
    client: SUBMIT,
  },
  learn: [
    {
      h: '🚦 onSubmit — save mundu gate',
      body: [
        'User Submit / Save / Update nokkinappudu, record server ki velle mundu onSubmit run avtundi. function onSubmit() lo return false chesthe save aagipotundi.',
        'false return cheyyakapothe (leda true) munduku veltundi. Anduke validation lo: error chupinchi → return false.',
        'Mandatory fields ki UI Policy chalu. onSubmit complex validations ki: length, field combinations, confirm dialogs.',
      ],
      code: `function onSubmit() {
  if (g_form.getValue('short_description').length < 10) {
    g_form.addErrorMessage('Short description kanisam 10 chars undali');
    return false;
  }
}`,
    },
    {
      h: '❓ confirm() tho',
      body: [
        'return confirm("Sure ah?"); — user OK ante true (save), Cancel ante false (aagipotundi). Short ga cheyyochu.',
        '⚠️ onSubmit lo async calls (GlideAjax getXMLAnswer) reliable ga return false cheyyaleru — adi advanced topic. Ikkada synchronous checks matrame.',
      ],
      code: `function onSubmit() {
  if (g_form.getValue('priority') == '1') {
    return confirm('Idi P1. Submit cheyyala?');
  }
}`,
    },
  ],
  quiz: [
    q('onSubmit lo save aapadaniki?', ['return false', 'return true', 'return null', 'throw'], 0, 'onSubmit lo return false chesthe form submit aagipotundi.'),
    q('onSubmit eppudu run avtundi?', ['Form load', 'Field change', 'Save/Submit mundu', 'Save tarvata'], 2, 'Server ki velle mundu.'),
    q('return confirm("..."); user Cancel nokkite?', ['Save avtundi', 'Save aagipotundi', 'Error', 'Form close'], 1, 'confirm false → onSubmit false.'),
    q('Simple mandatory field ki edi better?', ['onSubmit script', 'UI Policy', 'Scheduled Job', 'Flow'], 1, 'UI Policy / dictionary mandatory.'),
    q('Validation fail ayithe user ki em chupinchali?', ['Em chupinchakudadu, silent ga aapali', 'Error message (addErrorMessage / showFieldMsg)', 'alert chupinchi save cheyyali', 'Page reload cheyyali'], 1, 'Clear error message.'),
  ],
  exercises: [
    jx('cs-onsubmit', 1, 'Short description length', 'easy', {
      scenario: { form: { values: { short_description: 'VPN' } } },
      client: SUBMIT,
      task: 'onSubmit lo: short_description length 10 kante takkuva ayithe addErrorMessage("Short description kanisam 10 chars undali") chupinchi return false.',
      starter: 'function onSubmit() {\n  // TODO\n}',
      hint: "if (g_form.getValue('short_description').length < 10) { g_form.addErrorMessage(...); return false; }",
      solution: "function onSubmit() {\n  if (g_form.getValue('short_description').length < 10) {\n    g_form.addErrorMessage('Short description kanisam 10 chars undali');\n    return false;\n  }\n}",
      explain: 'getValue string — .length direct ga vaadochu.',
      tests: [
        { label: 'submit blocked', expr: '__submit', expect: false },
        { label: 'error message', expr: MSGS, expect: ['Short description kanisam 10 chars undali'] },
      ],
    }),
    jx('cs-onsubmit', 2, 'P1 ki group kavali', 'easy', {
      scenario: { form: { values: { priority: '1', assignment_group: '' } } },
      client: SUBMIT,
      task: 'onSubmit lo: priority "1" mariyu assignment_group empty ayithe assignment_group kinda showFieldMsg(..., "P1 ki group kavali", "error") chupinchi return false.',
      starter: 'function onSubmit() {\n  // TODO\n}',
      hint: "if (g_form.getValue('priority') == '1' && g_form.getValue('assignment_group') == '') { ... return false; }",
      solution: "function onSubmit() {\n  if (g_form.getValue('priority') == '1' && g_form.getValue('assignment_group') == '') {\n    g_form.showFieldMsg('assignment_group', 'P1 ki group kavali', 'error');\n    return false;\n  }\n}",
      explain: 'Rendu conditions && tho.',
      tests: [
        { label: 'submit blocked', expr: '__submit', expect: false },
        { label: 'field message', expr: '__f.assignment_group.msgs.length', expect: 1 },
      ],
    }),
    jx('cs-onsubmit', 3, 'P1 confirm', 'medium', {
      scenario: { form: { values: { priority: '1' } }, confirmAnswer: false },
      client: SUBMIT,
      task: 'onSubmit lo: priority "1" ayithe return confirm("Idi P1. Submit cheyyala?"); (user Cancel nokkite save aagali). Lekapothe emi cheyyaku.',
      starter: 'function onSubmit() {\n  // TODO\n}',
      hint: "if (g_form.getValue('priority') == '1') { return confirm('Idi P1. Submit cheyyala?'); }",
      solution: "function onSubmit() {\n  if (g_form.getValue('priority') == '1') {\n    return confirm('Idi P1. Submit cheyyala?');\n  }\n}",
      explain: 'confirm() boolean ni direct ga return cheyyochu. (Ee practice lo user Cancel nokkindi anukunnam.)',
      tests: [
        { label: 'blocked (Cancel)', expr: '__submit', expect: false },
        { label: 'confirm asked', logs: ['Idi P1. Submit cheyyala?'] },
      ],
    }),
    jx('cs-onsubmit', 4, 'Anni errors okesari', 'hard', {
      scenario: { form: { values: { short_description: '', category: '' } } },
      client: SUBMIT,
      task: 'onSubmit lo: short_description empty ayithe daani kinda "Required" error field message, category empty ayithe daani kinda "Required" error. Rendu check cheyyali (okati fail ayina aapakudadu). Edaina fail ayithe last lo return false.',
      starter: 'function onSubmit() {\n  // TODO\n}',
      hint: 'var ok = true; if (...) { g_form.showFieldMsg(...); ok = false; } if (...) {...} return ok;',
      solution: "function onSubmit() {\n  var ok = true;\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  if (g_form.getValue('category') == '') {\n    g_form.showFieldMsg('category', 'Required', 'error');\n    ok = false;\n  }\n  return ok;\n}",
      explain: 'Flag variable (ok) tho anni errors okesari chupinchi, last lo return ok — user ki anni problems oke saari telustayi.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'rendu messages', expr: '[__f.short_description.msgs.length, __f.category.msgs.length]', expect: [1, 1] },
      ],
    }),
  ],
}

/* 16 — Client Script use cases */
const usecases = {
  id: 'cs-usecases',
  title: 'Client Script Use Cases',
  video: 'Client Script Use cases',
  duration: '',
  no: 16,
  blurb: 'Real-world mini scenarios: category → group, priority formula, confirm before closing.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.flash('assignment_group', '#ffcc00', 0);\n}",
    scenario: { form: { values: { category: 'network' } } },
    client: CHG('category', 'software', 'network'),
  },
  learn: [
    {
      h: '🧪 Real-world patterns',
      body: [
        'Idi revision lesson: onLoad / onChange / onSubmit tho real scenarios. Pattern ellappudu: guard → condition → g_form call.',
        'Lookup tables (object) vaadithe if/else chain avasaram ledu: var map = { network: "g_net", database: "g_db" }; g_form.setValue("assignment_group", map[newValue] || "").',
        'Marpu undo cheyyali ante setValue(field, oldValue).',
      ],
      code: `var map = { network: 'g_net', database: 'g_db', hardware: 'g_hw' };
g_form.setValue('assignment_group', map[newValue] || '');`,
    },
  ],
  quiz: [
    q('Category → group mapping ki clean way?', ['Object lookup (map[newValue])', 'Pedda if/else chain matrame', 'GlideRecord client lo', 'alert'], 0, 'Object map tho short & readable.'),
    q('Marpu undo cheyyali ante?', ['g_form.setValue(field, oldValue)', 'g_form.clearMessages()', 'return false', 'Page reload cheyyadam'], 0, 'oldValue tho revert.'),
    q('map[newValue] || "" lo || enduku?', ['Map lo lenappudu empty default kosam', 'Error throw cheyyadaniki', 'Loop run cheyyadaniki', 'Speed penchadaniki'], 0, 'undefined ki default "".'),
    q('Priority formula logic ekkada unte best?', ['Server (Script Include / Business Rule)', 'Prathi client script lo copy paste chesi', 'Browser cache lo save chesi', 'Email lo rasi pettukoni'], 0, 'Okachota (server) — maintain cheyyadam easy.'),
    q('Confirm before close — onChange lo cancel ayithe?', ['Marpu revert cheyyali', 'Em cheyyakunda vadileyyali', 'Page reload cheyyali', 'Record delete cheyyali'], 0, 'oldValue ki revert.'),
  ],
  exercises: [
    jx('cs-usecases', 1, 'Hardware hint', 'easy', {
      scenario: { form: { values: { category: 'hardware' } } },
      client: CHG('category', 'software', 'hardware'),
      task: 'onChange (category) rayi: newValue "hardware" ayithe category kinda info field message "Asset tag description lo rayi" chupinchu; lekapothe category field message hide chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: "if (newValue == 'hardware') { g_form.showFieldMsg('category', '...', 'info'); } else { g_form.hideFieldMsg('category'); }",
      solution: ONCHANGE("  if (newValue == 'hardware') {\n    g_form.showFieldMsg('category', 'Asset tag description lo rayi', 'info');\n  } else {\n    g_form.hideFieldMsg('category');\n  }\n"),
      explain: 'Else lo hide cheyyakapothe paata message migilipotundi.',
      tests: [{ label: 'field message', expr: '__f.category.msgs.map(function (m) { return m.text })', expect: ['Asset tag description lo rayi'] }],
    }),
    jx('cs-usecases', 2, 'Category → group', 'medium', {
      scenario: { form: { values: { category: 'database' } } },
      client: CHG('category', 'software', 'database'),
      task: 'onChange (category) rayi: map tho — network → g_net, database → g_db, hardware → g_hw. Map lo lekapothe assignment_group empty chey. (g_form.setValue("assignment_group", map[newValue] || ""))',
      starter: ONCHANGE('  // TODO\n'),
      hint: "var map = { network: 'g_net', database: 'g_db', hardware: 'g_hw' };",
      solution: ONCHANGE("  var map = { network: 'g_net', database: 'g_db', hardware: 'g_hw' };\n  g_form.setValue('assignment_group', map[newValue] || '');\n"),
      explain: 'Object lookup tho 3 if-else kante clean.',
      tests: [{ label: 'g_db', expr: "g_form.getValue('assignment_group')", expect: 'g_db' }],
    }),
    jx('cs-usecases', 3, 'Priority formula', 'medium', {
      scenario: { form: { values: { impact: '1', urgency: '2' } } },
      client: CHG('impact', '2', '1'),
      task: 'onChange (impact) rayi: priority = impact + urgency - 1 (numbers ga marchi) calculate chesi priority field set chey. (Strings add cheste "12"-type bug vastundi!)',
      starter: ONCHANGE('  // TODO\n'),
      hint: "var p = parseInt(newValue, 10) + parseInt(g_form.getValue('urgency'), 10) - 1; g_form.setValue('priority', String(p));",
      solution: ONCHANGE("  var p = parseInt(newValue, 10) + parseInt(g_form.getValue('urgency'), 10) - 1;\n  g_form.setValue('priority', String(p));\n"),
      explain: 'parseInt tho number ki marchi calculate. (Real lo priority Data Lookup rule tho server lo set avtundi — idi practice.)',
      tests: [{ label: 'priority = 2', expr: "g_form.getValue('priority')", expect: '2' }],
    }),
    jx('cs-usecases', 4, 'Close confirm (revert)', 'hard', {
      scenario: { form: { values: { state: '7' } }, confirmAnswer: false },
      client: CHG('state', '2', '7'),
      task: 'onChange (state) rayi: newValue "7" (Closed) ayithe confirm("Incident close cheyyala?") adugu. User Cancel nokkite state ni oldValue ki revert chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: "if (newValue == '7' && !confirm('Incident close cheyyala?')) { g_form.setValue('state', oldValue); }",
      solution: ONCHANGE("  if (newValue == '7' && !confirm('Incident close cheyyala?')) {\n    g_form.setValue('state', oldValue);\n  }\n"),
      explain: '&& short-circuit: newValue "7" kakapothe confirm asalu adagadu.',
      tests: [
        { label: 'state reverted', expr: "g_form.getValue('state')", expect: '2' },
        { label: 'confirm asked', logs: ['Incident close cheyyala?'] },
      ],
    }),
  ],
}

/* 17 — onCellEdit */
const oncell = {
  id: 'cs-oncell',
  title: 'onCellEdit Client Scripts',
  video: 'On Cell Edit Client scripts',
  duration: '',
  no: 17,
  blurb: 'List lo double-click tho edit chesinappudu (list edit) validation: callback(true/false).',
  scratch: {
    starter: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  var saveAndClose = true;\n  if (newValue == '') {\n    saveAndClose = false;\n  }\n  callback(saveAndClose);\n}",
    scenario: { form: { values: {} } },
    client: CELL(''),
  },
  learn: [
    {
      h: '✏️ onCellEdit',
      body: [
        'List view lo cell double-click chesi (list editing) value marchinappudu onCellEdit run avtundi. Type = onCellEdit, Field name select chestam.',
        'Signature: function onCellEdit(sysIDs, table, oldValues, newValue, callback). sysIDs = edit chese records, oldValues = array (prathi record ki paata value), newValue = kotta value.',
        'Result: callback(true) → save avtundi. callback(false) → edit cancel. Ee callback ni pilavakapothe cell edit stuck avtundi!',
        '✅ Ee signature ni real PDI (Brazil) lo Client Script template lo verify chesam. oldValues oka Array (e.g. ["old value"]), sysIDs kuda Array, newValue String.',
      ],
      code: `function onCellEdit(sysIDs, table, oldValues, newValue, callback) {
  var saveAndClose = true;
  if (newValue == '') {
    alert('Empty value ivvaku');
    saveAndClose = false;
  }
  callback(saveAndClose);
}`,
    },
    {
      h: '🧠 Gurtupettukovali',
      body: ['Ee script lo g_form ledu (form kaadu, list). Alert / confirm vaadochu. Ellappudu callback pilavali — okka sari matrame.'],
    },
  ],
  quiz: [
    q('onCellEdit eppudu run avtundi?', ['Form load ayinappudu', 'List lo cell edit chesinappudu', 'Record save tarvata', 'Server lo run avtundi'], 1, 'List editing time lo.'),
    q('Edit allow cheyyadaniki?', ['callback(true)', 'return true', 'g_form.save()', 'callback(false)'], 0, 'callback(true) — save & close.'),
    q('Callback pilavakapothe?', ['Em kaadu, normal ga save avtundi', 'Cell edit stuck avtundi', 'Auto ga save avtundi', 'Error page vastundi'], 1, 'Ellappudu callback pilavali.'),
    q('oldValues em type?', ['String (oka value)', 'Array (prathi record ki)', 'Object (key-value)', 'Number'], 1, 'Array — selected records order lo old values. PDI lo test chesi confirm chesam: oldValues = ["old value"].'),
    q('onCellEdit lo g_form vaadochaa?', ['Avunu, ellappudu vaadochu', 'Ledu — idi list, form kaadu', 'Admin ki matrame vaadochu', 'Mobile lo matrame vaadochu'], 1, 'List context — form ledu.'),
  ],
  exercises: [
    jx('cs-oncell', 1, 'Empty value block', 'easy', {
      scenario: { form: { values: {} } },
      client: CELL(''),
      task: 'onCellEdit rayi: newValue empty ayithe callback(false), lekapothe callback(true).',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO\n}',
      hint: "callback(newValue != '');",
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  callback(newValue != '');\n}",
      explain: 'Boolean ni direct ga callback ki ivvochu.',
      tests: [{ label: 'edit blocked', expr: '__submit', expect: false }],
    }),
    jx('cs-oncell', 2, 'Cancel state block', 'easy', {
      scenario: { form: { values: {} } },
      client: CELL('8'),
      task: 'State column lo user "8" (Canceled) set cheyyadaniki try chesthe alert("List nunchi cancel cheyyaku") chupinchi callback(false). Lekapothe callback(true).',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO\n}',
      hint: "if (newValue == '8') { alert('...'); callback(false); } else { callback(true); }",
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (newValue == '8') {\n    alert('List nunchi cancel cheyyaku');\n    callback(false);\n  } else {\n    callback(true);\n  }\n}",
      explain: 'Rendu branches lo kuda callback pilichaam.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['List nunchi cancel cheyyaku'] },
      ],
    }),
    jx('cs-oncell', 3, 'Resolved records edit cheyyaku', 'medium', {
      scenario: { form: { values: {} } },
      client: CELL('2', ['6']),
      task: 'oldValues[0] "6" (Resolved) ayithe alert("Resolved record edit cheyyaku") chupinchi callback(false); lekapothe callback(true).',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO\n}',
      hint: "if (oldValues[0] == '6') { alert('...'); callback(false); return; } callback(true);",
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (oldValues[0] == '6') {\n    alert('Resolved record edit cheyyaku');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: 'oldValues array — multiple records select chesthe prathidi check cheyyali (idi simple version).',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['Resolved record edit cheyyaku'] },
      ],
    }),
    jx('cs-oncell', 4, 'Role check', 'hard', {
      scenario: { form: { values: {} }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: CELL('1'),
      task: 'Priority column ki: newValue "1" ayithe "itil" role unnavaalle set cheyyali. Role lekapothe alert("P1 set cheyyadaniki itil role kavali") chupinchi callback(false). Migilina anni cases ki callback(true).',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO\n}',
      hint: "if (newValue == '1' && !g_user.hasRole('itil')) { alert('...'); callback(false); return; } callback(true);",
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (newValue == '1' && !g_user.hasRole('itil')) {\n    alert('P1 set cheyyadaniki itil role kavali');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: 'g_user list scripts lo kuda available.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['P1 set cheyyadaniki itil role kavali'] },
      ],
    }),
  ],
}

export const CS_LESSONS_C = [ajax1, ajax2, onsubmit, usecases, oncell]
