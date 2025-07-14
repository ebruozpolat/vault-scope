import React from 'react';
import Icon from '../../../components/AppIcon';

const WalletSummaryCards = ({ summaryData }) => {
  const cards = [
    {
      title: 'Connected Wallets',
      value: summaryData.totalWallets,
      icon: 'Wallet',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Sync Health',
      value: `${summaryData.syncHealth}%`,
      icon: 'Activity',
      color: summaryData.syncHealth >= 95 ? 'text-success' : summaryData.syncHealth >= 80 ? 'text-warning' : 'text-error',
      bgColor: summaryData.syncHealth >= 95 ? 'bg-success/10' : summaryData.syncHealth >= 80 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      title: 'Total Balance',
      value: summaryData.totalBalance,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletSummaryCards;