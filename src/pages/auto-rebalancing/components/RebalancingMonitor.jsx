import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RebalancingMonitor = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [realTimeData, setRealTimeData] = useState({
    currentAllocations: [
      { asset: 'BTC', current: 42.5, target: 40.0, deviation: 2.5, status: 'normal' },
      { asset: 'ETH', current: 28.3, target: 30.0, deviation: -1.7, status: 'normal' },
      { asset: 'USDC', current: 19.2, target: 20.0, deviation: -0.8, status: 'normal' },
      { asset: 'SOL', current: 10.0, target: 10.0, deviation: 0.0, status: 'normal' }
    ],
    portfolioValue: 5200000,
    totalDeviation: 1.75,
    nextRebalance: '2025-01-17T14:30:00Z',
    rebalancingActive: false
  });

  const [chartData, setChartData] = useState([]);
  const [deviationHistory, setDeviationHistory] = useState([]);

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date();
      const newDataPoint = {
        time: now.toISOString(),
        btc: 42.5 + (Math.random() - 0.5) * 2,
        eth: 28.3 + (Math.random() - 0.5) * 2,
        usdc: 19.2 + (Math.random() - 0.5) * 1,
        sol: 10.0 + (Math.random() - 0.5) * 1
      };

      setChartData(prev => [...prev.slice(-19), newDataPoint]);

      // Update deviation history
      const deviation = Math.abs(newDataPoint.btc - 40) + Math.abs(newDataPoint.eth - 30) + 
                       Math.abs(newDataPoint.usdc - 20) + Math.abs(newDataPoint.sol - 10);
      
      setDeviationHistory(prev => [...prev.slice(-19), {
        time: now.toISOString(),
        deviation: deviation / 4
      }]);

      // Update real-time allocations
      setRealTimeData(prev => ({
        ...prev,
        currentAllocations: [
          { asset: 'BTC', current: newDataPoint.btc, target: 40.0, deviation: newDataPoint.btc - 40, status: Math.abs(newDataPoint.btc - 40) > 5 ? 'warning' : 'normal' },
          { asset: 'ETH', current: newDataPoint.eth, target: 30.0, deviation: newDataPoint.eth - 30, status: Math.abs(newDataPoint.eth - 30) > 5 ? 'warning' : 'normal' },
          { asset: 'USDC', current: newDataPoint.usdc, target: 20.0, deviation: newDataPoint.usdc - 20, status: Math.abs(newDataPoint.usdc - 20) > 5 ? 'warning' : 'normal' },
          { asset: 'SOL', current: newDataPoint.sol, target: 10.0, deviation: newDataPoint.sol - 10, status: Math.abs(newDataPoint.sol - 10) > 5 ? 'warning' : 'normal' }
        ],
        totalDeviation: deviation / 4
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const formatNextRebalance = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return 'Due now';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-popover-foreground mb-2">
            {formatTime(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground uppercase">{entry.dataKey}</span>
              </div>
              <span className="text-xs font-medium text-popover-foreground">
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Rebalancing Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of portfolio allocations and rebalancing triggers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
            options={timeRanges}
          />
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-xl font-semibold text-foreground">
                ${(realTimeData.portfolioValue / 1000000).toFixed(2)}M
              </div>
            </div>
            <Icon name="DollarSign" size={20} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Deviation</div>
              <div className={`text-xl font-semibold ${
                realTimeData.totalDeviation > 3 ? 'text-warning' : 'text-foreground'
              }`}>
                {realTimeData.totalDeviation.toFixed(1)}%
              </div>
            </div>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Next Rebalance</div>
              <div className="text-xl font-semibold text-foreground">
                {formatNextRebalance(realTimeData.nextRebalance)}
              </div>
            </div>
            <Icon name="Clock" size={20} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className={`text-xl font-semibold ${
                realTimeData.rebalancingActive ? 'text-warning' : 'text-success'
              }`}>
                {realTimeData.rebalancingActive ? 'Active' : 'Idle'}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              realTimeData.rebalancingActive ? 'bg-warning' : 'bg-success'
            }`} />
          </div>
        </div>
      </div>

      {/* Current Allocations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current vs Target Allocations</h3>
        <div className="space-y-4">
          {realTimeData.currentAllocations.map((allocation) => (
            <div key={allocation.asset} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 text-sm font-medium text-foreground">{allocation.asset}</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    allocation.status === 'warning' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <span className={`text-xs ${
                    allocation.status === 'warning' ? 'text-warning' : 'text-muted-foreground'
                  }`}>
                    {allocation.status === 'warning' ? 'Needs Rebalancing' : 'Within Target'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{allocation.current.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{allocation.target.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Target</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    allocation.deviation > 0 ? 'text-success' : 'text-error'
                  }`}>
                    {allocation.deviation > 0 ? '+' : ''}{allocation.deviation.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Deviation</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Allocation Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTime}
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="btc" 
                  stroke="#F7931A" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="eth" 
                  stroke="#627EEA" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="usdc" 
                  stroke="#2775CA" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sol" 
                  stroke="#9945FF" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deviation Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Deviation History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviationHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTime}
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Deviation']}
                  labelFormatter={(label) => `Time: ${formatTime(label)}`}
                />
                <Bar dataKey="deviation" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rebalancing Triggers */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Triggers</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Scheduled Rebalancing</div>
                <div className="text-xs text-muted-foreground">Every Monday at 2:30 PM UTC</div>
              </div>
            </div>
            <div className="text-sm text-success">Active</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Deviation Threshold</div>
                <div className="text-xs text-muted-foreground">Trigger when any asset deviates &gt;5%</div>
              </div>
            </div>
            <div className="text-sm text-success">Active</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Volatility Protection</div>
                <div className="text-xs text-muted-foreground">Pause rebalancing during high volatility</div>
              </div>
            </div>
            <div className="text-sm text-success">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancingMonitor;