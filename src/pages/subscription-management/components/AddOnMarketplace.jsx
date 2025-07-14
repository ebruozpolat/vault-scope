import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AddOnMarketplace = ({ addOns, onToggleAddOn }) => {
  const [expandedAddOn, setExpandedAddOn] = useState(null);

  const toggleExpanded = (addOnId) => {
    setExpandedAddOn(expandedAddOn === addOnId ? null : addOnId);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-success' : 'text-muted-foreground';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Add-on Marketplace</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enhance your plan with additional features and integrations
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${addOn.isActive ? 'border-success bg-success/5' : 'border-border'}
                hover:shadow-moderate
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${addOn.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}
                  `}>
                    <Icon name={addOn.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{addOn.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-semibold text-foreground">
                        ${addOn.price}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                      <span className={`text-xs font-medium ${getStatusColor(addOn.isActive)}`}>
                        • {getStatusText(addOn.isActive)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleExpanded(addOn.id)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Toggle details"
                  >
                    <Icon 
                      name={expandedAddOn === addOn.id ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {addOn.description}
              </p>

              {/* Expanded Details */}
              {expandedAddOn === addOn.id && (
                <div className="space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Features</h4>
                    <ul className="space-y-1">
                      {addOn.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {addOn.integrations && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Integrations</h4>
                      <div className="flex flex-wrap gap-2">
                        {addOn.integrations.map((integration, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-background border border-border rounded text-xs text-foreground"
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {addOn.setupTime && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Setup time: {addOn.setupTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {addOn.isActive && (
                    <div className="flex items-center space-x-1 text-xs text-success">
                      <Icon name="Calendar" size={12} />
                      <span>Next billing: {addOn.nextBilling}</span>
                    </div>
                  )}
                </div>

                <Button
                  variant={addOn.isActive ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => onToggleAddOn(addOn.id)}
                  iconName={addOn.isActive ? 'Minus' : 'Plus'}
                >
                  {addOn.isActive ? 'Remove' : 'Add'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-on Summary */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Active Add-ons</h3>
              <p className="text-sm text-muted-foreground">
                {addOns.filter(addon => addon.isActive).length} of {addOns.length} add-ons active
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground">
                +${addOns.filter(addon => addon.isActive).reduce((sum, addon) => sum + addon.price, 0)}
              </div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnMarketplace;