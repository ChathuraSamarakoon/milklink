import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import '../features/buyer/buyer.css';

export default function BuyerLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="ml-buyer-layout">
      {children || <Outlet />}
    </div>
  );
}
