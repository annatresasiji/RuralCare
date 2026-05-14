// cloud-functions/emergency-alert/index.js
// Google Cloud Function — triggered by Pub/Sub topic: ruralcare-emergency-alerts
//
// Deploy command:
//   gcloud functions deploy emergencyAlert \
//     --runtime nodejs20 \
//     --trigger-topic ruralcare-emergency-alerts \
//     --region asia-south1

export const emergencyAlert = async (message, context) => {
  // Decode the Pub/Sub message
  const data = message.data
    ? JSON.parse(Buffer.from(message.data, 'base64').toString())
    : {}

  console.log('[CloudFunction] Emergency Alert received:', data)

  const {
    patientName   = 'Unknown',
    location      = 'Tiruvannamalai',
    coordinates   = {},
    emergencyType = 'General Emergency',
    nearestHospital,
    ambulanceNo   = '108',
  } = data

  // ── 1. Log the emergency event ──────────────────────────────────────────
  console.log(`🚨 EMERGENCY: ${emergencyType}`)
  console.log(`   Patient:  ${patientName}`)
  console.log(`   Location: ${location} (${coordinates.lat}, ${coordinates.lng})`)
  console.log(`   Hospital: ${nearestHospital}`)

  // ── 2. In production: Send SMS via Twilio / Fast2SMS ────────────────────
  // await sendSMS(patientPhone, `Emergency alert sent. Ambulance dispatched. Call ${ambulanceNo}.`)

  // ── 3. In production: Notify hospital via HTTP ──────────────────────────
  // await fetch(HOSPITAL_API, { method:'POST', body: JSON.stringify(data) })

  // ── 4. In production: Create incident in Firestore ──────────────────────
  // const db = admin.firestore()
  // await db.collection('emergencies').add({ ...data, timestamp: admin.firestore.FieldValue.serverTimestamp() })

  console.log('[CloudFunction] Emergency alert processed ✅')
}
