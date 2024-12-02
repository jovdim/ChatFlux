import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

// Function to create a new chat
export async function createChat(req, res) {
  try {
    const { participantIds, name } = req.body;
    const userId = req.user.id; // Authenticated user ID

    // Ensure the user is not trying to create a chat with themselves
    if (participantIds.includes(userId)) {
      return res.status(400).json({ message: 'Cannot create a chat with yourself' });
    }

    // Check if the chat already exists between the participants
    let chat = await Chat.findOne({ participants: { $all: [userId, ...participantIds] } });

    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({
        participants: [userId, ...participantIds],
        name,
      });
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
