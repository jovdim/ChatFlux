import mongoose from "mongoose";

// Create schema
const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must not exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Regex for email validation
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    firstName: {
      type: String,
      minlength: [3, "Username must be at least 3 characters long"],
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      minlength: [3, "Username must be at least 3 characters long"],
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(
            v
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Create model
const User = mongoose.model("User", userSchema);

export default User;
