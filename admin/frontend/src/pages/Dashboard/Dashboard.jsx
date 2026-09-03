import React from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  ShoppingBag,
  UserPlus,
  Box,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/dashboard/StatCard';
import SalesOverview from '../../components/dashboard/SalesOverview';
import LowStockAlert from '../../components/dashboard/LowStockAlert';
import TopSellingItems from '../../components/dashboard/TopSellingItems';
import RecentOrders from '../../components/dashboard/RecentOrders';
import './Dashboard.css';

export default function Dashboard() {
  const { stats, weeklySales, lowStock, topSelling, recentOrders, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-page"
      id="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── KPI Cards ── */}
      <section className="dashboard-kpis">
        <StatCard
          icon={<IndianRupee size={22} />}
          iconBg="bg-red"
          label="Total Sales"
          value={`₹${stats.totalSales.toLocaleString('en-IN')}`}
          trend={`${stats.salesTrendPercent}% from last week`}
          trendType="up"
          delay={0.05}
        />
        <StatCard
          icon={<ShoppingBag size={22} />}
          iconBg="bg-yellow"
          label="Total Orders"
          value={stats.totalOrders.toLocaleString('en-IN')}
          trend={`${stats.ordersTrendPercent}% from last week`}
          trendType="up"
          delay={0.12}
        />
        <StatCard
          icon={<UserPlus size={22} />}
          iconBg="bg-green"
          label="New Customers"
          value={stats.newCustomers}
          trend="Steady growth"
          trendType="steady"
          delay={0.19}
        />
        <StatCard
          icon={<Box size={22} />}
          iconBg="bg-brown"
          label="Active Products"
          value={stats.activeProducts}
          trend={`${stats.productsNeedingAttention} require attention`}
          trendType="warning"
          delay={0.26}
        />
      </section>

      {/* ── Middle Row: Chart + Side Cards ── */}
      <section className="dashboard-middle">
        <div className="dashboard-chart-col">
          <SalesOverview data={weeklySales} />
        </div>
        <div className="dashboard-side-col">
          <LowStockAlert products={lowStock} />
          <TopSellingItems products={topSelling} />
        </div>
      </section>

      {/* ── Recent Orders ── */}
      <section className="dashboard-orders">
        <RecentOrders orders={recentOrders} />
      </section>
    </motion.div>
  );
}
