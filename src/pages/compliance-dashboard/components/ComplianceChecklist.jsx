import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceChecklist = () => {
  const [expandedSections, setExpandedSections] = useState({
    kyc: true,
    monitoring: false,
    reporting: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const complianceData = {
    kyc: {
      title: "KYC/AML Requirements",
      completion: 85,
      items: [
        { id: 1, task: "Customer Identity Verification", status: "completed", dueDate: "2024-12-15" },
        { id: 2, task: "Enhanced Due Diligence", status: "in-progress", dueDate: "2024-12-20" },
        { id: 3, task: "PEP Screening Updates", status: "pending", dueDate: "2024-12-25" },
        { id: 4, task: "Sanctions List Verification", status: "completed", dueDate: "2024-12-10" }
      ]
    },
    monitoring: {
      title: "Transaction Monitoring",
      completion: 92,
      items: [
        { id: 5, task: "Suspicious Activity Reports", status: "completed", dueDate: "2024-12-18" },
        { id: 6, task: "Large Transaction Reviews", status: "completed", dueDate: "2024-12-16" },
        { id: 7, task: "Cross-Border Monitoring", status: "in-progress", dueDate: "2024-12-22" },
        { id: 8, task: "Pattern Analysis Update", status: "completed", dueDate: "2024-12-12" }
      ]
    },
    reporting: {
      title: "Regulatory Reporting",
      completion: 78,
      items: [
        { id: 9, task: "Monthly Compliance Report", status: "in-progress", dueDate: "2024-12-31" },
        { id: 10, task: "BOI Registry Sync", status: "pending", dueDate: "2024-12-28" },
        { id: 11, task: "Audit Trail Documentation", status: "completed", dueDate: "2024-12-14" },
        { id: 12, task: "Regulatory Filing Updates", status: "pending", dueDate: "2024-12-30" }
      ]
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in-progress': return 'text-warning bg-warning/10';
      case 'pending': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'pending': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getCompletionColor = (completion) => {
    if (completion >= 90) return 'text-success';
    if (completion >= 70) return 'text-warning';
    return 'text-error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Compliance Checklist</h2>
        <p className="text-sm text-muted-foreground mt-1">Track regulatory requirements and deadlines</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {Object.entries(complianceData).map(([key, section]) => (
          <div key={key} className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection(key)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={expandedSections[key] ? 'ChevronDown' : 'ChevronRight'} 
                  size={16} 
                  className="text-muted-foreground"
                />
                <div className="text-left">
                  <h3 className="font-medium text-card-foreground">{section.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          section.completion >= 90 ? 'bg-success' : 
                          section.completion >= 70 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${section.completion}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getCompletionColor(section.completion)}`}>
                      {section.completion}%
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {expandedSections[key] && (
              <div className="border-t border-border">
                {section.items.map((item) => (
                  <div key={item.id} className="p-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon 
                          name={getStatusIcon(item.status)} 
                          size={16} 
                          className={getStatusColor(item.status).split(' ')[0]}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {item.task}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace('-', ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Due: {formatDate(item.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;