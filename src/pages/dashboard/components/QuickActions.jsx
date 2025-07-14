import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Connect Wallet',
      description: 'Add new wallet or custodian connection',
      icon: 'Wallet',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      action: () => {
        // In real app, this would open wallet connection modal
        console.log('Opening wallet connection modal');
      },
      primary: true
    },
    {
      title: 'Generate Report',
      description: 'Create compliance or treasury report',
      icon: 'FileText',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      link: '/compliance-dashboard',
      primary: false
    },
    {
      title: 'View Alerts',
      description: 'Check pending alerts and notifications',
      icon: 'Bell',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      action: () => {
        // In real app, this would open alerts panel
        console.log('Opening alerts panel');
      },
      primary: false,
      badge: 3
    },
    {
      title: 'Transaction Monitor',
      description: 'Monitor real-time transaction flows',
      icon: 'Activity',
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
      link: '/transaction-monitoring',
      primary: false
    }
  ];

  const handleAction = (actionItem) => {
    if (actionItem.action) {
      actionItem.action();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const ActionComponent = action.link ? Link : 'button';
          const actionProps = action.link 
            ? { to: action.link }
            : { onClick: () => handleAction(action) };

          return (
            <ActionComponent
              key={index}
              {...actionProps}
              className={`
                relative p-4 rounded-lg border transition-all duration-200 text-left
                ${action.primary 
                  ? 'border-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/60' :'border-border bg-card hover:bg-muted/50 hover:border-border/60'
                }
                focus:outline-none focus:ring-2 focus:ring-ring
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${action.iconBg}`}>
                  <Icon name={action.icon} size={20} className={action.iconColor} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${action.primary ? 'text-primary' : 'text-foreground'}`}>
                      {action.title}
                    </h4>
                    {action.badge && (
                      <div className="w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                        {action.badge}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
                
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            </ActionComponent>
          );
        })}
      </div>

      {/* Additional Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="Plus" size={16} />
            Add Integration
          </Button>
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="Settings" size={16} />
            System Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;