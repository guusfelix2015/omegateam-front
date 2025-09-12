/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';
import {
  LoginResponseSchema,
  UserSchema,
  type LoginRequest,
  type LoginResponse,
  type User
} from '../types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return LoginResponseSchema.parse(response.data);
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return UserSchema.parse(response.data);
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        this.removeToken();
        return false;
      }
      return false;
    }
  },
};
