import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


const PortfolioChart = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const portfolioData = [
    { name: 'Bitcoin', value: 45.2, amount: '$2,260,000', color: '#F7931A' },
    { name: 'Ethereum', value: 28.7, amount: '$1,435,000', color: '#627EEA' },
    { name: 'USDC', value: 15.3, amount: '$765,000', color: '#2775CA' },
    { name: 'Solana', value: 6.8, amount: '$340,000', color: '#9945FF' },
    { name: 'Other', value: 4.0, amount: '$200,000', color: '#64748B' }
  ];

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="text-sm font-medium text-popover-foreground">{data.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {data.value}% • {data.amount}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Allocation</h3>
          <p className="text-sm text-muted-foreground">Total AUM: $5,000,000</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {portfolioData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{item.value}%</div>
                <div className="text-xs text-muted-foreground">{item.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;