import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SavedFilters = ({ onApplyFilter }) => {
  const [savedFilters, setSavedFilters] = useState([
    {
      id: 1,
      name: 'High Risk Transactions',
      description: 'Risk score > 70%, last 7 days',
      filters: {
        riskLevel: 70,
        dateRange: { start: '2024-07-07', end: '2024-07-14' },
        complianceStatus: ''
      },
      isDefault: true,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Compliance Violations',
      description: 'All violation status, any timeframe',
      filters: {
        complianceStatus: 'violation',
        riskLevel: 0,
        dateRange: { start: '', end: '' }
      },
      isDefault: false,
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'Large Transactions',
      description: 'Amount > $50,000, last 30 days',
      filters: {
        amountRange: { min: '50000', max: '' },
        dateRange: { start: '2024-06-14', end: '2024-07-14' },
        riskLevel: 0
      },
      isDefault: false,
      lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      name: 'BitGo Transactions',
      description: 'All BitGo wallet transactions',
      filters: {
        walletId: 'bitgo-cold',
        dateRange: { start: '', end: '' },
        riskLevel: 0
      },
      isDefault: false,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [newFilterDescription, setNewFilterDescription] = useState('');

  const formatLastUsed = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleApplyFilter = (filter) => {
    onApplyFilter(filter.filters);
    
    // Update last used timestamp
    setSavedFilters(prev => 
      prev.map(f => 
        f.id === filter.id 
          ? { ...f, lastUsed: new Date() }
          : f
      )
    );
  };

  const handleDeleteFilter = (filterId) => {
    if (window.confirm('Are you sure you want to delete this saved filter?')) {
      setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    }
  };

  const handleCreateFilter = () => {
    if (!newFilterName.trim()) {
      alert('Please enter a filter name');
      return;
    }

    const newFilter = {
      id: Date.now(),
      name: newFilterName,
      description: newFilterDescription || 'Custom filter',
      filters: {
        dateRange: { start: '', end: '' },
        walletId: '',
        assetType: '',
        complianceStatus: '',
        riskLevel: 50,
        amountRange: { min: '', max: '' }
      },
      isDefault: false,
      lastUsed: new Date()
    };

    setSavedFilters(prev => [newFilter, ...prev]);
    setNewFilterName('');
    setNewFilterDescription('');
    setIsCreating(false);
  };

  const handleSetDefault = (filterId) => {
    setSavedFilters(prev => 
      prev.map(f => ({ ...f, isDefault: f.id === filterId }))
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bookmark" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Saved Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          iconName="Plus"
          iconSize={16}
        >
          New
        </Button>
      </div>

      {/* Create New Filter Form */}
      {isCreating && (
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="space-y-3">
            <Input
              label="Filter Name"
              type="text"
              placeholder="Enter filter name"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              required
            />
            <Input
              label="Description (Optional)"
              type="text"
              placeholder="Brief description of this filter"
              value={newFilterDescription}
              onChange={(e) => setNewFilterDescription(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateFilter}
                disabled={!newFilterName.trim()}
              >
                Save Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewFilterName('');
                  setNewFilterDescription('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Filters List */}
      <div className="max-h-80 overflow-y-auto">
        {savedFilters.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bookmark" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No saved filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {savedFilters.map((filter) => (
              <div key={filter.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {filter.name}
                      </h4>
                      {filter.isDefault && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {filter.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last used: {formatLastUsed(filter.lastUsed)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyFilter(filter)}
                    iconName="Play"
                    iconSize={14}
                  >
                    Apply
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {!filter.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(filter.id)}
                        iconName="Star"
                        iconSize={14}
                        title="Set as default"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFilter(filter.id)}
                      iconName="Trash2"
                      iconSize={14}
                      title="Delete filter"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{savedFilters.length} saved filters</span>
          <button className="hover:text-foreground transition-colors">
            Manage all filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedFilters;