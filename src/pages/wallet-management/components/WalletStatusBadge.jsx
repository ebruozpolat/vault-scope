import React from 'react';
import Icon from '../../../components/AppIcon';

const WalletStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'connected':
        return {
          label: 'Connected',
          icon: 'CheckCircle',
          className: 'bg-success/10 text-success border-success/20'
        };
      case 'syncing':
        return {
          label: 'Syncing',
          icon: 'RefreshCw',
          className: 'bg-warning/10 text-warning border-warning/20'
        };
      case 'disconnected':
        return {
          label: 'Disconnected',
          icon: 'XCircle',
          className: 'bg-error/10 text-error border-error/20'
        };
      default:
        return {
          label: 'Unknown',
          icon: 'AlertCircle',
          className: 'bg-muted text-muted-foreground border-border'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon 
        name={config.icon} 
        size={12} 
        className={status === 'syncing' ? 'animate-spin' : ''}
      />
      {config.label}
    </div>
  );
};

export default WalletStatusBadge;