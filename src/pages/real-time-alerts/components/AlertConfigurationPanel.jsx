import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertConfigurationPanel = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '06:00' });

  const [alertTypes, setAlertTypes] = useState({
    suspicious_activity: { enabled: true, priority: 'high' },
    compliance_breach: { enabled: true, priority: 'critical' },
    threshold_breach: { enabled: true, priority: 'medium' },
    suspicious_pattern: { enabled: true, priority: 'medium' },
    system_alert: { enabled: true, priority: 'low' }
  });

  const handleAlertTypeChange = (type, field, value) => {
    setAlertTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleSaveConfiguration = () => {
    const config = {
      notifications: {
        email: emailNotifications,
        sms: smsNotifications,
        push: pushNotifications,
        webhook: webhookUrl
      },
      quietHours,
      alertTypes
    };
    
    console.log('Saving configuration:', config);
    // In a real app, this would save to backend
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Bell" size={20} className="mr-2" />
          Notification Settings
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Checkbox
                label="Email Notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Checkbox
                label="SMS Notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
              <Checkbox
                label="Push Notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <div className="space-y-3">
              <Input
                label="Webhook URL"
                placeholder="https://your-webhook-endpoint.com"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Moon" size={20} className="mr-2" />
          Quiet Hours
        </h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable quiet hours (suppress non-critical alerts)"
            checked={quietHours.enabled}
            onCheckedChange={(checked) => setQuietHours(prev => ({ ...prev, enabled: checked }))}
          />
          
          {quietHours.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={quietHours.start}
                onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
              />
              <Input
                label="End Time"
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Alert Types Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Alert Types Configuration
        </h3>
        
        <div className="space-y-4">
          {Object.entries(alertTypes).map(([type, config]) => (
            <div key={type} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleAlertTypeChange(type, 'enabled', checked)}
                />
                <div>
                  <h4 className="text-sm font-medium text-foreground capitalize">
                    {type.replace('_', ' ')}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {getAlertDescription(type)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <Select
                  options={priorityOptions}
                  value={config.priority}
                  onValueChange={(value) => handleAlertTypeChange(type, 'priority', value)}
                  disabled={!config.enabled}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Rules */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="AlertTriangle" size={20} className="mr-2" />
          Escalation Rules
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Critical Alert Escalation</label>
              <Input
                placeholder="5"
                type="number"
                label="Escalate after (minutes)"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">High Priority Escalation</label>
              <Input
                placeholder="15"
                type="number"
                label="Escalate after (minutes)"
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Escalation Recipients</h4>
            <div className="space-y-2">
              <Input placeholder="security@company.com" label="Primary Contact" />
              <Input placeholder="manager@company.com" label="Secondary Contact" />
              <Input placeholder="admin@company.com" label="Emergency Contact" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sliders" size={20} className="mr-2" />
          Advanced Settings
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Input
                label="Alert Batch Size"
                type="number"
                placeholder="10"
                helpText="Number of alerts to process in each batch"
              />
            </div>
            
            <div className="space-y-3">
              <Input
                label="Rate Limit (per minute)"
                type="number"
                placeholder="60"
                helpText="Maximum alerts per minute to prevent spam"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Checkbox
              label="Auto-resolve duplicate alerts"
              helpText="Automatically resolve alerts that are identical to recent ones"
            />
            <Checkbox
              label="Enable machine learning enhancement"
              helpText="Use ML to improve alert accuracy and reduce false positives"
            />
            <Checkbox
              label="Log all alert decisions"
              helpText="Keep detailed logs of all alert processing decisions"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveConfiguration} iconName="Save" iconSize={16}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

function getAlertDescription(type) {
  const descriptions = {
    suspicious_activity: 'Alerts for potentially fraudulent or malicious transactions',
    compliance_breach: 'Alerts for violations of regulatory compliance rules',
    threshold_breach: 'Alerts when transaction amounts or frequencies exceed limits',
    suspicious_pattern: 'Alerts for unusual transaction patterns or behaviors',
    system_alert: 'Alerts for system status, connectivity, and operational issues'
  };
  return descriptions[type] || 'Alert configuration';
}

export default AlertConfigurationPanel;