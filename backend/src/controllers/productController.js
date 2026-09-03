import { storeService } from '../services/storeService.js';

export const getProducts = (req, res) => {
  try {
    const { category, search, maxPrice, minRating, sortBy } = req.query;
    const products = storeService.getProducts({ category, search, maxPrice, minRating, sortBy });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = (req, res) => {
  try {
    const product = storeService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
