import React from 'react';

import {
  useLocation,
  Navigate,
} from 'react-router-dom';

import { useUserContext } from '../../../data';

export default function Protected({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const userContext = useUserContext();

  if (!userContext) {
    // Redirects the user to the login page and saves the current location they were
    // trying to access when they were redirected, which makes for nicer user experience.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}
