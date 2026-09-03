import React from 'react';
import { CheckCircle2, Truck, XCircle, Clock, Package, RotateCcw } from 'lucide-react';

const STATUS_CONFIG = {
  'delivered': {
    label: 'Delivered',
    bg: '#2F8B57',
    textColor: '#FFF',
    icon: CheckCircle2
  },
  'in-transit': {
    label: 'In Transit',
    bg: '#FFC300',
    textColor: '#3D2B1F',
    icon: Truck
  },
  'shipped': {
    label: 'Shipped',
    bg: '#F59E0B',
    textColor: '#3D2B1F',
    icon: Truck
  },
  'processing': {
    label: 'Processing',
    bg: '#3B82F6',
    textColor: '#FFF',
    icon: Package
  },
  'confirmed': {
    label: 'Confirmed',
    bg: '#10B981',
    textColor: '#FFF',
    icon: CheckCircle2
  },
  'pending': {
    label: 'Pending',
    bg: '#D97706',
    textColor: '#FFF',
    icon: Clock
  },
  'cancelled': {
    label: 'Cancelled',
    bg: '#B22222',
    textColor: '#FFF',
    icon: XCircle
  },
  'refunded': {
    label: 'Refunded',
    bg: '#6B7280',
    textColor: '#FFF',
    icon: RotateCcw
  },
};


export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#E5E7EB',
    textColor: '#374151',
    icon: null
  };

  const Icon = config.icon;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: config.bg,
      color: config.textColor,
      padding: '4px 12px',
      borderRadius: '24px',
      fontFamily: "'Be Vietnam Pro', sans-serif",
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {config.label}
    </div>
  );
}
