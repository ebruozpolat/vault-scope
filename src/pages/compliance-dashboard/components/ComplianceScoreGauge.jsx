import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceScoreGauge = () => {
  const complianceScore = 87;
  const previousScore = 82;
  const scoreChange = complianceScore - previousScore;
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Attention';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (complianceScore / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Compliance Score</h3>
        <div className="flex items-center space-x-2">
          <Icon 
            name={scoreChange >= 0 ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
            className={scoreChange >= 0 ? 'text-success' : 'text-error'}
          />
          <span className={`text-sm font-medium ${scoreChange >= 0 ? 'text-success' : 'text-error'}`}>
            {scoreChange >= 0 ? '+' : ''}{scoreChange}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                complianceScore >= 90 ? 'text-success' : 
                complianceScore >= 70 ? 'text-warning' : 'text-error'
              }`}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(complianceScore)}`}>
              {complianceScore}
            </span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className={`text-lg font-semibold ${getScoreColor(complianceScore)}`}>
          {getScoreStatus(complianceScore)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Overall compliance health status
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-success">94%</div>
          <div className="text-xs text-muted-foreground">KYC/AML</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-warning">82%</div>
          <div className="text-xs text-muted-foreground">Monitoring</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-semibold text-error">75%</div>
          <div className="text-xs text-muted-foreground">Reporting</div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceScoreGauge;