import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareText, AlertCircle } from 'lucide-react';
import '../customers/CustomerStats.css'; // Reusing standard grid styling

const STATS_CONFIG = [
  { id: 'rating', label: 'Average Rating', icon: Star, color: '#FFC300', bg: 'rgba(255, 195, 0, 0.12)' },
  { id: 'total', label: 'Total Reviews', icon: MessageSquareText, color: '#2980B9', bg: 'rgba(41, 128, 185, 0.08)' },
  { id: 'pending', label: 'Pending Approval', icon: AlertCircle, color: '#C0392B', bg: 'rgba(192, 57, 43, 0.08)' },
];

export default function ReviewStats({ stats }) {
  if (!stats) return null;

  const dataMap = {
    rating: `${stats.average_rating} / 5`,
    total: stats.total_reviews.toLocaleString(),
    pending: stats.pending_approval.toLocaleString(),
  };

  return (
    <div className="cstats-grid" id="review-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {STATS_CONFIG.map((conf, idx) => {
        const Icon = conf.icon;
        return (
          <motion.div
            key={conf.id}
            className="cstats-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
          >
            <div className="cstats-top">
              <div className="cstats-icon-wrap" style={{ backgroundColor: conf.bg, color: conf.color }}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div className="cstats-bottom">
              <span className="cstats-label">{conf.label}</span>
              <span className="cstats-value">{dataMap[conf.id]}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
