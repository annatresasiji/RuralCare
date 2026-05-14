// backend/routes/mental.js — AI mental health companion
import { Router }      from 'express'
import Anthropic       from '@anthropic-ai/sdk'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
const ai     = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are a warm, compassionate mental health support companion for rural India.
Be empathetic and culturally sensitive. Offer emotional support, breathing exercises, grounding techniques.
Keep responses concise (2-4 sentences). If serious risk detected, always recommend:
- iCall: 9152987821  |  Vandrevala: 1860-2662-345  |  Emergency: 108
Never diagnose. You are a supportive companion, not a therapist.`

router.post('/chat', verifyToken, async (req, res) => {
  const { message, history=[] } = req.body
  if (!message?.trim()) return res.status(400).json({ error:'message required' })
  try {
    const messages = [
      ...history.map(m => ({ role:m.role==='user'?'user':'assistant', content:m.text })),
      { role:'user', content:message },
    ]
    const response = await ai.messages.create({ model:'claude-sonnet-4-20250514', max_tokens:400, system:SYSTEM, messages })
    res.json({ success:true, reply:response.content[0].text, service:'Vertex AI / Claude' })
  } catch(e) {
    res.json({ success:false, reply:"I'm here with you. If you need immediate help, call iCall: 9152987821." })
  }
})

router.get('/resources', (_req, res) => res.json({
  resources:[
    { title:'Breathing Exercise',   desc:'5-min guided deep breathing',     icon:'🫁', dur:'5 min',  tag:'Anxiety'    },
    { title:'Sleep Hygiene Tips',   desc:'Better sleep quality techniques',  icon:'😴', dur:'Read',   tag:'Insomnia'   },
    { title:'Mood Journal',         desc:'Track emotional patterns',         icon:'📔', dur:'Daily',  tag:'Depression' },
    { title:'Mindfulness Walk',     desc:'Walking meditation outdoors',      icon:'🌿', dur:'10 min', tag:'General'    },
    { title:'Talk Therapy Session', desc:'1-on-1 with Dr. Ananya V.',       icon:'💬', dur:'30 min', tag:'All'        },
    { title:'Crisis Helpline',      desc:'iCall: 9152987821',               icon:'📞', dur:'Now',    tag:'Crisis'     },
  ],
  helplines:[
    { name:'iCall (TISS)',  phone:'9152987821',   hours:'Mon–Sat 8am–10pm' },
    { name:'Vandrevala',   phone:'1860-2662-345', hours:'24/7 Free'        },
    { name:'NIMHANS',      phone:'080-46110007',  hours:'24/7'             },
  ],
}))

export default router
