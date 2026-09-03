import { initialProducts } from '../utils/seedData.js';

let productsStore = [...initialProducts];

export const productModel = {
  findAll: (filters = {}) => {
    let results = [...productsStore];

    if (filters.category && filters.category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filters.maxPrice) {
      const maxP = parseFloat(filters.maxPrice);
      if (!isNaN(maxP)) {
        results = results.filter(p => p.price <= maxP);
      }
    }

    if (filters.minRating) {
      const minR = parseFloat(filters.minRating);
      if (!isNaN(minR)) {
        results = results.filter(p => p.rating >= minR);
      }
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        results.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      }
    }

    return results;
  },

  findById: (id) => {
    return productsStore.find(p => p.id === id) || null;
  },

  updateRating: (productId, newAverageRating, newCount) => {
    const product = productsStore.find(p => p.id === productId);
    if (product) {
      product.rating = Math.round(newAverageRating * 10) / 10;
      product.reviewCount = newCount;
    }
    return product;
  }
};
