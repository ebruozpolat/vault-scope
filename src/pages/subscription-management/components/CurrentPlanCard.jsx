import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanCard = ({ currentPlan, onUpgrade, onManageAddons }) => {
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const formatUsage = (used, total) => {
    if (total === 'Unlimited') return `${used.toLocaleString()} / Unlimited`;
    return `${used.toLocaleString()} / ${total.toLocaleString()}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-xl font-semibold text-foreground">{currentPlan.name}</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Current Plan
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-foreground">
              ${currentPlan.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              /{currentPlan.billingCycle}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Next billing: {currentPlan.nextBilling}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            onClick={onManageAddons}
          >
            Manage Add-ons
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ArrowUp"
            onClick={onUpgrade}
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentPlan.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name="Check" size={16} className="text-success flex-shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Usage This Month</h3>
        {currentPlan.usage.map((item, index) => {
          const percentage = item.total === 'Unlimited' ? 0 : (item.used / item.total) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {formatUsage(item.used, item.total)}
                </span>
              </div>
              {item.total !== 'Unlimited' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrentPlanCard;