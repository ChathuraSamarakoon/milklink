import { useState, type FormEvent } from 'react';
import { PageFrame, Button, DemoDisclaimer, Field, Icon, type Nav } from '../components/AuthUI';
import './LoginPage.css';
import { sampleAccounts, signInMock } from '../components/mockAuth';

export default function LoginPage({ navigate }: { navigate: Nav }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();setError('');setLoading(true);
    try { const account = await signInMock(identifier, password); navigate(`/${account.role}`); }
    catch (err) {setError(err instanceof Error ? err.message : 'Login failed.');} finally { setLoading(false); }
  }
  return <PageFrame image="/images/login-milk.webp" theme="buyer" navigate={navigate} back="/" pageClass="ml-login-page">
    <section className="ml-sheet ml-login-sheet">
      <span className="ml-section-eyebrow"><Icon name="shield" size={15}/> Welcome back</span>
      <h1>Login to <span className="ml-login-wordmark">Milk<span>Link</span></span></h1><p className="ml-lead">Sign in to manage your milk orders and farm activity.</p>
      <form onSubmit={handleLogin} noValidate className="ml-form">
        <Field label="Email or Mobile Number" icon="mail" placeholder="you@example.com or 07XXXXXXXX" value={identifier} onChange={setIdentifier} required autoComplete="username"/>
        <Field label="Password" icon="lock" placeholder="Enter your password" value={password} onChange={setPassword} required type={showPassword ? 'text' : 'password'} autoComplete="current-password">
          <button type="button" className="ml-eye-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}><Icon name={showPassword ? 'eye-off' : 'eye'} size={20}/></button>
        </Field>
        <div className="ml-link-row"><span/><span className="ml-muted-hint">Password recovery requires backend integration</span></div>
        {error && <div className="ml-alert ml-alert--error" role="alert">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'} <Icon name="arrow" size={19}/></Button>
      </form>
      <div className="ml-or"><span/> OR TRY A DEMO ACCOUNT <span/></div>
      <div className="ml-demo-grid">{sampleAccounts.map(a => <button key={a.role} type="button" className={`ml-demo-account ml-demo-account--${a.role}`} onClick={() => { setIdentifier(a.email); setPassword(a.password);setError(''); }}><Icon name={a.role === 'buyer' ? 'cart' : a.role === 'collector' ? 'truck' : a.role} size={19}/><span>{a.role[0].toUpperCase() + a.role.slice(1)}</span></button>)}</div>
      <p className="ml-demo-hint">Demo password: <code>Demo@123</code> · Choose a role to autofill.</p>
      <p className="ml-switch-auth">New to MilkLink? <button onClick={() => navigate('/register')}>Create an account <Icon name="arrow" size={19}/></button></p>
      <DemoDisclaimer/>
    </section>
  </PageFrame>;
}
