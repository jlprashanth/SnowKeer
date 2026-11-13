// Stage 2 · JavaScript (part 2): operators, strings, arrays, objects — all ServiceNow scenarios.
import { q, jx } from './lessonKit.js'

/* 2 — Operators */
const operators = {
  id: 'js-operators',
  title: 'JavaScript Operators',
  video: 'Javascript Operators',
  duration: '',
  blurb: 'Priority calculations, == vs ===, && / || — incident fields tho.',
  learn: [
    {
      h: '➕ Arithmetic operators',
      body: [
        '+ - * / % — calculations kosam. % (modulo) = migilina remainder. Support scripts lo SLA time, counts, priority calculations ki vaadatharu.',
        'Gurtu: + string tho kalisthe text join avtundi (lesson 1 lo chusam).',
      ],
      code: `var totalMinutes = 150;
var hours = Math.floor(totalMinutes / 60);   // 2
var mins = totalMinutes % 60;                // 30
gs.info(hours + ' hr ' + mins + ' min');     // 2 hr 30 min

var count = 0;
count++;                                     // 1
count += 5;                                  // 6`,
    },
    {
      h: '⚖️ Comparison: == vs ===',
      body: [
        '== value chusi compare chestundi (type marchi kuda). === value + type rendu same undali. ServiceNow lo ide pedda gotcha: getValue() string istundi.',
        'Safe way: === vaadi, mundu Number() tho marchu. Ledha rendu side lu same type lo undali.',
      ],
      code: `var p = gr.getValue('priority');   // '1' (string)
gs.info(p == 1);     // true   (type marchi compare)
gs.info(p === 1);    // false  (string vs number)
gs.info(p === '1');  // true
gs.info(Number(p) === 1);  // true`,
    },
    {
      h: '🔗 Logical: && || !',
      body: [
        '&& = rendu true ayithe (AND). || = edaina okati true ayithe (OR). ! = ulta (NOT).',
        'Business Rule conditions lo idi roju vaadatharu: "priority 1 AND unassigned".',
      ],
      code: `var urgent = Number(priority) <= 2;
var unassigned = !gr.getValue('assigned_to');   // empty ayithe true

if (urgent && unassigned) {
  gs.info('Page on-call');
}
var needsLook = urgent || state === '3';`,
    },
    {
      h: '❓ Ternary & assignment',
      body: [
        'condition ? a : b = chinna if/else oka line lo. Compound assignment: += -= *= tho value ni update chestam.',
      ],
      code: `var label = priority <= 2 ? 'High' : 'Normal';

var score = 0;
score += Number(impact);
score += Number(urgency);`,
    },
  ],
  quiz: [
    q('var p = "1"; gs.info(p === 1); — em vastundi?', ['true', 'false', 'undefined', 'Error'], 1, '=== type kuda chusthundi: "1" (string) !== 1 (number).'),
    q('gs.info(7 % 3); — result?', ['2', '1', '3', '0'], 1, '7 ni 3 tho divide chesthe remainder 1.'),
    q('"INC" + 5 + 5 — result?', ['INC10', 'INC55', 'INC5', '15'], 1, 'String tho + text join chestundi: "INC" + 5 = "INC5", tarvata + 5 = "INC55".'),
    q('urgent && unassigned — eppudu true?', ['Rendu true ayinappudu', 'Edaina okati true ayithe', 'Rendu false ayithe', 'Eppudu kaadu'], 0, '&& = AND, rendu conditions true undali.'),
    q('!gr.getValue("assigned_to") — assigned_to empty ayithe?', ['true', 'false', 'null', 'Error'], 0, 'Empty string falsy, ! tho true avtundi.'),
  ],
  exercises: [
    jx('js-operators', 1, 'Minutes ni hours:minutes ga marchu', 'easy', {
      task: 'Oka incident 150 minutes nundi open lo undi. totalMinutes = 150 teesuko; hours (Math.floor(.. / 60)) & mins (% 60) calculate chesi "2 hr 30 min" ani log chey.',
      starter: `var totalMinutes = 150;

// TODO: hours = whole hours (/ tho, Math.floor)
var hours;
// TODO: mins = migilina minutes (% tho)
var mins;

gs.info(hours + ' hr ' + mins + ' min');
`,
      hint: 'hours = Math.floor(totalMinutes / 60); mins = totalMinutes % 60;',
      solution: `var totalMinutes = 150;
var hours = Math.floor(totalMinutes / 60);
var mins = totalMinutes % 60;
gs.info(hours + ' hr ' + mins + ' min');`,
      explain: '/ tho divide, Math.floor tho decimals teeseyali. % remainder istundi.',
      tests: [{ label: 'Log: 2 hr 30 min', logs: ['2 hr 30 min'] }],
    }),
    jx('js-operators', 2, '== vs === (priority)', 'easy', {
      task: 'INC0010002 teesuko. p = gr.getValue("priority"). Moodu results log chey (order lo): p == 1, p === 1, p === "1".',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var p = gr.getValue('priority');

// TODO: moodu gs.info lu: p == 1 ; p === 1 ; p === '1'
`,
      hint: 'gs.info(p == 1); gs.info(p === 1); gs.info(p === "1");',
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var p = gr.getValue('priority');

gs.info(p == 1);
gs.info(p === 1);
gs.info(p === '1');`,
      explain: 'getValue string. == type marchi "1" == 1 true. === strict, "1" === 1 false. String tho string compare chesthe true.',
      tests: [{ label: 'true, false, true', logs: ['true', 'false', 'true'] }],
    }),
    jx('js-operators', 3, 'Page on-call? (&& tho)', 'medium', {
      task: 'INC0010004 teesuko. urgent = priority number <= 2. unassigned = assigned_to empty (!gr.getValue(...)). Rendu true ayithe "Page on-call: true" ani log chey (urgent && unassigned result print chey).',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

// TODO: urgent = Number(priority) <= 2
var urgent;
// TODO: unassigned = assigned_to empty ayithe true
var unassigned;

gs.info('Page on-call: ' + (urgent && unassigned));
`,
      hint: 'var unassigned = !gr.getValue("assigned_to");',
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

var urgent = Number(gr.getValue('priority')) <= 2;
var unassigned = !gr.getValue('assigned_to');

gs.info('Page on-call: ' + (urgent && unassigned));`,
      explain: 'Comparison (<=) boolean istundi. Empty string falsy kabatti ! tho true. && rendu true ayithe true.',
      tests: [
        { label: 'Log: Page on-call: true', logs: ['Page on-call: true'] },
        { label: 'urgent oka boolean', expr: 'typeof urgent', expect: 'boolean' },
      ],
    }),
    jx('js-operators', 4, 'Priority calculate chey (ternary, +=)', 'hard', {
      scenario: { current: { table: 'incident', values: { impact: '1', urgency: '2', priority: '5' } } },
      task: 'current lo impact=1, urgency=2. score = impact + urgency (+= vaadi, Number ga). Priority: score <= 2 → 1, score === 3 → 2, score === 4 → 3, ledhante 4 (ternary chain). current.setValue("priority", priority) chesi "Calculated priority: 2" ani log chey.',
      starter: `var score = 0;
// TODO: score += Number(impact);  score += Number(urgency);   (current.getValue vaadu)

// TODO: priority = ternary chain (score <= 2 ? 1 : score === 3 ? 2 : ...)
var priority;

current.setValue('priority', priority);
gs.info('Calculated priority: ' + current.getValue('priority'));
`,
      hint: 'var priority = score <= 2 ? 1 : score === 3 ? 2 : score === 4 ? 3 : 4;',
      solution: `var score = 0;
score += Number(current.getValue('impact'));
score += Number(current.getValue('urgency'));

var priority = score <= 2 ? 1 : score === 3 ? 2 : score === 4 ? 3 : 4;

current.setValue('priority', priority);
gs.info('Calculated priority: ' + current.getValue('priority'));`,
      explain: 'Idi Priority Data Lookup (Impact × Urgency) idea. += tho add, ternary chain tho if/else-if oka line lo.',
      tests: [
        { label: 'Log: Calculated priority: 2', logs: ['Calculated priority: 2'] },
        { label: 'score = 3', expr: 'score', expect: 3 },
      ],
    }),
  ],
}

/* 3 — String methods */
const strings = {
  id: 'js-strings',
  title: 'JavaScript String Methods',
  video: 'Javascript String Methods',
  duration: '',
  blurb: 'short_description clean cheyyadam, keywords vethakadam, incident numbers build cheyyadam.',
  learn: [
    {
      h: '🔤 Basic: length, trim, case',
      body: [
        'Text fields (short_description, email) tho pani chesetappudu mundu clean chestam: trim() = start/end spaces teesesthundi, toLowerCase()/toUpperCase() = case marchutundi.',
      ],
      code: `var s = '  VPN is DOWN  ';
gs.info(s.length);               // 14
gs.info(s.trim());               // 'VPN is DOWN'
gs.info(s.trim().toLowerCase()); // 'vpn is down'`,
    },
    {
      h: '🔍 Vethakadam: indexOf, includes, startsWith',
      body: [
        'Short description lo keyword undo ledo check cheyyadaniki: indexOf (position istundi, ledhante -1), includes (true/false).',
        'Case-insensitive kosam mundu toLowerCase() chey.',
        '⚠️ includes() mariyu startsWith() newer JavaScript (ES6+) — classic (ES5) server scripts lo avi undavu, "is not a function" error vastundi. ES12 mode on unte matrame work avtayi. ES5 lo safe way: indexOf(...) !== -1 (includes ki), indexOf(...) === 0 (startsWith ki). Nee PDI script lo ES12 mode tick undo ledo check chesuko.',
      ],
      code: `var d = 'VPN keeps disconnecting';
gs.info(d.toLowerCase().indexOf('vpn') !== -1);  // true
gs.info(d.includes('VPN'));                      // true
gs.info(d.startsWith('VPN'));                    // true`,
    },
    {
      h: '✂️ Cut & change: slice, split, replace',
      body: [
        'slice(start, end) = oka part teesukovadam. split("x") = text ni array ga chestundi. replace(a, b) = first match marchutundi.',
        'Email nundi domain teesukovadam, incident number nundi digits teesukovadam laanti pani lo vaadatharu.',
      ],
      code: `var email = 'abel.tuter@example.com';
var parts = email.split('@');       // ['abel.tuter', 'example.com']
gs.info(parts[1]);                  // example.com

var num = 'INC0010004';
gs.info(num.slice(3));              // 0010004
gs.info('Hello Abel'.replace('Abel', 'Ravi'));`,
    },
    {
      h: '🧱 Build: padStart & joining',
      body: [
        'Incident number lanti text build cheyyadaniki: "INC" + number.padStart(7, "0"). padStart = left lo "0" nimputundi.',
        '⚠️ padStart kuda ES2017 — ES12 mode on unte matrame work avtundi. Classic ES5 script lo ila rayali: ("0000000" + n).slice(-7). (Ee site lo browser sandbox kabatti padStart work avtundi, kani nee PDI lo ES5 script ayithe error vastundi.)',
      ],
      code: `var n = 42;
var number = 'INC' + String(n).padStart(7, '0');
gs.info(number);                    // INC0000042`,
    },
    {
      h: '⚠️ Gotcha: field ni string ga teesuko',
      body: [
        'gr.short_description oka object (GlideElement) — direct ga .toLowerCase() call cheyyaleru. Mundu gr.getValue("short_description") leka String(gr.short_description) tho string ga marchu.',
        'Strings immutable — s.trim() original s ni marchadu, kotha value istundi. Result ni variable lo pettu.',
      ],
      code: `var s = gr.getValue('short_description');   // string
var lower = s.toLowerCase();                  // kotha string
// s.toLowerCase();   <- result ni vadilesthe em use ledu`,
    },
  ],
  quiz: [
    q('"  VPN  ".trim() — result?', ['"VPN"', '"  VPN"', '"VPN  "', '"vpn"'], 0, 'trim() start & end spaces teesesthundi.'),
    q('"Printer jam".indexOf("jam") — result?', ['8', '0', '-1', 'true'], 0, '"Printer " 8 chars, kabatti "jam" 8th index lo start. Ledhante -1.'),
    q('"abel@example.com".split("@")[1] — result?', ['example.com', 'abel', '@', 'abel@'], 0, 'split array istundi; [1] = rendo part.'),
    q('"INC" + String(7).padStart(4, "0") — result?', ['INC0007', 'INC7000', 'INC7', 'INC0000007'], 0, 'padStart(4, "0") → "0007".'),
    q('var s = "ab"; s.toUpperCase(); gs.info(s); — em vastundi?', ['ab', 'AB', 'undefined', 'Error'], 0, 'Strings immutable. toUpperCase kotha string return chestundi, s marchadu.'),
  ],
  exercises: [
    jx('js-strings', 1, 'Short description clean chey', 'easy', {
      task: 'short = "  VPN is DOWN  ". trim() + toLowerCase() tho clean chesi cleaned lo pettu, "vpn is down" ani log chey.',
      starter: `var short = '  VPN is DOWN  ';

// TODO: cleaned = trim + toLowerCase
var cleaned;

gs.info(cleaned);
`,
      hint: 'var cleaned = short.trim().toLowerCase();',
      solution: `var short = '  VPN is DOWN  ';
var cleaned = short.trim().toLowerCase();
gs.info(cleaned);`,
      explain: 'Methods ni chain cheyochu: trim() result meeda toLowerCase().',
      tests: [{ label: 'Log: vpn is down', logs: ['vpn is down'] }],
    }),
    jx('js-strings', 2, 'VPN ticket aa?', 'easy', {
      task: 'INC0010002 short_description teesuko (getValue). Lowercase chesi "vpn" undo ledo indexOf tho check chesi "VPN ticket: true" ani log chey.',
      starter: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var desc = gr.getValue('short_description');

// TODO: isVpn = lowercase desc lo 'vpn' undi aa? (indexOf !== -1)
var isVpn;

gs.info('VPN ticket: ' + isVpn);
`,
      hint: 'var isVpn = desc.toLowerCase().indexOf("vpn") !== -1;',
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var desc = gr.getValue('short_description');

var isVpn = desc.toLowerCase().indexOf('vpn') !== -1;

gs.info('VPN ticket: ' + isVpn);`,
      explain: 'indexOf -1 ante dorakaledu. !== -1 ante undi. Case-insensitive kosam mundu toLowerCase().',
      tests: [{ label: 'Log: VPN ticket: true', logs: ['VPN ticket: true'] }],
    }),
    jx('js-strings', 3, 'Email nundi domain & username', 'medium', {
      task: 'sys_user lo user_name = "abel.tuter" user ni get chey. email nundi split("@") tho domain teesuko → "Domain: example.com" log chey. Tarvata user_name ni uppercase chesi "User: ABEL.TUTER" log chey.',
      starter: `var gr = new GlideRecord('sys_user');
// TODO: user_name = abel.tuter user ni get chey

var email = gr.getValue('email');

// TODO: domain = email.split('@') lo rendo part
var domain;
gs.info('Domain: ' + domain);

// TODO: user_name uppercase chesi log chey: 'User: ABEL.TUTER'
`,
      hint: 'gr.get("user_name", "abel.tuter"); var domain = email.split("@")[1];',
      solution: `var gr = new GlideRecord('sys_user');
gr.get('user_name', 'abel.tuter');

var email = gr.getValue('email');

var domain = email.split('@')[1];
gs.info('Domain: ' + domain);

gs.info('User: ' + gr.getValue('user_name').toUpperCase());`,
      explain: 'split("@") array istundi: [username, domain]. getValue string kabatti toUpperCase() work avtundi.',
      tests: [{ label: 'Domain & User logs', logs: ['Domain: example.com', 'User: ABEL.TUTER'] }],
    }),
    jx('js-strings', 4, 'Incident numbers: build & next', 'hard', {
      task: '1) counter = 42 nundi "INC" + padStart(7, "0") tho number build chesi log chey (INC0000042). 2) last = "INC0010004" nundi slice(3) tho digits teesukoni Number() chesi +1 chesi, malli INC + padStart tho nextNumber build chesi log chey (INC0010005).',
      starter: `var counter = 42;
// TODO: 'INC' + counter padStart(7,'0')  -> log chey

var last = 'INC0010004';
// TODO: digits = last.slice(3) ; next = Number(digits) + 1
var nextNumber;   // 'INC' + padded next
gs.info(nextNumber);
`,
      hint: "'INC' + String(counter).padStart(7, '0')",
      solution: `var counter = 42;
gs.info('INC' + String(counter).padStart(7, '0'));

var last = 'INC0010004';
var next = Number(last.slice(3)) + 1;
var nextNumber = 'INC' + String(next).padStart(7, '0');
gs.info(nextNumber);`,
      explain: '(ES12 mode kavali — classic ES5 lo ("0000000" + n).slice(-7) vaadu.) Real ServiceNow lo number maintenance ila panichestundi: prefix + zero-padded counter. slice(3) "INC" teesesthundi, padStart leading zeros pedutundi.',
      tests: [
        { label: 'Logs: INC0000042, INC0010005', logs: ['INC0000042', 'INC0010005'] },
        { label: 'nextNumber = INC0010005', expr: 'nextNumber', expect: 'INC0010005' },
      ],
    }),
  ],
}

/* 4 — Array methods */
const arrays = {
  id: 'js-arrays',
  title: 'Array Methods',
  video: 'Array Methods',
  duration: '',
  blurb: 'Incident numbers list, sys_ids collect, filter / map / sort — real ServiceNow patterns.',
  learn: [
    {
      h: '📋 Array basics',
      body: [
        'Array = values list. [0] tho first item. length = entha items. ServiceNow lo query results nunchi sys_ids / numbers collect cheyyadaniki chala vaadatharu.',
      ],
      code: `var groups = ['Service Desk', 'Network'];
gs.info(groups[0]);        // Service Desk
gs.info(groups.length);    // 2`,
    },
    {
      h: '➕ push, pop, indexOf, join',
      body: [
        'push = chivarlo add. pop = chivari teesey. indexOf = position (ledhante -1). join(", ") = array ni text ga marchutundi — log lo chudadaniki best.',
      ],
      code: `var groups = ['Service Desk', 'Network'];
groups.push('Database');
gs.info(groups.join(', '));           // Service Desk, Network, Database
gs.info(groups.indexOf('Network'));   // 1
gs.info(groups.indexOf('Hardware'));  // -1`,
    },
    {
      h: '🧺 Query results ni array lo collect chey',
      body: [
        'Chala common pattern: GlideRecord query chesi, while (gr.next()) loop lo values ni array ki push chestam. (Loops detail ga next lessons lo.)',
        'Tarvata ids.join(",") tho vere query lo "IN" condition ki vaadochu.',
      ],
      code: `var ids = [];
var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addQuery('priority', 1);
gr.query();
while (gr.next()) {
  ids.push(gr.getValue('number'));
}
gs.info(ids.join(', '));`,
    },
    {
      h: '🔄 forEach, map, filter, sort',
      body: [
        'forEach = prathi item ki pani. map = kotha array (marchina values). filter = condition match ayyevi matrame. sort = order.',
        'Classic server scripts lo callback ni function(x) { ... } ga rayali. (Arrow functions => ES12 mode lo matrame.)',
      ],
      code: `var nums = [3, 1, 2];
nums.sort(function (a, b) { return a - b; });     // [1, 2, 3]
var big = nums.filter(function (n) { return n > 1; });   // [2, 3]
var labels = nums.map(function (n) { return 'P' + n; }); // ['P1','P2','P3']
labels.forEach(function (l) { gs.info(l); });`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'sort() default ga TEXT order lo sort chestundi: [10, 9, 1].sort() → [1, 10, 9]. Numbers kosam function(a, b) { return a - b } ivvali.',
        'filter / map kotha array istayi — result ni variable lo pettukoledhu ante use ledu. push / sort mathram original array ni marchutayi.',
      ],
      code: `gs.info([10, 9, 1].sort().join(','));                                  // 1,10,9
gs.info([10, 9, 1].sort(function (a, b) { return a - b; }).join(','));  // 1,9,10`,
    },
  ],
  quiz: [
    q('var a = ["x", "y"]; a.push("z"); gs.info(a.length); — result?', ['3', '2', '"z"', '4'], 0, 'push chivarlo add chestundi → 3 items.'),
    q('["a", "b"].indexOf("c") — result?', ['-1', '0', 'undefined', 'false'], 0, 'Dorakapothe indexOf -1 istundi.'),
    q('[1, 2, 3].join("-") — result?', ['"1-2-3"', '[1,2,3]', '"123"', '6'], 0, 'join separator tho text build chestundi.'),
    q('[10, 9, 1].sort() — result?', ['[1, 10, 9]', '[1, 9, 10]', '[10, 9, 1]', '[9, 10, 1]'], 0, 'Default sort text order lo chestundi. Numbers ki compare function kavali.'),
    q('filter() em chestundi?', ['Condition match ayye items tho kotha array istundi', 'Original array ni delete chestundi', 'Array ni sort chestundi', 'Count matrame istundi'], 0, 'filter kotha array return chestundi.'),
  ],
  exercises: [
    jx('js-arrays', 1, 'Groups list build chey', 'easy', {
      task: 'groups = ["Service Desk", "Network"] array create chey. push tho "Database" add chey. groups.length log chey (3), tarvata groups.join(", ") log chey.',
      starter: `var groups = ['Service Desk', 'Network'];

// TODO: 'Database' ni push chey

// TODO: length log chey, tarvata join(', ') log chey
`,
      hint: "groups.push('Database'); gs.info(groups.length); gs.info(groups.join(', '));",
      solution: `var groups = ['Service Desk', 'Network'];
groups.push('Database');
gs.info(groups.length);
gs.info(groups.join(', '));`,
      explain: 'push add chestundi, length count istundi, join log kosam text ga marchutundi.',
      tests: [{ label: 'Logs: 3 & Service Desk, Network, Database', logs: ['3', 'Service Desk, Network, Database'] }],
    }),
    jx('js-arrays', 2, 'P1 team lo undaa?', 'easy', {
      task: 'p1Teams = ["Network", "Database"]. INC0010008 teesuko, assignment_group display value (getDisplayValue("assignment_group")) teesuko. p1Teams.indexOf(...) !== -1 tho check chesi "On P1 team: true" ani log chey.',
      starter: `var p1Teams = ['Network', 'Database'];
var gr = new GlideRecord('incident');
gr.get('number', 'INC0010008');

// TODO: groupName = assignment_group display value
var groupName;

// TODO: onTeam = p1Teams lo groupName undaa (indexOf !== -1)
var onTeam;

gs.info('On P1 team: ' + onTeam);
`,
      hint: "var groupName = gr.getDisplayValue('assignment_group');",
      solution: `var p1Teams = ['Network', 'Database'];
var gr = new GlideRecord('incident');
gr.get('number', 'INC0010008');

var groupName = gr.getDisplayValue('assignment_group');
var onTeam = p1Teams.indexOf(groupName) !== -1;

gs.info('On P1 team: ' + onTeam);`,
      explain: 'Reference field ki getValue = sys_id, getDisplayValue = peru ("Database"). indexOf tho array lo membership check.',
      tests: [{ label: 'Log: On P1 team: true', logs: ['On P1 team: true'] }],
    }),
    jx('js-arrays', 3, 'P1 incident numbers collect chey', 'medium', {
      task: 'Active & priority 1 incidents query chey (number tho orderBy). while (gr.next()) loop lo numbers array lo push chesi, numbers.join(", ") log chey.',
      starter: `var numbers = [];

var gr = new GlideRecord('incident');
// TODO: addActiveQuery, priority = 1, orderBy('number'), query()

// TODO: while (gr.next()) { numbers.push(...) }

gs.info(numbers.join(', '));
`,
      hint: "gr.addActiveQuery(); gr.addQuery('priority', 1); gr.orderBy('number'); gr.query(); while (gr.next()) { numbers.push(gr.getValue('number')); }",
      solution: `var numbers = [];

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addQuery('priority', 1);
gr.orderBy('number');
gr.query();

while (gr.next()) {
  numbers.push(gr.getValue('number'));
}

gs.info(numbers.join(', '));`,
      explain: 'Query → while(gr.next()) → push. Ide ServiceNow lo most common array pattern.',
      tests: [
        { label: 'Log: INC0010002, INC0010008', logs: ['INC0010002, INC0010008'] },
        { label: 'numbers lo 2 items', expr: 'numbers.length', expect: 2 },
      ],
    }),
    jx('js-arrays', 4, 'Triage list: sort, slice, map', 'hard', {
      task: 'Active & unassigned (assigned_to empty — addNullQuery) incidents query chey (number tho order). Prathidaniki { number, priority (Number) } object create chesi list lo push chey. priority tho sort (ascending), top 3 teesuko (slice(0, 3)), map tho numbers matrame teesukoni join(", ") tho log chey.',
      starter: `var list = [];

var gr = new GlideRecord('incident');
// TODO: addActiveQuery, addNullQuery('assigned_to'), orderBy('number'), query

// TODO: while loop: list.push({ number: ..., priority: Number(...) })

// TODO: list.sort(function (a, b) { return a.priority - b.priority; })
// TODO: top3 = list.slice(0, 3).map(function (o) { return o.number; })
var top3 = [];

gs.info(top3.join(', '));
`,
      hint: "Sort compare function: function (a, b) { return a.priority - b.priority; }",
      solution: `var list = [];

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addNullQuery('assigned_to');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  list.push({ number: gr.getValue('number'), priority: Number(gr.getValue('priority')) });
}

list.sort(function (a, b) { return a.priority - b.priority; });
var top3 = list.slice(0, 3).map(function (o) { return o.number; });

gs.info(top3.join(', '));`,
      explain: 'Objects array build chesi, sort (a - b numbers kosam), slice tho top N, map tho kavalsina field matrame. Triage dashboards ila build avtayi.',
      tests: [
        { label: 'Top 3: INC0010002, INC0010004, INC0010007', logs: ['INC0010002, INC0010004, INC0010007'] },
        { label: 'Unassigned active = 4', expr: 'list.length', expect: 4 },
      ],
    }),
  ],
}

/* 5 — Object methods */
const objects = {
  id: 'js-objects',
  title: 'Object Methods',
  video: 'Object Methods',
  duration: '',
  blurb: 'REST payloads, JSON.parse / stringify, Object.keys — incident data tho.',
  learn: [
    {
      h: '🧾 Object = key: value',
      body: [
        'Object lo data key-value pairs ga untundi. dot (obj.number) leka bracket (obj["number"]) tho access chestam. REST API responses, GlideAjax data anni objects.',
      ],
      code: `var inc = { number: 'INC0010002', state: 'New', priority: 1 };
gs.info(inc.number);        // INC0010002
gs.info(inc['state']);      // New`,
    },
    {
      h: '✏️ Add, change, delete',
      body: [
        'Kotha property add: obj.key = value. Marchadam same. delete obj.key tho teeseyochu. "key" in obj leka obj.hasOwnProperty("key") tho undo ledo check.',
      ],
      code: `inc.assigned_to = 'Abel Tuter';   // add
inc.state = 'In Progress';        // change
delete inc.priority;              // remove
gs.info('state' in inc);          // true`,
    },
    {
      h: '🗝 Object.keys & for...in',
      body: [
        'Object.keys(obj) = keys array. for (var k in obj) tho anni keys meeda loop. Values: obj[k].',
      ],
      code: `var keys = Object.keys(inc);   // ['number', 'state', ...]
for (var k in inc) {
  gs.info(k + ' = ' + inc[k]);
}`,
    },
    {
      h: '📦 JSON.stringify & JSON.parse',
      body: [
        'REST API / integrations lo data TEXT (JSON string) ga vastundi. JSON.parse(text) = text → object. JSON.stringify(obj) = object → text.',
        'gs.info(obj) [object Object] ani print chestundi — object ni log cheyyalante JSON.stringify(obj) vaadu.',
      ],
      code: `var text = '{"result":{"number":"INC0010009","state":"1"}}';
var data = JSON.parse(text);
gs.info(data.result.number);                 // INC0010009

gs.info(JSON.stringify({ number: 'INC1', state: '2' }));
// {"number":"INC1","state":"2"}`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'Missing key access = undefined (error kaadu). Anduke data.result.number lo result ledhante "Cannot read property of undefined" error vastundi — mundu check chey.',
        'JSON.parse invalid text ki error throw chestundi.',
      ],
      code: `var o = { a: 1 };
gs.info(o.b);                 // undefined
gs.info(typeof o.b === 'undefined');   // true`,
    },
  ],
  quiz: [
    q('var o = { a: 1 }; gs.info(o.b); — em vastundi?', ['undefined', 'null', 'Error', '0'], 0, 'Lekapoyina key undefined istundi.'),
    q('JSON.parse() em chestundi?', ['JSON text ni object ga marchutundi', 'Object ni text ga marchutundi', 'Object ni delete chestundi', 'Array sort chestundi'], 0, 'parse = text → object. stringify = object → text.'),
    q('Object.keys({ x: 1, y: 2 }).length — result?', ['2', '1', 'x', 'undefined'], 0, 'Keys array ["x","y"], length 2.'),
    q('gs.info({ a: 1 }) — em print avtundi?', ['[object Object]', '{"a":1}', 'a', '1'], 0, 'Object ni log cheyyalante JSON.stringify vaadali.'),
    q('delete obj.state — em chestundi?', ['state property ni teesesthundi', 'state value ni 0 chestundi', 'obj ni delete chestundi', 'Error'], 0, 'delete property ni object nundi teesesthundi.'),
  ],
  exercises: [
    jx('js-objects', 1, 'Incident payload object', 'easy', {
      task: 'payload = { number: "INC0010002", state: "New", priority: 1 } object create chey. Dot notation tho number log chey, bracket notation tho state log chey.',
      starter: `// TODO: payload object create chey

// TODO: dot tho payload.number log chey
// TODO: bracket tho payload['state'] log chey
`,
      hint: "var payload = { number: 'INC0010002', state: 'New', priority: 1 };",
      solution: `var payload = { number: 'INC0010002', state: 'New', priority: 1 };
gs.info(payload.number);
gs.info(payload['state']);`,
      explain: 'Dot & bracket rendu same. Bracket lo variable key vaadochu (payload[fieldName]).',
      tests: [{ label: 'Logs: INC0010002, New', logs: ['INC0010002', 'New'] }],
    }),
    jx('js-objects', 2, 'Property add & delete', 'easy', {
      task: 'payload = { number: "INC0010002", state: "New", priority: 1 } undi. assigned_to = "Abel Tuter" add chey, state delete chey. Object.keys(payload).join(",") log chey → number,priority,assigned_to',
      starter: `var payload = { number: 'INC0010002', state: 'New', priority: 1 };

// TODO: assigned_to add chey
// TODO: state delete chey

gs.info(Object.keys(payload).join(','));
`,
      hint: "payload.assigned_to = 'Abel Tuter'; delete payload.state;",
      solution: `var payload = { number: 'INC0010002', state: 'New', priority: 1 };
payload.assigned_to = 'Abel Tuter';
delete payload.state;
gs.info(Object.keys(payload).join(','));`,
      explain: 'Assign tho add, delete tho remove. Object.keys tho final keys chudochu.',
      tests: [{ label: 'Log: number,priority,assigned_to', logs: ['number,priority,assigned_to'] }],
    }),
    jx('js-objects', 3, 'REST response parse & build', 'medium', {
      task: 'response = \'{"result":{"number":"INC0010009","state":"1"}}\' (JSON text). JSON.parse chesi data lo pettu, data.result.number log chey. Tarvata { number: "INC0010009", state: "2" } object ni JSON.stringify chesi log chey.',
      starter: `var response = '{"result":{"number":"INC0010009","state":"1"}}';

// TODO: data = JSON.parse(response)
var data;
gs.info(data.result.number);

// TODO: { number: 'INC0010009', state: '2' } ni JSON.stringify chesi log chey
`,
      hint: 'var data = JSON.parse(response); gs.info(JSON.stringify({ number: ..., state: ... }));',
      solution: `var response = '{"result":{"number":"INC0010009","state":"1"}}';

var data = JSON.parse(response);
gs.info(data.result.number);

gs.info(JSON.stringify({ number: 'INC0010009', state: '2' }));`,
      explain: 'ServiceNow Table API response ila {"result": ...} format lo vastundi. parse tho object, stringify tho text.',
      tests: [{ label: 'Logs: INC0010009 & JSON text', logs: ['INC0010009', '{"number":"INC0010009","state":"2"}'] }],
    }),
    jx('js-objects', 4, 'Category count (object as counter)', 'hard', {
      task: 'Anni incidents query chey (number tho order). counts = {} lo prathi category ki count pettu: counts[cat] = (counts[cat] || 0) + 1. Chivarlo JSON.stringify(counts) log chey.',
      starter: `var counts = {};

var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

// TODO: while loop: category teesuko, counts lo +1

gs.info(JSON.stringify(counts));
`,
      hint: "var cat = gr.getValue('category'); counts[cat] = (counts[cat] || 0) + 1;",
      solution: `var counts = {};

var gr = new GlideRecord('incident');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  var cat = gr.getValue('category');
  counts[cat] = (counts[cat] || 0) + 1;
}

gs.info(JSON.stringify(counts));`,
      explain: '(counts[cat] || 0) = key ledhante 0 tho start. Object ni counter/map ga vaadadam — GlideAggregate ki alternative idea.',
      tests: [
        { label: 'Category counts', logs: ['{"software":2,"network":2,"hardware":1,"database":2,"inquiry":1}'] },
        { label: 'network = 2', expr: 'counts.network', expect: 2 },
      ],
    }),
  ],
}

export const LESSONS_JS_B = [operators, strings, arrays, objects]
