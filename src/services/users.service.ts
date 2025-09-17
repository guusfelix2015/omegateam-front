import { api } from '../lib/axios';
import { UserSchema, UpdateProfileSchema, type User, type UpdateProfile } from '../types/api';

export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: 'ADMIN' | 'PLAYER' | 'CP_LEADER';
  sortBy?: 'name' | 'email' | 'nickname' | 'lvl' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  players: number;
}

export interface CreateUserData {
  email: string;
  name: string;
  nickname: string;
  password: string;
  avatar?: string;
  isActive?: boolean;
  lvl?: number;
  role: 'ADMIN' | 'PLAYER' | 'CP_LEADER';
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  isActive?: boolean;
  lvl?: number;
  role?: 'ADMIN' | 'PLAYER' | 'CP_LEADER';
}

export const usersService = {
  async getAll(query: UsersQuery = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.isActive !== undefined) params.append('isActive', query.isActive.toString());
    if (query.role) params.append('role', query.role);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`/users?${params.toString()}`);

    const users = response.data.data.map((user: User) => UserSchema.parse(user));

    return {
      data: users,
      pagination: response.data.pagination,
    };
  },

  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return UserSchema.parse(response.data);
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return UserSchema.parse(response.data);
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return UserSchema.parse(response.data);
  },

  async getStats(): Promise<UserStats> {
    const response = await api.get('/users/stats');
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return UserSchema.parse(response.data);
  },

  async updateProfile(data: UpdateProfile): Promise<User> {
    const validatedData = UpdateProfileSchema.parse(data);
    const response = await api.put('/users/profile', validatedData);
    return UserSchema.parse(response.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
