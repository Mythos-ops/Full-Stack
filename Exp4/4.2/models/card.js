import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    suit: {
        type: String,
        required: true,
    }
},{ timestamps: true });

export const CardModel = mongoose.model("Card", cardSchema);