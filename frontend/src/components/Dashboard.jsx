import { useState, useEffect } from 'react'
import { DOCTORS, HOSPITALS } from '../data/constants'

export default function Dashboard({ user, appointments, records, followups, loc, onNav }) {
  const [counter, setCounter] = useState({ p: 0, d: 0, r: 0, h: 0 })

  // Animated counter on mount
  useEffect(() => {
    const targets = {
      p: 128 + appointments.length,
      d: DOCTORS.filter(d => d.avail).length,
      r: records.length + 91,
      h: HOSPITALS.length,
    }
    const steps = 40
    let step = 0
    const t = setInterval(() => {
      step++
      const prog = step / steps
      setCounter({
        p: Math.floor(targets.p * prog),
        d: Math.floor(targets.d * prog),
        r: Math.floor(targets.r * prog),
        h: Math.floor(targets.h * prog),
      })
      if (step >= steps) { setCounter(targets); clearInterval(t) }
    }, 1200 / steps)
    return () => clearInterval(t)
  }, [appointments.length, records.length])

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <div className="hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24, pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{ left: `${10 + i * 12}%`, animationDuration: `${3 + i}s`, animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
        <div className="hero-globe">🌐</div>
        <div className="hero-tag fade-in">📍 {loc.city}</div>
        <h1 className="fade-in fade-in-d1">Reaching Beyond<br /><span>the Boundaries</span></h1>
        <p className="fade-in fade-in-d2">
          Consult the best doctors from anywhere. Telemedicine, emergency care, mental health
          support — all powered by Google Cloud Platform.
        </p>
        <div className="hero-btns fade-in fade-in-d3">
          <button className="btn btn-primary" onClick={() => onNav('symptoms')}>🩺 Check Symptoms</button>
          <button className="btn btn-red"     onClick={() => onNav('emergency')}>🚨 Emergency Help</button>
          <button className="btn btn-ghost"   onClick={() => onNav('mental')}>🧠 Mental Health</button>
        </div>
        <div className="hero-stats fade-in fade-in-d4">
          {[
            { n: counter.p, l: 'Patients Served' },
            { n: counter.d, l: 'Doctors Active' },
            { n: counter.r, l: 'Records Stored' },
            { n: counter.h, l: 'Hospitals Linked' },
          ].map(s => (
            <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="hero-stat-num">{s.n}+</span>
              <span className="hero-stat-label">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Location Bar ── */}
      <div className="loc-box fade-in" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: '1.3rem' }}>📍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--green)' }}>{loc.city}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
            GPS: {loc.lat.toFixed(4)}°N, {loc.lng.toFixed(4)}°E — Nearest: {HOSPITALS[2].name} ({HOSPITALS[2].dist})
          </div>
        </div>
        <span className="badge b-green">📡 Live</span>
      </div>

      {/* ── Stats ── */}
      <div className="g4" style={{ marginBottom: 20 }}>
        {[
          { icon: '📅', n: appointments.length, l: 'My Appointments',    c: 'var(--primary)' },
          { icon: '💊', n: followups.length,    l: 'Follow-ups Due',     c: 'var(--yellow)' },
          { icon: '📂', n: records.length,      l: 'Medical Records',    c: 'var(--purple)' },
          { icon: '🏥', n: HOSPITALS.filter(h => h.emergency).length, l: 'Emergency Hospitals', c: '#ff6b6b' },
        ].map((s, i) => (
          <div className={`stat-c fade-in fade-in-d${i + 1}`} key={s.l}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num" style={{ color: s.c }}>{s.n}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Upcoming + Hospitals ── */}
      <div className="g2" style={{ marginBottom: 20 }}>
        <div className="card card-glow fade-in">
          <div className="card-title">📅 Upcoming Appointments</div>
          {appointments.length === 0
            ? <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No appointments booked yet.</p>
            : appointments.slice(0, 3).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '1.5rem' }}>{a.doctorEmoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.doctorName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{a.date} · {a.slot}</div>
                </div>
                <span className="badge b-green">Confirmed</span>
              </div>
            ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => onNav('appointments')}>View All →</button>
        </div>

        <div className="card card-glow fade-in fade-in-d1">
          <div className="card-title">🏥 Nearest Hospitals</div>
          {HOSPITALS.slice(0, 3).map(h => (
            <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className={`dot ${h.emergency ? 'dot-red' : 'dot-green'}`} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{h.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{h.open}</div>
              </div>
              <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--primary)' }}>{h.dist}</span>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => onNav('hospitals')}>Map View →</button>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontWeight: 600, fontSize: '1rem', marginBottom: 14 }}>Quick Actions</div>
        <div className="g4">
          {[
            { icon: '🩺', label: 'Symptom Check', sub: 'AI-powered',      color: 'var(--grad)',  page: 'symptoms' },
            { icon: '👨‍⚕️', label: 'Find Doctor',   sub: '5 specialists',   color: 'linear-gradient(135deg,#a855f7,#7c3aed)', page: 'doctors' },
            { icon: '🧠', label: 'Mental Health', sub: 'Talk & resources', color: 'var(--grad3)', page: 'mental' },
            { icon: '🚑', label: 'Ambulance',      sub: 'Call 108 now',    color: 'var(--grad2)', page: 'emergency' },
          ].map((q, i) => (
            <div
              key={q.label}
              className={`fade-in fade-in-d${i + 1}`}
              onClick={() => onNav(q.page)}
              style={{ background: q.color, borderRadius: 16, padding: '22px 18px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 6 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <span style={{ fontSize: '1.8rem' }}>{q.icon}</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{q.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>{q.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
