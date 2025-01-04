const express = require("express")
const authToken = require('../middleware/auth');
const cartController = require("../controllers/cartController")

const router = express.Router()

router.post("/addtocart",authToken, cartController.addToCart)
router.get("/countaddtocart",authToken, cartController.countAddToCart)
router.get("/cartView", authToken, cartController.cartViewPage)
router.post("/update-cart", authToken, cartController.updateCart)
router.delete("/delete-cart", authToken, cartController.deleteCart)



module.exports = router;