import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import realTimeAlertingService from '../../services/realTimeAlertingService';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Subscribe to real-time alerts for notifications
    const handleNewAlert = (alert) => {
      const notification = {
        id: alert.id,
        type: alert.category || 'system',
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
        read: false,
        priority: alert.severity,
        icon: getAlertIcon(alert.type),
        alertData: alert
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep latest 20
    };

    const handleAlertResolved = (alert) => {
      const notification = {
        id: `resolved_${alert.id}`,
        type: 'system',
        title: 'Alert Resolved',
        message: `${alert.title} has been resolved`,
        timestamp: new Date(),
        read: false,
        priority: 'low',
        icon: 'CheckCircle',
        alertData: alert
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    };

    // Event listeners
    realTimeAlertingService.on('new_alert', handleNewAlert);
    realTimeAlertingService.on('alert_resolved', handleAlertResolved);

    // Initialize with mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'compliance',
        title: 'Compliance Report Ready',
        message: 'Monthly compliance report for December 2024 is ready for review.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high',
        icon: 'Shield'
      },
      {
        id: 2,
        type: 'wallet',
        title: 'Wallet Connection Status',
        message: 'MetaMask wallet successfully connected and synchronized.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: 'medium',
        icon: 'Wallet'
      },
      {
        id: 3,
        type: 'system',
        title: 'Real-Time Monitoring Active',
        message: 'Real-time alert monitoring has been activated for all connected wallets.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: 'low',
        icon: 'Activity'
      }
    ];

    setNotifications(mockNotifications);

    return () => {
      realTimeAlertingService.off('new_alert', handleNewAlert);
      realTimeAlertingService.off('alert_resolved', handleAlertResolved);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'high_risk_transaction':
        return 'AlertTriangle';
      case 'compliance_violation':
        return 'Shield';
      case 'large_amount':
        return 'DollarSign';
      case 'suspicious_pattern':
        return 'Search';
      case 'wallet_connection_issue':
        return 'Wifi';
      default:
        return 'Bell';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'compliance': return 'bg-primary/10 text-primary';
      case 'wallet': return 'bg-success/10 text-success';
      case 'transaction': return 'bg-warning/10 text-warning';
      case 'suspicious_activity': return 'bg-error/10 text-error';
      case 'system': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Icon 
          name="Bell" 
          size={20} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center animate-pulse-subtle">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-popover-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      relative p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors
                      ${!notification.read ? 'bg-accent/5' : ''}
                    `}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute left-2 top-6 w-2 h-2 bg-accent rounded-full"></div>
                    )}

                    <div className="flex items-start space-x-3 ml-4">
                      {/* Icon */}
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${getTypeColor(notification.type)}
                      `}>
                        <Icon name={notification.icon} size={16} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-popover-foreground truncate">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="ml-2 p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                            aria-label="Dismiss notification"
                          >
                            <Icon name="X" size={12} className="text-muted-foreground" />
                          </button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <button className="w-full text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;