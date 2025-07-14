import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceMetrics = () => {
  const metrics = [
    {
      id: 1,
      title: 'Compliance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Shield',
      description: 'Transactions meeting compliance standards'
    },
    {
      id: 2,
      title: 'Pending Reviews',
      value: '23',
      change: '-5',
      changeType: 'positive',
      icon: 'Clock',
      description: 'Transactions awaiting manual review'
    },
    {
      id: 3,
      title: 'Risk Score Avg',
      value: '32.5',
      change: '-4.2',
      changeType: 'positive',
      icon: 'TrendingDown',
      description: 'Average risk score across all transactions'
    },
    {
      id: 4,
      title: 'Violations',
      value: '2',
      change: '+1',
      changeType: 'negative',
      icon: 'AlertTriangle',
      description: 'Active compliance violations'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Compliance rule updated',
      description: 'AML threshold increased to $10,000',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'rule_update'
    },
    {
      id: 2,
      action: 'Violation resolved',
      description: 'Transaction 0x7f2a...8b3c cleared after review',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'resolution'
    },
    {
      id: 3,
      action: 'New alert rule created',
      description: 'High-frequency trading pattern detection',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'rule_creation'
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'rule_update':
        return 'Settings';
      case 'resolution':
        return 'CheckCircle';
      case 'rule_creation':
        return 'Plus';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Compliance Metrics</h3>
        </div>
        <div className="p-4 space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Icon name={metric.icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{metric.title}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                <p className={`text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Transaction Volume (24h)</h3>
        </div>
        <div className="p-4">
          <div className="h-32 bg-muted/30 rounded-lg flex items-end justify-between px-2 py-2">
            {[65, 45, 78, 52, 89, 67, 43, 76, 58, 82, 71, 94].map((height, index) => (
              <div
                key={index}
                className="bg-primary rounded-t flex-1 mx-0.5 transition-all duration-300 hover:bg-primary/80"
                style={{ height: `${height}%` }}
                title={`Hour ${index + 1}: ${height}% of max volume`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={getActivityIcon(activity.type)} size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted/30 rounded-lg transition-colors">
            <Icon name="Plus" size={16} className="text-accent" />
            <span className="text-sm text-foreground">Create Alert Rule</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted/30 rounded-lg transition-colors">
            <Icon name="Download" size={16} className="text-accent" />
            <span className="text-sm text-foreground">Export Compliance Report</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-muted/30 rounded-lg transition-colors">
            <Icon name="Settings" size={16} className="text-accent" />
            <span className="text-sm text-foreground">Configure Thresholds</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMetrics;