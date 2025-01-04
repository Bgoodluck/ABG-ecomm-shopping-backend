const express = require('express');
const { 
  createReview, 
  getProductReviews, 
  updateReview, 
  deleteReview,
  searchProducts,
  filterProducts 
} = require('../controllers/productReviewController');
const authToken = require('../middleware/auth');

const router = express.Router();

router.post('/post-review/:productId', authToken, createReview);
router.get('/get-review/:productId', getProductReviews);
router.post('/update-review/:reviewId', authToken, updateReview);
router.delete('/delete-review/:reviewId', authToken, deleteReview);
router.get("/search",searchProducts)
router.post("/filter", filterProducts)

module.exports = router;