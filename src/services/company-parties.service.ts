import { api } from '../lib/axios';
import {
  CompanyPartySchema,
  type AddPlayerToParty,
  type CompanyParty,
  type CreateCompanyParty,
  type UpdateCompanyParty,
} from '../types/api';

export const companyPartiesService = {
  async getAll(): Promise<CompanyParty[]> {
    try {
      const response = await api.get('/company-parties');

      const parties = response.data?.data || response.data;

      if (!Array.isArray(parties)) {
        console.warn('Cp response is not an array:', parties);
        return [];
      }

      return parties.map((party: CompanyParty) => {
        try {
          return CompanyPartySchema.parse(party);
        } catch (parseError) {
          console.warn('Failed to parse company party:', party, parseError);
          return party;
        }
      });
    } catch (error) {
      console.error('Failed to fetch cp:', error);
      return [];
    }
  },

  async getById(id: string): Promise<CompanyParty> {
    try {
      const response = await api.get(`/company-parties/${id}`);

      try {
        const parsed = CompanyPartySchema.parse(response.data);
        return parsed;
      } catch (parseError) {
        console.error('Schema validation error:', parseError);
        return response.data as CompanyParty;
      }
    } catch (error) {
      console.error('Network error in getById:', error);
      throw error;
    }
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
};
