// Extra quiz questions for Stage 4 (server-side scripting), merged after each lesson's own 5 questions in lessons-ss.js → 15 per lesson.
// Same q(...) format. The right answer is listed FIRST; Quiz.jsx shuffles options at render time. Keep options similar in length
// (check-quiz: the right one may be the longest in at most 40% of a stage's questions). One line per question.
// Facts follow her Brazil PDI (docs/pdi-facts-brazil.md); unverified ones carry ⚠️ in the `why` (+ a 5th checks argument).
import { q } from './lessonKit.js'

export const QUIZ_EXTRA_SS = {
  /* 1 — CRUD & read */
  'ss-crud1': [
    q(`gr.initialize() tarvata gr.getValue('number')?`, [`null`, `Kotha INC number`, `'' (empty string)`, `undefined`], 0, `initialize() lo anni fields null — number insert() appudu vastundi (nee PDI lo tested). newRecord() ayithe number ventane.`),
    q(`gr.insert() return value tho em cheyyochu?`, [`get(id) tho malli load`, `Record ni delete cheyyochu`, `Update set ki add`, `Em ledu, true matrame`], 0, `insert() kotha sys_id istundi — var id = gr.insert(); tarvata get(id).`),
    q(`addQuery('short_description', 'STARTSWITH', 'VPN') — edi match?`, [`"VPN keeps disconnecting"`, `"My VPN is slow since Monday"`, `"Reset password please"`, `"Network down in Pune"`], 0, `STARTSWITH = text modatlo undali. "My VPN" lo VPN madhyalo — adi CONTAINS ki match.`),
    q(`Empty assigned_to unna records ki?`, [`addNullQuery('assigned_to')`, `addQuery('assigned_to', null)`, `addEmptyQuery('assigned_to')`, `addQuery('assigned_to', 'NONE')`], 0, `addNullQuery(field) = field khali. Opposite addNotNullQuery(field).`),
    q(`Encoded query lo ^NQ ante?`, [`Kotha query, OR tho kalustundi`, `NOT — tarvati condition reverse`, `Null query (field empty unnavi)`, `Next record ki vellu (loop)`], 0, `^NQ tarvata unnadi separate query; rendu results OR (nee PDI lo tested).`),
    q(`Encoded query lo order by number descending?`, [`^ORDERBYDESCnumber`, `^ORDERBYnumber^DESC`, `^SORTDESCENDINGnumber`, `^ORDERnumber DESC`], 0, `ORDERBY / ORDERBYDESC + field peru, space lekunda.`),
    q(`gr.caller_id.email — idi em?`, [`Dot-walk: caller user email`, `caller_id sys_id string`, `Error — email incident lo ledu`, `Caller table peru`], 0, `Reference tarvata "." tho referenced record (sys_user) field chadavochu.`),
    q(`gr.getValue('caller_id') em istundi?`, [`Caller sys_id`, `Caller full name`, `Caller email`, `User object`], 0, `Reference field VALUE = sys_id. Peru kavali ante getDisplayValue('caller_id') leda caller_id.name.`),
    q(`addEncodedQuery lo field peru typo ayithe?`, [`Condition ignore, ekkuva rows`, `Script error ventane aagutundi`, `Zero rows vastayi, log ledu`, `Typo auto correct avtundi`], 0, `Nee PDI lo tested: invalid field condition ignore — query anni rows istundi. Count chudu.`),
    q(`Choice field query lo label ("1 - Critical") ichhav. Result?`, [`Match avvadu — value ("1") kavali`, `Label tho kuda match avtundi`, `Error vastundi, script aagutundi`, `Anni rows vastayi (ignore)`], 0, `Database lo VALUE store — query value tho. Label display ki matrame.`),
  ],

  /* 2 — update, delete, GlideRecordSecure */
  'ss-crud2': [
    q(`gr.update() em return chestundi?`, [`Save ayina record sys_id`, `Updated rows count (number)`, `true / false matrame`, `Record number (INC…)`], 0, `update() sys_id istundi. Save avvakapothe null (e.g. setAbortAction).`),
    q(`Update loop mundu manchi habit?`, [`getRowCount() tho count chudu`, `setLimit(0) pettu safety kosam`, `Anni fields print chey mundu`, `Session logout chesi login`], 0, `Expect chesina count kakapothe (typo, wrong filter) aagu.`),
    q(`deleteRecord() vs deleteMultiple()?`, [`Okati vs match ayye anni`, `Rendu same`, `deleteMultiple undo cheyyochu`, `deleteRecord matrame ACL chustundi`], 0, `deleteRecord() load ayina okka record; deleteMultiple() query ki match ayye anni (loop ledu).`),
    q(`GlideRecordSecure ekkada MUKHYAM?`, [`GlideAjax Script Include lo`, `Raatri run ayye Scheduled Job lo`, `One-time Fix Script lo`, `Admin Background Script lo`], 0, `Browser nunchi call ayye code user ACLs respect cheyyali. Jobs / fix scripts system pani — GlideRecord saripotundi.`),
    q(`GlideRecord tho canRead() false unna row ni chadivithe?`, [`Chadavochu — GlideRecord ACL chudadu`, `Error throw avtundi, script aagutundi`, `Empty row vastundi (fields null)`, `Automatic ga skip avtundi`], 0, `GlideRecord ACLs enforce cheyyadu. canRead() just answer istundi; GRS automatic skip.`),
    q(`GRS update — ACL deny chesindi. Script lo em kanipistundi?`, [`Silent ga save avvadu`, `Form paina red error popup`, `Script ventane aagipotundi`, `Update set lo entry vastundi`], 0, `GRS silent ga skip chestundi — fresh GlideRecord tho verify chey. 📄 docs nunchi — exact return value / log PDI lo easy ga test cheyyalem.`),
    q(`gr.canCreate() eppudu useful?`, [`insert() mundu permission check`, `Record exist avtunda ani check`, `Kotha table create cheyyadaniki`, `Number generate cheyyadaniki`], 0, `Ee user ki ee table lo create permission unda — insert mundu adugu.`),
    q(`Admin ga PDI lo canWrite() — result?`, [`Daadapu ellappudu true`, `Ellappudu false (admin ki ACL ledu)`, `Record batti random`, `Error — admin ki pani cheyyadu`], 0, `Admin ki anni roles / ACLs pass. Non-admin tho test chesthe nijamaina answer.`),
    q(`GRS tho "user ki enni rows kanipistayi" safe ga count?`, [`Loop lo next() tho count`, `Background lo admin ga run`, `setWorkflow(false) tho`, `deleteMultiple() tho`], 0, `User nijamga chusina rows loop lo count — ACL filter tarvata unnave.`),
    q(`setWorkflow(false) update lo em chestundi?`, [`Business Rules run avvavu`, `ACLs skip avtayi`, `Record lock avtundi`, `Update set capture aagutundi`], 0, `Business Rules / notifications skip — data fix lo matrame, jagratta.`),
  ],

  /* 3 — GlideAggregate */
  'ss-glagg': [
    q(`groupBy lekunda COUNT — enni result rows?`, [`Okkati`, `Prathi record ki okati`, `Zero`, `Table columns anni`], 0, `Group lekapothe motham table ki okate result — if (ga.next()).`),
    q(`groupBy reference field — getValue em istundi?`, [`sys_id`, `Display name`, `Count`, `Table peru`], 0, `Reference value = sys_id. Peru kavali ante aa sys_id tho GlideRecord get, leda display value.`),
    q(`True/false field groupBy — getValue result?`, [`'true' / 'false'`, `'1' / '0'`, `true / false boolean`, `'yes' / 'no'`], 0, `Nee PDI lo tested: GlideAggregate getValue 'true' / 'false' — GlideRecord.getValue laaga '1' / '0' kaadu.`),
    q(`AVG ki field type?`, [`Number field`, `Reference field`, `Journal field`, `Any text field`], 0, `SUM / AVG / MIN / MAX number fields meeda (reassignment_count laantivi).`),
    q(`addQuery vs addHaving?`, [`Records vs group results`, `Rendu same pani chestayi`, `addHaving client side lo run`, `addQuery count ki matrame`], 0, `addQuery group mundu records filter; addHaving group RESULT (count) filter. ⚠️ addHaving PDI lo confirm chesuko.`, ['ga-having']),
    q(`GlideAggregate lo filters ki em vaadochu?`, [`addQuery / addEncodedQuery`, `g_form.setValue (client)`, `gs.setFilter(table, query)`, `setFilterQuery() matrame`], 0, `GlideRecord methods laage — addQuery, addActiveQuery, addEncodedQuery.`),
    q(`getRowCount() kante GlideAggregate enduku fast?`, [`Records load avvavu`, `Cache vaadutundi`, `Client lo run avtundi`, `Index create chestundi`], 0, `Database COUNT chesi number matrame istundi — rows memory ki raavu.`),
    q(`Number(ga.getAggregate('COUNT')) enduku?`, [`String ni number ga marchadaniki`, `Count ni round cheyyadaniki`, `Null error raakunda aapadaniki`, `Groups ni sort cheyyadaniki`], 0, `getAggregate string — math (+) ki Number() lekapothe join avtundi.`),
    q(`Duplicate short descriptions vethakadaniki?`, [`groupBy + COUNT + addHaving > 1`, `orderBy short_description matrame`, `setLimit(1) tho first record`, `deleteMultiple() tho clean`], 0, `Same value unna groups lo count > 1 = duplicates. ⚠️ addHaving PDI lo confirm chesuko.`, ['ga-having']),
    q(`while (ga.next()) — groupBy('category') tho enni sarlu?`, [`Prathi category ki okasari`, `Prathi record ki okasari`, `Okkasari matrame (total)`, `Count value enni unte anni sarlu`], 0, `Prathi group (distinct value) ki oka result row.`),
  ],

  /* 4 — GlideSystem */
  'ss-gs': [
    q(`gs.getUserName() em istundi?`, [`Login name (abel.tuter)`, `Full name (Abel Tuter)`, `User sys_id (32 characters)`, `Email (abel@example.com)`], 0, `getUserName = login; getUserDisplayName = full name; getUserID = sys_id.`),
    q(`Scheduled Job lo gs.addInfoMessage()?`, [`Evaru chudaru — log vaadu`, `Admin inbox ki notification`, `Anni users forms paina`, `Job owner ki email vastundi`], 0, `Info messages interactive session lo form paina matrame. Job lo user ledu.`),
    q(`gs.getProperty value type?`, [`String`, `Number`, `Boolean`, `Object`], 0, `Property values strings — '5' ni Number('5') chey, 'true' ni == 'true' tho compare.`),
    q(`gs.nil(value) eppudu true?`, [`null / undefined / empty`, `Value 0 ayithe matrame`, `Value false ayithe matrame`, `Ellappudu false istundi`], 0, `nil = khali (null, undefined, ''). Element meeda .nil() kuda undi.`),
    q(`gs.log() scoped app lo?`, [`Ledu — gs.info vaadu`, `Pani chestundi`, `Error log ki velutundi`, `Email pamputundi`], 0, `gs.log / gs.print global scope lo matrame (nee PDI lo global lo tested). Kotha code ki gs.info.`),
    q(`Encoded query lo "last 7 days" ela?`, [`opened_at>=javascript:gs.daysAgoStart(7)`, `opened_at>=javascript:gs.lastDays(7)`, `opened_at>=javascript:last7days()`, `opened_at>=gs.daysAgoStart(7)`], 0, `List filter kuda ide javascript:gs.… pattern vaadutundi. ⚠️ time zone PDI lo confirm chesuko.`, ['gs-dates-tz']),
    q(`gs.eventQueue lo 3rd, 4th arguments?`, [`parm1, parm2 (strings)`, `Table peru, field peru`, `User sys_id, role peru`, `Date, time (GlideDateTime)`], 0, `Notification / Script Action lo event.parm1, event.parm2 ga chadavochu.`),
    q(`Event pani cheyyadaniki mundu?`, [`Event Registry lo register`, `Update set Complete cheyyali`, `Server cache flush cheyyali`, `Instance restart cheyyali`], 0, `Kotha event name Event Registry (sysevent_register) lo undali — lectures 14 / 18 lo chestam.`),
    q(`gs.getUser().isMemberOf('Network') — em check?`, [`User aa group member aa`, `Group ki aa role unda`, `Group active ga unda`, `User aa group manager aa`], 0, `Current user given group lo member unte true.`),
    q(`Business Rule lo gs.getUserID() evaridi?`, [`Record save chesina user`, `Ellappudu admin user`, `Record lo unna Caller`, `Assigned to lo unna user`], 0, `BR save chesina session user ga run avtundi. Scheduled job lo ayithe system.`),
  ],

  /* 5 — GlideDateTime */
  'ss-gdt': [
    q(`new GlideDateTime() value?`, [`Ippati date-time`, `1970-01-01 00:00:00`, `Empty / null`, `Today 00:00:00`], 0, `Argument lekapothe ippati time (UTC value).`),
    q(`new GlideDateTime('2026-11-04 00:00:00') — aa text?`, [`UTC ga chaduvutundi`, `User time zone ga`, `IST ga matrame`, `Server time zone ga`], 0, `Constructor / setValue UTC. User time zone text ki setDisplayValue().`),
    q(`gdt.getDisplayValue() — nee PDI lo deni batti?`, [`Nee user time zone + format`, `Ellappudu UTC, format marchadu`, `Browser language setting`, `Instance build version`], 0, `Display user preferences batti. ⚠️ Nee PDI lo rendu print chesi confirm chesuko.`, ['gdt-display-tz']),
    q(`a.compareTo(b) — a b kante tarvata ayithe?`, [`1`, `-1`, `0`, `true`], 0, `compareTo: 1 (tarvata), 0 (same), -1 (mundu).`),
    q(`getNumericValue() em istundi?`, [`Milliseconds (1970 nunchi)`, `Seconds (ee roju 00:00 nunchi)`, `Day number (1–365)`, `Year + month number`], 0, `Epoch milliseconds — rendu dates teda ki.`),
    q(`Original date marakunda +3 days kavali?`, [`new GlideDateTime(orig) copy, tarvata add`, `orig.addDaysUTC(3) — original same untundi`, `orig.clone().addDays(3) chain`, `orig + 3 (number add)`], 0, `addX object ne marchestundi — mundu copy chey.`),
    q(`getMonthUTC() November ki?`, [`11`, `10`, `'Nov'`, `0`], 0, `1–12 (JavaScript getMonth laaga 0 nunchi kaadu).`),
    q(`Query lo GlideDateTime compare ela?`, [`addQuery('opened_at', '<', gdt.getValue())`, `addQuery('opened_at', 'BEFORE', gdt)`, `addQuery(gdt.before('opened_at'))`, `addDateQuery('opened_at', '<', gdt)`], 0, `Value string (UTC) ivvu operator tho.`),
    q(`addDaysLocalTime vs addDaysUTC teda eppudu?`, [`Daylight saving change roju`, `Ellappudu same result`, `Weekends lo matrame teda`, `Leap year lo matrame teda`], 0, `Local time user zone calendar day add chestundi — DST unna zones lo 23 / 25 h roju teda.`),
    q(`gdt.isValid() eppudu false?`, [`Invalid date text ichhinappudu`, `Past date (ninna) ayithe`, `Weekend date ayithe`, `UTC lo unna value ayithe`], 0, `"not a date" laanti text tho create chesthe isValid() false.`),
  ],

  /* 6 — GlideDuration & GlideSchedule */
  'ss-gdt2': [
    q(`GlideDuration getNumericValue() 3600000 ante?`, [`1 hour`, `1 minute`, `1 day`, `1 second`], 0, `ms: 60000 = 1 min, 3600000 = 1 h, 86400000 = 1 day.`),
    q(`dur.getRoundedDayPart() — 2 days 13 hours ki?`, [`3`, `2`, `2.5`, `13`], 0, `Round: 2.54 days → 3. getDayPart → 2.`),
    q(`GlideDuration ni date ki add (safe way)?`, [`gdt.add(dur.getNumericValue())`, `gdt.addDuration(dur.getValue())`, `dur.addTo(gdt.getValue())`, `gdt = gdt + dur (join)`], 0, `GlideDateTime.add() ki milliseconds ivvu.`),
    q(`Schedule records ye table lo?`, [`cmn_schedule`, `sys_schedule_job`, `sysevent`, `sys_properties`], 0, `cmn_schedule. (sys_trigger / sysauto scheduled jobs — vere vishayam, lectures 10–12.) ⚠️ PDI lo list open chesi confirm chesuko.`, ['schedule-8to5']),
    q(`sched.duration(start, end) em lekka pedutundi?`, [`Schedule lopala time matrame`, `Calendar time motham (24 x 7)`, `Weekends lo time matrame`, `Holidays lo time matrame`], 0, `Working hours lo padina time — raatri / weekend skip.`),
    q(`Friday 16:00 + 2 working hours (8-5 weekdays)?`, [`Monday 09:00`, `Friday 18:00`, `Saturday 09:00`, `Monday 18:00`], 0, `Friday 1 h (16–17), migilina 1 h Monday 08–09.`),
    q(`Real PDI lo schedule sys_id ela?`, [`Schedule list lo right-click → Copy sys_id`, `Schedule peru ("8-5 weekdays") ivvu`, `gs.getSchedule("8-5") nunchi`, `Default schedule ki argument vaddu`], 0, `new GlideSchedule(sys_id) — sys_id instance batti marutundi, list nunchi copy. ⚠️ PDI lo chusuko.`, ['schedule-8to5']),
    q(`Business duration field deni tho lekka?`, [`Schedule (working hours)`, `Calendar time (24 x 7)`, `Server CPU time (script)`, `User login session time`], 0, `Business = schedule batti; calendar = motham time.`),
    q(`GlideDateTime.subtract ki arguments order?`, [`(start, end)`, `(end, start)`, `(duration, start)`, `(end only)`], 0, `subtract(start, end) = end − start. Order tirigithe negative duration.`),
    q(`Schedule time zone enduku mukhyam?`, [`8-5 ae zone lo ani cheptundi`, `Calendar display colour kosam`, `Email notifications pampadaniki`, `Ledu, server UTC ye vaadutundi`], 0, `Real schedule ki time zone field undi — "8-5" ae city time lo ani. Ee sandbox UTC. ⚠️ PDI lo schedule record lo chudu.`, ['schedule-8to5']),
  ],
}
