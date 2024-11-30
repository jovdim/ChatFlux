import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/generate-token.js";
import cloudinary from "../lib/cloudinary.js";

// Register User
export const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or Username is already exists" });
    }

    // Explicitly validate input data before creating a new user instance
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Validate the user instance manually
    await newUser.validate(); // This triggers validation and throws an error if invalid

    // If validation passes, hash the password and save the user
    const hashedPassword = await bcryptjs.hash(password, 12);
    newUser.password = hashedPassword;

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const [key, value] of Object.entries(error.errors)) {
        validationErrors[key] = value.message;
      }
      return res.status(400).json({ errors: validationErrors });
    }

    // Handle any other errors (e.g., server errors)
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      samesite: true,
      secure: process.env.NODE_ENV === "production", // Secure in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh Access Token
export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized - No Token Provided!" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ error: "Invalid or expired refresh token" });
  }
};

//update profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { profileImage } = req.body;
    if (!profileImage)
      return res.status(400).json({ error: "Profile image is required!" });

    //upload image
    const res = await cloudinary.uploader.upload(profileImage);
    const updatedProfileUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: res.secure_url,
      },
      { new: true } //get the new updated user
    );

    res.status(200).json(updatedProfileUser);
  } catch (error) {
    console.log("Error to update profile image: ", error);
    res.status(500).json({ error: "Internal error!" });
  }
};

//Check if the user is authenticated
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.userId);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ error: "Internal error!" });
  }
};
