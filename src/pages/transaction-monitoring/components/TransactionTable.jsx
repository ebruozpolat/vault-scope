import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ transactions, onTransactionClick, onSort, sortConfig }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success/10 text-success border-success/20';
      case 'review':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'violation':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-error';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-accent';
    return 'text-success';
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-foreground" />
      : <Icon name="ArrowDown" size={14} className="text-foreground" />;
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Transaction History
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('hash')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Transaction Hash</span>
                  {getSortIcon('hash')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Timestamp</span>
                  {getSortIcon('timestamp')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('wallet')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Wallet</span>
                  {getSortIcon('wallet')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Amount</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('asset')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Asset</span>
                  {getSortIcon('asset')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('complianceStatus')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Compliance</span>
                  {getSortIcon('complianceStatus')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  <span>Risk Score</span>
                  {getSortIcon('riskScore')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onTransactionClick(transaction)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono text-foreground">
                      {truncateHash(transaction.hash)}
                    </code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(transaction.hash);
                      }}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Icon name="Copy" size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">
                    {formatTimestamp(transaction.timestamp)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-foreground">{transaction.wallet}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">
                        {transaction.asset.slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{transaction.asset}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${getComplianceStatusColor(transaction.complianceStatus)}
                  `}>
                    {transaction.complianceStatus === 'compliant' && 'Compliant'}
                    {transaction.complianceStatus === 'review' && 'Needs Review'}
                    {transaction.complianceStatus === 'violation' && 'Violation'}
                    {transaction.complianceStatus === 'pending' && 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getRiskScoreColor(transaction.riskScore)}`}>
                      {transaction.riskScore}%
                    </span>
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          transaction.riskScore >= 80 ? 'bg-error' :
                          transaction.riskScore >= 60 ? 'bg-warning' :
                          transaction.riskScore >= 40 ? 'bg-accent' : 'bg-success'
                        }`}
                        style={{ width: `${transaction.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransactionClick(transaction);
                      }}
                      iconName="Eye"
                      iconSize={14}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {currentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
            onClick={() => onTransactionClick(transaction)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <code className="text-sm font-mono text-foreground">
                    {truncateHash(transaction.hash)}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(transaction.hash);
                    }}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Icon name="Copy" size={12} className="text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(transaction.timestamp)}
                </p>
              </div>
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                ${getComplianceStatusColor(transaction.complianceStatus)}
              `}>
                {transaction.complianceStatus === 'compliant' && 'Compliant'}
                {transaction.complianceStatus === 'review' && 'Review'}
                {transaction.complianceStatus === 'violation' && 'Violation'}
                {transaction.complianceStatus === 'pending' && 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-sm font-medium text-foreground">
                  {formatAmount(transaction.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Asset</p>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">
                      {transaction.asset.slice(0, 1)}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{transaction.asset}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">{transaction.wallet}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getRiskScoreColor(transaction.riskScore)}`}>
                  {transaction.riskScore}%
                </span>
                <div className="w-8 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      transaction.riskScore >= 80 ? 'bg-error' :
                      transaction.riskScore >= 60 ? 'bg-warning' :
                      transaction.riskScore >= 40 ? 'bg-accent' : 'bg-success'
                    }`}
                    style={{ width: `${transaction.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;