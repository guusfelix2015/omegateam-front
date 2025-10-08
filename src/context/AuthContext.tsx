/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useAuthState } from '../hooks/auth.hooks';
import { authService } from '../services/auth.service';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();

  useEffect(() => {
    authService.initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={authState as unknown as any}>
      {children}
    </AuthContext.Provider>
  );
};
