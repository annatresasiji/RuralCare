// backend/routes/records.js — Google Cloud Storage upload
import { Router }      from 'express'
import multer          from 'multer'
import { verifyToken } from '../middleware/auth.js'
import { uploadFile, listPatientFiles, deleteFile } from '../services/storageService.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10*1024*1024 },
  fileFilter: (_req, file, cb) =>
    cb(null, ['image/jpeg','image/png','image/jpg','application/pdf'].includes(file.mimetype))
})

router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await listPatientFiles(req.user.uid)
    res.json({ records, count:records.length, service:'Google Cloud Storage' })
  } catch(e) { res.status(500).json({ error:e.message }) }
})

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error:'No file / invalid type (PDF, JPG, PNG only)' })
  try {
    const record = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, req.user.uid)
    res.status(201).json({ success:true, record, service:'Google Cloud Storage' })
  } catch(e) { res.status(500).json({ error:e.message }) }
})

router.delete('/:filename(*)', verifyToken, async (req, res) => {
  try {
    await deleteFile(req.params.filename)
    res.json({ success:true })
  } catch(e) { res.status(500).json({ error:e.message }) }
})

export default router
