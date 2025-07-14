import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import ComplianceChecklist from './components/ComplianceChecklist';
import ComplianceScoreGauge from './components/ComplianceScoreGauge';
import AlertsTimeline from './components/AlertsTimeline';
import RegulatoryStatusCards from './components/RegulatoryStatusCards';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const ComplianceDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const subscriptionTier = 'RegReady'; // Mock subscription tier - would come from context/state

  const getFeatureAccess = (feature) => {
    const tierFeatures = {
      'Starter': ['basic-monitoring', 'simple-reports'],
      'RegReady': ['basic-monitoring', 'simple-reports', 'advanced-rules', 'boi-sync'],
      'VaultOps': ['basic-monitoring', 'simple-reports', 'advanced-rules', 'boi-sync', 'enterprise-controls', 'custom-compliance']
    };
    
    return tierFeatures[subscriptionTier]?.includes(feature) || false;
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      
      <div className="ml-16 lg:ml-60 transition-all duration-300">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Compliance Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor regulatory requirements and compliance metrics
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Subscription Tier Badge */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                <Icon name="Shield" size={14} />
                <span className="text-xs font-medium">{subscriptionTier} Plan</span>
              </div>
              
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Left Panel - Compliance Checklist */}
            <div className="col-span-12 lg:col-span-3">
              <ComplianceChecklist />
            </div>

            {/* Center Section */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              {/* Compliance Score Gauge */}
              <div className="h-80">
                <ComplianceScoreGauge />
              </div>

              {/* Alerts Timeline */}
              <div className="flex-1">
                <AlertsTimeline />
              </div>

              {/* Regulatory Status Cards */}
              <div className="mt-6">
                <RegulatoryStatusCards />
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {/* Upcoming Deadlines */}
              <div className="h-96">
                <UpcomingDeadlines />
              </div>

              {/* Quick Actions */}
              <div className="flex-1">
                <QuickActions />
              </div>
            </div>
          </div>

          {/* Feature Access Notice for Lower Tiers */}
          {subscriptionTier === 'Starter' && (
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-warning">Limited Compliance Features</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upgrade to RegReady or VaultOps for advanced compliance rules, BOI registry sync, and enterprise controls.
                  </p>
                  <button className="text-sm text-warning hover:text-warning/80 font-medium mt-2 transition-colors">
                    Upgrade Plan →
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ComplianceDashboard;