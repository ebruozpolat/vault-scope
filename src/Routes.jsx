import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import WalletManagement from "pages/wallet-management";
import ComplianceDashboard from "pages/compliance-dashboard";
import Dashboard from "pages/dashboard";
import SubscriptionManagement from "pages/subscription-management";
import TransactionMonitoring from "pages/transaction-monitoring";
import RealTimeAlerts from "pages/real-time-alerts";
import AutoRebalancing from "pages/auto-rebalancing";
import AccessControl from "pages/access-control";
import Login from "pages/login";
import Register from "pages/register";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet-management" element={<WalletManagement />} />
        <Route path="/compliance-dashboard" element={<ComplianceDashboard />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/transaction-monitoring" element={<TransactionMonitoring />} />
        <Route path="/real-time-alerts" element={<RealTimeAlerts />} />
        <Route path="/auto-rebalancing" element={<AutoRebalancing />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;