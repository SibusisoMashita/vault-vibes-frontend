import { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, ShoppingCart, Calendar } from 'lucide-react';
import { Transaction } from '../../types/stokvel';
import { formatCurrency, formatDate } from '../../lib/utils';
import { transactions } from '../../data/mockData';

export function LedgerScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'contribution':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'loan':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'purchase':
        return <ShoppingCart className="w-4 h-4" />;
      case 'distribution':
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'contribution':
        return 'bg-chart-2/10 text-chart-2';
      case 'loan':
        return 'bg-accent/10 text-accent';
      case 'purchase':
        return 'bg-chart-3/10 text-chart-3';
      case 'distribution':
        return 'bg-warning/10 text-warning';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-chart-2/10 text-chart-2';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'approved':
        return 'bg-accent/10 text-accent';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Transaction Ledger</h1>
        <p className="text-sm text-muted-foreground">
          Complete transaction history
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="pl-12 pr-8 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="all">All Types</option>
            <option value="contribution">Contributions</option>
            <option value="loan">Loans</option>
            <option value="purchase">Purchases</option>
            <option value="distribution">Distributions</option>
          </select>
        </div>
      </div>

      {/* Desktop: Split View */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        {/* Transaction List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Transactions ({filteredTransactions.length})</h3>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredTransactions.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className={`w-full p-4 hover:bg-secondary/50 transition-colors text-left ${
                  selectedTransaction?.id === transaction.id ? 'bg-secondary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeColor(transaction.type)}`}>
                    {getIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold truncate">{transaction.memberName}</p>
                      <p className="font-semibold tabular-nums shrink-0">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Detail */}
        <div className="bg-card rounded-2xl border border-border sticky top-6 h-fit">
          {selectedTransaction ? (
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getTypeColor(selectedTransaction.type)}`}>
                  {getIcon(selectedTransaction.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 capitalize">{selectedTransaction.type}</p>
                  <p className="text-3xl font-bold tabular-nums">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member</p>
                  <p className="font-semibold">{selectedTransaction.memberName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{selectedTransaction.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold">{formatDate(selectedTransaction.date)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span className={`inline-block text-sm px-3 py-1 rounded-full capitalize font-semibold ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                {selectedTransaction.shares && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shares</p>
                    <p className="font-semibold">{selectedTransaction.shares} shares</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                  <p className="text-sm font-mono text-muted-foreground">{selectedTransaction.id}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a transaction to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Timeline View */}
      <div className="lg:hidden bg-card rounded-2xl border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Transactions ({filteredTransactions.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeColor(transaction.type)}`}>
                  {getIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold">{transaction.memberName}</p>
                    <p className="font-semibold tabular-nums shrink-0">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{transaction.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  {transaction.shares && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {transaction.shares} shares
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
