const ProductReview = require('../models/productReviewModel');
const ProductModel = require('../models/uploadProductModel');

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user; 

    const { rating, comment } = req.body;

    
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment"
      });
    }

    
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    
    const existingReview = await ProductReview.findOne({ 
      product: productId, 
      user: userId 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Create new review
    const newReview = new ProductReview({
      product: productId,
      user: userId,
      rating,
      comment
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: savedReview
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

   
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    
    const reviews = await ProductReview.find({ product: productId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: reviews.length,
      data: reviews
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;
    const { rating, comment } = req.body;

    
    const review = await ProductReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review"
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;

    
    const review = await ProductReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review"
      });
    }

    
    await ProductReview.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
};


exports.searchProducts = async(req, res)=>{

  try {

    const query = req.query.q;
    
    const regex = new RegExp(query,"i","g")

    const products = await ProductModel.find({$or: [
      {productName: regex},      
      {productsCategory: regex}
    ]}).sort({ createdAt : -1 });

    return res.json({
      success: true,
      message: "Products fetched successfully",
      data: products
    })
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Search not available",
      error: error.message
    });
  }
}

exports.filterProducts = async(req, res)=>{
  try {
   const categoryList = req?.body?.productsCategory || []

   const products = await ProductModel.find({ 
     productsCategory: { $in: categoryList } 
   })

   return res.json({
     success: true,
     message: "Products fetched successfully",
     data: products
   })
   
  } catch (error) {
   console.error(error);
   res.status(500).json({
     success: false,
     message: "Filter Error",
     error: error.message
   });
 }
}