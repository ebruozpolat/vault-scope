import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AddOnWalletConnectors = ({ onUpgrade }) => {
  const addOnConnectors = [
    {
      id: 'coinbase-custody',
      name: 'Coinbase Custody',
      description: 'Connect to Coinbase Custody for institutional-grade storage',
      price: '$100/month',
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=48&h=48&fit=crop&crop=center',
      features: ['Institutional custody', 'Insurance coverage', 'Regulatory compliance'],
      popular: false
    },
    {
      id: 'ledger-vault',
      name: 'Ledger Vault',
      description: 'Enterprise hardware security module integration',
      price: '$150/month',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=48&h=48&fit=crop&crop=center',
      features: ['Hardware security', 'Multi-signature', 'Governance rules'],
      popular: true
    },
    {
      id: 'gemini-custody',
      name: 'Gemini Custody',
      description: 'Regulated custodial services with SOC compliance',
      price: '$100/month',
      logo: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=48&h=48&fit=crop&crop=center',
      features: ['SOC 2 Type II', 'FDIC insurance', 'Real-time reporting'],
      popular: false
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Additional Wallet Connectors
        </h3>
        <p className="text-sm text-muted-foreground">
          Expand your wallet connectivity with premium custodian integrations
        </p>
      </div>
      
      <div className="grid gap-4">
        {addOnConnectors.map((connector) => (
          <div
            key={connector.id}
            className="border border-border rounded-lg p-4 hover:shadow-subtle transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="relative">
                  <Image
                    src={connector.logo}
                    alt={connector.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  {connector.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{connector.name}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {connector.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {connector.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        <Icon name="Check" size={10} />
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-foreground">
                      {connector.price}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => onUpgrade(connector.id)}
                    >
                      Add Connector
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Need a custom connector?
            </p>
            <p className="text-sm text-muted-foreground">
              Contact our team to discuss custom integrations for your specific custodian requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnWalletConnectors;