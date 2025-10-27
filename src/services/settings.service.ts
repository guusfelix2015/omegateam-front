import { api } from '../lib/axios';

export interface Setting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsListResponse {
  data: Setting[];
}

export const settingsService = {
  async getAllSettings(): Promise<SettingsListResponse> {
    const response = await api.get('/settings');
    return response.data;
  },

  async getSettingByKey(key: string): Promise<Setting> {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },

  async createSetting(key: string, value: string): Promise<Setting> {
    const response = await api.post('/settings', { key, value });
    return response.data;
  },

  async updateSetting(key: string, value: string): Promise<Setting> {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const response = await api.post('/settings/upsert', { key, value });
    return response.data;
  },

  async deleteSetting(key: string): Promise<void> {
    await api.delete(`/settings/${key}`);
  },
};

