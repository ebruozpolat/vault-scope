import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const SidebarNavigation = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard'
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: 'Shield',
      children: [
        {
          label: 'Transaction Monitoring',
          path: '/transaction-monitoring',
          icon: 'Search'
        },
        {
          label: 'Real-Time Alerts',
          path: '/real-time-alerts',
          icon: 'Bell'
        }
      ]
    },
    {
      id: 'wallet-management',
      label: 'Wallet Management',
      icon: 'Wallet',
      path: '/wallet-management'
    },
    {
      id: 'auto-rebalancing',
      label: 'Auto-Rebalancing',
      icon: 'RotateCcw',
      path: '/auto-rebalancing'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: 'FileCheck',
      path: '/compliance-dashboard'
    },
    {
      id: 'access-control',
      label: 'Access Control',
      icon: 'Key',
      path: '/access-control'
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: 'CreditCard',
      path: '/subscription-management'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (children) => {
    return children?.some(child => isActiveRoute(child.path));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={24} className="text-primary" />
            <span className="text-lg font-bold text-foreground">VaultScope</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedSections.has(item.id);
            const isActive = item.path ? isActiveRoute(item.path) : isParentActive(item.children);

            return (
              <div key={item.id}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                        isActive 
                          ? "bg-accent text-accent-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={item.icon} size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <Icon 
                        name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                        size={16} 
                        className="transition-transform"
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={onClose}
                            className={cn(
                              "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                              isActiveRoute(child.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <Icon name={child.icon} size={16} />
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SidebarNavigation;