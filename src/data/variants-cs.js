// Extra test runs ("variants") for Stage 3 exercises — see runScript(): the SAME code is run again under a different
// scenario, so a solution that ignores the condition (always does the action, or only hardcodes the output) fails.
// Keyed by exercise id (ids never change — progress depends on them). Attached in lessons-cs.js.
const CHG = (field, oldValue, newValue) => ({ trigger: { type: 'onChange', field, oldValue, newValue } })
const MSGS = '__msgs.map(function (m) { return m.text })'
const CUR = (values) => ({ current: { table: 'incident', values: { number: 'INC0010001', ...values } } })
const FMSGS = (f) => `__f.${f}.msgs.map(function (m) { return m.text })`

export const VARIANTS_CS = {
  /* g_user / g_scratchpad */
  'cs-gluser-2': [{ name: 'itil role unte', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'assignment_group read-only kaadu', expr: '__f.assignment_group.readOnly', expect: false }] }],
  'cs-gluser-3': [
    { name: 'caller already undi', scenario: { form: { isNew: true, values: { caller_id: 'u_bud' } } }, tests: [{ label: 'caller marchaledu', expr: "g_form.getValue('caller_id')", expect: 'u_bud' }] },
    { name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'caller empty ga undi', expr: "g_form.getValue('caller_id')", expect: '' }] },
  ],
  'cs-gluser-4': [{ name: 'VIP kaadu', scenario: { scratchpad: { callerIsVip: false } }, tests: [{ label: 'message ledu', expr: MSGS, expect: [] }, { label: 'urgency marchaledu', expr: "g_form.getValue('urgency')", expect: '3' }, { label: 'short_description mandatory kaadu', expr: "g_form.isMandatory('short_description')", expect: false }] }],

  /* g_form */
  'cs-glform-2': [{ name: 'priority 3 ayithe', scenario: { form: { values: { priority: '3' }, mandatory: ['assignment_group'] } }, client: CHG('priority', '1', '3'), tests: [{ label: 'assignment_group mandatory teeseyyali', expr: "g_form.isMandatory('assignment_group')", expect: false }] }],
  'cs-glform-3': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', assignment_group: 'g_desk' } } }, tests: [{ label: 'assignment_group visible', expr: '__f.assignment_group.visible', expect: true }, { label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-glform-4': [{ name: 'impact 2 ayithe', scenario: { form: { values: { impact: '2', urgency: '2' } } }, client: CHG('impact', '3', '2'), tests: [{ label: 'urgency options anni undali', expr: '__f.urgency.choices.map(function (c) { return c.value })', expect: ['1', '2', '3'] }, { label: 'field message ledu', expr: '__f.urgency.msgs.length', expect: 0 }] }],

  /* g_form continuation */
  'cs-glform2-1': [{ name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'related lists hide avvakudadu', expr: '__x.relatedHidden', expect: false }] }],
  'cs-glform2-2': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2' } } }, tests: [{ label: 'section hide avvakudadu', expr: '__x.hiddenSections', expect: [] }] }],
  'cs-glform2-4': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', description: '' }, mandatory: ['description'] } }, client: CHG('state', '6', '2'), tests: [{ label: 'description mandatory teesiveyyali', expr: '__f.description.mandatory', expect: false }, { label: 'error message ledu', expr: '__f.description.msgs.length', expect: 0 }] }],

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
  'cs-client-3': [{ name: 'priority takkuva ayindi (de-escalate)', scenario: { form: { values: { priority: '3' } } }, client: CHG('priority', '1', '3'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-client-4': [{ name: 'Resolved nunchi kaadu', scenario: { form: { values: { state: '6' } } }, client: CHG('state', '2', '6'), tests: [{ label: 'state 6 ala undali', expr: "g_form.getValue('state')", expect: '6' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
  'cs-onload-1': [{ name: 'priority 3', scenario: { form: { values: { priority: '3' } } }, tests: [{ label: 'banner ledu', expr: MSGS, expect: [] }] }],
  'cs-onload-2': [{ name: 'state 2 (not closed)', scenario: { form: { values: { state: '2' } } }, tests: [{ label: 'read-only kaadu', expr: "['short_description','description','assignment_group'].map(function (f) { return __f[f].readOnly })", expect: [false, false, false] }] }],
  'cs-onload-3': [{ name: 'existing record', scenario: { form: { isNew: false, values: {} } }, tests: [{ label: 'category marchaledu', expr: "g_form.getValue('category')", expect: '' }, { label: 'caller mandatory kaadu', expr: "g_form.isMandatory('caller_id')", expect: false }, { label: 'message ledu', expr: MSGS, expect: [] }] }],
  'cs-onload-4': [{ name: 'itil role unte', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'fields visible', expr: '[__f.assigned_to.visible, __f.assignment_group.visible]', expect: [true, true] }, { label: 'read-only kaadu', expr: '[__f.impact.readOnly, __f.urgency.readOnly]', expect: [false, false] }] }],
  'cs-onchange-2': [
    { name: 'impact 2', scenario: { form: { values: { impact: '2', urgency: '1' } } }, tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
    { name: 'urgency 2', scenario: { form: { values: { impact: '1', urgency: '2' } } }, client: CHG('urgency', '1', '2'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] },
  ],
  'cs-onchange-3': [{ name: 'state 2 ayithe', scenario: { form: { values: { state: '2', description: '' }, mandatory: ['description'] } }, client: CHG('state', '3', '2'), tests: [{ label: 'mandatory teesiveyyali', expr: '__f.description.mandatory', expect: false }, { label: 'field message ledu', expr: '__f.description.msgs.length', expect: 0 }] }],
  'cs-onchange-4': [{ name: 'active caller', scenario: { form: { values: { caller_id: 'u_abel' } } }, client: CHG('caller_id', 'u_fred', 'u_abel'), tests: [{ label: 'caller ala undali', expr: "g_form.getValue('caller_id')", expect: 'u_abel' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],

  /* GlideAjax */
  'cs-ajax1-2': [{ name: 'user dorikite', scenario: { form: { values: {} } }, client: CHG('caller_id', '', 'u_abel'), tests: [{ label: 'description set', expr: "g_form.getValue('description')", expect: 'Email: abel.tuter@example.com' }, { label: 'field message ledu', expr: FMSGS('caller_id'), expect: [] }] }],
  'cs-ajax1-4': [{ name: 'g_desk (1 open)', scenario: { form: { values: { assignment_group: 'g_desk' } } }, client: CHG('assignment_group', '', 'g_desk'), tests: [{ label: 'message ledu', expr: MSGS, expect: [] }] }],

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
  'cs-usecases-1': [{ name: 'software', scenario: { form: { values: { category: 'software' } } }, client: CHG('category', 'hardware', 'software'), tests: [{ label: 'field message ledu', expr: '__f.category.msgs.length', expect: 0 }] }],
  'cs-usecases-2': [{ name: 'map lo ledu (software)', scenario: { form: { values: { category: 'software', assignment_group: 'g_net' } } }, client: CHG('category', 'database', 'software'), tests: [{ label: 'group clear', expr: "g_form.getValue('assignment_group')", expect: '' }] }],
  'cs-usecases-4': [{ name: 'Resolved (confirm avasaram ledu)', scenario: { form: { values: { state: '6' } }, confirmAnswer: false }, client: CHG('state', '2', '6'), tests: [{ label: 'state 6 ala undali', expr: "g_form.getValue('state')", expect: '6' }, { label: 'confirm adagaledu', logs: [] }] }],

  /* onCellEdit */
  'cs-oncell-1': [{ name: 'value undi', client: { trigger: { type: 'onCellEdit', newValue: 'abc', oldValues: [''], table: 'incident', sysIDs: ['inc1'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }] }],
  'cs-oncell-2': [{ name: 'state 2', client: { trigger: { type: 'onCellEdit', newValue: '2', oldValues: [''], table: 'incident', sysIDs: ['inc1'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }],
  'cs-oncell-3': [{ name: 'old state 2', client: { trigger: { type: 'onCellEdit', newValue: '3', oldValues: ['2'], table: 'incident', sysIDs: ['inc1'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] }],
  'cs-oncell-4': [
    { name: 'itil user P1 set', scenario: { user: { userName: 'abel.tuter', userID: 'u_abel', roles: ['itil'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }, { label: 'alert ledu', logs: [] }] },
    { name: 'role lekunda P2 set', client: { trigger: { type: 'onCellEdit', newValue: '2', oldValues: [''], table: 'incident', sysIDs: ['inc1'] } }, tests: [{ label: 'edit allow', expr: '__submit', expect: true }] },
  ],

  /* UI Actions (client) */
  'cs-ua2-3': [{ name: 'short_description empty', scenario: { form: { values: { short_description: '' } } }, tests: [{ label: 'submit avvaledu', expr: '__x.submitted', expect: null }, { label: 'error message', expr: MSGS, expect: ['Short description kavali'] }] }],
  'cs-ua2-4': [{ name: 'OK nokkaru', scenario: { form: { values: { short_description: 'VPN down' } }, confirmAnswer: true }, tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }] }],
  'cs-ua3-3': [{ name: 'description undi', scenario: { form: { values: { description: 'Restarted the VPN service' } } }, tests: [{ label: 'submitted resolve_incident', expr: '__x.submitted', expect: 'resolve_incident' }, { label: 'error ledu', expr: MSGS, expect: [] }] }],
  'cs-ua5-2': [
    { name: 'emi select cheyyaledu', scenario: { list: { table: 'incident', checked: [] }, confirmAnswer: true }, tests: [{ label: 'submit avvaledu', expr: '__x.submitted', expect: null }, { label: 'alert', logs: ['Select incidents first'] }] },
    { name: 'Cancel nokkaru', scenario: { list: { table: 'incident', checked: ['inc1'] }, confirmAnswer: false }, tests: [{ label: 'submit avvaledu', expr: '__x.submitted', expect: null }] },
  ],

  /* UI Actions (server) */
  'cs-ua1-3': [{ name: 'already assigned', scenario: CUR({ assigned_to: 'u_bud', state: '1' }), tests: [{ label: 'assigned_to marchaledu', expr: "current.getValue('assigned_to')", expect: 'u_bud' }, { label: 'state marchaledu', expr: "current.getValue('state')", expect: '1' }] }],
  'cs-ua1-4': [{ name: 'state 2 (reopen kudaradu)', scenario: CUR({ state: '2', active: 'true' }), tests: [{ label: 'state marchaledu', expr: "current.getValue('state')", expect: '2' }, { label: 'log', logs: ['Cannot reopen'] }] }],
  'cs-ua3-4': [{ name: 'already closed', scenario: CUR({ state: '7', description: '' }), tests: [{ label: 'state 7 ala undali', expr: "current.getValue('state')", expect: '7' }, { label: 'log', logs: ['Already closed'] }] }],
  'cs-ua4-4': [{ name: 'already closed', scenario: CUR({ state: '7' }), tests: [{ label: 'state 7', expr: "current.getValue('state')", expect: '7' }, { label: 'log', logs: ['Already closed'] }] }],
}
