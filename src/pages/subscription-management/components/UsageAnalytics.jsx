import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const UsageAnalytics = ({ analyticsData }) => {
  const COLORS = ['#1E3A8A', '#0EA5E9', '#059669', '#D97706', '#DC2626'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Usage Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your feature utilization and optimize your subscription
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {analyticsData.keyMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={metric.icon} size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className={`text-sm flex items-center space-x-1 mt-1 ${
                metric.change > 0 ? 'text-success' : metric.change < 0 ? 'text-error' : 'text-muted-foreground'
              }`}>
                <Icon 
                  name={metric.change > 0 ? 'TrendingUp' : metric.change < 0 ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
                <span>{Math.abs(metric.change)}% vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Trends */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Usage Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.usageTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Transactions"
                />
                <Line 
                  type="monotone" 
                  dataKey="wallets" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  name="Wallet Connections"
                />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                  name="Compliance Reports"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Usage Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Feature Usage Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.featureUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.featureUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Monthly Activity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="activity" fill="var(--color-primary)" name="Activity Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Optimization Recommendations</h3>
          <div className="space-y-3">
            {analyticsData.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border-l-4 
                  ${recommendation.type === 'upgrade' ? 'border-l-primary bg-primary/5' : ''}
                  ${recommendation.type === 'optimize' ? 'border-l-warning bg-warning/5' : ''}
                  ${recommendation.type === 'info' ? 'border-l-accent bg-accent/5' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={
                      recommendation.type === 'upgrade' ? 'ArrowUp' :
                      recommendation.type === 'optimize' ? 'Zap' : 'Info'
                    } 
                    size={20} 
                    className={`
                      flex-shrink-0 mt-0.5
                      ${recommendation.type === 'upgrade' ? 'text-primary' : ''}
                      ${recommendation.type === 'optimize' ? 'text-warning' : ''}
                      ${recommendation.type === 'info' ? 'text-accent' : ''}
                    `}
                  />
                  <div>
                    <h4 className="font-medium text-foreground">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                    {recommendation.action && (
                      <button className="text-sm font-medium text-primary hover:text-primary/80 mt-2 transition-colors">
                        {recommendation.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;