import express, { json } from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Refresh token route
router.post('/refresh', refreshAccessToken);

// Logout route
router.post('/logout', logoutUser);
router.get('/greeting', (req,res)=>{
return res.send(json("hi there"))
});

export default router;
