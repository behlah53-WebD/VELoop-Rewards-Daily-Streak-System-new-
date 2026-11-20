import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('veloop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('veloop_token') || null);
  const [wallet, setWallet] = useState(() => {
    try {
      const saved = localStorage.getItem('veloop_wallet');
      return saved ? JSON.parse(saved) : { VES: 120, INR: 0 };
    } catch {
      return { VES: 120, INR: 0 };
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync token & user state across storage and fetch latest profile
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (isMounted && res?.user) {
            setUser(res.user);
            localStorage.setItem('veloop_user', JSON.stringify(res.user));
            if (res.wallet) {
              setWallet(res.wallet);
              localStorage.setItem('veloop_wallet', JSON.stringify(res.wallet));
            }
          }
        } catch {
          // Token invalid or expired
          if (isMounted) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('veloop_token');
            localStorage.removeItem('veloop_user');
            localStorage.removeItem('veloop_wallet');
          }
        }
      }
      if (isMounted) setLoading(false);
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('veloop_token', res.token);
      localStorage.setItem('veloop_user', JSON.stringify(res.user));
      if (res.wallet) {
        setWallet(res.wallet);
        localStorage.setItem('veloop_wallet', JSON.stringify(res.wallet));
      }
    }
    return res;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('veloop_token', res.token);
      localStorage.setItem('veloop_user', JSON.stringify(res.user));
      if (res.wallet) {
        setWallet(res.wallet);
        localStorage.setItem('veloop_wallet', JSON.stringify(res.wallet));
      }
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setWallet({ VES: 0, INR: 0 });
    localStorage.removeItem('veloop_token');
    localStorage.removeItem('veloop_user');
    localStorage.removeItem('veloop_wallet');
  }, []);

  const updateWallet = useCallback((newBalances) => {
    if (newBalances) {
      setWallet(newBalances);
      localStorage.setItem('veloop_wallet', JSON.stringify(newBalances));
    }
  }, []);

  const value = {
    user,
    token,
    wallet,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
