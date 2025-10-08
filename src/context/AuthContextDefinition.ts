import { createContext } from 'react';
import { type User } from '../types/api';

export interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isPlayer: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
