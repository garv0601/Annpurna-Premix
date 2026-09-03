import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './RecentOrders.css';

const statusConfig = {
  preparing: { label: 'Preparing', className: 'status-preparing' },
  shipped:   { label: 'Shipped',   className: 'status-shipped' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

/**
 * Recent orders table/card for the dashboard.
 */
export default function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) return null;

  return (
    <motion.div
      className="recent-orders-card"
      id="recent-orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="recent-orders-header">
        <h3>Recent Orders</h3>
        <button className="view-all-btn">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* Desktop/Tablet Table */}
      <div className="recent-orders-table-wrap">
        <table className="recent-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const status = statusConfig[order.status] || statusConfig.preparing;
              return (
                <motion.tr
                  key={order.orderId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.55 + idx * 0.08 }}
                >
                  <td className="order-id-cell">
                    <span className="order-id">{order.orderId}</span>
                  </td>
                  <td>
                    <span className="order-customer">{order.customer}</span>
                  </td>
                  <td>
                    <span className="order-date">{order.date}</span>
                  </td>
                  <td>
                    <span className="order-amount">₹{order.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    <span className={`order-status-pill ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="recent-orders-mobile">
        {orders.map((order, idx) => {
          const status = statusConfig[order.status] || statusConfig.preparing;
          return (
            <motion.div
              key={order.orderId}
              className="order-mobile-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.55 + idx * 0.08 }}
            >
              <div className="order-mobile-top">
                <span className="order-id">{order.orderId}</span>
                <span className={`order-status-pill ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <div className="order-mobile-details">
                <div className="order-mobile-row">
                  <span className="order-mobile-label">Customer</span>
                  <span className="order-customer">{order.customer}</span>
                </div>
                <div className="order-mobile-row">
                  <span className="order-mobile-label">Date</span>
                  <span className="order-date">{order.date}</span>
                </div>
                <div className="order-mobile-row">
                  <span className="order-mobile-label">Amount</span>
                  <span className="order-amount">₹{order.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
