// Stage 2 · JavaScript — taught ONLY through ServiceNow scenarios (gs, GlideRecord, current, incidents).
// A lesson = Learn cards + predict-the-output quiz + coding exercises run in the browser sandbox (src/js).
import { q, jx } from './lessonKit.js'
import { LESSONS_JS_B } from './lessons-js-b.js'
import { LESSONS_JS_C } from './lessons-js-c.js'
import { QUIZ_EXTRA_JS } from './quiz-extra-js.js'

/* 1 — Comments, data types, variables */
const basics = {
  id: 'js-basics',
  title: 'Comments, Data Types & Variables',
  video: 'Javascript comenting, Data Types, Variable declaration',
  duration: '',
  blurb: 'Business Rule header comments, string / number / boolean, var — incident field values tho.',
  learn: [
    {
      h: '💬 Comments — code ki notes',
      body: [
        'Comment ante script lo nuvvu rasukune notes. Script run ayinappudu ee lines ignore avtayi.',
        'ServiceNow lo Business Rules, Script Includes, Client Scripts anni mundu oka comment header tho start avtayi — "ee script em chestundi?" ani. Team lo evaraina chadivite ardham avvali.',
      ],
      code: `// Idi single-line comment

/* Idi multi-line comment —
   konchem ekkuva rayalante */

/**
 * Business Rule: Set P1 flag on critical incidents
 * Table: incident   When: before insert
 * Author: Ravi   Date: 2026-11-12
 */`,
    },
    {
      h: '🧱 Data types — values em types untayi',
      body: [
        'JavaScript lo values ee types lo untayi: string (text), number, boolean (true/false), null (value ledu), undefined (variable ki value pettaledu), array (list), object ({ key: value }). (ServiceNow field value ni getValue() tho teesukunte eppudu string — field empty ayithe null. Ee lesson lo kinda "getValue gotcha" card chudu.)',
        'typeof tho oka value type chudochu.',
        '⚠️ Gotcha: typeof null = "object" ani vastundi! Idi JavaScript lo pateka (old) quirk — null nijanga object kaadu, "value ledu" ane artham. Anduke value null ah ani check cheyyalante typeof kaadu, === null vaadali. (Array kuda typeof tho "object" ani vastundi.)',
      ],
      terms: ['typeof', 'null', 'undefined', '==='],
      code: `var number = 'INC0010002';          // string
var priority = 1;                   // number
var active = true;                  // boolean
var assignedTo = null;              // null = evaru ledu
var notSet;                         // undefined
var tags = ['vpn', 'network'];      // array
var caller = { name: 'Abel Tuter', vip: false };  // object

gs.info(typeof priority);           // number
gs.info(typeof number);             // string
gs.info(typeof assignedTo);         // object  (null ki kuda "object" vastundi — JS quirk!)
gs.info(assignedTo === null);       // true    (null check ki idi vaadu)`,
    },
    {
      h: '📦 Variables — var, let, const',
      body: [
        'Variable = value ni store chese box. "var" tho declare chestam. Classic ServiceNow scripts anni "var" vaadatayi — mundu ide nerchuko.',
        'const = marchaleni value — nee PDI Background Script lo pani chestundi (check chesam). let mathram pani cheyyadu: "let is an ECMAScript 6 feature - not supported" ane SyntaxError vastundi. Anduke marche values ki var vaadu.',
        'Background Script lo (nee PDI, global scope — check chesam) — ✅ pani chestayi: const, arrow functions (x => x * 2), template literals (`INC${n}`), includes / startsWith / padStart, Object.entries / Object.values / Object.assign. ❌ SyntaxError istayi: let, destructuring (var { a } = obj), spread (...arr), class, default parameter values (function f(a = 1)), for…of. Ee sandbox (browser) avi anni accept chestundi, kani warning chupistundi — PDI ki copy chese mundu chusuko.',
        'ES12 mode (nee PDI lo check chesam): Business Rule, Script Include laanti forms lo Script field daggara "Turn on ECMAScript 2021 (ES12) mode" ane toggle untundi — prathi script ki separate, global scope lo kuda. Adi ON chesina AA script lo matrame let, class laantivi allow avtayi. Background Script ki ee toggle ledu (paina ❌ list akkade check chesam). Scoped app ki app-level "JavaScript Mode" untundi: Compatibility Mode / ES5 Standards Mode / ECMAScript 2021 (ES12).',
        'Ee course lo classic style (var, function) rastam — adi anni chotla pani chestundi: Background Script, ES12 mode ON / OFF scripts, old scripts.',
        'Peru camelCase lo pettu: shortDesc, assignedTo, incNumber. Space ledha "-" pettakudadu.',
      ],
      terms: ['var', 'let', 'const'],
      code: `var incNumber = 'INC0010002';
var priority = 1;
priority = 2;                       // marchochu

const table = 'incident';           // const: marchaleru (nee PDI lo pani chestundi)
// let count = 0;                   // ❌ Background Script lo SyntaxError (ES12 mode ledu) — var vaadu`,
    },
    {
      h: '🖨 gs.info — result ela chudali?',
      body: [
        'Server script lo console ledu. gs.info("...") tho log lo print chestam. Real instance lo ide "System Logs → System Log → Script Log Statements" lo kanipistundi. SnowKeer lo kinda "Script Log" panel lo.',
        '{0} placeholder tho values pettochu: gs.info("Hello {0}", name).',
      ],
      terms: ['gs', 'gs.info', 'gs.warn', 'gs.error'],
      code: `var name = 'Abel';
gs.info('Hello ' + name);           // Hello Abel
gs.info('Hello {0}, priority {1}', name, 1);`,
    },
    {
      h: '🖥 Ee scripts nee PDI lo ekkada run cheyyali?',
      body: [
        'SnowKeer lo Run = browser sandbox: practice data (8 incidents), em marchina save avvadu, prathi Run fresh ga start avtundi.',
        'Nee PDI lo: All → System Definition → Scripts - Background. Page lo pedda script editor (Monaco — VS Code laantidi) untundi. Script paste chesi "Run Script" button click chey. Result page lo gs.info output "*** Script: <nee text>" ani kanipistundi.',
        'Aa page lo scope picker kuda untundi — ee course lo "global" undali. "Record for rollback?" box default ga tick ayi untundi — alaage unchu (peru batti: ee run chesina marpulanu record chestundi, avasaram ayithe venakki teesukovadaniki).',
        '⚠️ Kani rollback meeda aadharapadaku: Background Script lo update(), insert(), deleteRecord() nee PDI data ni NIJANGA marchestayi (sandbox laaga "fresh start" ledu). Mundu gs.info matrame unna (read-only) scripts tho try chey. Marche script ayithe mundu getRowCount() tho entha records match avtayo chusuko.',
      ],
      code: `// Scripts - Background lo paste chesi "Run Script" — idi read-only, safe
var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.query();
gs.info('Active incidents: ' + gr.getRowCount());
// Output:  *** Script: Active incidents: <nee PDI lo entha unnayo>`,
    },
    {
      h: '🧰 ServiceNow words — "new GlideRecord" ante enti?',
      body: [
        'Script lo rendu rakala words untayi. (1) JavaScript words — var, new, if, for, function: ivi JavaScript lo untayi. (2) ServiceNow words — GlideRecord, gs, current, getValue, setValue: ivi ServiceNow isse built-in tools. Mundu ee rendu difference telusukunte confusion undadu.',
        'Ee card lo "new", "GlideRecord", "gs", "gr" laanti words meanings kinda sub-box lo unnayi (📘). Vaatini chadivi, tarvata code chudu.',
        'Server script lo almost eppudu ide 5-step pattern: table open → record load → value chadavadam → value marchadam → save.',
      ],
      terms: ['new', 'GlideRecord', 'gs', 'gr', 'get', 'getValue', 'setValue', 'update'],
      code: `var gr = new GlideRecord('incident');    // 1. table open  (new = JS word, GlideRecord = ServiceNow tool)
gr.get('number', 'INC0010004');           // 2. number = INC0010004 unna record load
gs.info(gr.getValue('priority'));         // 3. field value chadavadam  (string vastundi)
gr.setValue('priority', 1);               // 4. value marchadam (memory lo matrame)
gr.update();                              // 5. database lo save (idi lekapothe marpu save avvadu)`,
    },
    {
      h: '🎯 gr vs current — ekkada edi vaadali?',
      body: [
        'gr = nuvve create chesina record object (new GlideRecord(...)). Background Script, Script Include, Scheduled Job laanti chotla nuvvu table open chesi record teeskovali — appudu gr (leka nuvvu pettina peru).',
        'current = ServiceNow ready ga ichche record. Business Rule lo form lo unna record already current lo untundi — new GlideRecord avasaram ledu. current kuda GlideRecord ye, kabatti same methods (getValue, setValue...) work avtayi.',
        '⚠️ Business Rule lo current.update() rayakudadhu: same record malli save avtundi → Business Rules malli run avtayi (recursion, instance slow). Before Business Rule lo current.setValue(...) chalu — save ServiceNow ye chestundi.',
        'Thumb rule: "record ni nenu vethakali" → new GlideRecord + get / query. "Ee form / Business Rule lo unna record meeda pani" → current.',
        'Field meeda em pani kavali? Value kavali → current.getValue("priority") (string vastundi; field empty ayithe null). Value marchali → current.setValue("priority", 1). Field ki special pani (marindaa? empty ah? display name?) → current.priority.changes(), current.assigned_to.nil(), current.assigned_to.getDisplayValue() — ikkada current.priority oka GlideElement object (string kaadu), anduke daaniki ee special methods untayi.',
        'Gurtu: value teesukovadaniki method peru getValue("number") — getRecord("number") laanti peru kaadu. Doubt vaste mundu "value kavala? marchala? special pani ah?" ani adugu.',
      ],
      terms: ['current', 'GlideRecord', 'gr', 'GlideElement', 'getValue', 'setValue', 'changes', 'nil', 'getDisplayValue'],
      code: `// Business Rule lo — current ready ga undi
var num = current.getValue('number');        // value (string)
current.setValue('priority', 1);             // value marchadam
if (current.priority.changes()) {            // field meeda special pani
  gs.info('Priority marindi');
}

// Background Script lo — current ledu, nuvve teeskovali
var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');
gs.info(gr.getValue('number'));`,
    },
    {
      h: '⚠️ ServiceNow gotcha: getValue() em istundi?',
      body: [
        'Chala important! gr.getValue("priority") "1" (STRING) istundi — number kaadu. Anduke "1" + 1 = "11" avtundi. Number ga marchali ante Number(...) ledha parseInt(..., 10) vaadu.',
        'True/false field (active) ki getValue "1" / "0" istundi — "true" / "false" kaadu! Check cheyyadaniki: gr.getValue("active") === "1" leka gr.active == true. (gr.active == "true" FALSE istundi — nee PDI lo check chesam.)',
        'Field EMPTY ayithe getValue null istundi (empty string kaadu) — gs.info(null) "null" ani print chestundi. "Empty aa?" ani adagadaniki gr.assigned_to.nil() leka gs.nil(gr.assigned_to) vaadu.',
      ],
      terms: ['getValue', 'Number()', 'parseInt', 'nil', 'gs.nil'],
      code: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');

var p = gr.getValue('priority');      // '1'  (string!)
gs.info(p + 1);                       // 11   (text joining)
gs.info(Number(p) + 1);               // 2    (correct)

gs.info(gr.getValue('active'));       // 1    (true/false field → '1' / '0')
gs.info(gr.active == true);           // true
gs.info(gr.getValue('assigned_to'));  // null (empty field)
gs.info(gr.assigned_to.nil());        // true (empty aa? — safe check)`,
    },
    {
      h: '🔎 Ee words nuvve ela kanukkovali?',
      body: [
        'Anni words memorize cheyyakkarledu. Modata 10 chalu: GlideRecord, new, query, next, get, getValue, setValue, update, addQuery, gs.info. Migilavi avasaram vachinappudu vethuko.',
        '1) Official docs: developer.servicenow.com lo API Reference → Server APIs lo "GlideRecord" (leka GlideSystem, GlideElement) open chey. Prathi method ki explanation + example untundi — "ee pani ki ye method?" ani ikkade vethakochu. (Menu peru release batti maaradam undochu — nee PDI / site lo confirm chesuko.)',
        '2) Autocomplete: nee PDI lo script editors anni (Scripts - Background, Business Rule / Script Include lo Script field) Monaco editor — Ctrl + Space press chesthe suggestions list vastundi (check chesam). "gr." type chesaka GlideRecord methods kuda aa list lo vastayi ani docs — ⚠️ PDI lo try chesi confirm chesuko. Peru gurtu lekapoyina list lo chusi pick cheyochu.',
        '3) Oka line ardham kakapothe mukkalu chesi chudu: prathi word "JavaScript worda? ServiceNow worda?" ani adugu. Kinda example.',
      ],
      terms: ['GlideRecord', 'new', 'query', 'next', 'get', 'getValue', 'setValue', 'update', 'addQuery', 'gs.info'],
      code: `var gr = new GlideRecord('incident');
//  |   |   |           |
//  |   |   |           table peru (database name)
//  |   |   ServiceNow tool (class) — table tho matladataniki
//  |   JavaScript word: "kotha object create chey"
//  nuvvu pettina peru (variable)`,
      checks: ['monaco-suggest'],
    },
  ],
  quiz: [
    q('Priority 1 unna record lo gr.getValue("priority") em istundi?', ["'1' (string)", '1 (number)', 'true (boolean)', "['1'] (array)"], 0, 'Value unte getValue STRING istundi — "1". Calculation kosam Number() tho marchali. (Field empty ayithe null.)'),
    q('var p = "1"; gs.info(p + 1); — em print avtundi?', ['2', '11', 'NaN', 'Error'], 1, '"1" string, kabatti + text join chestundi → "11". Number(p) + 1 ayithe 2.'),
    q('Idi lo edi valid single-line comment?', ['// Business Rule peru', '# Business Rule peru', '-- Business Rule peru', '<!-- Business Rule peru -->'], 0, 'JavaScript lo // tho single-line comment start avtundi.'),
    q('var x; gs.info(typeof x); — em vastundi?', ['null', 'string', 'undefined', 'object'], 2, 'Value pettani variable = undefined.'),
    q('gs.info() messages real instance lo ekkada chudali?', ['System Logs → Script Log Statements', 'Incident form lo Activity section lo', 'Update Set lo Customer Updates lo', 'Dictionary lo field Messages lo'], 0, 'System Log → Script Log Statements (System Logs menu).'),
  ],
  exercises: [
    jx('js-basics', 1, 'Incident number ni log chey', 'easy', {
      task: 'Oka comment (script em chestundo) rayyi. Tarvata variable incNumber lo "INC0012345" pettu, gs.info tho aa value ni log chey.',
      starter: `// TODO: ikkada comment rayyi (e.g. Business Rule: Log incident number)

// TODO: var incNumber lo 'INC0012345' pettu

// TODO: gs.info tho incNumber ni log chey
`,
      hint: 'var incNumber = \'INC0012345\'; tarvata gs.info(incNumber);',
      solution: `// Business Rule: Log incident number
var incNumber = 'INC0012345';
gs.info(incNumber);`,
      explain: 'String values ni quotes lo rayali. gs.info(variable) variable lo unna value ni log chestundi.',
      tests: [
        { label: 'Log lo INC0012345 print ayyindi', logs: ['INC0012345'] },
        { label: 'incNumber ane string variable undi', expr: 'typeof incNumber', expect: 'string' },
        { label: 'incNumber lo value INC0012345', expr: 'incNumber', expect: 'INC0012345' },
      ],
    }),
    jx('js-basics', 2, 'Data types gurtupattu', 'easy', {
      task: 'Moodu variables create chey: shortDesc = "VPN is down" (string), priority = 1 (number), isActive = true (boolean). Prathidaniki typeof log chey — ade order lo. Tarvata assignedTo = null ane variable kuda pettu.',
      starter: `// TODO: shortDesc, priority, isActive variables create chey

// TODO: prathidi typeof tho gs.info lo log chey (order: shortDesc, priority, isActive)

// TODO: var assignedTo = null;
`,
      hint: 'gs.info(typeof shortDesc);  — ila moodu sarlu. Quotes lo ledhu, typeof ki pakkana variable peru.',
      solution: `var shortDesc = 'VPN is down';
var priority = 1;
var isActive = true;

gs.info(typeof shortDesc);
gs.info(typeof priority);
gs.info(typeof isActive);

var assignedTo = null;`,
      explain: 'Text = string, 1 = number, true = boolean. null = "value ledu" (assigned_to empty unnappudu laaga).',
      tests: [
        { label: 'typeof logs: string, number, boolean', logs: ['string', 'number', 'boolean'] },
        { label: 'shortDesc, priority, isActive values correct', expr: '[shortDesc, priority, isActive]', expect: ['VPN is down', 1, true] },
        { label: 'assignedTo = null', expr: 'assignedTo === null', expect: true },
      ],
    }),
    jx('js-basics', 3, 'getValue gotcha: priority + 1', 'medium', {
      task: 'INC0010004 incident teesuko (GlideRecord tho). Daani priority ni getValue tho p lo petti, Number ga marchi 1 add chesi nextP lo pettu. Chivarlo gs.info("Next priority: " + nextP) tho log chey. (Priority 2 undi → 3 ravali) 🧰 Vaade words: GlideRecord, get(), getValue(), Number() — Learn tab lo "ServiceNow words" card chudu.',
      starter: `// new GlideRecord('incident') = incident table open chese cursor
var gr = new GlideRecord('incident');
// gr.get('number', 'INC0010004') = number INC0010004 unna record ni load chestundi
gr.get('number', 'INC0010004');

// TODO: p lo gr.getValue('priority') pettu  (value kavali kabatti getValue — idi STRING!)
var p;

// TODO: nextP = p ni number ga marchi + 1
var nextP;

gs.info('Next priority: ' + nextP);
`,
      hint: [
        'Priority value ni record nundi teesukovali — daaniki oka method undi. Tarvata aa value tho calculation chestunnav, so type gurtuku pettuko.',
        'gr.getValue("priority") istundi value — kani adi STRING ("2"). Number(...) tho number ga marchu.',
        'var p = gr.getValue("priority");   var nextP = Number(p) + 1;',
      ],
      solution: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010004');

var p = gr.getValue('priority');
var nextP = Number(p) + 1;

gs.info('Next priority: ' + nextP);`,
      explain: 'getValue string istundi ("2"). Number() lekunda + chesthe text join avtundi ("21"). Always convert chesi calculate chey.',
      tests: [
        { label: 'Log: Next priority: 3', logs: ['Next priority: 3'] },
        { label: 'p oka string', expr: 'typeof p', expect: 'string' },
        { label: 'nextP oka number', expr: 'typeof nextP', expect: 'number' },
      ],
      variants: [
        {
          name: 'INC0010004 priority 3 ayithe',
          scenario: { seed: { incident: [{ sys_id: 'inc4', priority: '3' }] } },
          tests: [
            { label: 'Log: Next priority: 4', logs: ['Next priority: 4'] },
            { label: 'nextP = 4', expr: 'nextP', expect: 4 },
          ],
        },
      ],
    }),
    // ---- Medium+ ladder: one new idea at a time, building up to 'Incident escalate chey (current)' (array order = doing order) ----
    jx('js-basics', 5, 'current nundi okka field teesuko', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010051', priority: '3', short_description: 'VPN is down', state: '1' } } },
      task: 'Business Rule lo laaga `current` record undi. Daani nundi number field teesukuni, number ane variable lo pettu. Tarvata gs.info tho aa number ni log chey. 🧰 Vaade words: current, getValue() — Learn tab lo "gr vs current" card chudu.',
      starter: `// current = ServiceNow ready ga ichina record (new GlideRecord avasaram ledu)
// Value kavali → current.getValue('field_name')
var number;   // TODO: current nundi number teesuko

// TODO: number ni gs.info tho log chey
`,
      hint: [
        'current lo nundi oka field value kavali — "Value kavali" ante ye method vaadali? (starter lo comment chudu)',
        'current.getValue("number") — field peru quotes lo ivvali.',
        'var number = current.getValue("number");   gs.info(number);',
      ],
      solution: `var number = current.getValue('number');
gs.info(number);`,
      explain: 'current.getValue("field") field value ni (string ga) istundi. current.number ane object kaadu — text kavali kabatti getValue vaadali.',
      tests: [
        { label: 'Log: INC0010051', logs: ['INC0010051'] },
        { label: 'number oka string', expr: 'typeof number', expect: 'string' },
      ],
      variants: [
        {
          name: 'vere record (INC0010099)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010099', priority: '2', short_description: 'Disk full', state: '1' } } },
          tests: [
            { label: 'Log: INC0010099', logs: ['INC0010099'] },
            { label: 'number = INC0010099', expr: 'number', expect: 'INC0010099' },
          ],
        },
      ],
    }),
    jx('js-basics', 6, 'Moodu fields tho message build chey', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010052', priority: '1', short_description: 'Email server down', state: '2' } } },
      task: 'current nundi number, priority, short_description teesuko (moodu variables). Tarvata "INC0010052 (P1): Email server down" laaga oka message build chesi log chey. Format: <number> (P<priority>): <shortDesc>. 🧰 Vaade words: current, getValue() — + tho text join chestam.',
      starter: `// Moodu fields teesuko — okkati ela chestavo kinda chupistunna, migatha rendu ade pattern
var number = current.getValue('number');
var priority;    // TODO: current.getValue('priority')
var shortDesc;   // TODO: current.getValue('short_description')

// Message ni + tho join chey: number + ' (P' + priority + '): ' + shortDesc
// TODO: aa message ni gs.info tho log chey
`,
      hint: [
        'Rendu variables empty ga unnayi — number laaga ade pattern vaadi fill chey. Tarvata moodu variables ni oka text lo join chey.',
        'var priority = current.getValue("priority"); — short_description ki kuda ide. Message: number + " (P" + priority + "): " + shortDesc',
        'gs.info(number + " (P" + priority + "): " + shortDesc);',
      ],
      solution: `var number = current.getValue('number');
var priority = current.getValue('priority');
var shortDesc = current.getValue('short_description');

gs.info(number + ' (P' + priority + '): ' + shortDesc);`,
      explain: 'Prathi field ki getValue vaadi, tarvata + tho text, variables ni join chesi message build chestam. Quotes lo unnadi text, quotes lekunda unnadi variable.',
      tests: [
        { label: 'Log: INC0010052 (P1): Email server down', logs: ['INC0010052 (P1): Email server down'] },
        { label: 'priority, shortDesc variables set ayyayi', expr: "priority + '|' + shortDesc", expect: '1|Email server down' },
      ],
      variants: [
        {
          name: 'vere record (INC0010098)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010098', priority: '3', short_description: 'Disk full on DB server', state: '1' } } },
          tests: [{ label: 'Log: INC0010098 (P3): Disk full on DB server', logs: ['INC0010098 (P3): Disk full on DB server'] }],
        },
      ],
    }),
    jx('js-basics', 7, 'Priority ni oka step penchu (setValue)', 'medium+', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010053', priority: '3', short_description: 'Printer offline', state: '1' } } },
      task: 'current lo priority 3 undi. 1) priority variable lo Number ga teesuko. 2) newPriority = priority - 1. 3) current.setValue("priority", newPriority) tho marchu. 4) "New priority: 2" ani log chey. 🧰 Vaade words: current, getValue(), setValue(), Number() — Learn tab lo "getValue gotcha" gurtu techuko.',
      starter: `// Step 1: priority ni Number ga teesuko  (getValue string istundi, Number() number chestundi)
var priority;

// Step 2: newPriority = priority - 1
var newPriority;

// Step 3: current.setValue('priority', newPriority)  — field ni marchadam

// Step 4: gs.info('New priority: ' + current.getValue('priority'))
`,
      hint: [
        'Naalugu steps comments lo unnayi — okko step ki okka line rayyi. Mundu value teesuko, tarvata calculate chey, tarvata marchu, last lo log.',
        'Number(current.getValue("priority")) — number ga. Marchadaniki current.setValue("priority", newPriority).',
        'var priority = Number(current.getValue("priority"));   var newPriority = priority - 1;   current.setValue("priority", newPriority);',
      ],
      solution: `var priority = Number(current.getValue('priority'));

var newPriority = priority - 1;

current.setValue('priority', newPriority);

gs.info('New priority: ' + current.getValue('priority'));`,
      explain: 'getValue → Number() → calculate → setValue. "Incident escalate chey (current)" exercise lo idi main flow. Ikkada message build cheyyalsina avasaram ledu, kabatti simple.',
      tests: [
        { label: 'Log: New priority: 2', logs: ['New priority: 2'] },
        { label: 'current priority = "2"', expr: "current.getValue('priority')", expect: '2' },
        { label: 'newPriority oka number', expr: 'typeof newPriority', expect: 'number' },
      ],
      variants: [
        {
          name: 'priority 4 unna record',
          scenario: { current: { table: 'incident', values: { number: 'INC0010054', priority: '4', short_description: 'Mouse not working', state: '1' } } },
          tests: [
            { label: 'Log: New priority: 3', logs: ['New priority: 3'] },
            { label: 'current priority = "3"', expr: "current.getValue('priority')", expect: '3' },
          ],
        },
      ],
    }),
    jx('js-basics', 4, 'Incident escalate chey (current)', 'hard', {
      scenario: { current: { table: 'incident', values: { number: 'INC0010050', priority: '2', short_description: 'Payroll job failed', state: '2' } } },
      task: 'Business Rule lo laaga `current` record undi (INC0010050, priority 2). 1) number, priority (Number ga), shortDesc variables teesuko. 2) "Escalating INC0010050 (P2): Payroll job failed" ani log chey. 3) newPriority = priority - 1, current.setValue("priority", newPriority). 4) "New priority: 1" ani log chey. 🧰 Vaade words: current, getValue(), setValue(), Number() — Learn tab lo "gr vs current" card chudu.',
      starter: `// current = ServiceNow ready ga ichina record (Business Rule lo laaga) — new GlideRecord avasaram ledu, current kuda GlideRecord ye.
// Value kavali → current.getValue('field')   |   Value marchali → current.setValue('field', value)
var number;
var priority;      // Number ga marchali!
var shortDesc;

// TODO: moodu variables fill chey (current.getValue(...) vaadu)

// TODO: "Escalating <number> (P<priority>): <shortDesc>" log chey

// TODO: newPriority = priority - 1 ; current.setValue('priority', newPriority)

// TODO: 'New priority: ' + current.getValue('priority') log chey
`,
      hint: [
        'Mundu moodu variables fill chey (number, priority, shortDesc) — okko line okko field. Tarvata message build chey, last lo marpu (setValue). Mundu unna Medium+ exercises lo ide practice chesav.',
        'Value kavali kabatti current.getValue("field_name") vaadu (current.number kaadu — adi object). Priority ni Number(...) tho number ga marchu. Message ni "text " + variable + " text" laaga + tho join chey.',
        'var priority = Number(current.getValue("priority"));   gs.info("Escalating " + number + " (P" + priority + "): " + shortDesc);   current.setValue("priority", priority - 1);',
      ],
      solution: `var number = current.getValue('number');
var priority = Number(current.getValue('priority'));
var shortDesc = current.getValue('short_description');

gs.info('Escalating ' + number + ' (P' + priority + '): ' + shortDesc);

var newPriority = priority - 1;
current.setValue('priority', newPriority);

gs.info('New priority: ' + current.getValue('priority'));`,
      explain: 'Strings + variables ni + tho join chesi message build chestam. setValue(field, value) record lo field ni marchutundi. Real Business Rule: before rule lo setValue chalu (update() avasaram ledu); current.update() rasthe Business Rules malli run avtayi (recursion) — vaddu.',
      tests: [
        { label: 'Logs: Escalating… & New priority: 1', logs: ['Escalating INC0010050 (P2): Payroll job failed', 'New priority: 1'] },
        { label: 'current priority = "1"', expr: "current.getValue('priority')", expect: '1' },
        { label: 'newPriority oka number', expr: 'typeof newPriority', expect: 'number' },
      ],
      variants: [
        {
          name: 'vere record (INC0010097, P3)',
          scenario: { current: { table: 'incident', values: { number: 'INC0010097', priority: '3', short_description: 'Disk full', state: '2' } } },
          tests: [
            { label: 'Logs: Escalating INC0010097 (P3)… & New priority: 2', logs: ['Escalating INC0010097 (P3): Disk full', 'New priority: 2'] },
            { label: 'current priority = "2"', expr: "current.getValue('priority')", expect: '2' },
          ],
        },
      ],
    }),
  ],
}

// order = the Udemy video order
// each lesson's quiz = its original 5 questions + the extra ones from quiz-extra-js.js (20 total)
export const JS_LESSONS = [basics, ...LESSONS_JS_B, ...LESSONS_JS_C].map((l) => ({ stage: 2, section: 'JavaScript', ...l, quiz: [...l.quiz, ...(QUIZ_EXTRA_JS[l.id] || [])] }))
