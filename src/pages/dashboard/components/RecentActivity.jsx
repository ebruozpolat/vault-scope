import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'wallet_connected',
      title: 'Wallet Connected',
      description: 'MetaMask wallet successfully connected',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: 'Wallet',
      iconColor: 'text-success',
      iconBg: 'bg-success/10'
    },
    {
      id: 2,
      type: 'transaction',
      title: 'Large Transaction',
      description: 'Outbound transfer of 50,000 USDC to 0x742d...35B2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: 'ArrowUpRight',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10'
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Compliance Report Generated',
      description: 'Monthly AML report for December 2024 completed',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: 'Shield',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Risk Alert',
      description: 'Suspicious transaction pattern detected',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      icon: 'AlertTriangle',
      iconColor: 'text-error',
      iconBg: 'bg-error/10'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      description: 'Compliance engine updated to version 2.1.4',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'Settings',
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted'
    },
    {
      id: 6,
      type: 'transaction',
      title: 'Transaction Approved',
      description: 'Inbound transfer of 25 ETH approved and processed',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: 'ArrowDownLeft',
      iconColor: 'text-success',
      iconBg: 'bg-success/10'
    }
  ];

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Transactions', value: 'transaction' },
    { label: 'Compliance', value: 'compliance' },
    { label: 'Alerts', value: 'alert' },
    { label: 'System', value: 'system' }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

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

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest system events and transactions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === filterOption.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activities found for this filter</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}>
                <Icon name={activity.icon} size={16} className={activity.iconColor} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;