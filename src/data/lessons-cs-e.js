// Stage 3 — remaining lectures: SN Utils (1), GlideRecord CRUD (9, 10), debugging (13), macros (14), best practices (23), UI Pages / Macros (24–26).
//  mode 'pdi'  → learn cards + quiz + hands-on exercises done in her REAL PDI (scenario / hint / steps / answer / cleanup)
//  others      → code exercises in the browser sandbox (server runner or client runner)
import { q, jx } from './lessonKit.js'

const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const MSGS = '__msgs.map(function (m) { return m.text })'

/* 1 — SN Utils */
const snutils = {
  id: 'cs-snutils',
  mode: 'pdi',
  title: 'SN Utils Tools',
  video: 'SN Utils Tools',
  duration: '',
  no: 1,
  blurb: 'Browser extension — slash commands, field names, background scripts, dev life ni easy chestundi.',
  learn: [
    {
      h: '🧰 SN Utils ante emiti?',
      body: [
        'SN Utils oka free browser extension (Chrome / Edge / Firefox store lo untundi) — ServiceNow developers ki chala useful shortcuts istundi. ServiceNow tho officially connected kaadu, community tool.',
        'Mukhyamaina features: slash commands (filter navigator lo "/" tho start), field names chupinchadam, background script editor, record ni XML / JSON ga chudadam, instance switch.',
        'Install cheyyadaniki: Chrome Web Store lo "SN Utils" search chesi add chey. Extension permissions adugutundi — nee PDI kosam OK, kani production instance lo vaadataniki mundu company policy chudu.',
      ],
    },
    {
      h: '⌨️ Slash commands',
      body: [
        'Navigator filter box lo (leda ServiceNow page lo) "/" type chesthe commands list vastundi — adi first nerchukovalsina trick. Konni famous commands: /tn <table> (aa table list open), /bg (background script), /sys (sys_id tho record), /env (instances).',
        '⚠️ Command names version batti marachu — memory nunchi rasanu. Nee extension lo "/" tho vachhe list ne final truth ga teesukoo.',
      ],
      code: `/tn incident        → incident list
/tn sys_user        → users list
/bg                 → background script editor`,
    },
    {
      h: '👀 Field names & Background Script',
      body: [
        'Form lo field labels kaadu, actual column names (short_description) kavali anukunte — SN Utils tho field names toggle cheyyochu (shortcut / button extension lo untundi). Script rayadaniki column name ye kavali.',
        'Background Script (System Definition → Scripts - Background) lo server script run chesi output chudochu. Chinna GlideRecord tests ki perfect — kani PDI lo matrame, production lo carefully!',
      ],
    },
  ],
  quiz: [
    q('SN Utils ante?', ['ServiceNow official platform module', 'Free browser extension (community tool)', 'Update Set lo oka type', 'Plugin Store lo app'], 1, 'Browser extension — community tool.'),
    q('Slash commands ela start avtayi?', ['"/" type chesi', 'Ctrl+S', '"#" tho', 'F5'], 0, '"/" tho — list vastundi.'),
    q('Script rayadaniki field label kaadu, enti kavali?', ['Column name (e.g. short_description)', 'Field yokka Table label', 'Record yokka Sys ID', 'Form View peru'], 0, 'Script lo column name vaadali.'),
    q('Background Script ela vaadali?', ['PDI lo safe ga test chesi', 'Production lo ellappudu', 'Client script lo', 'Update set lo'], 0, 'PDI lo test; production lo jagratta.'),
    q('Command names marite ela telusukuntam?', ['"/" tho vachhe list chudu', 'Guess chesi try cheyyadam', 'Extension ni reinstall cheyyadam', 'Telusukovadam sadhyam kaadu'], 0, 'Extension lo list ye truth.'),
  ],
  exercises: [
    jx('cs-snutils', 1, 'Extension install chesi "/" try chey', 'easy', {
      scenario: 'Browser lo SN Utils extension install chesi, nee PDI lo login ayyi, navigator filter lo "/" type chesi commands list chudu.',
      hint: 'Chrome Web Store → "SN Utils" (by Arnoud Kooi) search.',
      steps: ['Browser extension store open chesi "SN Utils" search chesi install chey.', 'Nee PDI lo login ayyi, any page lo extension icon kanipistundo chudu.', 'Left navigator filter box lo "/" type chey.', 'Vachhe commands list lo 3-4 commands chadivi artham chesuko.'],
      answer: 'Commands list (tn, bg, ...) dropdown lo kanipistundi.',
      cleanup: 'Em marchaledu — extension remove cheyyalante browser extensions page lo uninstall.',
    }),
    jx('cs-snutils', 2, '/tn tho table list open', 'easy', {
      scenario: '"/tn incident" command tho incident list open chey, tarvata "/tn sys_user" tho users list.',
      hint: 'Filter box lo type chesi Enter.',
      steps: ['Filter box lo "/tn incident" type chesi Enter.', 'Incident list open avtundi — URL chudu (incident_list.do).', '"/tn sys_user" try chey.'],
      answer: 'Incident list, tarvata User list open avtayi. Navigator lo module vethakkunda direct ga vellochu.',
      cleanup: 'Emi marchaledu.',
    }),
    jx('cs-snutils', 3, 'Field names chudu', 'medium', {
      scenario: 'Incident form open chesi SN Utils tho field names toggle chesi, "Short description" yokka column name kanukkoni, Category, Assignment group column names note chesuko.',
      hint: 'Extension popup / form paina SN Utils options lo "field names" toggle untundi. Leda right-click label → Show XML / Configure.',
      steps: ['Any incident open chey.', 'SN Utils field names toggle chey (extension lo options chudu).', 'Short description, Category, Assignment group column names note chesuko.'],
      answer: 'short_description, category, assignment_group (columns). Idi scripts lo vaadatam.',
      cleanup: 'Toggle malli off chey (optional).',
    }),
    jx('cs-snutils', 4, 'Background script', 'hard', {
      scenario: 'Background script editor open chesi (nee PDI lo matrame!) incident count log chey: gs.info(count).',
      hint: '/bg command leda All → System Definition → Scripts - Background.',
      steps: ['"/bg" try chey (work cheyyakapothe navigator lo "Scripts - Background" search).', 'Editor lo ide rayi: var gr = new GlideRecord("incident"); gr.query(); gs.info("Incidents: " + gr.getRowCount());', 'Run script click chey.', 'Output lo "Incidents: N" kanipistundi.'],
      answer: 'Output lo "*** Script: Incidents: N". N = nee PDI lo total incidents.',
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
  blurb: 'Background script tho records create (initialize / insert) mariyu query chesi read cheyyadam.',
  learn: [
    {
      h: '➕ Create — initialize + insert',
      body: [
        'Background script lo (server) GlideRecord tho records create chestam: var gr = new GlideRecord("incident"); gr.initialize(); gr.short_description = "..."; var id = gr.insert();',
        'initialize() empty record ready chestundi (defaults tho). Fields set chesi insert() — sys_id return chestundi. Insert tarvata number lanti auto fields set avtayi.',
        'Client script lo ivi vaadakudadu — idi server code (Background Script, Business Rule, Script Include).',
      ],
      code: `var gr = new GlideRecord('incident');
gr.initialize();
gr.setValue('short_description', 'Created from script');
gr.setValue('urgency', 2);
var sysId = gr.insert();
gs.info('Created ' + gr.getValue('number'));`,
    },
    {
      h: '📖 Read — query & get',
      body: [
        'Multiple records: addQuery(field, value) → query() → while (gr.next()) { ... }. Okka record: gr.get("number", "INC0010004") leda gr.get(sys_id).',
        'Extras: addActiveQuery(), orderBy(field), orderByDesc(field), setLimit(n), getRowCount(), addEncodedQuery("active=true^priority=1").',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.addActiveQuery();
gr.orderBy('number');
gr.query();
while (gr.next()) {
  gs.info(gr.getValue('number'));
}`,
    },
    {
      h: '⚠️ Real PDI lo',
      body: [
        'Background script lo insert chesthe nijamga records create avtayi — PDI lo cleanup cheyyi (delete). Ee site lo mock sandbox kabatti safe — kani real lo jagratta.',
        'Ikkada exercises Stage 2 laaga run avtayi (gs.info output log lo kanipistundi).',
      ],
    },
  ],
  quiz: [
    q('Kotha record create cheyyadaniki?', ['initialize() + fields + insert()', 'gr.create() call chesi save', 'gr.add() tho kotha row', 'gr.update() matrame'], 0, 'initialize, set fields, insert().'),
    q('insert() em return chestundi?', ['sys_id', 'true', 'Record number', 'Nothing'], 0, 'New record sys_id.'),
    q('Multiple records read cheyyadaniki?', ['query() + while (gr.next())', 'get() matrame vaadi', 'insert() tho', 'getRowCount() matrame'], 0, 'query() tarvata next() loop.'),
    q('gr.get("number", "INC0010004") ki?', ['Oka record load chestundi', 'Anni records ni load chestundi', 'Aa record ni delete chestundi', 'Kotha record create chestundi'], 0, 'Oka record (first match).'),
    q('Client script lo GlideRecord create cheyyala?', ['Avunu, client lo ellappudu cheyyochu', 'Vaddu — server lo (Business Rule / Script Include)', 'Admin role unte matrame cheyyochu', 'onLoad script lo matrame cheyyochu'], 1, 'Server-side API.'),
  ],
  exercises: [
    jx('cs-crud1', 1, 'Incident create chey', 'easy', {
      server: true,
      task: 'Kotha incident create chey: short_description = "Printer not working", urgency = 2. insert() chesi gs.info("Created " + number) log chey.',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: "gr.initialize(); gr.setValue('short_description', '...'); gr.setValue('urgency', 2); gr.insert(); gs.info('Created ' + gr.getValue('number'));",
      solution: "var gr = new GlideRecord('incident');\ngr.initialize();\ngr.setValue('short_description', 'Printer not working');\ngr.setValue('urgency', 2);\ngr.insert();\ngs.info('Created ' + gr.getValue('number'));",
      explain: 'Insert tarvata number auto generate avtundi — mundu INC0010008 undi kabatti INC0010009.',
      tests: [
        { label: 'Log: Created INC0010009', logs: ['Created INC0010009'] },
        { label: 'Total incidents 9', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 9 },
      ],
    }),
    jx('cs-crud1', 2, 'Oka record read', 'easy', {
      server: true,
      task: 'INC0010004 record load chesi (gr.get("number", ...)) daani short_description log chey.',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: "gr.get('number', 'INC0010004'); gs.info(gr.getValue('short_description'));",
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010004');\ngs.info(gr.getValue('short_description'));",
      explain: 'get(field, value) first matching record load chestundi.',
      tests: [{ label: 'Log', logs: ['Reports are taking 5 minutes to load'] }],
    }),
    jx('cs-crud1', 3, 'Active network incidents', 'medium', {
      server: true,
      task: 'category = network mariyu ACTIVE incidents query chesi number order lo prathi number log chey.',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: [
        'Rendu filters kavali (category + active), tarvata number order, tarvata loop lo prathi record number log.',
        "addQuery('category', 'network') + addActiveQuery() + orderBy('number') → query() → while (gr.next()) { ... }",
        "gr.addQuery('category', 'network'); gr.addActiveQuery(); gr.orderBy('number'); gr.query(); while (gr.next()) { gs.info(gr.getValue('number')); }",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('category', 'network');\ngr.addActiveQuery();\ngr.orderBy('number');\ngr.query();\nwhile (gr.next()) {\n  gs.info(gr.getValue('number'));\n}",
      explain: 'Query → loop. orderBy tho predictable order.',
      tests: [{ label: 'Numbers', logs: ['INC0010002', 'INC0010007'] }],
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
      explain: 'get() ki okka argument (sys_id) iste aa record load avtundi. Insert nijamga DB lo save ayyindo ani ila verify cheyyochu — Background script lo manchi habit.',
      tests: [
        { label: 'Log: Saved: INC0010009 network', logs: ['Saved: INC0010009 network'] },
        { label: 'check record = insert chesina record', expr: 'check.getUniqueValue() === id', expect: true },
        { label: 'short_description = VPN slow', expr: "check.getValue('short_description')", expect: 'VPN slow' },
      ],
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
      explain: 'initialize() malli pilisthe paata record values (number tho saha) poyi fresh record vastundi. Hard exercise lo loop lo prathi saari new GlideRecord create chestam — rendu ways work avtayi. ⚠️ initialize() lekunda rendo saari insert() chesthe real lo em avtundo nee PDI lo confirm chesuko (cleanup marchipoku).',
      tests: [
        { label: 'Logs: INC0010009, INC0010010', logs: ['Created INC0010009', 'Created INC0010010'] },
        { label: 'Total incidents 10', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 10 },
        { label: 'INC0010010 = Keyboard broken', expr: "(function () { var g = new GlideRecord('incident'); g.get('number', 'INC0010010'); return g.getValue('short_description'); })()", expect: 'Keyboard broken' },
      ],
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
      explain: 'Array + loop = data nunchi chala records okesari create cheyyochu (bulk data load). Hard exercise lo category set chesi, entha create chesavo count chestam.',
      tests: [
        { label: 'Logs', logs: ['Created INC0010009: Printer jam', 'Created INC0010010: VPN slow'] },
        { label: 'Total incidents 10', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 10 },
      ],
    }),
    jx('cs-crud1', 4, 'Array nunchi 3 incidents create', 'hard', {
      server: true,
      task: 'issues = ["Printer jam", "VPN slow", "Mouse broken"] array undi. Loop lo prathi issue ki oka incident create chey (short_description = issue, category = "hardware"). Last lo gs.info("Created " + count) (count = create chesina records).',
      starter: "var issues = ['Printer jam', 'VPN slow', 'Mouse broken'];\n// TODO",
      hint: [
        'Medium+ 7 lo loop + create already chesav. Ippudu category kuda set chey, mariyu entha records create chesavo oka counter lo lekka pettu.',
        'var count = 0; for (...) { new GlideRecord; initialize; short_description + category set; insert; count++; }   — loop tarvata okka gs.info.',
        "for (var i = 0; i < issues.length; i++) { var gr = new GlideRecord('incident'); gr.initialize(); gr.setValue('short_description', issues[i]); gr.setValue('category', 'hardware'); gr.insert(); count++; }  gs.info('Created ' + count);",
      ],
      solution: "var issues = ['Printer jam', 'VPN slow', 'Mouse broken'];\nvar count = 0;\nfor (var i = 0; i < issues.length; i++) {\n  var gr = new GlideRecord('incident');\n  gr.initialize();\n  gr.setValue('short_description', issues[i]);\n  gr.setValue('category', 'hardware');\n  gr.insert();\n  count++;\n}\ngs.info('Created ' + count);",
      explain: 'Loop ki lopale new GlideRecord create chey — leda initialize() malli pilichi reuse cheyyochu.',
      tests: [
        { label: 'Log', logs: ['Created 3'] },
        { label: 'Total incidents 11', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 11 },
      ],
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
  blurb: 'update(), loops tho bulk update, deleteRecord() — jagratta tho.',
  learn: [
    {
      h: '✏️ Update',
      body: [
        'Record load chesi (get / query+next), fields marchi gr.update(). Multiple records ki: query → while (gr.next()) { gr.setValue(...); gr.update(); }.',
        'Shortcuts (real instance): setWorkflow(false) — business rules run cheyyakunda update (careful!), autoSysFields(false) — sys_updated fields marchakunda. updateMultiple() kuda undi kani jagratta.',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.addActiveQuery();
gr.query();
while (gr.next()) {
  gr.setValue('priority', 2);
  gr.update();
}`,
    },
    {
      h: '🗑️ Delete',
      body: [
        'Record load chesi gr.deleteRecord() — oka record delete. Loop lo prathi record ki. deleteMultiple() query ki match ayye anni delete chestundi — chala danger!',
        'Rule: delete mundu ellappudu gs.info tho records print chesi chudu (dry run), tarvata delete. Production lo bulk delete cheyyakudadu (Update set / backups lekunda).',
      ],
      code: `var gr = new GlideRecord('incident');
gr.addQuery('state', 'IN', '6,7');
gr.addQuery('active', false);
gr.query();
while (gr.next()) {
  gs.info('Deleting ' + gr.getValue('number'));   // dry run first!
  // gr.deleteRecord();
}`,
    },
  ],
  quiz: [
    q('Record marchaka save cheyyadaniki?', ['gr.update()', 'gr.save()', 'gr.commit()', 'gr.set()'], 0, 'update() — field values marchina tarvata gr.update() pilavakapothe database lo save avvavu.'),
    q('Multiple records update ki?', ['query + while(next) + update', 'get() + update() okka saari', 'insert() tho marchali', 'Multiple update cheyyalem'], 0, 'Loop lo prathi record ki update().'),
    q('Delete mundu manchi habit?', ['Dry run — numbers log chesi chudu', 'Direct ga delete cheyyadam', 'Warnings ni ignore cheyyadam', 'Instance ni reboot cheyyadam'], 0, 'Mundu log chesi verify.'),
    q('deleteMultiple() ki?', ['Query ki match ayye anni delete — danger', 'Oka record matrame delete chestundi', 'Ellappudu safe, em jaragadu', 'Inactive records matrame delete chestundi'], 0, 'Anni delete avtayi — jagratta.'),
    q('setWorkflow(false) em chestundi?', ['Business Rules run avvakunda update', 'Workflow ni add chestundi', 'Record ni lock chestundi', 'Em cheyyadu, no effect'], 0, 'Business Rules/workflows skip avtayi — careful.'),
  ],
  exercises: [
    jx('cs-crud2', 1, 'Oka record update', 'easy', {
      server: true,
      task: 'INC0010006 load chesi state ni 2 (In Progress) chey, update() chesi gs.info("State: " + state) log chey.',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: "gr.get('number', 'INC0010006'); gr.setValue('state', 2); gr.update(); gs.info('State: ' + gr.getValue('state'));",
      solution: "var gr = new GlideRecord('incident');\ngr.get('number', 'INC0010006');\ngr.setValue('state', 2);\ngr.update();\ngs.info('State: ' + gr.getValue('state'));",
      explain: 'get → set → update.',
      tests: [{ label: 'Log', logs: ['State: 2'] }],
    }),
    jx('cs-crud2', 2, 'Bulk update (loop)', 'easy', {
      server: true,
      task: 'Active network incidents anni ki priority 2 set chesi update() chey. Last lo gs.info("Updated " + count).',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: "addQuery('category','network'); addActiveQuery(); query(); while (gr.next()) { setValue; update; count++ }",
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('category', 'network');\ngr.addActiveQuery();\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gr.setValue('priority', 2);\n  gr.update();\n  count++;\n}\ngs.info('Updated ' + count);",
      explain: 'While loop lo prathi record ki update().',
      tests: [{ label: 'Log', logs: ['Updated 2'] }],
    }),
    jx('cs-crud2', 3, 'Printer incident delete', 'medium', {
      server: true,
      task: 'short_description lo "Printer" unna incident ni query chesi deleteRecord() chey. Delete cheyyadaniki mundu gs.info("Deleting " + number) (dry-run log). Last lo gs.info("Deleted " + count).',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: [
        'CONTAINS filter tho query chey. Loop lo MUNDU log (dry run), TARVATA delete, count penchu. Loop tarvata total log.',
        "addQuery('short_description', 'CONTAINS', 'Printer') → query() → var count = 0; while (gr.next()) { log; deleteRecord(); count++; }",
        "while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); count++; }  gs.info('Deleted ' + count);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('short_description', 'CONTAINS', 'Printer');\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n  count++;\n}\ngs.info('Deleted ' + count);",
      explain: 'Log mundu, delete tarvata — evi delete ayyayo telustundi.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010003', 'Deleted 1'] },
        { label: 'Remaining 7', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 7 },
      ],
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
      explain: 'Dry run = delete code rayadaniki mundu emi delete avtayo chudadam. List correct ga unte appude deleteRecord() add chey. Ikkada okka record matrame (INC0010005) — real PDI lo chala undochu, anduke dry run mukhyam.',
      tests: [
        { label: 'Logs', logs: ['Would delete INC0010005', 'Would delete total: 1'] },
        { label: 'Emi delete avvaledu (8 ala unnayi)', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 8 },
      ],
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
        { label: 'Remaining 7', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 7 },
      ],
    }),
    jx('cs-crud2', 7, 'Delete tarvata verify (fresh query)', 'medium+', {
      server: true,
      task: 'Inactive incidents (addQuery("active", false)) anni delete chey — prathi daaniki mundu "Deleting <number>" log. Tarvata KOTHA GlideRecord (check) tho malli inactive query chesi "Inactive left: <count>" log chey (0 raavali). 🧰 Vaade words: addQuery(), deleteRecord(), query(), getRowCount()',
      starter: "var gr = new GlideRecord('incident');\n// Step 1: active = false filter, query, loop lo log + delete\n\n// Step 2: var check = new GlideRecord('incident');\n//         same filter tho query chesi 'Inactive left: ' + count log\n",
      hint: [
        'Rendu parts: (1) delete loop — medium exercise laage. (2) verify — kotha GlideRecord tho same filter query chesi count chudu.',
        "Delete: addQuery('active', false); query(); while (gr.next()) { log; deleteRecord(); }   Verify: var check = new GlideRecord('incident'); same addQuery; query(); getRowCount()",
        "while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); }   check.addQuery('active', false); check.query(); gs.info('Inactive left: ' + check.getRowCount());",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('active', false);\ngr.query();\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n}\n\nvar check = new GlideRecord('incident');\ncheck.addQuery('active', false);\ncheck.query();\ngs.info('Inactive left: ' + check.getRowCount());",
      explain: 'Delete tarvata fresh query tho verify = "nijamga poyaya?" ani proof. Paata gr ni reuse cheyyaku — adi paata query result. Hard exercise lo filter inka tight (rendu conditions) chestam.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010005', 'Inactive left: 0'] },
        { label: 'Remaining 7', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 7 },
      ],
    }),
    jx('cs-crud2', 4, 'Safe cleanup', 'hard', {
      server: true,
      task: 'Inactive (active = false) mariyu state 6 leda 7 unna incidents matrame delete chey (addQuery("state","IN","6,7"), addQuery("active", false)). Prathi daaniki "Deleting <number>" log, last lo "Deleted <count>". Active incidents jolliki vellakudadu.',
      starter: "var gr = new GlideRecord('incident');\n// TODO",
      hint: [
        'Medium+ 5 (IN operator) + medium (log → delete → count) kalipi. Rendu addQuery lu pedithe = AND (rendu nijam kavali).',
        "addQuery('state', 'IN', '6,7'); addQuery('active', false); query(); var count = 0; while (gr.next()) { log; deleteRecord(); count++; }",
        "while (gr.next()) { gs.info('Deleting ' + gr.getValue('number')); gr.deleteRecord(); count++; }  gs.info('Deleted ' + count);   — filters: gr.addQuery('state', 'IN', '6,7'); gr.addQuery('active', false);",
      ],
      solution: "var gr = new GlideRecord('incident');\ngr.addQuery('state', 'IN', '6,7');\ngr.addQuery('active', false);\ngr.query();\nvar count = 0;\nwhile (gr.next()) {\n  gs.info('Deleting ' + gr.getValue('number'));\n  gr.deleteRecord();\n  count++;\n}\ngs.info('Deleted ' + count);",
      explain: 'Rendu addQuery = AND. Safe cleanup: tight filter + dry-run log.',
      tests: [
        { label: 'Logs', logs: ['Deleting INC0010005', 'Deleted 1'] },
        { label: 'Remaining 7', expr: "(function () { var g = new GlideRecord('incident'); g.query(); return g.getRowCount(); })()", expect: 7 },
      ],
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
  blurb: 'jslog / console, browser dev tools, gs.info + System Logs, Session Debug — scripts ela debug chestam.',
  learn: [
    {
      h: '🌐 Client side debugging',
      body: [
        'Browser lo F12 (Developer Tools) → Console tab. Client scripts lo jslog("message") leda console.log("...") rasthe ikkada kanipistayi. g_form.addInfoMessage("...") tho form paina kuda chudochu.',
        'Console lo direct ga g_form.getValue("priority") type chesi values test cheyyochu (form open ayi unnappudu). Sources tab lo breakpoints pettochu.',
        '⚠️ Next Experience UI lo form workspace iframe lo untundi — console context marchali (top dropdown lo "gsft_main"-type frame). Memory nunchi rasanu, nee PDI lo confirm chesuko.',
      ],
      code: `function onChange(control, oldValue, newValue, isLoading) {
  jslog('onChange: ' + oldValue + ' -> ' + newValue);
}`,
    },
    {
      h: '🖧 Server side debugging',
      body: [
        'gs.info("..."), gs.warn, gs.error, gs.debug tho log chestam. Chudataniki: System Logs → System Log → Script Log Statements (leda All Logs). Background script lo output direct ga kanipistundi.',
        'gs.print() background scripts ki, gs.log() old. Scoped apps lo gs.info vaadu. Business Rules debug ki: System Diagnostics → Session Debug → Debug Business Rule.',
        'Script Debugger (System Definition → Script Debugger) — breakpoints tho step-by-step debug (server).',
      ],
      code: `gs.info('Value of priority: ' + current.priority);
gs.error('Something failed for ' + current.number);`,
    },
    {
      h: '🧠 Tips',
      body: ['Mundu problem ekkada (client na server) ani gurtinchu. Log tho values print chesi chudu — oka assumption oka saari verify chey. Debug logs tarvata teeseyyi (production lo noise).'],
    },
  ],
  quiz: [
    q('Client script debug ki?', ['jslog / console.log + browser Console', 'gs.info + Script Log Statements', 'Update Set lo log chudadam', 'System Properties lo log chudadam'], 0, 'jslog/console.log, F12 Console.'),
    q('gs.info() output ekkada chudali?', ['System Logs → Script Log Statements', 'Browser console lo', 'Form lo message ga', 'Email ga vastundi'], 0, 'System Log → Script Log Statements.'),
    q('Business Rules debug ki?', ['Session Debug → Debug Business Rule', 'Client Scripts list lo', 'UI Policies list lo', 'Dictionary lo'], 0, 'Session Debug → Debug Business Rule — ee session lo run ayina Business Rules, order, time chupistundi.'),
    q('Step-by-step server debug?', ['Script Debugger', 'jslog', 'gs.print', 'Update Set'], 0, 'Script Debugger breakpoints.'),
    q('Debug logs tarvata?', ['Teeseyyali (noise)', 'Anni ikkade vadileyali', 'Production lo pettali', 'Em kaadu'], 0, 'Debug logs production lo noise create chestayi, performance ki kuda effect — kaabatti teeseyyali.'),
  ],
  exercises: [
    jx('cs-debug', 1, 'Background script log', 'easy', {
      scenario: 'Background Script lo gs.info tho oka message log chesi, output ela kanipistundo chudu, tarvata System Logs lo kuda vethuku.',
      hint: 'All → System Definition → Scripts - Background. Logs: All → System Logs → System Log → Script Log Statements.',
      steps: ['Scripts - Background open chey.', 'gs.info("SnowKeer debug test") rasi Run script click chey.', 'Output lo message chudu.', 'System Logs → Script Log Statements lo "SnowKeer debug test" filter chesi vethuku.'],
      answer: 'Background output lo message kanipistundi. System Log lo kuda entry untundi (Source: Script Background / similar).',
      cleanup: 'Em marchaledu — log entries ante chalu (marchina avasaram ledu).',
    }),
    jx('cs-debug', 2, 'Browser console lo g_form', 'easy', {
      scenario: 'Oka incident form open chesi browser console lo g_form.getValue("priority") run chesi value chudu.',
      hint: 'F12 → Console. Form frame context marchali emo (top-dropdown).',
      steps: ['Any incident open chey.', 'F12 press chesi Console tab open chey.', 'g_form.getValue("priority") type chesi Enter.', 'Work cheyyakapothe console context dropdown lo form frame select chey.'],
      answer: 'Priority value ("3" laaga string) print avtundi. g_form.getTableName() → "incident".',
      cleanup: 'Em marchaledu.',
    }),
    jx('cs-debug', 3, 'jslog tho client script', 'medium', {
      scenario: 'Oka test onChange client script (incident, field = priority) create chesi jslog tho oldValue/newValue log chey; priority marchi console lo chudu.',
      hint: 'Client Scripts: All → System Definition → Client Scripts → New.',
      steps: ['Client Script new: Name "SnowKeer debug", Table incident, Type onChange, Field name priority.', 'Script: jslog("priority: " + oldValue + " -> " + newValue); (guard tho).', 'Save; incident open chesi priority marchi F12 Console lo logs chudu.'],
      answer: 'Console lo "priority: 3 -> 2" laaga logs vastayi.',
      cleanup: 'Aa "SnowKeer debug" client script ni delete chey (leda Active untick).',
    }),
    jx('cs-debug', 4, 'Session Debug tho Business Rule', 'hard', {
      scenario: 'Session Debug on chesi oka incident update chesi, Business Rules run ayyevi debug output lo chudu.',
      hint: 'All → System Diagnostics → Session Debug → Debug Business Rule.',
      steps: ['Session Debug → Debug Business Rule click chey (menu lo untundi).', 'Oka incident open chesi short description lo marpu chesi Save chey.', 'Page kinda debug output lo run ayina Business Rules list chudu.', 'Debug ni disable chey (Session Debug → Disable All).'],
      answer: 'Debug output lo Business Rules (peru + before/after) kanipistayi.',
      cleanup: 'Session Debug → Disable All. (Nee test incident lo marpu cheste revert chey.)',
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
  blurb: 'Script editor lo short codes (vargr + Tab) tho code snippets fast ga generate cheyyadam.',
  learn: [
    {
      h: '⚡ Macros ante?',
      body: [
        'ServiceNow script editor (Syntax Editor) lo konni short words type chesi Tab press chesthe pedda code snippet expand avtundi. Udaharana: "vargr" + Tab → GlideRecord template.',
        'Mana PDI lo unna macros (tested): vargr (GlideRecord query), vargror (query with OR condition), for (loop snippet), method (function template), info (gs.info), doc (comment block). While / if macros levu. Editor lo "help" + Tab type chesthe ippudu unna macros list vastundi (idi nuvve confirm chey).',
        'Idi typing save chestundi + typos taggistundi. Business Rule / Script Include editor lo try chey.',
      ],
      code: `vargr<Tab>  →
var gr = new GlideRecord('');
gr.addQuery('', '');
gr.query();
while (gr.next()) {
}`,
    },
    {
      h: '🧰 Inka editor features',
      body: ['Ctrl+Space — auto-complete. Ctrl+F — find. F11 — full screen. Code folding, syntax highlighting. Real instance lo editor settings (ES version, theme) ki Syntax Editor preferences kuda untayi.'],
    },
  ],
  quiz: [
    q('Macro expand cheyyadaniki?', ['Word type chesi Tab', 'Ctrl+S', 'F5', 'Right click'], 0, 'Macro peru type chesi Tab press chesthe full code snippet expand avtundi.'),
    q('vargr em generate chestundi?', ['GlideRecord query template', 'Client script template', 'UI Action template', 'Comment block matrame'], 0, 'GlideRecord snippet.'),
    q('Macros list chudataniki?', ['help + Tab', 'ls', 'Ctrl+H', 'Settings'], 0, 'Editor lo help + Tab (confirm chesuko).'),
    q('Macros valla benefit?', ['Typing + typos takkuva', 'Server speed perugutundi', 'Security perugutundi', 'Em benefit ledu'], 0, 'Fast & accurate.'),
    q('Auto-complete shortcut?', ['Ctrl+Space', 'Ctrl+Z', 'Alt+F4', 'Esc'], 0, 'Ctrl+Space — editor lo auto-complete suggestions (API names, methods) chupistundi.'),
  ],
  exercises: [
    jx('cs-macros', 1, 'vargr macro', 'easy', {
      scenario: 'Scripts - Background editor lo "vargr" type chesi Tab press chey, template expand avtundo chudu. (Run cheyyakandi, just try.)',
      hint: 'All → System Definition → Scripts - Background.',
      steps: ['Scripts - Background open chey.', 'Editor lo vargr type chesi Tab press chey.', 'Vachhina template lo table peru "incident" pettu.'],
      answer: 'GlideRecord snippet (new GlideRecord, addQuery, query, while next) editor lo generate avtundi.',
      cleanup: 'Script run cheyyaku, editor clear chey (Save avvadu).',
    }),
    jx('cs-macros', 2, 'help macro', 'easy', {
      scenario: '"help" type chesi Tab press chesi available macros list chudu, 3 macros note chesuko.',
      hint: 'Same editor lo.',
      steps: ['Editor lo help type chesi Tab.', 'List lo macros chadivi 3 note chesuko.'],
      answer: 'Macro names + descriptions list vastundi (vargr, vargror, for, method, info, doc ... version batti).',
      cleanup: 'Em marchaledu.',
    }),
    jx('cs-macros', 3, 'Snippet tho query rayi', 'medium', {
      scenario: 'vargr macro vaadi incident table lo priority = 1 records count gs.info chey, Run chesi output chudu (read-only).',
      hint: 'gr.addQuery("priority", 1); gs.info(gr.getRowCount());',
      steps: ['vargr + Tab.', 'Table "incident", query priority = 1.', 'while loop badulu gr.getRowCount() log chey.', 'Run script.'],
      answer: 'Output lo P1 incidents count.',
      cleanup: 'Read-only query — em marchaledu.',
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
  blurb: 'Bugs ni correct ga fix chey: guard, string compare, DOM vaddu, synchronous calls vaddu.',
  scratch: {
    starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.addInfoMessage('Changed to ' + newValue);\n}",
    scenario: { form: { values: { priority: '3' } } },
    client: CHG('priority', '3', '2'),
  },
  learn: [
    {
      h: '✅ Do',
      body: [
        'UI Policy tho avvuthe Client Script rayaku. onChange lo guard (isLoading / newValue === "") pettu. Field values strings — "1" tho compare cheyyi (number tho === kaadu).',
        'g_form APIs matrame vaadu. Server data ki g_scratchpad leda GlideAjax (callback). getReference ki callback ellappudu. Comments rayi, field names kakunda hard-coded sys_ids vaadaku.',
      ],
    },
    {
      h: '🚫 Don\'t',
      body: [
        'DOM manipulation (document.getElementById, jQuery, window.) vaddu — upgrades lo break avtayi, Service Portal / Workspace lo work avvadu. Synchronous server calls (getReference without callback) vaddu — browser freeze.',
        'ℹ️ Brazil lo kotha Client Script form chuste oka blue banner untundi: new client scripts strict mode lo run avtayi — direct DOM access, jQuery, prototype, window object disable. (Isolate script field tho per-script ga marchochu.) Ante DOM vaddu ane rule ippudu platform ye enforce chestundi.',
        'Client script lo GlideRecord vaddu (adi ippudu deprecated/blocked in many contexts; GlideAjax vaadu). Security ki client scripts avvu — ACLs / Business Rules vaadu. Same logic multiple scripts lo copy cheyyaku.',
      ],
      code: `// 🚫 Bad
document.getElementById('incident.short_description').disabled = true;

// ✅ Good
g_form.setReadOnly('short_description', true);`,
    },
  ],
  quiz: [
    q('Show/hide/mandatory simple cases ki?', ['UI Policy', 'Client Script always', 'Business Rule', 'Flow'], 0, 'UI Policy first.'),
    q('DOM manipulation enduku vaddu?', ['Upgrades / Workspace lo break avtundi', 'Chala slow ga untundi', 'Idi illegal', 'Server lo kuda work avvadu'], 0, 'Unsupported & fragile.'),
    q('Server data client ki?', ['g_scratchpad / GlideAjax (callback)', 'Synchronous GlideRecord client lo', 'DOM nundi data teesukovadam', 'alert() tho'], 0, 'Async patterns.'),
    q('getReference ni ela vaadali?', ['Callback function tho', 'Callback lekunda (synchronous)', 'Loop lo', 'gs tho'], 0, 'Callback ellappudu — lekapothe browser freeze.'),
    q('Security ki?', ['ACL / Business Rule (server)', 'Client Script tho hide cheyyadam', 'UI Policy tho', 'Field ni form lo hide cheyyadam'], 0, 'Client side bypass cheyochu.'),
  ],
  exercises: [
    jx('cs-best', 1, 'Guard add chey', 'easy', {
      scenario: { form: { values: { priority: '' } } },
      client: CHG('priority', '3', ''),
      task: 'Ee onChange guard lekunda undi — priority empty chesthe kuda message vastundi. Guard add chey (isLoading leda newValue === "" ayithe return) — message raakudadu.',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  g_form.addInfoMessage('Priority changed to ' + newValue);\n}",
      hint: "if (isLoading || newValue === '') { return; }",
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.addInfoMessage('Priority changed to ' + newValue);\n}",
      explain: 'Guard lekapothe load time lo / clear chesinappudu anavasara messages vastayi.',
      tests: [{ label: 'Message raaledu', expr: MSGS, expect: [] }],
    }),
    jx('cs-best', 2, 'String compare bug', 'easy', {
      scenario: { form: { values: { priority: '1' } } },
      client: { trigger: { type: 'onLoad' } },
      task: 'Ee onLoad P1 banner chupinchali kani raavatledu. Bug fix chey: getValue string — number 1 tho === compare avvadu.',
      starter: "function onLoad() {\n  if (g_form.getValue('priority') === 1) {\n    g_form.addInfoMessage('P1 incident!');\n  }\n}",
      hint: "'1' (string) tho compare chey.",
      solution: "function onLoad() {\n  if (g_form.getValue('priority') == '1') {\n    g_form.addInfoMessage('P1 incident!');\n  }\n}",
      explain: '"1" === 1 false. String tho compare chey.',
      tests: [{ label: 'Banner', expr: MSGS, expect: ['P1 incident!'] }],
    }),
    jx('cs-best', 3, 'DOM kakunda g_form', 'medium', {
      scenario: { form: { values: {} } },
      client: { trigger: { type: 'onLoad' } },
      task: 'Ee script DOM tho field disable chestundi (bad practice, Workspace lo work avvadu). g_form API tho short_description ni read-only chey.',
      starter: "function onLoad() {\n  document.getElementById('incident.short_description').disabled = true;\n}",
      hint: [
        'document... line teesesi, adhe pani (field ni edit cheyyakunda cheyyadam) g_form API tho chey.',
        'g_form.setReadOnly(<field name>, true)   — field name ki "incident." prefix avasaram ledu.',
        "function onLoad() { g_form.setReadOnly('short_description', true); }",
      ],
      solution: "function onLoad() {\n  g_form.setReadOnly('short_description', true);\n}",
      explain: 'g_form supported API — Next Experience, Workspace, Portal anni chota work avtundi.',
      tests: [{ label: 'read-only', expr: '__f.short_description.readOnly', expect: true }],
    }),
    jx('cs-best', 5, 'Callback lekunda getReference vaddu', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', 'u_abel', 'u_bud'),
      task: 'Ee onChange (caller_id) lo getReference callback LEKUNDA undi (synchronous — browser freeze; ee sandbox lo adi em return cheyyadu). Callback form ki marchi, callback lopala jslog("Caller: <name>") chey. 🧰 Vaade words: g_form.getReference(), callback function, jslog()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // 🚫 Bad: callback lekunda. Rendo argument ga function pampi, log ni aa function LOPALIKI teesuko.\n  var caller = g_form.getReference('caller_id');\n  jslog('Caller: ' + caller.name);\n}",
      hint: [
        'getReference ki rendo argument ga oka function ivvali — record ready ayinappudu adi call avtundi, record parameter ga vastundi.',
        "g_form.getReference('caller_id', function (caller) { ... });   — var caller = ... line teesey.",
        "g_form.getReference('caller_id', function (caller) { jslog('Caller: ' + caller.name); });",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    jslog('Caller: ' + caller.name);\n  });\n}",
      explain: 'Callback form async — server nunchi record vachevaraku browser aagadu. ⚠️ Callback lekunda getReference classic UI lo synchronous ga pani chesina, Service Portal / Workspace lo support ledu ani antaru — nee PDI lo confirm chesuko.',
      tests: [{ label: 'Log: Caller: Bud Richman', logs: ['Caller: Bud Richman'] }],
      variants: [{ name: 'vere caller (Beth)', scenario: { form: { values: { caller_id: 'u_beth' } } }, client: CHG('caller_id', 'u_abel', 'u_beth'), tests: [{ label: 'Log: Caller: Beth Anglin', logs: ['Caller: Beth Anglin'] }] }],
    }),
    jx('cs-best', 6, 'Callback lopale form update chey', 'medium+', {
      scenario: { form: { values: { caller_id: 'u_bud' } } },
      client: CHG('caller_id', 'u_abel', 'u_bud'),
      task: 'onChange (caller_id) — guard ready ga undi. getReference callback LOPALA description ni "Caller: <name> (<email>)" ga set chey (udaa: "Caller: Bud Richman (bud.richman@example.com)"). 🧰 Vaade words: g_form.getReference(), callback function, g_form.setValue()',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  // Step 1: caller_id record ni callback tho techchuko\n  // Step 2: callback LOPALA description = 'Caller: ' + name + ' (' + email + ')'\n}",
      hint: [
        'Medium+ 5 laage callback, kani ippudu log kaadu — form field set chey. caller vaade prathi line callback lopale undali.',
        "g_form.getReference('caller_id', function (caller) { g_form.setValue('description', ...); });",
        "g_form.setValue('description', 'Caller: ' + caller.name + ' (' + caller.email + ')');   — idi callback lopala",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller: ' + caller.name + ' (' + caller.email + ')');\n  });\n}",
      explain: 'Callback bayata setValue rasthe real lo caller inka raaledu (async) — empty / undefined values vastayi. Ee sandbox lo callback ventane run avtundi kabatti aa bug kanipinchakapovachu; real form lo kanipistundi.',
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
      explain: 'Guard = takkuva server calls + takkuva bugs. Server call (getReference / GlideAjax) unna prathi onChange lo guard modatilo pettu. ⚠️ Empty reference ki getReference callback ki real lo em vastundo nee PDI lo confirm chesuko — ee sandbox lo empty record vastundi (name undefined).',
      tests: [{ label: 'description empty ga undali', expr: "g_form.getValue('description')", expect: '' }],
      variants: [{ name: 'caller set chesinappudu', scenario: { form: { values: { caller_id: 'u_bud' } } }, client: CHG('caller_id', '', 'u_bud'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller: Bud Richman' }] }],
    }),
    jx('cs-best', 4, 'Client GlideRecord vaddu', 'hard', {
      scenario: { form: { values: {} } },
      client: CHG('caller_id', '', 'u_bud'),
      task: 'Ee script client lo GlideRecord vaadutundi (bad: synchronous, slow; ee sandbox lo block chesam). getReference + callback tho marchi description lo "Caller email: <email>" pettu.',
      starter: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  var gr = new GlideRecord('sys_user');\n  gr.get(newValue);\n  g_form.setValue('description', 'Caller email: ' + gr.email);\n}",
      hint: [
        'GlideRecord lines (var gr ..., gr.get ...) teesesi, medium+ 5–6 laage getReference callback vaadu. Guard ala unchu.',
        "g_form.getReference('caller_id', function (caller) { ... caller.email ... });",
        "g_form.getReference('caller_id', function (caller) { g_form.setValue('description', 'Caller email: ' + caller.email); });",
      ],
      solution: "function onChange(control, oldValue, newValue, isLoading, isTemplate) {\n  if (isLoading || newValue === '') {\n    return;\n  }\n  g_form.getReference('caller_id', function (caller) {\n    g_form.setValue('description', 'Caller email: ' + caller.email);\n  });\n}",
      explain: 'Client lo GlideRecord synchronous call (browser freeze) — getReference callback leda GlideAjax vaadu.',
      tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Caller email: bud.richman@example.com' }],
    }),
  ],
}

/* 24 — UI Pages */
const JELLY = `<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
  <!-- nee HTML ikkada -->
</j:jelly>`
const uipages = {
  id: 'cs-uipages',
  mode: 'pdi',
  title: 'UI Pages',
  video: 'Ui Pages',
  duration: '',
  no: 24,
  blurb: 'Custom pages: HTML + Jelly, client script, URL tho open cheyyadam.',
  learn: [
    {
      h: '📄 UI Page ante?',
      body: [
        'UI Page = ServiceNow lo nuvve design chese custom page (HTML + Jelly + client script + processing script). System UI → UI Pages lo create chestam. Name "my_page" ayithe URL: https://<instance>/my_page.do.',
        'Fields: Name, HTML (page markup, Jelly tags), Client script (browser JS), Processing script (form submit ayinappudu server lo run).',
        'Use cases: custom forms, dialogs (UI Action nunchi popup), dashboards, wizards. Pedda apps ki ippudu Service Portal / Workspace better — kani UI Pages legacy lo chala undayi.',
      ],
    },
    {
      h: '🧩 Jelly basics',
      body: [
        'Jelly = XML tho server-side templating. Page start: <j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" ...>. ${...} tho server values: ${gs.getUserDisplayName()}.',
        '<g:evaluate var="jvar_x" expression="gs.getUserName()" /> tho variable set chesi ${jvar_x} tho vaadochu. jvar_ prefix convention.',
        '⚠️ Jelly syntax memory nunchi rasanu — nee PDI lo out-of-box UI Page chusi confirm chesuko, errors vaste page lo XML error kanipistundi.',
      ],
      code: JELLY.replace('<!-- nee HTML ikkada -->', '<h2>Hello ${gs.getUserDisplayName()}</h2>'),
    },
  ],
  quiz: [
    q('UI Page URL ela untundi?', ['<instance>/<name>.do', '<instance>/ui/<name>', '/page/<name>', '/<name>.html'], 0, 'UI Page URL: <instance>/<page name>.do — page name ye URL lo untundi.'),
    q('UI Page lo server values ela vaadatam?', ['${gs.getUserDisplayName()} (Jelly)', 'g_form', 'current only', 'Em ledu'], 0, 'Jelly lo ${...} tho server-side values (gs APIs) HTML lo print chestam.'),
    q('Form submit ayinappudu server script?', ['Processing script', 'Client script', 'HTML', 'Condition'], 0, 'Processing script.'),
    q('UI Page lo browser JS ekkada?', ['Client script field', 'HTML field matrame', 'Processing script', 'Dictionary'], 0, 'Client script field.'),
    q('UI Page name "hello" ayithe test URL?', ['/hello.do', '/hello', '/ui/hello', '/page/hello'], 0, 'UI Page name "hello" ayithe /hello.do tho open avtundi.'),
  ],
  exercises: [
    jx('cs-uipages', 1, 'Hello page', 'easy', {
      scenario: 'UI Page "snowkeer_hello" create chesi "Hello <nee peru>" chupinchu. URL: /snowkeer_hello.do.',
      hint: 'All → System UI → UI Pages → New. HTML lo Jelly skeleton paste chesi h2 pettu.',
      steps: ['UI Pages → New. Name: snowkeer_hello.', 'HTML lo Jelly skeleton paste chesi, andulo <h2>Hello ${gs.getUserDisplayName()}</h2> pettu.', 'Submit; "Try It" (leda instance URL + /snowkeer_hello.do) open chey.'],
      answer: 'Page lo "Hello System Administrator" (nee peru) kanipistundi.',
      cleanup: 'UI Pages list lo snowkeer_hello ni delete chey.',
    }),
    jx('cs-uipages', 2, 'Server value (Jelly evaluate)', 'medium', {
      scenario: 'Same page lo active incidents count chupinchu ("Active incidents: N"). g:evaluate tho GlideRecord vaadi.',
      hint: '<g:evaluate var="jvar_count" expression="..." /> — expression lo oka line / function.',
      steps: ['snowkeer_hello edit chey.', '<g:evaluate var="jvar_count" jelly="true"> block lo GlideRecord query chesi count return chey (last expression).', '<p>Active incidents: ${jvar_count}</p> add chey.', 'Reload chey.'],
      answer: 'Page lo "Active incidents: N" (nee PDI count).',
      cleanup: 'Last lo UI Page delete chey.',
    }),
    jx('cs-uipages', 3, 'Client script button', 'medium', {
      scenario: 'Page lo button pettu, click chesthe client script function (alert) run avvali.',
      hint: 'HTML lo <button onclick="sayHi()">; Client script field lo function sayHi() { alert("Hi"); }',
      steps: ['HTML lo <button type="button" onclick="sayHi()">Click me</button> add chey.', 'Client script field lo: function sayHi() { alert("Hi from SnowKeer"); }', 'Save, page reload, button click chey.'],
      answer: 'Alert popup "Hi from SnowKeer" vastundi.',
      cleanup: 'UI Page delete chey.',
    }),
    jx('cs-uipages', 4, 'Dialog ga open', 'hard', {
      scenario: 'UI Action (form link) tho aa page ni dialog ga open chey: new GlideDialogWindow("snowkeer_hello").',
      hint: 'UI Action: Client tick, Onclick: showHello(), script: function showHello() { var d = new GlideDialogWindow("snowkeer_hello"); d.setTitle("Hello"); d.render(); }',
      steps: ['Incident table ki UI Action create: Name "Show Hello", Client ✔, Form link ✔, Onclick showHello().', 'Script lo GlideDialogWindow code rayi.', 'Incident open chesi related links lo "Show Hello" click chey.'],
      answer: 'Dialog lo snowkeer_hello page kanipistundi.',
      cleanup: 'UI Action "Show Hello" mariyu UI Page snowkeer_hello rendu delete chey.',
    }),
  ],
}

/* 25 — UI Pages continuation */
const uipages2 = {
  id: 'cs-uipages2',
  mode: 'pdi',
  title: 'UI Pages — Continuation (forms & processing)',
  video: 'UI Pages continuation',
  duration: '',
  no: 25,
  blurb: 'UI Page lo form, validation (client script), processing script tho record create.',
  learn: [
    {
      h: '📝 Form + Processing script',
      body: [
        'HTML lo <g:ui_form> tag tho form. Input fields name tho. Submit ayinappudu Processing script server lo run avtundi — akkada GlideRecord tho records create / update chestam. Form values request.getParameter("field_name") tho chaduvutam (g_request kaadu — PDI lo out-of-box UI Pages anni "request" ne vaadutunnaru).',
        'Dialog buttons: <g:dialog_buttons_ok_cancel ok="return validate()" ok_type="button" /> — OK click mundu client validate() run avtundi (false return chesthe aagipotundi).',
        '✅ PDI lo out-of-box UI Pages (e.g. add_catalog_item) processing script lo request.getParameter("...") vaadutunnaru. ⚠️ Exact tag attributes memory nunchi — nee PDI lo out-of-box UI Pages (e.g. search "dialog") chusi confirm chesuko.',
      ],
      code: `// HTML
<g:ui_form>
  <input type="text" name="short_desc" id="short_desc" />
  <g:dialog_buttons_ok_cancel ok="return validate()" ok_type="button" />
</g:ui_form>

// Client script
function validate() {
  if (gel('short_desc').value == '') { alert('Short description kavali'); return false; }
  return true;
}

// Processing script
var gr = new GlideRecord('incident');
gr.initialize();
gr.short_description = request.getParameter('short_desc');
gr.insert();`,
    },
    {
      h: '↩️ Tarvata em?',
      body: ['Processing script tarvata message / redirect: gs.addInfoMessage("Created"); — leda response.sendRedirect("incident_list.do"). Records create chesinappudu PDI lo cleanup marchipoku.'],
    },
  ],
  quiz: [
    q('Form values processing script lo?', ['request.getParameter("name")', 'g_form.getValue', 'current', 'gs.getParam'], 0, 'request.getParameter (PDI lo out-of-box UI Pages lo ila ne vaadutunnaru).'),
    q('OK click mundu client validation?', ['ok="return validate()"', 'onsubmit server', 'Business Rule', 'Condition'], 0, 'dialog_buttons ok attribute lo validate().'),
    q('Validate() false return chesthe?', ['Submit aagipotundi', 'Submit avtundi', 'Error page', 'Reload'], 0, 'validate() false return chesthe OK button submit aagipotundi — user form lone untadu.'),
    q('Processing script ekkada run?', ['Server', 'Browser', 'Both', 'Mobile'], 0, 'Processing script server lo run avtundi — records create/update ikkade chestam.'),
    q('Records create chesaka PDI lo?', ['Cleanup (delete) chey', 'Alage vadileyyi', 'Export chesi pettuko', 'Em cheyyakkarledu'], 0, 'Test data cleanup.'),
  ],
  exercises: [
    jx('cs-uipages2', 1, 'Incident create form', 'medium', {
      scenario: 'UI Page "snowkeer_create" lo short description input + OK button pettu; submit chesthe incident create avvali (Processing script).',
      hint: 'Lesson card lo code adhare. Name snowkeer_create.',
      steps: ['UI Pages → New: Name snowkeer_create.', 'HTML, Client script, Processing script fields lo card lo unna code paste chey.', 'Try It tho page open chesi text rasi OK click chey.', 'Incident list lo kotha incident chudu.'],
      answer: 'Kotha incident (short description = nuvvu rasindi) create avtundi.',
      cleanup: 'Create ayina test incident delete chey, mariyu UI Page snowkeer_create delete chey.',
    }),
    jx('cs-uipages2', 2, 'Validation test', 'easy', {
      scenario: 'Input empty ga vadilesi OK click chey — validation alert vachi submit aagali.',
      hint: 'Prerequisite: ex 1 page undali.',
      steps: ['snowkeer_create page open chey (Prerequisite: previous exercise).', 'Input empty ga OK click chey.', 'Alert chudu; incident create avvaledu ani verify chey.'],
      answer: 'Alert "Short description kavali" vastundi, record create avvadu.',
      cleanup: 'Em marchaledu (page cleanup last lo).',
    }),
    jx('cs-uipages2', 3, 'Success message', 'medium', {
      scenario: 'Processing script lo insert tarvata gs.addInfoMessage("Created " + number) pettu.',
      hint: 'insert tarvata gr.getValue("number") vaadu.',
      steps: ['Processing script lo insert() tarvata gs.addInfoMessage("Created " + gr.getValue("number")); add chey.', 'Page malli try chey (record create avtundi — cleanup marchipoku).'],
      answer: 'Next page lo "Created INC00xxxxx" info message.',
      cleanup: 'Create ayina incidents + UI Page delete chey.',
    }),
  ],
}

/* 26 — UI Macros */
const uimacros = {
  id: 'cs-uimacros',
  mode: 'pdi',
  title: 'UI Macros',
  video: 'UI Macros',
  duration: '',
  no: 26,
  blurb: 'Reusable Jelly snippets — oka macro create chesi UI Page lo vaadadam.',
  learn: [
    {
      h: '🧱 UI Macro ante?',
      body: [
        'UI Macro = reusable Jelly snippet (System UI → UI Macros). Oka sari rasi, UI Pages lo (leda forms lo) tag laaga pilavochu. Udaharana: custom badge, formatted block, repeated header.',
        'Paina code ni UI Macro lo XML field ki paste chey (motham — <?xml ...> nundi </j:jelly> varaku). Macro name "snowkeer_badge" ayithe UI Page lo <g:snowkeer_badge /> ani vaadatam (namespace g: tho, macro peru tag peru). Parameters attributes ga pampochu, macro lo ${jvar_...} / ${...} tho chaduvutam.',
        '⚠️ Parameter passing syntax memory nunchi — nee PDI lo out-of-box UI Macro chusi confirm chesuko.',
      ],
      code: `<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide">
  <span style="background:#2a7; color:#fff; padding:2px 8px; border-radius:8px;">SnowKeer</span>
</j:jelly>`,
    },
    {
      h: '🆚 UI Page vs UI Macro',
      body: ['UI Page = poorti page (URL undi). UI Macro = page lo oka chinna piece (URL ledu), reuse kosam. Macros ni UI Pages, UI Formatters, form elements lo vaadochu.'],
    },
  ],
  quiz: [
    q('UI Macro ante?', ['Reusable Jelly snippet', 'Full page with URL', 'Business Rule', 'Script Include'], 0, 'Reusable snippet.'),
    q('"snowkeer_badge" macro UI Page lo ela pilustam?', ['<g:snowkeer_badge />', '<snowkeer_badge>', 'gs.macro()', 'include()'], 0, 'g: namespace tho.'),
    q('UI Macro ki URL untundaa?', ['Ledu — page lo piece', 'Avunu, .do URL untundi', 'Avunu, .html URL untundi', 'Optional ga URL pettochu'], 0, 'Macros ki direct URL ledu.'),
    q('Reuse enduku?', ['Same snippet multiple places', 'Server speed penchadaniki', 'Security penchadaniki', 'Theme marchadaniki'], 0, 'UI Macro tho same snippet ni multiple pages lo reuse chestam — okachota marchithe anni chotla marutundi.'),
    q('UI Macro ekkada create?', ['System UI → UI Macros', 'System Definition → Tables', 'Flow Designer', 'Update Sets'], 0, 'System UI → UI Macros.'),
  ],
  exercises: [
    jx('cs-uimacros', 1, 'Badge macro create', 'easy', {
      scenario: 'UI Macro "snowkeer_badge" create chesi chinna span badge render chey.',
      hint: 'All → System UI → UI Macros → New. XML field lo card lo code.',
      steps: ['UI Macros → New: Name snowkeer_badge.', 'XML field lo card lo unna Jelly code paste chey.', 'Submit.'],
      answer: 'UI Macro record create avtundi (page lo vaadaka kanipinchadu).',
      cleanup: 'UI Macro snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 2, 'UI Page lo macro vaadu', 'medium', {
      scenario: 'UI Page "snowkeer_macro_test" lo <g:snowkeer_badge /> pilichi badge chudu.',
      hint: 'Prerequisite: ex 1 macro undali.',
      steps: ['UI Page new: snowkeer_macro_test (Prerequisite: macro ex 1).', 'Jelly skeleton lo <g:snowkeer_badge /> pettu.', 'Try It tho open chey.'],
      answer: 'Page lo green "SnowKeer" badge kanipistundi.',
      cleanup: 'UI Page snowkeer_macro_test mariyu macro snowkeer_badge delete chey.',
    }),
    jx('cs-uimacros', 3, 'Macro 2 sarlu', 'easy', {
      scenario: 'Same page lo macro ni 2 sarlu pilichi reuse ela untundo chudu.',
      hint: '<g:snowkeer_badge /> rendu sarlu rayi.',
      steps: ['Page edit: <g:snowkeer_badge /> <g:snowkeer_badge /> rendu sarlu.', 'Reload.'],
      answer: 'Rendu badges kanipistayi — oka macro, multiple places.',
      cleanup: 'Page + macro delete chey.',
    }),
  ],
}

export const CS_LESSONS_E = [snutils, crud1, crud2, debug, macros, best, uipages, uipages2, uimacros]
