import { Storage } from '@google-cloud/storage'
import { BigQuery } from '@google-cloud/bigquery'
import { PubSub } from '@google-cloud/pubsub'
import admin from 'firebase-admin'

export const PROJECT_ID = process.env.GCP_PROJECT_ID || 'ruralcare-demo'
export const MOCK_MODE = process.env.MOCK_MODE === 'true'

export let storage = null
export let bucket = null
export let bigquery = null
export let pubsub = null
export let firebaseApp = null

try {
  storage = new Storage({ projectId: PROJECT_ID })
  bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
} catch (e) {
  if (!MOCK_MODE) console.warn('[Storage] Init failed:', e.message)
}

try {
  bigquery = new BigQuery({ projectId: PROJECT_ID })
} catch (e) {
  if (!MOCK_MODE) console.warn('[BigQuery] Init failed:', e.message)
}

try {
  pubsub = new PubSub({ projectId: PROJECT_ID })
} catch (e) {
  if (!MOCK_MODE) console.warn('[PubSub] Init failed:', e.message)
}

export { admin }

try {
  if (!admin.apps.length) {
    const cred =
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
        ? admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        : admin.credential.applicationDefault()

    firebaseApp = admin.initializeApp({ credential: cred })
  } else {
    firebaseApp = admin.app()
  }
} catch (e) {
  if (!MOCK_MODE) console.warn('[Firebase] Init failed:', e.message)
}
