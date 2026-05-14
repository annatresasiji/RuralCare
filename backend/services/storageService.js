import { bucket, MOCK_MODE } from '../config/gcp.js'

export async function uploadMedicalReport(file) {
  if (MOCK_MODE) {
    return {
      success: true,
      mock: true,
      filename: file.originalname
    }
  }

  const filename = `reports/${Date.now()}-${file.originalname}`
  const blob = bucket.file(filename)

  return new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      resumable: false
    })

    stream.on('error', reject)

    stream.on('finish', async () => {
      resolve({
        success: true,
        filename,
        url: `gs://${process.env.GCS_BUCKET_NAME}/${filename}`
      })
    })

    stream.end(file.buffer)
  })
}
export function getMockFiles() {
  return [
    {
      filename: 'blood-report.pdf',
      uploadedAt: new Date().toISOString(),
      url: 'mock://blood-report.pdf'
    },
    {
      filename: 'prescription.pdf',
      uploadedAt: new Date().toISOString(),
      url: 'mock://prescription.pdf'
    }
  ]
}
