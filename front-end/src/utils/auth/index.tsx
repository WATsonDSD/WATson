import React, { useState, useEffect } from 'react';

import {
  useLocation,
  Navigate,
} from 'react-router-dom';

import Auth from './auth';

interface AuthContextType {
    user: any;
    login: (email: string, password: string, callback: VoidFunction) => void;
    logout: (callback: VoidFunction) => void;
    updateCurrentSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string, callback: Function) => Auth.login(email, password).then((data) => {
    setUser(data);
    callback();
  });

  const logout = (callback: Function) => Auth.logout(() => {
    setUser(null);
    callback();
  });

  const updateCurrentSession = () => Auth.updateCurrentSession((data) => {
    setUser(data);
  });

  const value = {
    user, login, logout, updateCurrentSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function Protected({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const auth = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.updateCurrentSession().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (<span>Loading...</span>);
  }

  if (!auth.user) {
    // Redirects the user to the login page and saves the current location they were
    // trying to access when they were redirected, which makes for nicer user experience.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}
