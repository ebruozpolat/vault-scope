import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparisonTable = ({ plans, currentPlanId, onPlanSelect }) => {
  const isCurrentPlan = (planId) => planId === currentPlanId;
  
  const getButtonVariant = (plan) => {
    if (isCurrentPlan(plan.id)) return 'outline';
    if (plan.popular) return 'default';
    return 'outline';
  };

  const getButtonText = (plan) => {
    if (isCurrentPlan(plan.id)) return 'Current Plan';
    return plan.price > plans.find(p => p.id === currentPlanId)?.price ? 'Upgrade' : 'Downgrade';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-subtle">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Compare Plans</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the plan that best fits your organization's needs
        </p>
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                border rounded-lg p-4 relative
                ${isCurrentPlan(plan.id) ? 'border-primary bg-primary/5' : 'border-border'}
                ${plan.popular ? 'ring-2 ring-primary/20' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1 mt-2">
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/{plan.billingCycle}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={getButtonVariant(plan)}
                fullWidth
                disabled={isCurrentPlan(plan.id)}
                onClick={() => onPlanSelect(plan)}
              >
                {getButtonText(plan)}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-6 text-sm font-medium text-muted-foreground">
                Features
              </th>
              {plans.map((plan) => (
                <th key={plan.id} className="text-center p-6 min-w-64 relative">
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`
                    ${isCurrentPlan(plan.id) ? 'bg-primary/5 border border-primary rounded-lg p-4' : ''}
                  `}>
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline justify-center space-x-1 mt-2">
                      <span className="text-2xl font-bold text-foreground">
                        ${plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/{plan.billingCycle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Feature Rows */}
            {plans[0].detailedFeatures.map((featureCategory, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-4 font-medium text-foreground" colSpan={plans.length + 1}>
                    {featureCategory.category}
                  </td>
                </tr>
                {featureCategory.items.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-border hover:bg-muted/20">
                    <td className="p-4 text-sm text-foreground">{feature.name}</td>
                    {plans.map((plan) => {
                      const planFeature = plan.detailedFeatures
                        .find(cat => cat.category === featureCategory.category)
                        ?.items.find(item => item.name === feature.name);
                      
                      return (
                        <td key={plan.id} className="p-4 text-center">
                          {planFeature?.included ? (
                            planFeature.value ? (
                              <span className="text-sm text-foreground font-medium">
                                {planFeature.value}
                              </span>
                            ) : (
                              <Icon name="Check" size={16} className="text-success mx-auto" />
                            )
                          ) : (
                            <Icon name="X" size={16} className="text-muted-foreground mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
            
            {/* Action Row */}
            <tr>
              <td className="p-6"></td>
              {plans.map((plan) => (
                <td key={plan.id} className="p-6 text-center">
                  <Button
                    variant={getButtonVariant(plan)}
                    disabled={isCurrentPlan(plan.id)}
                    onClick={() => onPlanSelect(plan)}
                  >
                    {getButtonText(plan)}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanComparisonTable;