import { api } from './api';

export interface Invitation {
  id:           string;
  phoneNumber:  string;
  role:         string;
  invitedBy:    string | null;
  shareUnits:   number;
  pricePerUnit: number;
  status:       string;
  createdAt:    string;
}

export const InvitationsService = {
  list: (): Promise<Invitation[]> =>
    api.get<Invitation[]>('/invitations'),

  create: (phoneNumber: string, role: string, shareUnits: number): Promise<Invitation> =>
    api.post<Invitation>('/invitations', { phoneNumber, role, shareUnits }),
};
