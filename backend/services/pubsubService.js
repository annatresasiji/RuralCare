// backend/services/pubsubService.js
// Google Cloud Pub/Sub — publishes events that trigger Cloud Functions
//
// Topics:
//   ruralcare-emergency-alerts  → Cloud Function: sendEmergencyAlert()
//   ruralcare-appointments      → Cloud Function: sendAppointmentNotification()

import { pubsub, MOCK_MODE } from '../config/gcp.js'

const TOPIC_EMERGENCY    = process.env.PUBSUB_TOPIC_EMERGENCY    || 'ruralcare-emergency-alerts'
const TOPIC_APPOINTMENTS = process.env.PUBSUB_TOPIC_APPOINTMENTS || 'ruralcare-appointments'

const pubsubLog = []   // Mock event log

async function publish(topicName, data) {
  const message = { ...data, publishedAt: new Date().toISOString() }

  if (MOCK_MODE || !pubsub) {
    const entry = { topic: topicName, message, id: `mock-${Date.now()}` }
    pubsubLog.push(entry)
    console.log(`[PubSub-MOCK] → ${topicName}:`, message.type || message)
    return entry.id
  }

  const topic = pubsub.topic(topicName)
  const msgId = await topic.publish(Buffer.from(JSON.stringify(message)))
  console.log(`[PubSub] Published to ${topicName}, msgId: ${msgId}`)
  return msgId
}

// Emergency alert → Cloud Function dispatches ambulance & SMS
export async function publishEmergencyAlert(payload) {
  return publish(TOPIC_EMERGENCY, {
    type:           'EMERGENCY_ALERT',
    ...payload,
    nearestHospital:'Government District Hospital',
    ambulanceNo:    '108',
    eta:            '12 minutes',
  })
}

// Appointment confirmed → Cloud Function sends email/SMS confirmation
export async function publishAppointmentConfirmed(appointment) {
  return publish(TOPIC_APPOINTMENTS, { type: 'APPOINTMENT_CONFIRMED', ...appointment })
}

// Follow-up reminder → Cloud Function sends reminder 24h before
export async function publishFollowUpReminder(appointment) {
  return publish(TOPIC_APPOINTMENTS, { type: 'FOLLOWUP_REMINDER', ...appointment })
}

export const getPubSubLog = () => pubsubLog
