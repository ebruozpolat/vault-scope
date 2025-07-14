import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserAccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock user data - in real app this would come from context/state
  const user = {
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: '/assets/images/avatar-placeholder.jpg',
    subscriptionTier: 'Enterprise',
    subscriptionStatus: 'Active'
  };

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

  const handleLogout = () => {
    // In real app, this would clear auth tokens, user state, etc.
    localStorage.removeItem('authToken');
    navigate('/login');
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'Account Settings',
      icon: 'User',
      action: () => {
        navigate('/account-settings');
        setIsOpen(false);
      }
    },
    {
      label: 'Subscription',
      icon: 'CreditCard',
      action: () => {
        navigate('/subscription-management');
        setIsOpen(false);
      }
    },
    {
      label: 'Security',
      icon: 'Shield',
      action: () => {
        navigate('/security-settings');
        setIsOpen(false);
      }
    },
    {
      label: 'Support',
      icon: 'HelpCircle',
      action: () => {
        window.open('https://support.vaultscope.com', '_blank');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-3">
          <Image
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.subscriptionTier}</div>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success font-medium">
                    {user.subscriptionTier} • {user.subscriptionStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-muted transition-colors focus:outline-none focus:bg-muted"
              >
                <Icon 
                  name={item.icon} 
                  size={16} 
                  className="text-muted-foreground flex-shrink-0"
                />
                <span className="text-sm text-popover-foreground">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-destructive/10 transition-colors focus:outline-none focus:bg-destructive/10 group"
            >
              <Icon 
                name="LogOut" 
                size={16} 
                className="text-muted-foreground group-hover:text-destructive flex-shrink-0 transition-colors"
              />
              <span className="text-sm text-popover-foreground group-hover:text-destructive transition-colors">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountDropdown;