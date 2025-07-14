import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const RoleManagement = ({ searchTerm, filter }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock roles data
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: ['ALL'],
      status: 'active',
      createdAt: '2025-01-01',
      isSystemRole: true
    },
    {
      id: 2,
      name: 'Treasury Manager',
      description: 'Manage wallets and approve transactions',
      userCount: 5,
      permissions: ['wallet.view', 'wallet.create', 'wallet.edit', 'transaction.approve', 'transaction.view'],
      status: 'active',
      createdAt: '2025-01-02',
      isSystemRole: false
    },
    {
      id: 3,
      name: 'Compliance Officer',
      description: 'Monitor compliance and generate reports',
      userCount: 3,
      permissions: ['compliance.view', 'compliance.report', 'audit.view', 'alert.view'],
      status: 'active',
      createdAt: '2025-01-03',
      isSystemRole: false
    },
    {
      id: 4,
      name: 'Analyst',
      description: 'View-only access to analytics and reports',
      userCount: 8,
      permissions: ['dashboard.view', 'analytics.view', 'report.view'],
      status: 'active',
      createdAt: '2025-01-04',
      isSystemRole: false
    },
    {
      id: 5,
      name: 'Auditor',
      description: 'Review transactions and compliance records',
      userCount: 2,
      permissions: ['audit.view', 'transaction.view', 'compliance.view'],
      status: 'inactive',
      createdAt: '2025-01-05',
      isSystemRole: false
    }
  ]);

  // Available permissions
  const availablePermissions = [
    { category: 'Dashboard', permissions: ['dashboard.view', 'dashboard.edit'] },
    { category: 'Wallets', permissions: ['wallet.view', 'wallet.create', 'wallet.edit', 'wallet.delete'] },
    { category: 'Transactions', permissions: ['transaction.view', 'transaction.approve', 'transaction.create'] },
    { category: 'Compliance', permissions: ['compliance.view', 'compliance.report', 'compliance.manage'] },
    { category: 'Analytics', permissions: ['analytics.view', 'analytics.export'] },
    { category: 'Audit', permissions: ['audit.view', 'audit.export'] },
    { category: 'Alerts', permissions: ['alert.view', 'alert.manage'] },
    { category: 'System', permissions: ['user.manage', 'role.manage', 'system.config'] }
  ];

  // Filter roles based on search term and filter
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || role.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateRole = (roleData) => {
    const newRole = {
      id: roles.length + 1,
      ...roleData,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isSystemRole: false
    };
    setRoles([...roles, newRole]);
    setShowCreateModal(false);
  };

  const handleEditRole = (roleData) => {
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? { ...role, ...roleData } : role
    ));
    setShowEditModal(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const getRoleStatusBadge = (status) => {
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

  return (
    <div className="p-6">
      {/* Roles Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role Name</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Users</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permissions</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Shield" size={16} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{role.name}</div>
                      {role.isSystemRole && (
                        <div className="text-xs text-muted-foreground">System Role</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground max-w-xs">
                  <div className="truncate">{role.description}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{role.userCount}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Lock" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">
                      {role.permissions.includes('ALL') ? 'All Permissions' : `${role.permissions.length} permissions`}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getRoleStatusBadge(role.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => setSelectedRole(role)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => {
                        setSelectedRole(role);
                        setShowEditModal(true);
                      }}
                      disabled={role.isSystemRole}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={role.isSystemRole || role.userCount > 0}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No roles found matching your criteria.</p>
        </div>
      )}

      {/* Role Details Modal */}
      {selectedRole && !showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Role Details</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedRole(null)}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Role Name</label>
                <p className="text-muted-foreground">{selectedRole.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <p className="text-muted-foreground">{selectedRole.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <div className="mt-1">{getRoleStatusBadge(selectedRole.status)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Permissions</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedRole.permissions.includes('ALL') ? (
                    <span className="text-success">All Permissions</span>
                  ) : (
                    selectedRole.permissions.map(permission => (
                      <span key={permission} className="text-xs bg-muted px-2 py-1 rounded">
                        {permission}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Assigned Users</label>
                <p className="text-muted-foreground">{selectedRole.userCount} users</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {showCreateModal ? 'Create New Role' : 'Edit Role'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedRole(null);
                }}
              />
            </div>

            <RoleForm
              role={showEditModal ? selectedRole : null}
              onSubmit={showCreateModal ? handleCreateRole : handleEditRole}
              onCancel={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedRole(null);
              }}
              availablePermissions={availablePermissions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Role Form Component
const RoleForm = ({ role, onSubmit, onCancel, availablePermissions }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    status: role?.status || 'active'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.permissions.length === 0) newErrors.permissions = 'At least one permission is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Role Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        required
      />

      <div>
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          placeholder="Describe the role and its responsibilities..."
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description}</p>
        )}
      </div>

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]}
        required
      />

      <div>
        <label className="text-sm font-medium text-foreground">Permissions</label>
        <div className="mt-2 space-y-4 max-h-60 overflow-y-auto border border-border rounded-lg p-4">
          {availablePermissions.map((category) => (
            <div key={category.category}>
              <h4 className="font-medium text-foreground mb-2">{category.category}</h4>
              <div className="space-y-2">
                {category.permissions.map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="h-4 w-4 rounded border border-input bg-background text-primary"
                    />
                    <span className="text-sm text-muted-foreground">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {errors.permissions && (
          <p className="text-sm text-destructive mt-1">{errors.permissions}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

export default RoleManagement;