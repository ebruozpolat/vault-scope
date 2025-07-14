import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const UserPermissions = ({ searchTerm, filter }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Mock users data with roles and permissions
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Super Admin',
      roleId: 1,
      department: 'IT',
      lastLogin: '2025-01-14 10:30:00',
      status: 'active',
      permissions: ['ALL'],
      directPermissions: [],
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Treasury Manager',
      roleId: 2,
      department: 'Finance',
      lastLogin: '2025-01-14 09:15:00',
      status: 'active',
      permissions: ['wallet.view', 'wallet.create', 'wallet.edit', 'transaction.approve', 'transaction.view'],
      directPermissions: ['analytics.view']
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Compliance Officer',
      roleId: 3,
      department: 'Compliance',
      lastLogin: '2025-01-14 08:45:00',
      status: 'active',
      permissions: ['compliance.view', 'compliance.report', 'audit.view', 'alert.view'],
      directPermissions: []
    },
    {
      id: 4,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      role: 'Analyst',
      roleId: 4,
      department: 'Analytics',
      lastLogin: '2025-01-13 16:20:00',
      status: 'active',
      permissions: ['dashboard.view', 'analytics.view', 'report.view'],
      directPermissions: ['wallet.view']
    },
    {
      id: 5,
      name: 'Robert Davis',
      email: 'robert.davis@company.com',
      role: 'Auditor',
      roleId: 5,
      department: 'Audit',
      lastLogin: '2025-01-12 14:10:00',
      status: 'inactive',
      permissions: ['audit.view', 'transaction.view', 'compliance.view'],
      directPermissions: []
    }
  ]);

  // Available roles for assignment
  const availableRoles = [
    { value: 1, label: 'Super Admin' },
    { value: 2, label: 'Treasury Manager' },
    { value: 3, label: 'Compliance Officer' },
    { value: 4, label: 'Analyst' },
    { value: 5, label: 'Auditor' }
  ];

  // Available permissions for direct assignment
  const availablePermissions = [
    { value: 'dashboard.view', label: 'View Dashboard' },
    { value: 'wallet.view', label: 'View Wallets' },
    { value: 'wallet.create', label: 'Create Wallets' },
    { value: 'wallet.edit', label: 'Edit Wallets' },
    { value: 'transaction.view', label: 'View Transactions' },
    { value: 'transaction.approve', label: 'Approve Transactions' },
    { value: 'compliance.view', label: 'View Compliance' },
    { value: 'compliance.report', label: 'Generate Reports' },
    { value: 'analytics.view', label: 'View Analytics' },
    { value: 'audit.view', label: 'View Audit Logs' },
    { value: 'alert.view', label: 'View Alerts' }
  ];

  // Filter users based on search term and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAssignPermissions = (userId, newRole, newDirectPermissions) => {
    setUsers(users.map(user => 
      user.id === userId ? {
        ...user,
        role: availableRoles.find(r => r.value === newRole)?.label || user.role,
        roleId: newRole,
        directPermissions: newDirectPermissions
      } : user
    ));
    setShowAssignModal(false);
    setSelectedUser(null);
  };

  const getUserStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permissions</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Login</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{user.role}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground">
                  {user.department}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Lock" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">
                      {user.permissions.includes('ALL') ? 'All Permissions' : `${user.permissions.length} permissions`}
                    </span>
                    {user.directPermissions.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        +{user.directPermissions.length} direct
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground text-sm">
                  {formatLastLogin(user.lastLogin)}
                </td>
                <td className="py-4 px-4">
                  {getUserStatusBadge(user.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => setSelectedUser(user)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAssignModal(true);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Key"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAssignModal(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && !showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">User Permissions</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedUser(null)}
              />
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.department} • {selectedUser.role}</p>
                </div>
              </div>

              {/* Role Permissions */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Role Permissions ({selectedUser.role})</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.includes('ALL') ? (
                    <span className="text-success">All Permissions</span>
                  ) : (
                    selectedUser.permissions.map(permission => (
                      <span key={permission} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {permission}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Direct Permissions */}
              {selectedUser.directPermissions.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Direct Permissions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUser.directPermissions.map(permission => (
                      <span key={permission} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status and Activity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <div className="mt-1">{getUserStatusBadge(selectedUser.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Last Login</label>
                  <p className="text-muted-foreground text-sm">{formatLastLogin(selectedUser.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal */}
      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Assign Permissions</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUser(null);
                }}
              />
            </div>

            <AssignPermissionsForm
              user={selectedUser}
              availableRoles={availableRoles}
              availablePermissions={availablePermissions}
              onSubmit={handleAssignPermissions}
              onCancel={() => {
                setShowAssignModal(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Assign Permissions Form Component
const AssignPermissionsForm = ({ user, availableRoles, availablePermissions, onSubmit, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState(user.roleId);
  const [selectedPermissions, setSelectedPermissions] = useState(user.directPermissions || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(user.id, selectedRole, selectedPermissions);
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Info */}
      <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Role Assignment */}
      <Select
        label="Primary Role"
        value={selectedRole}
        onChange={setSelectedRole}
        options={availableRoles}
        description="The primary role determines the base set of permissions"
      />

      {/* Direct Permissions */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Additional Direct Permissions
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          These permissions are granted directly to the user in addition to their role permissions
        </p>
        <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-4 space-y-2">
          {availablePermissions.map((permission) => (
            <label key={permission.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.value)}
                onChange={() => handlePermissionToggle(permission.value)}
                className="h-4 w-4 rounded border border-input bg-background text-primary"
              />
              <span className="text-sm text-foreground">{permission.label}</span>
            </label>
          ))}
        </div>
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

export default UserPermissions;