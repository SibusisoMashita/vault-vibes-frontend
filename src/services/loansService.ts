import { api } from './api';
import { Loan } from '../types';

interface LoanDTO {
  id: string;
  userId: string;
  memberName: string;
  principalAmount: number;
  interestRate: number;
  interest: number;
  totalRepayment: number;
  amountRepaid: number;
  remaining: number;
  status: string;
  issuedAt: string | null;
  createdAt: string;
}

interface LoanRequest {
  userId: string;
  amount: number;
}

function toLoan(dto: LoanDTO): Loan {
  return {
    id: dto.id,
    memberId: dto.userId,
    memberName: dto.memberName,
    amount: dto.principalAmount,
    interestRate: dto.interestRate,
    interest: dto.interest,
    totalRepayment: dto.totalRepayment,
    amountRepaid: dto.amountRepaid,
    remaining: dto.remaining,
    status: dto.status as Loan['status'],
    dateIssued: dto.issuedAt ? dto.issuedAt.slice(0, 10) : (dto.createdAt ?? new Date().toISOString()).slice(0, 10),
  };
}

export const LoansService = {
  list: async (): Promise<Loan[]> => {
    const dtos = await api.get<LoanDTO[]>('/loans');
    return dtos.map(toLoan);
  },

  request: async (loanRequest: LoanRequest): Promise<Loan> => {
    const dto = await api.post<LoanDTO>('/loans/request', loanRequest);
    return toLoan(dto);
  },

  approve: async (id: string): Promise<Loan> => {
    const dto = await api.post<LoanDTO>(`/loans/${id}/approve`, {});
    return toLoan(dto);
  },

  reject: async (id: string): Promise<Loan> => {
    const dto = await api.post<LoanDTO>(`/loans/${id}/reject`, {});
    return toLoan(dto);
  },

  repay: async (id: string): Promise<Loan> => {
    const dto = await api.post<LoanDTO>(`/loans/${id}/repay`, {});
    return toLoan(dto);
  },

  /** Admin-only: issue a loan directly as ACTIVE on behalf of a member. */
  issue: async (userId: string, amount: number): Promise<Loan> => {
    const dto = await api.post<LoanDTO>('/loans/issue', { userId, amount });
    return toLoan(dto);
  },
};
