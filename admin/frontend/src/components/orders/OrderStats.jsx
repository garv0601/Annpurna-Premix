import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import './OrderStats.css';

const cards = [
  { key: 'pending',   label: 'Pending',   icon: Clock,       bgClass: 'ostat-yellow' },
  { key: 'shipped',   label: 'Shipped',   icon: Truck,       bgClass: 'ostat-green' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, bgClass: 'ostat-teal' },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle,     bgClass: 'ostat-red' },
];

/**
 * Order summary KPI cards row.
 */
export default function OrderStats({ stats }) {
  if (!stats) return null;

  const trendKeys = {
    pending: 'pendingTrend',
    shipped: 'shippedTrend',
    delivered: 'deliveredTrend',
    cancelled: 'cancelledTrend',
  };

  return (
    <div className="order-stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const trend = stats[trendKeys[card.key]];

        return (
          <motion.div
            key={card.key}
            className={`order-stat-card ${card.bgClass}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(93, 64, 55, 0.10)' }}
          >
            <div className="ostat-icon-wrap">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="ostat-content">
              <p className="ostat-label">{card.label}</p>
              <h3 className="ostat-value">{value?.toLocaleString('en-IN')}</h3>
              {trend && <p className="ostat-trend">{trend}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
