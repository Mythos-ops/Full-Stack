import mongoose from "mongoose";

export const connectDB = async () => {
    try {
    await mongoose.connect("mongodb+srv://mythosops:harsh070507@exp4.ak9dvio.mongodb.net/?appName=Exp4");
    console.log("Connected to MongoDB");
    } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
    }
};