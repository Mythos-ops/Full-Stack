import { CardModel } from "../../models/card";

export const createCard = async (req, res) => {
    const { name, suit } = req.body;
    try {
        const card = new CardModel({ name, suit });
        const savedCard = await card.save();
        res.status(201).json({ message: "Card created successfully", card: savedCard });
    } catch (error) {
        res.status(500).json({ message: "Error creating card", error: error.message });
    }
};


        