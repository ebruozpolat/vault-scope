import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock real-time alerts
  const mockAlerts = [
    {
      id: 1,
      type: 'high_risk',
      title: 'High Risk Transaction Detected',
      message: 'Transaction 0x7f2a...8b3c exceeds risk threshold (85%)',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      severity: 'high',
      status: 'active',
      transactionId: 'tx_001'
    },
    {
      id: 2,
      type: 'compliance_violation',
      title: 'Compliance Violation',
      message: 'Transaction from sanctioned address detected',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      severity: 'critical',
      status: 'active',
      transactionId: 'tx_002'
    },
    {
      id: 3,
      type: 'large_amount',
      title: 'Large Amount Alert',
      message: 'Transaction amount $125,000 exceeds daily threshold',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'medium',
      status: 'acknowledged',
      transactionId: 'tx_003'
    },
    {
      id: 4,
      type: 'unusual_pattern',
      title: 'Unusual Pattern Detected',
      message: 'Multiple small transactions from same wallet',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      severity: 'low',
      status: 'resolved',
      transactionId: 'tx_004'
    },
    {
      id: 5,
      type: 'wallet_connection',
      title: 'Wallet Connection Issue',
      message: 'BitGo wallet connection temporarily lost',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      severity: 'medium',
      status: 'resolved',
      transactionId: null
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = {
          id: Date.now(),
          type: 'monitoring',
          title: 'System Update',
          message: 'Transaction monitoring system updated successfully',
          timestamp: new Date(),
          severity: 'low',
          status: 'active',
          transactionId: null
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/10 text-error border-error/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-error text-error-foreground';
      case 'acknowledged':
        return 'bg-warning text-warning-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'high_risk':
        return 'AlertTriangle';
      case 'compliance_violation':
        return 'Shield';
      case 'large_amount':
        return 'DollarSign';
      case 'unusual_pattern':
        return 'TrendingUp';
      case 'wallet_connection':
        return 'Wifi';
      default:
        return 'Bell';
    }
  };

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action }
          : alert
      )
    );
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const displayAlerts = isExpanded ? alerts : alerts.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Real-time Alerts</h3>
          {activeAlerts.length > 0 && (
            <div className="w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
              {activeAlerts.length}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconSize={16}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {displayAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {displayAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start space-x-3">
                  {/* Alert Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border
                    ${getSeverityColor(alert.severity)}
                  `}>
                    <Icon name={getAlertIcon(alert.type)} size={16} />
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {alert.title}
                      </h4>
                      <span className={`
                        inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ml-2
                        ${getStatusColor(alert.status)}
                      `}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                      
                      {alert.status === 'active' && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleAlertAction(alert.id, 'acknowledged')}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleAlertAction(alert.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 5 && (
        <div className="p-3 border-t border-border bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : `View All ${alerts.length} Alerts`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertFeed;