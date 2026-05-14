// backend/services/bigqueryService.js
// Google BigQuery — healthcare analytics & data warehouse

import { bigquery, PROJECT_ID, MOCK_MODE } from '../config/gcp.js'
import { v4 as uuid } from 'uuid'

const DATASET = process.env.BIGQUERY_DATASET || 'ruralcare_analytics'

// In-memory mock store
const mockDB = { appointments: [], symptomLogs: [], patients: [] }

// ── Init dataset & tables on startup ─────────────────────────────────────
export async function initBigQuery() {
  if (MOCK_MODE || !bigquery) {
    console.log('[BigQuery-MOCK] Skipping — running in mock mode')
    return
  }
  try {
    const [datasets] = await bigquery.getDatasets()
    if (!datasets.some(d => d.id === DATASET)) {
      await bigquery.createDataset(DATASET, { location: 'asia-south1' })
      console.log('[BigQuery] Dataset created:', DATASET)
    }
    await Promise.all([
      ensureTable('appointments', [
        { name: 'id',          type: 'STRING'    },
        { name: 'patientId',   type: 'STRING'    },
        { name: 'doctorName',  type: 'STRING'    },
        { name: 'specialty',   type: 'STRING'    },
        { name: 'date',        type: 'STRING'    },
        { name: 'slot',        type: 'STRING'    },
        { name: 'type',        type: 'STRING'    },
        { name: 'reason',      type: 'STRING'    },
        { name: 'status',      type: 'STRING'    },
        { name: 'createdAt',   type: 'TIMESTAMP' },
      ]),
      ensureTable('symptom_logs', [
        { name: 'id',          type: 'STRING'    },
        { name: 'patientId',   type: 'STRING'    },
        { name: 'symptoms',    type: 'STRING'    },
        { name: 'urgency',     type: 'STRING'    },
        { name: 'aiCategory',  type: 'STRING'    },
        { name: 'createdAt',   type: 'TIMESTAMP' },
      ]),
    ])
    console.log('[BigQuery] Tables ready')
  } catch (e) {
    console.error('[BigQuery] Init error:', e.message)
  }
}

async function ensureTable(tableId, schema) {
  const ds = bigquery.dataset(DATASET)
  const [tables] = await ds.getTables()
  if (!tables.some(t => t.id === tableId)) {
    await ds.createTable(tableId, { schema })
    console.log('[BigQuery] Table created:', tableId)
  }
}

// ── Insert appointment ────────────────────────────────────────────────────
export async function insertAppointment(row) {
  if (MOCK_MODE || !bigquery) {
    mockDB.appointments.push({ ...row, createdAt: new Date().toISOString() })
    console.log('[BigQuery-MOCK] Appointment inserted:', row.id)
    return
  }
  await bigquery.dataset(DATASET).table('appointments').insert([{
    ...row, createdAt: bigquery.timestamp(new Date()),
  }])
}

// ── Insert symptom log ────────────────────────────────────────────────────
export async function insertSymptomLog(row) {
  if (MOCK_MODE || !bigquery) {
    mockDB.symptomLogs.push({ ...row, createdAt: new Date().toISOString() })
    return
  }
  await bigquery.dataset(DATASET).table('symptom_logs').insert([{
    ...row, symptoms: JSON.stringify(row.symptoms), createdAt: bigquery.timestamp(new Date()),
  }])
}

// ── Analytics dashboard query ─────────────────────────────────────────────
export async function getAnalytics() {
  if (MOCK_MODE || !bigquery) {
    return {
      totalPatients:     128 + mockDB.patients.length,
      totalAppointments: 47  + mockDB.appointments.length,
      diseaseTrends: [
        { category: 'Fever & Flu',     count: 34 },
        { category: 'Skin Conditions', count: 18 },
        { category: 'Pediatric',       count: 22 },
        { category: 'Respiratory',     count: 15 },
        { category: 'Mental Health',   count: 28 },
        { category: 'Orthopaedic',     count: 11 },
      ],
      weeklyAppointments: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        .map(d => ({ day: d, count: Math.floor(Math.random()*12)+3 })),
      source: 'BigQuery (mock — add GCP_PROJECT_ID to connect real BigQuery)',
    }
  }
  const [[appts]]   = await bigquery.query(`SELECT COUNT(*) as total FROM \`${PROJECT_ID}.${DATASET}.appointments\``)
  const [trendRows] = await bigquery.query(
    `SELECT aiCategory as category, COUNT(*) as count FROM \`${PROJECT_ID}.${DATASET}.symptom_logs\` GROUP BY aiCategory ORDER BY count DESC LIMIT 8`
  )
  return { totalAppointments: appts.total, diseaseTrends: trendRows, source: 'BigQuery (live)' }
}

export const getMockDB = () => mockDB
