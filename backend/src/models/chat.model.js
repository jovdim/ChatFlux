import mongoose from 'mongoose';

// Define the Chat schema
const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  // Optional: A name for the chat (e.g., group name)
  name: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
