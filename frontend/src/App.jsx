import { useState } from 'react'
import Auth             from './components/Auth'
import Header           from './components/Header'
import Toast            from './components/Toast'
import Dashboard        from './components/Dashboard'
import SymptomChecker   from './components/SymptomChecker'
import Doctors          from './components/Doctors'
import Hospitals        from './components/Hospitals'
import BookAppointment  from './components/BookAppointment'
import MentalHealth     from './components/MentalHealth'
import Emergency        from './components/Emergency'
import Records          from './components/Records'
import { AppointmentsList, FollowUps, AdminDashboard } from './components/Pages'
import { useLocation }  from './hooks/useLocation'
import { appointmentsAPI, saveToken, clearToken } from './hooks/useAPI'
import { DEFAULT_FOLLOWUPS } from './data/constants'

export default function App() {
  const [user,         setUser]         = useState(null)
  const [page,         setPage]         = useState('home')
  const [appointments, setAppointments] = useState([])
  const [records,      setRecords]      = useState([])
  const [followups]                     = useState(DEFAULT_FOLLOWUPS)
  const [toast,        setToast]        = useState(null)
  const [bookDoc,      setBookDoc]      = useState(null)
  const loc = useLocation()

  const show = (msg, type='ok') => setToast({ msg, type, id:Date.now() })

  const nav = (p, data) => {
    if (p==='book' && data) setBookDoc(data)
    setPage(p)
  }

  const handleLogin = u => {
    setUser(u)
    saveToken(`mock-${u.email.replace(/[@.]/g,'_')}`)
    show(`Welcome, ${u.name}! 👋`)
  }

  const handleLogout = () => {
    setUser(null); clearToken(); setPage('home')
    setAppointments([]); setRecords([])
  }

  const handleBook = async apt => {
    try {
      const data = await appointmentsAPI.create(apt)
      setAppointments(p => [...p, data.appointment || apt])
      show('✅ Appointment confirmed · Notification sent via Cloud Functions!')
    } catch {
      setAppointments(p => [...p, { ...apt, id:Date.now() }])
      show('✅ Appointment saved (start backend for full GCP integration)')
    }
    nav('appointments')
  }

  const BG = <>
    <div className="bg-canvas"><div className="bg-orb bg-orb1"/><div className="bg-orb bg-orb2"/><div className="bg-orb bg-orb3"/></div>
    <div className="bg-grid"/>
  </>

  if (!user) return (
    <>{BG}
      <div className="header">
        <div className="logo">
          <div className="logo-icon">🏥</div>
          <div><div>RuralCare</div><div className="logo-tag">GCP · Tiruvannamalai</div></div>
        </div>
      </div>
      <Auth onLogin={handleLogin}/>
      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onHide={()=>setToast(null)}/>}
    </>
  )

  return (
    <>{BG}
      <div className="shell">
        <Header user={user} page={page} onNav={nav} onLogout={handleLogout}/>
        <div className="main">
          {page==='home'         && <Dashboard       user={user} appointments={appointments} records={records} followups={followups} loc={loc} onNav={nav}/>}
          {page==='symptoms'     && <SymptomChecker  onBook={()=>nav('book')}/>}
          {page==='doctors'      && <Doctors         onBook={d=>nav('book',d)}/>}
          {page==='hospitals'    && <Hospitals        loc={loc}/>}
          {page==='mental'       && <MentalHealth/>}
          {page==='followups'    && <FollowUps        appointments={appointments} onNav={nav}/>}
          {page==='book'         && <BookAppointment  doctor={bookDoc} onConfirm={handleBook}/>}
          {page==='appointments' && <AppointmentsList appointments={appointments} onNav={nav}/>}
          {page==='records'      && <Records/>}
          {page==='emergency'    && <Emergency        loc={loc}/>}
          {page==='admin'        && <AdminDashboard   appointments={appointments} records={records}/>}
        </div>
      </div>
      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onHide={()=>setToast(null)}/>}
    </>
  )
}
