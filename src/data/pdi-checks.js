// "🔍 PDI lo ela check cheyyali?" — steps for confirming a ⚠️ (not yet verified) fact in her own PDI.
// Content links a recipe with checks: ['<key>'] on a learn card, quiz question (5th q() argument), exercise, glossary entry
// or guided step; PdiCheck.jsx shows it closed under that item. One recipe per fact — every mention links the same one.
// Recipe: title, steps (a string, or { t, code } for a step with a script), see (what she sees if the lesson is right),
// cleanup (always, "emi maraledu" when nothing was created). Test scripts only touch the "pdi check" incident.
// Facts that can't be tested in a PDI get "📄 docs nunchi" wording instead of a recipe. Checked by dev-tools/check-pdi-checks.mjs.

const TEST_INC =
  'Test incident create chey: Incident → Create New → Caller: Abel Tuter, Short description: pdi check → Submit. (Already unte adi vaadu — kinda scripts ee incident meeda matrame pani chestayi. Okkokka check vidiga chey: mundu check cleanup ayyaka next.)'
const DEL_INC = '"pdi check" incident inka vere check ki avasaram lekapothe daanni kuda delete chey.'

export const PDI_CHECKS = {
  'submit-rerun': {
    title: 'g_form.submit() onSubmit ni malli run chestunda?',
    steps: [
      TEST_INC,
      {
        t: 'All → System Definition → Client Scripts → New: Name "SnowKeer check submit", Table Incident, Type onSubmit. Script lo idi paste chesi Submit:',
        code: `function onSubmit() {
  if (g_form.getValue('short_description') != 'pdi check') {
    return true;
  }
  if (g_scratchpad.secondRun) {
    alert('onSubmit MALLI run ayindi');
    return true;
  }
  g_scratchpad.secondRun = true;
  var action = g_form.getActionName();
  g_form.getReference('caller_id', function () {
    g_form.submit(action);
  });
  return false;
}`,
      },
      '"pdi check" incident open chesi Update click chey.',
    ],
    see: 'Alert "onSubmit MALLI run ayindi" vachi, OK nokkaka record save ayithe — lesson correct: g_form.submit() onSubmit ni malli run chestundi (anduke flag kavali). Alert raakunda save ayithe — re-run avvaledu; ee point tappu, note chesko. (getReference callback kuda GlideAjax laage tarvata vastundi — Script Include lekunda test cheyyadaniki adi vaadam.)',
    cleanup: 'Client Script "SnowKeer check submit" delete chey. ' + DEL_INC,
  },

  'async-submit': {
    title: 'onSubmit lo callback "return false" save ni aaputunda?',
    steps: [
      TEST_INC,
      {
        t: 'All → System Definition → Client Scripts → New: Name "SnowKeer check async", Table Incident, Type onSubmit. Script → Submit:',
        code: `function onSubmit() {
  if (g_form.getValue('short_description') != 'pdi check') {
    return true;
  }
  g_form.getReference('caller_id', function () {
    alert('Callback ippude run ayindi — return false istunna');
    return false;
  });
}`,
      },
      '"pdi check" incident open chesi Description lo "async test" ani rasi Update click chey.',
      'Incident malli open chesi Description chudu.',
    ],
    see: 'Description lo "async test" save ayyi unte — callback lo return false save ni aapaledu (lesson correct). Alert vachina raakapoyina parledu — callback vachesariki save already jarigipoyindi. Save aagipothe (Description save avvakapothe) — ee point tappu, note chesko. (getReference callback kuda GlideAjax laage tarvata vastundi.)',
    cleanup: 'Client Script "SnowKeer check async" delete chey. ' + DEL_INC,
  },

  'list-edit': {
    title: 'List edit lo em run avtundi? (onCellEdit, onChange, UI Policy, Data Policy)',
    steps: [
      TEST_INC,
      {
        t: 'All → System Definition → Client Scripts → New: Name "SnowKeer check cell", Table Incident, Type onCellEdit, Field name State. Script → Submit:',
        code: `function onCellEdit(sysIDs, table, oldValues, newValue, callback) {
  alert('onCellEdit: newValue = ' + newValue);
  callback(true);
}`,
      },
      {
        t: 'Inko Client Script: Name "SnowKeer check change", Table Incident, Type onChange, Field name State. Script → Submit:',
        code: `function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading || g_form.getValue('short_description') != 'pdi check') {
    return;
  }
  alert('onChange run ayindi: ' + newValue);
}`,
      },
      'Incident list (All filter lo incident.list → Enter) lo "pdi check" row lo State cell double-click → On Hold → save (✓ / Enter). Vere rows edit cheyyaku.',
      'Adhe cell lo State → Resolved try chey.',
      '"pdi check" FORM open chey. State ni In Progress ki, tarvata On Hold ki marchu (Save cheyyaku) → chusaka form ni save cheyyakunda close.',
    ],
    see: 'Step 4: "onCellEdit: newValue = 3" alert (label "On Hold" kaadu, VALUE) ✅; "onChange run ayindi" alert RAADU ✅ (list lo onChange run avvadu); On hold reason adagakunda save avtundi ✅ (form UI Policy list lo run avvadu). Step 5: save avvadu — Data Policy "Make close info mandatory when resolved or closed" error (Resolution code / notes kavali) ✅. Step 6: form lo prathi marpu ki onChange alert vastundi, On Hold lo On hold reason kanipinchi mandatory avtundi. Edaina veru ga jarigithe aa point note chesko.',
    cleanup: 'Client Scripts "SnowKeer check cell", "SnowKeer check change" rendu delete chey. ' + DEL_INC,
  },

  'clearvalue-onchange': {
    title: 'g_form.clearValue() aa field onChange ni run chestunda?',
    steps: [
      'Test incident: Incident → Create New → Caller: Abel Tuter, Short description: pdi check, Description: clear test → Submit. (Already unte Description lo "clear test" rasi Update.)',
      {
        t: 'All → System Definition → Client Scripts → New: Name "SnowKeer check clear", Table Incident, Type onChange, Field name Urgency. Script → Submit:',
        code: `function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading || g_form.getValue('short_description') != 'pdi check') {
    return;
  }
  g_form.clearValue('description');
}`,
      },
      {
        t: 'Inko Client Script: Name "SnowKeer check desc", Table Incident, Type onChange, Field name Description. Script → Submit:',
        code: `function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading || g_form.getValue('short_description') != 'pdi check') {
    return;
  }
  alert('Description onChange run ayindi');
}`,
      },
      '"pdi check" incident open chesi Urgency marchu (Save cheyyaku).',
    ],
    see: 'Description clear ayyi "Description onChange run ayindi" alert vasthe — clearValue kuda setValue laage onChange ni run chestundi (lesson correct). Alert raakapothe — clearValue onChange run cheyyadu; note chesko.',
    cleanup: 'Client Scripts "SnowKeer check clear", "SnowKeer check desc" rendu delete chey. Form ni Save cheyyakunda close chey. ' + DEL_INC,
  },

  'onload-vs-uipolicy': {
    title: 'onLoad Client Script vs UI Policy — oke field, opposite actions: evaru gelustaru?',
    steps: [
      TEST_INC,
      {
        t: 'All → System Definition → Client Scripts → New: Name "SnowKeer check onload", Table Incident, Type onLoad. Script → Submit:',
        code: `function onLoad() {
  if (g_form.getValue('short_description') != 'pdi check') {
    return;
  }
  g_form.setMandatory('description', true);
}`,
      },
      'All → System UI → UI Policies → New: Table Incident, Short description "SnowKeer check policy", Conditions: Short description is pdi check, On load tick (default) → Submit. Malli open chesi UI Policy Actions → New: Field name Description, Mandatory = False → Submit.',
      '"pdi check" incident open chesi Description label pakkana ∗ (mandatory mark) undo chudu.',
      'Control: UI Policy "SnowKeer check policy" lo Active untick → Update. Incident malli open chesi ∗ chudu.',
    ],
    see: 'Step 4 lo ∗ LEDU, step 5 lo ∗ undi → UI Policy Client Script TARVATA run ayyi gelichindi (lesson correct). Step 4 lo kuda ∗ unte → Client Script gelichindi; ee point tappu, note chesko.',
    cleanup: 'Client Script "SnowKeer check onload", UI Policy "SnowKeer check policy" rendu delete chey. ' + DEL_INC,
  },

  'uipolicy-empty-mandatory': {
    title: 'UI Policy empty mandatory field ni hide / read-only cheyagalada?',
    steps: [
      'All → System UI → UI Policies → New: Table Incident, Short description "SnowKeer check mandatory", Conditions: Category is Hardware → Submit. Malli open chesi UI Policy Actions → New: Field name Short description, Read only = True, Visible = False → Submit.',
      'Incident → Create New. Short description EMPTY ga unchi Category = Hardware chey.',
      'Short description kanipistunda, andulo type cheyagalava chudu.',
      'Ippudu Short description lo text rasi Category ni Inquiry ki, malli Hardware ki marchu.',
    ],
    see: 'Step 3: field kanipistundi + editable (empty + mandatory → UI Policy action ignore) — lesson correct. Step 4: text unnappudu field hide avtundi (policy normal ga pani chestundi). Step 3 lo field maayam ayithe — UI Policy tho rule veru; note chesko.',
    cleanup: 'Kotha incident ni Submit cheyyakunda close chey. UI Policy "SnowKeer check mandatory" delete chey.',
  },

  'process-flow-save': {
    title: 'Process Flow highlight save tarvata matrame marutunda?',
    steps: [
      'Prerequisite: Hands-on Practice → Process Flow → "Practice Task ki custom Process Flow" exercise lo bar build chesi undali.',
      'Level = Easy unna Practice Task record open chey (bar lo Easy highlight).',
      'Level ni Hard ki marchu — Save cheyyaku. Bar chudu.',
      'Ippudu ☰ → Save. Form reload ayyaka bar chudu.',
    ],
    see: 'Step 3 lo highlight Easy lone undi, step 4 tarvata Hard → lesson correct (bar SAVED value chupistundi). Step 3 lone marithe → bar live ga marutundi; note chesko.',
    cleanup: 'Kotha items emi levu — "Practice Task ki custom Process Flow" exercise cleanup chalu.',
  },

  'table-delete': {
    title: 'Table delete: security_admin kavala? Daani ACLs kuda potaya?',
    steps: [
      'Tables step ki MUNDU: All filter lo "Access Control" type chesi System Security → Access Control (ACL) open chey → Name starts with u_practice ani filter → enni rows unnayo note chey. (Chudatam matrame — emi marchaku.)',
      'Tables delete chesetappudu error vachinda (security_admin / ACL gurinchi)? Vasthe Elevate role chesi malli Delete chesava — note chey.',
      'Tables delete ayyaka step 1 list (same filter) malli chudu.',
    ],
    see: 'Step 3 lo 0 rows → table tho patu daani ACLs kuda delete ayyayi (lesson correct). Rows migilithe → ACLs auto ga povu; avi harmless (table ledu), kani cleanup chudu. Step 2 lo error vasthe → table delete ki elevate kavali ani note chesko.',
    cleanup: 'u_practice ACLs migilithe (optional): avatar menu → Elevate role → security_admin → confirm; ACL list lo avi tick chesi "Actions on selected rows..." → Delete. Elevate session ayipoyaka (logout) taanantata pothundi.',
  },

  'ui-action-no-autosave': {
    title: 'Server UI Action: current.update() lekunda record save avtunda?',
    steps: [
      TEST_INC,
      {
        t: 'All → System Definition → UI Actions → New: Name "SnowKeer check save", Table Incident, Form button tick, Show update tick, Client untick, Condition: current.short_description == "pdi check". Script → Submit:',
        code: `gs.addInfoMessage('current.description = ' + current.description);
action.setRedirectURL(current);`,
      },
      '"pdi check" incident open chesi Description lo "ui action test" ani rasi (Update cheyyaku) "SnowKeer check save" button click chey.',
    ],
    see: 'Message lo "current.description = ui action test" vastundi (form values current lo unnayi) ✅, kani form reload ayyaka Description lo "ui action test" ledu (current.update() ledu kabatti save avvaledu) ✅ → lesson correct. Description save ayi unte — UI Action taanantata save chestundi; note chesko.',
    cleanup: 'UI Action "SnowKeer check save" delete chey. ' + DEL_INC,
  },

  'list-choice-per-record': {
    title: 'List choice server UI Action prathi selected record ki okasari run avtunda?',
    steps: [
      {
        t: 'All → System Definition → UI Actions → New: Name "SnowKeer check list", Table Incident, List choice tick, Client untick. Script → Submit:',
        code: `gs.addInfoMessage('Ran for ' + current.number);`,
      },
      'Incident list lo 2 rows tick chey → list kinda "Actions on selected rows..." dropdown → "SnowKeer check list".',
    ],
    see: 'Rendu messages vasthe ("Ran for INC…" prathi record ki) → prathi selected record ki okasari run avtundi, current = aa record (lesson correct). Okkate message vasthe — note chesko.',
    cleanup: 'UI Action "SnowKeer check list" delete chey. (Records emi maravu — script message matrame chupistundi.)',
  },

  'requires-role': {
    title: 'UI Action ki roles ekkada set chestaru? ("Requires role")',
    steps: [
      'All → System Definition → UI Actions → "Resolve" (Table incident) open chey — emi marchaku.',
      'Form kinda related lists lo "Requires role" / roles laantidi undo chudu.',
      '☰ → View ▸ lo vere views unte select chesi malli chudu.',
      '☰ → Configure → Related Lists lo "Requires role" laanti list Available side lo undo chudu — add cheyyaku, Cancel.',
    ],
    see: 'Ekkada kanipinchindo (view peru / related list peru) note chesko. Ekkada kanipinchakapoyina parledu — Condition lo gs.hasRole("itil") sure way.',
    cleanup: 'View marchi unte ☰ → View ▸ → Default ki tirigi marchu. Emi save cheyyaledu.',
  },

  'field-watcher': {
    title: 'Field Watcher on chesaka em kanipistundi?',
    steps: [
      'Oka incident open chey → ☰ → "Enable Field Watcher".',
      'Urgency label meeda right-click → "Watch" laanti option undo chudu → click.',
      'Urgency marchu (Save cheyyaku) → form kinda / pakkana panel lo em vachindo chudu.',
      'Off cheyyadaniki ☰ lo "Disable Field Watcher" laanti option chudu.',
    ],
    see: 'Right-click option peru, panel lo em chupinchindo (e script / policy field ni marchindo) note chesko.',
    cleanup: 'Field Watcher off chey; form ni Save cheyyakunda close chey.',
  },

  'monaco-suggest': {
    title: 'Monaco editor lo "gr." type chesthe methods suggest chestunda?',
    steps: [
      'All → System Definition → Scripts - Background open chey.',
      "var gr = new GlideRecord('incident'); type chesi Enter — tarvata gr. (dot tho) type chey.",
      'List taanantata raakapothe Ctrl+Space press chey. gs. kuda try chey.',
    ],
    see: 'addQuery, query, next… laanti methods list lo vasthe — lesson correct. Raakapothe (macros / words matrame vasthe) note chesko — appudu docs API Reference lo vethuku.',
    cleanup: '"Run Script" click cheyyaku — page close chey; emi run avvaledu, emi maraledu.',
  },

  'new-record-menu': {
    title: 'Kotha record ☰ lo Insert options untaya?',
    steps: [
      'Prerequisite: Practice Task table ("Custom table create chey" exercise). Practice Task list → New → ☰ menu chudu (Save / Submit cheyyaku).',
      'Existing Practice Task record open chesi ☰ chudu.',
    ],
    see: 'Kotha record ☰ lo Insert / Insert and Stay LEVU, existing record ☰ lo unnayi → lesson correct. (Incident laanti task tables lo rendu chotla levu — nee PDI setting glide.ui.task.insert = false, adi verified.)',
    cleanup: 'Kotha form ni Submit cheyyakunda close chey; emi maraledu.',
  },

  'filter-panel': {
    title: 'PDI lo filter panel ela untundi?',
    steps: [
      'All filter lo incident.list type chesi Enter.',
      'List paina filter icon (funnel) click chey.',
    ],
    see: 'Oka khaali condition row already untundi, prathi row pakkana AND / OR buttons untayi → lesson correct. Veru ga unte note chesko.',
    cleanup: 'Run cheyyakunda filter close chey; emi maraledu.',
  },
}
