// Mock API sanity — run: node dev-tools/check-mock.mjs
// Covers things lessons rely on: dot-walking, changes()/changesTo()/changesFrom(), gs.getUser(), setVisible vs setDisplay.
import { runScript } from '../src/js/runScript.js'

let bad = 0
const eq = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.log('FAIL', label, 'got', JSON.stringify(got), 'want', JSON.stringify(want)) } }
const logsOf = (code, scenario) => { const r = runScript({ code, scenario }); if (r.error) console.log('   error:', r.error); return r.logs.map((l) => l.msg) }

// dot-walking
eq('dot-walk email', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010002'); gs.info(gr.caller_id.email); gs.info(gr.caller_id.name); gs.info(gr.assignment_group.name);"), ['bud.richman@example.com', 'Bud Richman', 'Network'])
eq('dot-walk empty ref', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010006'); gs.info('[' + gr.assigned_to.name + ']'); gs.info(gr.assigned_to.nil());"), ['[]', 'true'])
eq('dot-walk concat', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010001'); gs.info('Caller: ' + gr.caller_id.name);"), ['Caller: Abel Tuter'])
eq('element still works', logsOf("var gr = new GlideRecord('incident'); gr.get('number','INC0010001'); gs.info(gr.priority == 3); gs.info(gr.priority.getDisplayValue()); gs.info(gr.assigned_to.getDisplayValue());"), ['true', '3 - Moderate', 'System Administrator'])

// changes()
const cur = { current: { table: 'incident', values: { number: 'INC1', priority: '3', state: '2' } } }
eq('changes false at start', logsOf('gs.info(current.priority.changes());', cur), ['false'])
eq('changes true after set', logsOf("current.setValue('priority', 1); gs.info(current.priority.changes()); gs.info(current.state.changes());", cur), ['true', 'false'])
eq('changesTo / changesFrom', logsOf("current.priority = 1; gs.info(current.priority.changesTo(1)); gs.info(current.priority.changesTo(2)); gs.info(current.priority.changesFrom(3)); gs.info(current.priority.changesFrom(2));", cur), ['true', 'false', 'true', 'false'])
eq('previous scenario', logsOf('gs.info(current.state.changes()); gs.info(previous.state.getValue());', { current: { table: 'incident', values: { state: '6' } }, previous: { table: 'incident', values: { state: '2' } } }), ['true', '2'])
eq('record changes()', logsOf("gs.info(current.changes()); current.short_description = 'x'; gs.info(current.changes());", cur), ['false', 'true'])

// gs.getUser()
eq('gs.getUser', logsOf('gs.info(gs.getUser().getID()); gs.info(gs.getUser().hasRole("itil"));'), ['u_admin', 'true'])

// setVisible vs setDisplay (client)
const client = (code) => runScript({ code, client: { trigger: { type: 'onLoad' } }, tests: [] }).form.fields.filter((f) => ['assigned_to', 'assignment_group'].includes(f.name)).map((f) => [f.visible, f.space])
eq('setVisible keeps space / setDisplay removes it', client("function onLoad() { g_form.setVisible('assigned_to', false); g_form.setDisplay('assignment_group', false); }"), [[false, false], [false, true]])
eq('show again clears space', client("function onLoad() { g_form.setVisible('assigned_to', false); g_form.setVisible('assigned_to', true); }"), [[true, false], [true, false]])

console.log(bad ? `${bad} problems` : 'mock checks OK')
process.exit(bad ? 1 : 0)
