const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            cartItem: {
                type: String,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);