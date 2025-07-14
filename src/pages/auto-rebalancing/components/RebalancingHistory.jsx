import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RebalancingHistory = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [rebalancingHistory] = useState([
    {
      id: 1,
      timestamp: '2025-01-10T14:30:00Z',
      strategy: 'Balanced Portfolio',
      trigger: 'Scheduled',
      status: 'completed',
      duration: '2m 45s',
      trades: [
        { action: 'sell', asset: 'BTC', amount: 0.5, value: 25000, price: 50000 },
        { action: 'buy', asset: 'ETH', amount: 8.33, value: 25000, price: 3000 }
      ],
      gasUsed: 0.05,
      slippage: 0.12,
      performance: {
        before: { btc: 45.2, eth: 25.3, usdc: 19.5, sol: 10.0 },
        after: { btc: 40.0, eth: 30.0, usdc: 20.0, sol: 10.0 }
      }
    },
    {
      id: 2,
      timestamp: '2025-01-08T09:15:00Z',
      strategy: 'Balanced Portfolio',
      trigger: 'Threshold Breach',
      status: 'completed',
      duration: '1m 23s',
      trades: [
        { action: 'sell', asset: 'USDC', amount: 15000, value: 15000, price: 1.0 },
        { action: 'buy', asset: 'SOL', amount: 150, value: 15000, price: 100 }
      ],
      gasUsed: 0.03,
      slippage: 0.08,
      performance: {
        before: { btc: 40.5, eth: 30.2, usdc: 22.3, sol: 7.0 },
        after: { btc: 40.0, eth: 30.0, usdc: 20.0, sol: 10.0 }
      }
    },
    {
      id: 3,
      timestamp: '2025-01-05T16:45:00Z',
      strategy: 'Balanced Portfolio',
      trigger: 'Manual',
      status: 'failed',
      duration: '0m 15s',
      error: 'Insufficient liquidity on exchange',
      trades: [],
      gasUsed: 0.01,
      slippage: null,
      performance: {
        before: { btc: 38.2, eth: 31.8, usdc: 20.5, sol: 9.5 },
        after: { btc: 38.2, eth: 31.8, usdc: 20.5, sol: 9.5 }
      }
    },
    {
      id: 4,
      timestamp: '2025-01-03T11:20:00Z',
      strategy: 'Risk Parity',
      trigger: 'Scheduled',
      status: 'completed',
      duration: '3m 12s',
      trades: [
        { action: 'sell', asset: 'BTC', amount: 0.3, value: 15000, price: 50000 },
        { action: 'buy', asset: 'USDC', amount: 15000, value: 15000, price: 1.0 }
      ],
      gasUsed: 0.04,
      slippage: 0.15,
      performance: {
        before: { btc: 42.0, eth: 28.5, usdc: 18.5, sol: 11.0 },
        after: { btc: 40.0, eth: 30.0, usdc: 20.0, sol: 10.0 }
      }
    }
  ]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' }
  ];

  const filteredHistory = rebalancingHistory.filter(entry => {
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesSearch = !searchTerm || 
      entry.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'failed':
        return 'bg-error/20 text-error';
      case 'pending':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'Scheduled':
        return 'Clock';
      case 'Threshold Breach':
        return 'AlertTriangle';
      case 'Manual':
        return 'User';
      default:
        return 'Activity';
    }
  };

  const calculateTotalValue = (trades) => {
    return trades.reduce((sum, trade) => sum + trade.value, 0);
  };

  const [selectedEntry, setSelectedEntry] = useState(null);

  const renderDetailModal = () => {
    if (!selectedEntry) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Rebalancing Details - {selectedEntry.strategy}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEntry(null)}
              iconName="X"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">General Information</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatTimestamp(selectedEntry.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Strategy</span>
                  <span className="text-sm font-medium text-foreground">{selectedEntry.strategy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trigger</span>
                  <div className="flex items-center space-x-2">
                    <Icon name={getTriggerIcon(selectedEntry.trigger)} size={14} />
                    <span className="text-sm font-medium text-foreground">{selectedEntry.trigger}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium text-foreground">{selectedEntry.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gas Used</span>
                  <span className="text-sm font-medium text-foreground">{selectedEntry.gasUsed} ETH</span>
                </div>
                {selectedEntry.slippage && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Slippage</span>
                    <span className="text-sm font-medium text-foreground">{selectedEntry.slippage}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Allocation Changes</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground mb-2">
                  <div>Asset</div>
                  <div>Before</div>
                  <div>After</div>
                </div>
                {Object.keys(selectedEntry.performance.before).map(asset => (
                  <div key={asset} className="grid grid-cols-3 gap-4 py-2 border-t border-border">
                    <div className="text-sm font-medium text-foreground uppercase">{asset}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEntry.performance.before[asset].toFixed(1)}%
                    </div>
                    <div className="text-sm text-foreground">
                      {selectedEntry.performance.after[asset].toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trades */}
          {selectedEntry.trades.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-4">Executed Trades</h4>
              <div className="bg-muted/50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 text-xs font-medium text-muted-foreground bg-muted/30">
                  <div>Action</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Price</div>
                  <div>Value</div>
                  <div>Status</div>
                </div>
                {selectedEntry.trades.map((trade, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 p-4 border-t border-border">
                    <div className={`text-sm font-medium ${
                      trade.action === 'buy' ? 'text-success' : 'text-error'
                    }`}>
                      {trade.action.toUpperCase()}
                    </div>
                    <div className="text-sm font-medium text-foreground">{trade.asset}</div>
                    <div className="text-sm text-foreground">{trade.amount.toLocaleString()}</div>
                    <div className="text-sm text-foreground">${trade.price.toLocaleString()}</div>
                    <div className="text-sm text-foreground">${trade.value.toLocaleString()}</div>
                    <div className="text-sm text-success">Completed</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {selectedEntry.error && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">Error</span>
              </div>
              <p className="text-sm text-error mt-2">{selectedEntry.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Rebalancing History</h2>
          <p className="text-sm text-muted-foreground">
            View past rebalancing activities and their performance
          </p>
        </div>
        <Button variant="outline" iconName="Download">
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconName="Search"
          />
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          options={timeRangeOptions}
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={statusOptions}
        />
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-foreground">Timestamp</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Strategy</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Trigger</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Trades</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Gas Used</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr key={entry.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-4 text-sm text-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground">
                    {entry.strategy}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getTriggerIcon(entry.trigger)} size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{entry.trigger}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{entry.duration}</td>
                  <td className="p-4 text-sm text-foreground">
                    {entry.trades.length} trades
                    {entry.trades.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        ${calculateTotalValue(entry.trades).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-foreground">{entry.gasUsed} ETH</td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Rebalances</div>
          <div className="text-2xl font-semibold text-foreground">{filteredHistory.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
          <div className="text-2xl font-semibold text-success">
            {((filteredHistory.filter(h => h.status === 'completed').length / filteredHistory.length) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Gas Used</div>
          <div className="text-2xl font-semibold text-foreground">
            {filteredHistory.reduce((sum, h) => sum + h.gasUsed, 0).toFixed(2)} ETH
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg Duration</div>
          <div className="text-2xl font-semibold text-foreground">2m 15s</div>
        </div>
      </div>

      {renderDetailModal()}
    </div>
  );
};

export default RebalancingHistory;