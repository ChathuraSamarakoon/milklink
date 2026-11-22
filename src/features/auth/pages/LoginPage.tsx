import { useState, type FormEvent } from 'react';
import './LoginPage.css';

type IconName = 'phone' | 'lock' | 'eye' | 'eye-off' | 'farmer' | 'buyer' | 'collector' | 'admin' | 'arrow' | 'user' | 'offline';

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 4h4M11 19h2" /></>,
    lock: <><rect x="4" y="10" width="16" height="12" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3M12 15v3" /><circle cx="12" cy="15" r=".7" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    'eye-off': <><path d="m3 3 18 18M10 5.2c6-1.3 12 6.8 12 6.8a22 22 0 0 1-4 4.7M6.3 6.3A24 24 0 0 0 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3" /></>,
    farmer: <><path d="M3 8h18M7 8l1-5h8l1 5M8 11a4 4 0 0 0 8 0M5 22v-2a7 7 0 0 1 14 0v2Z" /><path d="m9 16 3 4 3-4" /></>,
    buyer: <><path d="M2 3h4l3 13h11l3-10H7M10 20h.01M19 20h.01" /><circle cx="10" cy="20" r="1.3" /><circle cx="19" cy="20" r="1.3" /></>,
    collector: <><path d="M2 4h13v14H2zM15 8h4l4 5v5h-8" /><circle cx="6" cy="19" r="2" /><circle cx="19" cy="19" r="2" /></>,
    admin: <><path d="m10 2-.8 3-2 .9-2.8-.8-2 3.4L4.5 11v2l-2.1 2.5 2 3.4 2.8-.8 2 .9.8 3h4l.8-3 2-.9 2.8.8 2-3.4-2.1-2.5v-2l2.1-2.5-2-3.4-2.8.8-2-.9L14 2Z" /><circle cx="12" cy="12" r="4" /></>,
    arrow: <path d="M3 12h18m-7-7 7 7-7 7" />,
    user: <><circle cx="9" cy="6" r="4" /><path d="M1 22v-3a8 8 0 0 1 16 0v3M20 8v8M16 12h8" /></>,
    offline: <><path d="M2 7a16 16 0 0 1 20 0M5 11a11 11 0 0 1 13 0M9 15a5 5 0 0 1 5 0M3 2l19 20" /><circle cx="12" cy="20" r="1" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return <div className="brand" aria-label="MilkLink — Connect dairy farmers and buyers">
    <div className="brand-row">
      <svg className="brand-mark" viewBox="0 0 100 130" aria-hidden="true">
        <defs><linearGradient id="drop" x2=".2" y2="1"><stop stopColor="#16916c" /><stop offset="1" stopColor="#00627a" /></linearGradient></defs>
        <path d="M50 2C40 16 3 57 3 85a47 43 0 0 0 94 0C97 57 60 16 50 2Z" fill="url(#drop)" />
        <g fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="m46 58-12-7c-17-7-28 14-15 24l13 10m25-29 8-5c17-8 30 14 16 25L67 87M39 69l13-11 17 17c6 6-1 12-6 7l-9-8m8 9c5 6-2 11-7 6l-7-7m7 8c4 5-3 10-7 6l-5-5m4 4c1 5-5 8-9 4L27 88c-5-5 1-11 6-7l8 8" /></g>
        <path d="M19 111c7-19 18 7 31 3 15-3 22-15 33-4-16 19-47 21-64 1" fill="white" />
      </svg>
      <div className="wordmark"><span>Milk</span><span>Link</span><svg viewBox="0 0 210 25" aria-hidden="true"><path d="M2 24Q125-16 208 10Q120 2 2 24" fill="#1a9d0b" /></svg></div>
    </div>
    <p>Connect dairy farmers and buyers</p>
  </div>;
}

const roles = ['Farmer', 'Buyer', 'Collector', 'Admin'] as const;

export default function LoginPage() {
  const [role, setRole] = useState<(typeof roles)[number]>('Farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(`${role} sign-in is ready for backend connection.`);
  }

  return <main className="login-page">
    <header className="login-hero"><img className="farm-illustration" src="/images/login-farm.png" alt="A dairy farmer and buyer sharing a milk can on a lush Sri Lankan farm" /><Brand /></header>
    <section className="login-card" aria-labelledby="login-heading">
      <div className="login-heading"><h1 id="login-heading">Welcome back</h1><p>Sign in to continue</p></div>
      <form onSubmit={submit}>
        <label className="input-field"><Icon name="phone" /><span className="sr-only">Mobile Number or Email</span><input name="identifier" autoComplete="username" placeholder="Mobile Number or Email" required /></label>
        <label className="input-field password-field"><Icon name="lock" /><span className="sr-only">Password</span><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}><Icon name={showPassword ? 'eye-off' : 'eye'} /></button></label>
        <div className="forgot-row"><button className="text-button" type="button" onClick={() => setNotice('Password recovery will be available when account services are connected.')}>Forgot Password?</button></div>
        <fieldset className="role-fieldset"><legend>Select Your Role</legend><div className="role-options">{roles.map(item => <button key={item} type="button" className={`role-option ${role === item ? 'selected' : ''}`} aria-pressed={role === item} onClick={() => { setRole(item); setNotice(''); }}><Icon name={item.toLowerCase() as IconName} /><span>{item}</span>{role === item && <span className="role-check" aria-hidden="true">✓</span>}</button>)}</div></fieldset>
        <button type="submit" className="login-button"><span>Login / <span lang="si">පිවිසෙන්න</span></span><Icon name="arrow" /></button>
        <button type="button" className="create-button" onClick={() => setNotice('Account registration pages are ready to be designed.')}><Icon name="user" /><span>Create Account</span></button>
        {notice && <p className="form-notice" role="status">{notice}</p>}
      </form>
      <footer className="login-footer"><Icon name="offline" /><p>Mobile-first PWA <span aria-hidden="true">•</span> Offline support for Farmer &amp; Collector</p></footer>
    </section>
    <svg className="pasture-waves" viewBox="0 0 941 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 13C74 19 132 104 267 100S428 37 556 64 733 39 827 66L941 90V140H0Z" fill="#91cece" /><path d="M0 110C169 114 291 114 406 74S587 68 674 93 831 38 941 38V140H0Z" fill="#8bc78b" /><path d="M0 120C82 86 123 123 182 111S269 128 359 130 566 81 681 101 860 108 941 124V140H0Z" fill="#fffefa" /><path d="M0 116c37-16 77-5 59-29S24 65 33 49c12-18 31 7 36 22s28 35 41 29 5-12 1-17c-8-15 16-18 15-2-4 18 17 36 45 27 16-4 22-22 27-35s25-12 22 1-24 22-14 31 20-1 27-16 34-19 41-6-20 19-26 27 2 19 16 24L0 140Z" fill="#fffefa" /></svg>
  </main>;
}
