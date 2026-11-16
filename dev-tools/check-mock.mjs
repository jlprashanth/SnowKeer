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

// ---------- Stage 4: GlideDateTime / GlideDuration / GlideSchedule (sandbox clock 2026-11-12 10:00:00 UTC, user TZ IST) ----------
eq('GDT now / display IST', logsOf("var gdt = new GlideDateTime(); gs.info(gdt.getValue()); gs.info(gdt.getDisplayValue()); gs.info(gdt.getDayOfWeekUTC());"), ['2026-11-12 10:00:00', '2026-11-12 15:30:00', '4'])
eq('GDT add / compare', logsOf("var a = new GlideDateTime('2026-11-01 08:00:00'); a.addDaysUTC(3); a.addSeconds(3600); gs.info(a.getValue()); var b = new GlideDateTime(); gs.info(a.before(b)); gs.info(a.compareTo(b)); gs.info(b.compareTo(a));"), ['2026-11-04 09:00:00', 'true', '-1', '1'])
eq('GDT from element + months', logsOf("var gr = new GlideRecord('incident'); gr.get('inc2'); var gdt = new GlideDateTime(gr.opened_at); gs.info(gdt.getValue()); gdt.addMonthsUTC(3); gs.info(gdt.getValue()); gs.info(gr.opened_at.getGlideObject().getMonthUTC());"), ['2026-11-03 11:40:00', '2027-02-03 11:40:00', '11'])
eq('GDT invalid / setDisplayValue', logsOf("var g = new GlideDateTime('not a date'); gs.info(g.isValid()); var h = new GlideDateTime(); h.setDisplayValue('2026-11-12 05:30:00'); gs.info(h.getValue());"), ['false', '2026-11-12 00:00:00'])
eq('GDT subtract → duration', logsOf("var d = GlideDateTime.subtract(new GlideDateTime('2026-11-01 00:00:00'), new GlideDateTime('2026-11-03 12:00:00')); gs.info(d.getNumericValue()); gs.info(d.getDayPart()); gs.info(d.getRoundedDayPart()); gs.info(d.getDurationValue());"), ['216000000', '2', '3', '2 12:00:00'])
eq('GlideDuration parse / add', logsOf("var d = new GlideDuration('1 02:30:00'); gs.info(d.getNumericValue()); var e = d.add(new GlideDuration(1800000)); gs.info(e.getDurationValue()); var g = new GlideDateTime('2026-11-01 00:00:00'); g.add(e); gs.info(g.getValue());"), ['95400000', '1 03:00:00', '2026-11-02 03:00:00'])
eq('GlideSchedule 8-5', logsOf("var s = new GlideSchedule('sch_8to5'); gs.info(s.isInSchedule(new GlideDateTime('2026-11-12 10:00:00'))); gs.info(s.isInSchedule(new GlideDateTime('2026-11-14 10:00:00'))); gs.info(s.duration(new GlideDateTime('2026-11-13 16:00:00'), new GlideDateTime('2026-11-16 09:00:00')).getNumericValue() / 3600000); gs.info(s.add(new GlideDateTime('2026-11-13 16:00:00'), new GlideDuration(7200000)).getValue());"), ['true', 'false', '2', '2026-11-16 09:00:00'])
eq('gs date helpers + javascript: query', logsOf("gs.info(gs.daysAgoStart(7)); gs.info(gs.beginningOfToday()); var gr = new GlideRecord('incident'); gr.addEncodedQuery('opened_at>=javascript:gs.daysAgoStart(7)'); gr.query(); gs.info(gr.getRowCount()); var g2 = new GlideRecord('incident'); g2.addQuery('opened_at', '>=', gs.daysAgoStart(7)); g2.query(); gs.info(g2.getRowCount());"), ['2026-11-05 00:00:00', '2026-11-12 00:00:00', '3', '3'])

// ---------- Stage 4: running user, ACLs, GlideRecordSecure, events ----------
const asAbel = { runAs: { sys_id: 'u_abel', roles: ['itil'] } }
eq('runAs user in gs', logsOf("gs.info(gs.getUserID()); gs.info(gs.getUserName()); gs.info(gs.hasRole('itil')); gs.info(gs.hasRole('admin')); gs.info(gs.getUser().getFirstName());", asAbel), ['u_abel', 'abel.tuter', 'true', 'false', 'Abel'])
eq('default user is admin', logsOf("gs.info(gs.getUserName()); gs.info(gs.hasRole('anything'));"), ['admin', 'true'])
const aclOwn = { runAs: { sys_id: 'u_bud', roles: [] }, acl: { incident: { read: { cond: 'caller_id=ME' }, write: { roles: ['itil'] }, delete: { roles: ['admin'] } } } }
eq('GRS filters unreadable rows', logsOf("var gr = new GlideRecordSecure('incident'); gr.query(); var n = 0; while (gr.next()) n++; gs.info(n); var all = new GlideRecord('incident'); all.query(); gs.info(all.getRowCount());", aclOwn), ['2', '8'])
eq('GRS get unreadable → false', logsOf("var gr = new GlideRecordSecure('incident'); gs.info(gr.get('inc1')); gs.info(gr.get('inc2'));", aclOwn), ['false', 'true'])
eq('GRS write denied, GR not', logsOf("var gr = new GlideRecordSecure('incident'); gr.get('inc2'); gr.setValue('state', 2); gs.info(gr.update()); var c = new GlideRecord('incident'); c.get('inc2'); gs.info(c.getValue('state')); gs.info(c.canWrite()); c.setValue('state', 2); c.update(); var d = new GlideRecord('incident'); d.get('inc2'); gs.info(d.getValue('state'));", aclOwn), ['null', '1', 'false', '2'])
eq('admin passes ACLs', logsOf("var gr = new GlideRecordSecure('incident'); gr.query(); gs.info(gr.getRowCount());", { acl: aclOwn.acl }), ['8'])
eq('eventQueue recorded', run("var gr = new GlideRecord('incident'); gr.get('inc2'); gs.eventQueue('incident.vip', gr, 'a', 'b');").logs.filter((l) => l.level === 'sys').length, 1)
eq('eventQueue in __x.events', runScript({ code: "var gr = new GlideRecord('incident'); gr.get('inc2'); gs.eventQueue('incident.vip', gr, 'u_bud');", tests: [{ label: 'e', expr: '__x.events', expect: [{ name: 'incident.vip', instance: 'inc2', table: 'incident', parm1: 'u_bud', parm2: null }] }] }).passed, true)

// ---------- Stage 4: GlideAggregate extras ----------
eq('GA addHaving', logsOf("var ga = new GlideAggregate('incident'); ga.addAggregate('COUNT'); ga.groupBy('category'); ga.addHaving('COUNT', '>', '1'); ga.query(); var out = []; while (ga.next()) out.push(ga.getValue('category') + '=' + ga.getAggregate('COUNT')); gs.info(out.join(','));"), ['software=2,network=2,database=2'])
eq('GA SUM / AVG / MAX', logsOf("var ga = new GlideAggregate('incident'); ga.addAggregate('SUM', 'reassignment_count'); ga.addAggregate('MAX', 'reassignment_count'); ga.query(); ga.next(); gs.info(ga.getAggregate('SUM', 'reassignment_count')); gs.info(ga.getAggregate('MAX', 'reassignment_count'));"), ['6', '3'])

console.log(bad ? `${bad} problems` : 'mock checks OK')
process.exit(bad ? 1 : 0)
