// Stage 4 · Server Side ServiceNow Scripting (Udemy section, 32 lectures). Same Learn / Quiz / Code format as Stages 2–3.
// Code exercises run on the SERVER runner (src/js/runScript.js + snowMock.js + dateMock.js): gs, GlideRecord, GlideAggregate,
// GlideRecordSecure, GlideDateTime, GlideDuration, GlideSchedule. Stage 4 scenario keys:
//   runAs: { sys_id, roles }  — the user the script runs as (default: admin, who passes every role / ACL check, like her PDI)
//   acl:   { incident: { read | write | create | delete: { roles: [...], cond: 'encoded query, ME = running user' } } }
//   props: { 'name': 'value' } for gs.getProperty;  seed: { incident: [rows] } extra / changed practice rows
// Tests may read __x.events (gs.eventQueue), __x.messages (gs.addInfoMessage / addErrorMessage) and the table via a fresh GlideRecord.
// Sandbox clock: now = 2026-11-12 10:00:00 UTC (Thursday); the sandbox user's time zone is IST (+05:30).
// Lectures 1–2 overlap Stage 2 and Stage 3 (cs-crud1 / cs-crud2): they stay short and spend the exercises on what is new.
// Facts follow her Brazil PDI (docs/pdi-facts-brazil.md); anything not verified there carries ⚠️ (+ checks: ['key'] where she can test it).
import { q, jx } from './lessonKit.js'
import { SS_LESSONS_B } from './lessons-ss-b.js'
import { QUIZ_EXTRA_SS } from './quiz-extra-ss.js'

const SEED = (...rows) => ({ seed: { incident: rows } })
// one record's field values, read back with a fresh GlideRecord (by sys_id / by number)
const DB = (id, fields) => `(function () { var g = new GlideRecord('incident'); g.get('${id}'); return [${fields.map((f) => `g.getValue('${f}')`).join(', ')}]; })()`
const EXISTS = (id) => `(function () { var g = new GlideRecord('incident'); return g.get('${id}'); })()`
// practice users for the GlideRecordSecure lesson: Bud (no roles) may read only incidents where he is the caller; writing needs itil
const ACL_OWN = { incident: { read: { cond: 'caller_id=ME' }, write: { roles: ['itil'] }, delete: { roles: ['admin'] } } }
const BUD = { sys_id: 'u_bud', roles: [] }

/* 1 — What are CRUD operations & GlideRecord Create & Read */
const crud = {
  id: 'ss-crud1',
  title: 'CRUD & GlideRecord — Create & Read (deeper)',
  video: 'What are CRUD Operations & GlideRecord Create & Read Operations',
  duration: '',
  no: 1,
  blurb: 'CRUD recap (Stage 3 lo chesam) + Read ki kotha tools: query operators, encoded query, dot-walk, display values.',
  scratch: {
    starter: "var gr = new GlideRecord('incident');\ngr.addQuery('priority', 'IN', '1,2');\ngr.addActiveQuery();\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ' ' + gr.getDisplayValue('priority'));\n}",
  },
  learn: [
    {
      h: '🔁 CRUD — quick recap',
      body: [
        'CRUD = Create, Read, Update, Delete — database tho chese naalugu panulu. Server side lo anni GlideRecord tho: Create = initialize() / newRecord() + insert(), Read = get() / query() + next(), Update = update(), Delete = deleteRecord().',
        'Stage 3 lo "GlideRecord CRUD Part 1 / Part 2" lessons lo basics chesam (insert, get, loop, updateMultiple, deleteMultiple, typo danger). Marchipoyi unte akkada okasari chudu — ee lesson Read ni deeper ga teesukeltundi.',
        'Gurtu (nee PDI lo tested): initialize() = anni fields null, number kuda ledu; newRecord() = defaults + number ventane. insert() kotha record sys_id return chestundi.',
      ],
      code: `// C — create
var gr = new GlideRecord('incident');
gr.initialize();
gr.setValue('short_description', 'Laptop battery swelling');
var id = gr.insert();            // kotha sys_id

// R — read one record
var one = new GlideRecord('incident');
if (one.get(id)) {
  gs.info(one.getValue('number'));
}`,
    },
    {
      h: '🔎 addQuery operators',
      body: [
        'addQuery(field, value) = "equals". Moodu arguments isthe madhyalo OPERATOR: addQuery(field, operator, value).',
        'Operators: "=", "!=", ">", ">=", "<", "<=", "IN" (comma list), "NOT IN", "STARTSWITH", "ENDSWITH", "CONTAINS", "DOES NOT CONTAIN". Empty / not empty ki addNullQuery(field) / addNotNullQuery(field).',
        'Choice fields (state, priority) lo VALUE ivvali, label kaadu: priority "IN" "1,2" — "1 - Critical" kaadu.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('priority', 'IN', '1,2');              // P1 leda P2
gr.addQuery('short_description', 'CONTAINS', 'vpn'); // text lo ekkadaina
gr.addNullQuery('assigned_to');                      // evariki assign avvaledu
gr.addActiveQuery();                                 // active = true
gr.orderByDesc('priority');
gr.query();`,
    },
    {
      h: '📋 Encoded query — list filter nunchi copy',
      body: [
        'List lo filter build chesi (Incident list → funnel icon), breadcrumb meeda right-click → "Copy query" chesthe filter oka text ga vastundi: active=true^priority=1. Daanni addEncodedQuery() lo paste chey — chala conditions okka line lo. (⚠️ Menu peru nee PDI lo confirm chesuko.)',
        '^ = AND. ^OR = mundu condition tho OR (A^B^ORC = A AND (B OR C) — nee PDI lo tested). ^NQ = kotha query, OR tho kalustundi. Order kuda pettochu: ^ORDERBYnumber, ^ORDERBYDESCpriority.',
        'Typo jagratta: encoded query lo field peru tappu ayithe aa condition ignore ayyi ekkuva rows vastayi (PDI lo tested) — getRowCount() tho count chudu.',
      ],
      code: `var gr = new GlideRecord('incident');
// Active AND (Priority 1 OR Category Hardware), number order
gr.addEncodedQuery('active=true^priority=1^ORcategory=hardware^ORDERBYnumber');
gr.query();
gs.info('Matches: ' + gr.getRowCount());`,
      checks: ['copy-query'],
    },
    {
      h: '🔗 Dot-walk & display values',
      body: [
        'Reference field (caller_id, assignment_group) lopala unna record fields ni "." tho chadavochu: gr.caller_id.email, gr.assignment_group.name. Query lo kuda: addQuery("caller_id.name", "Bud Richman").',
        'getValue() raw VALUE istundi (priority "1", state "2", caller_id sys_id). Manushulaki chupinchadaniki getDisplayValue("priority") → "1 - Critical", getDisplayValue("state") → "In Progress" (nee PDI lo tested).',
        'Report lo: value tho logic (if priority == 1), display value tho message. Rendu kalapaku.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('caller_id.name', 'Bud Richman');
gr.query();
while (gr.next()) {
  gs.info(gr.getValue('number') + ' | ' + gr.getDisplayValue('priority') +
          ' | ' + gr.assignment_group.name + ' | ' + gr.caller_id.email);
}`,
    },
  ],
  quiz: [
    q('CRUD lo "R" ki GlideRecord lo em vaadataam?', ['get() / query() + next()', 'insert() + update()', 'deleteRecord() matrame', 'initialize() + newRecord()'], 0, 'Read = get() (okka record) leda query() + next() loop (chala records).'),
    q("gr.addQuery('priority', 'IN', '1,2') — em vastundi?", ['Priority 1 leda 2 records', 'Priority 1 AND 2 rendu unna records', 'Priority 12 unna records', 'Error — IN operator ledu'], 0, 'IN = comma list lo edaina okati. Choice value ("1", "2") ivvali, label kaadu.'),
    q('List filter ni script lo vaadadaniki easy way?', ['Copy query → addEncodedQuery()', 'Filter screenshot teesi code rayi', 'Prathi condition ki addOrCondition()', 'Update set lo filter ni capture chey'], 0, 'Breadcrumb right-click → Copy query, aa text ni addEncodedQuery() lo pettu. ⚠️ Menu peru PDI lo confirm chesuko.', ['copy-query']),
    q("Encoded query 'active=true^priority=1^ORcategory=hardware' ante?", ['active AND (priority 1 OR hardware)', '(active AND priority 1) OR hardware', 'active OR priority 1 OR hardware', 'active AND priority 1 AND hardware'], 0, '^OR mundu unna condition tho matrame OR avtundi — nee PDI lo tested: A^B^ORC = A AND (B OR C).'),
    q("gr.getDisplayValue('state') — In Progress record ki?", ["'In Progress'", "'2'", 'true', 'state GlideElement object'], 0, 'Display value = label ("In Progress"). getValue("state") ayithe "2".'),
  ],
  exercises: [
    jx('ss-crud1', 1, 'IN operator — P1 leda P2', 'easy', {
      server: true,
      task: 'ACTIVE incidents lo priority 1 leda 2 unnavi (IN operator tho, okate addQuery) number order lo query chesi prathi number log chey.',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: priority IN 1,2 (okate addQuery, 3 arguments)\n// Step 2: active matrame, number order\n// Step 3: query, loop lo number log\n",
      hint: [
        'Moodu arguments: field, operator, value. IN ki value = comma list "1,2" (choice VALUES).',
        "gr.addQuery('priority', 'IN', '1,2');   gr.addActiveQuery();   gr.orderBy('number');",
        "gr.addQuery('priority', 'IN', '1,2'); gr.addActiveQuery(); gr.orderBy('number'); gr.query(); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('priority', 'IN', '1,2');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: 'IN okate condition lo chala values check chestundi — rendu addQuery lu rasthe adi AND avtundi (priority 1 AND 2 = em raadu). Variant lo kotha P1 (raavali) mariyu INACTIVE P2 (raakudadu) unnayi.',
      tests: [{ label: 'Numbers', logs: ['INC0010002', 'INC0010004', 'INC0010007', 'INC0010008'] }],
      variants: [{ name: 'kotha active P1 + inactive P2', scenario: SEED({ short_description: 'Server room too hot', priority: '1', category: 'hardware' }, { short_description: 'Old P2 ticket', priority: '2', state: '7', active: 'false' }), tests: [{ label: 'Numbers', logs: ['INC0010002', 'INC0010004', 'INC0010007', 'INC0010008', 'INC0010009'] }] }],
    }),
    jx('ss-crud1', 2, 'CONTAINS — text lo vethuku', 'easy', {
      server: true,
      task: 'short_description lo "printer" ane word unna incidents (CONTAINS) number order lo query chey. Prathi record ki "<number>: <short_description>" log chey.',
      starter: "var gr = new GlideRecord('incident');\n// short_description CONTAINS printer, number order\n// loop lo number + ': ' + short_description\n",
      hint: [
        'Operator "CONTAINS" — text ekkada unna match avtundi (capital / small teda ledu).',
        "gr.addQuery('short_description', 'CONTAINS', 'printer');   gr.orderBy('number');",
        "gr.addQuery('short_description', 'CONTAINS', 'printer'); gr.orderBy('number'); gr.query(); while (gr.next()) { gs.info(gr.getValue('number') + ': ' + gr.getValue('short_description')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('short_description', 'CONTAINS', 'printer');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ': ' + gr.getValue('short_description'));\n}",
      explain: '"Printer on 3rd floor" lo capital P unna match ayyindi — CONTAINS case chudadu. Variant lo "HP printer offline" ane inko record undi, adi kuda raavali.',
      tests: [{ label: 'Log', logs: ['INC0010003: Printer on 3rd floor is jammed'] }],
      variants: [{ name: 'inko printer incident', scenario: SEED({ short_description: 'HP printer offline' }), tests: [{ label: 'Log', logs: ['INC0010003: Printer on 3rd floor is jammed', 'INC0010009: HP printer offline'] }] }],
    }),
    jx('ss-crud1', 3, 'Encoded query rayi', 'medium', {
      server: true,
      task: 'Filter: Active AND (Priority = 1 OR Category = hardware), number order lo. Idi OKATE addEncodedQuery() string tho rayi (addQuery lu vaddu). Mundu "Matches: N" log, tarvata prathi number.',
      starter: "var gr = new GlideRecord('incident');\n// okate addEncodedQuery('...') — ^ = AND, ^OR = mundu condition tho OR, ^ORDERBYnumber\ngr.query();\n// 'Matches: ' + count, tarvata loop lo numbers\n",
      hint: [
        'Moodu conditions: active=true, priority=1, category=hardware. Rendo, moodo madhya OR — ^OR. Chivara ^ORDERBYnumber.',
        "gr.addEncodedQuery('active=true^priority=1^ORcategory=hardware^ORDERBYnumber');",
        "gr.addEncodedQuery('active=true^priority=1^ORcategory=hardware^ORDERBYnumber'); gr.query(); gs.info('Matches: ' + gr.getRowCount()); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addEncodedQuery('active=true^priority=1^ORcategory=hardware^ORDERBYnumber');\ngr.query();\ngs.info('Matches: ' + gr.getRowCount());\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: '^OR mundu unna condition (priority=1) tho matrame kalustundi, kabatti active ani rendu sides ki apply avtundi. Variant lo INACTIVE hardware incident (raakudadu) mariyu kotha active P1 (raavali) unnayi — "active=true^priority=1^ORcategory=hardware" order marchithe (OR mundu) result marutundi.',
      tests: [{ label: 'Logs', logs: ['Matches: 3', 'INC0010002', 'INC0010003', 'INC0010008'] }],
      variants: [{ name: 'inactive hardware + active P1', scenario: SEED({ short_description: 'Old monitor', category: 'hardware', state: '7', active: 'false' }, { short_description: 'Payroll app down', priority: '1', category: 'software' }), tests: [{ label: 'Logs', logs: ['Matches: 4', 'INC0010002', 'INC0010003', 'INC0010008', 'INC0010010'] }] }],
    }),
    // ---- Medium+ ladder → hard "Network + Database report" ----
    jx('ss-crud1', 5, 'Display values tho message', 'medium+', {
      server: true,
      task: 'INC0010002 load chesi "Priority: <priority label>, State: <state label>" log chey — e.g. "Priority: 1 - Critical, State: New". Labels kosam getDisplayValue() vaadu (hardcode cheyyaku). 🧰 Vaade words: get(), getDisplayValue()',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: INC0010002 load\n// Step 2: priority + state LABELS tho message\n",
      hint: [
        'getValue() "1" istundi; manushulaki "1 - Critical" kavali — adi display value.',
        "gr.get('number', 'INC0010002');   gr.getDisplayValue('priority')   gr.getDisplayValue('state')",
        "gs.info('Priority: ' + gr.getDisplayValue('priority') + ', State: ' + gr.getDisplayValue('state'));",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\ngs.info('Priority: ' + gr.getDisplayValue('priority') + ', State: ' + gr.getDisplayValue('state'));",
      explain: 'getDisplayValue(field) choice label istundi (nee PDI lo tested: "3 - Moderate", "Closed"). Variant lo INC0010002 priority 2, state In Progress — labels kuda maarali.',
      tests: [{ label: 'Log', logs: ['Priority: 1 - Critical, State: New'] }],
      variants: [{ name: 'INC0010002 ippudu P2, In Progress', scenario: SEED({ sys_id: 'inc2', priority: '2', state: '2' }), tests: [{ label: 'Log', logs: ['Priority: 2 - High, State: In Progress'] }] }],
    }),
    jx('ss-crud1', 6, 'Dot-walk — query lo + log lo', 'medium+', {
      server: true,
      task: 'Caller peru "Bud Richman" unna incidents (addQuery lo dot-walk: caller_id.name) number order lo. Prathi record ki "<number> → <assignment group peru>" log chey (group peru kuda dot-walk tho). 🧰 Vaade words: addQuery(), dot-walk (field.name)',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: caller_id.name = Bud Richman, number order\n// Step 2: loop lo number + ' → ' + assignment group NAME\n",
      hint: [
        'Reference field tarvata "." pettu, referenced record field peru: caller_id.name, assignment_group.name.',
        "gr.addQuery('caller_id.name', 'Bud Richman');   loop lo: gr.assignment_group.name",
        "while (gr.next()) { gs.info(gr.getValue('number') + ' → ' + gr.assignment_group.name); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('caller_id.name', 'Bud Richman');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ' → ' + gr.assignment_group.name);\n}",
      explain: 'Dot-walk tho caller sys_id telusukovalsina avasaram ledu. getValue("assignment_group") ayithe sys_id (g_net) vastundi — peru kavali ante dot-walk. Variant lo Bud ki Database group lo inko incident undi.',
      tests: [{ label: 'Logs', logs: ['INC0010002 → Network', 'INC0010007 → Network'] }],
      variants: [{ name: 'Bud ki Database incident kuda', scenario: SEED({ short_description: 'Query timeout in HR app', caller_id: 'u_bud', assignment_group: 'g_db' }), tests: [{ label: 'Logs', logs: ['INC0010002 → Network', 'INC0010007 → Network', 'INC0010009 → Database'] }] }],
    }),
    jx('ss-crud1', 7, 'Rendu orderBy', 'medium+', {
      server: true,
      task: 'Active incidents lo priority <= 2 unnavi. Mundu priority order, same priority lo number order (rendu orderBy). Prathi record ki "<number> (P<priority>)" log chey — e.g. "INC0010002 (P1)". 🧰 Vaade words: addQuery() with "<=", orderBy() x2',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: active + priority <= 2\n// Step 2: orderBy priority, tarvata orderBy number\n// Step 3: loop lo number + ' (P' + priority + ')'\n",
      hint: [
        'Mundu pettina orderBy main sort; rendodi tie-breaker (same priority unte).',
        "gr.addQuery('priority', '<=', 2);   gr.orderBy('priority');   gr.orderBy('number');",
        "while (gr.next()) { gs.info(gr.getValue('number') + ' (P' + gr.getValue('priority') + ')'); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('priority', '<=', 2);\ngr.orderBy('priority');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ' (P' + gr.getValue('priority') + ')');\n}",
      explain: 'orderBy order mukhyam: priority mundu, number tarvata. Variant lo kotha P1 (INC0010009) undi — adi P1 group lo INC0010008 tarvata raavali, chivara kaadu.',
      tests: [{ label: 'Logs', logs: ['INC0010002 (P1)', 'INC0010008 (P1)', 'INC0010004 (P2)', 'INC0010007 (P2)'] }],
      variants: [{ name: 'kotha P1', scenario: SEED({ short_description: 'Core switch down', priority: '1', category: 'network' }), tests: [{ label: 'Logs', logs: ['INC0010002 (P1)', 'INC0010008 (P1)', 'INC0010009 (P1)', 'INC0010004 (P2)', 'INC0010007 (P2)'] }] }],
    }),
    jx('ss-crud1', 4, 'Network + Database report', 'hard', {
      server: true,
      task: 'Active incidents, assignment group PERU "Network" leda "Database" (dot-walk + IN). Priority order, tarvata number order. Prathi record: "<number> | <priority label> | <group peru> | <caller peru>" — e.g. "INC0010002 | 1 - Critical | Network | Bud Richman".',
      starter: "var gr = new GlideRecord('incident');\n// TODO: filters, order, loop, report line\n",
      hint: [
        'Medium+ lo chesinavi kalupu: dot-walk query (assignment_group.name IN ...), rendu orderBy, display value, dot-walk log.',
        "gr.addActiveQuery(); gr.addQuery('assignment_group.name', 'IN', 'Network,Database'); gr.orderBy('priority'); gr.orderBy('number');",
        "gs.info(gr.getValue('number') + ' | ' + gr.getDisplayValue('priority') + ' | ' + gr.assignment_group.name + ' | ' + gr.caller_id.name);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('assignment_group.name', 'IN', 'Network,Database');\ngr.orderBy('priority');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number') + ' | ' + gr.getDisplayValue('priority') + ' | ' + gr.assignment_group.name + ' | ' + gr.caller_id.name);\n}",
      explain: 'Real reports ila untayi: logic VALUES tho (IN, orderBy), output LABELS tho. Variant lo INACTIVE network incident (raakudadu), Hardware lo P1 (raakudadu) mariyu Network lo kotha P3 (chivara raavali) unnayi.',
      tests: [{ label: 'Report', logs: ['INC0010002 | 1 - Critical | Network | Bud Richman', 'INC0010008 | 1 - Critical | Database | Fred Luddy', 'INC0010004 | 2 - High | Database | Fred Luddy', 'INC0010007 | 2 - High | Network | Bud Richman'] }],
      variants: [{
        name: 'inactive network, hardware P1, network P3',
        scenario: SEED(
          { short_description: 'Old VPN ticket', assignment_group: 'g_net', priority: '1', state: '7', active: 'false' },
          { short_description: 'Server PSU failed', assignment_group: 'g_hw', priority: '1' },
          { short_description: 'Wi-Fi slow on 2nd floor', assignment_group: 'g_net', priority: '3', caller_id: 'u_beth' },
        ),
        tests: [{ label: 'Report', logs: ['INC0010002 | 1 - Critical | Network | Bud Richman', 'INC0010008 | 1 - Critical | Database | Fred Luddy', 'INC0010004 | 2 - High | Database | Fred Luddy', 'INC0010007 | 2 - High | Network | Bud Richman', 'INC0010011 | 3 - Moderate | Network | Beth Anglin'] }],
      }],
    }),
  ],
}

/* 2 — GlideRecord Read, Update, Delete & GlideRecordSecure */
const secure = {
  id: 'ss-crud2',
  title: 'Update, Delete & GlideRecordSecure',
  video: 'GlideRecord Read, Update, Delete operations & GlideRecordSecure',
  duration: '',
  no: 2,
  blurb: 'Update / delete recap, tarvata GlideRecordSecure: user ki ACL permission unnave chadavadam / marchadam (canRead, canWrite …).',
  scratch: {
    starter: "// Sandbox: ee script Bud Richman (roles levu) ga run avtundi; ACL: tana incidents matrame chadavochu\nvar grs = new GlideRecordSecure('incident');\ngrs.query();\nwhile (grs.next()) {\n  gs.info(grs.getValue('number'));\n}",
    scenario: { runAs: BUD, acl: ACL_OWN },
  },
  learn: [
    {
      h: '✏️🗑️ Update & delete — recap',
      body: [
        'Update: record load (get / query + next) → setValue → update(). Delete: deleteRecord() (okka record), deleteMultiple() (match ayye anni). Stage 3 "GlideRecord CRUD Part 2" lo detailed ga chesam.',
        'Golden rule: update / delete MUNDU same filter tho getRowCount() chudu. Field typo = condition ignore = anni rows (nee PDI lo tested).',
        'update() save chesina record sys_id return chestundi; deleteRecord() true / false.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.addNullQuery('assignment_group');
gr.query();
gs.info('Will update: ' + gr.getRowCount());   // mundu count
while (gr.next()) {
  gr.setValue('assignment_group', 'g_desk');   // sandbox sys_id
  gr.update();
}`,
    },
    {
      h: '🔒 GlideRecord vs GlideRecordSecure',
      body: [
        'GlideRecord ACLs ni CHUDADU — script lo anni records chadavochu, marchochu. Background Script, scheduled job lanti system pani ki adi correct.',
        'GlideRecordSecure (GRS) = same methods, kani ippudu run chestunna USER ACLs check chestundi: chadavaleni rows query lo raavu (silent ga skip), permission leni update / insert / delete jaragadu. 📄 docs nunchi — exact return values / log text PDI lo easy ga test cheyyalem (admin ki anni ACLs pass).',
        'Eppudu GRS? User ichina input tho data chadive / marche chota: GlideAjax Script Include (browser nunchi evaraina pilavochu), Service Portal widget, Scripted REST API. Lekapote user chudakudani data bayataki vellochu.',
      ],
      code: `// Bud (roles levu) — ACL: tana incidents matrame chadavochu
var grs = new GlideRecordSecure('incident');
grs.query();
while (grs.next()) {
  gs.info(grs.getValue('number'));   // Bud vi matrame
}

var gr = new GlideRecord('incident');
gr.query();
gs.info(gr.getRowCount());           // 8 — GlideRecord ACL chudadu`,
    },
    {
      h: '🙋 canRead / canWrite / canCreate / canDelete',
      body: [
        'Plain GlideRecord tho kuda adagochu: gr.canRead(), gr.canWrite(), gr.canDelete(), gr.canCreate() — ippati user ki ee record meeda aa permission unda (true / false).',
        'Pattern: if (gr.canWrite()) { …update… } else { gs.addErrorMessage("No access"); }. GRS ide automatic ga chestundi; canX() tho nuvvu message / log kuda ivvochu.',
        'Admin ki anni ACLs pass (nee PDI lo admin ki gs.hasRole anni true — tested). Anduke PDI lo admin ga test chesthe anni true vastayi; nijamaina check ki non-admin user tho test cheyyali.',
      ],
      code: `var gr = new GlideRecord('incident');
if (gr.get('number', 'INC0010002')) {
  if (gr.canWrite()) {
    gr.setValue('state', 2);
    gr.update();
  } else {
    gs.info('No access: ' + gr.getValue('number'));
  }
}`,
    },
    {
      h: '🧪 Ee sandbox lo ACLs ela pani chestayi',
      body: [
        'Ikkada exercises lo script ni oka user ga run chestam (scenario lo): e.g. Bud Richman, roles levu. Sandbox ACL rules: incident READ = caller nuvve ayithe matrame; WRITE = itil role kavali; DELETE = admin role kavali.',
        'Real PDI lo ACLs System Security → Access Control (ACL) lo untayi (lecture 28 lo deeper ga chustam). Ikkada rules simple ga pettam — idea same: user + role + condition.',
        'Variants lo vere user / vere role tho same code malli run avtundi — kabatti "Bud" ani hardcode chesthe fail avtundi; canX() / GRS nijamga vaadali.',
      ],
    },
  ],
  quiz: [
    q('GlideRecord ACLs check chestunda?', ['Ledu — anni records chadavochu', 'Avunu, ellappudu check chestundi', 'Admin ki matrame check', 'Client lo matrame check'], 0, 'GlideRecord ACLs chudadu. ACL check kavali ante GlideRecordSecure leda canRead() / canWrite().'),
    q('GlideRecordSecure lo user chadavaleni row?', ['Query lo raadu (silent skip)', 'Error throw chesi aagutundi', 'Empty values tho vastundi', 'Admin approval kosam aagutundi'], 0, 'GRS chadavaleni rows ni query result nunchi silent ga vadilestundi. 📄 docs nunchi — PDI lo admin ki anni ACLs pass, easy ga test cheyyalem.'),
    q('GlideAjax Script Include lo user input tho records chadavali. Better?', ['GlideRecordSecure', 'GlideRecord with setWorkflow(false)', 'GlideAggregate matrame', 'g_form.getReference()'], 0, 'Browser nunchi evaraina call cheyyochu — GRS tho user ki permission unnave chadavali.'),
    q("gr.canWrite() em return chestundi?", ['true / false — write permission unda', 'Record save chesi sys_id istundi', 'Write cheyyagalige field list', 'Matching ACL record sys_id'], 0, 'canWrite() true / false istundi — record ni marchadu. Marchali ante tarvata setValue + update().'),
    q('PDI lo admin ga GRS test chesav, anni records vachayi. Enduku?', ['Admin anni ACLs pass avtadu', 'GRS PDI lo asalu pani cheyyadu', 'ACLs client side lo matrame', 'Query result cache ayyindi'], 0, 'Admin ki anni roles / ACLs pass. Nijamaina check ki non-admin user tho test cheyyali.'),
  ],
  exercises: [
    jx('ss-crud2', 1, 'GRS tho read — user vi matrame', 'easy', {
      server: true,
      scenario: { runAs: BUD, acl: ACL_OWN },
      task: 'Ee script Bud Richman ga run avtundi (roles levu; sandbox ACL: caller nuvve ayithe matrame read). GlideRecordSecure tho incidents ANNI query chey (filter pettaku), number order lo prathi number log chey — user chudagaligevi matrame vastayi.',
      starter: "// GlideRecordSecure tho query, number order, loop lo number log\n",
      hint: [
        'Filter nuvvu pettanakkarledu — GRS user ACLs tho filter chestundi.',
        "var grs = new GlideRecordSecure('incident');   grs.orderBy('number');   grs.query();",
        "var grs = new GlideRecordSecure('incident'); grs.orderBy('number'); grs.query(); while (grs.next()) { gs.info(grs.getValue('number')); }",
      ],
      solution: "var grs = new GlideRecordSecure('incident');\ngrs.orderBy('number');\ngrs.query();\nwhile (grs.next()) {\n  gs.info(grs.getValue('number'));\n}",
      explain: 'Bud caller ga unna INC0010002, INC0010007 matrame vachayi. Variant lo Beth Anglin ga run avtundi — INC0010003 matrame. addQuery("caller_id", "u_bud") ani hardcode chesthe aa variant fail.',
      tests: [{ label: 'Bud chuse numbers', logs: ['INC0010002', 'INC0010007'] }],
      variants: [{ name: 'Beth Anglin ga run', scenario: { runAs: { sys_id: 'u_beth', roles: [] }, acl: ACL_OWN }, tests: [{ label: 'Beth chuse numbers', logs: ['INC0010003'] }] }],
    }),
    jx('ss-crud2', 2, 'Unassigned ki Service Desk', 'easy', {
      server: true,
      task: 'Active incidents lo assignment_group EMPTY unnavi (addNullQuery) — vaatiki assignment_group = "g_desk" (sandbox lo Service Desk sys_id) pettu, update chey. Chivara "Updated N" log chey (N = update chesina count).',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: active + assignment_group empty\n// Step 2: loop — group set, update, count++\n// Step 3: 'Updated ' + count\n",
      hint: [
        'addNullQuery(field) = aa field khali ga unna records. Loop lo prathi record ki set + update, count penchu.',
        "gr.addActiveQuery();   gr.addNullQuery('assignment_group');   var count = 0;",
        "while (gr.next()) { gr.setValue('assignment_group', 'g_desk'); gr.update(); count++; }   gs.info('Updated ' + count);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addNullQuery('assignment_group');\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gr.setValue('assignment_group', 'g_desk');\n  gr.update();\n  count++;\n}\ngs.info('Updated ' + count);",
      explain: 'Real PDI lo group sys_id 32-character id — ikkada sandbox ids (g_desk). Variant lo inka rendu unassigned active incidents mariyu oka INACTIVE unassigned (marchakudadu) unnayi.',
      tests: [
        { label: 'Log', logs: ['Updated 1'] },
        { label: 'INC0010006 group = g_desk', expr: DB('inc6', ['assignment_group']), expect: ['g_desk'] },
      ],
      variants: [{
        name: 'inka 2 unassigned + 1 inactive',
        scenario: SEED({ sys_id: 'n1', short_description: 'Teams calls drop' }, { sys_id: 'n2', short_description: 'New joiner laptop' }, { sys_id: 'n3', short_description: 'Old closed ticket', state: '7', active: 'false' }),
        tests: [
          { label: 'Log', logs: ['Updated 3'] },
          { label: 'inactive one untouched', expr: DB('n3', ['assignment_group']), expect: [null] },
        ],
      }],
    }),
    jx('ss-crud2', 3, 'canWrite() tho check', 'medium', {
      server: true,
      scenario: { runAs: BUD, acl: ACL_OWN },
      task: 'Plain GlideRecord tho INC0010002 load chey. gr.canWrite() true ayithe state = 2 set chesi update chesi "Updated INC0010002" log; false ayithe em marchakunda "No access: INC0010002" log (number getValue nunchi). Bud ki itil ledu — main run lo no access.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\n// canWrite() true → state 2, update, 'Updated ' + number\n// false → 'No access: ' + number\n",
      hint: [
        'canWrite() oka true / false question. Update aa if lopala matrame.',
        "if (gr.canWrite()) { ...setValue + update + log... } else { gs.info('No access: ' + gr.getValue('number')); }",
        "if (gr.canWrite()) { gr.setValue('state', 2); gr.update(); gs.info('Updated ' + gr.getValue('number')); } else { gs.info('No access: ' + gr.getValue('number')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\nif (gr.canWrite()) {\n  gr.setValue('state', 2);\n  gr.update();\n  gs.info('Updated ' + gr.getValue('number'));\n} else {\n  gs.info('No access: ' + gr.getValue('number'));\n}",
      explain: 'GlideRecord tho update chesthe ACL chudadu — canWrite() check lekapothe Bud kuda update chesestadu. Variant lo Bud ki itil role undi: appudu update jaragali.',
      tests: [
        { label: 'Log', logs: ['No access: INC0010002'] },
        { label: 'state marchaledu (1)', expr: DB('inc2', ['state']), expect: ['1'] },
      ],
      variants: [{ name: 'Bud ki itil undi', scenario: { runAs: { sys_id: 'u_bud', roles: ['itil'] }, acl: ACL_OWN }, tests: [{ label: 'Log', logs: ['Updated INC0010002'] }, { label: 'state = 2', expr: DB('inc2', ['state']), expect: ['2'] }] }],
    }),
    // ---- Medium+ ladder → hard "Escalate what you may" ----
    jx('ss-crud2', 5, 'GRS update — save ayyindo chudu', 'medium+', {
      server: true,
      scenario: { runAs: BUD, acl: ACL_OWN },
      task: 'GlideRecordSecure tho INC0010002 load chesi state = 2 set chesi update() chey. Tarvata KOTHA plain GlideRecord tho INC0010002 malli chadivi "State now: <state>" log chey — nijamga save ayyindo ledo ila telustundi. 🧰 Vaade words: GlideRecordSecure, update(), get(), getValue()',
      starter: "var grs = new GlideRecordSecure('incident');\n// Step 1: INC0010002 load, state 2, update\n\n// Step 2: var check = new GlideRecord('incident'); malli load chesi 'State now: ' + state\n",
      hint: [
        'GRS update ACL allow cheyyakapothe save avvadu — error raadu. Anduke fresh GlideRecord tho verify chey.',
        "grs.get('number', 'INC0010002'); grs.setValue('state', 2); grs.update();   var check = new GlideRecord('incident'); check.get('number', 'INC0010002');",
        "gs.info('State now: ' + check.getValue('state'));",
      ],
      solution: "var grs = new GlideRecordSecure('incident');\ngrs.get('number', 'INC0010002');\ngrs.setValue('state', 2);\ngrs.update();\n\nvar check = new GlideRecord('incident');\ncheck.get('number', 'INC0010002');\ngs.info('State now: ' + check.getValue('state'));",
      explain: 'Bud ki write ledu → GRS update em cheyyaledu, state inka 1. Variant lo itil undi → 2. "Silent ga fail" ane point gurtupettuko: GRS tarvata result verify cheyyadam manchi habit. (Ee sandbox lo GRS update null istundi. 📄 docs nunchi — exact return value / log message PDI lo easy ga test cheyyalem: admin ki anni ACLs pass, Background Script admin ga matrame run avtundi.)',
      tests: [{ label: 'Log', logs: ['State now: 1'] }],
      variants: [{ name: 'Bud ki itil undi', scenario: { runAs: { sys_id: 'u_bud', roles: ['itil'] }, acl: ACL_OWN }, tests: [{ label: 'Log', logs: ['State now: 2'] }] }],
    }),
    jx('ss-crud2', 6, 'canRead() tho count', 'medium+', {
      server: true,
      scenario: { runAs: BUD, acl: ACL_OWN },
      task: 'Plain GlideRecord tho ANNI incidents query chey. Loop lo gr.canRead() true unnavi count chesi "Readable: <count> of <total>" log chey (total = getRowCount()). 🧰 Vaade words: canRead(), getRowCount()',
      starter: "var gr = new GlideRecord('incident');\ngr.query();\nvar readable = 0;\n// loop: canRead() true ayithe readable++\n// 'Readable: ' + readable + ' of ' + total\n",
      hint: [
        'GlideRecord anni rows istundi; canRead() prathi row ki user permission chustundi.',
        'while (gr.next()) { if (gr.canRead()) readable++; }',
        "gs.info('Readable: ' + readable + ' of ' + gr.getRowCount());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.query();\nvar readable = 0;\nwhile (gr.next()) {\n  if (gr.canRead()) {\n    readable++;\n  }\n}\ngs.info('Readable: ' + readable + ' of ' + gr.getRowCount());",
      explain: 'GRS chese pani ni chethi tho chesam: GlideRecord + canRead(). Bud ki 2 of 8. Variant lo admin ga run — 8 of 8.',
      tests: [{ label: 'Log', logs: ['Readable: 2 of 8'] }],
      variants: [{ name: 'admin ga run', scenario: { runAs: { sys_id: 'u_admin', roles: ['admin'] }, acl: ACL_OWN }, tests: [{ label: 'Log', logs: ['Readable: 8 of 8'] }] }],
    }),
    jx('ss-crud2', 7, 'canDelete() + dry-run style', 'medium+', {
      server: true,
      scenario: { runAs: { sys_id: 'u_abel', roles: ['itil'] }, acl: { incident: { delete: { roles: ['admin'] } } } },
      task: 'Inactive incidents (active = false) query chey. Prathi record: canDelete() true ayithe deleteRecord() chesi "Deleted <number>" log; false ayithe "Skipped <number> (no delete access)" log. (Main run Abel Tuter, itil matrame — sandbox ACL lo delete ki admin kavali.) 🧰 Vaade words: canDelete(), deleteRecord()',
      starter: "var gr = new GlideRecord('incident');\ngr.addQuery('active', false);\ngr.query();\n// loop: canDelete() → deleteRecord + 'Deleted ' / lekapothe 'Skipped ... (no delete access)'\n",
      hint: [
        'Delete chese mundu permission adugu — GlideRecord tho deleteRecord() ACL chudadu.',
        'while (gr.next()) { if (gr.canDelete()) { ... } else { ... } }',
        "if (gr.canDelete()) { gr.deleteRecord(); gs.info('Deleted ' + gr.getValue('number')); } else { gs.info('Skipped ' + gr.getValue('number') + ' (no delete access)'); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('active', false);\ngr.query();\nwhile (gr.next()) {\n  if (gr.canDelete()) {\n    gr.deleteRecord();\n    gs.info('Deleted ' + gr.getValue('number'));\n  } else {\n    gs.info('Skipped ' + gr.getValue('number') + ' (no delete access)');\n  }\n}",
      explain: 'Abel ki delete ledu → INC0010005 alage undi. Variant lo admin role tho run — appudu delete avtundi. Real PDI lo delete chese mundu Stage 3 lo nerchina dry run (count + list) marchipoku.',
      tests: [
        { label: 'Log', logs: ['Skipped INC0010005 (no delete access)'] },
        { label: 'INC0010005 inka undi', expr: EXISTS('inc5'), expect: true },
      ],
      variants: [{ name: 'admin role tho', scenario: { runAs: { sys_id: 'u_abel', roles: ['admin'] }, acl: { incident: { delete: { roles: ['admin'] } } } }, tests: [{ label: 'Log', logs: ['Deleted INC0010005'] }, { label: 'INC0010005 poyindi', expr: EXISTS('inc5'), expect: false }] }],
    }),
    jx('ss-crud2', 4, 'Escalate — permission unnave', 'hard', {
      server: true,
      scenario: { runAs: BUD, acl: ACL_OWN },
      task: 'User chadavagaligina ACTIVE incidents (GlideRecordSecure, number order). Prathi record: canWrite() true ayithe urgency = 1 set chesi update, "Escalated <number>" log; lekapothe "Read-only <number>" log. Chivara "Done: <enni records chusav>" log chey.',
      starter: "// TODO: GlideRecordSecure query, loop, canWrite, count\n",
      hint: [
        'Medium+ lo chesinavi kalupu: GRS read (user vi matrame), canWrite() decision, count.',
        "var grs = new GlideRecordSecure('incident'); grs.addActiveQuery(); grs.orderBy('number'); grs.query(); var n = 0; while (grs.next()) { n++; if (grs.canWrite()) { ... } else { ... } }",
        "if (grs.canWrite()) { grs.setValue('urgency', 1); grs.update(); gs.info('Escalated ' + grs.getValue('number')); } else { gs.info('Read-only ' + grs.getValue('number')); }   …   gs.info('Done: ' + n);",
      ],
      solution: "var grs = new GlideRecordSecure('incident');\ngrs.addActiveQuery();\ngrs.orderBy('number');\ngrs.query();\nvar n = 0;\nwhile (grs.next()) {\n  n++;\n  if (grs.canWrite()) {\n    grs.setValue('urgency', 1);\n    grs.update();\n    gs.info('Escalated ' + grs.getValue('number'));\n  } else {\n    gs.info('Read-only ' + grs.getValue('number'));\n  }\n}\ngs.info('Done: ' + n);",
      explain: 'Bud tana rendu incidents chudagaladu kani marchaledu. Variants: itil unna Bud (rendu escalate, urgency 1 avtundi) mariyu itil unna Beth (tana okka incident matrame). getRowCount() badulu loop lo count chesam — user nijamga chusina rows ye count.',
      tests: [{ label: 'Logs', logs: ['Read-only INC0010002', 'Read-only INC0010007', 'Done: 2'] }],
      variants: [
        { name: 'Bud ki itil', scenario: { runAs: { sys_id: 'u_bud', roles: ['itil'] }, acl: ACL_OWN }, tests: [{ label: 'Logs', logs: ['Escalated INC0010002', 'Escalated INC0010007', 'Done: 2'] }, { label: 'INC0010007 urgency = 1', expr: DB('inc7', ['urgency']), expect: ['1'] }] },
        { name: 'Beth ki itil', scenario: { runAs: { sys_id: 'u_beth', roles: ['itil'] }, acl: ACL_OWN }, tests: [{ label: 'Logs', logs: ['Escalated INC0010003', 'Done: 1'] }] },
      ],
    }),
  ],
}

/* 3 — GlideAggregate API */
const agg = {
  id: 'ss-glagg',
  title: 'GlideAggregate API',
  video: 'GlideAggregate API',
  duration: '',
  no: 3,
  blurb: 'Count, group, sum — database lone calculate chesi result matrame techukovadam. getAggregate() string istundi.',
  scratch: {
    starter: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('COUNT');\nga.groupBy('category');\nga.query();\nwhile (ga.next()) {\n  gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT'));\n}",
  },
  learn: [
    {
      h: '🧮 Enduku GlideAggregate?',
      body: [
        'Count kavali ante GlideRecord query() + getRowCount() chesthe, server anni matching records ni load chestundi — 1 lakh incidents unte slow. GlideAggregate count / sum ni DATABASE lone chesi okka number matrame istundi.',
        'Steps: new GlideAggregate(table) → filters (addQuery, addActiveQuery, addEncodedQuery — GlideRecord laage) → addAggregate("COUNT") → query() → next() → getAggregate("COUNT").',
        'getAggregate() STRING istundi ("7") — nee PDI lo tested. Math cheyyali ante Number() tho marchu; lekapothe "2" + "2" = "22".',
      ],
      code: `var ga = new GlideAggregate('incident');
ga.addActiveQuery();
ga.addAggregate('COUNT');
ga.query();
if (ga.next()) {
  gs.info('Active: ' + ga.getAggregate('COUNT'));   // '7' (string)
}`,
    },
    {
      h: '📊 groupBy — prathi group ki count',
      body: [
        'groupBy(field) pedithe prathi value ki oka result row: category wise, state wise, group wise. while (ga.next()) loop lo prathi group.',
        'Group value: ga.getValue(field). Reference field ayithe sys_id vastundi (name kaadu). True/false field ki groupBy chesthe getValue "true" / "false" istundi — GlideRecord laaga "1" / "0" kaadu (nee PDI lo tested).',
        'orderBy(field) tho groups order lo vastayi (category alphabetical).',
      ],
      code: `var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT');
ga.groupBy('category');
ga.orderBy('category');
ga.query();
while (ga.next()) {
  gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT'));
}`,
    },
    {
      h: '➕ SUM, AVG, MIN, MAX',
      body: [
        'Number field meeda: addAggregate("SUM", "reassignment_count"), "AVG", "MIN", "MAX". Result: getAggregate("SUM", "reassignment_count") — same rendu arguments ivvali.',
        'reassignment_count = incident enni sarlu group maarindo (OOB field). Ikkada practice data lo konni incidents ki 1–3 undi.',
        'Okate GlideAggregate lo chala aggregates pettochu: COUNT + SUM kalipi.',
      ],
      code: `var ga = new GlideAggregate('incident');
ga.addActiveQuery();
ga.addAggregate('COUNT');
ga.addAggregate('SUM', 'reassignment_count');
ga.addAggregate('MAX', 'reassignment_count');
ga.query();
if (ga.next()) {
  gs.info(ga.getAggregate('COUNT') + ' open, ' +
          ga.getAggregate('SUM', 'reassignment_count') + ' moves, max ' +
          ga.getAggregate('MAX', 'reassignment_count'));
}`,
    },
    {
      h: '🔍 addHaving — group result meeda filter',
      body: [
        'addQuery records ni filter chestundi (group cheyyaka MUNDU). addHaving group RESULT ni filter chestundi: addHaving("COUNT", ">", "1") = 2 leda ekkuva records unna groups matrame (SQL lo HAVING). ⚠️ PDI lo confirm chesuko.',
        'Use case: "duplicate" vethakadam — same short_description / same caller tho okati kante ekkuva incidents.',
      ],
      code: `var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT');
ga.groupBy('category');
ga.addHaving('COUNT', '>', '1');
ga.query();
while (ga.next()) {
  gs.info(ga.getValue('category') + ' has ' + ga.getAggregate('COUNT'));
}`,
      checks: ['ga-having'],
    },
  ],
  quiz: [
    q('Pedda table lo count kosam better?', ['GlideAggregate COUNT', 'GlideRecord loop lo count++', 'gs.info prathi record', 'Client lo g_list count'], 0, 'GlideAggregate database lone count chestundi — records anni load avvavu.'),
    q("ga.getAggregate('COUNT') em type?", ['String ("7")', 'Number (7)', 'Boolean', 'GlideElement'], 0, 'String — nee PDI lo tested. Math ki Number() tho marchu.'),
    q('Category wise count kavali. Em add cheyyali?', ["groupBy('category')", "orderBy('category') matrame", "addQuery('category')", "setLimit('category')"], 0, 'groupBy(field) prathi value ki oka result row istundi; while (ga.next()) tho chaduvu.'),
    q("SUM result chadavadaniki correct call?", ["getAggregate('SUM', 'reassignment_count')", "getAggregate('SUM') — field avasaram ledu", "getValue('SUM', 'reassignment_count')", "getSum('reassignment_count')"], 0, 'addAggregate lo ichina rendu arguments (aggregate + field) getAggregate lo kuda ivvali.'),
    q("ga.getAggregate('COUNT') + ga2.getAggregate('COUNT') — '2' + '2'?", ["'22'", '4', 'NaN', 'Error vastundi'], 0, 'Rendu strings — + join chestundi. Number(a) + Number(b) = 4.'),
  ],
  exercises: [
    jx('ss-glagg', 1, 'Active incidents count', 'easy', {
      server: true,
      task: 'GlideAggregate tho ACTIVE incidents count chesi "Active: <count>" log chey.',
      starter: "var ga = new GlideAggregate('incident');\n// Step 1: active matrame\n// Step 2: COUNT aggregate, query\n// Step 3: next() tarvata 'Active: ' + count\n",
      hint: [
        'Filter, addAggregate, query, next, getAggregate — ee order.',
        "ga.addActiveQuery();   ga.addAggregate('COUNT');   ga.query();",
        "if (ga.next()) { gs.info('Active: ' + ga.getAggregate('COUNT')); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('COUNT');\nga.query();\nif (ga.next()) {\n  gs.info('Active: ' + ga.getAggregate('COUNT'));\n}",
      explain: 'groupBy lekapothe okate result row — anduke if (ga.next()). Variant lo inka rendu active incidents mariyu oka inactive unnayi — count 9 avvali.',
      tests: [{ label: 'Log', logs: ['Active: 7'] }],
      variants: [{ name: '+2 active, +1 inactive', scenario: SEED({ short_description: 'A' }, { short_description: 'B' }, { short_description: 'C', state: '7', active: 'false' }), tests: [{ label: 'Log', logs: ['Active: 9'] }] }],
    }),
    jx('ss-glagg', 2, 'Network group count (dot-walk)', 'easy', {
      server: true,
      task: 'Assignment group PERU "Network" unna incidents GlideAggregate tho count chesi "Network: <count>" log chey (addQuery lo dot-walk: assignment_group.name).',
      starter: "var ga = new GlideAggregate('incident');\n// assignment_group.name = Network, COUNT\n",
      hint: [
        'GlideAggregate filters GlideRecord laage — dot-walk kuda pani chestundi.',
        "ga.addQuery('assignment_group.name', 'Network');   ga.addAggregate('COUNT');",
        "ga.query(); if (ga.next()) { gs.info('Network: ' + ga.getAggregate('COUNT')); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addQuery('assignment_group.name', 'Network');\nga.addAggregate('COUNT');\nga.query();\nif (ga.next()) {\n  gs.info('Network: ' + ga.getAggregate('COUNT'));\n}",
      explain: 'Variant lo Network ki inko incident mariyu Database ki okati unnayi — count 3 avvali.',
      tests: [{ label: 'Log', logs: ['Network: 2'] }],
      variants: [{ name: 'Network +1, Database +1', scenario: SEED({ short_description: 'Router down', assignment_group: 'g_net' }, { short_description: 'DB slow', assignment_group: 'g_db' }), tests: [{ label: 'Log', logs: ['Network: 3'] }] }],
    }),
    jx('ss-glagg', 3, 'Category wise count', 'medium', {
      server: true,
      task: 'Anni incidents ni category batti group chesi (groupBy), category alphabetical order lo "<category>: <count>" log chey.',
      starter: "var ga = new GlideAggregate('incident');\n// COUNT + groupBy category + orderBy category\n// while loop lo category + ': ' + count\n",
      hint: [
        'groupBy tho prathi category ki oka row; orderBy tho order. Loop lo group value getValue(field).',
        "ga.addAggregate('COUNT');   ga.groupBy('category');   ga.orderBy('category');   ga.query();",
        "while (ga.next()) { gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT')); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addAggregate('COUNT');\nga.groupBy('category');\nga.orderBy('category');\nga.query();\nwhile (ga.next()) {\n  gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT'));\n}",
      explain: 'Okka query lo motham breakdown. Variant lo rendu kotha network incidents unnayi — network: 4.',
      tests: [{ label: 'Logs', logs: ['database: 2', 'hardware: 1', 'inquiry: 1', 'network: 2', 'software: 2'] }],
      variants: [{ name: '+2 network', scenario: SEED({ short_description: 'X', category: 'network' }, { short_description: 'Y', category: 'network' }), tests: [{ label: 'Logs', logs: ['database: 2', 'hardware: 1', 'inquiry: 1', 'network: 4', 'software: 2'] }] }],
    }),
    // ---- Medium+ ladder → hard "Category workload report" ----
    jx('ss-glagg', 5, 'SUM — total reassignments', 'medium+', {
      server: true,
      task: 'Active incidents lo reassignment_count motham (SUM) calculate chesi "Total reassignments: <sum>" log chey. 🧰 Vaade words: addAggregate("SUM", field), getAggregate("SUM", field)',
      starter: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\n// SUM on reassignment_count\n",
      hint: [
        'SUM ki field kavali — addAggregate lo, getAggregate lo rendu chotla ade field.',
        "ga.addAggregate('SUM', 'reassignment_count');   ga.query();",
        "if (ga.next()) { gs.info('Total reassignments: ' + ga.getAggregate('SUM', 'reassignment_count')); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('SUM', 'reassignment_count');\nga.query();\nif (ga.next()) {\n  gs.info('Total reassignments: ' + ga.getAggregate('SUM', 'reassignment_count'));\n}",
      explain: '1 + 3 + 2 = 6 (inactive INC0010005 count avvadu). Variant lo oka active incident ki 4 reassignments — total 10.',
      tests: [{ label: 'Log', logs: ['Total reassignments: 6'] }],
      variants: [{ name: '+4 reassignments', scenario: SEED({ short_description: 'Ping-pong ticket', reassignment_count: '4' }), tests: [{ label: 'Log', logs: ['Total reassignments: 10'] }] }],
    }),
    jx('ss-glagg', 6, 'addHaving — 2+ unna categories', 'medium+', {
      server: true,
      task: 'Active incidents ni category batti group chesi, COUNT 2 leda ekkuva unna categories matrame (addHaving) alphabetical order lo "<category>: <count>" log chey. 🧰 Vaade words: groupBy(), addHaving()',
      starter: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('COUNT');\nga.groupBy('category');\nga.orderBy('category');\n// addHaving: COUNT >= 2\nga.query();\n// loop log\n",
      hint: [
        'addQuery records ni filter chestundi; addHaving GROUP result ni. Moodu arguments: aggregate, operator, value.',
        "ga.addHaving('COUNT', '>=', '2');",
        "while (ga.next()) { gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT')); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('COUNT');\nga.groupBy('category');\nga.orderBy('category');\nga.addHaving('COUNT', '>=', '2');\nga.query();\nwhile (ga.next()) {\n  gs.info(ga.getValue('category') + ': ' + ga.getAggregate('COUNT'));\n}",
      explain: 'hardware (1) raadu; inquiry inactive kabatti asalu ledu. Variant lo kotha hardware incident undi — hardware: 2 ippudu list lo raavali. ⚠️ addHaving nee PDI lo confirm chesuko.',
      checks: ['ga-having'],
      tests: [{ label: 'Logs', logs: ['database: 2', 'network: 2', 'software: 2'] }],
      variants: [{ name: '+1 hardware', scenario: SEED({ short_description: 'Dock not charging', category: 'hardware' }), tests: [{ label: 'Logs', logs: ['database: 2', 'hardware: 2', 'network: 2', 'software: 2'] }] }],
    }),
    jx('ss-glagg', 7, 'String kaadu — Number() tho add', 'medium+', {
      server: true,
      task: 'Active incidents ni priority batti group chey, priority IN 1,2 matrame. Loop lo prathi group COUNT ni Number() tho total ki kalupu. Chivara "P1+P2 open: <total>" log chey. 🧰 Vaade words: groupBy(), Number()',
      starter: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addQuery('priority', 'IN', '1,2');\nga.addAggregate('COUNT');\nga.groupBy('priority');\nga.query();\nvar total = 0;\n// loop: total = total + COUNT (number ga!)\n",
      hint: [
        'getAggregate string — "0" + "2" + "2" = "022" avtundi. Number() tho marchi add chey.',
        "while (ga.next()) { total = total + Number(ga.getAggregate('COUNT')); }",
        "gs.info('P1+P2 open: ' + total);",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addQuery('priority', 'IN', '1,2');\nga.addAggregate('COUNT');\nga.groupBy('priority');\nga.query();\nvar total = 0;\nwhile (ga.next()) {\n  total = total + Number(ga.getAggregate('COUNT'));\n}\ngs.info('P1+P2 open: ' + total);",
      explain: 'P1: 2, P2: 2 → 4. Number() lekapothe "022". Variant lo kotha P1 undi — 5.',
      tests: [{ label: 'Log', logs: ['P1+P2 open: 4'] }, { label: 'total is a number', expr: 'typeof total', expect: 'number' }],
      variants: [{ name: '+1 P1', scenario: SEED({ short_description: 'Core switch down', priority: '1' }), tests: [{ label: 'Log', logs: ['P1+P2 open: 5'] }] }],
    }),
    jx('ss-glagg', 4, 'Category workload report', 'hard', {
      server: true,
      task: 'Active incidents category wise: COUNT mariyu reassignment_count SUM. 2 leda ekkuva open unna categories matrame (addHaving), alphabetical. Prathi line: "<category> → <count> open, reassigned <sum>x" — e.g. "database → 2 open, reassigned 3x".',
      starter: "var ga = new GlideAggregate('incident');\n// TODO\n",
      hint: [
        'Medium+ lo chesinavi kalupu: rendu aggregates (COUNT + SUM), groupBy + orderBy, addHaving.',
        "ga.addActiveQuery(); ga.addAggregate('COUNT'); ga.addAggregate('SUM', 'reassignment_count'); ga.groupBy('category'); ga.orderBy('category'); ga.addHaving('COUNT', '>=', '2'); ga.query();",
        "while (ga.next()) { gs.info(ga.getValue('category') + ' → ' + ga.getAggregate('COUNT') + ' open, reassigned ' + ga.getAggregate('SUM', 'reassignment_count') + 'x'); }",
      ],
      solution: "var ga = new GlideAggregate('incident');\nga.addActiveQuery();\nga.addAggregate('COUNT');\nga.addAggregate('SUM', 'reassignment_count');\nga.groupBy('category');\nga.orderBy('category');\nga.addHaving('COUNT', '>=', '2');\nga.query();\nwhile (ga.next()) {\n  gs.info(ga.getValue('category') + ' → ' + ga.getAggregate('COUNT') + ' open, reassigned ' + ga.getAggregate('SUM', 'reassignment_count') + 'x');\n}",
      explain: 'Okate database query tho motham dashboard numbers. Variant lo hardware ki inko incident (4 reassignments) — hardware ippudu list lo vastundi.',
      tests: [{ label: 'Report', logs: ['database → 2 open, reassigned 3x', 'network → 2 open, reassigned 2x', 'software → 2 open, reassigned 1x'] }],
      variants: [{ name: '+1 hardware (4 moves)', scenario: SEED({ short_description: 'Dock not charging', category: 'hardware', reassignment_count: '4' }), tests: [{ label: 'Report', logs: ['database → 2 open, reassigned 3x', 'hardware → 2 open, reassigned 4x', 'network → 2 open, reassigned 2x', 'software → 2 open, reassigned 1x'] }] }],
    }),
  ],
}

// Course order (Udemy "Server Side ServiceNow Scripting", 32 lectures). Batch 1 = lectures 1–6.
export const SS_LESSONS = [crud, secure, agg, ...SS_LESSONS_B]
  .sort((a, b) => a.no - b.no)
  .map((l) => ({
    stage: 4,
    section: 'Server scripting',
    ...l,
    quiz: [...l.quiz, ...(QUIZ_EXTRA_SS[l.id] || [])], // more questions: quiz-extra-ss.js
  }))
