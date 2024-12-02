import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js'; // Auth middleware
import { createChat } from '../controllers/chatController.js';

const router = express.Router();

// Protect the route with authentication middleware
router.post('/create', authenticateUser, createChat);

export default router;
