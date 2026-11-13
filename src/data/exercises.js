// Hands-on exercises: she does them in her OWN real PDI, SnowKeer shows task / hint / steps / answer.
// Each lessonId must match a lesson in lessons.js. `cleanup` = how to undo changes in her PDI.
import { ex } from './lessonKit.js'

export const EXERCISES = [
  /* ---- account ---- */
  ex('account', 1, 'Nee PDI ni open chey', 'easy', {
    scenario: 'Developer site lo login ayyi, nee PDI instance URL kanukkoni, adi direct ga browser lo open chey.',
    hint: 'developer.servicenow.com lo profile / instance icon chudu.',
    steps: [
      'developer.servicenow.com open chesi sign in ayyi.',
      'Top right lo nee profile icon click cheyyi → "Manage instance password" / instance details chudu.',
      'Instance URL note chesko (https://devXXXXXX.service-now.com laaga untundi).',
      'Aa URL ni kotha tab lo open chesi admin user tho login ayyi.',
    ],
    answer: 'Login ayyaka ServiceNow home (Next Experience UI) kanipinchali, top lo banner & "All" menu tho. URL lo devXXXXXX = nee instance number.',
  }),
  ex('account', 2, 'Hibernate ayina instance ni wake up chey', 'easy', {
    scenario: 'PDI konchem sepu (konni gantalu) vaadakapothe hibernate avtundi (exact time memory nunchi — confirm chesuko). Adi ela wake up cheyyalo practice chey (instance ippudu active ga unte steps matrame chadivi, tick cheyyi).',
    steps: [
      'developer.servicenow.com lo sign in ayyi.',
      'Instance status chudu — "Hibernating" ani unte "Wake up" button click cheyyi.',
      'Konni nimishalu wait chey — status "Online" avvali.',
      'Online ayyaka Open Instance click cheyyi.',
    ],
    answer: 'Status Online ayyi instance login page open avutundi. Gurtu pettuko: 10 rojulu inactive ayithe reclaim avvachu, kabatti regular ga login ayyi.',
  }),

  /* ---- user-admin ---- */
  ex('user-admin', 1, 'Kotha user create chesi role ivvu', 'easy', {
    scenario: '"Hari Test" ane kotha user create chey (User ID: hari.test). Ataniki "itil" role ivvu.',
    hint: 'All → filter "Users" → System Security → Users and Groups → Users.',
    steps: [
      'All click chesi filter lo "Users" type chey → Users and Groups → Users open cheyyi.',
      'New click cheyyi.',
      'User ID: hari.test, First name: Hari, Last name: Test, Password set chey. Submit.',
      'Users list lo hari.test open cheyyi.',
      'Kinda "Roles" related list tab → Edit click cheyyi.',
      'Left lo "itil" select chesi ▶ add chey → Save.',
    ],
    answer: 'hari.test user record lo Roles tab lo "itil" kanipinchali. Real life lo user ki role isthe vaallu aa role unna modules/forms matrame chudagalaru.',
    cleanup: 'Users list lo hari.test open chesi Delete click cheyyi.',
  }),
  ex('user-admin', 2, 'Group create chesi member ni add chey', 'medium', {
    scenario: '"Practice Team" ane group create chesi, "Hari Test" ni (exercise 1 lo create chesina user) aa group lo member ga pettu.',
    hint: 'Users and Groups → Groups, tarvata Group Members related list.',
    steps: [
      'All → "Groups" filter → Users and Groups → Groups open cheyyi.',
      'New → Name: Practice Team → Submit.',
      'Aa group open chesi "Group Members" related list → Edit.',
      'hari.test select chesi add chey → Save.',
    ],
    answer: 'Group Members list lo Hari Test kanipinchali. Groups chala sarlu assignment (incident ni group ki assign cheyyadam) kosam vaadatharu.',
    cleanup: 'Group delete chey (Practice Team). Exercise 1 user kuda delete cheyyalante hari.test delete chey.',
  }),
  ex('user-admin', 3, 'Impersonate: vere user laaga chudu', 'medium', {
    scenario: 'Hari Test ni impersonate chesi, ataniki e menus kanipistunnayo chudu. Tarvata impersonation end chey.',
    hint: 'Top right profile avatar click chey.',
    steps: [
      'Top right nee avatar / profile click cheyyi → "Impersonate user".',
      'hari.test select cheyyi.',
      'Navigator lo All open chesi menus chudu — admin menus ledu ani gamaninchu.',
      'Malli avatar click → "End impersonation".',
    ],
    answer: 'Impersonate lo role "itil" ki saripoyye menus matrame kanipistayi. Admin features (System Definition etc.) kanipinchavu. End impersonation tarvata malli admin ga unnav.',
  }),

  /* ---- ui-tour ---- */
  ex('ui-tour', 1, 'Navigator ni favorite chesko', 'easy', {
    scenario: '"Incident → Open" module ni Favorites lo pettu, tarvata Favorites tab nundi direct ga open chey.',
    hint: 'All menu lo module pakkana ⭐ untundi.',
    steps: [
      'All click chesi filter lo "incident" type cheyyi.',
      'Incident → Open module meeda mouse petti ⭐ click cheyyi.',
      'All menu lo "Favorites" tab ki vellu.',
      'Akkada nundi Open module click chesi incident list open cheyyi.',
    ],
    answer: 'Favorites tab lo "Open" (Incident) module kanipistundi, click chesthe incident list direct ga open avtundi.',
    cleanup: 'Malli ⭐ click chesi favorite teesesey.',
  }),
  ex('ui-tour', 2, 'Form lo parts gurtupattu', 'easy', {
    scenario: 'Oka incident record open chesi: form header, ☰ (hamburger) menu, fields, related lists, activity stream ela kanipistunnayo chudu. Aa record sys_id ni copy chey.',
    hint: 'Form top-left lo ☰ icon.',
    steps: [
      'Incident list open chesi edaina oka record open cheyyi.',
      'Form top lo header buttons (Update, Resolve...) gamaninchu.',
      '☰ click chesi "Copy sys_id" select cheyyi.',
      'Form kinda related lists tabs & activity stream chudu.',
    ],
    answer: 'sys_id 32-character unique id (a1b2c3...). Prathi record ki okate untundi — scripts lo records ni gurtupattadaniki vaadatharu.',
  }),

  /* ---- products ---- */
  ex('products', 1, 'Important websites bookmark chey', 'easy', {
    scenario: 'Developer site, Docs, Community, Now Learning — ee 4 websites browser lo open chesi bookmark folder "ServiceNow" lo pettu.',
    steps: [
      'developer.servicenow.com open chesi bookmark chey.',
      'docs.servicenow.com (product documentation) open chesi bookmark chey.',
      'community.servicenow.com open chesi bookmark chey.',
      'Now Learning (nowlearning.servicenow.com) open chesi bookmark chey.',
      'Anni oka "ServiceNow" folder lo pettu.',
    ],
    answer: 'Developer = PDI & training, Docs = official documentation, Community = questions/answers, Now Learning = free courses & certifications.',
  }),
  ex('products', 2, 'Product → department match chey', 'easy', {
    scenario: 'ITSM, HRSD, CSM, SecOps — e product e department/team kosam? Docs site lo okati search chesi confirm chey.',
    steps: [
      'docs.servicenow.com lo "ITSM" search cheyyi.',
      'Prathi product kosam overview page chadivi, oka line lo summary rayyi.',
    ],
    answer: 'ITSM = IT support (incidents, changes). HRSD = HR cases. CSM = customer service. SecOps = security incidents & vulnerabilities.',
  }),

  /* ---- architecture ---- */
  ex('architecture', 1, 'Instance build info chudu', 'easy', {
    scenario: 'Nee instance e release (build) lo undo, ela kanukkovali?',
    hint: 'Instance URL ki /stats.do add chey.',
    steps: [
      'Nee instance URL tho login ayyi undu.',
      'Browser address lo https://devXXXXXX.service-now.com/stats.do open cheyyi.',
      'Top lo "Build name" & "Build date" chudu.',
    ],
    answer: 'Build name lo release name untundi (e.g. Brazil / Xanadu...). stats.do lo node, memory & sessions info kuda untundi — architecture lesson lo cheppina app nodes ki sambandham.',
  }),
  ex('architecture', 2, 'MID Server list chudu', 'easy', {
    scenario: 'MID Server list open chesi nee PDI lo entha unnayo chudu.',
    steps: [
      'All → filter "MID Server" → MID Server → Servers open cheyyi.',
      'List lo entha records unnayo chudu.',
    ],
    answer: 'PDI lo normal ga empty untundi, endukante MID Server = nee company network lo run ayye chinna agent (instance ni internal systems tho connect chestundi). Okka cloud PDI ki avasaram ledu.',
  }),

  /* ---- table-creation ---- */
  ex('table-creation', 1, 'Custom table create chey', 'medium', {
    scenario: '"Practice Task" ane kotha table create chey. Columns: Topic (String), Done (True/False). Menu "Practice" kinda module kuda vachela chey. Idi tarvata chala exercises ki base table, kabatti Extensible kuda tick chey.',
    hint: 'All → System Definition → Tables → New.',
    steps: [
      'All → "Tables" → System Definition → Tables → New click cheyyi.',
      'Label: Practice Task. Name auto ga u_practice_task avtundi.',
      '"Create module" tick chey, "New menu name": Practice.',
      'Table form lo "Extensible" checkbox (Controls section / tab lo untundi) tick chey — lekapothe child tables exercise lo "Extends table" lo Practice Task kanipinchadu. (Version batti place konchem marachu.)',
      'Columns related list lo: Column label "Topic" (Type String), taruvata "Done" (Type True/False) add chey.',
      'Submit cheyyi.',
    ],
    answer: 'Navigator lo "Practice → Practice Task" module vastundi. Table name "u_" tho start avtundi (custom ani gurtu). Open chesi columns chusthe Topic, Done + system columns (Created, Updated...) kanipistayi.',
    cleanup: 'Ee table ni ippude delete cheyyakku! Aa tarvata form-design, views, dictionary, child-tables exercises ki idi kavali. Anni ayyaka "Final cleanup" exercise (table-creation last) lo okesari delete chey.',
  }),
  ex('table-creation', 2, 'Table lo record create chey', 'easy', {
    scenario: 'Prerequisite: "Practice Task" table (exercise 1). Practice → Practice Task open chesi 2 records create chey (Topic: "Learn tables", Done = true; Topic: "Learn forms", Done = false).',
    steps: [
      'Navigator lo Practice → Practice Task click cheyyi.',
      'New click cheyyi, Topic & Done fill chesi Submit.',
      'Rendo record kuda ala create chey.',
    ],
    answer: 'List lo 2 rows kanipinchali. Prathi record ki auto ga sys_id, Created, Created by untay.',
    cleanup: 'Ee records table delete chesthe potayi — separate ga cheyyakkarledu.',
  }),

  /* ---- form-design ---- */
  ex('form-design', 1, 'Form lo fields order marchu', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Practice Task form lo "Done" field ni "Topic" paina ravali. Form Layout vaadi marchu.',
    hint: 'Form ☰ → Configure → Form Layout.',
    steps: [
      'Practice Task record open cheyyi.',
      '☰ → Configure → Form Layout click cheyyi.',
      'Right (Selected) list lo "Done" select chesi ▲ tho Topic paina teesuko.',
      'Save, tarvata form refresh chey.',
    ],
    answer: 'Form lo Done mundu, Topic tarvata kanipistundi. Form Layout (slushbucket) = fields add/remove/order cheyyadaniki main place.',
    cleanup: 'Malli Form Layout open chesi ▼ tho Topic mundu ki teesuko.',
  }),
  ex('form-design', 2, 'Kotha section create chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Practice Task form ki "Extra Info" ane kotha section (tab) add chesi, daantlo oka field pettu (e.g. Created by kakunda Updated).',
    hint: 'Configure → Form Sections.',
    steps: [
      'Practice Task form open chesi ☰ → Configure → Form Sections.',
      'New click cheyyi: Table = Practice Task, Caption = Extra Info → Submit.',
      'Malli ☰ → Configure → Form Layout open cheyyi.',
      'Top lo Section dropdown lo "Extra Info" select chesi ontu field (e.g. Updated) add chey → Save.',
    ],
    answer: 'Form lo kotha "Extra Info" section/tab kanipistundi, daantlo nuvvu add chesina field untundi.',
    cleanup: 'Form Sections list lo Extra Info record delete chey.',
  }),

  /* ---- views ---- */
  ex('views', 1, 'Kotha View create chesi vaadu', 'medium', {
    scenario: 'Prerequisite: Practice Task table. "practice_view" ane View create chesi, Practice Task form lo aa view select chesi, daantlo Topic matrame pettu.',
    hint: 'All → "Views" → System UI → Views.',
    steps: [
      'All → "Views" → System UI → Views → New. Name: practice_view, Title: Practice View → Submit.',
      'Practice Task form open chesi ☰ → View → Practice View select chey.',
      '☰ → Configure → Form Layout (View: Practice View) lo Topic matrame unda cheyyi → Save.',
      'Normal Default view malli select chesi difference chudu.',
    ],
    answer: 'Practice View lo konni fields matrame kanipistayi. Default view lo anni fields untayi. Oke table ki different users/situations kosam different forms ivvadam views purpose.',
    cleanup: 'practice_view record ni Views list nundi delete chey.',
  }),
  ex('views', 2, 'View Rule tho auto switch chey', 'hard', {
    scenario: 'Prerequisite: Practice Task table + views exercise 1. Done = true unna Practice Task records open chesthe automatic ga "practice_view" load avvali. View Rule create chey.',
    hint: 'System UI → View Rules.',
    steps: [
      'Exercise 1 lo practice_view undali — lekapothe mundu create chey.',
      'All → "View Rules" → System UI → View Rules → New.',
      'Name: Done tasks view, Table: Practice Task, View: practice_view, Active tick.',
      'Conditions lo Done is true pettu → Submit.',
      'Done = true record open chey (new view vastundi), Done = false record open chey (default view).',
    ],
    answer: 'Done true unna records practice_view lo, migatavi default view lo open avtayi. View Rule = condition batti form view auto ga marchadam.',
    cleanup: 'View Rule & practice_view rendu delete chey.',
  }),

  /* ---- dictionary ---- */
  ex('dictionary', 1, 'Field ni mandatory chey', 'easy', {
    scenario: 'Prerequisite: Practice Task table. Practice Task lo "Topic" ni mandatory chey. Topic empty ga Submit cheyyadaniki try chesi error chudu.',
    hint: 'Field label right click → Configure Dictionary.',
    steps: [
      'Practice Task form open chesi "Topic" label meeda right click → Configure Dictionary.',
      'Mandatory checkbox tick chesi Update click cheyyi.',
      'Kotha record New → Topic empty ga Submit cheyyi.',
    ],
    answer: 'Topic ki ∗ vachi, empty ga Submit chesthe "The following mandatory fields are not filled in: Topic" message vastundi. Dictionary lo set chesthe anni forms lo, scripts lo kuda apply avtundi.',
    cleanup: 'Dictionary entry lo Mandatory untick chesi Update.',
  }),
  ex('dictionary', 2, 'Default value set chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Practice Task lo Topic ki default value "Untitled" pettu. Kotha record open chesi chudu.',
    steps: [
      'Topic → right click → Configure Dictionary.',
      '"Default Value" tab open chesi Default value: Untitled pettu → Update.',
      'Practice Task → New click cheyyi.',
    ],
    answer: 'Kotha form lo Topic lo "Untitled" already untundi (nuvvu marchukovachu).',
    cleanup: 'Default value empty chesi Update.',
  }),
  ex('dictionary', 3, 'Read-only field', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Practice Task lo "Done" ni read-only chey, form lo edit avutundo ledo check chey.',
    steps: [
      'Done label → right click → Configure Dictionary.',
      'Read only tick chesi Update click cheyyi.',
      'Oka Practice Task record open cheyyi — Done change cheyyadaniki try chey.',
    ],
    answer: 'Done field grey ga untundi, edit cheyyaleru. (Note: server scripts ki idi apply avvadu — adi UI/forms ki matrame.)',
    cleanup: 'Read only untick chesi Update.',
  }),

  /* ---- process-flow ---- */
  ex('process-flow', 1, 'Incident ki Process Flow add chey', 'medium', {
    scenario: 'Incident form top lo Process Flow bar kanipinchela Form Layout lo formatter add chey.',
    hint: 'Form Layout lo left list lo "Process Flow" formatter undi.',
    steps: [
      'Incident open chesi ☰ → Configure → Form Layout.',
      'Left (Available) lo "Process Flow" select chesi ▶ tho Selected ki teesuko.',
      'Save click chesi form refresh chey.',
      'Bar lo oka stage click chesi State change avtundo chudu.',
    ],
    answer: 'Form top lo New → In Progress → On Hold → Resolved → Closed bar kanipistundi, current state highlight untundi.',
    cleanup: 'Process Flow ni pettukovachu (useful). Teeseyalante Form Layout lo malli ◀ tho left ki teesuko.',
  }),

  /* ---- menus-modules ---- */
  ex('menus-modules', 1, 'Menu + Module create chey', 'medium', {
    scenario: '"My Tools" ane Application Menu create chesi, daantlo "Open Incidents" ane module pettu (Incident list, State = New).',
    hint: 'System Definition → Application Menus, tarvata Modules.',
    steps: [
      'All → "Application Menus" → New. Title: My Tools, Order: 160 → Submit.',
      'All → "Modules" (System Definition) → New. Title: Open Incidents.',
      'Application menu: My Tools, Link type: List of Records, Table: Incident.',
      'Filter lo State = New set chesi Submit.',
      'Navigator refresh chesi My Tools → Open Incidents click chey.',
    ],
    answer: 'My Tools menu navigator lo vastundi, daantlo module click chesthe New state incidents list open avtundi.',
    cleanup: 'Module & Application Menu rendu delete chey.',
  }),
  ex('menus-modules', 2, 'Shortcut vaadu', 'easy', {
    scenario: 'Navigator filter lo "incident" type chesi, "Create New" shortcut click chesi incident create chey.',
    steps: [
      'All click chesi filter lo "incident" type chey.',
      'Incident menu lo "Create New" module click cheyyi.',
      'Short description fill chesi Submit.',
    ],
    answer: 'Direct ga kotha incident form open avutundi — list open chesi New click cheyyalsina avasaram ledu.',
    cleanup: 'Create chesina incident delete chey.',
  }),

  /* ---- table-filters ---- */
  ex('table-filters', 1, 'AND filter tho records vethuku', 'easy', {
    scenario: 'Incident list lo "Priority = 1 - Critical AND State = New" filter apply chey.',
    steps: [
      'Incident → All open cheyyi.',
      'Filter funnel icon click cheyyi.',
      'Priority is 1 - Critical, AND State is New condition pettu.',
      'Run click cheyyi.',
    ],
    answer: 'Rendu conditions match ayye records matrame list lo untayi. Breadcrumb lo filter display avutundi.',
  }),
  ex('table-filters', 2, 'OR condition & save filter', 'medium', {
    scenario: '"Priority = 1 OR Priority = 2" filter chesi, adi "High priority" ani save chey.',
    hint: 'OR add cheyyadaniki condition pakkana OR button vaadu.',
    steps: [
      'Filter funnel lo Priority is 1 - Critical pettu.',
      'OR click chesi Priority is 2 - High add chey.',
      'Run chesaka filter → Save click chesi name: High priority ivvu.',
      'Filter malli open chesi Saved filters nundi load chey.',
    ],
    answer: 'Priority 1 leka 2 unna incidents ostayi. Saved filters malli quick ga vaadukovachu.',
    cleanup: 'Saved filter ni delete chey (filters list lo).',
  }),

  /* ---- save-submit ---- */
  ex('save-submit', 1, 'Save vs Submit vs Update', 'easy', {
    scenario: 'Kotha incident create chesi (Submit), tarvata aa record open chesi Update click chey. Eppudu e button untundo gamaninchu.',
    steps: [
      'Incident → New open cheyyi.',
      'Short description fill chesi form header lo Submit button chudu.',
      'Submit chesaka record open chesi Update button chudu.',
      'Form ☰ menu lo Save option kuda chudu.',
    ],
    answer: 'New record lo Submit (insert), already unna record lo Update. Save (☰ menu) = save chesi aa form lo ne untav, Submit/Update list ki thirigi teesukelthayi.',
    cleanup: 'Incident delete chey.',
  }),

  /* ---- child-tables ---- */
  ex('child-tables', 1, 'Child table create chey', 'hard', {
    scenario: 'Prerequisite: Practice Task table (Extensible tick chesi undali). "Practice Child" table create chey, "Practice Task" ni extend chesi. Parent columns inherit avtayi ani chudu.',
    hint: 'Table create lo "Extends table" field.',
    steps: [
      'All → "Tables" → New. Label: Practice Child.',
      'Extends table: Practice Task select chey.',
      'Submit.',
      'Practice Child form open chesi Topic & Done fields undo chudu.',
    ],
    answer: 'Practice Child lo Topic & Done already untayi (parent nundi inherit). Parent list lo child records kuda kanipistayi.',
    cleanup: 'Ippude delete cheyyakku — child exercises 2, 3 ki kavali. "Final cleanup" lo delete chey.',
  }),

  /* ---- data-lookup ---- */
  ex('data-lookup', 1, 'Priority lookup rule chudu', 'easy', {
    scenario: 'Impact 1 + Urgency 1 vaste Priority entha ostundo, Priority Lookup Rules lo chudu. Kotha incident create chesi verify chey.',
    steps: [
      'All → "Priority lookup" → Priority Lookup Rules.',
      'Impact 1 & Urgency 1 row open chesi Priority chudu.',
      'Incident → New lo Impact 1, Urgency 1 select chey.',
      'Priority automatic ga set avutundo chudu.',
    ],
    answer: 'Priority "1 - Critical" auto ga set avutundi — Data Lookup valla.',
    cleanup: 'Test incident delete chey.',
  }),

  /* ---- update-sets ---- */
  ex('update-sets', 1, 'Update set create chesi change capture chey', 'medium', {
    scenario: '"Practice changes" update set create chesi current ga pettu. Oka application menu create chesi, aa change set lo capture ayyindo chudu.',
    hint: 'All → Local Update Sets.',
    steps: [
      'All → "Local update sets" → New. Name: Practice changes.',
      '"Submit and Make Current" click cheyyi.',
      'Oka Application Menu create chey ("Demo").',
      'Update set open chesi "Customer Updates" tab chudu.',
    ],
    answer: 'Customer Updates lo nuvvu create chesina Application Menu record kanipistundi. Banner lo current update set peru chudu — Default ki kakunda neede undali.',
    cleanup: 'Update set inka Current ga undagane Demo menu delete chey (appude aa delete kuda capture avtundi). Tarvata update set ni Mark as Complete chesi, banner lo current set ni "Default" ki marchu. Update set ni delete cheyyakku — adi changes ni undo cheyyadu.',
  }),

  /* ---- ui-policies ---- */
  ex('ui-policies', 1, 'Field ni read-only chey', 'medium', {
    scenario: 'Incident lo Category = Hardware ayithe "Short description" ni read-only chese UI Policy create chey.',
    steps: [
      'All → "UI Policies" → New. Table: Incident, Short description: Hardware readonly.',
      'When to Apply → Category is Hardware.',
      'Submit chesi policy open → UI Policy Actions → New: Field Short description, Read only True.',
      'Kotha incident lo Category Hardware chesi chudu.',
    ],
    answer: 'Category Hardware chesthe Short description grey (read-only) avutundi. Marchagaane normal. Idi client-side matrame.',
    cleanup: 'UI policy delete chey.',
  }),

  /* ---- data-policies ---- */
  ex('data-policies', 1, 'Server-side mandatory', 'hard', {
    scenario: 'Incident lo "Description" ni Data Policy tho mandatory chey (UI policy ga kakunda). Description empty ga Submit chesi error chudu.',
    steps: [
      'All → "Data Policies" → New. Table: Incident.',
      '"Use as UI Policy on client" untick chey. Submit.',
      'Policy open chesi Data Policy Rules → New: Description, Mandatory True.',
      'Kotha incident lo Description empty ga Submit chey.',
    ],
    answer: '"Data Policy Exception: Description is mandatory" error vastundi. Form lo ∗ undadu kani server reject chestundi.',
    cleanup: 'Data policy delete chey, leka Active untick chey.',
  }),

  /* =====================  ROUND 2: more practice (easy → hard)  ===================== */

  /* ---- user-admin ---- */
  ex('user-admin', 4, 'Group dwara role inherit avvadam', 'hard', {
    scenario: 'Prerequisite: user-admin exercises 1 & 2 (hari.test user + Practice Team group). Role ni user ki direct ga kakunda GROUP ki ivvu — user ki inherit avutundo chudu.',
    hint: 'Group record lo kuda "Roles" related list untundi.',
    steps: [
      'hari.test open chesi Roles tab lo "itil" direct role teesey (select → Delete).',
      'Practice Team group open chesi Roles related list → Edit → "itil" add chey → Save.',
      'Malli hari.test open chesi Roles tab chudu — "itil" kanipistunda, "Inherited" column lo true ani?',
      'Group Members lo Hari ni teesesthe role poyindo ledo kuda check chey.',
    ],
    answer: 'Hari ki direct role lekapoyina group valla "itil" Inherited = true ga kanipistundi. Group nundi teesesthe role kuda potundi. Real projects lo roles ni groups ki istaru — users ni add/remove cheyyadam easy.',
    cleanup: 'Group nundi itil role teesey, hari.test & Practice Team delete chey (user-admin exercises 1, 2 cleanup lo laaga).',
  }),

  /* ---- ui-tour ---- */
  ex('ui-tour', 3, 'Navigator shortcuts: .list & .do', 'easy', {
    scenario: 'Navigator filter lo "incident.list" type chesi incident list open chey. Tarvata "incident.do" tho kotha incident form open chey.',
    hint: 'All menu filter box lo type chey, module kakunda direct ga page open avtundi.',
    steps: [
      'All click chesi filter lo "incident.list" type chesi Enter nokku.',
      'List open ayyaka malli All → filter lo "incident.do" type chesi Enter.',
      'Ide pattern incident ki kakunda e table ki ayina vaadochu: <table_name>.list / <table_name>.do.',
    ],
    answer: 'incident.list = incident list, incident.do = kotha incident form. Admin lu ee shortcut chala vaadatharu (e.g. sys_user.list, u_practice_task.list).',
  }),
  ex('ui-tour', 4, 'List ni personalize chey (columns, sort, group)', 'medium', {
    scenario: 'Incident list lo columns marchu: "Priority" column add chesi, Priority tho sort chesi, tarvata State tho group by chey.',
    hint: 'List header lo ⚙ (gear) icon ki Personalize List ledha List Layout untundi.',
    steps: [
      'Incident → All open chey.',
      'Top-left (list header) lo ⚙ click chesi Personalize List ledha "List Layout" open chey.',
      'Left lo "Priority" select chesi ▶ tho Selected ki add chey, OK/Save.',
      'Column header "Priority" click chesi sort chey.',
      'Right-click chesi "Group by State" select chey.',
    ],
    answer: 'List lo Priority column vastundi, Priority order lo sort avutundi, State vaari ga group ayyi headings tho kanipistayi. Ee personalization nee account ki matrame (list layout global ga kaadu) — "Personalize" ante adi.',
    cleanup: 'Group by clear chesi (right-click → Group by ... teesey), ⚙ lo Priority column ni malli teesey.',
  }),

  /* ---- table-creation ---- */
  ex('table-creation', 3, 'Choice column add chey', 'medium', {
    scenario: 'Prerequisite: Practice Task table. "Level" ane Choice column add chesi, choices: Easy, Medium, Hard pettu.',
    hint: 'Column type "Choice" select chey; Choices related list tarvata vastundi.',
    steps: [
      'All → Tables → u_practice_task open chey.',
      'Columns lo New row: Column label "Level", Type: Choice → Save.',
      'Level column open chesi (dictionary) kinda "Choices" related list → New.',
      'Label: Easy, Value: easy → Submit. Medium, Hard ki kuda ala chey.',
      'Practice Task form lo Level field dropdown chudu (Form Layout lo add chesthe kanipistundi).',
    ],
    answer: 'Level dropdown lo Easy / Medium / Hard options vastayi. Choice column = fixed values select chesukune field.',
    cleanup: 'Ippude teeseyyakku — "Final cleanup" lo table tho patu poyindi.',
  }),
  ex('table-creation', 4, 'Final cleanup: practice tables anni delete chey', 'hard', {
    scenario: 'Anni Stage 1 exercises ayyaka (form-design, views, dictionary, child-tables, menus, ui-policies...) nee PDI lo create chesina practice items anni okesari clean chey. Mundu ee order follow ayyi.',
    hint: 'Child nundi parent ki — child table mundu, tarvata parent table.',
    steps: [
      'Views: System UI → Views lo practice_view; View Rules lo "Done tasks view" delete chey.',
      'Form Sections lo "Extra Info" delete chey.',
      'UI Policies / Data Policies / Assignment Rules lo nuvvu create chesinavi delete chey (Practice, "Database incidents" etc.).',
      'Application Menus & Modules: "Practice", "My Tools" menus delete chey (modules tho patu).',
      'Tables lo mundu u_practice_child (child) delete chey, tarvata u_practice_task (parent).',
      'Users / Groups: hari.test & Practice Team delete chey.',
      'Update set: "Practice changes" ni Complete chesi Default ki thirigi marchu.',
    ],
    answer: 'Practice Task / Practice Child tables, Practice & My Tools menus, test user/group Navigator lo kanipinchavu. Child ni mundu delete chesthe parent delete cheyyadam easy — alaa kakapothe "table has children" error vastundi.',
  }),

  /* ---- views ---- */
  ex('views', 3, 'View lo List layout marchu', 'medium', {
    scenario: 'Prerequisite: Practice Task table + practice_view (views exercise 1). practice_view lo list lo "Topic" column matrame kanipinchela chey.',
    hint: 'List URL ki ?sysparm_view=practice_view add chey ledha List Layout lo View select chey.',
    steps: [
      'Practice → Practice Task list open chey.',
      'List ⚙ → List Layout open chey. Top lo view practice_view select chey (ledha URL ki &sysparm_view=practice_view add chey).',
      'Topic matrame selected unda cheyyi → Save.',
      'Normal list (Default view) tho compare chey.',
    ],
    answer: 'practice_view lo list lo Topic matrame untundi; Default view lo anni columns. Views = forms ki matrame kaadu, lists ki kuda.',
    cleanup: 'practice_view ni delete chesthe daani list layout kuda poyi untundi — views exercise 1 cleanup chudu.',
  }),

  /* ---- process-flow ---- */
  ex('process-flow', 2, 'Practice Task ki custom Process Flow', 'hard', {
    scenario: 'Prerequisite: Practice Task table + "Level" (Easy/Medium/Hard) choice column (table-creation 3). Level batti stages chupinche oka Process Flow create chey.',
    hint: 'System UI → Process Flow (Formatter) — version batti peru konchem marachu.',
    steps: [
      'All → "Process Flow" (System UI) open chey.',
      'New: Table Practice Task, Field Level, Name "Practice flow" → Submit.',
      'Process flow ki "Flow stages" (Easy, Medium, Hard) add chey.',
      'Practice Task form → Form Layout lo "Process Flow" formatter add chey.',
      'Form lo Level change chesi bar highlight marutunda chudu.',
    ],
    answer: 'Form top lo Easy → Medium → Hard bar kanipistundi, Level select chesina stage highlight avutundi.',
    cleanup: 'Process flow definition delete chey. Form Layout lo formatter teesey.',
  }),

  /* ---- menus-modules ---- */
  ex('menus-modules', 3, '"New Record" link type module', 'medium', {
    scenario: '"My Tools" menu lo (exercise 1) "Log Incident" ane module create chey — click chesthe direct ga kotha incident form open avvali.',
    steps: [
      'All → Modules → New. Title: Log Incident, Application menu: My Tools.',
      'Link type: New Record, Table: Incident → Submit.',
      'Navigator refresh chesi My Tools → Log Incident click chey.',
    ],
    answer: 'Kotha incident form direct ga open avutundi (list kaadu). "List of Records" vs "New Record" difference idi.',
    cleanup: 'Module delete chey (menu "My Tools" cleanup lo laaga).',
  }),
  ex('menus-modules', 4, 'Role tho module restrict chey', 'hard', {
    scenario: 'Prerequisite: user hari.test (user-admin 1, role itil). "Admin Only" ane module create chesi, "admin" role unna vallaki matrame kanipinchela chey. Hari ki kanipinchakudadu ani impersonate chesi verify chey.',
    hint: 'Module form lo "Roles" field untundi.',
    steps: [
      'My Tools menu lo kotha module create chey: Title "Admin Only", link type List of Records, table User (sys_user).',
      'Module form lo Roles field lo "admin" pettu → Submit.',
      'Admin ga My Tools open chesi module kanipistundo chudu.',
      'hari.test ni impersonate chesi (user-admin 3 laaga) My Tools chudu.',
      'End impersonation.',
    ],
    answer: 'Admin ki "Admin Only" module kanipistundi, hari.test ki kanipinchadu. Module Roles = aa role unna vallaki matrame navigator lo vastundi.',
    cleanup: 'Module delete chey. Impersonation end chesaka matrame — malli admin ga unnav ani check chey.',
  }),

  /* ---- table-filters ---- */
  ex('table-filters', 3, 'Right-click: Show Matching / Filter Out', 'easy', {
    scenario: 'Incident list lo oka row lo cell value meeda right-click chesi aa value unna records matrame chudu, tarvata aa value unna records ni teesesi (filter out) chudu.',
    hint: 'List cell meeda right-click → "Show Matching" / "Filter Out".',
    steps: [
      'Incident → All open chey.',
      'Edaina row lo State cell meeda right-click → Show Matching.',
      'Breadcrumb lo filter add ayyindi chudu. Breadcrumb lo "x" click chesi clear chey.',
      'Malli right-click → Filter Out chey, difference chudu.',
    ],
    answer: 'Show Matching = aa value unna records matrame. Filter Out = aa value unna records tappa migatha anni. Filter funnel open cheyyakunda quick ga filter cheyyadaniki idi bagundi.',
  }),
  ex('table-filters', 4, 'Dot-walk filter', 'medium', {
    scenario: 'Incident list lo "Caller → Department" tho filter chey (e.g. Caller ki Department "Customer Support" unna incidents).',
    hint: 'Field dropdown lo reference field pakkana > icon untundi.',
    steps: [
      'Incident list → Filter funnel click chey.',
      'Field dropdown lo "Caller" pakkana > (arrow) click chesi Department select chey.',
      'Operator "is", value: Customer Support (leda e department unte aa peru) → Run.',
    ],
    answer: 'Caller user record lo Department "Customer Support" unna incidents matrame vastayi. Reference field lo vere field ki velladam = dot-walking (caller_id.department). Scripts lo kuda ide idea.',
  }),
  ex('table-filters', 5, '"is empty" tho missing data vethuku', 'easy', {
    scenario: 'Assignment group ledhu (empty) unna incidents matrame chupinchu.',
    steps: [
      'Incident list → Filter funnel open chey.',
      'Field: Assignment group, operator: "is empty" → Run.',
      'Operator "is not empty" tho kuda try chey.',
    ],
    answer: 'Empty operator tho assignment lekunda unna incidents kanipistayi — support lo "unassigned tickets" chudadaniki idi roju vaadatharu.',
  }),
  ex('table-filters', 6, 'Nested AND / OR', 'hard', {
    scenario: '(Priority is 1 OR Priority is 2) AND State is New AND Assignment group is empty — ee filter build chey.',
    hint: 'Priority rendu conditions OR tho, migatha rendu AND tho.',
    steps: [
      'Filter funnel open chey: Priority is 1 - Critical.',
      'Aa condition pakkana "OR" click chesi Priority is 2 - High add chey.',
      'Kinda "AND" click chesi State is New add chey.',
      'Malli AND click chesi Assignment group is empty add chey.',
      'Run chesaka rows chudu, tarvata "Save" lo "Unassigned urgent" ani save chey.',
    ],
    answer: 'Priority 1 leka 2 + State New + assignment group empty — ee moodu kuda match ayye incidents. Careful: OR conditions group ayyi AND tho kalustayi, anduke order important.',
    cleanup: 'Saved filter delete chey.',
  }),

  /* ---- save-submit ---- */
  ex('save-submit', 2, 'Insert vs Insert & Stay', 'medium', {
    scenario: 'Oka incident open chesi ☰ menu lo "Insert" use chesi, tarvata "Insert & Stay" use chesi. Rendu eppudu em chestayo observe chey.',
    hint: 'Insert ante same values tho kotha record create chestundi (original ala ne untundi).',
    steps: [
      'Edaina oka incident (nuvvu create chesindi) open chey.',
      '☰ → "Insert" click chey. Evi jarigindo gamaninchu (kotha incident number & list).',
      'Malli original incident open chesi ☰ → "Insert & Stay" click chey.',
      'Incident list lo konni copies create ayyayo chudu.',
    ],
    answer: 'Insert = same values tho kotha record create chesi list ki thirigi veltav. Insert & Stay = create chesi aa kotha record lo ne untav. Original record maaradu. Records copy cheyyadaniki useful.',
    cleanup: 'Create ayina copy incidents anni delete chey.',
  }),

  /* ---- child-tables ---- */
  ex('child-tables', 2, 'Parent list lo child records', 'medium', {
    scenario: 'Prerequisite: Practice Child table (child-tables 1). Practice Child lo oka record create chesi, Practice Task list lo aa record kanipistunda chudu. "Class" column add chey.',
    steps: [
      'Practice Child lo kotha record create chey (Topic: "From child").',
      'Practice Task list open chey — aa record kanipistundi.',
      'List ⚙ lo "Task class" / "Class" column add chesi, mi child record ki "Practice Child" ani untundo chudu.',
    ],
    answer: 'Parent list lo child records kuda vastayi (Class = Practice Child). Chikkuga: parent table ki query chesthe child records kuda return avtayi. Incident → Task relationship idi.',
    cleanup: 'Record delete chey (table tho patu final cleanup lo potundi).',
  }),
  ex('child-tables', 3, 'Child lo dictionary override', 'hard', {
    scenario: 'Prerequisite: Practice Child table. Child lo Topic default value "Child default" ga override chey, parent lo "Untitled" ga undaali.',
    hint: 'Practice Child lo Topic → right-click → Configure Dictionary → "Dictionary Overrides" related list.',
    steps: [
      'Practice Child form open chesi Topic → right-click → Configure Dictionary.',
      'Kinda "Dictionary Overrides" related list → New.',
      'Override default value tick chesi Default value: Child default → Submit.',
      'Practice Child → New: Topic lo "Child default" untunda? Practice Task → New: Topic lo parent value untunda?',
    ],
    answer: 'Child form lo "Child default", parent lo parent default ye untundi. Override = parent column ni marchakunda child lo matrame different behaviour.',
    cleanup: 'Dictionary Override record delete chey.',
  }),

  /* ---- data-lookup ---- */
  ex('data-lookup', 2, 'Kotha Assignment Rule', 'medium', {
    scenario: 'Category = "Network" ayithe incident automatic ga "Network" group ki assign avvela kotha Assignment Rule create chey, test incident tho verify chey.',
    steps: [
      'All → "Assignment rules" → New. Name: Network incidents, Table: Incident.',
      'Condition: Category is Network. Assignment group: Network (leda e group undo adi) → Submit.',
      'Incident → New: Caller, Short description fill chesi Category Network select chesi Submit.',
      'Aa incident open chesi Assignment group fill ayyindo chudu.',
    ],
    answer: 'Assignment group automatic ga Network ga set avutundi. Assignment Rule = conditions match ayithe record save time lo group/user set chestundi.',
    cleanup: 'Rule delete chey, test incident delete chey.',
  }),
  ex('data-lookup', 3, 'Data Lookup off chesthe emavtundi?', 'hard', {
    scenario: 'Priority Data Lookup ni temporary ga inactive chesi priority auto-calculate avvadam aagipothundo test chey. Tarvata exact ga restore chey.',
    hint: 'OOB record — Active ni mundu ga note chesko (default: true).',
    steps: [
      'All → "Data lookup" → Data Lookup Definitions. "Priority Data Lookup" open chey. Active = true ani note chesko.',
      'Active untick chesi Update.',
      'Incident → New lo Impact 1, Urgency 1 select chey — Priority change avutunda? (Avvadu.)',
      'Definition ni malli open chesi Active tick chesi Update.',
      'Malli Impact 1, Urgency 1 try chey — Priority "1 - Critical" auto ga vastundi.',
    ],
    answer: 'Inactive unte Priority auto set avvadu (default lo undipotundi). Active chesaka malli lookup rules chusi Priority set chestundi.',
    cleanup: 'Active = TRUE ga restore chey (exact original). Test incidents delete chey.',
  }),

  /* ---- update-sets ---- */
  ex('update-sets', 2, 'Update set lo data capture avvadu', 'hard', {
    scenario: 'Prerequisite: Practice Task table. Update set lo configuration matrame capture avtundi, data kaadu ani prove chey: oka Practice Task record create chesi, oka dictionary change chesi — edi capture ayyindo chudu.',
    hint: 'Kotha update set create chesi Current chey, tarvata Customer Updates tab chudu.',
    steps: [
      'Kotha update set "Data vs config" create chesi Submit and Make Current.',
      'Practice Task lo oka kotha record create chey (data).',
      'Practice Task lo Topic field ki dictionary change chey (e.g. Max length marchu) (configuration).',
      'Update set open chesi Customer Updates tab lo entries chudu.',
    ],
    answer: 'Dictionary (sys_dictionary) change capture ayyindi, Practice Task record (data) capture avvaledu. Anduke data ni Dev nundi Prod ki update set tho teesukelladam kudaradu — configuration matrame.',
    cleanup: 'Update set inka Current ga undagane dictionary change ni revert chey (appudu aa revert kuda capture avtundi). Tarvata Mark as Complete chesi banner lo Default ki marchu. Update set delete cheyyakku.',
  }),

  /* ---- ui-policies ---- */
  ex('ui-policies', 2, 'Field ni hide chey (Visible = false)', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Done = true ayithe "Topic" field form lo kanipinchakunda hide chese UI Policy create chey.',
    steps: [
      'All → UI Policies → New. Table: Practice Task, Short description: Hide topic when done.',
      'When to Apply: Done is true. Submit.',
      'Policy open → UI Policy Actions → New: Field Topic, Visible False.',
      'Practice Task record open chesi Done tick/untick chesi chudu.',
    ],
    answer: 'Done tick chesthe Topic field maayam ayipotundi, untick chesthe malli vastundi (Reverse if false valla). Hidden != empty — value ala ne untundi.',
    cleanup: 'UI policy delete chey.',
  }),
  ex('ui-policies', 3, '"On load" off chesthe', 'medium', {
    scenario: 'Prerequisite: Practice Task table. Done = true ayithe Topic read-only chese UI Policy lo "On load" untick chey. Done = true unna record open chesthe policy apply avutundo ledo check chey.',
    hint: 'On load = form open ayinappude condition check cheyyadam.',
    steps: [
      'UI Policy create chey: Table Practice Task, Condition Done is true, action Topic Read only True.',
      'Policy lo "On load" untick chesi Submit.',
      'Done = true unna record open chey — Topic read-only aa? (Kaadu.)',
      'Form lo Done untick/tick chey — ippudu Topic read-only avutunda?',
    ],
    answer: 'On load off unte form open ayinappudu condition check cheyyadu; field value marchinappude apply avtundi. Open ayinappude apply avvalante On load tick undali.',
    cleanup: 'UI policy delete chey.',
  }),
  ex('ui-policies', 4, 'Rendu policies conflict (Order)', 'hard', {
    scenario: 'Prerequisite: Practice Task table. Oke field ki rendu UI Policies opposite actions tho create chesi, Order tho evaru gelustaro chudu.',
    hint: 'Policy lo "Order" field — lower number mundu run avtundi.',
    steps: [
      'Policy A: Practice Task, condition lekunda, Order 100, action: Done Read only True.',
      'Policy B: Practice Task, condition lekunda, Order 200, action: Done Read only False.',
      'Practice Task record open chey — Done editable aa?',
      'Rendu policies Order marchu (A=200, B=100), malli check chey.',
    ],
    answer: 'Run order lo chivariga run ayye policy gelustundi (higher Order number tarvata run avtundi). Order marchesthe result marutundi. Real projects lo conflicting policies debug cheyyadaniki ide knowledge.',
    cleanup: 'Rendu policies delete chey.',
  }),

  /* ---- data-policies ---- */
  ex('data-policies', 2, 'List edit lo UI Policy vs Data Policy', 'hard', {
    scenario: 'Prerequisite: Practice Task table. List lo cell edit chesi (double-click) UI Policy "Topic mandatory" apply avvadu, Data Policy avutundi ani chupinchu.',
    hint: 'List edit lo form lo laaga client script/UI policy run avvadu.',
    steps: [
      'UI Policy: Table Practice Task, no condition, action Topic Mandatory True. Submit.',
      'Practice Task list lo Topic cell double-click chesi value clear chesi save chey — allow avtunda chudu.',
      'UI Policy delete chey. Data Policy create chey: Table Practice Task, "Use as UI policy on client" untick, rule Topic Mandatory True.',
      'Malli list lo Topic clear chesi save chey — ippudu error vastunda?',
    ],
    answer: 'UI Policy tho list edit lo clear avvachu (list edit form kaadu). Data Policy tho server reject chestundi ("Data Policy Exception"). Idi UI Policy (client) vs Data Policy (server) clear difference.',
    cleanup: 'UI Policy & Data Policy rendu delete chey, Topic values restore chey.',
  }),
]

export const exercisesFor = (lessonId) => EXERCISES.filter((e) => e.lessonId === lessonId)
