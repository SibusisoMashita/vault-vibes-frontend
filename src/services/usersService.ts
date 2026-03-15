import { api } from './api';
import { Member } from '../types';

interface MemberDTO {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: string;
  sharesOwned: number;
  totalCommitment: number;
  paidSoFar: number;
  remaining: number;
}

function toMember(dto: MemberDTO): Member {
  return {
    id: dto.id,
    name: dto.fullName,
    phoneNumber: dto.phoneNumber ?? '',
    sharesOwned: dto.sharesOwned,
    totalCommitment: dto.totalCommitment,
    paidSoFar: dto.paidSoFar,
    remaining: dto.remaining,
    role: (dto.role?.toLowerCase() as Member['role']) ?? 'member',
    status: dto.status ?? 'ACTIVE',
  };
}

export const UsersService = {
  getMe: async (): Promise<Member> => {
    const dto = await api.get<MemberDTO>('/users/me');
    return toMember(dto);
  },

  listMembers: async (): Promise<Member[]> => {
    const dtos = await api.get<MemberDTO[]>('/users');
    return dtos.map(toMember);
  },

  updateStatus: (id: string, status: string) =>
    api.patch<void>(`/users/${id}/status`, { status }),

  updateRole: (id: string, role: string) =>
    api.patch<void>(`/users/${id}/role`, { role }),
};
