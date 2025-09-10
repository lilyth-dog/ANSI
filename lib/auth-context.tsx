'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  subscription: {
    tier: 'free' | 'premium' | 'enterprise';
    startDate: string;
    endDate?: string;
  };
  usage: {
    searchCount: number;
    analysisCount: number;
  };
  limits: {
    maxSearch: number;
    maxAnalysis: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 로컬 스토리지에서 사용자 정보 로드
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('patent-ai-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        localStorage.removeItem('patent-ai-user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출
      // 여기서는 데모용 더미 데이터
      const demoUser: User = {
        id: 'demo-user-1',
        email,
        firstName: '홍길동',
        lastName: '김',
        company: '스타트업',
        subscription: {
          tier: 'free',
          startDate: new Date().toISOString(),
        },
        usage: {
          searchCount: 3,
          analysisCount: 1,
        },
        limits: {
          maxSearch: 10,
          maxAnalysis: 3,
        },
      };

      // 로컬 스토리지에 저장
      localStorage.setItem('patent-ai-user', JSON.stringify(demoUser));
      setUser(demoUser);
      
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
        subscription: {
          tier: 'free',
          startDate: new Date().toISOString(),
        },
        usage: {
          searchCount: 0,
          analysisCount: 0,
        },
        limits: {
          maxSearch: 10,
          maxAnalysis: 3,
        },
      };

      // 로컬 스토리지에 저장
      localStorage.setItem('patent-ai-user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('회원가입 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('patent-ai-user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('patent-ai-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
