import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('al_mushtaq_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.warn('Session expired:', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('al_mushtaq_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('al_mushtaq_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = () => {
    localStorage.removeItem('al_mushtaq_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
