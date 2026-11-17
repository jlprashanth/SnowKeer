# Stage 4 plan — Server Side ServiceNow Scripting (32 lectures)

Status: **PLAN ONLY, nothing built yet.** Written 2026-11-17 from the lecture list at the bottom of `CLAUDE.md`
(titles only, no durations). Nothing was run on her PDI.

Order of work:
1. **Step 1:** verify PDI facts. A list only; nobody has run anything yet.
2. **Step 2:** mock / runner work in `src/js/`.
3. **Step 3:** scaffolding: stage entry, files and checks.
4. **Step 4:** lessons, one per request, in course order.

Facts come before the mock because the mock must follow her PDI, not memory.

---

## Step 1 — PDI facts to verify (before any mock code or lesson text)

Today none of these are in `docs/pdi-facts-brazil.md`. Each result goes in as a new numbered fact. A fact that is still unverified
when its lesson is written gets "⚠️ PDI lo confirm chesuko" plus a `checks` recipe. Mark facts that only the docs can settle as 📄.

**Who runs these:** the user or the friend, by hand. Claude does not touch the PDI.
- **R** = read-only Background Script, or just looking at a form or module. Safe.
- **T** = needs a temporary record, for example a test Business Rule, Scheduled Job, Transform Map or ACL. These need **explicit
  permission** and a cleanup step. They use only a "pdi check" incident or a `u_pdi_check_*` record.

### 1a. GlideRecord / GlideRecordSecure (lectures 1–2)
- R: `new GlideRecordSecure('incident')` exists in global scope, and as admin it returns the same rows as GlideRecord.
- T (impersonate a non-admin, e.g. Abel Tuter, read-only queries only): are rows the user can't read **skipped silently**? Does
  `getRowCount()` count them or not? (Memory says it may count them. Must be checked.)
- T: does `insert()` / `update()` on GlideRecordSecure without the create/write right return `null`, and does it log a message?
  Does setting a field without write access get ignored?
- R: does `gr.get()` on a record you can't read return false under GlideRecordSecure?

### 1b. GlideAggregate (lecture 3)
- R: exact strings from `getAggregate('AVG', 'priority')` and `'SUM'`: are they decimals like `'2.5000'`? Also MIN/MAX.
- R: do `orderByAggregate('COUNT')`, `addHaving('COUNT', '>', 2)` and `addTrend('opened_at', 'month')` exist, and what do they return?
- R: what do `getValue()` and `getDisplayValue()` give for a groupBy on a **reference** field (assignment_group)?
  (Fact 37 covers only boolean fields.)
- R: does `getRowCount()` on a grouped GlideAggregate return the number of groups?

### 1c. GlideSystem (lecture 4)
- R: exact output format of `gs.daysAgo(3)`, `gs.daysAgoStart(3)`, `gs.beginningOfToday()`, `gs.endOfThisMonth()`, `gs.minutesAgo(10)`.
  UTC or her timezone? What separator?
- R: format of `gs.nowDateTime()` against `gs.now()`, and the result of `gs.dateDiff(a, b, false)` / `(…, true)`.
- R: her **user timezone** and the system timezone (`glide.sys.default.tz`). Also the user's date/time format.
- R: `gs.getUser().isMemberOf('Service Desk')`, `.getRoles()`, `.getCompanyID()`; `gs.getUser().getID() == gs.getUserID()`.
- R: `gs.getProperty('no.such.prop')` → null? `gs.getProperty('x', 'def')` → 'def'?
- R: `gs.tableExists('incident')`, the length and format of `gs.generateGUID()`, `gs.isInteractive()` in a Background Script,
  `gs.getSession().isInteractive()`.
- R: `gs.eventQueue` argument order (name, record, parm1, parm2, queue). Does an unregistered event name log a warning?

### 1d. GlideDateTime / GlideDuration / GlideSchedule (lectures 5–6)
- R: does `new GlideDateTime()` give now in UTC? `getValue()` is UTC; is `getDisplayValue()` her timezone, and in which format?
- R: is `new GlideDateTime('2026-11-14 10:00:00')` read as UTC? Does `setDisplayValue()` read local time?
- R: `addDaysUTC` vs `addDaysLocalTime`, `addSeconds`, `addMonthsUTC` (Jan 31 + 1 month = ?), `getDayOfWeekUTC()`
  (1 = Monday … 7 = Sunday?), `compareTo` (-1/0/1), `before()` / `after()`, `getDate()` (GlideDate value format),
  `getNumericValue()` (ms).
- R: does `GlideDateTime.subtract(a, b)` return a GlideDuration? What are `getDisplayValue()` ("2 Days 3 Hours"?),
  `getDurationValue()` and `getNumericValue()`?
- R: `new GlideDuration('3 12:00:00')` and `new GlideDuration(3600000)`: their display values, and `add()`.
- R: does the OOB schedule **"8-5 weekdays"** exist in her PDI? Its sys_id (memory says `08fcd0830a0a0b2600079f56b1adb9ae`, not trusted),
  its timezone and entry times. Is there also "8-5 weekdays excluding holidays"?
- R: `new GlideSchedule(sysId)` against `.load(sysId, tz)`; `isInSchedule(gdt)`; `duration(start, end)` → in-schedule GlideDuration;
  `add(start, duration)` → GlideDateTime. Use fixed dates so the output can be copied into the mock tests.

### 1e. Business Rules (lectures 7–9)
- R: the BR form labels in Brazil (When to run tab, When, Order, Insert/Update/Delete/Query, Filter Conditions, Advanced, Actions:
  Set field values / Add message / Abort action) and the default Order (100?). Is there an ES12 toggle on the Script field? (Fact 47 says yes.)
- R: the default script template of a new BR (`(function executeRule(current, previous /*null when async*/) { … })(current, previous);`?).
- R: OOB **before query** BR "incident query" (or similar): its condition and script, just read it.
- T (a temporary BR on the "pdi check" incident only):
  - In a before BR, is a change to `current` saved without `update()`?
  - In an after BR, is a change to `current` NOT saved?
  - Does `current.update()` inside a before or after BR log a recursion warning? What text?
  - `setAbortAction(true)`: the message text ("Invalid update"?), and nothing gets saved?
  - `current.operation()` values. What does `previous` hold on insert?
  - In an async BR, is `previous` null?
  - Does a display BR's `g_scratchpad` reach `g_scratchpad` on the client?
- T: does a before-query BR also run for GlideRecord queries in a Background Script? Does `setWorkflow(false)` skip it?

### 1f. Scheduled Jobs (lectures 10–12)
- R: module path (System Definition → Scheduled Jobs?) and the "Scheduled Script Execution" form labels (Run, Time, Run as,
  Conditional, Condition, Run this script, "Execute Now").
- R: from an OOB conditional job, how does the condition answer: an `answer` variable or the last expression?
- T: does "Execute Now" on a temporary job that only runs `gs.info` show its output in System Log, and as which user?

### 1g. Email & events (lectures 13–18)
- R: is outbound email on in her PDI (`glide.email.smtp.active`, "Email sending enabled")? Where is the Outbox (`sys_email`)?
- R: Notification form labels in Brazil: When to send (Record inserted/updated / Event is fired), Who will receive
  (Users, Groups, Event parm 1 contains recipient …), What it will contain, Weight, Send to event creator.
- R: the Event Registry module path and its form fields (Event name, Table, Fired by, Queue).
- R: email script wrapper. Read an OOB `sys_script_email` record: is it `(function runMailScript(current, template, email, email_action, event) { … })(…)`?
  Read how `${mail_script:name}` is written in an OOB notification. Check that `template.print` and `email.setSubject` / `addAddress`
  appear in OOB scripts.
- R: Email Properties page: its path and labels (the user should note them, not change them).
- R: Inbound Email Actions. Read the OOB "Create Incident" action: its type (New / Reply / Forward) and whether its script ends with
  `current.insert()`. The `email.*` properties it uses (subject, body_text, origemail, from, `email.body.<name>`), and how a Reply
  finds `current` (the watermark).
- R: Script Actions (`sysevent_script_action`) form fields. Are `event.parm1` and `event.parm2` strings, and is `current` the event's record?
  Read one OOB script action.
- 📄 how a PDI receives inbound email (instance mailbox address). Probably docs-only.

### 1h. Reports, views, metrics (lectures 19–21)
- R: dashboards in Brazil. Are they the Platform Analytics "Dashboards" experience or the classic Homepages / Responsive dashboards?
  What are the module names, and where does "Create new report" live?
- R: Database Views module path, the view-table form fields (Table, Variable prefix, Order, Where clause), and an OOB view to look at
  (e.g. `incident_metric`?).
- R: Metric Definition form (Table, Field, Type: Field value duration / Script calculation), OOB metrics on incident, and `metric_instance`.
  The metric script variables (`mi`, `current`, `definition`?) may be 📄.

### 1i. Import Sets, Transform Maps, Data Sources (lectures 22–26)
- R: module paths (System Import Sets → Load Data / Transform Maps / Import Sets / Data Sources) and Load Data form labels.
- R: transform script templates in Brazil: onStart/onBefore/onAfter/onComplete (`(function runTransformScript(source, map, log, target) …`?)
  and the field-map script (`answer = (function transformEntry(source) { return ''; })(source);`?).
  Read an OOB transform map script, read-only.
- R: transform variables available: `source`, `target`, `map`, `log`, `action`, `ignore`, `error`, `error_message`, `status_message`.
- T (an import from a 3-row CSV into a `u_pdi_check_import` table, then a full cleanup):
  - coalesce on one field: update vs insert.
  - an empty coalesce value: does it insert?
  - `ignore = true` → is the row state "Ignored"?
  - `error = true` → "Error"?
  - choice action create / ignore / reject.
  - the exact import set row states.
- R: Data Source types listed in Brazil (File, JDBC, LDAP, REST (IntegrationHub), Custom (Parse by Script) …) and the File format choices.

### 1j. SLA, ACL, Script Includes, Fix Scripts, Related Lists (lectures 27–32)
- R: SLA Definition form labels (Type, Target, Duration type, Duration, Schedule, Start / Pause / Stop / Reset conditions, Retroactive start,
  Timezone source); OOB SLA definitions on incident; `task_sla` fields (stage, has_breached, percentage, business_percentage).
- R: ACL form in Brazil: Type, Operation, Name (table.field), **Decision type (Allow If / Deny Unless)**, Admin overrides, Requires role,
  Data condition, Script (`answer = …` or a returned value?). Is the elevated `security_admin` role needed to edit ACLs in her PDI?
- R: an OOB ACL script that uses `answer`, read-only. The evaluation order note (table.field → table.* → table.none) may be 📄.
- R: dictionary Reference Specification labels (Use reference qualifier: Simple / Dynamic / Advanced). The OOB ref qual on
  `incident.assigned_to` (does it use `javascript:`?). The `sys_user_grmember` fields (user, group).
- R: Fix Scripts module path and form ("Record for rollback?", "Run Fix Script"). Relationships module path and the "Query with" template
  (`(function refineQuery(current, parent) { … })(current, parent);`?), and "Applies to table" / "Queries from table".
- R: where Related Lists are configured (form ☰ → Configure → Related Lists is fact 48) and the Edit… / New button behaviour on a related list.

---

## Step 2 — Mock / runner work in `src/js/` (before the lessons that need it)

Every item comes with new cases in `dev-tools/check-mock.mjs`, written from the Step 1 results (not from memory). After each item,
`npm run check` must pass, and the 8 practice incidents' existing rows and counts **must not change**, because Stage 2/3 tests count them.
New data goes into **new fields** (with values on existing rows only where no test is affected), new tables, or `scenario.seed`.
Suggested model: Opus 5.5 high.

| # | Work | Needed by lessons |
|---|---|---|
| M0 | **Runner plumbing.** Expose a server-side `__x` to test `expr`: `events` (gs.eventQueue calls), `aborted`, `scratchpad`, `mail`, `queries` (count of query() / get() calls and rows loaded). Today eventQueue only writes a 'sys' log line, which tests may not read. | 4, 7–9, 12, 15, 17, 18, 32 |
| M1 | **GlideDateTime, GlideDate, GlideDuration, GlideSchedule.** Fixed clock (NOW = `2026-11-12 10:00:00` UTC, already used), her timezone for display values (from 1c/1d), the methods listed in 1d, `GlideDateTime.subtract`, and one built-in schedule "8-5 weekdays" (her sys_id and hours) with `isInSchedule` / `duration` / `add`. The biggest item. | 5, 6, 10–12, (27 learn cards) |
| M2 | **gs extensions.** `daysAgo`, `daysAgoStart`, `beginningOfToday`, `endOfThisMonth`, `minutesAgo`, `dateDiff` (via M1); `getProperty` backed by a small `sys_properties` set; `tableExists`; `generateGUID`; `getUser().isMemberOf()` / `getRoles()`; eventQueue → `__x.events`. **Encoded-query values `javascript:gs.daysAgoStart(7)`** evaluated in `addQuery` / `addEncodedQuery` (scheduled-job queries need it). | 4, 10–12, 14, 18 |
| M3 | **User / role / ACL model.** `scenario.user = { id, roles, groups }` (default admin, as today). `gs.hasRole` is real for non-admin users (admin still passes everything, fact 11). **GlideRecordSecure** = GlideRecord whose reads, writes and inserts are filtered by a small rule set in `scenario.acl` (or a default "itil can read incidents, the caller can read their own"). Behaviour exactly as verified in 1a. | 2, 9, 28 |
| M4 | **Business Rule harness.** `server: { br: { when: 'before'\|'after'\|'async'\|'display'\|'query', operation: 'insert'\|'update'\|'delete' } }`. before: `current` is saved after the script unless aborted. after: it is not saved. async: `previous` = null. display: `g_scratchpad` object, shown in `__x.scratchpad`. query: `current` is the query GlideRecord, and tests read the rows it returns per user (M3). Also `current.operation()`, the `setAbortAction` message text (from 1e), and a 'sys' hint when `current.update()` is called in a before/after BR (recursion). | 7, 8, 9, 32 |
| M5 | **Practice data additions.** Incident fields `sys_created_on`, `sys_updated_on`, `resolved_at`, `parent_incident` (reference to incident), and `vip` on sys_user. New tables: `sys_user_grmember` (users ↔ the 4 groups) and `sys_user_has_role` (or roles inline on users, matching M3). No new incident ROWS by default, because Stage 2/3 count totals. Resolved / old incidents for scheduled-job tests come from `scenario.seed`. | 8, 10–12, 28, 29 |
| M6 | **Scheduled-job harness (small).** `server: { job: { conditional: true } }` runs the condition script first and reads `answer` (or the last value, per 1f); the job script runs only when it is true. | 11, 12 |
| M7 | **Email objects.** Mail-script harness: wrapper `runMailScript(current, template, email, email_action, event)` (per 1g), `template.print()` / `space()`, `email.setSubject / addAddress / setFrom / setReplyTo`; the result goes to `__x.mail = { body, subject, to, cc, … }`. Inbound harness: an `email` object (subject, body_text, from, origemail, `body.<name>` parsed from "name: value" lines, recipients). Type New = `current` is a fresh incident (initialized); type Reply = `current` is the matched record. DB effects only through her `insert()` / `update()`. Optional UI: an "📧 Email preview" box under the runner output (a UI change, so it needs a browser check). | 15, 17 |
| M8 | **Script Action harness.** `server: { event: { name, parm1, parm2, record } }` → an `event` object plus `current` = that record. (Optional: `__x.events` from M0 can then be fed to a script action in the same run.) | 18 |
| M9 | **Mini transform engine.** A source import-set table (`u_import_incident` or `u_import_user`, defined in the scenario), field maps with a coalesce flag, field-map scripts (`answer`), onStart / onBefore / onAfter / onComplete scripts, variables `source / target / map / log / action / ignore / error / error_message`, and row results (inserted / updated / ignored / error) in `__x.importRows`. Coalesce rules exactly as in 1i. | 24, 25 |
| M10 | **ACL-script harness.** `server: { acl: { operation, users: [...] } }` runs the script once per user (M3) and collects `answer` in `__x.answers` (or uses variants with `scenario.user`, whichever stays simpler). | 28 |
| M11 | **Reference-qualifier helper.** Evaluate a `javascript:` qualifier string with `current` = a form record, apply the resulting encoded query to the reference table, and expose the matching rows to tests. Works with the existing Class.create Script Includes. | 29 |
| M12 | **Best-practice signals.** 'sys' hints (never tests) for `getRowCount()` used only to count (suggest GlideAggregate), `current.update()` in a BR, a `query()` inside a loop, and a missing `setLimit(1)` on an existence check. Tests can use `__x.queries` from M0. | 32 |

Also check `esCheck.js`: no change is expected, but Stage 4 has BR / SI Script fields with the ES12 toggle. Reference solutions stay ES5-safe
(CLAUDE.md rule), so the rule set stays as it is.

Lessons that need **no** new mock: 1, 3 (unless 1b shows orderByAggregate / addHaving are worth teaching; then that is a small addition
to `GlideAggregate`), and every `mode: 'pdi'` lesson.

---

## Step 3 — Scaffolding (with the first lesson, not before)

- Lesson files, following CLAUDE.md, each exporting an array:
  - `src/data/lessons-ss.js` (index + lectures 1–6) exports `SS_LESSONS` and merges the others. `lessons-ss-b.js` (7–12),
    `lessons-ss-c.js` (13–18), `lessons-ss-d.js` (19–26), `lessons-ss-e.js` (27–32).
  - Extra quiz questions: `src/data/quiz-extra-ss.js`. Variants: `src/data/variants-ss.js`.
- `src/data/stages.js`: one entry `{ key: 's4', num: 4, icon: '🗄️', title: 'Server side scripting', subtitle: 'GlideRecord, Business Rules, Scheduled Jobs, Email, Import Sets, ACL', kind: 'code', lessons: SS_LESSONS, intro: '…Tenglish…' }`.
  Add it together with lesson 1 so the Hub never shows an empty stage.
- Glossary: `src/data/glossary-ss.js` (entries tagged `s: 4`), merged into `GLOSSARY_JS`.
- Checks (the checks only see the lists they import):
  - `check-cs.mjs`: loop over `[...CS_LESSONS, ...SS_LESSONS]`, because it already handles `server: true` and `mode: 'pdi'`. Also check `variants-ss.js` ids.
  - `check-quiz.mjs`: add `{ name: 'Stage 4', lessons: SS_LESSONS, min: 15, max: Infinity }`.
  - `check-glossary.mjs`, `check-pdi-checks.mjs`: add `SS_LESSONS`.
  - `check-page-terms.mjs`: add `SS_LESSONS`. Also check that Stage 2/3 pages never list Stage 4-only entries (the same rule exists for Stage 3).
  - `check-mock.mjs`: the M0–M12 cases.
- Update the Stage plan table and the Stage 4 status line in `CLAUDE.md`.

---

## Step 4 — Lessons (one per lecture, course order, one per request)

**Code** lessons use the server runner with a 7-exercise ladder (easy → medium → 3× medium+ → hard). **PDI** lessons are `mode: 'pdi'`
cards (scenario / hint / steps / answer / cleanup, in dependency order, the last card of a chain does the final cleanup).
Every lesson gets ≥ 3 learn cards and ≥ 15 quiz questions. The "Mock" column names the Step 2 items a lesson needs; "—" means the existing mock is enough.

| # | Lecture | id | Mode | Mock | Focus / notes |
|---|---|---|---|---|---|
| 1 | What are CRUD Operations & GlideRecord Create & Read Operations | `ss-crud1` | code | — | **Short:** CRUD was done in Stage 2 and Stage 3 L9. New angles only: CRUD map to insert/query/update/delete, `get()` forms (sys_id / field+value / number, fact 27), `hasNext()` vs `next()`, `getEncodedQuery()`, "Copy query" from a list into `addEncodedQuery`, `setLimit` + `orderByDesc` for "latest". |
| 2 | GlideRecord Read, Update, Delete operations & GlideRecordSecure | `ss-crud2` | code | M3 | Update/delete recap (short) + **GlideRecordSecure**: same code, ACL-filtered results; `canRead/canWrite`; when to use it (Script Includes called from the client, portals). Variants run as admin and as a non-admin. |
| 3 | GlideAggregate API | `ss-aggregate` | code | — (maybe a small M-add after 1b) | COUNT/SUM/AVG/MIN/MAX, groupBy (incl. reference field), `getAggregate` is a string, the multiple-groupBy pattern; GlideAggregate vs `getRowCount()`. |
| 4 | GlideSystem | `ss-gs` | code | M0, M2, M3 | gs groups: logging (recap), user (`getUser()`, `isMemberOf`, `hasRole` with a non-admin variant), messages, properties, dates (`daysAgo` …), `eventQueue` (a preview of lesson 14), `nil`, `tableExists`, `generateGUID`. |
| 5 | GlideDateTime | `ss-gdt` | code | M1 | UTC value vs display value, construct / parse, add days/seconds, compare (`compareTo`, `before/after`), day of week, `getDate`. A fixed clock in the runner so tests are stable. |
| 6 | GlideDateTime Continuation, GlideSchedule, GlideDuration | `ss-gdt2` | code | M1 | `subtract` → GlideDuration, durations display/numeric, the "8-5 weekdays" schedule: `isInSchedule`, `duration`, `add` (the business-hours due date). |
| 7 | Business Rules Introduction & Before Business Rules | `ss-br1` | code | M4 | The BR form (when/order/actions/condition), `current`/`previous`, `changes()`/`changesTo()`. Before BR: set fields without `update()`, validation + `setAbortAction` + `gs.addErrorMessage`. |
| 8 | After & Async Business Rules Continuation | `ss-br2` | code | M4, M5 | After BR = other records (e.g. a child incident via `parent_incident`, work note on the parent), why `current.update()` is wrong, async = slow work, `previous` null. |
| 9 | Display & Before Query Business Rules Continuation | `ss-br3` | code | M4, M3 | Display BR → `g_scratchpad` (links back to Stage 3 `cs-gluser`). Before query BR → restrict rows per user (variants per user). |
| 10 | Scheduled Jobs | `ss-sched1` | **pdi** | — | Create a Scheduled Script Execution in her PDI (gs.info only), Run as, Execute Now, find the log, then delete the job. *(Guess: the lecture may be code-heavy. See Q1.)* |
| 11 | Scheduled Jobs Continuation | `ss-sched2` | code | M1, M2, M5, M6 | Job scripts with date queries (`javascript:gs.daysAgoStart(n)`, `sys_updated_on`), the conditional job (`answer`), run frequency choices (learn card). |
| 12 | Scheduled Jobs Use Cases | `ss-sched3` | code | M0, M2, M5, M6 | Auto-close Resolved incidents after N days (seeded data), reminder events for stale incidents, a weekly count summary with GlideAggregate. |
| 13 | Email Notifications | `ss-email` | pdi | — | A notification on incident insert/update for a "pdi check" incident; who-receives / what-it-contains; check Outbox (sys_email). Cleanup: deactivate/delete. Depends on 1g (is outbound mail on?). |
| 14 | Email Notifications using events | `ss-email-events` | pdi | — | Event Registry record → a BR with `gs.eventQueue('x', current, parm1, parm2)` → a notification "Event is fired" with recipients from parm1 → check Outbox. Full chain cleanup. (The eventQueue code itself is practised in lessons 4, 12 and 18.) |
| 15 | Email Scripts | `ss-mailscript` | code | M0, M7 | `template.print` an HTML table of the incident, a dynamic subject, `email.addAddress('cc', …)`, an event parm to text; `${mail_script:name}` usage (learn card). |
| 16 | Email Properties | `ss-emailprops` | pdi | — | **Read-only** tour of the Email Properties page (sending/receiving enabled, test address, "send all email to"). No changes to her PDI, or only with a revert step. |
| 17 | Inbound Email Actions | `ss-inbound` | code | M7 | New-type action: build an incident from the subject/body and `email.body.priority:`-style variables, then `current.insert()`. Reply-type: a work note on the matched record, then `update()`. Sending a real email to the PDI is a 📄 / ⚠️ learn card. |
| 18 | Script Actions | `ss-scriptaction` | code | M0, M2, M8 | An event → a script action using `event.parm1/2` and `current`. Pairs with a BR that queues the event (variants check the parms). |
| 19 | Data Visualizations and Dashboards | `ss-dashboards` | pdi | — | Build a report (bar by category, list of open P1) and a dashboard in her PDI; share/visibility; cleanup = delete. Depends on 1h (Brazil dashboard UI). |
| 20 | Database Views | `ss-dbviews` | pdi | — | Create a view joining incident + sys_user (caller), with prefixes and a where clause; report on it; delete. |
| 21 | Metric Definitions | `ss-metrics` | pdi | — | Read the OOB incident metrics + metric_instance list; create a Field value duration metric on a "pdi check" field change; delete. The script-calculation metric is a learn card only (📄 / ⚠️). |
| 22 | Import Sets | `ss-import1` | pdi | — | Load Data from a small CSV (the lesson provides its text) into a new import set table; look at the import set rows. |
| 23 | Import Sets part 2 | `ss-import2` | pdi | — | Transform map, field maps, coalesce, run the transform, read the transform history / row states. Chain continues from 22; the last card cleans up both. |
| 24 | Import Sets Continuation & Transform Scripts | `ss-transform` | code | M9 | onBefore validation (`ignore`), a field-map script (`answer`), onAfter work notes, onStart/onComplete logs; coalesce insert vs update shown in `__x.importRows`. |
| 25 | Transform Script Objects and Variables | `ss-transform2` | code | M9 | Each variable on its own (`source`, `target`, `map`, `log`, `action`, `ignore`, `error`, `error_message`), choosing per `action`, and the "don't call `target.update()` in onBefore" pitfall. |
| 26 | Data Sources | `ss-datasource` | pdi | — | Data Source record (File type, CSV attachment), "Load All Records", link to the transform map from 23; full cleanup of the 22–26 chain here. |
| 27 | SLA Definitions & Scripting material | `ss-sla` | pdi | — | SLA definition on a "pdi check" priority, schedule "8-5 weekdays", start/stop conditions; watch task_sla on the record; read-only Background Script reading `task_sla` (percentage, has_breached). Cleanup. |
| 28 | Access Control List (ACL), Requirements & Material | `ss-acl` | code | M3, M10 | Learn cards: ACL types, operations, table.none / table.* / table.field order, roles + condition + script all must pass, Allow If / Deny Unless (per 1j). Exercises: ACL scripts (`answer = …`) tested as several users. Creating ACLs in her PDI needs security_admin, so that is a learn card or one optional card. *(See Q1.)* |
| 29 | Script Includes & Advanced Reference Qualifiers | `ss-si` | code | M5, M11 | Classic `Class.create` utility SI (non-AJAX; AJAX was Stage 3), calling it from a BR, then the advanced ref qual `javascript:new IncidentUtils().assignedToQual(current)` → `sys_idIN…` from `sys_user_grmember`. |
| 30 | Fix Scripts, Background Scripts & Relationships (Related Lists) | `ss-fixscripts` | pdi | — | A Fix Script vs a Background Script (rollback, when each is used); a Relationship record ("Other incidents of this caller", `refineQuery(current, parent)`) added to the incident form; cleanup. *(The Relationship script could instead be a code lesson using the M4 query harness. See Q1.)* |
| 31 | About Related Lists | `ss-relatedlists` | pdi | — | Configure → Related Lists, the default vs defined (Relationship) lists, list control (New/Edit buttons), filter/omit count; revert layout. |
| 32 | Server Side Scripting Best Practices | `ss-best` | code | M0, M4, M12 | Fix-the-bad-script ladder: `getValue` vs element, GlideAggregate for counts, `setLimit(1)` for exists, no `current.update()` in BR, no query in a loop, check the count before delete (fact 6), log hygiene. |

Totals: **19 code** lessons (1–9, 11, 12, 15, 17, 18, 24, 25, 28, 29, 32) and **13 PDI** lessons (10, 13, 14, 16, 19–23, 26, 27, 30, 31).

Suggested model per request (from CLAUDE.md): Step 2 items → Opus 5.5 high; a code lesson whose mock exists → Sonnet 5.5 medium;
PDI lessons → Sonnet 5.5 medium once their facts are verified.

---

## Open questions (need the user's answer before Step 2 / Step 4)

1. **Mode guesses.** Without durations or lecture contents, I guessed pdi vs code for lectures 10, 14, 27, 28 and 30.
   Is each of those lecture videos mainly "click in the instance" or mainly "write a script"?
2. **Lectures 1–2 overlap.** Should they still get the full 7-exercise ladder (the CLAUDE.md rule), or a shorter set (4, the check
   minimum) since CRUD was covered twice already?
3. **Step 1 runs.** Who runs the R checks (the user or the friend)? Are the T checks (temporary BR / Scheduled Job / import table /
   impersonation) allowed, with cleanup?
4. **Email preview box (M7).** Is a small UI addition under the runner OK, or should mail output stay test-only?
