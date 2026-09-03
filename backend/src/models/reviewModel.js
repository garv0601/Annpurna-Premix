import { initialReviews } from '../utils/seedData.js';

let reviewsStore = [...initialReviews];

export const reviewModel = {
  findByProductId: (productId) => {
    return reviewsStore.filter(r => r.productId === productId);
  },

  create: (reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      author: reviewData.author || "Anonymous Customer",
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: reviewData.title || "Great product",
      comment: reviewData.comment,
      verifiedPurchase: true
    };
    reviewsStore.unshift(newReview);
    return newReview;
  },

  getAverageRatingForProduct: (productId) => {
    const prodReviews = reviewsStore.filter(r => r.productId === productId);
    if (prodReviews.length === 0) return { avg: 5.0, count: 0 };
    const sum = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      avg: sum / prodReviews.length,
      count: prodReviews.length
    };
  }
};
