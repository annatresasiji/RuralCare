// backend/routes/symptoms.js
import { Router }           from 'express'
import Anthropic            from '@anthropic-ai/sdk'
import { verifyToken }      from '../middleware/auth.js'
import { insertSymptomLog } from '../services/bigqueryService.js'
import { v4 as uuid }       from 'uuid'

const router = Router()
const ai     = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /api/symptoms/analyze
router.post('/analyze', verifyToken, async (req, res) => {
  const { symptoms = [], age, medicalHistory, urgency = 'normal' } = req.body
  if (!symptoms.length) return res.status(400).json({ error: 'symptoms[] required' })

  try {
    const msg = await ai.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are a rural telemedicine AI for Tiruvannamalai, Tamil Nadu, India.
Patient — Symptoms: ${symptoms.join(', ')}, Age: ${age||'unknown'}, History: ${medicalHistory||'none'}, Urgency: ${urgency}
Return ONLY valid JSON (no markdown):
{"category":"General Medicine|Dermatology|Pediatrics|Emergency Care|Mental Health|ENT|Orthopedics",
 "specialist":"recommended type","likelihood":"one sentence concern (NOT a diagnosis)",
 "advice":"2 sentences safe guidance","urgency":"low|medium|high|emergency",
 "doNotDelay":true|false,"isMentalHealth":true|false,"isEmergency":true|false}`,
      }],
    })
    const result = JSON.parse(msg.content[0].text.replace(/```json|```/g,'').trim())

    // Log to BigQuery (async, non-blocking)
    insertSymptomLog({ id:uuid(), patientId:req.user.uid, symptoms, urgency, aiCategory:result.category })
      .catch(e => console.error('[BigQuery] Symptom log:', e.message))

    res.json({ success:true, analysis:result, service:'Vertex AI / Claude' })
  } catch(err) {
    res.json({ success:false, analysis:{
      category:'General Medicine', specialist:'General Physician',
      likelihood:'AI unavailable. Please consult a doctor.', advice:'Visit your nearest PHC.',
      urgency:'medium', doNotDelay:false, isMentalHealth:false, isEmergency:false,
    }, error:err.message })
  }
})

// GET /api/symptoms/list
router.get('/list', (req, res) => res.json({
  symptoms:["Fever","Cough","Headache","Sore Throat","Body Pain","Fatigue","Nausea",
    "Vomiting","Diarrhea","Chest Pain","Shortness of Breath","Rash","Eye Irritation",
    "Joint Pain","Stomach Ache","Dizziness","Back Pain","Loss of Appetite","Anxiety","Depression","Insomnia"],
  critical:["Chest Pain","Shortness of Breath"],
  mental:["Anxiety","Depression","Insomnia"],
}))

export default router
