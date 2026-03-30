import { api } from './api';
import { Member, Pool, Share, Stokvel } from '../types';
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
  monthlyContribution: number;
  cycleMonths: number;
  expectedToDate: number;
  totalMembers: number;
  yearEnd: string;
  stokvelName: string;
  bankBalance: number;
  outstandingLoans: number;
  memberShareValue: number;
  memberBorrowLimit: number;
  poolBorrowLimit: number;
  availableToBorrow: number;
}

export function toMember(d: DashboardSummary, id: string, name: string, role: Member['role']): Member {
  const paidSoFar       = safeNumber(d.paidSoFar);
  const totalCommitment = safeNumber(d.totalCommitment);
  if (paidSoFar > totalCommitment) {
    console.warn('DATA_INTEGRITY_WARNING: paidSoFar exceeds totalCommitment', { paidSoFar, totalCommitment });
  }
  return {
    id,
    name,
    sharesOwned:      safeNumber(d.sharesOwned),
    totalCommitment,
    paidSoFar,
    remaining:        safeNumber(d.remaining),
    expectedToDate:   safeNumber(d.expectedToDate),
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

export function toStokvel(d: DashboardSummary): Stokvel {
  return {
    id:           'current',
    name:         d.stokvelName,
    totalMembers: safeNumber(d.totalMembers),
    yearEnd:      d.yearEnd,
  };
}

/** @deprecated Use toStokvel */
export const toGroup = toStokvel;

export const DashboardService = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
};
