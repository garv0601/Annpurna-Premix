import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import './SalesOverview.css';

/**
 * Weekly sales overview chart card.
 */
export default function SalesOverview({ data }) {
  const [period, setPeriod] = useState('This Week');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="sales-tooltip">
          <p className="sales-tooltip-day">{label}</p>
          <p className="sales-tooltip-value">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
          {payload[1] && (
            <p className="sales-tooltip-orders">
              {payload[1].value} orders
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="sales-overview-card"
      id="sales-overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="sales-overview-header">
        <h3>Weekly Sales Overview</h3>
        <div className="sales-period-select">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="period-dropdown"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
          <ChevronDown size={14} className="period-chevron" />
        </div>
      </div>

      <div className="sales-chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B22222" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#B22222" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC300" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#FFC300" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(93, 64, 55, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7A5C4A', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7A5C4A', fontSize: 12 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#B22222"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#B22222', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#FFC300"
              strokeWidth={2}
              fill="url(#ordersGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#FFC300', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="sales-legend">
        <div className="legend-item">
          <span className="legend-dot legend-dot-sales" />
          <span>Sales (₹)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-dot-orders" />
          <span>Orders</span>
        </div>
      </div>
    </motion.div>
  );
}
