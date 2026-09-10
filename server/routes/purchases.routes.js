import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { purchasesLimiter } from '../middleware/rateLimit.js';
import { list, create, updateStatus, remove } from '../controllers/purchases.controller.js';

const router = Router();

router.get('/purchases', auth, list);
router.post('/purchases', purchasesLimiter, create);
router.patch('/purchases/:id', auth, updateStatus);
router.delete('/purchases/:id', auth, remove);

export default router;
