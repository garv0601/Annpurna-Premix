import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

/**
 * KPI stat card with icon, value, label, and trend indicator.
 */
export default function StatCard({ icon, iconBg, label, value, trend, trendType, delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(93, 64, 55, 0.12)' }}
    >
      <div className="stat-card-top">
        <div className={`stat-card-icon ${iconBg || ''}`}>
          {icon}
        </div>
        <div className="stat-card-info">
          <p className="stat-card-label">{label}</p>
          <h3 className="stat-card-value">{value}</h3>
        </div>
      </div>
      {trend && (
        <div className={`stat-card-trend ${trendType || ''}`}>
          {trendType === 'up' && <span className="trend-arrow">↗</span>}
          {trendType === 'steady' && <span className="trend-arrow">→</span>}
          {trendType === 'warning' && <span className="trend-arrow">▲</span>}
          <span className="trend-text">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}
