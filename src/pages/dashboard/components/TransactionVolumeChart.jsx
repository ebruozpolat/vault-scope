import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const TransactionVolumeChart = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const volumeData = [
    { date: '07/08', volume: 1200000, transactions: 45 },
    { date: '07/09', volume: 1800000, transactions: 67 },
    { date: '07/10', volume: 950000, transactions: 34 },
    { date: '07/11', volume: 2100000, transactions: 78 },
    { date: '07/12', volume: 1650000, transactions: 56 },
    { date: '07/13', volume: 2400000, transactions: 89 },
    { date: '07/14', volume: 1900000, transactions: 72 }
  ];

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];

  const formatValue = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <div className="text-sm font-medium text-popover-foreground mb-1">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Volume:</span>
              <span className="text-xs font-medium text-foreground">{formatValue(data.volume)}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Transactions:</span>
              <span className="text-xs font-medium text-foreground">{data.transactions}</span>
            </div>
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
          <h3 className="text-lg font-semibold text-foreground">Transaction Volume</h3>
          <p className="text-sm text-muted-foreground">Daily volume and transaction count</p>
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

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#volumeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionVolumeChart;