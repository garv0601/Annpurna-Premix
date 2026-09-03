import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, TicketCheck, Clock, BarChart3 } from 'lucide-react';
import '../customers/CustomerStats.css'; // Reusing the exact same grid/card CSS from Customers!

const STATS_CONFIG = [
  { id: 'total', label: 'Total Coupons', icon: Ticket, color: '#B22222', bg: 'rgba(178, 34, 34, 0.08)' },
  { id: 'active', label: 'Active', icon: TicketCheck, color: '#27AE60', bg: 'rgba(39, 174, 96, 0.08)' },
  { id: 'expiring', label: 'Expiring Soon', icon: Clock, color: '#C8960E', bg: 'rgba(255, 195, 0, 0.12)' },
  { id: 'usage', label: 'Total Usage', icon: BarChart3, color: '#2980B9', bg: 'rgba(41, 128, 185, 0.08)' },
];

export default function CouponStats({ stats }) {
  if (!stats) return null;

  const dataMap = {
    total: stats.total_coupons.toLocaleString(),
    active: stats.active_coupons.toLocaleString(),
    expiring: stats.expiring_soon.toLocaleString(),
    usage: stats.total_usage.toLocaleString(),
  };

  return (
    <div className="cstats-grid" id="coupon-stats">
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
