// Mock "Unified Navigation" banner, modelled on the Brazil Next Experience look.
// Uses our own neutral wordmark + simple line icons (no ServiceNow trademarked assets).
function Icon({ d, children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  )
}

export default function Header({ navOpen, onToggleNav, onHome, title, curSet }) {
  return (
    <header className="sn-header" data-tour="header">
      <button className="sn-logo" data-tip="logo" onClick={onHome} aria-label="Home">
        snow<span>keer</span>
        <i />
      </button>

      <button
        className={'sn-tab' + (navOpen ? ' active' : '')}
        data-tip="allMenu"
        data-tour="btn-all"
        onClick={onToggleNav}
      >
        All
      </button>
      <button className="sn-tab" data-tip="favorites">Favorites</button>
      <button className="sn-tab" data-tip="history">History</button>
      <button className="sn-tab" data-tip="workspaces">Workspaces</button>
      <button className="sn-tab" data-tip="admin">Admin</button>

      <div className="sn-title-wrap">
        <div className="sn-title" data-tip="pageTitle">
          {title} <span className="star">☆</span>
        </div>
      </div>

      <div className="sn-curset" data-tip="curSet" data-tour="cur-set">
        Update set: <b>{curSet}</b>
      </div>
      <div className="sn-search" data-tip="globalSearch" data-tour="tab-search">
        <Icon><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></Icon>
        <input placeholder="Search" aria-label="Global search" />
        <span className="sn-search-caret">▾</span>
      </div>
      <button className="sn-icon" data-tip="scopePicker" aria-label="Application scope and update set">
        <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Icon>
      </button>
      <button className="sn-icon" data-tip="chat" aria-label="Connect chat">
        <Icon d="M4 5h16v11H9l-5 4z" />
      </button>
      <button className="sn-icon" data-tip="uiSwitch" aria-label="Workspace">
        <Icon><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></Icon>
      </button>
      <button className="sn-icon" data-tip="help" aria-label="Help">
        <Icon><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17h.01" /></Icon>
      </button>
      <button className="sn-icon" data-tip="notifications" aria-label="Notifications">
        <Icon d="M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4" />
      </button>
      <button className="sn-avatar" data-tip="profile" aria-label="User menu">
        SA<b />
      </button>
    </header>
  )
}
