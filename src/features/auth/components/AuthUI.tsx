import type { ReactNode } from 'react';

export type Nav = (to: string) => void;
export type Role = 'farmer' | 'buyer' | 'collector' | 'admin';
export type IconName = 'drop' | 'arrow' | 'arrow-left' | 'arrow-right' | 'lock' | 'eye' | 'eye-off' | 'phone' | 'mail' | 'user' | 'users' | 'home' | 'pin' | 'truck' | 'cart' | 'farmer' | 'admin' | 'check' | 'calendar' | 'shield' | 'map' | 'building' | 'sparkle' | 'wifi-off' | 'info' | 'logout' | 'chevron' | 'key' | 'leaf' | 'milk';

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  const common = { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true as const };
  const content: Record<IconName, ReactNode> = {
    drop: <><path d="M12 2C9 6.7 5 10.2 5 14a7 7 0 0 0 14 0c0-3.8-4-7.3-7-12Z"/><path d="M8.5 15a3.5 3.5 0 0 0 3.5 3.5"/></>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
    'arrow-left': <><path d="M20 12H4m6 6-6-6 6-6"/></>,
    'arrow-right': <path d="m9 5 7 7-7 7"/>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    eye: <><path d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/></>,
    'eye-off': <><path d="m3 3 18 18M10 5.7c6-1.2 12 6.3 12 6.3a22 22 0 0 1-3.5 4M5.6 7.3A21 21 0 0 0 2 12s4 6.5 10 6.5c1.7 0 3.2-.4 4.6-1.2"/></>,
    phone: <><path d="M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M10 18h4"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-7 8-7s8 2 8 7"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M2 20c0-4.5 3-6.5 7-6.5s7 2 7 6.5M16 5.5c3 0 4 5 1 6M18 14c3 0 4 2.5 4 6"/></>,
    home: <><path d="m2 11 10-8 10 8M5 10v11h14V10M9 21v-7h6v7"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    truck: <><path d="M2 5h12v12H2zM14 9h4l4 5v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></>,
    cart: <><path d="M2 3h3l2 13h13l2-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></>,
    farmer: <><path d="M2 8h20M6 8l2-4h8l2 4M8 12a4 4 0 0 0 8 0M4 22v-2c0-4 4-6 8-6s8 2 8 6v2"/></>,
    admin: <><path d="m10 2-1 3-2 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 2 1 1 3h4l1-3 2-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-2-1-1-3Z"/><circle cx="12" cy="12" r="3.5"/></>,
    check: <path d="m4 12 5 5L20 6"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/></>,
    shield: <><path d="m12 2 9 4v6c0 5.5-4 8.3-9 10-5-1.7-9-4.5-9-10V6l9-4Z"/><path d="m8 12 3 3 5-6"/></>,
    map: <><path d="m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5ZM9 2v17M15 5v17"/></>,
    building: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2M10 21v-5h4v5"/></>,
    sparkle: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/></>,
    'wifi-off': <><path d="M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M9 16a4 4 0 0 1 6 0M3 3l18 18"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/></>,
    logout: <><path d="M10 4H4v16h6M15 7l5 5-5 5M9 12h11"/></>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    key: <><circle cx="8" cy="14" r="5"/><path d="m12 10 9-8v5h-4v4h-4"/></>,
    leaf: <><path d="M21 3C8 4 3 11 3 18c10 3 17-4 18-15ZM3 20c3-6 7-10 14-13"/></>,
    milk: <><path d="M8 3h8l1 4-2 3v11H9V10L7 7l1-4ZM9 13h6"/></>,
  };
  return <svg {...common}>{content[name]}</svg>;
}

export function Brand({ light = false }: { light?: boolean }) {
  return <div className={`ml-brand ${light ? 'ml-brand--light' : ''}`}>
    <span className="ml-brand-symbol"><Icon name="drop" size={31}/></span>
    <span className="ml-brand-name">Milk<span>Link</span><small>FARM TO MARKET</small></span>
  </div>;
}

export function ScreenHeader({ navigate, back, theme }: { navigate: Nav; back?: string; theme?: Role }) {
  return <header className={`ml-screen-header ml-screen-header--${theme || 'common'}`}>
    {back && <button type="button" className="ml-back" onClick={() => navigate(back)} aria-label="Go back"><Icon name="arrow-left" size={21}/></button>}
    <Brand/>
    <span className="ml-screen-header-spacer"/>
    <span className="ml-header-seal"><Icon name="drop" size={16}/></span>
  </header>;
}

export function PageFrame({ children, image, theme, navigate, back, pageClass = '' }: { children: ReactNode; image: string; theme: Role | 'common'; navigate: Nav; back?: string; pageClass?: string }) {
  return <main className={`ml-ui ml-theme-${theme} ${pageClass}`}>
    <div className="ml-mobile-container">
      <ScreenHeader navigate={navigate} back={back} theme={theme === 'common' ? undefined : theme}/>
      <div className="ml-visual-strip" style={{ backgroundImage: `linear-gradient(180deg,transparent 68%,rgba(255,255,255,.10)), url('${image}')` }} aria-hidden="true"/>
      {children}
    </div>
  </main>;
}

export function Field({ label, icon, placeholder, value, onChange, type = 'text', autoComplete, required = false, error, children }: { label: string; icon: IconName; placeholder?: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; required?: boolean; error?: string; children?: ReactNode }) {
  return <label className="ml-field"><span className="ml-field-label">{label} {required && <b aria-label="required">*</b>}</span><span className={`ml-field-shell ${error ? 'ml-field-shell--error' : ''}`}><Icon name={icon} size={20}/><input aria-invalid={!!error} placeholder={placeholder || label} autoComplete={autoComplete} value={value} onChange={e => onChange(e.target.value)} type={type} required={required}/>{children}</span>{error && <span className="ml-field-error">{error}</span>}</label>;
}

export function Button({ children, onClick, type = 'button', disabled = false, outline = false, className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button'|'submit'; disabled?: boolean; outline?: boolean; className?: string }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`ml-button ${outline ? 'ml-button--outline' : ''} ${className}`}>{children}</button>;
}

export function DemoDisclaimer() { return <p className="ml-demo-note"><Icon name="info" size={15}/> UI prototype • Sample data only • No backend connected</p>; }
