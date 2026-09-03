import { useState, useEffect, useCallback, useMemo } from 'react';
import { getReviews, getReviewStats, updateReviewStatus, deleteReview } from '../services/reviewService';

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [data, statsData] = await Promise.all([getReviews(), getReviewStats()]);
      setReviews(data);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchStatus = statusFilter ? r.status === statusFilter : true;
      const matchRating = ratingFilter ? r.rating.toString() === ratingFilter : true;
      const searchLower = search.toLowerCase();
      const matchSearch = search === '' || 
        r.customer_name.toLowerCase().includes(searchLower) ||
        r.product_name.toLowerCase().includes(searchLower) ||
        r.review_text.toLowerCase().includes(searchLower);

      return matchStatus && matchRating && matchSearch;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  const openDetail = useCallback((review) => {
    setSelectedReview(review);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setSelectedReview(null), 300);
  }, []);

  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      setActionLoading(true);
      await updateReviewStatus(id, newStatus);
      await fetchData();
      closeDetail();
    } catch (err) {
      console.error(err);
      alert('Failed to update review status');
    } finally {
      setActionLoading(false);
    }
  }, [fetchData, closeDetail]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      setActionLoading(true);
      await deleteReview(id);
      await fetchData();
      closeDetail();
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    } finally {
      setActionLoading(false);
    }
  }, [fetchData, closeDetail]);

  return {
    reviews: filteredReviews,
    stats,
    loading,
    error,
    
    search, setSearch,
    statusFilter, setStatusFilter,
    ratingFilter, setRatingFilter,

    detailOpen, selectedReview, openDetail, closeDetail,
    handleStatusChange, handleDelete, actionLoading,
  };
}
