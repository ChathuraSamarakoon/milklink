import React from 'react';
import { Trees, ShoppingCart, Truck, Shield, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { UserRole, UserStatus } from '../types';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const config = {
    farmer: {
      label: 'Farmer',
      sinhala: 'ගොවි',
      icon: <Trees size={size === 'sm' ? 12 : 14} />,
      bg: '#ecfdf5',
      color: '#065f46',
      border: '#a7f3d0',
    },
    buyer: {
      label: 'Buyer',
      sinhala: 'ගැනුම්කරු',
      icon: <ShoppingCart size={size === 'sm' ? 12 : 14} />,
      bg: '#fdf2f8',
      color: '#9d174d',
      border: '#fbcfe8',
    },
    collector: {
      label: 'Collector',
      sinhala: 'එකතු කරන්නා',
      icon: <Truck size={size === 'sm' ? 12 : 14} />,
      bg: '#f0f9ff',
      color: '#0369a1',
      border: '#bae6fd',
    },
    admin: {
      label: 'Admin',
      sinhala: 'පරිපාලක',
      icon: <Shield size={size === 'sm' ? 12 : 14} />,
      bg: '#f8fafc',
      color: '#1e293b',
      border: '#cbd5e1',
    },
  }[role];

  return (
    <span
      className={`role-badge role-${role} size-${size} ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.border,
      }}
      title={`${config.label} (${config.sinhala})`}
    >
      {showIcon && <span className="role-badge-icon" aria-hidden="true">{config.icon}</span>}
      <span className="role-badge-label">{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const config = {
    active: {
      label: 'Active',
      icon: <CheckCircle2 size={13} />,
      bg: '#ecfdf5',
      color: '#047857',
      border: '#6ee7b7',
    },
    disabled: {
      label: 'Disabled',
      icon: <XCircle size={13} />,
      bg: '#fef2f2',
      color: '#b91c1c',
      border: '#fca5a5',
    },
    pending: {
      label: 'Pending',
      icon: <AlertCircle size={13} />,
      bg: '#fffbeb',
      color: '#b45309',
      border: '#fcd34d',
    },
  }[status];

  return (
    <span
      className={`status-badge status-${status} size-${size} ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.border,
      }}
    >
      <span className="status-badge-icon" aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default RoleBadge;
