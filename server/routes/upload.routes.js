import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadFile } from '../controllers/upload.controller.js';

const router = Router();

router.post('/upload', auth, upload.single('file'), uploadFile);

export default router;
