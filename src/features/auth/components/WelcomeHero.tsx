import { Brand, Icon } from './AuthUI';

interface WelcomeHeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function WelcomeHero({
  title = 'Connecting farmers, buyers and collectors.',
  subtitle = 'Sri Lanka’s modern dairy marketplace for discovering fresh milk, transparent farm prices, and reliable daily pickups.',
  image = '/images/welcome-pasture.webp',
}: WelcomeHeroProps) {
  return (
    <section className="ml-welcome-hero-banner">
      <div
        className="ml-welcome-hero-backdrop"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label="Lush Sri Lankan dairy pasture"
      />
      <div className="ml-welcome-hero-overlay" />

      <div className="ml-welcome-hero-content">
        <div className="ml-welcome-brand-badge">
          <Brand light />
          <span className="ml-platform-pill">
            <Icon name="leaf" size={15} /> Made for Sri Lankan Dairy
          </span>
        </div>

        <h1 className="ml-welcome-headline">{title}</h1>
        <p className="ml-welcome-subheadline">{subtitle}</p>

        <div className="ml-welcome-feature-ribbon">
          <div className="ml-feature-item">
            <span className="ml-feature-icon">
              <Icon name="pin" size={16} />
            </span>
            <span>Nearby Farms</span>
          </div>
          <div className="ml-feature-item">
            <span className="ml-feature-icon">
              <Icon name="milk" size={16} />
            </span>
            <span>Verified Fresh Milk</span>
          </div>
          <div className="ml-feature-item">
            <span className="ml-feature-icon">
              <Icon name="wifi-off" size={16} />
            </span>
            <span>Offline-Ready PWA</span>
          </div>
        </div>
      </div>

      <svg className="ml-welcome-wave" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#e0f2fe" opacity="0.5" d="M0 60C200 10 320 80 600 45S880 15 1000 35V90H0Z" />
        <path fill="#ffffff" d="M0 70C150 20 280 85 580 50S850 25 1000 45V90H0Z" />
      </svg>
    </section>
  );
}
