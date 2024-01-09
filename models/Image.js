const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    // isRemoved: { type: Boolean, default: 0 },
    // productId: { type: String, required: true },
    image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Image", ImageSchema);