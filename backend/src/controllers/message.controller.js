import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

// Function to send a new message
export async function sendMessage(req, res) {
  try {
    const { chatId, content, type } = req.body;
    const senderId = req.user.id; // Authenticated user ID

    // Validate incoming data
    if (!chatId || !content) {
      return res.status(400).json({ message: 'Chat ID and content are required' });
    }

    // Check if the chat exists and the sender is part of it
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      return res.status(404).json({ message: 'Chat not found or user not part of the chat' });
    }

    // Create and save the new message
    const newMessage = new Message({
      sender: senderId,
      chat: chatId,
      content,
      type: type || 'text',
    });
    const savedMessage = await newMessage.save();

    // Send the saved message as a response
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Function to get messages for a specific chat
export async function getMessagesForChat(req, res) {
  try {
    const { chatId } = req.params;

    // Fetch messages and populate sender details
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 }); // Sort messages by creation time

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
