import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanChangeModal = ({ isOpen, onClose, selectedPlan, currentPlan, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  const isUpgrade = selectedPlan.price > currentPlan.price;
  const priceDifference = Math.abs(selectedPlan.price - currentPlan.price);
  const effectiveDate = new Date();
  effectiveDate.setDate(effectiveDate.getDate() + 1);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(selectedPlan);
      onClose();
    } catch (error) {
      console.error('Plan change failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateProration = () => {
    const daysInMonth = 30;
    const daysRemaining = 15; // Mock calculation
    const proratedAmount = (priceDifference * daysRemaining) / daysInMonth;
    return proratedAmount.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Comparison */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium text-foreground">Current Plan</div>
                <div className="text-sm text-muted-foreground">{currentPlan.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${currentPlan.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Icon 
                name={isUpgrade ? 'ArrowUp' : 'ArrowDown'} 
                size={24} 
                className={isUpgrade ? 'text-success' : 'text-warning'}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">New Plan</div>
                <div className="text-sm text-muted-foreground">{selectedPlan.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${selectedPlan.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Billing Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Date:</span>
                <span className="text-foreground">{effectiveDate.toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isUpgrade ? 'Prorated Charge:' : 'Prorated Credit:'}
                </span>
                <span className={isUpgrade ? 'text-error' : 'text-success'}>
                  {isUpgrade ? '+' : '-'}${calculateProration()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Billing Date:</span>
                <span className="text-foreground">January 15, 2025</span>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">
                    {isUpgrade ? 'Additional Charge Today:' : 'Credit Applied:'}
                  </span>
                  <span className={isUpgrade ? 'text-error' : 'text-success'}>
                    {isUpgrade ? '+' : '-'}${calculateProration()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Changes */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">What Changes</h3>
            
            <div className="space-y-2">
              {selectedPlan.features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon 
                    name={isUpgrade ? 'Plus' : 'Check'} 
                    size={14} 
                    className={isUpgrade ? 'text-success' : 'text-primary'}
                  />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Important Notice</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {isUpgrade 
                    ? 'Your plan will be upgraded immediately and you\'ll be charged the prorated amount today.' :'Your plan will be downgraded at the end of your current billing cycle. You\'ll retain access to current features until then.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={isUpgrade ? 'default' : 'warning'}
            fullWidth
            loading={isProcessing}
            onClick={handleConfirm}
          >
            {isUpgrade ? 'Upgrade Now' : 'Confirm Downgrade'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;