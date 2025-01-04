const express = require('express');
const authToken = require('../middleware/auth');
const uploadProductsController = require('../controllers/uploadProductsController');

const router = express.Router()


router.post("/upload-product",authToken, uploadProductsController.UploadProducts)
router.get("/get-products", uploadProductsController.GetProducts)
router.post("/update-product/:id", authToken, uploadProductsController.UpdateProducts)
router.get("/list-category", uploadProductsController.ListProductCategory)
router.post("/all-categories", uploadProductsController.GetAllProductCategories)
router.get("/product-details/:id", uploadProductsController.GetProductDetails)

module.exports = router;