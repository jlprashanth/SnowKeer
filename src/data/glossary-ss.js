// Stage 4 glossary — server-side words from the Server Side ServiceNow Scripting lessons (lessons-ss.js, lessons-ss-b.js).
// Same format as glossary-js.js / glossary-cs.js (g = group, m = meaning in Tenglish, ex = ServiceNow example, check: true = ⚠️ confirm
// in your PDI, check: 'docs' = 📄 from the docs, checks: ['key'] = how-to-check steps in pdi-checks.js). Every entry is marked s: 4 so
// Stage 2 / Stage 3 pages leave them out. GlideDateTime / GlideDuration / GlideSchedule methods are keyed by class
// ('GlideDateTime.getValue()') — glossary-scan.js types a variable by how it is made (or by the gdt / dur / sched naming), so
// gdt.getValue() never shows the GlideRecord getValue entry.

export const GLOSSARY_GROUPS_SS = {
  sec: 'GlideRecordSecure & permission checks',
  dt: 'Dates & durations (GlideDateTime, GlideDuration, GlideSchedule)',
  gs4: 'More gs methods (Stage 4)',
}

const s4 = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { ...v, s: 4 }]))

export const GLOSSARY_SS = s4({
  // ---------- GlideRecordSecure & permission checks ----------
  GlideRecordSecure: { g: 'sec', m: 'GlideRecord laage, kani ippudu run chestunna USER ACLs check chestundi: chadavaleni rows query lo raavu, permission leni insert / update / delete jaragavu (silent ga). GlideAjax Script Include, Service Portal widget laanti user-facing code lo vaadu. 📄 docs nunchi — admin ki anni ACLs pass, PDI lo easy ga test cheyyalem.', ex: "var grs = new GlideRecordSecure('incident');\ngrs.query();   // user chadavagaligevi matrame", check: 'docs' },
  canRead: { g: 'sec', m: 'Ippati user ki ee record CHADAVE permission unda — true / false. GlideRecord ACL enforce cheyyadu; canRead() just adigi cheptundi.', ex: 'if (gr.canRead()) { gs.info(gr.getValue("number")); }' },
  canWrite: { g: 'sec', m: 'Ee record ni MARCHE (update) permission unda — true / false. update() mundu adugu.', ex: "if (gr.canWrite()) { gr.setValue('state', 2); gr.update(); }" },
  canCreate: { g: 'sec', m: 'Ee table lo kotha record CREATE permission unda — insert() mundu.', ex: 'if (gr.canCreate()) { gr.insert(); }' },
  canDelete: { g: 'sec', m: 'Ee record ni DELETE permission unda — deleteRecord() mundu. Admin ki daadapu ellappudu true.', ex: 'if (gr.canDelete()) { gr.deleteRecord(); }' },

  // ---------- GlideAggregate extra ----------
  addHaving: { g: 'grm', m: 'GlideAggregate group RESULT meeda filter (SQL HAVING): addHaving("COUNT", ">", "1") = 2+ records unna groups matrame. addQuery records ni filter chestundi, addHaving groups ni.', ex: "ga.groupBy('category');\nga.addHaving('COUNT', '>', '1');", check: true, checks: ['ga-having'] },

  // ---------- GlideDateTime ----------
  GlideDateTime: { g: 'dt', m: 'Date + time object. new GlideDateTime() = ippudu; new GlideDateTime("2026-11-04 08:00:00") leda field value tho. Database lo UTC — getValue() UTC, getDisplayValue() user time zone lo.', ex: "var gdt = new GlideDateTime(gr.getValue('opened_at'));" },
  'GlideDateTime.getValue()': { g: 'dt', m: 'UTC value "yyyy-MM-dd HH:mm:ss". Compare / query / save ki idi vaadu — anni users ki same.', ex: "gdt.getValue();   // '2026-11-12 10:00:00'" },
  'GlideDateTime.getDisplayValue()': { g: 'dt', m: 'User time zone + date format lo text (form lo kanipinchedi). Ee sandbox user IST. Manushulaki chupinchadaniki matrame — logic ki kaadu. ⚠️ Nee PDI lo nee user Time zone / format batti — confirm chesuko.', ex: "gdt.getDisplayValue();   // '2026-11-12 15:30:00' (IST)", check: true, checks: ['gdt-display-tz'] },
  'GlideDateTime.setDisplayValue()': { g: 'dt', m: 'User time zone lo unna text tho value set chestundi (lopala UTC ki marchi save). setValue() ayithe text ni UTC ga teesukuntundi.', ex: "gdt.setDisplayValue('2026-11-12 09:00:00');" },
  'GlideDateTime.addDaysUTC()': { g: 'dt', m: 'n days add (negative = venakki). Object NE marchestundi — kotha object return cheyyadu. Original kavali ante mundu copy.', ex: 'gdt.addDaysUTC(-7);   // 7 rojula mundu' },
  'GlideDateTime.addSeconds()': { g: 'dt', m: 'n seconds add (3600 = 1 hour). Object ne marchestundi.', ex: 'gdt.addSeconds(3600);' },
  'GlideDateTime.addMonthsUTC()': { g: 'dt', m: 'n months add (calendar month). addWeeksUTC, addYearsUTC kuda unnayi.', ex: 'gdt.addMonthsUTC(3);' },
  'GlideDateTime.add()': { g: 'dt', m: 'Milliseconds add chestundi — duration add cheyyadaniki dur.getNumericValue() ivvu.', ex: 'gdt.add(dur.getNumericValue());' },
  'GlideDateTime.before()': { g: 'dt', m: 'Ee date inko date kante MUNDU aa — true / false. Opposite after(); onOrBefore / onOrAfter kuda unnayi.', ex: 'if (due.before(new GlideDateTime())) { gs.info("Overdue"); }' },
  'GlideDateTime.after()': { g: 'dt', m: 'Ee date inko date kante TARVATA aa — true / false.', ex: 'opened.after(cutoff);' },
  'GlideDateTime.compareTo()': { g: 'dt', m: '1 (tarvata), 0 (same), -1 (mundu). Sort / three-way decision ki.', ex: 'a.compareTo(b);   // -1 / 0 / 1' },
  'GlideDateTime.getNumericValue()': { g: 'dt', m: 'Milliseconds (1970-01-01 UTC nunchi). Rendu dates teda: b.getNumericValue() - a.getNumericValue(); / 3600000 = hours.', ex: 'var ms = now.getNumericValue() - opened.getNumericValue();' },
  'GlideDateTime.getDayOfWeekUTC()': { g: 'dt', m: 'Week lo roju: 1 = Monday … 7 = Sunday (JavaScript laaga 0 kaadu). Local version getDayOfWeekLocalTime().', ex: 'if (gdt.getDayOfWeekUTC() >= 6) { gs.info("Weekend"); }' },
  'GlideDateTime.getMonthUTC()': { g: 'dt', m: 'Month 1–12 (0 nunchi kaadu). getYearUTC(), getDayOfMonthUTC() kuda unnayi.', ex: 'gdt.getMonthUTC();   // 11' },
  'GlideDateTime.subtract()': { g: 'dt', m: 'Static: GlideDateTime.subtract(start, end) = end − start, GlideDuration istundi. (gdt.subtract(ms) ayithe aa object nunchi ms teesestundi.)', ex: 'var dur = GlideDateTime.subtract(opened, resolved);' },
  getGlideObject: { g: 'gem', m: 'Date-time FIELD (element) nunchi GlideDateTime object: gr.opened_at.getGlideObject(). new GlideDateTime(gr.getValue("opened_at")) same pani.', ex: 'var opened = gr.opened_at.getGlideObject();' },

  // ---------- GlideDuration ----------
  GlideDuration: { g: 'dt', m: 'Time length (date kaadu): new GlideDuration(ms) leda new GlideDuration("1 02:30:00") (d HH:mm:ss). GlideDateTime.subtract / schedule.duration idi istayi. Duration fields (business_duration) ee type.', ex: "var dur = new GlideDuration('0 04:00:00');   // 4 hours" },
  'GlideDuration.getNumericValue()': { g: 'dt', m: 'Duration milliseconds lo. / 60000 = minutes, / 3600000 = hours. Math / compare ki idi vaadu.', ex: 'dur.getNumericValue() / 60000;   // minutes' },
  'GlideDuration.getDayPart()': { g: 'dt', m: 'Full days matrame (floor): 8 days 22 h → 8. getRoundedDayPart() round chestundi (→ 9).', ex: 'dur.getDayPart();' },
  'GlideDuration.getRoundedDayPart()': { g: 'dt', m: 'Days round chesi: 2 days 13 h → 3.', ex: 'dur.getRoundedDayPart();' },
  'GlideDuration.getDurationValue()': { g: 'dt', m: '"d HH:mm:ss" text (e.g. "2 12:00:00", day lekapothe "01:30:00"). ⚠️ Exact format nee PDI lo confirm chesuko — logic ki getNumericValue() vaadu.', ex: "dur.getDurationValue();   // '01:30:00'", check: true, checks: ['duration-format'] },
  'GlideDuration.getDisplayValue()': { g: 'dt', m: 'Manushulaki text: "2 Days 12 Hours" laaga. ⚠️ Exact text nee PDI lo confirm chesuko.', ex: 'dur.getDisplayValue();', check: true, checks: ['duration-format'] },

  // ---------- GlideSchedule ----------
  GlideSchedule: { g: 'dt', m: 'Working hours schedule (cmn_schedule record, e.g. "8-5 weekdays") tho time lekka: new GlideSchedule(sys_id). Ee sandbox lo "sch_8to5" (Mon–Fri 08–17, UTC). ⚠️ Real schedule ki sontha time zone + holidays — nee PDI lo confirm chesuko.', ex: "var sched = new GlideSchedule('sch_8to5');", check: true, checks: ['schedule-8to5'] },
  'GlideSchedule.isInSchedule()': { g: 'dt', m: 'Aa GlideDateTime schedule (working hours) lopala unda — true / false.', ex: 'sched.isInSchedule(new GlideDateTime());' },
  'GlideSchedule.duration()': { g: 'dt', m: 'start nunchi end varaku WORKING time matrame (raatri, weekend skip) — GlideDuration istundi.', ex: 'var biz = sched.duration(opened, new GlideDateTime());' },
  'GlideSchedule.add()': { g: 'dt', m: 'start + working time duration → aa time ayipoye GlideDateTime (e.g. Friday 16:00 + 2 h → Monday 09:00 on 8-5).', ex: "var due = sched.add(opened, new GlideDuration('0 04:00:00'));" },

  // ---------- more gs ----------
  'gs.getProperty': { g: 'gs4', m: 'System Property (sys_properties) value — ledu ante 2nd argument (default). Value ellappudu STRING. Hardcode badulu property: admin code marchakunda value marchochu.', ex: "var max = Number(gs.getProperty('snowkeer.max_rows', '3'));" },
  'gs.daysAgoStart': { g: 'gs4', m: 'n rojula mundu 00:00:00 date-time string. Query lo "last N days" ki. Siblings: gs.daysAgo(n), gs.daysAgoEnd(n), gs.hoursAgo(n). ⚠️ Time zone (UTC / user) nee PDI lo confirm chesuko.', ex: "gr.addQuery('opened_at', '>=', gs.daysAgoStart(7));", check: true, checks: ['gs-dates-tz'] },
  'gs.beginningOfToday': { g: 'gs4', m: 'Ee roju 00:00:00 (start of today) — "today" filters ki; gs.endOfToday() = 23:59:59. ⚠️ Time zone nee PDI lo confirm chesuko.', ex: "gr.addQuery('opened_at', '>=', gs.beginningOfToday());", check: true, checks: ['gs-dates-tz'] },
  'gs.eventQueue': { g: 'gs4', m: 'Event ni queue lo pedutundi: gs.eventQueue("name", gr, parm1, parm2). Aa event ki register ayina Email Notification / Script Action tarvata run avtayi. Event name mundu Event Registry lo undali.', ex: "gs.eventQueue('incident.p1.unassigned', current, current.getDisplayValue('assignment_group'), gs.getUserName());" },
  'gs.tableExists': { g: 'gs4', m: 'Aa peru tho table undo ledo — true / false.', ex: "gs.tableExists('incident');   // true" },
  'gs.generateGUID': { g: 'gs4', m: 'Kotha unique 32-character id istundi (sys_id laanti).', ex: 'var id = gs.generateGUID();' },
  'getFirstName()': { g: 'gs4', m: 'gs.getUser() object method — current user first name. Siblings: getLastName(), getFullName(), getEmail(), getID(), hasRole(), isMemberOf("group").', ex: 'gs.getUser().getFirstName();   // "Abel"' },
  'getEmail()': { g: 'gs4', m: 'gs.getUser() object method — current user email.', ex: 'gs.getUser().getEmail();' },
})
