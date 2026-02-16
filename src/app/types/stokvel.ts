export interface Member {
  id: string;
  name: string;
  sharesOwned: number;
  totalCommitment: number;
  paidSoFar: number;
  remaining: number;
  role: 'member' | 'treasurer' | 'admin';
}

export interface Share {
  id: string;
  pricePerShare: number;
  totalShares: number;
  sharesSold: number;
  sharesAvailable: number;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'contribution' | 'loan' | 'distribution' | 'purchase';
  amount: number;
  shares?: number;
  date: string;
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  description: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  amountRepaid: number;
  interestRate: number;
  monthlyPayment: number;
  monthsRemaining: number;
  status: 'active' | 'approved' | 'pending' | 'repaid';
  dateIssued: string;
}

export interface Pool {
  totalBalance: number;
  capitalCommitted: number;
  capitalReceived: number;
  liquidityAvailable: number;
  activeLoans: number;
  totalLoansValue: number;
  perShareValue: number;
}

export interface Group {
  id: string;
  name: string;
  totalMembers: number;
  yearEnd: string;
}
