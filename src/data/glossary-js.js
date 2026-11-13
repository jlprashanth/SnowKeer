// Stage 2 glossary — every ServiceNow abbreviation, GlideRecord/GlideElement/gs method and JS word used in the JavaScript part.
// Each term is written ONCE here. Learn cards reference terms by key: learn card { terms: ['gs', 'GlideRecord'] } shows them in a sub-box.
// Fields: g = group, m = meaning (Tenglish), ex = ServiceNow example, check = true means "PDI lo confirm chey" (uncertain).
import { GLOSSARY_CS, GLOSSARY_GROUPS_CS } from './glossary-cs.js'

export const GLOSSARY_GROUPS = {
  sn: 'ServiceNow abbreviations & objects',
  gsm: 'gs methods (GlideSystem)',
  grm: 'GlideRecord methods (table / record)',
  gem: 'GlideElement methods (field)',
  js: 'JavaScript words',
  jsm: 'JavaScript methods',
  ...GLOSSARY_GROUPS_CS, // Stage 3 groups (their entries carry s: 3)
}

const GLOSSARY_STAGE2 = {
  // ---------- ServiceNow abbreviations & objects ----------
  gs: { g: 'sn', m: 'GlideSystem ki short form. ServiceNow ready ga ichche utility object — new tho create cheyyakkarledu, direct ga vaadochu (gs.info, gs.getUserName).', ex: 'gs.info("Hello");' },
  GlideSystem: { g: 'sn', m: 'gs ki full peru. Logs, user info, utility functions ikkada untayi.', ex: 'gs.info(...) = GlideSystem.info(...)' },
  GlideRecord: { g: 'sn', m: 'Table (sheet) ni open chese ServiceNow tool. Table peru ivvali (incident, problem, sys_user). Record load / query / update anni ee tool tho.', ex: "var gr = new GlideRecord('incident');" },
  gr: { g: 'sn', m: 'GlideRecord object ki nuvve pettukune variable peru. Convention: gr. Inka incGR, inc ani kuda pettochu.', ex: "var gr = new GlideRecord('incident');  // gr = nee cursor" },
  current: { g: 'sn', m: 'Business Rule / UI lo form lo unna record. Already load ayi untundi — new GlideRecord avasaram ledu. Same methods (getValue, setValue, update) work avtayi.', ex: "current.getValue('number');" },
  GlideElement: { g: 'sn', m: 'Field value ki wrapper object. current.priority lanti field GlideElement avtundi — daani meeda changes(), nil(), getDisplayValue() lanti special methods untayi.', ex: 'current.priority.changes();' },
  'Class.create': { g: 'sn', m: 'Script Include lo class define cheyyadaniki ServiceNow pattern. Methods prototype lo pettali.', ex: "var Util = Class.create(); Util.prototype = { initialize: function() {} };" },
  new: { g: 'js', m: 'JavaScript word: kotha object create cheyyadaniki. new GlideRecord(...) ante "GlideRecord tool tho kotha cursor tayaru chey".', ex: "var gr = new GlideRecord('incident');" },

  // ---------- gs methods ----------
  'gs.info': { g: 'gsm', m: 'Script Log lo info message print chestundi. System Logs → System Log → Script Log Statements lo kanipistundi. {0} placeholder support untundi.', ex: "gs.info('Hello ' + name);" },
  'gs.warn': { g: 'gsm', m: 'Warning level log. Info kante serious kani error kaadu.', ex: "gs.warn('Priority empty: ' + number);" },
  'gs.error': { g: 'gsm', m: 'Error level log. Em tappu jarigindo teliyadaniki.', ex: "gs.error('Update failed for ' + number);" },
  'gs.debug': { g: 'gsm', m: 'Debug level log — development lo details chudataniki. Debug logging on unte matrame Script Log lo kanipistundi.', ex: "gs.debug('Loop index: ' + i);" },
  'gs.getUserName': { g: 'gsm', m: 'Ippudu login ayina user yokka username (user_name) istundi.', ex: "gs.info(gs.getUserName());" },
  'gs.nil': { g: 'gsm', m: 'Value null / undefined / empty string aa ani check chestundi. Field empty ah ani chudataniki correct helper.', ex: "if (gs.nil(gr.assigned_to)) { gs.info('Unassigned'); }" },
  'gs.sleep': { g: 'gsm', m: 'Script ni kontha time (milliseconds) aapadaniki. Production lo vaadakudadu.', ex: 'gs.sleep(1000);' },

  // ---------- GlideRecord methods ----------
  get: { g: 'grm', m: 'Okka record load chestundi. get(field, value) — field value match ayina first record. Match ledu ante record load kaadu.', ex: "gr.get('number', 'INC0010004');" },
  query: { g: 'grm', m: 'Table lo matching records teeskovadaniki run chese query. Tarvata next() tho loop cheyyali. query() mundu addQuery pettali.', ex: "gr.addQuery('active', true);\ngr.query();" },
  next: { g: 'grm', m: 'Next record ki move chestundi. Record unte true, ledu ante false istundi — while loop lo vaadatam.', ex: 'while (gr.next()) { gs.info(gr.getValue("number")); }' },
  hasNext: { g: 'grm', m: 'Inka record unda ledha ani check chestundi (true/false). Record ni move cheyyadu.', ex: 'if (gr.hasNext()) { gs.info("Inka records unnai"); }' },
  addQuery: { g: 'grm', m: 'Filter condition add chestundi. addQuery(field, value) — equals. addQuery(field, operator, value) — 3-argument form (IN, LIKE, >...).', ex: "gr.addQuery('priority', 1);\ngr.addQuery('number', 'IN', 'INC1,INC2');" },
  addActiveQuery: { g: 'grm', m: 'Active=true filter add chestundi. Inactive records ni skip chestundi.', ex: 'gr.addActiveQuery();' },
  addNullQuery: { g: 'grm', m: 'Field empty (null) ayina records ni filter chestundi. Assigned_to lekapoina records lanti use.', ex: "gr.addNullQuery('assigned_to');" },
  addNotNullQuery: { g: 'grm', m: 'Field empty kaakunda unna records ni filter chestundi.', ex: "gr.addNotNullQuery('assignment_group');" },
  addOrCondition: { g: 'grm', m: 'addQuery() return chese condition object meeda OR condition add chestundi (gr meeda direct ga undadu). Rendu conditions lo okati true ayina chaalu.', ex: "var c1 = gr.addQuery('priority', 1);\nvar c2 = gr.addQuery('priority', 2);\nc1.addOrCondition(c2);" },
  addEncodedQuery: { g: 'grm', m: 'Encoded query string direct ga pettochu (^ tho conditions separate). Advanced filters kosam.', ex: "gr.addEncodedQuery('active=true^priority=1');" },
  orderBy: { g: 'grm', m: 'Records ni field ni batti ascending (chinna nundi pedda) order lo teeskuntundi.', ex: "gr.orderBy('number');" },
  orderByDesc: { g: 'grm', m: 'Records ni field ni batti descending (pedda nundi chinna) order lo teeskuntundi.', ex: "gr.orderByDesc('opened_at');" },
  setLimit: { g: 'grm', m: 'Maximum N records matrame teeskuntundi (N = number).', ex: 'gr.setLimit(10);' },
  getRowCount: { g: 'grm', m: 'query() tarvata entha records match ayyayo count istundi (number).', ex: 'gs.info(gr.getRowCount());' },
  insert: { g: 'grm', m: 'Kotha record create chesi DB lo save chestundi. Insert ayina record sys_id return chestundi.', ex: "var gr = new GlideRecord('incident');\ngr.short_description = 'VPN down';\ngr.insert();" },
  update: { g: 'grm', m: 'Record lo chesina marpulanu DB lo save chestundi. Idi lekapothe marpu save avvadu.', ex: "gr.setValue('priority', 1);\ngr.update();" },
  deleteRecord: { g: 'grm', m: 'Record ni DB nunchi delete chestundi. Jagrattaga vaadali — undo ledu.', ex: 'gr.deleteRecord();' },
  setValue: { g: 'grm', m: 'Field value marchadam (memory lo matrame). DB lo save avvali ante update() kavali.', ex: "gr.setValue('priority', 1);" },
  getValue: { g: 'grm', m: 'Field value STRING ga teeskuntundi. "1" + 1 = "11" — numbers ki Number(...) vaadali.', ex: "var p = gr.getValue('priority');  // '1'" },
  getDisplayValue: { g: 'grm', m: 'Field ki display name istundi (reference field ayithe user name, choice ayithe label). Value kaadu.', ex: "gr.getDisplayValue('assigned_to');  // 'Abel Tuter'" },
  getUniqueValue: { g: 'grm', m: 'Record yokka sys_id (unique id) istundi.', ex: 'var id = gr.getUniqueValue();' },
  getTableName: { g: 'grm', m: 'Ee record yokka table peru istundi (incident, problem...).', ex: 'gs.info(gr.getTableName());' },
  setAbortAction: { g: 'grm', m: 'Business Rule lo save ni cancel chestundi (abort). Validation fail ayinappudu vaadutaru.', ex: "if (!current.short_description) { current.setAbortAction(true); }" },
  setWorkflow: { g: 'grm', m: 'False ayithe workflow / notifications run avvavu. Bulk updates lo vaadatharu.', ex: 'gr.setWorkflow(false);' },
  isValidRecord: { g: 'grm', m: 'Record valid ga load ayindha ani check chestundi (true/false). get() tarvata vaadali.', ex: "if (gr.isValidRecord()) { ... }" },
  isValidField: { g: 'grm', m: 'Table lo ee field undha ani check chestundi.', ex: "gr.isValidField('priority');" },

  // ---------- GlideElement methods ----------
  changes: { g: 'gem', m: 'Field ee request lo marindha (true/false) ani istundi. Business Rule lo "priority marchara?" ani check cheyyadaniki.', ex: 'if (current.priority.changes()) { gs.info("marindi"); }' },
  nil: { g: 'gem', m: 'Field empty (null / undefined / "") ayina ani check chestundi. GlideElement method — current.assigned_to.nil().', ex: 'if (current.assigned_to.nil()) { ... }' },

  // ---------- JavaScript words ----------
  var: { g: 'js', m: 'Variable declare cheyyadaniki classic word. ServiceNow scripts lo ippatiki ekkuva vaadutaru.', ex: "var number = 'INC0010002';" },
  let: { g: 'js', m: 'Variable declare — marchagalige value. Nee instance lo default ga error istundi ("let is an ECMAScript 6 feature - not supported") — ES12 mode on cheste matrame vaadali.', ex: 'let count = 0;  // ES12 mode lo matrame' },
  const: { g: 'js', m: 'Variable declare — marchaleni value. Nee PDI lo default ga work avtundi (check chesam).', ex: "const table = 'incident';" },
  function: { g: 'js', m: 'Code ni group chesi peru pettadaniki. Script Include lo methods ila untayi.', ex: 'function greet(name) { gs.info("Hi " + name); }' },
  return: { g: 'js', m: 'Function nunchi value tirigi istundi. Idi tarvata code run avvadu.', ex: 'return current.getValue("number");' },
  typeof: { g: 'js', m: 'Value type chusta — "string", "number", "object"... null ki kuda "object" vastundi (JS quirk).', ex: "gs.info(typeof gr.getValue('priority'));  // string" },
  '===': { g: 'js', m: 'Strict equal — value and type rendu same ayina true. null check ki vaadali.', ex: "if (gr.getValue('priority') === '1') { ... }" },
  null: { g: 'js', m: 'Value ledu ani explicit ga cheppadam. assignedTo = null = evaru assign cheyyaledu.', ex: 'var assignedTo = null;' },
  undefined: { g: 'js', m: 'Variable ki value ivvaledu. Function lo return cheyyakapothe kuda undefined.', ex: 'var notSet;  // undefined' },
  NaN: { g: 'js', m: 'Not a Number — number ga convert kaledu. Number("abc") = NaN.', ex: 'Number("abc");  // NaN' },
  'Number()': { g: 'js', m: 'String ni number ga marustundi. getValue("priority") ni calculation ki vaadali ante idi kavali.', ex: "Number(gr.getValue('priority')) + 1;" },
  'parseInt': { g: 'js', m: 'String lo unna number ni integer ga marustundi (10 = base). Priority / counts ki vaadochu.', ex: "parseInt('12', 10);  // 12" },
  'String()': { g: 'js', m: 'Value ni string ga marustundi.', ex: 'String(5);  // "5"' },
  'try / catch': { g: 'js', m: 'Error vastunte script crash avvakunda handle cheyyadaniki. Integrations / REST calls lo vaadatharu.', ex: "try { ... } catch (e) { gs.error(e.message); }" },
  throw: { g: 'js', m: 'Medium nunchi error ni manual ga raise chestundi.', ex: "throw 'Priority missing';" },
  this: { g: 'js', m: 'Current object ni refer chestundi. Script Include lo prototype methods lo vaadatharu.', ex: 'this._table = "incident";' },
  class: { g: 'js', m: 'Nee PDI lo "class" reserved word — keyword ga vaadaleru ("identifier class is a reserved word"). Class define cheyyadaniki ServiceNow lo Class.create vaadali.', ex: "var Util = Class.create();" },
  'JSON': { g: 'js', m: 'Object ni text ga / text nunchi object ga marchadaniki built-in tool. REST / GlideAjax lo vaadatharu.', ex: "JSON.stringify({ number: 'INC1' });" },
  'JSON.stringify()': { g: 'jsm', m: 'Object ni JSON text ga marustundi (object → string). Response ni text ga pampadaniki.', ex: "JSON.stringify({ number: 'INC1' });  // '{\"number\":\"INC1\"}'" },
  'JSON.parse()': { g: 'jsm', m: 'JSON text ni object ga marustundi (string → object). Text nunchi fields teeskovadaniki.', ex: "var o = JSON.parse('{\"number\":\"INC1\"}');  // o.number = 'INC1'" },

  // ---------- JavaScript methods ----------
  'trim()': { g: 'jsm', m: 'String mundu / venaka unna spaces teesestundi. User input clean cheyyadaniki.', ex: "var s = '  INC1  '.trim();  // 'INC1'" },
  'toLowerCase()': { g: 'jsm', m: 'Text ni chinna letters lo marustundi. Email / username compare cheyyadaniki.', ex: "email.toLowerCase();" },
  'toUpperCase()': { g: 'jsm', m: 'Text ni pedda letters lo marustundi.', ex: "'vpn'.toUpperCase();  // 'VPN'" },
  'split()': { g: 'jsm', m: 'Text ni separator tho mukkalu chestundi. Array istundi.', ex: "'a@b.com'.split('@');  // ['a', 'b.com']" },
  'join()': { g: 'jsm', m: 'Array elements ni separator tho kalipi text chestundi. Groups list display cheyyadaniki.', ex: "['vpn', 'network'].join(', ');" },
  'includes()': { g: 'jsm', m: 'Text / array lo value undha ani check (true/false).', ex: "desc.includes('VPN');" },
  'indexOf()': { g: 'jsm', m: 'Value position istundi (leka -1 ante ledu). Array / text lo.', ex: "groups.indexOf('Network');" },
  'startsWith()': { g: 'jsm', m: 'Text ee prefix tho start avuthunda ani check. Incident number "INC" tho start ayina ani.', ex: "number.startsWith('INC');" },
  'replace()': { g: 'jsm', m: 'Text lo first match ni marustundi.', ex: "short.replace('  ', ' ');" },
  'slice()': { g: 'jsm', m: 'Array / text lo part teeskuntundi (start, end). Original marchadu.', ex: "numbers.slice(0, 3);" },
  'padStart()': { g: 'jsm', m: 'Text ni left side nunchi fixed length ki pad chestundi. INC number lo zeros pettadaniki.', ex: "String(42).padStart(7, '0');  // '0000042'" },
  length: { g: 'jsm', m: 'Array / text lo items / characters count. Property, function kaadu (ila () pettakudadu).', ex: "groups.length;" },
  'push()': { g: 'jsm', m: 'Array chivarlo kotha item add chestundi.', ex: "groups.push('Network');" },
  'pop()': { g: 'jsm', m: 'Array chivari item teesi istundi (array nundi remove avtundi).', ex: 'var last = list.pop();' },
  'sort()': { g: 'jsm', m: 'Array ni order lo pettadam. Records order ki gr.orderBy vaadali (database side).', ex: 'nums.sort(function(a, b) { return a - b; });' },
  'reverse()': { g: 'jsm', m: 'Array order ni reverse chestundi.', ex: "list.reverse();" },
  'forEach()': { g: 'jsm', m: 'Array lo prathi item meeda function run chestundi. Loop cheyyadaniki simple way.', ex: "groups.forEach(function(g) { gs.info(g); });" },
  'map()': { g: 'jsm', m: 'Prathi item ni marchi kotha array istundi (original marchadu).', ex: "nums.map(function(n) { return n * 2; });" },
  'filter()': { g: 'jsm', m: 'Condition true ayina items matrame unna kotha array istundi.', ex: "nums.filter(function(n) { return n > 2; });" },
  'every()': { g: 'jsm', m: 'Anni items condition ki match ayyayo ledo check (true/false).', ex: "nums.every(function(n) { return n > 0; });" },
  'Object.keys()': { g: 'jsm', m: 'Object lo unna property names (keys) array ga istundi.', ex: 'Object.keys(caller);  // ["name", "vip"]' },
  'hasOwnProperty()': { g: 'jsm', m: 'Object lo ee key undha ani check (true/false).', ex: "caller.hasOwnProperty('vip');" },
  'Array.isArray()': { g: 'jsm', m: 'Value array aa ani check chestundi. "object" ante array kaadu (typeof lo array kuda object).', ex: 'Array.isArray(tags);  // true' },
  'Math.floor()': { g: 'jsm', m: 'Number ni kinda vaipu round chestundi (3.9 → 3). Averages / pages lo vaadatharu.', ex: 'Math.floor(7 / 2);  // 3' },
  'Math.round()': { g: 'jsm', m: 'Number ni daggaraga integer ki round chestundi.', ex: 'Math.round(2.6);  // 3' },
  'Math.min() / max()': { g: 'jsm', m: 'Numbers lo chinnadi / peddadi istundi. Priority min/max kosam.', ex: 'Math.min(3, 1, 2);  // 1' },
}

// Stage 2 entries + Stage 3 entries (Stage 3 ones carry s: 3 so the Stage 2 hub glossary can leave them out)
export const GLOSSARY_JS = { ...GLOSSARY_STAGE2, ...GLOSSARY_CS }

// Find glossary entries for a list of keys (keeps only the keys that exist, so a typo never crashes a page)
export function termsFor(keys = []) {
  return keys.filter((k) => GLOSSARY_JS[k]).map((k) => ({ term: k, ...GLOSSARY_JS[k] }))
}
