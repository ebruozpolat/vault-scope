import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionStatus = () => {
  // Mock subscription data - in real app this would come from context/API
  const subscription = {
    tier: 'RegReady Ops Suite',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: 1500,
    nextBilling: new Date('2025-01-14'),
    usage: {
      walletConnections: { used: 8, limit: 15 },
      complianceReports: { used: 12, limit: 50 },
      apiCalls: { used: 45000, limit: 100000 },
      storage: { used: 2.3, limit: 10 } // GB
    },
    addOns: [
      { name: 'Extra Wallet Connector', price: 100, active: true },
      { name: 'BOI Registry Sync', price: 200, active: true },
      { name: 'White-label Interface', price: 500, active: false }
    ]
  };

  const formatNextBilling = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const totalMonthlyAmount = subscription.amount + 
    subscription.addOns.filter(addon => addon.active).reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Subscription Status</h3>
          <p className="text-sm text-muted-foreground">Current plan and usage</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm font-medium text-success">{subscription.status}</span>
        </div>
      </div>

      {/* Plan Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{subscription.tier}</h4>
            <p className="text-xs text-muted-foreground">{subscription.billingCycle} billing</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">${totalMonthlyAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Next billing: {formatNextBilling(subscription.nextBilling)}
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Usage This Month</h4>
        
        {Object.entries(subscription.usage).map(([key, usage]) => {
          const percentage = getUsagePercentage(usage.used, usage.limit);
          const colorClass = getUsageColor(percentage);
          
          const labels = {
            walletConnections: 'Wallet Connections',
            complianceReports: 'Compliance Reports',
            apiCalls: 'API Calls',
            storage: 'Storage (GB)'
          };

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{labels[key]}</span>
                <span className="text-xs font-medium text-foreground">
                  {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              {percentage >= 75 && (
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={percentage >= 90 ? "AlertTriangle" : "AlertCircle"} 
                    size={12} 
                    className={percentage >= 90 ? "text-error" : "text-warning"}
                  />
                  <span className={`text-xs ${percentage >= 90 ? "text-error" : "text-warning"}`}>
                    {percentage >= 90 ? "Limit almost reached" : "Approaching limit"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Add-ons */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Active Add-ons</h4>
        
        {subscription.addOns.filter(addon => addon.active).length === 0 ? (
          <p className="text-xs text-muted-foreground">No active add-ons</p>
        ) : (
          <div className="space-y-2">
            {subscription.addOns.filter(addon => addon.active).map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-xs text-foreground">{addon.name}</span>
                <span className="text-xs font-medium text-foreground">+${addon.price}/mo</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link to="/subscription-management">
          <Button variant="outline" fullWidth>
            <Icon name="Settings" size={16} />
            Manage Subscription
          </Button>
        </Link>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm">
            <Icon name="Download" size={14} />
            Download Invoice
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="BarChart3" size={14} />
            Usage Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;