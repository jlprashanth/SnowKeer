// Stage 3 glossary, part 2 — words from the UI Action, CRUD, debugging, macro, best-practice and UI Page / UI Macro lessons
// (lessons-cs-d.js, lessons-cs-e.js). Same format as glossary-cs.js; every entry is marked s: 3. Merged into GLOSSARY_JS in glossary-js.js.
// Group keys come from GLOSSARY_GROUPS (glossary-js.js: Stage 2 groups + GLOSSARY_GROUPS_CS). check: true = "PDI lo confirm chey".
// Facts follow her Brazil PDI (scratchpad pdi-facts.md); anything not tested there carries check: true.

const s3 = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { ...v, s: 3 }]))

export const GLOSSARY_CS_UI = s3({
  // ---------- GlideRecord: create / bulk update / bulk delete ----------
  newRecord: { g: 'grm', m: 'Kotha record ready chestundi — initialize() laaga kaani defaults (state New, impact / urgency 3, priority 4), sys_id, number VENTANE vastayi; isNewRecord() true. Save cheyyadaniki tarvata insert(). (PDI lo tested.)', ex: "var gr = new GlideRecord('incident');\ngr.newRecord();\ngr.getValue('number');   // 'INC0010009'" },
  isNewRecord: { g: 'grm', m: 'Record inka table lo save avvaledu (kotha record) aa ani true / false. newRecord() tarvata true, initialize() tarvata false (PDI lo tested). UI Action Condition lo !current.isNewRecord() = saved records lo matrame.', ex: 'if (current.isNewRecord()) { ... }' },
  updateMultiple: { g: 'grm', m: 'Query ki match ayye ANNI records ni okesari update chestundi — loop / next() avasaram ledu; mundu setValue() tho values pettali. Filter lo field typo unte PDI aa condition ni ignore chesi motham table marchutundi — mundu same filter tho getRowCount() chudu. Docs: setValue() vaadu, gr.field = x direct assign kaadu.', ex: "gr.addQuery('category', 'network');\ngr.setValue('state', 2);\ngr.updateMultiple();" },
  deleteMultiple: { g: 'grm', m: 'Query ki match ayye ANNI records ni delete chestundi (loop ledu). Undo meeda aadharapadaku, update set kuda capture cheyyadu. Field typo = condition ignore = motham table delete! Ellappudu mundu getRowCount() tho count chudu.', ex: "gr.addQuery('active', false);\ngr.deleteMultiple();" },
  autoSysFields: { g: 'grm', m: 'false ichithe update appudu Updated / Updated by (sys_updated_*) fields marchavu. Data fix scripts lo vaadataru — normal code lo vaddu.', ex: 'gr.autoSysFields(false);' },

  // ---------- GlideAggregate ----------
  GlideAggregate: { g: 'sn', m: 'GlideRecord laanti class — count / sum / avg DATABASE lone chestundi, records anni load cheyyakunda. Pedda tables lo getRowCount() kante fast. getAggregate() STRING istundi (PDI lo tested).', ex: "var agg = new GlideAggregate('incident');\nagg.addAggregate('COUNT');\nagg.query();\nif (agg.next()) gs.info(agg.getAggregate('COUNT'));" },
  addAggregate: { g: 'grm', m: 'GlideAggregate ki em calculate cheyyalo cheptundi: COUNT, SUM, AVG, MIN, MAX (field tho).', ex: "agg.addAggregate('COUNT');" },
  getAggregate: { g: 'grm', m: 'next() tarvata aa group result istundi — STRING ga ("2"), number kaadu (PDI lo tested). Math kosam Number().', ex: "agg.getAggregate('COUNT');   // '2'" },
  groupBy: { g: 'grm', m: 'GlideAggregate results ni oka field batti groups chestundi (category wise count). Prathi group ki okasari next(); group value getValue(field) tho.', ex: "agg.groupBy('category');" },

  // ---------- UI Actions ----------
  'Requires role': { g: 'ui', m: 'UI Action ni oka role unnavaariki matrame chupinche setting. Nee PDI default UI Action form lo ee related list kanipinchaledu (akkada UI Action Visibility, Versions … unnayi) — roles field / related list vere view lo undochu, PDI lo chudu. Sure way: Condition lo gs.hasRole("itil"). Admin ki anni roles untayi kabatti non-admin user ni impersonate chesi test chey.', ex: "Condition: gs.hasRole('itil') && current.active == true", check: true },
  'Data Lookup': { g: 'ui', m: 'Incident Priority ni impact × urgency nunchi auto set chese rule (System Policy → Data Lookup Definitions). Nee PDI lo priority form lo read-only — marchali ante impact / urgency marchu (3 / 3 → 4 - Low, 1 / 1 → 1 - Critical).', ex: "g_form.setValue('urgency', '1');   // priority Data Lookup marchutundi" },

  // ---------- UI Pages / dialogs ----------
  GlideModal: { g: 'ui', m: 'Client lo dialog (popup) open chesi andulo UI Page chupistundi: new GlideModal("page_name") → setTitle() → render(). Kotha code ki idi; GlideDialogWindow paata (deprecated) — rendu nee PDI lo unnayi.', ex: "var gm = new GlideModal('snowkeer_hello');\ngm.setTitle('Hello');\ngm.render();" },
  'response.sendRedirect()': { g: 'ui', m: 'UI Page Processing script (server) tarvata user ni vere page ki pamputundi (e.g. kotha record form / list). Out-of-box UI Pages Processing scripts lo kuda ide vaadutaru (nee PDI lo chusam: add_catalog_item …).', ex: "response.sendRedirect('incident.do?sys_id=' + id);" },
  'g:evaluate': { g: 'ui', m: 'Jelly tag — page render ayyetappudu server lo JavaScript run chesi, LAST line value ni var (jvar_…) lo pedutundi; tarvata ${jvar_…} tho print. Lopala && ni &amp;&amp;, < ni &lt; ga rayali (XML).', ex: '<g:evaluate var="jvar_count">\n  var gr = new GlideRecord(\'incident\');\n  gr.query();\n  gr.getRowCount();\n</g:evaluate>' },
  'g:ui_form': { g: 'ui', m: 'UI Page lo HTML form create chese Jelly tag. Lopala unna inputs (name tho) + OK button submit ayithe Processing script run avtundi.', ex: '<g:ui_form> … </g:ui_form>' },
  'g:dialog_buttons_ok_cancel': { g: 'ui', m: 'Out-of-box UI Macro — OK / Cancel buttons. ok="return validate()" = OK mundu client check. Default ok_type "submit"; ok_type="button" pedithe form post avvadu, Processing script run avvadu (PDI lo tested).', ex: '<g:dialog_buttons_ok_cancel ok="return validate()" />' },
  'gel()': { g: 'cl', m: 'ServiceNow classic UI shortcut: gel("id") = document.getElementById("id"). UI Page client script lo nee HTML inputs ki OK; form fields ki g_form vaadu.', ex: "gel('short_desc').value" },

  // ---------- UI Macros ----------
  'g:macro_invoke': { g: 'ui', m: 'UI Macro ni peru tho piliche Jelly tag — <g:macro_invoke macro="name" /> = short form <g:name />.', ex: '<g:macro_invoke macro="snowkeer_badge" />' },
  ref_contributions: { g: 'ui', m: 'Reference field dictionary attribute — = tarvata ichina UI Macro(s) field pakkana icon / button ga render avtayi. Nee PDI lo incident Caller (caller_id) dictionary lo ref_contributions=user_show_incidents undi — Caller pakkana icons ade (chusam).', ex: 'ref_contributions=user_show_incidents' },

  // ---------- debugging & tools ----------
  'Scripts - Background': { g: 'ui', m: 'All → System Definition → Scripts - Background: Monaco editor page — server script rasi "Run Script" click chesthe output ventane "*** Script: …" ga vastundi (PDI test ki). "Record for rollback?" default ga tick. ES12 toggle ledu — let / class ikkada SyntaxError. Nijamaina data marutundi — production lo jagratta (PDI lo chusam).', ex: 'gs.info(new GlideRecord("incident").getTableName());' },
  'Script Debugger': { g: 'ui', m: 'System Diagnostics → Script Debugger: server scripts (Business Rule, Script Include) lo breakpoints pettesi step-by-step chudochu (PDI lo module tested).', ex: 'System Diagnostics → Script Debugger' },
  'Session Debug': { g: 'ui', m: 'System Diagnostics → Session Debug: ee session lo run ayina Business Rules, logs laantivi form kinda chupistundi (Debug Business Rule, Debug Log …). Pani ayyaka off chey.', ex: 'System Diagnostics → Session Debug → Debug Business Rule' },
  'Script Tracer': { g: 'ui', m: 'System Diagnostics → Script Tracer: oka transaction (form save laanti) lo e scripts run ayyayo, fields ela marayo trace chestundi.', ex: 'System Diagnostics → Script Tracer', check: true },
  'Debug UI Macro': { g: 'ui', m: 'System Diagnostics → Debug UI Macro: page lo e UI Macros render ayyayo debug info chupistundi. Off: Disable UI Macro Debug.', ex: 'System Diagnostics → Debug UI Macro', check: true },
  'Field Watcher': { g: 'ui', m: 'Form field value ni e script / UI Policy marchindo chupinche classic UI debug tool. Brazil lo MODULE ledu, Preferences lo kuda ledu — classic form ☰ menu (form title pakkana, leda header right-click) → "Enable Field Watcher" (ee location PDI lo tested). On chesaka panel lo em chupistundo PDI lo chudu.', ex: 'Incident form ☰ → Enable Field Watcher', check: true },
})
