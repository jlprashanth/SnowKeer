import { insertRow, uid, fieldsOf, sysFields } from './ops.js'

const f = (name, label, type = 'string', o = {}) => ({ name, label, type, ...o })
const C = (arr) => arr.map((a) => (Array.isArray(a) ? { v: a[0], label: a[1], dep: a[2] } : { v: a, label: a }))
const TRUEFALSE = C(['Leave alone', 'True', 'False'])
const GLOBAL = f('application', 'Application', 'string', { readonly: true, default: 'Global', help: 'Application scope. Ippatiki "Global" — ante andariki apply ayyedi (scoped apps gurinchi later nerchukuntav).' })

// Form layouts use the PDI's split items: '.begin_split' starts a 2-column area, fields before '.split' go LEFT, fields after it
// go RIGHT, '.end_split' closes it (the Form Layout slushbucket shows them as |- begin_split -|, |- split -|, |- end_split -|).
// Incident State values = her PDI's choice values (stored value, not the label).
const state = C([['1', 'New'], ['2', 'In Progress'], ['3', 'On Hold'], ['6', 'Resolved'], ['7', 'Closed'], ['8', 'Canceled']])
const level = C([['1', '1 - High'], ['2', '2 - Medium'], ['3', '3 - Low']])
const prio = C([['1', '1 - Critical'], ['2', '2 - High'], ['3', '3 - Moderate'], ['4', '4 - Low'], ['5', '5 - Planning']])

const incidentFields = [
  f('number', 'Number', 'string', { readonly: true, calc: 'number', tip: 'fNumber' }),
  f('caller_id', 'Caller', 'reference', { ref: 'sys_user', mandatory: true, tip: 'fCaller' }),
  f('category', 'Category', 'choice', {
    default: 'inquiry', tip: 'fCategory',
    choices: C([['inquiry', 'Inquiry'], ['software', 'Software'], ['hardware', 'Hardware'], ['network', 'Network'], ['database', 'Database']]),
  }),
  f('subcategory', 'Subcategory', 'choice', {
    dependent: 'category',
    help: 'Subcategory "Category" meeda depend avtundi (Dependent field). Category marchithe ee list maripothundi.',
    choices: C([
      ['email', 'Email', 'software'], ['os', 'Operating System', 'software'],
      ['cpu', 'CPU', 'hardware'], ['disk', 'Disk', 'hardware'], ['keyboard', 'Keyboard', 'hardware'], ['monitor', 'Monitor', 'hardware'],
      ['dns', 'DNS', 'network'], ['ip', 'IP Address', 'network'], ['vpn', 'VPN', 'network'],
      ['internal', 'Internal Application', 'inquiry'], ['antivirus', 'Antivirus', 'inquiry'],
      ['db2', 'DB2', 'database'], ['sql', 'MS SQL Server', 'database'], ['oracle', 'Oracle', 'database'],
    ]),
  }),
  f('service', 'Service', 'reference', { ref: null }),
  f('service_offering', 'Service offering', 'reference', { ref: null }),
  f('cmdb_ci', 'Configuration item', 'reference', { ref: null }),
  f('channel', 'Channel', 'choice', { tip: 'fChannel', choices: C([['phone', 'Phone'], ['email', 'Email'], ['self-service', 'Self-service'], ['walk-in', 'Walk-in']]) }),
  f('state', 'State', 'choice', { default: '1', tip: 'fState', choices: state }),
  f('impact', 'Impact', 'choice', { default: '3', tip: 'fImpact', choices: level }),
  f('urgency', 'Urgency', 'choice', { default: '3', tip: 'fUrgency', choices: level }),
  f('priority', 'Priority', 'choice', { readonly: true, calc: 'priority', labelLink: true, dot1: true, tip: 'fPriority', default: '4', choices: prio }),
  f('assignment_group', 'Assignment group', 'reference', { ref: 'sys_user_group', tip: 'fGroup' }),
  f('assigned_to', 'Assigned to', 'reference', { ref: 'sys_user' }),
  f('short_description', 'Short description', 'string', { mandatory: true, tip: 'fShort' }),
  f('description', 'Description', 'longtext', { tip: 'fDescription' }),
  f('watch_list', 'Watch list', 'lockbox'),
  f('work_notes_list', 'Work notes list', 'lockbox'),
  f('comments', 'Additional comments', 'longtext'),
  f('work_notes', 'Work notes', 'longtext', { yellow: true }),
  f('parent_incident', 'Parent Incident', 'reference', { ref: null }),
  f('problem_id', 'Problem', 'reference', { ref: null }),
  f('close_code', 'Resolution code', 'choice', {
    // value = label pairs as seen in her PDI (a few of the choices)
    choices: C([
      ['Duplicate', 'Duplicate'], ['Known error', 'Known error'], ['Resolved by caller', 'Resolved – Fixed by Caller'],
      ['Workaround provided', 'Resolved – Workaround Applied'], ['Resolved by problem', 'Resolved – Fixed by Problem'],
    ]),
  }),
  f('close_notes', 'Resolution notes', 'longtext'),
  f('opened_at', 'Opened', 'datetime', { hidden: true }),
  f('sys_updated_on', 'Updated', 'datetime', { hidden: true }),
  f('sys_updated_by', 'Updated by', 'string', { hidden: true }),
  f('active', 'Active', 'boolean', { hidden: true, default: true }),
]

const incidentLayout = [
  {
    name: 'Incident',
    fields: ['.begin_split', 'number', 'caller_id', 'category', 'subcategory', 'service', 'service_offering', 'cmdb_ci', '.split', 'channel', 'state', 'impact', 'urgency', 'priority', 'assignment_group', 'assigned_to', '.end_split', 'short_description', 'description'],
  },
  { name: 'Notes', fields: ['.begin_split', 'watch_list', '.split', 'work_notes_list', '.end_split', 'comments', 'work_notes'] },
  { name: 'Related Records', fields: ['.begin_split', 'parent_incident', '.split', 'problem_id', '.end_split'] },
  { name: 'Resolution Information', fields: ['close_code', 'close_notes'] },
]

const sys = (name, label, fields, extra = {}) => ({ name, label, extends: null, system: true, fields, layouts: {}, ...extra })

const policyBase = [
  f('table', 'Table', 'reference', { ref: 'sys_db_object', mandatory: true, help: 'Ee policy e table ki apply avvali? (Ex: Incident).' }),
  GLOBAL,
]

export const TABLES = () => ({
  incident: {
    name: 'incident', label: 'Incident', extends: null, system: true, display: 'number', listTitle: 'Incidents',
    autoNumber: { prefix: 'INC', start: 10001 },
    fields: incidentFields,
    layouts: { default: incidentLayout, ess: [{ name: 'Incident', fields: ['number', 'caller_id', 'state', 'short_description', 'description'] }] },
    listCols: ['number', 'opened_at', 'short_description', 'caller_id', 'priority', 'state', 'category', 'assignment_group', 'assigned_to', 'sys_updated_on', 'sys_updated_by'],
    sort: ['state', '-number'],
    buttons: ['Resolve'],
    relatedSearch: true,
    // incident extends Task in the PDI: Insert / Insert and Stay are hidden; the "Process Flow" formatter is available.
    // Process Flow stages are sys_process_flow records (none for incident in her PDI).
    task: true,
  },
  sys_user: sys('sys_user', 'User', [
    f('user_name', 'User ID', 'string', { mandatory: true, help: 'Login ki use chese unique ID.' }),
    f('first_name', 'First name'),
    f('last_name', 'Last name'),
    f('name', 'Name', 'string', { readonly: true, calc: 'fullname', hidden: true }),
    f('title', 'Title'),
    f('department', 'Department'),
    f('email', 'Email'),
    f('active', 'Active', 'boolean', { default: true }),
  ], {
    display: 'name', listTitle: 'Users',
    layouts: { default: [{ name: 'User', fields: ['.begin_split', 'user_name', 'first_name', 'last_name', 'title', '.split', 'department', 'email', 'active', '.end_split'] }] },
    listCols: ['user_name', 'name', 'email', 'title', 'department', 'active'],
    related: [{ title: 'Roles', slush: 'roles', source: 'sys_user_role' }, { title: 'Groups', slush: 'groups', source: 'sys_user_group' }],
  }),
  sys_user_group: sys('sys_user_group', 'Group', [
    f('name', 'Name', 'string', { mandatory: true }),
    f('manager', 'Manager', 'reference', { ref: 'sys_user' }),
    f('email', 'Group email'),
    f('description', 'Description', 'longtext'),
  ], {
    display: 'name', listTitle: 'Groups',
    layouts: { default: [{ name: 'Group', fields: ['.begin_split', 'name', 'manager', '.split', 'email', '.end_split', 'description'] }] },
    listCols: ['name', 'manager', 'email', 'description'],
    related: [{ title: 'Roles', slush: 'roles', source: 'sys_user_role' }],
  }),
  sys_user_role: sys('sys_user_role', 'Role', [
    f('name', 'Name', 'string', { mandatory: true }),
    f('description', 'Description', 'longtext'),
  ], { display: 'name', listTitle: 'Roles', listCols: ['name', 'description'] }),
  sys_db_object: sys('sys_db_object', 'Table', [
    f('label', 'Label', 'string', { mandatory: true, help: 'Table peru (users ki kanipinchedi). Ex: "Training Request".' }),
    f('name', 'Name', 'string', { readonly: true, mandatory: true, calc: 'tablename', help: 'Database lo asalu table name. Label nundi auto ga vastundi — "u_" prefix tho (custom table ani artham).' }),
    f('extends', 'Extends table', 'reference', { ref: 'sys_db_object', help: 'Parent table. Idi select chesthe parent columns anni inherit avtayi (Child tables lecture lo nerchukuntav). "Extensible" tick unna tables matrame ikkada vastayi.' }),
    f('is_extendable', 'Extensible', 'boolean', { default: false, help: 'Tick chesthe vere tables ee table ni extend cheyyochu (child tables). Tick lekapothe "Extends table" lo ee table raadu. (Real PDI lo Table form "Controls" tab lo untundi.)' }),
    GLOBAL,
    f('create_module', 'Create module', 'boolean', { default: true, help: 'Check chesthe, navigator lo ee table ki module (shortcut) auto ga create avtundi.' }),
    f('create_mobile_module', 'Create mobile module', 'boolean', { default: true }),
    f('menu', 'Add module to menu', 'choice', { default: '-- Create new --', help: 'Ee modules e application menu lo vellali? Kotha menu kavali ante "-- Create new --".', choices: [{ v: '-- Create new --', label: '-- Create new --' }] }),
    f('new_menu', 'New menu name', 'string', { help: 'Kotha menu peru. Ex: "Training".' }),
    f('remote_table', 'Remote Table', 'boolean'),
    f('auto_number', 'Auto number', 'boolean', { help: 'Check chesthe, prathi record ki unique number vastundi — Prefix + number (TRQ0000001 laaga).' }),
    f('number_prefix', 'Prefix', 'string', { help: 'Auto number prefix. Ex: "TRQ" → TRQ0000001. (Real PDI lo idi kuda "Controls" tab lo, Auto-number kinda untundi.)' }),
  ], {
    display: 'label', listTitle: 'Tables',
    layouts: { default: [{ name: 'Table', fields: ['.begin_split', 'label', 'name', 'extends', 'is_extendable', 'auto_number', 'number_prefix', '.split', 'application', 'create_module', 'create_mobile_module', 'menu', 'new_menu', 'remote_table', '.end_split'] }] },
    listCols: ['label', 'name', 'extends', 'application'],
    related: [{ title: 'Columns', dict: true }],
  }),
  sys_app_application: sys('sys_app_application', 'Application Menu', [
    f('title', 'Title', 'string', { mandatory: true, help: 'Navigator lo kanipinche application peru.' }),
    f('order', 'Order', 'integer', { default: 100, help: 'Chinna number mundu vastundi (100, 200...).' }),
    f('roles', 'Roles', 'string', { help: 'E role unna vallaki ee menu kanipistundi. Empty ante andariki.' }),
    f('active', 'Active', 'boolean', { default: true }),
    f('hint', 'Hint'),
    GLOBAL,
  ], {
    display: 'title', listTitle: 'Application Menus',
    layouts: { default: [{ name: 'Application Menu', fields: ['.begin_split', 'title', 'order', 'roles', '.split', 'application', 'active', 'hint', '.end_split'] }] },
    listCols: ['title', 'order', 'roles', 'active'],
    related: [{ title: 'Modules', table: 'sys_app_module', field: 'application', fieldInParent: 'title' }],
  }),
  sys_app_module: sys('sys_app_module', 'Module', [
    f('title', 'Title', 'string', { mandatory: true, help: 'Navigator lo kanipinche module peru.' }),
    f('application', 'Application menu', 'reference', { ref: 'sys_app_application', mandatory: true, help: 'E application menu kinda ee module undali.' }),
    f('order', 'Order', 'integer', { default: 100 }),
    f('link_type', 'Link type', 'choice', {
      default: 'List of Records',
      help: 'Module click chesthe em avvali? List of Records = table list; New Record = empty form.',
      choices: C(['List of Records', 'New Record', 'Homepage']),
    }),
    f('table', 'Table', 'reference', { ref: 'sys_db_object', help: 'Ee module e table ni chupinchali.' }),
    f('filter', 'Filter', 'string', { help: 'Optional filter (encoded query). Ex: priority=1^state=New  — "^" ante AND.' }),
    f('active', 'Active', 'boolean', { default: true }),
    f('roles', 'Roles'),
  ], {
    display: 'title', listTitle: 'Modules',
    layouts: { default: [{ name: 'Module', fields: ['.begin_split', 'title', 'application', 'order', 'link_type', '.split', 'table', 'filter', 'roles', 'active', '.end_split'] }] },
    listCols: ['title', 'application', 'order', 'link_type', 'table', 'filter'],
  }),
  sys_ui_policy: sys('sys_ui_policy', 'UI Policy', [
    ...policyBase,
    f('short_description', 'Short description', 'string', { mandatory: true }),
    f('active', 'Active', 'boolean', { default: true }),
    f('order', 'Order', 'integer', { default: 100 }),
    f('conditions', 'Conditions', 'terms', { ofTable: 'table', help: 'Ee condition true ayithe matrame policy actions apply avtayi.' }),
    f('global', 'Global', 'boolean', { default: true, help: 'Check chesthe anni form views ki apply avtundi.' }),
    f('on_load', 'On load', 'boolean', { default: true, help: 'Form open ayyinappude kuda policy run avvali ante check cheyyi.' }),
    f('reverse', 'Reverse if false', 'boolean', { default: true, help: 'Condition false ayithe actions ni reverse chestundi (Mandatory → not mandatory ila).' }),
    f('inherit', 'Inherit', 'boolean', { help: 'Child tables ki kuda apply avvali ante check cheyyi.' }),
  ], {
    display: 'short_description', listTitle: 'UI Policies',
    layouts: {
      default: [
        { name: 'UI Policy', fields: ['.begin_split', 'table', 'short_description', 'order', '.split', 'application', 'active', '.end_split'] },
        { name: 'When to Apply', fields: ['.begin_split', 'conditions', 'global', 'reverse', '.split', 'on_load', 'inherit', '.end_split'] },
      ],
    },
    listCols: ['short_description', 'table', 'active', 'order', 'on_load', 'reverse'],
    related: [{ title: 'UI Policy Actions', table: 'sys_ui_policy_action', field: 'ui_policy', fieldInParent: 'short_description' }],
  }),
  sys_ui_policy_action: sys('sys_ui_policy_action', 'UI Policy Action', [
    f('ui_policy', 'UI policy', 'reference', { ref: 'sys_ui_policy', mandatory: true }),
    f('field_name', 'Field name', 'fieldname', { ofTable: 'ui_policy', mandatory: true, help: 'E field meeda action apply avvali.' }),
    f('mandatory', 'Mandatory', 'choice', { default: 'Leave alone', choices: TRUEFALSE, help: 'True = field mandatory (red ∗).' }),
    f('visible', 'Visible', 'choice', { default: 'Leave alone', choices: TRUEFALSE, help: 'False = field hide avtundi.' }),
    f('readonly', 'Read only', 'choice', { default: 'Leave alone', choices: TRUEFALSE, help: 'True = field edit cheyalem (grey).' }),
  ], {
    display: 'field_name', listTitle: 'UI Policy Actions',
    layouts: { default: [{ name: 'UI Policy Action', fields: ['.begin_split', 'ui_policy', 'field_name', '.split', 'mandatory', 'visible', 'readonly', '.end_split'] }] },
    listCols: ['ui_policy', 'field_name', 'mandatory', 'visible', 'readonly'],
  }),
  sys_data_policy2: sys('sys_data_policy2', 'Data Policy', [
    f('table', 'Table', 'reference', { ref: 'sys_db_object', mandatory: true }),
    f('inherit', 'Inherit', 'boolean'),
    f('reverse', 'Reverse if false', 'boolean', { default: true }),
    f('active', 'Active', 'boolean', { default: true }),
    GLOBAL,
    f('apply_import_set', 'Apply to import sets', 'boolean', { default: true, help: 'Import Set nundi data vachinappudu kuda policy apply avtundi.' }),
    f('apply_soap', 'Apply to SOAP', 'boolean', { default: true, help: 'Web service (SOAP/REST) tho data vachinappudu kuda apply avtundi.' }),
    f('use_ui', 'Use as UI Policy on client', 'boolean', { default: true, help: 'Check chesthe form lo kuda (client side) ee policy UI Policy laaga panichestundi. Uncheck chesthe server lo matrame enforce avtundi.' }),
    f('short_description', 'Short description', 'string', { mandatory: true }),
    f('description', 'Description', 'longtext'),
    f('conditions', 'Conditions', 'terms', { ofTable: 'table' }),
  ], {
    display: 'short_description', listTitle: 'Data Policies',
    layouts: { default: [{ name: 'Data Policy', fields: ['.begin_split', 'table', 'inherit', 'reverse', 'active', '.split', 'application', 'apply_import_set', 'apply_soap', 'use_ui', '.end_split', 'short_description', 'description', 'conditions'] }] },
    listCols: ['short_description', 'table', 'active', 'use_ui', 'apply_import_set'],
    related: [{ title: 'Data Policy Rules', table: 'sys_data_policy_rule', field: 'data_policy', fieldInParent: 'short_description' }],
  }),
  sys_data_policy_rule: sys('sys_data_policy_rule', 'Data Policy Rule', [
    f('data_policy', 'Data policy', 'reference', { ref: 'sys_data_policy2', mandatory: true }),
    f('field_name', 'Table field', 'fieldname', { ofTable: 'data_policy', mandatory: true }),
    f('mandatory', 'Mandatory', 'choice', { default: 'Leave alone', choices: TRUEFALSE }),
    f('disabled', 'Read only', 'choice', { default: 'Leave alone', choices: TRUEFALSE }),
  ], {
    display: 'field_name', listTitle: 'Data Policy Rules',
    layouts: { default: [{ name: 'Rule', fields: ['.begin_split', 'data_policy', 'field_name', '.split', 'mandatory', 'disabled', '.end_split'] }] },
    listCols: ['data_policy', 'field_name', 'mandatory', 'disabled'],
  }),
  sys_update_set: sys('sys_update_set', 'Update Set', [
    f('name', 'Name', 'string', { mandatory: true, help: 'Update set ki peru — em change chestunnaavo adi cheppe peru.' }),
    f('state', 'State', 'choice', { default: 'In progress', choices: C(['In progress', 'Complete', 'Ignore']), help: '"In progress" lo unnappude changes capture avtayi. Complete chesthe lock avtundi (export cheyochu).' }),
    f('parent', 'Parent', 'reference', { ref: 'sys_update_set' }),
    f('release_date', 'Release date'),
    f('description', 'Description', 'longtext'),
    GLOBAL,
  ], {
    display: 'name', listTitle: 'Update Sets',
    layouts: { default: [{ name: 'Update Set', fields: ['.begin_split', 'name', 'state', 'parent', 'release_date', '.split', 'application', '.end_split', 'description'] }] },
    listCols: ['name', 'state', 'application', 'sys_updated_on'],
    buttons: ['Submit and Make Current'],
    related: [{ title: 'Customer Updates', table: 'sys_update_xml', field: 'update_set', fieldInParent: 'name', readonlyList: true }],
  }),
  sys_update_xml: sys('sys_update_xml', 'Customer Update', [
    f('update_set', 'Update set', 'reference', { ref: 'sys_update_set' }),
    f('name', 'Name'),
    f('type', 'Type'),
    f('target_name', 'Target name'),
    f('action', 'Action'),
    f('sys_created_on', 'Created', 'datetime'),
  ], { display: 'target_name', listTitle: 'Customer Updates', listCols: ['type', 'target_name', 'action', 'sys_created_on'] }),
  sys_ui_view: sys('sys_ui_view', 'View', [
    f('name', 'Name', 'string', { mandatory: true, help: 'View ki internal peru (chinna letters, spaces lekunda). Ex: trainee' }),
    f('title', 'Title', 'string', { mandatory: true, help: 'Users ki kanipinche peru. Ex: Trainee view' }),
  ], { display: 'title', listTitle: 'Views', listCols: ['title', 'name'] }),
  sys_ui_view_rule: sys('sys_ui_view_rule', 'View Rule', [
    f('name', 'Name', 'string', { mandatory: true }),
    f('table', 'Table', 'reference', { ref: 'sys_db_object', mandatory: true }),
    f('view', 'View', 'reference', { ref: 'sys_ui_view', mandatory: true, help: 'Condition match ayithe e view tho form open avvali.' }),
    f('active', 'Active', 'boolean', { default: true }),
    f('conditions', 'Conditions', 'terms', { ofTable: 'table', help: 'Ee condition match ayithe automatic ga ee view open avtundi.' }),
  ], {
    display: 'name', listTitle: 'View Rules',
    layouts: { default: [{ name: 'View Rule', fields: ['name', 'table', 'view', 'active', 'conditions'] }] },
    listCols: ['name', 'table', 'view', 'active'],
  }),
  // System UI > Process Flow: one record per stage. The form formatter only DISPLAYS them (see ops.flowStages).
  sys_process_flow: sys('sys_process_flow', 'Process Flow', [
    f('table', 'Table', 'reference', { ref: 'sys_db_object', mandatory: true, help: 'E table form lo ee stage kanipinchali. Ex: Incident' }),
    f('label', 'Label', 'string', { mandatory: true, help: 'Chevron (stage) lo kanipinche peru. Ex: In Progress' }),
    f('order', 'Order', 'integer', { default: 100, help: 'Chinna Order = left side (mundu) stage.' }),
    f('active', 'Active', 'boolean', { default: true }),
    GLOBAL,
    f('condition', 'Condition', 'terms', { ofTable: 'table', help: 'Record ki ee condition match ayithe ee stage highlight (current) avtundi. Ex: State is In Progress' }),
    f('description', 'Description', 'longtext'),
  ], {
    display: 'label', listTitle: 'Process Flows',
    layouts: { default: [{ name: 'Process Flow', fields: ['.begin_split', 'table', 'label', 'order', '.split', 'application', 'active', '.end_split', 'condition', 'description'] }] },
    listCols: ['label', 'table', 'order', 'active'],
    sort: ['order'],
  }),
  sysrule_assignment: sys('sysrule_assignment', 'Assignment Rule', [
    f('name', 'Name', 'string', { mandatory: true }),
    f('table', 'Table', 'reference', { ref: 'sys_db_object', mandatory: true }),
    f('active', 'Active', 'boolean', { default: true }),
    f('conditions', 'Conditions', 'terms', { ofTable: 'table', help: 'Ee conditions match ayithe incident auto ga group ki assign avtundi.' }),
    f('assignment_group', 'Assignment group', 'reference', { ref: 'sys_user_group', help: 'Match ayinappudu e group ki assign cheyali.' }),
  ], {
    display: 'name', listTitle: 'Assignment Rules',
    layouts: { default: [{ name: 'Assignment Rule', fields: ['name', 'table', 'active', 'conditions', 'assignment_group'] }] },
    listCols: ['name', 'table', 'assignment_group', 'active'],
  }),
  dl_definition: sys('dl_definition', 'Data Lookup Definition', [
    f('name', 'Name', 'string', { mandatory: true }),
    f('source_table', 'Source table', 'string'),
    f('matcher_table', 'Matcher table', 'string'),
    f('active', 'Active', 'boolean', { default: true, help: 'Uncheck chesthe Priority auto-calculate avvadam aagipothundi.' }),
    f('on_form_change', 'Run on form change', 'boolean', { default: true }),
  ], {
    display: 'name', listTitle: 'Data Lookup Definitions',
    layouts: { default: [{ name: 'Definition', fields: ['name', 'source_table', 'matcher_table', 'active', 'on_form_change'] }] },
    listCols: ['name', 'source_table', 'matcher_table', 'active'],
  }),
  dl_u_priority: sys('dl_u_priority', 'Priority Data Lookup Rule', [
    f('impact', 'Impact', 'choice', { mandatory: true, choices: level }),
    f('urgency', 'Urgency', 'choice', { mandatory: true, choices: level }),
    f('priority', 'Priority', 'choice', { mandatory: true, choices: prio, help: 'Ee Impact + Urgency combination ki e Priority ravali.' }),
    f('order', 'Order', 'integer', { default: 100 }),
  ], {
    display: 'priority', listTitle: 'Priority Data Lookup Rules',
    layouts: { default: [{ name: 'Rule', fields: ['impact', 'urgency', 'priority', 'order'] }] },
    listCols: ['impact', 'urgency', 'priority', 'order'],
  }),
})

const mk = (title, application, link_type, table = '', filter = '', order = 100) => ({
  sys_id: uid(), sys_class_name: 'sys_app_module', title, application, order, link_type, table, filter, active: true,
})

export function buildSeed({ withTraining = true } = {}) {
  const d = { tables: TABLES(), rows: {}, favorites: [], currentSet: 'Default' }
  const menus = [
    ['Self-Service', 10], ['Service Desk', 20], ['Incident', 30], ['Problem', 40], ['Change', 50],
    ['System Definition', 100], ['System UI', 110], ['System Policy', 120], ['System Update Sets', 130], ['User Administration', 140],
  ]
  d.rows.sys_app_application = menus.map(([title, order]) => ({ sys_id: uid(), sys_class_name: 'sys_app_application', title, order, active: true, application: 'Global' }))
  d.rows.sys_app_module = [
    mk('Homepage', 'Self-Service', 'Homepage', '', '', 10),
    mk('Service Catalog', 'Self-Service', 'x', '', '', 20),
    mk('Knowledge', 'Self-Service', 'x', '', '', 30),
    mk('Incidents', 'Self-Service', 'List of Records', 'Incident', '', 40),
    mk('Watched Incidents', 'Self-Service', 'x', '', '', 50),
    mk('Incidents', 'Service Desk', 'List of Records', 'Incident', '', 10),
    mk('Callers', 'Service Desk', 'x', '', '', 20),
    mk('Create New', 'Incident', 'New Record', 'Incident', '', 10),
    mk('Assigned to me', 'Incident', 'List of Records', 'Incident', 'active=true^assigned_to=@me', 20),
    mk('Open', 'Incident', 'List of Records', 'Incident', 'active=true', 30),
    mk('Open - Unassigned', 'Incident', 'List of Records', 'Incident', 'active=true^assigned_toISEMPTY', 40),
    mk('Resolved', 'Incident', 'List of Records', 'Incident', 'state=6', 50),
    mk('All', 'Incident', 'List of Records', 'Incident', '', 60),
    mk('Create New', 'Problem', 'x'), mk('Open', 'Problem', 'x'), mk('All', 'Problem', 'x'),
    mk('Create New', 'Change', 'x'), mk('Open', 'Change', 'x'), mk('All', 'Change', 'x'),
    mk('Tables', 'System Definition', 'List of Records', 'Table', '', 10),
    mk('Business Rules', 'System Definition', 'x', '', '', 20),
    mk('UI Policies', 'System UI', 'List of Records', 'UI Policy', '', 10),
    mk('Views', 'System UI', 'List of Records', 'View', '', 20),
    mk('View Rules', 'System UI', 'List of Records', 'View Rule', '', 30),
    mk('Process Flow', 'System UI', 'List of Records', 'Process Flow', '', 40),
    mk('Data Policies', 'System Policy', 'List of Records', 'Data Policy', '', 10),
    mk('Data Lookup Definitions', 'System Policy', 'List of Records', 'Data Lookup Definition', '', 20),
    mk('Priority Lookup Rules', 'System Policy', 'List of Records', 'Priority Data Lookup Rule', '', 30),
    // module title in her PDI is just "Assignment" (it opens the Assignment Rules list)
    mk('Assignment', 'System Policy', 'List of Records', 'Assignment Rule', '', 40),
    mk('Local Update Sets', 'System Update Sets', 'List of Records', 'Update Set', '', 10),
    mk('Retrieved Update Sets', 'System Update Sets', 'x', '', '', 20),
    mk('Application Menus', 'System Definition', 'List of Records', 'Application Menu', '', 30),
    mk('Modules', 'System Definition', 'List of Records', 'Module', '', 40),
    mk('Users', 'User Administration', 'List of Records', 'User', '', 10),
    mk('Groups', 'User Administration', 'List of Records', 'Group', '', 20),
    mk('Roles', 'User Administration', 'List of Records', 'Role', '', 30),
  ]

  // base data
  ;[
    ['admin', 'System', 'Administrator', 'IT Manager'], ['abel.tuter', 'Abel', 'Tuter', 'Engineer'], ['bud.richman', 'Bud', 'Richman', 'Analyst'],
    ['fred.luddy', 'Fred', 'Luddy', 'Architect'], ['beth.anglin', 'Beth', 'Anglin', 'Support'], ['lucius.bagnoli', 'Lucius', 'Bagnoli', 'Support'],
  ].forEach(([u, fn, ln, title], i) =>
    insertRow(d, 'sys_user', { user_name: u, first_name: fn, last_name: ln, title, email: `${u}@example.com`, department: i % 2 ? 'IT' : 'Operations', active: true, roles: i === 0 ? ['admin', 'itil'] : [], groups: [] }, { silent: true }),
  )
  ;['Service Desk', 'Network', 'Database', 'Hardware', 'Software'].forEach((n) => insertRow(d, 'sys_user_group', { name: n, description: n + ' team', roles: [] }, { silent: true }))
  ;['admin', 'itil', 'catalog_admin', 'knowledge', 'approver_user', 'report_admin'].forEach((n) => insertRow(d, 'sys_user_role', { name: n, description: n + ' role' }, { silent: true }))

  d.rows.sys_ui_view = [
    { sys_id: uid(), sys_class_name: 'sys_ui_view', name: 'ess', title: 'Self Service' },
    { sys_id: uid(), sys_class_name: 'sys_ui_view', name: 'advanced', title: 'Advanced' },
  ]
  d.rows.sys_update_set = [{ sys_id: uid(), sys_class_name: 'sys_update_set', name: 'Default', state: 'In progress', application: 'Global', description: 'Default update set' }]
  d.rows.sys_update_xml = []
  d.rows.dl_definition = [{ sys_id: uid(), sys_class_name: 'dl_definition', name: 'Priority Data Lookup', source_table: 'incident', matcher_table: 'dl_u_priority', active: true, on_form_change: true }]
  d.rows.dl_u_priority = [
    [1, 1, 1], [1, 2, 2], [1, 3, 3], [2, 1, 2], [2, 2, 3], [2, 3, 4], [3, 1, 3], [3, 2, 4], [3, 3, 4],
  ].map(([i, u, p], n) => ({ sys_id: uid(), sys_class_name: 'dl_u_priority', impact: String(i), urgency: String(u), priority: String(p), order: 100 + n }))
  // her PDI has 0 Process Flow records for incident; lessons that need stages add them in their own setup()
  ;['sys_ui_policy', 'sys_ui_policy_action', 'sys_data_policy2', 'sys_data_policy_rule', 'sys_ui_view_rule', 'sysrule_assignment', 'sys_process_flow'].forEach((t) => (d.rows[t] = []))

  // state = stored choice value: 1 New, 2 In Progress, 3 On Hold, 6 Resolved
  const inc = [
    ['INC0010001', 'Abel Tuter', 'software', 'Email is not syncing on my laptop', '2', '2', '2', 'Service Desk', 'System Administrator', '2026-11-02 09:14:00'],
    ['INC0010002', 'Bud Richman', 'network', 'VPN keeps disconnecting every 10 minutes', '1', '1', '2', 'Network', '', '2026-11-03 11:40:00'],
    ['INC0010003', 'Beth Anglin', 'hardware', 'Printer on 3rd floor is jammed', '3', '3', '3', 'Hardware', 'System Administrator', '2026-11-03 15:05:00'],
    ['INC0010004', 'Fred Luddy', 'database', 'Reports are taking 5 minutes to load', '2', '1', '1', 'Database', '', '2026-11-04 08:22:00'],
    ['INC0010005', 'Lucius Bagnoli', 'inquiry', 'How do I reset my password?', '6', '3', '3', 'Service Desk', 'System Administrator', '2026-11-04 10:31:00'],
    ['INC0010006', 'Abel Tuter', 'software', 'Excel crashes when opening large files', '1', '2', '3', '', '', '2026-11-05 13:48:00'],
  ]
  inc.forEach(([number, caller_id, category, short_description, st, impact, urgency, assignment_group, assigned_to, opened_at]) => {
    const r = insertRow(d, 'incident', { number, caller_id, category, short_description, state: st, impact, urgency, assignment_group, assigned_to, opened_at }, { silent: true })
    r.sys_updated_on = opened_at
  })

  if (withTraining) addTraining(d)
  return d
}

export function addTraining(d) {
  d.tables.u_training_request = {
    name: 'u_training_request', label: 'Training Request', extends: null, custom: true, display: 'number', listTitle: 'Training Requests',
    autoNumber: { prefix: 'TRQ', start: 1 }, layouts: {},
    fields: [
      f('number', 'Number', 'string', { readonly: true, calc: 'number' }),
      f('u_course_name', 'Course name', 'string', { help: 'Em course training kavali.' }),
      f('u_topic', 'Topic', 'choice', { choices: C([['cloud', 'Cloud'], ['devops', 'DevOps'], ['security', 'Security']]), help: 'Training topic.' }),
      f('u_tool', 'Tool', 'choice', {
        dependent: 'u_topic',
        help: 'Idi Topic meeda depend avtundi (Dependent). Topic select chesthe, daani tools matrame vastayi.',
        choices: C([['aws', 'AWS', 'cloud'], ['azure', 'Azure', 'cloud'], ['docker', 'Docker', 'devops'], ['jenkins', 'Jenkins', 'devops'], ['iam', 'IAM', 'security'], ['siem', 'SIEM', 'security']]),
      }),
      f('u_status', 'Status', 'choice', { default: 'planned', choices: C([['planned', 'Planned'], ['ongoing', 'Ongoing'], ['done', 'Completed']]) }),
      f('u_trainer', 'Trainer', 'reference', { ref: 'sys_user' }),
      f('u_notes', 'Notes', 'longtext'),
      ...sysFields(),
    ],
    listCols: ['number', 'u_course_name', 'u_topic', 'u_tool', 'u_status', 'u_trainer'],
  }
  d.rows.u_training_request = []
  ;[['Docker basics', 'devops', 'docker', 'planned', 'Abel Tuter'], ['AWS fundamentals', 'cloud', 'aws', 'ongoing', 'Beth Anglin'], ['IAM deep dive', 'security', 'iam', 'done', '']].forEach(
    ([c, t, tool, s, tr]) => insertRow(d, 'u_training_request', { u_course_name: c, u_topic: t, u_tool: tool, u_status: s, u_trainer: tr }, { silent: true }),
  )
  d.rows.sys_app_application.push({ sys_id: uid(), sys_class_name: 'sys_app_application', title: 'Training', order: 150, active: true, application: 'Global' })
  d.rows.sys_app_module.push(mk('Create New', 'Training', 'New Record', 'Training Request', '', 10), mk('All', 'Training', 'List of Records', 'Training Request', '', 20))
}

export const hasFields = (d, t) => fieldsOf(d, t).length
