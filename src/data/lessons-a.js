import { info, hover, click, type, has, eq, len, yes, goTo, q } from './lessonKit.js'

/* 1 — Account creation */
const account = {
  id: 'account', title: 'ServiceNow Account Creation', video: 'ServiceNow Account Creation', duration: '44:12',
  blurb: 'Free Personal Developer Instance (PDI) ela teesukovali — account, instance request, URL & login.',
  start: { name: 'page', id: 'devportal' },
  steps: [
    info('Hi! 👋 Ee lesson lo ServiceNow free instance (PDI) ela teesukovalo chuddam. Idi mock page — ikkada nee real details type cheyyaku. Real site: developer.servicenow.com. Next click cheyyi.'),
    info('Idi Developer site home. Paina bar lo logo, Sign in, Get started untayi. Ikkade nundi nee free instance request chestav.', 'dp-top'),
    info('⚠️ Important: ee mock lo password/email nijamaina vi pettaku. Real website lo matrame nee details ivvu.', 'dp-note'),
    click('dp-getstarted', 'Ippudu "Get started" click cheyyi — account create cheyyadaniki.'),
    info('Sign-up form. Real lo First name, Last name, Email, Password istav. Tarvata ServiceNow mail pampistundi — aa verification link click chesthe account active avtundi.', 'dp-signup'),
    click('dp-create', '"Create account (mock)" click cheyyi.'),
    info('Account ready! Idi Developer dashboard. Resources (docs), Community (Q&A), Request Instance — ee moodu ikkade.', 'dp-dash'),
    click('dp-request', '"Request Instance" click cheyyi — idi nee own free instance.'),
    hover('Ikkada release (version) select chestav. Hover chesi chudu, "Brazil" select cheyyi — nee videos Brazil lo unnayi. Select chesaaka Next click cheyyi.', 'dp-releases'),
    click('dp-submit-req', '"Request" click cheyyi.'),
    info('Instance ready ✅ URL idi: ee URL bookmark cheyyi. Nee instance ki prefix "dev" + number untundi.', 'dp-url'),
    info('Username "admin". Password ni ikkade copy chesi safe ga petta — malli chupinchaledu! (Marchipothe instance reset cheyyali.)', 'dp-pass'),
    info('PDI free kabatti, konni rojulu use cheyyakapothe (~10 days) hibernate avtundi. Developer site lo "Wake up" click chesthe malli start avtundi. Data povadu 👍', 'dp-hib'),
    click('dp-open', '"Open instance" click cheyyi — nee instance home vastundi.'),
    info('Idi nee instance home — ika ikkada nundi practice. Eppudu "All" menu tho modules vethukuntav.', 'header'),
  ],
  quiz: [
    q('Free instance ni em antaru?', ['PDI (Personal Developer Instance)', 'MID Server (company network agent)', 'Update Set (changes package)', 'Workspace (agent UI)'], 0, 'PDI — free, nee own instance.'),
    q('Instance request chese website eadi?', ['servicenow.com/docs', 'developer.servicenow.com', 'store.servicenow.com', 'nowlearning.servicenow.com'], 1, 'Developer site (developer.servicenow.com).'),
    q('PDI konni rojulu use cheyyakapothe em avtundi?', ['Instance permanent ga delete ayipothundi', 'Hibernate avtundi — wake up cheyochu', 'Automatic ga paid plan ki marutundi', 'Emi maradu, ellappudu active ga untundi'], 1, 'Hibernate avtundi; Developer site lo Wake up click chesthe saripoddi.'),
    q('Instance password ni em cheyyali?', ['Marchipoku — safe ga petta', 'Share cheyyi', 'Em avvadu', 'Screenshot social media lo petta'], 0, 'Password safe ga save cheyyali.'),
  ],
}

/* 2 — User administration */
const users = {
  id: 'user-admin', title: 'User Administration', video: 'User Administration', duration: '47:12',
  blurb: 'Users, Groups, Roles — kotha user create chesi role & group assign cheyyadam.',
  steps: [
    info('Ee lesson lo kotha user create chesi, aa user ki roles & groups ela ivvalo chuddam. User Administration admin ki daily pani! Next click cheyyi.'),
    ...goTo('users', 'mod-user-administration-users', 'Users list'),
    info('Idi Users list — ee instance lo unna andari users. Prathi row oka user record.', 'list-title'),
    click('list-new', '"New" click cheyyi — kotha user create cheddam.'),
    type('f-user_name', '"User ID" lo "ravi.kumar" ani type cheyyi. Idi login ki use chese unique ID, red ∗ ante mandatory.', has('ravi'), 'ravi.kumar'),
    type('f-first_name', '"First name" lo "Ravi" ani rayyi.', has('ravi'), 'Ravi'),
    type('f-last_name', '"Last name" lo "Kumar" ani rayyi.', has('kumar'), 'Kumar'),
    type('f-email', '"Email" lo "ravi@example.com" ani rayyi.', has('@'), 'ravi@example.com'),
    info('"Active" tick undi ante ee user login avvagalaru. Admin ga nuvvu ikkade user ni disable chestav (uncheck chesthe).', 'f-active'),
    click('f-submit', '"Submit" click cheyyi.'),
    info('Nee kotha user list lo top lo undi 🎉 Ippudu aa user ni open chesi roles ivvali.', 'list-row-first'),
    click('list-open-first', 'User ni open cheyyadaniki, highlight chesina peru (link) click cheyyi.'),
    click('tab-roles', 'Form kinda "Roles" tab click cheyyi. Idi related list — ee user ki unna roles.'),
    click('edit-roles', '"Edit..." click cheyyi — role add cheyyadaniki.'),
    info('Idi "slushbucket". Left lo Available roles, right lo Selected roles. Left nundi select chesi ▶ click chesthe add avtundi.', 'sb-box'),
    type('sb-left', 'Left lo "itil" role select cheyyi. (itil = incident/problem/change manage chese role.)', eq('itil'), 'itil', { hint: '"itil" meeda click cheyyi.', okText: 'Super! Ippudu ▶ click cheyyi.' }),
    click('sb-add', '▶ button click cheyyi — itil right side ki veltundi.'),
    click('sb-save', '"Save" click cheyyi.'),
    info('Role add ayyindi ✅ Ippudu ee user itil role tho incidents manage cheyagaladu.', 'form-ok'),
    click('tab-groups', 'Ippudu "Groups" tab click cheyyi — group membership kosam.'),
    click('edit-groups', '"Edit..." click cheyyi.'),
    type('sb-left', '"Service Desk" group select cheyyi.', eq('Service Desk'), 'Service Desk', { hint: '"Service Desk" meeda click cheyyi.', okText: 'Ippudu ▶ click cheyyi.' }),
    click('sb-add', '▶ click cheyyi.'),
    click('sb-save', '"Save" click cheyyi.'),
    info('Chusava! Roles direct ga user ki ivvochu, leda Group ki ichi group lo users ni petti kuda ivvochu (best practice: group ki roles ivvadam).', 'main-section'),
  ],
  quiz: [
    q('User ki permissions ivvadaniki em vaduthamu?', ['Roles', 'Views', 'Filters', 'Menus'], 0, 'Roles — permissions ivvadaniki.'),
    q('Roles ni add chese UI peru emiti?', ['Slushbucket', 'Dashboard', 'Update set', 'Catalog'], 0, 'Slushbucket (Available ↔ Selected).'),
    q('Best practice ela?', ['Prathi user ki direct ga roles ivvadam', 'Group ki roles ichi users ni group lo petta', 'Andariki admin role ivvadam', 'Roles asalu vaadakunda undadam'], 1, 'Group ki roles ivvadam maintain cheyyadaniki easy.'),
    q('User login avvakunda cheyyalante?', ['Delete only', 'Active uncheck', 'Roles remove', 'Em cheyyalem'], 1, 'Active uncheck chesthe login avvadu.'),
  ],
}

/* 3 — UI tour (the first lesson) */
const ui = {
  id: 'ui-tour', title: 'User Interface', video: 'User Interface', duration: '29:28',
  blurb: 'ServiceNow screen lo em ekkada untundo — banner, All menu, filter navigator, list & form.',
  steps: [
    info('Hi! 👋 Ippudu manam ServiceNow screen ni oka chinna tour lo chuddam. Nenu nee pakkane untanu — nuvvu highlight chesina daggara matrame click cheyyi, anthe. Ready aa? Next click cheyyi.'),
    info('Ee paina unna dark bar ni "Unified Navigation banner" antaru. Ee instance lo nuvvu em chesina, ee bar eppudu kanipistundi. Search, notifications, profile anni ikkade.', 'header'),
    hover('Ee search box ni mouse tho hover cheyyi (move chey, click vaddu). Paina help card vastundi 🙂. Global search anni tables lo vethukutundi. Idi chusaaka Next click cheyyi.', 'tab-search'),
    click('btn-all', 'Ippudu "All" button click cheyyi. Idi most important button — anni applications ikkade untayi.', 'Highlight chesina "All" button meeda click cheyyi 🙂'),
    info('Idi "Application Navigator". Applications (Self-Service, Incident, Problem...) untayi, vati kinda modules untayi.', 'nav-panel'),
    type('nav-filter', 'Ee "Filter" box lo "incident" ani type cheyyi. Admin lu daily vadey trick idi — scroll cheyyakunda direct ga module dorukutundi.', has('incident'), 'incident', { hint: 'Filter box lo "incident" ani type cheyyi.', okText: 'Super! 👍 Ippudu Next click cheyyi.' }),
    click('mod-incident-all', 'Chusava, "incident" unna modules matrame vachayi. (Self-Service, Service Desk lo kuda "Incidents" undi — ade list, different shortcuts anthe.) Ippudu "Incident" application kinda unna "All" module click cheyyi.', 'Incident kinda unna "All" module click cheyyi.'),
    info('Idi oka LIST. Oka table lo records anni row-wise ga chupistundi. Ee list "Incident" table ki sambandinchindi. Paina breadcrumb lo "All" ani undi — adi ippudu unna filter.', 'list-title'),
    hover('Ee row lo column names untayi (Number, Short description, Priority, State...). Mouse tho hover chesi okka column ni check cheyyi, tarvata Next.', 'list-header'),
    click('list-new', 'Ippudu manam kotha incident create chedham. "New" button click cheyyi.', '"New" button click cheyyi (list paina right side lo undi).'),
    info('Idi oka FORM. Form lo oka record details untayi. "Number" field grey ga undi ga — adi read-only, system auto ga number istundi.', 'f-number'),
    type('f-caller_id', 'Mundu "Caller" — evaru ee problem report chesaaro vallu. Red star ∗ unte Mandatory. Ikkada "Abel Tuter" ani type cheyyi.', len(3), 'Abel Tuter', { okText: 'Perfect 👌 Next click cheyyi.' }),
    type('f-short_description', '"Short description" lo oka problem type cheyyi. Example: "Laptop is very slow". Idi kuda Mandatory.', len(5), 'Laptop is very slow', { okText: 'Bagundi! ✍️ Next click cheyyi.' }),
    type('f-impact', 'Ippudu "Impact" ni "1 - High" ki marchu. Marchaaka Priority field kuda automatic ga maripothundi!', eq('1'), '1', { hint: 'Impact dropdown lo "1 - High" select cheyyi.', okText: 'Ayipoindi 🎉 Next click cheyyi, Priority chuddam.' }),
    info('Chusava! Priority ni manam set cheyyaledu, system Impact + Urgency chusi calculate chesindi. (Idi Data Lookup rule valla — daani gurinchi later lesson lo.)', 'f-priority'),
    click('f-submit', 'Ippudu "Submit" click cheyyi. Nee incident save ayyi list ki thirigi vastav.'),
    info('Idigo! 🎉 Nee kotha incident list lo top lo undi. Nuvvu ippude first record create chesav!', 'list-row-first'),
    info('Lesson complete ✅ Ippudu 4 chinna quiz questions. Tarvata nee real PDI lo kuda try cheyyi (All → filter "incident" → New).'),
  ],
  quiz: [
    q('Anni applications & modules ni open chese button eadi?', ['Home', 'All', 'Favorites', 'History'], 1, '"All" button — Application Navigator open avtundi.'),
    q('Navigator lo "incident" ani type chese box peru?', ['Global search', 'Filter navigator', 'List search', 'Breadcrumb'], 1, 'Filter navigator.'),
    q('Incident form lo "Number" grey ga undi, edit cheyalem. Ante?', ['Mandatory', 'Read-only', 'Hidden', 'Reference'], 1, 'Read-only — system auto generate chestundi.'),
    q('Priority ela vachindi?', ['Random ga system pick chestundi', 'Caller yokka location batti', 'Impact + Urgency nundi auto calculate', 'Description lo rasina words batti'], 2, 'Impact & Urgency kalipi (Data Lookup rule).'),
  ],
}

/* 4 — Products & websites */
const products = {
  id: 'products', title: 'ServiceNow Products & Main Websites', video: 'ServiceNow Products & Main Websites', duration: '1:00:18',
  blurb: 'ServiceNow products (ITSM, HRSD...) & bookmark cheyalsina websites.',
  start: { name: 'page', id: 'websites' },
  steps: [
    info('Ee lesson lo ServiceNow em products ichindi, daani websites ento chuddam. Cards meeda hover chesthe explanation vastundi. Next click cheyyi.'),
    hover('Idi "Products" section. ServiceNow oka platform — daani meeda different workflows (products) untayi. Konni cards hover chesi chudu, tarvata Next.', 'ws-products'),
    click('ws-itsm', 'Mundu "ITSM" card click cheyyi. Mana course lo ekkuva idi nerchukuntam.'),
    info('ITSM = IT Service Management: Incident, Problem, Change, Knowledge. Idi ServiceNow ki base product.', 'ws-detail'),
    click('ws-creator', '"App Engine" card click cheyyi — developers ki idi important.'),
    info('App Engine / Creator Workflows = mana own apps build chese platform. Table, Form, Flow anni ikkade. Developer ga nuvvu ekkuva ikkade untav.', 'ws-detail'),
    hover('Ippudu websites. Prathi card hover chesi, e site eppudu vaduthamo chudu. Tarvata Next.', 'ws-sites'),
    click('ws-dev', '"Developer site" click cheyyi — nee PDI ikkade nundi.'),
    info('developer.servicenow.com — PDI request, docs, learning anni. Bookmark cheyyi!', 'ws-detail'),
    click('ws-community', '"Community" click cheyyi.'),
    info('Error vasthe mundu community lo vethuku — chala mandi same problem face chesi untaru.', 'ws-detail'),
    info('Ippudu neeku products & websites telusu ✅ Quiz time!'),
  ],
  quiz: [
    q('Developer ki first website eadi?', ['developer.servicenow.com', 'store.servicenow.com', 'support.servicenow.com', 'linkedin.com'], 0, 'Developer site — PDI, docs ikkade.'),
    q('IT help desk workflows (Incident, Problem, Change) e product lo untayi?', ['HRSD', 'ITSM', 'CSM', 'SecOps'], 1, 'ITSM (IT Service Management) lo Incident, Problem, Change untayi.'),
    q('Own custom apps build chese platform?', ['App Engine (Creator Workflows)', 'ITOM (infrastructure monitoring product)', 'Store (apps download chese site)', 'Community (forum)'], 0, 'App Engine (Creator Workflows) tho custom apps build chestam; ITOM monitoring kosam.'),
    q('Error vasthe mundu e site lo vethakali?', ['Community', 'Social media lo', 'ServiceNow Store lo', 'Evarini adagakunda wait cheyyadam'], 0, 'Community / Docs.'),
  ],
}

/* 5 — Architecture */
const architecture = {
  id: 'architecture', title: 'ServiceNow Architecture', video: 'ServiceNow Architecture', duration: '44:50',
  blurb: 'Instance, database, app nodes, MID server, Dev→Test→Prod — big picture.',
  start: { name: 'page', id: 'architecture' },
  steps: [
    info('Ee lesson lo ServiceNow lopala ela untundo big picture chuddam. Diagram lo prathi box hover cheyyi. Next click cheyyi.'),
    hover('User browser tho start. Nuvvu URL open chesthe UI load avtundi. Mana "client scripts" ikkade run avtayi.', 'arch-browser'),
    hover('Load balancer — requests ni servers madhya divide chestundi.', 'arch-lb'),
    hover('Ee mottam "Instance". ServiceNow lo prathi customer ki own instance + own database untundi (multi-instance). Anduke nee PDI nee okkadi.', 'arch-inst'),
    hover('Application nodes: Java tho run avtayi. Mana "server-side scripts" (Business Rules, Script Includes) ikkade run avtayi.', 'arch-app'),
    hover('Database: anni tables & records ikkada store avtayi. Table create chesthe ikkade oka table create avtundi.', 'arch-db'),
    hover('MID Server: company network lo install chese chinna app. Cloud instance ↔ internal systems madhya bridge.', 'arch-mid'),
    hover('Real companies ki 3 instances untayi: DEV (develop), TEST (test), PROD (live). Changes Update Sets tho Dev → Test → Prod ki veltayi.', 'arch-env'),
    hover('Data centers: primary + DR (backup). Okati fail ayithe inkoka data center ki switch avtundi.', 'arch-dc'),
    info('Big picture ayipoindi ✅ Quiz time!'),
  ],
  quiz: [
    q('Mana server-side scripts (Business Rules) ekkada run avtayi?', ['Browser', 'Application nodes', 'MID server', 'Store'], 1, 'Application nodes (server).'),
    q('Client scripts ekkada run avtayi?', ['Browser', 'Database', 'MID server', 'Data center'], 0, 'User browser lo.'),
    q('Changes ela Dev nundi Prod ki veltayi?', ['Update Sets', 'Email', 'Favorites', 'Views'], 0, 'Update Sets — Dev lo chesina config changes XML ga capture ayyi Prod ki move avtayi.'),
    q('Company internal systems ki connect cheyyadaniki?', ['Load balancer', 'MID Server', 'Browser', 'Filter'], 1, 'MID Server — instance ni company internal network lo systems tho connect chese Java agent.'),
  ],
}

/* 6 — Table creation */
const tableCreation = {
  id: 'table-creation', title: 'Table Creation & Form Design', video: 'Table Creation & Form Design', duration: '47:52',
  blurb: 'Custom table create chesi, columns add chesi, form lo chudadam.',
  withTraining: false,
  steps: [
    info('Ee lesson lo "Training Request" ane kotha table create chestam — columns add chesi form lo chuddam. Idi developer ki most basic skill! Next click cheyyi.'),
    ...goTo('tables', 'mod-system-definition-tables', 'Tables list'),
    info('Idi anni tables list. Incident, User laantivi kuda ikkade. Ippudu mana kotha table add chedham.', 'list-title'),
    click('list-new', '"New" click cheyyi.'),
    type('f-label', '"Label" lo "Training Request" ani type cheyyi. Idi table ki users ki kanipinche peru.', has('training'), 'Training Request', { okText: 'Super! Gamaninchu — "Name" auto ga vachindi. Next.' }),
    info('"Name" chusava? "u_training_request" — label nundi auto ga vachindi. "u_" ante custom table ani artham. Idi database lo asalu peru.', 'f-name'),
    info('"Extends table" empty ga vadilesey — ante idi independent table. Parent table select chesthe daani columns inherit avtayi (child tables lecture lo).', 'f-extends'),
    type('f-auto_number', '"Auto number" tick cheyyi. Appudu prathi record ki unique number (TRA0000001) vastundi, Incident INC... laaga.', yes, true, { hint: 'Auto number checkbox tick cheyyi.' }),
    info('"Create module" tick undi ga — ante navigator lo ee table ki shortcut (module) auto ga create avtundi.', 'f-create_module'),
    type('f-new_menu', 'Modules e menu lo untayo — "New menu name" lo "Training" ani rayyi.', has('training'), 'Training'),
    click('f-submit', '"Submit" click cheyyi — table create avtundi.'),
    info('Table create ayyindi 🎉 List lo top lo undi chudu. Ippudu daanni open chesi columns add chedham.', 'list-row-first'),
    click('list-open-first', 'Ee table ni open cheyyi (highlight chesina peru click).'),
    info('"Columns" tab — ee table lo ippudu columns levu. Ippudu add chedham.', 'form-tabs'),
    click('col-new', 'Columns lo "New" click cheyyi.'),
    type('dd-label', '"Column label" lo "Course name" ani rayyi.', has('course'), 'Course name'),
    info('Type "String" — normal text. Max length default. Ippudu Submit.', 'dd-type'),
    click('dict-submit', '"Submit" click cheyyi.'),
    click('dict-new', 'Inkoka column kosam malli "New" click cheyyi.'),
    type('dd-label', 'Ee sari "Status" ani rayyi.', has('status'), 'Status'),
    type('dd-type', 'Type ni "Choice" ki marchu — dropdown field kavali kabatti.', eq('choice'), 'choice', { hint: 'Type dropdown lo "Choice" select cheyyi.' }),
    type('dd-choices', 'Choices lo oka line ki okati rayyi: Planned, Ongoing, Completed.', has('planned'), 'Planned\nOngoing\nCompleted', { hint: 'Choices box lo Planned / Ongoing / Completed rayyi.' }),
    click('dict-submit', '"Submit" click cheyyi.'),
    info('2 columns add ayyayi ✅ Ippudu form lo ela undo chuddam. Navigator shortcut vaduthunna: table peru + ".do".'),
    click('btn-all', '"All" click cheyyi.'),
    type('nav-filter', 'Filter lo "u_training_request.do" ani type cheyyi. (table_name.do = ee table kotha form.)', has('u_training_request.do'), 'u_training_request.do', { hint: 'Exact ga u_training_request.do rayyi.' }),
    click('nav-shortcut', 'Highlight chesina "Open u_training_request.do" click cheyyi.'),
    info('Chusava! Number (auto), Course name, Status — nuvvu add chesina columns form lo vachayi. Idi mana first custom table ✅', 'main-section'),
  ],
  quiz: [
    q('Custom table name "u_" tho start avtundi ante?', ['Custom (user-created) table', 'System table (ServiceNow ichindi)', 'Hidden table (users ki kanipinchadu)', 'Child table (inkoka table extend)'], 0, '"u_" prefix = user-created custom table. ServiceNow tables ki ee prefix undadu.'),
    q('"Table name" ekkada nundi vastundi?', ['Label nundi auto', 'Manual type cheyyali', 'Random', 'Extends table nundi'], 0, 'Label nundi auto generate.'),
    q('Navigator lo table list direct ga open cheyyalante?', ['table_name.list', 'table_name.view', 'open table_name', 'list.table'], 0, 'table_name.list (new form = table_name.do).'),
    q('Dropdown (choices) field type?', ['String', 'Choice', 'Reference', 'Integer'], 1, 'Choice field type — dropdown laaga options chupistundi (Choices tab lo values add chestam).'),
  ],
}

export const LESSONS_A = [account, users, ui, products, architecture, tableCreation]
