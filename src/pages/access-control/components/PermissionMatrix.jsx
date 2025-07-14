import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const PermissionMatrix = ({ searchTerm, filter }) => {
  const [viewMode, setViewMode] = useState('role'); // 'role' or 'user'
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  // Mock data
  const roles = [
    { id: 1, name: 'Super Admin', color: 'bg-red-500' },
    { id: 2, name: 'Treasury Manager', color: 'bg-blue-500' },
    { id: 3, name: 'Compliance Officer', color: 'bg-green-500' },
    { id: 4, name: 'Analyst', color: 'bg-yellow-500' },
    { id: 5, name: 'Auditor', color: 'bg-purple-500' }
  ];

  const users = [
    { id: 1, name: 'John Smith', roleId: 1, email: 'john.smith@company.com' },
    { id: 2, name: 'Sarah Johnson', roleId: 2, email: 'sarah.johnson@company.com' },
    { id: 3, name: 'Mike Chen', roleId: 3, email: 'mike.chen@company.com' },
    { id: 4, name: 'Lisa Wang', roleId: 4, email: 'lisa.wang@company.com' },
    { id: 5, name: 'Robert Davis', roleId: 5, email: 'robert.davis@company.com' }
  ];

  const resources = [
    { id: 1, name: 'Main Treasury Wallet', type: 'wallet' },
    { id: 2, name: 'Bitcoin Holdings', type: 'asset' },
    { id: 3, name: 'Ethereum Wallet', type: 'wallet' },
    { id: 4, name: 'DeFi Staking Pool', type: 'function' },
    { id: 5, name: 'Compliance Dashboard', type: 'function' },
    { id: 6, name: 'Analytics Reports', type: 'function' },
    { id: 7, name: 'USDC Holdings', type: 'asset' },
    { id: 8, name: 'Cold Storage Wallet', type: 'wallet' }
  ];

  const permissions = ['view', 'transact', 'manage', 'execute'];

  // Mock permission matrix data
  const permissionMatrix = {
    1: { // Super Admin
      1: ['view', 'transact', 'manage'], // Main Treasury Wallet
      2: ['view', 'transact', 'manage'], // Bitcoin Holdings
      3: ['view', 'transact', 'manage'], // Ethereum Wallet
      4: ['view', 'execute', 'manage'], // DeFi Staking Pool
      5: ['view', 'execute', 'manage'], // Compliance Dashboard
      6: ['view', 'execute', 'manage'], // Analytics Reports
      7: ['view', 'transact', 'manage'], // USDC Holdings
      8: ['view', 'transact', 'manage']  // Cold Storage Wallet
    },
    2: { // Treasury Manager
      1: ['view', 'transact'],
      2: ['view', 'transact'],
      3: ['view', 'transact'],
      4: ['view', 'execute'],
      6: ['view'],
      7: ['view', 'transact'],
      8: ['view']
    },
    3: { // Compliance Officer
      2: ['view'],
      5: ['view', 'execute'],
      6: ['view', 'execute'],
      7: ['view']
    },
    4: { // Analyst
      1: ['view'],
      2: ['view'],
      3: ['view'],
      6: ['view'],
      7: ['view']
    },
    5: { // Auditor
      2: ['view'],
      5: ['view'],
      6: ['view'],
      7: ['view']
    }
  };

  const viewModeOptions = [
    { value: 'role', label: 'View by Role' },
    { value: 'user', label: 'View by User' }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...roles.map(role => ({ value: role.id, label: role.name }))
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    ...users.map(user => ({ value: user.id, label: user.name }))
  ];

  const getPermissionIcon = (permission) => {
    const icons = {
      view: 'Eye',
      transact: 'ArrowRightLeft',
      manage: 'Settings',
      execute: 'Play'
    };
    return icons[permission] || 'Circle';
  };

  const getPermissionColor = (permission) => {
    const colors = {
      view: 'text-blue-500',
      transact: 'text-orange-500',
      manage: 'text-red-500',
      execute: 'text-green-500'
    };
    return colors[permission] || 'text-gray-500';
  };

  const hasPermission = (roleId, resourceId, permission) => {
    return permissionMatrix[roleId]?.[resourceId]?.includes(permission) || false;
  };

  const getResourceIcon = (type) => {
    const icons = {
      wallet: 'Wallet',
      asset: 'Coins',
      function: 'Settings'
    };
    return icons[type] || 'Box';
  };

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = viewMode === 'role' ? (
    selectedRole === 'all' ? roles : roles.filter(role => role.id === selectedRole)
  ) : (
    selectedUser === 'all' ? roles : roles.filter(role => role.id === users.find(u => u.id === selectedUser)?.roleId)
  );

  const handleExport = () => {
    // Implementation for exporting permission matrix
    console.log('Exporting permission matrix...');
  };

  return (
    <div className="p-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={viewMode}
          onChange={setViewMode}
          options={viewModeOptions}
          className="w-full sm:w-48"
        />
        
        {viewMode === 'role' ? (
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            options={roleOptions}
            className="w-full sm:w-48"
          />
        ) : (
          <Select
            value={selectedUser}
            onChange={setSelectedUser}
            options={userOptions}
            className="w-full sm:w-48"
          />
        )}

        <div className="flex space-x-2 ml-auto">
          <Button
            variant="outline"
            iconName="Download"
            onClick={handleExport}
          >
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Permission Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Icon 
                name={getPermissionIcon(permission)} 
                size={16} 
                className={getPermissionColor(permission)}
              />
              <span className="text-sm text-foreground capitalize">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-muted/50 border border-border font-medium text-foreground">
                  Resource
                </th>
                {filteredRoles.map((role) => (
                  <th key={role.id} className="text-center p-3 bg-muted/50 border border-border font-medium text-foreground min-w-[120px]">
                    <div className="flex items-center justify-center space-x-2">
                      <div className={cn("w-3 h-3 rounded-full", role.color)}></div>
                      <span className="text-sm">{role.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-muted/30">
                  <td className="p-3 border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={getResourceIcon(resource.type)} size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{resource.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{resource.type}</div>
                      </div>
                    </div>
                  </td>
                  {filteredRoles.map((role) => (
                    <td key={role.id} className="p-3 border border-border text-center">
                      <div className="flex justify-center space-x-1">
                        {permissions.map((permission) => {
                          const hasAccess = hasPermission(role.id, resource.id, permission);
                          return (
                            <div
                              key={permission}
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                hasAccess 
                                  ? "bg-primary/20 border-2 border-primary/40" :"bg-muted border-2 border-muted-foreground/20"
                              )}
                              title={`${permission} - ${hasAccess ? 'Granted' : 'Denied'}`}
                            >
                              <Icon 
                                name={getPermissionIcon(permission)} 
                                size={12} 
                                className={cn(
                                  hasAccess 
                                    ? getPermissionColor(permission) 
                                    : "text-muted-foreground"
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Grid" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No resources found matching your criteria.</p>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Resources</p>
              <p className="text-2xl font-bold text-foreground">{resources.length}</p>
            </div>
            <Icon name="Box" size={24} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Roles</p>
              <p className="text-2xl font-bold text-foreground">{roles.length}</p>
            </div>
            <Icon name="Shield" size={24} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Permission Types</p>
              <p className="text-2xl font-bold text-foreground">{permissions.length}</p>
            </div>
            <Icon name="Lock" size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;