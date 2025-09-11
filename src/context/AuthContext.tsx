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
    // Initialize auth on app start
    authService.initializeAuth();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Auth State Updated:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      user: authState.user,
      error: authState.error,
      hasToken: !!authService.getToken()
    });
  }, [authState.isAuthenticated, authState.isLoading, authState.user, authState.error]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
