import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RebalancingSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      enabled: true,
      defaultFrequency: 'weekly',
      defaultDeviation: 5,
      maxRebalanceAmount: 100000,
      minRebalanceAmount: 1000,
      slippageTolerance: 0.5,
      gasOptimization: true
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      rebalanceStart: true,
      rebalanceComplete: true,
      rebalanceError: true,
      thresholdBreached: true
    },
    risk: {
      maxDailyRebalances: 5,
      cooldownPeriod: 30,
      volatilityThreshold: 20,
      emergencyStop: true,
      requiredApproval: false
    },
    integrations: {
      exchanges: {
        binance: { enabled: true, apiKey: '••••••••••••••••', status: 'connected' },
        coinbase: { enabled: true, apiKey: '••••••••••••••••', status: 'connected' },
        kraken: { enabled: false, apiKey: '', status: 'disconnected' }
      },
      webhooks: {
        url: 'https://api.example.com/webhooks/rebalance',
        enabled: true,
        secretKey: '••••••••••••••••'
      }
    }
  });

  const [activeSection, setActiveSection] = useState('general');

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const sections = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'risk', label: 'Risk Management', icon: 'Shield' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug' }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (section, parentKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...prev[section][parentKey],
          [key]: value
        }
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to backend
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Default Rebalance Frequency
          </label>
          <Select
            value={settings.general.defaultFrequency}
            onValueChange={(value) => handleSettingChange('general', 'defaultFrequency', value)}
            options={frequencyOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Default Deviation Threshold (%)
          </label>
          <Input
            type="number"
            value={settings.general.defaultDeviation}
            onChange={(e) => handleSettingChange('general', 'defaultDeviation', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Rebalance Amount ($)
          </label>
          <Input
            type="number"
            value={settings.general.maxRebalanceAmount}
            onChange={(e) => handleSettingChange('general', 'maxRebalanceAmount', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Min Rebalance Amount ($)
          </label>
          <Input
            type="number"
            value={settings.general.minRebalanceAmount}
            onChange={(e) => handleSettingChange('general', 'minRebalanceAmount', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Slippage Tolerance (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={settings.general.slippageTolerance}
            onChange={(e) => handleSettingChange('general', 'slippageTolerance', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id="gasOptimization"
          checked={settings.general.gasOptimization}
          onCheckedChange={(checked) => handleSettingChange('general', 'gasOptimization', checked)}
        />
        <label htmlFor="gasOptimization" className="text-sm text-foreground">
          Enable gas optimization for rebalancing transactions
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="emailAlerts"
            checked={settings.notifications.emailAlerts}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'emailAlerts', checked)}
          />
          <label htmlFor="emailAlerts" className="text-sm text-foreground">
            Email alerts
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="pushNotifications"
            checked={settings.notifications.pushNotifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
          />
          <label htmlFor="pushNotifications" className="text-sm text-foreground">
            Push notifications
          </label>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-medium text-foreground mb-4">Notification Types</h4>
        <div className="space-y-4">
          {[
            { key: 'rebalanceStart', label: 'Rebalance started' },
            { key: 'rebalanceComplete', label: 'Rebalance completed' },
            { key: 'rebalanceError', label: 'Rebalance error' },
            { key: 'thresholdBreached', label: 'Threshold breached' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-3">
              <Checkbox
                id={key}
                checked={settings.notifications[key]}
                onCheckedChange={(checked) => handleSettingChange('notifications', key, checked)}
              />
              <label htmlFor={key} className="text-sm text-foreground">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRiskSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Daily Rebalances
          </label>
          <Input
            type="number"
            value={settings.risk.maxDailyRebalances}
            onChange={(e) => handleSettingChange('risk', 'maxDailyRebalances', parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cooldown Period (minutes)
          </label>
          <Input
            type="number"
            value={settings.risk.cooldownPeriod}
            onChange={(e) => handleSettingChange('risk', 'cooldownPeriod', parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Volatility Threshold (%)
          </label>
          <Input
            type="number"
            value={settings.risk.volatilityThreshold}
            onChange={(e) => handleSettingChange('risk', 'volatilityThreshold', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="emergencyStop"
            checked={settings.risk.emergencyStop}
            onCheckedChange={(checked) => handleSettingChange('risk', 'emergencyStop', checked)}
          />
          <label htmlFor="emergencyStop" className="text-sm text-foreground">
            Enable emergency stop during high volatility
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="requiredApproval"
            checked={settings.risk.requiredApproval}
            onCheckedChange={(checked) => handleSettingChange('risk', 'requiredApproval', checked)}
          />
          <label htmlFor="requiredApproval" className="text-sm text-foreground">
            Require manual approval for large rebalances
          </label>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4">Exchange Connections</h4>
        <div className="space-y-4">
          {Object.entries(settings.integrations.exchanges).map(([exchange, config]) => (
            <div key={exchange} className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="capitalize text-sm font-medium text-foreground">{exchange}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    config.status === 'connected' ?'bg-success/20 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {config.status}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${exchange}-enabled`}
                    checked={config.enabled}
                    onCheckedChange={(checked) => handleNestedSettingChange('integrations', 'exchanges', exchange, { ...config, enabled: checked })}
                  />
                  <Button variant="outline" size="sm" iconName="Settings">
                    Configure
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                API Key: {config.apiKey}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-foreground mb-4">Webhook Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="webhookEnabled"
              checked={settings.integrations.webhooks.enabled}
              onCheckedChange={(checked) => handleNestedSettingChange('integrations', 'webhooks', 'enabled', checked)}
            />
            <label htmlFor="webhookEnabled" className="text-sm text-foreground">
              Enable webhook notifications
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Webhook URL
            </label>
            <Input
              type="url"
              value={settings.integrations.webhooks.url}
              onChange={(e) => handleNestedSettingChange('integrations', 'webhooks', 'url', e.target.value)}
              placeholder="https://api.example.com/webhooks/rebalance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Secret Key
            </label>
            <Input
              type="password"
              value={settings.integrations.webhooks.secretKey}
              onChange={(e) => handleNestedSettingChange('integrations', 'webhooks', 'secretKey', e.target.value)}
              placeholder="••••••••••••••••"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'risk':
        return renderRiskSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Rebalancing Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure global settings for automatic rebalancing
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-lg p-6">
            {renderContent()}

            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-border">
              <Button variant="outline">
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} iconName="Save">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancingSettings;