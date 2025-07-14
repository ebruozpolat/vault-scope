import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import CompanyDetailsStep from './components/CompanyDetailsStep';
import VerificationStep from './components/VerificationStep';
import SubscriptionStep from './components/SubscriptionStep';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: '',
    companySize: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Verification
    registrationNumber: '',
    taxId: '',
    businessAddress: '',
    jurisdiction: '',
    businessType: '',
    amlCompliance: false,
    regulatoryCompliance: false,
    
    // Step 3: Subscription
    subscriptionTier: '',
    
    // Terms and Privacy
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.companySize) newErrors.companySize = 'Company size is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
      if (!formData.jurisdiction) newErrors.jurisdiction = 'Jurisdiction is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.amlCompliance) newErrors.amlCompliance = 'AML compliance acknowledgment is required';
      if (!formData.regulatoryCompliance) newErrors.regulatoryCompliance = 'Regulatory compliance acknowledgment is required';
    }
    
    if (step === 3) {
      if (!formData.subscriptionTier) newErrors.subscriptionTier = 'Please select a subscription tier';
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateStep(currentStep);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateStep(3);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      console.log('Registration data:', formData);
      
      // Navigate to email verification or success page
      navigate('/email-verification', { 
        state: { 
          email: formData.email,
          registrationComplete: true 
        }
      });
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 2:
        return (
          <VerificationStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <SubscriptionStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Create Account - VaultScope</title>
        <meta name="description" content="Create your VaultScope account to start managing your crypto treasury operations" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Icon name="Shield" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">
            Join VaultScope to streamline your crypto treasury operations
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

        {/* Form Container */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-subtle">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center">
                  <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
                  <span className="text-sm text-destructive">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Terms and Privacy (Final Step) */}
            {currentStep === 3 && (
              <div className="mt-6 space-y-4">
                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-0.5"
                    />
                    <div className="text-sm">
                      <span className="text-foreground">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-0.5"
                    />
                    <div className="text-sm">
                      <span className="text-foreground">
                        I acknowledge the{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </div>
                  </label>
                </div>

                {(errors.acceptTerms || errors.acceptPrivacy) && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <div className="flex items-center">
                      <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
                      <span className="text-sm text-destructive">
                        Please accept the terms and privacy policy to continue
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            Protected by enterprise-grade security and encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;