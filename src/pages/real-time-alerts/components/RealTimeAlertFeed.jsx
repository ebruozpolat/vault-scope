import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeAlertFeed = ({ alerts, onAcknowledge, onResolve, isMonitoring }) => {
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());

  const toggleExpanded = (alertId) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
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

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          border: 'border-error/20',
          icon: 'AlertOctagon'
        };
      case 'high':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'AlertTriangle'
        };
      case 'medium':
        return {
          color: 'text-accent',
          bg: 'bg-accent/10',
          border: 'border-accent/20',
          icon: 'AlertCircle'
        };
      case 'low':
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted/50',
          border: 'border-border',
          icon: 'Info'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted/50',
          border: 'border-border',
          icon: 'Bell'
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          label: 'Active'
        };
      case 'acknowledged':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          label: 'Acknowledged'
        };
      case 'resolved':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          label: 'Resolved'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted/50',
          label: 'Unknown'
        };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'suspicious_activity':
        return 'Eye';
      case 'compliance_breach':
        return 'Shield';
      case 'threshold_breach':
        return 'TrendingUp';
      case 'suspicious_pattern':
        return 'Search';
      case 'system_alert':
        return 'Settings';
      default:
        return 'Bell';
    }
  };

  if (!isMonitoring) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Play" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Monitoring Inactive</h3>
        <p className="text-muted-foreground">
          Start monitoring to receive real-time alerts for suspicious transactions and security events.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-success animate-pulse" />
          <h3 className="text-lg font-semibold text-foreground">Live Alert Feed</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Alerts</h3>
            <p className="text-muted-foreground">
              All systems are running normally. New alerts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts?.map((alert) => {
              const severityConfig = getSeverityConfig(alert.severity);
              const statusConfig = getStatusConfig(alert.status);
              const isExpanded = expandedAlerts.has(alert.id);

              return (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-muted/30 transition-colors ${
                    alert.status === 'active' ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Severity Icon */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border
                      ${severityConfig.bg} ${severityConfig.border}
                    `}>
                      <Icon name={severityConfig.icon} size={20} className={severityConfig.color} />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            {alert.title}
                          </h4>
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${statusConfig.bg} ${statusConfig.color}
                          `}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          <button
                            onClick={() => toggleExpanded(alert.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                          >
                            <Icon 
                              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                              size={16} 
                              className="text-muted-foreground" 
                            />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {alert.message}
                      </p>

                      {/* Alert Meta */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <Icon name={getCategoryIcon(alert.category)} size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground capitalize">
                            {alert.category?.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Icon name="Tag" size={14} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {alert.type?.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className={`
                          inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
                          ${severityConfig.bg} ${severityConfig.color}
                        `}>
                          {alert.severity}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && alert.data && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <h5 className="text-xs font-semibold text-foreground mb-2">Alert Details</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(alert.data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace('_', ' ')}:
                                </span>
                                <span className="text-foreground font-medium">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {alert.status === 'active' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAcknowledge(alert.id)}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResolve(alert.id)}
                          >
                            Resolve
                          </Button>
                          {alert.actionRequired && (
                            <Button
                              variant="default"
                              size="sm"
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Acknowledgment/Resolution Info */}
                      {alert.status !== 'active' && (
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          <span>
                            {alert.status === 'acknowledged' ? 'Acknowledged' : 'Resolved'} by {alert.acknowledgedBy || alert.resolvedBy || 'System'}
                          </span>
                          <span>•</span>
                          <span>
                            {formatTimestamp(alert.acknowledgedAt || alert.resolvedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAlertFeed;