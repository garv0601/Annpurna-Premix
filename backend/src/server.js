import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { orderRouter, adminOrderRouter } from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(logger);

// Routes
app.use(`${config.apiPrefix}/products`,      productRoutes);
app.use(`${config.apiPrefix}/reviews`,       reviewRoutes);
app.use(`${config.apiPrefix}/contact`,       contactRoutes);
app.use(`${config.apiPrefix}/orders`,        orderRouter);
app.use(`${config.apiPrefix}/admin/orders`,  adminOrderRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: config.env, timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 ANNPURNA API Server running on port ${config.port} [${config.env}]`);
  console.log(`📡 Health Check:  http://localhost:${config.port}/health`);
  console.log(`🛍️ Products:      http://localhost:${config.port}${config.apiPrefix}/products`);
  console.log(`📦 Orders:        http://localhost:${config.port}${config.apiPrefix}/orders`);
  console.log(`🔐 Admin Orders:  http://localhost:${config.port}${config.apiPrefix}/admin/orders`);
});
