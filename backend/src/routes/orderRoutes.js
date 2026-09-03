/**
 * ANNPURNA Backend — Order Routes
 *
 * Customer routes:
 *   POST /api/orders/create-razorpay-order  — Create Razorpay order
 *   POST /api/orders                        — Place order (after payment)
 *   GET  /api/orders                        — Get my orders
 *   GET  /api/orders/:orderId               — Get single order
 *
 * Admin routes:
 *   GET  /api/admin/orders/stats            — Stats
 *   GET  /api/admin/orders                  — All orders (paginated)
 *   GET  /api/admin/orders/:orderId         — Single order details
 */

import { Router } from 'express';
import {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getMyOrder,
  adminGetOrderStats,
  adminGetOrders,
  adminGetOrderDetails,
} from '../controllers/orderController.js';

export const orderRouter      = Router();
export const adminOrderRouter = Router();

// ── Customer routes ──────────────────────────────────────────────────────────
orderRouter.post('/create-razorpay-order', createRazorpayOrder);
orderRouter.post('/',                      placeOrder);
orderRouter.get('/',                       getMyOrders);
orderRouter.get('/:orderId',               getMyOrder);

// ── Admin routes ─────────────────────────────────────────────────────────────
adminOrderRouter.get('/stats',      adminGetOrderStats);
adminOrderRouter.get('/',           adminGetOrders);
adminOrderRouter.get('/:orderId',   adminGetOrderDetails);
