import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const RebalancingStrategies = () => {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Balanced Portfolio',
      type: 'percentage',
      status: 'active',
      allocations: {
        'BTC': 40,
        'ETH': 30,
        'USDC': 20,
        'SOL': 10
      },
      thresholds: {
        deviation: 5,
        frequency: 'weekly'
      },
      created: '2024-12-01T10:00:00Z',
      performance: {
        returns: 12.5,
        volatility: 8.3,
        sharpeRatio: 1.51
      }
    },
    {
      id: 2,
      name: 'Risk Parity',
      type: 'riskBased',
      status: 'inactive',
      allocations: {
        'BTC': 25,
        'ETH': 25,
        'USDC': 35,
        'SOL': 15
      },
      thresholds: {
        deviation: 3,
        frequency: 'daily'
      },
      created: '2024-11-15T14:30:00Z',
      performance: {
        returns: 8.2,
        volatility: 6.1,
        sharpeRatio: 1.34
      }
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    type: 'percentage',
    allocations: {},
    thresholds: {
      deviation: 5,
      frequency: 'weekly'
    }
  });

  const assets = ['BTC', 'ETH', 'USDC', 'SOL', 'AVAX', 'MATIC'];
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const strategyTypes = [
    { value: 'percentage', label: 'Fixed Percentage' },
    { value: 'riskBased', label: 'Risk-Based' },
    { value: 'momentum', label: 'Momentum-Based' },
    { value: 'meanReversion', label: 'Mean Reversion' }
  ];

  const handleCreateStrategy = () => {
    const strategy = {
      id: strategies.length + 1,
      ...newStrategy,
      status: 'inactive',
      created: new Date().toISOString(),
      performance: {
        returns: 0,
        volatility: 0,
        sharpeRatio: 0
      }
    };

    setStrategies([...strategies, strategy]);
    setShowCreateModal(false);
    setNewStrategy({
      name: '',
      type: 'percentage',
      allocations: {},
      thresholds: {
        deviation: 5,
        frequency: 'weekly'
      }
    });
  };

  const handleToggleStrategy = (strategyId) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: strategy.status === 'active' ? 'inactive' : 'active' }
        : strategy
    ));
  };

  const handleDeleteStrategy = (strategyId) => {
    setStrategies(strategies.filter(strategy => strategy.id !== strategyId));
  };

  const renderAllocationInputs = () => {
    return assets.map(asset => (
      <div key={asset} className="flex items-center space-x-3">
        <div className="w-16 text-sm font-medium text-foreground">{asset}</div>
        <Input
          type="number"
          placeholder="0"
          value={newStrategy.allocations[asset] || ''}
          onChange={(e) => setNewStrategy(prev => ({
            ...prev,
            allocations: {
              ...prev.allocations,
              [asset]: parseFloat(e.target.value) || 0
            }
          }))}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Rebalancing Strategies</h2>
          <p className="text-sm text-muted-foreground">
            Configure automated rebalancing strategies for your portfolio
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} iconName="Plus">
          Create Strategy
        </Button>
      </div>

      {/* Strategy Cards */}
      <div className="grid gap-6">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-foreground">{strategy.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    strategy.status === 'active' ?'bg-success/20 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {strategy.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {strategyTypes.find(t => t.value === strategy.type)?.label}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStrategy(strategy.id)}
                  iconName={strategy.status === 'active' ? 'Pause' : 'Play'}
                >
                  {strategy.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStrategy(strategy.id)}
                  iconName="Trash2"
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Allocations */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Target Allocations</h4>
                <div className="space-y-2">
                  {Object.entries(strategy.allocations).map(([asset, percentage]) => (
                    <div key={asset} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{asset}</span>
                      <span className="text-sm font-medium text-foreground">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thresholds */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Thresholds</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deviation</span>
                    <span className="text-sm font-medium text-foreground">{strategy.thresholds.deviation}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <span className="text-sm font-medium text-foreground capitalize">{strategy.thresholds.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium text-foreground">{formatDate(strategy.created)}</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Performance</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Returns</span>
                    <span className="text-sm font-medium text-success">+{strategy.performance.returns}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Volatility</span>
                    <span className="text-sm font-medium text-foreground">{strategy.performance.volatility}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="text-sm font-medium text-foreground">{strategy.performance.sharpeRatio}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Strategy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Create New Strategy</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                iconName="X"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Strategy Name
                </label>
                <Input
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter strategy name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Strategy Type
                </label>
                <Select
                  value={newStrategy.type}
                  onValueChange={(value) => setNewStrategy(prev => ({ ...prev, type: value }))}
                  options={strategyTypes}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Asset Allocations
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {renderAllocationInputs()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Deviation Threshold (%)
                  </label>
                  <Input
                    type="number"
                    value={newStrategy.thresholds.deviation}
                    onChange={(e) => setNewStrategy(prev => ({
                      ...prev,
                      thresholds: {
                        ...prev.thresholds,
                        deviation: parseFloat(e.target.value) || 0
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rebalance Frequency
                  </label>
                  <Select
                    value={newStrategy.thresholds.frequency}
                    onValueChange={(value) => setNewStrategy(prev => ({
                      ...prev,
                      thresholds: {
                        ...prev.thresholds,
                        frequency: value
                      }
                    }))}
                    options={frequencyOptions}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button onClick={handleCreateStrategy} className="flex-1">
                  Create Strategy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RebalancingStrategies;