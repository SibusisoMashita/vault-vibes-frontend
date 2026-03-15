import { api } from './api';
import { Pool, Share } from '../types';
import { safeNumber } from '../utils/financial';

export interface PoolProjection {
  currentPoolValue:       number;
  monthsRemaining:        number;
  monthlyPoolContribution: number;
  contributionsRemaining: number;
  expectedLoanInterest:   number;
  avgMonthlyBankInterest: number;
  projectedBankInterest:  number;
  projectedPoolValue:     number;
  projectedPerShareValue: number;
}

interface PoolStatsDTO {
  totalBalance: number;
  capitalCommitted: number;
  capitalReceived: number;
  liquidityAvailable: number;
  activeLoans: number;
  totalLoansValue: number;
  perShareValue: number;
  totalShares: number;
  sharesSold: number;
  sharesAvailable: number;
  pricePerShare: number;
}

export const PoolService = {
  getProjection: async (): Promise<PoolProjection> => {
    const dto = await api.get<PoolProjection>('/pool/projection');
    // Coerce all numeric fields through safeNumber to guard against null/undefined
    return {
      currentPoolValue:        safeNumber(dto.currentPoolValue),
      monthsRemaining:         safeNumber(dto.monthsRemaining),
      monthlyPoolContribution: safeNumber(dto.monthlyPoolContribution),
      contributionsRemaining:  safeNumber(dto.contributionsRemaining),
      expectedLoanInterest:    safeNumber(dto.expectedLoanInterest),
      avgMonthlyBankInterest:  safeNumber(dto.avgMonthlyBankInterest),
      projectedBankInterest:   safeNumber(dto.projectedBankInterest),
      projectedPoolValue:      safeNumber(dto.projectedPoolValue),
      projectedPerShareValue:  safeNumber(dto.projectedPerShareValue),
    };
  },

  getStats: async (): Promise<{ pool: Pool; shares: Share }> => {
    const dto = await api.get<PoolStatsDTO>('/pool/stats');
    const pool: Pool = {
      totalBalance:       safeNumber(dto.totalBalance),
      capitalCommitted:   safeNumber(dto.capitalCommitted),
      capitalReceived:    safeNumber(dto.capitalReceived),
      liquidityAvailable: safeNumber(dto.liquidityAvailable),
      activeLoans:        safeNumber(dto.activeLoans),
      totalLoansValue:    safeNumber(dto.totalLoansValue),
      perShareValue:      safeNumber(dto.perShareValue),
      bankBalance:        0,
      outstandingLoans:   0,
      memberShareValue:   0,
      memberBorrowLimit:  0,
      poolBorrowLimit:    0,
      availableToBorrow:  0,
    };
    const shares: Share = {
      id:              'summary',
      pricePerShare:   safeNumber(dto.pricePerShare),
      totalShares:     safeNumber(dto.totalShares),
      sharesSold:      safeNumber(dto.sharesSold),
      sharesAvailable: safeNumber(dto.sharesAvailable),
    };
    return { pool, shares };
  },
};
