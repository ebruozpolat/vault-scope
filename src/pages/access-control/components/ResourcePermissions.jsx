import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const ResourcePermissions = ({ searchTerm, filter }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Mock resources data
  const [resources, setResources] = useState([
    {
      id: 1,
      name: 'Main Treasury Wallet',
      type: 'wallet',
      description: 'Primary wallet for institutional holdings',
      balance: '$2.5M',
      permissions: [
        { roleId: 1, roleName: 'Super Admin', permissions: ['view', 'transact', 'manage'] },
        { roleId: 2, roleName: 'Treasury Manager', permissions: ['view', 'transact'] },
        { roleId: 4, roleName: 'Analyst', permissions: ['view'] }
      ],
      status: 'active',
      lastAccessed: '2025-01-14 10:30:00'
    },
    {
      id: 2,
      name: 'Bitcoin Holdings',
      type: 'asset',
      description: 'Bitcoin cryptocurrency holdings',
      balance: '45.2 BTC',
      permissions: [
        { roleId: 1, roleName: 'Super Admin', permissions: ['view', 'transact', 'manage'] },
        { roleId: 2, roleName: 'Treasury Manager', permissions: ['view', 'transact'] },
        { roleId: 3, roleName: 'Compliance Officer', permissions: ['view'] },
        { roleId: 4, roleName: 'Analyst', permissions: ['view'] }
      ],
      status: 'active',
      lastAccessed: '2025-01-14 09:15:00'
    },
    {
      id: 3,
      name: 'DeFi Staking Pool',
      type: 'function',
      description: 'Automated staking operations',
      balance: '$500K',
      permissions: [
        { roleId: 1, roleName: 'Super Admin', permissions: ['view', 'execute', 'manage'] },
        { roleId: 2, roleName: 'Treasury Manager', permissions: ['view', 'execute'] }
      ],
      status: 'active',
      lastAccessed: '2025-01-14 08:45:00'
    },
    {
      id: 4,
      name: 'Ethereum Wallet',
      type: 'wallet',
      description: 'Ethereum and ERC-20 token wallet',
      balance: '$1.2M',
      permissions: [
        { roleId: 1, roleName: 'Super Admin', permissions: ['view', 'transact', 'manage'] },
        { roleId: 2, roleName: 'Treasury Manager', permissions: ['view', 'transact'] },
        { roleId: 4, roleName: 'Analyst', permissions: ['view'] }
      ],
      status: 'active',
      lastAccessed: '2025-01-14 07:20:00'
    },
    {
      id: 5,
      name: 'Compliance Dashboard',
      type: 'function',
      description: 'Regulatory reporting and compliance monitoring',
      balance: null,
      permissions: [
        { roleId: 1, roleName: 'Super Admin', permissions: ['view', 'execute', 'manage'] },
        { roleId: 3, roleName: 'Compliance Officer', permissions: ['view', 'execute'] },
        { roleId: 5, roleName: 'Auditor', permissions: ['view'] }
      ],
      status: 'active',
      lastAccessed: '2025-01-13 16:10:00'
    }
  ]);

  // Available permission types for different resource types
  const permissionTypes = {
    wallet: [
      { value: 'view', label: 'View Balance & Transactions' },
      { value: 'transact', label: 'Create Transactions' },
      { value: 'manage', label: 'Manage Wallet Settings' }
    ],
    asset: [
      { value: 'view', label: 'View Holdings' },
      { value: 'transact', label: 'Buy/Sell/Transfer' },
      { value: 'manage', label: 'Manage Asset Settings' }
    ],
    function: [
      { value: 'view', label: 'View Function Status' },
      { value: 'execute', label: 'Execute Function' },
      { value: 'manage', label: 'Manage Function Settings' }
    ]
  };

  // Available roles
  const availableRoles = [
    { value: 1, label: 'Super Admin' },
    { value: 2, label: 'Treasury Manager' },
    { value: 3, label: 'Compliance Officer' },
    { value: 4, label: 'Analyst' },
    { value: 5, label: 'Auditor' }
  ];

  // Filter resources based on search term and filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter !== 'all') {
      if (filter === 'active' || filter === 'inactive') {
        matchesFilter = resource.status === filter;
      } else {
        matchesFilter = resource.type === filter;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleUpdatePermissions = (resourceId, newPermissions) => {
    setResources(resources.map(resource => 
      resource.id === resourceId ? { ...resource, permissions: newPermissions } : resource
    ));
    setShowPermissionModal(false);
    setSelectedResource(null);
  };

  const getResourceTypeIcon = (type) => {
    const icons = {
      wallet: 'Wallet',
      asset: 'Coins',
      function: 'Settings'
    };
    return icons[type] || 'Box';
  };

  const getResourceTypeBadge = (type) => {
    const typeStyles = {
      wallet: 'bg-blue-100 text-blue-800 border-blue-200',
      asset: 'bg-green-100 text-green-800 border-green-200',
      function: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        typeStyles[type]
      )}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatLastAccessed = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      {/* Resources Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resource</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Balance/Value</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Access Granted</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Accessed</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name={getResourceTypeIcon(resource.type)} size={20} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{resource.name}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">{resource.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getResourceTypeBadge(resource.type)}
                </td>
                <td className="py-4 px-4">
                  {resource.balance && (
                    <div className="font-medium text-foreground">{resource.balance}</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{resource.permissions.length} roles</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground text-sm">
                  {formatLastAccessed(resource.lastAccessed)}
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(resource.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => setSelectedResource(resource)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Lock"
                      onClick={() => {
                        setSelectedResource(resource);
                        setShowPermissionModal(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Box" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No resources found matching your criteria.</p>
        </div>
      )}

      {/* Resource Details Modal */}
      {selectedResource && !showPermissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Resource Access Details</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedResource(null)}
              />
            </div>

            <div className="space-y-6">
              {/* Resource Info */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getResourceTypeIcon(selectedResource.type)} size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground">{selectedResource.name}</h3>
                  <p className="text-muted-foreground">{selectedResource.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {getResourceTypeBadge(selectedResource.type)}
                    {getStatusBadge(selectedResource.status)}
                  </div>
                  {selectedResource.balance && (
                    <p className="text-sm text-foreground mt-2">
                      <strong>Balance:</strong> {selectedResource.balance}
                    </p>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Role Permissions</h4>
                <div className="space-y-3">
                  {selectedResource.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Shield" size={16} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{permission.roleName}</span>
                      </div>
                      <div className="flex space-x-2">
                        {permission.permissions.map((perm) => (
                          <span key={perm} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Activity</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Last accessed: {formatLastAccessed(selectedResource.lastAccessed)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Management Modal */}
      {showPermissionModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Manage Resource Permissions</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedResource(null);
                }}
              />
            </div>

            <ResourcePermissionForm
              resource={selectedResource}
              availableRoles={availableRoles}
              permissionTypes={permissionTypes}
              onSubmit={handleUpdatePermissions}
              onCancel={() => {
                setShowPermissionModal(false);
                setSelectedResource(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Resource Permission Form Component
const ResourcePermissionForm = ({ resource, availableRoles, permissionTypes, onSubmit, onCancel }) => {
  const [permissions, setPermissions] = useState(resource.permissions || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(resource.id, permissions);
  };

  const addRolePermission = (roleId) => {
    const role = availableRoles.find(r => r.value === roleId);
    if (role && !permissions.find(p => p.roleId === roleId)) {
      setPermissions([...permissions, {
        roleId: roleId,
        roleName: role.label,
        permissions: []
      }]);
    }
  };

  const removeRolePermission = (roleId) => {
    setPermissions(permissions.filter(p => p.roleId !== roleId));
  };

  const updateRolePermissions = (roleId, newPermissions) => {
    setPermissions(permissions.map(p => 
      p.roleId === roleId ? { ...p, permissions: newPermissions } : p
    ));
  };

  const togglePermission = (roleId, permission) => {
    const rolePermission = permissions.find(p => p.roleId === roleId);
    if (rolePermission) {
      const newPermissions = rolePermission.permissions.includes(permission)
        ? rolePermission.permissions.filter(p => p !== permission)
        : [...rolePermission.permissions, permission];
      updateRolePermissions(roleId, newPermissions);
    }
  };

  const unassignedRoles = availableRoles.filter(role => 
    !permissions.find(p => p.roleId === role.value)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resource Info */}
      <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={resource.type === 'wallet' ? 'Wallet' : resource.type === 'asset' ? 'Coins' : 'Settings'} size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{resource.name}</h3>
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </div>
      </div>

      {/* Role Permissions */}
      <div>
        <h4 className="font-medium text-foreground mb-4">Role Permissions</h4>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div key={permission.roleId} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{permission.roleName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => removeRolePermission(permission.roleId)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {permissionTypes[resource.type]?.map((permType) => (
                  <label key={permType.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permission.permissions.includes(permType.value)}
                      onChange={() => togglePermission(permission.roleId, permType.value)}
                      className="h-4 w-4 rounded border border-input bg-background text-primary"
                    />
                    <span className="text-sm text-foreground">{permType.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Role */}
        {unassignedRoles.length > 0 && (
          <div className="mt-4">
            <Select
              placeholder="Add role permission..."
              options={unassignedRoles}
              onChange={(value) => addRolePermission(value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Permissions
        </Button>
      </div>
    </form>
  );
};

export default ResourcePermissions;