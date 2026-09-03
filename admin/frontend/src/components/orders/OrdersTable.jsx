import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import './OrdersTable.css';

const PAYMENT_LABEL = {
  upi: 'UPI',
  card: 'Card',
  cod: 'COD',
  netbanking: 'Netbanking',
};

/**
 * Orders table — desktop table with mobile card fallback.
 */
export default function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onViewOrder,
}) {
  const fromRecord = (page - 1) * pageSize + 1;
  const toRecord = Math.min(page * pageSize, total);

  return (
    <motion.div
      className="orders-table-card"
      id="orders-table"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
    >
      {/* ── Desktop/Tablet Table ── */}
      <div className="otable-scroll">
        <table className="otable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.35 + idx * 0.04 }}
              >
                <td>
                  <span className="otable-order-id">{order.orderId}</span>
                </td>
                <td>
                  <div className="otable-customer">
                    <span className="otable-customer-name">{order.customer.fullName}</span>
                    {order.customer.phone && (
                      <span className="otable-customer-phone">{order.customer.phone}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="otable-date">{order.date}</span>
                </td>
                <td>
                  <span className="otable-amount">₹{order.amount.toLocaleString('en-IN')}</span>
                </td>
                <td>
                  <span className="otable-payment">
                    {PAYMENT_LABEL[order.payment?.method] || order.payment?.method}
                  </span>
                </td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td>
                  <motion.button
                    className="otable-view-btn"
                    onClick={() => onViewOrder(order.id)}
                    aria-label={`View order ${order.orderId}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={17} strokeWidth={1.8} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="otable-empty">
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="otable-mobile-cards">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            className="otable-mobile-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35 + idx * 0.05 }}
          >
            <div className="omc-top">
              <span className="otable-order-id">{order.orderId}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="omc-body">
              <div className="omc-row">
                <span className="omc-label">Customer</span>
                <div className="otable-customer">
                  <span className="otable-customer-name">{order.customer.fullName}</span>
                  {order.customer.phone && (
                    <span className="otable-customer-phone">{order.customer.phone}</span>
                  )}
                </div>
              </div>
              <div className="omc-row">
                <span className="omc-label">Date</span>
                <span className="otable-date">{order.date}</span>
              </div>
              <div className="omc-row">
                <span className="omc-label">Amount</span>
                <span className="otable-amount">₹{order.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="omc-row">
                <span className="omc-label">Payment</span>
                <span className="otable-payment">
                  {PAYMENT_LABEL[order.payment?.method] || order.payment?.method}
                </span>
              </div>
            </div>
            <div className="omc-footer">
              <motion.button
                className="omc-view-btn"
                onClick={() => onViewOrder(order.id)}
                whileTap={{ scale: 0.97 }}
              >
                <Eye size={15} /> View Details
              </motion.button>
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="otable-empty-mobile">
            No orders found matching your filters.
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {total > 0 && (
        <div className="otable-pagination">
          <span className="otable-pagination-info">
            Showing {fromRecord} to {toRecord} of {total.toLocaleString('en-IN')} orders
          </span>
          <div className="otable-pagination-controls">
            <motion.button
              className="otable-page-btn"
              disabled={!canPrev}
              onClick={onPrev}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} /> Previous
            </motion.button>
            <span className="otable-page-num">
              {page} / {totalPages}
            </span>
            <motion.button
              className="otable-page-btn"
              disabled={!canNext}
              onClick={onNext}
              whileTap={{ scale: 0.95 }}
              aria-label="Next page"
            >
              Next <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
