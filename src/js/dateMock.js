// Mock GlideDateTime / GlideDate / GlideDuration / GlideSchedule for the Stage 4 date lessons. Pure ES module (worker + node).
// The sandbox clock is fixed: "now" = 2026-11-12 10:00:00 UTC (a Thursday), the same NOW the GlideRecord mock uses, so tests
// are repeatable. Values (getValue) are UTC like the platform stores them. The sandbox user's TIME ZONE is IST (+05:30) —
// getDisplayValue() shows that local time. Her PDI shows HER user's time zone and date format instead (⚠️ content says so).
// Not verified in her PDI (lessons carry ⚠️): GlideDuration display text, getDurationValue for durations over a day,
// GlideSchedule details. The schedule here is a practice one ("8-5 weekdays", UTC, no holidays).

export const NOW_UTC = '2026-11-12 10:00:00'
export const TZ_OFFSET_MIN = 330 // sandbox user time zone: Asia/Kolkata (+05:30), no daylight saving
const DAY = 86400000

const pad = (n, w = 2) => String(n).padStart(w, '0')
// 'yyyy-MM-dd HH:mm:ss' (or 'yyyy-MM-dd') read as UTC → epoch ms; NaN when it does not look like a date
export function parseUtc(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(String(s).trim())
  if (!m) return NaN
  const ms = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0))
  const d = new Date(ms)
  return d.getUTCDate() === +m[3] && d.getUTCMonth() === +m[2] - 1 ? ms : NaN
}
export function fmtUtc(ms) {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}
const nowMs = () => parseUtc(NOW_UTC)
const msOf = (x) => {
  if (x && typeof x.getNumericValue === 'function') return Number(x.getNumericValue())
  return Number(x)
}

/* ---------------------------- GlideDate ---------------------------- */
export class GlideDate {
  constructor(v) { this._d = v === undefined ? fmtUtc(nowMs()).slice(0, 10) : String(v).slice(0, 10) }
  getValue() { return this._d }
  getDisplayValue() { return this._d }
  setValue(v) { this._d = String(v).slice(0, 10) }
  toString() { return this._d }
  getYearNoTZ() { return +this._d.slice(0, 4) }
  getMonthNoTZ() { return +this._d.slice(5, 7) }
  getDayOfMonthNoTZ() { return +this._d.slice(8, 10) }
}

/* ---------------------------- GlideDuration ---------------------------- */
// Stored like a date-time counted from 1970-01-01 (a duration field's value). new GlideDuration(ms) or ('d HH:mm:ss' / 'HH:mm:ss').
export class GlideDuration {
  constructor(v) {
    if (v === undefined || v === null || v === '') this._ms = 0
    else if (typeof v === 'number' || /^\d+$/.test(String(v))) this._ms = Number(v)
    else if (v && typeof v.getNumericValue === 'function') this._ms = Number(v.getNumericValue())
    else {
      const m = /^(?:(\d+)\s+)?(\d+):(\d{2}):(\d{2})$/.exec(String(v).trim())
      this._ms = m ? (+(m[1] || 0) * 86400 + +m[2] * 3600 + +m[3] * 60 + +m[4]) * 1000 : 0
    }
  }
  getNumericValue() { return this._ms }
  getValue() { return fmtUtc(this._ms) }
  // ⚠️ format for a duration over one day not verified in her PDI ('d HH:mm:ss' per docs)
  getDurationValue() {
    const s = Math.floor(this._ms / 1000)
    const d = Math.floor(s / 86400)
    const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
    return d ? `${d} ${hms}` : hms
  }
  // ⚠️ display text not verified in her PDI — e.g. "1 Day 2 Hours 30 Minutes"
  getDisplayValue() {
    const s = Math.floor(this._ms / 1000)
    const parts = [[Math.floor(s / 86400), 'Day'], [Math.floor((s % 86400) / 3600), 'Hour'], [Math.floor((s % 3600) / 60), 'Minute']]
      .filter(([n]) => n > 0)
      .map(([n, w]) => `${n} ${w}${n === 1 ? '' : 's'}`)
    return parts.length ? parts.join(' ') : `${s % 60} Seconds`
  }
  getDayPart() { return Math.floor(this._ms / DAY) }
  getRoundedDayPart() { return Math.round(this._ms / DAY) }
  add(other) { return new GlideDuration(this._ms + msOf(other)) }
  subtract(other) { return new GlideDuration(this._ms - msOf(other)) }
  setValue(v) { this._ms = new GlideDuration(v)._ms }
  toString() { return this.getDurationValue() }
}

/* ---------------------------- GlideDateTime ---------------------------- */
export class GlideDateTime {
  constructor(v) {
    if (v === undefined || v === null) this._ms = nowMs()
    else if (v instanceof GlideDateTime) this._ms = v._ms
    else this._ms = parseUtc(String(v)) // a GlideElement (gr.opened_at) turns into its string value
    this._bad = false
    if (Number.isNaN(this._ms)) { this._bad = true; this._ms = 0 }
  }
  static subtract(start, end) { return new GlideDuration(msOf(end) - msOf(start)) }

  /* reading */
  getValue() { return fmtUtc(this._ms) }
  toString() { return this.getValue() }
  getDisplayValue() { return fmtUtc(this._ms + TZ_OFFSET_MIN * 60000) } // sandbox user = IST
  getDisplayValueInternal() { return this.getDisplayValue() }
  getNumericValue() { return this._ms }
  isValid() { return !this._bad }
  getDate() { return new GlideDate(this.getValue()) }
  getLocalDate() { return new GlideDate(this.getDisplayValue()) }
  getTime() { return new GlideDateTime(`1970-01-01 ${this.getValue().slice(11)}`) }
  _d(local) { return new Date(this._ms + (local ? TZ_OFFSET_MIN * 60000 : 0)) }
  getYearUTC() { return this._d().getUTCFullYear() }
  getMonthUTC() { return this._d().getUTCMonth() + 1 }
  getDayOfMonthUTC() { return this._d().getUTCDate() }
  getDayOfWeekUTC() { return this._d().getUTCDay() || 7 } // 1 = Monday … 7 = Sunday
  getYearLocalTime() { return this._d(true).getUTCFullYear() }
  getMonthLocalTime() { return this._d(true).getUTCMonth() + 1 }
  getDayOfMonthLocalTime() { return this._d(true).getUTCDate() }
  getDayOfWeekLocalTime() { return this._d(true).getUTCDay() || 7 }
  getDaysInMonthUTC() { const d = this._d(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate() }

  /* writing */
  setValue(v) { const ms = v instanceof GlideDateTime ? v._ms : parseUtc(String(v)); this._bad = Number.isNaN(ms); this._ms = this._bad ? 0 : ms }
  setDisplayValue(v) { const ms = parseUtc(String(v)); this._bad = Number.isNaN(ms); this._ms = this._bad ? 0 : ms - TZ_OFFSET_MIN * 60000 }
  addSeconds(n) { this._ms += Number(n) * 1000 }
  add(x) { this._ms += msOf(x) }
  subtract(x) { this._ms -= msOf(x) }
  addDaysUTC(n) { this._ms += Number(n) * DAY }
  addDaysLocalTime(n) { this._ms += Number(n) * DAY } // IST has no daylight saving, so the same as UTC here
  addWeeksUTC(n) { this._ms += Number(n) * 7 * DAY }
  addWeeksLocalTime(n) { this._ms += Number(n) * 7 * DAY }
  addMonthsUTC(n) { const d = this._d(); d.setUTCMonth(d.getUTCMonth() + Number(n)); this._ms = d.getTime() }
  addMonthsLocalTime(n) { this.addMonthsUTC(n) }
  addYearsUTC(n) { const d = this._d(); d.setUTCFullYear(d.getUTCFullYear() + Number(n)); this._ms = d.getTime() }
  addYearsLocalTime(n) { this.addYearsUTC(n) }

  /* comparing */
  before(o) { return this._ms < msOf(o) }
  after(o) { return this._ms > msOf(o) }
  onOrBefore(o) { return this._ms <= msOf(o) }
  onOrAfter(o) { return this._ms >= msOf(o) }
  equals(o) { return this._ms === msOf(o) }
  compareTo(o) { const b = msOf(o); return this._ms > b ? 1 : this._ms < b ? -1 : 0 }
}

/* ---------------------------- GlideSchedule ---------------------------- */
// Practice schedules (the real ones live in cmn_schedule; their sys_ids differ in every instance — copy one from the list).
// Hours are UTC here to keep the sandbox simple; a real schedule has its own Time zone field.
export const SCHEDULES = {
  sch_8to5: { name: '8-5 weekdays', days: [1, 2, 3, 4, 5], start: 8, end: 17 },
  sch_24x7: { name: '24 x 7', days: [1, 2, 3, 4, 5, 6, 7], start: 0, end: 24 },
}
export class GlideSchedule {
  constructor(id) { this._s = null; if (id !== undefined) this.load(id) }
  load(id) { this._s = SCHEDULES[String(id)] || null }
  isValid() { return !!this._s }
  getName() { return this._s ? this._s.name : '' }
  _open(ms) {
    const s = this._s
    if (!s) return false
    const d = new Date(ms)
    const dow = d.getUTCDay() || 7
    const h = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600
    return s.days.includes(dow) && h >= s.start && h < s.end
  }
  isInSchedule(gdt) { return this._open(msOf(gdt)) }
  // time between start and end that falls INSIDE the schedule (minute steps — fine for practice data)
  duration(start, end) {
    const a = msOf(start)
    const b = msOf(end)
    let n = 0
    for (let t = a; t < b; t += 60000) if (this._open(t)) n += 60000
    return new GlideDuration(n)
  }
  // start + this much SCHEDULE time → the date-time when it runs out
  add(start, dur) {
    let left = msOf(dur)
    let t = msOf(start)
    if (!this._s) return new GlideDateTime(fmtUtc(t + left))
    let guard = 0
    while (left > 0 && guard++ < 2000000) {
      if (this._open(t)) left -= 60000
      t += 60000
    }
    return new GlideDateTime(fmtUtc(t))
  }
}

// Date helpers behind gs.daysAgo() … and `javascript:gs.daysAgoStart(7)` in encoded queries (sandbox clock, UTC).
// ⚠️ In her PDI these follow the session time zone — lessons say so.
export const GS_DATES = {
  daysAgo: (n) => fmtUtc(nowMs() - Number(n) * DAY),
  daysAgoStart: (n) => fmtUtc(nowMs() - Number(n) * DAY).slice(0, 10) + ' 00:00:00',
  daysAgoEnd: (n) => fmtUtc(nowMs() - Number(n) * DAY).slice(0, 10) + ' 23:59:59',
  hoursAgo: (n) => fmtUtc(nowMs() - Number(n) * 3600000),
  minutesAgo: (n) => fmtUtc(nowMs() - Number(n) * 60000),
  beginningOfToday: () => NOW_UTC.slice(0, 10) + ' 00:00:00',
  endOfToday: () => NOW_UTC.slice(0, 10) + ' 23:59:59',
  beginningOfYesterday: () => fmtUtc(nowMs() - DAY).slice(0, 10) + ' 00:00:00',
  nowDateTime: () => NOW_UTC,
  now: () => NOW_UTC.slice(0, 10),
}
// 'javascript:gs.daysAgoStart(7)' → '2026-11-05 00:00:00' (only the gs date helpers above; anything else stays as written)
export function resolveJsValue(v) {
  const m = /^javascript:\s*gs\.(\w+)\(\s*(-?\d*)\s*\)\s*;?$/.exec(String(v))
  if (!m || !GS_DATES[m[1]]) return v
  return GS_DATES[m[1]](m[2] === '' ? 0 : Number(m[2]))
}
