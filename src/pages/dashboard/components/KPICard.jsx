import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, loading = false }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle hover:shadow-moderate transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;