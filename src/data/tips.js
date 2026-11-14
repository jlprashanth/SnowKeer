// Hover-help content (Tenglish = Telugu in English letters; tech words stay in English).
// key -> { title, body, real }  ("real" = what you'll notice in your real PDI)
export const TIPS = {
  logo: {
    title: 'Instance logo',
    body: 'Idi nee instance ki logo. Click chesthe landing page (Home) ki vellipothav.',
    real: 'Real lo company logo pettochu (System Properties lo change cheyochu).',
  },
  allMenu: {
    title: 'All menu (Application Navigator)',
    body: 'Idi ServiceNow lo most important button. Anni applications & modules ikkade untayi — Incident, Problem, Change, Tables anni. Click chesthe kinda menu open avtundi.',
    real: 'Old UI lo ee navigator eppudu left side lo fixed ga undedi. Next Experience lo "All" button taruvatha open avtundi.',
  },
  favorites: {
    title: 'Favorites',
    body: 'Nuvvu ekkuva use chese modules ni star chesi ikkada pettukovachu. Shortcut laga panichestundi.',
    real: 'Navigator lo module pakkana unna star click cheyyi.',
  },
  history: {
    title: 'History',
    body: 'Nuvvu recent ga open chesina pages ikkada kanipistayi. Mallee adhe page kosam vethakkarledu.',
    real: 'Browser history laantide, kani ServiceNow ki sambandinchinavi matrame.',
  },
  workspaces: {
    title: 'Workspaces',
    body: 'Workspaces ante specialized UIs — Service Operations Workspace, Agent Workspace laantivi. Agents ki daily work ki easy ga design chesaru.',
    real: 'Admin ga nuvvu ekkuva "All" menu (classic) lo panichestav. Workspaces taruvatha nerchukovachu.',
  },
  admin: {
    title: 'Admin',
    body: 'Admin ki sambandinchina shortcut links (Admin Center laantivi) ikkada untayi.',
    real: 'Admin role unte matrame idi kanipistundi.',
  },
  pageTitle: {
    title: 'Page title + star',
    body: 'Ippudu e page lo unnavo adi ikkada chupistundi. Pakkana star ☆ click chesthe aa page ni Favorites lo save chesukovachu.',
    real: 'Real lo star green ga marutundi — favorite ayyindi ani.',
  },
  scopePicker: {
    title: 'Application scope & Update set picker (globe)',
    body: 'Ippudu e application scope (Global...) lo, e update set lo panichestunnavo chupistundi — ikkade nundi marchochu.',
    real: 'Nee PDI (Next Experience) header lo globe 🌐 icon click chesthe "Application scope: Global", "Update set: Default [Global]" kanipistayi — ikkade scope / update set marchochu. Ee mock lo current update set paina banner lo kuda chupistunnam.',
  },
  chat: { title: 'Connect chat', body: 'Teammates tho ServiceNow lone chat cheyyadaniki.', real: 'PDI lo kuda untundi.' },
  uiSwitch: { title: 'Workspace / UI switcher', body: 'Different UIs / workspaces ki switch avvadaniki.', real: 'Ekkuva ga use cheyyam, just telusukunte chaalu.' },
  fChannel: { title: 'Channel', body: 'Incident ela vachindi — Phone, Email, Self-service laaga.', real: 'Reporting ki use avtundi.' },
  fResolve: {
    title: 'Resolve button',
    body: 'Incident ni resolve cheyyadaniki. Kani Resolution code & notes fill cheyyakapothe error vastundi.',
    real: 'Try cheyyi — mandatory fields gurinchi artham avtundi!',
  },
  listBreadcrumb: {
    title: 'Breadcrumb (filter)',
    body: 'Ee list ki ippudu e filter apply ayyindo ikkada chupistundi. "All" ante filter ledu — anni records. "> " = AND, ".or." = OR (paina condition ki alternative).',
    real: 'Filter pettaka ikkada conditions kanipistayi, vatini click chesi remove cheyochu.',
  },
  curSet: {
    title: 'Current Update Set',
    body: 'Nuvvu ippudu e update set lo working chestunnavo idi chupistundi. Nuvvu chese configuration changes (table, UI policy, menu...) anni ee set lo capture avtayi.',
    real: 'Nee PDI (Next Experience) lo header lo globe 🌐 icon (application scope & update set picker) click chesthe "Update set: Default [Global]" laaga current update set kanipistundi, akkade marchochu. (Ikkada easy kosam banner lo pettam.)',
  },
  navStar: {
    title: 'Favorite (star)',
    body: 'Star click chesthe ee module "Favorites" lo save avtundi — daily vadey modules ki shortcut.',
    real: 'Favorites tab lo andaru drag chesi order marchochu kuda.',
  },
  navShortcut: {
    title: 'Navigator shortcut',
    body: 'Table peru tho ".list" (table_name.list) type chesthe aa table list direct ga open avtundi; ".do" ante new form. Admin/developer lu daily vadey trick!',
    real: 'Ex: incident.list, sys_user.list, u_training_request.do',
  },
  fMenu: {
    title: 'Form context menu (☰)',
    body: 'Form lo options anni ikkade: Save, Insert / Insert and Stay (open record ni copy chestayi — task tables lo kanipinchavu), Delete, View marchadam, Configure (Dictionary, Form Layout...). Admin ki idi chala important menu.',
    real: 'Nee PDI lo ☰ (leda form header right-click) lo: Save, Configure ▸ (Form Builder, Form Design, Form Layout, Dictionary, UI Policies...), View ▸, History ▸, Show XML, Copy sys_id, Enable Field Watcher, Reload form. Incident lo "Copy Incident" untundi (Insert levu); Delete form button ga untundi.',
  },
  fUpdate: {
    title: 'Update',
    body: 'Existing record lo changes save chesi list ki thirigi veltundi. (Save = save chesi form lone untav.)',
    real: 'Record already unte "Submit" badulu "Update" kanipistundi.',
  },
  flow: {
    title: 'Process Flow',
    body: 'Record ippudu e stage lo undo chupinche chevron bar — display matrame (stage meeda click chesthe emi maradu). Prathi stage oka Process Flow record (Table, Label, Order, Condition); Condition match ayina stage highlight avtundi.',
    real: 'Stages: System UI → Process Flow. Form lo bar kavalante Form Layout lo "Process Flow" formatter add cheyyali. Kani adi Available lo raavalante aa table ki Formatter record undali (System UI → Formatters: Formatter "process_flow.xml", Table = aa table) — nee PDI lo problem, change laanti konni tables ki matrame undi; custom table ki nuvve create cheyyali.',
  },
  'dd-label': { title: 'Column label', body: 'Users ki form lo kanipinche peru. Column name (database peru) idi nundi auto ga "u_..." ga vastundi.' },
  'dd-maxlen': { title: 'Max length', body: 'String field lo entha characters type cheyochu. Default 40.' },
  'dd-choices': {
    title: 'Choices',
    body: 'Choice field lo dropdown options. Oka line ki oka choice. Dependent ayithe "Label | parentValue" ila rayyali.',
    real: 'Real PDI lo ee box undadu: column save chesaaka, aa dictionary entry lo kinda "Choices" related list lo New tho add chestav. (Form lo field label right-click lo "Configure Choices" kuda undi.)',
  },
  'dd-default': { title: 'Default value', body: 'Kotha record open chesinappudu ee field lo already unde value. Ex: Status = Planned.', real: 'Existing records ki apply avvadu — kotha records ki matrame.' },
  'dd-dependent': { title: 'Dependent', body: 'Ee field choices inkoka field meeda depend avtayi. Ex: Category = Software ayithe Subcategory lo Email, OS matrame.', real: 'Dependent field = parent field value batti options filter avtayi.' },
  'dd-mandatory': { title: 'Mandatory', body: 'Check chesthe idi lekunda record save cheyyalem. Form lo red ∗ kanipistundi.', real: 'Idi dictionary level — anni forms ki, anni views ki apply avtundi.' },
  'dd-readonly': { title: 'Read only', body: 'Check chesthe field edit cheyyalem (grey ga untundi).' },
  'dd-display': { title: 'Display', body: 'Ee field table ki "peru" laaga vadabadutundi — reference fields lo & list lo link ga kanipistundi. Oka table ki okate display field.', real: 'Ex: Incident table ki display field = Number.' },
  'layout-view': { title: 'View', body: 'E view ki layout edit chestunnav. Default view = anni users; Self Service laantivi vere layouts.' },
  'layout-section': { title: 'Section', body: 'Form lo sections (tabs laaga untayi). Oka section lo fields select chesi, order marchochu.' },
  globalSearch: {
    title: 'Global search',
    body: 'Edaina record (incident number, user name, knowledge article) kosam ikkada vethakochu. Table anni lo search chestundi.',
    real: 'Example: "INC0010001" ani type chesthe aa incident direct ga vastundi.',
  },
  notifications: {
    title: 'Notifications',
    body: 'Nee ki related alerts — assign ayina tasks, approvals anni ikkada kanipistayi.',
    real: 'Bell icon pakkana number ante pending notifications.',
  },
  help: {
    title: 'Help / Support',
    body: 'Documentation, community links, shortcuts ikkada untayi.',
    real: 'Ikkadi nunchi ServiceNow docs ki direct ga vellochu.',
  },
  profile: {
    title: 'User profile menu',
    body: 'Nee profile. Ikkade nundi Preferences, Impersonate User (vere user laaga login avvadam — testing ki super useful!), Logout untayi.',
    real: 'Nee PDI avatar menu: Profile, Preferences, Keyboard shortcuts, Impersonate user, Elevate role, Printer friendly version, Log out. Impersonate user admin ki matrame — roles test cheyadaniki ekkuva vadatharu.',
  },
  navFilter: {
    title: 'Filter navigator',
    body: 'Ee box lo type chesthe chaalu, menu lo vethakkunda direct ga module vastundi. Admin lu andaru idi vadathaaru — "incident", "tables", "users" ila type cheyyi.',
    real: 'Real PDI lo kuda same ga panichestundi. Daily use chese trick idi!',
  },
  navApp: {
    title: 'Application',
    body: 'Idi oka Application (group of modules). Daani kinda modules untayi — Create New, Open, All laaga.',
    real: 'Ex: "Incident" application lo Incident table ki sambandinchina anni modules.',
  },
  navModule: {
    title: 'Module',
    body: 'Idi oka Module — click chesthe oka page (list / form / report) open avtundi.',
    real: 'Module = menu lo oka link. Admin ga nuvvu kotha modules kuda create cheyochu.',
  },
  listTitle: {
    title: 'List title',
    body: 'Ee list lo e table records chustunnav ani ikkada untundi. Idi Incident table.',
    real: 'Table name = "incident". Browser URL lo kuda "incident_list.do" ani kanipistundi.',
  },
  listNew: {
    title: 'New button',
    body: 'Kotha record create cheyadaniki. Click chesthe empty form open avtundi.',
    real: 'Ee button ki ServiceNow lo "UI Action" ani peru (later lessons lo nerchukuntav).',
  },
  listFilter: {
    title: 'Filter icon',
    body: 'Condition build chesi records ni filter cheyadaniki. Example: Priority = 1 - Critical. Next lesson (Table Filters) lo deeni gurinchi detail ga chestam.',
    real: 'Filter ayyaka paina breadcrumb laaga conditions kanipistayi.',
  },
  listSearch: {
    title: 'Search in list',
    body: 'Ee list lo matrame vethakadaniki. Column select chesukuni word type cheyyi.',
    real: 'Global search kante idi fast — oke table lo vethukutundi.',
  },
  listHeaderCol: {
    title: 'Column header',
    body: 'Click chesthe aa column batti sort avtundi (A→Z / Z→A). Right-click chesthe inka options vastayi.',
    real: 'Real lo header meeda right-click chesthe Group by, Hide column laantivi untayi.',
  },
  listNumber: {
    title: 'Number',
    body: 'Prathi incident ki unique number untundi (INC0010001). Idi auto ga generate avtundi — manam type cheyyam.',
    real: 'Number prefix "INC" Number Maintenance lo set chesthaaru.',
  },
  listPriority: {
    title: 'Priority',
    body: '1 - Critical nunchi 5 - Planning varaku. Idi Impact + Urgency nundi auto ga calculate avtundi.',
    real: 'Priority ni manual ga set cheyalem — Impact & Urgency set chesthe adhe vastundi.',
  },
  listState: {
    title: 'State',
    body: 'Incident ippudu e stage lo undo: New, In Progress, On Hold, Resolved, Closed.',
    real: 'Incident lifecycle ni State batti track chesthaaru.',
  },
  formBack: {
    title: 'Back arrow',
    body: 'List ki thirigi vellataniki. Save cheyyakunda back kodithe changes povachu.',
    real: 'Real lo "unsaved changes" warning raavachu.',
  },
  fNumber: {
    title: 'Number (read-only)',
    body: 'Auto-generated. Idi grey ga undi ante "Read-only" ani artham — edit cheyalem.',
    real: 'Dictionary lo read-only property set chesthe ila avtundi (Intro section lo nerchukunnav).',
  },
  fCaller: {
    title: 'Caller',
    body: 'E user problem report chesaado vallu. Idi Reference field — User table nundi select chesthav.',
    real: 'Magnifier icon click chesthe user list open avtundi.',
  },
  fCategory: {
    title: 'Category',
    body: 'Problem e type? Inquiry, Software, Hardware, Network... Choice list field.',
    real: 'Ee choices ni Admin ga nuvvu customize cheyochu.',
  },
  fState: {
    title: 'State',
    body: 'Incident progress ni cheppe field. New nunchi start ayyi Resolved / Closed varaku velthundi.',
    real: 'State batti kondaru fields editable / mandatory avtayi (UI Policy valla).',
  },
  fImpact: {
    title: 'Impact',
    body: 'Entha mandi / entha business ki problem? 1 - High (chala mandi), 2 - Medium, 3 - Low.',
    real: 'Impact + Urgency kalisi Priority decide chestayi.',
  },
  fUrgency: {
    title: 'Urgency',
    body: 'Entha twaraga fix cheyali? 1 - High, 2 - Medium, 3 - Low.',
    real: 'Impact & Urgency rendu high ayithe Priority 1 - Critical.',
  },
  fPriority: {
    title: 'Priority (auto)',
    body: 'Idi manam select cheyyam — Impact & Urgency batti system calculate chestundi. Oka Business Rule / Data Lookup rule ee pani chestundi.',
    real: 'Data Lookup Rules gurinchi Intro section lo nerchukuntav.',
  },
  fGroup: {
    title: 'Assignment group',
    body: 'E team ki ee incident assign ayyindi — Service Desk, Network, Database laaga.',
    real: 'Assignment rules to auto ga group set cheyochu.',
  },
  fShort: {
    title: 'Short description',
    body: 'Oka line lo problem enti? List lo ide kanipistundi — clear ga rayyali. Idi mandatory field (* red star).',
    real: 'Mandatory field ni empty petti submit chesthe error vastundi.',
  },
  fDescription: {
    title: 'Description',
    body: 'Problem gurinchi full details — steps, error message, screenshot gurinchi.',
    real: 'Ekkuva details ante resolve cheyadam easy.',
  },
  fSubmit: {
    title: 'Submit',
    body: 'Record ni database lo save chesi list ki vellataniki. Kotha record ki "Submit", already unna record ki "Update".',
    real: 'Save = save chesi form lone undadam; Submit = save + list ki velladam. (Intro lo "Save, Submit, Update" lecture chusava?)',
  },
}
