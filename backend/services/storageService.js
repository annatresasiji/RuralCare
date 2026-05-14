// backend/services/storageService.js
// Google Cloud Storage — upload, list, delete medical records

import { bucket, MOCK_MODE } from '../config/gcp.js'
import { v4 as uuid }        from 'uuid'

const mockFiles = []   // In-memory store for mock mode

export async function uploadFile(buffer, originalName, mimeType, patientId) {
  const ext      = originalName.split('.').pop()
  const filename = `patients/${patientId}/${uuid()}.${ext}`

  if (MOCK_MODE || !bucket) {
    const rec = {
      id: uuid(), filename, originalName, mimeType, patientId,
      size: buffer.length, uploadedAt: new Date().toISOString(),
      url: `https://storage.googleapis.com/ruralcare-medical-records/${filename}`,
      service: 'Google Cloud Storage (mock)',
    }
    mockFiles.push(rec)
    console.log('[CloudStorage-MOCK] Uploaded:', filename)
    return rec
  }

  const file = bucket.file(filename)
  await file.save(buffer, { contentType: mimeType, metadata: { patientId } })
  await file.makePublic()
  const url = `https://storage.googleapis.com/${bucket.name}/${filename}`
  console.log('[CloudStorage] Uploaded:', url)
  return { id: uuid(), filename, originalName, mimeType, patientId, size: buffer.length, uploadedAt: new Date().toISOString(), url, service: 'Google Cloud Storage' }
}

export async function listPatientFiles(patientId) {
  if (MOCK_MODE || !bucket) return mockFiles.filter(f => f.patientId === patientId)
  const [files] = await bucket.getFiles({ prefix: `patients/${patientId}/` })
  return files.map(f => ({
    filename: f.name, url: `https://storage.googleapis.com/${bucket.name}/${f.name}`,
    size: f.metadata.size, uploadedAt: f.metadata.timeCreated, service: 'Google Cloud Storage',
  }))
}

export async function deleteFile(filename) {
  if (MOCK_MODE || !bucket) {
    const idx = mockFiles.findIndex(f => f.filename === filename)
    if (idx !== -1) mockFiles.splice(idx, 1)
    return true
  }
  await bucket.file(filename).delete()
  return true
}

export const getMockFiles = () => mockFiles
