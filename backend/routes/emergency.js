// backend/routes/emergency.js — Pub/Sub → Cloud Functions
import { Router }                from 'express'
import { optionalAuth }          from '../middleware/auth.js'
import { publishEmergencyAlert } from '../services/pubsubService.js'

const router = Router()

const HOSPITALS = [
  { name:'Government District Hospital', dist:'4.2 km', emergency:true,  phone:'04175-222366', beds:200, open:'24/7',    lat:12.2297, lng:79.0747 },
  { name:'Rural Health Centre Block-3',  dist:'1.8 km', emergency:false, phone:'04175-245100', beds:30,  open:'8AM–8PM', lat:12.2198, lng:79.0799 },
  { name:'PHC Tiruvannamalai',           dist:'0.9 km', emergency:false, phone:'04175-222222', beds:10,  open:'8AM–6PM', lat:12.2231, lng:79.0734 },
  { name:'Sri Ramakrishna Hospital',     dist:'6.5 km', emergency:true,  phone:'04175-265265', beds:150, open:'24/7',    lat:12.2653, lng:79.0812 },
  { name:'Arunachala Medical Centre',    dist:'2.3 km', emergency:true,  phone:'04175-257900', beds:80,  open:'24/7',    lat:12.2312, lng:79.0823 },
]

router.get('/hospitals', optionalAuth, (_req, res) =>
  res.json({ hospitals:HOSPITALS, service:'Firestore (mock)' })
)

router.post('/alert', optionalAuth, async (req, res) => {
  const { patientName='Unknown', location='Tiruvannamalai',
          lat=12.2253, lng=79.0747, emergencyType='General Emergency', description='' } = req.body
  try {
    const msgId = await publishEmergencyAlert({ patientName, location, lat, lng, emergencyType, description })
    const nearest = HOSPITALS.find(h => h.emergency)
    res.json({
      success:true, messageId:msgId, nearestHospital:nearest,
      estimatedETA:'12 minutes', ambulanceNumber:'108',
      message:'Alert published to Cloud Pub/Sub → Cloud Function notified hospital.',
      services:['Pub/Sub','Cloud Functions','Cloud Run'],
    })
  } catch(e) {
    res.status(500).json({ error:e.message })
  }
})

export default router
