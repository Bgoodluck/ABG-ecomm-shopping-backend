const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String        
    },
    productPrice: {
        type: Number        
    },
    productDescription: {
        type: String        
    },
    productsCategory: {
        type: String        
    },
    productBrand: {
        type: String        
    },
    productImage: [],
    productDiscount:{
        type: Number
    }
    
}, {timestamps : true})

const ProductModel = mongoose.models.ProductModel || mongoose.model("product", ProductSchema);

module.exports = ProductModel;