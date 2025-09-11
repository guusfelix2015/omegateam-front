import { api } from '../lib/axios';
import {
  CompanyPartySchema,
  UserSchema,
  type AddPlayerToParty,
  type CompanyParty,
  type CreateCompanyParty,
  type UpdateCompanyParty,
  type User
} from '../types/api';

export const companyPartiesService = {
  async getAll(): Promise<CompanyParty[]> {
    const response = await api.get('/company-parties');
    return response.data.map((party: CompanyParty) => CompanyPartySchema.parse(party));
  },

  async getById(id: string): Promise<CompanyParty> {
    const response = await api.get(`/company-parties/${id}`);
    return CompanyPartySchema.parse(response.data);
  },

  async create(data: CreateCompanyParty): Promise<CompanyParty> {
    const response = await api.post('/company-parties', data);
    return CompanyPartySchema.parse(response.data);
  },

  async update(id: string, data: UpdateCompanyParty): Promise<CompanyParty> {
    const response = await api.put(`/company-parties/${id}`, data);
    return CompanyPartySchema.parse(response.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/company-parties/${id}`);
  },

  async addPlayer(partyId: string, data: AddPlayerToParty): Promise<CompanyParty> {
    const response = await api.post(`/company-parties/${partyId}/players`, data);
    return CompanyPartySchema.parse(response.data);
  },

  async removePlayer(partyId: string, playerId: string): Promise<CompanyParty> {
    const response = await api.delete(`/company-parties/${partyId}/players/${playerId}`);
    return CompanyPartySchema.parse(response.data);
  },

  async getMembers(partyId: string): Promise<User[]> {
    const response = await api.get(`/company-parties/${partyId}/members`);
    return response.data.map((user: User) => UserSchema.parse(user));
  },
};
