import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import UserAccountDropdown from '../../components/ui/UserAccountDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanComparisonTable from './components/PlanComparisonTable';
import AddOnMarketplace from './components/AddOnMarketplace';
import PaymentMethodSection from './components/PaymentMethodSection';
import UsageAnalytics from './components/UsageAnalytics';
import PlanChangeModal from './components/PlanChangeModal';


const SubscriptionManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState('regready');

  // Mock current plan data
  const currentPlan = {
    id: 'regready',
    name: 'RegReady Ops Suite',
    price: 1500,
    billingCycle: 'month',
    nextBilling: 'January 15, 2025',
    features: [
      'Advanced wallet connectivity (5 wallets)',
      'Compliance reporting & monitoring',
      'Multi-signature transaction support',
      'Real-time risk assessment',
      'API access & integrations',
      'Priority customer support'
    ],
    usage: [
      { label: 'Wallet Connections', used: 3, total: 5 },
      { label: 'Monthly Transactions', used: 2847, total: 10000 },
      { label: 'Compliance Reports', used: 12, total: 'Unlimited' },
      { label: 'API Calls', used: 45230, total: 100000 }
    ]
  };

  // Mock available plans
  const availablePlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 499,
      billingCycle: 'month',
      description: 'Perfect for small teams getting started with crypto treasury',
      popular: false,
      features: [
        'Basic wallet connectivity (2 wallets)',
        'Standard transaction monitoring',
        'Basic compliance reporting',
        'Email support'
      ],
      detailedFeatures: [
        {
          category: 'Wallet Management',
          items: [
            { name: 'Wallet Connections', included: true, value: '2' },
            { name: 'Multi-signature Support', included: false },
            { name: 'Hardware Wallet Support', included: true }
          ]
        },
        {
          category: 'Compliance',
          items: [
            { name: 'Basic Reporting', included: true },
            { name: 'Advanced Analytics', included: false },
            { name: 'Custom Rules', included: false }
          ]
        },
        {
          category: 'Support',
          items: [
            { name: 'Email Support', included: true },
            { name: 'Priority Support', included: false },
            { name: 'Dedicated Account Manager', included: false }
          ]
        }
      ]
    },
    {
      id: 'regready',
      name: 'RegReady Ops Suite',
      price: 1500,
      billingCycle: 'month',
      description: 'Comprehensive solution for growing crypto institutions',
      popular: true,
      features: [
        'Advanced wallet connectivity (5 wallets)',
        'Compliance reporting & monitoring',
        'Multi-signature transaction support',
        'Real-time risk assessment',
        'API access & integrations',
        'Priority customer support'
      ],
      detailedFeatures: [
        {
          category: 'Wallet Management',
          items: [
            { name: 'Wallet Connections', included: true, value: '5' },
            { name: 'Multi-signature Support', included: true },
            { name: 'Hardware Wallet Support', included: true }
          ]
        },
        {
          category: 'Compliance',
          items: [
            { name: 'Basic Reporting', included: true },
            { name: 'Advanced Analytics', included: true },
            { name: 'Custom Rules', included: true }
          ]
        },
        {
          category: 'Support',
          items: [
            { name: 'Email Support', included: true },
            { name: 'Priority Support', included: true },
            { name: 'Dedicated Account Manager', included: false }
          ]
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise VaultOps',
      price: 20000,
      billingCycle: 'year',
      description: 'Full-scale enterprise solution with on-premise deployment',
      popular: false,
      features: [
        'Unlimited wallet connections',
        'Custom compliance frameworks',
        'On-premise deployment',
        'White-label solutions',
        'Dedicated infrastructure',
        '24/7 dedicated support'
      ],
      detailedFeatures: [
        {
          category: 'Wallet Management',
          items: [
            { name: 'Wallet Connections', included: true, value: 'Unlimited' },
            { name: 'Multi-signature Support', included: true },
            { name: 'Hardware Wallet Support', included: true }
          ]
        },
        {
          category: 'Compliance',
          items: [
            { name: 'Basic Reporting', included: true },
            { name: 'Advanced Analytics', included: true },
            { name: 'Custom Rules', included: true }
          ]
        },
        {
          category: 'Support',
          items: [
            { name: 'Email Support', included: true },
            { name: 'Priority Support', included: true },
            { name: 'Dedicated Account Manager', included: true }
          ]
        }
      ]
    }
  ];

  // Mock add-ons data
  const [addOns, setAddOns] = useState([
    {
      id: 'wallet-connector',
      name: 'Extra Wallet Connector',
      price: 100,
      description: 'Connect additional wallets and custodian services beyond your plan limit',
      icon: 'Wallet',
      isActive: true,
      nextBilling: 'January 15, 2025',
      features: [
        'Support for additional wallet types',
        'Custom connector development',
        'Priority integration support',
        'Advanced connection monitoring'
      ],
      integrations: ['MetaMask', 'Ledger', 'Trezor', 'Fireblocks', 'BitGo'],
      setupTime: '2-3 business days'
    },
    {
      id: 'white-label',
      name: 'White-label Interface',
      price: 500,
      description: 'Customize the platform with your branding and domain',
      icon: 'Palette',
      isActive: false,
      features: [
        'Custom branding and logos',
        'Domain customization',
        'Theme customization',
        'Custom email templates',
        'Branded mobile app'
      ],
      integrations: ['Custom Domain', 'SSL Certificate', 'CDN'],
      setupTime: '5-7 business days'
    },
    {
      id: 'boi-registry',
      name: 'BOI Registry Sync',
      price: 200,
      description: 'Automated synchronization with Beneficial Ownership Information registries',
      icon: 'Database',
      isActive: true,
      nextBilling: 'January 15, 2025',
      features: [
        'Automated BOI data sync',
        'Compliance monitoring',
        'Real-time updates',
        'Multi-jurisdiction support'
      ],
      integrations: ['FinCEN', 'EU Registries', 'UK Companies House'],
      setupTime: '1-2 business days'
    },
    {
      id: 'custom-compliance',
      name: 'Custom Compliance Features',
      price: 300,
      description: 'Build custom compliance rules and reporting for your specific requirements',
      icon: 'Shield',
      isActive: false,
      features: [
        'Custom rule builder',
        'Advanced reporting templates',
        'Automated compliance checks',
        'Integration with external systems'
      ],
      integrations: ['Custom APIs', 'Third-party Tools', 'Legacy Systems'],
      setupTime: '3-5 business days'
    }
  ]);

  // Mock payment method data
  const paymentMethod = {
    lastFour: '4242',
    brand: 'Visa',
    expiryDate: '12/26'
  };

  // Mock invoice history
  const invoiceHistory = [
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      date: 'December 15, 2024',
      description: 'RegReady Ops Suite + Add-ons',
      amount: 1800,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      number: 'INV-2024-002',
      date: 'November 15, 2024',
      description: 'RegReady Ops Suite + Add-ons',
      amount: 1800,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      number: 'INV-2024-003',
      date: 'October 15, 2024',
      description: 'RegReady Ops Suite',
      amount: 1500,
      status: 'paid',
      downloadUrl: '#'
    }
  ];

  // Mock analytics data
  const analyticsData = {
    keyMetrics: [
      {
        label: 'Active Wallets',
        value: '3/5',
        change: 20,
        icon: 'Wallet'
      },
      {
        label: 'Monthly Transactions',
        value: '2,847',
        change: 15,
        icon: 'Activity'
      },
      {
        label: 'Compliance Score',
        value: '98%',
        change: 2,
        icon: 'Shield'
      },
      {
        label: 'API Usage',
        value: '45.2K',
        change: -5,
        icon: 'Zap'
      }
    ],
    usageTrends: [
      { date: 'Dec 1', transactions: 2100, wallets: 3, reports: 8 },
      { date: 'Dec 8', transactions: 2300, wallets: 3, reports: 10 },
      { date: 'Dec 15', transactions: 2847, wallets: 3, reports: 12 },
      { date: 'Dec 22', transactions: 2650, wallets: 4, reports: 9 },
      { date: 'Dec 29', transactions: 2900, wallets: 4, reports: 11 }
    ],
    featureUsage: [
      { name: 'Wallet Management', value: 35 },
      { name: 'Transaction Monitoring', value: 28 },
      { name: 'Compliance Reports', value: 20 },
      { name: 'API Access', value: 12 },
      { name: 'Other Features', value: 5 }
    ],
    monthlyActivity: [
      { month: 'Aug', activity: 75 },
      { month: 'Sep', activity: 82 },
      { month: 'Oct', activity: 78 },
      { month: 'Nov', activity: 85 },
      { month: 'Dec', activity: 92 }
    ],
    recommendations: [
      {
        type: 'upgrade',
        title: 'Consider Enterprise Plan',
        description: 'You\'re using 80% of your wallet connections. Upgrade to Enterprise for unlimited wallets.',
        action: 'View Enterprise Plan'
      },
      {
        type: 'optimize',
        title: 'Optimize API Usage',
        description: 'Your API calls have increased 15% this month. Consider implementing caching to reduce costs.',
        action: 'View API Documentation'
      },
      {
        type: 'info',
        title: 'New Feature Available',
        description: 'BOI Registry Sync is now available as an add-on to automate compliance reporting.',
        action: 'Learn More'
      }
    ]
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPlanChangeModal(true);
  };

  const handlePlanChange = async (newPlan) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentPlanId(newPlan.id);
    setShowPlanChangeModal(false);
    setSelectedPlan(null);
  };

  const handleToggleAddOn = (addOnId) => {
    setAddOns(prev => prev.map(addon => 
      addon.id === addOnId 
        ? { 
            ...addon, 
            isActive: !addon.isActive,
            nextBilling: !addon.isActive ? 'January 15, 2025' : undefined
          }
        : addon
    ));
  };

  const handleUpdatePayment = (paymentData) => {
    console.log('Updating payment method:', paymentData);
    // Mock API call to update payment method
  };

  const handleUpgrade = () => {
    const nextTier = availablePlans.find(plan => plan.price > currentPlan.price);
    if (nextTier) {
      handlePlanSelect(nextTier);
    }
  };

  const handleManageAddons = () => {
    document.getElementById('addons-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      
      <div className="lg:ml-60">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Subscription Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your plan, add-ons, and billing preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-8">
          {/* Current Plan Overview */}
          <CurrentPlanCard
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onManageAddons={handleManageAddons}
          />

          {/* Plan Comparison */}
          <PlanComparisonTable
            plans={availablePlans}
            currentPlanId={currentPlanId}
            onPlanSelect={handlePlanSelect}
          />

          {/* Add-on Marketplace */}
          <div id="addons-section">
            <AddOnMarketplace
              addOns={addOns}
              onToggleAddOn={handleToggleAddOn}
            />
          </div>

          {/* Usage Analytics */}
          <UsageAnalytics analyticsData={analyticsData} />

          {/* Payment & Billing */}
          <PaymentMethodSection
            paymentMethod={paymentMethod}
            invoiceHistory={invoiceHistory}
            onUpdatePayment={handleUpdatePayment}
          />
        </main>
      </div>

      {/* Plan Change Modal */}
      <PlanChangeModal
        isOpen={showPlanChangeModal}
        onClose={() => {
          setShowPlanChangeModal(false);
          setSelectedPlan(null);
        }}
        selectedPlan={selectedPlan}
        currentPlan={availablePlans.find(plan => plan.id === currentPlanId)}
        onConfirm={handlePlanChange}
      />
    </div>
  );
};

export default SubscriptionManagement;