import { useState } from 'react'
import { DOCTORS } from '../data/constants'

function StarRating({ r }) {
  return <span style={{ color: '#ffd166', fontSize: '0.78rem' }}>{'★'.repeat(Math.floor(r))} <span style={{ color: 'var(--muted)' }}>{r}</span></span>
}

export default function Doctors({ onBook }) {
  const [search, setSearch] = useState('')
  const [spec,   setSpec]   = useState('All')

  const specs    = ['All', ...new Set(DOCTORS.map(d => d.spec))]
  const filtered = DOCTORS.filter(d =>
    (spec === 'All' || d.spec === spec) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.spec.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: '1.6rem', fontWeight: 700 }}>👨‍⚕️ Find a Doctor</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Specialists in Tiruvannamalai &amp; nearby</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search doctor or specialization…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={spec} onChange={e => setSpec(e.target.value)} style={{ width: 'auto' }}>
          {specs.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="g3">
        {filtered.map((d, i) => (
          <div key={d.id} className={`doc-card fade-in fade-in-d${(i % 4) + 1}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="doc-av">{d.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{d.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{d.spec} · {d.exp}</div>
                <StarRating r={d.rating} />
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>📍 {d.loc}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>👥 {d.patients.toLocaleString()} patients</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`dot ${d.avail ? 'dot-green' : 'dot-red'}`} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: d.avail ? 'var(--green)' : '#ff6b6b' }}>
                {d.avail ? 'Available Now' : 'Unavailable'}
              </span>
            </div>
            <button
              className="btn btn-primary btn-sm"
              disabled={!d.avail}
              onClick={() => onBook(d)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {d.avail ? 'Book Appointment' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
