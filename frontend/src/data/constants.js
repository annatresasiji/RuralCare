export const SYMPTOMS = [
  "Fever","Cough","Headache","Sore Throat","Body Pain","Fatigue",
  "Nausea","Vomiting","Diarrhea","Chest Pain","Shortness of Breath",
  "Rash","Eye Irritation","Joint Pain","Stomach Ache","Dizziness",
  "Back Pain","Loss of Appetite","Anxiety","Depression","Insomnia"
]
export const CRITICAL_SYMPTOMS = ["Chest Pain","Shortness of Breath"]
export const MENTAL_SYMPTOMS   = ["Anxiety","Depression","Insomnia"]

export const DOCTORS = [
  { id:1, name:"Dr. Meera Krishnan", spec:"General Physician", exp:"12 yrs", emoji:"👩‍⚕️", avail:true,  loc:"PHC Tiruvannamalai",  slots:["9:00","9:30","10:30","11:00","14:00","15:30"], rating:4.9, patients:1240 },
  { id:2, name:"Dr. Arjun Nair",     spec:"Dermatologist",     exp:"8 yrs",  emoji:"👨‍⚕️", avail:true,  loc:"District Hospital",    slots:["10:00","11:30","14:30","16:00"],               rating:4.7, patients:890  },
  { id:3, name:"Dr. Priya Ramesh",   spec:"Pediatrician",      exp:"10 yrs", emoji:"👩‍⚕️", avail:true,  loc:"Rural Health Centre",  slots:["9:00","10:30","12:00","15:00"],                rating:4.8, patients:2100 },
  { id:4, name:"Dr. Karthik S.",     spec:"Emergency Care",    exp:"15 yrs", emoji:"👨‍⚕️", avail:true,  loc:"Government Hospital",  slots:["24/7 Available"],                             rating:5.0, patients:3400 },
  { id:5, name:"Dr. Ananya V.",      spec:"Mental Health",     exp:"9 yrs",  emoji:"👩‍⚕️", avail:true,  loc:"Wellness Clinic TVM",  slots:["10:00","11:00","13:00","14:30","16:00"],       rating:4.9, patients:780  },
  { id:6, name:"Dr. Ravi Kumar",     spec:"Cardiologist",      exp:"18 yrs", emoji:"👨‍⚕️", avail:false, loc:"Apollo Hospital",      slots:[],                                             rating:4.8, patients:4200 },
]

export const HOSPITALS = [
  { name:"Government District Hospital", dist:"4.2 km", emergency:true,  phone:"04175-222366", beds:200, open:"24/7"    },
  { name:"Rural Health Centre Block-3",  dist:"1.8 km", emergency:false, phone:"04175-245100", beds:30,  open:"8AM–8PM" },
  { name:"PHC Tiruvannamalai",           dist:"0.9 km", emergency:false, phone:"04175-222222", beds:10,  open:"8AM–6PM" },
  { name:"Sri Ramakrishna Hospital",     dist:"6.5 km", emergency:true,  phone:"04175-265265", beds:150, open:"24/7"    },
  { name:"Arunachala Medical Centre",    dist:"2.3 km", emergency:true,  phone:"04175-257900", beds:80,  open:"24/7"    },
]

export const MH_RESOURCES = [
  { title:"Breathing Exercise",   desc:"5-min guided deep breathing to calm anxiety",  icon:"🫁", dur:"5 min",  tag:"Anxiety"    },
  { title:"Sleep Hygiene Tips",   desc:"Proven sleep quality improvement techniques",   icon:"😴", dur:"Read",   tag:"Insomnia"   },
  { title:"Mood Journal",         desc:"Track emotional patterns daily",                icon:"📔", dur:"Daily",  tag:"Depression" },
  { title:"Mindfulness Walk",     desc:"Grounded walking meditation outdoors",          icon:"🌿", dur:"10 min", tag:"General"    },
  { title:"Talk Therapy Session", desc:"1-on-1 video session with Dr. Ananya V.",      icon:"💬", dur:"30 min", tag:"All"        },
  { title:"Crisis Helpline",      desc:"iCall: 9152987821 — Free & confidential",      icon:"📞", dur:"Now",    tag:"Crisis"     },
]

export const CRISIS_LINES = [
  { name:"iCall (TISS)",  phone:"9152987821",   hours:"Mon–Sat 8am–10pm" },
  { name:"Vandrevala",    phone:"1860-2662-345", hours:"24/7 Free"        },
  { name:"NIMHANS",       phone:"080-46110007",  hours:"24/7"             },
]

export const DEFAULT_FOLLOWUPS = [
  { id:1, doctor:"Dr. Meera Krishnan", date:"2026-05-28", reason:"Blood pressure check",  status:"scheduled" },
  { id:2, doctor:"Dr. Arjun Nair",     date:"2026-06-03", reason:"Skin rash follow-up",   status:"scheduled" },
]
