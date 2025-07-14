import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import AlertFeed from './components/AlertFeed';
import ComplianceMetrics from './components/ComplianceMetrics';
import TransactionDetailModal from './components/TransactionDetailModal';
import SavedFilters from './components/SavedFilters';

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(true);

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'tx_001',
      hash: '0x7f2a8b3c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      wallet: 'MetaMask Wallet 1',
      amount: 125000.50,
      asset: 'USDC',
      complianceStatus: 'review',
      riskScore: 85,
      type: 'outbound'
    },
    {
      id: 'tx_002',
      hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      wallet: 'Fireblocks Treasury',
      amount: 50000.00,
      asset: 'BTC',
      complianceStatus: 'violation',
      riskScore: 92,
      type: 'inbound'
    },
    {
      id: 'tx_003',
      hash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      wallet: 'BitGo Cold Storage',
      amount: 25000.75,
      asset: 'ETH',
      complianceStatus: 'compliant',
      riskScore: 25,
      type: 'outbound'
    },
    {
      id: 'tx_004',
      hash: '0x5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      wallet: 'Coinbase Custody',
      amount: 75000.25,
      asset: 'USDT',
      complianceStatus: 'pending',
      riskScore: 45,
      type: 'inbound'
    },
    {
      id: 'tx_005',
      hash: '0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      wallet: 'MetaMask Wallet 1',
      amount: 10000.00,
      asset: 'WBTC',
      complianceStatus: 'compliant',
      riskScore: 15,
      type: 'outbound'
    },
    {
      id: 'tx_006',
      hash: '0x8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      wallet: 'Fireblocks Treasury',
      amount: 200000.00,
      asset: 'BTC',
      complianceStatus: 'review',
      riskScore: 78,
      type: 'inbound'
    },
    {
      id: 'tx_007',
      hash: '0x6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      wallet: 'BitGo Cold Storage',
      amount: 5000.50,
      asset: 'USDC',
      complianceStatus: 'compliant',
      riskScore: 20,
      type: 'outbound'
    },
    {
      id: 'tx_008',
      hash: '0x2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      wallet: 'Coinbase Custody',
      amount: 35000.75,
      asset: 'ETH',
      complianceStatus: 'review',
      riskScore: 65,
      type: 'inbound'
    },
    {
      id: 'tx_009',
      hash: '0x4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      wallet: 'MetaMask Wallet 1',
      amount: 15000.25,
      asset: 'USDT',
      complianceStatus: 'compliant',
      riskScore: 30,
      type: 'outbound'
    },
    {
      id: 'tx_010',
      hash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      wallet: 'Fireblocks Treasury',
      amount: 90000.00,
      asset: 'BTC',
      complianceStatus: 'violation',
      riskScore: 88,
      type: 'inbound'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...transactions];

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.timestamp);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && txDate < startDate) return false;
        if (endDate && txDate > endDate) return false;
        return true;
      });
    }

    // Wallet filter
    if (filters.walletId) {
      filtered = filtered.filter(tx => tx.wallet.toLowerCase().includes(filters.walletId.toLowerCase()));
    }

    // Asset filter
    if (filters.assetType) {
      filtered = filtered.filter(tx => tx.asset === filters.assetType);
    }

    // Compliance status filter
    if (filters.complianceStatus) {
      filtered = filtered.filter(tx => tx.complianceStatus === filters.complianceStatus);
    }

    // Risk level filter
    if (filters.riskLevel > 0) {
      filtered = filtered.filter(tx => tx.riskScore >= filters.riskLevel);
    }

    // Amount range filter
    if (filters.amountRange.min || filters.amountRange.max) {
      filtered = filtered.filter(tx => {
        const amount = tx.amount;
        const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
        const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
        return amount >= min && amount <= max;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredTransactions].sort((a, b) => {
      if (column === 'timestamp') {
        return direction === 'asc' 
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      }
      
      if (column === 'amount') {
        return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      
      if (column === 'riskScore') {
        return direction === 'asc' ? a.riskScore - b.riskScore : b.riskScore - a.riskScore;
      }
      
      // String sorting for other columns
      const aValue = a[column]?.toString().toLowerCase() || '';
      const bValue = b[column]?.toString().toLowerCase() || '';
      
      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

    setFilteredTransactions(sorted);
    setSortConfig({ key: column, direction });
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleExportReport = () => {
    // In real app, this would generate and download a report
    const csvContent = [
      ['Transaction Hash', 'Timestamp', 'Wallet', 'Amount', 'Asset', 'Compliance Status', 'Risk Score'],
      ...filteredTransactions.map(tx => [
        tx.hash,
        tx.timestamp.toISOString(),
        tx.wallet,
        tx.amount,
        tx.asset,
        tx.complianceStatus,
        tx.riskScore
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <SidebarNavigation />
        <div className="flex-1 ml-16 lg:ml-60">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading transaction data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      
      <div className="flex-1 ml-16 lg:ml-60">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction Monitoring</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time oversight of crypto transactions with compliance filtering
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters and Saved Filters */}
            <div className="xl:col-span-1 space-y-6">
              <SavedFilters onApplyFilter={handleFiltersChange} />
            </div>

            {/* Main Content Area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Activity" size={20} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {filteredTransactions.length} transactions
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Live monitoring</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportReport}
                    iconName="Download"
                    iconSize={16}
                  >
                    Export Report
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    iconSize={16}
                  >
                    Create Alert Rule
                  </Button>
                </div>
              </div>

              {/* Filter Panel */}
              <FilterPanel
                onFiltersChange={handleFiltersChange}
                isCollapsed={isFilterCollapsed}
                onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
              />

              {/* Transaction Table */}
              <TransactionTable
                transactions={filteredTransactions}
                onTransactionClick={handleTransactionClick}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </div>

            {/* Right Sidebar - Alerts and Metrics */}
            <div className="xl:col-span-1 space-y-6">
              <AlertFeed />
              <ComplianceMetrics />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default TransactionMonitoring;