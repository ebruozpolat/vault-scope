import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ComplianceMetrics = () => {
  const complianceData = [
    { category: 'AML', score: 95, status: 'excellent' },
    { category: 'KYC', score: 88, status: 'good' },
    { category: 'Sanctions', score: 100, status: 'excellent' },
    { category: 'Reporting', score: 92, status: 'excellent' },
    { category: 'Audit', score: 85, status: 'good' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#059669';
      case 'good': return '#0EA5E9';
      case 'warning': return '#D97706';
      case 'critical': return '#DC2626';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return 'CheckCircle';
      case 'good': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Minus';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <div className="text-sm font-medium text-popover-foreground mb-1">{label}</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Score:</span>
            <span className="text-xs font-medium text-foreground">{data.score}%</span>
            <Icon 
              name={getStatusIcon(data.status)} 
              size={12} 
              className="text-success"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const overallScore = Math.round(
    complianceData.reduce((sum, item) => sum + item.score, 0) / complianceData.length
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Compliance Metrics</h3>
          <p className="text-sm text-muted-foreground">Overall compliance score: {overallScore}%</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${overallScore >= 90 ? 'bg-success' : overallScore >= 80 ? 'bg-warning' : 'bg-error'}`}></div>
          <span className="text-sm font-medium text-foreground">
            {overallScore >= 90 ? 'Excellent' : overallScore >= 80 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          {complianceData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getStatusIcon(item.status)} 
                  size={16} 
                  style={{ color: getStatusColor(item.status) }}
                />
                <span className="text-sm font-medium text-foreground">{item.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-border rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.score}%`,
                      backgroundColor: getStatusColor(item.status)
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-foreground w-10 text-right">
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceMetrics;