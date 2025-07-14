import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: 'Company Details', description: 'Basic information' },
    { id: 2, title: 'Verification', description: 'Business verification' },
    { id: 3, title: 'Subscription', description: 'Choose your plan' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id
                    ? 'bg-success text-success-foreground'
                    : currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Icon name="Check" size={16} />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-center mt-2">
                <div className={`text-xs font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-success' : 'bg-muted'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;