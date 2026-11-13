// Stage 2 · JavaScript (part 3): conditions, loops, functions — all ServiceNow scenarios.
import { q, jx } from './lessonKit.js'

/* 6 — Conditions */
const conditions = {
  id: 'js-conditions',
  title: 'JavaScript Conditions',
  video: 'Javascript conditions',
  duration: '',
  blurb: 'if / else if / switch tho incident priority, state, assignment decisions.',
  learn: [
    {
      h: '🔀 if / else',
      body: [
        'Condition true ayithe oka code, lekapothe inkoka code run avtundi. Business Rules, Client Scripts anni conditions tho start avtayi: "priority 1 ayithe...".',
      ],
      code: `if (priority === '1') {
  gs.info('Page on-call');
} else {
  gs.info('Normal queue');
}`,
    },
    {
      h: '🪜 else if chain',
      body: [
        'Konni cases unte else if tho chain chey. Mundu match ayina branch matrame run avtundi, migatavi skip.',
      ],
      code: `var label;
if (p === '1') label = 'Critical';
else if (p === '2') label = 'High';
else if (p === '3') label = 'Moderate';
else label = 'Low';`,
    },
    {
      h: '🎛 switch',
      body: [
        'Oke variable ki chala exact values unte switch clean ga untundi (incident State: 1 New, 2 In Progress...). Prathi case ki break marchipokandi — lekapothe next case ki kuda run avtundi (fall-through).',
      ],
      code: `switch (state) {
  case '1': gs.info('New'); break;
  case '2': gs.info('In Progress'); break;
  case '6': gs.info('Resolved'); break;
  default: gs.info('Other');
}`,
    },
    {
      h: '✅ Truthy / falsy',
      body: [
        'Condition lo boolean kakapoyina vaadochu: empty string "", 0, null, undefined = falsy; migatavi truthy. Anduke if (!gr.getValue("assigned_to")) = assigned_to empty ayithe.',
      ],
      code: `if (!gr.getValue('assigned_to')) {
  gs.info('Unassigned');
}`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'if (x = 1) lo = assignment (marchestundi!), compare kaadu. Compare ki == leka === vaadu.',
        'getValue string. switch strict comparison (===) vaadutundi — case 1 vs "1" match avvavu. Anduke case \'1\' ani quotes lo rayali.',
      ],
      code: `var s = gr.getValue('state');   // '2'
switch (s) {
  case 2: gs.info('number case'); break;      // match avvadu!
  case '2': gs.info('string case'); break;    // match avtundi
}`,
    },
  ],
  quiz: [
    q('switch lo break marchipothe emavtundi?', ['Next case code kuda run avtundi (fall-through)', 'Error vastundi, script aagipotundi', 'Default case matrame run avtundi', 'Emi kaadu, normal ga break avtundi'], 0, 'break lekunda next cases kuda run avtayi.'),
    q('var s = "2"; switch (s) { case 2: ... } — case 2 match avtunda?', ['Avvadu (=== strict)', 'Avtundi', 'Error', 'Default avtundi'], 0, 'switch strict compare. "2" !== 2.'),
    q('Edi falsy kaadu?', ['"0" (non-empty string)', '"" (empty string)', '0 (number zero)', 'null'], 0, '"0" non-empty string kabatti truthy.'),
    q('if (x = 1) — idi em chestundi?', ['x ki 1 assign chestundi (compare kaadu)', 'x == 1 check chestundi (compare)', 'Syntax Error istundi', 'x === 1 strict check chestundi'], 0, '= assignment. Compare ki == leka ===.'),
    q('Mundu true ayina else-if tarvata migilina branches ni?', ['Skip chestundi', 'Anni run chestundi', 'Error istundi', 'Malli check chestundi'], 0, 'if-else chain lo first match matrame run.'),
  ],
  exercises: [
    jx('js-conditions', 1, 'Page on-call or normal queue', 'easy', {
      scenario: { current: { table: 'incident', values: { priority: '1' } } },
      task: 'current lo priority "1" ayithe "Page on-call" ani, lekapothe "Normal queue" ani log chey (if / else).',
      starter: `var p = current.getValue('priority');

// TODO: if (p === '1') log 'Page on-call' else log 'Normal queue'
`,
      hint: "if (p === '1') { gs.info('Page on-call'); } else { gs.info('Normal queue'); }",
      solution: `var p = current.getValue('priority');

if (p === '1') {
  gs.info('Page on-call');
} else {
  gs.info('Normal queue');
}`,
      explain: 'getValue string kabatti "1" tho === compare chesam.',
      tests: [{ label: 'Log: Page on-call', logs: ['Page on-call'] }],
    }),
    jx('js-conditions', 2, 'Priority label (else if)', 'easy', {
      task: 'INC0010003 teesuko, priority getValue. else-if chain tho label set chey: "1" Critical, "2" High, "3" Moderate, migatha Low. label ni log chey.',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010003');
var p = gr.getValue('priority');

var label;
// TODO: if / else if chain tho label set chey

gs.info(label);
`,
      hint: "if (p === '1') { label = 'Critical'; } else if (p === '2') { ... } ... else { label = 'Low'; }",
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010003');
var p = gr.getValue('priority');

var label;
if (p === '1') {
  label = 'Critical';
} else if (p === '2') {
  label = 'High';
} else if (p === '3') {
  label = 'Moderate';
} else {
  label = 'Low';
}

gs.info(label);`,
      explain: 'Priority 4 → Low (else). Mundu match ayina branch matrame run.',
      tests: [{ label: 'Log: Low', logs: ['Low'] }],
    }),
    jx('js-conditions', 3, 'State message (switch)', 'medium', {
      task: 'INC0010005 state teesuko (string). switch tho: "1" → New, "2" → In Progress, "3" → On Hold, "6" → Resolved - waiting for closure, default → Other. Message ni msg lo petti log chey. break marchipoku!',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010005');
var state = gr.getValue('state');

var msg;
// TODO: switch (state) { case '1': ... }

gs.info(msg);
`,
      hint: "case '6': msg = 'Resolved - waiting for closure'; break;",
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010005');
var state = gr.getValue('state');

var msg;
switch (state) {
  case '1':
    msg = 'New';
    break;
  case '2':
    msg = 'In Progress';
    break;
  case '3':
    msg = 'On Hold';
    break;
  case '6':
    msg = 'Resolved - waiting for closure';
    break;
  default:
    msg = 'Other';
}

gs.info(msg);`,
      explain: 'switch strict compare kabatti cases quotes lo ("6"). break lekapothe fall-through.',
      tests: [{ label: 'Log: Resolved - waiting for closure', logs: ['Resolved - waiting for closure'] }],
    }),
    jx('js-conditions', 4, 'Assignment decision (3 incidents)', 'hard', {
      task: 'INC0010001, INC0010004, INC0010006 query chey (addQuery number IN ..., orderBy number). Prathi record ki: assigned_to undi ayithe "<number>: Already assigned to <name>"; assigned_to ledu but group undi ayithe "<number>: Assign to group <group>"; rendu ledu ayithe "<number>: Send to triage". (name = getDisplayValue)',
      starter: `var gr = new GlideRecord('incident');
gr.addQuery('number', 'IN', 'INC0010001,INC0010004,INC0010006');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  var number = gr.getValue('number');
  // TODO: if assigned_to undi -> 'Already assigned to <name>'
  //       else if assignment_group undi -> 'Assign to group <group>'
  //       else -> 'Send to triage'
}
`,
      hint: "if (gr.getValue('assigned_to')) { gs.info(number + ': Already assigned to ' + gr.getDisplayValue('assigned_to')); } else if (...)",
      solution: `var gr = new GlideRecord('incident');
gr.addQuery('number', 'IN', 'INC0010001,INC0010004,INC0010006');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  var number = gr.getValue('number');
  if (gr.getValue('assigned_to')) {
    gs.info(number + ': Already assigned to ' + gr.getDisplayValue('assigned_to'));
  } else if (gr.getValue('assignment_group')) {
    gs.info(number + ': Assign to group ' + gr.getDisplayValue('assignment_group'));
  } else {
    gs.info(number + ': Send to triage');
  }
}`,
      explain: 'Empty field falsy kabatti if (gr.getValue(...)) = "value undi". Order important: most specific condition mundu.',
      tests: [
        {
          label: 'Three decisions',
          logs: ['INC0010001: Already assigned to System Administrator', 'INC0010004: Assign to group Database', 'INC0010006: Send to triage'],
        },
      ],
    }),
  ],
}

/* 7 — Loops */
const loops = {
  id: 'js-loops',
  title: 'JavaScript Loops',
  video: 'Javascript loops & Material',
  duration: '',
  blurb: 'while (gr.next()) — ServiceNow lo most important loop. for, for...in, break, continue.',
  learn: [
    {
      h: '🔁 while (gr.next()) — ServiceNow loop',
      body: [
        'GlideRecord query chesaka records meeda loop ki idi vaadatharu. gr.next() = next record ki veltundi, ledhante false. Prathi iteration lo gr lo current record fields chadavochu.',
        'query() marchipokandi — lekapothe loop eppudu run avvadu.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.query();
while (gr.next()) {
  gs.info(gr.getValue('number'));
}`,
    },
    {
      h: '🔢 for loop',
      body: [
        'Entha sarlu run avvalo teliste (leka array index kosam) for vaadatharu: for (start; condition; step). Integrations lo "retry 3 times" laanti vaatiki.',
      ],
      code: `for (var i = 1; i <= 3; i++) {
  gs.info('Retry ' + i);
}

var groups = ['Service Desk', 'Network'];
for (var j = 0; j < groups.length; j++) {
  gs.info(groups[j]);
}`,
    },
    {
      h: '🗝 for...in & forEach',
      body: [
        'for (var key in obj) = object keys meeda loop. array.forEach(function (item) { ... }) = array items meeda.',
      ],
      code: `var counts = { Network: 2, Database: 3 };
for (var team in counts) {
  gs.info(team + ': ' + counts[team]);
}`,
    },
    {
      h: '⏭ break & continue',
      body: [
        'break = loop ni aapestundi. continue = ee iteration skip chesi next ki veltundi. Records lo first match dorikaka aapadaniki break; resolved ones skip cheyyadaniki continue.',
      ],
      code: `while (gr.next()) {
  if (gr.getValue('active') === 'false') continue;   // skip
  if (gr.getValue('priority') === '1') {
    gs.info('Found: ' + gr.getValue('number'));
    break;                                           // stop
  }
}`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'Infinite loop: while (true) leka i++ marchipothe script aagadu (instance slow avtundi!). SnowKeer lo 3 sec tarvata aapestam, real instance lo transaction cancel avvali.',
        'Loop lo vere GlideRecord query chesthe slow (N+1 problem). Ideal ga okka query tho teesukovali.',
      ],
      code: `// getRowCount tho count teeskovachu — loop avasaram ledu
gr.query();
gs.info(gr.getRowCount());`,
    },
  ],
  quiz: [
    q('while (gr.next()) loop mundu em marchipokudadu?', ['gr.query()', 'gr.update()', 'gs.info()', 'break'], 0, 'query() lekapothe records load avvavu, loop run avvadu.'),
    q('continue em chestundi?', ['Ee iteration skip chesi next ki veltundi', 'Loop ni poorthiga aapestundi', 'Script anta aapestundi', 'Loop ni modati nundi malli start chestundi'], 0, 'continue = skip this iteration.'),
    q('for (var i = 1; i <= 3; i++) — entha sarlu run avtundi?', ['3', '2', '4', '1'], 0, 'i = 1, 2, 3 → 3 sarlu.'),
    q('Records entha unnayo chudadaniki loop lekunda?', ['gr.getRowCount()', 'gr.length', 'gr.count', 'gr.size()'], 0, 'query() tarvata getRowCount().'),
    q('for...in object meeda em istundi?', ['Prathi key', 'Prathi value', 'Index number', 'Array'], 0, 'for (var k in obj) k = key; value ki obj[k].'),
  ],
  exercises: [
    jx('js-loops', 1, 'Retry 3 times (for)', 'easy', {
      task: 'Integration retry simulate chey: for loop tho "Retry 1", "Retry 2", "Retry 3" log chey.',
      starter: `// TODO: for (var i = 1; i <= 3; i++) { ... }
`,
      hint: "for (var i = 1; i <= 3; i++) { gs.info('Retry ' + i); }",
      solution: `for (var i = 1; i <= 3; i++) {
  gs.info('Retry ' + i);
}`,
      explain: 'for (start; condition; step). i++ prathi sari 1 penchutundi.',
      tests: [{ label: 'Retry 1..3', logs: ['Retry 1', 'Retry 2', 'Retry 3'] }],
    }),
    jx('js-loops', 2, 'Active incidents count (while)', 'easy', {
      task: 'Active incidents query chesi, while (gr.next()) loop tho count++ chey. "Active incidents: 7" ani log chey. (Tarvata getRowCount() kuda same ani gamaninchu.)',
      starter: `var count = 0;

var gr = new GlideRecord('incident');
// TODO: addActiveQuery, query

// TODO: while (gr.next()) { count++; }

gs.info('Active incidents: ' + count);
`,
      hint: 'gr.addActiveQuery(); gr.query(); while (gr.next()) { count++; }',
      solution: `var count = 0;

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.query();

while (gr.next()) {
  count++;
}

gs.info('Active incidents: ' + count);`,
      explain: 'Loop tho count chesam. Real ga ayithe gr.getRowCount() simple (leka GlideAggregate).',
      tests: [
        { label: 'Log: Active incidents: 7', logs: ['Active incidents: 7'] },
        { label: 'count = getRowCount', expr: 'gr.getRowCount()', expect: 7 },
      ],
    }),
    jx('js-loops', 3, 'First unassigned P1 (continue & break)', 'medium', {
      task: 'Anni incidents (number tho order) loop chey. active = "false" ayithe continue. priority "1" AND assigned_to empty ayithe "First unassigned P1: <number>" log chesi break chey.',
      starter: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  // TODO: inactive ayithe continue
  // TODO: priority '1' && assigned_to empty -> log 'First unassigned P1: ' + number, then break
}
`,
      hint: "if (gr.getValue('active') === 'false') continue;",
      solution: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  if (gr.getValue('active') === 'false') {
    continue;
  }
  if (gr.getValue('priority') === '1' && !gr.getValue('assigned_to')) {
    gs.info('First unassigned P1: ' + gr.getValue('number'));
    break;
  }
}`,
      explain: 'continue inactive ones skip chestundi, break first match tarvata loop aapestundi (INC0010002 dorikindi, INC0010008 daka velladu).',
      tests: [{ label: 'Log: First unassigned P1: INC0010002', logs: ['First unassigned P1: INC0010002'] }],
    }),
    jx('js-loops', 4, 'Workload per assignee (for...in)', 'hard', {
      task: 'Active incidents (number tho order) loop chey. Prathi incident ki assigned_to display value teesuko (empty ayithe "Unassigned"). counts object lo +1 chey. Tarvata for...in tho "<name>: <count>" log chey.',
      starter: `var counts = {};

var gr = new GlideRecord('incident');
// TODO: addActiveQuery, orderBy number, query

// TODO: while loop: name = display value leka 'Unassigned'; counts[name] = (counts[name] || 0) + 1

// TODO: for (var name in counts) -> gs.info(name + ': ' + counts[name])
`,
      hint: "var name = gr.getDisplayValue('assigned_to') || 'Unassigned';",
      solution: `var counts = {};

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.orderBy('number');
gr.query();

while (gr.next()) {
  var name = gr.getDisplayValue('assigned_to') || 'Unassigned';
  counts[name] = (counts[name] || 0) + 1;
}

for (var n in counts) {
  gs.info(n + ': ' + counts[n]);
}`,
      explain: '|| tho default value ("Unassigned") — empty string falsy kabatti. Object counter + for...in = group-by laaga.',
      tests: [{ label: 'Workload', logs: ['System Administrator: 3', 'Unassigned: 4'] }],
    }),
  ],
}

/* 8 — Functions */
const functions = {
  id: 'js-functions',
  title: 'JavaScript Functions',
  video: 'Javascript functions & Material',
  duration: '',
  blurb: 'Reusable helpers, return values, Script Include (Class.create) style.',
  learn: [
    {
      h: '🧩 Function = reusable code',
      body: [
        'Same code malli malli rayakunda function lo petti, peru tho call chestam. Parameters = input, return = output.',
        'Script Includes, Business Rules lo helper functions chala untayi: getPriorityLabel(p), isActiveState(s).',
      ],
      code: `function getPriorityLabel(p) {
  if (p == 1) return 'Critical';
  if (p == 2) return 'High';
  return 'Low';
}
gs.info(getPriorityLabel(2));   // High`,
    },
    {
      h: '↩️ return — marchipokandi!',
      body: [
        'return lekapothe function undefined istundi. return tarvata inka code run avvadu (function akkade aipotundi).',
        'Variables function lopala declare chesthe (var), aa function lo matrame untayi (local scope).',
      ],
      code: `function double(n) {
  var result = n * 2;   // local
  return result;
}
gs.info(double(5));     // 10
// gs.info(result);     <- error: function bayata ledu`,
    },
    {
      h: '🗄 GlideRecord tho function',
      body: [
        'Query logic ni function lo petti reuse chey. Parameters tho query condition marchochu.',
      ],
      code: `function getCount(category) {
  var gr = new GlideRecord('incident');
  gr.addActiveQuery();
  gr.addQuery('category', category);
  gr.query();
  return gr.getRowCount();
}
gs.info(getCount('network'));`,
    },
    {
      h: '🏛 Script Include (Class.create)',
      body: [
        'Real ServiceNow lo reusable server code "Script Include" lo untundi. Classic style: Class.create() + prototype lo methods. initialize = constructor. Dani nundi new MyUtils().method() tho call chestam.',
        'Script Include peru = class peru exact ga undali.',
      ],
      code: `var IncidentUtils = Class.create();
IncidentUtils.prototype = {
  initialize: function () {},

  getP1Count: function () {
    var gr = new GlideRecord('incident');
    gr.addActiveQuery();
    gr.addQuery('priority', 1);
    gr.query();
    return gr.getRowCount();
  },

  type: 'IncidentUtils'
};
gs.info(new IncidentUtils().getP1Count());`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'Function ni call cheyyadam marchipokandi: getCount (reference) vs getCount("network") (call).',
        'Parameter ga vache values string leka number kavachu — Number(x) tho marchi compare chey (lesson 1 gotcha).',
      ],
      code: `function isP1(p) {
  return Number(p) === 1;     // '1' kuda 1 kuda work avtayi
}
gs.info(isP1('1'));   // true
gs.info(isP1(1));     // true`,
    },
  ],
  quiz: [
    q('function f() { var x = 1; } gs.info(f()); — em print avtundi?', ['undefined', '1', 'null', 'Error'], 0, 'return ledu → undefined.'),
    q('Script Include lo constructor method peru?', ['initialize', 'constructor', 'init', 'create'], 0, 'Classic Script Include: initialize: function () {}.'),
    q('function double(n) { return n * 2; } — double(4)?', ['8', '4', '"44"', 'undefined'], 0, 'return n * 2 = 8.'),
    q('Function lo var x declare chesthe x ekkada kanipistundi?', ['Aa function lo matrame', 'Anni scripts lo', 'Script Include lo anni', 'Em kaadu'], 0, 'var function-scoped (local).'),
    q('new IncidentUtils().getP1Count() lo IncidentUtils ekkada define avutundi?', ['Script Include lo', 'Dictionary lo', 'UI Policy lo', 'Update Set lo matrame'], 0, 'Server-side reusable classes = Script Includes.'),
  ],
  exercises: [
    jx('js-functions', 1, 'getPriorityLabel(p)', 'easy', {
      task: 'getPriorityLabel(p) function rayyi: 1 → "1 - Critical", 2 → "2 - High", 3 → "3 - Moderate", 4 → "4 - Low", ledhante "Unknown". String leka number ela vachina work avvali (Number(p) vaadu). return marchipoku!',
      starter: `function getPriorityLabel(p) {
  // TODO: Number(p) batti label return chey
}
`,
      hint: 'switch (Number(p)) { case 1: return "1 - Critical"; ... default: return "Unknown"; }',
      solution: `function getPriorityLabel(p) {
  switch (Number(p)) {
    case 1: return '1 - Critical';
    case 2: return '2 - High';
    case 3: return '3 - Moderate';
    case 4: return '4 - Low';
    default: return 'Unknown';
  }
}`,
      explain: 'Number(p) tho string/number rendu handle chesam. return tho value bayataki istam.',
      tests: [
        { label: 'getPriorityLabel(1)', expr: 'getPriorityLabel(1)', expect: '1 - Critical' },
        { label: 'getPriorityLabel("4")', expr: "getPriorityLabel('4')", expect: '4 - Low' },
        { label: 'getPriorityLabel(9)', expr: 'getPriorityLabel(9)', expect: 'Unknown' },
      ],
    }),
    jx('js-functions', 2, 'isActiveState(state)', 'easy', {
      task: 'isActiveState(state) function rayyi: state 1, 2, 3 (New, In Progress, On Hold) ayithe true, 6 / 7 / 8 (Resolved, Closed, Canceled) ayithe false return chey. String ayina number ayina work avvali.',
      starter: `function isActiveState(state) {
  // TODO: true / false return chey
}
`,
      hint: 'return Number(state) <= 3;',
      solution: `function isActiveState(state) {
  return Number(state) <= 3;
}`,
      explain: 'Comparison ye boolean — direct ga return cheyochu (if/else avasaram ledu).',
      tests: [
        { label: 'states 1, "2", 3 → true', expr: "[isActiveState(1), isActiveState('2'), isActiveState(3)]", expect: [true, true, true] },
        { label: 'states 6, "7", 8 → false', expr: "[isActiveState(6), isActiveState('7'), isActiveState(8)]", expect: [false, false, false] },
      ],
    }),
    jx('js-functions', 3, 'getIncidentCount(category)', 'medium', {
      task: 'getIncidentCount(category) function: aa category lo ACTIVE incidents count return chey (GlideRecord, addActiveQuery, addQuery, getRowCount).',
      starter: `function getIncidentCount(category) {
  // TODO: GlideRecord query chesi count return chey
}
`,
      hint: "var gr = new GlideRecord('incident'); gr.addActiveQuery(); gr.addQuery('category', category); gr.query(); return gr.getRowCount();",
      solution: `function getIncidentCount(category) {
  var gr = new GlideRecord('incident');
  gr.addActiveQuery();
  gr.addQuery('category', category);
  gr.query();
  return gr.getRowCount();
}`,
      explain: 'Query logic function lo petti parameter tho reuse chesam. INC0010005 (inquiry) resolved/inactive kabatti inquiry count 0.',
      tests: [
        { label: 'network → 2', expr: "getIncidentCount('network')", expect: 2 },
        { label: 'database → 2', expr: "getIncidentCount('database')", expect: 2 },
        { label: 'inquiry → 0', expr: "getIncidentCount('inquiry')", expect: 0 },
      ],
    }),
    jx('js-functions', 4, 'IncidentUtils Script Include', 'hard', {
      task: 'IncidentUtils ane Script Include style class (Class.create) rayyi. Methods: 1) isP1(number) → aa incident priority 1 aa true/false. 2) getOpenCountForGroup(groupName) → aa group (peru tho) ki assign ayina ACTIVE incidents count (mundu sys_user_group lo name tho sys_id teesuko, tarvata incident query). 3) type: "IncidentUtils".',
      starter: `var IncidentUtils = Class.create();
IncidentUtils.prototype = {
  initialize: function () {},

  isP1: function (number) {
    // TODO: incident get chesi priority === '1' return chey
  },

  getOpenCountForGroup: function (groupName) {
    // TODO: group sys_id teesuko, tarvata active incidents count return chey
  },

  type: 'IncidentUtils'
};
`,
      hint: "Group: var g = new GlideRecord('sys_user_group'); g.get('name', groupName); g.getUniqueValue() = sys_id.",
      solution: `var IncidentUtils = Class.create();
IncidentUtils.prototype = {
  initialize: function () {},

  isP1: function (number) {
    var gr = new GlideRecord('incident');
    if (!gr.get('number', number)) {
      return false;
    }
    return gr.getValue('priority') === '1';
  },

  getOpenCountForGroup: function (groupName) {
    var grp = new GlideRecord('sys_user_group');
    if (!grp.get('name', groupName)) {
      return 0;
    }
    var inc = new GlideRecord('incident');
    inc.addActiveQuery();
    inc.addQuery('assignment_group', grp.getUniqueValue());
    inc.query();
    return inc.getRowCount();
  },

  type: 'IncidentUtils'
};`,
      explain: 'gr.get() true/false istundi — record dorikapothe safe ga return chesam. Reference field lo sys_id untundi kabatti group sys_id tho query chesam.',
      tests: [
        { label: 'isP1: INC0010008 true, INC0010003 false', expr: "[new IncidentUtils().isP1('INC0010008'), new IncidentUtils().isP1('INC0010003')]", expect: [true, false] },
        { label: 'isP1: unknown number → false', expr: "new IncidentUtils().isP1('INC9999999')", expect: false },
        { label: 'Database group → 2 active', expr: "new IncidentUtils().getOpenCountForGroup('Database')", expect: 2 },
        { label: 'Unknown group → 0', expr: "new IncidentUtils().getOpenCountForGroup('Nope')", expect: 0 },
        { label: 'type', expr: 'new IncidentUtils().type', expect: 'IncidentUtils' },
      ],
    }),
  ],
}

export const LESSONS_JS_C = [conditions, loops, functions]
