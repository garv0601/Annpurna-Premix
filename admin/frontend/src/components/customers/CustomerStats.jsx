import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, Repeat } from 'lucide-react';
import './CustomerStats.css';

const STATS_CONFIG = [
  { id: 'total', label: 'Total Customers', icon: Users, color: '#B22222', bg: 'rgba(178, 34, 34, 0.08)', hint: 'Everyone who ever registered' },
  { id: 'new', label: 'New Customers', icon: UserPlus, color: '#27AE60', bg: 'rgba(39, 174, 96, 0.08)', hint: 'Joined in the last 7 days' },
  { id: 'active', label: 'Active Customers', icon: UserCheck, color: '#2980B9', bg: 'rgba(41, 128, 185, 0.08)', hint: 'Not deactivated or deleted' },
  { id: 'repeat', label: 'Repeat Customers', icon: Repeat, color: '#C8960E', bg: 'rgba(255, 195, 0, 0.12)', hint: '2 or more orders' },
];

/**
 * Customer statistics cards.
 */
export default function CustomerStats({ stats }) {
  if (!stats) return null;

  const dataMap = {
    total: (stats.total_customers ?? 0).toLocaleString(),
    new: (stats.new_customers ?? 0).toLocaleString(),
    active: (stats.active_customers ?? 0).toLocaleString(),
    repeat: (stats.repeat_customers ?? 0).toLocaleString(),
  };

  return (
    <div className="cstats-grid" id="customer-stats">
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
              <span className="cstats-hint">{conf.hint}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
