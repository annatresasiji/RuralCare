import { useRef, useState, useEffect } from 'react'
import { recordsAPI } from '../hooks/useAPI'

export default function Records() {
  const ref = useRef()
  const [records, setRecords] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

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
        const data = await recordsAPI.upload(file)

        setRecords(p => [...p, {
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          url: data.url,
          service: 'Google Cloud Storage'
        }])

      } catch {
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
    if (type?.includes('pdf')) return '📄'
    if (type?.includes('image')) return '🖼️'
    return '📋'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:'1.6rem', fontWeight:700 }}>
          📂 Medical Records
        </div>
        <div style={{ color:'var(--muted)', fontSize:'0.85rem' }}>
          Stored in <span style={{color:'var(--primary)'}}>Google Cloud Storage</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-title">Upload New Record</div>

        <div
          className="upload-zone"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            handle(e.dataTransfer.files)
          }}
          onClick={() => ref.current.click()}
        >
          {uploading ? (
            <>
              <div style={{fontSize:'2.5rem'}}>⬆️</div>
              <div>Uploading to Cloud Storage…</div>
            </>
          ) : (
            <>
              <div style={{fontSize:'2.5rem'}}>☁️</div>
              <div>Drag & drop or click to upload</div>
            </>
          )}

          <input
            ref={ref}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            style={{display:'none'}}
            onChange={e => handle(e.target.files)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          Stored Records <span className="badge b-blue">{records.length}</span>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : records.length === 0 ? (
          <div>No records uploaded yet</div>
        ) : (
          records.map((r, i) => (
            <div
              key={i}
              style={{
                display:'flex',
                alignItems:'center',
                gap:14,
                padding:'12px 0',
                borderBottom:'1px solid rgba(255,255,255,0.04)'
              }}
            >
              <div>{iconFor(r.mimeType)}</div>

              <div style={{flex:1}}>
                <div>{r.originalName}</div>
                <div style={{fontSize:'0.75rem'}}>
                  {r.service}
                </div>
              </div>

              {r.url && r.url !== '#' && (
                <a href={r.url} target="_blank" rel="noreferrer">
                  View
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
