import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const VerificationStep = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="FileCheck" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Business Verification</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your business for compliance requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="registrationNumber"
          name="registrationNumber"
          label="Business Registration Number"
          value={formData.registrationNumber}
          onChange={onChange}
          error={errors.registrationNumber}
          required
          placeholder="Enter registration number"
        />

        <Input
          id="taxId"
          name="taxId"
          label="Tax ID / EIN"
          value={formData.taxId}
          onChange={onChange}
          error={errors.taxId}
          required
          placeholder="Enter tax ID"
        />
      </div>

      <Input
        id="businessAddress"
        name="businessAddress"
        label="Business Address"
        value={formData.businessAddress}
        onChange={onChange}
        error={errors.businessAddress}
        required
        placeholder="Enter full business address"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="jurisdiction"
          name="jurisdiction"
          label="Regulatory Jurisdiction"
          value={formData.jurisdiction}
          onChange={onChange}
          error={errors.jurisdiction}
          required
          placeholder="Select jurisdiction"
          list="jurisdictions"
        />

        <Input
          id="businessType"
          name="businessType"
          label="Business Type"
          value={formData.businessType}
          onChange={onChange}
          error={errors.businessType}
          required
          placeholder="Select business type"
          list="businessTypes"
        />
      </div>

      <datalist id="jurisdictions">
        <option value="United States" />
        <option value="European Union" />
        <option value="United Kingdom" />
        <option value="Canada" />
        <option value="Australia" />
        <option value="Singapore" />
        <option value="Other" />
      </datalist>

      <datalist id="businessTypes">
        <option value="Corporation" />
        <option value="LLC" />
        <option value="Partnership" />
        <option value="Trust" />
        <option value="Investment Fund" />
        <option value="Other" />
      </datalist>

      {/* Compliance Requirements */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-foreground">Compliance Requirements</h3>
        
        <div className="space-y-2">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="amlCompliance"
              checked={formData.amlCompliance}
              onChange={onChange}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-0.5"
            />
            <div className="text-sm">
              <div className="font-medium text-foreground">AML/KYC Compliance</div>
              <div className="text-muted-foreground">
                I acknowledge that my organization complies with Anti-Money Laundering and Know Your Customer requirements
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="regulatoryCompliance"
              checked={formData.regulatoryCompliance}
              onChange={onChange}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-0.5"
            />
            <div className="text-sm">
              <div className="font-medium text-foreground">Regulatory Compliance</div>
              <div className="text-muted-foreground">
                I confirm that my organization operates within applicable financial and crypto regulations
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Error for compliance checkboxes */}
      {(errors.amlCompliance || errors.regulatoryCompliance) && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
            <span className="text-sm text-destructive">
              Please acknowledge all compliance requirements to continue
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStep;