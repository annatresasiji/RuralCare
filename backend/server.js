// backend/server.js — RuralCare API (Cloud Run deployment target)
import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import helmet     from 'helmet'
import rateLimit  from 'express-rate-limit'

import symptomsRoute    from './routes/symptoms.js'
import appointmentsRoute from './routes/appointments.js'
import recordsRoute     from './routes/records.js'
import emergencyRoute   from './routes/emergency.js'
import analyticsRoute   from './routes/analytics.js'
import mentalRoute      from './routes/mental.js'

import { initBigQuery } from './services/bigqueryService.js'
import { MOCK_MODE }    from './config/gcp.js'

const app  = express()
const PORT = process.env.PORT || 4000

// ── Middleware ────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials:true }))
app.use(express.json({ limit:'10mb' }))
app.use(express.urlencoded({ extended:true }))
app.use('/api/', rateLimit({ windowMs:15*60*1000, max:300 }))

// ── Info route ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({
  name:'RuralCare API', version:'1.0.0', status:'running',
  mode: MOCK_MODE ? 'MOCK (add GCP_PROJECT_ID in .env to connect real GCP)' : 'LIVE (GCP connected)',
  gcpServices: {
    cloudRun:     'active — this server',
    cloudStorage: MOCK_MODE ? 'mock' : 'connected',
    bigQuery:     MOCK_MODE ? 'mock' : 'connected',
    pubSub:       MOCK_MODE ? 'mock' : 'connected',
    cloudFunctions: 'triggered via Pub/Sub',
    firebaseAuth: MOCK_MODE ? 'mock' : 'connected',
    vertexAI:     process.env.ANTHROPIC_API_KEY ? 'connected' : 'add ANTHROPIC_API_KEY',
  },
  endpoints:[
    'GET  /api/symptoms/list',
    'POST /api/symptoms/analyze        ← Vertex AI + BigQuery',
    'GET  /api/appointments',
    'POST /api/appointments            ← BigQuery + Pub/Sub',
    'GET  /api/records',
    'POST /api/records/upload          ← Cloud Storage',
    'GET  /api/emergency/hospitals',
    'POST /api/emergency/alert         ← Pub/Sub → Cloud Functions',
    'GET  /api/analytics/dashboard     ← BigQuery',
    'POST /api/mental/chat             ← Vertex AI',
    'GET  /api/mental/resources',
  ],
}))

app.get('/health', (_req, res) => res.json({ status:'healthy', ts:new Date().toISOString() }))

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/symptoms',     symptomsRoute)
app.use('/api/appointments', appointmentsRoute)
app.use('/api/records',      recordsRoute)
app.use('/api/emergency',    emergencyRoute)
app.use('/api/analytics',    analyticsRoute)
app.use('/api/mental',       mentalRoute)

// ── 404 / Error ───────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error:`Not found: ${req.method} ${req.path}` }))
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error:'Internal server error', detail:err.message })
})

// ── Start ─────────────────────────────────────────────────────────────────
async function start() {
  console.log('\n🏥  RuralCare API starting…')
  console.log(`📡  Mode: ${MOCK_MODE ? 'MOCK' : 'LIVE GCP'}`)
  await initBigQuery()
  app.listen(PORT, () => {
    console.log(`\n✅  http://localhost:${PORT}`)
    console.log('☁️   Cloud Run     → this server')
    console.log('📦  Cloud Storage  → POST /api/records/upload')
    console.log('📊  BigQuery       → POST /api/symptoms/analyze + GET /api/analytics/dashboard')
    console.log('📣  Pub/Sub        → POST /api/emergency/alert + POST /api/appointments')
    console.log('⚡  Cloud Functions → triggered by Pub/Sub topics')
    console.log('🤖  Vertex AI      → POST /api/symptoms/analyze + POST /api/mental/chat\n')
  })
}
start()
