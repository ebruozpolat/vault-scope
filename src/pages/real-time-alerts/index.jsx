import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import realTimeAlertingService from '../../services/realTimeAlertingService';
import AlertConfigurationPanel from './components/AlertConfigurationPanel';
import AlertStatistics from './components/AlertStatistics';
import RealTimeAlertFeed from './components/RealTimeAlertFeed';
import AlertThresholdSettings from './components/AlertThresholdSettings';

const RealTimeAlerts = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertStats, setAlertStats] = useState({});
  const [selectedTab, setSelectedTab] = useState('feed');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Subscribe to real-time alerts
    const handleNewAlert = (alert) => {
      setAlerts(prev => [alert, ...prev]);
      updateAlertStats();
    };

    const handleAlertAcknowledged = (alert) => {
      setAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));
      updateAlertStats();
    };

    const handleAlertResolved = (alert) => {
      setAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));
      updateAlertStats();
    };

    const handleMonitoringStarted = () => {
      setIsMonitoring(true);
    };

    const handleMonitoringStopped = () => {
      setIsMonitoring(false);
    };

    // Event listeners
    realTimeAlertingService.on('new_alert', handleNewAlert);
    realTimeAlertingService.on('alert_acknowledged', handleAlertAcknowledged);
    realTimeAlertingService.on('alert_resolved', handleAlertResolved);
    realTimeAlertingService.on('monitoring_started', handleMonitoringStarted);
    realTimeAlertingService.on('monitoring_stopped', handleMonitoringStopped);

    // Initialize data
    setAlerts(realTimeAlertingService.getActiveAlerts());
    updateAlertStats();

    return () => {
      realTimeAlertingService.off('new_alert', handleNewAlert);
      realTimeAlertingService.off('alert_acknowledged', handleAlertAcknowledged);
      realTimeAlertingService.off('alert_resolved', handleAlertResolved);
      realTimeAlertingService.off('monitoring_started', handleMonitoringStarted);
      realTimeAlertingService.off('monitoring_stopped', handleMonitoringStopped);
    };
  }, []);

  const updateAlertStats = () => {
    setAlertStats(realTimeAlertingService.getAlertStats());
  };

  const handleStartMonitoring = () => {
    realTimeAlertingService.startMonitoring();
  };

  const handleStopMonitoring = () => {
    realTimeAlertingService.stopMonitoring();
  };

  const handleAcknowledgeAlert = (alertId) => {
    realTimeAlertingService.acknowledgeAlert(alertId, 'current_user');
  };

  const handleResolveAlert = (alertId) => {
    realTimeAlertingService.resolveAlert(alertId, 'current_user');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || alert.category === filterCategory;
    const matchesSearch = !searchTerm || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesCategory && matchesSearch;
  });

  const tabs = [
    { id: 'feed', label: 'Alert Feed', icon: 'Bell' },
    { id: 'statistics', label: 'Statistics', icon: 'BarChart3' },
    { id: 'configuration', label: 'Configuration', icon: 'Settings' },
    { id: 'thresholds', label: 'Thresholds', icon: 'Sliders' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'suspicious_activity', label: 'Suspicious Activity' },
    { value: 'compliance_breach', label: 'Compliance Breach' },
    { value: 'threshold_breach', label: 'Threshold Breach' },
    { value: 'suspicious_pattern', label: 'Suspicious Pattern' },
    { value: 'system_alert', label: 'System Alert' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Real-Time Alerts</h1>
            <p className="text-muted-foreground mt-2">
              Monitor on-chain activity and receive instant alerts for suspicious transactions, policy breaches, and threshold triggers
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
              <span className="text-sm font-medium text-foreground">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
              </span>
            </div>
            
            {isMonitoring ? (
              <Button 
                onClick={handleStopMonitoring}
                variant="destructive"
                iconName="Square"
                iconSize={16}
              >
                Stop Monitoring
              </Button>
            ) : (
              <Button 
                onClick={handleStartMonitoring}
                iconName="Play"
                iconSize={16}
              >
                Start Monitoring
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-foreground">{alertStats?.active || 0}</p>
              </div>
              <Icon name="AlertTriangle" size={24} className="text-warning" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-error">{alertStats?.critical || 0}</p>
              </div>
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last 24 Hours</p>
                <p className="text-2xl font-bold text-foreground">{alertStats?.last24Hours || 0}</p>
              </div>
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{alertStats?.total || 0}</p>
              </div>
              <Icon name="Bell" size={24} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${selectedTab === tab.id 
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === 'feed' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      iconName="Search"
                      iconSize={16}
                    />
                  </div>
                  
                  <Select
                    options={severityOptions}
                    value={filterSeverity}
                    onValueChange={setFilterSeverity}
                    placeholder="Filter by severity"
                  />
                  
                  <Select
                    options={categoryOptions}
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                    placeholder="Filter by category"
                  />
                </div>
              </div>

              {/* Alert Feed */}
              <RealTimeAlertFeed
                alerts={filteredAlerts}
                onAcknowledge={handleAcknowledgeAlert}
                onResolve={handleResolveAlert}
                isMonitoring={isMonitoring}
              />
            </div>
          )}

          {selectedTab === 'statistics' && (
            <AlertStatistics alertStats={alertStats} />
          )}

          {selectedTab === 'configuration' && (
            <AlertConfigurationPanel />
          )}

          {selectedTab === 'thresholds' && (
            <AlertThresholdSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlerts;