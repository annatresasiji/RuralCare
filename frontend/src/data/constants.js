export const DOCTORS = [
  { name:'Dr. Meera Krishnan', spec:'General Physician', avail:true },
  { name:'Dr. Arjun Nair', spec:'Dermatologist', avail:true },
  { name:'Dr. Ananya Varma', spec:'Psychiatrist', avail:true },
]

export const HOSPITALS = [
  { name:'Amrita Hospital', dist:'2.1 km', phone:'04842855555' },
  { name:'Aster Medcity', dist:'4.8 km', phone:'04846699999' },
  { name:'Government Hospital', dist:'1.4 km', phone:'108' },
]

export const DEFAULT_FOLLOWUPS = [
  {
    id:1,
    doctor:'Dr. Meera Krishnan',
    date:'2026-05-28',
    reason:'Blood pressure check',
    status:'scheduled'
  }
]

export const GCP_SERVICES = [
  { name:'Cloud Run', status:'Active' },
  { name:'Cloud Storage', status:'Active' },
  { name:'BigQuery', status:'Active' },
  { name:'Pub/Sub', status:'Configured' }
]

export const DISEASE_LABELS = {
  diabetes:'Diabetes',
  hypertension:'Hypertension',
  dengue:'Dengue',
  malaria:'Malaria'
}

export const DISEASE_COUNTS = {
  diabetes:8,
  hypertension:10,
  dengue:4,
  malaria:3
}

export const SYMPTOMS = [
  'Fever',
  'Cough',
  'Headache',
  'Chest Pain',
  'Shortness of Breath',
  'Anxiety'
]

export const CRITICAL_SYMPTOMS = [
  'Chest Pain',
  'Shortness of Breath',
  'Loss of Consciousness'
]

export const MENTAL_SYMPTOMS = [
  'Anxiety',
  'Depression',
  'Stress',
  'Insomnia'
]

export const MH_RESOURCES = [
  {
    title:'Mindfulness Support',
    desc:'Mental wellness resources'
  }
]

export const CRISIS_LINES = [
  {
    name:'iCall',
    phone:'9152987821',
    hours:'24/7'
  }
]
