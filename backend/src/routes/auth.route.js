import express, { json } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Refresh token route
router.post("/refresh", refreshAccessToken);

// Logout route
router.post("/logout", logoutUser);

router.put("/update-profile", authenticateUser, updateProfile);

router.get("/greeting", (req, res) => {
  return res.send(json("hi there"));
});

//check if the user is authenticated
router.get("/check", authenticateUser, checkAuth);

export default router;
