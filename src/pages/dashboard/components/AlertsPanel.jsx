import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import realTimeAlertingService from '../../../services/realTimeAlertingService';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertStats, setAlertStats] = useState({});

  useEffect(() => {
    // Subscribe to real-time alerts
    const handleNewAlert = (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 4)]); // Keep only latest 5 alerts
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

    // Event listeners
    realTimeAlertingService.on('new_alert', handleNewAlert);
    realTimeAlertingService.on('alert_acknowledged', handleAlertAcknowledged);
    realTimeAlertingService.on('alert_resolved', handleAlertResolved);

    // Initialize data
    setAlerts(realTimeAlertingService.getActiveAlerts().slice(0, 5));
    updateAlertStats();

    return () => {
      realTimeAlertingService.off('new_alert', handleNewAlert);
      realTimeAlertingService.off('alert_acknowledged', handleAlertAcknowledged);
      realTimeAlertingService.off('alert_resolved', handleAlertResolved);
    };
  }, []);

  const updateAlertStats = () => {
    setAlertStats(realTimeAlertingService.getAlertStats());
  };

  const getAlertConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: 'AlertOctagon',
          iconColor: 'text-error',
          iconBg: 'bg-error/10',
          borderColor: 'border-l-error'
        };
      case 'high':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-warning',
          iconBg: 'bg-warning/10',
          borderColor: 'border-l-warning'
        };
      case 'medium':
        return {
          icon: 'AlertCircle',
          iconColor: 'text-accent',
          iconBg: 'bg-accent/10',
          borderColor: 'border-l-accent'
        };
      case 'low':
        return {
          icon: 'Info',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/50',
          borderColor: 'border-l-border'
        };
      default:
        return {
          icon: 'Bell',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted',
          borderColor: 'border-l-border'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    realTimeAlertingService.acknowledgeAlert(id, 'current_user');
  };

  const dismissAlert = (id) => {
    realTimeAlertingService.resolveAlert(id, 'current_user');
  };

  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active').length;
  const activeCount = alerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Real-Time Alerts</h3>
          {activeCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-error">{activeCount} active</span>
            </div>
          )}
        </div>
        
        {criticalCount > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-error/10 rounded-lg">
            <Icon name="AlertOctagon" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">{criticalCount} critical</span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start real-time monitoring to receive alerts
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = getAlertConfig(alert.severity);
            return (
              <div 
                key={alert.id} 
                className={`
                  border-l-4 ${config.borderColor} bg-muted/20 rounded-r-lg p-4 
                  ${alert.status === 'active' ? 'bg-accent/5' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                    <Icon name={config.icon} size={16} className={config.iconColor} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${alert.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {alert.title}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {alert.actionRequired && alert.status === 'active' && (
                          <Button variant="outline" size="xs">
                            Take Action
                          </Button>
                        )}
                        {alert.status === 'active' && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                      
                      {alert.status === 'active' && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          aria-label="Resolve alert"
                        >
                          <Icon name="X" size={12} className="text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {alertStats.total || 0} total alerts • {alertStats.last24Hours || 0} in last 24h
          </div>
          <Link to="/real-time-alerts">
            <Button variant="ghost" size="sm">
              View all alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;