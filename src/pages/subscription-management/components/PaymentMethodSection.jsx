import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethodSection = ({ paymentMethod, invoiceHistory, onUpdatePayment }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePayment(formData);
    setShowUpdateForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Payment & Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your payment methods and view billing history
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Payment Method</h3>
          
          {!showUpdateForm ? (
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name="CreditCard" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    •••• •••• •••• {paymentMethod.lastFour}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {paymentMethod.brand} • Expires {paymentMethod.expiryDate}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setShowUpdateForm(true)}
              >
                Update
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  required
                />
                <Input
                  label="Cardholder Name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  required
                />
                <Input
                  label="Expiry Date"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  required
                />
                <Input
                  label="CVV"
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Billing Address</h4>
                <Input
                  label="Street Address"
                  type="text"
                  placeholder="123 Main St"
                  value={formData.billingAddress.street}
                  onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    placeholder="New York"
                    value={formData.billingAddress.city}
                    onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                    required
                  />
                  <Input
                    label="State"
                    type="text"
                    placeholder="NY"
                    value={formData.billingAddress.state}
                    onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    type="text"
                    placeholder="10001"
                    value={formData.billingAddress.zipCode}
                    onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" variant="default">
                  Update Payment Method
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Invoice History */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Invoice History</h3>
          
          <div className="space-y-3">
            {invoiceHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Icon
                    name={getStatusIcon(invoice.status)}
                    size={20}
                    className={getStatusColor(invoice.status)}
                  />
                  <div>
                    <div className="font-medium text-foreground">
                      Invoice #{invoice.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.date} • {invoice.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      ${invoice.amount.toLocaleString()}
                    </div>
                    <div className={`text-sm capitalize ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    onClick={() => window.open(invoice.downloadUrl, '_blank')}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {invoiceHistory.length === 0 && (
            <div className="text-center py-8">
              <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No invoices available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSection;