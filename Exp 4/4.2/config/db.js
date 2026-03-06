import mongoose from "mongoose";
require("dotenv").config();
export const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);;
    console.log("Connected to MongoDB");
    } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
    }
};