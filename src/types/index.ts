export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  sharesOwned: number;
  totalCommitment: number;
  paidSoFar: number;
  remaining: number;
  role: 'member' | 'treasurer' | 'chairperson' | 'admin';
  status: string;
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
  type: 'contribution' | 'loan' | 'distribution' | 'purchase' | 'bank_interest';
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
  interestRate: number;
  interest: number;
  totalRepayment: number;
  amountRepaid: number;
  remaining: number;
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
  bankBalance: number;
  outstandingLoans: number;
  memberShareValue: number;
  memberBorrowLimit: number;
  poolBorrowLimit: number;
  availableToBorrow: number;
}

export interface Group {
  id: string;
  name: string;
  totalMembers: number;
  yearEnd: string;
}
