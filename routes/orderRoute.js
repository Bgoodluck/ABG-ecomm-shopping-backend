const express = require ('express')
const {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    placeOrderFlutterwave,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyFlutterwave  
} = require ('../controllers/orderController')
// const adminAuth = require ('../middleware/adminAuth.js')
const authToken = require('../middleware/auth');





const router = express.Router()

// Admin Features
router.post('/list',authToken, allOrders)
router.post('/status', authToken, updateStatus)


// Paymnent Features
router.post('/cod',authToken, placeOrder)
router.post('/stripe', authToken, placeOrderStripe)
router.post('/razorpay', authToken, placeOrderRazorpay)
router.post('/flw',authToken, placeOrderFlutterwave)

// User Features
router.post('/userorders', authToken,userOrders)

// Verify Payment
router.post('/verifyStripe', authToken, verifyStripe)
router.post('/verifyFlw', authToken, verifyFlutterwave)

module.exports = router;