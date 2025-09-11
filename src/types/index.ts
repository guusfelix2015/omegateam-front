/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatar?: string;
  isActive: boolean;
  lvl: number;
  role: 'ADMIN' | 'PLAYER';
  createdAt: string;
  updatedAt: string;
  companyParties?: UserCompanyParty[];
}

export interface CompanyParty {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  users?: UserCompanyParty[];
  playerCount?: number;
}

export interface UserCompanyParty {
  id: string;
  userId: string;
  companyPartyId: string;
  joinedAt: string;
  user?: User;
  companyParty?: CompanyParty;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any[];
}
