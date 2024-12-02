import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js'; // Auth middleware
import { sendMessage, getMessagesForChat } from '../controllers/messageController.js';

const router = express.Router();

// Protect the routes with authentication middleware
router.post('/send', authenticateUser, sendMessage);
router.get('/:chatId', authenticateUser, getMessagesForChat);

export default router;
