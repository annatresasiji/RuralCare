import { HOSPITALS } from '../data/constants'

export default function Hospitals({ loc }) {
  return (
    <div className="page-enter">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: '1.6rem', fontWeight: 700 }}>🏥 Nearby Hospitals</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Based on your location: {loc.city}</div>
      </div>

      {/* Location */}
      <div className="loc-box" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: '1.3rem' }}>📍</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--green)' }}>{loc.city}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Lat: {loc.lat.toFixed(4)} · Lng: {loc.lng.toFixed(4)}</div>
        </div>
        <span className="badge b-green">📡 GPS Active</span>
      </div>

      {/* Simulated Map */}
      <div className="map-box" style={{ marginBottom: 20 }}>
        <div className="map-inner">
          <div className="map-ripple" />
          <div className="map-ripple map-ripple2" />
          <div className="map-ripple map-ripple3" />
          <div className="map-pin">📍</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>{loc.city}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', position: 'relative', zIndex: 1 }}>
            {HOSPITALS.filter(h => h.emergency).length} emergency hospitals within 7 km
          </div>
          {/* Simulated hospital markers */}
          {HOSPITALS.map((h, i) => (
            <div
              key={h.name}
              title={h.name}
              style={{
                position: 'absolute',
                left: `${18 + i * 14}%`,
                top: `${28 + (i % 3) * 18}%`,
                fontSize: '1.2rem',
                filter: 'drop-shadow(0 0 6px rgba(0,229,160,0.8))',
                zIndex: 2,
                cursor: 'pointer',
              }}
            >
              {h.emergency ? '🏥' : '🏪'}
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '4px 10px', fontSize: '0.7rem', color: 'var(--muted)' }}>
            Tiruvannamalai District
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {HOSPITALS.map((h, i) => (
          <div key={h.name} className={`hosp-card fade-in fade-in-d${(i % 4) + 1}`}>
            <div className="hosp-icon">{h.emergency ? '🚑' : '🏥'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{h.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                ⏰ {h.open} · 🛏️ {h.beds} beds · 📞 {h.phone}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem' }}>{h.dist}</span>
              {h.emergency && <span className="badge b-red">🚨 Emergency</span>}
              <a href={`tel:${h.phone}`} className="btn btn-ghost btn-sm">📞 Call</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
