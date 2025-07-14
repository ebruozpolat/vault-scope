import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';
import RoleManagement from './components/RoleManagement';
import UserPermissions from './components/UserPermissions';
import ResourcePermissions from './components/ResourcePermissions';
import PermissionMatrix from './components/PermissionMatrix';
import AccessControlAuditLog from './components/AccessControlAuditLog';

const AccessControl = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalUsers: 24,
    totalRoles: 6,
    activePermissions: 156,
    pendingRequests: 3
  });

  const tabs = [
    { id: 'roles', label: 'Role Management', icon: 'Shield' },
    { id: 'users', label: 'User Permissions', icon: 'Users' },
    { id: 'resources', label: 'Resource Access', icon: 'Lock' },
    { id: 'matrix', label: 'Permission Matrix', icon: 'Grid' },
    { id: 'audit', label: 'Audit Log', icon: 'FileText' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
    setSelectedFilter('all');
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'roles':
        return <RoleManagement searchTerm={searchTerm} filter={selectedFilter} />;
      case 'users':
        return <UserPermissions searchTerm={searchTerm} filter={selectedFilter} />;
      case 'resources':
        return <ResourcePermissions searchTerm={searchTerm} filter={selectedFilter} />;
      case 'matrix':
        return <PermissionMatrix searchTerm={searchTerm} filter={selectedFilter} />;
      case 'audit':
        return <AccessControlAuditLog searchTerm={searchTerm} filter={selectedFilter} />;
      default:
        return <RoleManagement searchTerm={searchTerm} filter={selectedFilter} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Loading Access Control - VaultScope</title>
        </Helmet>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading access control...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Access Control - VaultScope</title>
        <meta name="description" content="Granular permission management for VaultScope crypto treasury platform" />
      </Helmet>

      <SidebarNavigation />

      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Access Control</h1>
              <p className="text-sm text-muted-foreground">Manage permissions and access rights</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Icon name="Users" size={24} className="text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Roles</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRoles}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Icon name="Shield" size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Permissions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activePermissions}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Icon name="Lock" size={24} className="text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingRequests}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Icon name="Clock" size={24} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                      activeTab === tab.id
                        ? "border-primary text-primary" :"border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    )}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center justify-between p-6 bg-muted/30">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select
                  value={selectedFilter}
                  onChange={setSelectedFilter}
                  options={filterOptions}
                  placeholder="Filter by status"
                  className="w-40"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  iconName="Download"
                  onClick={() => {/* Handle export */}}
                >
                  Export
                </Button>
                <Button
                  iconName="Plus"
                  onClick={() => {/* Handle add new */}}
                >
                  Add New
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-card border border-border rounded-lg">
            {renderActiveTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccessControl;