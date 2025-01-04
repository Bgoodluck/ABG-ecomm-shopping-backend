const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$product',
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('product').findByIdAndUpdate(productId, {
      $set: {
        ratingsQuantity: stats[0].numberOfRatings,
        ratingsAverage: Number(stats[0].averageRating.toFixed(1))
      }
    });
  }
};

// Post save middleware to update product rating
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

// Post remove middleware to update product rating
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

const ProductReview = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = ProductReview;