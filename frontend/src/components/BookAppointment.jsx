import { useState } from 'react'
import { DOCTORS } from '../data/constants'

export default function BookAppointment({ doctor, onConfirm }) {
  const [selDoc, setSelDoc] = useState(doctor || null)
  const [slot,   setSlot]   = useState('')
  const [date,   setDate]   = useState('')
  const [reason, setReason] = useState('')
  const [type,   setType]   = useState('consultation')

  const confirm = () => {
    if (!selDoc || !slot || !date) return
    onConfirm({
      id: Date.now(),
      doctorName:  selDoc.name,
      doctorEmoji: selDoc.emoji,
      slot, date, reason, type,
      status: 'confirmed',
    })
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: '1.6rem', fontWeight: 700 }}>📅 Book Appointment</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>In-person or teleconsultation</div>
      </div>

      {/* Type Tabs */}
      <div className="tabs">
        {[['consultation','🏥 Consultation'],['followup','🔄 Follow-up'],['tele','📱 Teleconsult'],['mental','🧠 Mental Health']].map(([v, l]) => (
          <button key={v} className={`tab ${type === v ? 'act' : ''}`} onClick={() => setType(v)}>{l}</button>
        ))}
      </div>

      <div className="g2">
        {/* Doctor Select */}
        <div className="card card-glow">
          <div className="card-title">Choose Doctor</div>
          {DOCTORS.filter(d => d.avail).map(d => (
            <div
              key={d.id}
              className={`doc-card ${selDoc?.id === d.id ? 'sel' : ''}`}
              style={{ marginBottom: 8 }}
              onClick={() => setSelDoc(d)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: '1.4rem' }}>{d.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{d.spec}</div>
                </div>
                {selDoc?.id === d.id && <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Date, Slot, Confirm */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-glow">
            <div className="card-title">Date &amp; Time</div>
            <div className="fg">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            {selDoc && (
              <>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)' }}>Available Slots</label>
                <div className="slots-g">
                  {selDoc.slots.map(s => (
                    <div key={s} className={`slot ${slot === s ? 'sel' : ''}`} onClick={() => setSlot(s)}>{s}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="card card-glow">
            <div className="card-title">Details</div>
            <div className="fg">
              <label>Reason for Visit</label>
              <textarea placeholder="Describe your concern…" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            {type === 'followup' && (
              <div className="fg">
                <label>Previous Appointment ID</label>
                <input placeholder="e.g. APT-2024-001" />
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={confirm}
              disabled={!selDoc || !slot || !date}
            >
              ✅ Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
