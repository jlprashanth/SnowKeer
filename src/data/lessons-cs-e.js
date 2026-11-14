// Stage 3 — remaining lectures: SN Utils (1), GlideRecord CRUD (9, 10), debugging (13), macros (14), best practices (23), UI Pages / Macros (24–26).
//  mode 'pdi'  → learn cards + quiz + hands-on exercises done in her REAL PDI (scenario / hint / steps / answer / cleanup).
//               Cards show in ARRAY order = doing order: later cards say "Prerequisite: …", and no cleanup deletes something a later
//               card still needs (the last card of a chain does the final cleanup; earlier cards say what to delete if she stops there).
//  others      → code exercises in the browser sandbox (server runner or client runner). Server tests read the table back with a
//               fresh GlideRecord, and `scenario.seed` variants re-run the same code on other data, so a filter that forgets a
//               condition or a hardcoded gs.info fails.
// Facts follow her Brazil PDI (scratchpad pdi-facts): initialize() leaves every field null, a misspelt addQuery field is IGNORED
// (query returns ALL rows), getAggregate() returns a string, ok_type="button" stops a UI Page form posting, GlideModal exists
// (GlideDialogWindow is deprecated), debug modules live under System Diagnostics, SN Utils /tn toggles technical names.
// Round 2 (verified in her PDI): every script editor is Monaco — macros expand with Ctrl+Space → pick → Enter (Tab only inserts a tab);
// Field Watcher is in the classic form ☰ menu ("Enable Field Watcher"), not in Preferences; Scripts - Background has a "Run Script"
// button and "Record for rollback?" (ticked by default); practice INC0010005 is Closed (state 7, inactive).
import { q, jx } from './lessonKit.js'

const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const MSGS = '__msgs.map(function (m) { return m.text })'
// fields of one stored incident (sys_id), read back with a fresh GlideRecord
const DB = (fields, id) => `(function () { var g = new GlideRecord('incident'); g.get('${id}'); return [${fields.map((f) => `g.getValue('${f}')`).join(', ')}]; })()`
// same, but found by number
const BYNUM = (num, fields) => `(function () { var g = new GlideRecord('incident'); g.get('number', '${num}'); return [${fields.map((f) => `g.getValue('${f}')`).join(', ')}]; })()`
// one field of several stored incidents (sys_ids)
const DBS = (field, ids) => `${JSON.stringify(ids)}.map(function (id) { var g = new GlideRecord('incident'); g.get(id); return g.getValue('${field}'); })`
// does each stored incident still exist?
const EXISTS = (ids) => `${JSON.stringify(ids)}.map(function (id) { var g = new GlideRecord('incident'); return g.get(id); })`
// total number of incidents in the table
const TOTAL = "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()"
const SEED = (...rows) => ({ seed: { incident: rows } })
// another active network incident + an inactive (Closed) one — for "active network" filters
const NET_SEED = SEED(
  { sys_id: 'net_new', short_description: 'Wi-Fi drops every hour', category: 'network', state: '1' },
  { sys_id: 'net_old', short_description: 'Old VPN ticket', category: 'network', state: '7', active: 'false' },
)
// a new UI Page / UI Macro starts with this Jelly skeleton — `body` goes INSIDE <j:jelly>
const JELLY = (body) => `<?xml version="1.0" encoding="utf-8" ?>\n<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">\n${body}\n</j:jelly>`

/* 1 — SN Utils */
const snutils = {
  id: 'cs-snutils',
  mode: 'pdi',
  title: 'SN Utils Tools',
  video: 'SN Utils Tools',
  duration: '',
  no: 1,
  blurb: 'Browser extension — slash commands, technical names, Background Script shortcut — dev life ni easy chestundi.',
  learn: [
    {
      h: '🧰 SN Utils ante emiti?',
      body: [
        'SN Utils oka free browser extension (Chrome / Edge / Firefox store lo untundi; Arnoud Kooi rasaru) — ServiceNow developers ki chala shortcuts istundi. ServiceNow official product kaadu, community tool.',
        'Mukhyamaina features: slash commands (keyboard tho ekkadiki aina vellochu), technical names (field / table names) chupinchadam, Background Script shortcut, record ni XML / JSON ga chudadam, same page ni vere instance lo open cheyyadam.',
        'Install: browser extension store lo "SN Utils" search chesi add chey. Extension permissions adugutundi — nee PDI kosam OK, kani office / production instance lo vaade mundu company policy chudu.',
      ],
    },
    {
      h: '⌨️ Slash commands',
      body: [
        'ServiceNow page lo Ctrl + / (Mac lo ⌘ + /) nokkithe "slash window" open avtundi — command type chesi Enter. Table peru type chesthe aa table LIST open avtundi: /incident, /sys_user.',
        'Konni useful commands (snutils.com cheat sheet): /bg (Background Script), /tn (technical names on / off), /xml (open unna record XML), /me (nee user record), /u <name> (users), /br, /cs, /ua, /si <name> (Business Rules / Client Scripts / UI Actions / Script Includes vethukudu), /log <text> (ivvati System Log), /help.',
        'Extension version batti commands marochu — slash window lo vachhe list, /help ye final truth. (SN Utils lekunda kuda: All menu filter lo incident.list type chesi Enter → incident list open avtundi — nee PDI lo tested.)',
      ],
      code: `Ctrl + /            → slash window
/incident           → incident list
/sys_user           → users list
/tn                 → technical names on / off
/bg                 → Scripts - Background
/xml                → ippudu open unna record XML
/ua resolve         → "resolve" peru unna UI Actions`,
    },
    {
      h: '👀 Technical names & raw values',
      body: [
        'Script lo field LABEL (Short description) kaadu, COLUMN name (short_description) kavali. /tn (leda field label meeda double-click) tho form lo labels pakkana technical names kanipistayi; malli /tn tho off.',
        'SN Utils lekunda: field label meeda right-click — menu chivarlo "Show - \'short_description\'" laaga column name ventane kanipistundi; leda Configure Dictionary → Column name (nee PDI lo ee menu chusam).',
        '/xml tho record yokka raw values chudochu: state lo "In Progress" kaadu "2", caller_id lo name kaadu sys_id — scripts chusedi ee VALUES ye. SN Utils lekunda: form ☰ menu (form title pakkana) → Show XML.',
      ],
    },
    {
      h: '🧪 Background Script — jagratta',
      body: [
        'Background Script (All → System Definition → Scripts - Background, leda /bg) lo server script run chesi output ventane chudochu. Chinna GlideRecord tests ki perfect. Nee PDI lo ee page: Monaco editor, "Run Script" button, scope picker, "Record for rollback?" (default ga tick); output "*** Script: …" ga vastundi.',
        'Kani idi NIJAMAINA data meeda run avtundi — insert / update / delete chesthe nijamga marutundi. "Record for rollback?" tick unna, undo meeda aadharapadaku — cleanup nuvve chey. Nee PDI lo matrame practice; production lo vaadaku. Read-only scripts (query + gs.info) tho start chey.',
      ],
    },
  ],
  quiz: [
    q('SN Utils ante?', ['ServiceNow official paid plugin', 'Free browser extension (community tool)', 'Update Set lo vache oka record type (XML)', 'ServiceNow Store lo certified app'], 1, 'Free browser extension — community tool, ServiceNow official product kaadu.'),
    q('Slash window open cheyyadaniki (Windows)?', ['Ctrl + /', 'Ctrl + S', 'Alt + F4', 'F5 key'], 0, 'Ctrl + / (Mac lo ⌘ + /) — slash window open avtundi, command type chesi Enter.'),
    q('Script rayadaniki field label kaadu, enti kavali?', ['Column name (short_description)', 'Field label (Short description)', 'Record sys_id (32 characters)', 'Form view peru (Default view)'], 0, 'Script lo column name vaadali — /tn tho leda Configure Dictionary tho chudochu.'),
    q('Background Script ela vaadali?', ['PDI lo test chesi, cleanup tho', 'Production lo direct ga, test lekunda', 'Client script lopala pilichi', 'Update set lo record ga capture chesi'], 0, 'Background Script nijamaina data marchutundi — PDI lo test, cleanup marchipoku.'),
    q('SN Utils slash window lo "incident" type chesi Enter nokkite?', ['Incident list open avtundi', 'Kotha incident form open', 'Incident table dictionary', 'Background script open'], 0, 'Table peru = aa table LIST (/incident). /tn ayithe technical names toggle — list kaadu.'),
  ],
  exercises: [
    jx('cs-snutils', 1, 'Extension install chesi slash window try chey', 'easy', {
      scenario: 'Browser lo SN Utils extension install chesi, nee PDI lo login ayyi, Ctrl + / tho slash window open chesi commands list chudu.',
      hint: 'Chrome Web Store / Edge Add-ons lo "SN Utils" (by Arnoud Kooi) search. Slash window: Ctrl + / (Mac lo ⌘ + /).',
      steps: ['Browser extension store open chesi "SN Utils" search chesi install chey.', 'Nee PDI lo login ayyi page reload chey — browser toolbar lo extension icon kanipistundo chudu.', 'ServiceNow page meeda Ctrl + / nokku — slash window open avtundi.', 'Vachhe commands list lo 3-4 commands (bg, tn, xml, me …) chadivi artham chesuko. Esc tho close.'],
      answer: 'Slash window open ayyi commands list (bg, tn, xml, me, …) kanipistundi.',
      cleanup: 'Em marchaledu — extension vaddu anukunte browser extensions page lo remove chey.',
    }),
    jx('cs-snutils', 2, 'Table peru tho list open (/incident)', 'easy', {
      scenario: 'Slash window lo "/incident" tho incident list open chey, tarvata "/sys_user" tho users list — navigator lo module vethakkunda direct ga.',
      hint: 'Ctrl + / → incident → Enter. Table peru ye command (/tn kaadu — adi technical names toggle).',
      steps: ['Ctrl + / nokki "incident" type chesi Enter.', 'Incident list open avtundi — URL lo incident_list.do chudu.', 'Malli Ctrl + / → "sys_user" → Enter: users list.'],
      answer: 'Incident list, tarvata User list open avtayi — table peru telisthe ekkadiki aina okka second lo.',
      cleanup: 'Emi marchaledu.',
    }),
    jx('cs-snutils', 3, 'Technical names chudu (/tn)', 'medium', {
      scenario: 'Oka incident form open chesi /tn tho technical names on chesi, "Short description", "Category", "Assignment group" column names note chesuko. Tarvata malli /tn tho off chey.',
      hint: 'Form open chesi Ctrl + / → tn → Enter (leda field label meeda double-click). SN Utils lekunda: label right-click → Configure Dictionary.',
      steps: ['Any incident open chey.', 'Ctrl + / → "tn" → Enter.', 'Labels pakkana kanipinche names lo short_description, category, assignment_group note chesuko.', 'Malli /tn tho off chey.'],
      answer: 'short_description, category, assignment_group — scripts lo ee column names vaadatam.',
      cleanup: 'Technical names off chey (/tn malli) — em save avvadu.',
    }),
    jx('cs-snutils', 5, 'Record values chudu (/xml)', 'medium', {
      scenario: 'Oka incident form lo /xml tho record XML open chesi state, priority, caller_id values chudu — form lo LABELS ki, XML lo VALUES ki teda gamaninchu.',
      hint: 'Form open ga unnappudu Ctrl + / → xml → Enter (XML vere tab lo open avvochu). SN Utils lekunda: form ☰ menu → Show XML.',
      steps: ['Any incident open chey (form).', 'Ctrl + / → "xml" → Enter.', 'XML lo <state>, <priority>, <caller_id> tags vethuku.', 'Form lo State "In Progress" ani unte XML lo "2" undi ani compare chey.'],
      answer: 'XML lo VALUES untayi: state = 2 (label "In Progress" kaadu), priority = 3 laanti number, caller_id = 32-character sys_id. Server lo getValue() kuda ive istundi.',
      cleanup: 'Read-only — XML tab close chey, em marchaledu.',
    }),
    jx('cs-snutils', 4, 'Background script (/bg)', 'hard', {
      scenario: 'Background Script editor open chesi (nee PDI lo matrame!) incident count log chey — read-only script.',
      hint: '/bg command leda All → System Definition → Scripts - Background.',
      steps: ['Ctrl + / → "bg" → Enter (leda navigator lo "Scripts - Background").', 'Editor lo ide rayi: var gr = new GlideRecord("incident"); gr.query(); gs.info("Incidents: " + gr.getRowCount());', '"Run Script" button click chey ("Record for rollback?" default tick alage vadilesey).', 'Output lo "Incidents: N" kanipistundi.'],
      answer: 'Output lo "*** Script: Incidents: N" — N = nee PDI lo total incidents.',
      cleanup: 'Read-only script (query matrame) — em marchaledu.',
    }),
  ],
}

/* 9 — CRUD part 1 */
const crud1 = {
  id: 'cs-crud1',
  title: 'GlideRecord CRUD — Part 1 (Create & Read)',
  video: 'CRUD Operations using GlideRecord Part 1(Create & Read)',
  duration: '',
  no: 9,
  blurb: 'Server script tho records create (initialize / newRecord + insert) mariyu query / get / GlideAggregate tho read cheyyadam.',
  learn: [
    {
      h: '➕ Create — initialize() + insert()',
      body: [
        'Server script lo (Background Script, Business Rule, Script Include): var gr = new GlideRecord("incident"); gr.initialize(); fields set chey; var id = gr.insert();',
        'initialize() = KHALI record — anni fields null (number, state kuda), isNewRecord() false (PDI lo tested). insert() appudu defaults (state New, impact / urgency 3, priority 4), sys_id, number vastayi; insert() kotha sys_id return chestundi.',
        'Client script lo ivi vaadakudadu — idi server code.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.initialize();
gr.setValue('short_description', 'Created from script');
gr.setValue('urgency', 2);
var sysId = gr.insert();                      // kotha record sys_id
gs.info('Created ' + gr.getValue('number'));  // number insert TARVATA`,
    },
    {
      h: '🆕 newRecord() vs initialize()',
      body: [
        'newRecord() = kotha record + defaults + sys_id + number VENTANE (insert mundu), isNewRecord() true. initialize() = anni null; defaults insert() appude.',
        'Rendu tarvata save ki insert() kavali. Insert mundu number / defaults chudali ante newRecord(); simple ga create cheyyadaniki initialize() chalu.',
      ],
      code: `var a = new GlideRecord('incident');
a.initialize();
gs.info(a.getValue('state'));     // null — inka defaults levu
gs.info(a.getValue('number'));    // null

var b = new GlideRecord('incident');
b.newRecord();
gs.info(b.getValue('state'));     // '1' (New) — default
gs.info(b.getValue('number'));    // 'INC0010009' — ventane
gs.info(b.isNewRecord());         // true`,
    },
    {
      h: '📖 Read — query & get',
      body: [
        'Chala records: addQuery(field, value) → query() → while (gr.next()) { ... }. Okka record: gr.get("number", "INC0010004") leda gr.get(sys_id) — gr.get("INC0010004") (okka value number aina) kuda PDI lo dorukutundi.',
        'Extras: addActiveQuery(), orderBy(field), orderByDesc(field), setLimit(n), getRowCount(), addEncodedQuery("active=true^priority=1").',
        '⚠️ Loop lo array ki gr.number push cheyyaku — anni entries LAST record avtayi (PDI lo tested). gr.getValue("number") push chey.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.addActiveQuery();
gr.orderBy('number');
gr.query();
var nums = [];
while (gr.next()) {
  nums.push(gr.getValue('number'));   // ✅ string — gr.number kaadu
}
gs.info(nums.join(', '));`,
    },
    {
      h: '🔢 Count — getRowCount() vs GlideAggregate',
      body: [
        'getRowCount() matching records anni load chesi count chestundi — chinna tables ki OK, pedda tables lo slow.',
        'GlideAggregate count ni database lone chestundi: addAggregate("COUNT") → query() → next() → getAggregate("COUNT"). Result STRING ("2") — number kaadu (PDI lo tested). groupBy("category") tho category wise counts.',
      ],
      code: `var agg = new GlideAggregate('incident');
agg.addQuery('category', 'network');
agg.addAggregate('COUNT');
agg.query();
if (agg.next()) {
  gs.info('Network incidents: ' + agg.getAggregate('COUNT'));   // '2' (string)
}`,
    },
    {
      h: '⚠️ Real PDI lo',
      body: [
        'Background Script lo insert chesthe NIJAMGA records create avtayi — practice tarvata delete chey. Ee site lo mock sandbox kabatti safe.',
        'Ikkada exercises Stage 2 laaga run avtayi (gs.info output log lo). Tests table ni fresh GlideRecord tho malli chaduvutayi — insert nijamga jarigindo ledo chustayi.',
      ],
    },
  ],
  quiz: [
    q('Kotha record create cheyyadaniki?', ['initialize() + fields + insert()', 'gr.create() + fields + gr.save()', 'gr.add() + fields + gr.commit()', 'gr.open() + fields + gr.saveRecord()'], 0, 'initialize() (leda newRecord()), fields set, insert().'),
    q('insert() em return chestundi?', ['Kotha record sys_id', 'true / false matrame', 'Kotha record number', 'Emi return cheyyadu'], 0, 'insert() kotha record sys_id return chestundi — tarvata get(id) tho malli chadavochu.'),
    q('Chala records read cheyyadaniki?', ['query() + while (gr.next())', 'get() ni okkasari pilavadam', 'insert() tarvata getValue()', 'getRowCount() okkate chalu'], 0, 'query() tarvata next() loop — prathi record ki okasari.'),
    q('gr.setLimit(3); gr.query(); — table lo 8 incidents unte gr.getRowCount()?', ['3', '8', '0', 'Error vastundi'], 0, 'PDI lo tested: setLimit(3) tarvata getRowCount() = 3 — limit ki varaku matrame records vastayi.'),
    q('Client script lo GlideRecord tho record create cheyyala?', ['Avunu, client lo ellappudu cheyyochu', 'Vaddu — server side lo matrame', 'Admin role unte matrame cheyyochu', 'onLoad script lo matrame cheyyochu'], 1, 'GlideRecord create / update server-side API — Business Rule, Script Include, Background Script lo.'),
  ],
  exercises: [
    jx('cs-crud1', 1, 'Incident create chey', 'easy', {
      server: true,
      task: 'Kotha incident create chey: short_description = "Printer not working", urgency = 2. insert() chesi gs.info("Created " + number) log chey.',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: khali record ready chey\n// Step 2: short_description + urgency set chey\n// Step 3: insert(), tarvata 'Created ' + number log\n",
      hint: [
        'Create = initialize → fields set → insert. Number insert TARVATE vastundi, kabatti log last lo.',
        "gr.initialize();   gr.setValue('short_description', ...);   gr.setValue('urgency', 2);   gr.insert();",
        "gr.initialize(); gr.setValue('short_description', 'Printer not working'); gr.setValue('urgency', 2); gr.insert(); gs.info('Created ' + gr.getValue('number'));",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.initialize();\ngr.setValue('short_description', 'Printer not working');\ngr.setValue('urgency', 2);\ngr.insert();\ngs.info('Created ' + gr.getValue('number'));",
      explain: 'initialize() = khali record (number kuda null). insert() appudu defaults + number vastayi — anduke log insert TARVATA. Mundu INC0010008 varaku unnayi kabatti INC0010009 (variant lo inko record unte INC0010010).',
      tests: [
        { label: 'Log: Created INC0010009', logs: ['Created INC0010009'] },
        { label: 'Table lo INC0010009: short_description + urgency', expr: BYNUM('INC0010009', ['short_description', 'urgency']), expect: ['Printer not working', '2'] },
      ],
      variants: [{ name: 'table lo inko incident undi (next number INC0010010)', scenario: SEED({ short_description: 'Monitor flickering' }), tests: [{ label: 'Log: Created INC0010010', logs: ['Created INC0010010'] }] }],
    }),
    jx('cs-crud1', 2, 'Oka record read', 'easy', {
      server: true,
      task: 'INC0010004 record load chesi (gr.get("number", ...)) daani short_description log chey.',
      starter: "var gr = new GlideRecord('incident');\n// INC0010004 load chesi short_description log chey\n",
      hint: "gr.get('number', 'INC0010004'); gs.info(gr.getValue('short_description'));",
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010004');\ngs.info(gr.getValue('short_description'));",
      explain: 'get(field, value) first matching record load chestundi. Variant lo ade record ki vere short description undi — text hardcode chesthe fail.',
      tests: [{ label: 'Log', logs: ['Reports are taking 5 minutes to load'] }],
      variants: [{ name: 'INC0010004 short description vere', scenario: SEED({ sys_id: 'inc4', short_description: 'Dashboard shows a blank page' }), tests: [{ label: 'Log', logs: ['Dashboard shows a blank page'] }] }],
    }),
    jx('cs-crud1', 3, 'Active network incidents', 'medium', {
      server: true,
      task: 'category = network mariyu ACTIVE incidents query chesi number order lo prathi number log chey.',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: category network + active matrame\n// Step 2: number order\n// Step 3: query, loop lo prathi number log\n",
      hint: [
        'Rendu filters kavali (category + active), tarvata number order, tarvata loop lo prathi record number log.',
        "addQuery('category', 'network') + addActiveQuery() + orderBy('number') → query() → while (gr.next()) { ... }",
        "gr.addQuery('category', 'network'); gr.addActiveQuery(); gr.orderBy('number'); gr.query(); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('category', 'network');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: 'Query → loop. orderBy tho predictable order. Variant lo oka INACTIVE network incident (raakudadu) mariyu chinna number unna active network incident (first raavali) unnayi.',
      tests: [{ label: 'Numbers', logs: ['INC0010002', 'INC0010007'] }],
      variants: [{ name: 'inactive + chinna number unna network incidents', scenario: SEED({ number: 'INC0009990', short_description: 'Old VPN ticket', category: 'network', state: '7', active: 'false' }, { number: 'INC0009999', short_description: 'Wi-Fi slow on 2nd floor', category: 'network', state: '1' }), tests: [{ label: 'Numbers', logs: ['INC0009999', 'INC0010002', 'INC0010007'] }] }],
    }),
    jx('cs-crud1', 5, 'insert() sys_id tho malli read chey', 'medium+', {
      server: true,
      task: 'Kotha incident create chey: short_description = "VPN slow", category = "network". insert() return chese sys_id ni id variable lo pettu. Tarvata KOTHA GlideRecord (check) tho get(id) chesi "Saved: <number> <category>" log chey (udaa: "Saved: INC0010009 network"). 🧰 Vaade words: initialize(), setValue(), insert(), get(), getValue()',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: initialize(), short_description + category set chey\n\n// Step 2: insert() chey — adi return chese value ni id ane variable lo pettu\n\n// Step 3: var check = new GlideRecord('incident');\n//         check ni id tho load chesi (get) 'Saved: ' + number + ' ' + category log chey\n",
      hint: [
        'insert() oka value return chestundi — kotha record sys_id. Daanni variable lo pettukunte tarvata aa record ni malli techchukovachu.',
        'var id = gr.insert();   tarvata   var check = new GlideRecord("incident"); if (check.get(id)) { ... }',
        "if (check.get(id)) { gs.info('Saved: ' + check.getValue('number') + ' ' + check.getValue('category')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.initialize();\ngr.setValue('short_description', 'VPN slow');\ngr.setValue('category', 'network');\nvar id = gr.insert();\n\nvar check = new GlideRecord('incident');\nif (check.get(id)) {\n  gs.info('Saved: ' + check.getValue('number') + ' ' + check.getValue('category'));\n}",
      explain: 'get() ki okka argument (sys_id) iste aa record load avtundi. Insert nijamga table lo save ayyindo ani ila verify cheyyochu — Background Script lo manchi habit.',
      tests: [
        { label: 'Log: Saved: INC0010009 network', logs: ['Saved: INC0010009 network'] },
        { label: 'check record = insert chesina record', expr: 'check.getUniqueValue() === id', expect: true },
        { label: 'short_description = VPN slow', expr: "check.getValue('short_description')", expect: 'VPN slow' },
      ],
      variants: [{ name: 'inko record unte (INC0010010)', scenario: SEED({ short_description: 'Monitor flickering' }), tests: [{ label: 'Log: Saved: INC0010010 network', logs: ['Saved: INC0010010 network'] }] }],
    }),
    jx('cs-crud1', 6, 'Okate gr tho rendu records (initialize malli)', 'medium+', {
      server: true,
      task: 'Okate gr variable tho rendu incidents create chey: "Mouse broken", tarvata "Keyboard broken". Prathi insert tarvata "Created <number>" log chey. Rendo record mundu gr.initialize() MALLI pilavu — fresh empty record (kotha number tho) kosam. 🧰 Vaade words: initialize(), setValue(), insert(), getValue()',
      starter: "var gr = new GlideRecord('incident');\n\n// Record 1: initialize, short_description 'Mouse broken', insert, 'Created ' + number log\n\n// Record 2: MALLI initialize, short_description 'Keyboard broken', insert, log\n",
      hint: [
        'Prathi kotha record ki mundu initialize() — adi gr ni empty record ga reset chestundi. Tarvata set → insert → log.',
        "gr.initialize(); gr.setValue('short_description', ...); gr.insert(); gs.info('Created ' + ...);   — idi rendu sarlu",
        "gr.initialize(); gr.setValue('short_description', 'Keyboard broken'); gr.insert(); gs.info('Created ' + gr.getValue('number'));",
      ],
      solution: "var gr = new GlideRecord('incident');\n\ngr.initialize();\ngr.setValue('short_description', 'Mouse broken');\ngr.insert();\ngs.info('Created ' + gr.getValue('number'));\n\ngr.initialize();\ngr.setValue('short_description', 'Keyboard broken');\ngr.insert();\ngs.info('Created ' + gr.getValue('number'));",
      explain: 'initialize() malli pilisthe paata record values (number tho saha) poyi fresh record vastundi. "Array nunchi 3 incidents create" lo loop lo prathi saari new GlideRecord create chestam — rendu ways work avtayi. initialize() lekunda rendo insert() chesthe? Nee PDI lo tested: inkoka KOTHA record create avtundi — paata values tho (duplicate). Anduke prathi kotha record ki mundu initialize().',
      tests: [
        { label: 'Logs: INC0010009, INC0010010', logs: ['Created INC0010009', 'Created INC0010010'] },
        { label: 'Total incidents 10', expr: TOTAL, expect: 10 },
        { label: 'INC0010010 = Keyboard broken', expr: BYNUM('INC0010010', ['short_description']), expect: ['Keyboard broken'] },
      ],
      variants: [{ name: 'inko record unte (INC0010010, INC0010011)', scenario: SEED({ short_description: 'Monitor flickering' }), tests: [{ label: 'Logs', logs: ['Created INC0010010', 'Created INC0010011'] }] }],
    }),
    jx('cs-crud1', 7, 'Array meeda loop chesi create', 'medium+', {
      server: true,
      task: 'names = ["Printer jam", "VPN slow"] array undi. for loop lo prathi name ki oka incident create chey (short_description = name) mariyu "Created <number>: <short_description>" log chey. 🧰 Vaade words: for loop, length, initialize(), insert(), getValue()',
      starter: "var names = ['Printer jam', 'VPN slow'];\n\n// for loop: i = 0 nunchi names.length varaku\n//   lopala: new GlideRecord('incident'), initialize, short_description = names[i], insert\n//   'Created ' + number + ': ' + short_description log\n",
      hint: [
        'Array lo prathi item ki okate pani — loop. Loop lopala prathi saari kotha GlideRecord create chesthe clean ga untundi.',
        'for (var i = 0; i < names.length; i++) { var gr = new GlideRecord("incident"); ... names[i] ... }',
        "gr.initialize(); gr.setValue('short_description', names[i]); gr.insert(); gs.info('Created ' + gr.getValue('number') + ': ' + gr.getValue('short_description'));",
      ],
      solution: "var names = ['Printer jam', 'VPN slow'];\n\nfor (var i = 0; i < names.length; i++) {\n  var gr = new GlideRecord('incident');\n  gr.initialize();\n  gr.setValue('short_description', names[i]);\n  gr.insert();\n  gs.info('Created ' + gr.getValue('number') + ': ' + gr.getValue('short_description'));\n}",
      explain: 'Array + loop = data nunchi chala records okesari create cheyyochu (bulk data load). "Array nunchi 3 incidents create" lo category set chesi, entha create chesavo count chestam.',
      tests: [
        { label: 'Logs', logs: ['Created INC0010009: Printer jam', 'Created INC0010010: VPN slow'] },
        { label: 'Total incidents 10', expr: TOTAL, expect: 10 },
      ],
      variants: [{ name: 'inko record unte (numbers +1)', scenario: SEED({ short_description: 'Monitor flickering' }), tests: [{ label: 'Logs', logs: ['Created INC0010010: Printer jam', 'Created INC0010011: VPN slow'] }] }],
    }),
    jx('cs-crud1', 4, 'Array nunchi 3 incidents create', 'hard', {
      server: true,
      task: 'issues = ["Printer jam", "VPN slow", "Mouse broken"] array undi. Loop lo prathi issue ki oka incident create chey (short_description = issue, category = "hardware"). Last lo gs.info("Created " + count) (count = create chesina records).',
      starter: "var issues = ['Printer jam', 'VPN slow', 'Mouse broken'];\n// Step 1: count = 0\n// Step 2: loop — kotha record, short_description + category, insert, count++\n// Step 3: 'Created ' + count log\n",
      hint: [
        '"Array meeda loop chesi create" lo loop + create already chesav. Ippudu category kuda set chey, mariyu entha records create chesavo oka counter lo lekka pettu.',
        'var count = 0; for (...) { new GlideRecord; initialize; short_description + category set; insert; count++; }   — loop tarvata okka gs.info.',
        "for (var i = 0; i < issues.length; i++) { var gr = new GlideRecord('incident'); gr.initialize(); gr.setValue('short_description', issues[i]); gr.setValue('category', 'hardware'); gr.insert(); count++; }  gs.info('Created ' + count);",
      ],
      solution: "var issues = ['Printer jam', 'VPN slow', 'Mouse broken'];\nvar count = 0;\nfor (var i = 0; i < issues.length; i++) {\n  var gr = new GlideRecord('incident');\n  gr.initialize();\n  gr.setValue('short_description', issues[i]);\n  gr.setValue('category', 'hardware');\n  gr.insert();\n  count++;\n}\ngs.info('Created ' + count);",
      explain: 'Loop ki lopale new GlideRecord create chey — leda initialize() malli pilichi reuse cheyyochu. Test table lo 3 hardware records (ee short descriptions tho) unnayo chustundi.',
      tests: [
        { label: 'Log', logs: ['Created 3'] },
        { label: 'Total incidents 11', expr: TOTAL, expect: 11 },
        { label: 'Table lo 3 hardware incidents (ee short descriptions tho)', expr: "(function () { var g = new GlideRecord('incident'); g.addQuery('category', 'hardware'); g.addQuery('short_description', 'IN', 'Printer jam,VPN slow,Mouse broken'); g.query(); return g.getRowCount(); })()", expect: 3 },
      ],
    }),
    jx('cs-crud1', 8, 'Category wise count (GlideAggregate)', 'hard', {
      server: true,
      task: 'Active incidents ni category wise count chey — GlideAggregate tho (records load cheyyakunda database lone count): active matrame, COUNT aggregate, category tho groupBy, category order. Loop lo prathi group ki category + ": " + count log chey (e.g. "database: 2"). 🧰 Vaade words: GlideAggregate, addAggregate(), groupBy(), getAggregate()',
      starter: "var agg = new GlideAggregate('incident');\n// Step 1: active matrame\n// Step 2: COUNT aggregate + category tho group + category order\n// Step 3: query; while loop lo category + ': ' + count log\n",
      hint: [
        'GlideAggregate kuda GlideRecord laage query chestundi, kani prathi next() oka GROUP (oka category). Count getAggregate tho, category getValue tho.',
        "agg.addActiveQuery(); agg.addAggregate('COUNT'); agg.groupBy('category'); agg.orderBy('category'); agg.query();",
        "while (agg.next()) { gs.info(agg.getValue('category') + ': ' + agg.getAggregate('COUNT')); }",
      ],
      solution: "var agg = new GlideAggregate('incident');\nagg.addActiveQuery();\nagg.addAggregate('COUNT');\nagg.groupBy('category');\nagg.orderBy('category');\nagg.query();\nwhile (agg.next()) {\n  gs.info(agg.getValue('category') + ': ' + agg.getAggregate('COUNT'));\n}",
      explain: 'getAggregate() STRING istundi ("2") — math kavali ante Number(). Pedda tables lo getRowCount() kante GlideAggregate chala fast. Variant lo inko active network incident + oka inactive one unnayi — network: 3 avvali.',
      tests: [{ label: 'Logs', logs: ['database: 2', 'hardware: 1', 'network: 2', 'software: 2'] }],
      variants: [{ name: 'inko active + oka inactive network incident', scenario: NET_SEED, tests: [{ label: 'Logs', logs: ['database: 2', 'hardware: 1', 'network: 3', 'software: 2'] }] }],
    }),
  ],
}

/* 10 — CRUD part 2 */
const crud2 = {
  id: 'cs-crud2',
  title: 'GlideRecord CRUD — Part 2 (Update & Delete)',
  video: 'CRUD Operations using GlideRecord Part 2(Update & Delete)',
  duration: '',
  no: 10,
  blurb: 'update(), loop / updateMultiple() tho bulk update, deleteRecord() / deleteMultiple() — count chusi, jagratta tho.',
  learn: [
    {
      h: '✏️ Update',
      body: [
        'Record load chesi (get / query + next), fields marchi gr.update(). Chala records ki: query → while (gr.next()) { gr.setValue(...); gr.update(); }. Mundu entha records marutayo gr.getRowCount() tho chudu.',
        'Priority ni direct ga set cheyyaku — nee PDI lo priority Data Lookup (impact × urgency) nunchi vastundi, form lo read-only. Marchali ante impact / urgency marchu.',
        'setWorkflow(false) = Business Rules / notifications skip; autoSysFields(false) = Updated / Updated by fields marchavu. Data fix lo vaadataru — teliyakunda vaadaku.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.addActiveQuery();
gr.query();
gs.info('Updating ' + gr.getRowCount() + ' incidents');
while (gr.next()) {
  gr.setValue('state', 2);
  gr.update();
}`,
    },
    {
      h: '🧮 updateMultiple() — loop lekunda',
      body: [
        'Filter + setValue() pettu, tarvata gr.updateMultiple() — query ki match ayye ANNI records okesari marutayi (next() loop, query() avasaram ledu). Nee PDI lo undi (tested).',
        'Safe ga: mundu same filter tho vere GlideRecord lo getRowCount() chudu. ⚠️ ServiceNow docs: updateMultiple tho setValue() vaadu — gr.state = 2 laaga direct assign tho motham table update ayye pramadam undi ani warning (PDI lo test cheyyaku).',
      ],
      code: `// 1) mundu count
var check = new GlideRecord('incident');
check.addQuery('category', 'network');
check.addActiveQuery();
check.query();
gs.info('Will update: ' + check.getRowCount());

// 2) okesari update
var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.addActiveQuery();
gr.setValue('state', 2);
gr.updateMultiple();`,
    },
    {
      h: '🗑️ Delete — count / dry run FIRST',
      body: [
        'gr.deleteRecord() = load ayina okka record delete. Loop lo prathi record ki pilavochu. gr.deleteMultiple() = query ki match ayye ANNI records okesari delete (loop ledu).',
        'Rule: delete code rayadaniki MUNDU same query tho getRowCount() + prathi number log (dry run). List correct ani confirm ayyaka matrame delete line add chey.',
        'Update sets configuration (scripts, fields, forms) matrame capture chestayi — incidents laanti DATA records kaadu. Delete chesina incident ni update set tho venakki techchukolem; undo ledu anukoni pani chey.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('state', 'IN', '6,7');
gr.addQuery('active', false);
gr.query();
gs.info('Matches: ' + gr.getRowCount());     // 1) mundu count
while (gr.next()) {
  gs.info('Would delete ' + gr.getValue('number'));
  // gr.deleteRecord();                      // 2) list correct ayithe appude
}`,
    },
    {
      h: '🚨 Field peru typo = ANNI records!',
      body: [
        'addQuery lo field peru tappu ga (categry) rasthe nee PDI error ivvadu — aa condition ni IGNORE chesi table lo ANNI rows istundi (PDI lo tested: 67 of 67). Log lo "Invalid query detected … Unknown field" ani matrame vastundi.',
        'Ade query tho deleteMultiple() / updateMultiple() / delete loop pilisthe MOTHAM table poyindi / marindi. Anduke ellappudu count chudu: 2 expect chesi 8 (anni) vaste STOP.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('categry', 'network');   // typo! PDI ee condition ni ignore chestundi
gr.query();
gs.info(gr.getRowCount());           // 8 — ANNI incidents (2 kaadu)`,
    },
  ],
  quiz: [
    q('Record lo field marchaka save cheyyadaniki?', ['gr.update()', 'gr.save()', 'gr.commit()', 'gr.set()'], 0, 'update() — field values marchina tarvata gr.update() pilavakapothe database lo save avvavu.'),
    q('updateMultiple() / deleteMultiple() mundu em cheyyali?', ['Same filter tho getRowCount() chudu', 'gr.next() tho prathi record open chey', 'Update set ni Complete cheyyali', 'Instance ni restart cheyyali'], 0, 'Mundu count — expect chesina count kakapothe (typo valla anni rows) aagu.'),
    q('Delete mundu manchi habit?', ['Dry run — count + numbers log chudu', 'Direct ga deleteMultiple() pilavadam', 'Warnings anni ignore cheyyadam', 'Update set lo backup teesukovadam'], 0, 'Mundu count + numbers log chesi chudu, list correct ayithe appude delete.'),
    q('deleteMultiple() em chestundi?', ['Query ki match ayye anni delete', 'Oka record matrame delete chestundi', 'Inactive records matrame delete', 'Records ni Recycle bin ki pampistundi'], 0, 'Query ki match ayye ANNI records delete — undo meeda aadharapadaku, update set kuda capture cheyyadu.'),
    q('setWorkflow(false) em chestundi?', ['Business Rules run avvakunda update', 'Kotha Workflow record attach chestundi', 'Record ni edit cheyyakunda lock chestundi', 'Em cheyyadu, no effect untundi'], 0, 'Business Rules / workflows / notifications skip avtayi — data fix lo matrame, careful.'),
  ],
  exercises: [
    jx('cs-crud2', 1, 'Oka record update', 'easy', {
      server: true,
      task: 'INC0010006 load chey. Paata state ni oldState variable lo pettuko, state ni 2 (In Progress) chesi update() chey. Tarvata gs.info("State " + oldState + " -> " + kotha state) log chey (e.g. "State 1 -> 2").',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: INC0010006 load chey\n// Step 2: ippati state ni oldState lo pettuko\n// Step 3: state 2 set chesi save chey\n// Step 4: 'State ' + oldState + ' -> ' + kotha state log\n",
      hint: [
        'get → paata value chaduvu → set → update → log. Paata value set KANTE MUNDU chadavali.',
        "gr.get('number', 'INC0010006');   var oldState = gr.getValue('state');   gr.setValue('state', 2);   gr.update();",
        "gr.get('number', 'INC0010006'); var oldState = gr.getValue('state'); gr.setValue('state', 2); gr.update(); gs.info('State ' + oldState + ' -> ' + gr.getValue('state'));",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010006');\nvar oldState = gr.getValue('state');\ngr.setValue('state', 2);\ngr.update();\ngs.info('State ' + oldState + ' -> ' + gr.getValue('state'));",
      explain: 'get → set → update. update() lekapothe table lo save avvadu — test fresh GlideRecord tho chaduvutundi. Variant lo INC0010006 On Hold (3) nunchi start — log hardcode chesthe fail.',
      tests: [
        { label: 'Log', logs: ['State 1 -> 2'] },
        { label: 'Table lo INC0010006 state 2 (update() chesava?)', expr: DB(['state'], 'inc6'), expect: ['2'] },
      ],
      variants: [{ name: 'INC0010006 On Hold (3) nunchi', scenario: SEED({ sys_id: 'inc6', state: '3', hold_reason: '1' }), tests: [{ label: 'Log', logs: ['State 3 -> 2'] }, { label: 'Table lo state 2', expr: DB(['state'], 'inc6'), expect: ['2'] }] }],
    }),
    jx('cs-crud2', 2, 'Bulk update (loop)', 'easy', {
      server: true,
      task: 'ACTIVE network incidents anni ni In Progress (state 2) chey — loop lo prathi record setValue + update(). Last lo gs.info("Updated " + count).',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: category network + active filter, query\n// Step 2: loop lo state 2 + save, count++\n// Step 3: 'Updated ' + count log\n",
      hint: [
        'Filter (rendu conditions) → query → loop lo set + update + count → loop tarvata log.',
        "gr.addQuery('category', 'network'); gr.addActiveQuery(); gr.query(); var count = 0; while (gr.next()) { ... }",
        "gr.addQuery('category', 'network'); gr.addActiveQuery(); gr.query(); var count = 0; while (gr.next()) { gr.setValue('state', 2); gr.update(); count++; } gs.info('Updated ' + count);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('category', 'network');\ngr.addActiveQuery();\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gr.setValue('state', 2);\n  gr.update();\n  count++;\n}\ngs.info('Updated ' + count);",
      explain: 'While loop lo prathi record ki update(). Priority ni ila direct ga set cheyyaku — nee PDI lo Data Lookup (impact × urgency) nunchi vastundi. Variant lo inko active network incident + oka inactive (Closed) network incident — inactive di marakudadu.',
      tests: [
        { label: 'Log', logs: ['Updated 2'] },
        { label: 'Table: INC0010002, INC0010007 state 2', expr: DBS('state', ['inc2', 'inc7']), expect: ['2', '2'] },
      ],
      variants: [{ name: 'inko active + oka inactive network incident', scenario: NET_SEED, tests: [{ label: 'Log', logs: ['Updated 3'] }, { label: 'Table: active vi 2, inactive 7 laage', expr: DBS('state', ['inc2', 'inc7', 'net_new', 'net_old']), expect: ['2', '2', '2', '7'] }] }],
    }),
    jx('cs-crud2', 3, 'Printer incident delete', 'medium', {
      server: true,
      task: 'short_description lo "Printer" unna incidents ni query chesi deleteRecord() chey. Delete cheyyadaniki mundu gs.info("Deleting " + number) (dry-run log). Last lo gs.info("Deleted " + count).',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: short_description CONTAINS 'Printer', query\n// Step 2: loop — mundu log, tarvata delete, count++\n// Step 3: 'Deleted ' + count\n",
      hint: [
        'CONTAINS filter tho query chey. Loop lo MUNDU log (dry run), TARVATA delete, count penchu. Loop tarvata total log.',
        "addQuery('short_description', 'CONTAINS', 'Printer') → query() → var count = 0; while (gr.next()) { log; deleteRecord(); count++; }",
        "gr.addQuery('short_description', 'CONTAINS', 'Printer'); gr.query(); var count = 0; while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); count++; } gs.info('Deleted ' + count);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('short_description', 'CONTAINS', 'Printer');\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n  count++;\n}\ngs.info('Deleted ' + count);",
      explain: 'Log mundu, delete tarvata — evi delete ayyayo telustundi. Variant lo inko printer incident undi — rendu delete avvali.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010003', 'Deleted 1'] },
        { label: 'Remaining 7', expr: TOTAL, expect: 7 },
      ],
      variants: [{ name: 'inko printer incident undi', scenario: SEED({ number: 'INC0010009', short_description: 'Printer toner is empty', category: 'hardware' }), tests: [{ label: 'Logs', logs: ['Deleting INC0010003', 'Deleting INC0010009', 'Deleted 2'] }, { label: 'Remaining 7', expr: TOTAL, expect: 7 }] }],
    }),
    jx('cs-crud2', 5, 'Dry run matrame (IN operator)', 'medium+', {
      server: true,
      task: 'state 6 (Resolved) leda 7 (Closed) unna incidents query chey — addQuery("state", "IN", "6,7"), number order lo. Delete CHEYYAKU! Prathi record ki "Would delete <number>" log, loop tarvata "Would delete total: <count>" (getRowCount tho). 🧰 Vaade words: addQuery() (IN), orderBy(), query(), getRowCount()',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: state IN '6,7' filter + number order, tarvata query\n\n// Step 2: loop lo prathi record ki 'Would delete ' + number log (deleteRecord VADDU)\n\n// Step 3: 'Would delete total: ' + entha records match ayyayo\n",
      hint: [
        'IN operator = "ee list lo edaina okati". Values comma tho okate string lo. Delete ledu — log matrame (dry run).',
        "addQuery('state', 'IN', '6,7'); orderBy('number'); query();  while (gr.next()) { ... }   total ki getRowCount()",
        "while (gr.next()) { gs.info('Would delete ' + gr.getValue('number')); }  gs.info('Would delete total: ' + gr.getRowCount());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('state', 'IN', '6,7');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info('Would delete ' + gr.getValue('number'));\n}\ngs.info('Would delete total: ' + gr.getRowCount());",
      explain: 'Dry run = delete code rayadaniki mundu emi delete avtayo chudadam. List correct ga unte appude deleteRecord() add chey. Practice data lo INC0010005 Closed (7). Variant lo oka Resolved (6) + inkoka Closed incident (chinna numbers) — state = 7 matrame filter chesthe Resolved di miss; orderBy marchipothe order tappu. Gamaninchu: Resolved incident inka ACTIVE (nee PDI lo Resolved active = true) — dry run lo adi kuda vachindi, anduke "Safe cleanup" lo active = false filter kaluputam.',
      tests: [
        { label: 'Logs', logs: ['Would delete INC0010005', 'Would delete total: 1'] },
        { label: 'Emi delete avvaledu (8 ala unnayi)', expr: TOTAL, expect: 8 },
      ],
      variants: [{
        name: 'Resolved (6) + Closed (7) incidents, chinna numbers tho',
        scenario: SEED(
          { number: 'INC0009997', short_description: 'Outlook password prompt', category: 'software', state: '6', active: 'true', close_code: 'Workaround provided', close_notes: 'Cleared the cached credentials.' },
          { number: 'INC0009998', short_description: 'Old laptop request', category: 'hardware', state: '7', active: 'false' },
        ),
        tests: [{ label: 'Logs', logs: ['Would delete INC0009997', 'Would delete INC0009998', 'Would delete INC0010005', 'Would delete total: 3'] }, { label: 'Emi delete avvaledu (10)', expr: TOTAL, expect: 10 }],
      }],
    }),
    jx('cs-crud2', 6, 'get() tho safe delete (dorakapothe skip)', 'medium+', {
      server: true,
      task: 'numbers = ["INC0010003", "INC0099999"] array undi. Prathi number ki kotha GlideRecord tho get("number", num) chey. Dorikithe (true) "Deleting <num>" log chesi deleteRecord(); dorakapothe (false) "Not found: <num>" log. 🧰 Vaade words: get() (true / false), if / else, deleteRecord()',
      starter: "var numbers = ['INC0010003', 'INC0099999'];\n\nfor (var i = 0; i < numbers.length; i++) {\n  var gr = new GlideRecord('incident');\n  // TODO: numbers[i] tho record load try chey — dorikindaa?\n  //   avunu  → 'Deleting ' + numbers[i] log, tarvata delete\n  //   ledu   → 'Not found: ' + numbers[i] log\n}\n",
      hint: [
        'get() true / false return chestundi — record dorikindo ledo. Aa result ni if lo pettu; dorakani daanimeeda delete pilavaku.',
        "if (gr.get('number', numbers[i])) { ...log + delete... } else { ...Not found log... }",
        "if (gr.get('number', numbers[i])) { gs.info('Deleting ' + numbers[i]); gr.deleteRecord(); } else { gs.info('Not found: ' + numbers[i]); }",
      ],
      solution: "var numbers = ['INC0010003', 'INC0099999'];\n\nfor (var i = 0; i < numbers.length; i++) {\n  var gr = new GlideRecord('incident');\n  if (gr.get('number', numbers[i])) {\n    gs.info('Deleting ' + numbers[i]);\n    gr.deleteRecord();\n  } else {\n    gs.info('Not found: ' + numbers[i]);\n  }\n}",
      explain: 'get() result check cheyyakunda delete / update pilavaku — typo number unte em load avvaledu ani teliyadu. ⚠️ get() fail ayina tarvata deleteRecord() pilisthe real lo em jarugutundo test cheyyaku — ellappudu if tho guard chey.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010003', 'Not found: INC0099999'] },
        { label: 'INC0010003 poyindi', expr: "(function () { var g = new GlideRecord('incident'); return g.get('number', 'INC0010003'); })()", expect: false },
        { label: 'Remaining 7', expr: TOTAL, expect: 7 },
      ],
    }),
    jx('cs-crud2', 7, 'Delete tarvata verify (fresh query)', 'medium+', {
      server: true,
      task: 'Inactive incidents (addQuery("active", false)) anni delete chey — prathi daaniki mundu "Deleting <number>" log. Tarvata KOTHA GlideRecord (check) tho malli inactive query chesi "Inactive left: <count>" log chey (0 raavali). 🧰 Vaade words: addQuery(), deleteRecord(), query(), getRowCount()',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: active = false filter, query, loop lo log + delete\n\n// Step 2: var check = new GlideRecord('incident');\n//         same filter tho query chesi 'Inactive left: ' + count log\n",
      hint: [
        'Rendu parts: (1) delete loop — "Printer incident delete" laage. (2) verify — kotha GlideRecord tho same filter query chesi count chudu.',
        "Delete: addQuery('active', false); query(); while (gr.next()) { log; deleteRecord(); }   Verify: var check = new GlideRecord('incident'); same addQuery; query(); getRowCount()",
        "while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); }   check.addQuery('active', false); check.query(); gs.info('Inactive left: ' + check.getRowCount());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('active', false);\ngr.query();\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n}\n\nvar check = new GlideRecord('incident');\ncheck.addQuery('active', false);\ncheck.query();\ngs.info('Inactive left: ' + check.getRowCount());",
      explain: 'Delete tarvata fresh query tho verify = "nijamga poyaya?" ani proof. Paata gr ni reuse cheyyaku — adi paata query result. "Safe cleanup" lo filter inka tight (rendu conditions) chestam.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010005', 'Inactive left: 0'] },
        { label: 'Remaining 7', expr: TOTAL, expect: 7 },
      ],
      variants: [{ name: 'inko inactive incident', scenario: SEED({ number: 'INC0010009', short_description: 'Old VPN ticket', category: 'network', state: '7', active: 'false' }), tests: [{ label: 'Logs', logs: ['Deleting INC0010005', 'Deleting INC0010009', 'Inactive left: 0'] }, { label: 'Remaining 7', expr: TOTAL, expect: 7 }] }],
    }),
    jx('cs-crud2', 4, 'Safe cleanup', 'hard', {
      server: true,
      task: 'Inactive (active = false) MARIYU state 6 leda 7 unna incidents matrame delete chey (addQuery("state", "IN", "6,7") + addQuery("active", false)). Mundu "Matches: " + getRowCount() log, tarvata prathi daaniki "Deleting <number>" log + deleteRecord(), last lo "Deleted <count>". Active incidents (Resolved ayina) jolliki vellakudadu.',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: rendu filters (state IN 6,7 AND inactive), query\n// Step 2: 'Matches: ' + count log (dry-run count)\n// Step 3: loop — log, delete, count++\n// Step 4: 'Deleted ' + count\n",
      hint: [
        '"Dry run matrame (IN operator)" + "Printer incident delete" kalipi. Rendu addQuery lu = AND (rendu nijam kavali). Delete loop ki mundu count log.',
        "addQuery('state', 'IN', '6,7'); addQuery('active', false); query(); gs.info('Matches: ' + gr.getRowCount()); var count = 0; while (gr.next()) { log; deleteRecord(); count++; }",
        "gr.addQuery('state', 'IN', '6,7'); gr.addQuery('active', false); gr.query(); gs.info('Matches: ' + gr.getRowCount()); var count = 0; while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); count++; } gs.info('Deleted ' + count);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('state', 'IN', '6,7');\ngr.addQuery('active', false);\ngr.query();\ngs.info('Matches: ' + gr.getRowCount());\nvar count = 0;\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n  count++;\n}\ngs.info('Deleted ' + count);",
      explain: 'Rendu addQuery = AND. Nee PDI lo tested: Resolved incident active = true ga untundi, Closed ayinappude active = false — kabatti active = false filter Resolved vaatini kapadutundi. Practice data lo INC0010005 Closed + inactive → delete. Variant lo: Resolved kani ACTIVE incident — delete avvakudadu; Canceled (8) inactive — delete avvakudadu; Closed (7) inactive — delete avvali.',
      tests: [
        { label: 'Logs', logs: ['Matches: 1', 'Deleting INC0010005', 'Deleted 1'] },
        { label: 'Remaining 7', expr: TOTAL, expect: 7 },
      ],
      variants: [{
        name: 'Resolved-active, Canceled, Closed incidents',
        scenario: SEED(
          { sys_id: 'res_act', short_description: 'Outlook password prompt', category: 'software', state: '6', active: 'true' },
          { sys_id: 'canc', short_description: 'Duplicate laptop request', category: 'hardware', state: '8', active: 'false' },
          { sys_id: 'closed_old', short_description: 'Old printer ticket', category: 'hardware', state: '7', active: 'false' },
        ),
        tests: [
          { label: 'Logs', logs: ['Matches: 2', 'Deleting INC0010005', 'Deleting INC0010011', 'Deleted 2'] },
          { label: 'Resolved-active + Canceled migilayi, Closed poyindi', expr: EXISTS(['res_act', 'canc', 'closed_old']), expect: [true, true, false] },
        ],
      }],
    }),
    jx('cs-crud2', 8, 'updateMultiple() — count chusi bulk update', 'hard', {
      server: true,
      task: 'Loop lekunda bulk update: ACTIVE network incidents anni ni state 2 chey — updateMultiple() tho. SAFE ga: mundu same filter tho check GlideRecord query chesi "Will update: N" log chey; tarvata gr lo same filter + setValue("state", 2) + gr.updateMultiple(). (updateMultiple ki next() loop / query() avasaram ledu.) 🧰 Vaade words: getRowCount(), setValue(), updateMultiple()',
      starter: "// Step 1: check = new GlideRecord('incident') — same filter, query, 'Will update: ' + count log\n\n// Step 2: gr = new GlideRecord('incident') — same filter, setValue('state', 2), updateMultiple()\n",
      hint: [
        'Rendu GlideRecords: okati count kosam (query + getRowCount), inkokati update kosam (filter + setValue + updateMultiple). Loop ledu.',
        "check.addQuery('category', 'network'); check.addActiveQuery(); check.query(); gs.info('Will update: ' + check.getRowCount());",
        "var gr = new GlideRecord('incident'); gr.addQuery('category', 'network'); gr.addActiveQuery(); gr.setValue('state', 2); gr.updateMultiple();",
      ],
      solution: "var check = new GlideRecord('incident');\ncheck.addQuery('category', 'network');\ncheck.addActiveQuery();\ncheck.query();\ngs.info('Will update: ' + check.getRowCount());\n\nvar gr = new GlideRecord('incident');\ngr.addQuery('category', 'network');\ngr.addActiveQuery();\ngr.setValue('state', 2);\ngr.updateMultiple();",
      explain: 'updateMultiple() query ki match ayye ANNI records ni okesari marchutundi. Filter lo typo unte (PDI condition ignore chestundi) motham table marutundi — anduke mundu count. ⚠️ Docs: updateMultiple tho setValue() vaadu, gr.state = 2 direct assign vaddu — PDI lo test cheyyaku.',
      tests: [
        { label: 'Log', logs: ['Will update: 2'] },
        { label: 'Table: INC0010002, INC0010007 state 2', expr: DBS('state', ['inc2', 'inc7']), expect: ['2', '2'] },
        { label: 'Vere incidents marchaledu (INC0010006 state 1)', expr: DBS('state', ['inc6']), expect: ['1'] },
      ],
      variants: [{ name: 'inko active + oka inactive network incident', scenario: NET_SEED, tests: [{ label: 'Log', logs: ['Will update: 3'] }, { label: 'Table: active vi 2, inactive 7 laage', expr: DBS('state', ['inc2', 'inc7', 'net_new', 'net_old']), expect: ['2', '2', '2', '7'] }] }],
    }),
    jx('cs-crud2', 9, 'deleteMultiple() — count limit tho', 'hard', {
      server: true,
      scenario: SEED(
        { short_description: 'Old laptop request', category: 'hardware', state: '7', active: 'false' },
        { short_description: 'Old VPN ticket', category: 'network', state: '7', active: 'false' },
      ),
      task: 'Inactive Closed (state 7, active false) incidents anni deleteMultiple() tho delete cheyyali — kani SAFE ga: mundu check GlideRecord tho same filter count (n) chudu. n 5 kante ekkuva ayithe "Too many: " + n + " - stopped" log chesi EMI delete cheyyaku (filter tappu / typo anumanam). Lekapothe "Deleting " + n log chesi, rendo GlideRecord tho same filter + deleteMultiple(). (Practice data lo INC0010005 already Closed; ee scenario inka rendu Closed incidents add chestundi.) 🧰 Vaade words: getRowCount(), if / else, deleteMultiple()',
      starter: "// Step 1: check — state 7 + inactive, query, n = count\n// Step 2: n > 5 ayithe 'Too many: ' + n + ' - stopped' log (delete VADDU)\n// Step 3: lekapothe 'Deleting ' + n log, kotha GlideRecord — same filter, deleteMultiple()\n",
      hint: [
        'Count mundu, delete tarvata — madhyalo if. deleteMultiple() ki loop / query() avasaram ledu, filter chalu.',
        "var check = new GlideRecord('incident'); check.addQuery('state', 7); check.addQuery('active', false); check.query(); var n = check.getRowCount();   if (n > 5) { ... } else { ... }",
        "if (n > 5) { gs.info('Too many: ' + n + ' - stopped'); } else { gs.info('Deleting ' + n); var gr = new GlideRecord('incident'); gr.addQuery('state', 7); gr.addQuery('active', false); gr.deleteMultiple(); }",
      ],
      solution: "var check = new GlideRecord('incident');\ncheck.addQuery('state', 7);\ncheck.addQuery('active', false);\ncheck.query();\nvar n = check.getRowCount();\nif (n > 5) {\n  gs.info('Too many: ' + n + ' - stopped');\n} else {\n  gs.info('Deleting ' + n);\n  var gr = new GlideRecord('incident');\n  gr.addQuery('state', 7);\n  gr.addQuery('active', false);\n  gr.deleteMultiple();\n}",
      explain: 'deleteMultiple() tarvata undo meeda aadharapadaku ("Record for rollback?" unna kuda), update set kuda capture cheyyadu. Real data fix scripts lo "expected count" kante ekkuva vaste aapadam safe habit — field typo ayithe query motham table istundi, ee limit adi pattukuntundi. Main run: INC0010005 + rendu kotha = 3 Closed → delete. Variant lo 8 Closed incidents (7 kotha + INC0010005) — script aagali.',
      tests: [
        { label: 'Log', logs: ['Deleting 3'] },
        { label: 'Remaining 7 (Closed 3 poyayi)', expr: TOTAL, expect: 7 },
        { label: 'INC0010005 (Closed) kuda poyindi', expr: EXISTS(['inc5']), expect: [false] },
      ],
      variants: [{
        name: '8 Closed incidents (anumanam!)',
        scenario: SEED(...['Old laptop request', 'Old VPN ticket', 'Old printer ticket', 'Old mouse request', 'Old Wi-Fi ticket', 'Old Outlook ticket', 'Old badge request'].map((s) => ({ short_description: s, category: 'hardware', state: '7', active: 'false' }))),
        tests: [{ label: 'Log', logs: ['Too many: 8 - stopped'] }, { label: 'Emi delete avvaledu (15)', expr: TOTAL, expect: 15 }],
      }],
    }),
  ],
}

/* 13 — Debugging */
const debug = {
  id: 'cs-debug',
  mode: 'pdi',
  title: 'Client & Server Side Debugging',
  video: 'Client and Server side Debugging',
  duration: '',
  no: 13,
  blurb: 'jslog / console, browser dev tools, gs.info + System Logs, System Diagnostics tools — scripts ela debug chestam.',
  learn: [
    {
      h: '🌐 Client side debugging',
      body: [
        'Browser lo F12 (Developer Tools) → Console tab. Client scripts lo jslog("message") leda console.log("...") rasthe ikkada kanipistayi. g_form.addInfoMessage("...") tho form paina kuda chudochu.',
        'Console lo g_form.getValue("urgency") type chesi values test cheyyochu (form open ayi unnappudu). Sources tab lo breakpoints pettochu.',
        'Next Experience lo classic form oka iframe ("gsft_main") lopala untundi (nee PDI lo tested) — Console paina context dropdown lo aa frame select chey, leda form ni direct URL tho open chey (https://<instance>/incident.do?sys_id=…) — appudu iframe undadu.',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading) {
  jslog('onChange: ' + oldValue + ' -> ' + newValue);
}`,
    },
    {
      h: '🖧 Server side debugging',
      body: [
        'gs.info("..."), gs.warn, gs.error, gs.debug tho log chestam. Chudataniki: All → System Logs → System Log → Script Log Statements (leda All). Background Script lo output ventane "*** Script: …" ga kanipistundi.',
        'gs.print() / gs.log() paata style (global scope lo inka pani chestayi); kotha code lo gs.info. Scoped apps lo gs.info / gs.warn / gs.error matrame.',
      ],
      code: `gs.info('Urgency value: ' + current.getValue('urgency'));
gs.error('Update failed for ' + current.getValue('number'));`,
    },
    {
      h: '🛠️ System Diagnostics tools',
      body: [
        'Nee PDI lo ivi All → System Diagnostics lo unnayi (tested): Script Debugger (server scripts ki breakpoints, step-by-step), Session Debug (Debug Business Rule, Debug Log … — ee session lo run ayinavi form kinda chupistundi), Script Tracer (oka transaction lo e scripts run ayyayo trace), Debug UI Macro.',
        'Scripts - Background matram System Definition lo. Session Debug on chesaka pani ayyaka off cheyyi — All → System Diagnostics → Session Debug → "Disable All" (nee PDI lo undi) — lekapothe prathi page kinda debug output vastundi.',
      ],
    },
    {
      h: '👁️ Field Watcher (form ☰ menu lo)',
      body: [
        'Brazil lo "Field Watcher", "JavaScript Log" ane MODULES levu (PDI lo tested — navigator lo vethikinaa raavu). Avatar (user) menu → Preferences lo kuda levu: Preferences → Debugging lo "Script Debugger" (Open), ATF Page Inspector toggle, "Next Experience Developer Tools" matrame untayi.',
        'Field Watcher ekkada: classic incident FORM lo ☰ menu (form title pakkana icon, leda form header meeda right-click) → "Enable Field Watcher" (nee PDI lo chusam). Ade menu lo Show XML, Copy sys_id, Configure ▸ (Form Layout, Client Scripts, UI Policies, UI Actions …) kuda untayi.',
        'On chesaka oka field ni watch chesthe aa field ni e script / UI Policy marchindo form kinda panel lo chupistundi ⚠️ (field label right-click lo "watch" option, panel ela untundo PDI lo chudu). jslog() output ki F12 Console chalu.',
        '"Next Experience Developer Tools" = vere browser extension — install cheyyaku, ee course ki avasaram ledu.',
      ],
      checks: ['field-watcher'],
    },
    {
      h: '🧠 Tips',
      body: ['Mundu problem ekkada (client na server) ani gurtinchu: save cheyyakamunde marithe client, save tarvata marithe server. Log tho values print chesi chudu — oka assumption oka saari verify chey. Debug logs tarvata teeseyyi (production lo noise, performance kuda).'],
    },
  ],
  quiz: [
    q('Client script debug ki?', ['jslog() / console.log + F12 Console', 'gs.info() + Script Log Statements', 'Update Set lo log chudadam', 'System Properties lo log file chudadam'], 0, 'Client = browser: jslog / console.log, F12 Console.'),
    q('gs.info() output ekkada chudali?', ['System Log → Script Log Statements', 'Browser F12 console lo matrame kanipistundi', 'Form paina blue message ga', 'Admin ki email ga vastundi'], 0, 'All → System Logs → System Log → Script Log Statements (Background Script lo ayithe ventane output lo).'),
    q('Business Rules ela debug chestam?', ['Session Debug → Debug Business Rule', 'Client Scripts list lo Script filter chesi', 'UI Policies list lo search chesi', 'Dictionary entry lo attribute tho'], 0, 'Session Debug → Debug Business Rule — ee session lo run ayina Business Rules form kinda chupistundi.'),
    q('Step-by-step server debug (breakpoints)?', ['Script Debugger', 'jslog() calls', 'gs.print() lines', 'Update Set preview'], 0, 'Script Debugger (System Diagnostics) — server scripts lo breakpoints.'),
    q('Debug logs pani ayyaka?', ['Teeseyyali (noise)', 'Anni ikkade vadileyali', 'Production lo pettali', 'Em kaadu'], 0, 'Debug logs production lo noise create chestayi, performance ki kuda effect — kaabatti teeseyyali.'),
  ],
  exercises: [
    jx('cs-debug', 5, 'Debug tools ekkada unnayi?', 'easy', {
      scenario: 'Navigator lo "System Diagnostics" open chesi debugging modules vethuku — Script Debugger, Session Debug, Script Tracer, Debug UI Macro. "Field Watcher" kuda vethiki chudu (Brazil lo module ledu — adi form ☰ menu lo untundi).',
      hint: 'All → filter lo "System Diagnostics" type chey, modules list scroll chey. Field Watcher: oka incident form lo ☰ menu (form title pakkana).',
      steps: ['All menu open chesi filter lo "System Diagnostics" type chey.', 'Script Debugger, Session Debug (Debug Business Rule, Debug Log …, Disable All), Script Tracer, Debug UI Macro modules chudu.', 'Filter lo "Field Watcher" type chey — module raadu ani gamaninchu.', 'Oka incident open chesi ☰ menu open chey — "Enable Field Watcher" option chudu (click cheyyakkarledu), tarvata menu close chey.'],
      answer: 'Debug modules anni System Diagnostics kinda untayi; Field Watcher / JavaScript Log modules levu — Field Watcher form ☰ menu lo "Enable Field Watcher" ga untundi.',
      cleanup: 'Read-only — em marchaledu.',
    }),
    jx('cs-debug', 1, 'Background script log', 'easy', {
      scenario: 'Background Script lo gs.info tho oka message log chesi, output ela kanipistundo chudu, tarvata System Log lo kuda vethuku.',
      hint: 'All → System Definition → Scripts - Background. Logs: All → System Logs → System Log → Script Log Statements.',
      steps: ['Scripts - Background open chey.', 'gs.info("SnowKeer debug test") rasi "Run Script" click chey.', 'Output lo message chudu.', 'System Logs → System Log → Script Log Statements lo "SnowKeer debug test" filter chesi vethuku.'],
      answer: 'Background output lo "*** Script: SnowKeer debug test". Script Log Statements lo kuda aa message tho entry untundi.',
      cleanup: 'Em marchaledu — log entries alage undochu (delete avasaram ledu).',
    }),
    jx('cs-debug', 2, 'Browser console lo g_form', 'easy', {
      scenario: 'Oka incident form open chesi browser console lo g_form.getValue("urgency") run chesi value chudu.',
      hint: 'F12 → Console. g_form undefined ani vaste: Console context dropdown lo form frame (gsft_main) select chey, leda form ni direct URL tho (…/incident.do?sys_id=…) open chey.',
      steps: ['Any incident open chey.', 'F12 press chesi Console tab open chey.', 'g_form.getValue("urgency") type chesi Enter.', 'Pani cheyyakapothe Console context dropdown lo form frame select chesi malli try chey.'],
      answer: 'Urgency VALUE string ga ("2" laaga) print avtundi — label kaadu. g_form.getTableName() → "incident".',
      cleanup: 'Em marchaledu (console lo values marchi unte form Save cheyyakunda close chey).',
    }),
    jx('cs-debug', 3, 'jslog tho client script', 'medium', {
      scenario: 'Test onChange client script (incident, field = urgency) create chesi jslog tho oldValue / newValue log chey; urgency marchi console lo chudu. (Priority vaddu — nee PDI lo adi read-only.)',
      hint: 'All → System Definition → Client Scripts → New. Script lo guard: if (isLoading) return;',
      steps: ['Client Script new: Name "SnowKeer debug", Table incident, Type onChange, Field name Urgency.', 'Script: function onChange(control, oldValue, newValue, isLoading) { if (isLoading) return; jslog("urgency: " + oldValue + " -> " + newValue); }', 'Submit; incident open chesi F12 Console open chey, urgency marchu (Save cheyyakkarledu).', 'Console lo log chudu.'],
      answer: 'Console lo "urgency: 3 -> 2" laaga log vastundi (oldValue = form load ayinappati value).',
      cleanup: '"SnowKeer debug" client script ni delete chey. Urgency marchina incident form ni Save cheyyakunda close chey.',
    }),
    jx('cs-debug', 4, 'Session Debug tho Business Rule', 'hard', {
      scenario: 'Debug Business Rule on chesi oka test incident update chesi, run ayina Business Rules form kinda debug output lo chudu. Pani ayyaka debug off.',
      hint: 'All → System Diagnostics → Session Debug → Debug Business Rule. Off: System Diagnostics → Session Debug → "Disable All" (nee PDI lo undi).',
      steps: ['System Diagnostics → Session Debug → Debug Business Rule click chey.', 'Oka incident open chesi Short description chivara " (test)" add chesi Update / Save chey.', 'Form kinda debug output lo run ayina Business Rules (peru, before / after) chudu.', 'Session Debug → Disable All tho debug off chey.'],
      answer: 'Debug output lo run ayina Business Rules list (peru + order) kanipistundi.',
      cleanup: 'Debug off (Disable All). Short description lo add chesina " (test)" teesesi malli Save chey.',
    }),
  ],
}

/* 14 — Syntax editor macros */
const macros = {
  id: 'cs-macros',
  mode: 'pdi',
  title: 'Syntax Editor Macros',
  video: 'Syntax Editor Macros',
  duration: '',
  no: 14,
  blurb: 'Script editor lo short words (vargr → Ctrl+Space → Enter) tho code snippets — mariyu nee own macro create cheyyadam.',
  learn: [
    {
      h: '⚡ Macros ante?',
      body: [
        'Nee Brazil PDI lo script editors anni (Scripts - Background page, Script Include / Business Rule form lo Script field) Monaco editor. Macro peru type chesi Ctrl+Space nokku → suggestion list lo aa macro select chesi Enter → snippet insert avtundi (nee PDI lo tested). Udaharana: "vargr" → Ctrl+Space → Enter → GlideRecord template.',
        'Tab nokkite tab space matrame vastundi — expand avvadu. Video lo "vargr + Tab" chusthe adi paata editor; nee PDI lo Ctrl+Space vaadu.',
        'Nee PDI lo unna macros (System Definition → Syntax Editor Macros, tested): doc, for, ialogbr, ialogsi, info, method, vargr, vargror. "help" kuda Ctrl+Space list lo kanipistundi (adi record kaadu, editor built-in — PDI lo tested).',
        'Typing save + typos takkuva. Scripts - Background (System Definition) leda Business Rule / Script Include editor lo try chey. Prathi macro em istundo daani record lo Comments + Text chaduvu.',
      ],
      code: `vargr  →  Ctrl+Space  →  vargr select  →  Enter
var gr = new GlideRecord("");    // cursor "" lopala — table peru type chey
//gr.addQuery("name", "value");
//gr.query();
//if (gr.next()) {
//
//}
(approx — exact Text vargr record lo chudu)`,
    },
    {
      h: '📝 Macro record — nee own macro',
      body: [
        'System Definition → Syntax Editor Macros lo prathi macro oka record: Name (type chese short word), Comments (macro em chestundo description), Text (insert ayye code). Text lo $0 = insert ayyaka cursor ekkada undalo.',
        'Nee own macro: New → Name "snowinc", Comments, Text lo nee snippet → Submit. Tarvata editor lo snowinc type chesi Ctrl+Space → snowinc select → Enter. Practice tarvata record delete chey (current update set lo record avtundi — delete chesthe chalu).',
      ],
      code: `Name:     snowinc
Comments: SnowKeer — incident query loop
Text:
var inc = new GlideRecord('incident');
inc.addQuery('$0', '');
inc.query();
while (inc.next()) {
  gs.info(inc.getValue('number'));
}`,
    },
    {
      h: '🧰 Inka editor features',
      body: [
        'Scripts - Background page paina toolbar undi (Monaco). Buttons / shortcut keys (full screen, comment / uncomment, format, search / replace …) ⚠️ exact ga PDI lo chudu — toolbar meeda mouse pettithe tooltip. F11 = browser full screen, editor di kaadu.',
        'Ctrl+Space = suggestions list (macros kuda andulone vastayi — PDI lo tested). gs. / gr. type chesthe methods kuda suggest chestundo ⚠️ PDI lo try chesi chudu. Syntax errors line pakkana mark tho kanipistayi — save mundu chudu.',
        'Script Include / Business Rule form lo Script field daggara "Turn on ECMAScript 2021 (ES12) mode" toggle undi (nee PDI lo chusam) — aa OKKA script ki on chesthe let, class laanti kotha syntax allow (global scope lo kuda). Scripts - Background lo ee toggle ledu — akkada let / class SyntaxError (PDI lo tested). Ee course lo var tho rayi; toggle undi ani telisthe chalu.',
      ],
      checks: ['monaco-suggest'],
    },
  ],
  quiz: [
    q('Nee Brazil PDI script editor lo macro ela insert chestam?', ['Peru type → Ctrl+Space → Enter', 'Peru type chesi Tab nokku', 'Peru type chesi Ctrl+S nokku', 'Peru meeda right-click chey'], 0, 'Brazil lo script editors anni Monaco: macro peru type chesi Ctrl+Space → suggestion list lo pick → Enter (nee PDI lo tested). Tab ayithe tab space matrame — video lo Tab tho expand chusthe adi paata editor.'),
    q('vargr em generate chestundi?', ['GlideRecord query template', 'onChange client script template', 'UI Action template', 'Comment block matrame'], 0, 'vargr = GlideRecord snippet (addQuery / query / next lines comments ga).'),
    q('Macro peru type chesi Ctrl+Space nokkina list lo aa macro raaledu. First check?', ['Macro peru spelling / record undaa', 'Browser cache + cookies clear cheyyali', 'Instance restart cheyyali', 'Update set marchali'], 0, 'Syntax Editor Macros list lo aa Name tho record undo, spelling correct aa chudu. Kotha macro ayithe editor page okasari reload chesi kuda try chey.'),
    q('Macros valla benefit?', ['Typing + typos takkuva', 'Server speed perugutundi', 'Security perugutundi', 'Em benefit ledu'], 0, 'Fast & accurate — same code malli malli type cheyyakkarledu.'),
    q('Macro snippet expand ayyaka code run avtunda?', ['Ledu — editor lo text matrame', 'Avunu — ventane server lo run', 'Avunu — save chesinappudu run', 'Background lo schedule avtundi'], 0, 'Macro text matrame insert chestundi — run cheyyalante nuvve "Run Script" (Background) / Save chesi trigger chey.'),
  ],
  exercises: [
    jx('cs-macros', 1, 'vargr macro', 'easy', {
      scenario: 'Scripts - Background editor lo "vargr" type chesi Ctrl+Space nokki, suggestion list lo vargr select chesi Enter — template insert avtundo chudu. Tab tho em avtundo kuda compare chey. (Run cheyyaku, just try.)',
      hint: 'All → System Definition → Scripts - Background. Monaco editor lo macros Ctrl+Space tho vastayi — Tab kaadu.',
      steps: ['Scripts - Background open chey.', 'Editor lo vargr type chesi Tab nokku — tab space matrame vastundi, expand avvadu. Aa tab space teesey (Backspace).', 'Ippudu vargr chivara cursor unchi Ctrl+Space nokku — suggestion list lo vargr select chesi Enter.', 'GlideRecord("") lo cursor undi — "incident" type chey.', 'Comment (//) lines chudu — kavalsina lines uncomment chesi vaadochu.'],
      answer: 'Tab tho em expand avvadu. Ctrl+Space → vargr → Enter tho var gr = new GlideRecord("incident"); + commented addQuery / query / if (gr.next()) lines vastayi.',
      cleanup: 'Script run cheyyaku, editor clear chey (Background Script save avvadu).',
    }),
    jx('cs-macros', 2, 'Macros list chudu', 'easy', {
      scenario: 'Nee PDI lo e macros unnayo chudu: System Definition → Syntax Editor Macros list open chesi prathi macro Comments chaduvu. Editor lo "help" ni Ctrl+Space tho kuda try chey.',
      hint: 'Navigator lo "Syntax Editor Macros" type chey. "help" record kaadu — editor built-in; Ctrl+Space suggestion list lo kanipistundi (PDI lo tested).',
      steps: ['All → System Definition → Syntax Editor Macros open chey.', 'List lo 8 records: doc, for, ialogbr, ialogsi, info, method, vargr, vargror — prathi daani Comments chaduvu.', 'Scripts - Background editor lo "help" type chesi Ctrl+Space — list lo help kanipistundi; select chesi Enter, em insert ayyindo chudu.', '3 macros (vargr, for, info) note chesuko.'],
      answer: 'doc, for, ialogbr, ialogsi, info, method, vargr, vargror — prathi record lo Name, Comments, Text untayi. "help" Ctrl+Space list lo vastundi (record kaadu).',
      cleanup: 'Records lo em marchaku, em save cheyyaku. Background Script editor clear chey (run cheyyaku).',
    }),
    jx('cs-macros', 3, 'Snippet tho query rayi', 'medium', {
      scenario: 'vargr macro vaadi incident table lo priority = 1 records count gs.info chey, Run chesi output chudu (read-only).',
      hint: 'gr.addQuery("priority", 1); gr.query(); gs.info(gr.getRowCount());',
      steps: ['Scripts - Background lo vargr → Ctrl+Space → Enter, table "incident".', 'addQuery line uncomment chesi ("priority", 1) pettu; query() line uncomment chey.', 'if (gr.next()) block teesesi gs.info(gr.getRowCount()); rayi.', '"Run Script" click chey.'],
      answer: 'Output lo "*** Script: N" — P1 incidents count.',
      cleanup: 'Read-only query — em marchaledu.',
    }),
    jx('cs-macros', 4, 'Nee own macro create chey', 'hard', {
      scenario: 'Custom macro "snowinc" create chey (lesson card "📝 Macro record" lo unna Text), tarvata Scripts - Background lo snowinc → Ctrl+Space → Enter tho insert chesi chudu.',
      hint: 'All → System Definition → Syntax Editor Macros → New. Text lo $0 = cursor position.',
      steps: ['Syntax Editor Macros → New.', 'Name: snowinc, Comments: "SnowKeer — incident query loop", Text: card lo unna code (addQuery lo $0 tho).', 'Submit.', 'Scripts - Background open chesi snowinc type chey, Ctrl+Space nokki list lo snowinc select chesi Enter — code insert ayyi cursor addQuery lo $0 unna chota untundi; "category" type chey. (List lo raakapothe page reload chesi malli try chey.)', 'Run cheyyakunda editor clear chey.'],
      answer: 'snowinc → Ctrl+Space → Enter tho nee snippet insert avtundi — cursor $0 unna chota untundi.',
      cleanup: 'Syntax Editor Macros lo "snowinc" record open chesi Delete chey. Background Script editor clear chey.',
    }),
  ],
}

/* 23 — Best practices */
const best = {
  id: 'cs-best',
  title: 'Client Side Scripting Best Practices',
  video: 'Client Side Scripting best Practices',
  duration: '',
  no: 23,
  blurb: 'Bugs ni correct ga fix chey: guard, string compare, DOM vaddu, synchronous calls vaddu, async callbacks.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.addInfoMessage('Changed to ' + newValue);\n}",
    scenario: { form: { values: { priority: '3' } } },
    client: CHG('priority', '3', '2'),
  },
  learn: [
    {
      h: '✅ Do',
      body: [
        'UI Policy tho ayye pani ki Client Script rayaku. onChange lo guard (isLoading / newValue === "") pettu. Client lo field values strings — "1" tho compare chey (number 1 tho === kaadu).',
        'g_form APIs matrame vaadu. Server data ki g_scratchpad (Display Business Rule) leda GlideAjax (callback). getReference ki ellappudu callback. Comments rayi; hard-coded sys_ids vaadaku.',
      ],
    },
    {
      h: '🚫 Don\'t',
      body: [
        'DOM manipulation (document.getElementById, jQuery, window.) vaddu — upgrades lo break avtayi, Service Portal / Workspace lo pani cheyyavu.',
        'ℹ️ Brazil lo kotha Client Script form lo blue banner untundi: new client scripts strict mode lo run avtayi — direct DOM, jQuery, prototype, window disable. ("Isolate script" field tho per-script marchochu.) Ante DOM vaddu ane rule ippudu platform ye enforce chestundi.',
        'Client lo GlideRecord vaddu (classic UI lo synchronous — browser aagutundi; Service Portal / Workspace lo support ledu — 📄 docs). Security ki client scripts avvu — ACLs / Business Rules vaadu. Same logic chala scripts lo copy cheyyaku.',
      ],
      code: `// 🚫 Bad
document.getElementById('incident.short_description').disabled = true;

// ✅ Good
g_form.setReadOnly('short_description', true);`,
    },
    {
      h: '⏱️ Async gurtupettuko',
      body: [
        'getReference(field, callback) / GlideAjax getXMLAnswer answers LATER vastayi — nee function return ayyaka. Call kinda unna lines ki answer inka raadu; answer tho chese pani antha callback LOPALE (ee site lo kuda ila ne run avtundi).',
        'Callback lekunda getReference(field) leda getXMLWait() = synchronous: answer vachhe varaku browser freeze; classic UI lo matrame (Service Portal / Workspace lo kaadu — 📄 docs). onSubmit async answer kosam wait cheyyadu ⚠️ (PDI lo check: kinda 🔍 box).',
      ],
      code: `// 🚫 Bad — name inka raaledu
var name = '';
g_form.getReference('caller_id', function (caller) {
  name = caller.name;
});
g_form.setValue('description', 'Caller: ' + name);   // '' !

// ✅ Good — callback LOPALA
g_form.getReference('caller_id', function (caller) {
  g_form.setValue('description', 'Caller: ' + caller.name);
});`,
      checks: ['async-submit'],
    },
  ],
  quiz: [
    q('Show / hide / mandatory simple cases ki?', ['UI Policy', 'Client Script always', 'Business Rule', 'Flow'], 0, 'UI Policy first — no-code, maintain cheyyadam easy.'),
    q('DOM manipulation enduku vaddu?', ['Upgrades / Workspace lo break avtundi', 'Browser lo chala chala slow ga run avtundi', 'Licence rules prakaram illegal', 'Server side lo kuda run avtundi'], 0, 'Unsupported & fragile — Brazil lo kotha client scripts strict mode lo DOM access block.'),
    q('Server data client ki?', ['g_scratchpad / GlideAjax (callback)', 'Synchronous GlideRecord client script lo', 'DOM nundi data teesukovadam', 'alert() tho server ni adagadam'], 0, 'Display Business Rule + g_scratchpad, leda GlideAjax callback.'),
    q('getReference ni ela vaadali?', ['Callback function tho', 'Callback lekunda (synchronous)', 'Loop lo', 'gs tho'], 0, 'Callback ellappudu — lekapothe browser freeze.'),
    q('Security ki?', ['ACL / Business Rule (server)', 'Client Script tho hide cheyyadam', 'UI Policy tho', 'Field ni form lo hide cheyyadam'], 0, 'Client side bypass cheyochu — server checks (ACL / Business Rule) kavali.'),
  ],
  exercises: [
    jx('cs-best', 1, 'Guard add chey', 'easy', {
      scenario: { form: { values: { priority: '' } } },
      client: CHG('priority', '3', ''),
      task: 'Ee onChange lo guard ledu — priority empty chesthe kuda message vastundi. Guard add chey (isLoading leda newValue === "" ayithe return) — appudu message raakudadu; nijamga marithe matram ravali.',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  g_form.addInfoMessage('Priority changed to ' + newValue);\n}",
      hint: "if (isLoading || newValue === '') { return; }",
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.addInfoMessage('Priority changed to ' + newValue);\n}",
      explain: 'Guard lekapothe load time lo / clear chesinappudu anavasara messages vastayi. Variants: nijamga 2 ki marithe message ravali; form load (isLoading) lo raakudadu.',
      tests: [{ label: 'Message raaledu', expr: MSGS, expect: [] }],
      variants: [
        { name: 'priority 2 ki marchithe', scenario: { form: { values: { priority: '2' } } }, client: CHG('priority', '3', '2'), tests: [{ label: 'message vachindi', expr: MSGS, expect: ['Priority changed to 2'] }] },
        { name: 'form load (isLoading)', scenario: { form: { values: { priority: '3' } } }, client: { trigger: { type: 'onChange', field: 'priority', oldValue: '', newValue: '3', isLoading: true } }, tests: [{ label: 'message raaledu', expr: MSGS, expect: [] }] },
      ],
    }),
    jx('cs-best', 2, 'String compare bug', 'easy', {
      scenario: { form: { values: { priority: '1' } } },
      client: { trigger: { type: 'onLoad' } },
      task: 'Ee onLoad P1 banner chupinchali kani raavatledu. Bug fix chey: g_form.getValue string istundi — number 1 tho === compare avvadu.',
      starter: "function onLoad() {\n  if (g_form.getValue('priority') === 1) {\n    g_form.addInfoMessage('P1 incident!');\n  }\n}",
      hint: "'1' (string) tho compare chey.",
      solution: "function onLoad() {\n  if (g_form.getValue('priority') == '1') {\n    g_form.addInfoMessage('P1 incident!');\n  }\n}",
      explain: '"1" === 1 false. String tho compare chey. Variant: P3 incident lo banner raakudadu (if teesesthe fail).',
      tests: [{ label: 'Banner', expr: MSGS, expect: ['P1 incident!'] }],
      variants: [{ name: 'P3 incident', scenario: { form: { values: { priority: '3' } } }, tests: [{ label: 'banner raakudadu', expr: MSGS, expect: [] }] }],
    }),
    jx('cs-best', 3, 'DOM kakunda g_form', 'medium', {
      scenario: { form: { values: {} } },
      client: { trigger: { type: 'onLoad' } },
      task: 'Ee script DOM tho field disable chestundi (bad practice, Workspace lo pani cheyyadu, Brazil strict mode lo block). g_form API tho short_description ni read-only chey.',
      starter: "function onLoad() {\n  document.getElementById('incident.short_description').disabled = true;\n}",
      hint: [
        'document... line teesesi, adhe pani (field ni edit cheyyakunda cheyyadam) g_form API tho chey.',
        'g_form.setReadOnly(<field name>, true)   — field name ki "incident." prefix avasaram ledu.',
        "function onLoad() { g_form.setReadOnly('short_description', true); }",
      ],
      solution: "function onLoad() {\n  g_form.setReadOnly('short_description', true);\n}",
      explain: 'g_form supported API — Next Experience, Workspace, Portal anni chota pani chestundi.',
      tests: [{ label: 'read-only', expr: '__f.short_description.readOnly', expect: true }],
    }),
    jx('cs-best', 5, 'Callback lekunda getReference vaddu', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', 'u_abel', 'u_bud'),
      task: 'Ee onChange (caller_id) lo getReference callback LEKUNDA undi = synchronous call: nee PDI classic UI lo record vachhe varaku browser freeze (Service Portal / Workspace lo assalu support ledu — 📄 docs). Callback form ki marchi, callback lopala jslog("Caller: <name>") chey. 🧰 Vaade words: g_form.getReference(), callback function, jslog()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // 🚫 Bad: callback lekunda. Rendo argument ga function pampi, log ni aa function LOPALIKI teesuko.\n  var caller = g_form.getReference('caller_id');\n  jslog('Caller: ' + caller.name);\n}",
      hint: [
        'getReference ki rendo argument ga oka function ivvali — record ready ayinappudu adi call avtundi, record parameter ga vastundi.',
        "g_form.getReference('caller_id', function (caller) { ... });   — var caller = ... line teesey.",
        "g_form.getReference('caller_id', function (caller) { jslog('Caller: ' + caller.name); });",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    jslog('Caller: ' + caller.name);\n  });\n}",
      explain: 'Callback form async — server nunchi record vachevaraku browser aagadu. Ee site synchronous calls ni lekka pedutundi — test "sync call ledu" ani check chestundi, so paata line unte fail.',
      tests: [
        { label: 'Log: Caller: Bud Richman', logs: ['Caller: Bud Richman'] },
        { label: 'callback tho pilichav (synchronous call ledu)', expr: '__x.syncGetReference', expect: 0 },
      ],
      variants: [{ name: 'vere caller (Beth)', scenario: { form: { values: { caller_id: 'u_beth' } } }, client: CHG('caller_id', 'u_abel', 'u_beth'), tests: [{ label: 'Log: Caller: Beth Anglin', logs: ['Caller: Beth Anglin'] }] }],
    }),
    jx('cs-best', 6, 'Callback lopale form update chey', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', 'u_abel', 'u_bud'),
      task: 'onChange (caller_id) — guard ready ga undi. getReference callback LOPALA description ni "Caller: <name> (<email>)" ga set chey (udaa: "Caller: Bud Richman (bud.richman@example.com)"). 🧰 Vaade words: g_form.getReference(), callback function, g_form.setValue()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // Step 1: caller_id record ni callback tho techchuko\n  // Step 2: callback LOPALA description = 'Caller: ' + name + ' (' + email + ')'\n}",
      hint: [
        '"Callback lekunda getReference vaddu" laage callback, kani ippudu log kaadu — form field set chey. caller vaade prathi line callback lopale undali.',
        "g_form.getReference('caller_id', function (caller) { g_form.setValue('description', ...); });",
        "g_form.setValue('description', 'Caller: ' + caller.name + ' (' + caller.email + ')');   — idi callback lopala",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller: ' + caller.name + ' (' + caller.email + ')');\n  });\n}",
      explain: 'Callback bayata setValue rasthe caller inka raaledu (async) — empty / undefined values vastayi. Ee site lo kuda callback tarvata run avtundi, kabatti aa bug ikkade kanipistundi.',
      tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller: Bud Richman (bud.richman@example.com)' }],
      variants: [{ name: 'vere caller (Beth)', scenario: { form: { values: { caller_id: 'u_beth' } } }, client: CHG('caller_id', 'u_abel', 'u_beth'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller: Beth Anglin (beth.anglin@example.com)' }] }],
    }),
    jx('cs-best', 7, 'Server call mundu guard', 'medium+', {
      scenario: { form: { values: { caller_id: '' } } },
      client: CHG('caller_id', 'u_bud', ''),
      task: 'Ee script lo guard ledu — caller ni clear chesinappudu kuda getReference call avtundi (anavasara server call) mariyu description lo "Caller: undefined" vastundi. Guard add chey (isLoading leda newValue === "" ayithe return). Caller unnappudu matram description "Caller: <name>" ga set avvali. 🧰 Vaade words: isLoading, newValue, return, g_form.getReference()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  // TODO: guard — server call ki MUNDU\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller: ' + caller.name);\n  });\n}",
      hint: [
        'Empty value ki server nunchi techchukodaniki emi ledu. Function modatilone aapeyyi — getReference daaka vellakudadu.',
        "if (isLoading || newValue === '') { ... }   — idi getReference line kante MUNDU",
        "if (isLoading || newValue === '') { return; }",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller: ' + caller.name);\n  });\n}",
      explain: 'Guard = takkuva server calls + takkuva bugs. Server call (getReference / GlideAjax) unna prathi onChange lo guard modatilo pettu. Nee PDI lo tested: EMPTY reference ki kuda getReference callback call avtundi — record lo fields undefined (caller.name undefined, "" kaadu) — anduke guard lekapothe "Caller: undefined" vastundi (ee sandbox lo kuda ade).',
      tests: [{ label: 'description empty ga undali', expr: "g_form.getValue('description')", expect: '' }],
      variants: [{ name: 'caller set chesinappudu', scenario: { form: { values: { caller_id: 'u_bud' } } }, client: CHG('caller_id', '', 'u_bud'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller: Bud Richman' }] }],
    }),
    jx('cs-best', 4, 'Client GlideRecord vaddu', 'hard', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', '', 'u_bud'),
      task: 'Ee script client lo GlideRecord vaadutundi (bad: synchronous, slow; ee sandbox lo block chesam). getReference + callback tho marchi description lo "Caller email: <email>" pettu.',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  var gr = new GlideRecord('sys_user');\n  gr.get(newValue);\n  g_form.setValue('description', 'Caller email: ' + gr.email);\n}",
      hint: [
        'GlideRecord lines (var gr ..., gr.get ...) teesesi, "Callback lekunda getReference vaddu" / "Callback lopale form update chey" laage getReference callback vaadu. Guard ala unchu.',
        "g_form.getReference('caller_id', function (caller) { ... caller.email ... });",
        "g_form.getReference('caller_id', function (caller) { g_form.setValue('description', 'Caller email: ' + caller.email); });",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller email: ' + caller.email);\n  });\n}",
      explain: 'Client lo GlideRecord synchronous call (browser freeze) — getReference callback leda GlideAjax vaadu. Variant lo vere caller — email hardcode chesthe fail.',
      tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller email: bud.richman@example.com' }],
      variants: [{ name: 'vere caller (Beth)', scenario: { form: { values: { caller_id: 'u_beth' } } }, client: CHG('caller_id', '', 'u_beth'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller email: beth.anglin@example.com' }] }],
    }),
  ],
}

/* 24 — UI Pages */
const HELLO_HTML = JELLY('  <h2>Hello ${gs.getUserDisplayName()}</h2>')
const EVAL_HTML = JELLY([
  '  <g:evaluate var="jvar_count">',
  "    var gr = new GlideRecord('incident');",
  '    gr.addActiveQuery();',
  '    gr.query();',
  '    gr.getRowCount();',
  '  </g:evaluate>',
  '  <h2>Hello ${gs.getUserDisplayName()}</h2>',
  '  <p>Active incidents: ${jvar_count}</p>',
].join('\n'))
const uipages = {
  id: 'cs-uipages',
  mode: 'pdi',
  title: 'UI Pages',
  video: 'Ui Pages',
  duration: '',
  no: 24,
  blurb: 'Custom pages: HTML + Jelly, g:evaluate, client script, URL / dialog (GlideModal) tho open cheyyadam.',
  learn: [
    {
      h: '📄 UI Page ante?',
      body: [
        'UI Page = ServiceNow lo nuvve design chese custom page. All → System UI → UI Pages lo create chestam. Name "my_page" ayithe URL: https://<instance>/my_page.do — record lo "Try It" button kuda untundi.',
        'Fields (Brazil): Name, HTML (page markup + Jelly), Client script (browser JS), Processing script (form submit ayinappudu server lo run).',
        'Use cases: custom forms, dialogs (UI Action nunchi popup), wizards. Pedda apps ki ippudu Service Portal / Workspace better — kani UI Pages chala legacy chotla untayi.',
      ],
    },
    {
      h: '🧩 HTML field = Jelly (XML)',
      body: [
        'Kotha UI Page HTML field lo ee skeleton already untundi: <?xml …?> + <j:jelly …> … </j:jelly>. Daanni ALAGE unchu — nee HTML <j:jelly> LOPALA pettu. Motham field ni nee HTML tho replace chesthe wrapper poyi page break avtundi.',
        'Idi XML — prathi tag close avvali (<br/>, <input … />). ${…} lopala server values: ${gs.getUserDisplayName()}.',
      ],
      code: HELLO_HTML,
    },
    {
      h: '🔢 g:evaluate — page lo server code',
      body: [
        '<g:evaluate var="jvar_count"> … </g:evaluate> lopala server JavaScript — LAST line value jvar_count lo padutundi; tarvata ${jvar_count} tho print. (jvar_ = Jelly variable convention. Chinna expression ayithe expression="…" attribute tho kuda rayochu.)',
        'XML kabatti JavaScript lo & mariyu < special: && ni &amp;&amp; ga, < ni &lt; ga rayali — e.g. if (a &amp;&amp; b), i &lt; 5. Lekapothe page XML parse error.',
      ],
      code: EVAL_HTML,
    },
    {
      h: '⏱️ Jelly phase 1 vs phase 2',
      body: [
        'Jelly rendu passes lo render avtundi (rendu server lone): phase 1 = ${ } + j: / g: tags (mundu run; result cache avvochu — 📄 docs, PDI lo easy ga test cheyyalem), phase 2 = $[ ] + j2: / g2: tags (prathi request ki run). Skeleton lo xmlns:j2="null" xmlns:g2="null" anduke untayi.',
        'Simple rule: user / time batti marey values ki phase 2 ($[ ], g2:evaluate) safe; static text ki phase 1. Nee PDI lo 227 out-of-box UI Pages $[ ] (phase 2) vaadutayi (chusam).',
      ],
      code: `<p>Phase 1: \${gs.getUserDisplayName()}</p>
<g2:evaluate var="jvar_user">gs.getUserName();</g2:evaluate>
<p>Phase 2: $[jvar_user]</p>`,
    },
    {
      h: '🪟 Dialog lo chupinchu (GlideModal)',
      body: [
        'Form nunchi popup kavali ante client UI Action lo GlideModal: new GlideModal("page_name") → setTitle() → render(). Nee PDI lo GlideModal undi (tested).',
        'GlideDialogWindow paata class (deprecated) — PDI lo inka undi kani kotha code lo GlideModal vaadu.',
      ],
      code: `// UI Action: Show Hello  (Client ✔, Form link ✔, Onclick: showHello())
function showHello() {
  var gm = new GlideModal('snowkeer_hello');
  gm.setTitle('Hello from SnowKeer');
  gm.render();
}`,
    },
  ],
  quiz: [
    q('UI Page URL ela untundi?', ['<instance>/<name>.do', '<instance>/ui/<name>', '<instance>/page/<name>', '<instance>/<name>.html'], 0, 'UI Page URL: <instance>/<page name>.do — e.g. /snowkeer_hello.do.'),
    q('UI Page HTML lo server value ela print chestam?', ['${...} Jelly expression', 'g_form.getValue() call', 'current.getValue() call', 'alert() popup tho'], 0, 'Jelly ${...} (leda phase 2 $[...]) server lo evaluate ayyi HTML lo print avtundi.'),
    q('Form submit ayinappudu server lo run ayyedi?', ['Processing script', 'Client script field', 'HTML field', 'Condition field'], 0, 'Processing script — server lo, form post ayinappudu.'),
    q('g:evaluate lopala JavaScript && ela rayali?', ['&amp;&amp; (XML escape)', '&& — direct ga, emi marchakunda', '"and" ane word tho (JEXL laaga)', '&& ni brackets lo pettali'], 0, 'HTML field XML — & ni &amp; ga, < ni &lt; ga rayali; lekapothe XML parse error.'),
    q('UI Page record nunchi page ventane open chesi chudataniki?', ['Try It button', 'Preview button', 'Run Script', 'Test Page link'], 0, 'UI Page record lo "Try It" — leda browser lo <instance>/<name>.do.'),
  ],
  exercises: [
    jx('cs-uipages', 1, 'Hello page', 'easy', {
      scenario: 'UI Page "snowkeer_hello" create chesi "Hello <nee peru>" chupinchu. URL: /snowkeer_hello.do. (Ee page ne next 3 exercises lo vaadatam — delete cheyyaku.)',
      hint: 'All → System UI → UI Pages → New. HTML field lo unna skeleton ALAGE unchi, <j:jelly …> lopala h2 line pettu (card "🧩 HTML field" lo full code).',
      steps: ['UI Pages → New. Name: snowkeer_hello.', 'HTML field lo default skeleton undi — <j:jelly …> mariyu </j:jelly> madhya <h2>Hello ${gs.getUserDisplayName()}</h2> pettu.', 'Submit. Record open chesi "Try It" click chey (leda instance URL + /snowkeer_hello.do).'],
      answer: 'Page lo "Hello System Administrator" (nee display name) kanipistundi.',
      cleanup: 'Ippude delete cheyyaku — next exercises lo kavali. Final cleanup "Dialog ga open (GlideModal)" lo; madhyalo aapesthe UI Pages lo snowkeer_hello delete chey.',
    }),
    jx('cs-uipages', 2, 'Server value (g:evaluate)', 'medium', {
      scenario: 'Prerequisite: "Hello page" lo chesina snowkeer_hello. Same page lo active incidents count chupinchu ("Active incidents: N") — g:evaluate tho GlideRecord.',
      hint: '<g:evaluate var="jvar_count"> lopala query, LAST line gr.getRowCount(); — aa value jvar_count lo padutundi. ${jvar_count} tho print.',
      steps: ['snowkeer_hello open chey.', 'HTML field ni card "🔢 g:evaluate" lo unna full HTML tho match chey (g:evaluate block + <p>Active incidents: ${jvar_count}</p>).', 'Update; Try It tho malli open chey.'],
      answer: 'Page lo "Active incidents: N" (nee PDI count).',
      cleanup: 'Ippude em delete cheyyaku — page next exercises lo kavali (final cleanup "Dialog ga open (GlideModal)" lo).',
    }),
    jx('cs-uipages', 3, 'Client script button', 'medium', {
      scenario: 'Prerequisite: snowkeer_hello page. Page lo button pettu, click chesthe Client script field lo unna function (alert) run avvali.',
      hint: 'HTML lo <button type="button" onclick="sayHi()">Click me</button> (j:jelly lopala). Client script field lo function sayHi() { alert("Hi from SnowKeer"); }',
      steps: ['snowkeer_hello open chey.', 'HTML lo </j:jelly> KANTE MUNDU <button type="button" onclick="sayHi()">Click me</button> add chey.', 'Client script field lo: function sayHi() { alert("Hi from SnowKeer"); }', 'Update, Try It, button click chey.'],
      answer: 'Alert popup "Hi from SnowKeer" vastundi.',
      cleanup: 'Ippude delete cheyyaku — final cleanup next exercise ("Dialog ga open (GlideModal)") lo.',
    }),
    jx('cs-uipages', 4, 'Dialog ga open (GlideModal)', 'hard', {
      scenario: 'Prerequisite: snowkeer_hello page. Incident form meeda "Show Hello" form link (client UI Action) create chesi, click chesthe aa page GlideModal dialog lo open avvali.',
      hint: 'UI Action: Client ✔, Form link ✔, Onclick: showHello(). Script: function showHello() { var gm = new GlideModal("snowkeer_hello"); gm.setTitle("Hello"); gm.render(); }',
      steps: ['System Definition → UI Actions → New: Name "Show Hello", Table incident, Client ✔, Form link ✔, Onclick showHello().', 'Script lo card "🪟 Dialog" lo unna showHello() function paste chey. Submit.', 'Oka incident open chesi kinda Related Links lo "Show Hello" click chey.'],
      answer: 'Dialog lo snowkeer_hello page (Hello + count + button) kanipistundi. (GlideDialogWindow tho kuda open avtundi kani adi deprecated — kotha code ki GlideModal.)',
      cleanup: 'Final cleanup: UI Action "Show Hello" delete chey, UI Pages lo snowkeer_hello delete chey.',
    }),
  ],
}

/* 25 — UI Pages continuation */
const CREATE_HTML = JELLY([
  '  <g:ui_form>',
  '    <p>Short description:</p>',
  '    <input type="text" name="short_desc" id="short_desc" />',
  '    <g:dialog_buttons_ok_cancel ok="return validate()" />',
  '  </g:ui_form>',
].join('\n'))
const CREATE_CLIENT = `function validate() {
  if (document.getElementById('short_desc').value == '') {
    alert('Short description kavali');
    return false;      // false → form post avvadu
  }
  return true;         // true → form post → Processing script
}`
const CREATE_PROCESSING = `var gr = new GlideRecord('incident');
gr.initialize();
gr.setValue('short_description', request.getParameter('short_desc'));
gr.insert();`
const uipages2 = {
  id: 'cs-uipages2',
  mode: 'pdi',
  title: 'UI Pages — Continuation (forms & processing)',
  video: 'UI Pages continuation',
  duration: '',
  no: 25,
  blurb: 'UI Page lo form, validation (client script), processing script tho record create — prathi field ki daani code.',
  learn: [
    {
      h: '📝 Form → validate → Processing script',
      body: [
        'Flow: <g:ui_form> lo inputs (name tho) + <g:dialog_buttons_ok_cancel ok="return validate()" />. OK click → Client script validate() → true ayithe form POST → Processing script (server) run → request.getParameter("short_desc") tho value.',
        '⚠️ ok_type="button" pettaku: default ok_type "submit" — "button" ayithe form post avvadu, Processing script EPPUDU run avvadu (nee PDI lo tested). Out-of-box add_catalog_item page kuda ok="return validateNewItem()" ane rastundi, ok_type lekunda.',
        'Kinda 3 cards lo prathi FIELD ki separate code undi — prathi okati daani field lo paste chey (HTML card lo j:jelly wrapper tho saha).',
      ],
    },
    {
      h: '🧾 HTML field',
      body: ['Input ki name="short_desc" mukhyam — form post lo value name tho veltundi (id client script kosam). Buttons ui_form LOPALA undali.'],
      code: CREATE_HTML,
    },
    {
      h: '💻 Client script field',
      body: ['validate() false return chesthe OK post aagutundi — user page lone untadu. (gel("short_desc") = document.getElementById ki ServiceNow shortcut — UI Page lo nee HTML ki DOM normal.)'],
      code: CREATE_CLIENT,
    },
    {
      h: '🖧 Processing script field',
      body: ['Form post ayinappudu server lo run avtundi. Form values request.getParameter("<input name>") tho chaduvutam (out-of-box UI Pages ila ne vaadutayi). Ikkada GlideRecord tho record create / update.'],
      code: CREATE_PROCESSING,
    },
    {
      h: '↩️ Tarvata em?',
      body: [
        'Insert tarvata user ki message: gs.addInfoMessage("Created " + number) — next page paina kanipistundi. Kotha record ki pampali ante response.sendRedirect("incident.do?sys_id=" + id) — out-of-box UI Pages Processing scripts lo kuda ide vaadutaru (nee PDI lo chusam: add_catalog_item …).',
        'Test records create chesaka PDI lo cleanup (incidents + page) marchipoku.',
      ],
    },
  ],
  quiz: [
    q('Processing script lo form value ela chaduvutam?', ['request.getParameter("short_desc")', 'g_form.getValue("short_desc")', 'current.getValue("short_desc") call', 'gs.getProperty("short_desc")'], 0, 'request.getParameter(input name) — PDI out-of-box UI Pages lo ila ne.'),
    q('OK click mundu client validation ela?', ['ok="return validate()"', 'Processing script lo check', 'Before Business Rule lo', 'onSubmit Client Script lo'], 0, 'dialog_buttons_ok_cancel ok attribute lo validate() — false return chesthe post aagutundi.'),
    q('validate() false return chesthe?', ['Form post aagipotundi', 'Post ayyi record create avtundi', 'Error page open avtundi', 'Page reload matrame avtundi'], 0, 'false → OK click aagipotundi, user page lone untadu, Processing script run avvadu.'),
    q('Processing script ekkada run avtundi?', ['Server', 'Browser', 'Both', 'Mobile'], 0, 'Processing script server lo run avtundi — records create / update ikkade chestam.'),
    q('Test records create chesaka PDI lo?', ['Cleanup (delete) chey', 'Alage vadileyyi', 'Export chesi pettuko', 'Em cheyyakkarledu'], 0, 'Test data cleanup — incidents + UI Page delete.'),
  ],
  exercises: [
    jx('cs-uipages2', 1, 'Incident create form', 'medium', {
      scenario: 'UI Page "snowkeer_create" lo Short description input + OK / Cancel buttons pettu; OK chesthe Processing script incident create cheyyali. (Ee page ne next exercises lo vaadatam.)',
      hint: 'Lesson cards lo prathi FIELD ki separate code undi: HTML (j:jelly wrapper tho saha), Client script, Processing script — prathi okati daani field lo paste chey.',
      steps: ['System UI → UI Pages → New: Name snowkeer_create.', 'HTML field lo unna text antha select chesi card "🧾 HTML field" lo full code (<?xml …> nunchi </j:jelly> varaku) paste chey.', 'Client script field lo card "💻 Client script field" code, Processing script field lo card "🖧 Processing script field" code paste chey.', 'Submit → Try It. Text rasi OK click chey.', 'Incident list (/incident leda Incidents module) lo kotha incident (nuvvu rasina short description) chudu.'],
      answer: 'Kotha incident create avtundi — short description = nuvvu rasindi.',
      cleanup: 'Create ayina test incident delete chey. Page snowkeer_create ni ippude delete cheyyaku — next exercises lo kavali (final cleanup "ok_type trap" exercise lo).',
    }),
    jx('cs-uipages2', 2, 'Validation test', 'medium', {
      scenario: 'Prerequisite: "Incident create form" lo chesina snowkeer_create page. Input empty ga vadilesi OK click chey — validation alert vachi form post aagali.',
      hint: 'validate() false return chesthe OK post cheyyadu.',
      steps: ['snowkeer_create Try It tho open chey.', 'Input empty ga OK click chey.', 'Alert chudu; incident list lo kotha record raaledu ani verify chey.'],
      answer: 'Alert "Short description kavali" vastundi, record create avvadu (Processing script run avvaledu).',
      cleanup: 'Em marchaledu (page cleanup last exercise lo).',
    }),
    jx('cs-uipages2', 3, 'Success message + redirect', 'medium', {
      scenario: 'Prerequisite: snowkeer_create page. Processing script lo insert tarvata "Created INC…" info message chupinchi, user ni kotha incident form ki pampu.',
      hint: 'var id = gr.insert(); gs.addInfoMessage("Created " + gr.getValue("number")); response.sendRedirect("incident.do?sys_id=" + id);',
      steps: ['snowkeer_create open chey.', 'Processing script lo gr.insert(); line ni var id = gr.insert(); ga marchu.', 'Kinda gs.addInfoMessage("Created " + gr.getValue("number")); mariyu response.sendRedirect("incident.do?sys_id=" + id); add chesi Update.', 'Try It — text rasi OK.'],
      answer: 'Kotha incident form open avtundi, paina "Created INC00xxxxx" info message.',
      cleanup: 'Create ayina test incident(s) delete chey. Page inka kavali — final cleanup next exercise lo.',
    }),
    jx('cs-uipages2', 4, 'ok_type="button" trap chudu', 'hard', {
      scenario: 'Prerequisite: snowkeer_create page. dialog_buttons_ok_cancel ki ok_type="button" add chesi OK nokkithe Processing script run avvadu ani nuvve chudu, tarvata teesey.',
      hint: 'HTML lo <g:dialog_buttons_ok_cancel ok="return validate()" ok_type="button" /> ga marchu. Test tarvata ok_type teesey.',
      steps: ['snowkeer_create HTML lo dialog_buttons_ok_cancel tag ki ok_type="button" add chesi Update.', 'Try It — text rasi OK click chey.', 'Incident list lo kotha record RAALEDU ani chudu (form post avvaledu → Processing script run avvaledu).', 'ok_type="button" teesesi Update — malli try chesthe record create avtundi.'],
      answer: 'ok_type="button" unnappudu OK nokkina record raadu. Default (submit) lo matrame Processing script run avtundi — nee PDI lo tested.',
      cleanup: 'Final cleanup: ee lesson lo create ayina test incidents anni delete chey, UI Pages lo snowkeer_create delete chey.',
    }),
  ],
}

/* 26 — UI Macros */
const BADGE_XML = JELLY('  <span style="background:#2a7; color:#fff; padding:2px 8px; border-radius:8px;">SnowKeer</span>')
const uimacros = {
  id: 'cs-uimacros',
  mode: 'pdi',
  title: 'UI Macros',
  video: 'UI Macros',
  duration: '',
  no: 26,
  blurb: 'Reusable Jelly snippets — macro create, UI Page lo pilavadam, formatters / reference icons, Debug UI Macro.',
  learn: [
    {
      h: '🧱 UI Macro ante?',
      body: [
        'UI Macro = reusable Jelly snippet (All → System UI → UI Macros). Oka sari rasi, UI Pages lo (leda forms lo) tag laaga pilavochu. Udaharana: badge, formatted block, repeated header.',
        'Record lo code field peru "XML" — UI Page laage <j:jelly> wrapper tho motham (<?xml …> nunchi </j:jelly> varaku) rayali.',
      ],
      code: BADGE_XML,
    },
    {
      h: '📞 Macro ni pilavadam',
      body: [
        'UI Page (leda inko macro) lo: <g:snowkeer_badge /> — g: namespace + macro peru. Leda <g:macro_invoke macro="snowkeer_badge" />. Rendu same macro ni render chestayi.',
        'Attributes pampochu: <g:snowkeer_tag text="VIP" /> → macro lopala ${jvar_text} (attribute → jvar_<attribute>; out-of-box ui_reference macro kuda ${jvar_name}, ${jvar_label} ila ne chaduvutundi — nee PDI lo chusam). Out-of-box <g:dialog_buttons_ok_cancel ok="…" /> kuda oka UI Macro ye.',
      ],
      code: `<!-- UI Page HTML lo (j:jelly lopala) -->
<g:snowkeer_badge />
<g:macro_invoke macro="snowkeer_badge" />`,
    },
    {
      h: '🧩 Macros ekkada vaadataru',
      body: [
        'UI Pages lo (paina chusam). Forms lo: UI Formatter — System UI → Formatters lo record (Formatter field lo macro peru .xml tho, e.g. activity.xml, process_flow.xml; Table = aa table) unte, Form Layout lo adi field laaga add cheyyochu. Incident form lo Activity chupinche "Activities (filtered)" = global formatter, activity.xml (nee PDI lo chusam).',
        'Reference field pakkana chinna icons (e.g. Caller pakkana related incidents icon) = reference decorations: dictionary attribute ref_contributions=<macro peru>. Nee PDI lo incident Caller dictionary lo ref_contributions=user_show_incidents undi (chusam).',
      ],
    },
    {
      h: '🐞 Debug UI Macro',
      body: [
        'Nee PDI lo All → System Diagnostics → Debug UI Macro undi (tested) — on chesthe page lo e macros render ayyayo debug info chupistundi ⚠️ (exact ga ela kanipistundo PDI lo chudu). Off: Disable UI Macro Debug.',
        'Pani ayyaka marchipokunda off chey.',
      ],
    },
    {
      h: '🆚 UI Page vs UI Macro',
      body: ['UI Page = poorti page (URL undi: name.do). UI Macro = page lo oka chinna piece (URL ledu), reuse kosam. Macros ni UI Pages, Formatters, reference decorations lo vaadochu.'],
    },
  ],
  quiz: [
    q('UI Macro ante?', ['Reusable Jelly snippet', 'Full page with own URL', 'Server side Business Rule type', 'Script Include class'], 0, 'Reusable Jelly snippet — pages / forms lo malli malli vaadochu.'),
    q('"snowkeer_badge" macro ni UI Page lo ela pilustam?', ['<g:snowkeer_badge />', '<j:snowkeer_badge />', '<snowkeer_badge></snowkeer_badge>', 'gs.include("snowkeer_badge")'], 0, '<g:macro_name /> (leda <g:macro_invoke macro="snowkeer_badge" />).'),
    q('UI Macro ki URL untundaa?', ['Ledu — page lo oka piece', 'Avunu, .do URL untundi', 'Avunu, .html URL untundi', 'Optional ga URL pettochu'], 0, 'Macros ki direct URL ledu — UI Page ki untundi.'),
    q('Reuse valla labham?', ['Okachota marchithe anni chotla marutundi', 'Server speed rendu retlu avtundi', 'Security automatic ga rendu retlu perugutundi', 'Theme colours marchadaniki matrame'], 0, 'Same snippet chala pages lo — okka macro marchithe anni chotla update.'),
    q('UI Macro ekkada create chestam?', ['System UI → UI Macros', 'System Definition → Tables', 'Flow Designer', 'Update Sets'], 0, 'All → System UI → UI Macros.'),
  ],
  exercises: [
    jx('cs-uimacros', 1, 'Badge macro create', 'easy', {
      scenario: 'UI Macro "snowkeer_badge" create chesi chinna span badge rayi. (Next exercises lo vaadatam — delete cheyyaku.)',
      hint: 'All → System UI → UI Macros → New. XML field lo card "🧱 UI Macro ante?" lo unna full XML (<?xml …> nunchi </j:jelly> varaku).',
      steps: ['UI Macros → New: Name snowkeer_badge.', 'XML field lo unna text select chesi card lo full XML paste chey.', 'Submit.'],
      answer: 'UI Macro record create avtundi (page lo vaade varaku ekkada kanipinchadu — URL ledu).',
      cleanup: 'Ippude delete cheyyaku — final cleanup "Debug UI Macro" exercise lo. Madhyalo aapesthe UI Macros lo snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 2, 'UI Page lo macro vaadu', 'medium', {
      scenario: 'Prerequisite: "Badge macro create" lo chesina snowkeer_badge. Kotha UI Page "snowkeer_macro_test" lo <g:snowkeer_badge /> pilichi badge chudu.',
      hint: 'UI Pages → New. HTML skeleton lo <j:jelly …> lopala <g:snowkeer_badge /> pettu.',
      steps: ['System UI → UI Pages → New: Name snowkeer_macro_test.', 'HTML default skeleton lo <j:jelly …> mariyu </j:jelly> madhya <g:snowkeer_badge /> pettu.', 'Submit → Try It.'],
      answer: 'Page lo green "SnowKeer" badge kanipistundi.',
      cleanup: 'Ippude delete cheyyaku — final cleanup "Debug UI Macro" exercise lo. Madhyalo aapesthe page snowkeer_macro_test + macro snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 3, 'Macro 2 sarlu + macro_invoke', 'medium', {
      scenario: 'Prerequisite: snowkeer_badge macro + snowkeer_macro_test page. Same page lo macro ni inkosari <g:snowkeer_badge /> tho, mudosari <g:macro_invoke macro="snowkeer_badge" /> tho pilichi reuse chudu.',
      hint: 'Rendu ways: <g:snowkeer_badge /> leda <g:macro_invoke macro="snowkeer_badge" />.',
      steps: ['snowkeer_macro_test HTML lo unna <g:snowkeer_badge /> kinda inko <g:snowkeer_badge /> add chey.', 'Daani kinda <g:macro_invoke macro="snowkeer_badge" /> add chey.', 'Update → Try It.'],
      answer: 'Moodu badges kanipistayi — oka macro, multiple places. (Macro XML lo colour marchithe moodu marutayi.)',
      cleanup: 'Ippude delete cheyyaku — final cleanup next exercise ("Debug UI Macro") lo. Madhyalo aapesthe page snowkeer_macro_test + macro snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 4, 'Debug UI Macro', 'medium', {
      scenario: 'Prerequisite: snowkeer_macro_test page (badges tho). Debug UI Macro on chesi aa page malli open chey — page lo macros gurinchi debug info chudu, tarvata off chey.',
      hint: 'All → System Diagnostics → Debug UI Macro. Off: System Diagnostics → Disable UI Macro Debug.',
      steps: ['System Diagnostics → Debug UI Macro click chey.', 'snowkeer_macro_test ni Try It tho malli open chey.', 'Macros chuttu debug info (macro peru / boundary) chudu (⚠️ exact ga em chupistundo PDI lo chudu).', 'System Diagnostics → Disable UI Macro Debug click chey.'],
      answer: 'Debug on unnappudu page lo e macros render ayyayo telustundi (snowkeer_badge ×3); off chesthe normal page.',
      cleanup: 'Final cleanup: Disable UI Macro Debug (off) chesava chudu; UI Pages lo snowkeer_macro_test delete chey; UI Macros lo snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 5, 'Reference field decoration chudu (read-only)', 'medium', {
      scenario: 'Incident form lo Caller field pakkana unna chinna icons (reference decorations) chudu, daani dictionary lo ref_contributions attribute vethuku. Emi marchaku — read-only.',
      hint: 'Caller label meeda right-click → Configure Dictionary → Attributes chudu.',
      steps: ['Oka incident open chey; Caller field pakkana icons gamaninchu (e.g. related incidents chupinche icon).', 'Caller label meeda right-click → Configure Dictionary.', 'Attributes lo ref_contributions=… undo chudu — "=" tarvata unnavi UI Macro names.', 'Em save cheyyakunda form close chey.'],
      answer: 'Attributes lo ref_contributions=user_show_incidents undi — user_show_incidents ane UI Macro ye Caller pakkana icon ga render avtundi (nee PDI lo chusam).',
      cleanup: 'Read-only — em save cheyyaledu.',
    }),
  ],
}

export const CS_LESSONS_E = [snutils, crud1, crud2, debug, macros, best, uipages, uipages2, uimacros]
