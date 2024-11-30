import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/generate-token.js';

// Register User
export const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword });

    await newUser.save();
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });
 
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Refresh Access Token
export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
