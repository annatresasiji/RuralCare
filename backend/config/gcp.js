// backend/config/gcp.js
// Initialises all Google Cloud Platform clients.
// Runs in MOCK mode when credentials are not configured — perfect for local dev & demos.

import { Storage }  from '@google-cloud/storage'
import { BigQuery } from '@google-cloud/bigquery'
import { PubSub }   from '@google-cloud/pubsub'
import admin        from 'firebase-admin'

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'ruralcare-demo'

export const MOCK_MODE = (
  !process.env.GCP_PROJECT_ID ||
  process.env.GCP_PROJECT_ID === 'your-gcp-project-id'
)

if (MOCK_MODE) {
  console.log('⚠️  Running in MOCK mode — GCP calls simulated locally')
  console.log('   To connect real GCP: update GCP_PROJECT_ID in backend/.env')
}

// ── Cloud Storage ─────────────────────────────────────────────────────────
export let storage = null
export let bucket  = null
try {
  storage = new Storage({ projectId: PROJECT_ID })
  bucket  = storage.bucket(process.env.GCS_BUCKET_NAME || 'ruralcare-medical-records')
} catch (e) {
  if (!MOCK_MODE) console.warn('[CloudStorage] Init failed:', e.message)
}

// ── BigQuery ──────────────────────────────────────────────────────────────
export let bigquery = null
try {
  bigquery = new BigQuery({ projectId: PROJECT_ID })
} catch (e) {
  if (!MOCK_MODE) console.warn('[BigQuery] Init failed:', e.message)
}

// ── Cloud Pub/Sub ─────────────────────────────────────────────────────────
export let pubsub = null
try {
  pubsub = new PubSub({ projectId: PROJECT_ID })
} catch (e) {
  if (!MOCK_MODE) console.warn('[PubSub] Init failed:', e.message)
}

// ── Firebase Admin ────────────────────────────────────────────────────────
export let firebaseApp = null
export { admin }
try {
  if (!admin.apps.length) {
    const cred = (
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    )
      ? admin.credential.cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      : admin.credential.applicationDefault()

    firebaseApp = admin.initializeApp({ credential: cred })
  } else {
    firebaseApp = admin.app()
  }
} catch (e) {
  if (!MOCK_MODE) console.warn('[Firebase] Init failed:', e.message)
}
