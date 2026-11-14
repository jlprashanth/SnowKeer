// Mock API sanity — run: node dev-tools/check-mock.mjs
// Covers things lessons rely on, and the behaviours checked in her Brazil PDI on 2026-11-14 (getValue types, initialize vs
// newRecord, element-in-array, addOrCondition, ^OR / ^NQ, misspelt fields, async client callbacks, mandatory-wins ...).
import { runScript } from '../src/js/runScript.js'
import { brazilSyntaxWarnings } from '../src/js/esCheck.js'

let bad = 0
const eq = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', label, 'got', JSON.stringify(got), 'want', JSON.stringify(want)) } }
const run = (code, scenario) => { const r = runScript({ code, scenario }); if (r.error) console.log('   error:', r.error); return r }
const logsOf = (code, scenario) => run(code, scenario).logs.filter((l) => l.level !== 'sys').map((l) => l.msg)
const sysOf = (code, scenario) => run(code, scenario).logs.filter((l) => l.level === 'sys').length

// dot-walking
eq('dot-walk email', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010002'); gs.info(gr.caller_id.email); gs.info(gr.caller_id.name); gs.info(gr.assignment_group.name);"), ['bud.richman@example.com', 'Bud Richman', 'Network'])
eq('dot-walk empty ref', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010006'); gs.info('[' + gr.assigned_to.name + ']'); gs.info(gr.assigned_to.nil());"), ['[]', 'true'])
eq('dot-walk concat', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010001'); gs.info('Caller: ' + gr.caller_id.name);"), ['Caller: Abel Tuter'])
eq('element still works', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010001'); gs.info(gr.priority == 3); gs.info(gr.priority.getDisplayValue()); gs.info(gr.assigned_to.getDisplayValue());"), ['true', '3 - Moderate', 'System Administrator'])
eq('dot-walk in a query', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('assignment_group.name', 'Network'); gr.query(); gs.info(gr.getRowCount());"), ['2'])

// changes()
const cur = { current: { table: 'incident', values: { number: 'INC1', priority: '3', state: '2' } } }
eq('changes false at start', logsOf('gs.info(current.priority.changes());', cur), ['false'])
eq('changes true after set', logsOf("current.setValue('priority', 1); gs.info(current.priority.changes()); gs.info(current.state.changes());", cur), ['true', 'false'])
eq('changesTo / changesFrom', logsOf("current.priority = 1; gs.info(current.priority.changesTo(1)); gs.info(current.priority.changesTo(2)); gs.info(current.priority.changesFrom(3)); gs.info(current.priority.changesFrom(2));", cur), ['true', 'false', 'true', 'false'])
eq('previous scenario', logsOf('gs.info(current.state.changes()); gs.info(previous.state.getValue());', { current: { table: 'incident', values: { state: '6' } }, previous: { table: 'incident', values: { state: '2' } } }), ['true', '2'])
eq('record changes()', logsOf("gs.info(current.changes()); current.short_description = 'x'; gs.info(current.changes());", cur), ['false', 'true'])

// gs
eq('gs.getUser', logsOf('gs.info(gs.getUser().getID()); gs.info(gs.getUser().hasRole("itil"));'), ['u_admin', 'true'])
eq('PDI: admin passes any hasRole', logsOf("gs.info(gs.hasRole('no_such_role'));"), ['true'])
eq('PDI: gs.info(null / undefined / {0})', logsOf("gs.info(null); gs.info(undefined); gs.info('a {0} b {1}', 'X', 7);"), ['null', 'undefined', 'a X b 7'])

// getValue types (PDI)
eq('PDI: getValue boolean is 1/0', logsOf("var gr = new GlideRecord('incident'); gr.get('inc1'); gs.info(gr.getValue('active')); gr.get('inc5'); gs.info(gr.getValue('active'));"), ['1', '0'])
eq('PDI: getValue empty / unknown is null', logsOf("var gr = new GlideRecord('incident'); gr.get('inc2'); gs.info(gr.getValue('assigned_to') === null); gs.info(gr.getValue('no_such_field') === null);"), ['true', 'true'])
eq('PDI: boolean comparisons', logsOf("var gr = new GlideRecord('incident'); gr.get('inc1'); gs.info(gr.active == true); gs.info(gr.active == 'true'); gs.info(gr.active.toString()); gs.info(gr.getValue('active') === '1');"), ['true', 'false', 'true', 'true'])
eq('PDI: initialize = empty, not new', logsOf("var gr = new GlideRecord('incident'); gr.initialize(); gs.info(gr.getValue('state')); gs.info(gr.getValue('number')); gs.info(gr.isNewRecord());"), ['null', 'null', 'false'])
eq('PDI: newRecord = defaults + number', logsOf("var gr = new GlideRecord('incident'); gr.newRecord(); gs.info(gr.getValue('state')); gs.info(gr.getValue('priority')); gs.info(gr.getValue('number')); gs.info(gr.isNewRecord());"), ['1', '4', 'INC0010009', 'true'])
eq('initialize + insert gets defaults', logsOf("var gr = new GlideRecord('incident'); gr.initialize(); gr.short_description = 'x'; gr.insert(); gs.info(gr.getValue('state') + ' ' + gr.getValue('priority') + ' ' + gr.getValue('number'));"), ['1 4 INC0010009'])
eq('PDI: element pushed into array = last record', logsOf("var a = []; var gr = new GlideRecord('incident'); gr.addQuery('priority', 1); gr.query(); while (gr.next()) { a.push(gr.number); } gs.info(a.join(','));"), ['INC0010008,INC0010008'])
eq('getValue pushed = right values', logsOf("var a = []; var gr = new GlideRecord('incident'); gr.addQuery('priority', 1); gr.query(); while (gr.next()) { a.push(gr.getValue('number')); } gs.info(a.join(','));"), ['INC0010002,INC0010008'])
eq('PDI: get() with one number', logsOf("var gr = new GlideRecord('incident'); gs.info(gr.get('INC0010004')); gs.info(gr.getValue('sys_id'));"), ['true', 'inc4'])

// queries (PDI)
eq('PDI: addOrCondition joins its own condition', logsOf("var gr = new GlideRecord('incident'); var qc = gr.addQuery('category', 'network'); gr.addQuery('active', true); qc.addOrCondition('category', 'database'); gr.query(); gs.info(gr.getRowCount()); gs.info(gr.getEncodedQuery());"), ['4', 'category=network^ORcategory=database^active=true'])
eq('PDI: A^B^ORC = A AND (B OR C)', logsOf("var gr = new GlideRecord('incident'); gr.addEncodedQuery('priority=1^state=2^ORcategory=network'); gr.query(); gs.info(gr.getRowCount());"), ['2'])
eq('PDI: ^NQ = OR between queries', logsOf("var gr = new GlideRecord('incident'); gr.addEncodedQuery('priority=1^NQcategory=hardware'); gr.query(); gs.info(gr.getRowCount());"), ['3'])
eq('PDI: misspelt field = ALL rows', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('categry', 'network'); gr.query(); gs.info(gr.getRowCount());"), ['8'])
eq('misspelt field shows a hint', sysOf("var gr = new GlideRecord('incident'); gr.addQuery('categry', 'network'); gr.query();"), 1)
eq('updateMultiple', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('priority', 1); gr.setValue('state', 3); gr.updateMultiple(); var c = new GlideRecord('incident'); c.addQuery('state', 3); c.query(); gs.info(c.getRowCount());"), ['3'])
eq('deleteMultiple', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('category', 'network'); gr.deleteMultiple(); var c = new GlideRecord('incident'); c.query(); gs.info(c.getRowCount());"), ['6'])
eq('delete inside the loop keeps going', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('category', 'software'); gr.query(); var n = 0; while (gr.next()) { gr.deleteRecord(); n++; } gs.info(n);"), ['2'])
eq('GlideAggregate count', logsOf("var ga = new GlideAggregate('incident'); ga.addQuery('active', true); ga.addAggregate('COUNT'); ga.groupBy('category'); ga.query(); var r = []; while (ga.next()) r.push(ga.getValue('category') + '=' + ga.getAggregate('COUNT')); gs.info(r.join(','));"), ['software=2,network=2,hardware=1,database=2'])
eq('current IS the stored record', logsOf("current.setValue('state', 2); current.update(); var g = new GlideRecord('incident'); g.get('inc1'); gs.info(g.getValue('state')); var c = new GlideRecord('incident'); c.query(); gs.info(c.getRowCount());", { current: { table: 'incident', values: { number: 'INC0010001', state: '1' } } }), ['2', '8'])
eq('seed rows', logsOf("var gr = new GlideRecord('incident'); gr.addQuery('category', 'network'); gr.query(); gs.info(gr.getRowCount());", { seed: { incident: [{ short_description: 'x', category: 'network' }] } }), ['3'])
eq('getParameter gives a String object', logsOf("var P = Class.create(); P.prototype = Object.extendsObject(AbstractAjaxProcessor, { t: function () { var v = this.getParameter('sysparm_x'); gs.info(typeof v); gs.info(v === 'a'); gs.info(String(v) === 'a'); } }); callAjax(P, 't', { sysparm_x: 'a' });"), ['object', 'false', 'true'])

eq('PDI: own empty initialize() breaks getParameter', !!run("var P = Class.create(); P.prototype = Object.extendsObject(AbstractAjaxProcessor, { initialize: function () {}, t: function () { return this.getParameter('sysparm_x'); } }); callAjax(P, 't', { sysparm_x: 'a' });").error, true)

// client (setVisible vs setDisplay)
const clientRun = (code, trigger = { type: 'onLoad' }, scenario = {}) => runScript({ code, scenario, client: { trigger }, tests: [{ label: 'x', expr: '1', expect: 1 }] })
const client = (code) => clientRun(code).form.fields.filter((f) => ['assigned_to', 'assignment_group'].includes(f.name)).map((f) => [f.visible, f.space])
eq('setVisible keeps space / setDisplay removes it', client("function onLoad() { g_form.setVisible('assigned_to', false); g_form.setDisplay('assignment_group', false); }"), [[false, false], [false, true]])
eq('show again clears space', client("function onLoad() { g_form.setVisible('assigned_to', false); g_form.setVisible('assigned_to', true); }"), [[true, false], [true, false]])

// client: PDI behaviours
const ajax = { name: 'UserAjax', code: "var UserAjax = Class.create(); UserAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, { getEmail: function () { var u = new GlideRecord('sys_user'); return u.get(this.getParameter('sysparm_user_id')) ? u.getValue('email') : ''; } });" }
const ajaxLogs = clientRun("function onLoad() { var ga = new GlideAjax('UserAjax'); ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', 'u_bud'); ga.getXMLAnswer(function (a) { jslog('answer ' + a); }); jslog('after call'); }", undefined, { scriptInclude: ajax })
eq('PDI: GlideAjax answer arrives AFTER the script', ajaxLogs.logs.filter((l) => l.level === 'info').map((l) => l.msg), ['after call', 'answer bud.richman@example.com'])
eq('GlideAjax calls are recorded', clientRun("function onLoad() { var ga = new GlideAjax('UserAjax'); ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', 'u_bud'); ga.getXMLAnswer(function () {}); }", undefined, { scriptInclude: ajax }).form && runScript({ code: "function onLoad() { var ga = new GlideAjax('UserAjax'); ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', 'u_bud'); ga.getXMLAnswer(function () {}); }", scenario: { scriptInclude: ajax }, client: { trigger: { type: 'onLoad' } }, tests: [{ label: 'c', expr: '__x.ajaxCalls', expect: [{ name: 'UserAjax', params: { sysparm_name: 'getEmail', sysparm_user_id: 'u_bud' } }] }] }).passed, true)
const sub = clientRun("function onSubmit() { var ok = true; var ga = new GlideAjax('UserAjax'); ga.addParam('sysparm_name', 'getEmail'); ga.addParam('sysparm_user_id', 'nobody'); ga.getXMLAnswer(function (a) { if (!a) ok = false; }); return ok; }", { type: 'onSubmit' }, { scriptInclude: ajax })
eq('PDI: onSubmit cannot wait for GlideAjax', sub.submit, true)
eq('PDI: getReference callback is async', clientRun("function onLoad() { var name = ''; g_form.getReference('caller_id', function (c) { name = c.name; jslog('cb ' + name); }); jslog('after [' + name + ']'); }", undefined, { form: { values: { caller_id: 'u_bud' } } }).logs.map((l) => l.msg), ['after []', 'cb Bud Richman'])
eq('PDI: mandatory + empty cannot be read-only / hidden', clientRun("function onLoad() { g_form.setMandatory('short_description', true); g_form.setReadOnly('short_description', true); g_form.setDisplay('short_description', false); }").form.fields.filter((f) => f.name === 'short_description').map((f) => [f.readOnly, f.visible]), [[false, true]])
const unk = clientRun("function onLoad() { g_form.setValue('no_such_field', 'x'); jslog('still running'); }")
eq('PDI: unknown field is ignored (no error)', [unk.error, unk.logs.filter((l) => l.level === 'info').map((l) => l.msg), unk.logs.filter((l) => l.level === 'sys').length], [null, ['still running'], 1])
const refire = runScript({ code: "function onChange(control, oldValue, newValue, isLoading) { jslog(oldValue + '>' + newValue); if (newValue == '1') g_form.setValue('priority', oldValue); }", scenario: { form: { values: { priority: '1' } } }, client: { trigger: { type: 'onChange', field: 'priority', oldValue: '3', newValue: '1' } }, tests: [{ label: 'x', expr: '1', expect: 1 }] })
eq('PDI: setValue on its own field fires onChange again', refire.logs.map((l) => l.msg), ['3>1', '3>3'])
eq('isLoading is passed through', runScript({ code: "function onChange(c, o, n, isLoading) { jslog('loading ' + isLoading); }", client: { trigger: { type: 'onChange', field: 'state', oldValue: '', newValue: '2', isLoading: true } }, tests: [{ label: 'x', expr: '1', expect: 1 }] }).logs.map((l) => l.msg), ['loading true'])
eq('g_user.fullName + flash(table.field)', clientRun("function onLoad() { jslog(g_user.fullName); g_form.flash('incident.priority', '#FFFACD', 0); }").logs.map((l) => l.msg), ['Abel Tuter'])
eq('PDI: addOption with an existing value adds no duplicate', clientRun("function onLoad() { g_form.addOption('urgency', '1', '1 - High'); }").form.fields.find((f) => f.name === 'urgency').choices.map((c) => c.value), ['1', '2', '3'])
eq('PDI: getReference on an empty field calls back with undefined fields', clientRun("function onLoad() { g_form.getReference('assigned_to', function (c) { jslog('cb ' + c.sys_id + ' ' + c.name); }); }").logs.map((l) => l.msg), ['cb undefined undefined'])
eq('initialValues = form at load', clientRun("function onLoad() { g_form.setValue('urgency', '1'); }", undefined, { form: { values: { urgency: '3' } } }).initialValues.urgency, '3')

// Brazil syntax warnings
eq('esCheck flags let / allows const + arrows', [brazilSyntaxWarnings('let a = 1').length, brazilSyntaxWarnings('const a = [1].map((n) => n * 2); var t = `x${a}`').length], [1, 0])

console.log(bad ? `${bad} problems` : 'mock checks OK')
process.exit(bad ? 1 : 0)
