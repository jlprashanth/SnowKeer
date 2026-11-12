export const CATEGORIES = ['Inquiry / Help', 'Software', 'Hardware', 'Network', 'Database']
export const STATES = ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Canceled']
export const LEVELS = [
  { v: '1', label: '1 - High' },
  { v: '2', label: '2 - Medium' },
  { v: '3', label: '3 - Low' },
]
export const GROUPS = ['(empty)', 'Service Desk', 'Network', 'Database', 'Hardware']
export const CALLERS = ['Abel Tuter', 'Bud Richman', 'Fred Luddy', 'Beth Anglin', 'Lucius Bagnoli']

export const PRIORITY_LABEL = {
  1: '1 - Critical',
  2: '2 - High',
  3: '3 - Moderate',
  4: '4 - Low',
  5: '5 - Planning',
}

// Same idea as ServiceNow's Priority Data Lookup (Impact x Urgency)
export function computePriority(impact, urgency) {
  const i = Number(impact)
  const u = Number(urgency)
  const s = i + u
  if (s === 2) return 1
  if (s === 3) return 2
  if (s === 4) return 3
  return 4 // (2,3) (3,2) (3,3) -> 4 - Low, same as a real instance
}

export const SEED_INCIDENTS = [
  { number: 'INC0010001', caller: 'Abel Tuter', category: 'Software', short: 'Email is not syncing on my laptop', description: '', state: 'In Progress', impact: '2', urgency: '2', group: 'Service Desk', assignedTo: 'System Administrator', opened: '2026-11-02 09:14' },
  { number: 'INC0010002', caller: 'Bud Richman', category: 'Network', short: 'VPN keeps disconnecting every 10 minutes', description: '', state: 'New', impact: '1', urgency: '2', group: 'Network', assignedTo: '', opened: '2026-11-03 11:40' },
  { number: 'INC0010003', caller: 'Beth Anglin', category: 'Hardware', short: 'Printer on 3rd floor is jammed', description: '', state: 'On Hold', impact: '3', urgency: '3', group: 'Hardware', assignedTo: 'System Administrator', opened: '2026-11-03 15:05' },
  { number: 'INC0010004', caller: 'Fred Luddy', category: 'Database', short: 'Reports are taking 5 minutes to load', description: '', state: 'In Progress', impact: '1', urgency: '1', group: 'Database', assignedTo: '', opened: '2026-11-04 08:22' },
  { number: 'INC0010005', caller: 'Lucius Bagnoli', category: 'Inquiry / Help', short: 'How do I reset my password?', description: '', state: 'Resolved', impact: '3', urgency: '3', group: 'Service Desk', assignedTo: 'System Administrator', opened: '2026-11-04 10:31' },
  { number: 'INC0010006', caller: 'Abel Tuter', category: 'Software', short: 'Excel crashes when opening large files', description: '', state: 'New', impact: '2', urgency: '3', group: '(empty)', assignedTo: '', opened: '2026-11-05 13:48' },
]
