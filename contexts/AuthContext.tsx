
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '../types';
import { authenticateAndFetchData, AuthCredentials } from '../services/api';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for credentials and stored user data on mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('genshin_tracker_credentials');
    const storedUser = localStorage.getItem('genshin_tracker_user_data');
    
    if (storedCredentials) {
        try {
            const credentials = JSON.parse(storedCredentials);
            
            if (storedUser) {
                // If we have cached user data, use it immediately
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch(e) {
                    // Cached data invalid, fetch fresh
                    login(credentials);
                }
            } else {
                // No cached user, fetch fresh
                login(credentials);
            }
        } catch (e) {
            console.error("Failed to parse stored credentials");
            localStorage.removeItem('genshin_tracker_credentials');
        }
    }
  }, []);

  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Store credentials temporarily for API calls during session
      localStorage.setItem('genshin_tracker_credentials', JSON.stringify(credentials));
      
      const data = await authenticateAndFetchData(credentials);
      setUser(data);
      // Store user data locally for faster execution on subsequent loads
      localStorage.setItem('genshin_tracker_user_data', JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to HoYoLab');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('genshin_tracker_credentials');
    localStorage.removeItem('genshin_tracker_user_data');
    localStorage.removeItem('genshin_char_detail_cache'); // Optional: clear detailed cache on logout
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
