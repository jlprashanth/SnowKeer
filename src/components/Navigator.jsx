import { useState } from 'react'
import { buildNav } from '../engine/ops.js'

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// The "All" menu: a dark dropdown under the All button (Next Experience style)
export default function Navigator({ d, onPick, onShortcut, filter, setFilter, toggleFav }) {
  const [open, setOpen] = useState({ Incident: true, 'Self-Service': true })
  const q = filter.trim().toLowerCase()
  const nav = buildNav(d)
  const favs = d.favorites || []

  const apps = nav
    .map((app) => {
      const appMatch = app.name.toLowerCase().includes(q)
      const modules = q ? app.modules.filter((m) => appMatch || m.name.toLowerCase().includes(q)) : app.modules
      return { ...app, modules }
    })
    .filter((a) => !q || a.modules.length)

  const favMods = nav.flatMap((a) => a.modules.filter((m) => favs.includes(m.id)).map((m) => ({ ...m, app: a.name })))
  const shortcut = filter.trim().match(/^([a-z0-9_]+)\.(list|do)$/i)
  const shortcutTable = shortcut && d.tables[shortcut[1].toLowerCase()] ? shortcut : null

  const hl = (text) => {
    if (!q) return text
    const i = text.toLowerCase().indexOf(q)
    if (i < 0) return text
    return (
      <>
        {text.slice(0, i)}
        <b>{text.slice(i, i + q.length)}</b>
        {text.slice(i + q.length)}
      </>
    )
  }

  const modBtn = (m, appName) => (
    <div key={m.id} className="nav-mrow">
      <button className="nav-module" data-tip="navModule" data-tour={'mod-' + slug(appName) + '-' + slug(m.name)} onClick={() => onPick(m.mod)}>
        <span>{hl(m.name)}</span>
      </button>
      <button
        className={'nav-star' + (favs.includes(m.id) ? ' on' : '')}
        data-tip="navStar"
        data-tour={'star-' + slug(appName) + '-' + slug(m.name)}
        aria-label="Favorite"
        onClick={() => toggleFav(m.id)}
      >
        {favs.includes(m.id) ? '★' : '☆'}
      </button>
    </div>
  )

  return (
    <aside className="nav-panel" data-tour="nav-panel">
      <div className="nav-top">
        <div className="nav-filter-wrap" data-tip="navFilter" data-tour="nav-filter">
          <span className="fi">⛉</span>
          <input
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && shortcutTable) onShortcut(shortcutTable[1].toLowerCase(), shortcutTable[2].toLowerCase())
            }}
            autoFocus
            aria-label="Filter navigator"
          />
          {filter && (
            <button className="clear" onClick={() => setFilter('')} aria-label="Clear">
              ⊗
            </button>
          )}
        </div>
        <span className="nav-ico">＋</span>
        <span className="nav-ico">⟳</span>
        <span className="nav-ico">⚲</span>
      </div>

      <div className="nav-scroll">
        {shortcutTable && (
          <button className="nav-shortcut" data-tour="nav-shortcut" data-tip="navShortcut" onClick={() => onShortcut(shortcutTable[1].toLowerCase(), shortcutTable[2].toLowerCase())}>
            ⏎ Open <b>{shortcutTable[1].toLowerCase()}.{shortcutTable[2].toLowerCase()}</b>
          </button>
        )}
        <div className="nav-h">FAVORITES</div>
        {favMods.filter((m) => !q || m.name.toLowerCase().includes(q)).map((m) => modBtn(m, m.app))}
        {!favMods.length && <div className="nav-none">{q ? 'No Results' : 'Star click chesthe ikkada save avtundi'}</div>}
        <div className="nav-rule" />
        <div className="nav-h">ALL RESULTS</div>
        {apps.map((app) => {
          const isOpen = q ? true : !!open[app.name]
          return (
            <div key={app.id} className="nav-app">
              <button className="nav-app-name" data-tip="navApp" data-tour={'app-' + slug(app.name)} onClick={() => setOpen((o) => ({ ...o, [app.name]: !o[app.name] }))}>
                <span className="chev">{isOpen ? '⌄' : '›'}</span>
                <span>{hl(app.name)}</span>
              </button>
              {isOpen && <div className="nav-mods">{app.modules.map((m) => modBtn(m, app.name))}</div>}
            </div>
          )
        })}
        {!apps.length && !shortcutTable && <div className="nav-none">No results. Vere word try cheyyi 🙂</div>}
      </div>
    </aside>
  )
}
