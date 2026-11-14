// Stage 3 (client) lessons 11, 12, 15, 16, 17: GlideAjax (client + Script Include), onSubmit, use cases, onCellEdit.
import { q, jx } from './lessonKit.js'

const LOAD = { trigger: { type: 'onLoad' } }
const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const SUBMIT = { trigger: { type: 'onSubmit' } }
const CELL = (newValue, oldValues, sysIDs) => ({ trigger: { type: 'onCellEdit', newValue, oldValues: oldValues || [''], table: 'incident', sysIDs: sysIDs || ['inc1'] } })
const MSGS = '__msgs.map(function (m) { return m.text })'
// every GlideAjax call the script made: 'ScriptInclude.function' (tests use it so a hardcoded answer without the call fails)
const CALLS = "__x.ajaxCalls.map(function (c) { return c.name + '.' + c.params.sysparm_name })"
const PARAM = (p) => `__x.ajaxCalls.map(function (c) { return c.params.${p} })`
const GUARD = "  if (isLoading || newValue === '') {\n    return;\n  }\n"
const ONCHANGE = (body) => `function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n${GUARD}${body}}`

// Script Includes used by the GlideAjax exercises (server side, "Glide AJAX enabled" ticked).
// this.getParameter() gives a Java string in the PDI — String(...) makes it a normal JS string.
const USER_AJAX = {
  name: 'UserAjax',
  code: `var UserAjax = Class.create();
UserAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getEmail: function () {
    var id = String(this.getParameter('sysparm_user_id'));
    var gr = new GlideRecord('sys_user');
    if (gr.get(id)) {
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
    gr.addQuery('assignment_group', String(this.getParameter('sysparm_group')));
    gr.addActiveQuery();
    gr.query();
    return gr.getRowCount();
  },
  type: 'IncidentAjax'
});`,
}
// onSubmit + GlideAjax exercise: number of an OPEN incident with the same short description, or ''
const DUP_AJAX = {
  name: 'DupCheckAjax',
  code: `var DupCheckAjax = Class.create();
DupCheckAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  findOpenDuplicate: function () {
    var text = String(this.getParameter('sysparm_short'));
    var gr = new GlideRecord('incident');
    gr.addQuery('short_description', text);
    gr.addActiveQuery();
    gr.query();
    if (gr.next()) {
      return gr.getValue('number');
    }
    return '';
  },
  type: 'DupCheckAjax'
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
        'getXMLAnswer ki kinda unna code answer ravakamundey run avtundi. Anduke answer tho chese pani anta callback function lone cheyyali. (✅ Nee PDI lo verified: getReference(callback) / getXMLAnswer rendu async — call kinda line mundu, callback tarvata.)',
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
        '✅ Script Include form lo "Glide AJAX enabled" checkbox (field client_callable) tick cheyyali — lekapothe GlideAjax aa Script Include ni pilavaledu. (Label nee Brazil PDI lo verified; pakkane "Sandbox enabled" ane vere checkbox kuda untundi — adi kaadu.)',
      ],
      terms: ['g_form.getReference()', 'GlideAjax', 'Script Include'],
    },
  ],
  quiz: [
    q('GlideAjax lo server function peru ela pampali?', ['ga.addParam("sysparm_name", "fn")', 'ga.call("fn") method tho', 'ga.setFunction("fn") tho', 'new GlideAjax("fn") lo direct ga'], 0, 'sysparm_name param tho — new GlideAjax() lo Script Include peru matrame.'),
    q('Extra parameters peru ela undali?', ['Edaina peru pettochu', 'sysparm_ tho start', 'ga_ tho start', 'g_ tho start'], 1, 'sysparm_user_id laaga sysparm_ prefix.'),
    q('getXMLAnswer lo answer em type?', ['String (leda null)', 'Number (count laaga)', 'Object (record laaga)', 'Boolean (true/false)'], 0, 'Ellappudu string.'),
    q('GlideAjax answer tho pani ekkada cheyyali?', ['Callback function lopala', 'getXMLAnswer() line kinda', 'Script Include lopala', 'Next onLoad script lo'], 0, 'Async kabatti callback lone — kinda line answer ravakamunde run avtundi.'),
    q('Script Include ki GlideAjax pilavalante?', ['Script Include Active ayithe chalu', 'Glide AJAX enabled tick cheyyali', 'Admin role unte chalu', 'Update Set lo undali'], 1, 'Brazil lo checkbox label "Glide AJAX enabled" (field client_callable).'),
  ],
  exercises: [
    jx('cs-ajax1', 1, 'Caller email teesuko', 'easy', {
      scenario: { scriptInclude: USER_AJAX, form: { values: {} } },
      client: CHG('caller_id', '', 'u_abel'),
      task: 'onChange (caller_id) rayi: GlideAjax("UserAjax") tho getEmail function pilichi (sysparm_user_id = newValue), answer tho description lo "Email: <answer>" pettu.',
      starter: ONCHANGE("  // TODO: var ga = new GlideAjax('UserAjax'); ...\n"),
      hint: "ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', newValue); ga.getXMLAnswer(function (answer) { ... });",
      solution: ONCHANGE("  var ga = new GlideAjax('UserAjax');\n  ga.addParam('sysparm_name', 'getEmail');\n  ga.addParam('sysparm_user_id', newValue);\n  ga.getXMLAnswer(function (answer) {\n    g_form.setValue('description', 'Email: ' + answer);\n  });\n"),
      explain: 'Server (UserAjax.getEmail) sys_user table nunchi email techchi string ga istundi. Guard valla form load lo (isLoading) server call jaragadu.',
      tests: [
        { label: 'GlideAjax UserAjax.getEmail pilichindi', expr: CALLS, expect: ['UserAjax.getEmail'] },
        { label: 'sysparm_user_id = newValue', expr: PARAM('sysparm_user_id'), expect: ['u_abel'] },
        { label: 'description', expr: "g_form.getValue('description')", expect: 'Email: abel.tuter@example.com' },
      ],
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
      scenario: { scriptInclude: PRIORITY_AJAX, form: { values: { impact: '2', urgency: '3' } } },
      client: CHG('urgency', '3', '2'),
      task: 'onChange (urgency) rayi: GlideAjax("PriorityAjax") getPriority function ki rendu params pampu — sysparm_impact (form lo impact value) mariyu sysparm_urgency (newValue). Answer tho priority field set chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        '"Caller email teesuko" exercise laage GlideAjax call — kani ee sari Script Include PriorityAjax, function getPriority, mariyu RENDU extra params (impact form nunchi, urgency newValue).',
        "Shape: var ga = new GlideAjax('PriorityAjax'); ga.addParam('sysparm_name', 'getPriority'); ga.addParam('sysparm_impact', ...); ga.addParam('sysparm_urgency', ...);",
        "ga.addParam('sysparm_impact', g_form.getValue('impact')); ga.addParam('sysparm_urgency', newValue); ga.getXMLAnswer(function (answer) { g_form.setValue('priority', answer); });",
      ],
      solution: ONCHANGE("  var ga = new GlideAjax('PriorityAjax');\n  ga.addParam('sysparm_name', 'getPriority');\n  ga.addParam('sysparm_impact', g_form.getValue('impact'));\n  ga.addParam('sysparm_urgency', newValue);\n  ga.getXMLAnswer(function (answer) {\n    g_form.setValue('priority', answer);\n  });\n"),
      explain: 'Business logic (priority formula) server lo untundi — client pilustundi matrame. Formula marchali ante Script Include okkate marchali. (Real PDI lo priority Data Lookup tho set avtundi — 3/3 ki "4 - Low"; ee formula practice kosam.)',
      tests: [
        { label: 'GlideAjax PriorityAjax.getPriority', expr: CALLS, expect: ['PriorityAjax.getPriority'] },
        { label: 'params: impact, urgency', expr: "__x.ajaxCalls.map(function (c) { return c.params.sysparm_impact + '/' + c.params.sysparm_urgency })", expect: ['2/2'] },
        { label: 'priority = 3', expr: "g_form.getValue('priority')", expect: '3' },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to the hard 'Group lo open incidents' ----
    jx('cs-ajax1', 5, 'Open count message chupinchu', 'medium+', {
      scenario: { scriptInclude: INC_AJAX, form: { values: { assignment_group: '' } } },
      client: CHG('assignment_group', '', 'g_net'),
      task: 'onChange (assignment_group) rayi: GlideAjax("IncidentAjax") lo getOpenCount function pilu (sysparm_group = newValue). Answer vachaka form paina info message "Open incidents: <answer>" chupinchu. (Network group lo 2 open incidents unnayi.) 🧰 Vaade words: GlideAjax, ga.addParam(), sysparm_name, ga.getXMLAnswer(), g_form.addInfoMessage()',
      starter: ONCHANGE("  // Step 1: GlideAjax object create chey (Script Include peru: IncidentAjax)\n\n  // Step 2: sysparm_name = function peru (getOpenCount), sysparm_group = newValue\n\n  // Step 3: getXMLAnswer callback lo 'Open incidents: ' + answer ni info message ga chupinchu\n"),
      hint: [
        '"Caller email teesuko" pattern ne — Script Include peru, function peru, okka extra param marutayi. Message callback LOPALA chupinchali.',
        "var ga = new GlideAjax('IncidentAjax'); ga.addParam('sysparm_name', 'getOpenCount'); ga.addParam('sysparm_group', newValue);",
        "var ga = new GlideAjax('IncidentAjax'); ga.addParam('sysparm_name', 'getOpenCount'); ga.addParam('sysparm_group', newValue); ga.getXMLAnswer(function (answer) { g_form.addInfoMessage('Open incidents: ' + answer); });",
      ],
      solution: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    g_form.addInfoMessage('Open incidents: ' + answer);\n  });\n"),
      explain: 'Server getRowCount() number return chesina, client ki answer "2" laaga STRING ga vastundi. Text lo join cheyyadaniki adi saripotundi.',
      tests: [
        { label: 'GlideAjax IncidentAjax.getOpenCount', expr: CALLS, expect: ['IncidentAjax.getOpenCount'] },
        { label: 'message', expr: MSGS, expect: ['Open incidents: 2'] },
      ],
    }),
    jx('cs-ajax1', 6, 'Answer ni number ga marchu (parseInt)', 'medium+', {
      scenario: { scriptInclude: INC_AJAX, form: { values: { assignment_group: '' } } },
      client: CHG('assignment_group', '', 'g_net'),
      task: 'Same getOpenCount call (IncidentAjax, sysparm_group = newValue). Callback lo answer ni parseInt(answer, 10) tho number ga marchi, description lo "Queue position: <count + 1>" pettu. Network ki "Queue position: 3" raavali — "21" vaste string + number bug! 🧰 Vaade words: ga.getXMLAnswer(), parseInt, g_form.setValue()',
      starter: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    // Step 1: answer ('2' laanti string) ni number ga marchu (base 10)\n\n    // Step 2: description lo 'Queue position: ' + (count + 1) pettu\n  });\n"),
      hint: [
        'answer ellappudu string. "2" + 1 = "21". Mundu number ga marchali, tarvata + 1.',
        'var count = parseInt(answer, 10);   — ippudu count oka number (2).',
        "var count = parseInt(answer, 10); g_form.setValue('description', 'Queue position: ' + (count + 1));",
      ],
      solution: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    var count = parseInt(answer, 10);\n    g_form.setValue('description', 'Queue position: ' + (count + 1));\n  });\n"),
      explain: '(count + 1) brackets lo pettali — lekapothe "Queue position: " + 2 + 1 = "Queue position: 21". GlideAjax answer tho math chese mundu ellappudu parseInt.',
      tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Queue position: 3' }],
    }),
    jx('cs-ajax1', 7, 'Busy group warning (>= 2)', 'medium+', {
      scenario: { scriptInclude: INC_AJAX, form: { values: { assignment_group: '' } } },
      client: CHG('assignment_group', '', 'g_db'),
      task: 'Same getOpenCount call. Answer number ga 2 leda ekkuva ayithe assignment_group kinda error field message "Ee group busy ga undi" chupinchu; takkuva ayithe emi cheyyaku. (Database group lo 2 open incidents.) 🧰 Vaade words: ga.getXMLAnswer(), parseInt, >=, g_form.showFieldMsg()',
      starter: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  // Step 1: sysparm_name, sysparm_group params\n\n  // Step 2: getXMLAnswer callback lo — answer ni number chesi >= 2 aa ani check chey\n\n  // Step 3: avunu ante assignment_group kinda error field message\n"),
      hint: [
        'Params "Open count message chupinchu" laage. Callback lo oka if — condition lo parseInt(answer, 10) >= 2.',
        "ga.getXMLAnswer(function (answer) { if (parseInt(answer, 10) >= 2) { ... } });",
        "if (parseInt(answer, 10) >= 2) { g_form.showFieldMsg('assignment_group', 'Ee group busy ga undi', 'error'); }",
      ],
      solution: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    if (parseInt(answer, 10) >= 2) {\n      g_form.showFieldMsg('assignment_group', 'Ee group busy ga undi', 'error');\n    }\n  });\n"),
      explain: 'Number tho compare chesthe "2" >= 2 pani chestundi, kani rendu strings compare chesthe ("10" >= "9") false vastundi. Anduke parseInt chesi compare cheyyadam safe habit. Hard exercise "Group lo open incidents" lo ide condition + answer tho message.',
      tests: [
        { label: 'GlideAjax IncidentAjax.getOpenCount', expr: CALLS, expect: ['IncidentAjax.getOpenCount'] },
        { label: 'field message', expr: "__f.assignment_group.msgs.map(function (m) { return m.text })", expect: ['Ee group busy ga undi'] },
      ],
    }),
    jx('cs-ajax1', 4, 'Group lo open incidents', 'hard', {
      scenario: { scriptInclude: INC_AJAX, form: { values: { assignment_group: '' } } },
      client: CHG('assignment_group', '', 'g_net'),
      task: 'onChange (assignment_group) rayi: IncidentAjax.getOpenCount (param sysparm_group = newValue) pilichi, answer parseInt(answer, 10) >= 2 ayithe addInfoMessage("Group already has " + answer + " open incidents") chupinchu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        '"Open count message chupinchu" (call) + "Busy group warning (>= 2)" (parseInt >= 2 condition) kalipi — message lo answer kuda join chey.',
        "var ga = new GlideAjax('IncidentAjax'); ga.addParam('sysparm_name', 'getOpenCount'); ga.addParam('sysparm_group', newValue); ga.getXMLAnswer(function (answer) { ... });",
        "var ga = new GlideAjax('IncidentAjax'); ga.addParam('sysparm_name', 'getOpenCount'); ga.addParam('sysparm_group', newValue); ga.getXMLAnswer(function (answer) { if (parseInt(answer, 10) >= 2) { g_form.addInfoMessage('Group already has ' + answer + ' open incidents'); } });",
      ],
      solution: ONCHANGE("  var ga = new GlideAjax('IncidentAjax');\n  ga.addParam('sysparm_name', 'getOpenCount');\n  ga.addParam('sysparm_group', newValue);\n  ga.getXMLAnswer(function (answer) {\n    if (parseInt(answer, 10) >= 2) {\n      g_form.addInfoMessage('Group already has ' + answer + ' open incidents');\n    }\n  });\n"),
      explain: 'Answer string ("2") — compare mundu parseInt tho number ki marchu.',
      tests: [
        { label: 'GlideAjax IncidentAjax.getOpenCount', expr: CALLS, expect: ['IncidentAjax.getOpenCount'] },
        { label: 'message', expr: MSGS, expect: ['Group already has 2 open incidents'] },
      ],
    }),
  ],
}

const ajax2 = {
  id: 'cs-ajax2',
  title: 'GlideAjax — Part 2 (Script Include side)',
  video: 'Glide Ajax & on change client script use cases (2nd video)',
  duration: '',
  no: 12,
  blurb: 'Server side: AbstractAjaxProcessor, getParameter (String() tho), "Glide AJAX enabled" Script Include rayadam.',
  learn: [
    {
      h: '🖧 Script Include — server half',
      body: [
        'Client-callable Script Include = Class.create() + Object.extendsObject(AbstractAjaxProcessor, { ... }) + form lo "Glide AJAX enabled" tick. Prathi function ki client nunchi vachina parameters this.getParameter("sysparm_x") tho chaduvutam — String(...) lo wrap chesi (enduko next cards lo).',
        'Function return chesina value client ki answer ga veltundi — string ga. Array/object pampali ante JSON.stringify(obj) chesi pampu, client lo JSON.parse(answer) tho teeskoo.',
        '✅ Function peru jagratta (nee PDI lo OOB AbstractAjaxProcessor source chadivi verify chesam): daani process() this.getName() tho sysparm_name chadivi aa function ni run chestundi. Nee Script Include lo getName / getValue / getType / getParameter ane functions rasthe base class vi override ayyi PRATHI GlideAjax call break avtundi — getUserName laanti vere peru pettu. "_" tho modalayye functions private — browser nunchi pilavalemu.',
        '✅ initialize kuda rayaku: AbstractAjaxProcessor sontha initialize(request, responseXML, gc) lo this.request = request pedutundi (OOB source lo verified). Nee Script Include lo initialize: function () {} (empty) pedithe adi override ayyi request save avvadu — this.getParameter() pani cheyyadu.',
      ],
      code: `var UserAjax = Class.create();
UserAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getUserName: function () {          // getName kaadu — adi AbstractAjaxProcessor di!
    var id = String(this.getParameter('sysparm_user_id'));
    var gr = new GlideRecord('sys_user');
    if (gr.get(id)) {
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
        'Client callable function ni evaraina browser nunchi pilavochu — sensitive data (salary, passwords) return cheyyakudadu. Avasaram ayithe gs.hasRole() / ACL check server lo cheyyi.',
        'Function lo parameter validate chey (empty / invalid ids). Ikkada exercises lo Stage 2 laaga code ni nuvve rastav — tests "callAjax(...)" tho nee function ni pilustayi.',
      ],
    },
    {
      h: '🧵 getParameter() → String()',
      body: [
        'this.getParameter() Java string OBJECT istundi (typeof "object"), JavaScript string kaadu. gr.get(id) / addQuery lo pani chestundi, kani === "network" leda switch tho compare chesthe FALSE vastundi — error kuda raadu, silent bug!',
        'Safe habit: function modatlo var x = String(this.getParameter("sysparm_x")); — tarvata ===, switch, JSON anni normal ga pani chestayi. Mana practice runner kuda Java string laage String object istundi.',
        '✅ Nee PDI lo verified: OOB AbstractAjaxProcessor source comment getParameter / getName "a Java String instance" istayi ani cheptundi.',
      ],
      code: `getLabel: function () {
  var p = String(this.getParameter('sysparm_priority'));   // Java string → JS string
  switch (p) {
    case '1': return 'Critical';
    case '2': return 'High';
    default: return 'Other';
  }
}`,
    },
  ],
  quiz: [
    q('Client callable Script Include edi extend cheyyali?', ['AbstractAjaxProcessor', 'GlideAjax (client class)', 'GlideRecord (table API)', 'GlideSystem (gs object)'], 0, 'Object.extendsObject(AbstractAjaxProcessor, {...}) + "Glide AJAX enabled" tick.'),
    q('Client nunchi vachina param server lo ela chaduvutam?', ['this.getParameter("sysparm_x")', 'current.getValue("sysparm_x")', 'gs.getProperty("sysparm_x")', 'g_form.getValue("sysparm_x")'], 0, 'this.getParameter() — compare chese mundu String(...) lo wrap chey.'),
    q('Array ni client ki pampali ante?', ['Direct ga array return cheyyadam', 'JSON.stringify chesi return', 'gs.info tho log cheyyadam', 'Array ni pampadam sadhyam kaadu'], 1, 'Answer string — JSON tho.'),
    q('Sensitive data return cheyyadam?', ['Parledu, anni data pampochu', 'Cheyyakudadu / roles check cheyyali', 'Ellappudu pampali', 'Client lo hide cheste chalu, server ki avasaram ledu'], 1, 'Evaraina pilavochu — server lo checks.'),
    q('Function em return cheste client ki veltundi?', ['Function return chese value (answer)', 'gs.info output client ki veltundi', 'current record client ki veltundi', 'Emi veltundi, nothing'], 0, 'Return value answer ga.'),
  ],
  exercises: [
    jx('cs-ajax2', 1, 'getUserName function', 'easy', {
      server: true,
      task: 'UserNameAjax Script Include rayi: getUserName function — sysparm_user_id param tho sys_user record techchi aa user "name" return chey. (Function peru getName pettaku — adi AbstractAjaxProcessor di, override chesthe GlideAjax calls anni break.)',
      starter: `var UserNameAjax = Class.create();
UserNameAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getUserName: function () {
    // TODO
  },
  type: 'UserNameAjax'
});`,
      hint: "var gr = new GlideRecord('sys_user'); gr.get(String(this.getParameter('sysparm_user_id'))); return gr.getValue('name');",
      solution: `var UserNameAjax = Class.create();
UserNameAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getUserName: function () {
    var gr = new GlideRecord('sys_user');
    gr.get(String(this.getParameter('sysparm_user_id')));
    return gr.getValue('name');
  },
  type: 'UserNameAjax'
});`,
      explain: 'Client addParam("sysparm_user_id", ..) → server lo this.getParameter("sysparm_user_id"). String(...) wrap ikkada lekapoyina get() pani chestundi, kani habit ga pettu. Function peru getName pedithe? AbstractAjaxProcessor process() this.getName() tho ye function run cheyyalo chustundi — nee getName adi override chesi motham Script Include break avtundi (nee PDI OOB source lo verified).',
      tests: [{ label: 'u_abel → Abel Tuter', expr: "callAjax(UserNameAjax, 'getUserName', { sysparm_user_id: 'u_abel' })", expect: 'Abel Tuter' }],
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
    var id = String(this.getParameter('sysparm_user_id'));
    var gr = new GlideRecord('sys_user');
    if (gr.get(id)) {
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
      hint: [
        'Incident table query — category param tho filter, active matrame, tarvata entha records vachayo count return chey.',
        "var gr = new GlideRecord('incident'); gr.addQuery('category', String(this.getParameter('sysparm_category'))); gr.addActiveQuery(); gr.query();",
        "var gr = new GlideRecord('incident'); gr.addQuery('category', String(this.getParameter('sysparm_category'))); gr.addActiveQuery(); gr.query(); return gr.getRowCount();",
      ],
      solution: `var IncidentCountAjax = Class.create();
IncidentCountAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getOpenCount: function () {
    var gr = new GlideRecord('incident');
    gr.addQuery('category', String(this.getParameter('sysparm_category')));
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
    jx('cs-ajax2', 8, 'Param ni String() lo wrap chey (===)', 'medium', {
      server: true,
      task: 'CategoryAjax lo isNetwork function rayi: sysparm_category param "network" ayithe "yes", lekapothe "no" return chey — compare ki === vaadu. ⚠️ this.getParameter() Java string OBJECT istundi: direct ga === "network" ellappudu false! Mundu String(...) lo wrap chey. 🧰 Vaade words: this.getParameter(), String(), ===',
      starter: `var CategoryAjax = Class.create();
CategoryAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  isNetwork: function () {
    // Step 1: param ni String(...) tho normal JS string ga marchu (ippudu Java string object)
    var category = this.getParameter('sysparm_category');

    // Step 2: category === 'network' ayithe 'yes', lekapothe 'no' return chey
  },
  type: 'CategoryAjax'
});`,
      hint: [
        'Starter lo category = getParameter() — adi string OBJECT. Object === "network" ellappudu false. String() tho normal string chey.',
        "var category = String(this.getParameter('sysparm_category'));",
        "var category = String(this.getParameter('sysparm_category')); if (category === 'network') { return 'yes'; } return 'no';",
      ],
      solution: `var CategoryAjax = Class.create();
CategoryAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  isNetwork: function () {
    var category = String(this.getParameter('sysparm_category'));
    if (category === 'network') {
      return 'yes';
    }
    return 'no';
  },
  type: 'CategoryAjax'
});`,
      explain: 'String() lekunda try chesi chudu — network ki kuda "no" vastundi, error raadu: silent bug. == (double) tho kuda pani chestundi, kani switch / === / JSON ki String() tappanisari. (Java string behaviour nee PDI lo OOB AbstractAjaxProcessor source tho verified.)',
      tests: [
        { label: 'network → yes', expr: "callAjax(CategoryAjax, 'isNetwork', { sysparm_category: 'network' })", expect: 'yes' },
        { label: 'software → no', expr: "callAjax(CategoryAjax, 'isNetwork', { sysparm_category: 'software' })", expect: 'no' },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to the hard 'P1 incident numbers (JSON)' ----
    jx('cs-ajax2', 5, 'Rendu params (category + priority)', 'medium+', {
      server: true,
      task: 'CatPriorityAjax lo getCount function rayi: client nunchi RENDU params vastayi — sysparm_category mariyu sysparm_priority. Rendu match ayye incidents count (active filter avasaram ledu) return chey. (Practice data lo software + priority 4 → 1 record: INC0010006. Software lo motham 2, priority 4 lo motham 3 — rendu kalisthe 1.) 🧰 Vaade words: this.getParameter(), addQuery, query, getRowCount',
      starter: `var CatPriorityAjax = Class.create();
CatPriorityAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getCount: function () {
    var gr = new GlideRecord('incident');
    // Step 1: category = sysparm_category param

    // Step 2: priority = sysparm_priority param

    // Step 3: query chesi count return chey
  },
  type: 'CatPriorityAjax'
});`,
      hint: [
        'Prathi param ki okko addQuery — rendu addQuery lu AND ga kalustayi.',
        "gr.addQuery('category', String(this.getParameter('sysparm_category')));   — priority ki kuda ide pattern.",
        "gr.addQuery('category', String(this.getParameter('sysparm_category'))); gr.addQuery('priority', String(this.getParameter('sysparm_priority'))); gr.query(); return gr.getRowCount();",
      ],
      solution: `var CatPriorityAjax = Class.create();
CatPriorityAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getCount: function () {
    var gr = new GlideRecord('incident');
    gr.addQuery('category', String(this.getParameter('sysparm_category')));
    gr.addQuery('priority', String(this.getParameter('sysparm_priority')));
    gr.query();
    return gr.getRowCount();
  },
  type: 'CatPriorityAjax'
});`,
      explain: 'Client lo ga.addParam("sysparm_priority", ..) enni pettina, server lo prathidaniki this.getParameter() okkate maargam.',
      tests: [
        { label: 'software + 4 → 1', expr: "callAjax(CatPriorityAjax, 'getCount', { sysparm_category: 'software', sysparm_priority: '4' })", expect: 1 },
        { label: 'network + 1 → 1', expr: "callAjax(CatPriorityAjax, 'getCount', { sysparm_category: 'network', sysparm_priority: '1' })", expect: 1 },
      ],
      // one more software / P4 incident → the count must follow the data (a hardcoded "return 1" fails here)
      variants: [{
        name: 'inko software P4 incident unte',
        scenario: { seed: { incident: [{ short_description: 'Outlook crashes on start', category: 'software', priority: '4', impact: '2', urgency: '3', caller_id: 'u_beth' }] } },
        tests: [
          { label: 'software + 4 → 2', expr: "callAjax(CatPriorityAjax, 'getCount', { sysparm_category: 'software', sysparm_priority: '4' })", expect: 2 },
          { label: 'software + 3 → 1', expr: "callAjax(CatPriorityAjax, 'getCount', { sysparm_category: 'software', sysparm_priority: '3' })", expect: 1 },
        ],
      }],
    }),
    jx('cs-ajax2', 6, 'Loop tho numbers (join)', 'medium+', {
      server: true,
      task: 'GroupNumbersAjax lo getNumbers function rayi: sysparm_group group ki assign ayina ACTIVE incidents ni number order lo loop chesi, numbers ni array lo push chey, last lo list.join(",") return chey. (Network → "INC0010002,INC0010007".) 🧰 Vaade words: while, next, push(), join()',
      starter: `var GroupNumbersAjax = Class.create();
GroupNumbersAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getNumbers: function () {
    var list = [];
    var gr = new GlideRecord('incident');
    gr.addQuery('assignment_group', String(this.getParameter('sysparm_group')));
    gr.addActiveQuery();
    gr.orderBy('number');
    gr.query();
    // Step 1: prathi record ki loop chey

    // Step 2: loop lo aa record number ni list lo pettu

    // Step 3: list ni comma tho join chesi return chey
  },
  type: 'GroupNumbersAjax'
});`,
      hint: [
        'Query ready ga undi. Records anni chadavadaniki while (gr.next()) loop — prathi round lo okka record.',
        "while (gr.next()) { list.push(gr.getValue('number')); }",
        "while (gr.next()) { list.push(gr.getValue('number')); } return list.join(',');",
      ],
      solution: `var GroupNumbersAjax = Class.create();
GroupNumbersAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getNumbers: function () {
    var list = [];
    var gr = new GlideRecord('incident');
    gr.addQuery('assignment_group', String(this.getParameter('sysparm_group')));
    gr.addActiveQuery();
    gr.orderBy('number');
    gr.query();
    while (gr.next()) {
      list.push(gr.getValue('number'));
    }
    return list.join(',');
  },
  type: 'GroupNumbersAjax'
});`,
      explain: 'join(",") array ni okka string chestundi — answer string kabatti client ki pampochu. Client lo answer.split(",") tho malli array. Values lo comma unte idi break avtundi — anduke hard exercise "P1 incident numbers (JSON)" lo JSON.',
      tests: [
        { label: 'g_net', expr: "callAjax(GroupNumbersAjax, 'getNumbers', { sysparm_group: 'g_net' })", expect: 'INC0010002,INC0010007' },
        { label: 'g_db', expr: "callAjax(GroupNumbersAjax, 'getNumbers', { sysparm_group: 'g_db' })", expect: 'INC0010004,INC0010008' },
      ],
    }),
    jx('cs-ajax2', 7, 'Object ni JSON ga pampu', 'medium+', {
      server: true,
      task: 'IncidentInfoAjax lo getInfo function rayi: sysparm_number param tho incident ni get("number", ...) chesi, { number, priority } object ni JSON.stringify chesi return chey. (Object direct ga pampaleru — answer string!) 🧰 Vaade words: get, getValue, JSON.stringify()',
      starter: `var IncidentInfoAjax = Class.create();
IncidentInfoAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getInfo: function () {
    var gr = new GlideRecord('incident');
    // Step 1: number field = sysparm_number unna record get chey

    // Step 2: { number: ..., priority: ... } object tayaru chey (getValue tho)

    // Step 3: object ni JSON string ga marchi return chey
  },
  type: 'IncidentInfoAjax'
});`,
      hint: [
        'get(field, value) okka record load chestundi. Tarvata oka object lo rendu values pettu, last lo string ga marchu.',
        "gr.get('number', String(this.getParameter('sysparm_number'))); var info = { number: gr.getValue('number'), priority: gr.getValue('priority') };",
        "gr.get('number', String(this.getParameter('sysparm_number'))); var info = { number: gr.getValue('number'), priority: gr.getValue('priority') }; return JSON.stringify(info);",
      ],
      solution: `var IncidentInfoAjax = Class.create();
IncidentInfoAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  getInfo: function () {
    var gr = new GlideRecord('incident');
    gr.get('number', String(this.getParameter('sysparm_number')));
    var info = { number: gr.getValue('number'), priority: gr.getValue('priority') };
    return JSON.stringify(info);
  },
  type: 'IncidentInfoAjax'
});`,
      explain: 'Client lo var info = JSON.parse(answer); info.priority — okka call lo chala values. Hard exercise "P1 incident numbers (JSON)" lo ide JSON trick array tho.',
      tests: [
        { label: 'string return', expr: "typeof callAjax(IncidentInfoAjax, 'getInfo', { sysparm_number: 'INC0010004' })", expect: 'string' },
        { label: 'JSON object', expr: "JSON.parse(callAjax(IncidentInfoAjax, 'getInfo', { sysparm_number: 'INC0010004' }))", expect: { number: 'INC0010004', priority: '2' } },
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
      hint: [
        'Medium+ "Loop tho numbers (join)" (loop + push) + "Object ni JSON ga pampu" (JSON.stringify) kalipi. Query lo priority 1, active, number order.',
        "var list = []; var gr = new GlideRecord('incident'); gr.addQuery('priority', 1); gr.addActiveQuery(); gr.orderBy('number'); gr.query();",
        "gr.addQuery('priority', 1); gr.addActiveQuery(); gr.orderBy('number'); gr.query(); while (gr.next()) { list.push(gr.getValue('number')); } return JSON.stringify(list);",
      ],
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
  blurb: 'Save / Submit nokkinappudu validation: return false tho aapadam — GlideAjax tho safe pattern kuda.',
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
        'Mandatory fields ki UI Policy chalu. onSubmit complex validations ki: length, field combinations, confirm dialogs. (Nee PDI lo OOB onSubmit example: "(BP) Close Mandatory on Close or Resolve" — open chesi chadivi chudu, marchaku.)',
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
        '⚠️ onSubmit lo GlideAjax (getXMLAnswer) answer tho save ni aapaleru — EPPUDU kaadu. Enduko, safe ga ela cheyyalo next card lo.',
      ],
      code: `function onSubmit() {
  if (g_form.getValue('priority') == '1') {
    return confirm('Idi P1. Submit cheyyala?');
  }
}`,
    },
    {
      h: '⏳ onSubmit + GlideAjax — async answer save ni aapaledu',
      body: [
        'onSubmit verdict (false = aagu) function RETURN ayina ventane teesukuntundi. getXMLAnswer callback answer tarvata vastundi — appatiki save already jarigipoyindi. Callback lopala "return false" rasina emi aagadu. Mana runner kuda ilane chestundi. (getXMLAnswer async ani nee PDI lo verified — callback tarvata run ayindi. "Save aagadu" ane mukka andulonchi vastundi, direct ga test cheyyaledu — ⚠️ PDI lo confirm chesuko.)',
        'Safe pattern 1 — mundee validate chey: field marinappudu (onChange) GlideAjax pilichi result ni g_scratchpad lo (leda hidden field lo) pettu. onSubmit lo aa result chadivi sync ga return false.',
        'Safe pattern 2 — aapu, adugu, malli submit: var action = g_form.getActionName() (Submit = "sysverb_insert" — PDI lo verified; Update = "sysverb_update") gurtupettuko, GlideAjax pilu, return false. Callback lo OK ayithe g_scratchpad lo flag petti g_form.submit(action). g_form.submit() onSubmit ni MALLI run chestundi — anduke function top lo flag check (lekapothe loop). (Ee re-run docs / community nunchi — ⚠️ PDI lo confirm chesuko.)',
        'ga.getXMLWait() (synchronous) kuda undi — kani answer vachhe varaku browser FREEZE avtundi, classic UI lo matrame pani chestundi (Service Portal / Workspace lo kaadu). Best practice kaadu. (Method nee PDI lo undi — verified; Service Portal / Workspace lo pani cheyyadu ane mukka docs nunchi — ⚠️ PDI lo confirm chesuko.)',
      ],
      code: `function onSubmit() {
  if (g_scratchpad.callerChecked) {      // round 2: g_form.submit() valla malli vachindi
    return true;
  }
  var action = g_form.getActionName();   // e.g. 'sysverb_insert'
  var ga = new GlideAjax('CallerCheckAjax');
  ga.addParam('sysparm_name', 'isActiveCaller');
  ga.addParam('sysparm_caller', g_form.getValue('caller_id'));
  ga.getXMLAnswer(function (answer) {
    if (answer == 'yes') {
      g_scratchpad.callerChecked = true;
      g_form.submit(action);             // malli submit — ippudu flag true
    } else {
      g_form.addErrorMessage('Caller inactive — active caller ni select chey');
    }
  });
  return false;                          // ippatiki aagu — answer vachaka decide
}`,
    },
  ],
  quiz: [
    q('onSubmit lo save aapadaniki?', ['return false', 'return true', 'return null', 'return "stop"'], 0, 'onSubmit lo return false chesthe form submit aagipotundi.'),
    q('onSubmit eppudu run avtundi?', ['Form load ayyaka', 'Field marinappudu', 'Save/Submit mundu', 'Save ayyaka server lo'], 2, 'Server ki velle mundu.'),
    q('return confirm("..."); user Cancel nokkite?', ['Save avtundi', 'Save aagipotundi', 'Error vastundi', 'Form close avtundi'], 1, 'confirm false → onSubmit false.'),
    q('Simple mandatory field ki edi better?', ['onSubmit script', 'UI Policy', 'Scheduled Job', 'Flow'], 1, 'UI Policy / dictionary mandatory.'),
    q('Validation fail ayithe user ki em chupinchali?', ['Emi chupinchakunda silent ga aapu', 'Clear error message (form / field)', 'alert chupinchi save cheyyi', 'Page reload chesi malli adugu'], 1, 'Clear error message — addErrorMessage leda showFieldMsg — tarvata return false.'),
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
      hint: [
        'confirm() true (OK) leda false (Cancel) istundi. Aa value ne onSubmit nunchi return chesthe — false ayithe save aagutundi.',
        "if (g_form.getValue('priority') == '1') { return confirm(...); }",
        "if (g_form.getValue('priority') == '1') { return confirm('Idi P1. Submit cheyyala?'); }   — else avasaram ledu (emi return cheyyakapothe save avtundi).",
      ],
      solution: "function onSubmit() {\n  if (g_form.getValue('priority') == '1') {\n    return confirm('Idi P1. Submit cheyyala?');\n  }\n}",
      explain: 'confirm() boolean ni direct ga return cheyyochu. (Ee practice lo user Cancel nokkindi anukunnam.)',
      tests: [
        { label: 'blocked (Cancel)', expr: '__submit', expect: false },
        { label: 'confirm asked', logs: ['Idi P1. Submit cheyyala?'] },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to the hard 'Anni errors okesari' ----
    jx('cs-onsubmit', 5, 'Flag variable (ok) tho', 'medium+', {
      scenario: { form: { values: { short_description: '' } } },
      client: SUBMIT,
      task: 'onSubmit lo direct ga "return false" raayakunda flag vaadu: var ok = true; short_description empty ayithe daani kinda "Required" error field message chupinchi ok = false. Last lo return ok. 🧰 Vaade words: var, g_form.getValue(), g_form.showFieldMsg(), return',
      starter: 'function onSubmit() {\n  // Step 1: ok variable — mundu true\n\n  // Step 2: short_description empty aa? → field message + ok = false\n\n  // Step 3: last lo ok return chey\n}',
      hint: [
        'ok = "ippativaraku anni correct" ani artham. Problem dorikithe false chey — return matram function chivara okkasari.',
        "var ok = true; if (g_form.getValue('short_description') == '') { ... ok = false; }",
        "var ok = true; if (g_form.getValue('short_description') == '') { g_form.showFieldMsg('short_description', 'Required', 'error'); ok = false; } return ok;",
      ],
      solution: "function onSubmit() {\n  var ok = true;\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  return ok;\n}",
      explain: 'Ippudu okate check — kani flag pattern valla tarvata inko check add cheyyadam easy ("Rendo check add chey", "Anni errors okesari").',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'field message', expr: '__f.short_description.msgs.map(function (m) { return m.text })', expect: ['Required'] },
      ],
    }),
    jx('cs-onsubmit', 6, 'Spaces matrame? (trim)', 'medium+', {
      scenario: { form: { values: { short_description: '   ' } } },
      client: SUBMIT,
      task: 'User short_description lo spaces matrame (" ") type chesadu — adi kuda empty laage treat cheyyali. "Flag variable (ok) tho" laage flag tho, kani check mundu value ni trim() chey. Empty ayithe "Required" error field message, ok = false, return ok. 🧰 Vaade words: g_form.getValue(), trim(), g_form.showFieldMsg()',
      starter: 'function onSubmit() {\n  var ok = true;\n  // Step 1: short_description value teesukoni rendu vaipula spaces teesey\n\n  // Step 2: trim chesina value empty aa? → field message + ok = false\n\n  return ok;\n}',
      hint: [
        "'   ' == '' false istundi! Mundu spaces teeseyali — trim() string methods lo undi.",
        "var desc = g_form.getValue('short_description').trim();",
        "var desc = g_form.getValue('short_description').trim(); if (desc == '') { g_form.showFieldMsg('short_description', 'Required', 'error'); ok = false; }",
      ],
      solution: "function onSubmit() {\n  var ok = true;\n  var desc = g_form.getValue('short_description').trim();\n  if (desc == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  return ok;\n}",
      explain: 'g_form.getValue() ellappudu string istundi, kabatti .trim() direct ga vaadochu. Real forms lo "   " laanti values chala common.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'field message', expr: '__f.short_description.msgs.map(function (m) { return m.text })', expect: ['Required'] },
      ],
    }),
    jx('cs-onsubmit', 7, 'Rendo check add chey', 'medium+', {
      scenario: { form: { values: { short_description: 'VPN down', category: '' } } },
      client: SUBMIT,
      task: 'Short_description check ready ga undi. Daani KINDA separate if tho category check add chey: category empty ayithe category kinda "Required" error, ok = false. Ee form lo short_description undi, category ledu — category ki matrame message raavali. 🧰 Vaade words: if, g_form.getValue(), g_form.showFieldMsg()',
      starter: "function onSubmit() {\n  var ok = true;\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  // Step 1: inko if (else if kaadu!) — category empty aa?\n\n  // Step 2: avunu ante category kinda field message + ok = false\n\n  return ok;\n}",
      hint: [
        'Rendo check ki separate if — else if ayithe first check fail ayinappudu rendodi asalu check avvadu.',
        "if (g_form.getValue('category') == '') { ... }",
        "if (g_form.getValue('category') == '') { g_form.showFieldMsg('category', 'Required', 'error'); ok = false; }",
      ],
      solution: "function onSubmit() {\n  var ok = true;\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  if (g_form.getValue('category') == '') {\n    g_form.showFieldMsg('category', 'Required', 'error');\n    ok = false;\n  }\n  return ok;\n}",
      explain: 'Separate ifs + okka flag = user ki anni problems okesari kanipistayi. Hard exercise "Anni errors okesari" lo idi motham nuvve scratch nunchi rastav.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'category ki matrame message', expr: '[__f.short_description.msgs.length, __f.category.msgs.length]', expect: [0, 1] },
      ],
    }),
    jx('cs-onsubmit', 4, 'Anni errors okesari', 'hard', {
      scenario: { form: { values: { short_description: '', category: '' } } },
      client: SUBMIT,
      task: 'onSubmit lo: short_description empty ayithe daani kinda "Required" error field message, category empty ayithe daani kinda "Required" error. Rendu check cheyyali (okati fail ayina aapakudadu). Edaina fail ayithe last lo return false.',
      starter: 'function onSubmit() {\n  // TODO\n}',
      hint: [
        '"Flag variable (ok) tho" + "Rendo check add chey" pattern: okka flag, rendu SEPARATE ifs, last lo flag return.',
        'var ok = true; if (...) { g_form.showFieldMsg(...); ok = false; } if (...) { ... } return ok;',
        "var ok = true; if (g_form.getValue('short_description') == '') { g_form.showFieldMsg('short_description', 'Required', 'error'); ok = false; }   — category ki kuda ide block, tarvata return ok;",
      ],
      solution: "function onSubmit() {\n  var ok = true;\n  if (g_form.getValue('short_description') == '') {\n    g_form.showFieldMsg('short_description', 'Required', 'error');\n    ok = false;\n  }\n  if (g_form.getValue('category') == '') {\n    g_form.showFieldMsg('category', 'Required', 'error');\n    ok = false;\n  }\n  return ok;\n}",
      explain: 'Flag variable (ok) tho anni errors okesari chupinchi, last lo return ok — user ki anni problems oke saari telustayi.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'rendu messages', expr: '[__f.short_description.msgs.length, __f.category.msgs.length]', expect: [1, 1] },
      ],
    }),
    jx('cs-onsubmit', 8, 'Duplicate check (GlideAjax + malli submit)', 'hard', {
      scenario: { scriptInclude: DUP_AJAX, form: { isNew: true, actionName: 'sysverb_insert', values: { short_description: 'VPN keeps disconnecting every 10 minutes' } } },
      client: SUBMIT,
      task: 'Server lo duplicate check: Script Include DupCheckAjax lo findOpenDuplicate function — param sysparm_short = short_description — same text tho OPEN incident unte daani number istundi, lekapothe "". onSubmit rayi: 1) g_scratchpad.dupChecked true ayithe return true (rendo round). 2) var action = g_form.getActionName(). 3) GlideAjax pilu. 4) return false. Callback lo: answer unte addErrorMessage("Already open: " + answer); lekapothe g_scratchpad.dupChecked = true; g_form.submit(action). (Ee form text tho already open incident undi.)',
      starter: "function onSubmit() {\n  // Step 1: rendo round? g_scratchpad.dupChecked true ayithe return true\n\n  // Step 2: action name gurtupettuko — g_form.getActionName()\n\n  // Step 3: GlideAjax('DupCheckAjax'): sysparm_name = findOpenDuplicate, sysparm_short = short_description\n  //         getXMLAnswer callback: answer unte error message; lekapothe flag true + g_form.submit(action)\n\n  // Step 4: ippatiki save aapu\n}",
      hint: [
        'Callback lo "return false" pani cheyyadu — appatiki onSubmit already return ayipoyindi. Anduke ventane return false; answer vachaka OK ayithe nuvve malli submit chey.',
        "if (g_scratchpad.dupChecked) { return true; }   var action = g_form.getActionName();   var ga = new GlideAjax('DupCheckAjax'); …   ga.getXMLAnswer(function (answer) { … });   return false;",
        "ga.getXMLAnswer(function (answer) { if (answer) { g_form.addErrorMessage('Already open: ' + answer); return; } g_scratchpad.dupChecked = true; g_form.submit(action); });",
      ],
      solution: "function onSubmit() {\n  if (g_scratchpad.dupChecked) {\n    return true;\n  }\n  var action = g_form.getActionName();\n  var ga = new GlideAjax('DupCheckAjax');\n  ga.addParam('sysparm_name', 'findOpenDuplicate');\n  ga.addParam('sysparm_short', g_form.getValue('short_description'));\n  ga.getXMLAnswer(function (answer) {\n    if (answer) {\n      g_form.addErrorMessage('Already open: ' + answer);\n      return;\n    }\n    g_scratchpad.dupChecked = true;\n    g_form.submit(action);\n  });\n  return false;\n}",
      explain: 'onSubmit verdict return ayinappude decide avtundi; GlideAjax answer tarvata vastundi. Anduke: ippatiki return false → answer OK ayithe g_form.submit(action). action ni getActionName() tho gurtupettukovali — Submit (sysverb_insert, PDI lo verified), Update (sysverb_update), leda custom button — ade button malli "click" avtundi. g_form.submit() valla onSubmit MALLI run avtundi; flag (g_scratchpad.dupChecked) lekapothe malli GlideAjax → malli return false → loop. getXMLWait() tho kuda cheyyochu kani browser freeze + Service Portal / Workspace lo pani cheyyadu. ⚠️ Ee re-run behaviour mariyu getXMLWait Portal / Workspace limit docs / community nunchi — PDI lo confirm chesuko.',
      tests: [
        { label: 'ippatiki save aagindi (return false)', expr: '__submit', expect: false },
        { label: 'GlideAjax DupCheckAjax.findOpenDuplicate', expr: CALLS, expect: ['DupCheckAjax.findOpenDuplicate'] },
        { label: 'sysparm_short = short description', expr: PARAM('sysparm_short'), expect: ['VPN keeps disconnecting every 10 minutes'] },
        { label: 'error message', expr: MSGS, expect: ['Already open: INC0010002'] },
        { label: 'duplicate unnappudu malli submit ledu', expr: '__x.formSubmits', expect: [] },
        { label: 'getXMLWait (browser freeze) vaadaledu', expr: '__x.syncAjax', expect: 0 },
      ],
      variants: [
        {
          name: 'duplicate ledu (Update button)',
          scenario: { form: { isNew: false, actionName: 'sysverb_update', values: { short_description: 'Laptop battery not charging' } } },
          tests: [
            { label: 'mundu return false', expr: '__submit', expect: false },
            { label: 'callback lo g_form.submit("sysverb_update")', expr: '__x.formSubmits', expect: ['sysverb_update'] },
            { label: 'flag set', expr: 'g_scratchpad.dupChecked', expect: true },
            { label: 'error ledu', expr: MSGS, expect: [] },
          ],
        },
        {
          name: 'rendo round (flag already true)',
          scenario: { scratchpad: { dupChecked: true } },
          tests: [
            { label: 'save avvali', expr: '__submit', expect: true },
            { label: 'GlideAjax malli pilavaledu', expr: '__x.ajaxCalls.length', expect: 0 },
          ],
        },
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
  blurb: 'Real-world mini scenarios: category → group, priority formula, confirm before closing (revert + guard).',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.flash('incident.assignment_group', '#ffcc00', 0);\n}",
    scenario: { form: { values: { category: 'software' } } },
    client: CHG('category', 'software', 'network'),
  },
  learn: [
    {
      h: '🧪 Real-world patterns',
      body: [
        'Idi revision lesson: onLoad / onChange / onSubmit tho real scenarios. Pattern ellappudu: guard → condition → g_form call.',
        'Lookup object (map) vaadithe if/else chain avasaram ledu: map[newValue] tho direct ga value; map lo key lekapothe undefined — || "" tho default.',
        'Marpu undo cheyyali ante g_form.setValue(field, oldValue) — oldValue = form LOAD ayinappati value.',
      ],
      code: `var map = g_scratchpad.groupByCategory;   // Display BR pampindi: { network: '<sys_id>', ... }
g_form.setValue('assignment_group', map[newValue] || '');`,
    },
    {
      h: '🚫 sys_ids client script lo hardcode cheyyaku',
      body: [
        'Group sys_id ni script lo rasthe (e.g. "287ebd7da9fe198100f92cc8d1d2154e") — vere instance lo aa group ki vere sys_id undochu, group delete / marchina script silent ga break avtundi. Best Practices lesson lo kuda ide rule.',
        'Better: server nunchi teesuko — Display Business Rule lo group names tho query chesi g_scratchpad ki pampu, leda GlideAjax. Inka better: category → group ki code avasaram ledu — System Policy → Assignment (assignment rules) leda Data Lookup Definitions.',
      ],
      code: `// Display Business Rule (server) — group NAMES tho sys_ids techchi client ki pampu
var map = {};
var gr = new GlideRecord('sys_user_group');
gr.addQuery('name', 'IN', 'Network,Database,Hardware');
gr.query();
while (gr.next()) {
  map[gr.getValue('name').toLowerCase()] = gr.getUniqueValue();
}
g_scratchpad.groupByCategory = map;`,
    },
    {
      h: '🔁 Revert + confirm — onChange malli fire avtundi',
      body: [
        'Confirm adigi Cancel ayithe g_form.setValue(field, oldValue) chestam. Kani setValue ADE field ni marchindi kabatti onChange MALLI run avtundi (ee sari newValue = oldValue). Guard lekapothe confirm rendo sari adugutundi!',
        'Fix: standard guard tarvata if (newValue == oldValue) return; — revert valla vachina call ventane aagipotundi. User field ni load value ki tirigi pettinappudu kuda ide guard anavasara confirm ni aaputundi.',
        '✅ Rendu nee PDI lo verified: g_form.setValue() field onChange ni malli fire chestundi; oldValue = form LOAD value (OOB "Worknotes mandatory onChange of priority" tho priority 4 → 2 → 3 → 4 chesthe Work notes mandatory, mandatory, mandatory KAADU — last marpu lo newValue 4 = oldValue 4).',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading, isTemplate) {
  if (isLoading || newValue === '') {
    return;
  }
  if (newValue == oldValue) {   // revert valla malli vachina call
    return;
  }
  if (!confirm('Category marchala?')) {
    g_form.setValue('category', oldValue);
  }
}`,
    },
  ],
  quiz: [
    q('Category → group mapping ki best way edi?', ['Assignment rule / Data Lookup', 'Client script lo sys_ids hardcode', 'Prathi category ki if/else chain', 'User ni prathi sari adagadam'], 0, 'Code lekunda System Policy → Assignment rules / Data Lookup. Client script lo sys_ids hardcode cheyyakudadu.'),
    q('Marpu undo cheyyali ante?', ['g_form.setValue(field, oldValue)', 'g_form.clearValue(field) matrame', 'onChange lo return false', 'g_form.setValue(field, newValue)'], 0, 'oldValue (form load value) tho revert — guard (newValue == oldValue) marchipoku.'),
    q('map[newValue] || "" lo || enduku?', ['Map lo key lekapothe "" default', 'Error throw cheyyadaniki', 'Rendu maps ni kalapadaniki', 'Value ni number ga marchadaniki'], 0, 'undefined ki default "".'),
    q('Priority formula logic ekkada unte best?', ['Server (Script Include / Business Rule)', 'Prathi client script lo copy paste chesi', 'Browser cache lo save chesi', 'Email lo rasi pettukoni'], 0, 'Okachota (server) — maintain cheyyadam easy.'),
    q('Confirm before close — onChange lo cancel ayithe?', ['Marpu revert cheyyali', 'Em cheyyakunda vadileyyali', 'Page reload cheyyali', 'Record delete cheyyali'], 0, 'oldValue ki revert — guard (newValue == oldValue) tho confirm rendo sari raadu.'),
  ],
  exercises: [
    jx('cs-usecases', 1, 'Hardware hint', 'easy', {
      scenario: { form: { values: { category: 'software' } } },
      client: CHG('category', 'software', 'hardware'),
      task: 'onChange (category) rayi: newValue "hardware" ayithe category kinda info field message "Asset tag description lo rayi" chupinchu; lekapothe category field message hide chey.',
      starter: ONCHANGE('  // TODO\n'),
      hint: "if (newValue == 'hardware') { g_form.showFieldMsg('category', '...', 'info'); } else { g_form.hideFieldMsg('category'); }",
      solution: ONCHANGE("  if (newValue == 'hardware') {\n    g_form.showFieldMsg('category', 'Asset tag description lo rayi', 'info');\n  } else {\n    g_form.hideFieldMsg('category');\n  }\n"),
      explain: 'Else lo hide cheyyakapothe paata message migilipotundi.',
      tests: [{ label: 'field message', expr: '__f.category.msgs.map(function (m) { return m.text })', expect: ['Asset tag description lo rayi'] }],
    }),
    jx('cs-usecases', 2, 'Category → group (g_scratchpad map)', 'medium', {
      scenario: { form: { values: { category: 'software' } }, scratchpad: { groupByCategory: { network: 'g_net', database: 'g_db', hardware: 'g_hw' } } },
      client: CHG('category', 'software', 'database'),
      task: 'Display BR g_scratchpad.groupByCategory lo category → group sys_id map pettindi ({ network: …, database: …, hardware: … }). onChange (category) rayi: aa map nundi newValue ki group teesukoni assignment_group set chey; map lo lekapothe assignment_group empty chey. sys_ids script lo hardcode cheyyaku!',
      starter: ONCHANGE("  // Step 1: map = g_scratchpad.groupByCategory\n\n  // Step 2: assignment_group = map[newValue] (lekapothe '')\n"),
      hint: [
        'If/else chain badulu object lookup: key = category value, value = group sys_id. Map server (Display BR) nunchi g_scratchpad lo vachindi.',
        "var map = g_scratchpad.groupByCategory;   tarvata map[newValue] || ''",
        "var map = g_scratchpad.groupByCategory; g_form.setValue('assignment_group', map[newValue] || '');",
      ],
      solution: ONCHANGE("  var map = g_scratchpad.groupByCategory;\n  g_form.setValue('assignment_group', map[newValue] || '');\n"),
      explain: 'Object lookup tho 3 if-else kante clean. sys_ids server nunchi vastayi kabatti instance / group marina client script marchakkarledu. Real project lo category → group ki Assignment rules (System Policy → Assignment) best — code avasaram ledu.',
      tests: [{ label: 'g_db', expr: "g_form.getValue('assignment_group')", expect: 'g_db' }],
    }),
    jx('cs-usecases', 3, 'Priority formula', 'medium', {
      scenario: { form: { values: { impact: '2', urgency: '2' } } },
      client: CHG('impact', '2', '1'),
      task: 'onChange (impact) rayi: priority = impact + urgency - 1 (numbers ga marchi) calculate chesi priority field set chey. (Strings add cheste "12"-type bug vastundi!)',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        'newValue (impact) mariyu form lo urgency — rendu strings. Rendu numbers ga marchi formula, result ni malli string ga set chey.',
        "var p = parseInt(newValue, 10) + parseInt(g_form.getValue('urgency'), 10) - 1;",
        "var p = parseInt(newValue, 10) + parseInt(g_form.getValue('urgency'), 10) - 1; g_form.setValue('priority', String(p));",
      ],
      solution: ONCHANGE("  var p = parseInt(newValue, 10) + parseInt(g_form.getValue('urgency'), 10) - 1;\n  g_form.setValue('priority', String(p));\n"),
      explain: 'parseInt tho number ki marchi calculate. Real PDI lo priority Data Lookup rule tho set avtundi (UI Policy "Priority is managed by Data Lookup - set as read-only") — akkada 3/3 → "4 - Low" (ee formula 5 istundi). Idi practice matrame.',
      tests: [{ label: 'priority = 2', expr: "g_form.getValue('priority')", expect: '2' }],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to the hard 'Close confirm (revert)' ----
    jx('cs-usecases', 5, 'Group marchithe assigned_to clear (confirm)', 'medium+', {
      scenario: { form: { values: { assignment_group: 'g_desk', assigned_to: 'u_admin' } }, confirmAnswer: true },
      client: CHG('assignment_group', 'g_desk', 'g_net'),
      task: 'onChange (assignment_group) rayi: confirm("Group marchithe Assigned to clear avtundi. OK na?") adugu. User OK nokkite (confirm true) assigned_to ni clearValue chey. (Ee practice lo user OK nokkadu.) 🧰 Vaade words: confirm(), if, g_form.clearValue()',
      starter: ONCHANGE("  // Step 1: confirm(...) adugu — adi true (OK) / false (Cancel) istundi\n\n  // Step 2: true ayithe assigned_to clear chey\n"),
      hint: [
        'confirm() oka boolean return chestundi — daanni direct ga if condition lo pettochu.',
        "if (confirm('Group marchithe Assigned to clear avtundi. OK na?')) { ... }",
        "if (confirm('Group marchithe Assigned to clear avtundi. OK na?')) { g_form.clearValue('assigned_to'); }",
      ],
      solution: ONCHANGE("  if (confirm('Group marchithe Assigned to clear avtundi. OK na?')) {\n    g_form.clearValue('assigned_to');\n  }\n"),
      explain: 'Group marithe paata assignee kotta group lo undakapovachu — anduke clear (nee PDI lo OOB client script "Empty assigned_to on group change" confirm lekunda ide chestundi). confirm() result ni if lo vaadatam = user decision tho code nadapatam.',
      tests: [
        { label: 'assigned_to clear', expr: "g_form.getValue('assigned_to')", expect: '' },
        { label: 'confirm asked', logs: ['Group marchithe Assigned to clear avtundi. OK na?'] },
      ],
    }),
    jx('cs-usecases', 6, 'Marpu undo (oldValue)', 'medium+', {
      scenario: { form: { values: { state: '2' } } },
      client: CHG('state', '2', '8'),
      task: 'onChange (state) rayi: newValue "8" (Canceled) ayithe state ni oldValue ki tirigi pettu (setValue) mariyu addErrorMessage("Form nunchi Canceled cheyyaku") chupinchu. Revert valla onChange malli vastundi — top lo guard (newValue == oldValue ayithe return) pettu. 🧰 Vaade words: oldValue, g_form.setValue(), g_form.addErrorMessage()',
      starter: ONCHANGE("  // Step 1: re-fire guard — newValue == oldValue ayithe return\n\n  // Step 2: newValue '8' aa?\n\n  // Step 3: avunu ante state ni paata value (oldValue) ki set chey + error message\n"),
      hint: [
        'onChange ki oldValue parameter vastundi — form LOAD ayinappati value. Daanni malli setValue chesthe marpu undo.',
        "if (newValue == oldValue) { return; }   if (newValue == '8') { g_form.setValue('state', oldValue); ... }",
        "if (newValue == oldValue) { return; } if (newValue == '8') { g_form.setValue('state', oldValue); g_form.addErrorMessage('Form nunchi Canceled cheyyaku'); }",
      ],
      solution: ONCHANGE("  if (newValue == oldValue) {\n    return;\n  }\n  if (newValue == '8') {\n    g_form.setValue('state', oldValue);\n    g_form.addErrorMessage('Form nunchi Canceled cheyyaku');\n  }\n"),
      explain: 'oldValue = form load ayinappati value (field ni rendu sarlu marchina, last-before value kaadu). setValue chesthe onChange malli fire avtundi (newValue = oldValue) — guard ventane return chestundi. Ikkada guard lekapoyina newValue "8" kaadu kabatti emi jaragadu; kani confirm unna next exercise lo guard lekapothe confirm rendu sarlu. (✅ Ee rendu behaviours nee PDI lo verified.)',
      tests: [
        { label: 'state reverted', expr: "g_form.getValue('state')", expect: '2' },
        { label: 'error message', expr: MSGS, expect: ['Form nunchi Canceled cheyyaku'] },
      ],
    }),
    jx('cs-usecases', 7, 'Cancel nokkite revert (!confirm + guard)', 'medium+', {
      scenario: { form: { values: { assignment_group: 'g_desk' } }, confirmAnswer: false },
      client: CHG('assignment_group', 'g_desk', 'g_net'),
      task: 'onChange (assignment_group) rayi: confirm("Assignment group marchala?") adugu. User Cancel nokkite (confirm false) assignment_group ni oldValue ki revert chey. ⚠️ Revert (setValue) valla onChange MALLI run avtundi — guard (if (newValue == oldValue) return;) lekapothe confirm RENDU sarlu vastundi. (Ee practice lo user Cancel nokkadu.) 🧰 Vaade words: confirm(), ! (not), oldValue, g_form.setValue()',
      starter: ONCHANGE("  // Step 1: re-fire guard — newValue == oldValue ayithe return\n\n  // Step 2: confirm(...) adugu — Cancel ante false\n\n  // Step 3: false ayithe (! tho check) group ni oldValue ki tirigi pettu\n"),
      hint: [
        '"Group marchithe assigned_to clear (confirm)" lo OK ayithe pani chesam; ikkada Cancel ayithe — ! tho. Inka: revert tarvata onChange malli vastundi (newValue == oldValue) — appudu confirm adagakudadu.',
        "if (newValue == oldValue) { return; }   if (!confirm('Assignment group marchala?')) { ... }",
        "if (newValue == oldValue) { return; } if (!confirm('Assignment group marchala?')) { g_form.setValue('assignment_group', oldValue); }",
      ],
      solution: ONCHANGE("  if (newValue == oldValue) {\n    return;\n  }\n  if (!confirm('Assignment group marchala?')) {\n    g_form.setValue('assignment_group', oldValue);\n  }\n"),
      explain: 'Guard lekunda Run chesi Script Log chudu: "Assignment group marchala?" RENDU sarlu — rendo sari revert valla vachina onChange (newValue = oldValue = g_desk). Guard aa call ni ventane aapestundi. !confirm(...) = "user Cancel nokkite". Hard exercise "Close confirm (revert)" lo ide pattern ki newValue condition && tho kaluputham.',
      tests: [
        { label: 'group reverted', expr: "g_form.getValue('assignment_group')", expect: 'g_desk' },
        { label: 'confirm okkasari matrame', logs: ['Assignment group marchala?'] },
      ],
    }),
    jx('cs-usecases', 4, 'Close confirm (revert)', 'hard', {
      scenario: { form: { values: { state: '2' } }, confirmAnswer: false },
      client: CHG('state', '2', '7'),
      task: 'onChange (state) rayi: newValue "7" (Closed) ayithe confirm("Incident close cheyyala?") adugu. User Cancel nokkite state ni oldValue ki revert chey. Guard kuda: form already Closed ga open ayyi user malli Closed pettinappudu (newValue == oldValue) confirm adagakudadu.',
      starter: ONCHANGE('  // TODO\n'),
      hint: [
        '"Marpu undo (oldValue)" (newValue check + oldValue revert + guard) + "Cancel nokkite revert (!confirm + guard)". Rendu conditions && tho — newValue "7" kakapothe confirm adagakudadu.',
        "if (newValue == oldValue) { return; }   if (newValue == '7' && !confirm(...)) { ... }",
        "if (newValue == oldValue) { return; } if (newValue == '7' && !confirm('Incident close cheyyala?')) { g_form.setValue('state', oldValue); }",
      ],
      solution: ONCHANGE("  if (newValue == oldValue) {\n    return;\n  }\n  if (newValue == '7' && !confirm('Incident close cheyyala?')) {\n    g_form.setValue('state', oldValue);\n  }\n"),
      explain: '&& short-circuit: newValue "7" kakapothe confirm asalu adagadu. Guard: form Closed ga load ayyi user state marchi malli Closed pettithe newValue == oldValue ("7") — already closed, confirm avasaram ledu; revert valla vachina onChange kuda ade guard tho aagutundi.',
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
      body: [
        'Ee script lo g_form ledu (form kaadu, list). Alert / confirm vaadochu. Ellappudu callback pilavali — okka sari matrame.',
        'Multiple rows select chesi okesari edit chesthe sysIDs, oldValues lo ANNI rows untayi — oldValues[0] okkate chusthe migilina records miss avtayi. Loop chey.',
      ],
      code: `for (var i = 0; i < oldValues.length; i++) {
  if (oldValues[i] == '6') {
    // edaina okka Resolved record unna block
  }
}`,
    },
    {
      h: '📋 List editing lo em run avtundi, em avvadu?',
      body: [
        'List lo cell edit chesinappudu form ledu — kabatti onChange Client Scripts, UI Policies (form logic) RUN AVVAVU. Client side lo list edit ki check kavali ante onCellEdit matrame.',
        'Server side rules list edit lo kuda pani chestayi: Data Policy (data level mandatory / read-only), Business Rule, ACL. Important rules ni server lo pettu — onCellEdit UX kosam matrame.',
        '⚠️ Docs / community nunchi — nee PDI lo test chey: incident list lo state ni Resolved ki list-edit chesi chudu — OOB Data Policy "Make close info mandatory when resolved or closed" aapestundo, UI Policy lu run avvavo confirm chesuko (tarvata marpu venakki tippu).',
      ],
    },
  ],
  quiz: [
    q('onCellEdit eppudu run avtundi?', ['Form load ayinappudu', 'List lo cell edit chesinappudu', 'Record save ayyaka server lo', 'Form lo field value marinappudu'], 1, 'List editing time lo.'),
    q('Edit allow cheyyadaniki?', ['callback(true)', 'return true', 'g_form.save()', 'callback(false)'], 0, 'callback(true) — save & close.'),
    q('Callback pilavakapothe?', ['Em kaadu, normal ga save avtundi', 'Cell edit stuck avtundi', 'Auto ga save avtundi', 'Error page vastundi'], 1, 'Ellappudu callback pilavali.'),
    q('oldValues em type?', ['String (okka value)', 'Array (prathi record ki)', 'Object (sys_id → value map)', 'Number (records count)'], 1, 'Array — selected records order lo old values. PDI lo test chesi confirm chesam: oldValues = ["old value"].'),
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
    jx('cs-oncell', 3, 'Resolved records edit cheyyaku (anni rows)', 'medium', {
      scenario: { form: { values: {} } },
      client: CELL('2', ['2', '6'], ['inc1', 'inc5']),
      task: 'User RENDU records select chesi State column okesari edit chesadu (first record In Progress, rendodi Resolved — oldValues = ["2", "6"]). oldValues lo EDAINA okati "6" (Resolved) ayithe alert("Resolved record edit cheyyaku") chupinchi callback(false); lekapothe callback(true). oldValues array meeda loop chey.',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO: oldValues lo prathi value check chey\n}',
      hint: [
        'oldValues oka array — prathi selected record ki okka paata value. oldValues[0] matrame chusthe rendo record (Resolved) miss avtundi. for loop tho anni chudu.',
        "for (var i = 0; i < oldValues.length; i++) { if (oldValues[i] == '6') { alert(...); callback(false); return; } }   callback(true);",
        "for (var i = 0; i < oldValues.length; i++) { if (oldValues[i] == '6') { alert('Resolved record edit cheyyaku'); callback(false); return; } } callback(true);",
      ],
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  for (var i = 0; i < oldValues.length; i++) {\n    if (oldValues[i] == '6') {\n      alert('Resolved record edit cheyyaku');\n      callback(false);\n      return;\n    }\n  }\n  callback(true);\n}",
      explain: 'Multi-row list edit lo oldValues[i] = sysIDs[i] record yokka paata value. Okka Resolved record unna motham edit aapestunnam; return valla callback okkasari matrame.',
      tests: [
        { label: 'blocked (rendo record Resolved)', expr: '__submit', expect: false },
        { label: 'alert', logs: ['Resolved record edit cheyyaku'] },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to the hard 'Role check' ----
    jx('cs-oncell', 5, 'Callback okkasari matrame (return)', 'medium+', {
      scenario: { form: { values: {} } },
      client: CELL('5'),
      task: 'Priority column ki: newValue "5" (Planning) ayithe alert("Priority 5 list nunchi set cheyyaku") chupinchi callback(false) pilichi VENTANE return chey. Function chivara callback(true). (if/else vaadakunda — return tho.) 🧰 Vaade words: alert(), callback, return',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // Step 1: newValue \'5\' aa? → alert + callback(false) + return\n\n  // Step 2: migilina anni cases — callback(true)\n}',
      hint: [
        'callback ni okka sari matrame pilavali. callback(false) tarvata return lekapothe code kindaki velli callback(true) kuda pilustundi.',
        "if (newValue == '5') { alert(...); callback(false); return; }",
        "if (newValue == '5') { alert('Priority 5 list nunchi set cheyyaku'); callback(false); return; } callback(true);",
      ],
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (newValue == '5') {\n    alert('Priority 5 list nunchi set cheyyaku');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: 'Early return pattern: problem case lo callback(false) + return, chivara callback(true). Ila prathi path lo callback okka sari matrame. (Ee practice runner lo return marchipothe last callback(true) gelustundi; real list lo rendu sarlu pilavadam behaviour ⚠️ PDI lo confirm chesuko — ellappudu okkasari pilavadame safe.)',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['Priority 5 list nunchi set cheyyaku'] },
      ],
    }),
    jx('cs-oncell', 6, 'List lo g_user role check', 'medium+', {
      scenario: { form: { values: {} }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: CELL('3'),
      task: 'Ee column ni "itil" role unnavaalle list nunchi edit cheyyali. g_user.hasRole("itil") false ayithe alert("List edit ki itil role kavali") + callback(false) + return; lekapothe callback(true). (Ee practice user ki roles levu.) 🧰 Vaade words: g_user.hasRole(), ! (not), alert(), callback',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // Step 1: itil role LEKAPOTHE → alert + callback(false) + return\n\n  // Step 2: role unte callback(true)\n}',
      hint: [
        'g_user list scripts lo kuda untundi. hasRole true/false istundi — ! tho "role ledu" check.',
        "if (!g_user.hasRole('itil')) { alert(...); callback(false); return; }",
        "if (!g_user.hasRole('itil')) { alert('List edit ki itil role kavali'); callback(false); return; } callback(true);",
      ],
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (!g_user.hasRole('itil')) {\n    alert('List edit ki itil role kavali');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: 'g_user.hasRole() admin ki ellappudu true istundi. Client check UX kosam matrame — asalu security ACL tho server lo. Hard exercise "Role check" lo ide role check ki newValue condition kalustundi.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['List edit ki itil role kavali'] },
      ],
    }),
    jx('cs-oncell', 7, 'Rendu conditions (&&)', 'medium+', {
      scenario: { form: { values: {} } },
      client: CELL('7', ['2']),
      task: 'State column ki: newValue "7" (Closed) MARIYU paata value oldValues[0] "6" (Resolved) kaakapothe — alert("Mundu Resolved chey, tarvata Close") + callback(false) + return. Migilina anni cases ki callback(true). (Ee record paata state 2.) 🧰 Vaade words: &&, !=, oldValues[0], alert(), callback',
      starter: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // Step 1: newValue '7' && oldValues[0] '6' kaadu → alert + callback(false) + return\n\n  // Step 2: callback(true)\n}",
      hint: [
        'Rendu conditions okate if lo && tho: kotta value Closed, paata value Resolved kaadu.',
        "if (newValue == '7' && oldValues[0] != '6') { ... }",
        "if (newValue == '7' && oldValues[0] != '6') { alert('Mundu Resolved chey, tarvata Close'); callback(false); return; } callback(true);",
      ],
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (newValue == '7' && oldValues[0] != '6') {\n    alert('Mundu Resolved chey, tarvata Close');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: '&& lo rendu true ayithene block. Ikkada okka record edit — chala records unte "Resolved records edit cheyyaku (anni rows)" laage loop. Hard exercise "Role check" lo rendo condition role check (!g_user.hasRole) avtundi — same shape.',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['Mundu Resolved chey, tarvata Close'] },
      ],
    }),
    jx('cs-oncell', 4, 'Role check', 'hard', {
      scenario: { form: { values: {} }, user: { userName: 'abel.tuter', userID: 'u_abel', roles: [] } },
      client: CELL('1'),
      task: 'Priority column ki: newValue "1" ayithe "itil" role unnavaalle set cheyyali. Role lekapothe alert("P1 set cheyyadaniki itil role kavali") chupinchi callback(false). Migilina anni cases ki callback(true).',
      starter: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  // TODO\n}',
      hint: [
        'Medium+ "List lo g_user role check" (role check) + "Rendu conditions (&&)": newValue "1" MARIYU role ledu → block.',
        "if (newValue == '1' && !g_user.hasRole('itil')) { ... callback(false); return; } callback(true);",
        "if (newValue == '1' && !g_user.hasRole('itil')) { alert('P1 set cheyyadaniki itil role kavali'); callback(false); return; } callback(true);",
      ],
      solution: "function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  if (newValue == '1' && !g_user.hasRole('itil')) {\n    alert('P1 set cheyyadaniki itil role kavali');\n    callback(false);\n    return;\n  }\n  callback(true);\n}",
      explain: 'g_user list scripts lo kuda available. List edit lo onChange / UI Policies run avvavu — anduke list ki separate ga onCellEdit (leda server lo ACL / Data Policy) kavali. (List edit behaviour docs nunchi — ⚠️ "List editing lo em run avtundi" card lo test cheppinattu PDI lo confirm chesuko.)',
      tests: [
        { label: 'blocked', expr: '__submit', expect: false },
        { label: 'alert', logs: ['P1 set cheyyadaniki itil role kavali'] },
      ],
    }),
  ],
}

export const CS_LESSONS_C = [ajax1, ajax2, onsubmit, usecases, oncell]
