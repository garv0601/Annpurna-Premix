import { productModel } from '../models/productModel.js';
import { reviewModel } from '../models/reviewModel.js';

export const storeService = {
  getProducts: (filters) => {
    return productModel.findAll(filters);
  },

  getProductById: (id) => {
    const product = productModel.findById(id);
    if (!product) return null;
    const reviews = reviewModel.findByProductId(id);
    return { ...product, reviews };
  },

  getReviewsByProductId: (productId) => {
    return reviewModel.findByProductId(productId);
  },

  addReview: (reviewData) => {
    const review = reviewModel.create(reviewData);
    const { avg, count } = reviewModel.getAverageRatingForProduct(reviewData.productId);
    productModel.updateRating(reviewData.productId, avg, count);
    return review;
  }
};
