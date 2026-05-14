// cloud-functions/appointment-notify/index.js
// Google Cloud Function — triggered by Pub/Sub topic: ruralcare-appointments
//
// Deploy command:
//   gcloud functions deploy appointmentNotify \
//     --runtime nodejs20 \
//     --trigger-topic ruralcare-appointments \
//     --region asia-south1

export const appointmentNotify = async (message, context) => {
  const data = message.data
    ? JSON.parse(Buffer.from(message.data, 'base64').toString())
    : {}

  console.log('[CloudFunction] Appointment event received:', data)

  const { type, doctorName, date, slot, patientEmail, reason } = data

  if (type === 'APPOINTMENT_CONFIRMED') {
    console.log(`📅 CONFIRMED: ${patientEmail} → ${doctorName} on ${date} at ${slot}`)
    // In production: send email via SendGrid / Firebase Email Extension
    // await sendEmail(patientEmail, 'Appointment Confirmed', `Your appointment with ${doctorName} is confirmed for ${date} at ${slot}.`)
  }

  if (type === 'FOLLOWUP_REMINDER') {
    console.log(`🔄 REMINDER: Follow-up with ${doctorName} on ${date}`)
    // In production: send SMS reminder 24h before
  }

  console.log('[CloudFunction] Notification processed ✅')
}
