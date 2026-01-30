import React, {createContext, useContext, useMemo, useState} from 'react';

type AuthContextValue = {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [token, setTokenState] = useState('');

  const setToken = (next: string) => {
    setTokenState(next.trim());
  };

  const clearToken = () => setTokenState('');

  const value = useMemo(
    () => ({
      token,
      setToken,
      clearToken,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
