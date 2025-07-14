import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Generate Report',
      description: 'Create compliance reports',
      icon: 'FileText',
      color: 'bg-primary/10 text-primary',
      action: 'generate-report'
    },
    {
      id: 2,
      title: 'Update Rules',
      description: 'Modify compliance rules',
      icon: 'Settings',
      color: 'bg-warning/10 text-warning',
      action: 'update-rules'
    },
    {
      id: 3,
      title: 'View Alerts',
      description: 'Check active alerts',
      icon: 'Bell',
      color: 'bg-error/10 text-error',
      action: 'view-alerts'
    },
    {
      id: 4,
      title: 'Export Data',
      description: 'Download compliance data',
      icon: 'Download',
      color: 'bg-success/10 text-success',
      action: 'export-data'
    }
  ];

  const reportFormats = [
    { value: 'pdf', label: 'PDF Report', icon: 'FileText' },
    { value: 'csv', label: 'CSV Export', icon: 'Table' },
    { value: 'excel', label: 'Excel Workbook', icon: 'Sheet' }
  ];

  const reportTemplates = [
    { value: 'monthly', label: 'Monthly Summary' },
    { value: 'kyc', label: 'KYC Compliance' },
    { value: 'transaction', label: 'Transaction Monitoring' },
    { value: 'audit', label: 'Audit Trail' }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'generate-report':
        // In real app, this would open a modal or navigate to report generation
        console.log('Opening report generation modal');
        break;
      case 'update-rules':
        // In real app, this would navigate to rules management
        console.log('Navigating to rules management');
        break;
      case 'view-alerts':
        // In real app, this would open alerts panel
        console.log('Opening alerts panel');
        break;
      case 'export-data':
        // In real app, this would trigger data export
        console.log('Starting data export');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-1">Frequently used compliance tools</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.action)}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <Icon name={action.icon} size={18} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-card-foreground text-sm">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Report Generation Section */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-card-foreground mb-3">Report Generation</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Report Format
              </label>
              <div className="grid grid-cols-1 gap-2">
                {reportFormats.map((format) => (
                  <button
                    key={format.value}
                    className="flex items-center space-x-2 p-2 rounded border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <Icon name={format.icon} size={14} className="text-muted-foreground" />
                    <span className="text-xs text-card-foreground">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Report Template
              </label>
              <div className="space-y-1">
                {reportTemplates.map((template) => (
                  <button
                    key={template.value}
                    className="w-full text-left p-2 rounded border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs text-card-foreground">{template.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              variant="default" 
              size="sm" 
              className="w-full mt-3"
              iconName="FileText"
              iconPosition="left"
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-card-foreground mb-3">System Status</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-card-foreground">Compliance Engine</span>
              </div>
              <span className="text-xs text-success font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-card-foreground">BOI Registry Sync</span>
              </div>
              <span className="text-xs text-success font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs text-card-foreground">Alert System</span>
              </div>
              <span className="text-xs text-warning font-medium">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;