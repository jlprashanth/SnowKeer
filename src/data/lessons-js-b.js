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
        '== value chusi compare chestundi (type marchi kuda). === value + type rendu same undali. ServiceNow lo ide pedda gotcha: getValue() string istundi (true/false field ki "1" / "0", empty field ki null).',
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
var unassigned = !gr.getValue('assigned_to');   // empty → getValue null → !null = true

if (urgent && unassigned) {
  gs.info('Page on-call');
}
var needsLook = urgent || state === '3';`,
    },
    {
      h: '🧅 Nested calls — lopala nundi bayatiki chadvu',
      body: [
        'Oka line lo function lopala function untey, JavaScript eppudu LOPALA unnadi mundu run chestundi, tarvata bayata unnadi. Ullipaya tholu laaga — mundu lopali layer.',
        'Priority <= 2 check ki correct line: Number(gr.getValue("priority")) <= 2. Order: (1) gr.getValue("priority") → "1" (string) (2) Number("1") → 1 (3) 1 <= 2 → true.',
        '❌ Common mistake: gr.getValue(number("priority")) <= 2. Ikkada lopala number("priority") mundu run avtundi — kani (a) JavaScript case-sensitive: number ane function ledu, Number (capital N) undi → ReferenceError: "number" is not defined. (b) Capital N rasina (getValue(Number("priority"))) error radu, kani Number("priority") = NaN, endukante "priority" field PERU (text), number kaadu. getValue(NaN) → aa peru tho field ledu → null (nee PDI lo check chesam); null <= 2 = true (null → 0) — prathi incident "urgent" ani vastundi! Error lekunda tappu result ravadam inka danger. Rule: getValue ki field peru string ga ivvali, daani RESULT ni bayata Number() lo pettali.',
        'Easy ga undali ante rendu lines ga rayochu — logic same, kani chadavadam easy: var p = gr.getValue("priority"); var urgent = Number(p) <= 2;',
      ],
      code: `// ❌ Tappu — lopala number('priority') mundu run avtundi
var urgent = gr.getValue(number('priority')) <= 2;
//   ReferenceError: "number" is not defined.

// ✅ Correct — oka line lo
var urgent = Number(gr.getValue('priority')) <= 2;

// ✅ Correct — rendu lines lo (same logic, easy ga chadavochu)
var p = gr.getValue('priority');      // '1'  (string)
var urgent2 = Number(p) <= 2;         // 1 <= 2 → true`,
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
    q('!gr.getValue("assigned_to") — assigned_to empty ayithe?', ['true', 'false', 'null', 'Error'], 0, 'Empty field ki getValue null istundi — null falsy, ! tho true avtundi.'),
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
      tests: [
        { label: 'Log: 2 hr 30 min', logs: ['2 hr 30 min'] },
        { label: 'hours = 2, mins = 30 (numbers)', expr: '[hours, mins]', expect: [2, 30] },
      ],
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
      variants: [
        {
          name: 'INC0010002 priority 3 ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc2', priority: '3' }] } },
          tests: [{ label: 'false, false, false (p = "3")', logs: ['false', 'false', 'false'] }],
        },
      ],
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
      hint: [
        'Rendu conditions kavali: urgent (priority chinna number) & unassigned (assigned_to empty). Rendu boolean values ayyaka && tho kalupu.',
        'urgent: Number(gr.getValue("priority")) <= 2.   unassigned: empty field ki getValue null istundi (falsy), kabatti ! vaadu.',
        'var urgent = Number(gr.getValue("priority")) <= 2;   var unassigned = !gr.getValue("assigned_to");',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

var urgent = Number(gr.getValue('priority')) <= 2;
var unassigned = !gr.getValue('assigned_to');

gs.info('Page on-call: ' + (urgent && unassigned));`,
      explain: 'Comparison (<=) boolean istundi. Empty field ki getValue null → !null = true. && rendu true ayithe true. (getValue("assigned_to") == "" ani rasthe null == "" FALSE — nee PDI lo kuda.)',
      tests: [
        { label: 'Log: Page on-call: true', logs: ['Page on-call: true'] },
        { label: 'urgent, unassigned rendu booleans', expr: '[typeof urgent, typeof unassigned]', expect: ['boolean', 'boolean'] },
      ],
      variants: [
        {
          name: 'INC0010004 ki assignee unte',
          scenario: { seed: { incident: [{ sys_id: 'inc4', assigned_to: 'u_abel' }] } },
          tests: [{ label: 'Log: Page on-call: false', logs: ['Page on-call: false'] }],
        },
        {
          name: 'INC0010004 priority 3 ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc4', priority: '3' }] } },
          tests: [{ label: 'Log: Page on-call: false', logs: ['Page on-call: false'] }],
        },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to 'Priority calculate chey' (array order = doing order) ----
    jx('js-operators', 5, 'Urgent aa? (<= comparison)', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010061', priority: '2', impact: '1', urgency: '2' } } },
      task: 'current lo priority 2 undi. priority ni Number ga teesuko, isUrgent = priority <= 2 (boolean) ga set chey, tarvata "Urgent: true" ani log chey. 🧰 Vaade words: current, getValue(), Number(), <= — comparison result boolean istundi.',
      starter: `// Step 1: priority ni Number ga teesuko
var priority;

// Step 2: isUrgent = priority <= 2   (true / false vastundi)
var isUrgent;

// Step 3: gs.info('Urgent: ' + isUrgent)
`,
      hint: [
        'Mundu priority ni current nundi teesuko (string vastundi — number ga marchu). Tarvata <= tho compare chey, last lo log.',
        'Number(current.getValue("priority")) number istundi. Comparison (priority <= 2) result ye true / false — daanini direct ga isUrgent lo pettu.',
        'var priority = Number(current.getValue("priority"));   var isUrgent = priority <= 2;   gs.info("Urgent: " + isUrgent);',
      ],
      solution: `var priority = Number(current.getValue('priority'));
var isUrgent = priority <= 2;
gs.info('Urgent: ' + isUrgent);`,
      explain: 'Comparison operators (<=) ellappudu true/false istayi. getValue string kabatti mundu Number() tho marchali.',
      tests: [
        { label: 'Log: Urgent: true', logs: ['Urgent: true'] },
        { label: 'isUrgent oka boolean', expr: 'typeof isUrgent', expect: 'boolean' },
      ],
      variants: [
        {
          name: 'priority 3 unna record',
          scenario: { current: { table: 'incident', values: { number: 'INC0010064', priority: '3', impact: '2', urgency: '2' } } },
          tests: [{ label: 'Log: Urgent: false', logs: ['Urgent: false'] }],
        },
      ],
    }),
    jx('js-operators', 6, 'Impact + urgency score (+=)', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010062', priority: '5', impact: '2', urgency: '2' } } },
      task: 'current lo impact=2, urgency=2. score = 0 tho start chesi, += tho impact, urgency add chey (rendu Number ga). Tarvata "Score: 4" ani log chey. 🧰 Vaade words: current, getValue(), Number(), +=',
      starter: `var score = 0;

// TODO: impact value ni Number ga marchi score ki += tho add chey
// TODO: urgency ki kuda ade

gs.info('Score: ' + score);
`,
      hint: [
        'score lo mundu 0 undi. Prathi field value ni score ki add chestunnav — okko line okko field.',
        'score += Number(current.getValue("impact"));   — urgency ki kuda ide pattern.',
        'score += Number(current.getValue("impact"));   score += Number(current.getValue("urgency"));',
      ],
      solution: `var score = 0;
score += Number(current.getValue('impact'));
score += Number(current.getValue('urgency'));
gs.info('Score: ' + score);`,
      explain: 'score += x ante score = score + x. Number() lekunda + chesthe text join avtundi ("022").',
      tests: [
        { label: 'Log: Score: 4', logs: ['Score: 4'] },
        { label: 'score oka number', expr: 'typeof score', expect: 'number' },
      ],
      variants: [
        {
          name: 'impact 3, urgency 2',
          scenario: { current: { table: 'incident', values: { number: 'INC0010065', priority: '5', impact: '3', urgency: '2' } } },
          tests: [{ label: 'Log: Score: 5', logs: ['Score: 5'] }],
        },
      ],
    }),
    jx('js-operators', 7, 'Score nundi label (ternary)', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010063', priority: '5', impact: '1', urgency: '1' } } },
      task: 'current lo impact=1, urgency=1 (score 2). Score calculate chey. label = score <= 2 ? "Critical" : "Normal" (ternary). "Label: Critical" ani log chey. 🧰 Vaade words: current, getValue(), Number(), ?:',
      starter: `var score = Number(current.getValue('impact')) + Number(current.getValue('urgency'));

// condition ? ifTrue : ifFalse
// TODO: label = score 2 or takkuva ayithe 'Critical', lekapothe 'Normal' (ternary tho)
var label;

gs.info('Label: ' + label);
`,
      hint: [
        'Ternary = chinna if/else: condition ? true-value : false-value. Condition ante score <= 2.',
        'Shape: var label = score <= 2 ? <true-value> : <false-value>;   — rendu values text (quotes lo).',
        'var label = score <= 2 ? "Critical" : "Normal";',
      ],
      solution: `var score = Number(current.getValue('impact')) + Number(current.getValue('urgency'));
var label = score <= 2 ? 'Critical' : 'Normal';
gs.info('Label: ' + label);`,
      explain: 'Ternary oka line lo if/else. "Priority calculate chey (ternary, +=)" exercise lo ide idea ni chain chesi priority 1–4 calculate chestam.',
      tests: [
        { label: 'Log: Label: Critical', logs: ['Label: Critical'] },
        { label: 'label = Critical', expr: 'label', expect: 'Critical' },
      ],
      variants: [
        {
          name: 'impact 2, urgency 2 (score 4)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010066', priority: '5', impact: '2', urgency: '2' } } },
          tests: [{ label: 'Log: Label: Normal', logs: ['Label: Normal'] }],
        },
      ],
    }),
    jx('js-operators', 4, 'Priority calculate chey (ternary, +=)', 'hard', {
      scenario: { current: { table: 'incident', values: { impact: '1', urgency: '2', priority: '5' } } },
      task: 'current lo impact=1, urgency=2. score = impact + urgency (+= vaadi, Number ga). Priority: score <= 2 → 1, score === 3 → 2, score === 4 → 3, ledhante 4 (ternary chain). current.setValue("priority", priority) chesi "Calculated priority: 2" ani log chey.',
      starter: `var score = 0;
// TODO: score lo impact, urgency add chey (+= tho, Number ga — current.getValue vaadu)

// TODO: priority = ternary chain: score <= 2 → 1, score 3 → 2, score 4 → 3, migilindi → 4
var priority;

current.setValue('priority', priority);
gs.info('Calculated priority: ' + current.getValue('priority'));
`,
      hint: [
        'Mundu score build chey (+= rendu sarlu). Tarvata score batti priority 1–4 pick chey — previous Medium+ exercises lo ide practice chesav.',
        'Ternary chain: condition1 ? value1 : condition2 ? value2 : ... : lastValue. Score <= 2 → 1, === 3 → 2, === 4 → 3, migilindi 4.',
        'var priority = score <= 2 ? 1 : score === 3 ? 2 : score === 4 ? 3 : 4;',
      ],
      solution: `var score = 0;
score += Number(current.getValue('impact'));
score += Number(current.getValue('urgency'));

var priority = score <= 2 ? 1 : score === 3 ? 2 : score === 4 ? 3 : 4;

current.setValue('priority', priority);
gs.info('Calculated priority: ' + current.getValue('priority'));`,
      explain: 'Idi Priority Data Lookup (Impact × Urgency) idea — nee PDI lookup table tho match avtundi (1/1 → 1, 1/2 → 2, 2/2 → 3, 3/3 → 4). += tho add, ternary chain tho if/else-if oka line lo.',
      tests: [
        { label: 'Log: Calculated priority: 2', logs: ['Calculated priority: 2'] },
        { label: 'score = 3', expr: 'score', expect: 3 },
      ],
      variants: [
        {
          name: 'impact 1, urgency 1',
          scenario: { current: { table: 'incident', values: { impact: '1', urgency: '1', priority: '5' } } },
          tests: [{ label: 'Log: Calculated priority: 1', logs: ['Calculated priority: 1'] }],
        },
        {
          name: 'impact 2, urgency 2',
          scenario: { current: { table: 'incident', values: { impact: '2', urgency: '2', priority: '5' } } },
          tests: [
            { label: 'Log: Calculated priority: 3', logs: ['Calculated priority: 3'] },
            { label: 'current priority = "3"', expr: "current.getValue('priority')", expect: '3' },
          ],
        },
        {
          name: 'impact 3, urgency 3',
          scenario: { current: { table: 'incident', values: { impact: '3', urgency: '3', priority: '5' } } },
          tests: [{ label: 'Log: Calculated priority: 4', logs: ['Calculated priority: 4'] }],
        },
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
        '✅ includes() mariyu startsWith() nee PDI lo (global scope) pani chestayi — check chesam. Old scripts lo vaati badulu indexOf(...) !== -1 (includes laaga) mariyu indexOf(...) === 0 (startsWith laaga) chustav — result same.',
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
        '✅ padStart kuda nee PDI global scope lo pani chestundi (check chesam). Old scripts lo ee trick chustav: ("0000000" + n).slice(-7) — same result.',
        'Template literal (backticks): `Hello ${name}` = "Hello " + name — idi kuda nee PDI lo pani chestundi (check chesam). Ee course lo ekkuva + join vaadatam, old scripts lo ade chustav.',
      ],
      code: `var n = 42;
var number = 'INC' + String(n).padStart(7, '0');
gs.info(number);                    // INC0000042`,
    },
    {
      h: '⚠️ Gotcha: field ni string ga teesuko',
      body: [
        'gr.short_description oka object (GlideElement), string kaadu — daani meeda string methods (toLowerCase, split) pani cheyyavu. Mundu gr.getValue("short_description") leka String(gr.short_description) tho string ga marchu.',
        'Field EMPTY ayithe getValue null istundi — null.toLowerCase() → TypeError: Cannot read property "toLowerCase" from null. Empty avvochu ante mundu check chey (if (s) ...), leka String(gr.short_description) vaadu (empty ki "" istundi — "null" kaadu, nee PDI lo check chesam).',
        'Strings immutable — s.trim() original s ni marchadu, kotha value istundi. Result ni variable lo pettu.',
      ],
      code: `var s = gr.getValue('short_description');   // string (empty ayithe null!)
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
      scenario: { current: { table: 'incident', values: { number: 'INC0010081', short_description: '  VPN is DOWN  ', state: '1' } } },
      task: 'current short_description lo "  VPN is DOWN  " undi (mundu, venaka spaces). trim() + toLowerCase() tho clean chesi cleaned lo pettu, log chey → "vpn is down".',
      starter: `var short = current.getValue('short_description');

// TODO: cleaned = trim + toLowerCase
var cleaned;

gs.info(cleaned);
`,
      hint: 'var cleaned = short.trim().toLowerCase();',
      solution: `var short = current.getValue('short_description');
var cleaned = short.trim().toLowerCase();
gs.info(cleaned);`,
      explain: 'Methods ni chain cheyochu: trim() result meeda toLowerCase(). Text fields lo users ekkuva spaces / capitals pedataru — compare chese mundu ila clean chestam.',
      tests: [
        { label: 'Log: vpn is down', logs: ['vpn is down'] },
        { label: 'cleaned = "vpn is down"', expr: 'cleaned', expect: 'vpn is down' },
      ],
      variants: [
        {
          name: 'vere short description',
          scenario: { current: { table: 'incident', values: { number: 'INC0010082', short_description: ' Email NOT Syncing   ', state: '1' } } },
          tests: [{ label: 'Log: email not syncing', logs: ['email not syncing'] }],
        },
      ],
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
      explain: 'indexOf -1 ante dorakaledu. !== -1 ante undi. Case-insensitive kosam mundu toLowerCase(). (includes("vpn") kuda nee PDI lo pani chestundi.)',
      tests: [
        { label: 'Log: VPN ticket: true', logs: ['VPN ticket: true'] },
        { label: 'isVpn oka boolean', expr: 'typeof isVpn', expect: 'boolean' },
      ],
      variants: [
        {
          name: 'chinna letters lo "vpn"',
          scenario: { seed: { incident: [{ sys_id: 'inc2', short_description: 'Cannot connect to vpn from home' }] } },
          tests: [{ label: 'Log: VPN ticket: true', logs: ['VPN ticket: true'] }],
        },
        {
          name: 'VPN ledu',
          scenario: { seed: { incident: [{ sys_id: 'inc2', short_description: 'Printer is jammed' }] } },
          tests: [{ label: 'Log: VPN ticket: false', logs: ['VPN ticket: false'] }],
        },
      ],
    }),
    // ---- Ladder (array order = doing order): 5 → 6 → 3 build the email / domain idea, 7 → 4 the incident-number idea ----
    jx('js-strings', 5, 'User nundi email teesuko', 'medium', {
      task: 'sys_user lo user_name = "abel.tuter" user ni get chey. Daani email ni getValue tho teesukuni email variable lo pettu. "Email: abel.tuter@example.com" ani log chey. 🧰 Vaade words: GlideRecord, get(), getValue()',
      starter: `var gr = new GlideRecord('sys_user');
// get(field, value) = aa value unna record load chestundi
// TODO: user_name = abel.tuter user ni get chey

// TODO: email variable lo aa user email field value pettu
var email;

gs.info('Email: ' + email);
`,
      hint: [
        'Mundu record load chey (get), tarvata aa record nundi oka field value teesuko (getValue).',
        'get(field, value) record ni load chestundi; getValue("field") aa field text istundi. Rendu lines.',
        'gr.get("user_name", "abel.tuter");   var email = gr.getValue("email");',
      ],
      solution: `var gr = new GlideRecord('sys_user');
gr.get('user_name', 'abel.tuter');
var email = gr.getValue('email');
gs.info('Email: ' + email);`,
      explain: 'get() record ni load chestundi, getValue() field text istundi. "Email split chesi domain teesuko" lo ee email ni split chestam.',
      tests: [
        { label: 'Log: Email: abel.tuter@example.com', logs: ['Email: abel.tuter@example.com'] },
        { label: 'email oka string', expr: 'typeof email', expect: 'string' },
      ],
      variants: [
        {
          name: 'Abel email marithe',
          scenario: { seed: { sys_user: [{ sys_id: 'u_abel', email: 'abel@hyd.example.org' }] } },
          tests: [{ label: 'Log: Email: abel@hyd.example.org', logs: ['Email: abel@hyd.example.org'] }],
        },
      ],
    }),
    jx('js-strings', 6, 'Email split chesi domain teesuko', 'medium+', {
      scenario: { current: { table: 'sys_user', values: { user_name: 'abel.tuter', name: 'Abel Tuter', email: 'abel.tuter@example.com' } } },
      task: 'sys_user table meeda Business Rule lo laaga — current = oka user record (email: abel.tuter@example.com). Email ni split("@") tho rendu mukkalu chesi, rendo part (index 1) ni domain lo pettu. "Domain: example.com" ani log chey. 🧰 Vaade words: split(), array index [1]',
      starter: `var email = current.getValue('email');

// split('@') array istundi: [ 'abel.tuter', 'example.com' ]
// TODO: parts = email ni '@' daggara split chey
var parts;

// TODO: domain = parts lo rendo item (index 0 nundi start avtundi)
var domain;

gs.info('Domain: ' + domain);
`,
      hint: [
        'split oka array istundi — mundu daanini oka variable lo pettuko. Tarvata array lo ye position kavalo choosuko (0 nundi lekka).',
        'var parts = email.split("@");   — parts[0] = username, parts[1] = domain.',
        'var parts = email.split("@");   var domain = parts[1];   (short ga: var domain = email.split("@")[1];)',
      ],
      solution: `var email = current.getValue('email');
var parts = email.split('@');
var domain = parts[1];
gs.info('Domain: ' + domain);`,
      explain: 'split("@") tho "@" daggara mukkalu avtundi: [username, domain]. Array index 0 nundi start — kabatti domain = [1].',
      tests: [
        { label: 'Log: Domain: example.com', logs: ['Domain: example.com'] },
        { label: 'domain = example.com', expr: 'domain', expect: 'example.com' },
      ],
      variants: [
        {
          name: 'vere user (hyd.example.org)',
          scenario: { current: { table: 'sys_user', values: { user_name: 'beth.anglin', name: 'Beth Anglin', email: 'beth.anglin@hyd.example.org' } } },
          tests: [{ label: 'Log: Domain: hyd.example.org', logs: ['Domain: hyd.example.org'] }],
        },
      ],
    }),
    jx('js-strings', 3, 'Email nundi domain & username', 'medium+', {
      task: 'sys_user lo user_name = "abel.tuter" user ni get chey. email nundi split("@") tho domain teesuko → "Domain: example.com" log chey. Tarvata user_name ni uppercase chesi "User: ABEL.TUTER" log chey.',
      starter: `var gr = new GlideRecord('sys_user');
// TODO: user_name = abel.tuter user ni get chey

var email = gr.getValue('email');

// TODO: domain = email lo "@" tarvata unna part
var domain;
gs.info('Domain: ' + domain);

// TODO: user_name uppercase chesi log chey: 'User: ABEL.TUTER'
`,
      hint: [
        'Mundu user ni load chey, email teesuko. Domain kosam email ni "@" daggara mukkalu cheyali; uppercase kosam oka string method undi.',
        'email.split("@") array istundi — domain ye index lo undo choosuko. Uppercase: toUpperCase().',
        'gr.get("user_name", "abel.tuter");   var domain = email.split("@")[1];   gs.info("User: " + gr.getValue("user_name").toUpperCase());',
      ],
      solution: `var gr = new GlideRecord('sys_user');
gr.get('user_name', 'abel.tuter');

var email = gr.getValue('email');

var domain = email.split('@')[1];
gs.info('Domain: ' + domain);

gs.info('User: ' + gr.getValue('user_name').toUpperCase());`,
      explain: 'split("@") array istundi: [username, domain]. getValue string kabatti toUpperCase() work avtundi.',
      tests: [
        { label: 'Domain & User logs', logs: ['Domain: example.com', 'User: ABEL.TUTER'] },
        { label: 'domain = example.com', expr: 'domain', expect: 'example.com' },
      ],
      variants: [
        {
          name: 'Abel email marithe',
          scenario: { seed: { sys_user: [{ sys_id: 'u_abel', email: 'abel@corp.example.org' }] } },
          tests: [{ label: 'Logs: Domain: corp.example.org, User: ABEL.TUTER', logs: ['Domain: corp.example.org', 'User: ABEL.TUTER'] }],
        },
      ],
    }),
    jx('js-strings', 7, 'Incident number build (padStart)', 'medium+', {
      task: 'counter = 7 undi. "INC" + counter ni 7 digits varaku leading zeros tho pad chesi (padStart) log chey → INC0000007. 🧰 Vaade words: String(), padStart()',
      starter: `var counter = 7;

// padStart(totalLength, fillChar) — number ki padStart ledu, mundu String() chesi vaadali
// TODO: padded = counter ni 7 characters varaku mundu '0' lu petti text ga
var padded;

// TODO: 'INC' + padded ni log chey
`,
      hint: [
        'Number ki padStart ledu — mundu text ga marchu. Tarvata total length 7 varaku mundu zeros pettu.',
        'String(counter) text istundi; daani meeda .padStart(7, "0").',
        'var padded = String(counter).padStart(7, "0");   gs.info("INC" + padded);',
      ],
      solution: `var counter = 7;
var padded = String(counter).padStart(7, '0');
gs.info('INC' + padded);`,
      explain: 'padStart(7, "0") total length 7 ayye varaku mundu "0" pedutundi — nee PDI global scope lo pani chestundi (check chesam). "Incident numbers: build & next" lo idi + slice(3) kalipi vaadatam.',
      tests: [
        { label: 'Log: INC0000007', logs: ['INC0000007'] },
        { label: 'padded = 0000007', expr: 'padded', expect: '0000007' },
      ],
    }),
    jx('js-strings', 4, 'Incident numbers: build & next', 'hard', {
      task: '1) counter = 42 nundi "INC" + 7 digits (leading zeros) number build chesi log chey → INC0000042. 2) Practice data lo chivari incident number (last — starter lo query ready ga undi) lo "INC" tarvata unna digits teesukoni, Number() chesi +1 chesi, malli "INC" + 7 digits tho nextNumber build chesi log chey (ippudu last = INC0010008 → INC0010009).',
      starter: `var counter = 42;
// TODO: 1) 'INC' + counter (7 digits, leading zeros) log chey

// Practice data lo chivari incident number — ee query ready ga undi
var gr = new GlideRecord('incident');
gr.orderByDesc('number');
gr.setLimit(1);
gr.query();
gr.next();
var last = gr.getValue('number');

// TODO: 2) last lo "INC" tarvata unna digits teesuko, number ga marchi + 1 chey
// TODO:    malli 'INC' + 7 digits tho nextNumber build chey
var nextNumber;
gs.info(nextNumber);
`,
      hint: [
        'Rendu parts: (1) number ni 7-digit padded text ga marchi INC mundu pettu. (2) last nundi digits teesi +1 chesi malli same pattern.',
        'padStart(7, "0") ki mundu String(...) kavali. Digits kosam last.slice(3) ("INC" 3 letters skip) — adi string, Number() tho marchi + 1.',
        "gs.info('INC' + String(counter).padStart(7, '0'));   var next = Number(last.slice(3)) + 1;   var nextNumber = 'INC' + String(next).padStart(7, '0');",
      ],
      solution: `var counter = 42;
gs.info('INC' + String(counter).padStart(7, '0'));

var gr = new GlideRecord('incident');
gr.orderByDesc('number');
gr.setLimit(1);
gr.query();
gr.next();
var last = gr.getValue('number');

var next = Number(last.slice(3)) + 1;
var nextNumber = 'INC' + String(next).padStart(7, '0');
gs.info(nextNumber);`,
      explain: 'Real ServiceNow lo number maintenance ila panichestundi: prefix + zero-padded counter. slice(3) "INC" teesesthundi, Number() + 1, padStart leading zeros pedutundi. (Old scripts lo padStart badulu ("0000000" + n).slice(-7) trick chustav — same result.)',
      tests: [
        { label: 'Logs: INC0000042, INC0010009', logs: ['INC0000042', 'INC0010009'] },
        { label: 'nextNumber = INC0010009', expr: 'nextNumber', expect: 'INC0010009' },
      ],
      variants: [
        {
          name: 'chivari number INC0010120 ayithe',
          scenario: { seed: { incident: [{ number: 'INC0010120', short_description: 'Latest ticket' }] } },
          tests: [{ label: 'nextNumber = INC0010121', expr: 'nextNumber', expect: 'INC0010121' }],
        },
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
      h: '⚠️ ServiceNow gotcha: push(gr.number) — anni okate vastayi!',
      body: [
        'Loop lo gr.number (field object, GlideElement) ni direct ga push chesthe, array lo prathi entry SAME object avtundi — adi eppudu gr lo ippudu load ayina record ne chupistundi. Loop ayyaka anni entries LAST record number chupistayi (nee PDI lo check chesam: 3 records → INC0000003 ×3).',
        'Fix: eppudu value (string) push chey — gr.getValue("number") leka String(gr.number). Objects lo kuda ade: { number: gr.getValue("number") }.',
      ],
      code: `var wrong = [];
var right = [];
var gr = new GlideRecord('incident');
gr.addQuery('priority', 1);
gr.query();
while (gr.next()) {
  wrong.push(gr.number);               // ❌ object — prathi sari SAME object
  right.push(gr.getValue('number'));   // ✅ string — aa round value
}
gs.info(wrong.join(', '));   // INC0010008, INC0010008   (last record rendu sarlu!)
gs.info(right.join(', '));   // INC0010002, INC0010008`,
    },
    {
      h: '🔄 forEach, map, filter, sort',
      body: [
        'forEach = prathi item ki pani. map = kotha array (marchina values). filter = condition match ayyevi matrame. sort = order.',
        'Callback ni function (x) { ... } ga rastam — ServiceNow scripts lo ekkuva ila chustav. Arrow functions (x => x * 2) kuda nee PDI global scope lo pani chestayi (check chesam).',
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
        'Array empty aa? ani length tho check chey: ids.length === 0. if (ids) / if (!ids) vaadaku — nee PDI lo empty array [] FALSY (check chesam), normal JavaScript lo truthy. length rendu chotla correct.',
      ],
      code: `gs.info([10, 9, 1].sort().join(','));                                  // 1,10,9
gs.info([10, 9, 1].sort(function (a, b) { return a - b; }).join(','));  // 1,9,10

var ids = [];
if (ids.length === 0) gs.info('Records levu');                         // ✅ length tho check`,
    },
  ],
  quiz: [
    q('var a = ["x", "y"]; a.push("z"); gs.info(a.length); — result?', ['3', '2', '"z"', '4'], 0, 'push chivarlo add chestundi → 3 items.'),
    q('["a", "b"].indexOf("c") — result?', ['-1', '0', 'undefined', 'false'], 0, 'Dorakapothe indexOf -1 istundi.'),
    q('[1, 2, 3].join("-") — result?', ['"1-2-3"', '[1,2,3]', '"123"', '6'], 0, 'join separator tho text build chestundi.'),
    q('[10, 9, 1].sort() — result?', ['[1, 10, 9]', '[1, 9, 10]', '[10, 9, 1]', '[9, 10, 1]'], 0, 'Default sort text order lo chestundi. Numbers ki compare function kavali.'),
    q('filter() em chestundi?', ['Condition match ayye items tho kotha array istundi', 'Original array nundi items ni delete chestundi', 'Array ni sort chesi return chestundi', 'Match ayina items count matrame istundi'], 0, 'filter kotha array return chestundi.'),
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
      tests: [
        { label: 'Logs: 3 & Service Desk, Network, Database', logs: ['3', 'Service Desk, Network, Database'] },
        { label: 'groups array lo nijanga 3 items', expr: "groups.join('|')", expect: 'Service Desk|Network|Database' },
      ],
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
      tests: [
        { label: 'Log: On P1 team: true', logs: ['On P1 team: true'] },
        { label: 'groupName = Database (display value)', expr: 'groupName', expect: 'Database' },
      ],
      variants: [
        {
          name: 'INC0010008 Hardware group lo unte',
          scenario: { seed: { incident: [{ sys_id: 'inc8', assignment_group: 'g_hw' }] } },
          tests: [{ label: 'Log: On P1 team: false', logs: ['On P1 team: false'] }],
        },
      ],
    }),
    jx('js-arrays', 3, 'P1 incident numbers collect chey', 'medium', {
      task: 'Active & priority 1 incidents query chey (number tho orderBy). while (gr.next()) loop lo prathi number ni (string ga — getValue tho) numbers array lo push chesi, numbers.join(", ") log chey.',
      starter: `var numbers = [];

var gr = new GlideRecord('incident');
// TODO: addActiveQuery, priority = 1, orderBy('number'), query()

// TODO: while (gr.next()) { numbers.push(...) }

gs.info(numbers.join(', '));
`,
      hint: [
        'Query set chey (active + priority 1 + order), tarvata records meeda loop chesi prathi number ni array lo cheru.',
        'gr.addActiveQuery(); gr.addQuery("priority", 1); gr.orderBy("number"); gr.query(); — tarvata while (gr.next()) { ... }',
        "gr.addActiveQuery(); gr.addQuery('priority', 1); gr.orderBy('number'); gr.query(); while (gr.next()) { numbers.push(gr.getValue('number')); }",
      ],
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
      explain: 'Query → while (gr.next()) → push(gr.getValue(...)). Ide ServiceNow lo most common array pattern. push(gr.number) ayithe anni entries LAST record avtayi — eppudu getValue tho string push chey.',
      tests: [
        { label: 'Log: INC0010002, INC0010008', logs: ['INC0010002, INC0010008'] },
        { label: 'numbers lo 2 items', expr: 'numbers.length', expect: 2 },
        { label: 'numbers lo strings (gr.number object kaadu — getValue vaadu)', expr: 'typeof numbers[0]', expect: 'string' },
      ],
      variants: [
        {
          name: 'inko active P1 + oka closed P1',
          scenario: {
            seed: {
              incident: [
                { number: 'INC0010009', short_description: 'Core switch down', priority: '1', impact: '1', urgency: '1', state: '2', category: 'network' },
                { number: 'INC0010010', short_description: 'Old outage (closed)', priority: '1', state: '7', active: 'false', category: 'network' },
              ],
            },
          },
          tests: [{ label: 'Log: INC0010002, INC0010008, INC0010009', logs: ['INC0010002, INC0010008, INC0010009'] }],
        },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to 'Triage list' (array order = doing order) ----
    jx('js-arrays', 5, 'Unassigned incidents collect chey', 'medium+', {
      task: 'Active & unassigned (assigned_to empty) incidents query chey — addNullQuery("assigned_to") vaadu, orderBy("number"). Numbers ni array lo push chesi join(", ") tho log chey. 🧰 Vaade words: GlideRecord, addActiveQuery(), addNullQuery(), orderBy(), query(), next(), push()',
      starter: `var numbers = [];

var gr = new GlideRecord('incident');
// TODO: addActiveQuery(), assigned_to empty filter, orderBy('number'), query()

// TODO: while loop lo prathi number (string ga) numbers lo push chey

gs.info(numbers.join(', '));
`,
      hint: [
        'Pattern ade (query → while next → push). Kotha idea okkate: assigned_to empty ani filter cheyyali — addQuery kaadu, oka special method undi.',
        'gr.addNullQuery("assigned_to") = aa field empty unnavi matrame.',
        'gr.addActiveQuery(); gr.addNullQuery("assigned_to"); gr.orderBy("number"); gr.query(); while (gr.next()) { numbers.push(gr.getValue("number")); }',
      ],
      solution: `var numbers = [];

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addNullQuery('assigned_to');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  numbers.push(gr.getValue('number'));
}

gs.info(numbers.join(', '));`,
      explain: 'addNullQuery(field) = field empty unna records. "P1 incident numbers collect chey" lo laage array build — filter matrame maarindi.',
      tests: [
        { label: 'Log: 4 unassigned numbers', logs: ['INC0010002, INC0010004, INC0010006, INC0010007'] },
        { label: 'numbers lo 4 items', expr: 'numbers.length', expect: 4 },
        { label: 'numbers lo strings (gr.number object kaadu)', expr: 'typeof numbers[0]', expect: 'string' },
      ],
      variants: [
        {
          name: 'kotha unassigned + closed + assigned incidents',
          scenario: {
            seed: {
              incident: [
                { number: 'INC0010009', short_description: 'New laptop request', priority: '4', state: '1', category: 'hardware' },
                { number: 'INC0010010', short_description: 'Old ticket (closed)', priority: '3', state: '7', active: 'false' },
                { number: 'INC0010011', short_description: 'Already assigned', priority: '3', state: '2', assigned_to: 'u_beth' },
              ],
            },
          },
          tests: [{ label: 'Log: 5 numbers (INC0010009 tho)', logs: ['INC0010002, INC0010004, INC0010006, INC0010007, INC0010009'] }],
        },
      ],
    }),
    jx('js-arrays', 6, 'Objects array build chey', 'medium+', {
      task: 'Ade query (active, unassigned, orderBy number). Ikkada numbers kaadu — prathi incident ki { number, priority } object create chesi list lo push chey. priority Number ga undali. Chivarlo list.length (4) log chey. 🧰 Vaade words: GlideRecord, push(), Number(), object { key: value }',
      starter: `var list = [];

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addNullQuery('assigned_to');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  // TODO: list.push({ number: ..., priority: Number(...) })
}

gs.info(list.length);
`,
      hint: [
        'Loop already ready. Prathi round lo oka object (number + priority) tayaru chesi list lo push chey.',
        'Object: { number: gr.getValue("number"), priority: Number(gr.getValue("priority")) } — push( ) lopala pettu.',
        'list.push({ number: gr.getValue("number"), priority: Number(gr.getValue("priority")) });',
      ],
      solution: `var list = [];

var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addNullQuery('assigned_to');
gr.orderBy('number');
gr.query();

while (gr.next()) {
  list.push({ number: gr.getValue('number'), priority: Number(gr.getValue('priority')) });
}

gs.info(list.length);`,
      explain: 'Array lo strings kaadu, objects pettochu. number ki getValue (string) — gr.number pedithe anni objects last record chupistayi. priority ni Number ga marchamu — "Triage list" lo adi tho sort chestam.',
      tests: [
        { label: 'Log: 4', logs: ['4'] },
        { label: 'first item = INC0010002, priority 1', expr: "list[0].number + ':' + list[0].priority", expect: 'INC0010002:1' },
        { label: 'number string, priority number', expr: '[typeof list[0].number, typeof list[0].priority]', expect: ['string', 'number'] },
      ],
      variants: [
        {
          name: 'kotha unassigned incident (INC0010009, P2)',
          scenario: { seed: { incident: [{ number: 'INC0010009', short_description: 'Monitor flickering', priority: '2', state: '1', category: 'hardware' }] } },
          tests: [
            { label: 'Log: 5', logs: ['5'] },
            { label: 'last item = INC0010009, priority 2', expr: "list[4].number + ':' + list[4].priority", expect: 'INC0010009:2' },
          ],
        },
      ],
    }),
    jx('js-arrays', 7, 'Sort + top N (slice)', 'medium+', {
      task: 'openDays = [12, 3, 25, 1, 9] — 5 incidents entha rojula nundi open lo unnayo. Chinna nundi pedda ki sort chey (compare function tho — default sort TEXT order lo chestundi!), first 2 teesuko (slice(0, 2)), join(", ") tho "1, 3" ani log chey. 🧰 Vaade words: sort(), slice(), join()',
      starter: `var openDays = [12, 3, 25, 1, 9];

// ⚠️ sort() compare function lekapothe TEXT order: 1, 12, 25, 3, 9
// TODO: openDays ni numbers order lo sort chey (compare function tho)

// TODO: top2 = sort chesina array lo first 2 items
var top2 = [];

gs.info(top2.join(', '));
`,
      hint: [
        'Sort chesaka array order maaruthundi; tarvata first 2 items matrame kavali. Compare function lekapothe 12 ki mundu 3 raadu (text order).',
        'openDays.sort(function (a, b) { return a - b; });   — tarvata first 2 kosam slice(0, 2).',
        'openDays.sort(function (a, b) { return a - b; });   var top2 = openDays.slice(0, 2);',
      ],
      solution: `var openDays = [12, 3, 25, 1, 9];
openDays.sort(function (a, b) { return a - b; });
var top2 = openDays.slice(0, 2);
gs.info(top2.join(', '));`,
      explain: 'a - b compare function numbers ni ascending sort chestundi (compare lekapothe text order: 1, 12, 25, 3, 9). slice(0, 2) first rendu items copy istundi. "Triage list" lo ide objects tho (a.priority - b.priority).',
      tests: [
        { label: 'Log: 1, 3', logs: ['1, 3'] },
        { label: 'openDays numbers order lo sort ayyindi (text order kaadu)', expr: "openDays.join(',')", expect: '1,3,9,12,25' },
        { label: 'top2 = [1, 3]', expr: 'top2.join(",")', expect: '1,3' },
      ],
    }),
    jx('js-arrays', 4, 'Triage list: sort, slice, map', 'hard', {
      task: 'Active & unassigned (assigned_to empty — addNullQuery) incidents query chey (number tho order). Prathidaniki { number, priority (Number) } object create chesi list lo push chey. priority tho sort (ascending), top 3 teesuko (slice(0, 3)), map tho numbers matrame teesukoni join(", ") tho log chey.',
      starter: `var list = [];

var gr = new GlideRecord('incident');
// TODO: active + unassigned filters, number order, query

// TODO: while loop: prathi record ki { number, priority } object list lo push

// TODO: list ni priority tho sort chey (chinna priority mundu)
// TODO: top3 = first 3 objects nundi numbers matrame (slice + map)
var top3 = [];

gs.info(top3.join(', '));
`,
      hint: [
        'Steps: (1) query + objects list build ("Objects array build chey" laage), (2) priority tho sort ("Sort + top N" laage, kani objects), (3) top 3 slice, (4) map tho numbers matrame.',
        'Objects sort ki compare function lo a.priority - b.priority. map lo prathi object nundi o.number return chey.',
        'list.sort(function (a, b) { return a.priority - b.priority; });   var top3 = list.slice(0, 3).map(function (o) { return o.number; });',
      ],
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
      explain: 'Objects array build chesi, sort (a - b numbers kosam), slice tho top N, map tho kavalsina field matrame. Triage dashboards ila build avtayi. (number ki getValue — gr.number pedithe anni last record avtayi.)',
      tests: [
        { label: 'Top 3: INC0010002, INC0010004, INC0010007', logs: ['INC0010002, INC0010004, INC0010007'] },
        { label: 'Unassigned active = 4', expr: 'list.length', expect: 4 },
        { label: 'top3 lo strings', expr: 'typeof top3[0]', expect: 'string' },
      ],
      variants: [
        {
          name: 'kotha unassigned P1 (INC0010009)',
          scenario: { seed: { incident: [{ number: 'INC0010009', short_description: 'Core switch down', priority: '1', state: '1', category: 'network' }] } },
          tests: [
            { label: 'Top 3: INC0010002, INC0010009, INC0010004', logs: ['INC0010002, INC0010009, INC0010004'] },
            { label: 'Unassigned active = 5', expr: 'list.length', expect: 5 },
          ],
        },
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
        'Object.values / Object.entries kuda nee PDI global scope lo pani chestayi (check chesam). Kani for…of loop, destructuring (var { number } = inc) Background Script lo (ES12 mode lekunda) SyntaxError istayi (check chesam) — for...in / obj.key vaadu.',
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
      h: '🫵 this — object lo method, "ee object" ani artham',
      body: [
        'Object lo value ga function kuda pettochu — daanini method antam. Method lopala this = aa method ni pilichina object. inc.describe() lo this = inc, kabatti this.number = inc.number.',
        'Script Includes anni ide pattern: initialize lo this.table = table ani object lo save chesi, migatha methods lo this.table tho malli chaduvutayi. this lekapothe prathi method ki anni values malli parameters ga pampali.',
        '⚠️ Method lo this marchipothe (this.number badulu number) — aa peru tho bayata variable vethukutundi; ledante ReferenceError: "number" is not defined.',
      ],
      terms: ['this', 'Class.create', 'GlideRecord', 'getRowCount'],
      code: `var inc = {
  number: 'INC0010002',
  priority: 1,
  describe: function () {
    return this.number + ' (P' + this.priority + ')';   // this = inc
  }
};
gs.info(inc.describe());   // INC0010002 (P1)

// Script Include lo same idea (Functions lesson lo detail ga):
var IncidentHelper = Class.create();
IncidentHelper.prototype = {
  initialize: function (table) {
    this.table = table;                       // object lo save
  },
  count: function () {
    var gr = new GlideRecord(this.table);     // malli this tho chadivi
    gr.query();
    return gr.getRowCount();
  },
  type: 'IncidentHelper'
};
gs.info(new IncidentHelper('incident').count());   // practice data lo 8`,
    },
    {
      h: '⚠️ Gotchas',
      body: [
        'Lekapoyina key = undefined (error kaadu).',
        'Inko step lopaliki vellithe? data.result ledu ante data.result.number: nee PDI (global scope) lo undefined meeda property chadivina error RAADU — silent ga undefined vastundi (check chesam). null meeda ayithe matrame error: TypeError: Cannot read property "number" from null. Ee sandbox (browser) lo undefined ki kuda TypeError vastundi.',
        'Error raakapovadam manchidi kaadu — script tappu value (undefined) tho continue avtundi. Anduke mundu if (data.result) tho check chey — PDI lo, sandbox lo rendu chotla safe.',
        'JSON.parse invalid text ki error throw chestundi — integrations lo try / catch tho pattuko.',
      ],
      code: `var o = { a: 1 };
gs.info(o.b);                 // undefined
gs.info(typeof o.b === 'undefined');   // true

var data = {};
// gs.info(data.result.number);   // nee PDI: undefined (error raadu) | sandbox: TypeError
if (data.result) {                // ✅ mundu check — rendu chotla safe
  gs.info(data.result.number);
}`,
    },
  ],
  quiz: [
    q('var o = { a: 1 }; gs.info(o.b); — em vastundi?', ['undefined', 'null', 'Error', '0'], 0, 'Lekapoyina key undefined istundi.'),
    q('JSON.parse() em chestundi?', ['JSON text ni object ga marchutundi', 'Object ni text ga marchutundi', 'Object ni delete chestundi', 'Array sort chestundi'], 0, 'parse = text → object. stringify = object → text.'),
    q('Object.keys({ x: 1, y: 2 }).length — result?', ['2', '1', 'x', 'undefined'], 0, 'Keys array ["x","y"], length 2.'),
    q('gs.info({ a: 1 }) — em print avtundi?', ['[object Object]', '{"a":1}', 'a', '1'], 0, 'Object ni log cheyyalante JSON.stringify vaadali.'),
    q('delete obj.state — em chestundi?', ['state property ni teesesthundi', 'state value ni 0 ga marchutundi', 'obj object ni poorthiga delete chestundi', 'Database lo state field ni clear chestundi'], 0, 'delete property ni object nundi teesesthundi (obj.state tarvata undefined). Database ki em sambandham ledu — idi JavaScript object matrame.'),
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
      tests: [
        { label: 'Logs: INC0010002, New', logs: ['INC0010002', 'New'] },
        { label: 'payload lo number, state, priority (number 1)', expr: '[payload.number, payload.state, payload.priority]', expect: ['INC0010002', 'New', 1] },
      ],
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
      tests: [
        { label: 'Log: number,priority,assigned_to', logs: ['number,priority,assigned_to'] },
        { label: 'assigned_to added, state poyindi', expr: "[payload.assigned_to, 'state' in payload]", expect: ['Abel Tuter', false] },
      ],
    }),
    // ---- Ladder (array order = doing order): 6 → 5 → 3 build JSON payloads, 7 → 4 the counter idea ----
    jx('js-objects', 6, 'Property undaa? (hasOwnProperty)', 'medium', {
      task: 'payload = { number: "INC0010002", priority: 1 } undi. assigned_to undaa ani hasOwnProperty tho check chesi log chey (false). Tarvata assigned_to = "Abel Tuter" add chesi malli check chesi log chey (true). 🧰 Vaade words: hasOwnProperty(), property add',
      starter: `var payload = { number: 'INC0010002', priority: 1 };

// TODO: payload lo assigned_to key undaa? check chesi log chey  (false vastundi)

// TODO: assigned_to = 'Abel Tuter' add chey

// TODO: malli check chesi log chey  (ippudu true)
`,
      hint: [
        'Object lo oka key undaa ani adagadaniki oka method undi. Mundu check, tarvata add, malli check.',
        'payload.hasOwnProperty("assigned_to") true/false istundi — gs.info lo pettu.',
        'gs.info(payload.hasOwnProperty("assigned_to"));   payload.assigned_to = "Abel Tuter";   gs.info(payload.hasOwnProperty("assigned_to"));',
      ],
      solution: `var payload = { number: 'INC0010002', priority: 1 };
gs.info(payload.hasOwnProperty('assigned_to'));
payload.assigned_to = 'Abel Tuter';
gs.info(payload.hasOwnProperty('assigned_to'));`,
      explain: 'hasOwnProperty("key") object lo aa key undaa ledaa true/false istundi. Missing key ni access chesthe undefined vastundi — adi gurtu pettuko.',
      tests: [
        { label: 'Logs: false, true', logs: ['false', 'true'] },
        { label: 'payload.assigned_to = Abel Tuter', expr: 'payload.assigned_to', expect: 'Abel Tuter' },
      ],
    }),
    jx('js-objects', 5, 'current nundi object build chey', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010071', state: '2', priority: '3' } } },
      task: 'current nundi number, state teesukoni { number, state } object (payload) create chey. JSON.stringify(payload) log chey → {"number":"INC0010071","state":"2"}. 🧰 Vaade words: current, getValue(), object { key: value }, JSON.stringify()',
      starter: `// TODO: payload = { number: ..., state: ... }  (values: current.getValue(...))
var payload;

gs.info(JSON.stringify(payload));
`,
      hint: [
        'Object lo key peru nuvve pedatav; value kosam current nundi field teesuko.',
        'Shape: { number: <current nundi number>, state: <current nundi state> } — values ki getValue vaadu.',
        'var payload = { number: current.getValue("number"), state: current.getValue("state") };',
      ],
      solution: `var payload = { number: current.getValue('number'), state: current.getValue('state') };
gs.info(JSON.stringify(payload));`,
      explain: 'Object values ga getValue() results pettochu. Ila build chesina object ni REST call ki body ga pampistam.',
      tests: [
        { label: 'Log: {"number":"INC0010071","state":"2"}', logs: ['{"number":"INC0010071","state":"2"}'] },
        { label: 'payload.number = INC0010071', expr: 'payload.number', expect: 'INC0010071' },
      ],
      variants: [
        {
          name: 'vere record (INC0010072, state 6)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010072', state: '6', priority: '4' } } },
          tests: [{ label: 'Log: {"number":"INC0010072","state":"6"}', logs: ['{"number":"INC0010072","state":"6"}'] }],
        },
      ],
    }),
    jx('js-objects', 3, 'REST response parse & build', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010075', short_description: 'Integration test', state: '1', description: '{"result":{"number":"INC0010009","state":"1"}}' } } },
      task: 'Integration nundi vachina JSON TEXT current.description lo undi: {"result":{"number":"INC0010009","state":"1"}}. JSON.parse chesi data lo pettu, data.result.number log chey. Tarvata { number: <data lo number>, state: "2" } object build chesi JSON.stringify tho log chey.',
      starter: `// Integration response (JSON TEXT) description field lo undi
var response = current.getValue('description');

// TODO: data = response ni object ga marchu
var data;
gs.info(data.result.number);

// TODO: { number: <data lo number>, state: '2' } object build chesi, text ga marchi log chey
`,
      hint: [
        'Rendu direction lu: text → object (parse), object → text (stringify). Response lo "result" ane key lopala data undi.',
        'JSON.parse(response) object istundi; number kosam data.result.number. Kotha object ni text ga marchadaniki JSON.stringify(...).',
        'var data = JSON.parse(response);   gs.info(JSON.stringify({ number: data.result.number, state: "2" }));',
      ],
      solution: `var response = current.getValue('description');

var data = JSON.parse(response);
gs.info(data.result.number);

gs.info(JSON.stringify({ number: data.result.number, state: '2' }));`,
      explain: 'ServiceNow Table API response ila {"result": ...} format lo vastundi. parse tho object, stringify tho text. Number data nundi teesukunnam (hardcode kaadu) — kabatti vere response vachina pani chestundi.',
      tests: [
        { label: 'Logs: INC0010009 & JSON text', logs: ['INC0010009', '{"number":"INC0010009","state":"2"}'] },
        { label: 'data oka object (data.result.state = "1")', expr: 'data.result.state', expect: '1' },
      ],
      variants: [
        {
          name: 'vere response (INC0010042)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010076', short_description: 'Integration test 2', state: '1', description: '{"result":{"number":"INC0010042","state":"3"}}' } } },
          tests: [{ label: 'Logs: INC0010042 & JSON text', logs: ['INC0010042', '{"number":"INC0010042","state":"2"}'] }],
        },
      ],
    }),
    jx('js-objects', 7, 'Object ni counter ga vaadu', 'medium+', {
      task: 'Moodu categories: "network", "software", "network". counts = {} lo prathi category ki counts[cat] = (counts[cat] || 0) + 1 vaadi count chey. JSON.stringify(counts) log chey → {"network":2,"software":1}. 🧰 Vaade words: object, bracket notation counts[cat], ||',
      starter: `var counts = {};

var cat = 'network';
counts[cat] = (counts[cat] || 0) + 1;     // modati sari: counts[cat] undefined → 0 + 1

// TODO: cat = 'software' pettu, adey pattern malli
// TODO: cat = 'network' pettu, adey pattern malli

gs.info(JSON.stringify(counts));
`,
      hint: [
        'Modati line lo pattern ready ga undi. Cat value maarchi ade line malli rendu sarlu rayyi.',
        '(counts[cat] || 0) = key ledhante 0 tho start avtundi, undhante unna count. Cat maarchi, ade line repeat.',
        'cat = "software"; counts[cat] = (counts[cat] || 0) + 1;   — tarvata cat = "network" tho kuda.',
      ],
      solution: `var counts = {};

var cat = 'network';
counts[cat] = (counts[cat] || 0) + 1;

cat = 'software';
counts[cat] = (counts[cat] || 0) + 1;

cat = 'network';
counts[cat] = (counts[cat] || 0) + 1;

gs.info(JSON.stringify(counts));`,
      explain: 'Bracket notation lo variable key vaadochu. (counts[cat] || 0) trick "Category count" exercise lo loop lo vaadatham — ikkada loop lekunda manually chusam.',
      tests: [
        { label: 'Log: {"network":2,"software":1}', logs: ['{"network":2,"software":1}'] },
        { label: 'network = 2, software = 1', expr: '[counts.network, counts.software]', expect: [2, 1] },
      ],
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
      hint: [
        'Records meeda loop (while gr.next()). Prathi round lo category teesuko, counts object lo aa key count ni 1 penchu ("Object ni counter ga vaadu" lo chesav).',
        'var cat = gr.getValue("category");   counts[cat] = (counts[cat] || 0) + 1;',
        "while (gr.next()) { var cat = gr.getValue('category'); counts[cat] = (counts[cat] || 0) + 1; }",
      ],
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
      variants: [
        {
          name: 'inko network + oka security incident',
          scenario: {
            seed: {
              incident: [
                { number: 'INC0010009', short_description: 'Wi-Fi drops in Hyderabad office', category: 'network' },
                { number: 'INC0010010', short_description: 'Phishing email reported', category: 'security' },
              ],
            },
          },
          tests: [
            { label: 'Category counts (network 3, security 1)', logs: ['{"software":2,"network":3,"hardware":1,"database":2,"inquiry":1,"security":1}'] },
            { label: 'network = 3', expr: 'counts.network', expect: 3 },
          ],
        },
      ],
    }),
  ],
}

export const LESSONS_JS_B = [operators, strings, arrays, objects]
