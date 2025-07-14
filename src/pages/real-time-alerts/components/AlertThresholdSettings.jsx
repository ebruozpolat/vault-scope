import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';
import realTimeAlertingService from '../../../services/realTimeAlertingService';

const AlertThresholdSettings = () => {
  const [thresholds, setThresholds] = useState({
    transactionAmount: 10000,
    riskScore: 70,
    dailyTransactionCount: 50,
    velocityThreshold: 5,
    gasSpike: 100,
    walletBalance: 1000000,
    unusualTiming: true,
    roundAmounts: true,
    rapidSuccession: true
  });

  const [currencies, setCurrencies] = useState([
    { currency: 'USD', threshold: 10000, enabled: true },
    { currency: 'BTC', threshold: 0.5, enabled: true },
    { currency: 'ETH', threshold: 5, enabled: true },
    { currency: 'USDC', threshold: 10000, enabled: true }
  ]);

  const [riskCategories, setRiskCategories] = useState([
    { category: 'High Risk Addresses', threshold: 80, enabled: true },
    { category: 'Sanctioned Entities', threshold: 100, enabled: true },
    { category: 'PEP Screening', threshold: 90, enabled: true },
    { category: 'Geographic Risk', threshold: 75, enabled: true }
  ]);

  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCurrencyChange = (index, field, value) => {
    setCurrencies(prev => prev.map((curr, i) => 
      i === index ? { ...curr, [field]: value } : curr
    ));
  };

  const handleRiskCategoryChange = (index, field, value) => {
    setRiskCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    ));
  };

  const addCurrency = () => {
    setCurrencies(prev => [...prev, { currency: '', threshold: 0, enabled: true }]);
  };

  const removeCurrency = (index) => {
    setCurrencies(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveThresholds = () => {
    const thresholdConfig = {
      ...thresholds,
      currencies,
      riskCategories
    };
    
    realTimeAlertingService.updateThresholds(thresholdConfig);
    console.log('Saved thresholds:', thresholdConfig);
  };

  const handleResetToDefaults = () => {
    setThresholds({
      transactionAmount: 10000,
      riskScore: 70,
      dailyTransactionCount: 50,
      velocityThreshold: 5,
      gasSpike: 100,
      walletBalance: 1000000,
      unusualTiming: true,
      roundAmounts: true,
      rapidSuccession: true
    });
    
    setCurrencies([
      { currency: 'USD', threshold: 10000, enabled: true },
      { currency: 'BTC', threshold: 0.5, enabled: true },
      { currency: 'ETH', threshold: 5, enabled: true },
      { currency: 'USDC', threshold: 10000, enabled: true }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Transaction Amount Thresholds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="DollarSign" size={20} className="mr-2" />
          Transaction Amount Thresholds
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Large Transaction Alert (USD)"
              type="number"
              value={thresholds.transactionAmount}
              onChange={(e) => handleThresholdChange('transactionAmount', Number(e.target.value))}
              helpText="Alert when transaction exceeds this amount"
            />
            
            <Input
              label="Daily Transaction Count"
              type="number"
              value={thresholds.dailyTransactionCount}
              onChange={(e) => handleThresholdChange('dailyTransactionCount', Number(e.target.value))}
              helpText="Alert when daily transaction count exceeds limit"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Currency-Specific Thresholds</h4>
            {currencies.map((currency, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                <Checkbox
                  checked={currency.enabled}
                  onCheckedChange={(checked) => handleCurrencyChange(index, 'enabled', checked)}
                />
                <Input
                  placeholder="Currency"
                  value={currency.currency}
                  onChange={(e) => handleCurrencyChange(index, 'currency', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Threshold"
                  type="number"
                  value={currency.threshold}
                  onChange={(e) => handleCurrencyChange(index, 'threshold', Number(e.target.value))}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCurrency(index)}
                  iconName="Trash2"
                  iconSize={16}
                />
              </div>
            ))}
            <Button variant="outline" onClick={addCurrency} iconName="Plus" iconSize={16}>
              Add Currency
            </Button>
          </div>
        </div>
      </div>

      {/* Risk Score Thresholds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Risk Score Thresholds
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="High Risk Score Alert (%)"
              type="number"
              min="0"
              max="100"
              value={thresholds.riskScore}
              onChange={(e) => handleThresholdChange('riskScore', Number(e.target.value))}
              helpText="Alert when risk score exceeds this percentage"
            />
            
            <Input
              label="Wallet Balance Alert (USD)"
              type="number"
              value={thresholds.walletBalance}
              onChange={(e) => handleThresholdChange('walletBalance', Number(e.target.value))}
              helpText="Alert when wallet balance exceeds this amount"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Risk Category Thresholds</h4>
            {riskCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                <Checkbox
                  checked={category.enabled}
                  onCheckedChange={(checked) => handleRiskCategoryChange(index, 'enabled', checked)}
                />
                <span className="flex-1 text-sm text-foreground">{category.category}</span>
                <Input
                  placeholder="Threshold %"
                  type="number"
                  min="0"
                  max="100"
                  value={category.threshold}
                  onChange={(e) => handleRiskCategoryChange(index, 'threshold', Number(e.target.value))}
                  className="w-32"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Detection Thresholds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Search" size={20} className="mr-2" />
          Pattern Detection Thresholds
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Velocity Threshold (transactions/10min)"
              type="number"
              value={thresholds.velocityThreshold}
              onChange={(e) => handleThresholdChange('velocityThreshold', Number(e.target.value))}
              helpText="Alert when transaction velocity exceeds limit"
            />
            
            <Input
              label="Gas Price Spike Alert (%)"
              type="number"
              value={thresholds.gasSpike}
              onChange={(e) => handleThresholdChange('gasSpike', Number(e.target.value))}
              helpText="Alert when gas price spikes above normal"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Pattern Detection Settings</h4>
            <div className="space-y-2">
              <Checkbox
                label="Round Amount Detection"
                checked={thresholds.roundAmounts}
                onCheckedChange={(checked) => handleThresholdChange('roundAmounts', checked)}
                helpText="Detect potentially suspicious round amount transactions"
              />
              <Checkbox
                label="Rapid Succession Detection"
                checked={thresholds.rapidSuccession}
                onCheckedChange={(checked) => handleThresholdChange('rapidSuccession', checked)}
                helpText="Detect multiple transactions in rapid succession"
              />
              <Checkbox
                label="Unusual Timing Detection"
                checked={thresholds.unusualTiming}
                onCheckedChange={(checked) => handleThresholdChange('unusualTiming', checked)}
                helpText="Detect transactions at unusual times"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Thresholds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sliders" size={20} className="mr-2" />
          Advanced Thresholds
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Alert Cooldown (minutes)"
              type="number"
              placeholder="5"
              helpText="Minimum time between similar alerts"
            />
            
            <Input
              label="Batch Processing Size"
              type="number"
              placeholder="100"
              helpText="Number of transactions to process in batch"
            />
            
            <Input
              label="Historical Data Window (days)"
              type="number"
              placeholder="30"
              helpText="Days of historical data to consider"
            />
          </div>
        </div>
      </div>

      {/* Threshold Testing */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TestTube" size={20} className="mr-2" />
          Threshold Testing
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Test your threshold settings with sample transactions to ensure they trigger alerts correctly.
          </p>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" iconName="Play" iconSize={16}>
              Test High Risk Transaction
            </Button>
            <Button variant="outline" iconName="Play" iconSize={16}>
              Test Large Amount Alert
            </Button>
            <Button variant="outline" iconName="Play" iconSize={16}>
              Test Pattern Detection
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetToDefaults}
          iconName="RotateCcw"
          iconSize={16}
        >
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={handleSaveThresholds}
          iconName="Save"
          iconSize={16}
        >
          Save Thresholds
        </Button>
      </div>
    </div>
  );
};

export default AlertThresholdSettings;