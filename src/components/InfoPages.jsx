import { useState } from 'react'
import { dyn } from '../tipUtil.js'

/* ================= 1) Developer portal: account + PDI (mock, no real credentials!) ================= */
export function DevPortal({ onDone }) {
  const [stage, setStage] = useState('home')
  const [release, setRelease] = useState('Brazil')
  return (
    <div className="dp">
      <div className="dp-top" data-tour="dp-top">
        <b className="dp-logo">snowkeer<i /> <span>Developers</span></b>
        <div className="spacer" />
        <span className="dp-link">Sign in</span>
        <button className="dp-btn" data-tour="dp-getstarted" onClick={() => stage === 'home' && setStage('signup')}>Get started</button>
      </div>
      <div className="dp-note" data-tour="dp-note">🔒 Idi mock page. Ikkada nee real email/password type cheyyaku — real site lo (developer.servicenow.com) matrame.</div>

      {stage === 'home' && (
        <div className="dp-hero">
          <h1>Build enterprise applications, workflows and AI experiences</h1>
          <p>Free Personal Developer Instance (PDI) tho practice cheyyochu.</p>
        </div>
      )}

      {stage === 'signup' && (
        <div className="dp-card" data-tour="dp-signup">
          <h2>Create your account</h2>
          <div className="dp-fields">
            <label>First name<input value="Sample" disabled /></label>
            <label>Last name<input value="Learner" disabled /></label>
            <label data-tour="dp-email">Email (work / personal)<input value="learner@example.com" disabled /></label>
            <label>Password<input type="password" value="notarealpassword" disabled /></label>
          </div>
          <p className="muted small">Real lo: email verify cheyyali — mail ki vachina link click chesthe account active avtundi.</p>
          <button className="dp-btn" data-tour="dp-create" onClick={() => setStage('dash')}>Create account (mock)</button>
        </div>
      )}

      {stage === 'dash' && (
        <div className="dp-card" data-tour="dp-dash">
          <h2>Welcome to the Developer Program 🎉</h2>
          <div className="dp-tiles">
            <div className="dp-tile" data-tour="dp-resources" data-tip={dyn('Resources', 'Docs, guides, learning paths anni ikkade untayi.')}>📚 Resources</div>
            <div className="dp-tile" data-tour="dp-community" data-tip={dyn('Community', 'Doubts ki Q&A. Chala mandi developers help chestaru.')}>💬 Community</div>
            <div className="dp-tile hot" data-tour="dp-request" onClick={() => setStage('request')} data-tip={dyn('Request Instance', 'Idi click chesthe nee own free instance (PDI) create avtundi.', 'Next step lo release select chestav.')}>
              🚀 Request Instance
            </div>
          </div>
        </div>
      )}

      {stage === 'request' && (
        <div className="dp-card" data-tour="dp-reqform">
          <h2>Request a Personal Developer Instance</h2>
          <p>Release (version) select cheyyi:</p>
          <div className="dp-radios" data-tour="dp-releases">
            {['Brazil', 'Australia', 'Zurich'].map((r) => (
              <label key={r} className={'dp-radio' + (release === r ? ' on' : '')}>
                <input type="radio" checked={release === r} onChange={() => setRelease(r)} /> {r} {r === 'Brazil' && <em>(latest)</em>}
              </label>
            ))}
          </div>
          <p className="muted small">Latest release teesukunte, nee videos lo (Brazil) laage untundi.</p>
          <button className="dp-btn" data-tour="dp-submit-req" onClick={() => setStage('ready')}>Request</button>
        </div>
      )}

      {stage === 'ready' && (
        <div className="dp-card" data-tour="dp-ready">
          <h2>Your instance is ready ✅</h2>
          <div className="dp-kv" data-tour="dp-url"><span>URL</span><b>https://dev123456.service-now.com</b></div>
          <div className="dp-kv" data-tour="dp-user"><span>Username</span><b>admin</b></div>
          <div className="dp-kv" data-tour="dp-pass"><span>Password</span><b>••••••••••••</b> <em>(copy chesi safe ga petta)</em></div>
          <div className="dp-kv" data-tour="dp-hib"><span>Inactivity</span><b>Konni gantalu idle → hibernate (data safe; "Wake up" tho malli start). ~10 rojulu login lekapothe → reclaim, data motham pothundi ⚠️ (exact policy developer portal lo chudu)</b></div>
          <button className="dp-btn" data-tour="dp-open" onClick={onDone}>Open instance →</button>
        </div>
      )}
    </div>
  )
}

/* ================= 2) Products & main websites ================= */
const PRODUCTS = [
  ['itsm', 'ITSM', 'IT Service Management', 'Incident, Problem, Change, Knowledge — IT help desk workflows. Mana course lo ekkuva idi nerchukuntam.'],
  ['itom', 'ITOM', 'IT Operations Management', 'Servers/network ni monitor chesi CMDB lo (configuration items) track chestundi.'],
  ['hrsd', 'HRSD', 'HR Service Delivery', 'Employees HR requests (leave, onboarding) ki.'],
  ['csm', 'CSM', 'Customer Service Management', 'Customers cases handle cheyyadaniki.'],
  ['secops', 'SecOps', 'Security Operations', 'Security incidents & vulnerabilities manage cheyyadaniki.'],
  ['creator', 'App Engine', 'Creator Workflows', 'Mana own custom apps build chese platform (Table, Form, Flow...) — developers ki idi important.'],
]
const SITES = [
  ['dev', 'Developer site', 'developer.servicenow.com', 'Free PDI request cheyyadam, docs, learning — developer ki first stop.'],
  ['docs', 'Documentation', 'servicenow.com/docs', 'Official docs. Release notes, API reference anni.'],
  ['community', 'Community', 'servicenow.com/community', 'Q&A forum. Error vasthe mundu ikkada vethuku.'],
  ['learn', 'Now Learning', 'nowlearning.servicenow.com', 'Free + paid courses, certification prep.'],
  ['store', 'ServiceNow Store', 'store.servicenow.com', 'Ready-made apps & integrations download cheyyadaniki.'],
  ['support', 'Support (Now Support)', 'support.servicenow.com', 'Customers ki — cases raise cheyyadam, KB articles.'],
]
export function Websites() {
  const [open, setOpen] = useState(null)
  const all = [...PRODUCTS.map((p) => ({ ...p, kind: 'product' })), ...SITES.map((s) => ({ ...s, kind: 'site' }))]
  const cur = all.find((x) => x[0] === open)
  return (
    <div className="page">
      <h1 className="plain-h">ServiceNow Products &amp; Main Websites</h1>
      <h3 className="ws-h">Products (Workflows)</h3>
      <div className="ws-grid" data-tour="ws-products">
        {PRODUCTS.map(([id, name, sub, body]) => (
          <button key={id} className={'ws-card' + (open === id ? ' on' : '')} data-tour={'ws-' + id} data-tip={dyn(name + ' — ' + sub, body)} onClick={() => setOpen(id)}>
            <b>{name}</b>
            <span>{sub}</span>
          </button>
        ))}
      </div>
      <h3 className="ws-h">Websites to bookmark</h3>
      <div className="ws-grid" data-tour="ws-sites">
        {SITES.map(([id, name, url, body]) => (
          <button key={id} className={'ws-card site' + (open === id ? ' on' : '')} data-tour={'ws-' + id} data-tip={dyn(name, body, url)} onClick={() => setOpen(id)}>
            <b>{name}</b>
            <span>{url}</span>
          </button>
        ))}
      </div>
      {cur && (
        <div className="ws-detail" data-tour="ws-detail">
          <b>{cur[1]}</b> — {cur[3]}
        </div>
      )}
    </div>
  )
}

/* ================= 3) Architecture ================= */
const A = (id, title, body, real) => ({ id, tip: dyn(title, body, real) })
const ARCH = {
  browser: A('browser', 'Browser (client)', 'User browser lo URL open chesthe ServiceNow UI load avtundi. Mana client-side scripts ikkade run avtayi.', 'Client scripts → browser lo.'),
  lb: A('lb', 'Load balancer', 'Requests ni app nodes madhya divide chestundi, ela system fast & available ga untundi.'),
  app: A('app', 'Application nodes', 'Java based. Mana server-side scripts (Business Rules, Script Includes) ikkade run avtayi. Okkoka instance ki multiple nodes untayi.', 'Server scripts → app node lo.'),
  db: A('db', 'Database', 'Anni tables & records ikkade store avtayi. Mana "Table creation" ikkada oka table create chestundi.', 'Each instance ki own dedicated database (multi-instance).'),
  mid: A('mid', 'MID Server', 'Company network lo install chese chinna Java app. Cloud instance ↔ internal systems madhya secure connection.', 'Integrations, discovery ki use.'),
  dc: A('dc', 'Data centers (primary + DR)', 'Prathi instance ki primary & backup data centre untayi. Okati fail ayithe inkoka dani ki switch avtundi.'),
}
export function Architecture() {
  return (
    <div className="page arch">
      <h1 className="plain-h">ServiceNow Architecture</h1>
      <p className="muted">Hover chesi chudu. Multi-instance model: prathi customer ki own instance + own database.</p>
      <div className="arch-flow">
        <div className="arch-box" data-tour="arch-browser" data-tip={ARCH.browser.tip}>🖥️ Browser<small>User</small></div>
        <span className="arch-arrow">→</span>
        <div className="arch-box" data-tour="arch-lb" data-tip={ARCH.lb.tip}>⚖️ Load balancer</div>
        <span className="arch-arrow">→</span>
        <div className="arch-inst" data-tour="arch-inst" data-tip={dyn('Instance', 'Instance = nee own ServiceNow environment (dev123456.service-now.com). Anni layers kalisi oka instance.', 'Multi-instance: andaru okka shared database lo undaru.')}>
          <b>Your instance</b>
          <div className="arch-row">
            <div className="arch-box" data-tour="arch-app" data-tip={ARCH.app.tip}>☕ App nodes<small>Java</small></div>
            <span className="arch-arrow">↔</span>
            <div className="arch-box db" data-tour="arch-db" data-tip={ARCH.db.tip}>🗄️ Database</div>
          </div>
        </div>
        <span className="arch-arrow">↔</span>
        <div className="arch-box mid" data-tour="arch-mid" data-tip={ARCH.mid.tip}>🔌 MID Server<small>your network</small></div>
      </div>
      <div className="arch-env" data-tour="arch-env" data-tip={dyn('Sub-production → Production', 'Normal ga companies ki 3 instances untayi: Dev (develop), Test (testing), Prod (live users). Changes Update Sets tho Dev → Test → Prod ki velthayi.', 'Update Sets lecture lo idi nerchukuntav.')}>
        <span className="env dev">DEV</span>→<span className="env test">TEST</span>→<span className="env prod">PROD</span>
        <small>Update Sets</small>
      </div>
      <div className="arch-dc" data-tour="arch-dc" data-tip={ARCH.dc.tip}>🏢 Data center 1 (primary) ⇄ 🏢 Data center 2 (DR / backup)</div>
    </div>
  )
}
