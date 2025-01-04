const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductModel"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
}, {
    timestamps: true
})


const CartModel = mongoose.models.CartModel || mongoose.model("cart", cartSchema);


module.exports = CartModel;