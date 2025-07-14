import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AddWalletWizard = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    custodian: '',
    walletName: '',
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    testConnection: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);

  const custodianOptions = [
    { 
      value: 'fireblocks', 
      label: 'Fireblocks',
      description: 'Enterprise-grade digital asset custody and transfer platform',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=64&h=64&fit=crop&crop=center'
    },
    { 
      value: 'bitgo', 
      label: 'BitGo',
      description: 'Institutional digital asset custody and security platform',
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=64&h=64&fit=crop&crop=center'
    }
  ];

  const steps = [
    { number: 1, title: 'Select Custodian', description: 'Choose your wallet provider' },
    { number: 2, title: 'Configure Connection', description: 'Enter API credentials' },
    { number: 3, title: 'Test Connection', description: 'Verify connectivity' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionResult(null);
    
    // Simulate API connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setConnectionResult({
        success,
        message: success 
          ? 'Connection successful! Wallet is ready to use.'
          : 'Connection failed. Please check your credentials and try again.'
      });
      setIsConnecting(false);
    }, 2000);
  };

  const handleComplete = () => {
    const newWallet = {
      id: Date.now(),
      name: formData.walletName,
      custodian: formData.custodian,
      status: 'connected',
      lastSync: new Date(),
      balance: '$0.00',
      address: '0x' + Math.random().toString(16).substr(2, 8) + '...'
    };
    onComplete(newWallet);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
            ${currentStep >= step.number 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-muted-foreground'
            }
          `}>
            {currentStep > step.number ? (
              <Icon name="Check" size={16} />
            ) : (
              <span className="text-sm font-medium">{step.number}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-16 h-0.5 mx-2 transition-colors
              ${currentStep > step.number ? 'bg-primary' : 'bg-border'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Select Custodian
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose your wallet provider to begin the connection process
        </p>
      </div>
      
      <div className="grid gap-4">
        {custodianOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleInputChange('custodian', option.value)}
            className={`
              p-4 border rounded-lg text-left transition-all hover:shadow-subtle
              ${formData.custodian === option.value 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <Image
                src={option.logo}
                alt={option.label}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{option.label}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              </div>
              {formData.custodian === option.value && (
                <Icon name="CheckCircle" size={20} className="text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Configure Connection
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your {custodianOptions.find(c => c.value === formData.custodian)?.label} API credentials
        </p>
      </div>
      
      <div className="space-y-4">
        <Input
          label="Wallet Name"
          type="text"
          placeholder="Enter a name for this wallet"
          value={formData.walletName}
          onChange={(e) => handleInputChange('walletName', e.target.value)}
          required
        />
        
        <Input
          label="API Key"
          type="text"
          placeholder="Enter your API key"
          value={formData.apiKey}
          onChange={(e) => handleInputChange('apiKey', e.target.value)}
          required
        />
        
        <Input
          label="API Secret"
          type="password"
          placeholder="Enter your API secret"
          value={formData.apiSecret}
          onChange={(e) => handleInputChange('apiSecret', e.target.value)}
          required
        />
        
        {formData.custodian === 'fireblocks' && (
          <Input
            label="Passphrase"
            type="password"
            placeholder="Enter your passphrase"
            value={formData.passphrase}
            onChange={(e) => handleInputChange('passphrase', e.target.value)}
            description="Required for Fireblocks connections"
            required
          />
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Test Connection
        </h3>
        <p className="text-sm text-muted-foreground">
          Verify your credentials and establish connection
        </p>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Custodian:</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {formData.custodian}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Wallet Name:</span>
            <span className="text-sm font-medium text-foreground">
              {formData.walletName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">API Key:</span>
            <span className="text-sm font-medium text-foreground">
              {formData.apiKey ? '••••••••' + formData.apiKey.slice(-4) : 'Not set'}
            </span>
          </div>
        </div>
      </div>
      
      {!connectionResult && (
        <Button
          variant="outline"
          fullWidth
          loading={isConnecting}
          iconName="Zap"
          iconPosition="left"
          onClick={handleTestConnection}
          disabled={!formData.walletName || !formData.apiKey || !formData.apiSecret}
        >
          {isConnecting ? 'Testing Connection...' : 'Test Connection'}
        </Button>
      )}
      
      {connectionResult && (
        <div className={`
          p-4 rounded-lg border
          ${connectionResult.success 
            ? 'bg-success/10 border-success/20 text-success' :'bg-error/10 border-error/20 text-error'
          }
        `}>
          <div className="flex items-center gap-2">
            <Icon 
              name={connectionResult.success ? 'CheckCircle' : 'XCircle'} 
              size={16} 
            />
            <span className="text-sm font-medium">
              {connectionResult.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {renderStepIndicator()}
      
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
      
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              iconName="ChevronLeft"
              iconPosition="left"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          {currentStep < 3 ? (
            <Button
              variant="default"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.custodian) ||
                (currentStep === 2 && (!formData.walletName || !formData.apiKey || !formData.apiSecret))
              }
            >
              Next
            </Button>
          ) : (
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              onClick={handleComplete}
              disabled={!connectionResult?.success}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWalletWizard;