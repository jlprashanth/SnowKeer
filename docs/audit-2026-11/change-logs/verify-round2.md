# PDI verification — round 2 (2026-11-14, her Brazil PDI, user logged in)

Legend: ✅ VERIFIED (keep the statement, REMOVE its "⚠️ PDI lo confirm chesuko"), ❌ CONTRADICTED (FIX the content),
➕ NEW FACT (use it where relevant), ⏸ STILL UNVERIFIED (leave the ⚠️ as is).

## ❌ Contradicted — must be fixed
1. Reading a property of `undefined` (`var u; u.number`) does NOT throw in her PDI (global scope) — it quietly gives `undefined`.
   Only `null` throws: `TypeError: Cannot read property "x" from null`. (Fix lessons-js-b.js ~:1132, quiz-extra-js.js ~:91 and any
   text that shows `Cannot read property "number" from undefined`.)
2. Syntax Editor Macros do NOT expand with **Tab** in Brazil. Every script editor (Scripts - Background page AND form Script fields
   like Script Include / Business Rule) is the **Monaco** editor: type the macro name (e.g. `vargr`), press **Ctrl+Space**, pick it
   from the suggestion list, press **Enter** → the template is inserted. Tab just inserts a tab. `help` also appears in Ctrl+Space.
   Macro records in her PDI: doc, for, ialogbr, ialogsi, info, method, vargr, vargror.
3. `g_form.addOption(field, value, label)` with a value that ALREADY exists adds NO duplicate (urgency stayed 1,2,3). (The mock now
   matches — it skips an existing value.)
4. Field Watcher: it is NOT in Preferences. In her PDI it is in the classic FORM context menu (☰ next to the form title, or
   right-click the form header) → **"Enable Field Watcher"**. Preferences → Debugging has only "Script Debugger" (Open), an ATF Page
   Inspector toggle and "Next Experience Developer Tools" (a separate browser extension — don't install). There is no "JavaScript Log
   and Field Watcher" item in Preferences.
5. Process Flow formatter: there is NO global Process Flow formatter — formatter records (System UI → Formatters, table
   sys_ui_formatter, Formatter = process_flow.xml) exist only for problem, change_request, problem_task, etc. For a CUSTOM table, Form
   Layout offers "Process Flow" only after you create a Formatter record for that table (Name "Process Flow", Formatter
   "process_flow.xml", Table = your table, Type Formatter). Cleanup must delete that formatter record too.

## ➕ New facts
6. The **Scripts - Background** module (System Definition) opens `sys.scripts.modern.do`: Monaco editor with a toolbar, button
   **"Run Script"** (capital S), scope picker, "Record for rollback?" (ticked by default), "Execute in sandbox?", "Instance Scripts".
   Output lines look like `*** Script: <your text>`.
7. Form Script fields (Script Include, Business Rule …) have a toggle **"Turn on ECMAScript 2021 (ES12) mode"** — per script, also in
   global scope. With it ON, newer syntax (let, class …) is allowed in THAT script. Background Scripts have no such toggle (our
   let/destructuring/spread/class failures were measured there). Scoped apps also have an app-level "JavaScript Mode"
   (Compatibility Mode / ES5 Standards Mode / ECMAScript 2021 (ES12)).
8. Form context menu (☰): Save, Copy Incident, Configure ▸ (Form Builder, Form Design, Form Layout, Related Lists, All, Table,
   Security Rules, Business Rules, Client Scripts, UI Policies, Data Policies, UI Actions, Notifications, Dictionary), Export ▸,
   View ▸, Create Favorite, Enable Field Watcher, Copy URL, Copy sys_id, Show XML, History ▸, Reload form.
   → Form Builder IS reachable from Configure (its navigator module is inactive).
9. Field label right-click menu: Configure Label, Configure Dictionary, Configure Styles, Show Security Rules, Configure Choices,
   Show Choice List, Show - 'field_name'.
10. `getReference(field, cb)` on an EMPTY reference still calls the callback, with an object whose fields are `undefined`
    (`c.sys_id` / `c.name` undefined, not ''). (The mock now matches.)
11. On a list page `g_list` is NOT a global — it exists inside a list UI Action's client script. In the console use
    `GlideList2.get('incident')`. `getQuery()` → 'active=true' (no ORDERBY); `getQuery({orderby: true})` adds '^ORDERBYnumber';
    `getView()` → '' for the default view; `getChecked()` → '' when nothing is ticked; `refresh()` exists.
12. Header (Next Experience): All · Favorites · History · Workspaces · Admin; globe icon → "Application scope: Global" and
    "Update set: Default [Global]" (the scope + update set picker). Avatar menu: Profile, Preferences, Keyboard shortcuts,
    Impersonate user, Elevate role, Printer friendly version, Log out.
13. Incident form tabs: Notes, Related Records, Resolution Information. Priority is read-only "4 - Low" (Data Lookup UI policy).

## ✅ Verified (remove the ⚠️ on these statements; keep the statement)
Server / scripts:
- A Resolved incident stays `active = true`; only Closed sets `active = false` (system log: "State changed (Resolved->Closed),
  setting task to inactive"). OOB business rule `mark_resolved` runs on resolve.
- A Background Script / GlideRecord insert is NOT blocked by the OOB Data Policy "Make close info mandatory when resolved or closed"
  (that data policy applies to import sets + SOAP; enforce on forms via UI policy). Data policy rules: close_code + close_notes mandatory
  when state IN 6,7.
- Dictionary "Read only" is form-only: a script can set a read-only field (tested on incident.reopened_by).
- Calling `insert()` a second time without `initialize()` creates ANOTHER new record with the same values.
- Assignment rules: when two rules match, the LOWEST Order wins (100 beat 200); a rule does NOT overwrite an Assignment group that
  is already set. Rule form labels: Conditions, Group, User; tabs "Applies To", "Assign To"; Order comes from the parent "Rule" table.
- With no Data Lookup, a new incident's priority = dictionary default 4.
- `String(gr.description)` / `gr.description + ''` on an EMPTY field → "" (not "null").
- `gr.getDisplayValue('assigned_to')` and `gr.assigned_to.getDisplayValue()` on an empty reference → "".
- `gr.getValue(NaN)` → null.
- Calling a method on a `Class.create()` function WITHOUT `new` (e.g. `IncidentUtils.getP1Count()`) → no error, undefined.
- AbstractAjaxProcessor `initialize: function(request, responseXML, gc) { this.request = request; … }` — so a Script Include with its
  own empty `initialize: function () {}` breaks getParameter. getParameter / getName return Java Strings (source comment).
- The global "Submit" UI action's action name is `sysverb_insert` (so g_form.getActionName() on a new record's Submit = 'sysverb_insert').
- OOB incident "Resolve" UI action: Client ticked, Onclick `resolveIncident()`, action name `resolve_incident`, uses
  `g_form.setValue('state', 6)` + `gsftSubmit(null, g_form.getFormElement(), 'resolve_incident')`.
- OOB "Worknotes mandatory onChange of priority": `if (isLoading || newValue === '' || g_form.isNewRecord()) return; else if
  (newValue == oldValue) g_form.setMandatory('work_notes', false); else g_form.setMandatory('work_notes', true);`
- OOB "Highlight VIP Caller": onChange caller_id → `g_form.getReference('caller_id', vipCallerCallback)`; callback checks
  `caller.vip == 'true'` (reference record values are strings; vip came back as "false").
Client:
- `oldValue` = the value when the form LOADED (priority 4 → 2 → 3 → 4: work notes mandatory, mandatory, NOT mandatory).
- `g_form.setValue()` fires the field's onChange scripts.
- `getReference(field, callback)` is asynchronous (the line after the call ran before the callback). GlideAjax getXMLAnswer uses
  the same async request — treat as verified. `GlideAjax.getXMLWait` exists.
- Repeated `showFieldMsg` calls stack (both messages shown). `g_scratchpad` always exists on a form (object).
- `g_user.hasRoleFromList('anything')` → true for admin. `GlideModal.prototype.setPreference` exists.
- UI Type choices on Client Scripts: Desktop (0), Mobile / Service Portal (1), All (10).
UI / navigation / labels:
- Typing `incident.list` in the All-menu filter + Enter opens the incident list. Classic pages inside Next Experience sit in an iframe
  with id/name `gsft_main`.
- History menu exists in the header; globe icon = scope + update set picker (see ➕12).
- Table form (sys_db_object): tab "Controls" holds Extensible, Auto-number (Prefix / Number / Maximum digits), "Create access
  controls", "User role"; main section: Label, Name, Extends table, Application. Labels: Extensible, Auto number, Extends table.
  Auto-created table roles follow `u_<table>_user` (e.g. u_certification_user exists in her PDI).
- Dictionary entry form related lists: Choices, Labels, Access Controls, Dictionary Overrides (+ Versions).
- sys_process_flow fields: Name, Label, Table, Order, Condition, Active, Description.
- Saved filters live in table sys_filter. sys_class_name label = "Class" ("Task type" on task tables).
- Back Out = UI action on the update set record (sys_update_set), shown by condition `UpdateSetBackOutVisible`.
- "Import Update Set from XML" = list link on Retrieved Update Sets (sys_remote_update_set).
- UI Policy labels: On load, Global, View, Reverse if false, Run scripts, Order. Data Policy labels: Apply to import sets, Apply to SOAP.
- Global formatters: "Activities (filtered)" (activity.xml), Contextual Search Results, Ratings.
- Module labels: View name, Filter, Link type. Default value `javascript:gs.getUserID()` is used OOB on user references.
- Modules: Client Scripts → System Definition; UI Actions → System UI AND System Definition; UI Policies → System UI;
  Data Policies → System Policy; "Disable All" → System Diagnostics (Session Debug off).
- OOB UI Pages use `response.sendRedirect(...)` in Processing scripts (add_catalog_item, assessment_take2 …); 227 OOB UI Pages use
  phase-2 `$[ ]`. OOB macro `ui_reference` reads its attributes as `${jvar_name}`, `${jvar_label}` (attribute → jvar_<attr>).
- incident.caller_id dictionary attributes: `ref_contributions=user_show_incidents` (the icons next to Caller on the form).
- Scoped apps: "JavaScript Mode" choices Compatibility Mode / ES5 Standards Mode / ECMAScript 2021 (ES12).

## ⏸ Still unverified (leave the ⚠️)
- PDI hibernate/reclaim timings (developer-portal policy, not in the PDI); learning-site name.
- g_form.submit(action) re-running onSubmit scripts; returning false inside a GlideAjax callback (follows from async — may keep a
  softer wording); getXMLWait not working in Service Portal / Workspace.
- List editing: onCellEdit newValue = choice value; list edit skipping onChange / UI Policies; Data Policy blocking a list edit;
  calling the onCellEdit callback twice.
- List choice server UI Action running once per selected record; "Requires role" related list on the UI Action form (NOT on the
  default form — related lists there are UI Action Visibility, Versions …; roles may be a field or on another view).
- UI Policy specifics (higher Order wins; UI-policy Visible/Read only ignored on an empty mandatory field — strongly implied by the
  verified g_form behaviour); exact "Data Policy Exception" message text; Process Flow bar updating only after save.
- Deleting a table: does it remove its ACLs / sections / list layouts; whether security_admin elevation is needed (sys_db_object
  delete ACL role = personalize_dictionary).
- Insert vs Insert and Stay navigation; un-grouping a list; Form Layout "Section → New..."; View name dropdown; View Rule on open.
- Editor shortcut keys (full screen etc.); Debug UI Macro on-page output; Jelly phase caching; SN Utils commands (third-party).
- setWorkflow(false) also stopping notifications/workflows (docs).
