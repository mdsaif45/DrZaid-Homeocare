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

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.use(protect); // All routes below this middleware require authentication

router.get('/me', getCurrentUser);
router.post('/logout', logout);
router.post('/change-password', changePassword);

export default router;
