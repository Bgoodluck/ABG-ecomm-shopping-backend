const uploadProductPermission = require("../helpers/permission");
const ProductModel = require("../models/uploadProductModel");

exports.UploadProducts = async(req, res)=>{

    try {

        const sessionUserId = req.user;

        if (!uploadProductPermission(sessionUserId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to upload products"
            });
            
        }
        
        const { productName, 
                productPrice, 
                productDescription, 
                productsCategory,
                productBrand, 
                productImage, 
                productDiscount 
            } = req.body;


        if(!productName ||!productPrice ||!productDescription ||!productsCategory ||!productBrand ||!productImage ||!productDiscount){
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        
        const product = new ProductModel({
            productName,
            productPrice,
            productDescription,
            productsCategory,
            productBrand,
            productImage,
            productDiscount
        });

        const savedProduct = await product.save();

        return res.json({
            success: true,
            message: "Product Uploaded successfully",
            data: savedProduct
          })
        
    }  catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error uploading products",
            error: error.message
        });
      }
}

exports.GetProducts = async(req, res)=>{
    try {

        const allProducts = await ProductModel.find({}).sort({ createdAt : -1 });
        return res.json({
            success: true,
            message: "Products fetched successfully",
            data: allProducts
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
      }
}


exports.UpdateProducts = async(req,res)=>{
    try {

        const sessionUserId = req.user;

        const productId = req.params.id;

        const { productName, 
                productPrice, 
                productDescription, 
                productsCategory, 
                productBrand, 
                productImage, 
                productDiscount 
            } = req.body;
        
        if (!uploadProductPermission(sessionUserId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update products"
            });
        }
        
        if(!productName ||!productPrice ||!productDescription ||!productsCategory ||!productBrand ||!productImage ||!productDiscount){
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
            productName,
            productPrice,
            productDescription,
            productsCategory,
            productBrand,
            productImage,
            productDiscount
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating products",
            error: error.message
        });
      }
}


exports.ListProductCategory = async(req, res)=>{

    try {

        const allProductsCategory = await ProductModel.distinct("productsCategory");
        console.log("category", allProductsCategory)        
        
        /**this array is to store one product from each category**/ 
        const productByCategory = [];

        for (let category of allProductsCategory) {
            const product = await ProductModel.findOne({ productsCategory: category });
            
            if (product) {
                productByCategory.push(product);
            }
        }
        return res.json({
            success: true,
            message: "Category Products fetched successfully",
            data: productByCategory
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error listing Category",
            error: error.message
        });
      }
}

exports.GetAllProductCategories = async(req, res)=>{

    try {

        const { productsCategory } = req?.body || req.query;

        if (!productsCategory) {
            return res.status(400).json({
                success: false,
                message: "Please select a category"
            });
        }

        const allProductsCategory = await ProductModel.find({productsCategory});
        return res.json({
            success: true,
            message: "All Category Products fetched successfully",
            data: allProductsCategory
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting all categories",
            error: error.message
        });
      }
}


exports.GetProductDetails = async(req, res)=>{

    try {

        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please provide a product ID"
            });
        }

        const productDetails = await ProductModel.findById(productId);

        if (!productDetails) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.json({
            success: true,
            message: "Product details fetched successfully",
            data: productDetails
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting all product details",
            error: error.message
        });
      }
}