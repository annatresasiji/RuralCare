import { useState } from 'react'

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('patient')
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', phone: '' })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = () => {
    if (!form.email || !form.password) return
    if (mode === 'register' && !form.name) return
    onLogin({ name: form.name || form.email.split('@')[0], email: form.email, role })
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card slide-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 12px' }}>🏥</div>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: '1.5rem', fontWeight: 700 }}>RuralCare</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 4 }}>Cloud-Powered Telemedicine — Tiruvannamalai</div>
        </div>

        {/* Mode Tabs */}
        <div className="tabs" style={{ margin: '0 auto 24px', display: 'flex', justifyContent: 'center' }}>
          <button className={`tab ${mode === 'login' ? 'act' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`tab ${mode === 'register' ? 'act' : ''}`} onClick={() => setMode('register')}>Register</button>
        </div>

        {/* Fields */}
        {mode === 'register' && (
          <div className="fg">
            <label>Full Name</label>
            <input placeholder="Your full name" value={form.name} onChange={s('name')} />
          </div>
        )}
        <div className="fg">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={s('email')} />
        </div>
        <div className="fg">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={s('password')} />
        </div>
        {mode === 'register' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="fg"><label>Age</label><input type="number" placeholder="Age" value={form.age} onChange={s('age')} /></div>
            <div className="fg"><label>Phone</label><input placeholder="+91…" value={form.phone} onChange={s('phone')} /></div>
          </div>
        )}
        <div className="fg">
          <label>Login as</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={submit}>
          {mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.72rem', marginTop: 14 }}>
          Demo: any email + password works
        </p>
      </div>
    </div>
  )
}
