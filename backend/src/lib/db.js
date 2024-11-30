import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected: ", conn.connection.host);
  } catch (error) {
    console.log("Mongo connection Error: ", error);
    throw error;
  }
};
