import { ArrowUpRight, ArrowDownRight, ShoppingCart, Calendar } from 'lucide-react';
import { Transaction } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { formatShortDate } from '../../../utils/date';

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
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
    <div className="bg-card rounded-2xl border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                transaction.type === 'contribution' ? 'bg-chart-2/10 text-chart-2' :
                transaction.type === 'loan' ? 'bg-accent/10 text-accent' :
                'bg-chart-3/10 text-chart-3'
              }`}>
                {getIcon(transaction.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium">{transaction.memberName}</p>
                  <p className="font-semibold tabular-nums shrink-0">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-muted-foreground">
                    {transaction.description}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatShortDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
