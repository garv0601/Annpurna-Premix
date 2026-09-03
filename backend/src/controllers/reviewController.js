import { storeService } from '../services/storeService.js';

export const getReviews = (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = storeService.getReviewsByProductId(productId);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = (req, res) => {
  try {
    const { productId, author, rating, title, comment } = req.body;
    if (!productId || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: 'productId, rating, and comment are required fields'
      });
    }

    const review = storeService.addReview({ productId, author, rating, title, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
