import { useNavigate } from 'react-router-dom';
import WelcomeHero from '../components/WelcomeHero';
import RoleIntroCard, { ROLES_LIST } from '../components/RoleIntroCard';
import PrimaryCTA from '../components/PrimaryCTA';
import { DemoDisclaimer, Icon } from '../components/AuthUI';
import './WelcomePage.css';
import './AuthPages.css';

export default function WelcomePage({ navigate: navigateProp }: { navigate?: (to: string) => void }) {
  const routerNavigate = useNavigate();
  const navigate = navigateProp || routerNavigate;

  return (
    <main className="ml-ui ml-theme-common ml-welcome-v2">
      {/* 01: Hero with MilkLink drop logo, welcome headline & purpose statement */}
      <WelcomeHero
        title="Connecting farmers, buyers and collectors."
        subtitle="Sri Lanka’s modern dairy milk marketplace for direct trade, transparent daily pricing, and fast local pickups."
        image="/images/welcome-pasture.webp"
      />

      <div className="ml-welcome-body">
        {/* Product Intro */}
        <section className="ml-product-intro-box">
          <h2>Marketplace Overview</h2>
          <p>
            MilkLink simplifies the Sri Lankan dairy supply chain by connecting local dairy producers directly with milk buyers, processors, and field collectors.
          </p>
        </section>

        {/* 01: Farmer / Buyer / Collector role explainer cards */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Choose your role on MilkLink
            </h2>
            <span className="text-xs text-slate-500">3 Participant Roles</span>
          </div>

          <div className="ml-role-cards-container">
            {ROLES_LIST.map((roleInfo) => (
              <RoleIntroCard
                key={roleInfo.role}
                roleInfo={roleInfo}
                onSelect={(role) => navigate(`/register/${role}`)}
              />
            ))}
          </div>
        </section>

        {/* 03: Constraint: Do not show admin public registration */}
        <div className="ml-admin-exclusion-banner" role="note">
          <Icon name="shield" size={18} />
          <span>
            <strong>Public registration:</strong> Open for Dairy Farmers, Milk Buyers, and Milk Collectors only. Administrator accounts are restricted and managed internally.
          </span>
        </div>

        {/* 02: Primary CTAs & Navigation Actions */}
        <div className="ml-welcome-actions">
          <PrimaryCTA
            onClick={() => navigate('/register')}
            icon="arrow"
            iconPosition="right"
          >
            Get Started — Select Role
          </PrimaryCTA>

          <p className="ml-switch-auth">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')}>
              Log in to your account
            </button>
          </p>
        </div>

        <DemoDisclaimer />
      </div>
    </main>
  );
}
