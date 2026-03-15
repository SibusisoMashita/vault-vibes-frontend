import { api } from './api';

export interface Distribution {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  distributedAt: string;
}

interface DistributionDTO {
  id: string;
  userId: string;
  memberName: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  distributedAt: string;
}

export const DistributionsService = {
  list: async (): Promise<Distribution[]> => {
    const dtos = await api.get<DistributionDTO[]>('/distributions');
    return dtos;
  },
};
