// Stage 3 glossary — client-side objects (g_form, g_user, g_list, g_scratchpad), Client Script types, GlideAjax, UI Actions / Pages / Macros.
// Same format as glossary-js.js (g = group, m = meaning in Tenglish, ex = ServiceNow example, check = true -> "PDI lo confirm chey").
// Every entry here is marked s: 3 so the Stage 2 hub glossary can leave them out. Merged into GLOSSARY_JS in glossary-js.js.
// Written from memory: anything uncertain has check: true — the friend confirms it in her PDI.

export const GLOSSARY_GROUPS_CS = {
  cl: 'Client objects & browser functions',
  gf: 'g_form methods (form control)',
  gu: 'g_user methods (logged-in user)',
  gl: 'g_list methods (list page)',
  cs: 'Client Script basics',
  aj: 'GlideAjax (client calls server)',
  ui: 'UI Actions, UI Pages, UI Macros & tools',
  gs3: 'More gs methods (server side)',
}

const s3 = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { ...v, s: 3 }]))

export const GLOSSARY_CS = s3({
  // ---------- client objects ----------
  g_form: { g: 'cl', m: 'GlideForm — browser lo form ni control chese object. Field value chadavadam / marchadam, mandatory / read-only / hide, messages anni g_form tho. Client side lo matrame (server script lo g_form ledu).', ex: "g_form.setValue('priority', '1');" },
  g_user: { g: 'cl', m: 'GlideUser — ippudu login ayina user info, client lo. Properties: g_user.userName, firstName, lastName, userID (sys_id). Role check kosam methods kinda unnayi. Server lo idi ledu — akkada gs.getUserName() vaadali.', ex: "g_user.firstName;   // 'Abel'", check: true },
  g_list: { g: 'cl', m: 'GlideList — list page (incident list) lo selected records teeskovadaniki. List banner UI Action / list context menu lo vaadatharu. Form lo kaadu.', ex: 'var ids = g_list.getChecked();', check: true },
  g_scratchpad: { g: 'cl', m: 'Server nundi client ki data pampadaniki. Display Business Rule lo g_scratchpad.xyz = value pettali; client script lo g_scratchpad.xyz chaduvachu — extra server call avasaram ledu (getReference kante fast).', ex: 'g_scratchpad.callerIsVip   // Display BR lo set chesindi' },
  'confirm()': { g: 'cl', m: 'Browser dialog: OK / Cancel adugutundi. OK nokkite true, Cancel nokkite false. Delete / close mundu user ni adagadaniki.', ex: "if (!confirm('Close incident?')) { return; }" },
  'alert()': { g: 'cl', m: 'Browser dialog lo message chupistundi (OK button matrame). Chinna warnings kosam.', ex: "alert('Select incidents first');" },
  'prompt()': { g: 'cl', m: 'Browser dialog: user ni text adugutundi, rasina text istundi (Cancel ayithe null).', ex: "var why = prompt('Close reason?');" },
  'jslog()': { g: 'cl', m: 'Client script lo debug log. Browser console / JavaScript Log lo kanipistundi (SN Utils tho easy ga chudochu). gs.info client lo work cheyyadu — idi vaadu.', ex: "jslog('onChange: ' + newValue);", check: true },
  'document.getElementById()': { g: 'cl', m: 'Page lo oka HTML element ni id tho pattukuntundi. UI Page lo HTML elements ni chaduvadaniki / marchadaniki vaadatharu.', ex: "document.getElementById('reason').value;" },

  // ---------- g_form methods ----------
  'g_form.getValue()': { g: 'gf', m: 'Field ki ippudu unna value STRING ga istundi. Reference field ayithe sys_id vastundi, display name kaadu. (Server lo gr.getValue laaga — kani idi client.)', ex: "var p = g_form.getValue('priority');   // '1' (string)" },
  'g_form.setValue()': { g: 'gf', m: 'Field value marchadam. Reference field ki sys_id ivvali. onChange script lo marchite alone malli onChange trigger avvochu — jagratta.', ex: "g_form.setValue('urgency', '1');" },
  'g_form.clearValue()': { g: 'gf', m: 'Field ni empty chestundi (value teeseystundi).', ex: "g_form.clearValue('assignment_group');" },
  'g_form.getIntValue()': { g: 'gf', m: 'Field value ni number (integer) ga istundi. getValue string istundi, calculation kosam idi easy.', ex: "g_form.getIntValue('priority') + 1;" },
  'g_form.getReference()': { g: 'gf', m: 'Reference field lo select chesina record antha fetch chestundi (caller_id → user record). Callback tho work avtundi — async. ⚠️ Prathi sari server ki call velthundi; chala sarlu vaadite form slow, anduke GlideAjax / g_scratchpad better.', ex: "g_form.getReference('caller_id', function(caller) {\n  g_form.addInfoMessage(caller.vip);\n});" },
  'g_form.setMandatory()': { g: 'gf', m: 'Field ni mandatory (red *) chestundi / teeseystundi. true = mandatory, false = optional.', ex: "g_form.setMandatory('short_description', true);" },
  'g_form.isMandatory()': { g: 'gf', m: 'Field mandatory ah ani check chestundi (true / false).', ex: "if (g_form.isMandatory('category')) { ... }" },
  'g_form.setReadOnly()': { g: 'gf', m: 'Field ni read-only chestundi — user edit cheyyaleru. true = read-only, false = edit cheyochu.', ex: "g_form.setReadOnly('number', true);" },
  'g_form.setDisplay()': { g: 'gf', m: 'Field ni hide / show chestundi. false ayithe hide, aa field space kuda form lo teeseyabaduthundi (setVisible tho difference idi).', ex: "g_form.setDisplay('assignment_group', false);" },
  'g_form.setVisible()': { g: 'gf', m: 'Field ni hide / show chestundi. false ayithe hide, kani aa field space khali ga migilipotundi (setDisplay ki difference).', ex: "g_form.setVisible('assignment_group', false);" },
  'g_form.setSectionDisplay()': { g: 'gf', m: 'Form lo oka section (tab) ni show / hide chestundi.', ex: "g_form.setSectionDisplay('notes', false);", check: true },
  'g_form.hideRelatedList()': { g: 'gf', m: 'Form kinda unna oka related list ni hide chestundi.', ex: "g_form.hideRelatedList('incident.parent');", check: true },
  'g_form.hideRelatedLists()': { g: 'gf', m: 'Form kinda unna anni related lists ni hide chestundi.', ex: 'g_form.hideRelatedLists();', check: true },
  'g_form.showFieldMsg()': { g: 'gf', m: 'Oka field kinda chinna message chupistundi. 3rd value "info" leda "error". Field chuttu icon kuda vastundi.', ex: "g_form.showFieldMsg('short_description', 'Too short', 'error');" },
  'g_form.hideFieldMsg()': { g: 'gf', m: 'Oka field meeda unna message teeseystundi.', ex: "g_form.hideFieldMsg('short_description');" },
  'g_form.hideAllFieldMsgs()': { g: 'gf', m: 'Form lo anni field messages (showFieldMsg tho chupinchinavi) teeseystundi.', ex: 'g_form.hideAllFieldMsgs();', check: true },
  'g_form.addInfoMessage()': { g: 'gf', m: 'Form paina blue info message chupistundi. Okka sari cheppali ante.', ex: "g_form.addInfoMessage('Welcome ' + g_user.firstName);" },
  'g_form.addErrorMessage()': { g: 'gf', m: 'Form paina red error message chupistundi. (Submit aapadu — aapalante onSubmit lo return false.)', ex: "g_form.addErrorMessage('Description kavali');" },
  'g_form.clearMessages()': { g: 'gf', m: 'Form paina unna info / error messages anni clear chestundi.', ex: 'g_form.clearMessages();' },
  'g_form.flash()': { g: 'gf', m: 'Field ni colour tho flash chestundi — user attention kosam. flash(field, colour, count).', ex: "g_form.flash('priority', '#FFFACD', 0);", check: true },
  'g_form.isNewRecord()': { g: 'gf', m: 'Idi kotha record ah (inka save kaaledu) ani check chestundi — true / false. Edit chese existing record ayithe false.', ex: 'if (g_form.isNewRecord()) { ... }' },
  'g_form.getFormElement()': { g: 'gf', m: 'Form yokka HTML form element istundi. gsftSubmit ki pass chestam (UI Action lo client → server).', ex: "gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');", check: true },
  'g_form.getTableName()': { g: 'gf', m: 'Ippudu open unna form table peru istundi (incident, problem...).', ex: "g_form.getTableName();   // 'incident'" },
  'g_form.addOption()': { g: 'gf', m: 'Choice field dropdown lo kotha option add chestundi: addOption(field, value, label).', ex: "g_form.addOption('category', 'vpn', 'VPN');" },
  'g_form.removeOption()': { g: 'gf', m: 'Choice field dropdown nundi oka option teeseystundi: removeOption(field, value).', ex: "g_form.removeOption('category', 'hardware');" },
  'g_form.clearOptions()': { g: 'gf', m: 'Choice field lo anni options teeseystundi. Tarvata addOption tho kotha list pettochu.', ex: "g_form.clearOptions('category');" },
  'g_form.save()': { g: 'gf', m: 'Form ni save chestundi (record save ayyi form open ga untundi).', ex: 'g_form.save();', check: true },

  // ---------- g_user methods ----------
  'g_user.hasRole()': { g: 'gu', m: 'User ki aa role undha ani check (true / false). ⚠️ admin user ki anni roles untayi anukuntaru, anduke idi admin ki ellappudu true istundi. Exact check kavalante hasRoleExactly.', ex: "if (g_user.hasRole('itil')) { ... }", check: true },
  'g_user.hasRoleExactly()': { g: 'gu', m: 'User ki exactly aa role undha — admin ki aa role assign cheyyakapote false. Role-specific logic kosam.', ex: "g_user.hasRoleExactly('admin');", check: true },
  'g_user.hasRoles()': { g: 'gu', m: 'User ki kanisam oka role (any role) undha ani check. Role ledu ante plain user.', ex: 'g_user.hasRoles();', check: true },
  'g_user.hasRoleFromList()': { g: 'gu', m: 'Comma tho ichina roles lo edaina okati user ki unte true. Okesari konni roles check cheyyadaniki.', ex: "g_user.hasRoleFromList('itil,admin');", check: true },

  // ---------- g_list methods ----------
  'g_list.getChecked()': { g: 'gl', m: 'List lo tick chesina records yokka sys_ids ni comma tho oka string ga istundi. Em select cheyyakapote khali string ("").', ex: "var ids = g_list.getChecked();   // 'abc123,def456'", check: true },
  'g_list.getTableName()': { g: 'gl', m: 'List yokka table peru istundi (incident...).', ex: 'g_list.getTableName();', check: true },
  'g_list.getQuery()': { g: 'gl', m: 'List meeda ippudu unna filter (encoded query) istundi.', ex: 'g_list.getQuery();', check: true },
  'g_list.getView()': { g: 'gl', m: 'List ki ippudu use avutunna view peru istundi.', ex: 'g_list.getView();', check: true },
  'g_list.size()': { g: 'gl', m: 'List lo ela records unnayo count (ippudu chupinchedi). Exact behaviour nee PDI lo confirm chey.', ex: 'g_list.size();', check: true },

  // ---------- Client Script basics ----------
  onLoad: { g: 'cs', m: 'Client Script type: form load ayyaka okka sari run avtundi. Form ready ga undaka field marchadaniki / welcome message kosam. function onLoad() { ... }', ex: "function onLoad() {\n  g_form.setMandatory('short_description', true);\n}" },
  onChange: { g: 'cs', m: 'Client Script type: nuvvu select chesina field value marinappudu run avtundi. Arguments: control, oldValue, newValue, isLoading, isTemplate. Form load lo kuda run avtundi — anduke "if (isLoading) return;" pettali.', ex: "function onChange(control, oldValue, newValue, isLoading) {\n  if (isLoading || newValue === '') { return; }\n}" },
  onSubmit: { g: 'cs', m: 'Client Script type: Save / Submit nokkinappudu, server ki velle mundu run avtundi. return false chesthe submit aagipotundi (validation kosam).', ex: "function onSubmit() {\n  if (g_form.getValue('short_description') == '') { return false; }\n}" },
  onCellEdit: { g: 'cs', m: 'Client Script type: list lo cell ni double-click chesi edit chesinappudu run avtundi. Arguments: sysIDs, table, oldValues, newValue, callback. callback(true) ayithe save, callback(false) ayithe aagipotundi.', ex: 'function onCellEdit(sysIDs, table, oldValues, newValue, callback) {\n  callback(true);\n}', check: true },
  'Client Script': { g: 'cs', m: 'Browser lo run ayye script (onLoad / onChange / onSubmit / onCellEdit). Form ni control cheyyadaniki g_form, g_user vaadatharu. Server lo database anta ippudu cheyyaleru — daaniki GlideAjax leda getReference.', ex: 'System Definition → Client Scripts' },
  'Business Rule': { g: 'cs', m: 'Server lo run ayye script — record insert / update / delete / display appudu. current, previous, gs vaadutayi. Client script kaadu.', ex: "(function executeRule(current, previous) { ... })(current, previous);" },
  'Script Include': { g: 'cs', m: 'Server lo reusable code (function / class) store chese place. Client nundi GlideAjax tho call cheyyali ante "Client callable" tick cheyyali.', ex: "var MyUtil = Class.create();" },
  'UI Policy': { g: 'cs', m: 'Condition meeda field ni mandatory / read-only / hide cheyyadaniki no-code (leda chinna script) way. Simple vishayalaku UI Policy, complex logic ki Client Script.', ex: 'System UI → UI Policies' },
  sys_id: { g: 'cs', m: 'Prathi record ki unna unique 32-character ID. Reference field value ga idi store avtundi, display name kaadu.', ex: "g_form.getValue('caller_id')   // sys_id" },

  // ---------- GlideAjax ----------
  GlideAjax: { g: 'aj', m: 'Client nundi server Script Include ki call (AJAX). Pattern: new GlideAjax("ScriptIncludeName") → addParam("sysparm_name", "methodName") → getXMLAnswer(callback). Async — answer callback lo vastundi.', ex: "var ga = new GlideAjax('VipUtil');\nga.addParam('sysparm_name', 'isVip');\nga.addParam('sysparm_user', userId);\nga.getXMLAnswer(function(answer) { ... });" },
  'ga.addParam()': { g: 'aj', m: 'GlideAjax ki parameter pampadam. sysparm_name = server lo call cheyyalsina method peru (idi compulsory). Migata params sysparm_xxx ani peru pettali.', ex: "ga.addParam('sysparm_name', 'getGroup');" },
  'ga.getXMLAnswer()': { g: 'aj', m: 'Server method return chesina value ni direct ga (string) callback ki istundi. getXML kante simple — chala sarlu idi chalu.', ex: "ga.getXMLAnswer(function(answer) {\n  g_form.setValue('assignment_group', answer);\n});" },
  'ga.getXML()': { g: 'aj', m: 'Full XML response callback ki istundi. Answer teesukovadaniki response.responseXML.documentElement.getAttribute("answer") vaadali — anduke getXMLAnswer easy.', ex: 'ga.getXML(callback);', check: true },
  sysparm_name: { g: 'aj', m: 'GlideAjax lo server method peru cheppe parameter. Idi lekapothe server ki ye method run cheyyalo teliyadu.', ex: "ga.addParam('sysparm_name', 'isVip');" },
  AbstractAjaxProcessor: { g: 'aj', m: 'Client-callable Script Include extend chese base class. Idi extend chesthe client nundi methods call cheyyochu (this.getParameter(...) vastundi).', ex: "var VipUtil = Class.create();\nVipUtil.prototype = Object.extendsObject(AbstractAjaxProcessor, { ... });" },
  'Object.extendsObject()': { g: 'aj', m: 'Script Include lo base class ni extend cheyyadaniki ServiceNow way. AbstractAjaxProcessor extend chesinappudu idi vaadutaru.', ex: 'Object.extendsObject(AbstractAjaxProcessor, { isVip: function() { ... } });' },
  'this.getParameter()': { g: 'aj', m: 'Server (Script Include) lo, client pampina sysparm_ parameter value teesukuntundi.', ex: "var id = this.getParameter('sysparm_user');" },
  initialize: { g: 'aj', m: 'Class create chesinappudu automatic ga run ayye constructor function (Script Include lo). GlideRecord lo gr.initialize() ante kotha khali record tayaru chestundi — rendu different.', ex: 'initialize: function() { this.max = 5; }' },

  // ---------- UI Actions / Pages / Macros / tools ----------
  'UI Action': { g: 'ui', m: 'Form button / link / context menu item / list banner button. Click chesinappudu script run avtundi — server side leda client side (Client checkbox tick cheste browser lo run avtundi).', ex: 'System Definition → UI Actions' },
  gsftSubmit: { g: 'ui', m: 'Client UI Action nundi server UI Action (same UI Action malli server lo) run cheyyadaniki helper function. Parameters: (null, form element, action name). ⚠️ Exact pattern nee PDI lo confirm chey.', ex: "gsftSubmit(null, g_form.getFormElement(), 'resolve_incident');", check: true },
  'action.setRedirectURL()': { g: 'ui', m: 'Server UI Action run ayyaka user ni e page ki teesukellalo cheptundi. Common: save ayyaka same record ki leda list ki.', ex: 'action.setRedirectURL(current);' },
  GlideDialogWindow: { g: 'ui', m: 'Pop-up dialog window open chese client class — andulo UI Page chupinchochu. Old style; kotha vaatilo GlideModal vaadatharu.', ex: "var dialog = new GlideDialogWindow('my_page');", check: true },
  'setTitle()': { g: 'ui', m: 'GlideDialogWindow pop-up ki title pedatam. render() ki mundu cheyyali.', ex: "dialog.setTitle('Close incident');", check: true },
  'render()': { g: 'ui', m: 'GlideDialogWindow pop-up ni screen meeda chupistundi. Anni settings (title, preferences) pettaka chivarlo pilavali.', ex: 'dialog.render();', check: true },
  g_request: { g: 'ui', m: 'UI Page lo server side (Processing Script) lo user submit chesina form values teesukuntundi. g_request.getParameter("field_name"). Client lo vaadedi kaadu — peru g_ tho start ayina server object.', ex: "var reason = g_request.getParameter('reason');", check: true },
  'g_request.getParameter()': { g: 'ui', m: 'UI Page form lo user ichina value (name tho) teesukuntundi, Processing Script lo. Value string ga vastundi.', ex: "g_request.getParameter('reason');", check: true },
  'UI Page': { g: 'ui', m: 'Mee own custom page (HTML + Jelly + client script + server script). Dialog / form / popup laanti vaatiki. URL: /ui_page_name.do', ex: 'System UI → UI Pages' },
  'UI Macro': { g: 'ui', m: 'Reusable Jelly / HTML chinna piece. Form lo field pakkana icon / button pettadaniki leda UI Pages lo include cheyyadaniki.', ex: 'System UI → UI Macros', check: true },
  Jelly: { g: 'ui', m: 'ServiceNow UI Pages / UI Macros lo vaade XML-based templating language. <j:set var="jvar_x" .../> laanti tags tho server value HTML lo pettochu.', ex: '<j:set var="jvar_name" value="${gs.getUserName()}"/>', check: true },
  'SN Utils': { g: 'ui', m: 'Browser extension — ServiceNow dev ki helpful tools (script tool, field name chupinchadam, slash commands). Real PDI lo vaadi chudu. Extension, ServiceNow product kaadu.', ex: 'Chrome Web Store → SN Utils' },
  'Syntax Editor': { g: 'ui', m: 'ServiceNow script editor — colour highlighting, autocomplete, macros (chinna shortcuts). Script rayadaniki use chestam.', ex: 'Script field lo "vargs" + Tab (macro)', check: true },

  // ---------- more gs methods (server side) ----------
  'gs.hasRole': { g: 'gs3', m: 'Server lo ippudu login ayina user ki aa role undha ani check. Client lo idi ledu — akkada g_user.hasRole.', ex: "gs.hasRole('itil');" },
  'gs.addInfoMessage': { g: 'gs3', m: 'Server nundi user ki blue info message chupistundi (next page / form lo). Client lo g_form.addInfoMessage.', ex: "gs.addInfoMessage('Incident updated');" },
  'gs.addErrorMessage': { g: 'gs3', m: 'Server nundi user ki red error message chupistundi.', ex: "gs.addErrorMessage('Update chesukoleru');" },
  'gs.getUserDisplayName': { g: 'gs3', m: 'Ippudu login ayina user yokka full name (First Last) istundi. getUserName username istundi.', ex: 'gs.getUserDisplayName();   // "Abel Tuter"' },
  'gs.getUserID': { g: 'gs3', m: 'Ippudu login ayina user yokka sys_id istundi.', ex: 'gs.getUserID();' },
  'gs.getUser': { g: 'gs3', m: 'Ippudu login ayina user object (GlideUser) istundi. Daani meeda getID(), getFullName(), hasRole(...) laanti methods untayi.', ex: 'gs.getUser().getFullName();', check: true },
  'gs.log': { g: 'gs3', m: 'Old style log method (Script Log). Kotha scripts lo gs.info vaadu. Scoped apps lo work cheyyadu.', ex: "gs.log('message');", check: true },
  'gs.print': { g: 'gs3', m: 'Old style print (Background Script output). Kotha scripts lo gs.info vaadu.', ex: "gs.print('message');", check: true },
})
