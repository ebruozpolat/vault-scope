import React from 'react';

import Icon from '../../../components/AppIcon';

const SubscriptionStep = ({ formData, errors, onChange }) => {
  const subscriptionTiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$99',
      period: 'per month',
      description: 'Perfect for small teams getting started with crypto treasury',
      features: [
        'Up to 3 wallet connections',
        'Basic transaction monitoring',
        'Email support',
        'Standard reporting',
        'Basic compliance tools'
      ],
      limitations: [
        'Limited API access',
        'Basic analytics only'
      ]
    },
    {
      id: 'regready',
      name: 'RegReady Ops Suite',
      price: '$299',
      period: 'per month',
      description: 'Comprehensive solution for growing organizations',
      features: [
        'Unlimited wallet connections',
        'Advanced transaction monitoring',
        'Real-time alerts',
        'Priority support',
        'Custom reports',
        'Advanced compliance dashboard',
        'API access',
        'Multi-user access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'Full-featured solution for large organizations',
      features: [
        'Everything in RegReady Ops Suite',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics',
        'White-label options',
        'SLA guarantees',
        'Custom compliance workflows',
        'Advanced security features'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="CreditCard" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Choose Your Plan</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the subscription tier that best fits your needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
              formData.subscriptionTier === tier.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border bg-card hover:border-primary/50'
            } ${tier.popular ? 'ring-2 ring-primary/20' : ''}`}
            onClick={() => onChange({ target: { name: 'subscriptionTier', value: tier.id } })}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground ml-1">/{tier.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            </div>

            <ul className="space-y-2 mb-4">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Icon name="Check" size={16} className="text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
              {tier.limitations?.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <Icon name="X" size={16} className="text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full border-2 ${
                formData.subscriptionTier === tier.id
                  ? 'border-primary bg-primary' :'border-border bg-background'
              }`}>
                {formData.subscriptionTier === tier.id && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.subscriptionTier && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
            <span className="text-sm text-destructive">{errors.subscriptionTier}</span>
          </div>
        </div>
      )}

      {/* Billing Information */}
      {formData.subscriptionTier && formData.subscriptionTier !== 'enterprise' && (
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Billing Information</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• All plans include a 14-day free trial</p>
            <p>• No setup fees or hidden charges</p>
            <p>• Cancel anytime with 30-day notice</p>
            <p>• Enterprise support available for all tiers</p>
          </div>
        </div>
      )}

      {formData.subscriptionTier === 'enterprise' && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center">
            <Icon name="Phone" size={16} className="text-primary mr-2" />
            <span className="text-sm text-foreground">
              Our sales team will contact you within 24 hours to discuss your Enterprise requirements
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStep;