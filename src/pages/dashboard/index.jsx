import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import KPICard from './components/KPICard';
import PortfolioChart from './components/PortfolioChart';
import TransactionVolumeChart from './components/TransactionVolumeChart';
import ComplianceMetrics from './components/ComplianceMetrics';
import RecentActivity from './components/RecentActivity';
import AlertsPanel from './components/AlertsPanel';
import SubscriptionStatus from './components/SubscriptionStatus';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock user subscription tier - in real app this would come from context/API
  const userSubscription = {
    tier: 'RegReady Ops Suite', // Starter, RegReady Ops Suite, Enterprise
    features: {
      advancedAnalytics: true,
      realTimeAlerts: true,
      customReports: true,
      apiAccess: true
    }
  };

  // KPI data with real-time updates simulation
  const [kpiData, setKpiData] = useState({
    totalAUM: { value: '$5.2M', change: '+12.5%', changeType: 'positive' },
    activeWallets: { value: '8', change: '+2', changeType: 'positive' },
    complianceScore: { value: '94%', change: '+2%', changeType: 'positive' },
    pendingTransactions: { value: '12', change: '-3', changeType: 'positive' }
  });

  useEffect(() => {
    // Simulate loading
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate real-time KPI updates
    const kpiInterval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        pendingTransactions: {
          ...prev.pendingTransactions,
          value: String(Math.floor(Math.random() * 20) + 5)
        }
      }));
    }, 30000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(timeInterval);
      clearInterval(kpiInterval);
    };
  }, []);

  const formatCurrentTime = () => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Loading Dashboard - VaultScope</title>
        </Helmet>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - VaultScope</title>
        <meta name="description" content="Crypto treasury operations dashboard with wallet management, compliance monitoring, and real-time analytics" />
      </Helmet>

      <SidebarNavigation />

      <div className="lg:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">{formatCurrentTime()}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Welcome back to VaultScope
                  </h2>
                  <p className="text-muted-foreground">
                    Your crypto treasury operations are running smoothly. 
                    {userSubscription.tier === 'Enterprise' && ' Enterprise features are active.'}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Icon name="TrendingUp" size={48} className="text-primary opacity-20" />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total AUM"
              value={kpiData.totalAUM.value}
              change={kpiData.totalAUM.change}
              changeType={kpiData.totalAUM.changeType}
              icon="DollarSign"
              loading={loading}
            />
            <KPICard
              title="Active Wallets"
              value={kpiData.activeWallets.value}
              change={kpiData.activeWallets.change}
              changeType={kpiData.activeWallets.changeType}
              icon="Wallet"
              loading={loading}
            />
            <KPICard
              title="Compliance Score"
              value={kpiData.complianceScore.value}
              change={kpiData.complianceScore.change}
              changeType={kpiData.complianceScore.changeType}
              icon="Shield"
              loading={loading}
            />
            <KPICard
              title="Pending Transactions"
              value={kpiData.pendingTransactions.value}
              change={kpiData.pendingTransactions.change}
              changeType={kpiData.pendingTransactions.changeType}
              icon="Clock"
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <PortfolioChart />
            <TransactionVolumeChart />
          </div>

          {/* Compliance Metrics - Only for RegReady and Enterprise tiers */}
          {(userSubscription.tier === 'RegReady Ops Suite' || userSubscription.tier === 'Enterprise') && (
            <div className="mb-8">
              <ComplianceMetrics />
            </div>
          )}

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="xl:col-span-2">
              <RecentActivity />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <AlertsPanel />
              <SubscriptionStatus />
            </div>
          </div>

          {/* Mobile-specific swipeable cards for small screens */}
          <div className="block md:hidden mt-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Stats</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 w-32 p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Active Alerts</div>
                  <div className="text-lg font-bold text-foreground">3</div>
                </div>
                <div className="flex-shrink-0 w-32 p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Last Sync</div>
                  <div className="text-lg font-bold text-foreground">2m ago</div>
                </div>
                <div className="flex-shrink-0 w-32 p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">API Status</div>
                  <div className="text-lg font-bold text-success">Online</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;