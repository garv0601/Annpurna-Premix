/**
 * MOCK REVIEW SERVICE
 */

let MOCK_REVIEWS = [
  {
    id: 'rev_1',
    customer_id: 'cust_101',
    customer_name: 'Sunita Sharma',
    customer_avatar: null,
    product_id: 'prod_1',
    product_name: 'Dal Makhani Premix',
    rating: 5,
    review_text: 'Authentic taste! Just like homemade. My family absolutely loved it. Will definitely order again.',
    status: 'pending',
    created_at: '2024-10-30T14:30:00Z',
  },
  {
    id: 'rev_2',
    customer_id: 'cust_102',
    customer_name: 'Rahul Kapoor',
    customer_avatar: null,
    product_id: 'prod_2',
    product_name: 'Classic Poha Mix',
    rating: 4,
    review_text: 'Very convenient for busy mornings. Tastes good but could use a bit more spice.',
    status: 'approved',
    created_at: '2024-10-28T09:15:00Z',
  },
  {
    id: 'rev_3',
    customer_id: 'cust_103',
    customer_name: 'Meera Joshi',
    customer_avatar: null,
    product_id: 'prod_3',
    product_name: 'Besan Ladoo',
    rating: 5,
    review_text: 'Melt in the mouth goodness! Reminds me of my grandmothers cooking.',
    status: 'approved',
    created_at: '2024-10-25T16:45:00Z',
  },
  {
    id: 'rev_4',
    customer_id: 'cust_104',
    customer_name: 'Vikram Singh',
    customer_avatar: null,
    product_id: 'prod_4',
    product_name: 'Spicy Chivda',
    rating: 2,
    review_text: 'Too oily and not spicy enough for my taste. Disappointed.',
    status: 'rejected',
    created_at: '2024-10-20T11:20:00Z',
  },
  {
    id: 'rev_5',
    customer_id: 'cust_105',
    customer_name: 'Aarti Desai',
    customer_avatar: null,
    product_id: 'prod_1',
    product_name: 'Dal Makhani Premix',
    rating: 5,
    review_text: 'The best premix I have ever tried. Highly recommended.',
    status: 'pending',
    created_at: '2024-11-01T08:10:00Z',
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getReviews() {
  await delay(400);
  return [...MOCK_REVIEWS];
}

export async function getReviewStats() {
  await delay(300);
  const pending = MOCK_REVIEWS.filter(r => r.status === 'pending').length;
  const approved = MOCK_REVIEWS.filter(r => r.status === 'approved');
  
  let avgRating = 0;
  if (MOCK_REVIEWS.length > 0) {
    const sum = MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0);
    avgRating = (sum / MOCK_REVIEWS.length).toFixed(1);
  }

  return {
    average_rating: avgRating,
    total_reviews: MOCK_REVIEWS.length,
    pending_approval: pending,
  };
}

export async function updateReviewStatus(id, newStatus) {
  await delay(400);
  const index = MOCK_REVIEWS.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Review not found');
  
  MOCK_REVIEWS[index].status = newStatus;
  return MOCK_REVIEWS[index];
}

export async function deleteReview(id) {
  await delay(400);
  MOCK_REVIEWS = MOCK_REVIEWS.filter(r => r.id !== id);
  return true;
}
