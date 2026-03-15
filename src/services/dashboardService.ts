import { api } from './api';
import { Member, Pool, Share, Group } from '../types';
import { safeNumber } from '../utils/financial';

export interface DashboardSummary {
  sharesOwned: number;
  totalCommitment: number;
  paidSoFar: number;
  remaining: number;
  estimatedValue: number;
  perShareValue: number;
  poolBalance: number;
  capitalCommitted: number;
  capitalReceived: number;
  liquidityAvailable: number;
  totalLoansValue: number;
  activeLoans: number;
  totalShares: number;
  sharesSold: number;
  sharesAvailable: number;
  pricePerShare: number;
  totalMembers: number;
  yearEnd: string;
  groupName: string;
  bankBalance: number;
  outstandingLoans: number;
  memberShareValue: number;
  memberBorrowLimit: number;
  poolBorrowLimit: number;
  availableToBorrow: number;
}

export function toMember(d: DashboardSummary, id: string, name: string, role: Member['role']): Member {
  return {
    id,
    name,
    sharesOwned:      safeNumber(d.sharesOwned),
    totalCommitment:  safeNumber(d.totalCommitment),
    paidSoFar:        safeNumber(d.paidSoFar),
    remaining:        safeNumber(d.remaining),
    role,
  };
}

export function toPool(d: DashboardSummary): Pool {
  return {
    totalBalance:       safeNumber(d.poolBalance),
    capitalCommitted:   safeNumber(d.capitalCommitted),
    capitalReceived:    safeNumber(d.capitalReceived),
    liquidityAvailable: safeNumber(d.liquidityAvailable),
    activeLoans:        safeNumber(d.activeLoans),
    totalLoansValue:    safeNumber(d.totalLoansValue),
    perShareValue:      safeNumber(d.perShareValue),
    bankBalance:        safeNumber(d.bankBalance),
    outstandingLoans:   safeNumber(d.outstandingLoans),
    memberShareValue:   safeNumber(d.memberShareValue),
    memberBorrowLimit:  safeNumber(d.memberBorrowLimit),
    poolBorrowLimit:    safeNumber(d.poolBorrowLimit),
    availableToBorrow:  safeNumber(d.availableToBorrow),
  };
}

export function toShare(d: DashboardSummary): Share {
  return {
    id:              'summary',
    pricePerShare:   safeNumber(d.pricePerShare),
    totalShares:     safeNumber(d.totalShares),
    sharesSold:      safeNumber(d.sharesSold),
    sharesAvailable: safeNumber(d.sharesAvailable),
  };
}

export function toGroup(d: DashboardSummary): Group {
  return {
    id:           'g1',
    name:         d.groupName,
    totalMembers: safeNumber(d.totalMembers),
    yearEnd:      d.yearEnd,
  };
}

export const DashboardService = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
};
