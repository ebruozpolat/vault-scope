import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertsTimeline = () => {
  const alerts = [
    {
      id: 1,
      type: 'high',
      title: 'Large Transaction Detected',
      description: 'Transaction of $75,000 USDC flagged for enhanced monitoring',
      timestamp: new Date('2024-12-14T10:30:00'),
      status: 'active',
      category: 'transaction'
    },
    {
      id: 2,
      type: 'medium',
      title: 'KYC Document Expiring',
      description: 'Customer ID verification expires in 7 days',
      timestamp: new Date('2024-12-14T09:15:00'),
      status: 'pending',
      category: 'kyc'
    },
    {
      id: 3,
      type: 'low',
      title: 'Compliance Report Generated',
      description: 'Monthly compliance report successfully created',
      timestamp: new Date('2024-12-14T08:45:00'),
      status: 'resolved',
      category: 'reporting'
    },
    {
      id: 4,
      type: 'high',
      title: 'Suspicious Pattern Alert',
      description: 'Unusual transaction pattern detected across multiple wallets',
      timestamp: new Date('2024-12-13T16:20:00'),
      status: 'investigating',
      category: 'monitoring'
    },
    {
      id: 5,
      type: 'medium',
      title: 'BOI Registry Update',
      description: 'Beneficial ownership information requires verification',
      timestamp: new Date('2024-12-13T14:10:00'),
      status: 'pending',
      category: 'regulatory'
    }
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'investigating': return 'text-accent bg-accent/10';
      case 'resolved': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transaction': return 'ArrowRightLeft';
      case 'kyc': return 'UserCheck';
      case 'reporting': return 'FileText';
      case 'monitoring': return 'Eye';
      case 'regulatory': return 'Shield';
      default: return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Alerts</h3>
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View All
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Latest compliance notifications and alerts</p>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div key={alert.id} className="relative">
            {/* Timeline line */}
            {index < alerts.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Alert icon */}
              <div className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${getAlertColor(alert.type)}
              `}>
                <Icon 
                  name={getCategoryIcon(alert.category)} 
                  size={16}
                />
              </div>

              {/* Alert content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-card-foreground">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${getStatusColor(alert.status)}
                    `}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Alert actions */}
                <div className="flex items-center space-x-2 mt-3">
                  {alert.status === 'active' && (
                    <>
                      <button className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                        Investigate
                      </button>
                      <span className="text-xs text-muted-foreground">•</span>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Dismiss
                      </button>
                    </>
                  )}
                  {alert.status === 'pending' && (
                    <button className="text-xs text-warning hover:text-warning/80 font-medium transition-colors">
                      Take Action
                    </button>
                  )}
                  {alert.status === 'resolved' && (
                    <span className="text-xs text-success font-medium">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsTimeline;