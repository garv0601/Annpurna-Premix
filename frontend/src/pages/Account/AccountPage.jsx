import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AccountSidebar from '../../components/account/AccountSidebar';
import ProfileCard from '../../components/account/ProfileCard';
import RecentOrders from '../../components/account/RecentOrders';
import QuickActions from '../../components/account/QuickActions';
import MaasTip from '../../components/account/MaasTip';
import AssistanceCard from '../../components/account/AssistanceCard';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="account-page-root" style={{
      minHeight: '100vh',
      background: '#FFF8F4',
      paddingTop: '64px', // account for global navbar
    }}>
      <div 
        id="account-layout"
        data-has-sidebar="true"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <AccountSidebar user={user} onSignOut={signOut} />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="account-content-area" style={{ padding: isMobile ? '16px' : 'clamp(24px, 4vw, 40px)', maxWidth: '1000px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Mobile Sidebar Navigation (Compact) */}
          {isMobile && (
            <div style={{ marginBottom: '32px' }}>
              <AccountSidebar user={user} onSignOut={signOut} isMobile={true} />
            </div>
          )}

          <motion.div
            variants={containerVariants}
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontFamily: "'Literata', Georgia, serif",
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 600,
                color: '#1C1007',
                marginBottom: '8px',
                marginTop: 0
              }}>
                Profile Overview
              </h1>
              <p style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '15px',
                color: '#5D4037',
                margin: 0
              }}>
                Manage your personal details and preferences.
              </p>
            </motion.div>

            {/* Dashboard Grid */}
            <div 
              id="account-grid"
              style={{
                display: 'grid',
                gap: '24px',
                // Desktop: 3 columns. Profile takes 1, Orders takes 2.
                // Row 2: Tip (1), Quick (1), Assistance (1)
              }}
            >
              {/* Row 1 */}
              <motion.div variants={itemVariants} style={{ gridArea: 'profile' }}>
                <ProfileCard user={user} />
              </motion.div>
              <motion.div variants={itemVariants} style={{ gridArea: 'orders' }}>
                <RecentOrders />
              </motion.div>

              {/* Row 2 */}
              <motion.div variants={itemVariants} style={{ gridArea: 'tip' }}>
                <MaasTip />
              </motion.div>
              <motion.div variants={itemVariants} style={{ gridArea: 'quick' }}>
                <QuickActions />
              </motion.div>
              <motion.div variants={itemVariants} style={{ gridArea: 'assistance' }}>
                <AssistanceCard />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        #account-grid {
          grid-template-columns: 1fr;
          grid-template-areas: 
            "profile"
            "orders"
            "quick"
            "tip"
            "assistance";
        }

        @media (min-width: 1024px) {
          #account-grid {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-areas: 
              "profile orders orders"
              "tip quick assistance";
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          #account-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas: 
              "profile orders"
              "quick assistance"
              "tip tip";
          }
        }
      `}</style>
    </div>
  );
}
