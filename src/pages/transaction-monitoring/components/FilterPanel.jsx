import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    walletId: '',
    assetType: '',
    complianceStatus: '',
    riskLevel: 50,
    amountRange: {
      min: '',
      max: ''
    }
  });

  const walletOptions = [
    { value: '', label: 'All Wallets' },
    { value: 'metamask-1', label: 'MetaMask Wallet 1' },
    { value: 'fireblocks-treasury', label: 'Fireblocks Treasury' },
    { value: 'bitgo-cold', label: 'BitGo Cold Storage' },
    { value: 'coinbase-custody', label: 'Coinbase Custody' }
  ];

  const assetOptions = [
    { value: '', label: 'All Assets' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'WBTC', label: 'Wrapped Bitcoin (WBTC)' }
  ];

  const complianceOptions = [
    { value: '', label: 'All Status' },
    { value: 'compliant', label: 'Compliant' },
    { value: 'review', label: 'Needs Review' },
    { value: 'violation', label: 'Violation' },
    { value: 'pending', label: 'Pending Analysis' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...filters.dateRange, [type]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmountRangeChange = (type, value) => {
    const newAmountRange = { ...filters.amountRange, [type]: value };
    const newFilters = { ...filters, amountRange: newAmountRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      walletId: '',
      assetType: '',
      complianceStatus: '',
      riskLevel: 50,
      amountRange: { min: '', max: '' }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.dateRange.start || filters.dateRange.end || 
           filters.walletId || filters.assetType || 
           filters.complianceStatus || filters.riskLevel !== 50 ||
           filters.amountRange.min || filters.amountRange.max;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
          {hasActiveFilters() && (
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconSize={16}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
            iconSize={16}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full"
            />
            <Input
              label="End Date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Wallet and Asset Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Wallet Source"
              options={walletOptions}
              value={filters.walletId}
              onChange={(value) => handleFilterChange('walletId', value)}
              placeholder="Select wallet"
            />
            <Select
              label="Asset Type"
              options={assetOptions}
              value={filters.assetType}
              onChange={(value) => handleFilterChange('assetType', value)}
              placeholder="Select asset"
            />
          </div>

          {/* Compliance Status */}
          <Select
            label="Compliance Status"
            options={complianceOptions}
            value={filters.complianceStatus}
            onChange={(value) => handleFilterChange('complianceStatus', value)}
            placeholder="Select compliance status"
          />

          {/* Risk Level Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Risk Level Threshold: {filters.riskLevel}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.riskLevel}
                onChange={(e) => handleFilterChange('riskLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Amount (USD)"
              type="number"
              placeholder="0.00"
              value={filters.amountRange.min}
              onChange={(e) => handleAmountRangeChange('min', e.target.value)}
            />
            <Input
              label="Max Amount (USD)"
              type="number"
              placeholder="1,000,000.00"
              value={filters.amountRange.max}
              onChange={(e) => handleAmountRangeChange('max', e.target.value)}
            />
          </div>

          {/* Quick Filter Presets */}
          <div className="pt-4 border-t border-border">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleDateRangeChange('start', today);
                  handleDateRangeChange('end', today);
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  handleDateRangeChange('start', weekAgo.toISOString().split('T')[0]);
                  handleDateRangeChange('end', today.toISOString().split('T')[0]);
                }}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('complianceStatus', 'review')}
              >
                Needs Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('riskLevel', 80)}
              >
                High Risk
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;