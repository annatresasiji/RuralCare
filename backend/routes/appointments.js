// backend/routes/appointments.js
import { Router }                                               from 'express'
import { v4 as uuid }                                          from 'uuid'
import { verifyToken }                                         from '../middleware/auth.js'
import { insertAppointment }                                   from '../services/bigqueryService.js'
import { publishAppointmentConfirmed, publishFollowUpReminder } from '../services/pubsubService.js'

const router = Router()
const store  = []   // In-memory (Firestore in production)

router.get('/', verifyToken, (req, res) => {
  const list = store.filter(a => a.patientId === req.user.uid)
  res.json({ appointments:list, count:list.length })
})

router.post('/', verifyToken, async (req, res) => {
  const { doctorName, doctorEmoji, slot, date, reason, type='consultation' } = req.body
  if (!doctorName||!slot||!date) return res.status(400).json({ error:'doctorName, slot, date required' })

  const apt = {
    id:uuid(), patientId:req.user.uid, patientEmail:req.user.email,
    doctorName, doctorEmoji:doctorEmoji||'👨‍⚕️', slot, date,
    reason:reason||'', type, status:'confirmed', createdAt:new Date().toISOString(),
  }
  store.push(apt)

  // BigQuery log
  insertAppointment(apt).catch(e => console.error('[BigQuery]', e.message))

  // Pub/Sub → Cloud Function notification
  const fn = type==='followup' ? publishFollowUpReminder : publishAppointmentConfirmed
  fn(apt).catch(e => console.error('[PubSub]', e.message))

  res.status(201).json({ success:true, appointment:apt,
    message:'Confirmed. Cloud Function will send notification.',
    services:['BigQuery','Pub/Sub','Cloud Functions'],
  })
})

router.patch('/:id', verifyToken, (req, res) => {
  const idx = store.findIndex(a => a.id===req.params.id && a.patientId===req.user.uid)
  if (idx===-1) return res.status(404).json({ error:'Not found' })
  store[idx] = { ...store[idx], ...req.body, updatedAt:new Date().toISOString() }
  res.json({ success:true, appointment:store[idx] })
})

router.delete('/:id', verifyToken, (req, res) => {
  const idx = store.findIndex(a => a.id===req.params.id && a.patientId===req.user.uid)
  if (idx===-1) return res.status(404).json({ error:'Not found' })
  store.splice(idx,1)
  res.json({ success:true, message:'Cancelled' })
})

export default router
