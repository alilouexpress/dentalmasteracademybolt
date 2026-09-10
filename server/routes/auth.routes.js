import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';
import { me, register, login, logout, changePassword } from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', auth, me);
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/change-password', auth, loginLimiter, changePassword);

export default router;
