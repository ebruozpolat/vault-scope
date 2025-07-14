import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const AccessControlAuditLog = ({ searchTerm, filter }) => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedLog, setSelectedLog] = useState(null);

  // Mock audit log data
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: '2025-01-14 10:30:15',
      action: 'PERMISSION_GRANTED',
      actor: 'John Smith',
      actorId: 1,
      target: 'Sarah Johnson',
      targetId: 2,
      resource: 'Main Treasury Wallet',
      resourceId: 1,
      details: 'Granted transact permission for Main Treasury Wallet',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      category: 'permission'
    },
    {
      id: 2,
      timestamp: '2025-01-14 09:15:22',
      action: 'ROLE_ASSIGNED',
      actor: 'John Smith',
      actorId: 1,
      target: 'Mike Chen',
      targetId: 3,
      resource: 'Compliance Officer Role',
      resourceId: 3,
      details: 'Assigned Compliance Officer role to Mike Chen',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high',
      category: 'role'
    },
    {
      id: 3,
      timestamp: '2025-01-14 08:45:10',
      action: 'ACCESS_DENIED',
      actor: 'System',
      actorId: null,
      target: 'Lisa Wang',
      targetId: 4,
      resource: 'DeFi Staking Pool',
      resourceId: 4,
      details: 'Access denied to DeFi Staking Pool - insufficient permissions',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'low',
      category: 'access'
    },
    {
      id: 4,
      timestamp: '2025-01-14 07:20:30',
      action: 'PERMISSION_REVOKED',
      actor: 'John Smith',
      actorId: 1,
      target: 'Robert Davis',
      targetId: 5,
      resource: 'Bitcoin Holdings',
      resourceId: 2,
      details: 'Revoked manage permission for Bitcoin Holdings',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      category: 'permission'
    },
    {
      id: 5,
      timestamp: '2025-01-13 16:10:45',
      action: 'ROLE_CREATED',
      actor: 'John Smith',
      actorId: 1,
      target: null,
      targetId: null,
      resource: 'Custom Analyst Role',
      resourceId: 6,
      details: 'Created new custom role: Custom Analyst with specific permissions',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'high',
      category: 'role'
    },
    {
      id: 6,
      timestamp: '2025-01-13 15:30:20',
      action: 'LOGIN_SUCCESS',
      actor: 'System',
      actorId: null,
      target: 'Sarah Johnson',
      targetId: 2,
      resource: 'VaultScope Platform',
      resourceId: null,
      details: 'Successful login with Treasury Manager role',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'low',
      category: 'authentication'
    },
    {
      id: 7,
      timestamp: '2025-01-13 14:45:15',
      action: 'RESOURCE_ACCESS',
      actor: 'Mike Chen',
      actorId: 3,
      target: null,
      targetId: null,
      resource: 'Compliance Dashboard',
      resourceId: 5,
      details: 'Accessed compliance dashboard and generated regulatory report',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'low',
      category: 'access'
    },
    {
      id: 8,
      timestamp: '2025-01-13 13:20:05',
      action: 'PERMISSION_MODIFIED',
      actor: 'John Smith',
      actorId: 1,
      target: 'Treasury Manager Role',
      targetId: 2,
      resource: 'Ethereum Wallet',
      resourceId: 3,
      details: 'Modified permissions for Treasury Manager role on Ethereum Wallet',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'medium',
      category: 'permission'
    }
  ]);

  const dateRangeOptions = [
    { value: '1day', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'PERMISSION_GRANTED', label: 'Permission Granted' },
    { value: 'PERMISSION_REVOKED', label: 'Permission Revoked' },
    { value: 'ROLE_ASSIGNED', label: 'Role Assigned' },
    { value: 'ROLE_CREATED', label: 'Role Created' },
    { value: 'ACCESS_DENIED', label: 'Access Denied' },
    { value: 'LOGIN_SUCCESS', label: 'Login Success' },
    { value: 'RESOURCE_ACCESS', label: 'Resource Access' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severity' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  // Filter logs based on search term and filters
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || log.action === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (action) => {
    const icons = {
      PERMISSION_GRANTED: 'CheckCircle',
      PERMISSION_REVOKED: 'XCircle',
      PERMISSION_MODIFIED: 'Edit',
      ROLE_ASSIGNED: 'UserPlus',
      ROLE_CREATED: 'Plus',
      ACCESS_DENIED: 'ShieldX',
      LOGIN_SUCCESS: 'LogIn',
      RESOURCE_ACCESS: 'Eye'
    };
    return icons[action] || 'Activity';
  };

  const getActionColor = (action) => {
    const colors = {
      PERMISSION_GRANTED: 'text-green-500',
      PERMISSION_REVOKED: 'text-red-500',
      PERMISSION_MODIFIED: 'text-blue-500',
      ROLE_ASSIGNED: 'text-purple-500',
      ROLE_CREATED: 'text-indigo-500',
      ACCESS_DENIED: 'text-red-500',
      LOGIN_SUCCESS: 'text-green-500',
      RESOURCE_ACCESS: 'text-blue-500'
    };
    return colors[action] || 'text-gray-500';
  };

  const getSeverityBadge = (severity) => {
    const severityStyles = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        severityStyles[severity]
      )}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleExport = () => {
    // Implementation for exporting audit logs
    console.log('Exporting audit logs...');
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={dateRange}
          onChange={setDateRange}
          options={dateRangeOptions}
          className="w-full sm:w-48"
        />
        
        <Select
          value={filter}
          onChange={() => {}}
          options={actionTypes}
          className="w-full sm:w-48"
        />

        <Select
          value="all"
          onChange={() => {}}
          options={severityOptions}
          className="w-full sm:w-48"
        />

        <div className="flex space-x-2 ml-auto">
          <Button
            variant="outline"
            iconName="Download"
            onClick={handleExport}
          >
            Export Logs
          </Button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timestamp</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actor</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Target</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resource</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Severity</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getActionIcon(log.action)} 
                      size={16} 
                      className={getActionColor(log.action)}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{log.actor}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-foreground">
                  {log.target || '-'}
                </td>
                <td className="py-4 px-4 text-sm text-foreground">
                  {log.resource || '-'}
                </td>
                <td className="py-4 px-4">
                  {getSeverityBadge(log.severity)}
                </td>
                <td className="py-4 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => setSelectedLog(log)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
        </div>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Audit Log Details</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedLog(null)}
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Timestamp</label>
                  <p className="text-muted-foreground">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Action</label>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getActionIcon(selectedLog.action)} 
                      size={16} 
                      className={getActionColor(selectedLog.action)}
                    />
                    <span className="text-muted-foreground">{selectedLog.action.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Actor</label>
                  <p className="text-muted-foreground">{selectedLog.actor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Target</label>
                  <p className="text-muted-foreground">{selectedLog.target || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Resource</label>
                <p className="text-muted-foreground">{selectedLog.resource || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Details</label>
                <p className="text-muted-foreground">{selectedLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">IP Address</label>
                  <p className="text-muted-foreground">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Severity</label>
                  <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">User Agent</label>
                <p className="text-muted-foreground text-sm break-all">{selectedLog.userAgent}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold text-foreground">{auditLogs.length}</p>
            </div>
            <Icon name="Activity" size={24} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Severity</p>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs.filter(log => log.severity === 'high').length}
              </p>
            </div>
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Access Denied</p>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs.filter(log => log.action === 'ACCESS_DENIED').length}
              </p>
            </div>
            <Icon name="ShieldX" size={24} className="text-red-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recent Activity</p>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs.filter(log => 
                  new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
            <Icon name="Clock" size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlAuditLog;