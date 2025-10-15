import { api } from '../lib/axios';
import {
  UserGearResponseSchema,
  UpdateUserGearSchema,
  UpdateItemEnhancementSchema,
  type UserGearResponse,
  type UpdateUserGear,
  type UpdateItemEnhancement,
} from '../types/api';

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

  async updateItemEnhancement(
    data: UpdateItemEnhancement
  ): Promise<UserGearResponse> {
    const validatedData = UpdateItemEnhancementSchema.parse(data);
    const response = await api.patch(
      '/users/profile/gear/enhancement',
      validatedData
    );
    return UserGearResponseSchema.parse(response.data);
  },

  // Get specific user's gear (authenticated users)
  async getUserGearById(userId: string): Promise<UserGearResponse> {
    const response = await api.get(`/users/${userId}/gear`);
    return UserGearResponseSchema.parse(response.data);
  },
};
