import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import WalletStatusBadge from './WalletStatusBadge';

const WalletTable = ({ wallets, onReconnect, onSync, onSettings }) => {
  const getCustodianLogo = (custodian) => {
    const logos = {
      fireblocks: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=32&h=32&fit=crop&crop=center',
      bitgo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center'
    };
    return logos[custodian] || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=32&h=32&fit=crop&crop=center';
  };

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Wallet
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Custodian
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Last Sync
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Balance
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Wallet" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{wallet.name}</div>
                      <div className="text-xs text-muted-foreground">{wallet.address}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={getCustodianLogo(wallet.custodian)}
                      alt={wallet.custodian}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {wallet.custodian}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <WalletStatusBadge status={wallet.status} />
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-muted-foreground">
                    {formatLastSync(wallet.lastSync)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-foreground">
                    {wallet.balance}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {wallet.status === 'disconnected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RefreshCw"
                        onClick={() => onReconnect(wallet.id)}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      onClick={() => onSync(wallet.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Settings"
                      onClick={() => onSettings(wallet.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Wallet" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{wallet.name}</div>
                  <div className="text-xs text-muted-foreground">{wallet.address}</div>
                </div>
              </div>
              <WalletStatusBadge status={wallet.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Custodian</div>
                <div className="flex items-center gap-2">
                  <Image
                    src={getCustodianLogo(wallet.custodian)}
                    alt={wallet.custodian}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {wallet.custodian}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Balance</div>
                <div className="text-sm font-medium text-foreground">
                  {wallet.balance}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last sync: {formatLastSync(wallet.lastSync)}
              </span>
              <div className="flex items-center gap-2">
                {wallet.status === 'disconnected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    onClick={() => onReconnect(wallet.id)}
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  onClick={() => onSync(wallet.id)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  onClick={() => onSettings(wallet.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletTable;