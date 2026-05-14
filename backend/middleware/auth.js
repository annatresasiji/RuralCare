// backend/middleware/auth.js
// Firebase Authentication middleware — verifies ID tokens from the frontend.
// In MOCK mode, accepts tokens starting with "mock-" for local development.

import { admin, MOCK_MODE } from '../config/gcp.js'

export async function verifyToken(req, res, next) {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'No token. Add: Authorization: Bearer <token>' })
  }

  // MOCK mode — accept any "mock-*" token
  if (MOCK_MODE || token.startsWith('mock-')) {
    req.user = { uid: token, email: 'demo@ruralcare.app', role: 'patient', mock: true }
    return next()
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = { uid: decoded.uid, email: decoded.email, role: decoded.role || 'patient', mock: false }
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired Firebase token' })
  }
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) { req.user = null; return next() }
  if (MOCK_MODE || token.startsWith('mock-')) {
    req.user = { uid: token, email: 'demo@ruralcare.app', role: 'patient', mock: true }
    return next()
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = { uid: decoded.uid, email: decoded.email }
  } catch { req.user = null }
  next()
}
