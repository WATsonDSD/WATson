import React from 'react';

import {
  useLocation,
  Navigate,
} from 'react-router-dom';

import Auth from './auth';

// import { User } from '../../data';

interface AuthContextType {
    user: any;
    login: (email: string, password: string, callback: VoidFunction) => void;
    logout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>();

  const login = (email: string, password: string, callback: Function) => Auth.signin(() => {
    setUser(null);
    callback();
  });

  const logout = (callback: Function) => Auth.signout(() => {
    setUser(null);
    callback();
  });

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Redirects the user to the /login page and saves the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
