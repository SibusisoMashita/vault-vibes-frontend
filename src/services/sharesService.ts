import { api } from './api';
import { Share } from '../types';

interface ShareSummaryDTO {
  totalShares: number;
  sharesSold: number;
  sharesAvailable: number;
  pricePerShare: number;
}

export const SharesService = {
  getSummary: async (): Promise<Share> => {
    const dto = await api.get<ShareSummaryDTO>('/shares');
    return {
      id: 'summary',
      pricePerShare: dto.pricePerShare,
      totalShares: dto.totalShares,
      sharesSold: dto.sharesSold,
      sharesAvailable: dto.sharesAvailable,
    };
  },

  getMyShares: () => api.get<ShareSummaryDTO[]>('/shares/my'),

  updateUserShares: (userId: string, shareUnits: number): Promise<void> =>
    api.put<void>(`/shares/user/${userId}`, { shareUnits }),
};
