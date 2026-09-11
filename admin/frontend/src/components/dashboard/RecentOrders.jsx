import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import OrderStatusBadge from '../orders/OrderStatusBadge';
import './RecentOrders.css';

/**
 * Recent orders table/card for the dashboard.
 * Status pill reuses OrderStatusBadge (the same component/labels/colors as
 * the Orders page) so real order_status values (pending/confirmed/
 * processing/shipped/delivered/cancelled) are never mislabeled.
 */
export default function RecentOrders({ orders }) {
  const navigate = useNavigate();

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
        <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>
          View All <ArrowRight size={14} />
        </button>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="recent-orders-empty">No recent orders</p>
      ) : (
        <>
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
                {orders.map((order, idx) => (
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
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="recent-orders-mobile">
            {orders.map((order, idx) => (
              <motion.div
                key={order.orderId}
                className="order-mobile-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + idx * 0.08 }}
              >
                <div className="order-mobile-top">
                  <span className="order-id">{order.orderId}</span>
                  <OrderStatusBadge status={order.status} />
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
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

