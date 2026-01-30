import React, {createContext, useContext, useMemo, useState} from 'react';

type AuthContextValue = {
  token: string;
  userId: string;
  setAuth: (token: string, userId: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [token, setTokenState] = useState('');
  const [userId, setUserId] = useState('');

  const setAuth = (nextToken: string, nextUserId: string) => {
    setTokenState(nextToken.trim());
    setUserId(nextUserId.trim());
  };

  const clearAuth = () => {
    setTokenState('');
    setUserId('');
  };

  const value = useMemo(
    () => ({
      token,
      userId,
      setAuth,
      clearAuth,
    }),
    [token, userId],
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
