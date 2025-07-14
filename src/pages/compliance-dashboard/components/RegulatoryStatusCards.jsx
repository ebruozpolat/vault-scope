import React from 'react';
import Icon from '../../../components/AppIcon';

const RegulatoryStatusCards = () => {
  const regulatoryRequirements = [
    {
      id: 1,
      title: 'AML Compliance',
      status: 'compliant',
      lastUpdated: '2024-12-10',
      nextReview: '2024-12-25',
      description: 'Anti-Money Laundering procedures and monitoring',
      progress: 95,
      icon: 'Shield'
    },
    {
      id: 2,
      title: 'KYC Verification',
      status: 'warning',
      lastUpdated: '2024-12-12',
      nextReview: '2024-12-20',
      description: 'Customer identity verification and documentation',
      progress: 78,
      icon: 'UserCheck'
    },
    {
      id: 3,
      title: 'Transaction Reporting',
      status: 'pending',
      lastUpdated: '2024-12-08',
      nextReview: '2024-12-18',
      description: 'Regulatory transaction reporting requirements',
      progress: 65,
      icon: 'FileText'
    },
    {
      id: 4,
      title: 'BOI Registry',
      status: 'compliant',
      lastUpdated: '2024-12-11',
      nextReview: '2024-12-30',
      description: 'Beneficial Ownership Information compliance',
      progress: 92,
      icon: 'Database'
    },
    {
      id: 5,
      title: 'Sanctions Screening',
      status: 'compliant',
      lastUpdated: '2024-12-13',
      nextReview: '2024-12-28',
      description: 'OFAC and international sanctions compliance',
      progress: 88,
      icon: 'Search'
    },
    {
      id: 6,
      title: 'Audit Trail',
      status: 'warning',
      lastUpdated: '2024-12-09',
      nextReview: '2024-12-22',
      description: 'Comprehensive audit trail maintenance',
      progress: 72,
      icon: 'History'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'pending': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'pending': return 'Clock';
      default: return 'Circle';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-warning';
    return 'bg-error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Regulatory Status</h3>
        <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulatoryRequirements.map((requirement) => (
          <div key={requirement.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-subtle transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted/30 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={requirement.icon} 
                    size={18} 
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground">{requirement.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {requirement.description}
                  </p>
                </div>
              </div>
              
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full border
                ${getStatusColor(requirement.status)}
              `}>
                <Icon 
                  name={getStatusIcon(requirement.status)} 
                  size={12}
                />
                <span className="text-xs font-medium capitalize">
                  {requirement.status}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Compliance Progress</span>
                <span className="text-xs font-medium text-card-foreground">{requirement.progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getProgressColor(requirement.progress)}`}
                  style={{ width: `${requirement.progress}%` }}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>Updated: {formatDate(requirement.lastUpdated)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Review: {formatDate(requirement.nextReview)}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-3 pt-3 border-t border-border">
              <button className="w-full text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                {requirement.status === 'pending' ? 'Take Action' : 'View Details'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryStatusCards;