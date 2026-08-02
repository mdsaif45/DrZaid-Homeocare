import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/index.js';

const router: Router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.use(protect); // All routes below this middleware require authentication

router.get('/me', getCurrentUser);
router.post('/logout', logout);
router.post('/change-password', changePassword);

export default router;
