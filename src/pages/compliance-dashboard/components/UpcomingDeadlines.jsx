import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingDeadlines = () => {
  const deadlines = [
    {
      id: 1,
      title: 'Monthly Compliance Report',
      description: 'Generate and submit monthly compliance summary',
      dueDate: '2024-12-18',
      priority: 'high',
      category: 'reporting',
      estimatedTime: '2 hours',
      assignee: 'Compliance Team'
    },
    {
      id: 2,
      title: 'KYC Document Review',
      description: 'Review expiring customer verification documents',
      dueDate: '2024-12-20',
      priority: 'medium',
      category: 'kyc',
      estimatedTime: '4 hours',
      assignee: 'Sarah Chen'
    },
    {
      id: 3,
      title: 'BOI Registry Update',
      description: 'Update beneficial ownership information in registry',
      dueDate: '2024-12-22',
      priority: 'medium',
      category: 'regulatory',
      estimatedTime: '1 hour',
      assignee: 'Legal Team'
    },
    {
      id: 4,
      title: 'Audit Trail Backup',
      description: 'Create quarterly backup of audit trail data',
      dueDate: '2024-12-25',
      priority: 'low',
      category: 'maintenance',
      estimatedTime: '30 minutes',
      assignee: 'IT Team'
    },
    {
      id: 5,
      title: 'Sanctions List Update',
      description: 'Update and verify latest sanctions screening lists',
      dueDate: '2024-12-28',
      priority: 'high',
      category: 'screening',
      estimatedTime: '1.5 hours',
      assignee: 'Compliance Team'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reporting': return 'FileText';
      case 'kyc': return 'UserCheck';
      case 'regulatory': return 'Shield';
      case 'maintenance': return 'Settings';
      case 'screening': return 'Search';
      default: return 'Calendar';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate) => {
    return new Date(dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDueDateColor = (daysUntil) => {
    if (daysUntil <= 2) return 'text-error';
    if (daysUntil <= 5) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Upcoming Deadlines</h3>
        <p className="text-sm text-muted-foreground mt-1">Critical compliance tasks and due dates</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {deadlines.map((deadline) => {
          const daysUntil = getDaysUntilDue(deadline.dueDate);
          
          return (
            <div key={deadline.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon 
                      name={getCategoryIcon(deadline.category)} 
                      size={14} 
                      className="text-muted-foreground"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-card-foreground text-sm">
                      {deadline.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {deadline.description}
                    </p>
                  </div>
                </div>

                <div className={`
                  px-2 py-1 rounded-full border text-xs font-medium flex-shrink-0
                  ${getPriorityColor(deadline.priority)}
                `}>
                  {deadline.priority}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Due:</span>
                    <span className={`font-medium ${getDueDateColor(daysUntil)}`}>
                      {formatDueDate(deadline.dueDate)}
                    </span>
                  </div>
                  
                  <div className={`font-medium ${getDueDateColor(daysUntil)}`}>
                    {daysUntil === 0 ? 'Due Today' : 
                     daysUntil === 1 ? 'Due Tomorrow' : 
                     daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                     `${daysUntil} days left`}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{deadline.estimatedTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{deadline.assignee}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <button className="w-full text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                  {daysUntil <= 2 ? 'Start Now' : 'View Details'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;