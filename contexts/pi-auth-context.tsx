'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyClientAdminSession, PI_NETWORK_CONFIG } from '@/lib/system-config';

interface PiAuthUser {
  username: string;
  uid: string;
  roles: string[];
}

interface PiAuthContextType {
  user: PiAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPi: () => Promise<void>;
  logout: () => void;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export const PiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const savedToken = localStorage.getItem('pi_token');
        const savedUsername = localStorage.getItem('pi_username');
        const savedRole = localStorage.getItem('tamco_admin_role');

        if (savedToken && savedUsername) {
          setUser({
            username: savedUsername,
            uid: '',
            roles: savedRole ? [savedRole] : []
          });
        }
      } catch (error) {
        console.error("فشل في استعادة الجلسة:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkExistingSession();
  }, []);

  const loginWithPi = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        const PiSDK = (window as any).Pi;
        const scopes = ['username', 'payments'];
        const authResponse = await PiSDK.authenticate(scopes, (onIncompletePaymentFound: any) => {
          console.log("عمليات معلقة:", onIncompletePaymentFound);
        });

        localStorage.setItem('pi_token', authResponse.accessToken);
        localStorage.setItem('pi_username', authResponse.user.username);
        localStorage.setItem('tamco_admin_role', 'ACTIVE_MASTER');

        setUser({
          username: authResponse.user.username,
          uid: authResponse.user.uid,
          roles: ['ACTIVE_MASTER']
        });
        alert(`مرحباً بك ${authResponse.user.username}`);
      } else {
        localStorage.setItem('pi_token', PI_NETWORK_CONFIG.SANDBOX_TOKEN);
        localStorage.setItem('pi_username', 'TamcoMasterAdmin');
        localStorage.setItem('tamco_admin_role', 'ACTIVE_MASTER');

        setUser({
          username: 'TamcoMasterAdmin',
          uid: 'sandbox-12345',
          roles: ['ACTIVE_MASTER']
        });
      }
    } catch (error) {
      console.error("خطأ تسجيل الدخول:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pi_token');
    localStorage.removeItem('pi_username');
    localStorage.removeItem('tamco_admin_role');
    setUser(null);
  };

  return (
    <PiAuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, loginWithPi, logout }}>
      {children}
    </PiAuthContext.Provider>
  );
};

export const usePiAuth = () => {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error('usePiAuth يجب أن يتم استخدامه داخل PiAuthProvider');
  }
  return context;
};