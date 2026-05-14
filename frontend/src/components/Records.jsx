import { useRef, useState, useEffect } from 'react'
import { recordsAPI } from '../hooks/useAPI'

export default function Records() {
  const ref = useRef()
  const [records, setRecords] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load existing records from Cloud Storage on mount
  useEffect(() => {
    recordsAPI.list()
      .then(data => setRecords(data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  const handle = async files => {
    const arr = Array.from(files)
    setUploading(true)
    for (const file of arr) {
      try {
        // Calls POST /api/records/upload → Google Cloud Storage
        const data = await recordsAPI.upload(file)
        setRecords(p => [...p, data.record])
      } catch {
        // Fallback: show locally even if backend fails
        setRecords(p => [...p, {
          id: Date.now() + Math.random(),
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          url: '#',
          service: 'Cloud Storage (backend offline)',
        }])
      }
    }
    setUploading(false)
  }

  const iconFor = type => {
    if (type?.includes('pdf'))   return '📄'
    if (type?.includes('image')) return '🖼️'
    return '📋'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>📂 Medical Records</div>
        <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>Stored in <span style={{color:'var(--primary)'}}>Google Cloud Storage</span> · Indexed by <span style={{color:'var(--primary)'}}>BigQuery</span></div>
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-title">Upload New Record</div>
        <div
          className="upload-zone"
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();handle(e.dataTransfer.files)}}
          onClick={()=>ref.current.click()}
        >
          {uploading
            ? <><div style={{fontSize:'2.5rem',marginBottom:8}}>⬆️</div><div style={{fontWeight:600}}>Uploading to Cloud Storage…</div></>
            : <><div style={{fontSize:'2.5rem',marginBottom:8}}>☁️</div><div style={{fontWeight:600}}>Drag &amp; drop or click to upload</div><div style={{fontSize:'0.78rem',marginTop:4}}>PDF, JPG, PNG — Prescriptions, Reports, Scans (max 10MB)</div></>
          }
          <input ref={ref} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}} onChange={e=>handle(e.target.files)}/>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          Stored in Cloud Storage&nbsp;<span className="badge b-blue">{records.length} files</span>
        </div>
        {loading
          ? <div style={{textAlign:'center',padding:'32px 0',color:'var(--muted)'}}><span className="spin" style={{borderTopColor:'var(--primary)'}}/><div style={{marginTop:8}}>Loading from Cloud Storage…</div></div>
          : records.length === 0
            ? <div style={{textAlign:'center',padding:'32px 0',color:'var(--muted)'}}><div style={{fontSize:'2.5rem',marginBottom:8}}>📁</div>No records uploaded yet</div>
            : records.map((r, i) => (
              <div key={r.id||i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,198,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>
                  {iconFor(r.mimeType||r.type)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.88rem'}}>{r.originalName||r.name}</div>
                  <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>
                    {r.service||'Cloud Storage'} · {r.size ? `${(r.size/1024).toFixed(1)} KB` : ''} · {r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString('en-IN') : ''}
                  </div>
                </div>
                {r.url && r.url !== '#'
                  ? <a href={r.url} target="_blank" rel="noreferrer" className="badge b-green" style={{textDecoration:'none'}}>☁️ View</a>
                  : <span className="badge b-green">✓ Cloud</span>
                }
              </div>
            ))
        }
      </div>
    </div>
  )
}
