import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getContent, updateContent } from '../controllers/content.controller.js';

const router = Router();

router.get('/content', getContent);
router.put('/content', auth, updateContent);

export default router;
