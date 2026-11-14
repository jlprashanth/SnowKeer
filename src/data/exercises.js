// Hands-on exercises: she does them in her OWN real PDI (Brazil), SnowKeer shows task / hint / steps / answer / cleanup.
// Each lessonId must match a lesson in lessons.js. `cleanup` = how to undo the change in her PDI.
// ORDER: cards show in ARRAY order inside each lesson = the order she should do them (dependencies first, levels going up).
//   Ids are stored in her progress — never renumber (that is why e.g. views-3 comes before views-2).
// SHARED practice items — hari.test, Practice Team, the Practice Task / Practice Child tables (+ Practice menu and the roles
//   ServiceNow creates with a table), practice_view — are used by later lessons, so their own cleanup says "keep it" and
//   table-creation-4 ("Final cleanup", shown last in the Table Creation lesson) deletes them. Everything else is undone in the
//   exercise's own cleanup. Exercises that use Practice Task / Practice Child need a "Prerequisite:" note (check-exercises).
// Behaviour follows what was verified in her PDI; anything unverified says "⚠️ PDI lo confirm chesuko".
import { ex } from './lessonKit.js'

export const EXERCISES = [
  /* ---- account ---- */
  ex('account', 1, 'Nee PDI ni open chey', 'easy', {
    scenario: 'Developer site lo login ayyi, nee PDI instance URL kanukkoni, adi direct ga browser lo open chey.',
    hint: 'developer.servicenow.com lo sign in ayyaka profile menu / instance card lo instance details untayi.',
    steps: [
      'developer.servicenow.com open chesi nee account tho sign in ayyi.',
      'Profile menu (top right) leda dashboard lo instance card open chey — Instance URL, status (Online / Hibernating), release (Brazil) kanipistayi. (Site update batti menu perlu konchem marochu.)',
      'Instance URL note chesko (https://devXXXXXX.service-now.com laaga untundi).',
      'Aa URL ni kotha tab lo open chesi admin user tho login ayyi. Admin password gurtu lekapothe developer site lo instance card → "Manage instance password" chudu.',
    ],
    answer: 'Login ayyaka ServiceNow home (Next Experience UI) kanipistundi — paina banner lo "All", "Favorites", "History", "Workspaces", "Admin" menus, globe 🌐 icon (scope + update set) & nee avatar. URL lo devXXXXXX = nee instance peru. Ee URL bookmark chesko.',
  }),
  ex('account', 2, 'Hibernate ayina instance ni wake up chey', 'easy', {
    scenario: 'PDI konni gantalu vaadakapothe hibernate (sleep) avtundi — data safe. Kani dadapu 10 rojulu login avvakapothe ServiceNow instance ni venakki teesukuntundi (reclaim) — appudu nee practice anta potundi. ⚠️ Exact timings PDI lo confirm chesuko (developer site lo chudu). Wake up ela cheyyalo practice chey (instance ippudu Online unte steps chadivi tick chey).',
    steps: [
      'developer.servicenow.com lo sign in ayyi.',
      'Instance card lo status chudu — "Hibernating" ani unte "Wake up" button click chey.',
      'Konni nimishalu wait chey — status "Online" avvali.',
      'Online ayyaka "Open instance" click chey (leda nee URL open chey).',
    ],
    answer: 'Status Online ayyi instance login page open avutundi; nee data ala ne untundi. Gurtu pettuko: hibernate = sleep (data safe), reclaim = instance poyindi (data potundi). Anduke 2–3 rojulaki okasari ayina login avvu.',
  }),

  /* ---- user-admin ---- */
  ex('user-admin', 1, 'Kotha user create chesi role ivvu', 'easy', {
    scenario: '"Hari Test" ane kotha user create chey (User ID: hari.test), ataniki "itil" role ivvu. Ee user ni tarvata chala exercises lo vaadatam (group, impersonate, module roles).',
    hint: 'All → filter lo "Users" → User Administration → Users.',
    steps: [
      'All click chesi filter lo "Users" type chey → User Administration kinda "Users" open chey.',
      'New click chey. User ID: hari.test, First name: Hari, Last name: Test → Submit. (Password ivvakkarledu — impersonate ki password avasaram ledu. Login password kavalante record save chesaka "Set Password" button vaadu.)',
      'Users list lo hari.test open chey.',
      'Kinda "Roles" related list → "Edit..." click chey.',
      'Left list lo "itil" vethiki select chesi ▶ (Add) click chey → Save.',
    ],
    answer: 'hari.test record lo Roles related list lo "itil" kanipistundi. User ki role isthe aa role ki permission unna modules / records matrame chudagalaru.',
    cleanup: 'Ippude delete cheyyakku — ee lesson lo migatha exercises ki & Application Menus lesson lo "Role tho module restrict chey" ki hari.test kavali. "Final cleanup" (Table Creation lesson lo chivari card) lo delete chestam.',
  }),
  ex('user-admin', 2, 'Group create chesi member ni add chey', 'medium', {
    scenario: 'Prerequisite: hari.test user ("Kotha user create chesi role ivvu" exercise). "Practice Team" ane group create chesi, Hari Test ni aa group lo member ga pettu.',
    hint: 'User Administration → Groups, tarvata "Group Members" related list.',
    steps: [
      'All → filter lo "Groups" type chey → User Administration kinda "Groups" open chey.',
      'New → Name: Practice Team → Submit.',
      'Practice Team open chesi kinda "Group Members" related list → "Edit..." click chey.',
      'Hari Test select chesi ▶ add chey → Save.',
    ],
    answer: 'Group Members list lo Hari Test kanipistundi. Groups ni assignment (incident ni team ki assign cheyyadam) kosam & roles ivvadaniki vaadatharu.',
    cleanup: 'Ippude delete cheyyakku — "Group dwara role inherit avvadam" & Data Lookup lesson lo "Kotha Assignment Rule" exercises ki Practice Team kavali. "Final cleanup" lo delete chestam.',
  }),
  ex('user-admin', 3, 'Impersonate: vere user laaga chudu', 'medium', {
    scenario: 'Prerequisite: hari.test user (itil role tho). Hari Test ni impersonate chesi, ataniki e menus kanipistunnayo chudu. Tarvata impersonation end chey.',
    hint: 'Top right lo nee avatar (profile picture) click chey.',
    steps: [
      'Top right nee avatar click chey → "Impersonate user".',
      'Hari Test (hari.test) select chesi Impersonate click chey.',
      'All menu open chesi chudu — Incident laanti itil menus untayi, kani System Definition, System UI laanti admin menus levu.',
      'Malli avatar click → "End impersonation". Avatar lo malli nee admin peru (System Administrator) undo check chey.',
    ],
    answer: 'Impersonate lo Hari roles (itil) ki saripoye menus matrame kanipistayi, admin features kanipinchavu. End impersonation tarvata malli admin ga unnav. (PDI lo emi marchaledu — cleanup avasaram ledu.)',
  }),
  ex('user-admin', 4, 'Group dwara role inherit avvadam', 'hard', {
    scenario: 'Prerequisite: hari.test (itil role tho) + Practice Team group (Hari member) — ee lesson mundu exercises. Best practice: role ni user ki direct ga kakunda GROUP ki ivvu — group members andariki inherit avtundi. Idi test chey.',
    hint: 'Group record lo kuda "Roles" related list untundi.',
    steps: [
      'hari.test open chesi Roles related list → "Edit..." → right side lo "itil" select chesi ◀ (Remove) → Save. Ippudu Hari ki itil ledu.',
      'Practice Team group open chesi Roles related list → "Edit..." → "itil" add → Save.',
      'Malli hari.test open chesi Roles chudu — "itil" malli vachindi, "Inherited" column = true.',
      'Practice Team → Group Members → "Edit..." lo Hari ni teesey → Save. hari.test Roles lo itil poyindi chudu.',
      'Hari ni malli Practice Team lo add chey (Group Members → "Edit..." → add → Save) — itil malli inherit avtundi. Ee state ne tarvata exercises ki kavali.',
    ],
    answer: 'Direct role lekapoyina group valla Hari ki "itil" Inherited = true ga vastundi; group nundi teesesthe role kuda potundi. Real projects lo roles groups ki istaru — user ni group lo add / remove chesthe access marutundi.',
    cleanup: 'Ippude emi teeseyakku: Hari (Practice Team member, itil inherited) "Role tho module restrict chey" exercise ki kavali. "Final cleanup" lo Practice Team & hari.test delete chesinappudu vaati roles / memberships kuda potayi.',
  }),

  /* ---- ui-tour ---- */
  ex('ui-tour', 1, 'Module ni Favorites lo pettu', 'easy', {
    scenario: '"Incident → Open" module ni Favorites lo pettu, tarvata Favorites menu nundi direct ga open chey.',
    hint: 'All menu lo module meeda mouse pedithe pakkana ☆ (star) vastundi.',
    steps: [
      'All click chesi filter lo "incident" type chey.',
      'Incident kinda "Open" module meeda mouse petti ☆ click chey.',
      'Header lo "Favorites" menu (All pakkana) click chey.',
      'Akkada "Open" click chesi incident list open chey.',
    ],
    answer: 'Favorites menu lo "Open" (Incident) kanipistundi, click chesthe open incidents list direct ga vastundi. Daily vaade modules ki idi shortcut.',
    cleanup: 'All menu lo "Open" pakkana ★ (filled star) malli click chesi favorite teesey.',
  }),
  ex('ui-tour', 2, 'Form lo parts gurtupattu', 'easy', {
    scenario: 'Oka incident record open chesi: form header buttons, ☰ (form menu), fields, section tabs, related lists, activity stream ekkada unnayo chudu. Aa record sys_id copy chey.',
    hint: 'Form header left side lo ☰ icon (form header meeda right-click chesina ade menu vastundi).',
    steps: [
      'Incident → All open chesi edaina oka record open chey.',
      'Form header lo buttons (Update, Resolve, Delete...) gamaninchu — click cheyyaku.',
      '☰ click chesi menu chudu: Save, Copy Incident, Configure ▸, Export ▸, View ▸, Create Favorite, Enable Field Watcher, Copy URL, Copy sys_id, Show XML, History ▸, Reload form. Ippudu "Copy sys_id" select chey — notepad lo paste chesi chudu.',
      'Form lo section tabs chudu — nee PDI incident form lo "Notes", "Related Records", "Resolution Information" untayi. Priority field grey (read-only — Data Lookup UI Policy).',
      'Form kinda related lists & activity stream (Work notes / Additional comments history) chudu.',
    ],
    answer: 'sys_id = 32-character unique id (e.g. a1b2c3…). Prathi record ki okate untundi — scripts lo records ni gurtupattadaniki vaadatharu. Incident form sections: Notes, Related Records, Resolution Information. (Emi marchaledu — cleanup avasaram ledu.)',
  }),
  ex('ui-tour', 3, 'Navigator shortcuts: .list & .do', 'easy', {
    scenario: 'Navigator filter lo "incident.list" type chesi incident list open chey. Tarvata "incident.do" tho kotha incident form open chey.',
    hint: 'All menu filter box lo type chesi Enter — module kakunda direct ga page open avtundi.',
    steps: [
      'All click chesi filter lo "incident.list" type chesi Enter nokku.',
      'List open ayyaka malli All → filter lo "incident.do" type chesi Enter. (Form ni Submit cheyyakunda close chey.)',
      'Ide pattern e table ki ayina pani chestundi: <table_name>.list / <table_name>.do.',
    ],
    answer: 'incident.list = incident list, incident.do = kotha incident form. Admins ee shortcuts chala vaadatharu (e.g. sys_user.list; tarvata nuvvu create chese u_practice_task.list kuda).',
  }),
  ex('ui-tour', 4, 'List ni nee kosam personalize chey (columns, sort, group)', 'medium', {
    scenario: 'Incident list ni NEE account kosam matrame marchu: ⚙ (gear) tho "Impact" column add chey, Impact tho sort chey, State tho group by chey. Tarvata anni reset chey.',
    hint: 'List column headers left side lo ⚙ = Personalize List Columns (nee kosam matrame). ☰ → Configure → List Layout andari list marchestundi — ee exercise lo daanni touch cheyyaku.',
    steps: [
      'Incident → All open chey. (Priority column already list lo undi — anduke manam Impact add chestam.)',
      'Column headers row lo left side ⚙ click chey → "Personalize List Columns" dialog.',
      'Available lo "Impact" select chesi ▶ add chey → OK.',
      '"Impact" column header click chesi sort chey (malli click chesthe reverse order).',
      '"State" column header meeda right-click → "Group By State" select chey.',
    ],
    answer: 'Impact column vastundi, aa column tho sort avutundi, State vaari ga groups (heading + count) kanipistayi. ⚙ marpulu nee account ki matrame — vere users list maradu. Andari kosam marchalante ☰ → Configure → List Layout (global, admin change).',
    cleanup: 'Group by teesey: list title pakkana ☰ (list menu) → Group By → "-- None --" (leda State header right-click lo "Ungroup" unte adi) — ⚠️ exact option PDI lo confirm chesuko. Columns: ⚙ → "Reset to column defaults" (leda Impact ni ◀ tho teesi OK). Sort nee personal preference matrame — marchakkarledu.',
  }),

  /* ---- products ---- */
  ex('products', 1, 'Important websites bookmark chey', 'easy', {
    scenario: 'Developer site, Docs, Community, Learning site — ee 4 websites browser lo open chesi "ServiceNow" bookmark folder lo pettu.',
    steps: [
      'developer.servicenow.com (PDI, developer guides) open chesi bookmark chey.',
      'ServiceNow Docs (docs.servicenow.com — www.servicenow.com/docs ki redirect avvachu) open chesi bookmark chey.',
      'Community (www.servicenow.com/community) open chesi bookmark chey.',
      'Learning site (Now Learning — ippudu "ServiceNow University", learning.servicenow.com) open chesi bookmark chey. ⚠️ Site peru / URL marindi — browser lo open chesi confirm chesuko.',
      'Anni oka "ServiceNow" folder lo pettu.',
    ],
    answer: 'Developer site = PDI & developer training, Docs = official documentation (features, API reference, release notes), Community = questions / answers, Learning site = free courses & certifications.',
  }),
  ex('products', 2, 'Product → department match chey', 'easy', {
    scenario: 'ITSM, HRSD, CSM, SecOps — e product e department / team kosam? Docs site lo okkokati search chesi confirm chey.',
    steps: [
      'Docs site lo "ITSM" search chey.',
      'Prathi product (ITSM, HRSD, CSM, SecOps) overview page chadivi, oka line summary rayyi.',
    ],
    answer: 'ITSM = IT support (incidents, problems, changes). HRSD = HR cases (employees). CSM = customer service (external customers). SecOps = security incidents & vulnerabilities.',
  }),

  /* ---- architecture ---- */
  ex('architecture', 1, 'Instance build info chudu', 'easy', {
    scenario: 'Nee instance e release (build) lo undo, ela kanukkovali?',
    hint: 'Instance URL ki /stats.do add chey.',
    steps: [
      'Nee instance lo login ayyi undu.',
      'Browser address bar lo https://devXXXXXX.service-now.com/stats.do open chey.',
      'Top lo "Build name" & "Build date" chudu.',
    ],
    answer: 'Build name lo release peru untundi — nee PDI lo "Brazil". stats.do lo node, memory, sessions info kuda untundi — architecture lesson lo cheppina application nodes idhe. (Read-only page — cleanup ledu.)',
  }),
  ex('architecture', 2, 'MID Server list chudu', 'easy', {
    scenario: 'MID Server list open chesi nee PDI lo entha unnayo chudu.',
    steps: [
      'All → filter "MID Server" → MID Server → Servers open chey.',
      'List lo entha records unnayo chudu.',
    ],
    answer: 'PDI lo normal ga empty untundi. MID Server = company network lo install chese chinna Java agent (cloud instance ni internal systems tho connect chestundi). PDI ki avasaram ledu.',
  }),

  /* ---- table-creation ---- */
  ex('table-creation', 1, 'Custom table create chey (Practice Task)', 'medium', {
    scenario: '"Practice Task" ane custom table create chey — columns: Topic (String), Done (True/False) — "Practice" menu lo module tho. Stage 1 lo chala exercises (form design, views, dictionary, process flow, save/insert, child tables, update sets, UI / Data policies) ee table meeda ne. Anduke "Extensible" tick chey, "Extends table" empty ga vadilesey (Task ni extend cheyyaku).',
    hint: 'All → System Definition → Tables → New.',
    steps: [
      'All → filter "Tables" → System Definition → Tables → New.',
      'Label: Practice Task (Name auto ga u_practice_task vastundi). "Extends table" empty ga vadilesey.',
      '"Create module" tick undi chudu; "Add module to menu": -- Create new --, "New menu name": Practice.',
      '"Controls" tab lo "Extensible" tick chey (child tables exercise ki kavali). Akkade Auto-number (Prefix / Number / Maximum digits), "Create access controls" & "User role" (u_<table>_user pattern → u_practice_task_user) kuda untayi — ala ne vadilesey; aa role ni Final cleanup lo delete chestam.',
      '"Columns" tab lo: "Topic" (Type String), "Done" (Type True/False) add chey.',
      'Submit chey.',
    ],
    answer: 'Navigator lo "Practice" menu, daani kinda Practice Task module vastayi. Table name "u_" tho start avtundi (custom ani gurtu). Columns lo Topic, Done + system columns (Created, Updated, sys_id...) untayi. Task ni extend cheyyaledu kabatti idi "task kaani" table.',
    cleanup: 'Ippude delete cheyyakku! Stage 1 lo chala exercises ki idi kavali. Anni ayyaka "Final cleanup" (ee lesson lo chivari card) lo delete chestam.',
  }),
  ex('table-creation', 2, 'Table lo records create chey', 'easy', {
    scenario: 'Prerequisite: "Practice Task" table ("Custom table create chey" exercise). Practice Task lo 2 records create chey: Topic "Learn tables" (Done = true), Topic "Learn forms" (Done = false).',
    steps: [
      'Navigator lo Practice → Practice Task module click chey (leda filter lo u_practice_task.list).',
      'New click chesi Topic: Learn tables, Done tick → Submit.',
      'Malli New: Topic: Learn forms, Done untick → Submit.',
    ],
    answer: 'List lo 2 rows kanipistayi. Prathi record ki auto ga sys_id, Created, Created by untayi.',
    cleanup: 'Ee records ni unchu — tarvata exercises (views, UI policies, save/insert...) ki Done = true & Done = false records kavali. Final cleanup lo table tho patu potayi.',
  }),
  ex('table-creation', 3, 'Choice column add chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table. "Level" ane Choice column add chesi, choices: Easy, Medium, Hard pettu.',
    hint: 'Column type "Choice"; choices daani dictionary record lo "Choices" related list lo add chestam.',
    steps: [
      'All → System Definition → Tables → u_practice_task (Practice Task) open chey.',
      '"Columns" related list lo New: Column label "Level", Type: Choice → Submit.',
      'Level column (dictionary record) open chesi kinda "Choices" related list → New.',
      'Label: Easy, Value: easy → Submit. Medium (medium), Hard (hard) kuda ala add chey.',
      'Practice Task form lo Level dropdown chudu (form lo lekapothe ☰ → Configure → Form Layout lo ▶ tho add chey).',
    ],
    answer: 'Level dropdown lo Easy / Medium / Hard options vastayi. Choice column = fixed values lo okati select chese field (incident lo State, Category laaga).',
    cleanup: 'Ippude teeseyakku — Process Flow lesson lo "Practice Task ki custom Process Flow" exercise ki Level kavali. Final cleanup lo table tho patu potundi.',
  }),

  /* ---- form-design ---- */
  ex('form-design', 1, 'Form lo fields order marchu (+ 2 columns)', 'medium', {
    scenario: 'Prerequisite: Practice Task table + records. Practice Task form lo "Done" field "Topic" paina ravali — Form Layout tho marchu. Bonus: rendu fields ni 2 columns (left | right) lo pettu.',
    hint: 'Form ☰ → Configure → Form Layout. Selected list pakkana ▲ ▼ arrows.',
    steps: [
      'Practice Task record open chey (Practice → Practice Task, leda u_practice_task.list).',
      '☰ → Configure → Form Layout click chey.',
      'Right (Selected) list lo "Done" select chesi ▲ tho Topic paina teesuko → Save. Form lo order chudu.',
      'Bonus (2 columns): malli Form Layout lo Available nundi "|- begin_split -|" ni Done paina, "|- split -|" ni Done – Topic madhyalo, "|- end_split -|" ni Topic kinda pettu → Save. Ippudu Done left column, Topic right column.',
    ],
    answer: 'Form lo Done mundu, Topic tarvata. Bonus chesthe Done | Topic 2 columns lo. Form Layout (slushbucket) = fields add / remove / order + split items tho columns.',
    cleanup: 'Optional (Final cleanup lo table tho patu potundi): Form Layout lo split items (|- begin_split -|, |- split -|, |- end_split -|) ◀ tho teesi, Topic ni ▲ tho Done paina pettu → Save.',
  }),
  ex('form-design', 2, 'Kotha form section create chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table + records. Practice Task form ki "Extra Info" ane kotha section add chesi, daantlo "Updated" field pettu. Section ni Form Layout nunche create chey — appude adi form ki attach avtundi.',
    hint: 'Form Layout lo "Section" dropdown lo "New..." option untundi.',
    steps: [
      'Practice Task record open chesi ☰ → Configure → Form Layout.',
      'Paina "View name" = Default view ani chudu. "Section" dropdown lo "New..." select chey → section name: Extra Info → OK. (⚠️ Option peru PDI lo confirm chesuko.)',
      'Ippudu Section = Extra Info (Selected list empty). Available lo "Updated" select chesi ▶ add chey → Save.',
      'Form refresh chesi kinda kotha "Extra Info" section (tab) chudu.',
    ],
    answer: 'Form lo "Extra Info" section vastundi, daantlo Updated field. Form Layout lo create chesina section automatic ga form ki attach avtundi. (System UI → Form Sections lo direct ga record create chesthe adi form ki attach avvadu — anduke Form Layout vaadam.)',
    cleanup: 'Optional (Final cleanup lo table tho patu potundi): Form Layout lo Section "Extra Info" select chesi Updated ni ◀ tho teesi Save; tarvata System UI → Form Sections lo Table u_practice_task, Caption "Extra Info" record delete chey.',
  }),

  /* ---- views ---- */
  ex('views', 1, 'Kotha View create chesi vaadu', 'medium', {
    scenario: 'Prerequisite: Practice Task table + records. "practice_view" ane View create chesi, Practice Task form ni aa view lo Topic matrame chupinchela design chey.',
    hint: 'All → System UI → Views. View layout = Form Layout lo "View name" select chesi.',
    steps: [
      'All → filter "Views" → System UI → Views → New. Name: practice_view, Title: Practice View → Submit.',
      'Practice Task record open chesi ☰ → Configure → Form Layout.',
      'Paina "View name" dropdown lo "Practice View" select chey — ippudu ee view layout ne edit chestunnav (Default view kaadu ani confirm chesko!).',
      'Selected lo Topic matrame undela chey (migatavi ◀ tho teesey; Topic lekapothe ▶ tho add chey) → Save.',
      'Form lo ☰ → View → "Practice View" select chey — Topic matrame kanipistundi. Tarvata ☰ → View → "Default view" ki thirigi marchu.',
    ],
    answer: 'Practice View lo Topic matrame; Default view lo anni fields. Oke table ki different users / situations kosam different layouts ivvadam = views purpose.',
    cleanup: 'Ippude delete cheyyakku — "View lo List layout marchu" & "View Rule tho auto switch chey" exercises ki practice_view kavali. Form ni Default view lo unchu. practice_view record ni Final cleanup lo (tables delete chesaka) delete chestam.',
  }),
  ex('views', 3, 'View lo List layout marchu', 'medium', {
    scenario: 'Prerequisite: Practice Task table + practice_view ("Kotha View create chesi vaadu" exercise). practice_view lo Practice Task LIST lo "Topic" column matrame kanipinchela chey.',
    hint: 'List title ☰ → Configure → List Layout lo view select chey. (⚙ gear nee personal list kosam matrame — view layout kaadu.)',
    steps: [
      'Practice Task list open chey (filter lo u_practice_task.list).',
      'List title pakkana ☰ → Configure → List Layout.',
      'Paina view dropdown lo "Practice View" select chey. (Dropdown lekapothe: browser lo https://devXXXXXX.service-now.com/u_practice_task_list.do?sysparm_view=practice_view open chesi akkada nundi List Layout open chey.)',
      'Selected lo Topic matrame unchu → Save.',
      'List title ☰ → View → "Practice View" lo chudu, tarvata ☰ → View → "Default view" ki thirigi marchu.',
    ],
    answer: 'practice_view lo list lo Topic column matrame; Default view lo anni columns. Views forms ki matrame kaadu, lists ki kuda.',
    cleanup: 'Separate cleanup ledu — ee list layout practice_view ki matrame; Final cleanup lo table & view tho patu potundi. List ni Default view lo unchu.',
  }),
  ex('views', 2, 'View Rule tho auto switch chey', 'hard', {
    scenario: 'Prerequisite: Practice Task table + practice_view (ee lesson mundu exercises) + Done = true & Done = false records. Done = true unna Practice Task records open chesthe automatic ga "practice_view" load avvali — View Rule create chey.',
    hint: 'System UI → View Rules.',
    steps: [
      'All → filter "View Rules" → System UI → View Rules → New.',
      'Name: Done tasks view, Table: Practice Task, View: practice_view, Active tick (migatha fields default ga vadilesey).',
      'Condition: Done is true → Submit.',
      'Practice Task list nundi Done = true record open chey → practice_view (Topic matrame). Done = false record open chey → Default view.',
    ],
    answer: 'Done = true records practice_view lo, migatavi Default view lo open avtayi. View Rule = record condition batti form view ni automatic ga marchadam.',
    cleanup: 'View Rule "Done tasks view" ni IPPUDE delete chey (System UI → View Rules → open → Delete) — lekapothe tarvata exercises lo (UI Policies) Done = true records Practice View lo open ayyi Done field kanipinchadu. practice_view record Final cleanup lo.',
  }),

  /* ---- dictionary ---- */
  ex('dictionary', 1, 'Field ni mandatory chey', 'easy', {
    scenario: 'Prerequisite: Practice Task table. Practice Task lo "Topic" ni dictionary lo mandatory chey. Topic empty ga Submit cheyyadaniki try chesi error chudu.',
    hint: 'Form lo field label meeda right-click → menu lo Configure Label, Configure Dictionary, Configure Styles, Show Security Rules... untayi — "Configure Dictionary" select chey.',
    steps: [
      'Practice Task → New form open chesi (u_practice_task.do) "Topic" label meeda right-click → Configure Dictionary.',
      'Mandatory tick chesi Update click chey.',
      'Malli Practice Task → New: Topic empty ga Submit chey.',
    ],
    answer: 'Topic ki red ∗ vastundi; empty ga Submit chesthe "The following mandatory fields are not filled in: Topic" message. Dictionary Mandatory forms lo (browser lo) enforce avtundi — server scripts (GlideRecord insert / update), imports empty value tho save cheyyagalavu. Form bayata kuda (list edit, imports, web services) aapalante Data Policy (Data Policies lesson).',
    cleanup: 'Ippude chey: Topic → Configure Dictionary → Mandatory untick → Update. (Tarvata exercises Topic ni mandatory kakunda expect chestayi.)',
  }),
  ex('dictionary', 2, 'Default value set chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Practice Task lo Topic ki default value "Untitled" pettu. Kotha record open chesi chudu.',
    steps: [
      'Practice Task form lo (u_practice_task.do) Topic label → right-click → Configure Dictionary.',
      '"Default Value" tab open chesi Default value: Untitled → Update.',
      'Practice Task → New click chey (Submit cheyyakkarledu).',
    ],
    answer: 'Kotha form lo Topic lo "Untitled" already untundi (nuvvu marchukovachu). Default value kotha records ki matrame — existing records maravu.',
    cleanup: 'Ippude chey: Configure Dictionary → Default value empty chesi Update. (Child tables lesson lo dictionary override exercise parent ki default LEDU ani expect chestundi.)',
  }),
  ex('dictionary', 3, 'Read-only field', 'medium', {
    scenario: 'Prerequisite: Practice Task table + records. Practice Task lo "Done" ni dictionary lo read-only chesi, form lo edit avutundo ledo check chey.',
    steps: [
      'Done label → right-click → Configure Dictionary.',
      'Read only tick chesi Update click chey.',
      'Oka Practice Task record open chey — Done change cheyyadaniki try chey.',
    ],
    answer: 'Done field grey ga untundi, edit cheyyaleru. (Note: dictionary Read only forms / UI ki matrame — server scripts (GlideRecord) Done ni marchagalavu; nee PDI lo test chesindi.)',
    cleanup: 'Ippude chey: Read only untick chesi Update. (UI Policies exercises lo Done ni form lo marchali.)',
  }),

  /* ---- process-flow ---- */
  ex('process-flow', 1, 'Process Flow ela pani chestundo chudu (read-only)', 'easy', {
    scenario: 'Process Flow bar (form top lo stages) ekkada nundi vastundo chudu: System UI → Process Flow records, System UI → Formatters lo "process_flow.xml" formatter records & Form Layout. Ee exercise lo emi marchavu — chudatam matrame.',
    hint: 'All → filter "Process Flow" → System UI → Process Flow. Formatters kosam All → filter "Formatters".',
    steps: [
      'All → filter lo "Process Flow" type chesi System UI → Process Flow open chey.',
      'List lo "Table" column chudu (Table header right-click → Group By Table). Incident ki okka record kuda ledu — gamaninchu.',
      'Vere table di oka record unte open chesi fields chudu: Name, Label, Table, Order, Condition, Active, Description. Prathi stage = oka record. (List mottam empty ayina parledu.)',
      'All → filter lo "Formatters" type chesi System UI → Formatters open chey. Formatter = "process_flow.xml" unna rows chudu — Table lo problem, change_request, problem_task laanti konni tables matrame untayi. "Process Flow" formatter global ga ledu: e table ki ee record undo, aa table Form Layout lo ne "Process Flow" vastundi. Emi marchakunda bayataki ra.',
      'Oka incident open chesi ☰ → Configure → Form Layout → Available lo "Process Flow" undo chudu (Formatters list lo incident row lekapothe ikkada kuda raadu). Add cheyyakunda, Save click cheyyakunda back arrow tho bayataki ra.',
    ],
    answer: 'Process Flow bar ki moodu kavali: (1) sys_process_flow records — prathi stage oka record (Name, Label, Table, Order, Condition), (2) aa table ki Formatter record (System UI → Formatters, Formatter process_flow.xml) — nee PDI lo konni tables ki matrame undi, (3) Form Layout lo "Process Flow" formatter add cheyyadam. Nee PDI lo incident ki stage records levu. Bar display-only: stage click chesthe State maradu; record lo field marchi save chesthe aa condition batti highlight marutundi. Next exercise lo Practice Task ki ee moodu build chestam.',
    cleanup: 'Emi marchaledu. (Ee exercise paata version lo incident Form Layout ki "Process Flow" formatter add chesi unte: Form Layout lo daanni ◀ tho teesi Save.)',
  }),
  ex('process-flow', 2, 'Practice Task ki custom Process Flow', 'hard', {
    scenario: 'Prerequisite: Practice Task table + "Level" choice column (Easy / Medium / Hard — "Choice column add chey" exercise) + records. Level batti Easy → Medium → Hard bar chupinche Process Flow build chey: prathi stage oka sys_process_flow record, plus Practice Task ki "Process Flow" Formatter record (custom table ki adi lekunda Form Layout lo formatter raadu).',
    hint: 'Stages: System UI → Process Flow → New (Name, Label, Table, Order, Condition). Formatter: System UI → Formatters → New (Formatter "process_flow.xml", Table = Practice Task).',
    steps: [
      'All → System UI → Process Flow → New.',
      'Name: Easy, Label: Easy, Table: Practice Task, Order: 100, Condition: Level is Easy → Submit. (Form lo Name, Label rendu untayi — rendu lo stage peru rayyi.)',
      'Malli New: Name / Label Medium, Order 200, Condition Level is Medium → Submit. Tarvata Name / Label Hard, Order 300, Condition Level is Hard → Submit.',
      'Formatter record: All → filter "Formatters" → System UI → Formatters → New. Name: Process Flow, Formatter: process_flow.xml, Table: Practice Task (u_practice_task), Type: Formatter → Submit. (Nee PDI lo process_flow.xml formatter problem, change_request, problem_task laanti konni tables ki matrame undi — global ga ledu. Anduke custom table ki idi mundu create cheyyali.)',
      'Practice Task record open chesi ☰ → Configure → Form Layout → Available lo "Process Flow" select chesi ▶ → Selected lo ▲ tho top ki → Save.',
      'Record lo Level = Easy pettu → ☰ → Save: bar lo Easy highlight. Level = Hard chesi malli Save → Hard highlight. (Level form lo lekapothe Form Layout lo add chey.)',
    ],
    answer: 'Form top lo Easy → Medium → Hard bar; saved Level ki match ayye stage highlight. Order = stages order, Condition = e stage current. Bar ki moodu kavali: stage records, aa table ki Formatter record (process_flow.xml), Form Layout lo formatter. Bar display-only — Level ni marchadu, record value ni chupistundi anthe. (⚠️ Highlight save chesaka form reload ayyaka matrame marutundi ani anukuntunnam — PDI lo confirm chesuko.)',
    checks: ['process-flow-save'],
    cleanup: 'Ee order lo chey: (1) Practice Task Form Layout lo "Process Flow" formatter ◀ tho teesi Save. (2) System UI → Formatters lo Table = Practice Task (u_practice_task), Formatter process_flow.xml unna "Process Flow" record delete chey. (3) System UI → Process Flow lo Table = Practice Task unna 3 records (Easy, Medium, Hard) delete chey.',
  }),

  /* ---- menus-modules ---- */
  ex('menus-modules', 2, 'Shortcut: Create New module', 'easy', {
    scenario: 'Navigator filter lo "incident" type chesi, "Create New" module tho direct ga kotha incident create chey.',
    steps: [
      'All click chesi filter lo "incident" type chey.',
      'Incident kinda "Create New" module click chey.',
      'Caller (e.g. Abel Tuter) & Short description ("Shortcut test") fill chesi Submit. (Rendu mandatory — red ∗ chudu.)',
    ],
    answer: 'Direct ga kotha incident form open avutundi — list open chesi New click cheyyalsina avasaram ledu. Nee PDI lo Caller & Short description rendu mandatory.',
    cleanup: 'Incident list lo "Shortcut test" incident open chesi Delete → confirm.',
  }),
  ex('menus-modules', 1, 'Menu + Module create chey', 'medium', {
    scenario: '"My Tools" ane Application Menu create chesi, daantlo "Open Incidents" ane module pettu (Incident list, State = New). Ee lesson lo next exercises kuda ide menu vaadatayi.',
    hint: 'System Definition → Application Menus, tarvata System Definition → Modules.',
    steps: [
      'All → filter "Application Menus" → System Definition → Application Menus → New. Title: My Tools, Order: 160 → Submit.',
      'All → filter "Modules" → System Definition → Modules → New. Title: Open Incidents, Application menu: My Tools.',
      'Link type: List of Records, Table: Incident. Filter lo State is New pettu → Submit.',
      'Browser page refresh chesi All lo "My Tools" vethiki → Open Incidents click chey.',
    ],
    answer: 'All menu lo My Tools vastundi; Open Incidents click chesthe State = New incidents list open avtundi (breadcrumb lo filter kanipistundi).',
    cleanup: 'Ippude delete cheyyakku — ee lesson lo next exercises ("New Record" link type module, Role tho module restrict chey) ki My Tools kavali. "Role tho module restrict chey" cleanup lo anni kalipi delete chestam.',
  }),
  ex('menus-modules', 3, '"New Record" link type module', 'medium', {
    scenario: 'Prerequisite: "My Tools" menu ("Menu + Module create chey" exercise). My Tools lo "Log Incident" ane module create chey — click chesthe direct ga kotha incident FORM open avvali (list kaadu).',
    steps: [
      'All → System Definition → Modules → New. Title: Log Incident, Application menu: My Tools.',
      'Link type: New Record, Table: Incident → Submit.',
      'Page refresh chesi All → My Tools → Log Incident click chey. (Form ni Submit cheyyakunda close chey.)',
    ],
    answer: 'Kotha incident form direct ga open avutundi. "List of Records" = list; "New Record" = empty kotha form — idi difference.',
    cleanup: 'Ippude delete cheyyakku — "Role tho module restrict chey" cleanup lo My Tools menu tho patu delete chestam.',
  }),
  ex('menus-modules', 4, 'Role tho module restrict chey', 'hard', {
    scenario: 'Prerequisite: "My Tools" menu (ee lesson mundu exercises) + hari.test user (User Administration lesson — itil role, direct ga leda Practice Team dwara). "Admin Only" ane module create chesi, admin role unna vallaki matrame kanipinchela chey. Hari ki kanipinchadu ani impersonate chesi verify chey.',
    hint: 'Module form lo "Roles" field untundi.',
    steps: [
      'All → System Definition → Modules → New: Title "Admin Only", Application menu: My Tools, Link type: List of Records, Table: User (sys_user).',
      'Module form lo Roles field lo "admin" pettu → Submit.',
      'Page refresh chesi All → My Tools chudu — admin ga nuvvu "Admin Only" chustav.',
      'Avatar → Impersonate user → Hari Test. All → My Tools chudu — Open Incidents, Log Incident unnayi kani Admin Only ledu.',
      'Avatar → End impersonation (malli admin ga unnav ani check chey).',
    ],
    answer: 'Admin ki "Admin Only" kanipistundi, Hari ki kanipinchadu. Module "Roles" = aa role unna vallaki matrame navigator lo vastundi. Gurtu: idi menu ni clean ga unchutundi anthe — data ni protect chesedi ACLs.',
    cleanup: 'Mundu End impersonation ayyindo check chey. Tarvata System Definition → Application Menus → "My Tools" open chesi kinda Modules related list lo Open Incidents, Log Incident, Admin Only delete chey, tarvata My Tools menu Delete. (hari.test ni Final cleanup lo delete chestam.)',
  }),

  /* ---- table-filters ---- */
  ex('table-filters', 1, 'AND filter tho records vethuku', 'easy', {
    scenario: 'Incident list lo "Priority = 1 - Critical AND State = New" filter apply chey.',
    steps: [
      'Incident → All open chey.',
      'Filter funnel icon click chey.',
      'Priority is 1 - Critical pettu, tarvata "AND" click chesi State is New add chey.',
      'Run click chey.',
    ],
    answer: 'Rendu conditions match ayye records matrame list lo untayi (0 rows vachina filter correct — data lo alanti incidents lekapovachu). Breadcrumb lo applied conditions kanipistayi.',
  }),
  ex('table-filters', 3, 'Right-click: Show Matching / Filter Out', 'easy', {
    scenario: 'Incident list lo oka cell value meeda right-click chesi aa value unna records matrame chudu, tarvata aa value unna records ni teesesi (filter out) chudu.',
    hint: 'List cell meeda right-click → "Show Matching" / "Filter Out".',
    steps: [
      'Incident → All open chey.',
      'Edaina row lo State cell meeda right-click → Show Matching.',
      'Breadcrumb lo filter add ayyindi chudu. Breadcrumb lo modati "All" click chesi filter clear chey.',
      'Malli State cell right-click → Filter Out chey, difference chudu.',
    ],
    answer: 'Show Matching = aa value unna records matrame. Filter Out = aa value unna records tappa migatavi anni. Funnel open cheyyakunda quick filter ki idi best.',
  }),
  ex('table-filters', 5, '"is empty" tho missing data vethuku', 'easy', {
    scenario: 'Assignment group ledu (empty) unna incidents matrame chupinchu.',
    steps: [
      'Incident list → Filter funnel open chey.',
      'Field: Assignment group, operator: "is empty" → Run.',
      'Operator "is not empty" tho kuda try chey.',
    ],
    answer: 'Empty operator tho assignment lekunda unna incidents kanipistayi — support teams "unassigned tickets" ila roju chustaru.',
  }),
  ex('table-filters', 2, 'OR condition & save filter', 'medium', {
    scenario: '"Priority = 1 OR Priority = 2" filter chesi, adi "High priority" ani save chey, malli load chey.',
    hint: 'Condition row pakkana "OR" button — adi aa condition tho OR add chestundi.',
    steps: [
      'Incident → All → Filter funnel open chey.',
      'Priority is 1 - Critical pettu, aa row pakkana "OR" click chesi Priority is 2 - High add chey → Run.',
      'Funnel malli open chesi "Save..." click chey → Name: High priority → Save.',
      'Breadcrumb lo "All" click chesi filter clear chey. Tarvata list title pakkana ☰ → Filters → "High priority" click chesi load chey. (⚠️ Menu place PDI lo confirm chesuko.)',
    ],
    answer: 'Priority 1 leka 2 unna incidents vastayi. Saved filter tho same filter malli build cheyyakunda okka click lo load chestav.',
    cleanup: 'All → filter lo "sys_filter.list" type chesi Enter (saved filters table) → "High priority" record open → Delete.',
  }),
  ex('table-filters', 4, 'Dot-walk filter', 'medium', {
    scenario: 'Incident list ni Caller → Department tho filter chey (e.g. Caller department "Customer Support" unna incidents).',
    hint: 'Filter field list lo reference field (Caller) ni expand chesi daani fields (Department) select cheyyochu.',
    steps: [
      'Mundu oka incident Caller user record open chesi Department chudu (empty unte vere incident caller try chey) — aa department peru gurtupettuko.',
      'Incident list → Filter funnel click chey.',
      'Field list lo "Caller" pakkana ">" (expand) click chesi "Department" select chey. (">" lekapothe list chivara "Show Related Fields" select chesi Caller fields chudu.)',
      'Operator "is", value: aa department → Run.',
    ],
    answer: 'Caller user record lo aa Department unna incidents matrame vastayi. Reference field nundi daani fields ki velladam = dot-walking (caller_id.department). Scripts lo kuda ide idea (gr.caller_id.department).',
  }),
  ex('table-filters', 6, 'Nested AND / OR', 'hard', {
    scenario: '(Priority is 1 OR Priority is 2) AND State is New AND Assignment group is empty — ee filter build chesi "Unassigned urgent" ani save chey.',
    hint: 'Priority rendu conditions OR tho (same row group), migatha rendu AND tho.',
    steps: [
      'Filter funnel open chey: Priority is 1 - Critical.',
      'Aa condition pakkana "OR" click chesi Priority is 2 - High add chey.',
      '"AND" click chesi State is New add chey.',
      'Malli "AND" click chesi Assignment group is empty add chey → Run.',
      'Rows chudu, tarvata "Save..." lo "Unassigned urgent" ani save chey.',
    ],
    answer: 'Priority 1 leka 2 + State New + Assignment group empty — moodu kalisi match ayye incidents. Encoded query: priority=1^ORpriority=2^state=1^assignment_groupISEMPTY — ^OR daani mundu condition tho kalisi okka group avtundi, ^ ante AND.',
    cleanup: 'All → "sys_filter.list" → "Unassigned urgent" record open → Delete.',
  }),

  /* ---- save-submit ---- */
  ex('save-submit', 1, 'Submit vs Save vs Update', 'easy', {
    scenario: 'Kotha incident create chesi (Submit), tarvata aa record lo Save, Update try chey. E button eppudu untundo, click chesaka ekkadiki veltavo gamaninchu.',
    steps: [
      'Incident → Create New open chey. Form header lo "Submit" button chudu.',
      'Caller (e.g. Abel Tuter), Short description ("Save vs Submit test") fill chesi Submit → list ki vellav.',
      'List lo aa incident open chey — ippudu header lo "Submit" ledu, "Update" undi (existing record).',
      'Description lo "first save" ani rasi ☰ → Save click chey — save ayyi form lone unnav.',
      'Description ni "then update" ga marchi Update click chey — save ayyi list ki vellav. (Incident ☰ lo "Insert" / "Insert and Stay" levu — next exercise lo enduko chustam.)',
    ],
    answer: 'Kotha record → Submit (insert + list ki). Existing record → Update (save + list ki). Save (☰) = save chesi form lone untav.',
    cleanup: 'Aa "Save vs Submit test" incident open chesi Delete → confirm.',
  }),
  ex('save-submit', 2, 'Insert vs Insert and Stay', 'medium', {
    scenario: 'Prerequisite: Practice Task table + "Learn forms" record (Table Creation lesson exercises). Incident laanti task tables lo Insert / Insert and Stay kanipinchavu (property glide.ui.task.insert = false valla hide). Anduke task kaani Practice Task meeda practice chey: Insert = open chesina record ni KOTHA record ga copy cheyyadam.',
    hint: 'Existing record open chesi ☰ (form menu) chudu — Save, Insert, Insert and Stay untayi.',
    steps: [
      'Mundu oka incident open chesi ☰ chudu — Insert / Insert and Stay levu ani gamaninchu.',
      'Practice Task list lo "Learn forms" record open chey.',
      'Topic ni "Learn forms - copy 1" ki marchi ☰ → Insert click chey. Ekkadiki vellavo chudu — list lo kotha row vachindi, original "Learn forms" maaraledu.',
      'Malli "Learn forms" open chesi Topic "Learn forms - copy 2" chesi ☰ → Insert and Stay click chey — ippudu aa kotha record form lone unnav.',
      'List lo 3 rows chudu: original + 2 copies.',
    ],
    answer: 'Insert = form lo unna values tho KOTHA record create chesi list ki veltav. Insert and Stay = kotha record create chesi aa kotha record lone untav. Original record maaradu (form lo marchina Topic original lo save avvadu). Task tables lo ee rendu default ga hide.',
    cleanup: 'Practice Task list lo "Learn forms - copy 1", "Learn forms - copy 2" select chesi Delete. Original "Learn forms" unchu — tarvata exercises ki kavali.',
  }),

  /* ---- child-tables ---- */
  ex('child-tables', 1, 'Child table create chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table ("Extensible" tick chesi undali — "Custom table create chey" exercise). "Practice Child" table create chey, Practice Task ni extend chesi. Parent columns inherit avtayi ani chudu.',
    hint: 'Table form lo "Extends table" field.',
    steps: [
      'All → System Definition → Tables → New. Label: Practice Child (Name: u_practice_child).',
      'Extends table: Practice Task select chey. (List lo raakapothe: Practice Task table → Controls tab → Extensible tick → Update, malli try chey.)',
      '"Create module" untick chey (ee table ki menu avasaram ledu — u_practice_child.list / .do shortcuts vaadatam).',
      'Submit chey.',
      'Filter lo u_practice_child.do open chesi Topic & Done fields unnayo chudu (Submit cheyyakunda close chey).',
    ],
    answer: 'Practice Child form lo Topic & Done already untayi — nuvvu columns add cheyyaledu, parent nundi inherit ayyayi. Incident, Problem, Change kuda ilaane Task ni extend chestayi.',
    cleanup: 'Ippude delete cheyyakku — ee lesson lo next 2 exercises ki kavali. Final cleanup lo (Practice Task kante MUNDU) delete chestam.',
  }),
  ex('child-tables', 2, 'Parent list lo child records', 'medium', {
    scenario: 'Prerequisite: Practice Child table ("Child table create chey" exercise). Practice Child lo oka record create chesi, Practice Task (parent) list lo adi kanipistundo chudu, "Class" column tho gurtupattu.',
    steps: [
      'u_practice_child.do open chesi Topic: "From child" → Submit.',
      'Practice Task list open chey (u_practice_task.list) — "From child" record ikkada kuda kanipistundi.',
      'List ⚙ (Personalize List Columns) lo "Class" column add chey → "From child" row lo Class = Practice Child, migatavi Practice Task.',
    ],
    answer: 'Parent list lo child records kuda vastayi (Class = Practice Child). Gurtu pettuko: parent table ni query chesthe child records kuda return avtayi — Task list lo incidents, problems kuda kanipinchedi anduke.',
    cleanup: '⚙ lo Class column teesey (leda "Reset to column defaults"). "From child" record ni unchochu — Final cleanup lo table tho potundi.',
  }),
  ex('child-tables', 3, 'Child lo dictionary override', 'hard', {
    scenario: 'Prerequisite: Practice Child table. Parent (Practice Task) lo Topic ki default value ledu (Dictionary lesson cleanup lo teesesam). Practice Child lo matrame Topic default "Child default" ga undela Dictionary Override create chey — parent maradu.',
    hint: 'Topic dictionary record lo "Dictionary Overrides" related list → New → Table = Practice Child.',
    steps: [
      'u_practice_child.do open chesi Topic label → right-click → Configure Dictionary. (Gamaninchu: open ayina dictionary record Table = Practice Task — field parent lo define ayyindi.)',
      'Kinda "Dictionary Overrides" related list → New.',
      'Table: Practice Child (u_practice_child) select chey — idi chala important; Practice Task select chesthe override child ki apply avvadu.',
      '"Override default value" tick chesi Default value: Child default → Submit.',
      'u_practice_child.do: Topic lo "Child default" untundi. u_practice_task.do: Topic empty (parent ki default ledu). Rendu Submit cheyyakunda close chey.',
    ],
    answer: 'Child form lo "Child default", parent form lo Topic empty. Override = parent column ni marchakunda child table lo matrame different behaviour (default, mandatory, read only...).',
    cleanup: 'Topic dictionary record (Practice Task) → Dictionary Overrides related list lo Table = Practice Child override delete chey. (Marchipoyina Final cleanup lo child table tho potundi.)',
  }),

  /* ---- data-lookup ---- */
  ex('data-lookup', 1, 'Priority lookup rule chudu', 'easy', {
    scenario: 'Impact 1 + Urgency 1 ki Priority entha vastundo Priority lookup rules lo chudu, tarvata kotha incident form lo verify chey.',
    steps: [
      'All → filter lo "dl_u_priority.list" type chesi Enter — idi Priority lookup rules table (Impact + Urgency → Priority).',
      'Impact "1 - High" + Urgency "1 - High" row → Priority "1 - Critical" chudu. Impact 3 + Urgency 3 row kuda chudu → "4 - Low".',
      'Incident → Create New open chesi Impact = 1 - High, Urgency = 1 - High select chey.',
      'Priority field chudu (adi read-only — "Priority is managed by Data Lookup" UI Policy). Submit cheyyakunda form close chey.',
    ],
    answer: 'Priority automatic ga "1 - Critical" avutundi — Priority Data Lookup (System Policy → Data Lookup Definitions) + dl_u_priority rules valla. Priority ni direct ga marchalem; Impact / Urgency marchali. (Emi save cheyyaledu — cleanup avasaram ledu.)',
  }),
  ex('data-lookup', 2, 'Kotha Assignment Rule', 'medium', {
    scenario: 'Prerequisite: "Practice Team" group (User Administration lesson exercises). Category = Network ayithe incident automatic ga Practice Team ki assign avvela Assignment Rule create chey. Mana own group vaadutunnam — appudu assign chesindi mana rule ane clear ga telustundi.',
    hint: 'All → filter "Assignment" → System Policy kinda "Assignment" module.',
    steps: [
      'All → filter lo "Assignment" type chesi System Policy kinda "Assignment" module open chey → New.',
      'Name: Network incidents, Table: Incident, Order: 10 (chinna Order = mundu check avtundi).',
      '"Applies To" tab lo Conditions: Category is Network.',
      '"Assign To" tab lo Group: Practice Team (User empty ga vadilesey) → Submit.',
      'Incident → Create New: Caller (Abel Tuter), Short description "Network slow", Category Network — Assignment group EMPTY ga unchi Submit.',
      'Aa incident open chesi Assignment group chudu.',
    ],
    answer: 'Assignment group = Practice Team automatic ga set avutundi. Assignment Rule = record save appudu Assignment group empty unte, condition match ayina rule group / user set chestundi. Nee PDI lo test chesindi: already unna Assignment group ni rule overwrite cheyyadu; rendu rules match ayithe chinna Order (100 vs 200 → 100) gelustundi. (Vere group vachi unte vere rule mundu match ayyindi — Assignment list lo Category Network rules chusi mana Order inka chinna number chey.)',
    cleanup: 'Assignment list lo "Network incidents" rule delete chey. Test incident "Network slow" delete chey.',
  }),
  ex('data-lookup', 3, 'Data Lookup off chesthe emavtundi?', 'hard', {
    scenario: 'OOB (ServiceNow ichina) "Priority Data Lookup" ni konni nimishalu inactive chesi, priority auto-calculate aagipotundo test chey — tarvata VENTANE exact ga restore chey. Off unnappudu incidents save cheyyaku.',
    hint: 'OOB record — Active value mundu ga note chesko (default: true).',
    steps: [
      'All → System Policy → Data Lookup Definitions → "Priority Data Lookup" open chey. Active = true ani note chesko.',
      'Active untick → Update.',
      'Incident → Create New: Impact 1 - High, Urgency 1 - High select chey — Priority marutunda? Submit cheyyakunda form close chey.',
      'Ventane "Priority Data Lookup" malli open chesi Active tick → Update.',
      'Malli Create New lo Impact 1, Urgency 1 try chey — Priority "1 - Critical" vastundi. Submit cheyyakunda close chey.',
    ],
    answer: 'Inactive unnappudu Priority auto set avvadu — dictionary default "4 - Low" lone undipotundi (nee PDI lo test chesindi). Active chesaka malli lookup rules batti set avtundi. OOB record marchinappudu ServiceNow daanni "customized" ga gurtupedutundi; value restore chesthe behaviour same.',
    cleanup: 'Priority Data Lookup Active = true ani malli open chesi check chey (most important — off unte nee PDI lo prathi incident priority thappu). Incidents save cheyyaledu kabatti delete cheyyalsindi ledu.',
  }),

  /* ---- update-sets ---- */
  ex('update-sets', 1, 'Update set create chesi change capture chey', 'medium', {
    scenario: '"Practice changes" update set create chesi current ga pettu. Oka Application Menu ("Demo") create chesi, adi aa set lo capture ayyindo chudu.',
    hint: 'All → System Update Sets → Local Update Sets.',
    steps: [
      'All → "Local Update Sets" (System Update Sets) → New. Name: Practice changes.',
      '"Submit and Make Current" click chey. Header lo globe 🌐 icon (application scope & update set picker) click chesi "Update set:" pakkana "Practice changes" undo chudu (mundu "Default [Global]" undedi).',
      'System Definition → Application Menus → New: Title "Demo" → Submit.',
      'Local Update Sets → "Practice changes" open chesi kinda "Customer Updates" related list chudu.',
    ],
    answer: 'Customer Updates lo "Demo" Application Menu record (sys_app_application_…) kanipistundi. Current set nee "Practice changes" undali — Default kaadu.',
    cleanup: 'Ee order lo chey: (1) "Practice changes" inka current ga undagane Demo menu delete chey (aa delete kuda set lo capture avtundi). (2) "Practice changes" open chesi State = Complete → Update ("Mark as Complete" button ledu — State field marchali). (3) Local Update Sets lo "Default" open chesi "Make This My Current Set" click chey. Update set ni delete cheyyakkarledu — delete chesina changes undo avvavu.',
  }),
  ex('update-sets', 2, 'Update set lo data capture avvadu', 'hard', {
    scenario: 'Prerequisite: Practice Task table. Update set lo CONFIGURATION matrame capture avtundi, DATA (records) kaadu ani prove chey: oka Practice Task record create chesi, oka dictionary change chesi — edi capture ayyindo chudu.',
    hint: 'Kotha update set create chesi current chey, tarvata Customer Updates related list chudu.',
    steps: [
      'Local Update Sets → New: Name "Data vs config" → Submit and Make Current.',
      'Practice Task lo kotha record create chey: Topic "Update set test" (DATA).',
      'Practice Task form lo Topic label → right-click → Configure Dictionary → Default Value tab lo Default value: Captured → Update (CONFIGURATION).',
      '"Data vs config" update set open chesi Customer Updates chudu.',
    ],
    answer: 'Customer Updates lo Topic dictionary entry (u_practice_task.u_topic) kanipistundi; "Update set test" record (data) ledu. Anduke data ni Dev → Prod ki update set tho teesukelladam kudaradu — configuration matrame veltundi.',
    cleanup: 'Ee order lo chey: (1) "Data vs config" inka current ga undagane Topic Configure Dictionary lo Default value empty chesi Update (revert kuda capture avtundi). (2) "Data vs config" State = Complete → Update. (3) "Default" update set open chesi "Make This My Current Set". "Update set test" record delete cheyyochu (leda Final cleanup lo table tho potundi).',
  }),

  /* ---- ui-policies ---- */
  ex('ui-policies', 1, 'Field ni read-only chey (mandatory wins)', 'medium', {
    scenario: 'Incident lo Category = Hardware ayithe "Short description" ni read-only chese UI Policy create chey. Gurtu: empty + mandatory field ni ServiceNow read-only / hide cheyyadu ("mandatory wins") — anduke test chese mundu Short description fill chey.',
    hint: 'All → System UI → UI Policies → New. Actions "UI Policy Actions" related list lo.',
    steps: [
      'All → "UI Policies" (System UI) → New. Table: Incident, Short description: Hardware readonly.',
      'When to Apply → Conditions: Category is Hardware → Submit.',
      'Policy malli open chesi kinda "UI Policy Actions" related list → New: Field name Short description, Read only = True → Submit.',
      'Incident → Create New. MUNDU Short description lo text type chey (e.g. "Mouse not working"), tarvata Category = Hardware chey → Short description grey (read-only). Category ni "Inquiry" ki marchu → malli editable.',
      'Bonus: Short description empty ga unchi Category Hardware chey — field editable ga ne untundi (mandatory + empty). Submit cheyyakunda form close chey.',
    ],
    answer: 'Short description fill chesi unnappudu Category Hardware → read-only, Category marchagaane normal ("Reverse if false"). Empty ga unte read-only avvadu — mandatory wins (⚠️ UI Policy lo kuda ide rule — PDI lo confirm chesuko). UI Policy client-side (form) matrame.',
    cleanup: 'UI Policies list lo "Hardware readonly" open chesi Delete (lekapothe incident forms anni ee rule follow avtayi).',
    checks: ['uipolicy-empty-mandatory'],
  }),
  ex('ui-policies', 2, 'Field ni hide chey (Visible = false)', 'medium', {
    scenario: 'Prerequisite: Practice Task table + records. Done = true ayithe "Topic" field form lo kanipinchakunda hide chese UI Policy create chey.',
    steps: [
      'All → System UI → UI Policies → New. Table: Practice Task, Short description: Hide topic when done.',
      'When to Apply → Conditions: Done is true → Submit.',
      'Policy malli open chesi UI Policy Actions → New: Field name Topic, Visible = False → Submit.',
      'Practice Task record open chesi Done tick / untick chesi chudu (save cheyyakkarledu).',
    ],
    answer: 'Done tick chesthe Topic maayam, untick chesthe malli vastundi ("Reverse if false" valla). Hide chesina field empty kaadu — value ala ne untundi.',
    cleanup: 'UI Policies list lo "Hide topic when done" delete chey.',
  }),
  ex('ui-policies', 3, '"On load" off chesthe', 'medium', {
    scenario: 'Prerequisite: Practice Task table + Done = true unna record ("Learn tables"). Done = true ayithe Topic read-only chese UI Policy lo "On load" untick chesi, form open ayinappudu policy apply avutundo ledo check chey.',
    hint: 'On load = form open ayinappude condition check cheyyadam.',
    steps: [
      'UI Policy create chey: Table Practice Task, Short description "Topic readonly on change", Condition Done is true, "On load" untick → Submit.',
      'UI Policy Actions → New: Topic, Read only = True → Submit.',
      'Done = true record open chey — Topic read-only aa? (Kaadu — On load off.)',
      'Form lo Done untick chesi malli tick chey — ippudu Topic read-only avutundi. Save cheyyakunda form close chey.',
    ],
    answer: 'On load off unte form open ayinappudu condition check cheyyadu; field value marchinappude apply avtundi. Form open ayinappude apply avvalante On load tick undali (default).',
    cleanup: 'UI Policy "Topic readonly on change" delete chey.',
  }),
  ex('ui-policies', 4, 'Rendu policies conflict (Order)', 'hard', {
    scenario: 'Prerequisite: Practice Task table + records. Oke field ki rendu UI Policies opposite actions tho create chesi, Order tho evaru gelustaro chudu.',
    hint: 'Policy lo "Order" field — chinna number mundu run avtundi.',
    steps: [
      'Policy A: Table Practice Task, Short description "Order test A", condition lekunda, Order 100 → action: Done Read only = True.',
      'Policy B: Table Practice Task, Short description "Order test B", condition lekunda, Order 200 → action: Done Read only = False.',
      'Practice Task record open chey — Done editable aa?',
      'Orders marchu (A = 200, B = 100), record malli open chesi check chey.',
    ],
    answer: 'Policies chinna Order nundi pedda Order ki run avtayi — chivariga run ayye (pedda Order) policy action gelustundi: modata B gelichi Done editable, orders marchaka A gelichi read-only. (⚠️ Nee PDI lo vachina result ne final — confirm chesuko.) Conflicting policies debug cheyyadaniki ide knowledge.',
    cleanup: '"Order test A", "Order test B" rendu policies delete chey.',
  }),

  /* ---- data-policies ---- */
  ex('data-policies', 1, 'Server-side mandatory', 'medium', {
    scenario: 'Incident lo "Description" ni Data Policy tho mandatory chey ("Use as UI Policy on client" lekunda — server lo matrame). Description empty ga Submit chesi error chudu.',
    hint: 'All → filter "Data Policies" → New. Rules "Data Policy Rules" related list lo.',
    steps: [
      'All → filter "Data Policies" → New. Table: Incident, Short description: Description required (server).',
      '"Use as UI Policy on client" untick chey → Submit.',
      'Policy malli open chesi kinda "Data Policy Rules" related list → New: Field Description, Mandatory = True → Submit.',
      'Incident → Create New: Caller (Abel Tuter), Short description ("Data policy test") fill chey — Description empty ga unchi Submit.',
      'Error chudu. Tarvata Description lo text rasi Submit — ippudu save avtundi.',
    ],
    answer: 'Form lo Description ki ∗ ledu (client lo emi ledu), kani Submit chesthe server reject chestundi — "Data Policy Exception" error, Description mandatory ani (⚠️ exact wording PDI lo confirm chesuko). Description fill chesthe save. UI Policy = browser matrame; Data Policy = server side — form submit, list edit, import sets, web services ki kuda. Scripts ki kaadu: Background Script / GlideRecord insert ni Data Policy aapadu (nee PDI lo test chesindi).',
    cleanup: 'VENTANE data policy "Description required (server)" delete chey (lekapothe nee PDI lo Description lekunda e incident kuda save avvadu). "Data policy test" incident delete chey.',
  }),
  ex('data-policies', 2, 'List edit lo UI Policy vs Data Policy', 'hard', {
    scenario: 'Prerequisite: Practice Task table + records. List lo cell edit (double-click) chesinappudu UI Policy apply avvadu, Data Policy avtundi ani chupinchu.',
    hint: 'List edit form kaadu — form lo run ayye UI policies list lo run avvavu; Data Policy server lo run avtundi.',
    steps: [
      'UI Policy: Table Practice Task, Short description "Topic mandatory (UI)", condition lekunda → Submit; UI Policy Actions → New: Topic, Mandatory = True → Submit.',
      'Practice Task record open chesi chudu — Topic ki ∗ undi (form lo policy pani chestundi).',
      'Practice Task list lo oka row (e.g. "Learn tables") Topic cell double-click chesi value clear chesi save chey (Enter / ✓) — save avutunda chudu.',
      'Aa UI Policy delete chey. Data Policy create chey: Table Practice Task, Short description "Topic mandatory (server)", "Use as UI Policy on client" untick → Submit; Data Policy Rules → New: Topic, Mandatory = True → Submit.',
      'Malli list lo inkoka row Topic clear chesi save chey — ippudu error vastundi, save avvadu.',
    ],
    answer: 'UI Policy unnappudu list lo Topic clear ayyi save ayyindi (list edit lo UI policies run avvavu). Data Policy tho server reject chesindi ("Data Policy Exception" laanti error). UI Policy = form / browser; Data Policy = server side — form, list edit, import sets, web services anni.',
    cleanup: 'Data Policy "Topic mandatory (server)" delete chey ("Topic mandatory (UI)" already delete chesav — inka unte adi kuda). Step 3 lo Topic clear chesina record ki Topic malli rayyi (e.g. "Learn tables").',
  }),
  // Final cleanup: filed under the LAST Stage 1 lesson (Data Policies) so it shows at the end of Stage 1.
  // Its id stays 'table-creation-4' because her saved progress uses it.
  { ...ex('table-creation', 4, 'Final cleanup: Stage 1 practice items anni delete chey', 'hard', {
    scenario: 'Prerequisite: Stage 1 lo migatha exercises ANNI ayipoyi undali (Data Policies lesson varaku) — idi STAGE 1 LO CHIVARA cheyyi, ippudu kaadu! Exercises lo create chesina practice items (Practice Task / Practice Child tables, menus, view, policies, rules, saved filters, user, group) anni ee order lo clean chey. Edaina item already delete chesi unte aa step skip chey.',
    hint: 'Config records mundu, tables tarvata — Practice Child (child) MUNDU, Practice Task (parent) tarvata. User / group chivara.',
    steps: [
      'Update sets: All → System Update Sets → Local Update Sets lo "Practice changes", "Data vs config" State = Complete ani chudu (kakapothe State = Complete → Update). Tarvata "Default" open chesi "Make This My Current Set" — ee cleanup Default lo ne jaragali.',
      'OOB safety checks: System Policy → Data Lookup Definitions lo "Priority Data Lookup" Active = true ani confirm chey. Incident Form Layout lo "Process Flow" formatter unte (paata process-flow exercise nundi) ◀ tho teesi Save. Mock lesson laaga PDI lo incident ki nuvve Formatter record (System UI → Formatters) leda Process Flow stages create chesi unte, avi kuda delete chey.',
      'Policies & rules: System UI → UI Policies lo "Hardware readonly", "Hide topic when done", "Topic readonly on change", "Order test A", "Order test B", "Topic mandatory (UI)"; Data Policies lo "Description required (server)", "Topic mandatory (server)"; System Policy → Assignment lo "Network incidents" — evi migilina delete chey. (Simulator lesson lo "Database incidents" rule chusav — adi mock lo matrame; PDI lo kuda create chesi unte daanni kuda delete chey.)',
      'View Rule: System UI → View Rules lo "Done tasks view" unte delete chey.',
      'Process Flow: System UI → Process Flow lo Table = Practice Task records (Easy, Medium, Hard) unte delete chey. System UI → Formatters lo Table = Practice Task "Process Flow" (process_flow.xml) record unte adi kuda delete chey.',
      'Saved filters: All → filter lo "sys_filter.list" type chesi Enter → "High priority", "Unassigned urgent" unte delete chey.',
      'Menus: System Definition → Application Menus lo "Practice", "My Tools", "Demo" — prathi menu open chesi kinda Modules related list lo modules delete chesi, tarvata menu Delete.',
      'Tables: System Definition → Tables lo MUNDU "Practice Child" (u_practice_child) open → Delete → confirm. Tarvata "Practice Task" (u_practice_task) → Delete → confirm. Table tho patu daani records & columns potayi. (ACL / security_admin error vasthe: avatar menu → "Elevate role" → security_admin → malli Delete. ⚠️ Ee error vastundo ledo PDI lo confirm chesuko — Elevate role avatar menu lo undi ani matram verify chesindi.)',
      'View: System UI → Views lo "practice_view" delete chey (tables delete chesaka chey — ee view layouts Practice Task kosame unnayi).',
      'Roles: User Administration → Roles lo Name "u_practice" tho start ayye roles (table create appudu auto ga vachinavi — pattern u_<table>_user, e.g. u_practice_task_user, u_practice_child_user) unte delete chey.',
      'User & group: User Administration → Groups lo "Practice Team" delete chey, tarvata Users lo "hari.test" delete chey.',
      'Test data: Incident list lo nee test incidents (Shortcut test, Save vs Submit test, Network slow...) migilithe delete chey.',
      'Final check: All filter lo "practice", "My Tools" type chesi chudu — emi raakudadu.',
    ],
    answer: 'Navigator lo Practice / My Tools menus levu, Tables lo u_practice_* levu, hari.test & Practice Team levu, OOB settings (Priority Data Lookup, incident form) original laaga unnayi. Child ni mundu delete chesthe parent delete easy — lekapothe parent ki child tables unnayi ani delete aagipotundi. ⚠️ Table delete tho daani ACLs (System Security → Access Control, Name u_practice…) kuda potayo PDI lo confirm chesuko — migilina avi harmless (table ledu kabatti).',
    checks: ['table-delete'],
  }), lessonId: 'data-policies' },
]

export const exercisesFor = (lessonId) => EXERCISES.filter((e) => e.lessonId === lessonId)
