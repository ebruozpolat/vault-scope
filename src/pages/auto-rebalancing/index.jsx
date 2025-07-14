import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Button from '../../components/ui/Button';
import RebalancingStrategies from './components/RebalancingStrategies';
import RebalancingSettings from './components/RebalancingSettings';
import RebalancingHistory from './components/RebalancingHistory';
import RebalancingMonitor from './components/RebalancingMonitor';
import Icon from '../../components/AppIcon';

const AutoRebalancing = () => {
  const [activeTab, setActiveTab] = useState('strategies');
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalancingStatus, setRebalancingStatus] = useState({
    enabled: true,
    lastRebalance: '2025-01-10T14:30:00Z',
    nextRebalance: '2025-01-17T14:30:00Z',
    totalRebalances: 23,
    successRate: 96.5
  });

  const tabs = [
    { id: 'strategies', label: 'Strategies', icon: 'Target' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
    { id: 'monitor', label: 'Monitor', icon: 'Activity' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  const handleManualRebalance = async () => {
    setIsRebalancing(true);
    
    // Simulate rebalancing process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRebalancingStatus(prev => ({
        ...prev,
        lastRebalance: new Date().toISOString(),
        totalRebalances: prev.totalRebalances + 1
      }));
    } catch (error) {
      console.error('Rebalancing failed:', error);
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleToggleRebalancing = () => {
    setRebalancingStatus(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'strategies':
        return <RebalancingStrategies />;
      case 'settings':
        return <RebalancingSettings />;
      case 'monitor':
        return <RebalancingMonitor />;
      case 'history':
        return <RebalancingHistory />;
      default:
        return <RebalancingStrategies />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Auto-Rebalancing - VaultScope</title>
        <meta name="description" content="Automated portfolio rebalancing for crypto treasury management" />
      </Helmet>

      <SidebarNavigation />

      <div className="lg:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Auto-Rebalancing</h1>
              <p className="text-sm text-muted-foreground">
                Automatically maintain optimal portfolio allocation
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${rebalancingStatus.enabled ? 'bg-success' : 'bg-muted'}`} />
                <span className="text-sm font-medium text-foreground">
                  {rebalancingStatus.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last: {formatDate(rebalancingStatus.lastRebalance)}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Next: {formatDate(rebalancingStatus.nextRebalance)}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Success Rate: {rebalancingStatus.successRate}%
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleRebalancing}
                iconName={rebalancingStatus.enabled ? 'Pause' : 'Play'}
              >
                {rebalancingStatus.enabled ? 'Pause' : 'Resume'}
              </Button>
              
              <Button
                size="sm"
                onClick={handleManualRebalance}
                loading={isRebalancing}
                iconName="RefreshCw"
              >
                Manual Rebalance
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AutoRebalancing;