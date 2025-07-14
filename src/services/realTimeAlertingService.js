import { EventEmitter } from 'events';

class RealTimeAlertingService extends EventEmitter {
  constructor() {
    super();
    this.isMonitoring = false;
    this.alertThresholds = {
      transactionAmount: 10000, // $10,000
      riskScore: 70, // 70%
      dailyTransactionCount: 50,
      velocityThreshold: 5, // 5 transactions in 10 minutes
      suspiciousPatterns: {
        roundAmounts: true,
        rapidSuccession: true,
        unusualTiming: true
      }
    };
    this.alertQueue = [];
    this.alertHistory = [];
    this.websocketSimulation = null;
    this.monitoringInterval = null;
  }

  // Start real-time monitoring
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupWebSocketSimulation();
    this.startTransactionMonitoring();
    this.startComplianceMonitoring();
    this.startThresholdMonitoring();
    
    this.emit('monitoring_started');
  }

  // Stop real-time monitoring
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.websocketSimulation) {
      clearInterval(this.websocketSimulation);
    }
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.emit('monitoring_stopped');
  }

  // Setup WebSocket simulation for real-time updates
  setupWebSocketSimulation() {
    this.websocketSimulation = setInterval(() => {
      this.simulateOnChainActivity();
    }, 5000); // Check every 5 seconds
  }

  // Simulate on-chain activity monitoring
  simulateOnChainActivity() {
    const activities = [
      'transaction_received',
      'wallet_connection_change',
      'compliance_check',
      'threshold_monitoring',
      'pattern_analysis'
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    switch (randomActivity) {
      case 'transaction_received':
        this.analyzeTransaction(this.generateMockTransaction());
        break;
      case 'wallet_connection_change':
        this.checkWalletConnections();
        break;
      case 'compliance_check':
        this.performComplianceCheck();
        break;
      case 'threshold_monitoring':
        this.monitorThresholds();
        break;
      case 'pattern_analysis':
        this.analyzePatterns();
        break;
    }
  }

  // Generate mock transaction for simulation
  generateMockTransaction() {
    const riskLevel = Math.random();
    const amount = Math.random() * 100000;
    const timestamp = new Date();
    
    return {
      id: `tx_${Date.now()}`,
      hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      amount: amount,
      currency: 'USDC',
      timestamp: timestamp,
      riskScore: riskLevel * 100,
      status: 'pending',
      network: 'Ethereum',
      gasPrice: Math.random() * 100
    };
  }

  // Analyze transaction for suspicious activity
  analyzeTransaction(transaction) {
    const alerts = [];

    // Check for high-risk transaction
    if (transaction.riskScore > this.alertThresholds.riskScore) {
      alerts.push(this.createAlert({
        type: 'high_risk_transaction',
        title: 'High Risk Transaction Detected',
        message: `Transaction ${transaction.hash.substring(0, 10)}... has risk score of ${transaction.riskScore.toFixed(1)}%`,
        severity: 'high',
        data: transaction,
        category: 'suspicious_activity'
      }));
    }

    // Check for large amount
    if (transaction.amount > this.alertThresholds.transactionAmount) {
      alerts.push(this.createAlert({
        type: 'large_amount',
        title: 'Large Transaction Amount',
        message: `Transaction of $${transaction.amount.toLocaleString()} exceeds threshold of $${this.alertThresholds.transactionAmount.toLocaleString()}`,
        severity: 'medium',
        data: transaction,
        category: 'threshold_breach'
      }));
    }

    // Check for round amounts (potential structuring)
    if (this.isRoundAmount(transaction.amount)) {
      alerts.push(this.createAlert({
        type: 'round_amount_pattern',
        title: 'Round Amount Pattern Detected',
        message: `Transaction with round amount $${transaction.amount.toLocaleString()} may indicate structuring`,
        severity: 'medium',
        data: transaction,
        category: 'suspicious_pattern'
      }));
    }

    // Process alerts
    alerts.forEach(alert => this.processAlert(alert));
  }

  // Check wallet connections
  checkWalletConnections() {
    const wallets = ['MetaMask', 'WalletConnect', 'Ledger', 'BitGo'];
    const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
    
    if (Math.random() > 0.9) { // 10% chance of connection issue
      const alert = this.createAlert({
        type: 'wallet_connection_issue',
        title: 'Wallet Connection Issue',
        message: `${randomWallet} wallet connection is unstable. Please check connection.`,
        severity: 'low',
        data: { wallet: randomWallet },
        category: 'system_alert'
      });
      
      this.processAlert(alert);
    }
  }

  // Perform compliance check
  performComplianceCheck() {
    const complianceRules = [
      'AML_screening',
      'sanctions_check',
      'PEP_screening',
      'geographic_restrictions',
      'transaction_limits'
    ];

    const randomRule = complianceRules[Math.floor(Math.random() * complianceRules.length)];
    
    if (Math.random() > 0.95) { // 5% chance of compliance violation
      const alert = this.createAlert({
        type: 'compliance_violation',
        title: 'Compliance Violation Detected',
        message: `${randomRule.replace('_', ' ')} violation detected. Immediate attention required.`,
        severity: 'critical',
        data: { rule: randomRule },
        category: 'compliance_breach'
      });
      
      this.processAlert(alert);
    }
  }

  // Monitor thresholds
  monitorThresholds() {
    const thresholdTypes = [
      'daily_volume',
      'transaction_frequency',
      'wallet_balance',
      'gas_price_spike'
    ];

    const randomThreshold = thresholdTypes[Math.floor(Math.random() * thresholdTypes.length)];
    
    if (Math.random() > 0.92) { // 8% chance of threshold breach
      const alert = this.createAlert({
        type: 'threshold_breach',
        title: 'Threshold Breach Alert',
        message: `${randomThreshold.replace('_', ' ')} threshold has been exceeded. Review required.`,
        severity: 'medium',
        data: { threshold: randomThreshold },
        category: 'threshold_breach'
      });
      
      this.processAlert(alert);
    }
  }

  // Analyze patterns
  analyzePatterns() {
    const patterns = [
      'rapid_succession',
      'unusual_timing',
      'geographic_anomaly',
      'velocity_spike',
      'amount_clustering'
    ];

    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (Math.random() > 0.94) { // 6% chance of suspicious pattern
      const alert = this.createAlert({
        type: 'suspicious_pattern',
        title: 'Suspicious Pattern Detected',
        message: `${randomPattern.replace('_', ' ')} pattern detected in recent transactions.`,
        severity: 'medium',
        data: { pattern: randomPattern },
        category: 'suspicious_pattern'
      });
      
      this.processAlert(alert);
    }
  }

  // Create alert object
  createAlert(alertData) {
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'active',
      actionRequired: alertData.severity === 'critical' || alertData.severity === 'high',
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
      ...alertData
    };
  }

  // Process alert
  processAlert(alert) {
    this.alertQueue.push(alert);
    this.alertHistory.push(alert);
    
    // Emit alert event
    this.emit('new_alert', alert);
    
    // Auto-escalate critical alerts
    if (alert.severity === 'critical') {
      this.escalateAlert(alert);
    }
    
    // Clean up old alerts
    this.cleanupOldAlerts();
  }

  // Escalate alert
  escalateAlert(alert) {
    setTimeout(() => {
      if (alert.status === 'active' && !alert.acknowledged) {
        this.emit('alert_escalated', {
          ...alert,
          escalated: true,
          escalatedAt: new Date()
        });
      }
    }, 5 * 60 * 1000); // Escalate after 5 minutes
  }

  // Check if amount is suspiciously round
  isRoundAmount(amount) {
    const roundThresholds = [1000, 5000, 10000, 25000, 50000, 100000];
    return roundThresholds.some(threshold => 
      Math.abs(amount - threshold) < 10 || amount % threshold === 0
    );
  }

  // Clean up old alerts
  cleanupOldAlerts() {
    const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    this.alertHistory = this.alertHistory.filter(alert => alert.timestamp > cutoffTime);
  }

  // Get active alerts
  getActiveAlerts() {
    return this.alertQueue.filter(alert => alert.status === 'active');
  }

  // Get alert history
  getAlertHistory(limit = 100) {
    return this.alertHistory.slice(-limit);
  }

  // Acknowledge alert
  acknowledgeAlert(alertId, userId) {
    const alert = this.alertQueue.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
      alert.status = 'acknowledged';
      
      this.emit('alert_acknowledged', alert);
    }
  }

  // Resolve alert
  resolveAlert(alertId, userId) {
    const alert = this.alertQueue.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedBy = userId;
      alert.resolvedAt = new Date();
      alert.status = 'resolved';
      
      this.emit('alert_resolved', alert);
    }
  }

  // Update alert thresholds
  updateThresholds(newThresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...newThresholds };
    this.emit('thresholds_updated', this.alertThresholds);
  }

  // Get alert statistics
  getAlertStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent24h = this.alertHistory.filter(alert => alert.timestamp >= last24Hours);
    const recent7d = this.alertHistory.filter(alert => alert.timestamp >= last7Days);

    return {
      total: this.alertHistory.length,
      active: this.getActiveAlerts().length,
      last24Hours: recent24h.length,
      last7Days: recent7d.length,
      critical: this.alertHistory.filter(a => a.severity === 'critical').length,
      high: this.alertHistory.filter(a => a.severity === 'high').length,
      medium: this.alertHistory.filter(a => a.severity === 'medium').length,
      low: this.alertHistory.filter(a => a.severity === 'low').length,
      byCategory: {
        suspicious_activity: this.alertHistory.filter(a => a.category === 'suspicious_activity').length,
        compliance_breach: this.alertHistory.filter(a => a.category === 'compliance_breach').length,
        threshold_breach: this.alertHistory.filter(a => a.category === 'threshold_breach').length,
        suspicious_pattern: this.alertHistory.filter(a => a.category === 'suspicious_pattern').length,
        system_alert: this.alertHistory.filter(a => a.category === 'system_alert').length
      }
    };
  }
}

// Create singleton instance
const realTimeAlertingService = new RealTimeAlertingService();

export default realTimeAlertingService;