import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import WalletSummaryCards from './components/WalletSummaryCards';
import WalletFilters from './components/WalletFilters';
import WalletTable from './components/WalletTable';
import AddWalletWizard from './components/AddWalletWizard';
import AddOnWalletConnectors from './components/AddOnWalletConnectors';
import Icon from '../../components/AppIcon';

const WalletManagement = () => {
  const [activeTab, setActiveTab] = useState('connected');
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    custodian: 'all',
    status: 'all'
  });
  const [summaryData, setSummaryData] = useState({
    totalWallets: 0,
    syncHealth: 0,
    totalBalance: '$0.00'
  });

  // Mock wallet data
  const mockWallets = [
    {
      id: 1,
      name: 'Main Treasury Wallet',
      custodian: 'fireblocks',
      status: 'connected',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      balance: '$2,450,000.00',
      address: '0x1234...5678'
    },
    {
      id: 2,
      name: 'Trading Operations',
      custodian: 'bitgo',
      status: 'syncing',
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      balance: '$850,000.00',
      address: '0x9876...4321'
    },
    {
      id: 3,
      name: 'Cold Storage Vault',
      custodian: 'fireblocks',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      balance: '$5,200,000.00',
      address: '0xabcd...efgh'
    },
    {
      id: 4,
      name: 'DeFi Operations',
      custodian: 'bitgo',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      balance: '$320,000.00',
      address: '0xijkl...mnop'
    }
  ];

  useEffect(() => {
    setWallets(mockWallets);
    calculateSummaryData(mockWallets);
  }, []);

  useEffect(() => {
    filterWallets();
  }, [wallets, filters]);

  const calculateSummaryData = (walletData) => {
    const totalWallets = walletData.length;
    const connectedWallets = walletData.filter(w => w.status === 'connected').length;
    const syncHealth = totalWallets > 0 ? Math.round((connectedWallets / totalWallets) * 100) : 0;
    
    const totalBalance = walletData.reduce((sum, wallet) => {
      const balance = parseFloat(wallet.balance.replace(/[$,]/g, ''));
      return sum + balance;
    }, 0);

    setSummaryData({
      totalWallets,
      syncHealth,
      totalBalance: `$${totalBalance.toLocaleString()}.00`
    });
  };

  const filterWallets = () => {
    let filtered = wallets;

    if (filters.search) {
      filtered = filtered.filter(wallet =>
        wallet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        wallet.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.custodian !== 'all') {
      filtered = filtered.filter(wallet => wallet.custodian === filters.custodian);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(wallet => wallet.status === filters.status);
    }

    setFilteredWallets(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleSyncAll = () => {
    setWallets(prev => prev.map(wallet => ({
      ...wallet,
      status: wallet.status === 'disconnected' ? 'syncing' : wallet.status,
      lastSync: new Date()
    })));
    
    // Simulate sync completion
    setTimeout(() => {
      setWallets(prev => prev.map(wallet => ({
        ...wallet,
        status: wallet.status === 'syncing' ? 'connected' : wallet.status
      })));
    }, 3000);
  };

  const handleReconnect = (walletId) => {
    setWallets(prev => prev.map(wallet =>
      wallet.id === walletId
        ? { ...wallet, status: 'syncing', lastSync: new Date() }
        : wallet
    ));
    
    setTimeout(() => {
      setWallets(prev => prev.map(wallet =>
        wallet.id === walletId
          ? { ...wallet, status: 'connected' }
          : wallet
      ));
    }, 2000);
  };

  const handleSync = (walletId) => {
    setWallets(prev => prev.map(wallet =>
      wallet.id === walletId
        ? { ...wallet, lastSync: new Date() }
        : wallet
    ));
  };

  const handleSettings = (walletId) => {
    console.log('Opening settings for wallet:', walletId);
  };

  const handleAddWallet = (newWallet) => {
    setWallets(prev => [...prev, newWallet]);
    setActiveTab('connected');
  };

  const handleUpgradeConnector = (connectorId) => {
    console.log('Upgrading connector:', connectorId);
  };

  const tabs = [
    { id: 'connected', label: 'Connected Wallets', icon: 'Wallet' },
    { id: 'add-wallet', label: 'Add Wallet', icon: 'Plus' },
    { id: 'add-ons', label: 'Add-on Connectors', icon: 'Package' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wallet Management - VaultScope</title>
        <meta name="description" content="Manage and monitor your crypto wallet connections across multiple custodians with real-time sync status and comprehensive controls." />
      </Helmet>

      <SidebarNavigation />
      
      <div className="lg:ml-60">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wallet Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Connect and monitor your crypto wallet integrations
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Summary Cards - Only show on Connected Wallets tab */}
          {activeTab === 'connected' && (
            <WalletSummaryCards summaryData={summaryData} />
          )}

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'connected' && (
                <div className="space-y-6">
                  <WalletFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onSyncAll={handleSyncAll}
                  />
                  
                  <WalletTable
                    wallets={filteredWallets}
                    onReconnect={handleReconnect}
                    onSync={handleSync}
                    onSettings={handleSettings}
                  />
                  
                  {filteredWallets.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Wallet" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No wallets found
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filters.search || filters.custodian !== 'all' || filters.status !== 'all' ?'Try adjusting your filters to see more results.' :'Get started by connecting your first wallet.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'add-wallet' && (
                <AddWalletWizard
                  onComplete={handleAddWallet}
                  onCancel={() => setActiveTab('connected')}
                />
              )}

              {activeTab === 'add-ons' && (
                <AddOnWalletConnectors
                  onUpgrade={handleUpgradeConnector}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletManagement;