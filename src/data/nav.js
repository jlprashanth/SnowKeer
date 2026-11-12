// Mock application navigator, modelled on a real Brazil instance.
// Only Incident-related modules + Homepage open real pages for now.
const inc = (id, name, filter) => ({ id, name, route: 'incident.list', filter })

export const NAV = [
  {
    id: 'self',
    name: 'Self-Service',
    modules: [
      { id: 'home', name: 'Homepage', route: 'home' },
      { id: 'catalog', name: 'Service Catalog', route: 'soon' },
      { id: 'knowledge', name: 'Knowledge', route: 'soon' },
      inc('ss-incidents', 'Incidents', 'all'),
      { id: 'ss-watched', name: 'Watched Incidents', route: 'soon' },
    ],
  },
  {
    id: 'servicedesk',
    name: 'Service Desk',
    modules: [inc('sd-incidents', 'Incidents', 'all'), { id: 'sd-callers', name: 'Callers', route: 'soon' }],
  },
  {
    id: 'incident',
    name: 'Incident',
    modules: [
      { id: 'inc-create', name: 'Create New', route: 'incident.new' },
      inc('inc-assigned', 'Assigned to me', 'assigned'),
      inc('inc-open', 'Open', 'open'),
      inc('inc-unassigned', 'Open - Unassigned', 'unassigned'),
      inc('inc-resolved', 'Resolved', 'resolved'),
      inc('inc-all', 'All', 'all'),
    ],
  },
  {
    id: 'problem',
    name: 'Problem',
    modules: [
      { id: 'prb-create', name: 'Create New', route: 'soon' },
      { id: 'prb-open', name: 'Open', route: 'soon' },
      { id: 'prb-all', name: 'All', route: 'soon' },
    ],
  },
  {
    id: 'change',
    name: 'Change',
    modules: [
      { id: 'chg-create', name: 'Create New', route: 'soon' },
      { id: 'chg-open', name: 'Open', route: 'soon' },
      { id: 'chg-all', name: 'All', route: 'soon' },
    ],
  },
  {
    id: 'sysdef',
    name: 'System Definition',
    modules: [
      { id: 'tables', name: 'Tables', route: 'soon' },
      { id: 'dictionary', name: 'Dictionary', route: 'soon' },
      { id: 'br', name: 'Business Rules', route: 'soon' },
    ],
  },
  {
    id: 'usersgroups',
    name: 'Users and Groups',
    modules: [
      { id: 'users', name: 'Users', route: 'soon' },
      { id: 'groups', name: 'Groups', route: 'soon' },
      { id: 'roles', name: 'Roles', route: 'soon' },
    ],
  },
]
