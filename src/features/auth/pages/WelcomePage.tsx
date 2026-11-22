import './WelcomePage.css';
import { Brand, Button, DemoDisclaimer, Icon, type Nav } from '../components/AuthUI';

export default function WelcomePage({ navigate }: { navigate: Nav }) {
  return <main className="ml-ui ml-theme-farmer ml-welcome">
    <div className="ml-mobile-container ml-welcome-layout">
      <div className="ml-welcome-header"><Brand/><span className="ml-live-chip"><span/> Made for Sri Lankan dairy</span></div>
      <section className="ml-welcome-hero">
        <div className="ml-welcome-art" role="img" aria-label="Dairy cows on a lush Sri Lankan hillside" />
        <div className="ml-welcome-art-shade" />
        <div className="ml-welcome-text"><span className="ml-kicker"><Icon name="leaf" size={17}/> MILKLINK PLATFORM</span><h1>Connecting <em>farmers, buyers</em> and collectors.</h1><p>A simpler way to discover nearby milk suppliers and manage fresh milk orders — together.</p></div>
        <svg className="ml-welcome-wave" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true"><path fill="#7cd32c" d="M0 80C180 0 240 130 580 65S870 0 1000 15V110H0Z"/><path fill="white" d="M0 100C110 5 220 125 560 80S840 20 1000 45V110H0Z"/></svg>
      </section>
      <section className="ml-welcome-bottom">
        <div className="ml-benefits"><span><Icon name="pin" size={17}/> Nearby farmers</span><span><Icon name="milk" size={17}/> Fresh milk</span><span><Icon name="wifi-off" size={17}/> Offline-friendly</span></div>
        <div className="ml-dots" aria-hidden="true"><span className="active"/><span/><span/></div>
        <Button onClick={() => navigate('/register')}>Get Started <Icon name="arrow" size={21}/></Button>
        <p className="ml-switch-auth">Already have an account? <button onClick={() => navigate('/login')}>Log in</button></p>
        <DemoDisclaimer/>
      </section>
    </div>
  </main>;
}
