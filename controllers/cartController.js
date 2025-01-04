const CartModel = require("../models/cartModel");
const ProductModel = require("../models/uploadProductModel"); 



exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please provide product id"
            });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await CartModel.findOne({ userId: user._id });

        if (!cart) {
            cart = new CartModel({
                userId: user._id,
                products: []
            });
        }

        const existingProductIndex = cart.products.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({
                productId: productId,
                quantity: 1
            });
        }

        await cart.save();

        
        const totalCartItems = cart.products.reduce((total, product) => total + product.quantity, 0);

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: {
                cart: cart,
                count: totalCartItems  
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message
        });
    }
};

exports.countAddToCart = async(req, res) => {
    try {
        const user = req.user;
        const cart = await CartModel.findOne({ userId: user._id });

        
        const count = cart 
            ? cart.products.reduce((total, product) => total + product.quantity, 0)
            : 0;

        console.log(`Cart Count for User ${user._id}: ${count}`); 

        return res.json({
            success: true,
            count: count,  
            message: "Ok"
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in count to cart",
            error: error.message
        });
    }
}


exports.cartViewPage = async(req, res)=>{

    try {
        
        const user = req.user;
        const cartItems = await CartModel.findOne({userId : user._id})
        
        if (!cartItems) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const products = await ProductModel.find({_id : { $in : cartItems.products.map(item => item.productId)}});

        return res.json({
            success: true,
            message: "Cart fetched successfully",
            data: {
                cartItems: cartItems,
                products: products
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error viewing cart",
            error: error.message
        });
    }
}


exports.updateCart = async (req, res) => {
    try {
        const { _id, quantity } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Find the user's cart
        const cart = await CartModel.findOne({ userId: user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the specific cart item
        const cartItemIndex = cart.products.findIndex(item => item._id.toString() === _id);

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Update quantity
        if (quantity > 0) {
            cart.products[cartItemIndex].quantity = quantity;
        } else {
            // Remove the item if quantity is 0 or less
            cart.products.splice(cartItemIndex, 1);
        }

        await cart.save();

        // Recalculate total cart items
        const totalCartItems = cart.products.reduce((total, product) => total + product.quantity, 0);

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: {
                cart: cart,
                count: totalCartItems
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { _id } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Find the user's cart
        const cart = await CartModel.findOne({ userId: user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Remove specific item from cart
        const initialLength = cart.products.length;
        cart.products = cart.products.filter(item => item._id.toString() !== _id);

        // Check if item was actually removed
        if (cart.products.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        await cart.save();

        // Recalculate total cart items
        const totalCartItems = cart.products.reduce((total, product) => total + product.quantity, 0);

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: {
                cart: cart,
                count: totalCartItems
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error removing from cart",
            error: error.message
        });
    }
};