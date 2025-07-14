import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AlertStatistics = ({ alertStats }) => {
  const severityData = [
    { name: 'Critical', value: alertStats?.critical || 0, color: '#dc2626' },
    { name: 'High', value: alertStats?.high || 0, color: '#ea580c' },
    { name: 'Medium', value: alertStats?.medium || 0, color: '#2563eb' },
    { name: 'Low', value: alertStats?.low || 0, color: '#9ca3af' }
  ];

  const categoryData = alertStats?.byCategory ? Object.entries(alertStats.byCategory).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: value,
    color: getCategoryColor(key)
  })) : [];

  const timeSeriesData = [
    { name: 'Mon', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Tue', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Wed', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Thu', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Fri', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Sat', alerts: Math.floor(Math.random() * 20) + 5 },
    { name: 'Sun', alerts: Math.floor(Math.random() * 20) + 5 }
  ];

  function getCategoryColor(category) {
    const colors = {
      suspicious_activity: '#dc2626',
      compliance_breach: '#7c3aed',
      threshold_breach: '#2563eb',
      suspicious_pattern: '#ea580c',
      system_alert: '#059669'
    };
    return colors[category] || '#6b7280';
  }

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon name={icon} size={20} className={color} />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {change && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className={changeType === 'increase' ? 'text-error' : 'text-success'} 
            />
            <span className={`text-sm ${changeType === 'increase' ? 'text-error' : 'text-success'}`}>
              {change}% vs last week
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Alerts"
          value={alertStats?.total || 0}
          icon="Bell"
          color="text-muted-foreground"
          change={12}
          changeType="increase"
        />
        <StatCard
          title="Active Alerts"
          value={alertStats?.active || 0}
          icon="AlertTriangle"
          color="text-warning"
          change={8}
          changeType="increase"
        />
        <StatCard
          title="Critical Alerts"
          value={alertStats?.critical || 0}
          icon="AlertOctagon"
          color="text-error"
          change={5}
          changeType="decrease"
        />
        <StatCard
          title="Last 24 Hours"
          value={alertStats?.last24Hours || 0}
          icon="Clock"
          color="text-accent"
          change={15}
          changeType="increase"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alert Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alert Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Alert Trends (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="alerts" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Severity Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Severity Breakdown</h4>
            <div className="space-y-3">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Category Breakdown</h4>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">Response Time</h4>
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">2.3s</p>
          <p className="text-xs text-muted-foreground">Average alert response time</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">Detection Rate</h4>
            <Icon name="Target" size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-success">99.2%</p>
          <p className="text-xs text-muted-foreground">Suspicious activity detection</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">False Positive Rate</h4>
            <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-warning">3.1%</p>
          <p className="text-xs text-muted-foreground">Of total alerts generated</p>
        </div>
      </div>
    </div>
  );
};

export default AlertStatistics;