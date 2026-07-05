import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  role: 'Pelapor' | 'Administrator' | 'Teknisi' | 'Manajer Fasilitas';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_TOKEN = 'campuscare_token';
const STORAGE_KEY_USER = 'campuscare_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed.' };
      }

      const { token: newToken, user: userData } = data;

      localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to server.' };
    }
  };

  const logout = () => {
    // Call logout API in background (fire and forget)
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }

    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = (): Record<string, string> => {
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
