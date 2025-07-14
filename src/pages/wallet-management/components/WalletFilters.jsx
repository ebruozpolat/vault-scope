import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WalletFilters = ({ filters, onFilterChange, onSearch, onSyncAll }) => {
  const custodianOptions = [
    { value: 'all', label: 'All Custodians' },
    { value: 'fireblocks', label: 'Fireblocks' },
    { value: 'bitgo', label: 'BitGo' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'connected', label: 'Connected' },
    { value: 'syncing', label: 'Syncing' },
    { value: 'disconnected', label: 'Disconnected' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-sm">
            <Input
              type="search"
              placeholder="Search wallets..."
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          <Select
            options={custodianOptions}
            value={filters.custodian}
            onChange={(value) => onFilterChange('custodian', value)}
            placeholder="Filter by custodian"
            className="w-full sm:w-48"
          />
          
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Filter by status"
            className="w-full sm:w-48"
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onSyncAll}
          >
            Sync All
          </Button>
          
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
          >
            Connect New Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletFilters;