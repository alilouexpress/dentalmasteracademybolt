import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getStoredUser, setStoredUser } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show the cached profile immediately, then validate the httpOnly session
    // with the server. Every protected API call is server-authorized regardless.
    const cached = getStoredUser();
    if (cached) setUser(cached);

    (async () => {
      const { ok, data } = await api<{ user: AuthUser }>('/api/auth/me');
      if (ok) {
        setUser(data.user);
        setStoredUser(data.user);
      } else {
        setUser(null);
        setStoredUser(null);
      }
      setLoading(false);
    })();
  }, []);

  const applySession = (u: AuthUser) => {
    setStoredUser(u);
    setUser(u);
  };

  const signIn = async (email: string, password: string) => {
    const { ok, data, error } = await api<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (!ok) return { error };
    applySession(data.user);
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { ok, data, error } = await api<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: { email, password },
    });
    if (!ok) return { error };
    applySession(data.user);
    return { error: null };
  };

  const signOut = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    setStoredUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
