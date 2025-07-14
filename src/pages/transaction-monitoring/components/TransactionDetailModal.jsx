import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [overrideReason, setOverrideReason] = useState('');
  const [newComplianceStatus, setNewComplianceStatus] = useState('');

  if (!isOpen || !transaction) return null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success/10 text-success border-success/20';
      case 'review':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'violation':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-error';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent';
    return 'text-success';
  };

  const auditTrail = [
    {
      id: 1,
      action: 'Transaction Detected',
      timestamp: new Date(transaction.timestamp),
      user: 'System',
      details: 'Transaction automatically detected and processed'
    },
    {
      id: 2,
      action: 'Risk Analysis Completed',
      timestamp: new Date(transaction.timestamp.getTime() + 30000),
      user: 'AI Engine',
      details: `Risk score calculated: ${transaction.riskScore}%`
    },
    {
      id: 3,
      action: 'Compliance Check',
      timestamp: new Date(transaction.timestamp.getTime() + 60000),
      user: 'Compliance Engine',
      details: `Status: ${transaction.complianceStatus}`
    },
    {
      id: 4,
      action: 'Manual Review',
      timestamp: new Date(transaction.timestamp.getTime() + 300000),
      user: 'Sarah Chen',
      details: 'Transaction flagged for manual review due to high risk score'
    }
  ];

  const complianceChecks = [
    {
      id: 1,
      rule: 'AML Threshold Check',
      status: 'passed',
      details: 'Transaction amount below $10,000 threshold'
    },
    {
      id: 2,
      rule: 'Sanctions List Screening',
      status: 'passed',
      details: 'No matches found in OFAC sanctions list'
    },
    {
      id: 3,
      rule: 'PEP Screening',
      status: 'passed',
      details: 'No politically exposed persons detected'
    },
    {
      id: 4,
      rule: 'High-Risk Jurisdiction',
      status: 'warning',
      details: 'Transaction involves medium-risk jurisdiction'
    },
    {
      id: 5,
      rule: 'Velocity Check',
      status: 'failed',
      details: 'Multiple transactions from same wallet in short timeframe'
    }
  ];

  const statusOptions = [
    { value: 'compliant', label: 'Mark as Compliant' },
    { value: 'review', label: 'Requires Review' },
    { value: 'violation', label: 'Mark as Violation' },
    { value: 'pending', label: 'Pending Analysis' }
  ];

  const tabs = [
    { id: 'details', label: 'Transaction Details', icon: 'FileText' },
    { id: 'compliance', label: 'Compliance Analysis', icon: 'Shield' },
    { id: 'audit', label: 'Audit Trail', icon: 'Clock' },
    { id: 'actions', label: 'Manual Actions', icon: 'Settings' }
  ];

  const handleOverride = () => {
    if (!newComplianceStatus || !overrideReason.trim()) {
      alert('Please select a status and provide a reason for the override.');
      return;
    }
    
    // In real app, this would make an API call
    console.log('Override submitted:', {
      transactionId: transaction.id,
      newStatus: newComplianceStatus,
      reason: overrideReason
    });
    
    alert('Compliance status override submitted successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Activity" size={24} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Transaction Details</h2>
              <p className="text-sm text-muted-foreground">
                {transaction.hash.slice(0, 16)}...{transaction.hash.slice(-16)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Transaction Hash</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
                        {transaction.hash}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(transaction.hash)}
                        iconName="Copy"
                        iconSize={14}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Timestamp</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Wallet Source</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-foreground">{transaction.wallet}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Amount</label>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Asset Type</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-foreground">
                          {transaction.asset.slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm text-foreground">{transaction.asset}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Compliance Status</label>
                    <div className="mt-1">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${getComplianceStatusColor(transaction.complianceStatus)}
                      `}>
                        {transaction.complianceStatus === 'compliant' && 'Compliant'}
                        {transaction.complianceStatus === 'review' && 'Needs Review'}
                        {transaction.complianceStatus === 'violation' && 'Violation'}
                        {transaction.complianceStatus === 'pending' && 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Risk Assessment</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Risk Score</span>
                      <span className={`text-sm font-medium ${getRiskScoreColor(transaction.riskScore)}`}>
                        {transaction.riskScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          transaction.riskScore >= 80 ? 'bg-error' :
                          transaction.riskScore >= 60 ? 'bg-warning' :
                          transaction.riskScore >= 40 ? 'bg-accent' : 'bg-success'
                        }`}
                        style={{ width: `${transaction.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Compliance Rule Analysis</h3>
              <div className="space-y-3">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      ${check.status === 'passed' ? 'bg-success/10 text-success' :
                        check.status === 'warning'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}
                    `}>
                      <Icon 
                        name={check.status === 'passed' ? 'Check' : 
                              check.status === 'warning' ? 'AlertTriangle' : 'X'} 
                        size={14} 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{check.rule}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{check.details}</p>
                    </div>
                    <span className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${check.status === 'passed' ? 'bg-success/10 text-success' :
                        check.status === 'warning'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}
                    `}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Audit Trail</h3>
              <div className="space-y-3">
                {auditTrail.map((entry, index) => (
                  <div key={entry.id} className="flex items-start space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Icon name="Clock" size={14} />
                      </div>
                      {index < auditTrail.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground">{entry.action}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">By: {entry.user}</p>
                      <p className="text-xs text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Manual Override</h3>
              
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-warning">Authorization Required</h4>
                    <p className="text-xs text-warning/80 mt-1">
                      Manual compliance overrides require proper authorization and documentation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  label="New Compliance Status"
                  options={statusOptions}
                  value={newComplianceStatus}
                  onChange={setNewComplianceStatus}
                  placeholder="Select new status"
                />

                <Input
                  label="Override Reason"
                  type="text"
                  placeholder="Provide detailed justification for this override..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  description="This reason will be logged in the audit trail"
                  required
                />

                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={handleOverride}
                    disabled={!newComplianceStatus || !overrideReason.trim()}
                    iconName="Shield"
                    iconSize={16}
                  >
                    Submit Override
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewComplianceStatus('');
                      setOverrideReason('');
                    }}
                  >
                    Reset Form
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatTimestamp(new Date())}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
              iconName="ExternalLink"
              iconSize={16}
            >
              View on Explorer
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;