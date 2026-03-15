import { api } from './api';
import { Transaction } from '../types';

interface LedgerEntryDTO {
  id: string;
  userId: string | null;
  memberName: string | null;
  entryType: string;
  amount: number;
  reference: string | null;
  description: string | null;
  postedAt: string;
}

interface BankInterestRequest {
  amount: number;
  postedAt: string;
  reference?: string;
  description?: string;
}

function toTransaction(dto: LedgerEntryDTO): Transaction {
  const typeMap: Record<string, Transaction['type']> = {
    CONTRIBUTION:  'contribution',
    LOAN:          'loan',
    DISTRIBUTION:  'distribution',
    PURCHASE:      'purchase',
    BANK_INTEREST: 'bank_interest',
    contribution:  'contribution',
    loan:          'loan',
    distribution:  'distribution',
    purchase:      'purchase',
    bank_interest: 'bank_interest',
  };

  return {
    id: dto.id,
    memberId: dto.userId ?? '',
    memberName: dto.memberName ?? 'Bank Interest',
    type: typeMap[dto.entryType] ?? 'contribution',
    amount: dto.amount,
    date: (dto.postedAt ?? new Date().toISOString()).slice(0, 10),
    status: 'completed',
    description: dto.description ?? dto.reference ?? dto.entryType,
  };
}

export const LedgerService = {
  list: async (): Promise<Transaction[]> => {
    const dtos = await api.get<LedgerEntryDTO[]>('/ledger');
    return dtos.map(toTransaction);
  },

  recordBankInterest: async (request: BankInterestRequest): Promise<Transaction> => {
    const dto = await api.post<LedgerEntryDTO>('/ledger/bank-interest', request);
    return toTransaction(dto);
  },
};
