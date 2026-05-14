// frontend/src/hooks/useAPI.js — central backend API client

const BASE = '/api'

function getToken() {
  return localStorage.getItem('rc_token') || 'mock-demo-user'
}

async function req(method, path, body, isFile = false) {
  const headers = { Authorization: `Bearer ${getToken()}` }
  if (!isFile) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFile ? body : body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const symptomsAPI = {
  analyze: p  => req('POST', '/symptoms/analyze', p),
  list:    () => req('GET',  '/symptoms/list'),
}

export const appointmentsAPI = {
  list:   ()     => req('GET',    '/appointments'),
  create: d      => req('POST',   '/appointments', d),
  update: (id,d) => req('PATCH',  `/appointments/${id}`, d),
  cancel: id     => req('DELETE', `/appointments/${id}`),
}

export const recordsAPI = {
  list:   () => req('GET', '/records'),
  upload: file => {
    const f = new FormData(); f.append('file', file)
    return req('POST', '/records/upload', f, true)
  },
  delete: fn => req('DELETE', `/records/${fn}`),
}

export const emergencyAPI = {
  hospitals: ()  => req('GET',  '/emergency/hospitals'),
  alert:     d   => req('POST', '/emergency/alert', d),
}

export const analyticsAPI = {
  dashboard: () => req('GET', '/analytics/dashboard'),
  doctors:   () => req('GET', '/analytics/doctors'),
}

export const mentalAPI = {
  chat:      (m,h) => req('POST', '/mental/chat', { message:m, history:h }),
  resources: ()    => req('GET',  '/mental/resources'),
}

export const saveToken  = t => localStorage.setItem('rc_token', t)
export const clearToken = () => localStorage.removeItem('rc_token')
