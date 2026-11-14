// Stage 2 · JavaScript (part 3): conditions, loops, functions — all ServiceNow scenarios.
import { q, jx } from './lessonKit.js'

// extra practice row for loop tests: a CLOSED, unassigned P1 that sorts before every other incident
const OLD_P1 = { number: 'INC0010000', short_description: 'Old P1 outage (closed)', priority: '1', impact: '1', urgency: '1', state: '7', active: 'false', category: 'network' }

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
        'Condition lo boolean kakapoyina vaadochu. Falsy: "" (empty string), 0, null, undefined, NaN, false. Migatavi truthy — "0", "false" laanti non-empty strings kuda truthy!',
        'Nee PDI lo rendu special cases (check chesam): (1) empty array [] FALSY (normal JavaScript lo truthy) — array empty aa ani arr.length === 0 tho check chey. (2) GlideElement (gr.assigned_to) value batti: empty field falsy, value unte truthy, false boolean field falsy.',
        '⚠️ Ee sandbox (browser) GlideElement ni falsy cheyyaledu — ikkada if (gr.assigned_to) eppudu true. Anduke safe habit: gr.assigned_to.nil() leka gs.nil(gr.assigned_to) — PDI lo, ikkada rendu chotla correct. getValue() kuda safe: empty field ki null (falsy) istundi.',
      ],
      code: `if (gr.assigned_to.nil()) {            // ✅ safe — PDI lo, sandbox lo
  gs.info('Unassigned');
}
if (!gr.getValue('assigned_to')) {     // ✅ empty → null → falsy
  gs.info('Unassigned');
}
// if (!gr.assigned_to) { ... }        // PDI lo pani chestundi, sandbox lo kaadu — .nil() vaadu

var ids = [];
if (ids.length === 0) {                // ✅ array empty check — length tho
  gs.info('Records levu');
}`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'if (x = 1) lo = assignment (marchestundi!), compare kaadu. Compare ki == leka === vaadu.',
        'getValue string. switch strict comparison (===) vaadutundi — case 1 vs "1" match avvavu. Anduke case \'1\' ani quotes lo rayali.',
        'True/false field: getValue("active") "1" / "0" istundi — getValue("active") === "true" EPPUDU false! getValue("active") === "1" leka gr.active == true vaadu.',
      ],
      code: `var s = gr.getValue('state');   // '2'
switch (s) {
  case 2: gs.info('number case'); break;      // match avvadu!
  case '2': gs.info('string case'); break;    // match avtundi
}

if (gr.getValue('active') === 'true') { }    // ❌ eppudu false — '1' / '0' vastundi
if (gr.getValue('active') === '1') { }       // ✅ active
if (gr.active == true) { }                   // ✅ active (== tho)`,
    },
  ],
  quiz: [
    q('switch lo break marchipothe emavtundi?', ['Next case code kuda run avtundi', 'Error vastundi, script aagipotundi', 'Default case matrame run avtundi', 'Emi kaadu, normal ga break avtundi'], 0, 'break lekunda next cases kuda run avtayi (fall-through).'),
    q('var s = "2"; switch (s) { case 2: ... } — case 2 match avtunda?', ['Avvadu', 'Avtundi', 'Error vastundi', 'Rendu cases run avtayi'], 0, 'switch strict (===) compare chestundi — "2" !== 2, kabatti match avvadu. Cases quotes lo rayali.'),
    q('Edi falsy kaadu?', ['"0" (string zero)', '"" (empty string)', '0 (number zero)', 'null (value ledu)'], 0, '"0" non-empty string kabatti truthy. (getValue("active") inactive ki "0" istundi — adi kuda truthy!)'),
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
      variants: [
        {
          name: 'priority 3 ayithe',
          scenario: { current: { table: 'incident', values: { priority: '3' } } },
          tests: [{ label: 'Log: Normal queue', logs: ['Normal queue'] }],
        },
      ],
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
      explain: 'Priority 4 → Low (else). Mundu match ayina branch matrame run. p === 1 (number) ani rasthe ye branch match avvadu — anni "Low" avtayi!',
      tests: [{ label: 'Log: Low', logs: ['Low'] }],
      variants: [
        {
          name: 'priority 1',
          scenario: { seed: { incident: [{ sys_id: 'inc3', priority: '1' }] } },
          tests: [{ label: 'Log: Critical', logs: ['Critical'] }],
        },
        {
          name: 'priority 2',
          scenario: { seed: { incident: [{ sys_id: 'inc3', priority: '2' }] } },
          tests: [{ label: 'Log: High', logs: ['High'] }],
        },
        {
          name: 'priority 3',
          scenario: { seed: { incident: [{ sys_id: 'inc3', priority: '3' }] } },
          tests: [{ label: 'Log: Moderate', logs: ['Moderate'] }],
        },
      ],
    }),
    // ---- Ladder (array order = doing order): 7 → 3 practise switch, 5 → 6 build up to 'Assignment decision (3 incidents)' ----
    jx('js-conditions', 7, 'Category tho team pick chey (switch)', 'medium', {
      task: 'INC0010002 teesuko, category getValue. switch tho: "network" → "Network team", "database" → "DB team", default → "Service Desk". team ni log chey. break marchipoku! 🧰 Vaade words: getValue(), switch / case / break / default',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var category = gr.getValue('category');

var team;
// TODO: switch (category) { case 'network': team = ...; break; ... default: ... }

gs.info(team);
`,
      hint: [
        'Okka value ni chala options tho compare cheyyali — switch. Prathi case ki break, last lo default.',
        'switch (category) { case "network": team = "Network team"; break; case "database": ... default: ... }',
        'default lo team = "Service Desk"; — break avasaram ledu (last kabatti).',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var category = gr.getValue('category');

var team;
switch (category) {
  case 'network':
    team = 'Network team';
    break;
  case 'database':
    team = 'DB team';
    break;
  default:
    team = 'Service Desk';
}

gs.info(team);`,
      explain: 'switch lo cases quotes lo (strings). break lekapothe next case kuda run avtundi (fall-through).',
      tests: [
        { label: 'Log: Network team', logs: ['Network team'] },
        { label: 'team = Network team', expr: 'team', expect: 'Network team' },
      ],
      variants: [
        {
          name: 'category database',
          scenario: { seed: { incident: [{ sys_id: 'inc2', category: 'database' }] } },
          tests: [{ label: 'Log: DB team', logs: ['DB team'] }],
        },
        {
          name: 'category hardware (default)',
          scenario: { seed: { incident: [{ sys_id: 'inc2', category: 'hardware' }] } },
          tests: [{ label: 'Log: Service Desk', logs: ['Service Desk'] }],
        },
      ],
    }),
    jx('js-conditions', 3, 'State message (switch)', 'medium+', {
      task: 'INC0010005 state teesuko (string) — practice data lo idi Closed incident. switch tho: "1" → New, "2" → In Progress, "3" → On Hold, "6" → Resolved - waiting for closure, "7" → Closed, default → Other. Message ni msg lo petti log chey. break marchipoku!',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010005');
var state = gr.getValue('state');

var msg;
// TODO: switch (state) { case '1': ... }

gs.info(msg);
`,
      hint: [
        'Oka value (state) ni chala options tho compare — switch. Prathi case lo msg set chesi break pettu, last lo default.',
        'switch (state) { case "1": msg = "New"; break; case "2": ... } — state string kabatti cases kuda quotes lo.',
        "case '6': msg = 'Resolved - waiting for closure'; break;   case '7': msg = 'Closed'; break;   default: msg = 'Other';",
      ],
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
  case '7':
    msg = 'Closed';
    break;
  default:
    msg = 'Other';
}

gs.info(msg);`,
      explain: 'switch strict compare kabatti cases quotes lo ("7"). break lekapothe fall-through — case "6" lo break marchipothe Resolved record ki kuda "Closed" vastundi. Nee PDI lo Resolved (6) incident inka active = true; Closed (7) ayyaka matrame active = false avtundi (check chesam) — INC0010005 Closed, anduke inactive.',
      tests: [
        { label: 'Log: Closed', logs: ['Closed'] },
        { label: 'msg = Closed', expr: 'msg', expect: 'Closed' },
      ],
      variants: [
        { name: 'state 1', scenario: { seed: { incident: [{ sys_id: 'inc5', state: '1', active: 'true' }] } }, tests: [{ label: 'Log: New', logs: ['New'] }] },
        { name: 'state 2', scenario: { seed: { incident: [{ sys_id: 'inc5', state: '2', active: 'true' }] } }, tests: [{ label: 'Log: In Progress', logs: ['In Progress'] }] },
        { name: 'state 3', scenario: { seed: { incident: [{ sys_id: 'inc5', state: '3', active: 'true' }] } }, tests: [{ label: 'Log: On Hold', logs: ['On Hold'] }] },
        { name: 'state 6 (Resolved)', scenario: { seed: { incident: [{ sys_id: 'inc5', state: '6', active: 'true' }] } }, tests: [{ label: 'Log: Resolved - waiting for closure', logs: ['Resolved - waiting for closure'] }] },
        { name: 'state 8 (Canceled → default)', scenario: { seed: { incident: [{ sys_id: 'inc5', state: '8' }] } }, tests: [{ label: 'Log: Other', logs: ['Other'] }] },
      ],
    }),
    jx('js-conditions', 5, 'Assigned aa? (empty = falsy)', 'medium+', {
      task: 'INC0010006 teesuko (idi unassigned). Assigned_to undaa ani check chey (getValue — empty ki null istundi — leka .nil()): undi ayithe "Assigned", lekapothe "Unassigned" ani log chey. 🧰 Vaade words: GlideRecord, get(), getValue(), nil(), if / else',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010006');

// getValue() empty field ki null istundi (falsy); value unte sys_id string (truthy)
// TODO: assigned_to undi ayithe 'Assigned', lekapothe 'Unassigned' log chey
`,
      hint: [
        'Value undaa ledaa check cheyyadaniki condition lo getValue ni direct ga pettochu — null ayithe false.',
        'if (gr.getValue("assigned_to")) { ... } else { ... }   — leka if (gr.assigned_to.nil()) tho ulta order.',
        'if (gr.getValue("assigned_to")) { gs.info("Assigned"); } else { gs.info("Unassigned"); }',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010006');

if (gr.getValue('assigned_to')) {
  gs.info('Assigned');
} else {
  gs.info('Unassigned');
}`,
      explain: 'Empty field ki getValue null istundi (falsy) → else. if (gr.assigned_to.nil()) kuda correct. (if (gr.assigned_to) nee PDI lo pani chestundi, kani ee sandbox lo eppudu true — anduke getValue / .nil() habit.) "Assignment decision (3 incidents)" lo idi main condition.',
      tests: [{ label: 'Log: Unassigned', logs: ['Unassigned'] }],
      variants: [
        {
          name: 'INC0010006 ki Beth assign ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc6', assigned_to: 'u_beth' }] } },
          tests: [{ label: 'Log: Assigned', logs: ['Assigned'] }],
        },
      ],
    }),
    jx('js-conditions', 6, 'Group fallback (else if)', 'medium+', {
      task: 'INC0010004 teesuko (assigned_to ledu, group undi). assigned_to undi ayithe "Assigned to <name>"; lekapothe group undi ayithe "Assign to group <group>"; rendu ledu ayithe "Send to triage". Names ki getDisplayValue vaadu. 🧰 Vaade words: getValue(), getDisplayValue(), if / else if / else',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

// TODO: if assigned_to undi -> 'Assigned to <name>'
//       else if assignment_group undi -> 'Assign to group <group>'
//       else -> 'Send to triage'
`,
      hint: [
        'Moodu paths: assigned_to undi → ok; ledu but group undi → group ki pampu; rendu ledu → triage. Most specific condition mundu.',
        'if (gr.getValue("assigned_to")) {...} else if (gr.getValue("assignment_group")) {...} else {...}. Peru kosam getDisplayValue.',
        'gs.info("Assign to group " + gr.getDisplayValue("assignment_group"));',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

if (gr.getValue('assigned_to')) {
  gs.info('Assigned to ' + gr.getDisplayValue('assigned_to'));
} else if (gr.getValue('assignment_group')) {
  gs.info('Assign to group ' + gr.getDisplayValue('assignment_group'));
} else {
  gs.info('Send to triage');
}`,
      explain: 'if / else if / else chain: mundu match ayina branch matrame run avtundi. "Assignment decision (3 incidents)" lo ide loop lo 3 incidents ki chestam.',
      tests: [{ label: 'Log: Assign to group Database', logs: ['Assign to group Database'] }],
      variants: [
        {
          name: 'INC0010004 ki Bud assign ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc4', assigned_to: 'u_bud' }] } },
          tests: [{ label: 'Log: Assigned to Bud Richman', logs: ['Assigned to Bud Richman'] }],
        },
        {
          name: 'group kuda lekapothe',
          scenario: { seed: { incident: [{ sys_id: 'inc4', assignment_group: '' }] } },
          tests: [{ label: 'Log: Send to triage', logs: ['Send to triage'] }],
        },
      ],
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
      hint: [
        'Records meeda loop (while gr.next()). Prathi record ki moodu paths — "Group fallback (else if)" lo chesav: assigned → group → triage.',
        'Most specific condition mundu: if (gr.getValue("assigned_to")) ... else if (gr.getValue("assignment_group")) ... else ...  Names ki getDisplayValue.',
        "if (gr.getValue('assigned_to')) { gs.info(number + ': Already assigned to ' + gr.getDisplayValue('assigned_to')); } else if (...)",
      ],
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
      explain: 'Empty field ki getValue null (falsy) kabatti if (gr.getValue(...)) = "value undi". Order important: most specific condition mundu.',
      tests: [
        {
          label: 'Three decisions',
          logs: ['INC0010001: Already assigned to System Administrator', 'INC0010004: Assign to group Database', 'INC0010006: Send to triage'],
        },
      ],
      variants: [
        {
          name: 'INC0010004 ki Beth, INC0010006 ki Network group',
          scenario: { seed: { incident: [{ sys_id: 'inc4', assigned_to: 'u_beth' }, { sys_id: 'inc6', assignment_group: 'g_net' }] } },
          tests: [
            {
              label: 'Three decisions (marina data)',
              logs: ['INC0010001: Already assigned to System Administrator', 'INC0010004: Already assigned to Beth Anglin', 'INC0010006: Assign to group Network'],
            },
          ],
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
        '⚠️ for…of (for (var x of arr)) nee PDI Background Script lo (ES12 mode lekunda) SyntaxError (check chesam) — array ki normal for leka forEach vaadu.',
      ],
      code: `var counts = { Network: 2, Database: 3 };
for (var team in counts) {
  gs.info(team + ': ' + counts[team]);
}`,
    },
    {
      h: '⏭ break & continue',
      body: [
        'break = loop ni aapestundi. continue = ee iteration skip chesi next ki veltundi. Records lo first match dorikaka aapadaniki break; inactive / resolved ones skip cheyyadaniki continue.',
        'Gurtu: true/false field ki getValue "1" / "0" istundi — getValue("active") === "false" ani rasthe eppudu match avvadu!',
      ],
      code: `while (gr.next()) {
  if (gr.getValue('active') === '0') continue;       // inactive → skip
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
        '⚠️ addQuery lo field peru tappu rasthe (e.g. "categry") error raadu — nee PDI aa condition ni IGNORE chesi ANNI records istundi (check chesam). Loop lo update() / deleteRecord() unte mundu getRowCount() chusi confirm chey.',
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
      explain: 'for (start; condition; step). i++ prathi sari 1 penchutundi. i = 4 ayinappudu i <= 3 false — loop aagutundi.',
      tests: [
        { label: 'Retry 1..3', logs: ['Retry 1', 'Retry 2', 'Retry 3'] },
        { label: 'for loop (var i) run ayyindi — loop tarvata i = 4', expr: 'i', expect: 4 },
      ],
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
        { label: 'count = 7 (getRowCount tho same)', expr: '[count, gr.getRowCount()]', expect: [7, 7] },
      ],
      variants: [
        {
          name: 'inko active + oka closed incident',
          scenario: {
            seed: {
              incident: [
                { number: 'INC0010009', short_description: 'Laptop battery swollen', state: '1', category: 'hardware' },
                { number: 'INC0010010', short_description: 'Old ticket (closed)', state: '7', active: 'false' },
              ],
            },
          },
          tests: [{ label: 'Log: Active incidents: 8', logs: ['Active incidents: 8'] }],
        },
      ],
    }),
    // ---- Ladder (array order = doing order): one new idea at a time, building up to 'Workload per assignee' ----
    jx('js-loops', 5, 'Array meeda for loop (index)', 'medium', {
      task: 'groups = ["Service Desk", "Network", "Database"] undi. for loop tho (i = 0 nundi groups.length varaku) prathi group ni "1. Service Desk", "2. Network", "3. Database" laaga log chey. 🧰 Vaade words: for, groups.length, groups[i]',
      starter: `var groups = ['Service Desk', 'Network', 'Database'];

// Index 0 nundi start avtundi: groups[0] = 'Service Desk'
// TODO: for loop rayyi (i = 0 nundi groups.length varaku), lopala "1. Service Desk" laaga log chey
`,
      hint: [
        'Array lo prathi item ki okasari run avvali — for loop. Start 0, end groups.length mundu varaku.',
        'for (var i = 0; i < groups.length; i++) { ... } — lopala groups[i] vaadu.',
        'gs.info((i + 1) + ". " + groups[i]);   — (i + 1) endukante i 0 nundi start.',
      ],
      solution: `var groups = ['Service Desk', 'Network', 'Database'];

for (var i = 0; i < groups.length; i++) {
  gs.info((i + 1) + '. ' + groups[i]);
}`,
      explain: 'Arrays index 0 nundi start; i < groups.length tho last item varaku velthundi. "Retry 3 times (for)" lo number loop chesav, ikkada array index loop.',
      tests: [
        { label: 'Logs: 1. Service Desk, 2. Network, 3. Database', logs: ['1. Service Desk', '2. Network', '3. Database'] },
        { label: 'for loop (var i) groups.length varaku — loop tarvata i = 3', expr: 'i', expect: 3 },
      ],
    }),
    jx('js-loops', 6, 'P1 active count (while + addQuery)', 'medium+', {
      task: 'Active & priority 1 incidents query chey. while (gr.next()) tho count++ chey. "P1 active: 2" ani log chey. 🧰 Vaade words: GlideRecord, addActiveQuery(), addQuery(), query(), next()',
      starter: `var count = 0;

var gr = new GlideRecord('incident');
// TODO: addActiveQuery(), addQuery('priority', 1), query()

// TODO: while (gr.next()) { count++; }

gs.info('P1 active: ' + count);
`,
      hint: [
        'Lesson lo Active incidents count laage — kotha idea okkate: query ki priority filter kuda add chey.',
        'Query lo addActiveQuery tho patu addQuery("priority", 1) kuda pettu, tarvata query() — count loop already ready.',
        'gr.addActiveQuery(); gr.addQuery("priority", 1); gr.query(); while (gr.next()) { count++; }',
      ],
      solution: `var count = 0;

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addQuery('priority', 1);
gr.query();

while (gr.next()) {
  count++;
}

gs.info('P1 active: ' + count);`,
      explain: 'Filter (query) mundu set chesthe loop lo if avasaram ledu. Database already filter chestundi.',
      tests: [
        { label: 'Log: P1 active: 2', logs: ['P1 active: 2'] },
        { label: 'count = 2', expr: 'count', expect: 2 },
      ],
      variants: [
        {
          name: 'inko active P1 + oka closed P1',
          scenario: {
            seed: {
              incident: [
                { number: 'INC0010009', short_description: 'Core switch down', priority: '1', state: '2', category: 'network' },
                { number: 'INC0010010', short_description: 'Old outage (closed)', priority: '1', state: '7', active: 'false' },
              ],
            },
          },
          tests: [{ label: 'Log: P1 active: 3', logs: ['P1 active: 3'] }],
        },
      ],
    }),
    jx('js-loops', 7, 'First P1 dorikaka aapu (break)', 'medium+', {
      task: 'Anni incidents (number tho order) loop chey. priority "1" ayithe "First P1: <number>" ani log chesi break chey — migilina records chudakunda aapali. 🧰 Vaade words: while (gr.next()), getValue(), break',
      starter: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  // TODO: if priority '1' -> log 'First P1: ' + number, then break
}
`,
      hint: [
        'Pani ayyaka loop aapali — adi edaina keyword tho. Condition: priority === "1" (string).',
        'if (gr.getValue("priority") === "1") { ... break; }',
        'gs.info("First P1: " + gr.getValue("number")); break;',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  if (gr.getValue('priority') === '1') {
    gs.info('First P1: ' + gr.getValue('number'));
    break;
  }
}`,
      explain: 'break loop ni immediately aapestundi. break lekapothe INC0010008 kuda log avtundi. "First unassigned P1 (continue & break)" lo continue tho kalipi vaadatham.',
      tests: [{ label: 'Log (okkate): First P1: INC0010002', logs: ['First P1: INC0010002'] }],
      variants: [
        {
          name: 'INC0010001 kuda P1 ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc1', priority: '1' }] } },
          tests: [{ label: 'Log (okkate): First P1: INC0010001', logs: ['First P1: INC0010001'] }],
        },
      ],
    }),
    jx('js-loops', 3, 'First unassigned P1 (continue & break)', 'medium+', {
      scenario: { seed: { incident: [OLD_P1] } },
      task: 'Anni incidents (number tho order) loop chey. Inactive ayithe continue (true/false field ki getValue "1" / "0" istundi). priority "1" AND assigned_to empty ayithe "First unassigned P1: <number>" log chesi break chey. (Data lo INC0010000 = closed, unassigned P1 — adi skip avvali.)',
      starter: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  // TODO: inactive ayithe continue
  // TODO: priority '1' && assigned_to empty -> log 'First unassigned P1: ' + number, then break
}
`,
      hint: [
        'Loop lo rendu control keywords kavali: inactive ni skip cheyyadaniki oka keyword, match dorikaka aapadaniki inkoka keyword ("First P1 dorikaka aapu" lo break chesav).',
        'Inactive check: getValue("active") "0" istundi ("false" kaadu!) → if (gr.getValue("active") === "0") { continue; }. Tarvata priority "1" && assigned_to empty check.',
        "if (gr.getValue('active') === '0') { continue; }   if (gr.getValue('priority') === '1' && !gr.getValue('assigned_to')) { gs.info('First unassigned P1: ' + gr.getValue('number')); break; }",
      ],
      solution: `var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  if (gr.getValue('active') === '0') {
    continue;
  }
  if (gr.getValue('priority') === '1' && !gr.getValue('assigned_to')) {
    gs.info('First unassigned P1: ' + gr.getValue('number'));
    break;
  }
}`,
      explain: 'continue inactive ones skip chestundi (INC0010000 — closed P1), break first match tarvata loop aapestundi. getValue("active") === "false" ani rasthe eppudu match avvadu (PDI "0" istundi) — closed P1 ne pattukuntundi! gr.active == false kuda correct.',
      tests: [{ label: 'Log: First unassigned P1: INC0010002 (closed INC0010000 skip)', logs: ['First unassigned P1: INC0010002'] }],
      variants: [
        {
          name: 'INC0010008 kuda unassigned (break test)',
          scenario: { seed: { incident: [OLD_P1, { sys_id: 'inc8', assigned_to: '' }] } },
          tests: [{ label: 'Log (okkate): First unassigned P1: INC0010002', logs: ['First unassigned P1: INC0010002'] }],
        },
        {
          name: 'INC0010002 assigned, INC0010008 unassigned',
          scenario: { seed: { incident: [OLD_P1, { sys_id: 'inc2', assigned_to: 'u_abel' }, { sys_id: 'inc8', assigned_to: '' }] } },
          tests: [{ label: 'Log: First unassigned P1: INC0010008', logs: ['First unassigned P1: INC0010008'] }],
        },
        {
          name: 'INC0010002 P3 ayithe',
          scenario: { seed: { incident: [OLD_P1, { sys_id: 'inc2', priority: '3' }, { sys_id: 'inc8', assigned_to: '' }] } },
          tests: [{ label: 'Log: First unassigned P1: INC0010008', logs: ['First unassigned P1: INC0010008'] }],
        },
      ],
    }),
    jx('js-loops', 4, 'Workload per assignee (for...in)', 'hard', {
      task: 'Active incidents (number tho order) loop chey. Prathi incident ki assigned_to display value teesuko (empty ayithe "Unassigned"). counts object lo +1 chey. Tarvata for...in tho "<name>: <count>" log chey.',
      starter: `var counts = {};

var gr = new GlideRecord('incident');
// TODO: active incidents, number order, query

// TODO: while loop — prathi incident ki assignee peru (empty ayithe 'Unassigned'), counts lo aa peru count + 1

// TODO: for...in tho prathi peru, count log chey ('<name>: <count>')
`,
      hint: [
        'Rendu loops: (1) while (gr.next()) tho counts object build chey, (2) for...in tho counts print chey. Counter pattern: (counts[name] || 0) + 1.',
        'Peru kosam getDisplayValue("assigned_to") — empty ayithe "" istundi (falsy), kabatti || "Unassigned" tho default pettochu.',
        "var name = gr.getDisplayValue('assigned_to') || 'Unassigned';   counts[name] = (counts[name] || 0) + 1;   — tarvata for (var n in counts) { gs.info(n + ': ' + counts[n]); }",
      ],
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
      explain: '|| tho default value ("Unassigned") — getDisplayValue empty reference ki "" istundi (falsy; nee PDI lo check chesam). Object counter + for...in = group-by laaga.',
      tests: [
        { label: 'Workload', logs: ['System Administrator: 3', 'Unassigned: 4'] },
        { label: 'counts object', expr: 'JSON.stringify(counts)', expect: '{"System Administrator":3,"Unassigned":4}' },
      ],
      variants: [
        {
          name: 'INC0010002 Beth ki assign ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc2', assigned_to: 'u_beth' }] } },
          tests: [{ label: 'Workload (Beth tho)', logs: ['System Administrator: 3', 'Beth Anglin: 1', 'Unassigned: 3'] }],
        },
      ],
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
        'Script Include peru = class peru exact ga undali. Methods lopala this = aa object (Objects lesson lo "this" card) — initialize lo this.x = ... save chesi, migatha methods lo this.x tho chaduvutam.',
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
        'Default parameter value (function f(p = 1)) nee PDI Background Script lo (ES12 mode lekunda) SyntaxError (check chesam) — lopala p = p || 1 ani rayi.',
        '⚠️ Typos: function peru tappu (getCont("network")) → ReferenceError: "getCont" is not defined. Kani METHOD peru tappu (gr.getvalue("priority")) ayithe nee PDI lo error RAADU — silent ga undefined vastundi (check chesam). Result undefined vachinappudu mundu spelling chudu. (Ee sandbox typo kanipinchali ani error chupistundi.)',
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
      hint: [
        'Function ki p vastundi (string leka number). Mundu adi number ga marchu, tarvata value batti label return chey.',
        'switch (Number(p)) { case 1: return ...; case 2: return ...; } — default lo "Unknown".',
        'switch (Number(p)) { case 1: return "1 - Critical"; ... default: return "Unknown"; }',
      ],
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
        { label: 'getPriorityLabel("2"), getPriorityLabel(3)', expr: "[getPriorityLabel('2'), getPriorityLabel(3)]", expect: ['2 - High', '3 - Moderate'] },
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
      explain: 'Comparison ye boolean — direct ga return cheyochu (if/else avasaram ledu). Gurtu: idi "pani inka jarugutunda?" ane mana sontha rule — record lo active FIELD kaadu. Nee PDI lo Resolved (6) incident ki active = true ne untundi; Closed (7) ayyaka matrame active = false (check chesam).',
      tests: [
        { label: 'states 1, "2", 3 → true', expr: "[isActiveState(1), isActiveState('2'), isActiveState(3)]", expect: [true, true, true] },
        { label: 'states 6, "7", 8 → false', expr: "[isActiveState(6), isActiveState('7'), isActiveState(8)]", expect: [false, false, false] },
      ],
    }),
    // ---- Ladder (array order = doing order): one new idea at a time, building up to 'IncidentUtils Script Include' ----
    jx('js-functions', 5, 'formatIncident(number, desc) — rendu parameters', 'medium', {
      task: 'formatIncident(number, desc) function rayyi: "INC0010002 - VPN is down" laaga <number> - <desc> text return chey (log kaadu, return!). 🧰 Vaade words: function, parameters, return, + (text join)',
      starter: `function formatIncident(number, desc) {
  // TODO: number + ' - ' + desc return chey
}
`,
      hint: [
        'Function ki rendu inputs (parameters) vachayi. Rendu ni oka text ga join chesi bayataki pampali — adi return.',
        'Shape: return <number> + " - " + <desc>;   (+ tho text join, return marchipoku — lekapothe function undefined istundi).',
        'return number + " - " + desc;',
      ],
      solution: `function formatIncident(number, desc) {
  return number + ' - ' + desc;
}`,
      explain: 'return value ni function bayataki istundi. Parameters = function ki vache inputs.',
      tests: [
        { label: 'formatIncident("INC0010002", "VPN is down")', expr: "formatIncident('INC0010002', 'VPN is down')", expect: 'INC0010002 - VPN is down' },
        { label: 'formatIncident("INC1", "x")', expr: "formatIncident('INC1', 'x')", expect: 'INC1 - x' },
      ],
    }),
    jx('js-functions', 3, 'getIncidentCount(category)', 'medium+', {
      task: 'getIncidentCount(category) function: aa category lo ACTIVE incidents count return chey (GlideRecord, addActiveQuery, addQuery, getRowCount).',
      starter: `function getIncidentCount(category) {
  // TODO: GlideRecord query chesi count return chey
}
`,
      hint: [
        'Function lopala GlideRecord query set chey — category parameter ni filter ga vaadu. Count ni return cheyali (log kaadu).',
        'gr.addActiveQuery(); gr.addQuery("category", category); gr.query(); — count kosam getRowCount().',
        "var gr = new GlideRecord('incident'); gr.addActiveQuery(); gr.addQuery('category', category); gr.query(); return gr.getRowCount();",
      ],
      solution: `function getIncidentCount(category) {
  var gr = new GlideRecord('incident');
  gr.addActiveQuery();
  gr.addQuery('category', category);
  gr.query();
  return gr.getRowCount();
}`,
      explain: 'Query logic function lo petti parameter tho reuse chesam. INC0010005 (inquiry) Closed — active = false — kabatti inquiry count 0.',
      tests: [
        { label: 'network → 2', expr: "getIncidentCount('network')", expect: 2 },
        { label: 'database → 2', expr: "getIncidentCount('database')", expect: 2 },
        { label: 'hardware → 1', expr: "getIncidentCount('hardware')", expect: 1 },
        { label: 'inquiry → 0', expr: "getIncidentCount('inquiry')", expect: 0 },
      ],
    }),
    jx('js-functions', 6, 'getOwner(number) — GlideRecord + safe return', 'medium+', {
      task: 'getOwner(number) function: incident ni number tho get chey. Dorikapothe "Not found" return chey. Dorikite assigned_to display value return chey, empty ayithe "Unassigned". 🧰 Vaade words: GlideRecord, get(), getDisplayValue(), return, ||',
      starter: `function getOwner(number) {
  var gr = new GlideRecord('incident');
  // TODO: gr.get(...) false ayithe 'Not found' return chey
  // TODO: assigned_to display value return chey (empty ayithe 'Unassigned')
}
`,
      hint: [
        'Rendu cases: record dorakaledu (early return), dorikindi (value return). get() true/false istundi — adi condition ga vaadu.',
        'if (!gr.get("number", number)) { return "Not found"; }   tarvata gr.getDisplayValue("assigned_to") || "Unassigned"',
        'return gr.getDisplayValue("assigned_to") || "Unassigned";',
      ],
      solution: `function getOwner(number) {
  var gr = new GlideRecord('incident');
  if (!gr.get('number', number)) {
    return 'Not found';
  }
  return gr.getDisplayValue('assigned_to') || 'Unassigned';
}`,
      explain: 'Early return (guard) tho edge cases mundu handle chesam. get() record dorikite true istundi. "IncidentUtils Script Include" lo ide pattern vaadatham.',
      tests: [
        { label: 'INC0010001 → System Administrator', expr: "getOwner('INC0010001')", expect: 'System Administrator' },
        { label: 'INC0010006 → Unassigned', expr: "getOwner('INC0010006')", expect: 'Unassigned' },
        { label: 'INC9999999 → Not found', expr: "getOwner('INC9999999')", expect: 'Not found' },
      ],
    }),
    jx('js-functions', 7, 'Script Include lo okka method (isP1)', 'medium+', {
      task: 'IncidentUtils ane class (Class.create) lo okka method isP1(number) rayyi: incident ni get chey (dorikapothe false), priority === "1" ayithe true return chey. type: "IncidentUtils" kuda pettu. 🧰 Vaade words: Class.create(), prototype, initialize, get(), getValue()',
      starter: `var IncidentUtils = Class.create();
IncidentUtils.prototype = {
  initialize: function () {},

  isP1: function (number) {
    // TODO: incident get chey (dorakakapothe false), priority === '1' return chey
  },

  type: 'IncidentUtils'
};
`,
      hint: [
        'Class structure ready undi — nuvvu isP1 body matrame rayali. Pani: record teesuko, priority "1" aa choosuko.',
        'var gr = new GlideRecord("incident"); if (!gr.get("number", number)) { return false; }',
        'return gr.getValue("priority") === "1";',
      ],
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

  type: 'IncidentUtils'
};`,
      explain: 'Script Include = class lo methods. Method lopala function laage GlideRecord vaadochu. "IncidentUtils Script Include" lo rendo method kuda add chestam.',
      tests: [
        { label: 'isP1: INC0010008 true, INC0010003 false', expr: "[new IncidentUtils().isP1('INC0010008'), new IncidentUtils().isP1('INC0010003')]", expect: [true, false] },
        { label: 'unknown number → false', expr: "new IncidentUtils().isP1('INC9999999')", expect: false },
        { label: 'type', expr: 'new IncidentUtils().type', expect: 'IncidentUtils' },
      ],
    }),
    jx('js-functions', 4, 'IncidentUtils Script Include', 'hard', {
      task: 'IncidentUtils ane Script Include style class (Class.create) rayyi. Methods: 1) isP1(number) → aa incident priority 1 aa true/false. 2) getOpenCountForGroup(groupName) → aa group (peru tho) ki assign ayina ACTIVE incidents count (mundu sys_user_group lo name tho sys_id teesuko, tarvata incident query — leka addQuery("assignment_group.name", groupName) dot-walk tho direct ga). 3) type: "IncidentUtils".',
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
      hint: [
        'isP1 "Script Include lo okka method (isP1)" lo chesav. getOpenCountForGroup kosam: mundu group peru nundi group record teesuko, tarvata aa group ki assign ayina active incidents count chey.',
        'Incident lo assignment_group value = group sys_id. Kabatti mundu sys_user_group lo get("name", groupName) chesi sys_id teesuko; dorakakapothe 0 return chey.',
        "var g = new GlideRecord('sys_user_group'); g.get('name', groupName); g.getUniqueValue() = sys_id.",
      ],
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
      explain: 'gr.get() true/false istundi — record dorikapothe safe ga return chesam. Reference field lo sys_id untundi kabatti group sys_id tho query chesam. (Dot-walk addQuery("assignment_group.name", groupName) kuda pani chestundi — okka query tho.)',
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
