import { api } from '../lib/axios';
import { UserGearResponseSchema, UpdateUserGearSchema, type UserGearResponse, type UpdateUserGear } from '../types/api';

export const gearService = {
  async getUserGear(): Promise<UserGearResponse> {
    const response = await api.get('/users/profile/gear');
    return UserGearResponseSchema.parse(response.data);
  },

  async updateUserGear(data: UpdateUserGear): Promise<UserGearResponse> {
    const validatedData = UpdateUserGearSchema.parse(data);
    const response = await api.put('/users/profile/gear', validatedData);
    return UserGearResponseSchema.parse(response.data);
  },
};
