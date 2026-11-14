import { info, click, type, has, eq, len, yes, goTo, q } from './lessonKit.js'

const trainingForm = { name: 'form', table: 'u_training_request', isNew: true, k: 1 }
// navigator shortcut: table_name.do = new form, table_name.list = list
const openForm = (what, shortcut) => [
  click('btn-all', `"All" click cheyyi — ${what} kosam.`),
  type('nav-filter', `Filter lo "${shortcut}" ani type cheyyi (shortcut).`, has(shortcut), shortcut, { hint: `"${shortcut}" ani type cheyyi.` }),
  click('nav-shortcut', `Highlight chesina "Open ${shortcut}" click cheyyi.`),
]

/* 7 — Form design & sections */
const formDesign = {
  id: 'form-design', title: 'Form Design & Form Sections', video: 'Form Design & Form Sections', duration: '44:32',
  blurb: 'Form Layout lo fields order marchadam, kotha section (tab) create cheyyadam.',
  start: trainingForm,
  steps: [
    info('Ee lesson lo form ni mana ishtam vachinattu design chestam — oka field ni inkoka section (tab) ki teesukelatham. Idi "Training Request" form. Next click cheyyi.'),
    info('Ippudu anni fields okate section lo unnayi. Notes ni vere tab ki pedadam. Mundu form menu ☰ open cheddam.', 'main-section'),
    click('f-menu', 'Form paina unna ☰ (menu) click cheyyi.'),
    click('menu-cfg-layout', '"Configure" kinda "Form Layout" click cheyyi. (Nee PDI lo ☰ → Configure lo "Form Builder", "Form Design" (drag & drop designers) & "Form Layout" (ee slushbucket) moodu untayi. Form Builder navigator module inactive — kani ee Configure menu nundi open avtundi.)'),
    info('Idi Form Layout page — admin lu ikkade forms design chestaru. "Section" dropdown lo form sections, kinda slushbucket lo fields (Available ↔ Selected).', 'layout-section'),
    type('fl-right', 'Right (Selected) lo "Notes" select cheyyi — ee section nundi teesestam.', eq('Notes'), 'Notes', { hint: '"Notes" meeda click cheyyi.', okText: 'Ippudu ◀ click cheyyi.' }),
    click('fl-remove', '◀ click cheyyi — Notes Available ki vachindi.'),
    click('fl-save', '"Save" click cheyyi.'),
    info('Save ayyindi. Ippudu Notes ee form lo ledu. Kotha section create chesi andulo petta.', 'layout-ok'),
    type('layout-newsec', '"New section" lo "More details" ani rayyi.', has('more'), 'More details'),
    click('layout-addsec', '"Add section" click cheyyi.'),
    type('fl-left', 'Ippudu left (Available) lo "Notes" select cheyyi.', eq('Notes'), 'Notes', { hint: '"Notes" meeda click cheyyi.', okText: 'Ippudu ▶ click cheyyi.' }),
    click('fl-add', '▶ click cheyyi.'),
    click('fl-save', '"Save" click cheyyi.'),
    click('layout-open-form', '"Open form" click cheyyi — form ela undo chuddam.'),
    info('Chusava! Form kinda "More details" ane kotha tab vachindi. (Real lo kuda form kinda tabs laaga untayi.)', 'form-tabs'),
    click('tab-more-details', '"More details" tab click cheyyi.'),
    info('Notes field ikkada undi ✅ Gurtu pettuko: Form Layout Available list lo "|- begin_split -|", "|- split -|", "|- end_split -|" ane items untayi — 2 columns kosam. begin_split tho start, split mundu fields LEFT column, split tarvata fields RIGHT column, end_split tho 2-column area aagipothundi. Incident form lo ide vaaduthaaru.'),
  ],
  quiz: [
    q('Form design cheyyadaniki e page vaduthamu?', ['Form Layout', 'Dashboard', 'Update Set', 'Filter'], 0, 'Configure → Form Layout (leda Form Design / Form Builder — nee PDI ☰ → Configure lo moodu untayi).'),
    q('Form Layout lo fields ni left | right ga vibhajinche item edi?', ['|- split -|', '|- column -|', '|- section -|', '|- tab -|'], 0, '|- begin_split -| … |- split -| … |- end_split -|: split mundu fields left column, tarvata fields right column.'),
    q('Form lo tabs laaga kanipinche vi?', ['Form sections', 'Modules', 'Roles', 'Filters'], 0, 'Form Sections — form lo tabs laaga kanipistayi, Form Layout lo create chestam.'),
    q('Form Layout lo selected ↔ available UI peru?', ['Slushbucket', 'Breadcrumb', 'Banner', 'Navigator'], 0, 'Slushbucket — Available ↔ Selected lists, fields add/remove chese UI.'),
  ],
}

/* 8 — Views */
const views = {
  id: 'views', title: 'Views & View Rules', video: 'Views & View Rules', duration: '36:14',
  blurb: 'Oke form ki different layouts (views) & condition batti auto ga view marchadam.',
  start: trainingForm,
  steps: [
    info('View ante: oke table ki different users ki different form layouts. Ex: Admin ki anni fields, trainee ki konni matrame. Ee lesson lo kotha view create chesi, rule tho auto ga apply chestam. Next click cheyyi.'),
    ...goTo('views', 'mod-system-ui-views', 'Views list'),
    info('Ee instance lo already views unnayi (Self Service, Advanced). Ippudu mana view create cheddam.', 'list-title'),
    click('list-new', '"New" click cheyyi.'),
    type('f-name', '"Name" lo "trainee" (chinna letters) ani rayyi.', has('trainee'), 'trainee'),
    type('f-title', '"Title" lo "Trainee view" ani rayyi — users ki kanipinche peru.', has('trainee'), 'Trainee view'),
    click('f-submit', '"Submit" click cheyyi.'),
    info('View create ayyindi, kani layout ledu inka — default layout ne vastundi. Ippudu Training form ki velli ee view layout set chestam.'),
    ...goTo('training', 'mod-training-create-new', 'Training form'),
    click('f-menu', 'Form ☰ menu click cheyyi.'),
    click('menu-cfg-layout', '"Form Layout" click cheyyi.'),
    type('layout-view', 'View dropdown lo "Trainee view" select cheyyi.', eq('trainee'), 'trainee', { hint: 'View dropdown lo Trainee view select cheyyi.' }),
    type('fl-right', 'Trainee ki "Trainer" field avasaram ledu — Right lo "Trainer" select cheyyi.', eq('Trainer'), 'Trainer', { hint: '"Trainer" meeda click cheyyi.', okText: 'Ippudu ◀ click cheyyi.' }),
    click('fl-remove', '◀ click cheyyi.'),
    click('fl-save', '"Save" click cheyyi — ee layout "Trainee view" ki matrame.'),
    click('layout-open-form', '"Open form" click cheyyi.'),
    info('Form ippudu "Trainee view" lo undi (title lo chudu: View: Trainee view). "Trainer" field ledu ✅', 'f-menu'),
    click('f-menu', '☰ menu click cheyyi — view marchi chuddam.'),
    click('menu-view-default', '"Default view" click cheyyi.'),
    info('Default view lo "Trainer" field malli vachindi. Ante view valla oke record ni different layouts lo chudochu 👍', 'main-section'),
    info('Ippudu "View Rule" — condition match ayithe auto ga ee view open avvali. Ex: Status = Completed ayithe Trainee view.'),
    ...goTo('view rules', 'mod-system-ui-view-rules', 'View Rules'),
    click('list-new', '"New" click cheyyi.'),
    type('f-name', '"Name" lo "Completed courses" ani rayyi.', len(4), 'Completed courses'),
    type('f-table', '"Table" lo "Training Request" ani rayyi.', has('training request'), 'Training Request'),
    type('f-view', '"View" lo "Trainee view" ani rayyi.', has('trainee'), 'Trainee view'),
    click('fb-add', 'Conditions lo "AND" click cheyyi — condition row add avtundi.'),
    type('fb-field-0', 'Field dropdown lo "Status" select cheyyi.', eq('u_status'), 'u_status', { hint: 'Status select cheyyi.' }),
    type('fb-value-0', 'Value lo "Completed" select cheyyi.', eq('done'), 'done', { hint: 'Completed select cheyyi.' }),
    click('f-submit', '"Submit" click cheyyi.'),
    ...goTo('training', 'mod-training-all', 'Training list'),
    click('list-open-first', 'Status = Completed unna record ("IAM deep dive") open cheyyi.'),
    info('Chusava! Aa record Status = Completed kabatti, view rule valla auto ga "Trainee view" lo open ayyindi (title lo View: Trainee view). Rule lekunda manual ga marchakkarledu ✅', 'f-menu'),
  ],
  quiz: [
    q('View ante?', ['Oke table ki different form layouts', 'Oka saved report', 'Oka role yokka permissions set', 'Oka saved list filter'], 0, 'Different layouts of the same table form.'),
    q('Condition batti auto ga view marchedi?', ['View Rule', 'UI Policy', 'Data Policy', 'Business Rule'], 0, 'View Rule — condition batti automatic ga correct view select chestundi.'),
    q('Form lo view ni manual ga marchadam ekkada?', ['Form ☰ menu → View', 'Header', 'Navigator', 'Dictionary'], 0, 'Form context menu → View.'),
    q('View ki layout set cheyyadaniki?', ['Form Layout lo View select chesi', 'Dictionary lo View column set chesi', 'Modules lo View peru rasi', 'Roles lo View ni add chesi'], 0, 'Form Layout page lo View select chesi.'),
  ],
}

/* 9 — Dictionary properties */
const dictionary = {
  id: 'dictionary', title: 'Dictionary Properties', video: 'Dictionary Properties (Mandatory, Readonly, Display, Default, Dependent)', duration: '36:34 + 53:25',
  blurb: 'Mandatory, Read-only, Default, Display, Dependent — field behaviour dictionary lo ela set cheyyalo.',
  start: trainingForm,
  steps: [
    info('Dictionary lo prathi column ki properties untayi: Mandatory, Read-only, Default value, Display, Dependent. Ee lesson lo oka oka property set chesi form lo effect chuddam. Next click cheyyi.'),
    click('f-menu', 'Form ☰ menu click cheyyi.'),
    click('menu-cfg-dictionary', '"Configure → Dictionary" click cheyyi. (Nee PDI lo shortcut: form lo field label meeda right-click → "Configure Dictionary" — aa okka field dictionary entry direct ga open avtundi. Aa menu lo Configure Label, Configure Styles, Show Security Rules kuda untayi.)'),
    info('Idi ee table dictionary — prathi column oka row. Ikkada nundi aa column properties marchochu.', 'dict-grid'),
    /* mandatory */
    click('dict-open-u_course_name', 'Mundu "Course name" open cheyyi.'),
    info('Idi Dictionary Entry. Ikkada Mandatory, Read only, Default value, Display, Dependent — anni untayi.', 'dd-mandatory'),
    type('dd-mandatory', '"Mandatory" tick cheyyi. Appudu Course name lekunda record save cheyyalem.', yes, true, { hint: 'Mandatory checkbox tick cheyyi.' }),
    click('dict-submit', '"Update" click cheyyi.'),
    click('dict-back', 'Back arrow ‹ click cheyyi — form ki velli chuddam.'),
    info('Chusava! "Course name" ki red ∗ vachindi — mandatory ayyindi.', 'f-u_course_name'),
    click('f-submit', 'Course name empty ga petti "Submit" click cheyyi — em avtundo chudu.'),
    info('Error vachindi: "mandatory fields are not filled in". Dictionary level mandatory — anni forms/views lo apply avtundi.', 'form-err'),
    /* default */
    click('f-menu', 'Malli ☰ menu click cheyyi — next property "Default value".'),
    click('menu-cfg-dictionary', '"Configure → Dictionary" click cheyyi.'),
    click('dict-open-u_topic', '"Topic" column open cheyyi.'),
    type('dd-default', '"Default value" lo "cloud" ani rayyi. (Choice field kabatti value (chinna letters) ivvali.)', has('cloud'), 'cloud', { hint: '"cloud" ani rayyi.' }),
    click('dict-submit', '"Update" click cheyyi.'),
    click('dict-back', 'Back ‹ click cheyyi.'),
    info('Ippudu kotha form lo "Topic" already "Cloud" ga undi ✅ Default value = kotha record open chesinappudu already unde value. (Existing records ki apply avvadu.)', 'f-u_topic'),
    /* read only */
    click('f-menu', '☰ menu click cheyyi — "Read only" kosam.'),
    click('menu-cfg-dictionary', '"Dictionary" click cheyyi.'),
    click('dict-open-u_notes', '"Notes" column open cheyyi.'),
    type('dd-readonly', '"Read only" tick cheyyi.', yes, true, { hint: 'Read only checkbox tick cheyyi.' }),
    click('dict-submit', '"Update" click cheyyi.'),
    click('dict-back', 'Back ‹ click cheyyi.'),
    info('"Notes" ippudu grey — edit cheyyalem. (Number kuda ila read-only ne.)', 'f-u_notes'),
    /* dependent */
    info('Last property: Dependent. "Tool" field "Topic" meeda depend avtundi. Topic marchi chudu.', 'f-u_topic'),
    type('f-u_topic', 'Topic ni "DevOps" ki marchu.', eq('devops'), 'devops', { hint: 'Topic dropdown lo DevOps select cheyyi.', okText: 'Ippudu Tool field chudu.' }),
    info('Tool lo ippudu "Docker, Jenkins" matrame — DevOps tools. Cloud select chesthe AWS/Azure vastayi. Idi Dependent (Incident lo Category → Subcategory kuda ide).', 'f-u_tool'),
    info('Display property: oka table ki "peru" laaga vaade okka field (Display = true). Reference fields lo ide kanipistundi. Dictionary entry lo "Display" tick chesthe adi display field avtundi. Anni ayipoyayi ✅'),
  ],
  quiz: [
    q('Dictionary lo Mandatory set chesthe form lo em kanipistundi?', ['Red ∗', 'Blue ∗', 'Em kaadu', 'Hidden avtundi'], 0, 'Red ∗ mandatory field ki.'),
    q('Default value e records ki apply avtundi?', ['Kotha records ki', 'Anni existing records ki', 'Deleted ki', 'Em kaadu'], 0, 'Kotha records ki matrame.'),
    q('Category marchithe Subcategory options marali. Idi e property?', ['Dependent', 'Display', 'Default', 'Read only'], 0, 'Dependent — parent field (Category) value batti child field (Subcategory) choices marutayi.'),
    q('Dictionary level Read only ante?', ['Anni forms lo edit cheyyalem', 'Oka view lo matrame edit cheyyalem', 'Admin ki matrame edit cheyyalem', 'Field form lo hidden avtundi'], 0, 'Dictionary level = anni forms/views ki.'),
  ],
}

/* 10 — Process flow */
// Ee lesson kosam Incident ki 4 stages (sys_process_flow records). Her PDI has 0 for incident — there she creates them herself.
const seedStages = (d) => {
  const st = (label, order, value) => ({
    sys_id: 'pf_' + value, sys_class_name: 'sys_process_flow', table: 'Incident', label, order: String(order), active: true,
    application: 'Global', condition: [{ field: 'state', op: 'is', value, or: false }], description: '',
  })
  d.rows.sys_process_flow = [st('New', 100, '1'), st('On Hold', 300, '3'), st('Resolved', 400, '6'), st('Closed', 500, '7')]
}
const processFlow = {
  id: 'process-flow', title: 'Process Flow', video: 'Process Flow', duration: '7:17',
  blurb: 'Process Flow stages (records) create chesi, incident form top lo chevron bar (formatter) chupinchadam.',
  start: { name: 'form', table: 'incident', isNew: true, k: 2 },
  setup: (d) => seedStages(d),
  steps: [
    info('Process Flow = form top lo chevron bar (New → In Progress → On Hold...) — record ippudu e stage lo undo chupistundi. Prathi stage oka Process Flow record: Table, Label, Order, Condition. Bar display matrame — daani meeda click chesthe State maradu. Next click cheyyi.'),
    info('Ippudu ee incident form top lo bar ledu. Mundu stages (records) chuddam, tarvata form ki bar (formatter) add cheddam.', 'main-section'),
    ...goTo('process flow', 'mod-system-ui-process-flow', 'Process Flow list'),
    info('Idi Process Flows list — prathi row oka stage (Label, Table, Order). Ee lesson kosam Incident ki 4 stages ready ga pettam: New, On Hold, Resolved, Closed. Gamaninchu: nee PDI lo incident ki process flow records levu (0) — akkada nuvve create cheyyali. "In Progress" stage missing — add cheddam.', 'list-title'),
    click('list-new', '"New" click cheyyi — kotha stage.'),
    type('f-table', '"Table" lo "Incident" ani rayyi — e table form lo ee stage kanipinchali.', has('incident'), 'Incident'),
    type('f-label', '"Label" lo "In Progress" ani rayyi — chevron lo kanipinche peru.', has('progress'), 'In Progress'),
    type('f-order', '"Order" lo 200 ani rayyi. Chinna Order left lo vastundi: New = 100, On Hold = 300 — madhyalo ravali kabatti 200.', eq('200'), '200'),
    click('fb-add', '"Condition" lo "AND" click cheyyi — condition row add avtundi.'),
    type('fb-field-0', 'Field lo "State" select cheyyi.', eq('state'), 'state', { hint: 'State select cheyyi.' }),
    type('fb-value-0', 'Value lo "In Progress" select cheyyi — record State = In Progress unnappudu ee stage highlight avtundi.', eq('2'), '2', { hint: 'In Progress select cheyyi.' }),
    click('f-submit', '"Submit" click cheyyi.'),
    info('Ippudu 5 stages: New (100), In Progress (200), On Hold (300), Resolved (400), Closed (500) ✅ Order batti left → right vastayi.', 'list-title'),
    ...openForm('incident form', 'incident.do'),
    click('f-menu', '☰ menu click cheyyi.'),
    click('menu-cfg-layout', '"Form Layout" click cheyyi.'),
    info('Gamaninchu — nee PDI lo: Form Layout Available lo "Process Flow" raavalante aa TABLE ki oka Formatter record undali. Process Flow formatter global ga ledu — nee PDI lo problem, change_request, problem_task laanti konni tables ki matrame undi. Incident / custom table lo raakapothe mundu: All → System UI → Formatters → New: Name "Process Flow", Formatter "process_flow.xml", Table = aa table, Type "Formatter" → Submit. Appudu Form Layout lo kanipistundi. Ee mock lo incident ki adi already undi — continue cheddam.', 'fl-left'),
    type('fl-left', 'Left (Available) lo "Process Flow" select cheyyi — idi formatter (field kaadu).', eq('Process Flow'), 'Process Flow', { hint: '"Process Flow" meeda click cheyyi.', okText: 'Ippudu ▶ click cheyyi.' }),
    click('fl-add', '▶ click cheyyi.'),
    click('fl-save', '"Save" click cheyyi.'),
    click('layout-open-form', '"Open form" click cheyyi.'),
    info('Bar vachindi! Kotha incident State = New kabatti "New" stage highlight ayyindi — "State is New" condition match ayyindi.', 'process-flow'),
    click('f-back', 'Back ‹ click cheyyi — incident list ki.'),
    click('list-open-first', 'Top lo unna incident (State = New) open cheyyi.'),
    type('f-state', 'Ee record "New" stage lo undi. Ippudu State ni "In Progress" ki marchu.', eq('2'), '2', { hint: 'State dropdown lo In Progress select cheyyi.', okText: 'Ippudu bar chudu — Next click cheyyi.' }),
    info('Highlight inka "New" lone undi! Formatter display matrame — record SAVE ayyi form reload ayinappude stage marutundi. ⚠️ PDI lo kuda ila ne undo confirm chesuko.', 'process-flow', { checks: ['process-flow-save'] }),
    click('f-menu', '☰ menu click cheyyi.'),
    click('menu-save', '"Save" click cheyyi — save ayyi form lone untav.'),
    info('Ippudu "In Progress" highlight ✅ Gurtu pettuko: bar State ni marchadu — State marchi save chesthe bar follow avtundi. Stages = Process Flow records (System UI → Process Flow); form lo chupinchadaniki Form Layout lo "Process Flow" formatter (nee PDI lo aa table ki Formatter record kuda undali — System UI → Formatters).', 'process-flow'),
  ],
  quiz: [
    q('Process Flow ni form lo ela add chestam?', ['Form Layout lo formatter add chesi', 'Dictionary lo Process Flow field add chesi', 'Module create chesi', 'User ki role ichi'], 0, 'Form Layout → "Process Flow" formatter add chesthe form top lo bar vastundi. (Nee PDI lo aa table ki Formatter record (System UI → Formatters, process_flow.xml) unte ne Form Layout lo adi kanipistundi.)'),
    q('Process Flow bar em chupistundi?', ['Record ippudu e stage lo undo', 'Record ni evaru edit chesaaro', 'Record ki entha time padutundo', 'Record ki attach ayina files'], 0, 'Record ippudu e stage lo undo — condition match ayina stage highlight avtundi.'),
    q('Process Flow lo prathi stage ekkada define chestaru?', ['Process Flow records lo', 'State field choices lo', 'Form Layout slushbucket lo', 'UI Policy Actions lo'], 0, 'System UI → Process Flow lo prathi stage oka record (Table, Label, Order, Condition). State choices nundi stages auto ga raavu; Form Layout lo formatter add chesthe bar kanipistundi.'),
  ],
}

/* 11 — Menus, modules, shortcuts */
const menus = {
  id: 'menus-modules', title: 'Application Menus & Modules & Shortcuts', video: 'Application Menus & Modules & Short Cuts', duration: '44:46',
  blurb: 'Kotha Application Menu + Module create chesi, Favorites & shortcuts vaadadam.',
  withTraining: false,
  steps: [
    info('Navigator lo kanipinche Applications = Application Menus, vati kinda links = Modules. Ee lesson lo kotha menu, module create chesi, tarvata Favorites & shortcuts vaduthamu. Next click cheyyi.'),
    ...goTo('application menus', 'mod-system-definition-application-menus', 'Application Menus list'),
    click('list-new', '"New" click cheyyi.'),
    type('f-title', '"Title" lo "Support Tools" ani rayyi — navigator lo kanipinche peru.', has('support'), 'Support Tools'),
    type('f-order', '"Order" lo 150 ani rayyi. (Chinna number mundu vastundi.)', eq('150'), '150'),
    click('f-submit', '"Submit" click cheyyi.'),
    info('Menu create ayyindi. Ippudu daani kinda Module create cheddam.'),
    ...goTo('modules', 'mod-system-definition-modules', 'Modules list'),
    click('list-new', '"New" click cheyyi.'),
    type('f-title', '"Title" lo "Critical Incidents" ani rayyi.', has('critical'), 'Critical Incidents'),
    type('f-application', '"Application menu" lo "Support Tools" ani rayyi — e menu kinda undali.', has('support tools'), 'Support Tools'),
    info('"Link type" = List of Records — click chesthe oka table list open avtundi. (New Record ayithe empty form.)', 'f-link_type'),
    type('f-table', '"Table" lo "Incident" ani rayyi.', has('incident'), 'Incident'),
    type('f-filter', '"Filter" lo "priority=1^active=true" ani rayyi. (Idi encoded query: "^" ante AND. Priority 1 + Active.)', has('priority=1'), 'priority=1^active=true'),
    info('Gamaninchu: nee PDI lo Module "Filter" text box kaadu — list filter laantide oka condition builder (Field / Operator / Value, AND / OR). Akkada "Priority is 1 - Critical" AND "Active is true" select chestav; save ayyaka adi ide encoded query ga store avtundi. Ikkada easy kosam encoded query direct ga rasam.', 'f-filter'),
    click('f-submit', '"Submit" click cheyyi.'),
    click('btn-all', 'Ippudu "All" click cheyyi — kotha menu vachinda chuddam.'),
    type('nav-filter', 'Filter lo "support" ani type cheyyi.', has('support'), 'support'),
    info('Chusava! "Support Tools" application, daani kinda "Critical Incidents" module vachayi 🎉', 'nav-panel'),
    click('mod-support-tools-critical-incidents', 'Ee module click cheyyi.'),
    info('Incident list, kani filter apply ayyindi — breadcrumb chudu: All > Priority = 1 - Critical > Active = true. Module filter valla.', 'crumbs'),
    click('btn-all', 'Ippudu Favorites: "All" click cheyyi.'),
    type('nav-filter', 'Filter lo "critical" ani type cheyyi.', has('critical'), 'critical'),
    click('star-support-tools-critical-incidents', 'Module pakkana unna ☆ star click cheyyi.'),
    info('Star click chesthe module FAVORITES lo kuda vastundi — filter lekunda open chesthe paina kanipistundi. Daily vaade modules ki idi best.', 'nav-panel'),
    type('nav-filter', 'Last: shortcut. Filter lo ippudu unna text clear chesi "incident.list" ani type cheyyi. (table_name.list = aa table list direct ga.)', has('incident.list'), 'incident.list', { hint: '"incident.list" ani type cheyyi.' }),
    click('nav-shortcut', 'Highlight chesina "Open incident.list" click cheyyi.'),
    info('Shortcut tho direct ga Incident list open ayyindi. "table_name.do" ayithe kotha form. Developers daily vaadey trick ✅'),
  ],
  quiz: [
    q('Navigator lo applications ni em antaru?', ['Application Menus', 'Views', 'Roles', 'Update sets'], 0, 'Application Menus.'),
    q('Menu kinda links ni?', ['Modules', 'Fields', 'Tables', 'Policies'], 0, 'Modules — Application Menu kinda unde links.'),
    q('Module filter "priority=1^active=true" lo ^ ante?', ['AND', 'OR', 'NOT', 'Comment'], 0, '^ = AND (^OR = OR).'),
    q('Daily vaade modules ki shortcut?', ['Favorites (star)', 'Dictionary', 'Views', 'Roles'], 0, 'Favorites (star) — daily vaade modules ki shortcut.'),
  ],
}

export const LESSONS_B = [formDesign, views, dictionary, processFlow, menus]
