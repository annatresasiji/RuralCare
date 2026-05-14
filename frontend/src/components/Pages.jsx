import { useState, useEffect } from 'react'
import { DEFAULT_FOLLOWUPS, DOCTORS, GCP_SERVICES, DISEASE_LABELS, DISEASE_COUNTS } from '../data/constants'
import { analyticsAPI } from '../hooks/useAPI'

// ── Appointments List ─────────────────────────────────────────────────────
export function AppointmentsList({ appointments, onNav }) {
  return (
    <div className="page-enter">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>📋 My Appointments</div>
          <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>Stored in <span style={{color:'var(--primary)'}}>BigQuery</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => onNav('book')}>+ New Appointment</button>
      </div>
      <div className="card">
        {appointments.length === 0
          ? <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}><div style={{fontSize:'3rem',marginBottom:12}}>📅</div><div style={{fontWeight:600,marginBottom:8}}>No appointments yet</div><button className="btn btn-primary" onClick={() => onNav('book')}>Book First Appointment</button></div>
          : <table>
              <thead><tr><th>Doctor</th><th>Type</th><th>Date</th><th>Slot</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:'1.2rem'}}>{a.doctorEmoji}</span><span style={{fontWeight:600}}>{a.doctorName}</span></div></td>
                    <td><span className="badge b-blue">{a.type||'consultation'}</span></td>
                    <td style={{fontFamily:'monospace'}}>{a.date}</td>
                    <td style={{fontFamily:'monospace'}}>{a.slot}</td>
                    <td><span className="badge b-green">Confirmed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}

// ── Follow-ups ────────────────────────────────────────────────────────────
export function FollowUps({ appointments, onNav }) {
  const all = [...DEFAULT_FOLLOWUPS, ...appointments.filter(a => a.type === 'followup')]
  return (
    <div className="page-enter">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>🔄 Follow-up Care</div>
          <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>Ideal for chronic diseases, post-surgery, mental health continuity</div>
        </div>
        <button className="btn btn-primary" onClick={() => onNav('book')}>+ Schedule Follow-up</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
        {all.length === 0
          ? <div style={{textAlign:'center',padding:'40px 0',color:'var(--muted)'}}><div style={{fontSize:'3rem',marginBottom:12}}>🔄</div><div>No follow-ups scheduled</div></div>
          : all.map(f => (
            <div key={f.id} className="fu-card">
              <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,rgba(0,198,255,0.2),rgba(0,114,255,0.2))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>🔄</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:'0.9rem'}}>{f.doctor||f.doctorName}</div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{f.reason} · {f.date}</div></div>
              <span className="badge b-blue">{f.status}</span>
            </div>
          ))
        }
      </div>
      <div className="card" style={{background:'rgba(0,198,255,0.05)'}}>
        <div className="card-title">💡 Why Follow-ups Matter</div>
        <div className="g3">
          {[['Chronic Disease','Diabetes, BP, thyroid check-ins','🩺'],['Post-Surgery','Recovery and wound monitoring','🏥'],['Mental Health','Therapy continuity and review','🧠']].map(([t,d,e]) => (
            <div key={t} style={{padding:16,background:'rgba(255,255,255,0.03)',borderRadius:12}}>
              <div style={{fontSize:'1.5rem',marginBottom:8}}>{e}</div>
              <div style={{fontWeight:700,fontSize:'0.88rem',marginBottom:4}}>{t}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Admin Dashboard (live BigQuery data) ───────────────────────────────────
export function AdminDashboard({ appointments, records }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsAPI.dashboard()
      .then(data => setAnalytics(data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false))
  }, [])

  const diseases = analytics?.diseaseTrends?.map(d => d.category) || DISEASE_LABELS
  const counts   = analytics?.diseaseTrends?.map(d => d.count)    || DISEASE_COUNTS
  const max      = Math.max(...counts)
  const gcpSvcs  = analytics?.gcpServices || GCP_SERVICES

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>🛠️ Admin Dashboard</div>
        <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>
          Live data from <span style={{color:'var(--primary)'}}>BigQuery</span> · Source: {analytics?.source || 'loading…'}
        </div>
      </div>

      <div className="g4" style={{marginBottom:20}}>
        {[
          {l:'Total Patients', v:(analytics?.totalPatients||128)+appointments.length, i:'👥', c:'var(--primary)'},
          {l:'Appointments',   v:(analytics?.totalAppointments||47)+appointments.length, i:'📅', c:'var(--purple)'},
          {l:'Doctors Active', v:4, i:'👨‍⚕️', c:'var(--green)'},
          {l:'Records Stored', v:(analytics?.storageFiles||91)+records.length, i:'📂', c:'var(--yellow)'},
        ].map((s,i) => (
          <div className={`stat-c fade-in fade-in-d${i+1}`} key={s.l}>
            <div className="stat-icon">{s.i}</div>
            <div className="stat-num" style={{color:s.c}}>{s.v}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card card-glow">
          <div className="card-title">📊 Disease Analytics — BigQuery</div>
          {loading
            ? <div style={{textAlign:'center',padding:20}}><span className="spin" style={{borderTopColor:'var(--primary)'}}/><div style={{marginTop:8,color:'var(--muted)',fontSize:'0.82rem'}}>Querying BigQuery…</div></div>
            : diseases.map((d,i) => (
              <div key={d} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:'0.84rem',fontWeight:600}}>{d}</span>
                  <span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'monospace'}}>{counts[i]}</span>
                </div>
                <div className="pbar"><div className="pbar-fill" style={{width:`${(counts[i]/max)*100}%`}}/></div>
              </div>
            ))
          }
        </div>

        <div className="card card-glow">
          <div className="card-title">☁️ GCP Services — Live Status</div>
          {gcpSvcs.map(s => (
            <div key={s.name} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <span className="dot dot-green"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.82rem'}}>{s.name}</div>
                <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{s.desc}</div>
              </div>
              <span className="badge b-green">{s.status}</span>
            </div>
          ))}
        </div>

        <div className="card card-glow">
          <div className="card-title">👨‍⚕️ Doctor Status</div>
          <table>
            <thead><tr><th>Doctor</th><th>Specialty</th><th>Status</th></tr></thead>
            <tbody>
              {DOCTORS.map(d => (
                <tr key={d.id}>
                  <td style={{fontWeight:600}}>{d.name.split(' ').slice(0,2).join(' ')}</td>
                  <td style={{fontSize:'0.78rem',color:'var(--muted)'}}>{d.spec}</td>
                  <td><span className={`badge ${d.avail?'b-green':'b-red'}`}>{d.avail?'Active':'Off'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-glow">
          <div className="card-title">📣 Recent Pub/Sub Events</div>
          {analytics?.recentAlerts?.length
            ? analytics.recentAlerts.map((a,i) => (
              <div key={i} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{fontWeight:600,fontSize:'0.82rem'}}>{a.message?.type || 'Event'}</div>
                <div style={{fontSize:'0.7rem',color:'var(--muted)'}}>{a.topic} · {new Date(a.message?.publishedAt||Date.now()).toLocaleTimeString()}</div>
              </div>
            ))
            : <p style={{color:'var(--muted)',fontSize:'0.85rem'}}>No Pub/Sub events yet. Send an emergency alert to see events here.</p>
          }
        </div>
      </div>
    </div>
  )
}
