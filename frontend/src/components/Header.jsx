export default function Header({ user, page, onNav, onLogout }) {
  const isAdmin = user?.role === 'admin'

  const navItems = isAdmin
    ? [['home','🏠 Home'],['admin','🛠️ Admin'],['profile','👤 Profile']]
    : [
        ['home',         '🏠 Home'],
        ['symptoms',     '🩺 Symptoms'],
        ['doctors',      '👨‍⚕️ Doctors'],
        ['hospitals',    '🏥 Hospitals'],
        ['mental',       '🧠 Mental Health'],
        ['followups',    '🔄 Follow-ups'],
        ['appointments', '📋 Appointments'],
        ['records',      '📂 Records'],
        ['emergency',    '🚨 Emergency'],
      ]

  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">🏥</div>
        <div>
          <div>RuralCare</div>
          <div className="logo-tag">GCP · Tiruvannamalai</div>
        </div>
      </div>

      <div className="nav">
        {navItems.map(([id, label]) => (
          <button
            key={id}
            className={`nav-btn ${page === id ? 'act' : ''} ${id === 'emergency' ? 'nav-emg' : ''}`}
            onClick={() => onNav(id)}
          >
            {label}
          </button>
        ))}
        <button className="nav-btn" onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  )
}
