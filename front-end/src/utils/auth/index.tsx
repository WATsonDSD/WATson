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
  const [user, setUser] = React.useState<any>(null);

  const login = (email: string, password: string, callback: Function) => Auth.login(() => {
    setUser({ email, password }); // Now we have access to the user information anywhere in the app
    callback();
  });

  const logout = (callback: Function) => Auth.logout(() => {
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
  const location = useLocation();
  const auth = useAuth();

  if (!auth.user) {
    // Redirects the user to the login page and saves the current location they were
    // trying to access when they were redirected, whick makes for nicer user experience.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}
