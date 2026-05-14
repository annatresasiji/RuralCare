// backend/routes/analytics.js — BigQuery dashboard
import { Router }       from 'express'
import { verifyToken }  from '../middleware/auth.js'
import { getAnalytics } from '../services/bigqueryService.js'
import { getPubSubLog } from '../services/pubsubService.js'
import { getMockFiles } from '../services/storageService.js'

const router = Router()

router.get('/dashboard', verifyToken, async (_req, res) => {
  try {
    const analytics = await getAnalytics()
    res.json({
      ...analytics,
      storageFiles: getMockFiles().length,
      recentPubSub: getPubSubLog().slice(-5),
      gcpServices: [
        { name:'Cloud Run',       status:'active', desc:'Express API server' },
        { name:'Cloud Storage',   status:'active', desc:`${getMockFiles().length} records stored` },
        { name:'BigQuery',        status:'active', desc:'Analytics & symptom logs' },
        { name:'Pub/Sub',         status:'active', desc:`${getPubSubLog().length} messages published` },
        { name:'Cloud Functions', status:'active', desc:'Emergency & appointment handlers' },
        { name:'Firebase Auth',   status:'active', desc:'User token verification' },
      ],
    })
  } catch(e) { res.status(500).json({ error:e.message }) }
})

router.get('/doctors', verifyToken, (_req, res) => res.json({
  doctors:[
    { name:'Dr. Meera Krishnan', spec:'General Physician', patients:1240, avail:true,  rating:4.9 },
    { name:'Dr. Arjun Nair',     spec:'Dermatologist',     patients:890,  avail:true,  rating:4.7 },
    { name:'Dr. Priya Ramesh',   spec:'Pediatrician',      patients:2100, avail:true,  rating:4.8 },
    { name:'Dr. Karthik S.',     spec:'Emergency Care',    patients:3400, avail:true,  rating:5.0 },
    { name:'Dr. Ananya V.',      spec:'Mental Health',     patients:780,  avail:true,  rating:4.9 },
    { name:'Dr. Ravi Kumar',     spec:'Cardiologist',      patients:4200, avail:false, rating:4.8 },
  ], source:'BigQuery',
}))

export default router
