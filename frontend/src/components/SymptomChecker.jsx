import { useState } from 'react'
import { SYMPTOMS, CRITICAL_SYMPTOMS, MENTAL_SYMPTOMS } from '../data/constants'
import { symptomsAPI } from '../hooks/useAPI'

export default function SymptomChecker({ onBook }) {
  const [sel, setSel] = useState([])
  const [age, setAge] = useState('')
  const [hist, setHist] = useState('')
  const [urg, setUrg] = useState('normal')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiErr, setApiErr] = useState(null)

  const isCrit = sel.some(s => CRITICAL_SYMPTOMS.includes(s))
  const toggle = s => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const analyze = async () => {
    if (!sel.length) return
    setLoading(true); setResult(null); setApiErr(null)
    try {
      const data = await symptomsAPI.analyze({ symptoms: sel, age, medicalHistory: hist, urgency: urg })
      setResult(data.analysis)
    } catch (err) {
      setApiErr(err.message)
      setResult({ category:'General Medicine', specialist:'General Physician', likelihood:'Backend unreachable. Start server: cd backend && node server.js', advice:'Make sure both frontend and backend are running.', urgency:'medium', doNotDelay:false, isMentalHealth:false })
    }
    setLoading(false)
  }

  const uCol = { low:'b-green', medium:'b-yellow', high:'b-red', emergency:'b-red' }

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>🩺 Symptom Checker</div>
        <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>AI via <span style={{color:'var(--primary)'}}>Vertex AI</span> · Results logged to <span style={{color:'var(--primary)'}}>BigQuery</span></div>
      </div>

      {isCrit && (
        <div className="emg-banner">
          <span style={{fontSize:'1.8rem'}}>🚨</span>
          <div style={{flex:1}}><div style={{fontWeight:700}}>Critical Symptoms!</div><div style={{fontSize:'0.82rem',color:'var(--muted)'}}>Seek emergency care immediately</div></div>
          <a href="tel:108" className="btn btn-red">📞 Call 108</a>
        </div>
      )}

      {apiErr && (
        <div style={{background:'rgba(255,107,107,0.08)',border:'1px solid rgba(255,107,107,0.25)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:'0.82rem',color:'#ff9a9a'}}>
          ⚠️ {apiErr} — is the backend running? <code style={{background:'rgba(0,0,0,0.3)',padding:'2px 6px',borderRadius:4}}>cd backend && node server.js</code>
        </div>
      )}

      <div className="g2">
        <div className="card card-glow">
          <div className="card-title">Select Symptoms</div>
          <div className="chips">
            {SYMPTOMS.map(s => (
              <span key={s} className={`chip ${sel.includes(s)?'sel':''} ${CRITICAL_SYMPTOMS.includes(s)?'crit':''}`} onClick={() => toggle(s)}>
                {CRITICAL_SYMPTOMS.includes(s)?'⚠️ ':MENTAL_SYMPTOMS.includes(s)?'🧠 ':''}{s}
              </span>
            ))}
          </div>
          <div className="div"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="fg"><label>Age</label><input type="number" placeholder="Years" value={age} onChange={e=>setAge(e.target.value)}/></div>
            <div className="fg"><label>Urgency</label>
              <select value={urg} onChange={e=>setUrg(e.target.value)}>
                <option value="low">Low</option><option value="normal">Normal</option>
                <option value="high">High</option><option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="fg" style={{gridColumn:'1/-1'}}><label>Medical History</label><textarea placeholder="e.g., diabetic…" value={hist} onChange={e=>setHist(e.target.value)}/></div>
          </div>
          <button className="btn btn-primary" style={{marginTop:8}} onClick={analyze} disabled={loading||!sel.length}>
            {loading?<><span className="spin"/> Analyzing via Vertex AI…</>:'🔍 Analyze with AI'}
          </button>
        </div>

        <div>
          {result ? (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="ai-result">
                <div className="ai-label">Vertex AI Analysis · BigQuery logged</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
                  <span className="badge b-blue">{result.category}</span>
                  <span className={`badge ${uCol[result.urgency]||'b-yellow'}`}>⚡ {result.urgency}</span>
                  {result.doNotDelay && <span className="badge b-red">⏰ Don't Delay</span>}
                  {result.isMentalHealth && <span className="badge b-purple">🧠 Mental</span>}
                </div>
                <div style={{fontWeight:700,fontSize:'0.78rem',color:'var(--muted)',textTransform:'uppercase',marginBottom:6}}>Likely Concern</div>
                <div style={{fontSize:'0.92rem',lineHeight:1.65,marginBottom:14}}>{result.likelihood}</div>
                <div style={{fontWeight:700,fontSize:'0.78rem',color:'var(--muted)',textTransform:'uppercase',marginBottom:6}}>Health Advice</div>
                <div style={{fontSize:'0.9rem',lineHeight:1.65,color:'var(--muted)'}}>{result.advice}</div>
              </div>
              <div className="card">
                <div className="card-title" style={{marginBottom:10}}>Recommended Specialist</div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <div className="doc-av">👨‍⚕️</div>
                  <div><div style={{fontWeight:700}}>{result.specialist}</div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>AI recommendation</div></div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={onBook}>Book Appointment →</button>
              </div>
            </div>
          ) : (
            <div className="card" style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12,color:'var(--muted)',minHeight:300}}>
              <div style={{fontSize:'3.5rem'}}>🤖</div>
              <div style={{fontWeight:600}}>Vertex AI Ready</div>
              <div style={{fontSize:'0.82rem',textAlign:'center',maxWidth:220}}>Results will be logged to BigQuery automatically</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
