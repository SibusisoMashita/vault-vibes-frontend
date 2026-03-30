import { api } from './api';

export interface StokvelDTO {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface CreateStokvelPayload {
  name: string;
  description?: string;
}

export interface UpdateStokvelPayload {
  name?: string;
  description?: string;
}

export const StokvelsService = {
  list: () => api.get<StokvelDTO[]>('/admin/stokvels'),

  getById: (id: string) => api.get<StokvelDTO>(`/admin/stokvels/${id}`),

  create: (payload: CreateStokvelPayload) =>
    api.post<StokvelDTO>('/admin/stokvels', payload),

  update: (id: string, payload: UpdateStokvelPayload) =>
    api.put<StokvelDTO>(`/admin/stokvels/${id}`, payload),

  setStatus: (id: string, status: string) =>
    api.patch<StokvelDTO>(`/admin/stokvels/${id}/status`, { status }),
};
