import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CompanyDetailsStep = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Building" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="companyName"
          name="companyName"
          label="Company Name"
          value={formData.companyName}
          onChange={onChange}
          error={errors.companyName}
          required
          placeholder="Enter company name"
        />

        <Input
          id="companySize"
          name="companySize"
          label="Company Size"
          value={formData.companySize}
          onChange={onChange}
          error={errors.companySize}
          required
          placeholder="Select company size"
          list="companySizes"
        />
      </div>

      <datalist id="companySizes">
        <option value="1-10 employees" />
        <option value="11-50 employees" />
        <option value="51-200 employees" />
        <option value="201-500 employees" />
        <option value="500+ employees" />
      </datalist>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={onChange}
          error={errors.firstName}
          required
          placeholder="Enter first name"
        />

        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={onChange}
          error={errors.lastName}
          required
          placeholder="Enter last name"
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="Work Email"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        required
        placeholder="Enter work email"
      />

      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone Number"
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
        placeholder="Enter phone number"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={onChange}
        error={errors.password}
        required
        placeholder="Create a strong password"
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
        required
        placeholder="Confirm your password"
      />

      {/* Password Strength Indicator */}
      {formData.password && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Password Strength</div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-2 rounded-full ${
                  formData.password.length >= level * 2
                    ? formData.password.length >= 8
                      ? 'bg-success'
                      : formData.password.length >= 6
                      ? 'bg-warning' :'bg-destructive' :'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            Use at least 8 characters with mixed case, numbers, and symbols
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailsStep;