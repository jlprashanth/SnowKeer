// Stage 4, lectures 4–6: GlideSystem, GlideDateTime, GlideDateTime continuation + GlideSchedule + GlideDuration.
// Server runner (see lessons-ss.js header). Sandbox clock: now = 2026-11-12 10:00:00 UTC (Thursday); sandbox user time zone IST (+05:30);
// practice schedule 'sch_8to5' = "8-5 weekdays" in UTC, no holidays (real schedules: cmn_schedule, own time zone + holidays).
// Not verified in her PDI (⚠️ + checks): display time zone / format, gs date helpers' time zone, GlideDuration text formats, GlideSchedule.
import { q, jx } from './lessonKit.js'

const SEED = (...rows) => ({ seed: { incident: rows } })
const ABEL = { sys_id: 'u_abel', roles: ['itil'] }
const MSGS = '__x.messages.map(function (m) { return m.type + ": " + m.text })'
const EVENTS = '__x.events.map(function (e) { return e.name + "|" + e.instance + "|" + e.parm1 + "|" + e.parm2 })'
const CUR = (values) => ({ current: { table: 'incident', values } })

/* 4 — GlideSystem */
const gsys = {
  id: 'ss-gs',
  title: 'GlideSystem (gs)',
  video: 'GlideSystem',
  duration: '',
  no: 4,
  blurb: 'gs = server toolbox: logs, current user, roles, properties, messages, date helpers, events.',
  scratch: {
    starter: "gs.info('User: {0} ({1})', gs.getUserDisplayName(), gs.getUserName());\ngs.info('itil? ' + gs.hasRole('itil'));\ngs.info('7 days ago start: ' + gs.daysAgoStart(7));",
    scenario: { runAs: ABEL },
  },
  learn: [
    {
      h: '📝 Logs — info, warn, error',
      body: [
        'gs.info(), gs.warn(), gs.error(), gs.debug() — System Logs → System Log → All lo (level tho) kanipistayi. Background Script lo output kinda "*** Script: …" ga vastundi.',
        'Placeholders: gs.info("{0} is assigned to {1}", number, group) — {0}, {1} ki tarvati arguments vastayi (nee PDI lo tested). Long + joins kante chadavadaniki easy.',
        'gs.log() / gs.print() global scope lo unnayi (tested) kani scoped apps lo levu — kotha code ki gs.info().',
      ],
      code: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
gs.info('{0} is assigned to {1}', gr.getValue('number'), gr.assignment_group.name);
gs.warn('Priority 1 without assignee: ' + gr.getValue('number'));`,
    },
    {
      h: '👤 Current user & roles',
      body: [
        'gs.getUserID() = sys_id, gs.getUserName() = login name (abel.tuter), gs.getUserDisplayName() = full name. gs.getUser() oka user object: getFirstName(), getEmail(), hasRole(), isMemberOf("group peru").',
        'gs.hasRole("itil") — user ki role unda. Admin ki ELLAPPUDU true (role lekapoyina, asalu leni role ki kuda — nee PDI lo tested). Exact role check kavali ante admin kani user tho test chey.',
        'Business Rule lo "user" = record save chesina vaaru; Scheduled Job lo "system" user. Ekkada run avtundo batti answer marutundi.',
      ],
      code: `if (gs.hasRole('itil')) {
  gs.info(gs.getUserDisplayName() + ' can work incidents');
}
var me = gs.getUser();
gs.info(me.getFirstName() + ' / ' + me.getEmail());`,
    },
    {
      h: '⚙️ Properties & messages',
      body: [
        'gs.getProperty("name", "default") — System Properties (sys_properties) nunchi value. Ledu ante default. Value ellappudu STRING — number kavali ante Number(). Hardcode badulu property: admin code marchakunda value marchochu.',
        'gs.addInfoMessage("…") / gs.addErrorMessage("…") — form paina blue / red message (Business Rule, UI Action lo). Background Script / Scheduled Job lo user evaru chudaru.',
        'gs.getMessage("key") — translated text (Message table). Inka: gs.nil(x) (empty / null check), gs.tableExists("incident"), gs.generateGUID() (kotha 32-char id).',
      ],
      code: `var max = Number(gs.getProperty('snowkeer.max_rows', '3'));

// Business Rule (before) lo
if (current.priority == 1 && current.assignment_group.nil()) {
  gs.addErrorMessage('P1 needs an assignment group');
}`,
    },
    {
      h: '📅 Date helpers & events',
      body: [
        'gs.daysAgoStart(7) = 7 rojula mundu 00:00:00, gs.beginningOfToday(), gs.endOfToday(), gs.daysAgo(n), gs.hoursAgo(n). Query lo: addQuery("opened_at", ">=", gs.daysAgoStart(7)) leda encoded query lo "opened_at>=javascript:gs.daysAgoStart(7)" (list filter "last 7 days" ide). ⚠️ Ee times nee PDI lo user time zone lo na UTC lo na — confirm chesuko.',
        'Ee sandbox lo clock fix: ippudu = 2026-11-12 10:00:00 (UTC) — tests repeat avvadaniki.',
        'gs.eventQueue("event.name", gr, parm1, parm2) — event queue chestundi; Email Notification / Script Action aa event vinte run avtayi (lectures 14, 18 lo). Event mundu Event Registry lo register cheyyali.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('opened_at', '>=', gs.daysAgoStart(7));
gr.query();
gs.info('Last 7 days: ' + gr.getRowCount());

gs.eventQueue('incident.p1.unassigned', gr, 'Network', gs.getUserName());`,
      checks: ['gs-dates-tz'],
    },
  ],
  quiz: [
    q("gs.info('{0} has {1}', 'Abel', 3) output?", ['Abel has 3', '{0} has {1}', 'Abel has {1}', "Error — 3 string kaadu"], 0, '{0}, {1} placeholders ki tarvati arguments vastayi — nee PDI lo tested.'),
    q("Admin user ki gs.hasRole('no_such_role')?", ['true', 'false', 'Error', 'null'], 0, 'Admin ki anni hasRole checks true — leni role ki kuda (PDI lo tested).'),
    q("gs.getProperty('my.prop', '5') — property ledu ante?", ["'5' (default)", 'null (property ledu)', 'Error — property kavali', "'' (empty string)"], 0, 'Property lekapothe rendo argument (default) vastundi. Value string — Number() tho marchu.'),
    q('gs.addErrorMessage() ekkada kanipistundi?', ['Form paina red message', 'System Log lo matrame vastundi', 'Admin ki email lo pamputundi', 'Browser console lo matrame'], 0, 'Interactive session lo form paina message. Scheduled Job lo evaru chudaru — log vaadu.'),
    q("gs.eventQueue('x.y', gr) em chestundi?", ['Event queue lo pedutundi', 'Email ventane pamputundi', 'Record ni delete chestundi', 'Kotha table create chestundi'], 0, 'Event queue lo padutundi; aa event ki register ayina Notification / Script Action tarvata run avtayi.'),
  ],
  exercises: [
    jx('ss-gs', 1, 'Hello <current user>', 'easy', {
      server: true,
      scenario: { runAs: ABEL },
      task: 'Script run chestunna user full name tho "Hello <full name>" log chey (gs.getUserDisplayName() — peru hardcode cheyyaku).',
      starter: "// gs.getUserDisplayName() tho Hello message\n",
      hint: [
        'gs lo current user methods untayi — full name kosam getUserDisplayName.',
        "gs.getUserDisplayName()",
        "gs.info('Hello ' + gs.getUserDisplayName());",
      ],
      solution: "gs.info('Hello ' + gs.getUserDisplayName());",
      explain: 'Variant lo Beth Anglin ga run avtundi — "Hello Beth Anglin" raavali.',
      tests: [{ label: 'Log', logs: ['Hello Abel Tuter'] }],
      variants: [{ name: 'Beth ga run', scenario: { runAs: { sys_id: 'u_beth', roles: [] } }, tests: [{ label: 'Log', logs: ['Hello Beth Anglin'] }] }],
    }),
    jx('ss-gs', 2, 'Placeholders {0} {1}', 'easy', {
      server: true,
      task: 'INC0010002 load chesi gs.info lo placeholders tho "<number> is assigned to <group peru>" log chey — gs.info("{0} is assigned to {1}", …). + tho join cheyyaku.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\n// gs.info('{0} is assigned to {1}', ..., ...)\n",
      hint: [
        'Message lo {0}, {1} pettu; values tarvati arguments ga.',
        "gs.info('{0} is assigned to {1}', gr.getValue('number'), ...group peru...)",
        "gs.info('{0} is assigned to {1}', gr.getValue('number'), gr.assignment_group.name);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\ngs.info('{0} is assigned to {1}', gr.getValue('number'), gr.assignment_group.name);",
      explain: 'Group peru dot-walk tho. Variant lo INC0010002 Database group ki maarindi.',
      tests: [{ label: 'Log', logs: ['INC0010002 is assigned to Network'] }],
      variants: [{ name: 'group Database', scenario: SEED({ sys_id: 'inc2', assignment_group: 'g_db' }), tests: [{ label: 'Log', logs: ['INC0010002 is assigned to Database'] }] }],
    }),
    jx('ss-gs', 3, 'hasRole tho decision', 'medium', {
      server: true,
      scenario: { runAs: ABEL },
      task: 'User ki itil role unte "Can work incidents: <full name>", lekapothe "Read only: <full name>" log chey (gs.hasRole + gs.getUserDisplayName).',
      starter: "// if (gs.hasRole('itil')) … else …\n",
      hint: [
        'Role check true / false istundi — if / else.',
        "if (gs.hasRole('itil')) { ... } else { ... }",
        "if (gs.hasRole('itil')) { gs.info('Can work incidents: ' + gs.getUserDisplayName()); } else { gs.info('Read only: ' + gs.getUserDisplayName()); }",
      ],
      solution: "if (gs.hasRole('itil')) {\n  gs.info('Can work incidents: ' + gs.getUserDisplayName());\n} else {\n  gs.info('Read only: ' + gs.getUserDisplayName());\n}",
      explain: 'Variants: roles leni Bud (Read only), admin (admin ki hasRole ellappudu true — Can work). Nee PDI lo admin ga test chesthe ellappudu true ane gurtupettuko.',
      tests: [{ label: 'Log', logs: ['Can work incidents: Abel Tuter'] }],
      variants: [
        { name: 'Bud, roles levu', scenario: { runAs: { sys_id: 'u_bud', roles: [] } }, tests: [{ label: 'Log', logs: ['Read only: Bud Richman'] }] },
        { name: 'admin', scenario: { runAs: { sys_id: 'u_admin', roles: ['admin'] } }, tests: [{ label: 'Log', logs: ['Can work incidents: System Administrator'] }] },
      ],
    }),
    // ---- Medium+ ladder → hard "P1 alert events" ----
    jx('ss-gs', 5, 'Property tho limit', 'medium+', {
      server: true,
      task: 'gs.getProperty("snowkeer.max_rows", "3") tho limit chaduvu (property lekapothe 3). Incidents number order lo, aa limit varaku query chesi numbers log chey. 🧰 Vaade words: gs.getProperty(), Number(), setLimit()',
      starter: "// Step 1: var max = ... gs.getProperty(...) (string vastundi — number ga marchu)\nvar gr = new GlideRecord('incident');\n// Step 2: number order, setLimit(max), query, loop log\n",
      hint: [
        'Property value string — Number() tho marchi setLimit ki ivvu. Default rendo argument.',
        "var max = Number(gs.getProperty('snowkeer.max_rows', '3'));   gr.orderBy('number'); gr.setLimit(max);",
        "gr.query(); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var max = Number(gs.getProperty('snowkeer.max_rows', '3'));\nvar gr = new GlideRecord('incident');\ngr.orderBy('number');\ngr.setLimit(max);\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: 'Variant lo admin property ni "2" ga set chesadu — code marchakunda 2 rows. Idi properties purpose.',
      tests: [{ label: 'Logs', logs: ['INC0010001', 'INC0010002', 'INC0010003'] }],
      variants: [{ name: 'property = 2', scenario: { props: { 'snowkeer.max_rows': '2' } }, tests: [{ label: 'Logs', logs: ['INC0010001', 'INC0010002'] }] }],
    }),
    jx('ss-gs', 6, 'Last 7 days count', 'medium+', {
      server: true,
      task: 'Last 7 days lo open ayina incidents (opened_at >= gs.daysAgoStart(7)) count chesi "Last 7 days: <count>" log chey. (Sandbox clock: ippudu 2026-11-12 10:00:00.) 🧰 Vaade words: gs.daysAgoStart(), addQuery(">=")',
      starter: "var gr = new GlideRecord('incident');\n// opened_at >= gs.daysAgoStart(7)\n",
      hint: [
        'gs.daysAgoStart(7) oka date-time string istundi — daanni ">=" tho compare chey.',
        "gr.addQuery('opened_at', '>=', gs.daysAgoStart(7));   gr.query();",
        "gs.info('Last 7 days: ' + gr.getRowCount());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('opened_at', '>=', gs.daysAgoStart(7));\ngr.query();\ngs.info('Last 7 days: ' + gr.getRowCount());",
      explain: 'daysAgoStart(7) = 2026-11-05 00:00:00 → INC0010006, 7, 8. Variants: 2026-11-10 incident (count) + October lo okati (count kaadu); 2026-11-05 08:00 incident — daysAgoStart (roju modalu) lo count avtundi, gs.daysAgo(7) (ippati time 10:00 nunchi) ayithe miss avtundi. ⚠️ Nee PDI lo time zone batti boundary marochu.',
      checks: ['gs-dates-tz'],
      tests: [{ label: 'Log', logs: ['Last 7 days: 3'] }],
      variants: [
        { name: 'recent + old', scenario: SEED({ short_description: 'New', opened_at: '2026-11-10 08:00:00' }, { short_description: 'Old', opened_at: '2026-10-01 08:00:00' }), tests: [{ label: 'Log', logs: ['Last 7 days: 4'] }] },
        { name: '7 rojula mundu, udayam 08:00', scenario: SEED({ short_description: 'Early morning', opened_at: '2026-11-05 08:00:00' }), tests: [{ label: 'Log', logs: ['Last 7 days: 4'] }] },
      ],
    }),
    jx('ss-gs', 7, 'Form messages (Business Rule style)', 'medium+', {
      server: true,
      scenario: CUR({ number: 'INC0010099', short_description: 'Payroll down', priority: '1', assignment_group: '' }),
      task: 'Before Business Rule laaga: current incident priority 1 mariyu assignment_group empty ayithe gs.addErrorMessage("P1 needs an assignment group"); lekapothe gs.addInfoMessage("Saved <number>"). 🧰 Vaade words: current, nil(), gs.addErrorMessage(), gs.addInfoMessage()',
      starter: "// current = save avtunna incident\n// priority 1 AND group empty → error message, lekapothe info 'Saved ' + number\n",
      hint: [
        'Empty check ki element.nil(). Choice value == 1 tho compare.',
        'if (current.priority == 1 && current.assignment_group.nil()) { ... } else { ... }',
        "gs.addErrorMessage('P1 needs an assignment group');   /   gs.addInfoMessage('Saved ' + current.getValue('number'));",
      ],
      solution: "if (current.priority == 1 && current.assignment_group.nil()) {\n  gs.addErrorMessage('P1 needs an assignment group');\n} else {\n  gs.addInfoMessage('Saved ' + current.getValue('number'));\n}",
      explain: 'Message matrame — save aagadu (aapali ante current.setAbortAction(true), Business Rules lecture lo). Variants: group unna P1, group leni P3 — rendu info.',
      tests: [{ label: 'Messages', expr: MSGS, expect: ['error: P1 needs an assignment group'] }],
      variants: [
        { name: 'P1 with group', scenario: CUR({ number: 'INC0010099', priority: '1', assignment_group: 'g_net' }), tests: [{ label: 'Messages', expr: MSGS, expect: ['info: Saved INC0010099'] }] },
        { name: 'P3 no group', scenario: CUR({ number: 'INC0010098', priority: '3', assignment_group: '' }), tests: [{ label: 'Messages', expr: MSGS, expect: ['info: Saved INC0010098'] }] },
      ],
    }),
    jx('ss-gs', 4, 'P1 alert events', 'hard', {
      server: true,
      task: 'Active P1 incidents lo assigned_to EMPTY unnavi (number order). Prathi daaniki gs.eventQueue("snowkeer.p1.unassigned", gr, <group peru (display value)>, <run chestunna user login name>) chesi "Queued for <number>" log chey. Chivara "Total queued: <count>" log.',
      starter: "var gr = new GlideRecord('incident');\n// TODO\n",
      hint: [
        'Query (active, priority 1, addNullQuery assigned_to, orderBy), loop lo eventQueue + log + count.',
        "gs.eventQueue('snowkeer.p1.unassigned', gr, gr.getDisplayValue('assignment_group'), gs.getUserName());",
        "while (gr.next()) { gs.eventQueue(...); gs.info('Queued for ' + gr.getValue('number')); n++; }   gs.info('Total queued: ' + n);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('priority', 1);\ngr.addNullQuery('assigned_to');\ngr.orderBy('number');\ngr.query();\nvar n = 0;\nwhile (gr.next()) {\n  gs.eventQueue('snowkeer.p1.unassigned', gr, gr.getDisplayValue('assignment_group'), gs.getUserName());\n  gs.info('Queued for ' + gr.getValue('number'));\n  n++;\n}\ngs.info('Total queued: ' + n);",
      explain: 'parm1 / parm2 strings ga ivvu — notification lo event.parm1 tho vaadataru (lecture 14). Variant lo Abel ga run, inko unassigned P1 (Hardware) undi.',
      tests: [
        { label: 'Logs', logs: ['Queued for INC0010002', 'Total queued: 1'] },
        { label: 'Event: name|record|parm1|parm2', expr: EVENTS, expect: ['snowkeer.p1.unassigned|inc2|Network|admin'] },
      ],
      variants: [{
        name: 'Abel ga, +1 unassigned P1',
        scenario: { runAs: ABEL, seed: { incident: [{ sys_id: 's1', short_description: 'Server PSU failed', priority: '1', assignment_group: 'g_hw' }] } },
        tests: [
          { label: 'Logs', logs: ['Queued for INC0010002', 'Queued for INC0010009', 'Total queued: 2'] },
          { label: 'Events', expr: EVENTS, expect: ['snowkeer.p1.unassigned|inc2|Network|abel.tuter', 'snowkeer.p1.unassigned|s1|Hardware|abel.tuter'] },
        ],
      }],
    }),
  ],
}

/* 5 — GlideDateTime */
const gdt1 = {
  id: 'ss-gdt',
  title: 'GlideDateTime',
  video: 'GlideDateTime',
  duration: '',
  no: 5,
  blurb: 'Date-time values: ippati time, field nunchi chadavadam, days add / subtract, compare, UTC vs nee time zone.',
  scratch: {
    starter: "var gdt = new GlideDateTime();\ngs.info('UTC:   ' + gdt.getValue());\ngs.info('Local: ' + gdt.getDisplayValue());\ngdt.addDaysUTC(3);\ngs.info('+3 days: ' + gdt.getValue());",
  },
  learn: [
    {
      h: '🕒 GlideDateTime ante?',
      body: [
        'new GlideDateTime() = IPPUDU. Date-time fields (opened_at, sys_created_on, resolved_at) database lo UTC lo save avtayi.',
        'getValue() = UTC value ("2026-11-12 10:00:00"). getDisplayValue() = user TIME ZONE + date format lo (form lo kanipinchedi). Ee sandbox lo user time zone IST (+05:30): 10:00 UTC → 15:30.',
        '⚠️ Nee PDI lo display nee user record Time zone, date format batti — Background Script lo rendu print chesi chudu. Logic / compare ki ellappudu getValue() (UTC); manushulaki chupinchadaniki getDisplayValue().',
      ],
      code: `var gdt = new GlideDateTime();
gs.info(gdt.getValue());          // 2026-11-12 10:00:00 (UTC)
gs.info(gdt.getDisplayValue());   // 2026-11-12 15:30:00 (sandbox user: IST)`,
      checks: ['gdt-display-tz'],
    },
    {
      h: '📥 Field nunchi GlideDateTime',
      body: [
        'new GlideDateTime(gr.getValue("opened_at")) — field value (UTC string) tho object. Leda gr.opened_at.getGlideObject().',
        'Text nunchi: new GlideDateTime("2026-11-04 00:00:00") — UTC ga chaduvutundi. User time zone lo unna text ki gdt.setDisplayValue("…").',
        'Tirigi field lo pettadaniki: gr.setValue("u_due", gdt.getValue()) leda gr.u_due = gdt.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.get('number', 'INC0010002');
var opened = new GlideDateTime(gr.getValue('opened_at'));
gs.info('Opened (UTC): ' + opened.getValue());
gs.info('Opened (me):  ' + opened.getDisplayValue());`,
    },
    {
      h: '➕ Add / subtract',
      body: [
        'addDaysUTC(n), addSeconds(n), addWeeksUTC(n), addMonthsUTC(n), addYearsUTC(n) — object NE marchestayi (kotha object return cheyyavu). Negative number = venakki: addDaysUTC(-7).',
        'addDaysLocalTime(n) user time zone lo calendar day add chestundi — daylight saving unna zones lo teda vastundi. India lo DST ledu, kani users vere zones lo undochu.',
        'Original kavali ante mundu copy: var due = new GlideDateTime(opened); due.addDaysUTC(3);',
      ],
      code: `var due = new GlideDateTime('2026-11-03 11:40:00');
due.addDaysUTC(3);
gs.info(due.getValue());          // 2026-11-06 11:40:00

var weekAgo = new GlideDateTime();
weekAgo.addDaysUTC(-7);           // 2026-11-05 10:00:00`,
    },
    {
      h: '⚖️ Compare & parts',
      body: [
        'a.before(b), a.after(b), a.onOrBefore(b), a.compareTo(b) (1 / 0 / -1). Strings (getValue) "yyyy-MM-dd HH:mm:ss" format lo unte < > kuda pani chestayi, kani methods clear.',
        'Parts: getDayOfWeekUTC() (1 = Monday … 7 = Sunday), getMonthUTC() (1–12), getYearUTC(), getDayOfMonthUTC(). Local versions: getDayOfWeekLocalTime() …',
        'getNumericValue() = milliseconds (1970 nunchi). Rendu dates teda: b.getNumericValue() - a.getNumericValue() → ms; / 3600000 = hours. (Next lesson lo GlideDuration tho easy way.)',
      ],
      code: `var now = new GlideDateTime();
var opened = new GlideDateTime('2026-11-07 06:10:00');
gs.info(opened.before(now));                  // true
gs.info(opened.getDayOfWeekUTC());            // 6 (Saturday)
var hours = (now.getNumericValue() - opened.getNumericValue()) / 3600000;
gs.info(Math.floor(hours));                   // 123`,
    },
  ],
  quiz: [
    q('Date-time fields database lo ela save avtayi?', ['UTC lo', 'User time zone lo', 'IST lo matrame', 'Browser time lo'], 0, 'UTC lo save; form lo user time zone lo kanipistundi (getDisplayValue).'),
    q('Compare / logic ki edi vaadali?', ['getValue() (UTC)', 'getDisplayValue()', 'Form lo text', 'toLocaleString()'], 0, 'getValue() UTC — anni users ki same. Display value user batti marutundi.'),
    q('gdt.addDaysUTC(3) em return chestundi?', ['Ade gdt object marutundi', 'Kotha GlideDateTime object', '3 days string', 'true / false'], 0, 'addX() methods object ne marchestayi. Original kavali ante mundu copy (new GlideDateTime(gdt)).'),
    q("getDayOfWeekUTC() Sunday ki?", ['7', '0', '1', '6'], 0, '1 = Monday … 7 = Sunday (JavaScript getDay() laaga 0 kaadu).'),
    q('7 rojula mundu time kavali. Correct?', ['gdt.addDaysUTC(-7)', 'gdt.addDaysUTC(7)', 'gdt.subtractDays(7)', 'gdt.minusDays(7)'], 0, 'Negative number tho add = venakki. subtractDays laanti method ledu.'),
  ],
  exercises: [
    jx('ss-gdt', 1, 'Opened + 3 days = due', 'easy', {
      server: true,
      task: 'INC0010002 opened_at tho GlideDateTime create chesi 3 days add chey (addDaysUTC). "Due: <UTC value>" log chey.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\n// Step 1: var due = new GlideDateTime(...opened_at...)\n// Step 2: 3 days add\n// Step 3: 'Due: ' + value\n",
      hint: [
        'Field value nunchi object, tarvata add, tarvata getValue().',
        "var due = new GlideDateTime(gr.getValue('opened_at'));   due.addDaysUTC(3);",
        "gs.info('Due: ' + due.getValue());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\nvar due = new GlideDateTime(gr.getValue('opened_at'));\ndue.addDaysUTC(3);\ngs.info('Due: ' + due.getValue());",
      explain: '2026-11-03 11:40 + 3 days = 2026-11-06 11:40. Variant lo opened_at vere — date hardcode chesthe fail.',
      tests: [{ label: 'Log', logs: ['Due: 2026-11-06 11:40:00'] }],
      variants: [{ name: 'opened_at vere', scenario: SEED({ sys_id: 'inc2', opened_at: '2026-11-10 08:00:00' }), tests: [{ label: 'Log', logs: ['Due: 2026-11-13 08:00:00'] }] }],
    }),
    jx('ss-gdt', 2, 'User time lo chupinchu', 'easy', {
      server: true,
      task: 'INC0010004 opened_at ni user time zone lo (getDisplayValue) "Opened (IST): <display value>" ga log chey. (Sandbox user time zone = IST.)',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010004');\n// GlideDateTime from opened_at, display value log\n",
      hint: [
        'Manushulaki chupinchadaniki display value.',
        "var opened = new GlideDateTime(gr.getValue('opened_at'));",
        "gs.info('Opened (IST): ' + opened.getDisplayValue());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010004');\nvar opened = new GlideDateTime(gr.getValue('opened_at'));\ngs.info('Opened (IST): ' + opened.getDisplayValue());",
      explain: '08:22 UTC + 5:30 = 13:52. Variant lo 20:00 UTC → IST lo marusati roju 01:30 — date kuda marutundi! ⚠️ Nee PDI lo nee time zone / format batti display marutundi.',
      checks: ['gdt-display-tz'],
      tests: [{ label: 'Log', logs: ['Opened (IST): 2026-11-04 13:52:00'] }],
      variants: [{ name: 'late-night UTC', scenario: SEED({ sys_id: 'inc4', opened_at: '2026-11-04 20:00:00' }), tests: [{ label: 'Log', logs: ['Opened (IST): 2026-11-05 01:30:00'] }] }],
    }),
    jx('ss-gdt', 3, 'before() tho filter', 'medium', {
      server: true,
      task: 'Cutoff = new GlideDateTime("2026-11-04 00:00:00"). Active incidents (number order) loop lo, opened_at cutoff KANTE MUNDU (before) unnavi matrame number log chey.',
      starter: "var cutoff = new GlideDateTime('2026-11-04 00:00:00');\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\n// loop: opened GlideDateTime, before(cutoff) ayithe number log\n",
      hint: [
        'Prathi record ki opened_at nunchi GlideDateTime, tarvata before().',
        "var opened = new GlideDateTime(gr.getValue('opened_at'));   if (opened.before(cutoff)) { ... }",
        "while (gr.next()) { var opened = new GlideDateTime(gr.getValue('opened_at')); if (opened.before(cutoff)) { gs.info(gr.getValue('number')); } }",
      ],
      solution: "var cutoff = new GlideDateTime('2026-11-04 00:00:00');\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  var opened = new GlideDateTime(gr.getValue('opened_at'));\n  if (opened.before(cutoff)) {\n    gs.info(gr.getValue('number'));\n  }\n}",
      explain: 'Idi query lo kuda cheyyochu (next exercises) — kani loop lo GlideDateTime methods practice. Variant lo INC0010003 tarvata date ki maarindi, kotha old incident vachindi.',
      tests: [{ label: 'Logs', logs: ['INC0010001', 'INC0010002', 'INC0010003'] }],
      variants: [{ name: 'dates marayi', scenario: SEED({ sys_id: 'inc3', opened_at: '2026-11-05 09:00:00' }, { short_description: 'Old one', opened_at: '2026-11-01 07:00:00' }), tests: [{ label: 'Logs', logs: ['INC0010001', 'INC0010002', 'INC0010009'] }] }],
    }),
    // ---- Medium+ ladder → hard "Due-date check" ----
    jx('ss-gdt', 5, 'Weekday leda weekend?', 'medium+', {
      server: true,
      task: 'INC0010003 opened_at roju weekday aa weekend aa chudu (getDayOfWeekUTC: 1 = Mon … 7 = Sun). "<number>: Weekday (<day>)" leda "<number>: Weekend (<day>)" log chey. 🧰 Vaade words: getDayOfWeekUTC()',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010003');\n// day = GlideDateTime(opened_at).getDayOfWeekUTC()\n// 6 leda 7 → Weekend, lekapothe Weekday\n",
      hint: [
        'Saturday = 6, Sunday = 7. Day >= 6 ante weekend.',
        "var day = new GlideDateTime(gr.getValue('opened_at')).getDayOfWeekUTC();",
        "var kind = day >= 6 ? 'Weekend' : 'Weekday';   gs.info(gr.getValue('number') + ': ' + kind + ' (' + day + ')');",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010003');\nvar day = new GlideDateTime(gr.getValue('opened_at')).getDayOfWeekUTC();\nvar kind = day >= 6 ? 'Weekend' : 'Weekday';\ngs.info(gr.getValue('number') + ': ' + kind + ' (' + day + ')');",
      explain: '2026-11-03 Tuesday = 2. Variants lo Saturday (6) mariyu Sunday (7). JavaScript getDay() laaga Sunday 0 kaadu — ServiceNow lo 7, kabatti "day == 0" check Sunday ni pattukodu.',
      tests: [{ label: 'Log', logs: ['INC0010003: Weekday (2)'] }],
      variants: [
        { name: 'Saturday', scenario: SEED({ sys_id: 'inc3', opened_at: '2026-11-07 10:00:00' }), tests: [{ label: 'Log', logs: ['INC0010003: Weekend (6)'] }] },
        { name: 'Sunday', scenario: SEED({ sys_id: 'inc3', opened_at: '2026-11-08 10:00:00' }), tests: [{ label: 'Log', logs: ['INC0010003: Weekend (7)'] }] },
      ],
    }),
    jx('ss-gdt', 6, 'Age in hours', 'medium+', {
      server: true,
      task: 'INC0010008 enni gantala nunchi open (ippudu − opened_at): getNumericValue() teda / 3600000, Math.floor. "<number> age: <hours> hours" log chey. 🧰 Vaade words: getNumericValue(), Math.floor()',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010008');\nvar now = new GlideDateTime();\n// opened GlideDateTime, ms teda, hours\n",
      hint: [
        'getNumericValue() = milliseconds. Teda / 3600000 = hours.',
        "var opened = new GlideDateTime(gr.getValue('opened_at'));   var ms = now.getNumericValue() - opened.getNumericValue();",
        "var hours = Math.floor(ms / 3600000);   gs.info(gr.getValue('number') + ' age: ' + hours + ' hours');",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010008');\nvar now = new GlideDateTime();\nvar opened = new GlideDateTime(gr.getValue('opened_at'));\nvar ms = now.getNumericValue() - opened.getNumericValue();\nvar hours = Math.floor(ms / 3600000);\ngs.info(gr.getValue('number') + ' age: ' + hours + ' hours');",
      explain: '11-07 06:10 → 11-12 10:00 = 123 h 50 m → 123. Variant lo ivvale open ayyindi (2 h).',
      tests: [{ label: 'Log', logs: ['INC0010008 age: 123 hours'] }],
      variants: [{ name: 'ivvale open', scenario: SEED({ sys_id: 'inc8', opened_at: '2026-11-12 07:30:00' }), tests: [{ label: 'Log', logs: ['INC0010008 age: 2 hours'] }] }],
    }),
    jx('ss-gdt', 7, '7 rojula kante paatavi (query)', 'medium+', {
      server: true,
      task: 'cutoff = ippudu − 7 days (new GlideDateTime() + addDaysUTC(-7)). Mundu "Cutoff: <value>" log. Tarvata active incidents opened_at < cutoff (query lo, cutoff.getValue()), number order lo numbers log. 🧰 Vaade words: addDaysUTC(), addQuery("<")',
      starter: "var cutoff = new GlideDateTime();\n// 7 days venakki, 'Cutoff: ' log\nvar gr = new GlideRecord('incident');\n// active + opened_at < cutoff value, number order, loop log\n",
      hint: [
        'Negative add = venakki. Query ki string value ivvu.',
        "cutoff.addDaysUTC(-7);   gr.addQuery('opened_at', '<', cutoff.getValue());",
        "gs.info('Cutoff: ' + cutoff.getValue()); gr.addActiveQuery(); gr.addQuery('opened_at', '<', cutoff.getValue()); gr.orderBy('number'); gr.query(); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var cutoff = new GlideDateTime();\ncutoff.addDaysUTC(-7);\ngs.info('Cutoff: ' + cutoff.getValue());\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('opened_at', '<', cutoff.getValue());\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: 'Cutoff 2026-11-05 10:00 → INC0010001–4 (INC0010005 inactive; INC0010006 11-05 13:48 cutoff tarvata). Database lo filter — loop kante fast. Variant lo INC0010004 recent ayyindi, paata kotha incident vachindi.',
      tests: [{ label: 'Logs', logs: ['Cutoff: 2026-11-05 10:00:00', 'INC0010001', 'INC0010002', 'INC0010003', 'INC0010004'] }],
      variants: [{ name: 'dates marayi', scenario: SEED({ sys_id: 'inc4', opened_at: '2026-11-10 08:00:00' }, { short_description: 'Very old', opened_at: '2026-10-30 09:00:00' }), tests: [{ label: 'Logs', logs: ['Cutoff: 2026-11-05 10:00:00', 'INC0010001', 'INC0010002', 'INC0010003', 'INC0010009'] }] }],
    }),
    jx('ss-gdt', 4, 'Due-date check (P1 = 7 days, P2 = 10 days)', 'hard', {
      server: true,
      task: 'Active P1 / P2 incidents, number order. Due = opened_at + 7 days (P1) leda + 10 days (P2). Due ippati kante mundu ayithe "<number> BREACHED (due <due>)", lekapothe "<number> OK (due <due>)" log chey (due = UTC value).',
      starter: "var now = new GlideDateTime();\nvar gr = new GlideRecord('incident');\n// TODO\n",
      hint: [
        'Medium+ lo chesinavi kalupu: field nunchi GlideDateTime, addDaysUTC, before(now).',
        "var due = new GlideDateTime(gr.getValue('opened_at'));   due.addDaysUTC(gr.getValue('priority') == '1' ? 7 : 10);",
        "var status = due.before(now) ? 'BREACHED' : 'OK';   gs.info(gr.getValue('number') + ' ' + status + ' (due ' + due.getValue() + ')');",
      ],
      solution: "var now = new GlideDateTime();\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('priority', 'IN', '1,2');\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  var due = new GlideDateTime(gr.getValue('opened_at'));\n  due.addDaysUTC(gr.getValue('priority') == '1' ? 7 : 10);\n  var status = due.before(now) ? 'BREACHED' : 'OK';\n  gs.info(gr.getValue('number') + ' ' + status + ' (due ' + due.getValue() + ')');\n}",
      explain: 'Idi SLA ki chinna version — real SLA Definitions (lecture 27) schedule, pause anni handle chestayi. Variant lo INC0010004 P1 ayyindi (BREACHED avvali), paata P2 kotha incident undi.',
      tests: [{ label: 'Report', logs: ['INC0010002 BREACHED (due 2026-11-10 11:40:00)', 'INC0010004 OK (due 2026-11-14 08:22:00)', 'INC0010007 OK (due 2026-11-16 09:55:00)', 'INC0010008 OK (due 2026-11-14 06:10:00)'] }],
      variants: [{
        name: 'INC0010004 → P1, paata P2',
        scenario: SEED({ sys_id: 'inc4', priority: '1' }, { short_description: 'Old P2', priority: '2', opened_at: '2026-10-25 09:00:00' }),
        tests: [{ label: 'Report', logs: ['INC0010002 BREACHED (due 2026-11-10 11:40:00)', 'INC0010004 BREACHED (due 2026-11-11 08:22:00)', 'INC0010007 OK (due 2026-11-16 09:55:00)', 'INC0010008 OK (due 2026-11-14 06:10:00)', 'INC0010009 BREACHED (due 2026-11-04 09:00:00)'] }],
      }],
    }),
  ],
}

/* 6 — GlideDateTime continuation, GlideSchedule, GlideDuration */
const gdt2 = {
  id: 'ss-gdt2',
  title: 'GlideDuration & GlideSchedule',
  video: 'GlideDateTime Continution, GlideSchedule, GlideDuration',
  duration: '',
  no: 6,
  blurb: 'Rendu dates madhya time (GlideDuration), business hours lo matrame lekka (GlideSchedule) — SLA ki base.',
  scratch: {
    starter: "var start = new GlideDateTime('2026-11-06 09:55:00');\nvar now = new GlideDateTime();\nvar dur = GlideDateTime.subtract(start, now);\ngs.info('Total: ' + dur.getDurationValue());\n\nvar sched = new GlideSchedule('sch_8to5');\nvar biz = sched.duration(start, now);\ngs.info('Business: ' + biz.getDurationValue());",
  },
  learn: [
    {
      h: '⏱️ GlideDateTime.subtract → GlideDuration',
      body: [
        'GlideDateTime.subtract(start, end) = end − start, oka GlideDuration object (static method — new kaadu).',
        'getNumericValue() = milliseconds (60000 = 1 minute, 3600000 = 1 hour). getDayPart() = full days (8 days 22 hours → 8), getRoundedDayPart() = round (→ 9).',
        'getDurationValue() = "d HH:mm:ss" text (e.g. "2 12:00:00"), getDisplayValue() = "2 Days 12 Hours" laanti text. ⚠️ Ee rendu text formats nee PDI lo confirm chesuko — tests lo numbers (getNumericValue) vaadu.',
      ],
      code: `var opened = new GlideDateTime('2026-11-04 10:31:00');
var resolved = new GlideDateTime('2026-11-04 12:01:00');
var dur = GlideDateTime.subtract(opened, resolved);
gs.info(dur.getNumericValue() / 60000);   // 90 (minutes)
gs.info(dur.getDurationValue());           // 01:30:00`,
      checks: ['duration-format'],
    },
    {
      h: '🧱 GlideDuration create & add',
      body: [
        'new GlideDuration(ms) leda new GlideDuration("1 02:30:00") (1 day 2 h 30 m). Duration fields (business_duration, calendar_duration) ee type.',
        'Date ki duration add: gdt.add(dur.getNumericValue()) — ms ivvu. Rendu durations: dur.add(other) kotha duration istundi.',
        'Tip: "4 hours response" laanti rules ki duration oka property lo pettu, code lo hardcode kaadu.',
      ],
      code: `var dur = new GlideDuration('0 04:00:00');   // 4 hours
var due = new GlideDateTime('2026-11-06 09:55:00');
due.add(dur.getNumericValue());
gs.info(due.getValue());                      // 2026-11-06 13:55:00`,
    },
    {
      h: '🗓️ GlideSchedule — business hours',
      body: [
        'Schedules (All → System Scheduler → Schedules → Schedules, table cmn_schedule) "8-5 weekdays" laanti working time define chestayi; holidays kuda exclude cheyyochu. ⚠️ Module path / OOB schedule names nee PDI lo confirm chesuko.',
        'new GlideSchedule(sys_id) → sched.isInSchedule(gdt) (aa time working hours lo unda), sched.duration(start, end) (madhyalo WORKING time matrame), sched.add(start, dur) (working time lo dur ayipoye time).',
        'Ee sandbox lo schedule sys_id "sch_8to5" = Mon–Fri 08:00–17:00 (UTC, holidays levu). Real PDI lo sys_id 32-char — schedule list lo record right-click → Copy sys_id. Real schedule ki sontha time zone untundi.',
      ],
      code: `var sched = new GlideSchedule('sch_8to5');
var t = new GlideDateTime('2026-11-07 10:00:00');   // Saturday
gs.info(sched.isInSchedule(t));                       // false

var start = new GlideDateTime('2026-11-13 16:00:00'); // Friday 4 PM
var due = sched.add(start, new GlideDuration('0 02:00:00'));
gs.info(due.getValue());                              // Monday 09:00`,
      checks: ['schedule-8to5'],
    },
    {
      h: '🎯 Ekkada vaadataru?',
      body: [
        'SLA (lecture 27): response / resolution target schedule tho lekka — weekend, raatri count avvadu. Business duration fields ide.',
        'Reports: "resolve ayyadaniki average time", "business hours lo open ayina tickets". Scheduled jobs (lectures 10–12): "3 working days update leni tickets ki reminder".',
        'Rule: total time = GlideDateTime.subtract; working time = GlideSchedule.duration. Rendu kalapaku.',
      ],
    },
  ],
  quiz: [
    q('GlideDateTime.subtract(start, end) em istundi?', ['GlideDuration (end − start)', 'Kotha GlideDateTime (start)', 'Number of days (integer)', 'Boolean — end tarvata aa'], 0, 'Static method — rendu dates madhya duration.'),
    q('Duration 8 days 22 hours — getDayPart()?', ['8', '9', '22', '8.9'], 0, 'getDayPart full days matrame (floor). getRoundedDayPart → 9.'),
    q('Weekend / raatri count avvakunda time kavali. Edi?', ['GlideSchedule.duration()', 'GlideDateTime.subtract()', 'gs.dateDiff() matrame', 'getDayOfWeekUTC()'], 0, 'Schedule duration working hours lo time matrame lekka pedutundi.'),
    q('sched.isInSchedule(gdt) em return chestundi?', ['true / false', 'GlideDuration', 'Schedule name', 'Next working time'], 0, 'Aa time schedule (working hours) lopala unda ledha.'),
    q("new GlideDuration('0 04:00:00') ante?", ['4 hours', '4 days', '4 minutes', '4 seconds'], 0, '"d HH:mm:ss" — 0 days, 04 hours.'),
  ],
  exercises: [
    jx('ss-gdt2', 1, 'Resolve time (minutes)', 'easy', {
      server: true,
      task: 'INC0010005: opened_at nunchi resolved_at ki entha time? GlideDateTime.subtract tho duration, getNumericValue() / 60000 = minutes. "Resolved in <minutes> minutes" log chey.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010005');\n// opened, resolved GlideDateTime; subtract; minutes\n",
      hint: [
        'Rendu GlideDateTime objects, tarvata static subtract(start, end).',
        "var dur = GlideDateTime.subtract(new GlideDateTime(gr.getValue('opened_at')), new GlideDateTime(gr.getValue('resolved_at')));",
        "gs.info('Resolved in ' + (dur.getNumericValue() / 60000) + ' minutes');",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010005');\nvar opened = new GlideDateTime(gr.getValue('opened_at'));\nvar resolved = new GlideDateTime(gr.getValue('resolved_at'));\nvar dur = GlideDateTime.subtract(opened, resolved);\ngs.info('Resolved in ' + (dur.getNumericValue() / 60000) + ' minutes');",
      explain: '10:31 → 12:01 = 90 minutes. Variant lo resolved_at vere (240).',
      tests: [{ label: 'Log', logs: ['Resolved in 90 minutes'] }],
      variants: [{ name: 'resolved later', scenario: SEED({ sys_id: 'inc5', resolved_at: '2026-11-04 14:31:00' }), tests: [{ label: 'Log', logs: ['Resolved in 240 minutes'] }] }],
    }),
    jx('ss-gdt2', 2, 'Enni rojulu open (getDayPart)', 'easy', {
      server: true,
      task: 'INC0010002 opened_at nunchi IPPATI varaku duration, getDayPart() tho full days. "<number> open for <days> days" log chey.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\n// subtract(opened, now) → getDayPart()\n",
      hint: [
        'End = new GlideDateTime() (ippudu).',
        "var dur = GlideDateTime.subtract(new GlideDateTime(gr.getValue('opened_at')), new GlideDateTime());",
        "gs.info(gr.getValue('number') + ' open for ' + dur.getDayPart() + ' days');",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010002');\nvar dur = GlideDateTime.subtract(new GlideDateTime(gr.getValue('opened_at')), new GlideDateTime());\ngs.info(gr.getValue('number') + ' open for ' + dur.getDayPart() + ' days');",
      explain: '8 days 22 h 20 m → 8 (full days). Variant lo 2026-11-10 09:00 open → 2.',
      tests: [{ label: 'Log', logs: ['INC0010002 open for 8 days'] }],
      variants: [{ name: 'recent', scenario: SEED({ sys_id: 'inc2', opened_at: '2026-11-10 09:00:00' }), tests: [{ label: 'Log', logs: ['INC0010002 open for 2 days'] }] }],
    }),
    jx('ss-gdt2', 3, '4-hour response due', 'medium', {
      server: true,
      task: 'INC0010007 response due = opened_at + 4 hours (new GlideDuration("0 04:00:00"), gdt.add(dur.getNumericValue())). "Response due: <UTC value>" log chey.',
      starter: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010007');\nvar dur = new GlideDuration('0 04:00:00');\n// due = opened GlideDateTime + dur\n",
      hint: [
        'GlideDateTime.add() ki milliseconds ivvu.',
        "var due = new GlideDateTime(gr.getValue('opened_at'));   due.add(dur.getNumericValue());",
        "gs.info('Response due: ' + due.getValue());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010007');\nvar dur = new GlideDuration('0 04:00:00');\nvar due = new GlideDateTime(gr.getValue('opened_at'));\ndue.add(dur.getNumericValue());\ngs.info('Response due: ' + due.getValue());",
      explain: '09:55 + 4 h = 13:55. Variant lo raatri 22:30 → marusati roju 02:30 (calendar time — schedule ledu, next exercises lo schedule).',
      tests: [{ label: 'Log', logs: ['Response due: 2026-11-06 13:55:00'] }],
      variants: [{ name: 'late night', scenario: SEED({ sys_id: 'inc7', opened_at: '2026-11-11 22:30:00' }), tests: [{ label: 'Log', logs: ['Response due: 2026-11-12 02:30:00'] }] }],
    }),
    // ---- Medium+ ladder → hard "P1 response with business hours" ----
    jx('ss-gdt2', 5, 'Business hours lo open ayyinda?', 'medium+', {
      server: true,
      task: 'Schedule "sch_8to5" (Mon–Fri 08:00–17:00). INC0010003 opened_at schedule lo unte "<number> opened in business hours", lekapothe "<number> opened outside business hours" log chey. 🧰 Vaade words: new GlideSchedule(), isInSchedule()',
      starter: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.get('number', 'INC0010003');\n// isInSchedule(opened GlideDateTime)\n",
      hint: [
        'isInSchedule ki GlideDateTime ivvali, string kaadu.',
        "if (sched.isInSchedule(new GlideDateTime(gr.getValue('opened_at')))) { ... } else { ... }",
        "gs.info(gr.getValue('number') + ' opened in business hours');   /   gs.info(gr.getValue('number') + ' opened outside business hours');",
      ],
      solution: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.get('number', 'INC0010003');\nif (sched.isInSchedule(new GlideDateTime(gr.getValue('opened_at')))) {\n  gs.info(gr.getValue('number') + ' opened in business hours');\n} else {\n  gs.info(gr.getValue('number') + ' opened outside business hours');\n}",
      explain: 'Tuesday 15:05 → inside. Variants: Saturday 10:00, Tuesday 19:00 — rendu outside. ⚠️ Real schedule ki sontha time zone undi; ikkada UTC.',
      checks: ['schedule-8to5'],
      tests: [{ label: 'Log', logs: ['INC0010003 opened in business hours'] }],
      variants: [
        { name: 'Saturday', scenario: SEED({ sys_id: 'inc3', opened_at: '2026-11-07 10:00:00' }), tests: [{ label: 'Log', logs: ['INC0010003 opened outside business hours'] }] },
        { name: 'Tuesday 19:00', scenario: SEED({ sys_id: 'inc3', opened_at: '2026-11-03 19:00:00' }), tests: [{ label: 'Log', logs: ['INC0010003 opened outside business hours'] }] },
      ],
    }),
    jx('ss-gdt2', 6, 'Out-of-hours tickets count', 'medium+', {
      server: true,
      task: 'Active incidents number order. Schedule "sch_8to5" BAYATA open ayinavi number log chesi, chivara "Outside hours: <count>" log chey. 🧰 Vaade words: isInSchedule(), loop + count',
      starter: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nvar n = 0;\n// loop: NOT in schedule → log number, n++\n",
      hint: [
        'Medium+ mundu exercise ni loop lo pettu, ! tho "bayata".',
        "if (!sched.isInSchedule(new GlideDateTime(gr.getValue('opened_at')))) { gs.info(gr.getValue('number')); n++; }",
        "gs.info('Outside hours: ' + n);",
      ],
      solution: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nvar n = 0;\nwhile (gr.next()) {\n  if (!sched.isInSchedule(new GlideDateTime(gr.getValue('opened_at')))) {\n    gs.info(gr.getValue('number'));\n    n++;\n  }\n}\ngs.info('Outside hours: ' + n);",
      explain: 'INC0010008 Saturday 06:10. Variant lo INC0010001 07:59 ki (08:00 kante mundu — outside) mariyu Sunday kotha ticket.',
      tests: [{ label: 'Logs', logs: ['INC0010008', 'Outside hours: 1'] }],
      variants: [{ name: '07:59 + Sunday', scenario: SEED({ sys_id: 'inc1', opened_at: '2026-11-02 07:59:00' }, { short_description: 'Sunday outage', opened_at: '2026-11-08 12:00:00' }), tests: [{ label: 'Logs', logs: ['INC0010001', 'INC0010008', 'INC0010009', 'Outside hours: 3'] }] }],
    }),
    jx('ss-gdt2', 7, 'Business hours open', 'medium+', {
      server: true,
      task: 'INC0010007 opened_at nunchi ippati varaku WORKING time (sched.duration) — hours (Math.floor(ms / 3600000)). "<number> business hours open: <hours>" log chey. 🧰 Vaade words: sched.duration(), getNumericValue()',
      starter: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.get('number', 'INC0010007');\n// biz = sched.duration(opened, now)\n",
      hint: [
        'duration(start, end) working time matrame lekka pedutundi — weekend, raatri skip.',
        "var biz = sched.duration(new GlideDateTime(gr.getValue('opened_at')), new GlideDateTime());",
        "gs.info(gr.getValue('number') + ' business hours open: ' + Math.floor(biz.getNumericValue() / 3600000));",
      ],
      solution: "var sched = new GlideSchedule('sch_8to5');\nvar gr = new GlideRecord('incident');\ngr.get('number', 'INC0010007');\nvar biz = sched.duration(new GlideDateTime(gr.getValue('opened_at')), new GlideDateTime());\ngs.info(gr.getValue('number') + ' business hours open: ' + Math.floor(biz.getNumericValue() / 3600000));",
      explain: 'Fri 09:55–17:00 (7 h 5 m) + Mon–Wed 27 h + Thu 08:00–10:00 (2 h) = 36 h 5 m → 36. Calendar time ayithe 144 h! Variant lo Wednesday 15:00 open → 4.',
      tests: [{ label: 'Log', logs: ['INC0010007 business hours open: 36'] }],
      variants: [{ name: 'Wed 15:00', scenario: SEED({ sys_id: 'inc7', opened_at: '2026-11-11 15:00:00' }), tests: [{ label: 'Log', logs: ['INC0010007 business hours open: 4'] }] }],
    }),
    jx('ss-gdt2', 4, 'P1 response (4 business hours)', 'hard', {
      server: true,
      task: 'Active P1 incidents, number order. Response due = opened_at + 4 WORKING hours (sched.add with sch_8to5). Due ippati kante mundu ayithe "<number> due <due> BREACHED", lekapothe "<number> due <due> OK" (due = UTC value).',
      starter: "var sched = new GlideSchedule('sch_8to5');\nvar now = new GlideDateTime();\n// TODO\n",
      hint: [
        'Medium+ lo chesinavi kalupu: schedule, duration (4 hours), add, before(now).',
        "var due = sched.add(new GlideDateTime(gr.getValue('opened_at')), new GlideDuration('0 04:00:00'));",
        "gs.info(gr.getValue('number') + ' due ' + due.getValue() + ' ' + (due.before(now) ? 'BREACHED' : 'OK'));",
      ],
      solution: "var sched = new GlideSchedule('sch_8to5');\nvar now = new GlideDateTime();\nvar four = new GlideDuration('0 04:00:00');\nvar gr = new GlideRecord('incident');\ngr.addActiveQuery();\ngr.addQuery('priority', 1);\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  var due = sched.add(new GlideDateTime(gr.getValue('opened_at')), four);\n  gs.info(gr.getValue('number') + ' due ' + due.getValue() + ' ' + (due.before(now) ? 'BREACHED' : 'OK'));\n}",
      explain: 'INC0010008 Saturday open — Monday 08:00 nunchi 4 h → 12:00. Variant lo Thursday 08:00 (due 12:00, OK) mariyu Wednesday 16:00 (1 h Wed + 3 h Thu → 11:00, OK) P1s unnayi. Real SLA engine ide idea, plus pause / holidays.',
      tests: [{ label: 'Report', logs: ['INC0010002 due 2026-11-03 15:40:00 BREACHED', 'INC0010008 due 2026-11-09 12:00:00 BREACHED'] }],
      variants: [{
        name: 'recent P1s',
        scenario: SEED({ short_description: 'Payroll down', priority: '1', opened_at: '2026-11-12 08:00:00' }, { short_description: 'Mail relay down', priority: '1', opened_at: '2026-11-11 16:00:00' }),
        tests: [{ label: 'Report', logs: ['INC0010002 due 2026-11-03 15:40:00 BREACHED', 'INC0010008 due 2026-11-09 12:00:00 BREACHED', 'INC0010009 due 2026-11-12 12:00:00 OK', 'INC0010010 due 2026-11-12 11:00:00 OK'] }],
      }],
    }),
  ],
}

export const SS_LESSONS_B = [gsys, gdt1, gdt2]
