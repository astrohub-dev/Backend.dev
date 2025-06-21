import mongoose from "mongoose";

const traderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    
    price: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    quantity: {
        type: mongoose.Schema.Types.String,
        required: true
    },
     limits: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

export const Trader = mongoose.model('Trader', traderSchema);