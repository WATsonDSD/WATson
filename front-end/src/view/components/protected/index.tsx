import React from 'react';

import {
  useLocation,
  Navigate,
} from 'react-router-dom';

import { useUserData } from '../../../data';

export default function Protected({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const [user, sessionState] = useUserData();

  if (sessionState === 'pending') {
    return (<div>Loading</div>);
  }

  if (!user) {
    // Redirects the user to the login page and saves the current location they were
    // trying to access when they were redirected, which makes for nicer user experience.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
}
