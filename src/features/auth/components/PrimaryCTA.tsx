import type { ReactNode } from 'react';
import { Icon, type IconName } from './AuthUI';
import '../pages/AuthPages.css';

interface PrimaryCTAProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  className?: string;
}

export default function PrimaryCTA({
  children,
  onClick,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  disabled = false,
  type = 'button',
  fullWidth = true,
  className = '',
}: PrimaryCTAProps) {
  const baseClass = 'ml-button';
  const variantClass = variant === 'outline' ? 'ml-button--outline' : variant === 'secondary' ? 'ml-button--secondary' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${widthClass} ${className}`.trim()}
    >
      {icon && iconPosition === 'left' && <Icon name={icon} size={20} />}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} size={20} />}
    </button>
  );
}
