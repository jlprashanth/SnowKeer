# Verified ServiceNow behaviour — the learner's PDI (Brazil release)

Build: glide-brazil-08-25-2026 patch1 hotfix1. Checked 2026-11-14 with read-only Background Scripts (global scope, admin user)
and read-only checks on a blank new-incident form. These facts OVERRIDE memory, older docs and earlier audit claims.
If content disagrees with this file, the content is wrong for her PDI.

## Server side (GlideRecord, gs) — global scope
1. `getValue()` on a true/false field returns the STRING `'1'` or `'0'` (never 'true'/'false').
2. `getValue()` on an EMPTY field (reference or text) returns `null`. On a field that does not exist: `null`.
3. Booleans: `gr.active == true` → true; `gr.active == 'true'` → FALSE; `gr.active.toString()` → 'true';
   `gr.getValue('active') === '1'` → true; `gr.getValue('active') == true` → true. Inactive: `gr.active == false` → true, `!gr.active` → true.
4. GlideElement truthiness follows its VALUE: an empty reference element is falsy (`!!gr.assigned_to` → false), a filled one truthy,
   a false boolean element falsy. `.nil()` and `gs.nil(gr.field)` both work. Dot-walking through an empty reference gives '' (no error).
   (The browser sandbox can NOT copy "falsy object" behaviour — teach `.nil()`, which works in both.)
5. Empty array `[]` is FALSY in her PDI (`!![]` → false). `{}` truthy, `''` falsy, `typeof null` → 'object'.
6. A MISSPELT field in `addQuery()` is IGNORED: the query returns ALL rows (67 of 67) and the log says
   "Invalid query detected … Unknown field". (Danger for delete loops: always check `getRowCount()` first.)
7. `initialize()`: every field null (sys_id, number, state, priority…), `isNewRecord()` false, `getUniqueValue()` null.
   `newRecord()`: sys_id generated, number assigned, defaults applied (state '1', impact '3', urgency '3', priority '4', active '1',
   opened_at = now), `isNewRecord()` true.
8. Pushing the element (`arr.push(gr.number)`) inside `while (gr.next())` → every entry shows the LAST record
   (INC0000003 ×3). `arr.push(gr.getValue('number'))` gives the right distinct values.
9. `var qc = gr.addQuery(A); gr.addQuery(B); qc.addOrCondition(C);` → (A OR C) AND B. Encoded: `A^ORC^B`.
10. Encoded query `A^B^ORC` = A AND (B OR C). `^NQ` starts a new query that is OR'ed with the previous one.
11. `gs.hasRole('<any role, even one that does not exist>')` → true for admin.
12. Priority Data Lookup in this PDI: 1/1=1 1/2=2 1/3=3 2/1=2 2/2=3 2/3=4 3/1=3 3/2=4 **3/3=4**. Dictionary defaults:
    task.priority=4, impact=3, urgency=3. (Keep 3/3 → "4 - Low"; "5 - Planning" exists as a choice.)
13. Insert / Insert and Stay (global UI actions) have condition
    `(!current.instanceOf('task') || gs.getProperty('glide.ui.task.insert') == 'true')` and `glide.ui.task.insert = false`
    → they are HIDDEN on incident and every task table; they show on non-task tables (e.g. a custom table).
    Insert = copies the OPEN existing record into a NEW record; the original stays unchanged.
14. `sys_process_flow` has 0 records for incident. Process Flow module = System UI → Process Flow. The process flow formatter
    is display-only; each stage is a sys_process_flow record (Table, Label, Order, Condition).
15. Labels in Brazil: Script Include checkbox = **"Glide AJAX enabled"** (field client_callable); also "Sandbox enabled".
    sys_db_object.is_extendable = "Extensible". Incident: close_notes = "Resolution notes", close_code = "Resolution code",
    hold_reason = "On hold reason", work_notes = "Work notes", comments = "Additional comments".
    UI Action fields: Client, Onclick, Action name, Form button, Form link, Form context menu, List banner button, List choice,
    List context menu, Show insert, Show update, Isolate script. UI Page fields: HTML, Client script, Processing script.
16. Incident choices: state 1 New, 2 In Progress, 3 On Hold, 6 Resolved, 7 Closed, 8 Canceled.
    category: inquiry = **"Inquiry"** (not "Inquiry / Help"), software = Software, hardware = Hardware, network = Network,
    database = Database (also access, cloud_services, collaboration_tools, internal_applications, performance, security,
    service_requests, vendor_outage). impact/urgency: 1 - High, 2 - Medium, 3 - Low. priority: 1 - Critical … 5 - Planning.
    close_code (Resolution code) value=label examples: 'Duplicate'='Duplicate', 'Known error'='Known error',
    'Resolved by caller'='Resolved – Fixed by Caller', 'Workaround provided'='Resolved – Workaround Applied',
    'Resolved by problem'='Resolved – Fixed by Problem'.
    hold_reason: 1 Awaiting Caller, 3 Awaiting Problem, 4 Awaiting Vendor, 5 Awaiting Change.
17. Out-of-box incident rules in her PDI: UI Policy "When state is On Hold the On hold reason field is visible and mandatory";
    Data Policy "Make close info mandatory when resolved or closed" (Resolution code + notes); UI Policy "Priority is managed by
    Data Lookup - set as read-only"; "Set Caller field mandatory state" (Caller is mandatory). OOB client scripts worth pointing at:
    "Empty assigned_to on group change" (onChange assignment_group), "Highlight VIP Caller" (onChange caller_id, uses getReference),
    "Resolution details visibility on state" (onChange state), "(BP) Close Mandatory on Close or Resolve" (onSubmit),
    "Worknotes mandatory onChange of priority". No dictionary-mandatory fields on task/incident.
18. Modules (application menu → module): Script Debugger, Session Debug, Debug Business Rule, Script Tracer, Debug Log,
    Debug UI Macro / Disable UI Macro Debug → **System Diagnostics**. Syntax Editor Macros, Scripts - Background → System Definition.
    Process Flow, UI Pages, UI Macros → System UI. Assignment (assignment rules; module title "Assignment") and
    Data Lookup Definitions → System Policy. Local Update Sets, Retrieved Update Sets, Update Sources → System Update Sets.
    There is NO "Field Watcher", "JavaScript Log" or active "Form Builder" module.
19. Syntax Editor Macros records: doc, for, ialogbr, ialogsi, info, method, vargr, vargror. vargr = `var gr = new GlideRecord("$0"); //
    gr.addQuery("name", "value"); // gr.query(); // if (gr.next()) { … }`. In Brazil every script editor is **Monaco**: type the macro
    name, press **Ctrl+Space**, pick it, **Enter** → template inserted. **Tab does NOT expand macros** (it inserts a tab). `help` is also
    in the Ctrl+Space list. (Checked on the Scripts - Background page and on a Script Include form.)
20. Form Layout split elements: `.begin_split`, `.split`, `.end_split` (slushbucket shows `|- begin_split -|`, `|- split -|`, `|- end_split -|`).
21. Update set UI actions include Make This My Current Set, Merge Update Sets, Compare Update Sets, Back Out, Export to XML,
    Scan Update Set, Submit and Make Current — there is NO "Mark as Complete". States: In progress, Complete, Ignore.
    Completing = set State to Complete and click Update.
22. User form actions: "Set Password", "Change password", "Reset a password".
23. Exist in global scope: updateMultiple(), deleteMultiple(), GlideAggregate (getAggregate returns a STRING), setWorkflow, gs.log, gs.print.
24. JavaScript in GLOBAL scope (Background Script):
    WORKS: `const`, arrow functions, template literals, Array includes/find/from/forEach, String includes/startsWith/padStart/
    repeat/trim, Object.entries/values/assign, Number.isInteger.
    FAILS (SyntaxError): `let` ("let is an ECMAScript 6 feature - not supported"), destructuring, spread `...`, `class`,
    default parameter values, `for…of`. `Map`, `Promise`, `Symbol` are undefined.
25. Calling a method that does NOT exist (on a string, array, object, number or GlideRecord) does NOT throw in global scope —
    it silently returns undefined. Property of null: `TypeError: Cannot read property "x" from null`.
    Undefined function: `ReferenceError: "noSuchFunctionXyz" is not defined.`
26. `gs.info(null)` prints `null`; `gs.info(undefined)` prints `undefined`; `gs.info('a {0} b {1}', 'X', 7)` → `a X b 7`.
27. `gr.get('INC0000060')` with ONE argument that is a NUMBER (not a sys_id) returns true and loads the record.
28. `setLimit(3)` then `getRowCount()` → 3. getDisplayValue: `gr.state.getDisplayValue()` → 'Closed',
    `gr.getDisplayValue('priority')` → '3 - Moderate', `gr.getDisplayValue()` → the number.

## Client side (classic incident form)
29. GlideModal, GlideModalForm and GlideDialogWindow (deprecated) all exist. `GlideAjax.getXMLWait` exists.
30. g_user properties userName, firstName, lastName, fullName, userID are strings; g_user.email / g_user.active are undefined.
    Methods hasRole, hasRoleExactly, hasRoles, hasRoleFromList, getFullName, getClientData exist.
31. `g_form.setValue()` / `setMandatory()` on a field that is not on the form → NO error (silently ignored). getValue → ''.
32. "Mandatory wins": on an EMPTY MANDATORY field, `setReadOnly(true)` and `setDisplay(false)` are ignored (field stays editable
    and visible). On a non-mandatory field setReadOnly works. (Short description on a new incident is mandatory.)
33. `g_form.flash('priority', …)` and `g_form.flash('incident.priority', …)` both run without error (docs show 'table.field').
34. g_form also has getDecimalValue, isVisible, addDecoration, getSectionNames, getDisplayBox, getActionName.
35. UI macro `dialog_buttons_ok_cancel`: default `ok_type="submit"`; the OK button's type = ok_type. So `ok_type="button"`
    stops the form from posting → the UI Page Processing script NEVER runs. OOB pages (add_catalog_item) use
    `<g:dialog_buttons_ok_cancel ok="return validateNewItem()" />` with no ok_type.

## AbstractAjaxProcessor (read from the OOB Script Include source in her PDI)
36. `process()` does `var functionName = this.getName();` then runs `this[functionName]` (or `this['ajaxFunction_' + name]`);
    names starting with "_" are refused (private). `getName()` = `this.getParameter("sysparm_name")` and the source comment says it
    returns "a Java String instance". The base class also has getParameter, getValue, getType, getChars, getDocument,
    getRootElement, newItem, setAnswer, setError, initialize.
    → A Script Include must NOT define its own getName / getValue / getType / getParameter (overriding getName breaks every call).
    → getParameter / getName return Java strings → wrap with String(...) before === / switch (verified from the source comment).
    The mock now dispatches the same way (callAjax too), so a `getName:` method fails there as well.

37. `GlideAggregate.getValue('active')` for a groupBy on a true/false field returns 'true' / 'false' (NOT '1' / '0' like
    GlideRecord.getValue). Her PDI's demo incidents: states 1, 2, 3 (all active) and 7 Closed (all inactive) — no Resolved ones.

## Round 2 — checked again on 2026-11-14 (read-only checks + temporary records that were deleted afterwards)
38. `oldValue` = the value when the form LOADED: with the OOB "Worknotes mandatory onChange of priority" script, priority 4 → 2 → 3 → 4
    made Work notes mandatory, mandatory, then NOT mandatory. `g_form.setValue()` fires the field's onChange scripts.
    That OOB script: `if (isLoading || newValue === '' || g_form.isNewRecord()) return; newValue == oldValue → setMandatory('work_notes', false) else true`.
39. `getReference(field, cb)` is asynchronous (the line after the call ran before the callback); GlideAjax getXMLAnswer uses the same
    async request. On an EMPTY reference the callback still runs, with an object whose fields are undefined (`c.sys_id` undefined).
40. `g_form.addOption()` with a value that already exists adds NO duplicate.
41. A Resolved incident stays `active = true`; Closed sets it false ("State changed (Resolved->Closed), setting task to inactive").
    OOB business rule `mark_resolved` runs on resolve and filled the Resolution code.
42. A Background Script insert of a Resolved incident was NOT blocked by the OOB Data Policy "Make close info mandatory when resolved or
    closed" (that policy: close_code + close_notes mandatory when state IN 6,7; Apply to import sets + SOAP ticked).
43. Dictionary "Read only" is form-only — a script can set a read-only field (tested: incident.reopened_by).
44. `insert()` a second time without `initialize()` creates ANOTHER record with the same values.
45. Assignment rules: with two matching rules the LOWEST Order wins (100 beat 200); a rule does NOT overwrite an Assignment group that
    is already set. Rule form: Conditions, Group, User; tabs "Applies To", "Assign To"; Order comes from the parent table "Rule".
46. Reading a property of `undefined` (`var u; u.number`) does NOT throw — it gives undefined. (Property of `null` throws, see #25.)
    Calling a method on a `Class.create()` function without `new` → undefined, no error. `String(gr.emptyField)` → "";
    getDisplayValue() on an empty reference → ""; `getValue(NaN)` → null.
47. Scripts - Background module (System Definition) opens `sys.scripts.modern.do`: Monaco editor + toolbar, **"Run Script"** button,
    "Record for rollback?" ticked by default, output `*** Script: …`. Form Script fields (Script Include, Business Rule …) have a per-script
    toggle **"Turn on ECMAScript 2021 (ES12) mode"** (global scope too); the Background Script page has none. Scoped apps also have an
    app-level "JavaScript Mode": Compatibility Mode / ES5 Standards Mode / ECMAScript 2021 (ES12).
48. Form ☰ context menu: Save, Copy Incident, Configure ▸ (**Form Builder**, Form Design, Form Layout, Related Lists, All, Table, Security
    Rules, Business Rules, Client Scripts, UI Policies, Data Policies, UI Actions, Notifications, Dictionary), Export ▸, View ▸, Create
    Favorite, **Enable Field Watcher**, Copy URL, Copy sys_id, Show XML, History ▸, Reload form. Field label right-click: Configure Label,
    Configure Dictionary, Configure Styles, Show Security Rules, Configure Choices, Show Choice List, Show - 'field'.
    Preferences (avatar menu) → Debugging: Script Debugger (Open), ATF Page Inspector, "Next Experience Developer Tools" (a separate
    browser extension). No "JavaScript Log and Field Watcher" item.
49. Header: All · Favorites · History · Workspaces · Admin; globe icon → "Application scope" + "Update set" picker. Typing `incident.list`
    in the All-menu filter + Enter opens the list. Classic pages sit in an iframe `gsft_main`.
50. Lists: `g_list` is a global only inside a list UI Action; in the console use `GlideList2.get('incident')`. getQuery() → no ORDERBY
    unless getQuery({orderby: true}); getView() → '' (default view); getChecked() → '' when nothing ticked; refresh() exists.
    Dropdown label "Actions on selected rows...".
51. Process Flow formatter records exist only for some tables (problem, change_request, problem_task …) — no global one. A custom table
    needs its own Formatter record (System UI → Formatters: Formatter "process_flow.xml", Table = the table) before Form Layout offers it.
52. Table form (sys_db_object) "Controls" tab: Extensible, Auto number (Prefix / Number / Maximum digits), Create access controls, User role.
    Auto-created roles look like `u_<table>_user`. Dictionary entry related lists: Choices, Labels, Access Controls, Dictionary Overrides.
    sys_process_flow fields: Name, Label, Table, Order, Condition, Active. Saved filters: table sys_filter. Back Out: UI action on the update
    set record (conditional). "Import Update Set from XML": list link on Retrieved Update Sets. UI Policy labels: On load, Global, View,
    Reverse if false, Run scripts. Data Policy: Apply to import sets, Apply to SOAP. Global formatter "Activities (filtered)".
53. OOB "Highlight VIP Caller" uses getReference with a callback and checks `caller.vip == 'true'` (values are strings). OOB "Resolve"
    UI action: Client, Onclick `resolveIncident()`, action name `resolve_incident`, `gsftSubmit(null, g_form.getFormElement(), 'resolve_incident')`.
    Global "Submit" action name = `sysverb_insert`. UI Type choices: Desktop / Mobile-Service Portal / All. `hasRoleFromList()` true for admin.
    Repeated showFieldMsg calls stack. `g_scratchpad` always exists. GlideModal.setPreference exists. OOB UI Pages use `response.sendRedirect()`
    and phase-2 `$[ ]`; OOB macros read attributes as `${jvar_<attr>}`; Caller has `ref_contributions=user_show_incidents`.

## STILL not tested in the PDI (keep ⚠️ "PDI lo confirm chesuko" in content)
- PDI: hibernates after a few hours idle (data kept); reclaimed and WIPED after ~10 days without a login (developer-portal policy,
  community sources — not visible inside the PDI).
- GlideAjax answers can't stop an onSubmit (follows from #39); `g_form.submit()` re-running onSubmit scripts; getXMLWait being
  classic-UI only (not Service Portal / Workspace).
- List editing (onCellEdit value, skipping onChange / UI Policies, Data Policy on list edit); a List choice server UI Action running once
  per selected record; where UI Action roles are set ("Requires role" is NOT on the default UI Action form).
- UI Policy Order conflicts; UI-policy actions on an empty mandatory field (implied by #32); exact "Data Policy Exception" text;
  table delete side effects; Insert vs Insert and Stay navigation; SN Utils commands (third-party extension); editor shortcut keys.
