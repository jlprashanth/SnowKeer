// Extra test runs ("variants") for Stage 3 exercises — see runScript(): the SAME code is run again under a different
// scenario, so a solution that ignores the condition (always does the action, or only hardcodes the output) fails.
// Keyed by exercise id (ids never change — progress depends on them). Attached in lessons-cs.js.
// Scenario form values = the values when the form LOADED (oldValue in the PDI = the load value).
const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
// onChange during form load (isLoading = true): the guard must stop the script — nothing may change
const LOADCHG = (field, value) => ({ trigger: { type: 'onChange', field, oldValue: value, newValue: value, isLoading: true } })
const MSGS = '__msgs.map(function (m) { return m.text })'
const CELL = (nv, ov, ids) => ({ trigger: { type: 'onCellEdit', newValue: nv, oldValues: ov || [''], table: 'incident', sysIDs: ids || ['inc1'] } })
const FMSGS = (f) => `__f.${f}.msgs.map(function (m) { return m.text })`
const OPTS = (f) => `__f.${f}.choices.map(function (c) { return c.value + '=' + c.label })`
const CALLS = "__x.ajaxCalls.map(function (c) { return c.name + '.' + c.params.sysparm_name })"
const BETH = { firstName: 'Beth', lastName: 'Anglin', userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] }

export const VARIANTS_CS = {
  /* g_user / g_scratchpad */
  'cs-gluser-1': [{ name: 'vere user (Beth)', scenario: { user: BETH }, tests: [{ label: 'Message: Welcome Beth', expr: MSGS, expect: ['Welcome Beth'] }] }],
  'cs-gluser-2': [{ name: 'itil role unte', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'assignment_group read-only kaadu', expr: '__f.assignment_group.readOnly', expect: false }] }],
  'cs-gluser-3': [
    { name: 'caller already undi', scenario: { form: { isNew: true, values: { caller_id: 'u_bud' } } }, tests: [{ label: 'caller marchaledu', expr: "g_form.getValue('caller_id')", expect: 'u_bud' }] },
    { name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'caller empty ga undi', expr: "g_form.getValue('caller_id')", expect: '' }] },
    { name: 'vere user (Beth) login', scenario: { user: BETH }, tests: [{ label: 'caller_id = u_beth', expr: "g_form.getValue('caller_id')", expect: 'u_beth' }] },
  ],
  'cs-gluser-4': [{ name: 'VIP kaadu', scenario: { scratchpad: { callerIsVip: false } }, tests: [{ label: 'message ledu', expr: MSGS, expect: [] }, { label: 'urgency marchaledu', expr: "g_form.getValue('urgency')", expect: '3' }, { label: 'short_description mandatory kaadu', expr: "g_form.isMandatory('short_description')", expect: false }] }],

  /* g_form */
  'cs-glform-2': [
    { name: 'priority 3 ayithe', scenario: { form: { values: { priority: '1' }, mandatory: ['assignment_group'] } }, client: CHG('priority', '1', '3'), tests: [{ label: 'assignment_group mandatory teeseyyali', expr: "g_form.isMandatory('assignment_group')", expect: false }] },
    { name: 'form load (isLoading)', scenario: { form: { values: { priority: '1' } } }, client: LOADCHG('priority', '1'), tests: [{ label: 'load lo emi maaradu', expr: "g_form.isMandatory('assignment_group')", expect: false }] },
  ],
  'cs-glform-3': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', assignment_group: 'g_desk' } } }, tests: [{ label: 'assignment_group visible', expr: '__f.assignment_group.visible', expect: true }, { label: 'message ledu', expr: MSGS, expect: [] }] }],
  // "tirigi" runs: the starter's practice-setup block replays her own onChange for the earlier impact, then impact goes back
  // to the load value '2' (oldValue = load value '2' too) — the script must put the option(s) back.
  'cs-glform-4': [{ name: 'impact 3 nunchi malli 2 ki', scenario: { form: { values: { impact: '3', urgency: '2' } } }, client: CHG('impact', '2', '2'), tests: [{ label: 'urgency options malli 1, 2, 3', expr: OPTS('urgency'), expect: ['1=1 - High', '2=2 - Medium', '3=3 - Low'] }, { label: 'field message poyindi', expr: '__f.urgency.msgs.length', expect: 0 }] }],

  /* g_form continuation */
  'cs-glform2-1': [{ name: 'itil role unte', scenario: { user: { userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] } }, tests: [{ label: 'related lists hide avvakudadu', expr: '__x.relatedHidden', expect: false }] }],
  'cs-glform2-2': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2' } } }, tests: [{ label: 'section hide avvakudadu', expr: '__x.hiddenSections', expect: [] }] }],
  'cs-glform2-3': [{ name: 'vere caller (Beth)', client: CHG('caller_id', '', 'u_beth'), tests: [{ label: 'Beth email', expr: "g_form.getValue('description')", expect: 'Caller email: beth.anglin@example.com' }] }],
  'cs-glform2-4': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '6', close_notes: '' }, mandatory: ['close_notes'] } }, client: CHG('state', '6', '2'), tests: [{ label: 'close_notes mandatory teesiveyyali', expr: '__f.close_notes.mandatory', expect: false }, { label: 'error message ledu', expr: '__f.close_notes.msgs.length', expect: 0 }] }],

  /* g_list */
  'cs-gllist-1': [
    { name: 'emi select cheyyaledu', scenario: { list: { table: 'incident', checked: [] } }, tests: [{ label: 'Selected: 0', logs: ['Selected: 0'] }] },
    { name: '3 select', scenario: { list: { table: 'incident', checked: ['a', 'b', 'c'] } }, tests: [{ label: 'Selected: 3', logs: ['Selected: 3'] }] },
  ],
  'cs-gllist-2': [{ name: '1 select chesaru', scenario: { list: { table: 'incident', checked: ['inc1'] } }, tests: [{ label: 'alert raakudadu', logs: [] }] }],
  'cs-gllist-3': [
    { name: 'Cancel nokkaru', scenario: { list: { table: 'incident', checked: ['inc1', 'inc2'] }, confirmAnswer: false }, tests: [{ label: 'confirm matrame (Closing log ledu)', logs: ['Close 2 incident(s)?'] }] },
    { name: '3 records', scenario: { list: { table: 'incident', checked: ['a', 'b', 'c'] }, confirmAnswer: true }, tests: [{ label: 'count 3', logs: ['Close 3 incident(s)?', 'Closing: a,b,c'] }] },
  ],
  'cs-gllist-4': [
    { name: 'emi select cheyyaledu', scenario: { list: { table: 'incident', checked: [] }, confirmAnswer: true }, tests: [{ label: 'Select at least one', logs: ['Select at least one incident'] }] },
    { name: '2 select', scenario: { list: { table: 'incident', checked: ['a', 'b'] }, confirmAnswer: true }, tests: [{ label: 'confirm + Closing', logs: ['Close 2 incident(s)?', 'Closing: a,b'] }] },
  ],

  /* Client scripts / onLoad / onChange */
  'cs-client-1': [{ name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'urgency marchakudadu', expr: "g_form.getValue('urgency')", expect: '' }] }],
  'cs-client-2': [
    { name: 'vere values (4 → 1)', scenario: { form: { values: { priority: '4' } } }, client: CHG('priority', '4', '1'), tests: [{ label: 'Log', logs: ['Priority changed from 4 to 1'] }] },
    { name: 'form load (isLoading)', client: LOADCHG('priority', '3'), tests: [{ label: 'load lo log raakudadu', logs: [] }] },
  ],
  'cs-client-3': [{ name: 'priority takkuva ayindi (de-escalate)', scenario: { form: { values: { priority: '1' } } }, client: CHG('priority', '1', '3'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-client-4': [{ name: 'Resolved nunchi kaadu', scenario: { form: { values: { state: '2' } } }, client: CHG('state', '2', '6'), tests: [{ label: 'state 6 ala undali', expr: "g_form.getValue('state')", expect: '6' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
  'cs-client-6': [{ name: 'load value 2 (2 → 1)', scenario: { form: { values: { priority: '2' } } }, client: CHG('priority', '2', '1'), tests: [{ label: 'priority back to 2 (hardcode kaadu)', expr: "g_form.getValue('priority')", expect: '2' }] }],
  'cs-onload-1': [{ name: 'priority 3', scenario: { form: { values: { priority: '3' } } }, tests: [{ label: 'banner ledu', expr: MSGS, expect: [] }] }],
  'cs-onload-2': [{ name: 'state 2 (not closed)', scenario: { form: { values: { state: '2' } } }, tests: [{ label: 'read-only kaadu', expr: "['short_description','description','assignment_group'].map(function (f) { return __f[f].readOnly })", expect: [false, false, false] }] }],
  'cs-onload-3': [{ name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'category marchaledu', expr: "g_form.getValue('category')", expect: '' }, { label: 'caller mandatory kaadu', expr: "g_form.isMandatory('caller_id')", expect: false }, { label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-onload-4': [{ name: 'itil role unte', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'fields visible', expr: '[__f.assigned_to.visible, __f.assignment_group.visible]', expect: [true, true] }, { label: 'read-only kaadu', expr: '[__f.impact.readOnly, __f.urgency.readOnly]', expect: [false, false] }] }],
  'cs-onchange-1': [{ name: 'form load (isLoading)', scenario: { form: { values: { assignment_group: 'g_net', assigned_to: 'u_admin' } } }, client: LOADCHG('assignment_group', 'g_net'), tests: [{ label: 'load lo assigned_to clear avvakudadu', expr: "g_form.getValue('assigned_to')", expect: 'u_admin' }] }],
  'cs-onchange-2': [
    { name: 'impact 2', scenario: { form: { values: { impact: '2', urgency: '2' } } }, tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
    { name: 'urgency 2', scenario: { form: { values: { impact: '1', urgency: '1' } } }, client: CHG('urgency', '1', '2'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
    { name: 'form load (isLoading)', scenario: { form: { values: { impact: '1', urgency: '1' } } }, client: LOADCHG('urgency', '1'), tests: [{ label: 'load lo message raakudadu', expr: MSGS, expect: [] }] },
  ],
  // user On Hold petti, reason ivvakunda malli In Progress (load value) ki: newValue == oldValue == '2' — hide + not mandatory
  'cs-onchange-3': [{ name: 'On Hold nunchi malli In Progress (reason empty)', scenario: { form: { values: { state: '3', hold_reason: '' }, mandatory: ['hold_reason'] } }, client: CHG('state', '2', '2'), tests: [{ label: 'mandatory teesesindi', expr: '__f.hold_reason.mandatory', expect: false }, { label: 'hide ayyindi (mandatory mundu teesesthe)', expr: '__f.hold_reason.visible', expect: false }] }],
  'cs-onchange-4': [{ name: 'active caller', scenario: { form: { values: { caller_id: 'u_fred' } } }, client: CHG('caller_id', 'u_fred', 'u_abel'), tests: [{ label: 'caller ala undali', expr: "g_form.getValue('caller_id')", expect: 'u_abel' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
  'cs-onchange-5': [{ name: 'vere caller (Beth)', client: CHG('caller_id', 'u_abel', 'u_beth'), tests: [{ label: 'short_description', expr: "g_form.getValue('short_description')", expect: 'Issue for Beth Anglin' }, { label: 'callback style', expr: '__x.syncGetReference', expect: 0 }] }],

  /* GlideAjax */
  'cs-ajax1-1': [
    { name: 'vere caller (Bud)', client: CHG('caller_id', '', 'u_bud'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Email: bud.richman@example.com' }] },
    { name: 'form load (isLoading)', scenario: { form: { values: { caller_id: 'u_abel' } } }, client: LOADCHG('caller_id', 'u_abel'), tests: [{ label: 'load lo server call ledu', expr: '__x.ajaxCalls.length', expect: 0 }, { label: 'description marchaledu', expr: "g_form.getValue('description')", expect: '' }] },
  ],
  'cs-ajax1-2': [{ name: 'user dorikite', scenario: { form: { values: {} } }, client: CHG('caller_id', '', 'u_abel'), tests: [{ label: 'description set', expr: "g_form.getValue('description')", expect: 'Email: abel.tuter@example.com' }, { label: 'field message ledu', expr: FMSGS('caller_id'), expect: [] }] }],
  'cs-ajax1-3': [{ name: 'impact 1, urgency 2', scenario: { form: { values: { impact: '1', urgency: '3' } } }, client: CHG('urgency', '3', '2'), tests: [{ label: 'GlideAjax', expr: CALLS, expect: ['PriorityAjax.getPriority'] }, { label: 'priority = 2', expr: "g_form.getValue('priority')", expect: '2' }] }],
  'cs-ajax1-4': [{ name: 'g_desk (1 open)', client: CHG('assignment_group', '', 'g_desk'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-ajax1-5': [{ name: 'g_desk (1 open)', client: CHG('assignment_group', '', 'g_desk'), tests: [{ label: 'message', expr: MSGS, expect: ['Open incidents: 1'] }] }],
  'cs-ajax1-6': [{ name: 'g_desk (1 open)', client: CHG('assignment_group', '', 'g_desk'), tests: [{ label: 'description', expr: "g_form.getValue('description')", expect: 'Queue position: 2' }] }],
  'cs-ajax1-7': [{ name: 'g_desk (1 open)', client: CHG('assignment_group', '', 'g_desk'), tests: [{ label: 'field message ledu', expr: FMSGS('assignment_group'), expect: [] }] }],

  /* onSubmit */
  'cs-onsubmit-1': [{ name: 'length sariponi', scenario: { form: { values: { short_description: 'VPN keeps disconnecting' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
  'cs-onsubmit-2': [
    { name: 'P1 + group undi', scenario: { form: { values: { priority: '1', assignment_group: 'g_net' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }] },
    { name: 'P3 + group ledu', scenario: { form: { values: { priority: '3', assignment_group: '' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'field message ledu', expr: '__f.assignment_group.msgs.length', expect: 0 }] },
  ],
  'cs-onsubmit-3': [
    { name: 'OK nokkaru', scenario: { form: { values: { priority: '1' } }, confirmAnswer: true }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }] },
    { name: 'P3 (confirm adagakudadu)', scenario: { form: { values: { priority: '3' } }, confirmAnswer: false }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'confirm adagaledu', logs: [] }] },
  ],
  'cs-onsubmit-4': [{ name: 'anni fields undi', scenario: { form: { values: { short_description: 'VPN down', category: 'network' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'messages ledu', expr: '[__f.short_description.msgs.length, __f.category.msgs.length]', expect: [0, 0] }] }],

  /* use cases */
  'cs-usecases-1': [{ name: 'software', scenario: { form: { values: { category: 'hardware' } } }, client: CHG('category', 'hardware', 'software'), tests: [{ label: 'field message ledu', expr: '__f.category.msgs.length', expect: 0 }] }],
  'cs-usecases-2': [
    { name: 'map lo ledu (software)', scenario: { form: { values: { category: 'database', assignment_group: 'g_net' } } }, client: CHG('category', 'database', 'software'), tests: [{ label: 'group clear', expr: "g_form.getValue('assignment_group')", expect: '' }] },
    { name: 'vere map (Display BR vere sys_id pampindi)', scenario: { scratchpad: { groupByCategory: { database: 'g_hw' } } }, tests: [{ label: 'map nunchi g_hw (hardcode kaadu)', expr: "g_form.getValue('assignment_group')", expect: 'g_hw' }] },
    { name: 'form load (isLoading)', scenario: { form: { values: { category: 'database', assignment_group: 'g_net' } } }, client: LOADCHG('category', 'database'), tests: [{ label: 'load lo group marchakudadu', expr: "g_form.getValue('assignment_group')", expect: 'g_net' }] },
  ],
  'cs-usecases-3': [{ name: 'impact 2, urgency 3', scenario: { form: { values: { impact: '1', urgency: '3' } } }, client: CHG('impact', '1', '2'), tests: [{ label: 'priority = 4', expr: "g_form.getValue('priority')", expect: '4' }] }],
  'cs-usecases-4': [
    { name: 'Resolved (confirm avasaram ledu)', scenario: { form: { values: { state: '2' } }, confirmAnswer: false }, client: CHG('state', '2', '6'), tests: [{ label: 'state 6 ala undali', expr: "g_form.getValue('state')", expect: '6' }, { label: 'confirm adagaledu', logs: [] }] },
    { name: 'form already Closed — malli Closed ki (guard)', scenario: { form: { values: { state: '2' } }, confirmAnswer: false }, client: CHG('state', '7', '7'), tests: [{ label: 'confirm adagakudadu', logs: [] }, { label: 'state 7 ala undali', expr: "g_form.getValue('state')", expect: '7' }] },
    { name: 'load value On Hold (3 → 7, Cancel)', scenario: { form: { values: { state: '3' } }, confirmAnswer: false }, client: CHG('state', '3', '7'), tests: [{ label: 'state back to 3 (hardcode kaadu)', expr: "g_form.getValue('state')", expect: '3' }] },
  ],

  /* onCellEdit */
  'cs-oncell-1': [{ name: 'value undi', client: CELL('abc'), tests: [{ label: 'edit allow', expr: '__submit', expect: true }] }],
  'cs-oncell-2': [{ name: 'state 2', client: CELL('2'), tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }],
  'cs-oncell-3': [
    { name: 'okka record, old state 2', client: CELL('3', ['2']), tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] },
    { name: 'rendu records, Resolved ledu', client: CELL('3', ['2', '1'], ['inc1', 'inc2']), tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] },
    { name: 'first record Resolved', client: CELL('3', ['6', '2'], ['inc5', 'inc1']), tests: [{ label: 'blocked', expr: '__submit', expect: false }, { label: 'alert okkasari', logs: ['Resolved record edit cheyyaku'] }] },
  ],
  'cs-oncell-4': [
    { name: 'itil user P1 set', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] },
    { name: 'role lekunda P2 set', client: CELL('2'), tests: [{ label: 'edit allow', expr: '__submit', expect: true }] },
  ],

  /* Stage 3 Medium+ ladder — else-branch / hardcode guards */
  'cs-gluser-5': [{ name: 'vere group (Database)', scenario: { scratchpad: { callerGroup: 'Database' } }, tests: [{ label: 'Message: Caller group: Database', expr: MSGS, expect: ['Caller group: Database'] }] }],
  'cs-gluser-6': [{ name: 'flag false', scenario: { scratchpad: { needsApproval: false } }, tests: [{ label: 'description mandatory kaadu', expr: "g_form.isMandatory('description')", expect: false }] }],
  'cs-gluser-7': [
    { name: 'VIP kaadu', scenario: { scratchpad: { callerIsVip: false } }, tests: [{ label: 'message ledu', expr: MSGS, expect: [] }, { label: 'urgency marchaledu', expr: "g_form.getValue('urgency')", expect: '3' }] },
    { name: 'vere user (Beth)', scenario: { user: BETH }, tests: [{ label: 'Message lo Beth', expr: MSGS, expect: ['VIP caller — Beth, please check'] }] },
  ],
  'cs-glform-6': [{ name: 'short description undi', scenario: { form: { values: { short_description: 'Email down' } } }, tests: [{ label: 'field message ledu', expr: '__f.short_description.msgs.length', expect: 0 }] }],
  'cs-glform-7': [{ name: 'impact 1 nunchi malli 2 ki', scenario: { form: { values: { impact: '1', urgency: '2' } } }, client: CHG('impact', '2', '2'), tests: [{ label: 'urgency options malli 1, 2, 3', expr: OPTS('urgency'), expect: ['1=1 - High', '2=2 - Medium', '3=3 - Low'] }] }],
  'cs-onsubmit-5': [{ name: 'short description undi', scenario: { form: { values: { short_description: 'VPN down' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'message ledu', expr: '__f.short_description.msgs.length', expect: 0 }] }],
  'cs-onsubmit-6': [{ name: 'text undi', scenario: { form: { values: { short_description: '  VPN down ' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'message ledu', expr: '__f.short_description.msgs.length', expect: 0 }] }],
  'cs-onsubmit-7': [{ name: 'anni fields undi', scenario: { form: { values: { short_description: 'VPN down', category: 'network' } } }, tests: [{ label: 'submit avvali', expr: '__submit', expect: true }, { label: 'messages ledu', expr: '[__f.short_description.msgs.length, __f.category.msgs.length]', expect: [0, 0] }] }],
  'cs-usecases-5': [{ name: 'user Cancel', scenario: { confirmAnswer: false }, tests: [{ label: 'assigned_to ala undali', expr: "g_form.getValue('assigned_to')", expect: 'u_admin' }] }],
  'cs-usecases-6': [
    { name: 'state 3 (On Hold)', scenario: { form: { values: { state: '2' } } }, client: CHG('state', '2', '3'), tests: [{ label: 'state 3 ala undali', expr: "g_form.getValue('state')", expect: '3' }, { label: 'message ledu', expr: MSGS, expect: [] }] },
    { name: 'load value On Hold (3 → 8)', scenario: { form: { values: { state: '3' } } }, client: CHG('state', '3', '8'), tests: [{ label: 'state back to 3 (hardcode kaadu)', expr: "g_form.getValue('state')", expect: '3' }] },
  ],
  'cs-usecases-7': [
    { name: 'user OK', scenario: { confirmAnswer: true }, tests: [{ label: 'group g_net ala undali', expr: "g_form.getValue('assignment_group')", expect: 'g_net' }] },
    { name: 'load value Hardware group (Cancel)', scenario: { form: { values: { assignment_group: 'g_hw' } }, confirmAnswer: false }, client: CHG('assignment_group', 'g_hw', 'g_net'), tests: [{ label: 'group back to g_hw (hardcode kaadu)', expr: "g_form.getValue('assignment_group')", expect: 'g_hw' }, { label: 'confirm okkasari', logs: ['Assignment group marchala?'] }] },
  ],
  'cs-oncell-5': [{ name: 'priority 3', client: CELL('3'), tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }],
  'cs-oncell-6': [{ name: 'itil user', scenario: { user: { userName: 'beth.anglin', userID: 'u_beth', roles: ['itil'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }],
  'cs-oncell-7': [{ name: 'Resolved nunchi Close', client: CELL('7', ['6']), tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }, { name: 'state 3 ki', client: CELL('3', ['2']), tests: [{ label: 'edit allow', expr: '__submit', expect: true }] }],
}
