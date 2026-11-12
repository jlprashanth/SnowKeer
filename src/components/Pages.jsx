export function Home({ incidents }) {
  const open = incidents.filter((i) => i.active !== false && !['Resolved', 'Closed', 'Canceled'].includes(i.state)).length
  const crit = incidents.filter((i) => String(i.priority) === '1').length
  return (
    <div className="home">
      <div className="home-hero">
        <h1 data-tour="home-welcome">
          Welcome, <span>System Administrator</span>
        </h1>
        <p>Idi mock practice instance. Paina "All" click chesi explore cheyyi.</p>
      </div>
      <div className="tiles">
        <div className="tile"><b>{open}</b><span>Open incidents</span></div>
        <div className="tile"><b>{crit}</b><span>Critical (P1)</span></div>
        <div className="tile"><b>{incidents.length}</b><span>Total incidents</span></div>
      </div>
    </div>
  )
}

export function Soon({ name }) {
  return (
    <div className="page">
      <h1 className="plain-h">{name || 'This module'}</h1>
      <div className="soon">🛠️ Ee module ee course lo later build chestam. Ippatiki Incident, Users, Tables laantivi try cheyyi.</div>
    </div>
  )
}
