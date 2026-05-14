import { useState, useRef, useEffect } from 'react'
import { MH_RESOURCES, CRISIS_LINES } from '../data/constants'
import { mentalAPI } from '../hooks/useAPI'

export default function MentalHealth() {
  const [mood, setMood] = useState(null)
  const [chat, setChat] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef()

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [chat])

  const sendMsg = async () => {
    if (!msg.trim() || loading) return
    const userMsg = { role: 'user', text: msg }
    setChat(p => [...p, userMsg])
    const sent = msg
    setMsg('')
    setLoading(true)
    try {
      // Calls POST /api/mental/chat on backend
      const data = await mentalAPI.chat(sent, chat)
      setChat(p => [...p, { role: 'assistant', text: data.reply }])
    } catch {
      setChat(p => [...p, { role: 'assistant', text: "I'm here with you. If you need immediate help, please call iCall: 9152987821." }])
    }
    setLoading(false)
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>🧠 Mental Health Support</div>
        <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>Ideal for follow-ups, anxiety, depression &amp; insomnia</div>
      </div>

      {/* Mood */}
      <div className="card" style={{ marginBottom:20, background:'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(0,198,255,0.05))' }}>
        <div className="card-title">How are you feeling today?</div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[['😊','Good'],['😐','Okay'],['😔','Low'],['😰','Anxious'],['😤','Stressed'],['😴','Tired']].map(([e,l]) => (
            <div key={l} onClick={() => setMood(l)} style={{ textAlign:'center', cursor:'pointer', padding:'12px 16px', borderRadius:12, border:`1.5px solid ${mood===l?'var(--purple)':'var(--border)'}`, background:mood===l?'rgba(168,85,247,0.15)':'transparent', transition:'all 0.2s', minWidth:70 }}>
              <div style={{ fontSize:'1.8rem' }}>{e}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:4, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
        {mood && <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(168,85,247,0.1)', borderRadius:10, fontSize:'0.85rem', color:'var(--purple)' }}>Mood: {mood} — AI companion ready 💙</div>}
      </div>

      <div className="g2" style={{ marginBottom:20 }}>
        {/* Chat */}
        <div className="card card-glow" style={{ display:'flex', flexDirection:'column', height:420 }}>
          <div className="card-title">💬 AI Companion <span style={{ fontSize:'0.65rem', color:'var(--muted)', fontWeight:400 }}>via Cloud Functions</span></div>
          <div ref={chatRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
            {chat.length === 0 && <div style={{ color:'var(--muted)', fontSize:'0.85rem', textAlign:'center', marginTop:40 }}>👋 Hi! I'm here to listen. How are you feeling?</div>}
            {chat.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:14, fontSize:'0.85rem', lineHeight:1.55, background:m.role==='user'?'var(--grad)':'rgba(255,255,255,0.06)', color:m.role==='user'?'#fff':'var(--text)' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ padding:'10px 14px' }}><span className="spin" style={{ borderTopColor:'var(--purple)' }}/></div>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input placeholder="Type how you feel…" value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} style={{ flex:1 }}/>
            <button className="btn btn-primary btn-sm" onClick={sendMsg} disabled={loading||!msg.trim()}>Send</button>
          </div>
        </div>

        {/* Resources */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, overflowY:'auto', maxHeight:420 }}>
          {MH_RESOURCES.map((r, i) => (
            <div key={r.title} className={`mh-card ${r.tag==='Crisis'||r.tag==='All'?'purple':''} fade-in fade-in-d${(i%4)+1}`}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ fontSize:'1.8rem' }}>{r.icon}</div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:'0.9rem' }}>{r.title}</div><div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{r.desc}</div></div>
                <span className="badge b-purple">{r.dur}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis Helplines */}
      <div className="card" style={{ background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.2)' }}>
        <div className="card-title" style={{ color:'var(--purple)' }}>📞 Crisis Helplines — India</div>
        <div className="g3">
          {CRISIS_LINES.map(cl => (
            <div key={cl.name} style={{ background:'rgba(168,85,247,0.08)', borderRadius:12, padding:14 }}>
              <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{cl.name}</div>
              <div style={{ color:'var(--purple)', fontWeight:700, fontSize:'1rem', margin:'4px 0' }}>{cl.phone}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{cl.hours}</div>
              <a href={`tel:${cl.phone.replace(/\D/g,'')}`} className="btn btn-ghost btn-sm" style={{ marginTop:8, textDecoration:'none' }}>📞 Call</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
