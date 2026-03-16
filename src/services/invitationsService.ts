import { api } from './api';

export interface Invitation {
  id:              string;
  userId:          string;
  userFullName:    string;
  userPhoneNumber: string;
  userRole:        string;
  invitedBy:       string | null;
  status:          'PENDING' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  resentAt:        string | null;
  createdAt:       string;
}

export const InvitationsService = {
  list: (): Promise<Invitation[]> =>
    api.get<Invitation[]>('/invitations'),

  create: (fullName: string, phoneNumber: string, role: string, shareUnits: number): Promise<Invitation> =>
    api.post<Invitation>('/invitations', { fullName, phoneNumber, role, shareUnits }),

  resend: (id: string): Promise<Invitation> =>
    api.post<Invitation>(`/invitations/${id}/resend`, {}),

  remove: (id: string): Promise<void> =>
    api.delete<void>(`/invitations/${id}`),
};
