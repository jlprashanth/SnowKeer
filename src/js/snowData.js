// Fixed practice data for the Stage 2 script sandbox (independent of the Stage 1 UI mock,
// so exercise test cases always see the same records). Cloned fresh for every Run.

export const USERS = [
  { sys_id: 'u_admin', user_name: 'admin', name: 'System Administrator', email: 'admin@example.com', active: 'true' },
  { sys_id: 'u_abel', user_name: 'abel.tuter', name: 'Abel Tuter', email: 'abel.tuter@example.com', active: 'true' },
  { sys_id: 'u_bud', user_name: 'bud.richman', name: 'Bud Richman', email: 'bud.richman@example.com', active: 'true' },
  { sys_id: 'u_beth', user_name: 'beth.anglin', name: 'Beth Anglin', email: 'beth.anglin@example.com', active: 'true' },
  { sys_id: 'u_fred', user_name: 'fred.luddy', name: 'Fred Luddy', email: 'fred.luddy@example.com', active: 'false' },
]

export const GROUPS = [
  { sys_id: 'g_desk', name: 'Service Desk' },
  { sys_id: 'g_net', name: 'Network' },
  { sys_id: 'g_db', name: 'Database' },
  { sys_id: 'g_hw', name: 'Hardware' },
]

// choice labels (what getDisplayValue() shows) — values and labels as in her Brazil PDI
export const CHOICES = {
  incident: {
    state: { 1: 'New', 2: 'In Progress', 3: 'On Hold', 6: 'Resolved', 7: 'Closed', 8: 'Canceled' },
    priority: { 1: '1 - Critical', 2: '2 - High', 3: '3 - Moderate', 4: '4 - Low', 5: '5 - Planning' },
    impact: { 1: '1 - High', 2: '2 - Medium', 3: '3 - Low' },
    urgency: { 1: '1 - High', 2: '2 - Medium', 3: '3 - Low' },
    hold_reason: { 1: 'Awaiting Caller', 3: 'Awaiting Problem', 4: 'Awaiting Vendor', 5: 'Awaiting Change' },
    close_code: {
      'Resolved by caller': 'Resolved – Fixed by Caller',
      'Workaround provided': 'Resolved – Workaround Applied',
      'Resolved by problem': 'Resolved – Fixed by Problem',
      Duplicate: 'Duplicate',
      'Known error': 'Known error',
    },
  },
}

// table -> { fields: name -> type, refs: name -> table, numberPrefix }
export const SCHEMA = {
  incident: {
    numberPrefix: 'INC',
    fields: {
      sys_id: 'string', number: 'string', short_description: 'string', description: 'string',
      state: 'integer', priority: 'integer', impact: 'integer', urgency: 'integer', category: 'string',
      assignment_group: 'reference', assigned_to: 'reference', caller_id: 'reference', active: 'boolean', opened_at: 'glide_date_time',
      hold_reason: 'integer', close_code: 'string', close_notes: 'string', work_notes: 'journal', comments: 'journal',
    },
    refs: { assignment_group: 'sys_user_group', assigned_to: 'sys_user', caller_id: 'sys_user' },
  },
  sys_user: {
    fields: { sys_id: 'string', user_name: 'string', name: 'string', email: 'string', active: 'boolean' },
    refs: {},
  },
  sys_user_group: { fields: { sys_id: 'string', name: 'string' }, refs: {} },
}

const inc = (n, short, o) => ({
  sys_id: 'inc' + n, number: 'INC00100' + String(n).padStart(2, '0'), short_description: short, description: '',
  state: '1', priority: '3', impact: '3', urgency: '3', category: 'inquiry', assignment_group: '', assigned_to: '', caller_id: 'u_abel',
  active: 'true', opened_at: '2026-11-02 09:00:00', hold_reason: '', close_code: '', close_notes: '', work_notes: '', comments: '', ...o,
})

export const INCIDENTS = [
  inc(1, 'Email is not syncing on my laptop', { state: '2', priority: '3', impact: '2', urgency: '2', category: 'software', assignment_group: 'g_desk', assigned_to: 'u_admin', opened_at: '2026-11-02 09:14:00' }),
  inc(2, 'VPN keeps disconnecting every 10 minutes', { state: '1', priority: '1', impact: '1', urgency: '1', category: 'network', assignment_group: 'g_net', caller_id: 'u_bud', opened_at: '2026-11-03 11:40:00' }),
  inc(3, 'Printer on 3rd floor is jammed', { state: '3', priority: '4', category: 'hardware', hold_reason: '4', assignment_group: 'g_hw', assigned_to: 'u_admin', caller_id: 'u_beth', opened_at: '2026-11-03 15:05:00' }),
  inc(4, 'Reports are taking 5 minutes to load', { state: '2', priority: '2', impact: '1', urgency: '2', category: 'database', assignment_group: 'g_db', caller_id: 'u_fred', opened_at: '2026-11-04 08:22:00' }),
  inc(5, 'How do I reset my password?', { state: '7', priority: '4', category: 'inquiry', close_code: 'Resolved by caller', close_notes: 'Sent the password reset link; caller confirmed login works.', assignment_group: 'g_desk', assigned_to: 'u_admin', active: 'false', opened_at: '2026-11-04 10:31:00' }),
  inc(6, 'Excel crashes when opening large files', { state: '1', priority: '4', impact: '2', urgency: '3', category: 'software', opened_at: '2026-11-05 13:48:00' }),
  inc(7, 'Network drive not accessible from Hyderabad office', { state: '1', priority: '2', impact: '2', urgency: '1', category: 'network', assignment_group: 'g_net', caller_id: 'u_bud', opened_at: '2026-11-06 09:55:00' }),
  inc(8, 'Database backup job failed overnight', { state: '2', priority: '1', impact: '1', urgency: '1', category: 'database', assignment_group: 'g_db', assigned_to: 'u_admin', caller_id: 'u_fred', opened_at: '2026-11-07 06:10:00' }),
]

export const freshDb = () => ({
  incident: INCIDENTS.map((r) => ({ ...r })),
  sys_user: USERS.map((r) => ({ ...r })),
  sys_user_group: GROUPS.map((r) => ({ ...r })),
})
