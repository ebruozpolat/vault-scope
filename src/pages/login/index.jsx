import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      localStorage.setItem('vaultscope_token', 'mock_token_123');
      localStorage.setItem('vaultscope_user', JSON.stringify({
        email: formData.email,
        name: 'John Doe',
        company: 'Crypto Corp'
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Helmet>
        <title>Sign In - VaultScope</title>
        <meta name="description" content="Sign in to your VaultScope crypto treasury platform account" />
      </Helmet>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Icon name="Shield" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your VaultScope account to access your crypto treasury
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-foreground">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center">
                  <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
                  <span className="text-sm text-destructive">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
              className="h-11"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-3 text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Protected by enterprise-grade security and encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;