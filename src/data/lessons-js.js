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
        'ServiceNow fields anni JavaScript lo ee types ga vastayi: string (text), number, boolean (true/false), null (value ledu), undefined (variable ki value pettaledu), array (list), object ({ key: value }).',
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
        'let = marchagalige value, const = marchaleni value. Tested on our PDI: const default ga work avtundi, kaani let ki "ES12 mode" on cheyyali (lekapothe "let is an ECMAScript 6 feature - not supported" error vastundi). Nee instance lo kuda ila check cheyyi.',
        'Peru camelCase lo pettu: shortDesc, assignedTo, incNumber. Space ledha "-" pettakudadu.',
      ],
      terms: ['var', 'let', 'const'],
      code: `var incNumber = 'INC0010002';
var priority = 1;
priority = 2;                       // marchochu

const table = 'incident';           // const: marchaleru (PDI lo default ga work avtundi)
// ES12 mode lo matrame:
// let count = 0;                   // let: marchochu`,
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
        'current = ServiceNow ready ga ichche record. Business Rule lo form lo unna record already current lo untundi — new GlideRecord avasaram ledu. current kuda GlideRecord ye, kabatti same methods (getValue, setValue, update...) work avtayi.',
        'Thumb rule: "record ni nenu vethakali" → new GlideRecord + get / query. "Ee form / Business Rule lo unna record meeda pani" → current.',
        'Field meeda em pani kavali? Value kavali → current.getValue("priority") (string vastundi). Value marchali → current.setValue("priority", 1). Field ki special pani (marindaa? empty ah? display name?) → current.priority.changes(), current.assigned_to.nil(), current.assigned_to.getDisplayValue() — ikkada current.priority oka GlideElement object (string kaadu), anduke daaniki ee special methods untayi.',
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
      h: '⚠️ ServiceNow gotcha: getValue() string istundi',
      body: [
        'Chala important! gr.getValue("priority") ela use chesina "1" (STRING) vastundi — number kaadu. Anduke "1" + 1 = "11" avtundi.',
        'Number ga marchali ante Number(...) ledha parseInt(..., 10) vaadu.',
      ],
      terms: ['getValue', 'Number()', 'parseInt', 'String()'],
      code: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');

var p = gr.getValue('priority');    // '1'  (string!)
gs.info(p + 1);                     // 11   (text joining)
gs.info(Number(p) + 1);             // 2    (correct)`,
    },
    {
      h: '🔎 Ee words nuvve ela kanukkovali?',
      body: [
        'Anni words memorize cheyyakkarledu. Modata 10 chalu: GlideRecord, new, query, next, get, getValue, setValue, update, addQuery, gs.info. Migilavi avasaram vachinappudu vethuko.',
        '1) Official docs: developer.servicenow.com lo API Reference → Server APIs lo "GlideRecord" (leka GlideSystem, GlideElement) open chey. Prathi method ki explanation + example untundi — "ee pani ki ye method?" ani ikkade vethakochu. (Menu peru release batti maaradam undochu — nee PDI / site lo confirm chesuko.)',
        '2) Autocomplete: real ServiceNow script editor lo "gr." type chesi aagite (leka Ctrl + Space) available methods list vastundi. Peru gurtu lekapoyina list lo chusi pick cheyochu. (Memory nundi rasanu — nee PDI lo try chesi confirm chey.)',
        '3) Oka line ardham kakapothe mukkalu chesi chudu: prathi word "JavaScript worda? ServiceNow worda?" ani adugu. Kinda example.',
      ],
      terms: ['GlideRecord', 'new', 'query', 'next', 'get', 'getValue', 'setValue', 'update', 'addQuery', 'gs.info'],
      code: `var gr = new GlideRecord('incident');
//  |   |   |           |
//  |   |   |           table peru (database name)
//  |   |   ServiceNow tool (class) — table tho matladataniki
//  |   JavaScript word: "kotha object create chey"
//  nuvvu pettina peru (variable)`,
    },
  ],
  quiz: [
    q('gr.getValue("priority") eppudu em type istundi?', ['string', 'number', 'boolean', 'array'], 0, 'getValue ellappudu string istundi — "1". Calculation kosam Number() tho marchali.'),
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
      hint: 'Lopala nundi: gr.getValue("priority") mundu string istundi ("2"), tarvata Number(p) + 1. Number() lekapothe "2" + 1 = "21" avtundi.',
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
      hint: 'Value kavali kabatti current.getValue("number") (current.number kaadu — adi object). Priority ni Number(current.getValue("priority")) ga marchu. Message: gs.info("Escalating " + number + " (P" + priority + "): " + shortDesc);',
      solution: `var number = current.getValue('number');
var priority = Number(current.getValue('priority'));
var shortDesc = current.getValue('short_description');

gs.info('Escalating ' + number + ' (P' + priority + '): ' + shortDesc);

var newPriority = priority - 1;
current.setValue('priority', newPriority);

gs.info('New priority: ' + current.getValue('priority'));`,
      explain: 'Strings + variables ni + tho join chesi message build chestam. setValue(field, value) record lo field ni marchutundi (real BR lo before-rule ayithe update() avasaram ledu).',
      tests: [
        { label: 'Logs: Escalating… & New priority: 1', logs: ['Escalating INC0010050 (P2): Payroll job failed', 'New priority: 1'] },
        { label: 'current priority = "1"', expr: "current.getValue('priority')", expect: '1' },
        { label: 'newPriority oka number', expr: 'typeof newPriority', expect: 'number' },
      ],
    }),
  ],
}

// order = the Udemy video order
// each lesson's quiz = its original 5 questions + the extra ones from quiz-extra-js.js (20 total)
export const JS_LESSONS = [basics, ...LESSONS_JS_B, ...LESSONS_JS_C].map((l) => ({ stage: 2, section: 'JavaScript', ...l, quiz: [...l.quiz, ...(QUIZ_EXTRA_JS[l.id] || [])] }))
