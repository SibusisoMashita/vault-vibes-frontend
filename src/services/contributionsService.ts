import { api } from './api';
import { Transaction } from '../types';

export interface ContributionRecord {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  contributionDate: string;
  notes: string | null;
  proofFileType: string | null;
  proofFileAvailable: boolean;
  verificationStatus: string;
  rejectionReason: string | null;
  createdAt: string;
}

interface ContributionRequest {
  userId: string;
  contributionDate: string;
  notes?: string;
}

export interface ContributionPreview {
  shareUnits: number;
  sharePrice: number;
  contributionAmount: number;
  loanOutstanding: number;
  loanInterest: number;
  repaymentAmount: number;
  totalDue: number;
  activeLoanId: string | null;
  hasContributedThisMonth: boolean;
}

function toTransaction(dto: ContributionRecord): Transaction {
  return {
    id: dto.id,
    memberId: dto.userId,
    memberName: dto.memberName,
    type: 'contribution',
    amount: dto.amount,
    date: dto.contributionDate,
    status: dto.verificationStatus === 'VERIFIED' ? 'completed' : 'pending',
    description: dto.notes ?? 'Contribution',
  };
}

export const ContributionsService = {
  list: async (): Promise<Transaction[]> => {
    const dtos = await api.get<ContributionRecord[]>('/contributions');
    return dtos.map(toTransaction);
  },

  listRaw: async (): Promise<ContributionRecord[]> => {
    return api.get<ContributionRecord[]>('/contributions');
  },

  preview: async (userId: string): Promise<ContributionPreview> => {
    return api.get<ContributionPreview>(`/contributions/preview/${userId}`);
  },

  /** JSON-only submission — no proof file. Contribution is auto-verified. */
  add: async (request: ContributionRequest): Promise<ContributionRecord> => {
    return api.post<ContributionRecord>('/contributions', request);
  },

  /** Multipart submission with a required proof-of-payment file. */
  addWithProof: async (
    userId: string,
    contributionDate: string,
    notes?: string,
    proofFile: File,
  ): Promise<ContributionRecord> => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('contributionDate', contributionDate);
    if (notes) formData.append('notes', notes);
    formData.append('proofFile', proofFile);
    return api.postMultipart<ContributionRecord>('/contributions', formData);
  },

  /** Returns a short-lived signed S3 URL for viewing/downloading a proof file. */
  getProofUrl: async (id: string): Promise<string> => {
    const result = await api.get<{ url: string }>(`/contributions/${id}/proof`);
    return result.url;
  },

  verify: async (id: string): Promise<ContributionRecord> => {
    return api.post<ContributionRecord>(`/contributions/${id}/verify`, {});
  },

  reject: async (id: string, reason: string): Promise<ContributionRecord> => {
    return api.post<ContributionRecord>(`/contributions/${id}/reject`, { reason });
  },
};
