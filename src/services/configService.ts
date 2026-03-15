import { api } from './api';

export interface StokvelConfig {
  id: string;
  totalShares: number;
  sharePrice: number;
  updatedAt: string;
}

export interface BorrowingConfig {
  id: string;
  interestRate: number;
  updatedAt: string;
}

export const ConfigService = {
  getStokvel: (): Promise<StokvelConfig> =>
    api.get<StokvelConfig>('/config/stokvel'),

  updateStokvel: (data: { totalShares?: number; sharePrice?: number }): Promise<StokvelConfig> =>
    api.put<StokvelConfig>('/config/stokvel', data),

  getBorrowing: (): Promise<BorrowingConfig> =>
    api.get<BorrowingConfig>('/config/borrowing'),

  updateBorrowing: (data: { interestRate?: number }): Promise<BorrowingConfig> =>
    api.put<BorrowingConfig>('/config/borrowing', data),
};
